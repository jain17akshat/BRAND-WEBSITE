require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
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
    isMock: !process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD,
  },
};

module.exports = config;
