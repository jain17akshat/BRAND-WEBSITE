/**
 * mock/payments.js
 * Mock Razorpay payment data
 */

function mockRazorpayOrder(amount, receipt) {
  return {
    id:          `order_MOCK${Date.now()}`,
    entity:      'order',
    amount,
    amount_paid: 0,
    amount_due:  amount,
    currency:    'INR',
    receipt,
    status:      'created',
    created_at:  Math.floor(Date.now() / 1000),
    _mock:       true,
  };
}

function mockRazorpayVerify(razorpay_order_id) {
  return {
    success:          true,
    internal_order_id: `SHR${Math.floor(100000 + Math.random() * 900000)}`,
    razorpay_order_id,
    payment_id:       `pay_MOCK${Date.now()}`,
    _mock:            true,
  };
}

function mockRazorpayRefund(payment_id, amount) {
  return {
    id:         `rfnd_MOCK${Date.now()}`,
    payment_id,
    amount,
    currency:   'INR',
    status:     'processed',
    created_at: Math.floor(Date.now() / 1000),
    _mock:      true,
  };
}

module.exports = { mockRazorpayOrder, mockRazorpayVerify, mockRazorpayRefund };
