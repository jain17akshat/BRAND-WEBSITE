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
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Handcrafted in India</p>
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
          <p style="margin: 0;">Write to us at <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none;">shraviko@gmail.com</a> or call <strong>+91 7742320607</strong>.</p>
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
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed #${orderId} — Shraviko`,
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
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Handcrafted in India</p>
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
          <p style="margin: 0;">Write to us at <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none;">shraviko@gmail.com</a> or call <strong>+91 7742320607</strong>.</p>
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
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Refund Processed (${refundId}) — Shraviko`,
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
 * sendReturnNotificationToAdmin — alerts merchant at shraviko@gmail.com about customer returns
 */
async function sendReturnNotificationToAdmin({ orderId, phone, reason, refundType, details }) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'shraviko@gmail.com';

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

/**
 * sendCorporateEnquiryNotificationToAdmin — sends corporate bulk lead to shraviko@gmail.com
 */
async function sendCorporateEnquiryNotificationToAdmin({ id, enquiryId, fullName, companyName, email, phone, quantity, budget, occasion, message }) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'shraviko@gmail.com';
  const refCode = enquiryId || id || `ENQ_${Date.now()}`;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #2C2623; background-color: #FBF9F5;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #E8DFC7; padding: 25px; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #8C6D27; border-bottom: 2px solid #C5A059; padding-bottom: 10px; margin-top: 0;">
          💼 New B2B Corporate Bulk Enquiry
        </h2>
        <p style="font-size: 14px;">A new bulk enquiry has been submitted on <strong>Shraviko.com</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px;">
          <tr><td style="padding: 6px; font-weight: bold; width: 35%;">Enquiry ID:</td><td style="padding: 6px; font-weight: bold; color: #8C6D27;">${refCode}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Full Name:</td><td style="padding: 6px;">${fullName}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Company:</td><td style="padding: 6px; font-weight: bold; color: #8C6D27;">${companyName}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Work Email:</td><td style="padding: 6px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Phone / WhatsApp:</td><td style="padding: 6px;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Est. Quantity:</td><td style="padding: 6px;">${quantity} Units</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Target Budget:</td><td style="padding: 6px;">${budget}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Occasion / Type:</td><td style="padding: 6px;">${occasion}</td></tr>
        </table>

        ${message ? `
        <div style="background: #FDFBF7; padding: 15px; border-radius: 6px; border: 1px solid #E8DFC7; margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #8C6D27;">Customization Notes:</h4>
          <p style="margin: 0; font-size: 13px; color: #5C4A3E; line-height: 1.5;">${message}</p>
        </div>
        ` : ''}

        <p style="font-size: 12px; color: #7A6859; margin-top: 20px; border-top: 1px solid #E8DFC7; padding-top: 10px;">
          Reach out to the client via WhatsApp at <strong>${phone}</strong> or email <strong>${email}</strong> with custom sample proposals.
        </p>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n💼 [CORPORATE ENQUIRY EMAIL MOCK] Sent to ${adminEmail}:`);
    console.log(`   Client: ${fullName} (${companyName}) | Email: ${email} | Phone: ${phone}`);
    console.log(`   Quantity: ${quantity} | Budget: ${budget} | Occasion: ${occasion}`);
    console.log(`   Notes: ${message}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Corporate" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `💼 [CORPORATE BULK ENQUIRY] ${companyName} — ${fullName} (${quantity} Units)`,
      html: htmlTemplate,
    });
    console.log(`✅ Corporate enquiry alert sent to ${adminEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Corporate enquiry email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * sendOrderCancellationEmail — sends instant branded cancellation notification to customer
 */
async function sendOrderCancellationEmail({ to, customerName, orderId, reason }) {
  const transporter = getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Cancelled — SHRAVIKO</title>
    </head>
    <body style="font-family: 'Georgia', serif; background-color: #FBF9F5; margin: 0; padding: 20px; color: #2C2623;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #E8DFC7;">
        
        <!-- Header Logo -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #3D2B1F; margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: normal;">SHRAVIKO</h1>
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Handcrafted in India</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 25px 0;">
          <h2 style="color: #2C1F06; font-size: 18px; margin-bottom: 10px;">Namaste ${customerName || 'Valued Customer'},</h2>
          <p style="font-size: 14px; color: #5C4A3E; line-height: 1.6; margin: 0;">
            Your order <strong>#${orderId}</strong> has been cancelled.
          </p>
        </div>

        <!-- Cancellation Box -->
        <div style="background-color: #FDFBF7; border: 1px solid #E8DFC7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #8C6D27; text-transform: uppercase; letter-spacing: 1px;">Cancellation Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Order ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #2C1F06; font-weight: bold; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Order Status</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #A63A2B; font-weight: bold; text-align: right;">Cancelled</td>
            </tr>
            ${reason ? `
            <tr>
              <td style="padding: 8px 0; color: #7A6859;">Cancellation Reason</td>
              <td style="padding: 8px 0; color: #2C1F06; text-align: right;">${reason}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #FAF0D9; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px; font-size: 12px; color: #755722;">
          If a prepaid payment was made for this order, your refund will be automatically processed within 5–7 business days to your original payment method.
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 12px; color: #7A6859; padding-top: 20px; border-top: 1px solid #E8DFC7;">
          <p style="margin-bottom: 5px;">Have questions regarding this cancellation?</p>
          <p style="margin: 0;">Write to us at <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none;">shraviko@gmail.com</a> or call <strong>+91 7742320607</strong>.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Cancellation Email generated for ${to}:`);
    console.log(`   Order ID: ${orderId} | Reason: ${reason || 'Fulfillment cancellation'}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Cancelled #${orderId} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Order cancellation email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Cancellation email send failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * sendReturnRequestConfirmationEmail — sends Return Request Approval Email to customer
 */
async function sendReturnRequestConfirmationEmail({ to, customerName, returnId, orderId, reason }) {
  const transporter = getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Return Request Approved — SHRAVIKO</title>
    </head>
    <body style="font-family: 'Georgia', serif; background-color: #FBF9F5; margin: 0; padding: 20px; color: #2C2623;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #E8DFC7;">
        
        <!-- Header Logo -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #3D2B1F; margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: normal;">SHRAVIKO</h1>
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Handcrafted in India</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 25px 0;">
          <h2 style="color: #2C1F06; font-size: 18px; margin-bottom: 10px;">Namaste ${customerName || 'Valued Customer'},</h2>
          <p style="font-size: 14px; color: #5C4A3E; line-height: 1.6; margin: 0;">
            Your return request for order <strong>#${orderId}</strong> has been <strong>Approved</strong>. Our care team has initiated the return request approval workflow and scheduled reverse pickup.
          </p>
        </div>

        <!-- Return Details Box -->
        <div style="background-color: #FDFBF7; border: 1px solid #E8DFC7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #8C6D27; text-transform: uppercase; letter-spacing: 1px;">Return Approval Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Return Reference ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #2C1F06; font-weight: bold; text-align: right;">${returnId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Order ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #2C1F06; font-weight: bold; text-align: right;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #7A6859;">Approval Status</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E8DFC7; color: #276749; font-weight: bold; text-align: right;">Approved</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7A6859;">Reason for Return</td>
              <td style="padding: 8px 0; color: #2C1F06; text-align: right;">${reason || 'Customer Return Request'}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #FAF0D9; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px; font-size: 12px; color: #755722;">
          <strong>Next Steps for Return:</strong><br>
          1. Our logistics partner (Shiprocket) will arrive for reverse pickup from your address within 24–48 hours.<br>
          2. Please hand over the unused item in its original packaging along with all accessories.
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 12px; color: #7A6859; padding-top: 20px; border-top: 1px solid #E8DFC7;">
          <p style="margin-bottom: 5px;">Need help with your return pickup?</p>
          <p style="margin: 0;">Write to us at <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none;">shraviko@gmail.com</a> or call <strong>+91 7742320607</strong>.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Return Request Approval Email generated for ${to}:`);
    console.log(`   Return ID: ${returnId} | Order ID: ${orderId} | Reason: ${reason}`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Return Request Approved #${orderId} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Return request approval email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Return request approval email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * sendReviewRequestEmail — sends post-delivery review & feedback request email with 1-click star links
 */
async function sendReviewRequestEmail({ to, customerName, orderId, productName, productId }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const starsHtml = [5, 4, 3, 2, 1].map(stars => `
    <a href="${frontendUrl}/#/review?product_id=${encodeURIComponent(productId || 'ALL')}&rating=${stars}&order_id=${encodeURIComponent(orderId)}"
       style="display: inline-block; padding: 10px 14px; margin: 4px; background-color: #FDFBF7; border: 1px solid #C5A059; border-radius: 8px; color: #8C6D27; text-decoration: none; font-weight: bold; font-size: 14px;">
      ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} (${stars} Star${stars > 1 ? 's' : ''})
    </a>
  `).join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>How was your Sacred Experience? — SHRAVIKO</title>
    </head>
    <body style="font-family: 'Georgia', serif; background-color: #FBF9F5; margin: 0; padding: 20px; color: #2C2623;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #E8DFC7;">
        
        <!-- Header Logo -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #3D2B1F; margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: normal;">SHRAVIKO</h1>
          <p style="color: #C5A059; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Handcrafted in India</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 25px 0; text-align: center;">
          <h2 style="color: #2C1F06; font-size: 20px; margin-bottom: 10px;">Namaste ${customerName || 'Valued Devotee'},</h2>
          <p style="font-size: 14px; color: #5C4A3E; line-height: 1.6; margin: 0;">
            Thank you for bringing <strong>SHRAVIKO</strong> sacred creations into your home (Order <strong>#${orderId}</strong>).
          </p>
          <p style="font-size: 13px; color: #7A6859; margin-top: 8px;">
            How would you rate your experience with <strong>${productName || 'your handcrafted sacred items'}</strong>?
          </p>
        </div>

        <!-- Star Rating Box -->
        <div style="background-color: #FDFAF5; border: 1px solid #E8DFC7; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 13px; color: #8C6D27; text-transform: uppercase; letter-spacing: 1.5px;">Click a Star Below to Rate</h3>
          <div style="margin-bottom: 15px;">
            ${starsHtml}
          </div>
          <p style="font-size: 11px; color: #7A6859; margin: 0;">Your review helps fellow devotees find authentic handcrafted sacred products.</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 12px; color: #7A6859; padding-top: 20px; border-top: 1px solid #E8DFC7;">
          <p style="margin-bottom: 5px;">Shraviko Artisans Atelier — Udaipur, Rajasthan</p>
          <p style="margin: 0;">Questions or suggestions? Write to <a href="mailto:shraviko@gmail.com" style="color: #C5A059; text-decoration: none;">shraviko@gmail.com</a></p>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n⭐ [EMAIL MOCK] Post-Delivery Review Request Email generated for ${to}:`);
    console.log(`   Order ID: ${orderId} | Product: ${productName}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Care" <${process.env.EMAIL_USER}>`,
      to,
      subject: `How was your Sacred Experience? #${orderId} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Review request email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Review request email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendRefundConfirmationEmail,
  sendOrderCancellationEmail,
  sendReturnRequestConfirmationEmail,
  sendReturnNotificationToAdmin,
  sendCorporateEnquiryNotificationToAdmin,
  sendReviewRequestEmail,
};
