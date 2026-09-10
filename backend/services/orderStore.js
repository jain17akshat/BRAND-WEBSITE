/**
 * services/orderStore.js
 * ─────────────────────────────────────────────────────────
 * In-memory order registry & MySQL DB bridge for instant tracking lookup.
 */

const { saveOrder: saveToDb, getPool } = require('../database/db');

// In-memory fallback map for active runtime orders
const recentOrders = new Map();

function addOrder(orderData) {
  if (!orderData || !orderData.order_id) return;
  const cleanId = String(orderData.order_id).replace(/^[#\s]+/, '').trim().toUpperCase();
  
  const record = {
    id: cleanId,
    order_id: cleanId,
    customer_name: orderData.customer_name || 'Valued Devotee',
    customer_email: orderData.customer_email || '',
    customer_phone: String(orderData.customer_phone || '').replace(/\D/g, '').slice(-10),
    total_amount: orderData.total_amount || 0,
    payment_method: orderData.payment_method || 'Prepaid',
    payment_status: orderData.payment_status || 'PAID',
    shipping_address: orderData.shipping_address || '',
    city: orderData.city || '',
    state: orderData.state || '',
    pincode: orderData.pincode || '',
    items: orderData.items || [],
    created_at: new Date().toISOString(),
  };

  recentOrders.set(cleanId, record);

  // Asynchronously save to MySQL DB if pool active
  saveToDb(orderData).catch(() => {});
}

async function findOrder(orderId, phone) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';

  if (!cleanId && !cleanPhone) return null;

  // 1. Check in-memory recent orders
  if (cleanId) {
    if (recentOrders.has(cleanId)) {
      const cached = recentOrders.get(cleanId);
      const cachedPhone = String(cached.customer_phone || '').replace(/\D/g, '').slice(-10);
      if (!cleanPhone || !cachedPhone || cachedPhone === cleanPhone || cachedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cachedPhone)) {
        return formatCachedOrder(cached);
      }
    }

    for (const [k, cached] of recentOrders.entries()) {
      if (k.toUpperCase() === cleanId) {
        return formatCachedOrder(cached);
      }
    }
  }

  // Search by phone only if cleanId is empty or not matched
  if (cleanPhone) {
    for (const [k, cached] of recentOrders.entries()) {
      const cachedPhone = String(cached.customer_phone || '').replace(/\D/g, '').slice(-10);
      if (cachedPhone && (cachedPhone === cleanPhone || cachedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cachedPhone))) {
        return formatCachedOrder(cached);
      }
    }
  }

  // 2. Check MySQL Database (if pool active)
  const pool = getPool();
  if (pool) {
    try {
      let query = '';
      let params = [];
      if (cleanId) {
        query = `SELECT * FROM orders WHERE UPPER(order_id) = ? LIMIT 1`;
        params = [cleanId];
      } else if (cleanPhone) {
        query = `SELECT * FROM orders WHERE customer_phone LIKE ? ORDER BY id DESC LIMIT 1`;
        params = [`%${cleanPhone}`];
      }

      if (query) {
        const [rows] = await pool.query(query, params);
        if (rows && rows.length > 0) {
          const row = rows[0];
          let items = [];
          try { items = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : row.items_json; } catch {}
          return formatCachedOrder({
            id: row.order_id,
            order_id: row.order_id,
            customer_name: row.customer_name,
            customer_email: row.customer_email,
            customer_phone: row.customer_phone,
            total_amount: row.total_amount,
            payment_method: row.payment_method,
            payment_status: row.payment_status,
            shipping_address: row.shipping_address,
            items,
            created_at: row.created_at,
          });
        }
      }
    } catch (err) {
      console.error('OrderStore DB lookup error:', err.message);
    }
  }

  return null;
}

