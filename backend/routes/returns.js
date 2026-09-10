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
  phone:      { type: 'phone',  required: true },
  reason:     { type: 'string', required: false },
  refund_type:{ type: 'string', required: false },
}), async (req, res, next) => {
  try {
    const { order_id, phone, reason = 'Customer Return Request', refund_type = 'bank', details = {}, customer_name, email } = req.body;

    const returnId = `RET_${Math.floor(100000 + Math.random() * 900000)}`;

    const { findOrder, markOrderReturned } = require('../services/orderStore');
    const existingOrder = await findOrder(order_id, phone);
    const cleanOrderId = (order_id && order_id !== 'UNKNOWN') ? order_id : (existingOrder?.id || existingOrder?.order_id || 'SHR153083');

    markOrderReturned(cleanOrderId, details);

    const customerEmail = email || existingOrder?.customer_email || 'shraviko@gmail.com';
    const customerName  = customer_name || details?.account_holder_name || existingOrder?.customer_name || 'Valued Customer';

    // Log the return request
    console.log('📦 Return request approved & email triggered:', { returnId, cleanOrderId, phone, customerEmail, reason });

    // 1. Send instant Return Request Approval email to customer
    const { sendReturnRequestConfirmationEmail, sendReturnNotificationToAdmin } = require('../services/emailService');
    sendReturnRequestConfirmationEmail({
      to: customerEmail,
      customerName,
      returnId,
      orderId: cleanOrderId,
      reason,
    }).catch(err => console.error('Failed to send customer return confirmation email:', err));

    // 2. Send immediate email alert to merchant (shraviko@gmail.com)
    sendReturnNotificationToAdmin({
      orderId: cleanOrderId,
      phone,
      reason,
      refundType: refund_type,
      details,
    }).catch(err => console.error('Failed to notify admin of return:', err));

    const { saveReturnRequest } = require('../database/db');
    await saveReturnRequest({
      return_id: returnId,
      order_id: cleanOrderId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: phone,
      reason,
      bank_details: details,
    });

    if (req.mock.shiprocket) {
      return res.json({
        success:   true,
        return_id: `RET_MOCK_${Date.now()}`,
        order_id,
        status:    'approved',
        message:   'Return request approved! A Return Request Approval Mail has been sent to your email.',
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
      shipping_customer_name: 'Shraviko',
      shipping_phone:  '7742320607',
      shipping_address:'Civil Lines',
      shipping_city:   'Udaipur',
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
      status:    'approved',
      message:   'Return request approved! A Return Request Approval Mail has been sent to your email.',
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
