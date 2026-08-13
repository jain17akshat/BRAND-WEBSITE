/**
 * mock/orders.js
 * Mock Shiprocket order & tracking data
 */

const MOCK_ORDERS = {
  'SHR-2024-001847': {
    id: 'SHR-2024-001847',
    phone: '9876543210',
    date: '2 August 2026',
    status: 'delivered',
    awb: 'AWB123456789',
    courier: 'Delhivery',
    estimatedDelivery: '5 August 2026',
    deliveredOn: '4 August 2026',
    items: [
      { name: 'Agarbatti – 100% Bamboo Free (50 Sticks)', qty: 2, price: 149, sku: 'AGR-BF-050' },
      { name: 'Brass Diya – Moradabad Handcrafted', qty: 1, price: 649, sku: 'BRS-DY-001' },
    ],
    subtotal: 947,
    shipping: 0,
    total: 947,
    address: 'Rajiv Sharma, 14-B, Civil Lines, Jaipur, Rajasthan – 302006',
    timeline: [
      { label: 'Order Placed',      date: '2 Aug, 3:14 PM',  done: true },
      { label: 'Payment Confirmed', date: '2 Aug, 3:15 PM',  done: true },
      { label: 'Processing',        date: '2 Aug, 6:00 PM',  done: true },
      { label: 'Shipped',           date: '3 Aug, 10:30 AM', done: true },
      { label: 'Out for Delivery',  date: '4 Aug, 9:00 AM',  done: true },
      { label: 'Delivered',         date: '4 Aug, 1:45 PM',  done: true },
    ],
  },

  'SHR-2024-002215': {
    id: 'SHR-2024-002215',
    phone: '9876543210',
    date: '10 August 2026',
    status: 'shipped',
    awb: 'AWB987654321',
    courier: 'BlueDart',
    estimatedDelivery: '13 August 2026',
    deliveredOn: null,
    items: [
      { name: 'Pure Copper Kalash – 1 Litre', qty: 1, price: 1299, sku: 'CPR-KL-001' },
    ],
    subtotal: 1299,
    shipping: 0,
    total: 1299,
    address: 'Rajiv Sharma, 14-B, Civil Lines, Jaipur, Rajasthan – 302006',
    timeline: [
      { label: 'Order Placed',      date: '10 Aug, 11:20 AM', done: true },
      { label: 'Payment Confirmed', date: '10 Aug, 11:21 AM', done: true },
      { label: 'Processing',        date: '10 Aug, 3:00 PM',  done: true },
      { label: 'Shipped',           date: '11 Aug, 9:45 AM',  done: true },
      { label: 'Out for Delivery',  date: '',                  done: false },
      { label: 'Delivered',         date: '',                  done: false },
    ],
  },
};

module.exports = { MOCK_ORDERS };
