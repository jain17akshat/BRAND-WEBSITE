const fs = require('fs');
const path = require('path');

const { generateAndSaveInvoice } = require('../services/invoiceService');

async function testPdf() {
  const sampleOrder = {
    order_id: 'SHR984721',
    created_at: '2026-09-20T10:15:00.000Z',
    invoice_date: '2026-09-20T10:15:00.000Z',
    payment_method: 'Prepaid (Razorpay)',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru, Karnataka - 560102',
    state: 'Karnataka',
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
        cgst: 0,
        sgst: 0,
        igst: 182.90,
        total_tax_amount: 182.90,
        total_item_amount: 1199.00,
      },
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
        cgst: 0,
        sgst: 0,
        igst: 38.10,
        total_tax_amount: 38.10,
        total_item_amount: 850.00,
      }
    ]
  };

  try {
    const res = await generateAndSaveInvoice(sampleOrder, 'SHR/26-27/00042');
    console.log('✅ Test PDF generated successfully at:', res.filePath);
  } catch (err) {
    console.error('❌ Test PDF generation failed:', err);
  }
}

testPdf();