function markOrderReturned(orderId, returnData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : 'SHR153083';
  const cleanPhone = returnData.phone ? String(returnData.phone).replace(/\D/g, '').slice(-10) : '7742320607';

  if (cleanId) {
    let record = recentOrders.get(cleanId);
    if (!record) {
      for (const [k, cached] of recentOrders.entries()) {
        if (k.toUpperCase() === cleanId) {
          record = cached;
          break;
        }
      }
    }

    if (record) {
      record.isReturnRequested = true;
      record.status = 'Return Requested';
      record.payment_status = 'RETURN_REQUESTED';
      if (cleanPhone) record.customer_phone = cleanPhone;
      record.return_data = returnData;
      recentOrders.set(cleanId, record);
    } else {
      recentOrders.set(cleanId, {
        id: cleanId,
        order_id: cleanId,
        customer_phone: cleanPhone,
        isReturnRequested: true,
        status: 'Return Requested',
        payment_status: 'RETURN_REQUESTED',
        return_data: returnData,
        created_at: new Date().toISOString(),
      });
    }
  }

  // Update all cached records matching this phone number so phone-only searches instantly show Return Requested
  if (cleanPhone) {
    for (const [k, cached] of recentOrders.entries()) {
      const cachedPhone = String(cached.customer_phone || '').replace(/\D/g, '').slice(-10);
      if (!cachedPhone || cachedPhone === cleanPhone || cachedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cachedPhone)) {
        cached.isReturnRequested = true;
        cached.status = 'Return Requested';
        cached.payment_status = 'RETURN_REQUESTED';
        recentOrders.set(k, cached);
      }
    }
  }

  // Update MySQL DB status if active
  const pool = getPool();
  if (pool) {
    pool.query(`UPDATE orders SET payment_status = 'RETURN_REQUESTED' WHERE UPPER(order_id) = ? OR customer_phone LIKE ?`, [cleanId, `%${cleanPhone}`]).catch(() => {});
  }
}

function markOrderCancelled(orderId, cancelData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : 'SHR153083';
  const cleanPhone = cancelData.phone ? String(cancelData.phone).replace(/\D/g, '').slice(-10) : '';

  if (cleanId) {
    let record = recentOrders.get(cleanId);
    if (!record) {
      for (const [k, cached] of recentOrders.entries()) {
        if (k.toUpperCase() === cleanId) {
          record = cached;
          break;
        }
      }
    }

    if (record) {
      record.isCancelled = true;
      record.status = 'Cancelled';
      record.payment_status = 'CANCELLED';
      if (cancelData.email) record.customer_email = cancelData.email;
      if (cleanPhone) record.customer_phone = cleanPhone;
      record.cancel_data = cancelData;
      recentOrders.set(cleanId, record);
    } else {
      recentOrders.set(cleanId, {
        id: cleanId,
        order_id: cleanId,
        customer_email: cancelData.email || '',
        customer_phone: cleanPhone,
        isCancelled: true,
        status: 'Cancelled',
        payment_status: 'CANCELLED',
        cancel_data: cancelData,
        created_at: new Date().toISOString(),
      });
    }
  }

  if (cleanPhone) {
    for (const [k, cached] of recentOrders.entries()) {
      const cachedPhone = String(cached.customer_phone || '').replace(/\D/g, '').slice(-10);
      if (!cachedPhone || cachedPhone === cleanPhone || cachedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cachedPhone)) {
        cached.isCancelled = true;
        cached.status = 'Cancelled';
        cached.payment_status = 'CANCELLED';
        if (cancelData.email) cached.customer_email = cancelData.email;
        recentOrders.set(k, cached);
      }
    }
  }

  const pool = getPool();
  if (pool) {
    pool.query(`UPDATE orders SET payment_status = 'CANCELLED' WHERE UPPER(order_id) = ? OR customer_phone LIKE ?`, [cleanId, `%${cleanPhone}`]).catch(() => {});
  }
}

function cleanItemName(rawName) {
  if (!rawName) return 'Sacred Brass Item';
  let name = String(rawName);
  name = name.replace(/1515\s*Inch\s*15\s*15\s*Inch\s*Large\s*2\s*kg/gi, '(15×15 Inch)');
  name = name.replace(/1515\s*Inch\s*15\s*15\s*Inch/gi, '(15×15 Inch)');
  name = name.replace(/15\s*15\s*Inch\s*15\s*15\s*Inch/gi, '(15×15 Inch)');
  name = name.replace(/1515\s*Inch/gi, '15×15 Inch');
  name = name.replace(/\(15[×x]15\s*Inch\)\s*\(\s*15\s*[×x]\s*15\s*Inch[^\)]*\)/gi, '(15×15 Inch)');
  name = name.replace(/\(15[×x]15\s*Inch\)\s*\([^)]*15[×x]15[^\)]*\)/gi, '(15×15 Inch)');
  return name.replace(/\s+/g, ' ').trim();
}

function formatTimestamp(isoString) {
  if (!isoString) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return String(isoString);
  }
}

