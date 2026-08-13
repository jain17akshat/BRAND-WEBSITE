/**
 * razorpay/verify.js
 * ─────────────────────────────────────────────────────────
 * HMAC-SHA256 signature verification for Razorpay payments.
 *
 * Razorpay generates a signature by hashing:
 *   `${razorpay_order_id}|${razorpay_payment_id}`
 * with your KEY_SECRET using HMAC-SHA256.
 *
 * We replicate this server-side and compare the digests.
 * If they don't match, the payment data has been tampered.
 */

const crypto = require('crypto');
const config = require('../config');

/**
 * verifyPaymentSignature
 * @param {string} razorpay_order_id   — from Razorpay callback
 * @param {string} razorpay_payment_id — from Razorpay callback
 * @param {string} razorpay_signature  — from Razorpay callback
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  if (config.razorpay.isMock) {
    // In mock mode always pass — no real signature to verify
    return { valid: true, mock: true };
  }

  if (!config.razorpay.keySecret) {
    return { valid: false, reason: 'RAZORPAY_KEY_SECRET not configured.' };
  }

  try {
    const body   = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    return { valid: isValid, reason: isValid ? undefined : 'Signature mismatch.' };
  } catch (err) {
    return { valid: false, reason: `Verification error: ${err.message}` };
  }
}

/**
 * verifyWebhookSignature
 * Used in the webhook route to authenticate Razorpay's POST.
 * @param {Buffer|string} rawBody — raw request body (not parsed JSON)
 * @param {string}        signature — X-Razorpay-Signature header value
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signature) {
  if (!config.razorpay.webhookSecret) {
    // If no webhook secret, skip verification (dev mode)
    return true;
  }

  try {
    const expected = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

module.exports = { verifyPaymentSignature, verifyWebhookSignature };
