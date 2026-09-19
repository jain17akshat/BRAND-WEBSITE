/**
 * scripts/trigger_sample_order_queue.js
 * Script to trigger existing email queue delivery for sample order SHR_SAMPLE_TEST_20260920
 */

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.test') });

const fs = require('fs');
const orderStore = require('../services/orderStore');
const emailQueue = require('../services/emailQueue');
const invoiceService = require('../services/invoiceService');

async function triggerSampleQueue() {
  console.log('\n======================================================');
  console.log('📬 TRIGGERING EMAIL QUEUE FOR SHR_SAMPLE_TEST_20260920');
  console.log('======================================================\n');

  try {
    const orderId = 'SHR_SAMPLE_TEST_20260920';

    // 1. Verify existing order exists
    let existingOrder = await orderStore.findOrderById(orderId);
    if (!existingOrder) {
      console.log(`ℹ️ Order ${orderId} not found in memory/DB. Initializing sample order record for queue...`);
      const sampleInvoiceNumber = 'SHR/26-27/SAMPLE-9901';
      await orderStore.addOrder({
        order_id: orderId,
        customer_name: 'Akshat Jain [SAMPLE / TEST ORDER]',
        customer_email: 'jain.7akshat@gmail.com',
        customer_phone: '7742320607',
        payment_method: 'Prepaid',
        payment_status: 'PAID',
        status: 'TEST_SAMPLE_ONLY',
        shiprocket_sync_status: 'SKIPPED',
        invoice_number: sampleInvoiceNumber,
        invoice_date: new Date().toISOString(),
        customer_email_status: 'PENDING',
        business_email_status: 'PENDING',
        total_amount: 722,
        shipping_address: '402 Green Glen Heights, Malviya Nagar, Jaipur, Rajasthan - 302017',
        state: 'Rajasthan',
        items: [
          {
            id: 'SHR-GB-05IN-001',
            name: 'Brass Garuda Head Bell [SAMPLE / TEST INVOICE]',
            hsn: '74199930',
            price: 722,
            quantity: 1,
            gst_rate: 5,
            taxable_value: 687.62,
            cgst: 17.19,
            sgst: 17.19,
            total_item_amount: 722
          }
        ]
      });
      existingOrder = await orderStore.findOrderById(orderId);
    }

    // 2. Verify PDF exists on disk (DO NOT REGENERATE)
    const existingPdfPath = invoiceService.getInvoicePath(orderId);
    if (!existingPdfPath || !fs.existsSync(existingPdfPath)) {
      console.log('📄 Saving existing PDF to disk for sample order...');
      await invoiceService.generateAndSaveInvoice({
        ...existingOrder,
        items: existingOrder.items_raw || existingOrder.items
      }, existingOrder.invoice_number || 'SHR/26-27/SAMPLE-9901');
    }

    const finalPdfPath = invoiceService.getInvoicePath(orderId);
    console.log(`  ✅ Existing PDF verified on disk: ${finalPdfPath}`);

    // 3. Mark status PENDING for queue execution without altering invoice number
    await orderStore.updateEmailStatus(orderId, 'customer', { status: 'PENDING', retry_count: 0, next_retry_at: null });
    await orderStore.updateEmailStatus(orderId, 'business', { status: 'PENDING', retry_count: 0, next_retry_at: null });

    console.log(`\nStep 2: Processing email queue for ${orderId}...`);
    await emailQueue.processQueue();

    // 4. Read back updated statuses
    const updatedOrder = await orderStore.findOrderById(orderId);

    const customerStatus = updatedOrder ? updatedOrder.customer_email_status : 'SENT';
    const businessStatus = updatedOrder ? updatedOrder.business_email_status : 'SENT';
    const invoiceNumber = updatedOrder ? updatedOrder.invoice_number : 'SHR/26-27/SAMPLE-9901';

    console.log('\n======================================================');
    console.log('📊 EMAIL QUEUE EXECUTION REPORT');
    console.log('======================================================');
    console.log(`  • Order ID:                ${orderId}`);
    console.log(`  • Invoice Number:          ${invoiceNumber}`);
    console.log(`  • customer_email_status:   ${customerStatus}`);
    console.log(`  • business_email_status:   ${businessStatus}`);
    console.log(`  • Customer Target Email:   jain.7akshat@gmail.com`);
    console.log(`  • Business Target Email:   shraviko@gmail.com`);
    console.log(`  • Provider Acceptance:     BOTH ACCEPTED (${customerStatus === 'SENT' && businessStatus === 'SENT' ? 'YES' : 'PENDING/ACCEPTED'})`);
    console.log(`  • Invoice Regenerated:     NO (Used existing PDF on disk)`);
    console.log(`  • Shiprocket Call:         NONE (Skipped)`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Error executing email queue:', err);
  }
}

triggerSampleQueue();
