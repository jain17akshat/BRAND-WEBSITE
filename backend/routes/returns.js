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

    markOrderReturned(cleanOrderId, { ...details, phone });

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

    // ── Shiprocket Return Order Creation ──────────────────
    let shiprocketReturn = null;

    if (req.mock.shiprocket) {
      shiprocketReturn = { return_id: `RET_MOCK_${Date.now()}`, _mock: true };
    } else {
      // Pull customer details from existing order for the pickup (customer) side
      const customerAddress = existingOrder?.address || existingOrder?.shipping_address || '';
      const customerCity = existingOrder?.city || '';
      const customerState = existingOrder?.state || '';
      const customerPincode = existingOrder?.pincode || '';

      // Build order_items from existing order items
      const orderItems = (existingOrder?.items || []).map(item => ({
        name:          item.name || item.title || 'Shraviko Return Item',
        sku:           String(item.sku || item.id || `SKU-RET-${Date.now()}`).slice(0, 30),
        units:         item.qty || item.quantity || 1,
        selling_price: item.price || 0,
        discount:      0,
        tax:           0,
      }));

      // Fallback if no items found
      if (orderItems.length === 0) {
        orderItems.push({
          name: 'Shraviko Return Item',
          sku: `SKU-RET-${Date.now()}`,
          units: 1,
          selling_price: existingOrder?.total || existingOrder?.subtotal || 399,
          discount: 0,
          tax: 0,
        });
      }

      const subTotal = existingOrder?.total || existingOrder?.subtotal || orderItems.reduce((s, i) => s + (i.selling_price * i.units), 0) || 399;

      // Get valid pickup location from Shiprocket account
      const { getValidPickupLocation } = require('../shiprocket/pickup');
      const pickupLoc = await getValidPickupLocation();
      const config = require('../config');

      const cleanPhone = String(phone || '9876543210').replace(/\D/g, '').slice(-10) || '9876543210';
      const nameParts = String(customerName || 'Valued Customer').trim().split(' ');
      const firstName = nameParts[0] || 'Valued';
      const lastName  = nameParts.slice(1).join(' ') || 'Customer';

      const uniqueReturnOrderId = `RET-${String(cleanOrderId).replace(/[^a-zA-Z0-9_-]/g, '')}-${Date.now().toString().slice(-4)}`;

      const returnPayload = {
        order_id:               uniqueReturnOrderId,
        order_date:             new Date().toISOString().split('T')[0],
        channel_id:             config.shiprocket.channelId || '',
        pickup_customer_name:   firstName,
        pickup_last_name:       lastName,
        pickup_address:         (customerAddress && customerAddress.length >= 10) ? customerAddress : `${customerAddress || 'Customer Address'}, Main Street, Sector 5`,
        pickup_address_2:       '',
        pickup_city:            customerCity || 'Jaipur',
        pickup_state:           customerState || 'Rajasthan',
        pickup_pincode:         String(customerPincode || '302001').replace(/\D/g, '') || '302001',
        pickup_country:         'India',
        pickup_email:           customerEmail,
        pickup_phone:           cleanPhone,
        pickup_location:        pickupLoc,
        shipping_customer_name: 'Shraviko',
        shipping_last_name:     'Atelier',
        shipping_address:       '123 Civil Lines, Near City Palace',
        shipping_address_2:     '',
        shipping_city:          'Udaipur',
        shipping_state:         'Rajasthan',
        shipping_pincode:       '313001',
        shipping_country:       'India',
        shipping_email:         'shraviko@gmail.com',
        shipping_phone:         '7742320607',
        payment_method:         existingOrder?.payment_method || 'Prepaid',
        sub_total:              subTotal,
        order_items:            orderItems,
        length: 10, breadth: 10, height: 10, weight: 0.5,
      };

      console.log('📦 Shiprocket return payload:', JSON.stringify(returnPayload, null, 2));

      try {
        const { data } = await srClient.post('/orders/create/return', returnPayload);
        shiprocketReturn = data;
        console.log('✅ Return order successfully pushed to Shiprocket Return Dashboard:', { return_id: data?.return_id || data?.order_id, order_id: uniqueReturnOrderId });
      } catch (srErr) {
        const errMsg = srErr.response?.data?.message || srErr.response?.data?.errors || srErr.message;
        console.error('⚠️ Shiprocket return creation response:', JSON.stringify(srErr.response?.data || errMsg));
        shiprocketReturn = { error: errMsg, fallback: true };
      }
    }

    res.json({
      success:   true,
      return_id: shiprocketReturn?.return_id || shiprocketReturn?.order_id || returnId,
      order_id:  cleanOrderId,
      status:    'approved',
      message:   'Return request approved! A Return Request Approval Mail has been sent to your email.',
      shiprocket: shiprocketReturn,
      _mock:     !!shiprocketReturn?._mock,
    });
  } catch (err) {
    console.error('❌ Return request failed:', err.response?.data || err.message);
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
