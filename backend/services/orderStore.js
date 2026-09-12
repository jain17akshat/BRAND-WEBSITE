/**
 * services/orderStore.js
 * ─────────────────────────────────────────────────────────
 * In-memory order registry & MySQL DB bridge for instant tracking lookup.
 */

const fs = require('fs');
const path = require('path');
const { saveOrder: saveToDb, getPool } = require('../database/db');
const { getProductPrice } = require('../data/catalog');

const STORE_FILE = path.join(__dirname, '../data/orders_store.json');

// In-memory fallback map for active runtime orders
const recentOrders = new Map();

function loadPersistedOrders() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      if (!data || !data.trim()) return;
      const list = JSON.parse(data);
      if (Array.isArray(list)) {
        list.forEach(ord => {
          if (ord && typeof ord === 'object' && (ord.order_id || ord.id)) {
            const cleanId = String(ord.order_id || ord.id).toUpperCase();
            const validatedOrd = {
              ...ord,
              items: Array.isArray(ord.items) ? ord.items : [],
            };
            recentOrders.set(cleanId, validatedOrd);
          }
        });
        console.log(`📦 Loaded ${recentOrders.size} orders into OrderStore memory from orders_store.json`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load orders_store.json:', err.message);
  }
}

function persistOrders() {
  try {
    const list = Array.from(recentOrders.values());
    fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('⚠️ Could not write orders_store.json:', err.message);
  }
}

// Auto-load on boot
loadPersistedOrders();

async function addOrder(orderData) {
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
    shiprocket_order_id: orderData.shiprocket_order_id || null,
    shipment_id: orderData.shipment_id || null,
    shiprocket_sync_status: orderData.shiprocket_sync_status || 'PENDING',
    created_at: new Date().toISOString(),
  };

  recentOrders.set(cleanId, record);
  persistOrders();

  // Await save to MySQL DB if pool active
  const pool = getPool();
  if (pool) {
    try {
      await saveToDb(orderData);
    } catch (err) {
      console.error('Failed to save order to MySQL DB:', err.stack || err.message);
      const { AppError } = require('../middleware/errorHandler');
      throw new AppError(`Database persistence failed: ${err.message}`, 500, 'DATABASE_ERROR');
    }
  }
}

async function findOrders(orderId, phone, email) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';
  const cleanEmail = email ? String(email).trim().toLowerCase() : '';

  if (!cleanId && !cleanPhone && !cleanEmail) return [];

  const matchedMap = new Map();

  // 1. Check in-memory recent orders
  for (const [k, cached] of recentOrders.entries()) {
    const cachedId = String(cached.order_id || cached.id || k).toUpperCase();
    const cachedPhone = String(cached.customer_phone || '').replace(/\D/g, '').slice(-10);
    const cachedEmail = String(cached.customer_email || '').trim().toLowerCase();

    const matchesId = !cleanId || (cachedId === cleanId);
    const matchesPhone = !cleanPhone || (cachedPhone === cleanPhone);
    const matchesEmail = !cleanEmail || (cachedEmail === cleanEmail);

    if (matchesId && matchesPhone && matchesEmail) {
      matchedMap.set(cachedId, formatCachedOrder(cached));
    }
  }

  // 2. Check MySQL Database (if pool active)
  const pool = getPool();
  if (pool) {
    try {
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (cleanId) {
        query += ' AND UPPER(order_id) = ?';
        params.push(cleanId);
      }
      if (cleanPhone) {
        query += ' AND customer_phone LIKE ?';
        params.push(`%${cleanPhone}`);
      }
      if (cleanEmail) {
        query += ' AND LOWER(customer_email) = ?';
        params.push(cleanEmail);
      }

      query += ' ORDER BY id DESC LIMIT 50';

      const [rows] = await pool.query(query, params);
      if (rows && rows.length > 0) {
        for (const row of rows) {
          const rowId = String(row.order_id).toUpperCase();
          if (!matchedMap.has(rowId)) {
            let items = [];
            try { items = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : row.items_json; } catch {}
            matchedMap.set(rowId, formatCachedOrder({
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
              shiprocket_order_id: row.shiprocket_order_id || null,
              shipment_id: row.shipment_id || null,
              shiprocket_sync_status: row.shiprocket_sync_status || 'PENDING',
              inventory_deducted: !!row.inventory_deducted,
              status: row.status,
              created_at: row.created_at,
            }));
          }
        }
      }
    } catch (err) {
      console.error('OrderStore DB multi-lookup error:', err.stack || err.message);
    }
  }

  const resultList = Array.from(matchedMap.values());
  resultList.sort((a, b) => {
    const timeA = new Date(a.created_at || a.date || 0).getTime();
    const timeB = new Date(b.created_at || b.date || 0).getTime();
    return timeB - timeA;
  });

  return resultList;
}

