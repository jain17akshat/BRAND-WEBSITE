/**
 * test_e2e.js
 * ─────────────────────────────────────────────────────────
 * Automated End-to-End Test Suite for Shraviko Invoice & Email System.
 * Connects to Disposable MySQL 8.0 on Port 3307.
 */

const path = require('path');
const dotenv = require('dotenv');

// 1. MUST load .env.test BEFORE importing any database or application modules
const envPath = path.join(__dirname, '.env.test');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error(`❌ Failed to load .env.test from ${envPath}:`, envResult.error.message);
  process.exit(1);
}

// 2. EXPLICIT DB Safety Verification
if (process.env.NODE_ENV !== 'test' || process.env.DB_NAME !== 'shraviko_test') {
  console.error(`❌ SAFETY GUARD FAILED! NODE_ENV must be 'test' and DB_NAME must be 'shraviko_test'. Found DB_NAME='${process.env.DB_NAME}'`);
  process.exit(1);
}
console.log(`✅ Loaded & Verified Environment: NODE_ENV=${process.env.NODE_ENV}, DB_NAME=${process.env.DB_NAME}, DB_PORT=${process.env.DB_PORT}`);

const fs = require('fs');
const db = require('./database/db');
const orderStore = require('./services/orderStore');
const invoiceService = require('./services/invoiceService');
const emailService = require('./services/emailService');
const emailQueue = require('./services/emailQueue');
const catalog = require('./data/catalog');

// Stub email transport functions to prevent actual network SMTP sends
let customerEmailMockResult = { success: true, messageId: 'mock-customer-msg-id' };
let businessEmailMockResult = { success: true, messageId: 'mock-business-msg-id' };

emailService.sendPrepaidPaymentReceivedEmail = async (args) => {
  if (!customerEmailMockResult.success) throw new Error(customerEmailMockResult.error || 'Customer Email Failure');
  return customerEmailMockResult;
};

emailService.sendOrderConfirmationEmail = async (args) => {
  if (!customerEmailMockResult.success) throw new Error(customerEmailMockResult.error || 'Customer Email Failure');
  return customerEmailMockResult;
};

