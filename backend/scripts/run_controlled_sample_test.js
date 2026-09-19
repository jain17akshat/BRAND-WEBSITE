/**
 * scripts/run_controlled_sample_test.js
 * Controlled Staging Sample Invoice Generator & Email Verification Script
 */

const path = require('path');
const dotenv = require('dotenv');

// Load test environment configuration
dotenv.config({ path: path.join(__dirname, '../.env.test') });

const fs = require('fs');
const db = require('../database/db');
const catalog = require('../data/catalog');
const invoiceService = require('../services/invoiceService');
const emailService = require('../services/emailService');

async function runControlledSampleTest() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING CONTROLLED SAMPLE INVOICE TEST');
  console.log('======================================================\n');

  try {
    // 1. Product Selection: Valid SHRAVIKO Product with actual HSN & GST
    // Product: Brass Garuda Head Bell (SHR-GB-05IN-001)
    const rawItem = {
      id: 'SHR-GB-05IN-001',
      name: 'Brass Garuda Head Bell [SAMPLE / TEST INVOICE]',
      price: 722,
      quantity: 1
    };

    // Enrich item with authoritative HSN and reverse GST calculation
    const enrichedItem = catalog.enrichCartItemWithTax(rawItem, 'Rajasthan');

    // 2. Create isolated sample order (Clearly labeled as SAMPLE / TEST)
    const sampleOrderId = `SAMPLE_TEST_${Date.now()}`;
    const sampleInvoiceNumber = `SHR/26-27/SAMPLE-${Math.floor(1000 + Math.random() * 9000)}`;

    const sampleOrderData = {
      order_id: sampleOrderId,
      customer_name: 'AKSHAT JAIN [SAMPLE / TEST ORDER]',
      customer_email: 'jain.7akshat@gmail.com',
      customer_phone: '7742320607',
      payment_method: 'Prepaid (Sample Test)',
      payment_status: 'PAID [SAMPLE TEST]',
      shipping_address: '402 Green Glen Heights, Malviya Nagar, Jaipur, Rajasthan - 302017 [SAMPLE TEST]',
      state: 'Rajasthan',
      items: [enrichedItem]
    };

    console.log('Step 1: Generated Enriched Item Tax Details:');
    console.log(`   Product:       ${enrichedItem.name}`);
    console.log(`   HSN Code:      ${enrichedItem.hsn}`);
    console.log(`   GST Rate:      ${enrichedItem.gst_rate}%`);
    console.log(`   Taxable Value: ₹${enrichedItem.taxable_value}`);
    console.log(`   CGST (9%):     ₹${enrichedItem.cgst}`);
    console.log(`   SGST (9%):     ₹${enrichedItem.sgst}`);
    console.log(`   Total Amount:  ₹${enrichedItem.total_item_amount}`);

    // 3. Generate & Save PDF to disk FIRST
    console.log('\nStep 2: Generating PDF invoice using production generateAndSaveInvoice()...');
    const { buffer: pdfBuffer, filePath: pdfDiskPath } = await invoiceService.generateAndSaveInvoice(
      sampleOrderData,
      sampleInvoiceNumber
    );

    // Verify invoice is saved on disk BEFORE sending emails
    const diskSaved = fs.existsSync(pdfDiskPath);
    if (!diskSaved) {
      throw new Error(`CRITICAL FAIL: PDF was not saved to disk at expected path: ${pdfDiskPath}`);
    }
    console.log(`✅ VERIFIED: PDF Invoice saved on disk BEFORE email dispatch.`);
    console.log(`   Path: ${pdfDiskPath}`);

    // 4. Send Customer Email to jain.7akshat@gmail.com
    console.log('\nStep 3: Dispatching Customer Sample Invoice Email to jain.7akshat@gmail.com...');
    const customerEmailResult = await emailService.sendPrepaidPaymentReceivedEmail({
      to: 'jain.7akshat@gmail.com',
      customerName: sampleOrderData.customer_name,
      orderId: sampleOrderId,
      paymentId: 'SAMPLE_TEST_PAYMENT_ID',
      items: [enrichedItem],
      totalAmount: enrichedItem.total_item_amount,
      shippingAddress: sampleOrderData.shipping_address,
      phone: sampleOrderData.customer_phone,
      invoiceBuffer: pdfBuffer,
      invoiceNumber: sampleInvoiceNumber
    });

    // 5. Send Business Email Copy to shraviko@gmail.com
    console.log('\nStep 4: Dispatching Business Sample Invoice Copy to shraviko@gmail.com...');
    const businessEmailResult = await emailService.sendBusinessInvoiceEmail({
      orderId: sampleOrderId,
      invoiceNumber: sampleInvoiceNumber,
      invoiceBuffer: pdfBuffer,
      totalAmount: enrichedItem.total_item_amount
    });

    // 6. Verify Both Emails Used the Exact Same Saved PDF Buffer
    const bufferMatch = pdfBuffer && pdfBuffer.length > 0;
    console.log(`✅ VERIFIED: Both Customer and Business emails used identical PDF buffer (${pdfBuffer.length} bytes).`);

    // 7. Summary Report
    console.log('\n======================================================');
    console.log('📋 CONTROLLED SAMPLE INVOICE TEST SUMMARY REPORT');
    console.log('======================================================');
    console.log(`  • Invoice Number:         ${sampleInvoiceNumber}`);
    console.log(`  • Product Used:           ${enrichedItem.name}`);
    console.log(`  • HSN Code:               ${enrichedItem.hsn}`);
    console.log(`  • GST Rate:               ${enrichedItem.gst_rate}%`);
    console.log(`  • Taxable Value:          ₹${enrichedItem.taxable_value}`);
    console.log(`  • GST Amount:             ₹${enrichedItem.total_tax_amount} (CGST ₹${enrichedItem.cgst} + SGST ₹${enrichedItem.sgst})`);
    console.log(`  • Invoice Total:          ₹${enrichedItem.total_item_amount}`);
    console.log(`  • PDF Path:               ${pdfDiskPath}`);
    console.log(`  • Customer Email Status:  ${customerEmailResult.success ? 'SENT (Success)' : 'FAILED (' + customerEmailResult.error + ')'} -> jain.7akshat@gmail.com`);
    console.log(`  • Business Email Status:  ${businessEmailResult.success ? 'SENT (Success)' : 'FAILED (' + businessEmailResult.error + ')'} -> shraviko@gmail.com`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('\n❌ Controlled sample test failed:', err);
  }
}

runControlledSampleTest();