async function findOrder(orderId, phone, email) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';
  const cleanEmail = email ? String(email).trim().toLowerCase() : '';

  // Require orderId AND at least one valid ownership identifier (phone or email)
  if (!cleanId || (!cleanPhone && !cleanEmail)) {
    return null;
  }

  const orders = await findOrders(cleanId, cleanPhone, cleanEmail);
  if (!orders || orders.length === 0) return null;

  const order = orders[0];
  const orderPhone = String(order.customer_phone || '').replace(/\D/g, '').slice(-10);
  const orderEmail = String(order.customer_email || '').trim().toLowerCase();

  // Verify BOTH identifiers if both are provided
  if (cleanPhone && orderPhone && cleanPhone !== orderPhone) {
    return null;
  }
  if (cleanEmail && orderEmail && cleanEmail !== orderEmail) {
    return null;
  }

  return order;
}

async function markOrderReturned(orderId, returnData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  const cleanPhone = returnData.phone ? String(returnData.phone).replace(/\D/g, '').slice(-10) : '';
  const targetStatus = returnData.status || 'RETURN_INITIATED'; // Canonical status: RETURN_INITIATED or RETURNED

  if (!cleanId) return;

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
    record.status = targetStatus;
    if (returnData.payment_status) record.payment_status = returnData.payment_status;
    if (cleanPhone) record.customer_phone = cleanPhone;
    if (returnData.shiprocket_return_id) record.shiprocket_return_id = returnData.shiprocket_return_id;
    record.return_data = returnData;
    recentOrders.set(record.id || cleanId, record);
  } else {
    recentOrders.set(cleanId, {
      id: cleanId,
      order_id: cleanId,
      customer_phone: cleanPhone,
      isReturnRequested: true,
      status: targetStatus,
      payment_status: returnData.payment_status || 'PAID',
      shiprocket_return_id: returnData.shiprocket_return_id || null,
      return_data: returnData,
      created_at: new Date().toISOString(),
    });
  }
  persistOrders();

  // Await MySQL DB status update for single target order by order_id
  const pool = getPool();
  if (pool) {
    try {
      if (returnData.payment_status) {
        await pool.query(
          `UPDATE orders SET status = ?, payment_status = ? WHERE UPPER(order_id) = ?`,
          [targetStatus, returnData.payment_status, cleanId]
        );
      } else {
        await pool.query(
          `UPDATE orders SET status = ? WHERE UPPER(order_id) = ?`,
          [targetStatus, cleanId]
        );
      }
    } catch (err) {
      console.error('OrderStore DB update error on return:', err.message);
      const { AppError } = require('../middleware/errorHandler');
      throw new AppError(`Database update failed: ${err.message}`, 500, 'DATABASE_ERROR');
    }
  }
}

