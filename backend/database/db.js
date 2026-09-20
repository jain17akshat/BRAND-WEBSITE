/**
 * database/db.js
 * ─────────────────────────────────────────────────────────
 * Hostinger MySQL Database Manager & Table Auto-Initializer.
 * Master Order & Financial Record Store.
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

  // Safety guard for test environment
  if (process.env.NODE_ENV === 'test') {
    const dbName = config.db.name || process.env.DB_NAME;
    const dbHost = config.db.host || process.env.DB_HOST;
    const dbPort = config.db.port || process.env.DB_PORT;

    if (!dbName || dbName !== 'shraviko_test') {
      throw new Error(`❌ FATAL SAFETY GUARD TRIGGERED: NODE_ENV is 'test' but DB_NAME is '${dbName}'. Test environment MUST connect to 'shraviko_test'. Halting execution to prevent accidental production database modification.`);
    }
    if (dbPort && Number(dbPort) === 3306 && dbHost && (dbHost.includes('hostinger') || dbHost.includes('srv'))) {
      throw new Error(`❌ FATAL SAFETY GUARD TRIGGERED: Refusal to connect test suite to production database host '${dbHost}:${dbPort}'. Execution halted.`);
    }
  }

  const { host: rawHost, port, name, user, password } = config.db;
  const host = (!rawHost || rawHost === 'localhost') ? '127.0.0.1' : rawHost;

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
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS credit_note_number VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_id VARCHAR(100)`,
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

    // 3b. Create invoice sequences table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS invoice_sequences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        financial_year VARCHAR(10) UNIQUE NOT NULL,
        current_value INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3c. Create credit note sequences table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS credit_note_sequences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        financial_year VARCHAR(10) UNIQUE NOT NULL,
        current_value INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create products table (for atomic inventory control)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        stock_quantity INT DEFAULT 100,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    try {
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS inventory_deducted TINYINT(1) DEFAULT 0`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100)`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_date TIMESTAMP`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_status VARCHAR(20) DEFAULT 'NONE'`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_sent_at TIMESTAMP NULL`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_error TEXT`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_retry_count INT DEFAULT 0`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_next_retry_at TIMESTAMP NULL`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_status VARCHAR(20) DEFAULT 'NONE'`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_sent_at TIMESTAMP NULL`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_error TEXT`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_retry_count INT DEFAULT 0`);
      await conn.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_next_retry_at TIMESTAMP NULL`);
    } catch (colErr) {
      if (!colErr.message.includes('Duplicate column')) {
        console.warn('⚠️ Column migration notice for inventory_deducted/invoice_number/emails:', colErr.message);
      }
    }

    // 5. Create product_reviews table
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

    // 6. Create corporate_enquiries table
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

    // 7. Create subscribers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscriber_id VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Create gst_transactions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS gst_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_type VARCHAR(50) NOT NULL,
        order_id VARCHAR(50) NOT NULL,
        invoice_id INT,
        invoice_number VARCHAR(100),
        invoice_date TIMESTAMP NULL,
        credit_note_id INT,
        credit_note_number VARCHAR(100),
        credit_note_date TIMESTAMP NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_name VARCHAR(255),
        customer_gstin VARCHAR(20),
        billing_state VARCHAR(100),
        shipping_state VARCHAR(100),
        place_of_supply VARCHAR(100) NOT NULL,
        supply_type VARCHAR(20) NOT NULL,
        b2b_b2c VARCHAR(10) NOT NULL,
        payment_mode VARCHAR(50),
        sku VARCHAR(100),
        product_title VARCHAR(255),
        hsn_sac VARCHAR(20),
        quantity INT DEFAULT 1,
        unit_price DECIMAL(10,2) DEFAULT 0.00,
        discount DECIMAL(10,2) DEFAULT 0.00,
        taxable_value DECIMAL(10,2) NOT NULL,
        gst_rate DECIMAL(5,2) NOT NULL,
        cgst DECIMAL(10,2) DEFAULT 0.00,
        sgst DECIMAL(10,2) DEFAULT 0.00,
        igst DECIMAL(10,2) DEFAULT 0.00,
        cess DECIMAL(10,2) DEFAULT 0.00,
        total_tax DECIMAL(10,2) NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        return_id VARCHAR(50),
        refund_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tx_type (transaction_type),
        INDEX idx_order_id (order_id),
        INDEX idx_inv_num (invoice_number),
        INDEX idx_cn_num (credit_note_number),
        INDEX idx_tx_date (transaction_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Create credit_notes table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS credit_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        credit_note_number VARCHAR(100) UNIQUE NOT NULL,
        credit_note_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        order_id VARCHAR(50) NOT NULL,
        original_invoice_number VARCHAR(100) NOT NULL,
        original_invoice_date TIMESTAMP NULL,
        return_id VARCHAR(50),
        customer_name VARCHAR(255),
        customer_gstin VARCHAR(20),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        billing_address TEXT,
        shipping_address TEXT,
        state VARCHAR(100),
        place_of_supply VARCHAR(100),
        items_json JSON NOT NULL,
        subtotal DECIMAL(10,2) DEFAULT 0.00,
        discount DECIMAL(10,2) DEFAULT 0.00,
        taxable_value DECIMAL(10,2) NOT NULL,
        cgst DECIMAL(10,2) DEFAULT 0.00,
        sgst DECIMAL(10,2) DEFAULT 0.00,
        igst DECIMAL(10,2) DEFAULT 0.00,
        total_tax DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'ISSUED',
        refund_id VARCHAR(100),
        refund_amount DECIMAL(10,2) DEFAULT 0.00,
        refund_status VARCHAR(50) DEFAULT 'PENDING',
        pdf_path VARCHAR(550),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cn_order (order_id),
        INDEX idx_cn_inv (original_invoice_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. Create refunds table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        refund_id VARCHAR(100) UNIQUE NOT NULL,
        order_id VARCHAR(50) NOT NULL,
        credit_note_id INT,
        credit_note_number VARCHAR(100),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50),
        razorpay_payment_id VARCHAR(100),
        razorpay_refund_id VARCHAR(100),
        bank_details_json JSON,
        reason TEXT,
        initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ref_order (order_id),
        INDEX idx_ref_rzp (razorpay_refund_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. Create financial_audit_log table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS financial_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        order_id VARCHAR(50),
        invoice_number VARCHAR(100),
        credit_note_number VARCHAR(100),
        previous_status VARCHAR(50),
        new_status VARCHAR(50),
        metadata_json JSON,
        source VARCHAR(50) DEFAULT 'SYSTEM',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_event (event_type),
        INDEX idx_audit_order (order_id)
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

// In-memory fallback storage
const inMemoryReviews = [];
const inMemoryCorporateEnquiries = [];
const inMemorySubscribers = [];
const inMemoryCreditNotes = new Map();
const inMemoryGstTransactions = [];
const inMemoryRefunds = new Map();

/**
 * saveOrder — helper to insert/update order into MySQL
 */