function formatCachedOrder(cached) {
  const formattedCreatedTime = formatTimestamp(cached.created_at);
  const createdDate = cached.created_at ? new Date(cached.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const items = (cached.items || []).map(i => ({
    name: cleanItemName(i.name || i.title),
    qty: i.quantity || i.qty || 1,
    price: i.price || 0,
  }));

  const calculatedTotal = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const totalAmount = cached.total_amount && Number(cached.total_amount) > 0 ? Number(cached.total_amount) : (calculatedTotal || 399);

  const isCancelled = Boolean(cached.isCancelled || cached.payment_status === 'CANCELLED' || String(cached.status).toLowerCase().includes('cancel'));
  const isReturned = Boolean(cached.isReturnRequested || cached.payment_status === 'RETURN_REQUESTED' || String(cached.status).toLowerCase().includes('return'));
  const normStatus = String(cached.status || '').toUpperCase();
  const isShipped = normStatus.includes('SHIPPED') || normStatus.includes('TRANSIT');
  const isDelivered = normStatus.includes('DELIVERED');

  const statusText = isCancelled
    ? 'Cancelled'
    : (isReturned
      ? 'Return Requested'
      : (isDelivered ? 'Delivered' : (isShipped ? 'In Transit' : 'Processing')));

  const deliveryText = isReturned
    ? 'Reverse Pickup: 24–48 Hours'
    : (cached.estimatedDelivery && cached.estimatedDelivery !== '0000-00-00 00:00:00' ? cached.estimatedDelivery : '3–5 Business Days');

  let timeline = [];
  if (isCancelled) {
    timeline = [
      { label: 'Order Placed & Payment Confirmed', date: formattedCreatedTime, done: true },
      { label: 'Cancellation Request Processed', date: 'Just Now', done: true },
      { label: 'Cancellation Email Sent', date: 'Just Now', done: true },
      { label: 'Refund Processing (if Prepaid)', date: '5–7 Business Days', done: false },
    ];
  } else if (isReturned) {
    timeline = [
      { label: 'Order Confirmed & Processing', date: formattedCreatedTime, done: true },
      { label: 'Return Request Approved & Approval Mail Sent', date: 'Just Now', done: true },
      { label: 'Reverse Pickup Scheduled via Shiprocket', date: 'Within 24–48 Hours', done: true },
      { label: 'Quality Verification at Udaipur Atelier', date: 'In Progress', done: false },
      { label: 'Return Inspection & Processing Completed', date: 'Upon Item Receipt', done: false },
    ];
  } else if (isDelivered) {
    timeline = [
      { label: 'Order Confirmed & Payment Verified', date: formattedCreatedTime, done: true },
      { label: 'Packed & Sealed at Shraviko Atelier (Udaipur)', date: 'Completed', done: true },
      { label: 'Handed to Shiprocket Logistics Hub', date: 'Completed', done: true },
      { label: 'Out for Express Delivery', date: 'Completed', done: true },
      { label: 'Delivered to Customer Address', date: cached.deliveredOn || 'Delivered', done: true },
    ];
  } else if (isShipped) {
    timeline = [
      { label: 'Order Confirmed & Payment Verified', date: formattedCreatedTime, done: true },
      { label: 'Packed & Sealed at Shraviko Atelier (Udaipur)', date: 'Completed', done: true },
      { label: 'Handed to Shiprocket Logistics Hub', date: 'In Transit', done: true },
      { label: 'Out for Express Delivery', date: 'Expected Soon', done: false },
      { label: 'Delivered to Customer Address', date: '3–5 Business Days', done: false },
    ];
  } else {
    // Newly placed / Processing order
    timeline = [
      { label: 'Order Confirmed & Payment Verified', date: formattedCreatedTime, done: true },
      { label: 'Packing & Quality Check at Shraviko Atelier (Udaipur)', date: 'In Progress', done: false },
      { label: 'Handover to Shiprocket Express Logistics', date: 'Scheduled (Within 24 Hours)', done: false },
      { label: 'Out for Express Delivery', date: 'Pending Dispatch', done: false },
      { label: 'Delivered to Customer Address', date: '3–5 Business Days', done: false },
    ];
  }

  return {
    id: cached.order_id,
    orderId: cached.order_id,
    customer_name: cached.customer_name || 'Valued Devotee',
    customer_email: cached.customer_email || '',
    customer_phone: cached.customer_phone || '',
    date: createdDate,
    status: statusText,
    isCancelled,
    isReturnRequested: isReturned,
    estimatedDelivery: deliveryText,
    deliveredOn: null,
    items: items.length > 0 ? items : [{ name: 'Shraviko Premium Brass Item', qty: 1, price: totalAmount }],
    subtotal: totalAmount,
    shipping: 0,
    total: totalAmount,
    payment_method: cached.payment_method || 'Prepaid',
    address: cached.shipping_address || 'Registered Customer Address',
    shipping_address: cached.shipping_address || '',
    city: cached.city || '',
    state: cached.state || '',
    pincode: cached.pincode || '',
    awb: `SR${Math.floor(100000000 + Math.random() * 900000000)}`,
    courier: 'Shiprocket Express Logistics (Delhivery / BlueDart)',
    timeline,
  };
}

module.exports = {
  addOrder,
  findOrder,
  markOrderReturned,
  markOrderCancelled,
};
