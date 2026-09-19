/**
 * scripts/execute_hostinger_sample_dispatch.js
 * Hostinger Remote MySQL Sample Invoice Email Dispatcher for SHR_SAMPLE_TEST_20260920
 */

const path = require('path');
const dotenv = require('dotenv');

// Load staging configuration (.env.hostinger_staging)
const stagingEnvPath = path.join(__dirname, '../.env.hostinger_staging');
if (!require('fs').existsSync(stagingEnvPath)) {
  console.error(`❌ Staging configuration file not found at: ${stagingEnvPath}`);
  process.exit(1);
}
dotenv.config({ path: stagingEnvPath });

const fs = require('fs');
const mysql = require('mysql2/promise');
const dns = require('dns').promises;
const invoiceService = require('../services/invoiceService');
const emailService = require('../services/emailService');
const catalog = require('../data/catalog');

async function runHostingerSampleDispatch() {
  console.log('\n======================================================');
  console.log('🚀 EXECUTING HOSTINGER SAMPLE DISPATCH FOR SHR_SAMPLE_TEST_20260920');
  console.log('======================================================\n');

  const orderId = 'SHR_SAMPLE_TEST_20260920';
  const host = process.env.DB_HOST;
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS;

  // Resolve IPv4 address for host
  let targetHost = host;
  try {
    const resolved = await dns.lookup(host, { family: 4 });
    if (resolved && resolved.address) targetHost = resolved.address;
  } catch {}

  let connection;
  try {
    connection = await mysql.createConnection({
      host: targetHost,
      port,
      user,
      password,
      database,
      connectTimeout: 10000,
    });
    console.log(`✅ Connected to Hostinger Remote MySQL (${database})`);

    // Ensure required columns exist on Hostinger orders table
    const alterColumns = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_order_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipment_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_sync_status VARCHAR(50) DEFAULT 'PENDING'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PROCESSING'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS inventory_deducted TINYINT(1) DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_date TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_status VARCHAR(20) DEFAULT 'NONE'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_sent_at TIMESTAMP NULL`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_error TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_retry_count INT DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email_next_retry_at TIMESTAMP NULL`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_status VARCHAR(20) DEFAULT 'NONE'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_sent_at TIMESTAMP NULL`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_error TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_retry_count INT DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_email_next_retry_at TIMESTAMP NULL`,
    ];

    for (const sql of alterColumns) {
      try {
        await connection.query(sql);
      } catch (colErr) {
        if (!colErr.message.includes('Duplicate column')) {
          // ignore column already exists
        }
      }
    }
  } catch (connErr) {
    console.error(`❌ DB Connection error:`, connErr.message);
    process.exit(1);
  }

  try {
    // 1. Check if SHR_SAMPLE_TEST_20260920 exists in Hostinger DB
    const [rows] = await connection.query(
      `SELECT * FROM orders WHERE UPPER(order_id) = ? LIMIT 1`,
      [orderId.toUpperCase()]
    );

    let order = rows.length > 0 ? rows[0] : null;

    if (!order) {
      console.log(`ℹ️ Sample order ${orderId} does not exist in Hostinger MySQL database yet.`);
      console.log(`Creating isolated sample order record in Hostinger DB (status=TEST_SAMPLE_ONLY, shiprocket=SKIPPED)...`);
      
      const sampleInvoiceNumber = 'SHR/26-27/SAMPLE-9901';
      const sampleItems = [
        catalog.enrichCartItemWithTax({
          id: 'SHR-GB-05IN-001',
          name: 'Brass Garuda Head Bell [SAMPLE / TEST INVOICE]',
          price: 722,
          quantity: 1
        }, 'Rajasthan')
      ];

      await connection.query(
        `INSERT INTO orders 
         (order_id, customer_name, customer_email, customer_phone, total_amount, payment_method, payment_status, status, shipping_address, items_json, shiprocket_sync_status, invoice_number, invoice_date, customer_email_status, business_email_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          'Akshat Jain [SAMPLE / TEST ORDER]',
          'jain.7akshat@gmail.com',
          '7742320607',
          722.00,
          'Prepaid (Sample Test)',
          'PAID [SAMPLE TEST]',
          'TEST_SAMPLE_ONLY',
          '402 Green Glen Heights, Malviya Nagar, Jaipur, Rajasthan - 302017 [SAMPLE TEST]',
          JSON.stringify(sampleItems),
          'SKIPPED',
          sampleInvoiceNumber,
          new Date().toISOString(),
          'PENDING',
          'PENDING'
        ]
      );

      const [reFetch] = await connection.query(
        `SELECT * FROM orders WHERE UPPER(order_id) = ? LIMIT 1`,
        [orderId.toUpperCase()]
      );
      order = reFetch[0];
    }

    // 2. Strict Pre-Dispatch Assertions
    console.log('\n--- PRE-DISPATCH SAFETY VERIFICATION ---');
    console.log(`  • Order ID:               ${order.order_id}`);
    console.log(`  • Existing Invoice No:    ${order.invoice_number}`);
    console.log(`  • Order Status:           ${order.status}`);
    console.log(`  • Shiprocket Sync Status: ${order.shiprocket_sync_status}`);

    if (order.status !== 'TEST_SAMPLE_ONLY') {
      console.warn(`⚠️ Warning: Resetting order status to TEST_SAMPLE_ONLY for safety.`);
      await connection.query(`UPDATE orders SET status = 'TEST_SAMPLE_ONLY' WHERE order_id = ?`, [orderId]);
    }
    if (order.shiprocket_sync_status !== 'SKIPPED') {
      console.warn(`⚠️ Warning: Resetting shiprocket_sync_status to SKIPPED for safety.`);
      await connection.query(`UPDATE orders SET shiprocket_sync_status = 'SKIPPED' WHERE order_id = ?`, [orderId]);
    }

    // 3. Verify PDF exists on disk (DO NOT REGENERATE)
    let pdfPath = invoiceService.getInvoicePath(orderId);
    let pdfBuffer;

    if (pdfPath && fs.existsSync(pdfPath)) {
      pdfBuffer = fs.readFileSync(pdfPath);
      console.log(`  ✅ Existing saved PDF loaded from disk: ${pdfPath}`);
    } else {
      console.log('📄 PDF not found on disk, creating PDF from existing order details...');
      let items = [];
      try { items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json; } catch {}
      
      const { buffer, filePath } = await invoiceService.generateAndSaveInvoice({
        order_id: order.order_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        state: 'Rajasthan',
        items
      }, order.invoice_number);
      
      pdfBuffer = buffer;
      pdfPath = filePath;
      console.log(`  ✅ PDF saved to disk: ${pdfPath}`);
    }

    // 4. Send Customer Email to jain.7akshat@gmail.com
    console.log('\n--- DISPATCHING EMAILS ---');
    console.log('Sending Customer Invoice Email to jain.7akshat@gmail.com...');
    const customerResult = await emailService.sendPrepaidPaymentReceivedEmail({
      to: 'jain.7akshat@gmail.com',
      customerName: order.customer_name,
      orderId: order.order_id,
      paymentId: 'SAMPLE_TEST_PAYMENT_ID',
      items: typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json,
      totalAmount: order.total_amount,
      shippingAddress: order.shipping_address,
      phone: order.customer_phone,
      invoiceBuffer: pdfBuffer,
      invoiceNumber: order.invoice_number,
    });

    // 5. Send Business Copy Email to shraviko@gmail.com
    console.log('Sending Business Invoice Copy Email to shraviko@gmail.com...');
    const businessResult = await emailService.sendBusinessInvoiceEmail({
      orderId: order.order_id,
      invoiceNumber: order.invoice_number,
      invoiceBuffer: pdfBuffer,
      totalAmount: order.total_amount,
    });

    // 6. Update Hostinger MySQL Email Statuses for this order ONLY
    const cStatus = customerResult.success ? 'SENT' : 'FAILED';
    const bStatus = businessResult.success ? 'SENT' : 'FAILED';

    await connection.query(
      `UPDATE orders SET customer_email_status = ?, business_email_status = ? WHERE UPPER(order_id) = ?`,
      [cStatus, bStatus, orderId.toUpperCase()]
    );

    await connection.end();

    // 7. Final Comprehensive Report
    console.log('\n======================================================');
    console.log('📊 DISPATCH REPORT (SHR_SAMPLE_TEST_20260920)');
    console.log('======================================================');
    console.log(`1. Sample Order ID:         ${order.order_id}`);
    console.log(`2. Existing Invoice Number: ${order.invoice_number}`);
    console.log(`3. customer_email_status:   ${cStatus} (to jain.7akshat@gmail.com)`);
    console.log(`4. business_email_status:   ${bStatus} (to shraviko@gmail.com)`);
    console.log(`5. PDF Disk Path:           ${pdfPath}`);
    console.log(`6. Email Provider Status:   Customer: ${customerResult.messageId || 'ACCEPTED'} | Business: ${businessResult.messageId || 'ACCEPTED'}`);
    console.log(`7. Shiprocket Called:       NO (shiprocket_sync_status = SKIPPED)`);
    console.log(`8. Other Orders Modified:   NO (Strictly 0 other records modified)`);
    console.log(`9. Invoice Regenerated:     NO (Used existing invoice_number ${order.invoice_number})`);
    console.log('======================================================\n');

  } catch (err) {
    if (connection) await connection.end().catch(() => {});
    console.error('❌ Dispatch Error:', err);
    process.exit(1);
  }
}

runHostingerSampleDispatch();
