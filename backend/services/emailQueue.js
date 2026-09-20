/**
 * services/emailQueue.js
 * ─────────────────────────────────────────────────────────
 * Reliable, Idempotent Email Delivery Queue for Shraviko.
 * Processes Customer and Business invoice emails independently.
 */

const fs = require('fs');
const { getPendingEmails, updateEmailStatus, claimEmailJobAtomic, findOrderById } = require('./orderStore');
const { getInvoicePath, getOrGenerateInvoicePath } = require('./invoiceService');
const emailService = require('./emailService');

// Retry delays in milliseconds: 1 min, 5 min, 15 min
const RETRY_DELAYS = [60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000];
const MAX_RETRIES = 3;

/**
 * Calculates the next retry timestamp based on the current retry count.
 */
function getNextRetryTime(currentRetryCount) {
  if (currentRetryCount >= MAX_RETRIES) return null;
  const delay = RETRY_DELAYS[currentRetryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
  return new Date(Date.now() + delay).toISOString().slice(0, 19).replace('T', ' '); // MySQL format
}

/**
 * Process the customer email job independently.
 */
async function processCustomerEmail(row) {
  // Atomically claim the job to prevent duplicate dispatches under race conditions
  const claimed = await claimEmailJobAtomic(row.order_id, 'customer');
  if (!claimed) {
    console.log(`ℹ️ Customer email job for ${row.order_id} already claimed or completed by another process.`);
    return;
  }

  try {
    const order = await findOrderById(row.order_id);
    if (!order || !order.customer_email) {
      await updateEmailStatus(row.order_id, 'customer', { 
        status: 'FAILED', 
        error: 'Order or customer email not found',
        retry_count: MAX_RETRIES // Prevent further retries
      });
      return;
    }

    const invoicePath = await getOrGenerateInvoicePath(order);
    if (!invoicePath || !fs.existsSync(invoicePath)) {
      throw new Error('Invoice PDF not available on disk');
    }
    const invoiceBuffer = fs.readFileSync(invoicePath);
    if (!invoiceBuffer || invoiceBuffer.length < 100 || !invoiceBuffer.toString('utf8', 0, 4).startsWith('%PDF')) {
      throw new Error('Invoice PDF buffer is invalid or corrupted');
    }

    let result;
    if (String(order.payment_method).toUpperCase() === 'COD') {
      result = await emailService.sendOrderConfirmationEmail({
        to: order.customer_email,
        customerName: order.customer_name,
        orderId: row.order_id,
        items: order.items_raw || order.items,
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        phone: order.customer_phone,
        paymentMethod: 'Cash on Delivery (COD)',
        invoiceBuffer,
        invoiceNumber: row.invoice_number,
      });
    } else {
      result = await emailService.sendPrepaidPaymentReceivedEmail({
        to: order.customer_email,
        customerName: order.customer_name,
        orderId: row.order_id,
        paymentId: 'Online Payment', 
        items: order.items_raw || order.items,
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        phone: order.customer_phone,
        invoiceBuffer,
        invoiceNumber: row.invoice_number,
        isInvoiceEmail: true,
      });
    }

    if (result.success) {
      await updateEmailStatus(row.order_id, 'customer', {
        status: 'SENT',
        sent_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        error: null
      });
      console.log(`✅ Customer invoice email marked SENT for ${row.order_id}`);
    } else {
      throw new Error(result.error || 'Unknown email service error');
    }

  } catch (err) {
    const nextCount = (row.customer_email_retry_count || 0) + 1;
    const nextTime = getNextRetryTime(row.customer_email_retry_count || 0);
    console.error(`⚠️ Customer email failed for ${row.order_id} (Attempt ${nextCount}/${MAX_RETRIES}):`, err.message);
    
    await updateEmailStatus(row.order_id, 'customer', {
      status: 'FAILED',
      error: err.message,
      retry_count: nextCount,
      next_retry_at: nextTime
    });
  }
}

/**
 * Process the business email job independently.
 */
async function processBusinessEmail(row) {
  // Atomically claim the job to prevent duplicate dispatches under race conditions
  const claimed = await claimEmailJobAtomic(row.order_id, 'business');
  if (!claimed) {
    console.log(`ℹ️ Business email job for ${row.order_id} already claimed or completed by another process.`);
    return;
  }

  try {
    const order = await findOrderById(row.order_id);
    if (!order) {
      await updateEmailStatus(row.order_id, 'business', { 
        status: 'FAILED', 
        error: 'Order not found',
        retry_count: MAX_RETRIES
      });
      return;
    }

    const invoicePath = await getOrGenerateInvoicePath(order);
    if (!invoicePath || !fs.existsSync(invoicePath)) {
      throw new Error('Invoice PDF not available on disk');
    }
    const invoiceBuffer = fs.readFileSync(invoicePath);
    if (!invoiceBuffer || invoiceBuffer.length < 100 || !invoiceBuffer.toString('utf8', 0, 4).startsWith('%PDF')) {
      throw new Error('Invoice PDF buffer is invalid or corrupted');
    }

    const result = await emailService.sendBusinessInvoiceEmail({
      orderId: row.order_id,
      invoiceNumber: row.invoice_number,
      invoiceBuffer,
      totalAmount: order.total_amount,
    });

    if (result.success) {
      await updateEmailStatus(row.order_id, 'business', {
        status: 'SENT',
        sent_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        error: null
      });
      console.log(`✅ Business invoice email marked SENT for ${row.order_id}`);
    } else {
      throw new Error(result.error || 'Unknown email service error');
    }

  } catch (err) {
    const nextCount = (row.business_email_retry_count || 0) + 1;
    const nextTime = getNextRetryTime(row.business_email_retry_count || 0);
    console.error(`⚠️ Business email failed for ${row.order_id} (Attempt ${nextCount}/${MAX_RETRIES}):`, err.message);
    
    await updateEmailStatus(row.order_id, 'business', {
      status: 'FAILED',
      error: err.message,
      retry_count: nextCount,
      next_retry_at: nextTime
    });
  }
}

let isProcessing = false;

/**
 * NOTE: Exactly-once email delivery cannot be mathematically guaranteed across server crashes
 * without provider-side idempotency keys. To handle crashes gracefully, stale PROCESSING jobs
 * (>15 mins old) are reset to FAILED so they can be retried while respecting max retry limits.
 */
async function recoverStaleEmailJobs() {
  const { getPool } = require('../database/db');
  const pool = getPool();
  if (!pool) return;

  try {
    await pool.query(`
      UPDATE orders 
      SET customer_email_status = 'FAILED',
          customer_email_error = 'Recovered from stuck PROCESSING state'
      WHERE customer_email_status = 'PROCESSING'
        AND created_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)
    `);

    await pool.query(`
      UPDATE orders 
      SET business_email_status = 'FAILED',
          business_email_error = 'Recovered from stuck PROCESSING state'
      WHERE business_email_status = 'PROCESSING'
        AND created_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)
    `);
  } catch (err) {
    console.error('⚠️ Stale email job recovery error:', err.message);
  }
}

/**
 * Sweeps the database for pending/retryable emails and processes them.
 */
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    await recoverStaleEmailJobs();

    const pending = await getPendingEmails();
    if (!pending || pending.length === 0) {
      isProcessing = false;
      return;
    }

    // Process all jobs in parallel but independently
    const promises = [];

    for (const row of pending) {
      // Check Customer Email
      const needsCustomer = (row.customer_email_status === 'PENDING' || row.customer_email_status === 'FAILED') 
                            && row.customer_email_retry_count < MAX_RETRIES 
                            && (!row.customer_email_next_retry_at || new Date(row.customer_email_next_retry_at) <= new Date());
      
      if (needsCustomer) {
        promises.push(processCustomerEmail(row));
      }

      // Check Business Email
      const needsBusiness = (row.business_email_status === 'PENDING' || row.business_email_status === 'FAILED') 
                            && row.business_email_retry_count < MAX_RETRIES 
                            && (!row.business_email_next_retry_at || new Date(row.business_email_next_retry_at) <= new Date());
      
      if (needsBusiness) {
        promises.push(processBusinessEmail(row));
      }
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }

  } catch (err) {
    console.error('Queue Processing Error:', err);
  } finally {
    isProcessing = false;
  }
}

/**
 * Kick off processing immediately for a specific order to avoid waiting for the cron loop.
 */
function triggerImmediate(orderId) {
  setTimeout(processQueue, 100);
}

/**
 * Starts the background polling interval (e.g. every 1 minute)
 */
function startPolling() {
  setInterval(processQueue, 60 * 1000);
  console.log('📬 Email Retry Queue polling started (60s interval)');
}

module.exports = {
  processQueue,
  triggerImmediate,
  startPolling,
};
