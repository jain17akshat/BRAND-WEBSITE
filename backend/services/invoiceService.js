const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure invoices directory exists
const INVOICES_DIR = path.join(__dirname, '../data/invoices');
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

/**
 * Generates a PDF invoice for an order.
 * @param {Object} order - The order object with customer and items data
 * @param {string} invoiceNumber - The generated sequential invoice number
 * @returns {Promise<Buffer>} - Resolves with the PDF buffer
 */
async function generateInvoice(order, invoiceNumber) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- Header ---
      doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
      doc.moveDown();

      // --- Seller Details ---
      doc.fontSize(10).font('Helvetica-Bold').text('Seller Details:');
      doc.font('Helvetica').text('Legal Name: SHASHWAT ENTERPRISES');
      doc.text('Brand Name: SHRAVIKO');
      doc.text('GSTIN: 08CODPJ2489F1ZT');
      doc.text('Address: GROUND FLOOR, Building No./Flat No.: 01,');
      doc.text('Rikhabdeo Junction Jaisanshewanji Udaipur Road, Near Kisan Samuti,');
      doc.text('Patuna Chowk, Rikhabdeo, Udaipur, Rajasthan, 313802');
      doc.moveDown();

      // --- Invoice Details ---
      doc.font('Helvetica-Bold').text('Invoice Details:');
      doc.font('Helvetica').text(`Invoice Number: ${invoiceNumber}`);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`);
      doc.text(`Order ID: ${order.order_id}`);
      doc.text(`Payment Method: ${order.payment_method}`);
      doc.moveDown();

      // --- Customer Details ---
      doc.font('Helvetica-Bold').text('Customer Details:');
      doc.font('Helvetica').text(`Name: ${order.customer_name}`);
      doc.text(`Email: ${order.customer_email || 'N/A'}`);
      doc.text(`Phone: ${order.customer_phone || 'N/A'}`);
      doc.text(`Shipping Address: ${order.shipping_address}`);
      doc.text(`State of Supply: ${order.state || 'N/A'}`);
      doc.moveDown();

      // --- Table Header ---
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop, { width: 150 });
      doc.text('HSN', 210, tableTop, { width: 60 });
      doc.text('Qty', 280, tableTop, { width: 30 });
      doc.text('Rate', 320, tableTop, { width: 50 });
      doc.text('Taxable', 380, tableTop, { width: 50 });
      doc.text('GST', 440, tableTop, { width: 40 });
      doc.text('Total', 490, tableTop, { width: 50, align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();
      
      let y = tableTop + 20;
      doc.font('Helvetica');

      let grandTotal = 0;
      let totalTaxable = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;

      const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
      const isIntraState = (order.state || '').trim().toLowerCase() === 'rajasthan';

      items.forEach(item => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        const name = (item.name || 'Product').slice(0, 30);
        const hsn = item.hsn || 'N/A';
        const qty = item.quantity || item.units || 1;
        const rate = item.taxable_value_per_unit || 0;
        const taxable = item.taxable_value || 0;
        const gstRate = item.gst_rate || 0;
        const cgst = item.cgst || 0;
        const sgst = item.sgst || 0;
        const igst = item.igst || 0;
        const total = item.total_item_amount || item.price * qty;

        totalTaxable += taxable;
        totalCgst += cgst;
        totalSgst += sgst;
        totalIgst += igst;
        grandTotal += total;

        doc.text(name, 50, y, { width: 150 });
        doc.text(hsn, 210, y, { width: 60 });
        doc.text(qty.toString(), 280, y, { width: 30 });
        doc.text(rate.toFixed(2), 320, y, { width: 50 });
        doc.text(taxable.toFixed(2), 380, y, { width: 50 });
        doc.text(`${gstRate}%`, 440, y, { width: 40 });
        doc.text(total.toFixed(2), 490, y, { width: 50, align: 'right' });
        
        y += 20;
      });

      doc.moveTo(50, y).lineTo(540, y).stroke();
      y += 10;

      // --- Summary ---
      doc.font('Helvetica-Bold');
      doc.text('Total Taxable Value:', 350, y);
      doc.text(totalTaxable.toFixed(2), 490, y, { align: 'right' });
      y += 15;

      if (isIntraState) {
        doc.text('CGST:', 350, y);
        doc.text(totalCgst.toFixed(2), 490, y, { align: 'right' });
        y += 15;
        doc.text('SGST:', 350, y);
        doc.text(totalSgst.toFixed(2), 490, y, { align: 'right' });
        y += 15;
      } else {
        doc.text('IGST:', 350, y);
        doc.text(totalIgst.toFixed(2), 490, y, { align: 'right' });
        y += 15;
      }

      doc.moveTo(350, y).lineTo(540, y).stroke();
      y += 5;

      doc.text('Grand Total (₹):', 350, y);
      doc.text(grandTotal.toFixed(2), 490, y, { align: 'right' });

      doc.moveDown(2);
      
      // Notes
      doc.font('Helvetica-Oblique').fontSize(8);
      doc.text('Thank you for shopping with SHRAVIKO.', 50, doc.y);
      doc.text('This is a computer-generated invoice and does not require a signature.', 50, doc.y);

      // Save a local copy
      const localPdfPath = path.join(INVOICES_DIR, `Invoice_${order.order_id}.pdf`);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateInvoice
};