async function markOrderCancelled(orderId, cancelData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  const cleanPhone = cancelData.phone ? String(cancelData.phone).replace(/\D/g, '').slice(-10) : '';

  if (!cleanId) return;

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
    if (record.inventory_deducted) {
      const { restoreInventoryForCart } = require('../data/catalog');
      await restoreInventoryForCart(record.items || []);
      record.inventory_deducted = false;
    }
    record.isCancelled = true;
    record.status = 'CANCELLED';
    if (cancelData.payment_status) record.payment_status = cancelData.payment_status;
    if (cancelData.email) record.customer_email = cancelData.email;
    if (cleanPhone) record.customer_phone = cleanPhone;
    record.cancel_data = cancelData;
    recentOrders.set(record.id || cleanId, record);
  } else {
    recentOrders.set(cleanId, {
      id: cleanId,
      order_id: cleanId,
      customer_email: cancelData.email || '',
      customer_phone: cleanPhone,
      isCancelled: true,
      status: 'CANCELLED',
      inventory_deducted: false,
      payment_status: cancelData.payment_status || 'PAID',
      cancel_data: cancelData,
      created_at: new Date().toISOString(),
    });
  }
  persistOrders();

  const pool = getPool();
  if (pool) {
    try {
      if (cancelData.payment_status) {
        await pool.query(
          `UPDATE orders SET status = 'CANCELLED', payment_status = ?, inventory_deducted = 0 WHERE UPPER(order_id) = ?`,
          [cancelData.payment_status, cleanId]
        );
      } else {
        await pool.query(
          `UPDATE orders SET status = 'CANCELLED', inventory_deducted = 0 WHERE UPPER(order_id) = ?`,
          [cleanId]
        );
      }
    } catch (err) {
      console.error('OrderStore DB update error on cancel:', err.message);
      const { AppError } = require('../middleware/errorHandler');
      throw new AppError(`Database update failed: ${err.message}`, 500, 'DATABASE_ERROR');
    }
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
  const items = (cached.items || []).map(i => {
    let price = Number(i.price || 0);
    if (!price || isNaN(price)) {
      try { price = getProductPrice(i); } catch {}
    }
    return {
      name: cleanItemName(i.name || i.title),
      qty: Number(i.quantity || i.qty || 1),
      price: price > 0 ? price : 349,
    };
  });

  const calculatedTotal = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const totalAmount = (cached.total_amount && Number(cached.total_amount) > 0)
    ? Number(cached.total_amount)
    : ((cached.total && Number(cached.total) > 0)
      ? Number(cached.total)
      : (calculatedTotal > 0 ? calculatedTotal : 349));

  const normStatus = String(cached.status || '').toUpperCase();
  const normPayStatus = String(cached.payment_status || '').toUpperCase();

  let canonicalStatus = 'PROCESSING';
  if (normStatus === 'CANCELLED' || normPayStatus === 'CANCELLED' || cached.isCancelled) {
    canonicalStatus = 'CANCELLED';
  } else if (normStatus === 'RETURNED') {
    canonicalStatus = 'RETURNED';
  } else if (normStatus === 'RETURN_INITIATED' || normStatus === 'RETURN REQUESTED' || normPayStatus === 'RETURN_REQUESTED' || cached.isReturnRequested) {
    canonicalStatus = 'RETURN_INITIATED';
  } else if (normStatus.includes('DELIVERED')) {
    canonicalStatus = 'DELIVERED';
  } else if (normStatus.includes('SHIPPED') || normStatus.includes('TRANSIT')) {
    canonicalStatus = 'IN_TRANSIT';
  }

  const isCancelled = canonicalStatus === 'CANCELLED';
  const isReturned = canonicalStatus === 'RETURN_INITIATED' || canonicalStatus === 'RETURNED';

  let displayStatus = 'Processing';
  if (canonicalStatus === 'CANCELLED') displayStatus = 'Cancelled';
  else if (canonicalStatus === 'RETURN_INITIATED') displayStatus = 'Return Requested';
  else if (canonicalStatus === 'RETURNED') displayStatus = 'Returned';
  else if (canonicalStatus === 'DELIVERED') displayStatus = 'Delivered';
  else if (canonicalStatus === 'IN_TRANSIT') displayStatus = 'In Transit';

  const isShipped = canonicalStatus === 'IN_TRANSIT';
  const isDelivered = canonicalStatus === 'DELIVERED';

  const deliveryText = isReturned
    ? 'Reverse Pickup: 24–48 Hours'
    : (cached.estimatedDelivery && cached.estimatedDelivery !== '0000-00-00 00:00:00' ? cached.estimatedDelivery : '3–5 Business Days');

  let timeline = [];
  const isCodOrder = String(cached.payment_method || '').toUpperCase().includes('COD') || String(cached.payment_status || '').toUpperCase().includes('COD');
  const orderConfirmedLabel = isCodOrder ? 'Order Confirmed (Cash on Delivery)' : 'Order Confirmed & Payment Verified';

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
      { label: 'Return Inspection & Processing Completed', date: canonicalStatus === 'RETURNED' ? 'Completed' : 'Upon Item Receipt', done: canonicalStatus === 'RETURNED' },
    ];
  } else if (isDelivered) {
    timeline = [
      { label: 'Order Confirmed & Delivered', date: formattedCreatedTime, done: true },
      { label: 'Packed & Sealed at Shraviko Atelier (Udaipur)', date: 'Completed', done: true },
      { label: 'Handed to Shiprocket Logistics Hub', date: 'Completed', done: true },
      { label: 'Out for Express Delivery', date: 'Completed', done: true },
      { label: 'Delivered to Customer Address', date: cached.deliveredOn || 'Delivered', done: true },
    ];
  } else if (isShipped) {
    timeline = [
      { label: orderConfirmedLabel, date: formattedCreatedTime, done: true },
      { label: 'Packed & Sealed at Shraviko Atelier (Udaipur)', date: 'Completed', done: true },
      { label: 'Handed to Shiprocket Logistics Hub', date: 'In Transit', done: true },
      { label: 'Out for Express Delivery', date: 'Expected Soon', done: false },
      { label: 'Delivered to Customer Address', date: '3–5 Business Days', done: false },
    ];
  } else {
    // Newly placed / Processing order
    timeline = [
      { label: orderConfirmedLabel, date: formattedCreatedTime, done: true },
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
    status: canonicalStatus,
    displayStatus,
    payment_status: String(cached.payment_method || '').toUpperCase() === 'PREPAID' ? (cached.payment_status || 'PAID') : (isCancelled ? 'CANCELLED' : (isReturned ? 'RETURN_REQUESTED' : 'COD_PENDING')),
    isCancelled,
    isReturnRequested: isReturned,
    estimatedDelivery: deliveryText,
    deliveredOn: null,
    items: items.length > 0 ? items : [{ name: 'Shraviko Premium Brass Item', qty: 1, price: totalAmount }],
    subtotal: totalAmount,
    shipping: 0,
    total: totalAmount,
    payment_method: String(cached.payment_method || '').toUpperCase() === 'PREPAID' ? 'Prepaid' : 'COD',
    address: cached.shipping_address || 'Registered Customer Address',
    shipping_address: cached.shipping_address || '',
    city: cached.city || '',
    state: cached.state || '',
    pincode: cached.pincode || '',
    awb: cached.awb || null,
    shiprocket_order_id: cached.shiprocket_order_id || null,
    shipment_id: cached.shipment_id || null,
    shiprocket_sync_status: cached.shiprocket_sync_status || 'PENDING',
    shiprocket_return_id: cached.shiprocket_return_id || null,
    courier: 'Shiprocket Express Logistics (Delhivery / BlueDart)',
    timeline,
  };
}

