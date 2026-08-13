/**
 * routes/orders.js
 * POST /api/orders/create
 * POST /api/orders/:id/cancel
 * GET  /api/orders/:id
 */

const express      = require('express');
const router       = express.Router();
const srClient     = require('../shiprocket/client');
const validateBody = require('../middleware/validateBody');
const { AppError } = require('../middleware/errorHandler');
const config       = require('../config');

// ── POST /api/orders/create ───────────────────────────────
router.post('/create', validateBody({
  order_id:    { type: 'string', required: true },
  customer:    { type: 'string', required: false }, // validated inside
  cart:        { type: 'array',  required: true },
}), async (req, res, next) => {
  try {
    const { order_id, customer = {}, cart } = req.body;

    if (req.mock.shiprocket) {
      return res.json({
        success:          true,
        shiprocket_order_id: `SR_MOCK_${Date.now()}`,
        channel_order_id:    order_id,
        _mock: true,
      });
    }

    const payload = {
      order_id,
      order_date:  new Date().toISOString().split('T')[0],
      channel_id:  config.shiprocket.channelId,
      billing_customer_name: customer.name || 'Customer',
      billing_phone:   customer.phone || '',
      billing_address: customer.address || '',
      billing_city:    customer.city || '',
      billing_pincode: customer.pincode || '',
      billing_state:   customer.state || '',
      billing_country: 'India',
      billing_email:   customer.email || '',
      shipping_is_billing: 1,
      order_items: cart.map(item => ({
        name:          item.name,
        sku:           item.id,
        units:         item.quantity,
        selling_price: item.price,
      })),
      payment_method: 'Prepaid',
      sub_total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      length: 10, breadth: 10, height: 10, weight: 0.5,
    };

    const { data } = await srClient.post('/orders/create/adhoc', payload);

    res.json({
      success:              true,
      shiprocket_order_id:  data.order_id,
      shipment_id:          data.shipment_id,
      channel_order_id:     order_id,
    });
  } catch (err) {
    next(new AppError(
      `Order creation failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

// ── GET /api/orders/:id ───────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.mock.shiprocket) {
      return res.json({ success: true, order: { id, status: 'mock', _mock: true } });
    }

    const { data } = await srClient.get(`/orders/show/${id}`);
    res.json({ success: true, order: data.data });
  } catch (err) {
    next(new AppError(
      `Order fetch failed: ${err.response?.data?.message || err.message}`,
      err.response?.status === 404 ? 404 : 502, 'SHIPROCKET_ERROR'
    ));
  }
});

// ── POST /api/orders/:id/cancel ───────────────────────────
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.mock.shiprocket) {
      return res.json({ success: true, message: 'Order cancelled (mock).', _mock: true });
    }

    await srClient.post('/orders/cancel', { ids: [id] });
    res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (err) {
    next(new AppError(
      `Order cancellation failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
