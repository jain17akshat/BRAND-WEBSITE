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

// ── Security Headers (Audit Fix 6) ─────────────────────────
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
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
const gstAdminRouter = require('./routes/gstAdmin');
app.use('/api/gst', gstAdminRouter);
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

// ── Crawlability Endpoints: robots.txt & sitemap.xml (Audit Fix 1 & 2) ──
const path = require('path');
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const { handleSeoRequest } = require('./services/seoRenderer');

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const distRobots = path.join(frontendDistPath, 'robots.txt');
  const publicRobots = path.join(__dirname, '../frontend/public/robots.txt');
  if (fs.existsSync(distRobots)) return res.sendFile(distRobots);
  if (fs.existsSync(publicRobots)) return res.sendFile(publicRobots);
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /cart\nDisallow: /track-order\nDisallow: /orders\nDisallow: /fulfillment-updates\nDisallow: /shiprocket-webhook\n\nSitemap: https://shraviko.com/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const distSitemap = path.join(frontendDistPath, 'sitemap.xml');
  const publicSitemap = path.join(__dirname, '../frontend/public/sitemap.xml');
  if (fs.existsSync(distSitemap)) return res.sendFile(distSitemap);
  if (fs.existsSync(publicSitemap)) return res.sendFile(publicSitemap);
  res.status(404).send('Sitemap not found');
});

// ── Serve Static Frontend with Caching & SSR Fallback (Combined Deployment on Hostinger) ──
if (fs.existsSync(frontendDistPath)) {
  // Serve static assets with 1-year immutable caching for fingerprinted JS/CSS/media
  app.use(express.static(frontendDistPath, {
    redirect: false,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      } else if (filePath.match(/\.(js|css|webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // Dynamic SEO & Prerendered HTML Catch-All
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/fulfillment-updates') || req.path.startsWith('/shiprocket-webhook')) {
      return next();
    }
    handleSeoRequest(req, res, frontendDistPath);
  });
}

// ── 404 handler ───────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

// ── Start HTTP Server Immediately (Required by Hostinger 3s Timeout) ──
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Shraviko server running on port ${PORT}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend:    ${config.frontendUrl}\n`);
});


// ── Run Async Initialization Tasks in Background ──────────────────────────
(async () => {
  try {
    const { initDatabase } = require('./database/db');
    await initDatabase();
  } catch (err) {
    console.warn('⚠️ Database initialization warning:', err.message);
  }

  if (!config.shiprocket.isMock) {
    try {
      const { getValidPickupLocation } = require('./shiprocket/pickup');
      await getValidPickupLocation();
    } catch (err) {
      console.warn('⚠️ Shiprocket pickup location fetch warning:', err.message);
    }
  }

  try {
    const emailQueue = require('./services/emailQueue');
    emailQueue.startPolling();
  } catch (err) {
    console.warn('⚠️ Email queue polling warning:', err.message);
  }
})();

module.exports = app;


