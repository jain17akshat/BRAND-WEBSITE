/**
 * database/db.js
 * ─────────────────────────────────────────────────────────
 * Hostinger MySQL Database Manager & Table Auto-Initializer.
 */

const config = require('../config');

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (err) {
  // mysql2 module optional in mock mode
}

let pool = null;

function getPool() {
  if (pool) return pool;
  if (!mysql || config.db.isMock) {
    return null;
  }

  const { host, port, name, user, password } = config.db;

  if (!user || !name) {
    console.log('ℹ️ Hostinger MySQL DB credentials not set in config. (Add DB_USER + DB_NAME to enable)');
    return null;
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database: name,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}


/**
 * initDatabase — automatically creates tables if they don't exist
 */
async function initDatabase() {
  const p = getPool();
  if (!p) return false;

  try {
    const conn = await p.getConnection();

    // 1. Create orders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        total_amount DECIMAL(10,2),
        payment_method VARCHAR(50),
        payment_status VARCHAR(50),
        shipping_address TEXT,
        items_json JSON,
        shiprocket_order_id VARCHAR(100),
        shipment_id VARCHAR(100),
        shiprocket_sync_status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Guarded migrations for existing database schemas
    const alterColumns = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_order_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipment_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_sync_status VARCHAR(50) DEFAULT 'PENDING'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PROCESSING'`,
    ];
    for (const sql of alterColumns) {
      try {
        await conn.query(sql);
      } catch (colErr) {
        if (!colErr.message.includes('Duplicate column')) {
          console.warn('⚠️ Column migration notice:', colErr.message);
        }
      }
    }

    // Backfill historical lifecycle status for existing database records safely
    try {
      await conn.query(`UPDATE orders SET status = 'CANCELLED' WHERE (status IS NULL OR status = '' OR status = 'PROCESSING') AND payment_status = 'CANCELLED'`);
      await conn.query(`UPDATE orders SET status = 'RETURNED' WHERE (status IS NULL OR status = '' OR status = 'PROCESSING') AND payment_status = 'RETURNED'`);
      await conn.query(`UPDATE orders SET status = 'RETURN_INITIATED' WHERE (status IS NULL OR status = '' OR status = 'PROCESSING') AND payment_status = 'RETURN_REQUESTED'`);
    } catch (backfillErr) {
      console.warn('⚠️ Historical status backfill notice:', backfillErr.message);
    }

    // 2. Create returns table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS returns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        return_id VARCHAR(50) UNIQUE NOT NULL,
        order_id VARCHAR(50),
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        reason TEXT,
        bank_details_json JSON,
        shiprocket_return_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    try {
      await conn.query(`ALTER TABLE returns ADD COLUMN IF NOT EXISTS shiprocket_return_id VARCHAR(100)`);
    } catch (colErr) {
      if (!colErr.message.includes('Duplicate column')) {
        console.warn('⚠️ Column migration notice for returns table:', colErr.message);
      }
    }

    // 3. Create customers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        city VARCHAR(100),
        pincode VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create product_reviews table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        title VARCHAR(255),
        comment TEXT,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        verified_buyer TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create corporate_enquiries table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS corporate_enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        enquiry_id VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        company_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        quantity VARCHAR(100),
        budget VARCHAR(100),
        occasion VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Create subscribers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscriber_id VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conn.release();
    console.log(`✅ Hostinger MySQL Database connected & tables verified! (${process.env.DB_NAME})`);
    return true;
  } catch (err) {
    console.error('⚠️ Database init error:', err.message);
    return false;
  }
}

// In-memory fallback storage for product reviews, corporate enquiries, and subscribers when DB is offline
const inMemoryReviews = [];
const inMemoryCorporateEnquiries = [];
const inMemorySubscribers = [];

/**
 * saveOrder — helper to insert/update order into MySQL
 */
async function saveOrder(orderData) {
  const p = getPool();
  if (!p) return null;

  try {
    const [result] = await p.query(
      `INSERT INTO orders 
       (order_id, customer_name, customer_email, customer_phone, total_amount, payment_method, payment_status, status, shipping_address, items_json, shiprocket_order_id, shipment_id, shiprocket_sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         payment_status = VALUES(payment_status),
         status = COALESCE(VALUES(status), status),
         shiprocket_order_id = COALESCE(VALUES(shiprocket_order_id), shiprocket_order_id),
         shipment_id = COALESCE(VALUES(shipment_id), shipment_id),
         shiprocket_sync_status = COALESCE(VALUES(shiprocket_sync_status), shiprocket_sync_status)`,
      [
        orderData.order_id,
        orderData.customer_name || 'Valued Customer',
        orderData.customer_email || 'customer@example.com',
        orderData.customer_phone || '',
        orderData.total_amount || 0,
        orderData.payment_method || 'Prepaid',
        orderData.payment_status || 'PAID',
        orderData.status || 'PROCESSING',
        orderData.shipping_address || '',
        JSON.stringify(orderData.items || []),
        orderData.shiprocket_order_id || null,
        orderData.shipment_id || null,
        orderData.shiprocket_sync_status || 'PENDING',
      ]
    );

    // Save/update customer profile in customers table
    if (orderData.customer_email) {
      await p.query(
        `INSERT INTO customers (name, email, phone, city, pincode)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone)`,
        [
          orderData.customer_name || '',
          orderData.customer_email,
          orderData.customer_phone || '',
          orderData.city || '',
          orderData.pincode || '',
        ]
      ).catch(() => {});
    }

    return result;
  } catch (err) {
    console.error('⚠️ Could not save order to database:', err.message);
    throw err;
  }
}