async function markOrderPaid(orderId, paymentData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  if (!cleanId) return;

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
    record.payment_status = 'PAID';
    record.status = 'Processing';
    if (paymentData.payment_id) record.payment_id = paymentData.payment_id;
    recentOrders.set(record.id || cleanId, record);
  }

  const pool = getPool();
  if (pool) {
    try {
      await pool.query(`UPDATE orders SET payment_status = 'PAID' WHERE UPPER(order_id) = ?`, [cleanId]);
    } catch (err) {
      console.error('OrderStore DB update error on markOrderPaid:', err.message);
    }
  }
}

async function markOrderPaymentFailed(orderId, failureData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  if (!cleanId) return;

  let record = recentOrders.get(cleanId);
  if (record) {
    record.payment_status = 'FAILED';
    record.status = 'Payment Failed';
    recentOrders.set(record.id || cleanId, record);
  }

  const pool = getPool();
  if (pool) {
    try {
      await pool.query(`UPDATE orders SET payment_status = 'FAILED' WHERE UPPER(order_id) = ?`, [cleanId]);
    } catch (err) {
      console.error('OrderStore DB update error on markOrderPaymentFailed:', err.message);
    }
  }
}

async function markOrderRefunded(orderId, refundData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  if (!cleanId) return;

  let record = recentOrders.get(cleanId);
  if (record) {
    record.payment_status = 'REFUNDED';
    record.status = 'Refunded';
    recentOrders.set(record.id || cleanId, record);
  }

  const pool = getPool();
  if (pool) {
    try {
      await pool.query(`UPDATE orders SET payment_status = 'REFUNDED' WHERE UPPER(order_id) = ?`, [cleanId]);
    } catch (err) {
      console.error('OrderStore DB update error on markOrderRefunded:', err.message);
    }
  }
}

async function updateShiprocketSync(orderId, syncData = {}) {
  const cleanId = orderId ? String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase() : '';
  if (!cleanId) return;

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
    if (syncData.shiprocket_order_id !== undefined) record.shiprocket_order_id = syncData.shiprocket_order_id;
    if (syncData.shipment_id !== undefined) record.shipment_id = syncData.shipment_id;
    if (syncData.shiprocket_sync_status !== undefined) record.shiprocket_sync_status = syncData.shiprocket_sync_status;
    recentOrders.set(record.id || cleanId, record);
    persistOrders();
  }

  const { updateOrderShiprocketInfo } = require('../database/db');
  await updateOrderShiprocketInfo(cleanId, syncData);
}

async function getAllOrders(limit = 100) {
  const matchedMap = new Map();

  for (const [k, cached] of recentOrders.entries()) {
    const cachedId = String(cached.order_id || cached.id || k).toUpperCase();
    matchedMap.set(cachedId, formatCachedOrder(cached));
  }

  const pool = getPool();
  if (pool) {
    try {
      const [rows] = await pool.query(`SELECT * FROM orders ORDER BY id DESC LIMIT ?`, [Number(limit) || 100]);
      if (rows && rows.length > 0) {
        for (const row of rows) {
          const rowId = String(row.order_id).toUpperCase();
          if (!matchedMap.has(rowId)) {
            let items = [];
            try { items = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : row.items_json; } catch {}
            matchedMap.set(rowId, formatCachedOrder({
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
              status: row.status,
              created_at: row.created_at,
            }));
          }
        }
      }
    } catch (err) {
      console.error('OrderStore DB getAllOrders error:', err.message);
    }
  }

  return Array.from(matchedMap.values());
}

module.exports = {
  addOrder,
  findOrder,
  findOrders,
  getAllOrders,
  updateShiprocketSync,
  markOrderReturned,
  markOrderCancelled,
  markOrderPaid,
  markOrderPaymentFailed,
  markOrderRefunded,
};
