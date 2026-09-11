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
const { getProductPrice } = require('../data/catalog');

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

    const orderItems = (cart || []).map(item => {
      const price = getProductPrice(item);
      const rawQty = item.quantity !== undefined ? item.quantity : (item.units !== undefined ? item.units : 1);
      const qty = Number(rawQty);
      if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
        throw new AppError(`Invalid item quantity for "${item.name || item.id}": ${rawQty}`, 400, 'VALIDATION_ERROR');
      }
      return {
        name:          item.name || 'Sacred Product',
        sku:           String(item.id || 'SKU-ITEM').slice(0, 30),
        units:         qty,
        selling_price: price,
        discount:      0,
        tax:           0,
      };
    });

    const subTotal = orderItems.reduce((s, i) => s + (i.selling_price * i.units), 0);

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
      order_items:            orderItems,
      payment_method:         'Prepaid',
      shipping_charges:       0,
      giftwrap_charges:       0,
      transaction_charges:    0,
      total_discount:         0,
      sub_total:              subTotal,
      length: 10, breadth: 10, height: 10, weight: 0.5,
    };


    const { data } = await srClient.post('/orders/create/adhoc', payload);

    if (email) {
      const { sendPrepaidPaymentReceivedEmail } = require('../services/emailService');
      sendPrepaidPaymentReceivedEmail({
        to: email,
        customerName: `${firstName} ${lastName}`,
        orderId: order_id,
        paymentId: 'Prepaid Direct',
        items: cart || [],
        totalAmount: subTotal,
        shippingAddress: `${address}, ${city}, ${state} - ${pincode}`,
        phone: cleanPhone,
      }).catch(err => console.error('Failed to send order creation email:', err));
    }

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

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(String(id).trim())) {
      return next(new AppError('Invalid order ID format. Must contain only alphanumeric characters, underscores, or hyphens.', 400, 'INVALID_INPUT'));
    }

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

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(String(id).trim())) {
      return next(new AppError('Invalid order ID format. Must contain only alphanumeric characters, underscores, or hyphens.', 400, 'INVALID_INPUT'));
    }

    const { findOrder, markOrderCancelled } = require('../services/orderStore');
    const existingOrder = await findOrder(id, phone);

    if (!existingOrder && (!id || id === 'UNKNOWN')) {
      return next(new AppError('Order not found for the provided order ID and phone number.', 404, 'ORDER_NOT_FOUND'));
    }

    const cleanId = existingOrder?.id || existingOrder?.order_id || id;
    const targetEmail = email || existingOrder?.customer_email || existingOrder?.email || 'shraviko@gmail.com';
    const targetName = customerName || customer_name || existingOrder?.customer_name || 'Valued Customer';
    const items = existingOrder?.items || [{ name: 'Shraviko Sacred Creation', qty: 1, price: 650 }];
    const totalAmount = existingOrder?.total || existingOrder?.subtotal || 650;

    // Persist order cancellation in OrderStore & DB
    await markOrderCancelled(cleanId, { phone, reason, email: targetEmail });

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

    let shiprocketCancelStatus = null;
    if (req.mock.shiprocket) {
      shiprocketCancelStatus = { success: true, _mock: true };
    } else {
      const idsToCancel = Array.from(new Set([existingOrder?.shiprocket_order_id, cleanId].filter(Boolean)));
      console.log('🔄 Triggering Shiprocket cancellation for IDs:', idsToCancel);
      try {
        const srRes = await srClient.post('/orders/cancel', { ids: idsToCancel });
        shiprocketCancelStatus = srRes.data;
        console.log('✅ Shiprocket cancellation response:', JSON.stringify(srRes.data));
      } catch (srErr) {
        console.warn('⚠️ Shiprocket API cancel warning:', srErr.response?.data || srErr.message);
        shiprocketCancelStatus = { error: srErr.response?.data?.message || srErr.message };
      }
    }

    res.json({
      success: true,
      order_id: cleanId,
      status: 'CANCELLED',
      message: 'Order cancelled successfully. A confirmation email has been sent to your email address.',
      shiprocket: shiprocketCancelStatus,
      _mock: !!req.mock.shiprocket,
    });
  } catch (err) {
    next(new AppError(
      `Order cancellation failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
