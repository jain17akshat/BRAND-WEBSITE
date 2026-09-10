/**
 * rateLimiter.js
 * ─────────────────────────────────────────────────────────
 * Pre-configured rate limiters for different route groups.
 * Uses express-rate-limit under the hood.
 *
 * Usage:
 *   app.use('/api/payments', rateLimiter.payments);
 *   app.use('/api/track',    rateLimiter.track);
 *   app.use('/api',          rateLimiter.global);
/**
 * Note: The default MemoryStore used here resets counters on server restart and
 * does not share state across horizontally scaled multi-instance deployments.
 * If deploying across multiple load-balanced worker instances in the future,
 * configure a shared store (e.g. Redis via `rate-limit-redis`).
 */
const rateLimit = require('express-rate-limit');

/** Standardised error response for rate-limited requests */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code:    'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please slow down and try again shortly.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    },
  });
};

/** Helper: build a limiter with shared defaults */
function buildLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return rate limit info in RateLimit-* headers
    legacyHeaders:   false,
    handler:         rateLimitHandler,
    // Use IP + User-Agent as composite key (fairer than pure IP)
    keyGenerator: (req) =>
      `${req.ip}::${req.headers['user-agent'] || 'unknown'}`,
    skip: (req) =>
      // Never rate-limit the health-check endpoint
      req.path === '/api/health',
  });
}

// ── Rate limiter tiers ────────────────────────────────────

/**
 * global — applies to all /api/* routes
 * 300 requests per 15 minutes per IP
 */
const global = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max:      300,
});

/**
 * payments — stricter for payment endpoints
 * 20 requests per 10 minutes (prevents card stuffing)
 */
const payments = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max:      20,
});

/**
 * track — for order tracking lookups
 * 60 requests per 10 minutes
 */
const track = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max:      60,
});

/**
 * returns — for return/refund submissions
 * 10 requests per 30 minutes (prevents abuse)
 */
const returns = buildLimiter({
  windowMs: 30 * 60 * 1000,
  max:      10,
});

/**
 * webhook — very strict, for webhooks
 * 50 requests per minute
 */
const webhook = buildLimiter({
  windowMs: 60 * 1000,
  max:      50,
});

/**
 * orders — for order creation and cancellation
 * 30 requests per 15 minutes
 */
const orders = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max:      30,
});

/**
 * reviews — for submitting product reviews & review requests
 * 15 requests per 15 minutes
 */
const reviews = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max:      15,
});

/**
 * enquiries — for submitting bulk enquiries and newsletter subscriptions
 * 15 requests per 15 minutes
 */
const enquiries = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max:      15,
});

module.exports = { global, payments, track, returns, webhook, orders, reviews, enquiries };

