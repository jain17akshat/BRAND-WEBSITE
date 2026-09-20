/**
 * routes/payments.js
 * ─────────────────────────────────────────────────────────
 * Razorpay payment endpoints:
 *   POST /api/payments/create-order
 *   POST /api/payments/verify
 *   POST /api/payments/refund
 *   POST /api/payments/webhook
 */

const express          = require('express');
const router           = express.Router();
const crypto           = require('crypto');
const { getClient }    = require('../razorpay/client');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../razorpay/verify');
const { mockRazorpayOrder, mockRazorpayVerify, mockRazorpayRefund } = require('../mock/payments');
const validateBody     = require('../middleware/validateBody');
const { AppError }     = require('../middleware/errorHandler');
const requireAdminAuth = require('../middleware/adminAuth');
const config           = require('../config');
const { getProductPrice, validateCoupon } = require('../data/catalog');

// ── POST /api/payments/create-order ───────────────────────
router.post(
  '/create-order',
  validateBody({
    receipt: { type: 'string', required: true },
    cart:    { type: 'array',  required: true },
  }),
  async (req, res, next) => {
    try {
      const { receipt, cart, couponCode, coupon_code, notes = {} } = req.body;

      // Reject invalid characters in receipt identifier
      if (receipt && !/^[a-zA-Z0-9_-]+$/.test(String(receipt).trim())) {
        throw new AppError('Invalid receipt identifier format. Must contain only alphanumeric characters, underscores, or hyphens.', 400, 'INVALID_INPUT');
      }

      // Mandatory non-empty cart validation
      if (!Array.isArray(cart) || cart.length === 0) {
        throw new AppError('Cart is missing or empty. A valid cart is required to create a payment order.', 400, 'INVALID_CART');
      }

      // Server-side calculation of cart total using authoritative catalog
      let authoritativeSubtotal = 0;
      for (const item of cart) {
        if (!item || typeof item !== 'object') {
          throw new AppError('Invalid cart item structure.', 400, 'INVALID_CART_ITEM');
        }

        const rawQty = item.quantity !== undefined ? item.quantity : (item.qty !== undefined ? item.qty : (item.units !== undefined ? item.units : 1));
        const qty = Number(rawQty);
        if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
          throw new AppError(`Invalid item quantity for "${item.name || item.id}": ${rawQty}`, 400, 'VALIDATION_ERROR');
        }

        const price = getProductPrice(item);
        if (typeof price !== 'number' || isNaN(price) || price < 0) {
          throw new AppError(`Unrecognized or invalid product in cart: ${item.id || item.name}`, 400, 'INVALID_PRODUCT');
        }

        authoritativeSubtotal += price * qty;
      }

      if (authoritativeSubtotal <= 0) {
        throw new AppError('Authoritative cart subtotal must be greater than 0.', 400, 'INVALID_AMOUNT');
      }

      // Apply server-validated coupon discount (e.g. WELCOME10)
      const code = couponCode || coupon_code;
      let appliedDiscount = 0;
      if (code) {
        const couponResult = validateCoupon(code, authoritativeSubtotal);
        if (couponResult.valid) {
          appliedDiscount = couponResult.discountAmount;
        }
      }

      // Server-side shipping fee & prepaid online saving
      const shippingFee = (authoritativeSubtotal >= 999 || authoritativeSubtotal === 0) ? 0 : 99;
      const prepaidSaving = 50; // Razorpay orders created via /create-order are online/prepaid
      const authoritativePayable = Math.max(0, authoritativeSubtotal + shippingFee - appliedDiscount - prepaidSaving);
      const amountInPaise = Math.round(authoritativePayable * 100);

      if (req.mock.razorpay) {
        const mockOrder = mockRazorpayOrder(amountInPaise, receipt);
        return res.json({
          success:  true,
          order:    mockOrder,
          key_id:   'rzp_test_MOCK_KEY',
          _mock:    true,
        });
      }

      const razorpay = getClient();
      const order = await razorpay.orders.create({
        amount:   amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          ...notes,
          subtotal: authoritativeSubtotal,
          discount: appliedDiscount,
          coupon: code || '',
        },
      });

      res.json({
        success: true,
        order,
        key_id:  config.razorpay.keyId,
      });
    } catch (err) {
      if (err instanceof AppError) return next(err);
      next(new AppError(
        `Razorpay order creation failed: ${err.message}`,
        502,
        'RAZORPAY_ERROR',
        err.error || null
      ));
    }
  }
);

