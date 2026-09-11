/**
 * services/emailService.js
 * ─────────────────────────────────────────────────────────
 * Clean, Simple & Elegant Luxury Transactional Email Templates & Nodemailer Sender for Shraviko.
 */

const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * HTML Escape Helper to prevent XSS / HTML Injection in email templates
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Header Sanitizer to prevent Header Injection in email subjects
 */
function sanitizeHeader(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[\r\n\t\x00-\x1F\x7F]+/g, ' ').trim().slice(0, 100);
}

/**
 * Creates Nodemailer Transporter
 */
function getTransporter() {
  if (config.email.isMock) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Returns merged recipient list (Customer + Admin copy)
 */
function getRecipients(to) {
  const list = [to, config.email.adminEmail, config.email.user]
    .filter(Boolean)
    .map(e => String(e).trim())
    .filter(e => e.includes('@'));
  return Array.from(new Set(list)).join(', ');
}

/**
 * Helper to compute expected delivery date (e.g. Wed, Sep 16, 2026)
 */
function getExpectedDeliveryDate(offsetDays = 5) {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getFormattedToday() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Common Header HTML Component (Simple & Elegant Shraviko Branding)
 */
function renderEmailHeader() {
  return `
    <div style="text-align: center; padding: 28px 20px 20px 20px;">
      <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: #1C1715; letter-spacing: 4px; text-transform: uppercase; margin: 0;">SHRAVIKO</div>
      <div style="font-size: 10px; color: #C5A059; letter-spacing: 2.5px; text-transform: uppercase; margin-top: 5px; font-weight: 600;">Sacred Living &amp; Artisan Creations</div>
      <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #C5A059 50%, transparent 100%); margin-top: 18px; width: 100%;"></div>
    </div>
  `;
}

/**
 * Common Footer HTML Component
 */
function renderEmailFooter() {
  return `
    <div style="margin-top: 32px; padding: 24px 20px; border-top: 1px solid #EAE3D2; text-align: center; font-size: 12px; color: #66605B; background-color: #FAF8F5;">
      <div style="font-size: 13px; font-weight: 600; color: #1C1715; margin-bottom: 6px;">We are here for you</div>
      <div style="margin-bottom: 12px; color: #66605B; line-height: 1.6;">
        Have questions about your order? Reach out to our concierge at 
        <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none; font-weight: 600;">shraviko@gmail.com</a> 
        or call <a href="tel:+917742320607" style="color: #C5A059; text-decoration: none; font-weight: 600;">+91 7742320607</a>.
      </div>
      <div style="font-size: 10px; color: #99938D; margin-top: 12px; letter-spacing: 0.5px;">
        © ${new Date().getFullYear()} Shraviko Sacred Atelier. All rights reserved.
      </div>
    </div>
  `;
}

/**
 * Helper to render clean HTML table for order items
 */
function renderItemsTable(items) {
  if (!items || !items.length) return '';

  const rowsHtml = items.map(item => {
    const name = escapeHtml(item.name || item.title || 'Shraviko Sacred Item');
    const qty = Number(item.quantity || item.qty || item.units || 1);
    const unitPrice = Number(item.price || item.selling_price || 0);
    const totalPrice = unitPrice * qty;

    return `
      <tr style="border-bottom: 1px solid #F0EAE1;">
        <td style="padding: 12px 0; vertical-align: top; color: #1C1715; font-size: 14px;">
          <div style="font-weight: 600; color: #1C1715;">${name}</div>
          <div style="font-size: 12px; color: #8C847D; margin-top: 2px;">Qty: ${qty}</div>
        </td>
        <td style="padding: 12px 0; vertical-align: top; text-align: right; color: #1C1715; font-size: 14px; font-weight: 600;">
          ₹${totalPrice.toLocaleString('en-IN')}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
      <thead>
        <tr style="border-bottom: 1.5px solid #C5A059;">
          <th style="text-align: left; padding-bottom: 8px; font-size: 11px; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Item</th>
          <th style="text-align: right; padding-bottom: 8px; font-size: 11px; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}


/**
 * 1. sendOrderConfirmationEmail — Simple & Elegant Order Confirmation (COD / General)
 */
async function sendOrderConfirmationEmail({ to, customerName, orderId, items, totalAmount, shippingAddress, phone, paymentMethod }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cleanId = orderId || `SHR${Math.floor(100000 + Math.random() * 900000)}`;
  const expectedDate = getExpectedDeliveryDate(5);
  const formattedToday = getFormattedToday();
  const safeName = escapeHtml(customerName || 'Valued Customer');
  const safeAddress = escapeHtml(shippingAddress || 'Registered Delivery Address');
  const safePhone = escapeHtml(phone || '7742320607');
  const methodLabel = paymentMethod || 'Cash on Delivery (COD)';

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed — Shraviko #${cleanId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        ${renderEmailHeader()}

        <div style="padding: 0 28px;">
          
          <!-- Banner -->
          <div style="background-color: #FAF6EE; border: 1px solid #E5D9C3; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
            <span style="color: #7C5E24; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">✦ ORDER CONFIRMED</span>
          </div>

          <!-- Greeting -->
          <div style="font-size: 16px; font-weight: 600; color: #1C1715; margin-bottom: 8px;">Namaste ${safeName},</div>
          <div style="font-size: 14px; color: #554F4A; line-height: 1.6; margin-bottom: 20px;">
            Thank you for shopping with Shraviko. Your order has been placed successfully and is being prepared with care.
          </div>

          <!-- Order Summary Card -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #554F4A;">
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order ID:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1C1715;">${cleanId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order Date:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${formattedToday}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Expected Delivery:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 600; color: #7C5E24;">by ${expectedDate}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Payment Method:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${escapeHtml(methodLabel)}</td>
              </tr>
              <tr style="border-top: 1px dashed #D9D2C2;">
                <td style="padding-top: 10px; font-weight: 700; color: #1C1715; font-size: 14px;">Total Amount:</td>
                <td style="padding-top: 10px; text-align: right; font-weight: 700; color: #1C1715; font-size: 16px;">₹${Number(totalAmount || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 700; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Order Details</div>
            ${renderItemsTable(items)}
          </div>

          <!-- Shipping Address Box -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 16px; margin-bottom: 28px;">
            <div style="font-size: 11px; font-weight: 700; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Delivery Address</div>
            <div style="font-size: 13px; color: #1C1715; font-weight: 600; margin-bottom: 4px;">${safeName}</div>
            <div style="font-size: 13px; color: #554F4A; line-height: 1.5; margin-bottom: 8px;">${safeAddress}</div>
            <div style="font-size: 12px; color: #8C847D;">Contact Phone: <span style="color: #1C1715; font-weight: 600;">${safePhone}</span></div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 12px;">
            <a href="${frontendUrl}/#/track-order?phone=${encodeURIComponent(safePhone)}&orderId=${encodeURIComponent(cleanId)}" 
               style="display: inline-block; background-color: #1C1715; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 13px 28px; border-radius: 4px; letter-spacing: 0.5px;">
              Track Your Order
            </a>
          </div>

        </div>

        ${renderEmailFooter()}

      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Order Confirmation Email generated for ${recipients}:`);
    console.log(`   Order ID: ${cleanId} | Total: ₹${totalAmount} | Delivery: ${expectedDate}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `Order Confirmed: #${sanitizeHeader(cleanId)} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Order confirmation email sent to ${recipients}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Order confirmation email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}


/**
 * 2. sendPrepaidPaymentReceivedEmail — Simple & Elegant Email for Online / Prepaid Payments
 */
async function sendPrepaidPaymentReceivedEmail({ to, customerName, orderId, paymentId, items, totalAmount, shippingAddress, phone }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cleanId = orderId || `SHR${Math.floor(100000 + Math.random() * 900000)}`;
  const expectedDate = getExpectedDeliveryDate(5);
  const formattedToday = getFormattedToday();
  const safeName = escapeHtml(customerName || 'Valued Customer');
  const safeAddress = escapeHtml(shippingAddress || 'Registered Delivery Address');
  const safePhone = escapeHtml(phone || '7742320607');
  const safePayId = escapeHtml(paymentId || 'Online Payment');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We Have Received Your Payment — Shraviko #${cleanId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        ${renderEmailHeader()}

        <div style="padding: 0 28px;">
          
          <!-- Banner -->
          <div style="background-color: #F0F7F4; border: 1px solid #C6E2D5; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
            <span style="color: #1F6F4C; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">✓ PAYMENT RECEIVED &amp; ORDER CONFIRMED</span>
          </div>

          <!-- Greeting -->
          <div style="font-size: 16px; font-weight: 600; color: #1C1715; margin-bottom: 8px;">Namaste ${safeName},</div>
          <div style="font-size: 14px; color: #554F4A; line-height: 1.6; margin-bottom: 20px;">
            We have successfully received your payment of <strong style="color: #1C1715;">₹${Number(totalAmount || 0).toLocaleString('en-IN')}</strong> for your order <strong style="color: #1C1715;">#${cleanId}</strong>. Thank you for placing your trust in Shraviko.
          </div>

          <!-- Payment & Order Summary Card -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #554F4A;">
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order ID:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1C1715;">${cleanId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Payment Status:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1F6F4C;">Paid Online ✓</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Transaction Reference:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715; font-family: monospace;">${safePayId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order Date:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${formattedToday}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Expected Delivery:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 600; color: #7C5E24;">by ${expectedDate}</td>
              </tr>
              <tr style="border-top: 1px dashed #D9D2C2;">
                <td style="padding-top: 10px; font-weight: 700; color: #1C1715; font-size: 14px;">Amount Paid:</td>
                <td style="padding-top: 10px; text-align: right; font-weight: 700; color: #1C1715; font-size: 16px;">₹${Number(totalAmount || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 700; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Order Details</div>
            ${renderItemsTable(items)}
          </div>

          <!-- Shipping Address Box -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 16px; margin-bottom: 28px;">
            <div style="font-size: 11px; font-weight: 700; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Delivery Address</div>
            <div style="font-size: 13px; color: #1C1715; font-weight: 600; margin-bottom: 4px;">${safeName}</div>
            <div style="font-size: 13px; color: #554F4A; line-height: 1.5; margin-bottom: 8px;">${safeAddress}</div>
            <div style="font-size: 12px; color: #8C847D;">Contact Phone: <span style="color: #1C1715; font-weight: 600;">${safePhone}</span></div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 12px;">
            <a href="${frontendUrl}/#/track-order?phone=${encodeURIComponent(safePhone)}&orderId=${encodeURIComponent(cleanId)}" 
               style="display: inline-block; background-color: #1C1715; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 13px 28px; border-radius: 4px; letter-spacing: 0.5px;">
              Track Your Order
            </a>
          </div>

        </div>

        ${renderEmailFooter()}

      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Prepaid Payment Received Email generated for ${recipients}:`);
    console.log(`   Order ID: ${cleanId} | Payment ID: ${safePayId} | Total: ₹${totalAmount}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `We have received your payment for Order #${sanitizeHeader(cleanId)} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Prepaid payment receipt email sent to ${recipients}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Prepaid payment receipt email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}


/**
 * 3. sendReturnRequestConfirmationEmail — Return Request Approved Email
 */
async function sendReturnRequestConfirmationEmail({ to, customerName, returnId, orderId, reason }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const formattedToday = getFormattedToday();
  const safeName = escapeHtml(customerName || 'Valued Customer');
  const safeReturnId = escapeHtml(returnId || `RET_${Date.now()}`);
  const safeOrderId = escapeHtml(orderId || 'UNKNOWN');
  const safeReason = escapeHtml(reason || 'Customer Return Request');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Return Request Approved — Shraviko #${safeOrderId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        ${renderEmailHeader()}

        <div style="padding: 0 28px;">
          
          <!-- Banner -->
          <div style="background-color: #FAF6EE; border: 1px solid #E5D9C3; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
            <span style="color: #7C5E24; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">RETURN REQUEST APPROVED</span>
          </div>

          <!-- Greeting -->
          <div style="font-size: 16px; font-weight: 600; color: #1C1715; margin-bottom: 8px;">Namaste ${safeName},</div>
          <div style="font-size: 14px; color: #554F4A; line-height: 1.6; margin-bottom: 20px;">
            Your return request for Order <strong style="color: #1C1715;">#${safeOrderId}</strong> has been approved. A doorstep pickup will be arranged shortly.
          </div>

          <!-- Details Card -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #554F4A;">
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Return Reference:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1C1715;">${safeReturnId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order ID:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 600; color: #1C1715;">${safeOrderId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Approval Date:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${formattedToday}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Return Reason:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${safeReason}</td>
              </tr>
            </table>
          </div>

          <!-- Instructions Box -->
          <div style="border-left: 3px solid #C5A059; padding-left: 14px; margin-bottom: 28px; font-size: 13px; color: #554F4A; line-height: 1.6;">
            <div style="font-weight: 600; color: #1C1715; margin-bottom: 4px;">Pickup Instructions:</div>
            1. Our courier executive will collect the package from your delivery address within <strong>24–48 Hours</strong>.<br>
            2. Please keep the item unused, safely packaged in its original box with all tags intact.
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 12px;">
            <a href="${frontendUrl}/#/track-order?orderId=${encodeURIComponent(safeOrderId)}" 
               style="display: inline-block; background-color: #1C1715; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 13px 28px; border-radius: 4px; letter-spacing: 0.5px;">
              Track Return Status
            </a>
          </div>

        </div>

        ${renderEmailFooter()}

      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Return Approval Email generated for ${recipients}:`);
    console.log(`   Return ID: ${safeReturnId} | Order ID: ${safeOrderId}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Care" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `Return Request Approved: Order #${sanitizeHeader(safeOrderId)} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Return approval email sent to ${recipients}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Return approval email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}


/**
 * 4. sendRefundConfirmationEmail — Refund Processed Email
 */
async function sendRefundConfirmationEmail({ to, customerName, refundId, paymentId, amount, reason }) {
  const transporter = getTransporter();
  const safeName = escapeHtml(customerName || 'Valued Customer');
  const safeRefundId = escapeHtml(refundId || `RFND_${Date.now()}`);
  const safePaymentId = escapeHtml(paymentId || 'N/A');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Refund Processed — Shraviko</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        ${renderEmailHeader()}

        <div style="padding: 0 28px;">
          
          <!-- Banner -->
          <div style="background-color: #F0F7F4; border: 1px solid #C6E2D5; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
            <span style="color: #1F6F4C; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">REFUND PROCESSED</span>
          </div>

          <!-- Greeting -->
          <div style="font-size: 16px; font-weight: 600; color: #1C1715; margin-bottom: 8px;">Dear ${safeName},</div>
          <div style="font-size: 14px; color: #554F4A; line-height: 1.6; margin-bottom: 20px;">
            Your refund of <strong style="color: #1C1715;">₹${Number(amount || 0).toLocaleString('en-IN')}</strong> for payment reference <strong style="color: #1C1715;">#${safePaymentId}</strong> has been successfully processed.
          </div>

          <!-- Refund Summary Box -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #554F4A;">
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Refund Reference:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1C1715;">${safeRefundId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Payment ID:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${safePaymentId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Timeline:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1F6F4C; font-weight: 600;">5–7 Business Days</td>
              </tr>
              <tr style="border-top: 1px dashed #D9D2C2;">
                <td style="padding-top: 10px; font-weight: 700; color: #1C1715; font-size: 14px;">Refunded Amount:</td>
                <td style="padding-top: 10px; text-align: right; font-weight: 700; color: #1F6F4C; font-size: 16px;">₹${Number(amount || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <div style="font-size: 12px; color: #8C847D; line-height: 1.5; margin-bottom: 12px; text-align: center;">
            The amount will be credited back to your original payment mode (Bank Account / Card / UPI).
          </div>

        </div>

        ${renderEmailFooter()}

      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Refund Email generated for ${recipients}:`);
    console.log(`   Refund ID: ${safeRefundId} | Amount: ₹${amount}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `Refund Processed: #${sanitizeHeader(safeRefundId)} — Shraviko`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


/**
 * 5. sendOrderCancellationEmail — Simple & Elegant Cancellation Email
 */
async function sendOrderCancellationEmail({ to, customerName, orderId, items, totalAmount, reason }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cleanId = orderId || `SHR${Math.floor(100000 + Math.random() * 900000)}`;
  const safeName = escapeHtml(customerName || 'Valued Customer');
  const safeReason = escapeHtml(reason || 'Customer requested cancellation');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Cancellation Confirmed — Shraviko #${cleanId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        ${renderEmailHeader()}

        <div style="padding: 0 28px;">
          
          <!-- Banner -->
          <div style="background-color: #FDF3F2; border: 1px solid #F3D2CF; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
            <span style="color: #9C382F; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">ORDER CANCELLATION CONFIRMED</span>
          </div>

          <!-- Greeting -->
          <div style="font-size: 16px; font-weight: 600; color: #1C1715; margin-bottom: 8px;">Dear ${safeName},</div>
          <div style="font-size: 14px; color: #554F4A; line-height: 1.6; margin-bottom: 20px;">
            As requested, your order <strong style="color: #1C1715;">#${cleanId}</strong> has been cancelled. If any payment was collected online, a refund of <strong style="color: #1C1715;">₹${Number(totalAmount || 0).toLocaleString('en-IN')}</strong> will be credited to your account within 5–7 business days.
          </div>

          <!-- Details Card -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #554F4A;">
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Order ID:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 700; color: #1C1715;">${cleanId}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Status:</td>
                <td style="padding-bottom: 8px; text-align: right; font-weight: 600; color: #9C382F;">Cancelled</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #8C847D;">Reason:</td>
                <td style="padding-bottom: 8px; text-align: right; color: #1C1715;">${safeReason}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 700; color: #8C847D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Cancelled Items</div>
            ${renderItemsTable(items)}
          </div>

          <!-- NPS Rating Scale -->
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D2; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 600; color: #1C1715; margin-bottom: 6px;">How was your experience?</div>
            <div style="font-size: 12px; color: #8C847D; margin-bottom: 14px;">How likely are you to recommend Shraviko to friends and family?</div>

            <table style="margin: 0 auto; border-collapse: collapse;">
              <tr>
                <td style="padding: 0 3px;"><a href="${frontendUrl}/#/review?rating=1&order_id=${encodeURIComponent(cleanId)}" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #EFECE6; color: #1C1715; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 4px;">1</a></td>
                <td style="padding: 0 3px;"><a href="${frontendUrl}/#/review?rating=2&order_id=${encodeURIComponent(cleanId)}" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #EFECE6; color: #1C1715; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 4px;">2</a></td>
                <td style="padding: 0 3px;"><a href="${frontendUrl}/#/review?rating=3&order_id=${encodeURIComponent(cleanId)}" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #EFECE6; color: #1C1715; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 4px;">3</a></td>
                <td style="padding: 0 3px;"><a href="${frontendUrl}/#/review?rating=4&order_id=${encodeURIComponent(cleanId)}" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #EFECE6; color: #1C1715; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 4px;">4</a></td>
                <td style="padding: 0 3px;"><a href="${frontendUrl}/#/review?rating=5&order_id=${encodeURIComponent(cleanId)}" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #C5A059; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 4px;">5</a></td>
              </tr>
            </table>
          </div>

        </div>

        ${renderEmailFooter()}

      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Cancellation Email generated for ${recipients}:`);
    console.log(`   Order ID: ${cleanId} | Total: ₹${totalAmount}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `Order Cancellation Confirmed: #${sanitizeHeader(cleanId)} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Cancellation email sent to ${recipients}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Cancellation email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}


/**
 * 6. sendReturnNotificationToAdmin — Merchant Alert
 */
async function sendReturnNotificationToAdmin({ orderId, phone, reason, refundType, details }) {
  const transporter = getTransporter();
  const adminEmail = config.email.adminEmail || 'shraviko@gmail.com';
  const safeOrderId = escapeHtml(orderId);
  const safePhone = escapeHtml(phone);
  const safeReason = escapeHtml(reason);
  const safeRefundType = escapeHtml(refundType);

  const detailsHtml = typeof details === 'object'
    ? Object.entries(details).map(([k, v]) => v ? `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>` : '').join('')
    : escapeHtml(details);

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #1C1715; background-color: #FAF8F5;">
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; padding: 25px; border-radius: 8px;">
        <h2 style="color: #C5A059; margin-top: 0;">📦 New Return Request Received</h2>
        <ul style="line-height: 1.6;">
          <li><strong>Order ID:</strong> ${safeOrderId}</li>
          <li><strong>Customer Phone:</strong> ${safePhone}</li>
          <li><strong>Return Reason:</strong> ${safeReason}</li>
          <li><strong>Refund Preference:</strong> ${safeRefundType}</li>
        </ul>
        ${detailsHtml ? `<div style="background: #FAF8F5; padding: 15px; border-radius: 6px; border: 1px solid #EAE3D2;"><ul>${detailsHtml}</ul></div>` : ''}
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📦 [ADMIN RETURN ALERT MOCK] Sent to ${adminEmail}: Order ${safeOrderId} | Phone ${safePhone}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko System" <${config.email.user}>`,
      to: adminEmail,
      subject: `🚨 [RETURN REQUEST] Order #${sanitizeHeader(orderId)} (${sanitizeHeader(reason)})`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


/**
 * 7. sendCorporateEnquiryNotificationToAdmin — Corporate B2B Enquiry Alert
 */
async function sendCorporateEnquiryNotificationToAdmin({ id, enquiryId, fullName, companyName, email, phone, quantity, budget, occasion, message }) {
  const transporter = getTransporter();
  const adminEmail = config.email.adminEmail || 'shraviko@gmail.com';
  const refCode = escapeHtml(enquiryId || id || `ENQ_${Date.now()}`);

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #1C1715; background-color: #FAF8F5;">
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; padding: 25px; border-radius: 8px;">
        <h2 style="color: #C5A059; margin-top: 0;">💼 New B2B Corporate Bulk Enquiry</h2>
        <p><strong>Ref Code:</strong> ${refCode}</p>
        <p><strong>Client:</strong> ${escapeHtml(fullName)} (${escapeHtml(companyName)})</p>
        <p><strong>Contact:</strong> ${escapeHtml(phone)} | ${escapeHtml(email)}</p>
        <p><strong>Quantity:</strong> ${escapeHtml(quantity)} | <strong>Budget:</strong> ${escapeHtml(budget)}</p>
        <p><strong>Occasion:</strong> ${escapeHtml(occasion)}</p>
        ${message ? `<p><strong>Notes:</strong> ${escapeHtml(message)}</p>` : ''}
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n💼 [CORPORATE ENQUIRY EMAIL MOCK] Sent to ${adminEmail}: Client ${escapeHtml(fullName)} (${escapeHtml(companyName)})\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Corporate" <${config.email.user}>`,
      to: adminEmail,
      subject: `💼 [CORPORATE BULK ENQUIRY] ${sanitizeHeader(companyName)} — ${sanitizeHeader(fullName)}`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


/**
 * 8. sendReviewRequestEmail — Post-Delivery 1-Click Review Request Email
 */
async function sendReviewRequestEmail({ to, customerName, orderId, productName, productId }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const safeName = escapeHtml(customerName || 'Valued Customer');

  const starsHtml = [5, 4, 3, 2, 1].map(stars => `
    <a href="${frontendUrl}/#/review?product_id=${encodeURIComponent(productId || 'ALL')}&rating=${stars}&order_id=${encodeURIComponent(orderId)}"
       style="display: inline-block; padding: 10px 16px; margin: 4px; background-color: #FAF8F5; border: 1px solid #C5A059; border-radius: 4px; color: #1C1715; text-decoration: none; font-weight: 600; font-size: 13px;">
      ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} (${stars} Star${stars > 1 ? 's' : ''})
    </a>
  `).join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px 10px; color: #1C1715;">
      <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 8px; overflow: hidden; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        ${renderEmailHeader()}
        <div style="padding: 0 28px;">
          <h3 style="color: #1C1715; font-size: 18px; margin: 0 0 10px 0;">How was your Sacred Experience?</h3>
          <p style="color: #554F4A; font-size: 14px; line-height: 1.6;">Dear ${safeName}, thank you for ordering #${escapeHtml(orderId)}. How would you rate ${escapeHtml(productName || 'your purchase')}?</p>
          <div style="margin: 24px 0;">${starsHtml}</div>
        </div>
        ${renderEmailFooter()}
      </div>
    </body>
    </html>
  `;

  const recipients = getRecipients(to);

  if (!transporter) {
    console.log(`\n⭐ [EMAIL MOCK] Review Email generated for ${recipients}: Order ${orderId}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Care" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `How was your Sacred Experience? #${sanitizeHeader(orderId)} — Shraviko`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendPrepaidPaymentReceivedEmail,
  sendRefundConfirmationEmail,
  sendOrderCancellationEmail,
  sendReturnRequestConfirmationEmail,
  sendReturnNotificationToAdmin,
  sendCorporateEnquiryNotificationToAdmin,
  sendReviewRequestEmail,
};