/**
 * updateOrderShiprocketInfo — helper to update shiprocket identifiers and sync status for an existing order in MySQL
 */
async function updateOrderShiprocketInfo(orderId, syncData = {}) {
  const p = getPool();
  if (!p) return null;

  try {
    const cleanId = String(orderId || '').replace(/^[#\s]+/, '').trim().toUpperCase();
    const [result] = await p.query(
      `UPDATE orders 
       SET shiprocket_order_id = COALESCE(?, shiprocket_order_id),
           shipment_id = COALESCE(?, shipment_id),
           shiprocket_sync_status = COALESCE(?, shiprocket_sync_status)
       WHERE UPPER(order_id) = ?`,
      [
        syncData.shiprocket_order_id || null,
        syncData.shipment_id || null,
        syncData.shiprocket_sync_status || null,
        cleanId,
      ]
    );
    return result;
  } catch (err) {
    console.error('⚠️ Could not update Shiprocket info in DB:', err.message);
    return null;
  }
}

/**
 * saveReturnRequest — helper to log return request into MySQL
 */
async function saveReturnRequest(returnData) {
  const p = getPool();
  if (!p) return { success: true, mock: true };

  try {
    // Check if a return request for this order_id already exists in DB
    const cleanId = String(returnData.order_id || '').trim().toUpperCase();
    if (cleanId) {
      const [existing] = await p.query(
        `SELECT id FROM returns WHERE UPPER(order_id) = ? LIMIT 1`,
        [cleanId]
      );

      if (existing && existing.length > 0) {
        console.warn(`⚠️ Duplicate return request attempt for Order #${cleanId} blocked.`);
        const { AppError } = require('../middleware/errorHandler');
        throw new AppError('A return request has already been submitted for this order.', 400, 'DUPLICATE_RETURN');
      }
    }

    const [result] = await p.query(
      `INSERT INTO returns
       (return_id, order_id, customer_name, customer_email, customer_phone, reason, bank_details_json, shiprocket_return_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        returnData.return_id,
        returnData.order_id,
        returnData.customer_name || '',
        returnData.customer_email || '',
        returnData.customer_phone || '',
        returnData.reason || '',
        JSON.stringify(returnData.bank_details || {}),
        returnData.shiprocket_return_id || null,
        'PENDING',
      ]
    );
    return result;
  } catch (err) {
    console.error('⚠️ Could not save return to database:', err.message);
    throw err;
  }
}

/**
 * saveReview — helper to persist a product review to MySQL (and in-memory)
 */
async function saveReview(reviewData) {
  const record = {
    id: Date.now(),
    product_id: String(reviewData.product_id || reviewData.productId || 'ALL').trim(),
    rating: parseInt(reviewData.rating || 5, 10),
    title: reviewData.title || '',
    comment: reviewData.comment || reviewData.review_text || '',
    customer_name: reviewData.customer_name || reviewData.name || 'Valued Devotee',
    customer_email: reviewData.customer_email || reviewData.email || '',
    verified_buyer: reviewData.verified_buyer !== false ? 1 : 0,
    created_at: new Date().toISOString(),
  };

  inMemoryReviews.unshift(record);

  const p = getPool();
  if (!p) return record;

  try {
    const [res] = await p.query(
      `INSERT INTO product_reviews 
       (product_id, rating, title, comment, customer_name, customer_email, verified_buyer)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        record.product_id,
        record.rating,
        record.title,
        record.comment,
        record.customer_name,
        record.customer_email,
        record.verified_buyer,
      ]
    );
    record.id = res.insertId;
    return record;
  } catch (err) {
    console.error('⚠️ Could not save review to DB:', err.message);
    return record;
  }
}

/**
 * getReviewsByProduct — fetches all reviews for a product from DB & memory
 */
async function getReviewsByProduct(productId) {
  const cleanId = String(productId || '').trim();
  const p = getPool();

  if (p) {
    try {
      let query = `SELECT * FROM product_reviews ORDER BY id DESC LIMIT 100`;
      let params = [];
      if (cleanId && cleanId.toUpperCase() !== 'ALL') {
        query = `SELECT * FROM product_reviews WHERE product_id = ? OR product_id = 'ALL' ORDER BY id DESC LIMIT 100`;
        params = [cleanId];
      }
      const [rows] = await p.query(query, params);
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.error('⚠️ Could not fetch reviews from DB:', err.message);
    }
  }

  // Fallback to in-memory reviews
  if (cleanId && cleanId.toUpperCase() !== 'ALL') {
    return inMemoryReviews.filter(r => r.product_id === cleanId || r.product_id === 'ALL');
  }
  return inMemoryReviews;
}

/**
 * saveCorporateEnquiry — helper to persist corporate bulk enquiry to MySQL (and in-memory)
 */
async function saveCorporateEnquiry(enquiryData) {
  const record = {
    id: enquiryData.enquiryId || enquiryData.id,
    enquiryId: enquiryData.enquiryId || enquiryData.id,
    fullName: enquiryData.fullName || '',
    companyName: enquiryData.companyName || '',
    email: enquiryData.email || '',
    phone: enquiryData.phone || '',
    quantity: enquiryData.quantity || '50-100',
    budget: enquiryData.budget || '1000-2500',
    occasion: enquiryData.occasion || 'Corporate Gifting',
    message: enquiryData.message || '',
    createdAt: new Date().toISOString(),
  };

  inMemoryCorporateEnquiries.unshift(record);

  const p = getPool();
  if (!p) return record;

  try {
    await p.query(
      `INSERT INTO corporate_enquiries
       (enquiry_id, full_name, company_name, email, phone, quantity, budget, occasion, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.enquiryId,
        record.fullName,
        record.companyName,
        record.email,
        record.phone,
        record.quantity,
        record.budget,
        record.occasion,
        record.message,
      ]
    );
    return record;
  } catch (err) {
    console.error('⚠️ Could not save corporate enquiry to DB:', err.message);
    return record;
  }
}

/**
 * getCorporateEnquiries — fetches recent corporate enquiries from DB & memory
 */
async function getCorporateEnquiries() {
  const p = getPool();
  if (p) {
    try {
      const [rows] = await p.query(`SELECT * FROM corporate_enquiries ORDER BY id DESC LIMIT 100`);
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.enquiry_id || r.id,
          enquiryId: r.enquiry_id,
          fullName: r.full_name,
          companyName: r.company_name,
          email: r.email,
          phone: r.phone,
          quantity: r.quantity,
          budget: r.budget,
          occasion: r.occasion,
          message: r.message,
          createdAt: r.created_at,
        }));
      }
    } catch (err) {
      console.error('⚠️ Could not fetch corporate enquiries from DB:', err.message);
    }
  }

  return inMemoryCorporateEnquiries;
}

/**
 * saveSubscriber — helper to persist launch subscriber to MySQL (and in-memory)
 */
async function saveSubscriber(subscriberData) {
  const record = {
    id: subscriberData.subscriberId || subscriberData.id,
    subscriberId: subscriberData.subscriberId || subscriberData.id,
    email: subscriberData.email || '',
    purpose: subscriberData.purpose || 'General Energy Stones',
    createdAt: new Date().toISOString(),
  };

  inMemorySubscribers.unshift(record);

  const p = getPool();
  if (!p) return record;

  try {
    await p.query(
      `INSERT INTO subscribers (subscriber_id, email, purpose) VALUES (?, ?, ?)`,
      [record.subscriberId, record.email, record.purpose]
    );
    return record;
  } catch (err) {
    console.error('⚠️ Could not save subscriber to DB:', err.message);
    return record;
  }
}

/**
 * getSubscribers — fetches subscribers list from DB & memory
 */
async function getSubscribers() {
  const p = getPool();
  if (p) {
    try {
      const [rows] = await p.query(`SELECT * FROM subscribers ORDER BY id DESC LIMIT 1000`);
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.subscriber_id || r.id,
          subscriberId: r.subscriber_id,
          email: r.email,
          purpose: r.purpose,
          createdAt: r.created_at,
        }));
      }
    } catch (err) {
      console.error('⚠️ Could not fetch subscribers from DB:', err.message);
    }
  }

  return inMemorySubscribers;
}

/**
 * getReturnRequestsByPhone — fetches return records from DB for a customer phone number
 */
async function getReturnRequestsByPhone(phone) {
  const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';
  if (!cleanPhone) return [];

  const p = getPool();
  if (p) {
    try {
      const [rows] = await p.query(
        `SELECT * FROM returns WHERE customer_phone LIKE ? ORDER BY id DESC LIMIT 50`,
        [`%${cleanPhone}`]
      );
      if (rows && rows.length > 0) {
        return rows.map(r => {
          let details = {};
          try { details = typeof r.bank_details_json === 'string' ? JSON.parse(r.bank_details_json) : (r.bank_details_json || {}); } catch {}
          return {
            id: r.return_id,
            return_id: r.return_id,
            order_id: r.order_id,
            customer_name: r.customer_name,
            customer_email: r.customer_email,
            customer_phone: r.customer_phone,
            reason: r.reason,
            bank_details: details,
            shiprocket_return_id: r.shiprocket_return_id,
            status: r.status || 'APPROVED',
            created_at: r.created_at,
          };
        });
      }
    } catch (err) {
      console.error('⚠️ Could not fetch return requests from DB:', err.message);
    }
  }
  return [];
}

module.exports = {
  getPool,
  initDatabase,
  saveOrder,
  updateOrderShiprocketInfo,
  saveReturnRequest,
  getReturnRequestsByPhone,
  saveReview,
  getReviewsByProduct,
  saveCorporateEnquiry,
  getCorporateEnquiries,
  saveSubscriber,
  getSubscribers,
};