emailService.sendBusinessInvoiceEmail = async (args) => {
  if (!businessEmailMockResult.success) throw new Error(businessEmailMockResult.error || 'Business Email Failure');
  return businessEmailMockResult;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runE2ESuite() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING DISPOSABLE MYSQL E2E INVOICE & EMAIL TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, scenarioName, details) {
    if (condition) {
      console.log(`  ✅ PASS: ${scenarioName} — ${details}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${scenarioName} — ${details}`);
      failed++;
    }
  }

  try {
    // 3. Initialize real MySQL Database schema
    console.log('Step 1: Connecting to MySQL 8.0 on port 3307 & initializing schema...');
    const dbInitialized = await db.initDatabase();
    if (!dbInitialized) {
      throw new Error('Database initialization returned false. Is Docker MySQL running on port 3307?');
    }

    const pool = db.getPool();
    if (!pool) {
      throw new Error('MySQL Pool is null after initDatabase. Verification failed.');
    }

    // Clean test table state before executing
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM invoice_sequences');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 1: PREPAID SUCCESS & SINGLE INVOICE GENERATION
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 1: PREPAID SUCCESS ---');
    customerEmailMockResult = { success: true };
    businessEmailMockResult = { success: true };

    const orderId1 = `PREPAID_${Date.now()}_1`;
    await orderStore.addOrder({
      order_id: orderId1,
      customer_name: 'Rahul Sharma',
      customer_email: 'rahul@example.com',
      customer_phone: '9876543210',
      total_amount: 1180,
      payment_method: 'Prepaid',
      payment_status: 'PAID',
      shipping_address: '101 Lotus Apartments, Jaipur, Rajasthan - 302001',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      items: [
        { id: 'SHR-BRASS-01', name: 'Brass Diya', price: 1000, qty: 1, gst_rate: 18, hsn: '83062900', taxable_value: 1000, cgst: 90, sgst: 90, igst: 0, total_item_amount: 1180 }
      ]
    });

    // Simulate verified Razorpay payment.captured webhook
    const { getOrAssignInvoiceNumberAtomic } = require('./database/db');
    const invRes1 = await getOrAssignInvoiceNumberAtomic(orderId1);
    
    assert(invRes1.isNew === true, 'S1.1', 'Invoice number created for new order');
    assert(invRes1.invoiceNumber.startsWith('SHR/'), 'S1.2', `Invoice number format valid: ${invRes1.invoiceNumber}`);

    const fetchedOrder1 = await orderStore.findOrderById(orderId1);
    const { filePath: pdfPath1 } = await invoiceService.generateAndSaveInvoice({
      ...fetchedOrder1,
      items: fetchedOrder1.items_raw || fetchedOrder1.items
    }, invRes1.invoiceNumber);

    await orderStore.updateOrderInvoice(orderId1, invRes1.invoiceNumber, invRes1.invoiceDate);
    await orderStore.updateEmailStatus(orderId1, 'customer', { status: 'PENDING' });
    await orderStore.updateEmailStatus(orderId1, 'business', { status: 'PENDING' });

    // Process Email Queue
    await emailQueue.processQueue();
    await sleep(300);

    const updated1 = await orderStore.findOrderById(orderId1);
    assert(updated1.invoice_number === invRes1.invoiceNumber, 'S1.3', 'Invoice number persisted in MySQL');
    assert(fs.existsSync(pdfPath1), 'S1.4', 'Invoice PDF saved to disk');
    assert(updated1.customer_email_status === 'SENT', 'S1.5', 'Customer email status is SENT');
    assert(updated1.business_email_status === 'SENT', 'S1.6', 'Business email status is SENT');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 2: DUPLICATE & CONCURRENT WEBHOOK HANDLING
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 2: DUPLICATE & CONCURRENT WEBHOOKS ---');
    // Simulate 5 concurrent webhook calls at the exact same millisecond
    const concurrentResults = await Promise.all([
      getOrAssignInvoiceNumberAtomic(orderId1),
      getOrAssignInvoiceNumberAtomic(orderId1),
      getOrAssignInvoiceNumberAtomic(orderId1),
      getOrAssignInvoiceNumberAtomic(orderId1),
      getOrAssignInvoiceNumberAtomic(orderId1),
    ]);

    const newCounts = concurrentResults.filter(r => r.isNew).length;
    const sameInvoiceNumber = concurrentResults.every(r => r.invoiceNumber === invRes1.invoiceNumber);

    assert(newCounts === 0, 'S2.1', 'Zero new invoices created on duplicate webhooks');
    assert(sameInvoiceNumber, 'S2.2', `All duplicate calls returned original invoice number ${invRes1.invoiceNumber}`);

    const [orderRows2] = await pool.query('SELECT COUNT(*) as cnt FROM orders WHERE UPPER(order_id) = ?', [orderId1.toUpperCase()]);
    assert(orderRows2[0].cnt === 1, 'S2.3', 'Exactly ONE order record in MySQL database');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 3: CUSTOMER EMAIL FAILURE & INDEPENDENT RETRY
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 3: CUSTOMER EMAIL FAILURE & RETRY ---');
    const orderId3 = `PREPAID_${Date.now()}_3`;
    await orderStore.addOrder({
      order_id: orderId3,
      customer_name: 'Ananya Verma',
      customer_email: 'ananya@example.com',
      total_amount: 2500,
      payment_method: 'Prepaid',
      payment_status: 'PAID',
      items: [{ id: 'SHR-02', name: 'Brass Idol', price: 2500, qty: 1 }]
    });

    const invRes3 = await getOrAssignInvoiceNumberAtomic(orderId3);
    const fetchedOrder3 = await orderStore.findOrderById(orderId3);
    await invoiceService.generateAndSaveInvoice({ ...fetchedOrder3, items: fetchedOrder3.items_raw || fetchedOrder3.items }, invRes3.invoiceNumber);
    await orderStore.updateOrderInvoice(orderId3, invRes3.invoiceNumber, invRes3.invoiceDate);
    await orderStore.updateEmailStatus(orderId3, 'customer', { status: 'PENDING' });
    await orderStore.updateEmailStatus(orderId3, 'business', { status: 'PENDING' });

    // Force Customer email fail, Business email succeed
    customerEmailMockResult = { success: false, error: 'Connection timeout to SMTP' };
    businessEmailMockResult = { success: true };

    await emailQueue.processQueue();
    await sleep(300);

    const updated3 = await orderStore.findOrderById(orderId3);
    assert(updated3.customer_email_status === 'FAILED', 'S3.1', 'Customer email status is FAILED');
    assert(updated3.customer_email_error === 'Connection timeout to SMTP', 'S3.2', 'Error details saved in DB');
    assert(updated3.customer_email_retry_count === 1, 'S3.3', 'Retry count incremented to 1');
    assert(updated3.customer_email_next_retry_at !== null, 'S3.4', 'next_retry_at timestamp set');
    assert(updated3.business_email_status === 'SENT', 'S3.5', 'Business email SUCCEEDED independently');

    // Recovery retry: Set next_retry_at to past and fix customer mock
    customerEmailMockResult = { success: true };
    await pool.query('UPDATE orders SET customer_email_next_retry_at = NOW() - INTERVAL 1 MINUTE WHERE order_id = ?', [orderId3]);

    await emailQueue.processQueue();
    await sleep(300);

    const recovered3 = await orderStore.findOrderById(orderId3);
    assert(recovered3.customer_email_status === 'SENT', 'S3.6', 'Customer email recovered & SENT on retry');
    assert(recovered3.invoice_number === invRes3.invoiceNumber, 'S3.7', 'Invoice number unchanged during retries');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 4: BUSINESS EMAIL FAILURE & MAX RETRY LIMIT
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 4: BUSINESS EMAIL FAILURE & MAX RETRY ---');
    const orderId4 = `PREPAID_${Date.now()}_4`;
    await orderStore.addOrder({
      order_id: orderId4,
      customer_name: 'Vikas Kumar',
      customer_email: 'vikas@example.com',
      total_amount: 1500,
      payment_method: 'Prepaid',
      payment_status: 'PAID',
      items: [{ id: 'SHR-03', name: 'Brass Bell', price: 1500, qty: 1 }]
    });

    const invRes4 = await getOrAssignInvoiceNumberAtomic(orderId4);
    await orderStore.updateOrderInvoice(orderId4, invRes4.invoiceNumber, invRes4.invoiceDate);
    await orderStore.updateEmailStatus(orderId4, 'business', { status: 'PENDING' });

    businessEmailMockResult = { success: false, error: 'Mailbox full' };

    // Attempt 1
    await emailQueue.processQueue();
    await sleep(100);
    // Attempt 2
    await pool.query('UPDATE orders SET business_email_next_retry_at = NOW() - INTERVAL 1 MINUTE WHERE order_id = ?', [orderId4]);
    await emailQueue.processQueue();
    await sleep(100);
    // Attempt 3
    await pool.query('UPDATE orders SET business_email_next_retry_at = NOW() - INTERVAL 1 MINUTE WHERE order_id = ?', [orderId4]);
    await emailQueue.processQueue();
    await sleep(100);

    const maxRetryOrder = await orderStore.findOrderById(orderId4);
    assert(maxRetryOrder.business_email_status === 'FAILED', 'S4.1', 'Business email status is FAILED');
    assert(maxRetryOrder.business_email_retry_count === 3, 'S4.2', 'Retry count reached MAX (3)');

    // Attempt 4 should be ignored by queue
    await pool.query('UPDATE orders SET business_email_next_retry_at = NOW() - INTERVAL 1 MINUTE WHERE order_id = ?', [orderId4]);
    await emailQueue.processQueue();
    await sleep(100);

    const ignoredOrder = await orderStore.findOrderById(orderId4);
    assert(ignoredOrder.business_email_retry_count === 3, 'S4.3', 'Job ignored after reaching max retries');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 5: COD ORDER INVOICE & EMAIL FLOW
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 5: COD ORDER FLOW ---');
    const orderId5 = `COD_${Date.now()}_5`;
    const codInvoiceNum = await db.generateInvoiceNumber();
    
    await orderStore.addOrder({
      order_id: orderId5,
      customer_name: 'Pooja Hegde',
      customer_email: 'pooja@example.com',
      total_amount: 3200,
      payment_method: 'COD',
      payment_status: 'COD_PENDING',
      invoice_number: codInvoiceNum,
      invoice_date: new Date().toISOString(),
      customer_email_status: 'PENDING',
      business_email_status: 'PENDING',
      items: [{ id: 'SHR-05', name: 'Brass Urli', price: 3200, qty: 1 }]
    });

    customerEmailMockResult = { success: true };
    businessEmailMockResult = { success: true };

    const codOrderObj = await orderStore.findOrderById(orderId5);
    const { filePath: codPdfPath } = await invoiceService.generateAndSaveInvoice(codOrderObj, codInvoiceNum);

    await emailQueue.processQueue();
    await sleep(300);

    const updated5 = await orderStore.findOrderById(orderId5);
    assert(updated5.invoice_number === codInvoiceNum, 'S5.1', 'COD Invoice number created & saved');
    assert(fs.existsSync(codPdfPath), 'S5.2', 'COD PDF exists on disk');
    assert(updated5.customer_email_status === 'SENT', 'S5.3', 'COD customer email status SENT');
    assert(updated5.business_email_status === 'SENT', 'S5.4', 'COD business email status SENT');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 6: GST & HSN TAX CALCULATIONS
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 6: GST & HSN CALCULATIONS ---');
    const intraStateItem = catalog.enrichCartItemWithTax({ id: 'SHR-BRASS-1', price: 1000, quantity: 2 }, 'Rajasthan');
    assert(intraStateItem.cgst === 180, 'S6.1', `Intra-state CGST (9%) on ₹2000 = ₹180 (Got ₹${intraStateItem.cgst})`);
    assert(intraStateItem.sgst === 180, 'S6.2', `Intra-state SGST (9%) on ₹2000 = ₹180 (Got ₹${intraStateItem.sgst})`);
    assert(intraStateItem.igst === 0, 'S6.3', `Intra-state IGST = ₹0 (Got ₹${intraStateItem.igst})`);

    const interStateItem = catalog.enrichCartItemWithTax({ id: 'SHR-BRASS-1', price: 1000, quantity: 2 }, 'Maharashtra');
    assert(interStateItem.cgst === 0, 'S6.4', `Inter-state CGST = ₹0 (Got ₹${interStateItem.cgst})`);
    assert(interStateItem.sgst === 0, 'S6.5', `Inter-state SGST = ₹0 (Got ₹${interStateItem.sgst})`);
    assert(interStateItem.igst === 360, 'S6.6', `Inter-state IGST (18%) on ₹2000 = ₹360 (Got ₹${interStateItem.igst})`);

    // ─────────────────────────────────────────────────────────
    // SCENARIO 7: SEQUENTIAL INVOICE NUMBERING
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 7: SEQUENTIAL INVOICE NUMBERING ---');
    const numA = await db.generateInvoiceNumber();
    const numB = await db.generateInvoiceNumber();
    const numC = await db.generateInvoiceNumber();

    const seqA = parseInt(numA.split('/').pop(), 10);
    const seqB = parseInt(numB.split('/').pop(), 10);
    const seqC = parseInt(numC.split('/').pop(), 10);

    assert(seqB === seqA + 1, 'S7.1', `Sequential increment verified: ${numA} -> ${numB}`);
    assert(seqC === seqB + 1, 'S7.2', `Sequential increment verified: ${numB} -> ${numC}`);

    // ─────────────────────────────────────────────────────────
    // SCENARIO 8: INVOICE DOWNLOAD SECURITY & ACCESSIBILITY
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 8: INVOICE DISK PERSISTENCE ---');
    const downloadPath = invoiceService.getInvoicePath(orderId1);
    assert(downloadPath !== null && fs.existsSync(downloadPath), 'S8.1', 'Invoice downloadable & accessible on disk');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 9: MIXED-GST CART (5% + 18%)
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 9: MIXED-GST CART (5% + 18%) ---');
    const item5Percent = catalog.enrichCartItemWithTax({ id: 'SHR-CHN6', price: 143, quantity: 2 }, 'Rajasthan'); // HSN 33074100, 5% GST
    const item18Percent = catalog.enrichCartItemWithTax({ id: 'SHR-NMY-COP-003', price: 722, quantity: 1 }, 'Rajasthan'); // HSN 74199990, 18% GST

    assert(item5Percent.hsn === '33074100' && item5Percent.gst_rate === 5, 'S9.1', 'Item 1 uses HSN 33074100 with 5% GST rate');
    assert(item18Percent.hsn === '74199990' && item18Percent.gst_rate === 18, 'S9.2', 'Item 2 uses HSN 74199990 with 18% GST rate');

    const totalMixedTaxable = item5Percent.taxable_value + item18Percent.taxable_value;
    const totalMixedCgst = item5Percent.cgst + item18Percent.cgst;
    const totalMixedSgst = item5Percent.sgst + item18Percent.sgst;

    assert(totalMixedCgst > 0 && totalMixedSgst > 0, 'S9.3', 'Intra-state mixed cart has valid non-zero CGST and SGST totals');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 10: GST-INCLUSIVE PRICE RECONCILIATION
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 10: GST-INCLUSIVE PRICE RECONCILIATION ---');
    const testItem = catalog.enrichCartItemWithTax({ id: 'SHR-CAM-01', price: 500, quantity: 3 }, 'Rajasthan');
    const sumReconciled = parseFloat((testItem.taxable_value + testItem.total_tax_amount).toFixed(2));
    const expectedTotal = testItem.total_item_amount;
    const diff = Math.abs(sumReconciled - expectedTotal);

    assert(diff <= 0.05, 'S10.1', `Taxable value (${testItem.taxable_value}) + GST (${testItem.total_tax_amount}) = ₹${sumReconciled} reconciles to total ₹${expectedTotal}`);

    // ─────────────────────────────────────────────────────────
    // SCENARIO 11: UNVERIFIED TAX MAPPING (GST_Old_12_New_5)
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 11: UNVERIFIED TAX MAPPING BLOCKING ---');
    let unverifiedBlocked = false;
    let errCode = '';
    try {
      catalog.enrichCartItemWithTax({ id: 'SHR-GS-BR-07X05X09-1P', price: 1500, quantity: 1 }, 'Rajasthan');
    } catch (err) {
      unverifiedBlocked = true;
      errCode = err.code;
    }
    assert(unverifiedBlocked === true && errCode === 'UNVERIFIED_TAX_DATA', 'S11.1', `Unresolved tax SKU SHR-GS-BR-07X05X09-1P blocked with UNVERIFIED_TAX_DATA error code`);

    // ─────────────────────────────────────────────────────────
    // SCENARIO 12: INVOICE DOWNLOAD AUTHORIZATION SECURITY
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 12: INVOICE DOWNLOAD AUTHORIZATION ---');
    const authOrderId = `AUTH_TEST_${Date.now()}`;
    await orderStore.addOrder({
      order_id: authOrderId,
      customer_name: 'Secure Customer',
      customer_email: 'secure@example.com',
      customer_phone: '9111122222',
      total_amount: 1000,
      payment_method: 'Prepaid',
      payment_status: 'PAID'
    });

    const authorizedFetch = await orderStore.findOrder(authOrderId, '9111122222', null);
    const unauthorizedFetch = await orderStore.findOrder(authOrderId, '9999999999', null);
    const missingCredsFetch = await orderStore.findOrder(authOrderId, null, null);

    assert(authorizedFetch !== null && authorizedFetch.order_id === authOrderId, 'S12.1', 'Authorized customer request with matching phone succeeds');
    assert(unauthorizedFetch === null, 'S12.2', 'Unauthorized request with wrong phone is REJECTED (null)');
    assert(missingCredsFetch === null, 'S12.3', 'Unauthenticated request missing phone/email is REJECTED (null)');

    // ─────────────────────────────────────────────────────────
    // SCENARIO 13: PRODUCTION-LIKE PDF FIELD VERIFICATION
    // ─────────────────────────────────────────────────────────
    console.log('\n--- SCENARIO 13: PRODUCTION-LIKE PDF FIELD VERIFICATION ---');
    const prodOrderId = `PROD_VERIFY_${Date.now()}`;
    const prodInvNum = await db.generateInvoiceNumber();
    const prodOrderData = {
      order_id: prodOrderId,
      customer_name: 'SHASHWAT TESTER',
      customer_email: 'shraviko@gmail.com',
      customer_phone: '7742320607',
      payment_method: 'Prepaid',
      payment_status: 'PAID',
      shipping_address: 'Patuna Chowk, Rikhabdeo, Udaipur, Rajasthan - 313802',
      state: 'Rajasthan',
      items: [
        {
          name: 'Brass Garuda Bell',
          hsn: '74199930',
          quantity: 1,
          taxable_value_per_unit: 611.86,
          taxable_value: 611.86,
          gst_rate: 18,
          cgst: 55.07,
          sgst: 55.07,
          igst: 0,
          total_item_amount: 722
        }
      ]
    };

    const { buffer: pdfBuf } = await invoiceService.generateAndSaveInvoice(prodOrderData, prodInvNum);
    const pdfStr = pdfBuf.toString('utf8');

    assert(pdfBuf && pdfBuf.length > 1000, 'S13.1', 'PDF buffer generated successfully (>1KB)');
    assert(pdfStr.includes('SHASHWAT ENTERPRISES') || pdfBuf.includes(Buffer.from('SHASHWAT ENTERPRISES')), 'S13.2', 'PDF contains Legal Seller Name SHASHWAT ENTERPRISES');
    assert(pdfStr.includes('08CODPJ2489F1ZT') || pdfBuf.includes(Buffer.from('08CODPJ2489F1ZT')), 'S13.3', 'PDF contains Seller GSTIN 08CODPJ2489F1ZT');

  } catch (err) {
    console.error('\n❌ E2E TEST CRASHED WITH ERROR:', err);
    failed++;
  } finally {
    console.log('\n======================================================');
    console.log(`📊 FINAL TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('======================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runE2ESuite();
