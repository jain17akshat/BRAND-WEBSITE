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
  if (!configuredToken) {
    console.error('❌ Shiprocket Webhook configuration error: SHIPROCKET_WEBHOOK_TOKEN is missing on server.');
    return res.status(500).json({ success: false, error: 'Webhook token configuration missing on server' });
  }

  const incomingToken = req.headers['x-shiprocket-token'] || req.headers['shiprocket-token'] || req.headers['x-api-key'] || '';

  if (!incomingToken) {
    console.warn('⛔ Unauthorized Shiprocket Webhook attempt blocked: Missing token header');
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing webhook token' });
  }

  const tokenBuf = Buffer.from(String(incomingToken));
  const expectedBuf = Buffer.from(String(configuredToken));

  const isValid = tokenBuf.length === expectedBuf.length && crypto.timingSafeEqual(tokenBuf, expectedBuf);
  if (!isValid) {
    console.warn('⛔ Unauthorized Shiprocket Webhook attempt blocked: Token mismatch');
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid webhook token' });
  }

  next();
});


router.post('*', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('📨 Shiprocket Webhook Received:', JSON.stringify(payload));

    const status = String(payload.status || payload.current_status || '').toUpperCase();
    const statusCode = payload.status_code;
    const orderId = payload.channel_order_id || payload.order_id || 'UNKNOWN';
    const email   = payload.customer_email || payload.billing_email || payload.email;
    const name    = payload.customer_name || payload.billing_customer_name || 'Valued Customer';
    const reason  = payload.reason || payload.cancellation_reason || 'Shiprocket status update';

    const { markOrderCancelled, markOrderReturned } = require('../services/orderStore');

    // 1. Forward shipment cancellation (CANCELED, CANCELLED, status_code === 5)
    if (status.includes('CANCEL') || statusCode === 5) {
      if (orderId && orderId !== 'UNKNOWN') {
        await markOrderCancelled(orderId, { reason, email });
        console.log(`✅ Order status updated to CANCELLED in OrderStore for Order #${orderId}`);
      }

      if (email) {
        await sendOrderCancellationEmail({
          to: email,
          customerName: name,
          orderId,
          reason,
        }).catch(() => {});
      }
    } 
    // 2. Physical return completed / received (RETURN DELIVERED, RETURN RECEIVED, RETURN COMPLETED, RTO DELIVERED, RTO RECEIVED, status_code === 18)
    else if (status.includes('RETURN DELIVERED') || status.includes('RETURN RECEIVED') || status.includes('RETURN COMPLETED') || status.includes('RTO DELIVERED') || status.includes('RTO RECEIVED') || statusCode === 18) {
      if (orderId && orderId !== 'UNKNOWN') {
        await markOrderReturned(orderId, { status: 'RETURNED', email });
        console.log(`✅ Order status updated to RETURNED in OrderStore for Order #${orderId}`);
      }
    }
    // 3. Reverse shipment created / Return Initiated (RETURN INITIATED, RETURN APPROVED, RTO INITIATED, RTO ACKNOWLEDGED, status_code === 17)
    else if (status.includes('RETURN') || status.includes('RTO') || statusCode === 17) {
      if (orderId && orderId !== 'UNKNOWN') {
        await markOrderReturned(orderId, { status: 'RETURN_INITIATED', email });
        console.log(`✅ Order status updated to RETURN_INITIATED in OrderStore for Order #${orderId}`);
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
