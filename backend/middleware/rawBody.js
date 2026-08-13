/**
 * rawBody.js
 * ─────────────────────────────────────────────────────────
 * Preserves the raw Buffer of the request body for routes
 * that require HMAC signature verification (Razorpay webhooks).
 *
 * Express's json() middleware consumes the stream, so we must
 * capture the raw bytes BEFORE json() parses them.
 *
 * Usage in index.js:
 *   app.use(rawBody);          // first
 *   app.use(express.json());   // second — still works normally
 *
 * In webhook route:
 *   const rawPayload = req.rawBody; // Buffer
 *   Razorpay.validateWebhookSignature(rawPayload.toString(), sig, secret)
 */

function rawBody(req, res, next) {
  // Only collect raw body for the webhook endpoint (performance)
  if (req.path.includes('/webhook')) {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      req.rawBody = Buffer.concat(chunks);
      next();
    });
    req.on('error', next);
  } else {
    next();
  }
}

module.exports = rawBody;
