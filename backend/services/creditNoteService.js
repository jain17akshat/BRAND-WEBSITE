/**
 * services/creditNoteService.js
 * ─────────────────────────────────────────────────────────
 * Credit Note Service & PDF Renderer for SHRAVIKO / SHASHWAT ENTERPRISES.
 * Renders Credit Note PDFs using the exact SHRAVIKO visual design system.
 * Implements persistent disk storage (supports CREDIT_NOTE_STORAGE_DIR mount).
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { getOrAssignCreditNoteNumberAtomic, saveCreditNoteRecord, getPool } = require('../database/db');
const { calculateOrderTax, SELLER_LEGAL_NAME, SELLER_TRADE_NAME, SELLER_GSTIN, SELLER_PAN } = require('./taxCalculator');
const { logEvent } = require('./auditLogService');

// Ensure credit-notes storage directory exists
const CREDIT_NOTES_DIR = process.env.CREDIT_NOTE_STORAGE_DIR
  ? path.resolve(process.env.CREDIT_NOTE_STORAGE_DIR)
  : path.join(__dirname, '../data/credit-notes');

try {
  if (!fs.existsSync(CREDIT_NOTES_DIR)) {
    fs.mkdirSync(CREDIT_NOTES_DIR, { recursive: true });
  }
  fs.accessSync(CREDIT_NOTES_DIR, fs.constants.W_OK);
  console.log(`📁 Hostinger Persistent Credit Note Storage verified: ${CREDIT_NOTES_DIR}`);
} catch (dirErr) {
  console.error(`⚠️ Persistent Credit Note directory error for ${CREDIT_NOTES_DIR}:`, dirErr.message);
}

const { formatDate } = require('../utils/dateUtils');

/**
 * Generates Credit Note PDF Buffer matching SHRAVIKO visual template
 */
