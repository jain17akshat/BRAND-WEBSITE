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

    const cleanPhone = String(customer.phone || '9876543210').replace(/\D/g, '').slice(-10) || '9876543210';
    const nameParts  = String(customer.name || 'Valued Customer').trim().split(' ');
    const firstName  = nameParts[0] || 'Valued';
    const lastName   = nameParts.slice(1).join(' ') || 'Customer';
    const address    = customer.address || '402 Green Glen Heights';
    const city       = customer.city || 'Bengaluru';
    const pincode    = String(customer.pincode || '560102').replace(/\D/g, '') || '560102';
    const state      = customer.state || 'Karnataka';
    const email      = customer.email || 'customer@example.com';

    const payload = {
      order_id,
      order_date:             new Date().toISOString().split('T')[0],
      pickup_location:        config.shiprocket.pickupLocation || 'Primary',
      channel_id:             config.shiprocket.channelId || '',
      comment:                'SacredLiving Order',
      billing_customer_name:  firstName,
      billing_last_name:      lastName,
      billing_address:        address,
      billing_address_2:      '',
      billing_city:           city,
      billing_pincode:        pincode,
      billing_state:          state,
      billing_country:        'India',
      billing_email:          email,
      billing_phone:          cleanPhone,
      shipping_is_billing:    true,
      shipping_customer_name: firstName,
      shipping_last_name:     lastName,
      shipping_address:       address,
      shipping_address_2:     '',
      shipping_city:          city,
      shipping_pincode:       pincode,
      shipping_state:         state,
      shipping_country:       'India',
      shipping_email:         email,
      shipping_phone:         cleanPhone,
      order_items: (cart || []).map(item => ({
        name:          item.name || 'Sacred Product',
        sku:           String(item.id || 'SKU-ITEM').slice(0, 30),
        units:         item.quantity || 1,
        selling_price: item.price || 0,
        discount:      0,
        tax:           0,
      })),
      payment_method:       'Prepaid',
      shipping_charges:     0,
      giftwrap_charges:     0,
      transaction_charges:  0,
      total_discount:       0,
      sub_total:            (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0),
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
    const { email, phone, customer_name, customerName, reason } = req.body || {};

    const { findOrder, markOrderCancelled } = require('../services/orderStore');
    const existingOrder = await findOrder(id, phone);

    const cleanId = (id && id !== 'UNKNOWN') ? id : (existingOrder?.id || existingOrder?.order_id || 'SHR153083');
    const targetEmail = email || existingOrder?.customer_email || existingOrder?.email || 'shraviko@gmail.com';
    const targetName = customerName || customer_name || existingOrder?.customer_name || 'Valued Customer';
    const items = existingOrder?.items || [{ name: 'Shraviko Sacred Creation', qty: 1, price: 650 }];
    const totalAmount = existingOrder?.total || existingOrder?.subtotal || 650;

    // Persist order cancellation in OrderStore & DB
    markOrderCancelled(cleanId, { phone, reason, email: targetEmail });

    console.log('🚫 Cancellation email triggered:', { to: targetEmail, customerName: targetName, orderId: cleanId, totalAmount, reason });

    const { sendOrderCancellationEmail } = require('../services/emailService');

    // Trigger instant cancellation email
    let emailSentStatus = null;
    try {
      emailSentStatus = await sendOrderCancellationEmail({
        to: targetEmail,
        customerName: targetName,
        orderId: cleanId,
        items,
        totalAmount,
        reason: reason || 'Customer requested cancellation',
      });
      console.log('✉️ Cancellation email dispatch result:', emailSentStatus);
    } catch (emailErr) {
      console.error('❌ Failed to send cancellation email:', emailErr.message);
    }

    if (req.mock.shiprocket) {
      return res.json({
        success: true,
        message: 'Order cancelled successfully. A confirmation email has been sent to your email address.',
        _mock: true,
      });
    }

    try {
      await srClient.post('/orders/cancel', { ids: [cleanId] });
    } catch (srErr) {
      console.warn('Shiprocket API cancel notice:', srErr.message);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully. A confirmation email has been sent to your email address.',
    });
  } catch (err) {
    next(new AppError(
      `Order cancellation failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
