/**
 * scripts/generate_sample_staging_invoice.js
 * Generates sample staging invoice PDFs and verifies all required legal & header fields.
 */

const fs = require('fs');
const path = require('path');
const { generateAndSaveInvoice } = require('../services/invoiceService');
const { enrichCartItemWithTax } = require('../data/catalog');

async function runStagingVisualVerification() {
  console.log('--- GENERATING STAGING SAMPLE INVOICES ---');

  // Sample 1: Intra-state (Rajasthan) Prepaid Order
  const prepaidItem1 = enrichCartItemWithTax({ id: 'SHR-BRASS-01', name: 'Brass Pooja Diya', price: 1000, quantity: 1 }, 'Rajasthan');
  const prepaidItem2 = enrichCartItemWithTax({ id: 'SHR-CHN6', name: 'Chandan Incense Sticks', price: 143, quantity: 2 }, 'Rajasthan');

  const prepaidOrder = {
    order_id: 'SHR_STAGING_PREPAID_001',
    customer_name: 'Amitabh Sharma',
    customer_email: 'amitabh@example.com',
    customer_phone: '9876543210',
    payment_method: 'Prepaid',
    payment_status: 'PAID',
    shipping_address: '402 Green Glen Heights, Malviya Nagar, Jaipur, Rajasthan - 302017',
    state: 'Rajasthan',
    items: [prepaidItem1, prepaidItem2]
  };

  const { filePath: prepaidPath, buffer: prepaidBuf } = await generateAndSaveInvoice(prepaidOrder, 'SHR/26-27/00001');
  console.log(`✅ Prepaid Invoice saved to: ${prepaidPath}`);

  // Sample 2: Inter-state (Maharashtra) COD Order
  const codItem1 = enrichCartItemWithTax({ id: 'SHR-NMY-COP-003', name: 'SarvKarya Siddhi Yantra Copper', price: 722, quantity: 1 }, 'Maharashtra');

  const codOrder = {
    order_id: 'SHR_STAGING_COD_002',
    customer_name: 'Priya Deshmukh',
    customer_email: 'priya@example.com',
    customer_phone: '9123456789',
    payment_method: 'COD',
    payment_status: 'COD_PENDING',
    shipping_address: '12 Marine Drive, Nariman Point, Mumbai, Maharashtra - 400021',
    state: 'Maharashtra',
    items: [codItem1]
  };

  const { filePath: codPath, buffer: codBuf } = await generateAndSaveInvoice(codOrder, 'SHR/26-27/00002');
  console.log(`✅ COD Invoice saved to: ${codPath}`);

  // Verify Required PDF Fields
  const prepaidText = prepaidBuf.toString('utf8');
  
  const requiredFields = [
    { name: 'Legal Name', pattern: 'SHASHWAT ENTERPRISES' },
    { name: 'Brand Name', pattern: 'SHRAVIKO' },
    { name: 'GSTIN', pattern: '08CODPJ2489F1ZT' },
    { name: 'Address City', pattern: 'Udaipur' },
    { name: 'Invoice Number', pattern: 'SHR/26-27/00001' },
    { name: 'Payment Method', pattern: 'Prepaid' },
    { name: 'Customer Name', pattern: 'Amitabh Sharma' },
  ];

  console.log('\n--- FIELD VERIFICATION CHECKS ---');
  for (const field of requiredFields) {
    const present = prepaidText.includes(field.pattern) || prepaidBuf.includes(Buffer.from(field.pattern));
    console.log(`  ${present ? '✅' : '❌'} ${field.name}: "${field.pattern}" -> ${present ? 'VERIFIED' : 'MISSING'}`);
  }
}

runStagingVisualVerification().catch(console.error);
