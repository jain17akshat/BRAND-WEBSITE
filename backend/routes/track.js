/**
 * routes/track.js
 * GET /api/track?orderId=SHR-2024-001847&phone=9876543210
 */

const express      = require('express');
const router       = express.Router();
const srClient     = require('../shiprocket/client');
const { MOCK_ORDERS } = require('../mock/orders');
const { AppError } = require('../middleware/errorHandler');

router.get('/', async (req, res, next) => {
  try {
    const { orderId, phone } = req.query;

    if (!orderId || !phone) {
      throw new AppError('orderId and phone are required query parameters.', 400, 'VALIDATION_ERROR');
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

    // ── Mock mode ──────────────────────────────────────────
    if (req.mock.shiprocket) {
      const order = MOCK_ORDERS[orderId.toUpperCase()];
      if (!order || order.phone !== cleanPhone) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'No order found matching these details.' },
        });
      }
      return res.json({ success: true, order, _mock: true });
    }

    // ── Live mode ──────────────────────────────────────────
    // 1. Fetch order from Shiprocket
    const srOrderRes = await srClient.get(`/orders`, {
      params: { channel_order_id: orderId },
    });

    const srOrder = srOrderRes.data?.data?.[0];
    if (!srOrder) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found in Shiprocket.' },
      });
    }

    // Verify phone matches
    const srPhone = String(srOrder.customer_phone || '').replace(/\D/g, '').slice(-10);
    if (srPhone !== cleanPhone) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'No order found matching these details.' },
      });
    }

    // 2. Fetch shipment tracking if AWB available
    let timeline = [];
    const awb = srOrder.shipments?.[0]?.awb_code;
    if (awb) {
      try {
        const trackRes = await srClient.get(`/courier/track/awb/${awb}`);
        const activities = trackRes.data?.tracking_data?.track_activities || [];
        timeline = activities.map(a => ({
          label: a.activity,
          date:  a.date,
          done:  true,
        })).reverse();
      } catch {
        // Non-blocking — tracking may not be available yet
      }
    }

    // 3. Map to frontend shape
    const order = {
      id:               orderId,
      date:             srOrder.created_at?.split('T')[0] || '',
      status:           srOrder.status?.toLowerCase() || 'processing',
      estimatedDelivery: srOrder.shipments?.[0]?.etd || '',
      deliveredOn:      srOrder.status === 'DELIVERED' ? srOrder.updated_at?.split('T')[0] : null,
      items:            (srOrder.products || []).map(p => ({
        name:  p.name,
        qty:   p.quantity,
        price: p.selling_price,
      })),
      subtotal: srOrder.sub_total || 0,
      shipping: 0,
      total:    srOrder.sub_total || 0,
      address:  `${srOrder.billing_customer_name}, ${srOrder.billing_address}, ${srOrder.billing_city}, ${srOrder.billing_state} – ${srOrder.billing_pincode}`,
      awb,
      courier: srOrder.shipments?.[0]?.courier_name || '',
      timeline,
    };

    res.json({ success: true, order });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(
      `Tracking failed: ${err.response?.data?.message || err.message}`,
      err.response?.status === 401 ? 401 : 502,
      'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
