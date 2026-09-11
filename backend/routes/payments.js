/**
 * routes/payments.js
 * ─────────────────────────────────────────────────────────
 * Razorpay payment endpoints:
 *   POST /api/payments/create-order
 *   POST /api/payments/verify
 *   POST /api/payments/refund
 *   POST /api/payments/webhook
 */

const express       = require('express');
const router        = express.Router();
const crypto        = require('crypto');
const { getClient } = require('../razorpay/client');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../razorpay/verify');
const { mockRazorpayOrder, mockRazorpayVerify, mockRazorpayRefund } = require('../mock/payments');
const validateBody  = require('../middleware/validateBody');
const { AppError }  = require('../middleware/errorHandler');
const config        = require('../config');
const { getProductPrice } = require('../data/catalog');

// ── POST /api/payments/create-order ───────────────────────
router.post(
  '/create-order',
  validateBody({
    amount:  { type: 'number', required: true, min: 1 },
    receipt: { type: 'string', required: true },
  }),
  async (req, res, next) => {
    try {
      const { amount, receipt, cart, notes = {} } = req.body;

      // Server-side calculation of cart total using authoritative catalog
      let finalAmount = amount;
      if (Array.isArray(cart) && cart.length > 0) {
        const calculatedTotal = cart.reduce((sum, item) => {
          const price = getProductPrice(item);
          const qty = Number(item.quantity || item.qty || 1);
          return sum + (price * qty);
        }, 0);

        if (calculatedTotal > 0) {
          finalAmount = calculatedTotal;
        }
      }

      // Amount must be in paise (Razorpay convention)
      const amountInPaise = Math.round(finalAmount * 100);

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
        notes,
      });

      res.json({
        success: true,
        order,
        key_id:  config.razorpay.keyId,
      });
    } catch (err) {
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
      } = req.body;

      const isCOD = String(payment_method).toLowerCase() === 'cod';
      const shiprocketPaymentMethod = isCOD ? 'COD' : 'Prepaid';

      // Enforce server-side price integrity against authoritative catalog
      if (Array.isArray(cart) && cart.length > 0) {
        for (const item of cart) {
          const authoritativePrice = getProductPrice(item);
          const submittedPrice = item.price !== undefined && item.price !== null ? Number(item.price) : null;
          if (submittedPrice === null || isNaN(submittedPrice) || submittedPrice !== Number(authoritativePrice)) {
            throw new AppError(
              `Price mismatch for product "${item.name || item.id}". Expected ₹${authoritativePrice}, got ₹${item.price}.`,
              400,
              'PRICE_TAMPERING'
            );
          }
        }
      }

      // 1. VALIDATE PAYMENT SIGNATURE FIRST (Never bypass verification in production)
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
      }

      // 2. RESERVE DEDUPLICATION LOCK BEFORE SIDE EFFECTS
      const fingerprint = getOrderFingerprint(customer, cart, shiprocketPaymentMethod, razorpay_payment_id);
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
          console.warn(`⚠️ Duplicate order attempt blocked [Hash: ${fpHash}]. Returning redacted cached response.`);
          return res.json(existingEntry.response);
        }
      }

      let resolvePromise, rejectPromise;
      const dedupePromise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });

      // Attach a no-op rejection handler to prevent UnhandledPromiseRejection warnings
      dedupePromise.catch(() => {});

      // Synchronously lock fingerprint in memory BEFORE sending email, saving DB, or calling Shiprocket API
      recentOrderDedupeMap.set(fingerprint, {
        status: 'PROCESSING',
        createdAt: now,
        promise: dedupePromise,
      });

      try {
        // Generate internal order ID & total amount
        const internalOrderId = `SHR${Math.floor(100000 + Math.random() * 900000)}`;
        const totalAmount = (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0);

        // Send instant email notification (Prepaid Payment Received for online, Order Confirmed for COD)
        if (customer?.email) {
          const { sendOrderConfirmationEmail, sendPrepaidPaymentReceivedEmail } = require('../services/emailService');
          if (isCOD) {
            sendOrderConfirmationEmail({
              to: customer.email,
              customerName: customer.name || 'Valued Customer',
              orderId: internalOrderId,
              items: cart || [],
              totalAmount,
              shippingAddress: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`,
              phone: customer.phone || '7742320607',
              paymentMethod: 'Cash on Delivery (COD)',
            }).catch(err => console.error('Failed to send COD confirmation email:', err));
          } else {
            sendPrepaidPaymentReceivedEmail({
              to: customer.email,
              customerName: customer.name || 'Valued Customer',
              orderId: internalOrderId,
              paymentId: razorpay_payment_id,
              items: cart || [],
              totalAmount,
              shippingAddress: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`,
              phone: customer.phone || '7742320607',
            }).catch(err => console.error('Failed to send prepaid payment received email:', err));
          }
        }

        console.log(`✅ Order verified (${shiprocketPaymentMethod}) & Confirmation Email triggered:`, {
          razorpay_order_id,
          razorpay_payment_id,
          internalOrderId,
          customer: customer?.name,
        });

        // Auto-push order to Shiprocket if in live/configured mode
        let srOrderId = null;
        let srShipmentId = null;
        let shiprocketSyncStatus = req.mock.shiprocket ? 'SKIPPED' : 'PENDING';

        if (!req.mock.shiprocket && cart && customer) {
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
              billing_address_2:      '',
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
              shipping_address_2:     '',
              shipping_city:          city,
              shipping_pincode:       pincode,
              shipping_state:         state,
              shipping_country:       'India',
              shipping_email:         email,
              shipping_phone:         cleanPhone,
              order_items: (cart || []).map(item => ({
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
              total_discount:       0,
              sub_total:            (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0),
              length: 10, breadth: 10, height: 10, weight: 0.5,
            };

            const srRes = await srClient.post('/orders/create/adhoc', srPayload);
            srOrderId = srRes.data?.order_id ? String(srRes.data.order_id) : null;
            srShipmentId = srRes.data?.shipment_id ? String(srRes.data.shipment_id) : null;
            shiprocketSyncStatus = 'SUCCESS';
            console.log(`✅ ${shiprocketPaymentMethod} Order pushed to Shiprocket:`, internalOrderId, 'Shiprocket Order ID:', srOrderId, 'Shipment ID:', srShipmentId);
          } catch (srErr) {
            shiprocketSyncStatus = 'FAILED';
            console.error('⚠️ Shiprocket push failed for order', internalOrderId, ':', srErr.response?.data || srErr.message);
          }
        }

        // Register order into OrderStore (in-memory + MySQL DB)
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
          items: cart,
          shiprocket_order_id: srOrderId,
          shipment_id: srShipmentId,
          shiprocket_sync_status: shiprocketSyncStatus,
        });

        // 3. REDACT & SANITIZE DEDUPLICATION DATA
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

        // Complete the lock with sanitized response
        recentOrderDedupeMap.set(fingerprint, {
          status: 'COMPLETED',
          createdAt: now,
          response: sanitizedResponse,
        });

        resolvePromise(sanitizedResponse);
        return res.json(sanitizedResponse);

      } catch (execErr) {
        // If order execution failed, release deduplication key so user can retry!
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

// ── POST /api/payments/refund ─────────────────────────────
router.post(
  '/refund',
  validateBody({
    payment_id: { type: 'string', required: true },
    amount:     { type: 'number', required: true, min: 1 },
  }),
  async (req, res, next) => {
    try {
      const { payment_id, amount, reason = 'Customer requested refund' } = req.body;
      const amountInPaise = Math.round(amount * 100);

      if (req.mock.razorpay) {
        return res.json({
          success: true,
          refund:  mockRazorpayRefund(payment_id, amountInPaise),
          _mock:   true,
        });
      }

      const razorpay = getClient();
      const refund = await razorpay.payments.refund(payment_id, {
        amount: amountInPaise,
        notes:  { reason },
      });

      // Send branded refund email trigger if email present
      if (req.body.email) {
        const { sendRefundConfirmationEmail } = require('../services/emailService');
        sendRefundConfirmationEmail({
          to: req.body.email,
          customerName: req.body.customerName || 'Valued Customer',
          refundId: refund.id || `rfnd_${Date.now()}`,
          paymentId: payment_id,
          amount,
          reason,
        }).catch(err => console.error('Failed to send refund email:', err));
      }

      res.json({ success: true, refund });
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
