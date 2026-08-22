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
      } = req.body;

      if (req.mock.razorpay) {
        const result = mockRazorpayVerify(razorpay_order_id);
        return res.json({ success: true, ...result });
      }

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

      // Generate internal order ID
      const internalOrderId = `SHR${Math.floor(100000 + Math.random() * 900000)}`;

      // Send instant order confirmation email (Zero-Cost Notification)
      if (customer?.email) {
        const { sendOrderConfirmationEmail } = require('../services/emailService');
        sendOrderConfirmationEmail({
          to: customer.email,
          customerName: customer.name,
          orderId: internalOrderId,
          items: cart || [],
          totalAmount: (cart || []).reduce((s, i) => s + (i.price * (i.quantity || 1)), 0),
          shippingAddress: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`,
        }).catch(err => console.error('Failed to send confirmation email:', err));
      }

      console.log('✅ Payment verified & Confirmation Email triggered:', {
        razorpay_order_id,
        razorpay_payment_id,
        internalOrderId,
        customer: customer?.name,
      });

      // Auto-push order to Shiprocket if in live mode
      if (!req.mock.shiprocket && cart && customer) {
        try {
          const srClient = require('../shiprocket/client');
          await srClient.post('/orders/create/adhoc', {
            order_id:    internalOrderId,
            order_date:  new Date().toISOString().split('T')[0],
            channel_id:  config.shiprocket.channelId,
            billing_customer_name: customer.name,
            billing_phone: customer.phone,
            billing_address: customer.address,
            billing_city:    customer.city,
            billing_pincode: customer.pincode,
            billing_state:   customer.state,
            billing_country: 'India',
            billing_email:   customer.email || '',
            shipping_is_billing: 1,
            order_items: (cart || []).map(item => ({
              name:     item.name,
              sku:      item.id,
              units:    item.quantity,
              selling_price: item.price,
            })),
            payment_method: 'Prepaid',
            sub_total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
            length: 10, breadth: 10, height: 10, weight: 0.5,
          });
          console.log('✅ Order pushed to Shiprocket:', internalOrderId);
        } catch (srErr) {
          console.error('⚠️ Shiprocket push failed (non-blocking):', srErr.message);
        }
      }

      res.json({
        success:           true,
        internal_order_id: internalOrderId,
        razorpay_order_id,
        payment_id:        razorpay_payment_id,
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