// ── In-Memory Order Deduplication & Lock Manager (45s TTL + Auto-Cleanup) ──
const recentOrderDedupeMap = new Map();
const DEDUPE_TTL_MS = 45000; // 45 seconds TTL

// Periodic cleanup sweep every 60 seconds to prevent memory leaks & purge expired keys
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of recentOrderDedupeMap.entries()) {
    if (now - entry.createdAt > DEDUPE_TTL_MS) {
      recentOrderDedupeMap.delete(key);
    }
  }
}, 60000).unref();

function getOrderFingerprint(customer, cart, payment_method, razorpay_payment_id) {
  const phone = String(customer?.phone || '').replace(/\D/g, '').slice(-10);
  const email = String(customer?.email || '').trim().toLowerCase();
  const itemsStr = (cart || []).map(i => `${i.id || i.name}_${i.quantity || 1}`).sort().join('|');
  const payId = (razorpay_payment_id && !String(razorpay_payment_id).startsWith('pay_COD_')) ? `_${razorpay_payment_id}` : '';
  return `${phone}_${email}_${payment_method}_${itemsStr}${payId}`;
}

function hashFingerprint(fp) {
  return crypto.createHash('sha256').update(fp).digest('hex').slice(0, 12);
}

// ── POST /api/payments/verify ─────────────────────────────
router.post(
  '/verify',
  validateBody({
    razorpay_order_id:   { type: 'string', required: true },
    razorpay_payment_id: { type: 'string', required: true },
    razorpay_signature:  { type: 'string', required: true },
    cart:                { type: 'array',  required: true },
  }),
  async (req, res, next) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        cart,
        customer,
        payment_method = 'prepaid',
        coupon_code,
        couponCode,
      } = req.body;

      if (razorpay_order_id && !/^[a-zA-Z0-9_-]+$/.test(String(razorpay_order_id).trim())) {
        throw new AppError('Invalid razorpay_order_id format. Must contain only alphanumeric characters, underscores, or hyphens.', 400, 'INVALID_INPUT');
      }

      if (razorpay_payment_id && !/^[a-zA-Z0-9_-]+$/.test(String(razorpay_payment_id).trim())) {
        throw new AppError('Invalid razorpay_payment_id format. Must contain only alphanumeric characters, underscores, or hyphens.', 400, 'INVALID_INPUT');
      }

      const isCOD = String(payment_method).toLowerCase() === 'cod';
      const shiprocketPaymentMethod = isCOD ? 'COD' : 'Prepaid';

      // 1. Mandatory non-empty cart validation
      if (!Array.isArray(cart) || cart.length === 0) {
        throw new AppError('Cart is missing or empty. Cannot verify payment.', 400, 'INVALID_CART');
      }

      // 2. Authoritative price & subtotal calculation from server-side catalog
      let verifiedSubtotal = 0;
      const sanitizedCart = [];
      for (const item of cart) {
        if (!item || typeof item !== 'object') {
          throw new AppError('Invalid cart item structure.', 400, 'INVALID_CART_ITEM');
        }

        const rawQty = item.quantity !== undefined ? item.quantity : (item.qty !== undefined ? item.qty : (item.units !== undefined ? item.units : 1));
        const qty = Number(rawQty);
        if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
          throw new AppError(`Invalid item quantity for "${item.name || item.id}": ${rawQty}`, 400, 'VALIDATION_ERROR');
        }

        const authoritativePrice = getProductPrice(item);
        if (typeof authoritativePrice !== 'number' || isNaN(authoritativePrice) || authoritativePrice < 0) {
          throw new AppError(`Unrecognized or invalid product in cart: ${item.id || item.name}`, 400, 'INVALID_PRODUCT');
        }

        const enrichedItem = require('../data/catalog').enrichCartItemWithTax(item, customer?.state);

        sanitizedCart.push(enrichedItem);

        verifiedSubtotal += enrichedItem.total_item_amount;
      }

      // 3. Server-side coupon validation (e.g. WELCOME10)
      const code = couponCode || coupon_code;
      let verifiedDiscount = 0;
      if (code) {
        const couponResult = validateCoupon(code, verifiedSubtotal);
        if (couponResult.valid) {
          verifiedDiscount = couponResult.discountAmount;
        }
      }

      // Server-side shipping fee & prepaid online saving
      const shippingFee = (verifiedSubtotal >= 999 || verifiedSubtotal === 0) ? 0 : 99;
      const prepaidSaving = isCOD ? 0 : 50;
      const authoritativePayable = Math.max(0, verifiedSubtotal + shippingFee - verifiedDiscount - prepaidSaving);
      const expectedAmountInPaise = Math.round(authoritativePayable * 100);

      // 4. VERIFY PAYMENT SIGNATURE (HMAC SHA-256)
      const shouldVerifySignature = !isCOD && (config.isProd || !req.mock.razorpay);
      if (shouldVerifySignature) {
        const { valid, reason } = verifyPaymentSignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );

        if (!valid) {
          throw new AppError(
            `Payment verification failed: ${reason}`,
            400,
            'SIGNATURE_MISMATCH'
          );
        }

        // 5. FETCH & VERIFY RAZORPAY TRANSACTION WITH SERVER CREDENTIALS
        const razorpay = getClient();
        try {
          const fetchedPayment = await razorpay.payments.fetch(razorpay_payment_id);
          if (!fetchedPayment) {
            throw new AppError('Payment record not found on Razorpay.', 400, 'PAYMENT_NOT_FOUND');
          }

          // Check payment belongs to this Razorpay order ID
          if (fetchedPayment.order_id && fetchedPayment.order_id !== razorpay_order_id) {
            throw new AppError(`Payment order ID mismatch. Payment ${razorpay_payment_id} belongs to order ${fetchedPayment.order_id}, not ${razorpay_order_id}.`, 400, 'ORDER_MISMATCH');
          }

          // Check payment status is valid
          if (fetchedPayment.status !== 'captured' && fetchedPayment.status !== 'authorized') {
            throw new AppError(`Payment status is invalid: ${fetchedPayment.status}`, 400, 'INVALID_PAYMENT_STATUS');
          }

          // Check paid amount matches server-authoritative payable amount
          if (Number(fetchedPayment.amount) !== expectedAmountInPaise) {
            throw new AppError(`Paid amount mismatch. Expected ₹${authoritativePayable} (${expectedAmountInPaise} paise), got ₹${fetchedPayment.amount / 100} (${fetchedPayment.amount} paise).`, 400, 'AMOUNT_MISMATCH');
          }
        } catch (rzpErr) {
          if (rzpErr instanceof AppError) throw rzpErr;
          throw new AppError(`Razorpay payment verification failed: ${rzpErr.message}`, 400, 'RAZORPAY_VERIFICATION_FAILED');
        }
      }

      // Mock Mode Checks for testing
      if (!isCOD && req.mock.razorpay) {
        if (razorpay_payment_id.includes('FAILED') || razorpay_payment_id.includes('INVALID')) {
          throw new AppError('Mock payment status is invalid or failed.', 400, 'INVALID_PAYMENT_STATUS');
        }
        if (razorpay_payment_id.includes('MISMATCH_ORDER')) {
          throw new AppError('Payment order ID mismatch.', 400, 'ORDER_MISMATCH');
        }
        if (razorpay_payment_id.includes('MISMATCH_AMOUNT')) {
          throw new AppError('Paid amount mismatch.', 400, 'AMOUNT_MISMATCH');
        }
      }

      // 6. RESERVE DEDUPLICATION LOCK BEFORE SIDE EFFECTS
      const fingerprint = getOrderFingerprint(customer, sanitizedCart, shiprocketPaymentMethod, razorpay_payment_id);
      const fpHash = hashFingerprint(fingerprint);
      const now = Date.now();
      const existingEntry = recentOrderDedupeMap.get(fingerprint);

      if (existingEntry) {
        if (existingEntry.status === 'PROCESSING' && (now - existingEntry.createdAt < DEDUPE_TTL_MS)) {
          console.warn(`⏳ Concurrent duplicate order request detected [Hash: ${fpHash}]. Awaiting in-flight execution...`);
          try {
            const completedResponse = await existingEntry.promise;
            return res.json(completedResponse);
          } catch (prevErr) {
            recentOrderDedupeMap.delete(fingerprint);
          }
        } else if (existingEntry.status === 'COMPLETED' && (now - existingEntry.createdAt < DEDUPE_TTL_MS)) {
          console.warn(`⚠️ Duplicate order attempt blocked [Hash: ${fpHash}]. Returning cached response.`);
          return res.json(existingEntry.response);
        }
      }

      let resolvePromise, rejectPromise;
      const dedupePromise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });
      dedupePromise.catch(() => {});

      recentOrderDedupeMap.set(fingerprint, {
        status: 'PROCESSING',
        createdAt: now,
        promise: dedupePromise,
      });

      try {
        const internalOrderId = `SHR${Math.floor(100000 + Math.random() * 900000)}`;
        const totalAmount = authoritativePayable;

        // Deduct inventory atomically (fails with 409 OUT_OF_STOCK if insufficient)
        const { deductInventoryForCart } = require('../data/catalog');
        await deductInventoryForCart(sanitizedCart);

        // ────────────────────────────────────────────────────────────
        // INVOICE STRATEGY:
        // Prepaid → Generate invoice immediately after successful /verify.
        //           Payment has already been verified through Razorpay.
        //
        // COD → Do not generate invoice at order placement.
        //       Generate invoice only after confirmed delivery/payment collection.
        //
        // Razorpay webhook → Safety net for prepaid invoices if /verify
        //                    completed payment verification but invoice creation
        //                    failed or was interrupted.
        // ────────────────────────────────────────────────────────────
        let invoiceNumber = null;
        let invoiceDate = null;
        let invoiceDocumentReady = false;

        if (!isCOD) {
          // PREPAID: Generate invoice immediately — payment is already verified above.
          try {
            const { getOrAssignInvoiceNumberAtomic } = require('../database/db');
            const invoiceResult = await getOrAssignInvoiceNumberAtomic(internalOrderId);
            invoiceNumber = invoiceResult.invoiceNumber;
            invoiceDate = invoiceResult.invoiceDate;

            // Check if the PDF already exists on disk (handles isNew === false
            // where a previous attempt already generated the document).
            const { getInvoicePath, generateAndSaveInvoice } = require('../services/invoiceService');
            const existingPdf = getInvoicePath(internalOrderId);

            if (existingPdf) {
              // Invoice number AND document both exist — fully ready.
              invoiceDocumentReady = true;
              console.log(`📄 Invoice already complete for ${internalOrderId}: ${invoiceNumber}`);
            } else {
              // Invoice number assigned but PDF missing (first attempt, or previous PDF failure).
              await generateAndSaveInvoice({
                order_id: internalOrderId,
                customer_name: customer?.name || 'Valued Customer',
                customer_email: customer?.email,
                customer_phone: customer?.phone,
                payment_method: shiprocketPaymentMethod,
                shipping_address: `${customer?.address || ''}, ${customer?.city || ''}, ${customer?.state || ''} - ${customer?.pincode || ''}`,
                state: customer?.state,
                items: sanitizedCart,
              }, invoiceNumber);
              invoiceDocumentReady = true;
              console.log(`📄 Prepaid Invoice generated & saved for ${internalOrderId}: ${invoiceNumber}`);
            }
          } catch (invErr) {
            console.error(`⚠️ Failed to generate prepaid invoice for ${internalOrderId}:`, invErr.message);
            // Payment is still valid. invoiceDocumentReady remains false.
            // Webhook safety net will detect the missing PDF and retry.
          }
        }
        // COD: No invoice at placement. Invoice generated after delivery/payment collection.

        console.log(`✅ Order verified (${shiprocketPaymentMethod}) & Confirmation Email triggered:`, {
          razorpay_order_id,
          razorpay_payment_id,
          internalOrderId,
          invoiceNumber: invoiceNumber || (isCOD ? 'DEFERRED_TO_DELIVERY' : 'DEFERRED_TO_WEBHOOK'),
          invoiceDocumentReady,
          customer: customer?.name,
        });

        let srOrderId = null;
        let srShipmentId = null;
        let shiprocketSyncStatus = req.mock.shiprocket ? 'SKIPPED' : 'PENDING';

        if (!req.mock.shiprocket && sanitizedCart && customer) {
          try {
            const srClient = require('../shiprocket/client');
            const { getValidPickupLocation } = require('../shiprocket/pickup');
            const pickupLoc = await getValidPickupLocation();

            const cleanPhone = String(customer.phone || '9876543210').replace(/\D/g, '').slice(-10) || '9876543210';
            const nameParts  = String(customer.name || 'Valued Customer').trim().split(' ');
            const firstName  = nameParts[0] || 'Valued';
            const lastName   = nameParts.slice(1).join(' ') || 'Customer';
            const address    = customer.address || '402 Green Glen Heights';
            const city       = customer.city || 'Bengaluru';
            const pincode    = String(customer.pincode || '560102').replace(/\D/g, '') || '560102';
            const state      = customer.state || 'Karnataka';
            const email      = customer.email || 'customer@example.com';

            const srPayload = {
              order_id:               internalOrderId,
              order_date:             new Date().toISOString().split('T')[0],
              pickup_location:        pickupLoc,
              channel_id:             config.shiprocket.channelId || '',
              comment:                'SacredLiving Order',
              billing_customer_name:  firstName,
              billing_last_name:      lastName,
              billing_address:        address,
              billing_city:           city,
              billing_pincode:        pincode,
              billing_state:          state,
              billing_country:        'India',
              billing_email:          email,
              billing_phone:          cleanPhone,
              shipping_is_billing:    true,
              shipping_customer_name: firstName,
              shipping_last_name:     lastName,
              shipping_address:       address,
              shipping_city:          city,
              shipping_pincode:       pincode,
              shipping_state:         state,
              shipping_country:       'India',
              shipping_email:         email,
              shipping_phone:         cleanPhone,
              order_items: sanitizedCart.map(item => ({
                name:          item.name || 'Sacred Product',
                sku:           String(item.id || 'SKU-ITEM').slice(0, 30),
                units:         item.quantity || 1,
                selling_price: item.price || 0,
                discount:      0,
                tax:           0,
              })),
              payment_method:       shiprocketPaymentMethod,
              shipping_charges:     0,
              giftwrap_charges:     0,
              transaction_charges:  0,
              total_discount:       verifiedDiscount,
              sub_total:            verifiedSubtotal,
              length: 10, breadth: 10, height: 10, weight: 0.5,
            };

            const srRes = await srClient.post('/orders/create/adhoc', srPayload);
            srOrderId = srRes.data?.order_id ? String(srRes.data.order_id) : null;
            srShipmentId = srRes.data?.shipment_id ? String(srRes.data.shipment_id) : null;
            shiprocketSyncStatus = 'SUCCESS';
          } catch (srErr) {
            shiprocketSyncStatus = 'FAILED';
            console.error('⚠️ Shiprocket push failed for order', internalOrderId, ':', srErr.response?.data || srErr.message);
          }
        }

        const { addOrder } = require('../services/orderStore');
        await addOrder({
          order_id: internalOrderId,
          customer_name: customer?.name,
          customer_email: customer?.email,
          customer_phone: customer?.phone,
          total_amount: totalAmount,
          payment_method: shiprocketPaymentMethod,
          payment_status: isCOD ? 'COD_PENDING' : 'PAID',
          shipping_address: `${customer?.address || ''}, ${customer?.city || ''}, ${customer?.state || ''} - ${customer?.pincode || ''}`,
          city: customer?.city,
          state: customer?.state,
          pincode: customer?.pincode,
          items: sanitizedCart,
          shiprocket_order_id: srOrderId,
          shipment_id: srShipmentId,
          shiprocket_sync_status: shiprocketSyncStatus,
          inventory_deducted: true,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          // Email is only PENDING when invoice document is confirmed saved to disk
          customer_email_status: (invoiceDocumentReady) ? 'PENDING' : 'NONE',
          business_email_status: (invoiceDocumentReady) ? 'PENDING' : 'NONE',
        });

        // Trigger email queue only when invoice document is confirmed ready
        if (invoiceDocumentReady) {
          const emailQueue = require('../services/emailQueue');
          emailQueue.triggerImmediate(internalOrderId);
        }

        const sanitizedResponse = {
          success:             true,
          internal_order_id:   internalOrderId,
          razorpay_order_id:   razorpay_order_id || null,
          payment_id:          razorpay_payment_id || null,
          shiprocket_order_id: srOrderId,
          shipment_id:        srShipmentId,
          shiprocket_sync_status: shiprocketSyncStatus,
          _mock:               !!req.mock.razorpay,
        };

        recentOrderDedupeMap.set(fingerprint, {
          status: 'COMPLETED',
          createdAt: now,
          response: sanitizedResponse,
        });

        resolvePromise(sanitizedResponse);
        return res.json(sanitizedResponse);
      } catch (execErr) {
        recentOrderDedupeMap.delete(fingerprint);
        rejectPromise(execErr);
        throw execErr;
      }
    } catch (err) {
      if (err instanceof AppError) return next(err);
      next(new AppError(err.message, 500, 'INTERNAL_ERROR'));
    }
  }
);

