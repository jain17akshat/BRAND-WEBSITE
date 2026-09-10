require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  isProd,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    isMock: !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET,
  },

  shiprocket: {
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
    channelId: process.env.SHIPROCKET_CHANNEL_ID || '',
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'work',
    webhookToken: process.env.SHIPROCKET_WEBHOOK_TOKEN || '',
    isMock: !process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD,
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    isMock: !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER,
  },

  email: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPhone: process.env.ADMIN_PHONE || '',
    isMock: !process.env.EMAIL_USER || !process.env.EMAIL_PASS,
  },
};

// Production Mock Gate: Refuse to run in production if critical services resolve to mock mode
if (isProd) {
  const unconfigured = [];
  if (config.razorpay.isMock) unconfigured.push('Razorpay (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing)');
  if (config.shiprocket.isMock) unconfigured.push('Shiprocket (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD missing)');
  if (config.db.isMock) unconfigured.push('Database (DB_HOST / DB_NAME / DB_USER missing)');
  if (config.email.isMock) unconfigured.push('Email (EMAIL_USER / EMAIL_PASS missing)');
  if (!config.razorpay.webhookSecret) unconfigured.push('Razorpay Webhook Secret (RAZORPAY_WEBHOOK_SECRET missing)');

  if (unconfigured.length > 0) {
    console.error('\n❌ FATAL: Cannot start server in PRODUCTION mode with mock services or missing secrets:');
    unconfigured.forEach(item => console.error(`   - ${item}`));
    console.error('Please configure all production environment variables in .env before starting.\n');
    process.exit(1);
  }
}

module.exports = config;

