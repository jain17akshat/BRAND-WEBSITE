/**
 * database/db.js
 * ─────────────────────────────────────────────────────────
 * Hostinger MySQL Database Manager & Table Auto-Initializer.
 */

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (err) {
  // mysql2 module not installed locally yet
}

let pool = null;

function getPool() {
  if (pool) return pool;
  if (!mysql) {
    return null;
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || '';
  const dbPass = process.env.DB_PASS || '';
  const dbName = process.env.DB_NAME || '';

  if (!dbUser || !dbName) {
    console.log('ℹ️ Hostinger MySQL DB credentials not set in .env. (Add DB_USER + DB_NAME to enable)');
    return null;
  }

  pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
    port: parseInt(process.env.DB_PORT || '3306', 10),
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

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
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

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

    conn.release();
    console.log(`✅ Hostinger MySQL Database connected & tables verified! (${process.env.DB_NAME})`);
    return true;
  } catch (err) {
    console.error('⚠️ Database init error:', err.message);
    return false;
  }
}

/**
 * saveOrder — helper to insert/update order into MySQL
 */
async function saveOrder(orderData) {
  const p = getPool();
  if (!p) return null;

  try {
    const [result] = await p.query(
      `INSERT INTO orders 
       (order_id, customer_name, customer_email, customer_phone, total_amount, payment_method, payment_status, shipping_address, items_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE payment_status = VALUES(payment_status)`,
      [
        orderData.order_id,
        orderData.customer_name || 'Valued Customer',
        orderData.customer_email || 'customer@example.com',
        orderData.customer_phone || '',
        orderData.total_amount || 0,
        orderData.payment_method || 'Prepaid',
        orderData.payment_status || 'PAID',
        orderData.shipping_address || '',
        JSON.stringify(orderData.items || []),
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
  }
}

/**
 * saveReturnRequest — helper to log return request into MySQL
 */
async function saveReturnRequest(returnData) {
  const p = getPool();
  if (!p) return null;

  try {
    const [result] = await p.query(
      `INSERT INTO returns
       (return_id, order_id, customer_name, customer_email, customer_phone, reason, bank_details_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        returnData.return_id,
        returnData.order_id,
        returnData.customer_name || '',
        returnData.customer_email || '',
        returnData.customer_phone || '',
        returnData.reason || '',
        JSON.stringify(returnData.bank_details || {}),
        'PENDING',
      ]
    );
    return result;
  } catch (err) {
    console.error('⚠️ Could not save return to database:', err.message);
  }
}

module.exports = {
  getPool,
  initDatabase,
  saveOrder,
  saveReturnRequest,
};
