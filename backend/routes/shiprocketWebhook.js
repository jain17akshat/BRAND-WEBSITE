/**
 * routes/shiprocketWebhook.js
 * ─────────────────────────────────────────────────────────
 * Receives webhook events from Shiprocket Dashboard (e.g. order cancelled, shipped, delivered)
 *   POST /api/shiprocket-webhook
 */

const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const config  = require('../config');
const { sendOrderCancellationEmail } = require('../services/emailService');

router.use((req, res, next) => {
  console.log(`📨 Shiprocket Webhook ping received: [${req.method}] ${req.originalUrl}`);
  if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).json({ success: true, message: 'Shiprocket Webhook listener ready' });
  }

  // Token Authentication for Shiprocket Webhook POST events
  const configuredToken = config.shiprocket.webhookToken;
  if (configuredToken) {
    const incomingToken = req.headers['x-shiprocket-token'] || req.headers['shiprocket-token'] || req.headers['x-api-key'] || '';
    
    const tokenBuf = Buffer.from(String(incomingToken));
    const expectedBuf = Buffer.from(String(configuredToken));

    const isValid = tokenBuf.length === expectedBuf.length && crypto.timingSafeEqual(tokenBuf, expectedBuf);
    if (!isValid) {
      console.warn('⛔ Unauthorized Shiprocket Webhook attempt blocked: Token mismatch');
      return res.status(401).json({ success: false, error: 'Unauthorized webhook request' });
    }
  }

  next();
});


router.post('*', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('📨 Shiprocket Webhook Received:', JSON.stringify(payload));

    const status = String(payload.status || payload.current_status || '').toUpperCase();
    const statusCode = payload.status_code;

    // Check if status represents a Cancellation (CANCELED, CANCELLED, status_code === 5)
    if (status.includes('CANCEL') || statusCode === 5) {
      const orderId = payload.channel_order_id || payload.order_id || 'UNKNOWN';
      const email   = payload.customer_email || payload.billing_email || payload.email;
      const name    = payload.customer_name || payload.billing_customer_name || 'Valued Customer';
      const reason  = payload.reason || payload.cancellation_reason || 'Order cancelled via Shiprocket Dashboard';

      if (email) {
        await sendOrderCancellationEmail({
          to: email,
          customerName: name,
          orderId,
          reason,
        });
        console.log(`✅ Order cancellation email sent via Shiprocket Webhook for Order #${orderId} to ${email}`);
      } else {
        console.log(`⚠️ Cancellation webhook received for Order #${orderId}, but no customer email was provided in payload.`);
      }
    }

    // Always respond 200 OK to Shiprocket immediately
    res.status(200).json({ success: true, message: 'Shiprocket webhook processed successfully' });
  } catch (err) {
    console.error('❌ Error processing Shiprocket webhook:', err.message);
    res.status(200).json({ success: false, error: err.message });
  }
});

module.exports = router;
