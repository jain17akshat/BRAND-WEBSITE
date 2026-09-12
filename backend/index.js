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
const express = require('express');
const cors = require('cors');
const config = require('./config');

// ── Middleware imports ─────────────────────────────────────
const requestLogger = require('./middleware/requestLogger');
const mockMode = require('./middleware/mockMode');
const rateLimiter = require('./middleware/rateLimiter');
const rawBody = require('./middleware/rawBody');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ── Route imports ──────────────────────────────────────────
const paymentsRouter = require('./routes/payments');
const trackRouter = require('./routes/track');
const ordersRouter = require('./routes/orders');
const returnsRouter = require('./routes/returns');
const ratesRouter = require('./routes/rates');
const enquiriesRouter = require('./routes/enquiries');
const shiprocketWebhookRouter = require('./routes/shiprocketWebhook');
const reviewsRouter = require('./routes/reviews');

// ─────────────────────────────────────────────────────────
const app = express();

// Enable reverse proxy support so req.ip reflects real client IP behind load balancers/hosting proxies
app.set('trust proxy', 1);

// Bypass ngrok warning page for external webhooks
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// 1. Raw body — must be before express.json()
app.use(rawBody);

// 2. CORS
app.use(cors({
  origin: config.corsOrigins,
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
    status: 'ok',
    service: 'Shraviko API',
    timestamp: new Date().toISOString(),
    mode: {
      razorpay: config.razorpay.isMock ? 'mock' : 'live',
      shiprocket: config.shiprocket.isMock ? 'mock' : 'live',
    },
  });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/payments', rateLimiter.payments, paymentsRouter);
app.use('/api/track', rateLimiter.track, trackRouter);
app.use('/api/orders', rateLimiter.orders, ordersRouter);
app.use('/api/returns', rateLimiter.returns, returnsRouter);
app.use('/api/rates', ratesRouter);
app.use('/api/enquiries', rateLimiter.enquiries, enquiriesRouter);
app.use('/api/reviews', rateLimiter.reviews, reviewsRouter);
app.use('/api/fulfillment-updates', rateLimiter.webhook, shiprocketWebhookRouter);
app.use('/fulfillment-updates', rateLimiter.webhook, shiprocketWebhookRouter);
app.use('/api/shiprocket-webhook', rateLimiter.webhook, shiprocketWebhookRouter);
app.use('/shiprocket-webhook', rateLimiter.webhook, shiprocketWebhookRouter);

// ── Serve Static Frontend (Combined Deployment on Hostinger) ──
const path = require('path');
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/fulfillment-updates') || req.path.startsWith('/shiprocket-webhook')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ── 404 handler ───────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────
const PORT = config.port;

async function startServer() {
  try {
    const { initDatabase } = require('./database/db');
    const dbSuccess = await initDatabase();
    if (dbSuccess === false) {
      if (config.isProd) {
        console.error('❌ FATAL: Database initialization returned false. Halting server startup in PRODUCTION.');
        process.exit(1);
      } else {
        console.warn('⚠️ MySQL database connection unavailable. Falling back to local JSON order storage (development mode).');
      }
    }
  } catch (err) {
    console.error('⚠️ Database initialization error:', err.message);
    if (config.isProd) {
      console.error('❌ FATAL: Database initialization failed. Halting server startup in PRODUCTION.');
      process.exit(1);
    }
  }

  if (!config.shiprocket.isMock) {
    try {
      const { getValidPickupLocation } = require('./shiprocket/pickup');
      await getValidPickupLocation();
    } catch (err) {
      console.warn('⚠️ Shiprocket pickup location fetch warning:', err.message);
    }
  }

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`\n🚀 Shraviko server running on port ${PORT}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Frontend:    ${config.frontendUrl}\n`);
    });
  }
}

startServer();

module.exports = app;
