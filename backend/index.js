/**
 * index.js — Shraviko Backend Entry Point
 * ─────────────────────────────────────────────────────────
 * Middleware stack (in order):
 *   1. rawBody       — preserve Buffer for webhook verification
 *   2. cors          — allow frontend origin
 *   3. express.json  — parse JSON body
 *   4. requestLogger — colour-coded request logs
 *   5. mockMode      — attach req.mock.razorpay / req.mock.shiprocket
 *   6. rateLimiter   — tiered rate limits per route group
 *   7. routes        — all API route handlers
 *   8. notFoundHandler
 *   9. errorHandler  — must be last
 */

require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const config         = require('./config');

// ── Middleware imports ─────────────────────────────────────
const requestLogger  = require('./middleware/requestLogger');
const mockMode       = require('./middleware/mockMode');
const rateLimiter    = require('./middleware/rateLimiter');
const rawBody        = require('./middleware/rawBody');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ── Route imports ──────────────────────────────────────────
const paymentsRouter = require('./routes/payments');
const trackRouter    = require('./routes/track');
const ordersRouter   = require('./routes/orders');
const returnsRouter  = require('./routes/returns');
const ratesRouter    = require('./routes/rates');

// ─────────────────────────────────────────────────────────
const app = express();

// 1. Raw body — must be before express.json()
app.use(rawBody);

// 2. CORS
app.use(cors({
  origin: [
    config.frontendUrl,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature'],
  credentials: true,
}));

// 3. JSON body parser (skips webhook routes — rawBody handles those)
app.use((req, res, next) => {
  if (req.path.includes('/webhook')) return next();
  express.json({ limit: '1mb' })(req, res, next);
});

// 4. Request logger
app.use(requestLogger);

// 5. Mock mode flags
app.use(mockMode);

// 6. Global rate limiter
app.use('/api', rateLimiter.global);

// ── Health check (no auth, no rate limit) ─────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:      'ok',
    service:     'Shraviko API',
    timestamp:   new Date().toISOString(),
    mode: {
      razorpay:   config.razorpay.isMock  ? 'mock' : 'live',
      shiprocket: config.shiprocket.isMock ? 'mock' : 'live',
    },
  });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/payments', rateLimiter.payments, paymentsRouter);
app.use('/api/track',    rateLimiter.track,    trackRouter);
app.use('/api/orders',                         ordersRouter);
app.use('/api/returns',  rateLimiter.returns,  returnsRouter);
app.use('/api/rates',                          ratesRouter);

// ── 404 handler ───────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Shraviko server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend:    ${config.frontendUrl}\n`);
});

module.exports = app;
