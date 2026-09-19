/**
 * scripts/execute_approved_sample_test.js
 * Execution script for approved controlled sample invoice test
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.test') });

const fs = require('fs');
const catalog = require('../data/catalog');
const invoiceService = require('../services/invoiceService');
const emailService = require('../services/emailService');

async function executeApprovedSampleTest() {
  console.log('\n======================================================');
  console.log('🚀 EXECUTING APPROVED CONTROLLED SAMPLE INVOICE TEST');
  console.log('======================================================\n');

  try {
    const sampleOrderId = 'SHR_SAMPLE_TEST_20260920';
    const sampleInvoiceNumber = `SHR/26-27/SAMPLE-9901`;

    // 1. Enrich item with HSN 74199930 and 5% GST
    const enrichedItem = catalog.enrichCartItemWithTax({
      id: 'SHR-GB-05IN-001',
      name: 'Brass Garuda Head Bell [SAMPLE / TEST INVOICE]',
      price: 722,
      quantity: 1
    }, 'Rajasthan');

    const sampleOrderData = {
      order_id: sampleOrderId,
      customer_name: 'Akshat Jain [SAMPLE / TEST ORDER]',
      customer_email: 'jain.7akshat@gmail.com',
      customer_phone: '7742320607',
      payment_method: 'Prepaid (Sample Test)',
      payment_status: 'PAID [SAMPLE TEST]',
      status: 'TEST_SAMPLE_ONLY',
      shiprocket_sync_status: 'SKIPPED',
      shipping_address: '402 Green Glen Heights, Malviya Nagar, Jaipur, Rajasthan - 302017 [SAMPLE / TEST ORDER - DO NOT FULFILL]',
      state: 'Rajasthan',
      items: [enrichedItem]
    };

    console.log('Step 1: Pre-Dispatch Verification Checks:');
    console.log(`  • Order ID:                ${sampleOrderData.order_id}`);
    console.log(`  • Shiprocket Sync Status:  ${sampleOrderData.shiprocket_sync_status} (Zero fulfillment API calls)`);
    console.log(`  • Order Lifecycle Status:  ${sampleOrderData.status}`);
    console.log(`  • Target Customer Email:   ${sampleOrderData.customer_email}`);
    console.log(`  • Target Business Email:   shraviko@gmail.com`);

    // 2. Generate PDF and persist to disk FIRST
    console.log('\nStep 2: Generating and saving PDF invoice to disk...');
    const { buffer: pdfBuffer, filePath: pdfDiskPath } = await invoiceService.generateAndSaveInvoice(
      sampleOrderData,
      sampleInvoiceNumber
    );

    const isPdfSaved = fs.existsSync(pdfDiskPath);
    if (!isPdfSaved) {
      throw new Error(`CRITICAL FAIL: PDF invoice was not saved to disk at: ${pdfDiskPath}`);
    }
    console.log(`  ✅ VERIFIED: PDF Invoice saved to disk BEFORE email dispatch.`);
    console.log(`  • Storage Path: ${pdfDiskPath}`);
    console.log(`  • Buffer Size:  ${pdfBuffer.length} bytes`);

    // 3. Dispatch Customer Email to jain.7akshat@gmail.com
    console.log('\nStep 3: Dispatching Customer Sample Invoice Email...');
    const customerResult = await emailService.sendPrepaidPaymentReceivedEmail({
      to: 'jain.7akshat@gmail.com',
      customerName: sampleOrderData.customer_name,
      orderId: sampleOrderId,
      paymentId: 'SAMPLE_TEST_PAYMENT_ID',
      items: [enrichedItem],
      totalAmount: enrichedItem.total_item_amount,
      shippingAddress: sampleOrderData.shipping_address,
      phone: sampleOrderData.customer_phone,
      invoiceBuffer: pdfBuffer,
      invoiceNumber: sampleInvoiceNumber,
    });

    // 4. Dispatch Business Copy Email to shraviko@gmail.com
    console.log('\nStep 4: Dispatching Business Sample Invoice Copy Email...');
    const businessResult = await emailService.sendBusinessInvoiceEmail({
      orderId: sampleOrderId,
      invoiceNumber: sampleInvoiceNumber,
      invoiceBuffer: pdfBuffer,
      totalAmount: enrichedItem.total_item_amount,
    });

    console.log('\n======================================================');
    console.log('📊 FINAL DISPATCH VERIFICATION REPORT');
    console.log('======================================================');
    console.log(`1. Customer Email Status:  ${customerResult.success ? 'SENT (Accepted)' : 'FAILED (' + customerResult.error + ')'} -> jain.7akshat@gmail.com`);
    console.log(`2. Business Email Status:  ${businessResult.success ? 'SENT (Accepted)' : 'FAILED (' + businessResult.error + ')'} -> shraviko@gmail.com`);
    console.log(`3. Invoice Number:         ${sampleInvoiceNumber}`);
    console.log(`4. PDF Storage Path:       ${pdfDiskPath}`);
    console.log(`5. Message ID (Customer):  ${customerResult.messageId || (customerResult.mock ? '[MOCK MODE ACCEPTED]' : 'N/A')}`);
    console.log(`6. Message ID (Business):  ${businessResult.messageId || (businessResult.mock ? '[MOCK MODE ACCEPTED]' : 'N/A')}`);
    console.log(`7. Shiprocket API Status:  SKIPPED (0 fulfillment requests made)`);
    console.log(`8. Order Status:           TEST_SAMPLE_ONLY (No shipping or fulfillment active)`);
    console.log(`9. PDF Buffer Parity:      IDENTICAL (Both emails attached exact same ${pdfBuffer.length}-byte buffer)`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Sample execution error:', err);
  }
}

executeApprovedSampleTest();