async function generateCreditNotePDF(cnData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 35, size: 'A4', bufferPages: true });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const PRIMARY_DARK = '#1A1A1A';
      const TEXT_MUTED = '#444444';
      const TEXT_LIGHT_MUTED = '#666666';
      const BORDER_COLOR = '#D3C9BC';
      const ACCENT_BG = '#F4EDE2';
      const ROW_BORDER_COLOR = '#E6DFD5';

      const headerTop = 35;

      // Header Left: SHRAVIKO Logo Asset
      const logoPath = fs.existsSync(path.join(__dirname, '../assets/shraviko_logo.png'))
        ? path.join(__dirname, '../assets/shraviko_logo.png')
        : path.join(__dirname, '../assets/logo.png');

      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 35, headerTop, { width: 165 });
        } catch {
          doc.fontSize(22).font('Helvetica-Bold').fillColor('#7A4B1D').text('SHRAVIKO', 35, headerTop);
        }
      } else {
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#7A4B1D').text('SHRAVIKO', 35, headerTop);
      }

      // Seller Details
      const sellerY = headerTop + 54;
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text(SELLER_TRADE_NAME, 35, sellerY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK)
         .text(`GSTIN: ${SELLER_GSTIN}   |   PAN: ${SELLER_PAN}`, 35, sellerY + 14);

      doc.fontSize(8).font('Helvetica').fillColor(TEXT_MUTED);
      doc.text('Ground Floor, Building No./Flat No.: 01', 35, sellerY + 25);
      doc.text('Rikhabdeo Junction Jaisanshehwari Udaipur Road', 35, sellerY + 35);
      doc.text('Nearby Landmark: Kisan Samuti', 35, sellerY + 45);
      doc.text('Locality/Sub Locality: Patuna Chowk', 35, sellerY + 55);
      doc.text('City/Town/Village: Rikhabdeo, District: Udaipur', 35, sellerY + 65);
      doc.text('State: Rajasthan, PIN Code: 313802', 35, sellerY + 75);

      // Header Right: CREDIT NOTE title & Callout Pill Box
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#A91B0D').text('CREDIT NOTE', 350, headerTop, { align: 'right', width: 210 });
      doc.fontSize(9).font('Helvetica').fillColor(TEXT_LIGHT_MUTED).text('Original for Recipient', 350, headerTop + 24, { align: 'right', width: 210 });

      // Credit Note Number Pill Box
      const pillX = 365;
      const pillY = headerTop + 46;
      const pillWidth = 195;
      const pillHeight = 38;

      doc.save();
      doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 4).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(8).font('Helvetica-Bold').fillColor(TEXT_LIGHT_MUTED).text('Credit Note Number', pillX, pillY + 6, { align: 'center', width: pillWidth });
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#A91B0D').text(cnData.credit_note_number || 'N/A', pillX, pillY + 18, { align: 'center', width: pillWidth });

      // Divider 1
      const divider1Y = sellerY + 90;
      doc.moveTo(35, divider1Y).lineTo(560, divider1Y).strokeColor(BORDER_COLOR).lineWidth(0.75).stroke();

      // Order & Invoice Reference Section (3 Columns)
      const infoY = divider1Y + 10;
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
      doc.text('Credit Note Date', 35, infoY);
      doc.text('Original Invoice', 35, infoY + 14);
      doc.text('Invoice Date', 35, infoY + 28);
      doc.text('Order ID', 35, infoY + 42);

      doc.font('Helvetica').fillColor(PRIMARY_DARK);
      doc.text(`: ${formatDate(cnData.credit_note_date)}`, 115, infoY);
      doc.text(`: ${cnData.original_invoice_number || 'N/A'}`, 115, infoY + 14);
      doc.text(`: ${formatDate(cnData.original_invoice_date)}`, 115, infoY + 28);
      doc.text(`: ${cnData.order_id || 'N/A'}`, 115, infoY + 42);

      // Vertical Divider 1
      doc.moveTo(215, infoY).lineTo(215, infoY + 56).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      // Col 2: Customer Details
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Customer Details', 225, infoY);
      doc.fontSize(8.5).font('Helvetica').fillColor(PRIMARY_DARK);
      doc.text(cnData.customer_name || 'Valued Customer', 225, infoY + 14, { width: 160 });
      doc.text(cnData.billing_address || cnData.shipping_address || 'N/A', 225, infoY + 26, { width: 160, height: 26 });
      if (cnData.customer_phone) {
        doc.text(`Phone: ${cnData.customer_phone}`, 225, infoY + 44, { width: 160 });
      }

      // Vertical Divider 2
      doc.moveTo(395, infoY).lineTo(395, infoY + 56).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      // Col 3: Return Reason & Reference
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Return Details', 405, infoY);
      doc.fontSize(8.5).font('Helvetica').fillColor(PRIMARY_DARK);
      doc.text(`Return ID: ${cnData.return_id || 'N/A'}`, 405, infoY + 14, { width: 155 });
      doc.text(`Reason: ${cnData.reason || 'Goods Returned'}`, 405, infoY + 26, { width: 155 });
      doc.text(`Refund Status: ${cnData.refund_status || 'PENDING'}`, 405, infoY + 44, { width: 155 });

      // Product Table Header
      const tableHeaderY = infoY + 66;
      const colX = { num: 35, prod: 60, title: 175, qty: 295, price: 325, disc: 370, taxVal: 415, gst: 465, total: 510 };
      const colW = { num: 23, prod: 112, title: 118, qty: 28, price: 43, disc: 43, taxVal: 48, gst: 43, total: 50 };

      doc.save();
      doc.rect(35, tableHeaderY, 525, 24).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(8).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
      doc.text('#', colX.num, tableHeaderY + 7, { width: colW.num, align: 'center' });
      doc.text('Returned Item', colX.prod, tableHeaderY + 7, { width: colW.prod, align: 'left' });
      doc.text('Title', colX.title, tableHeaderY + 7, { width: colW.title, align: 'left' });
      doc.text('Qty', colX.qty, tableHeaderY + 7, { width: colW.qty, align: 'center' });
      doc.text('Unit Price ₹', colX.price, tableHeaderY + 7, { width: colW.price, align: 'right' });
      doc.text('Discount ₹', colX.disc, tableHeaderY + 7, { width: colW.disc, align: 'right' });
      doc.text('Taxable Rev ₹', colX.taxVal, tableHeaderY + 7, { width: colW.taxVal, align: 'right' });
      doc.text('GST Rev ₹', colX.gst, tableHeaderY + 7, { width: colW.gst, align: 'right' });
      doc.text('Total Rev ₹', colX.total, tableHeaderY + 7, { width: colW.total, align: 'right' });

      let currentY = tableHeaderY + 24;
      const items = typeof cnData.items === 'string' ? JSON.parse(cnData.items) : (cnData.items || []);

      let totalQty = 0;
      let sumUnitPrice = 0;
      let sumDiscount = 0;
      let sumTaxable = 0;
      let sumGst = 0;
      let sumTotal = 0;

      items.forEach((item, index) => {
        const qty = item.quantity || item.units || 1;
        const unitPrice = item.unit_price || item.price || 0;
        const discount = item.discount || 0;
        const taxableVal = item.taxable_value || 0;
        const gstVal = item.total_tax_amount || (item.cgst + item.sgst + item.igst) || 0;
        const itemTotal = item.total_item_amount || 0;

        totalQty += qty;
        sumUnitPrice += (unitPrice * qty);
        sumDiscount += discount;
        sumTaxable += taxableVal;
        sumGst += gstVal;
        sumTotal += itemTotal;

        const prodCategory = item.name || item.product || 'Returned Product';
        const prodTitle = item.title || item.name || 'Returned Item';
        const hsn = item.hsn || '83061000';
        const sku = item.sku || item.id || 'SKU-RET';

        const rowHeight = Math.max(38, Math.max(
          doc.heightOfString(prodCategory, { width: colW.prod }),
          doc.heightOfString(prodTitle, { width: colW.title })
        ) + 24);

        // Row Border & Fill
        doc.save();
        doc.rect(35, currentY, 525, rowHeight).strokeColor(ROW_BORDER_COLOR).lineWidth(0.5).stroke();
        doc.restore();

        // Row Content
        doc.fontSize(8).font('Helvetica').fillColor(PRIMARY_DARK);
        doc.text(String(index + 1), colX.num, currentY + 6, { width: colW.num, align: 'center' });

        doc.font('Helvetica-Bold').text(prodCategory, colX.prod, currentY + 6, { width: colW.prod, align: 'left' });
        doc.fontSize(7).font('Helvetica').fillColor(TEXT_LIGHT_MUTED);
        doc.text(`HSN/SAC: ${hsn}`, colX.prod, currentY + 18, { width: colW.prod, align: 'left' });
        doc.text(`SKU: ${sku}`, colX.prod, currentY + 26, { width: colW.prod, align: 'left' });

        doc.fontSize(8).font('Helvetica').fillColor(PRIMARY_DARK);
        doc.text(prodTitle, colX.title, currentY + 6, { width: colW.title, align: 'left' });
        doc.text(String(qty), colX.qty, currentY + 6, { width: colW.qty, align: 'center' });

        doc.text(unitPrice.toFixed(2), colX.price, currentY + 6, { width: colW.price, align: 'right' });
        doc.text(discount > 0 ? `-${discount.toFixed(2)}` : '-0.00', colX.disc, currentY + 6, { width: colW.disc, align: 'right' });
        doc.text(taxableVal.toFixed(2), colX.taxVal, currentY + 6, { width: colW.taxVal, align: 'right' });
        doc.text(gstVal.toFixed(2), colX.gst, currentY + 6, { width: colW.gst, align: 'right' });
        doc.font('Helvetica-Bold').text(itemTotal.toFixed(2), colX.total, currentY + 6, { width: colW.total, align: 'right' });

        currentY += rowHeight;
      });

      // Table Summary Row
      doc.save();
      doc.rect(35, currentY, 525, 22).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(8).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
      doc.text('Total Reversal', colX.num, currentY + 6, { width: colX.qty - colX.num - 5, align: 'right' });
      doc.text(String(totalQty), colX.qty, currentY + 6, { width: colW.qty, align: 'center' });
      doc.text(sumUnitPrice.toFixed(2), colX.price, currentY + 6, { width: colW.price, align: 'right' });
      doc.text(sumDiscount > 0 ? `-${sumDiscount.toFixed(2)}` : '-0.00', colX.disc, currentY + 6, { width: colW.disc, align: 'right' });
      doc.text(sumTaxable.toFixed(2), colX.taxVal, currentY + 6, { width: colW.taxVal, align: 'right' });
      doc.text(sumGst.toFixed(2), colX.gst, currentY + 6, { width: colW.gst, align: 'right' });
      doc.text(sumTotal.toFixed(2), colX.total, currentY + 6, { width: colW.total, align: 'right' });

      currentY += 30;

      // Reversal Callout Box
      const cnBoxX = 330;
      const cnBoxWidth = 230;
      const cnBoxHeight = 36;
      const finalAmount = cnData.total_amount || sumTotal;

      doc.save();
      doc.roundedRect(cnBoxX, currentY, cnBoxWidth, cnBoxHeight, 4).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(11).font('Helvetica-Bold').fillColor('#A91B0D').text('Credit Amount', cnBoxX + 14, currentY + 11);
      doc.fontSize(15).font('Helvetica-Bold').fillColor('#A91B0D').text(`₹ ${Number(finalAmount).toFixed(2)}`, cnBoxX, currentY + 9, { align: 'right', width: cnBoxWidth - 14 });

      // Signatory Section
      const sigY = currentY + 46;
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text(`For ${SELLER_TRADE_NAME}`, 350, sigY, { align: 'right', width: 210 });
      doc.moveTo(410, sigY + 36).lineTo(560, sigY + 36).strokeColor(BORDER_COLOR).lineWidth(0.75).stroke();
      doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_LIGHT_MUTED).text('Authorized Signatory', 350, sigY + 40, { align: 'right', width: 210 });

      // Footer Notes
      const footerY = Math.max(currentY + 54, sigY + 56);
      doc.fontSize(9).font('Helvetica-Oblique').fillColor(PRIMARY_DARK);
      doc.text('This Credit Note is issued in accordance with GST Rules for returned goods.', 35, footerY);

      const policyY = footerY + 22;
      doc.moveTo(35, policyY).lineTo(560, policyY).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      // Page Number Footer
      const range = doc.bufferedPageRange();
      const totalPages = range.count;

      for (let i = range.start; i < range.start + totalPages; i++) {
        doc.switchToPage(i);
        const pageFooterY = 788;
        doc.moveTo(35, pageFooterY).lineTo(560, pageFooterY).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();
        doc.fontSize(8).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
        doc.text('📞 +91 00000 00000   |   ✉️ info@shraviko.com   |   🌐 www.shraviko.com', 35, pageFooterY + 8, { width: 380 });
        doc.text(`E. & O.E.    Page ${i + 1} of ${totalPages}`, 420, pageFooterY + 8, { width: 140, align: 'right' });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates, saves to disk, and records a Credit Note in DB
 */
async function generateAndSaveCreditNote({ order, originalInvoiceNumber, originalInvoiceDate, returnId, returnedItems, reason = 'Goods Returned', refundId = null }) {
  if (!order || !originalInvoiceNumber) {
    throw new Error('Missing required order or original invoice details for Credit Note generation.');
  }

  const orderId = order.order_id || order.id;

  // 1. Get or assign Credit Note Number atomically
  const { creditNoteNumber, creditNoteDate } = await getOrAssignCreditNoteNumberAtomic(orderId, returnId);

  // 2. Compute tax breakdown for returned items
  const taxCalc = calculateOrderTax(returnedItems, order.state || order.shipping_state, order.customer_gstin);

  const cnData = {
    credit_note_number: creditNoteNumber,
    credit_note_date: creditNoteDate,
    order_id: orderId,
    original_invoice_number: originalInvoiceNumber,
    original_invoice_date: originalInvoiceDate,
    return_id: returnId || null,
    customer_name: order.customer_name || 'Valued Customer',
    customer_gstin: order.customer_gstin || null,
    customer_email: order.customer_email || '',
    customer_phone: order.customer_phone || '',
    billing_address: order.billing_address || order.shipping_address || '',
    shipping_address: order.shipping_address || '',
    state: order.state || 'Rajasthan',
    place_of_supply: taxCalc.placeOfSupply,
    items: taxCalc.items,
    subtotal: taxCalc.subtotal,
    discount: taxCalc.totalDiscount,
    taxable_value: taxCalc.taxableValue,
    cgst: taxCalc.cgst,
    sgst: taxCalc.sgst,
    igst: taxCalc.igst,
    total_tax: taxCalc.totalTax,
    total_amount: taxCalc.grandTotal,
    reason,
    status: 'ISSUED',
    refund_id: refundId,
    refund_amount: taxCalc.grandTotal,
    refund_status: refundId ? 'PROCESSED' : 'PENDING'
  };

  // 3. Render PDF
  const buffer = await generateCreditNotePDF(cnData);
  const fileName = `CreditNote_${cnData.credit_note_number.replace(/\//g, '_')}.pdf`;
  const filePath = path.join(CREDIT_NOTES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  cnData.pdf_path = filePath;

  console.log(`💾 Credit Note saved to disk: ${filePath}`);

  // 4. Save Record to Database
  await saveCreditNoteRecord(cnData);

  // 5. Post to Financial Audit Log
  await logEvent({
    eventType: 'CREDIT_NOTE_CREATED',
    entityType: 'CREDIT_NOTE',
    entityId: cnData.credit_note_number,
    orderId,
    invoiceNumber: originalInvoiceNumber,
    creditNoteNumber: cnData.credit_note_number,
    metadata: {
      total_amount: cnData.total_amount,
      taxable_value: cnData.taxable_value,
      reason
    }
  });

  return { cnData, buffer, filePath };
}

/**
 * Returns Credit Note PDF path if exists, or null
 */
function getCreditNotePath(cnNumber) {
  const cleanNumber = String(cnNumber).replace(/\//g, '_');
  const filePath = path.join(CREDIT_NOTES_DIR, `CreditNote_${cleanNumber}.pdf`);
  return fs.existsSync(filePath) ? filePath : null;
}

module.exports = {
  generateCreditNotePDF,
  generateAndSaveCreditNote,
  getCreditNotePath
};