async function saveOrder(orderData) {
  const p = getPool();
  if (!p) return null;

  try {
    const [result] = await p.query(
      `INSERT INTO orders 
       (order_id, customer_name, customer_email, customer_phone, total_amount, payment_method, payment_status, status, shipping_address, items_json, shiprocket_order_id, shipment_id, shiprocket_sync_status, invoice_number, invoice_date, credit_note_number, refund_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         payment_status = VALUES(payment_status),
         status = COALESCE(VALUES(status), status),
         shiprocket_order_id = COALESCE(VALUES(shiprocket_order_id), shiprocket_order_id),
         shipment_id = COALESCE(VALUES(shipment_id), shipment_id),
         shiprocket_sync_status = COALESCE(VALUES(shiprocket_sync_status), shiprocket_sync_status),
         credit_note_number = COALESCE(VALUES(credit_note_number), credit_note_number),
         refund_id = COALESCE(VALUES(refund_id), refund_id)`,
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
        orderData.invoice_number || null,
        orderData.invoice_date || null,
        orderData.credit_note_number || null,
        orderData.refund_id || null
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
 * Helper to generate financial year sequence string using an active DB connection
 */
async function generateSequenceNumberWithConn(conn, tableName, prefix) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan
  let fyStart = year;
  let fyEnd = year + 1;
  if (month < 3) {
    fyStart = year - 1;
    fyEnd = year;
  }
  const fyStr = `${String(fyStart).slice(-2)}-${String(fyEnd).slice(-2)}`;

  await conn.query(`INSERT INTO ${tableName} (financial_year, current_value) VALUES (?, 0) ON DUPLICATE KEY UPDATE id=id`, [fyStr]);
  await conn.query(`UPDATE ${tableName} SET current_value = current_value + 1 WHERE financial_year = ?`, [fyStr]);
  const [rows] = await conn.query(`SELECT current_value FROM ${tableName} WHERE financial_year = ?`, [fyStr]);
  const val = rows[0].current_value;
  const formattedVal = String(val).padStart(5, '0');
  return `${prefix}/${fyStr}/${formattedVal}`;
}

async function generateInvoiceNumberWithConn(conn) {
  return generateSequenceNumberWithConn(conn, 'invoice_sequences', 'SHR');
}

async function generateCreditNoteNumberWithConn(conn) {
  return generateSequenceNumberWithConn(conn, 'credit_note_sequences', 'CN');
}

async function generateInvoiceNumber() {
  const p = getPool();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let fyStart = year;
  let fyEnd = year + 1;
  if (month < 3) {
    fyStart = year - 1;
    fyEnd = year;
  }
  const fyStr = `${String(fyStart).slice(-2)}-${String(fyEnd).slice(-2)}`;

  if (!p) {
    return `SHR/${fyStr}/MOCK-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  try {
    const conn = await p.getConnection();
    const invoiceNumber = await generateInvoiceNumberWithConn(conn);
    conn.release();
    return invoiceNumber;
  } catch (err) {
    console.error('⚠️ Could not generate invoice number from DB:', err.message);
    return `SHR/${fyStr}/ERR-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

async function generateCreditNoteNumber() {
  const p = getPool();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let fyStart = year;
  let fyEnd = year + 1;
  if (month < 3) {
    fyStart = year - 1;
    fyEnd = year;
  }
  const fyStr = `${String(fyStart).slice(-2)}-${String(fyEnd).slice(-2)}`;

  if (!p) {
    return `CN/${fyStr}/MOCK-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  try {
    const conn = await p.getConnection();
    const cnNumber = await generateCreditNoteNumberWithConn(conn);
    conn.release();
    return cnNumber;
  } catch (err) {
    console.error('⚠️ Could not generate credit note number from DB:', err.message);
    return `CN/${fyStr}/ERR-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

/**
 * getOrAssignInvoiceNumberAtomic — atomically gets or assigns an invoice number for an order using DB row locking.
 */
async function getOrAssignInvoiceNumberAtomic(orderId) {
  const p = getPool();
  if (!p) {
    const invNum = await generateInvoiceNumber();
    return { invoiceNumber: invNum, invoiceDate: new Date().toISOString(), isNew: true };
  }

  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();

    const cleanId = String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase();
    const [rows] = await conn.query(
      `SELECT invoice_number, invoice_date FROM orders WHERE UPPER(order_id) = ? FOR UPDATE`,
      [cleanId]
    );

    if (rows.length > 0 && rows[0].invoice_number) {
      await conn.commit();
      conn.release();
      return {
        invoiceNumber: rows[0].invoice_number,
        invoiceDate: rows[0].invoice_date,
        isNew: false
      };
    }

    const newInvoiceNumber = await generateInvoiceNumberWithConn(conn);
    const invoiceDate = new Date().toISOString();

    await conn.query(
      `UPDATE orders SET invoice_number = ?, invoice_date = ? WHERE UPPER(order_id) = ? AND (invoice_number IS NULL OR invoice_number = '')`,
      [newInvoiceNumber, invoiceDate, cleanId]
    );

    await conn.commit();
    conn.release();
    return {
      invoiceNumber: newInvoiceNumber,
      invoiceDate,
      isNew: true
    };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

/**
 * getOrAssignCreditNoteNumberAtomic — atomically gets or assigns a Credit Note number for an order/return using DB row locking.
 */
async function getOrAssignCreditNoteNumberAtomic(orderId, returnId = null) {
  const p = getPool();
  if (!p) {
    const cnNum = await generateCreditNoteNumber();
    return { creditNoteNumber: cnNum, creditNoteDate: new Date().toISOString(), isNew: true };
  }

  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();

    const cleanId = String(orderId).replace(/^[#\s]+/, '').trim().toUpperCase();
    const cleanReturnId = returnId ? String(returnId).trim().toUpperCase() : null;

    let query = `SELECT credit_note_number, credit_note_date FROM credit_notes WHERE UPPER(order_id) = ?`;
    const params = [cleanId];
    if (cleanReturnId) {
      query += ` AND UPPER(return_id) = ?`;
      params.push(cleanReturnId);
    }
    query += ` FOR UPDATE`;

    const [rows] = await conn.query(query, params);

    if (rows.length > 0 && rows[0].credit_note_number) {
      await conn.commit();
      conn.release();
      return {
        creditNoteNumber: rows[0].credit_note_number,
        creditNoteDate: rows[0].credit_note_date,
        isNew: false
      };
    }

    const newCreditNoteNumber = await generateCreditNoteNumberWithConn(conn);
    const creditNoteDate = new Date().toISOString();

    await conn.commit();
    conn.release();
    return {
      creditNoteNumber: newCreditNoteNumber,
      creditNoteDate,
      isNew: true
    };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

/**
 * saveCreditNoteRecord — helper to persist Credit Note to MySQL (and memory)
 */
async function saveCreditNoteRecord(cnData) {
  inMemoryCreditNotes.set(cnData.credit_note_number, cnData);

  const p = getPool();
  if (!p) return cnData;

  try {
    const [res] = await p.query(
      `INSERT INTO credit_notes 
       (credit_note_number, credit_note_date, order_id, original_invoice_number, original_invoice_date, return_id, customer_name, customer_gstin, customer_email, customer_phone, billing_address, shipping_address, state, place_of_supply, items_json, subtotal, discount, taxable_value, cgst, sgst, igst, total_tax, total_amount, reason, status, refund_id, refund_amount, refund_status, pdf_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         pdf_path = VALUES(pdf_path),
         status = VALUES(status),
         refund_id = VALUES(refund_id),
         refund_status = VALUES(refund_status)`,
      [
        cnData.credit_note_number,
        cnData.credit_note_date || new Date().toISOString(),
        cnData.order_id,
        cnData.original_invoice_number,
        cnData.original_invoice_date || null,
        cnData.return_id || null,
        cnData.customer_name || 'Valued Customer',
        cnData.customer_gstin || null,
        cnData.customer_email || '',
        cnData.customer_phone || '',
        cnData.billing_address || '',
        cnData.shipping_address || '',
        cnData.state || 'Rajasthan',
        cnData.place_of_supply || '08-Rajasthan',
        JSON.stringify(cnData.items || []),
        cnData.subtotal || 0,
        cnData.discount || 0,
        cnData.taxable_value || 0,
        cnData.cgst || 0,
        cnData.sgst || 0,
        cnData.igst || 0,
        cnData.total_tax || 0,
        cnData.total_amount || 0,
        cnData.reason || 'Goods Returned',
        cnData.status || 'ISSUED',
        cnData.refund_id || null,
        cnData.refund_amount || 0,
        cnData.refund_status || 'PENDING',
        cnData.pdf_path || null
      ]
    );

    // Also link credit_note_number to orders table
    await p.query(
      `UPDATE orders SET credit_note_number = ? WHERE UPPER(order_id) = ?`,
      [cnData.credit_note_number, String(cnData.order_id).toUpperCase()]
    ).catch(() => {});

    return res;
  } catch (err) {
    console.error('⚠️ Could not save Credit Note to DB:', err.message);
    return cnData;
  }
}

/**
 * saveGstTransaction — helper to post GST transaction record into ledger
 */
async function saveGstTransaction(txData) {
  inMemoryGstTransactions.unshift(txData);

  const p = getPool();
  if (!p) return txData;

  try {
    const [res] = await p.query(
      `INSERT INTO gst_transactions
       (transaction_type, order_id, invoice_id, invoice_number, invoice_date, credit_note_id, credit_note_number, credit_note_date, transaction_date, customer_name, customer_gstin, billing_state, shipping_state, place_of_supply, supply_type, b2b_b2c, payment_mode, sku, product_title, hsn_sac, quantity, unit_price, discount, taxable_value, gst_rate, cgst, sgst, igst, cess, total_tax, total_value, return_id, refund_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        txData.transaction_type,
        txData.order_id,
        txData.invoice_id || null,
        txData.invoice_number || null,
        txData.invoice_date || null,
        txData.credit_note_id || null,
        txData.credit_note_number || null,
        txData.credit_note_date || null,
        txData.transaction_date || new Date().toISOString(),
        txData.customer_name || 'Valued Customer',
        txData.customer_gstin || null,
        txData.billing_state || 'Rajasthan',
        txData.shipping_state || 'Rajasthan',
        txData.place_of_supply || '08-Rajasthan',
        txData.supply_type || 'INTRA_STATE',
        txData.b2b_b2c || 'B2C',
        txData.payment_mode || 'Prepaid',
        txData.sku || 'SKU-ITEM',
        txData.product_title || 'Sacred Item',
        txData.hsn_sac || '83061000',
        txData.quantity || 1,
        txData.unit_price || 0,
        txData.discount || 0,
        txData.taxable_value || 0,
        txData.gst_rate || 18,
        txData.cgst || 0,
        txData.sgst || 0,
        txData.igst || 0,
        txData.cess || 0,
        txData.total_tax || 0,
        txData.total_value || 0,
        txData.return_id || null,
        txData.refund_id || null
      ]
    );
    return res;
  } catch (err) {
    console.error('⚠️ Could not save GST transaction to DB:', err.message);
    return txData;
  }
}

/**
 * saveRefundRecord — helper to persist refund record to MySQL
 */
async function saveRefundRecord(refData) {
  inMemoryRefunds.set(refData.refund_id, refData);

  const p = getPool();
  if (!p) return refData;

  try {
    const [res] = await p.query(
      `INSERT INTO refunds
       (refund_id, order_id, credit_note_id, credit_note_number, amount, currency, status, payment_method, razorpay_payment_id, razorpay_refund_id, bank_details_json, reason, initiated_at, completed_at, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         completed_at = VALUES(completed_at),
         razorpay_refund_id = COALESCE(VALUES(razorpay_refund_id), razorpay_refund_id),
         error_message = VALUES(error_message)`,
      [
        refData.refund_id,
        refData.order_id,
        refData.credit_note_id || null,
        refData.credit_note_number || null,
        refData.amount || 0,
        refData.currency || 'INR',
        refData.status || 'INITIATED',
        refData.payment_method || 'Prepaid',
        refData.razorpay_payment_id || null,
        refData.razorpay_refund_id || null,
        JSON.stringify(refData.bank_details || {}),
        refData.reason || 'Customer Refund',
        refData.initiated_at || new Date().toISOString(),
        refData.completed_at || null,
        refData.error_message || null
      ]
    );

    // Update orders table with refund_id
    await p.query(
      `UPDATE orders SET refund_id = ? WHERE UPPER(order_id) = ?`,
      [refData.refund_id, String(refData.order_id).toUpperCase()]
    ).catch(() => {});

    return res;
  } catch (err) {
    console.error('⚠️ Could not save refund record to DB:', err.message);
    return refData;
  }
}

module.exports = {
  getPool,
  initDatabase,
  saveOrder,
  updateOrderShiprocketInfo,
  saveReturnRequest,
  generateInvoiceNumber,
  getOrAssignInvoiceNumberAtomic,
  generateCreditNoteNumber,
  getOrAssignCreditNoteNumberAtomic,
  saveCreditNoteRecord,
  saveGstTransaction,
  saveRefundRecord
};
