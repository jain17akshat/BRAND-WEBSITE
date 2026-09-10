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
const { getClient } = require('../razorpay/client');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../razorpay/verify');
const { mockRazorpayOrder, mockRazorpayVerify, mockRazorpayRefund } = require('../mock/payments');
const validateBody  = require('../middleware/validateBody');
const { AppError }  = require('../middleware/errorHandler');
const config        = require('../config');

// ── POST /api/payments/create-order ───────────────────────
router.post(
  '/create-order',
  validateBody({
    amount:  { type: 'number', required: true, min: 1 },
    receipt: { type: 'string', required: true },
  }),
  async (req, res, next) => {
    try {
      const { amount, receipt, notes = {} } = req.body;

      // Amount must be in paise (Razorpay convention)
      const amountInPaise = Math.round(amount * 100);

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

      if (!req.mock.razorpay && !isCOD) {
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

      // Generate internal order ID
      const internalOrderId = `SHR${Math.floor(100000 + Math.random() * 900000)}`;
      const totalAmount = (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0);

      // Send instant order confirmation email (Zero-Cost Notification)
      if (customer?.email) {
        const { sendOrderConfirmationEmail } = require('../services/emailService');
        sendOrderConfirmationEmail({
          to: customer.email,
          customerName: customer.name || 'Valued Customer',
          orderId: internalOrderId,
          items: cart || [],
          totalAmount,
          shippingAddress: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`,
          phone: customer.phone || '7742320607',
          paymentMethod: shiprocketPaymentMethod,
        }).catch(err => console.error('Failed to send confirmation email:', err));
      }

      console.log(`✅ Order verified (${shiprocketPaymentMethod}) & Confirmation Email triggered:`, {
        razorpay_order_id,
        razorpay_payment_id,
        internalOrderId,
        customer: customer?.name,
      });

      // Register order into OrderStore (in-memory + MySQL DB)
      const { addOrder } = require('../services/orderStore');
      addOrder({
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
      });

      // Auto-push order to Shiprocket if in live/configured mode
      let shiprocketData = null;
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
          shiprocketData = srRes.data;
          console.log(`✅ ${shiprocketPaymentMethod} Order pushed to Shiprocket:`, internalOrderId, 'Shiprocket Order ID:', srRes.data?.order_id);
        } catch (srErr) {
          console.error('⚠️ Shiprocket push failed:', srErr.response?.data || srErr.message);
        }
      }

      res.json({
        success:           true,
        internal_order_id: internalOrderId,
        razorpay_order_id,
        payment_id:        razorpay_payment_id,
        shiprocket:        shiprocketData,
        _mock:             req.mock.razorpay,
      });
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
router.post('/webhook', (req, res, next) => {
  try {
    const signature  = req.headers['x-razorpay-signature'];
    const rawPayload = req.rawBody;

    // Skip verification if no webhook secret (dev/mock)
    if (config.razorpay.webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawPayload, signature);
      if (!isValid) {
        return res.status(400).json({ received: false, error: 'Invalid signature' });
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    console.log(`📨 Razorpay Webhook: ${event}`);

    switch (event) {
      case 'payment.captured':
        console.log('  → Payment captured:', payload?.payment?.entity?.id);
        break;
      case 'payment.failed':
        console.log('  → Payment failed:', payload?.payment?.entity?.id);
        break;
      case 'refund.processed':
        console.log('  → Refund processed:', payload?.refund?.entity?.id);
        break;
      default:
        console.log('  → Unhandled event:', event);
    }

    // Always respond 200 immediately to Razorpay
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