// ── POST /api/payments/refund (Admin ONLY) ─────────────────
router.post(
  '/refund',
  requireAdminAuth,
  validateBody({
    payment_id: { type: 'string', required: true },
    amount:     { type: 'number', required: true, min: 1 },
  }),
  async (req, res, next) => {
    try {
      const { payment_id, amount, reason = 'Customer requested refund', order_id = null } = req.body;
      const amountInPaise = Math.round(amount * 100);

      const { findOrderById, markOrderRefunded } = require('../services/orderStore');
      const { saveRefundRecord } = require('../database/db');
      const { generateAndSaveCreditNote } = require('../services/creditNoteService');
      const { postCreditNoteLedger } = require('../services/gstLedgerService');
      const { logEvent } = require('../services/auditLogService');

      let targetOrder = null;
      if (order_id) {
        targetOrder = await findOrderById(order_id);
      }

      const internalRefundId = `RFND_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      let razorpayRefundId = null;
      let mockResult = false;

      if (req.mock.razorpay) {
        const m = mockRazorpayRefund(payment_id, amountInPaise);
        razorpayRefundId = m.id;
        mockResult = true;
      } else {
        const razorpay = getClient();
        const rzpRefund = await razorpay.payments.refund(payment_id, {
          amount: amountInPaise,
          notes:  { reason, order_id: order_id || '' },
        });
        razorpayRefundId = rzpRefund.id;
      }

      // Persist Refund Record
      await saveRefundRecord({
        refund_id: internalRefundId,
        order_id: order_id || targetOrder?.order_id || 'UNKNOWN',
        amount,
        currency: 'INR',
        status: 'PROCESSED',
        payment_method: 'Prepaid',
        razorpay_payment_id: payment_id,
        razorpay_refund_id: razorpayRefundId,
        reason,
        completed_at: new Date().toISOString()
      });

      if (targetOrder) {
        await markOrderRefunded(targetOrder.order_id, { refund_id: razorpayRefundId });
      }

      // ──────────────────────────────────────────────────────────
      // INVOICE / CREDIT NOTE SAFETY CHECK:
      // If the order has an existing invoice_number:
      //   - The original invoice remains 100% IMMUTABLE.
      //   - Issue a separate Credit Note (CN/FY/XXXXX).
      //   - Post CREDIT_NOTE transaction to GST ledger.
      //
      // If cancelled/refunded BEFORE invoice generation:
      //   - NO invoice generated.
      //   - NO GST SALE or CREDIT_NOTE ledger entry created.
      // ──────────────────────────────────────────────────────────
      let creditNoteResult = null;
      if (targetOrder && targetOrder.invoice_number) {
        try {
          const itemsToReverse = targetOrder.items || [];
          const cnRes = await generateAndSaveCreditNote({
            order: targetOrder,
            originalInvoiceNumber: targetOrder.invoice_number,
            originalInvoiceDate: targetOrder.invoice_date,
            returnedItems: itemsToReverse,
            reason,
            refundId: razorpayRefundId || internalRefundId
          });

          await postCreditNoteLedger(cnRes.cnData);
          creditNoteResult = cnRes.cnData;
          console.log(`📄 Credit Note generated for refunded order ${targetOrder.order_id}: ${cnRes.cnData.credit_note_number}`);
        } catch (cnErr) {
          console.error(`⚠️ Failed to generate Credit Note during refund for ${targetOrder.order_id}:`, cnErr.message);
        }
      }

      await logEvent({
        eventType: 'REFUND_COMPLETED',
        entityType: 'REFUND',
        entityId: razorpayRefundId || internalRefundId,
        orderId: order_id || targetOrder?.order_id,
        invoiceNumber: targetOrder?.invoice_number,
        creditNoteNumber: creditNoteResult?.credit_note_number,
        metadata: { amount, payment_id, razorpay_refund_id: razorpayRefundId, reason }
      });

      // Send branded refund email trigger if email present
      if (req.body.email || targetOrder?.customer_email) {
        const { sendRefundConfirmationEmail } = require('../services/emailService');
        sendRefundConfirmationEmail({
          to: req.body.email || targetOrder.customer_email,
          customerName: req.body.customerName || targetOrder?.customer_name || 'Valued Customer',
          refundId: razorpayRefundId || internalRefundId,
          paymentId: payment_id,
          amount,
          reason,
        }).catch(err => console.error('Failed to send refund email:', err));
      }

      res.json({
        success: true,
        refund_id: internalRefundId,
        razorpay_refund_id: razorpayRefundId,
        credit_note: creditNoteResult ? {
          credit_note_number: creditNoteResult.credit_note_number,
          total_amount: creditNoteResult.total_amount,
          pdf_path: creditNoteResult.pdf_path
        } : null,
        _mock: mockResult
      });
    } catch (err) {
      next(new AppError(
        `Refund initiation failed: ${err.message}`,
        502,
        'RAZORPAY_ERROR',
        err.error || null
      ));
    }
  }
);

// ── POST /api/payments/webhook ────────────────────────────
router.post('/webhook', async (req, res, next) => {
  try {
    const signature  = req.headers['x-razorpay-signature'];
    const rawPayload = req.rawBody;

    // Require webhook secret and signature verification in production
    if (config.isProd && (!config.razorpay.webhookSecret || !signature)) {
      console.warn('⛔ Rejected unsigned Razorpay Webhook attempt in production.');
      return res.status(401).json({ received: false, error: 'Webhook secret or signature missing' });
    }

    if (config.razorpay.webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawPayload, signature);
      if (!isValid) {
        return res.status(400).json({ received: false, error: 'Invalid signature' });
      }
    }

    // Parse req.rawBody into JSON payload
    let parsedBody = {};
    try {
      if (typeof rawPayload === 'string') {
        parsedBody = JSON.parse(rawPayload);
      } else if (Buffer.isBuffer(rawPayload)) {
        parsedBody = JSON.parse(rawPayload.toString('utf8'));
      } else if (req.body && typeof req.body === 'object') {
        parsedBody = req.body;
      }
    } catch (parseErr) {
      console.error('⚠️ Failed to parse Razorpay webhook raw body:', parseErr.message);
    }

    const event = parsedBody?.event;
    const payload = parsedBody?.payload;

    console.log(`📨 Razorpay Webhook parsed event: [${event}]`);

    const { markOrderPaid, markOrderPaymentFailed, markOrderRefunded } = require('../services/orderStore');

    switch (event) {
      case 'payment.captured': {
        const paymentEntity = payload?.payment?.entity || {};
        const razorpayOrderId = paymentEntity.order_id;
        const internalOrderId = paymentEntity.notes?.order_id || paymentEntity.notes?.internal_order_id || razorpayOrderId;
        console.log('  → Payment captured:', paymentEntity.id, 'Order:', internalOrderId);
        if (internalOrderId) {
          await markOrderPaid(internalOrderId, { payment_id: paymentEntity.id });

          // ── PREPAID INVOICE SAFETY NET ──
          // The primary invoice is generated at /verify. This webhook acts
          // as a safety net for two scenarios:
          //   (A) /verify assigned an invoice number but PDF generation failed.
          //   (B) /verify failed entirely (no invoice number assigned).
          // In both cases the webhook completes the missing work.
          try {
            const { findOrderById } = require('../services/orderStore');
            const order = await findOrderById(internalOrderId);

            if (order) {
              // Skip COD orders — COD invoices are generated after delivery
              if (String(order.payment_method).toUpperCase() === 'COD') {
                console.log(`  → Skipping invoice for COD order ${internalOrderId} (deferred to delivery)`);
              } else {
                const { getOrAssignInvoiceNumberAtomic } = require('../database/db');
                const { getInvoicePath, generateAndSaveInvoice } = require('../services/invoiceService');
                const { invoiceNumber, invoiceDate, isNew } = await getOrAssignInvoiceNumberAtomic(internalOrderId);

                // Check document-level readiness: does the PDF actually exist on disk?
                const existingPdf = getInvoicePath(internalOrderId);

                if (existingPdf) {
                  // Case A: Invoice number AND document both exist — fully complete.
                  console.log(`  → Invoice fully complete for ${internalOrderId}: ${invoiceNumber} (webhook skipping)`);
                } else {
                  // Case B (isNew) or Case C (!isNew but PDF missing): generate the document.
                  let orderItems = order.items_raw || order.items;
                  if (typeof orderItems === 'string') {
                    try { orderItems = JSON.parse(orderItems); } catch { orderItems = []; }
                  }

                  await generateAndSaveInvoice({
                    order_id: order.order_id || internalOrderId,
                    customer_name: order.customer_name || 'Valued Customer',
                    customer_email: order.customer_email,
                    customer_phone: order.customer_phone,
                    payment_method: order.payment_method || 'Prepaid',
                    shipping_address: order.shipping_address || '',
                    state: order.state || order.shipping_address?.split(',').pop()?.trim() || '',
                    items: orderItems,
                  }, invoiceNumber);

                  console.log(`📄 [SAFETY NET] Prepaid Invoice generated via webhook for ${internalOrderId}: ${invoiceNumber} (isNew=${isNew})`);

                  // Persist invoice details if this was a new invoice number
                  if (isNew) {
                    const { updateOrderInvoice } = require('../services/orderStore');
                    await updateOrderInvoice(internalOrderId, invoiceNumber, invoiceDate);
                  }

                  // Only set email to PENDING atomically if not already queued/sent
                  const { markEmailPendingAtomic } = require('../services/orderStore');
                  await markEmailPendingAtomic(internalOrderId, 'customer');
                  await markEmailPendingAtomic(internalOrderId, 'business');

                  const emailQueue = require('../services/emailQueue');
                  emailQueue.triggerImmediate(internalOrderId);
                }
              }
            }
          } catch (invErr) {
            console.error(`⚠️ Webhook invoice safety-net failed for ${internalOrderId}:`, invErr.message);
            // The order is still marked PAID; invoice can be regenerated manually
          }
        }
        break;
      }
      case 'payment.failed': {
        const paymentEntity = payload?.payment?.entity || {};
        const razorpayOrderId = paymentEntity.order_id;
        const internalOrderId = paymentEntity.notes?.order_id || paymentEntity.notes?.internal_order_id || razorpayOrderId;
        console.log('  → Payment failed:', paymentEntity.id, 'Order:', internalOrderId);
        if (internalOrderId) {
          await markOrderPaymentFailed(internalOrderId, { payment_id: paymentEntity.id });
        }
        break;
      }
      case 'refund.processed': {
        const refundEntity = payload?.refund?.entity || {};
        const paymentEntity = payload?.payment?.entity || {};
        const internalOrderId = refundEntity.notes?.order_id || paymentEntity.notes?.order_id || refundEntity.payment_id;
        console.log('  → Refund processed:', refundEntity.id, 'Order/Payment:', internalOrderId);
        if (internalOrderId) {
          await markOrderRefunded(internalOrderId, { refund_id: refundEntity.id });
        }
        break;
      }
      default:
        console.log('  → Unhandled event:', event);
    }

    // Always respond 200 immediately to Razorpay to prevent webhook retries
    res.json({ received: true });
  } catch (err) {
    console.error('❌ Error handling Razorpay webhook:', err.message);
    res.json({ received: true, error: err.message });
  }
});

module.exports = router;
