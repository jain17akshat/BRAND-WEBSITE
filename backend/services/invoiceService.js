const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure invoices directory exists (supports persistent storage mount via INVOICE_STORAGE_DIR)
const INVOICES_DIR = process.env.INVOICE_STORAGE_DIR
  ? path.resolve(process.env.INVOICE_STORAGE_DIR)
  : path.join(__dirname, '../data/invoices');

try {
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
  }
  fs.accessSync(INVOICES_DIR, fs.constants.W_OK);
  console.log(`📁 Hostinger Persistent Invoice Storage verified & writable: ${INVOICES_DIR}`);
} catch (dirErr) {
  console.error(`⚠️ Hostinger Persistent Storage directory error for ${INVOICES_DIR}:`, dirErr.message);
}

/**
 * Formats a date string or timestamp into DD-MM-YYYY format
 */
function formatDate(dateInput) {
  if (!dateInput) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Generates a PDF invoice buffer for an order matching the SHRAVIKO branded template layout.
 * @param {Object} order - The order object with customer and items data
 * @param {string} invoiceNumber - The generated sequential invoice number
 * @returns {Promise<Buffer>} - Resolves with the PDF buffer
 */
async function generateInvoice(order, invoiceNumber) {
  return new Promise((resolve, reject) => {
    try {
      // Create A4 PDF document with 35pt margins and buffered pages for page numbering
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

      // ── Sample / Test Banner ──
      const isSample = order.isSample || order.status === 'TEST_SAMPLE_ONLY' || (order.order_id && String(order.order_id).includes('SAMPLE'));
      if (isSample) {
        doc.save();
        doc.rect(35, 12, 525, 18).fill('#FFF3CD');
        doc.fillColor('#856404').fontSize(8.5).font('Helvetica-Bold').text('*** SAMPLE / TEST INVOICE — NOT FOR COMMERCIAL USE ***', 35, 16, { align: 'center', width: 525 });
        doc.restore();
      }

      // ── 1. HEADER SECTION ──
      const logoPath = fs.existsSync(path.join(__dirname, '../assets/shraviko_logo.png'))
        ? path.join(__dirname, '../assets/shraviko_logo.png')
        : path.join(__dirname, '../assets/logo.png');

      const headerTop = isSample ? 38 : 35;

      // Header Left: SHRAVIKO Logo Asset
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 35, headerTop, { width: 165 });
        } catch (imgErr) {
          doc.fontSize(22).font('Helvetica-Bold').fillColor('#7A4B1D').text('SHRAVIKO', 35, headerTop);
        }
      } else {
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#7A4B1D').text('SHRAVIKO', 35, headerTop);
      }

      // Business & GST Details below Logo
      const sellerY = headerTop + 54;
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('SHASHWAT ENTERPRISES', 35, sellerY);

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK)
         .text('GSTIN: 08CODPJ2489F1ZT   |   PAN: CODPJ2489F', 35, sellerY + 14);

      doc.fontSize(8).font('Helvetica').fillColor(TEXT_MUTED);
      doc.text('Ground Floor, Building No./Flat No.: 01', 35, sellerY + 25);
      doc.text('Rikhabdeo Junction Jaisanshehwari Udaipur Road', 35, sellerY + 35);
      doc.text('Nearby Landmark: Kisan Samuti', 35, sellerY + 45);
      doc.text('Locality/Sub Locality: Patuna Chowk', 35, sellerY + 55);
      doc.text('City/Town/Village: Rikhabdeo, District: Udaipur', 35, sellerY + 65);
      doc.text('State: Rajasthan, PIN Code: 313802', 35, sellerY + 75);

      // Header Right: Title & Invoice Number Callout Box
      doc.fontSize(20).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Tax Invoice', 350, headerTop, { align: 'right', width: 210 });
      doc.fontSize(9).font('Helvetica').fillColor(TEXT_LIGHT_MUTED).text('Original for Recipient', 350, headerTop + 24, { align: 'right', width: 210 });

      // Invoice Number Pill Box (matching reference template)
      const pillX = 365;
      const pillY = headerTop + 46;
      const pillWidth = 195;
      const pillHeight = 38;

      doc.save();
      doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 4).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(8).font('Helvetica-Bold').fillColor(TEXT_LIGHT_MUTED).text('Invoice Number', pillX, pillY + 6, { align: 'center', width: pillWidth });
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text(invoiceNumber || 'N/A', pillX, pillY + 18, { align: 'center', width: pillWidth });

      // ── Horizontal Divider 1 ──
      const divider1Y = sellerY + 90;
      doc.moveTo(35, divider1Y).lineTo(560, divider1Y).strokeColor(BORDER_COLOR).lineWidth(0.75).stroke();

      // ── 2. ORDER INFORMATION (Three Column Layout) ──
      const infoY = divider1Y + 10;
      const rawInvDate = order.invoice_date || order.invoiceDate || order.created_at;
      const formattedInvoiceDate = formatDate(rawInvDate);

      const rawOrdDate = order.created_at || order.order_date;
      const formattedOrderDate = formatDate(rawOrdDate);

      // Col 1: Order Meta
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
      doc.text('Order ID', 35, infoY);
      doc.text('Order Date', 35, infoY + 15);
      doc.text('Invoice Date', 35, infoY + 30);

      doc.font('Helvetica').fillColor(PRIMARY_DARK);
      doc.text(`: ${order.order_id || 'N/A'}`, 95, infoY);
      doc.text(`: ${formattedOrderDate}`, 95, infoY + 15);
      doc.text(`: ${formattedInvoiceDate}`, 95, infoY + 30);

      // Vertical Divider 1
      doc.moveTo(195, infoY).lineTo(195, infoY + 54).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      // Col 2: Bill To
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Bill To', 205, infoY);
      doc.fontSize(8.5).font('Helvetica').fillColor(PRIMARY_DARK);
      const custName = order.customer_name || 'Valued Customer';
      doc.text(custName, 205, infoY + 14, { width: 170 });
      const billingAddr = order.billing_address || order.shipping_address || 'N/A';
      doc.text(billingAddr, 205, infoY + 26, { width: 170, height: 26 });
      if (order.customer_phone) {
        doc.text(`Phone: ${order.customer_phone}`, 205, infoY + 44, { width: 170 });
      }

      // Vertical Divider 2
      doc.moveTo(380, infoY).lineTo(380, infoY + 54).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      // Col 3: Ship To
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Ship To', 390, infoY);
      doc.fontSize(8.5).font('Helvetica').fillColor(PRIMARY_DARK);
      doc.text(custName, 390, infoY + 14, { width: 170 });
      const shippingAddr = order.shipping_address || 'N/A';
      doc.text(shippingAddr, 390, infoY + 26, { width: 170, height: 26 });
      if (order.customer_phone) {
        doc.text(`Phone: ${order.customer_phone}`, 390, infoY + 44, { width: 170 });
      }

      // ── 3. PRODUCT TABLE ──
      const tableHeaderY = infoY + 64;
      const colX = { num: 35, prod: 60, title: 175, qty: 295, price: 325, disc: 370, taxVal: 415, gst: 465, total: 510 };
      const colW = { num: 23, prod: 112, title: 118, qty: 28, price: 43, disc: 43, taxVal: 48, gst: 43, total: 50 };

      function renderTableHeader(yPos) {
        doc.save();
        doc.rect(35, yPos, 525, 24).fillAndStroke(ACCENT_BG, BORDER_COLOR);
        doc.restore();

        doc.fontSize(8).font('Helvetica-Bold').fillColor(PRIMARY_DARK);
        doc.text('#', colX.num, yPos + 7, { width: colW.num, align: 'center' });
        doc.text('Product', colX.prod, yPos + 7, { width: colW.prod, align: 'left' });
        doc.text('Title', colX.title, yPos + 7, { width: colW.title, align: 'left' });
        doc.text('Qty', colX.qty, yPos + 7, { width: colW.qty, align: 'center' });
        doc.text('Unit Price ₹', colX.price, yPos + 7, { width: colW.price, align: 'right' });
        doc.text('Discount ₹', colX.disc, yPos + 7, { width: colW.disc, align: 'right' });
        doc.text('Taxable Value ₹', colX.taxVal, yPos + 7, { width: colW.taxVal, align: 'right' });
        doc.text('GST ₹', colX.gst, yPos + 7, { width: colW.gst, align: 'right' });
        doc.text('Total ₹', colX.total, yPos + 7, { width: colW.total, align: 'right' });
      }

      renderTableHeader(tableHeaderY);

      let currentY = tableHeaderY + 24;
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);

      let totalQty = 0;
      let sumUnitPrice = 0;
      let sumDiscount = 0;
      let sumTaxable = 0;
      let sumGst = 0;
      let sumTotal = 0;

      items.forEach((item, index) => {
        const qty = item.quantity || item.units || 1;
        const unitPrice = item.price || item.selling_price || 0;
        const discount = item.discount || 0;
        const taxableVal = item.taxable_value !== undefined ? Number(item.taxable_value) : (unitPrice * qty / (1 + (item.gst_rate || 5)/100));
        const gstVal = item.total_tax_amount !== undefined ? Number(item.total_tax_amount) : ((item.cgst || 0) + (item.sgst || 0) + (item.igst || 0)) || ((unitPrice * qty) - taxableVal);
        const itemTotal = item.total_item_amount !== undefined ? Number(item.total_item_amount) : (unitPrice * qty);

        totalQty += qty;
        sumUnitPrice += (unitPrice * qty);
        sumDiscount += discount;
        sumTaxable += taxableVal;
        sumGst += gstVal;
        sumTotal += itemTotal;

        const prodCategory = item.category || item.product || item.name || 'Sacred Product';
        const prodTitle = item.title || item.name || 'Sacred Living Item';
        const hsn = item.hsn || item.hsn_code || '83061000';
        const sku = item.sku || item.id || 'SKU-ITEM';

        // Calculate dynamic height for this row
        const rowHeight = Math.max(38, Math.max(
          doc.heightOfString(prodCategory, { width: colW.prod }),
          doc.heightOfString(prodTitle, { width: colW.title })
        ) + 24);

        // Multi-page page break check
        if (currentY + rowHeight > 680) {
          doc.addPage();
          currentY = 35;
          renderTableHeader(currentY);
          currentY += 24;
        }

        // Row Box & Border
        doc.save();
        doc.rect(35, currentY, 525, rowHeight).strokeColor(ROW_BORDER_COLOR).lineWidth(0.5).stroke();
        doc.restore();

        // Row Content
        doc.fontSize(8).font('Helvetica').fillColor(PRIMARY_DARK);
        doc.text(String(index + 1), colX.num, currentY + 6, { width: colW.num, align: 'center' });

        // Product Column
        doc.font('Helvetica-Bold').text(prodCategory, colX.prod, currentY + 6, { width: colW.prod, align: 'left' });
        doc.fontSize(7).font('Helvetica').fillColor(TEXT_LIGHT_MUTED);
        doc.text(`HSN/SAC: ${hsn}`, colX.prod, currentY + 18, { width: colW.prod, align: 'left' });
        doc.text(`SKU: ${sku}`, colX.prod, currentY + 26, { width: colW.prod, align: 'left' });

        // Title Column
        doc.fontSize(8).font('Helvetica').fillColor(PRIMARY_DARK);
        doc.text(prodTitle, colX.title, currentY + 6, { width: colW.title, align: 'left' });

        // Qty Column
        doc.text(String(qty), colX.qty, currentY + 6, { width: colW.qty, align: 'center' });

        // Numbers Columns
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
      doc.text('Total', colX.num, currentY + 6, { width: colX.qty - colX.num - 5, align: 'right' });
      doc.text(String(totalQty), colX.qty, currentY + 6, { width: colW.qty, align: 'center' });
      doc.text(sumUnitPrice.toFixed(2), colX.price, currentY + 6, { width: colW.price, align: 'right' });
      doc.text(sumDiscount > 0 ? `-${sumDiscount.toFixed(2)}` : '-0.00', colX.disc, currentY + 6, { width: colW.disc, align: 'right' });
      doc.text(sumTaxable.toFixed(2), colX.taxVal, currentY + 6, { width: colW.taxVal, align: 'right' });
      doc.text(sumGst.toFixed(2), colX.gst, currentY + 6, { width: colW.gst, align: 'right' });
      doc.text(sumTotal.toFixed(2), colX.total, currentY + 6, { width: colW.total, align: 'right' });

      currentY += 30;

      // Check remaining page height for totals & footer
      if (currentY > 640) {
        doc.addPage();
        currentY = 35;
      }

      // ── 4. GRAND TOTAL CALLOUT BOX & SIGNATORY ──
      const grandTotalBoxX = 330;
      const grandTotalBoxWidth = 230;
      const grandTotalBoxHeight = 36;

      const finalGrandTotal = order.total_amount !== undefined ? order.total_amount : (order.total || sumTotal);

      doc.save();
      doc.roundedRect(grandTotalBoxX, currentY, grandTotalBoxWidth, grandTotalBoxHeight, 4).fillAndStroke(ACCENT_BG, BORDER_COLOR);
      doc.restore();

      doc.fontSize(11).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('Grand Total', grandTotalBoxX + 14, currentY + 11);
      doc.fontSize(15).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text(`₹ ${Number(finalGrandTotal).toFixed(2)}`, grandTotalBoxX, currentY + 9, { align: 'right', width: grandTotalBoxWidth - 14 });

      // Signatory Section Right Aligned
      const sigY = currentY + 46;
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(PRIMARY_DARK).text('For SHASHWAT ENTERPRISES', 350, sigY, { align: 'right', width: 210 });
      doc.moveTo(410, sigY + 36).lineTo(560, sigY + 36).strokeColor(BORDER_COLOR).lineWidth(0.75).stroke();
      doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_LIGHT_MUTED).text('Authorized Signatory', 350, sigY + 40, { align: 'right', width: 210 });

      // ── 5. FOOTER & RETURN POLICY ──
      const footerY = Math.max(currentY + 54, sigY + 56);

      doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(PRIMARY_DARK);
      doc.text('Thank you for your purchase!', 35, footerY);
      doc.text('We hope to serve you again.', 35, footerY + 13);

      const policyY = footerY + 32;
      doc.moveTo(35, policyY).lineTo(560, policyY).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

      doc.fontSize(7.5).font('Helvetica').fillColor(TEXT_LIGHT_MUTED);
      doc.text('Returns Policy: We strive to deliver your order in perfect condition. If you need to return the item, please do so with the original product, packaging and this invoice. Returns are subject to our return policy terms and conditions.', 35, policyY + 6, { width: 525 });
      doc.text('Items are intended for personal use and not for resale unless stated otherwise. Colours and product details may vary slightly.', 35, policyY + 22, { width: 525 });

      // ── 6. TWO-PASS PAGE FOOTER & CONTACT BAR ──
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
 * Generates a PDF invoice, saves it to disk, and returns the buffer.
 * Invoice is persisted FIRST so it remains available via GET /api/orders/:id/invoice
 * even if subsequent email delivery fails.
 *
 * @param {Object} order - The order object with customer and items data
 * @param {string} invoiceNumber - The generated sequential invoice number
 * @returns {Promise<{ buffer: Buffer, filePath: string }>}
 */
async function generateAndSaveInvoice(order, invoiceNumber) {
  const buffer = await generateInvoice(order, invoiceNumber);

  // Persist to disk immediately
  const fileName = `Invoice_${order.order_id}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  console.log(`💾 Invoice saved to disk: ${filePath}`);

  // Interlock GST SALE ledger posting & Audit Trail
  try {
    const { postSaleLedger } = require('./gstLedgerService');
    const { logEvent } = require('./auditLogService');
    const invoiceDate = order.invoice_date || order.invoiceDate || new Date().toISOString();
    await postSaleLedger(order, invoiceNumber, invoiceDate);
    await logEvent({
      eventType: 'INVOICE_CREATED',
      entityType: 'INVOICE',
      entityId: invoiceNumber,
      orderId: order.order_id,
      invoiceNumber,
      metadata: { filePath, total_amount: order.total_amount || order.total }
    });
  } catch (gstErr) {
    console.error(`⚠️ Notice: GST SALE ledger / Audit log auto-post note for ${order.order_id}:`, gstErr.message);
  }

  return { buffer, filePath };
}

/**
 * Check if an invoice PDF exists on disk for a given order ID.
 * @param {string} orderId
 * @returns {string|null} - The file path if it exists, null otherwise
 */
function getInvoicePath(orderId) {
  const filePath = path.join(INVOICES_DIR, `Invoice_${orderId}.pdf`);
  return fs.existsSync(filePath) ? filePath : null;
}

/**
 * Guarantees persistent availability of an invoice PDF for an order.
 * If the PDF file exists on disk, returns its file path immediately.
 * If the PDF is missing from disk but an invoice number has already been assigned in DB,
 * auto-regenerates the PDF file on demand using the assigned invoice number and returns the path.
 *
 * @param {Object} order - Order object containing order_id, invoice_number, items, customer details, etc.
 * @returns {Promise<string|null>} - Resolves to file path if available/generated, null otherwise.
 */
async function getOrGenerateInvoicePath(order) {
  if (!order) return null;
  const orderId = order.order_id || order.id || order.internal_order_id;
  if (!orderId) return null;

  const existingPath = getInvoicePath(orderId);
  if (existingPath) {
    return existingPath;
  }

  // PDF is missing on disk. Check if invoice_number was already assigned in DB.
  const invoiceNumber = order.invoice_number;
  if (invoiceNumber) {
    try {
      console.log(`🔄 Persistent Storage: Auto-regenerating missing invoice PDF for ${orderId} (${invoiceNumber})`);
      let items = order.items_raw || order.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }

      const { filePath } = await generateAndSaveInvoice({
        order_id: orderId,
        customer_name: order.customer_name || 'Valued Customer',
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        payment_method: order.payment_method || 'Prepaid',
        shipping_address: order.shipping_address || '',
        state: order.state || '',
        invoice_date: order.invoice_date || order.invoiceDate || order.created_at,
        items,
      }, invoiceNumber);

      return filePath;
    } catch (err) {
      console.error(`⚠️ Persistent Storage: Failed to auto-regenerate invoice PDF for ${orderId}:`, err.message);
      return null;
    }
  }

  return null;
}

module.exports = {
  generateInvoice,
  generateAndSaveInvoice,
  getInvoicePath,
  getOrGenerateInvoicePath,
};
