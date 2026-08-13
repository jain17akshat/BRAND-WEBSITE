/**
 * razorpay/client.js
 * ─────────────────────────────────────────────────────────
 * Returns a Razorpay SDK instance when keys are present,
 * or a mock stub that returns realistic fake responses.
 */

const config = require('../config');

let _client = null;

function getClient() {
  if (_client) return _client;

  if (!config.razorpay.isMock) {
    const Razorpay = require('razorpay');
    _client = new Razorpay({
      key_id:     config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
    console.log('✅ Razorpay SDK initialised (LIVE)');
  } else {
    // Mock stub — mirrors real Razorpay SDK method signatures
    _client = {
      orders: {
        create: async (opts) => ({
          id:         `order_MOCK${Date.now()}`,
          entity:     'order',
          amount:     opts.amount,
          amount_paid: 0,
          amount_due: opts.amount,
          currency:   opts.currency || 'INR',
          receipt:    opts.receipt,
          status:     'created',
          created_at: Math.floor(Date.now() / 1000),
        }),
        fetch: async (id) => ({
          id,
          status: 'paid',
          amount: 94700,
          currency: 'INR',
        }),
      },
      payments: {
        fetch: async (id) => ({
          id,
          order_id: `order_MOCK${Date.now()}`,
          amount:   94700,
          currency: 'INR',
          status:   'captured',
          method:   'upi',
          created_at: Math.floor(Date.now() / 1000),
        }),
        refund: async (paymentId, opts) => ({
          id:         `rfnd_MOCK${Date.now()}`,
          payment_id: paymentId,
          amount:     opts.amount,
          currency:   'INR',
          status:     'processed',
          created_at: Math.floor(Date.now() / 1000),
        }),
      },
    };
    console.log('⚠️  Razorpay running in MOCK mode');
  }

  return _client;
}

module.exports = { getClient };
