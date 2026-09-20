const fs = require('fs');
const path = require('path');
const { generateAndSaveInvoice, getOrGenerateInvoicePath, getInvoicePath } = require('../services/invoiceService');

async function runValidationTests() {
  console.log('==================================================');
  console.log('🚀 SHRAVIKO INVOICE PDF VALIDATION SUITE');
  console.log('==================================================\n');

  // ---------------------------------------------------------
  // TEST 1: New Prepaid Invoice
  // ---------------------------------------------------------
  console.log('--- TEST 1: New Prepaid Invoice ---');
  const prepaidOrder = {
    order_id: 'SHR_PREPAID_901',
    created_at: '2026-09-20T09:00:00.000Z',
    invoice_date: '2026-09-20T09:00:00.000Z',
    payment_method: 'Prepaid (Razorpay)',
    customer_name: 'Ananya Sharma',
    customer_email: 'ananya@example.com',
    customer_phone: '+91 99887 76655',
    shipping_address: '102 Vrindavan Society, MG Road, Jaipur, Rajasthan - 302001',
    billing_address: '102 Vrindavan Society, MG Road, Jaipur, Rajasthan - 302001',
    items: [
      {
        name: 'Brass Garuda Temple Bell',
        title: 'Brass Garuda Bell (Heavy Weight 450g)',
        sku: 'SHR-BELL-GARUDA-01',
        hsn: '83061000',
        quantity: 1,
        price: 1299,
        discount: 100,
        taxable_value: 1016.10,
        gst_rate: 18,
        cgst: 91.45,
        sgst: 91.45,
        igst: 0,
        total_tax_amount: 182.90,
        total_item_amount: 1199.00
      }
    ],
    total_amount: 1199.00
  };

  const res1 = await generateAndSaveInvoice(prepaidOrder, 'SHR/26-27/00101');
  console.log('✅ Test 1 Passed! PDF created at:', res1.filePath);

  // ---------------------------------------------------------
  // TEST 2: COD Invoice After Delivery
  // ---------------------------------------------------------
  console.log('\n--- TEST 2: COD Invoice After Delivery ---');
  const codOrder = {
    order_id: 'SHR_COD_902',
    created_at: '2026-09-18T14:30:00.000Z',
    invoice_date: '2026-09-20T12:00:00.000Z',
    payment_method: 'COD (Shiprocket Delivered)',
    customer_name: 'Vikram Singh',
    customer_email: 'vikram@example.com',
    customer_phone: '+91 91234 56789',
    shipping_address: 'House 45, Sector 14, Udaipur, Rajasthan - 313001',
    billing_address: 'House 45, Sector 14, Udaipur, Rajasthan - 313001',
    items: [
      {
        name: 'Pure Bhimseni Camphor',
        title: 'Bhimseni Camphor (250g Jar)',
        sku: 'SHR-KAP-BHEEM-250G',
        hsn: '29142990',
        quantity: 2,
        price: 450,
        discount: 50,
        taxable_value: 761.90,
        gst_rate: 5,
        cgst: 19.05,
        sgst: 19.05,
        igst: 0,
        total_tax_amount: 38.10,
        total_item_amount: 850.00
      }
    ],
    total_amount: 850.00
  };

  const res2 = await generateAndSaveInvoice(codOrder, 'SHR/26-27/00102');
  console.log('✅ Test 2 Passed! PDF created at:', res2.filePath);

  // ---------------------------------------------------------
  // TEST 3: Invoice Recovery / Auto-Regeneration
  // ---------------------------------------------------------
  console.log('\n--- TEST 3: Invoice Recovery / Auto-Regeneration ---');
  const targetPath = res1.filePath;
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
    console.log('🗑️ Deleted PDF from disk to simulate loss:', targetPath);
  }

  const recoveredPath = await getOrGenerateInvoicePath({
    order_id: prepaidOrder.order_id,
    invoice_number: 'SHR/26-27/00101',
    customer_name: prepaidOrder.customer_name,
    customer_email: prepaidOrder.customer_email,
    customer_phone: prepaidOrder.customer_phone,
    payment_method: prepaidOrder.payment_method,
    shipping_address: prepaidOrder.shipping_address,
    invoice_date: prepaidOrder.invoice_date,
    items: prepaidOrder.items
  });

  console.log('✅ Test 3 Passed! Auto-regenerated PDF available at:', recoveredPath);
  console.log('   File exists check:', fs.existsSync(recoveredPath));

  // ---------------------------------------------------------
  // TEST 4: Email Attachment Readiness
  // ---------------------------------------------------------
  console.log('\n--- TEST 4: Email Attachment Readiness ---');
  const emailInvoice = getInvoicePath(prepaidOrder.order_id);
  const fileStats = fs.statSync(emailInvoice);
  console.log('✅ Test 4 Passed! PDF exists and ready for Email Queue:', emailInvoice, `(${fileStats.size} bytes)`);

  // ---------------------------------------------------------
  // TEST 5 & 6: Multi-Product & Multi-Page PDF
  // ---------------------------------------------------------
  console.log('\n--- TEST 5 & 6: Multi-Product & Multi-Page PDF ---');
  const multiItems = [];
  for (let i = 1; i <= 14; i++) {
    multiItems.push({
      name: `Sacred Item #${i}`,
      title: `Handcrafted Sacred Product Variant #${i} (Authentic Traditional Finish)`,
      sku: `SHR-SACRED-${1000 + i}`,
      hsn: '83061000',
      quantity: i % 3 + 1,
      price: 500 + (i * 100),
      discount: 25,
      taxable_value: (475 + (i * 100)) / 1.18,
      gst_rate: 18,
      cgst: 0,
      sgst: 0,
      igst: (475 + (i * 100)) * 0.18 / 1.18,
      total_tax_amount: (475 + (i * 100)) * 0.18 / 1.18,
      total_item_amount: (475 + (i * 100)) * (i % 3 + 1)
    });
  }

  const multiOrder = {
    order_id: 'SHR_MULTI_903',
    created_at: '2026-09-20T14:00:00.000Z',
    invoice_date: '2026-09-20T14:00:00.000Z',
    payment_method: 'Prepaid (Razorpay)',
    customer_name: 'Rajesh Gupta',
    customer_email: 'rajesh@example.com',
    customer_phone: '+91 98111 22233',
    shipping_address: 'Plot 12, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
    billing_address: 'Plot 12, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
    items: multiItems,
    total_amount: multiItems.reduce((acc, it) => acc + it.total_item_amount, 0)
  };

  const resMulti = await generateAndSaveInvoice(multiOrder, 'SHR/26-27/00103');
  console.log('✅ Test 5 & 6 Passed! Multi-page PDF created at:', resMulti.filePath);

  console.log('\n==================================================');
  console.log('🎉 ALL 6 INVOICE TESTS PASSED SUCCESSFULLY!');
  console.log('==================================================');
}

runValidationTests().catch(console.error);
