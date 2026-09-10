/**
 * place_order.js — Run via terminal: node place_order.js
 */
const http = require('http');

const orderPayload = JSON.stringify({
  razorpay_order_id: 'order_mock_test_123',
  razorpay_payment_id: 'pay_mock_test_123',
  razorpay_signature: 'mock_sig',
  payment_method: 'COD',
  cart: [
    {
      id: 'BELL-15X15-01',
      title: 'Handcrafted Sacred Temple Brass Bell (15x15 inch)',
      name: 'Handcrafted Sacred Temple Brass Bell (15x15 inch)',
      price: 18500,
      quantity: 1,
      sku: 'BELL-15X15',
    }
  ],
  customer: {
    name: 'Akshat Jain',
    email: 'jain.17akshaat@gmail.com',
    phone: '7742320607',
    address: 'Plot 45, Scheme 8, Near Central Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001'
  }
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/payments/verify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(orderPayload),
  },
};

console.log('📦 Placing test order via Node.js...\n');

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      console.log('🎉 ORDER CREATED SUCCESSFULLY!');
      console.log('──────────────────────────────────────────────────');
      console.log(`Order ID:          ${parsed.internal_order_id || parsed.internalOrderId || parsed.order_id}`);
      console.log(`Customer:          ${parsed.customer?.name || 'Akshat Jain'}`);
      console.log(`Customer Email:    ${parsed.customer?.email || 'jain.17akshaat@gmail.com'}`);
      console.log(`Shiprocket Status: ${parsed.shiprocket ? 'Pushed to Shiprocket' : 'Saved locally'}`);
      console.log('──────────────────────────────────────────────────\n');
      console.log('Full Response:', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('RAW RESPONSE:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Order creation failed: ${e.message}`);
});

req.write(orderPayload);
req.end();
