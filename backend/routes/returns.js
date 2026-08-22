/**
 * routes/returns.js
 * POST /api/returns/request
 * GET  /api/returns/:id
 */

const express      = require('express');
const router       = express.Router();
const srClient     = require('../shiprocket/client');
const validateBody = require('../middleware/validateBody');
const { AppError } = require('../middleware/errorHandler');

// ── POST /api/returns/request ─────────────────────────────
router.post('/request', validateBody({
  order_id:   { type: 'string', required: true },
  phone:      { type: 'phone',  required: true },
  reason:     { type: 'string', required: true },
  refund_type:{ type: 'string', required: false },
}), async (req, res, next) => {
  try {
    const { order_id, phone, reason, refund_type = 'original', details = '' } = req.body;

    // Log the return request always
    console.log('📦 Return request received:', { order_id, phone, reason, refund_type, details });

    // Send immediate email alert to merchant (info@shraviko.com) with customer bank details
    const { sendReturnNotificationToAdmin } = require('../services/emailService');
    sendReturnNotificationToAdmin({
      orderId: order_id,
      phone,
      reason,
      refundType: refund_type,
      details,
    }).catch(err => console.error('Failed to notify admin of return:', err));

    if (req.mock.shiprocket) {
      return res.json({
        success:   true,
        return_id: `RET_MOCK_${Date.now()}`,
        order_id,
        status:    'submitted',
        message:   'Return request submitted. Our team will contact you within 24 hours.',
        _mock:     true,
      });
    }

    // Shiprocket return order creation
    const { data } = await srClient.post('/orders/return', {
      order_id,
      order_date:     new Date().toISOString().split('T')[0],
      channel_id:     '',
      pickup_customer_name: 'Customer',
      pickup_phone:   phone,
      pickup_address: '',
      pickup_city:    '',
      pickup_state:   '',
      pickup_pincode: '',
      pickup_country: 'India',
      shipping_customer_name: 'Shraviko Sacred Living',
      shipping_phone:  '01412894020',
      shipping_address:'Civil Lines',
      shipping_city:   'Jaipur',
      shipping_state:  'Rajasthan',
      shipping_pincode:'302006',
      shipping_country:'India',
      payment_method: 'Prepaid',
      sub_total:       0,
      order_items:     [],
    });

    res.json({
      success:   true,
      return_id: data.return_id || data.order_id,
      order_id,
      status:    'submitted',
      message:   'Return request submitted. Our team will contact you within 24 hours.',
    });
  } catch (err) {
    next(new AppError(
      `Return request failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

// ── GET /api/returns/:id ──────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.mock.shiprocket) {
      return res.json({
        success: true,
        return: { id, status: 'submitted', _mock: true },
      });
    }

    const { data } = await srClient.get(`/orders/return/${id}`);
    res.json({ success: true, return: data });
  } catch (err) {
    next(new AppError(
      `Return status fetch failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
