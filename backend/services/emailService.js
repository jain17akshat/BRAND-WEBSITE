/**
 * services/emailService.js
 * ─────────────────────────────────────────────────────────
 * Zero-cost transactional order confirmation email sender.
 *
 * Uses Nodemailer with:
 *   1. Gmail SMTP / Resend / Brevo credentials from .env
 *   2. Beautiful HTML Order Confirmation Email template
 */

const nodemailer = require('nodemailer');
const config = require('../config');

// Create reusable Nodemailer transporter
function getTransporter() {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!emailUser || !emailPass) {
    return null; // Null transporter -> fallback to console log mode
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

/**
 * sendOrderConfirmationEmail — sends instant HTML receipt to customer
 */
async function sendOrderConfirmationEmail({ to, customerName, orderId, items, totalAmount, shippingAddress }) {
  const transporter = getTransporter();

  const itemsHtml = (items || []).map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8DFC7; font-size: 13px; color: #2C2623;">
        ${item.name || item.title} ${item.quantity ? `(x${item.quantity})` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8DFC7; font-size: 13px; color: #2C2623; text-align: right; font-weight: bold;">
        ₹${(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed — SHRAVIKO</title>
    </head>
    <body style="font-family: 'Georgia', serif; background-color: #FBF9F5; margin: 0; padding: 20px; color: #2C2623;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #E8DFC7;">
        
        <!-- Header Logo -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #3D2B1F; margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: normal;">SHRAVIKO</h1>
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Sacred Living · Handcrafted in India</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 25px 0;">
          <h2 style="color: #2C1F06; font-size: 18px; margin-bottom: 10px;">Namaste ${customerName || 'Valued Customer'},</h2>
          <p style="font-size: 14px; color: #5C4A3E; line-height: 1.6; margin: 0;">
            Thank you for placing your order with <strong>SHRAVIKO</strong>. We have received your order <strong>#${orderId}</strong> and our artisans are carefully preparing your sacred items for dispatch.
          </p>
        </div>

        <!-- Order Summary Box -->
        <div style="background-color: #FDFBF7; border: 1px solid #E8DFC7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #8C6D27; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding-top: 15px; font-size: 15px; font-weight: bold; color: #2C1F06;">Total Amount Paid</td>
              <td style="padding-top: 15px; font-size: 16px; font-weight: bold; color: #C5A059; text-align: right;">₹${(totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        ${shippingAddress ? `
        <div style="margin-bottom: 25px; font-size: 13px; color: #5C4A3E; line-height: 1.5;">
          <strong style="color: #2C1F06;">Delivery Address:</strong><br>
          ${shippingAddress}
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="text-align: center; font-size: 12px; color: #7A6859; padding-top: 20px; border-top: 1px solid #E8DFC7;">
          <p style="margin-bottom: 5px;">Have questions about your order?</p>
          <p style="margin: 0;">Write to us at <a href="mailto:info@shraviko.com" style="color: #C5A059; text-decoration: none;">info@shraviko.com</a> or call <strong>+91 7742320607</strong>.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Instant Order Confirmation Email generated for ${to}:`);
    console.log(`   Order ID: ${orderId} | Total: ₹${totalAmount}`);
    console.log(`   (Set EMAIL_USER and EMAIL_PASS in backend/.env to send live emails)\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Sacred Living" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed #${orderId} — Shraviko Sacred Living`,
      html: htmlTemplate,
    });
    console.log(`✅ Confirmation email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email send failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * sendRefundConfirmationEmail — sends instant refund receipt to customer
 */
async function sendRefundConfirmationEmail({ to, customerName, refundId, paymentId, amount, reason }) {
  const transporter = getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Refund Processed — SHRAVIKO</title>
    </head>
    <body style="font-family: 'Georgia', serif; background-color: #FBF9F5; margin: 0; padding: 20px; color: #2C2623;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #E8DFC7;">
        
        <!-- Header Logo -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #3D2B1F; margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: normal;">SHRAVIKO</h1>
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Sacred Living · Handcrafted in India</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 25px 0;">
          <h2 style="color: #2C1F06; font-size: 18px; margin-bottom: 10px;">Namaste ${customerName || 'Valued Customer'},</h2>
          <p style="font-size: 14px; color: #5C4A3E; line-height: 1.6; margin: 0;">
            Your refund request for payment <strong>#${paymentId}</strong> has been processed successfully.
          </p>
        </div>

        <!-- Refund Box -->
        <div style="background-color: #FDFBF7; border: 1px solid #E8DFC7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #8C6D27; text-transform: uppercase; letter-spacing: 1px;">Refund Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Refund Reference ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #2C1F06; font-weight: bold; text-align: right;">${refundId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Refund Amount</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #C5A059; font-weight: bold; text-align: right; font-size: 15px;">₹${(amount || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7A6859;">Processing Timeline</td>
              <td style="padding: 8px 0; color: #2C1F06; text-align: right;">5–7 Business Days to Original Payment Method</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 12px; color: #7A6859; padding-top: 20px; border-top: 1px solid #E8DFC7;">
          <p style="margin-bottom: 5px;">Need further assistance?</p>
          <p style="margin: 0;">Write to us at <a href="mailto:info@shraviko.com" style="color: #C5A059; text-decoration: none;">info@shraviko.com</a> or call <strong>+91 7742320607</strong>.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Instant Refund Confirmation Email generated for ${to}:`);
    console.log(`   Refund ID: ${refundId} | Amount: ₹${amount}`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Sacred Living" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Refund Processed (${refundId}) — Shraviko Sacred Living`,
      html: htmlTemplate,
    });
    console.log(`✅ Refund email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Refund email send failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * sendReturnNotificationToAdmin — alerts merchant at info@shraviko.com about customer returns
 */
async function sendReturnNotificationToAdmin({ orderId, phone, reason, refundType, details }) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'info@shraviko.com';

  const detailsHtml = typeof details === 'object' ? Object.entries(details).map(([k, v]) => v ? `<li><strong>${k}:</strong> ${v}</li>` : '').join('') : details;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #C5A059;">📦 New Return Request Received</h2>
        <p>A customer has submitted a return request on <strong>Shraviko.com</strong>:</p>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Customer Phone:</strong> ${phone}</li>
          <li><strong>Return Reason:</strong> ${reason}</li>
          <li><strong>Refund Preference:</strong> ${refundType}</li>
        </ul>
        ${detailsHtml ? `
        <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <h4 style="margin: 0 0 10px 0;">Customer Bank / Refund Details:</h4>
          <ul>${detailsHtml}</ul>
        </div>
        ` : ''}
        <p>Please check your <strong>Shiprocket Dashboard (Shipments → Returns)</strong> for the reverse courier pickup status.</p>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📦 [ADMIN RETURN ALERT MOCK] Sent to ${adminEmail}:`);
    console.log(`   Order: ${orderId} | Phone: ${phone} | Reason: ${reason} | Type: ${refundType}`);
    console.log(`   Details:`, details, `\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 [RETURN REQUEST] Order #${orderId} (${reason})`,
      html: htmlTemplate,
    });
    console.log(`✅ Admin return notification sent to ${adminEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Admin return notification failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendRefundConfirmationEmail,
  sendReturnNotificationToAdmin,
};
