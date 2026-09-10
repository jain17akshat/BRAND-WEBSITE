/**
 * services/emailService.js
 * ─────────────────────────────────────────────────────────
 * Flipkart-style transactional email templates & Nodemailer sender.
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
  });
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
 * 1. sendOrderConfirmationEmail — Flipkart-styled Order Confirmation Email
 */
async function sendOrderConfirmationEmail({ to, customerName, orderId, items, totalAmount, shippingAddress, phone, paymentMethod }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cleanId = orderId || `OD${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
  const expectedDate = getExpectedDeliveryDate(5);
  const formattedToday = getFormattedToday();
  const isCOD = String(paymentMethod || '').toUpperCase().includes('COD');

  const itemsListHtml = (items || []).map(item => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 70px; vertical-align: top; padding-right: 14px;">
            <div style="width: 64px; height: 64px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center; line-height: 64px; font-size: 24px;">📦</div>
          </td>
          <td style="vertical-align: top;">
            <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 4px;">${item.name || item.title || 'Shraviko Sacred Creation'}</div>
            <div style="font-size: 12px; color: #16a34a; font-weight: bold; margin-bottom: 4px;">Delivery by ${expectedDate}</div>
            <div style="font-size: 12px; color: #64748b;">Seller: Shraviko Sacred Atelier</div>
            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity || item.qty || 1}</div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 100px;">
            <div style="font-size: 15px; font-weight: bold; color: #0f172a;">₹${((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}</div>
          </td>
        </tr>
      </table>
    </div>
  `).join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order for ${items?.[0]?.name || 'Shraviko Item'} has been successfully placed</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #0b0f17; margin: 0; padding: 12px; color: #f8fafc;">
      
      <!-- Main Container Card (Flipkart Dark Theme) -->
      <div style="max-width: 620px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Banner Bar -->
        <table style="width: 100%; background: #1d4ed8; padding: 14px 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">SHRAVIKO</span>
              <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-left: 4px;"></span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="background: #2563eb; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; border: 1px solid #60a5fa; letter-spacing: 0.5px;">Order Placed</span>
            </td>
          </tr>
        </table>

        <!-- Subheader Row -->
        <table style="width: 100%; padding: 16px 20px 8px 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 15px; font-weight: bold; color: #ffffff;">Hi ${customerName || 'Valued Devotee'},</div>
              <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">Your order has been successfully placed.</div>
            </td>
            <td style="text-align: right; vertical-align: top; font-size: 12px; color: #94a3b8;">
              <div>Order placed on <strong style="color: #ffffff;">${formattedToday}</strong></div>
              <div style="margin-top: 2px;">Order ID <strong style="color: #38bdf8;">${cleanId}</strong></div>
            </td>
          </tr>
        </table>

        <!-- Advisory / Shield Note -->
        <div style="margin: 12px 20px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          🛡️ We are committed to serving you with utmost care & speed. Delivery estimates are generated via real-time Shiprocket logistics tracking.
        </div>

        <!-- Central Flipkart Card Box -->
        <div style="margin: 16px 20px; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px;">
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <!-- Left Column: Status Progress & Amount -->
              <td style="vertical-align: top; padding-right: 15px; width: 55%;">
                
                <!-- Progress Line -->
                <div style="margin-bottom: 16px;">
                  <table style="width: 100%; border-collapse: collapse; text-align: center;">
                    <tr>
                      <td style="width: 25%;"><div style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%; margin: 0 auto; box-shadow: 0 0 8px #22c55e;"></div></td>
                      <td style="width: 25%;"><div style="width: 10px; height: 10px; background: #64748b; border-radius: 50%; margin: 0 auto;"></div></td>
                      <td style="width: 25%;"><div style="width: 10px; height: 10px; background: #64748b; border-radius: 50%; margin: 0 auto;"></div></td>
                      <td style="width: 25%;"><div style="width: 10px; height: 10px; background: #64748b; border-radius: 50%; margin: 0 auto;"></div></td>
                    </tr>
                    <tr style="font-size: 10px; color: #94a3b8;">
                      <td style="color: #22c55e; font-weight: bold; padding-top: 4px;">Placed</td>
                      <td style="padding-top: 4px;">Packed</td>
                      <td style="padding-top: 4px;">Shipped</td>
                      <td style="padding-top: 4px;">Delivered</td>
                    </tr>
                  </table>
                </div>

                <div style="font-size: 13px; color: #94a3b8; margin-bottom: 2px;">Delivery</div>
                <div style="font-size: 18px; font-weight: bold; color: #22c55e; margin-bottom: 12px;">by ${expectedDate}</div>

                <div style="font-size: 12px; color: #94a3b8;">Amount Payable ${isCOD ? 'on Delivery' : ''}</div>
                <div style="font-size: 16px; font-weight: bold; color: #38bdf8; margin-bottom: 16px;">₹${(totalAmount || 0).toLocaleString('en-IN')} ${isCOD ? '(COD)' : '(Prepaid)'}</div>

                <div>
                  <a href="${frontendUrl}/#/track-order?phone=${encodeURIComponent(phone || '')}&orderId=${encodeURIComponent(cleanId)}" 
                     style="display: inline-block; background: #2563eb; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 10px 18px; border-radius: 6px; border: 1px solid #3b82f6;">
                    Manage Your Order
                  </a>
                </div>
              </td>

              <!-- Right Column: Shipping Address & Phone -->
              <td style="vertical-align: top; border-left: 1px solid #334155; padding-left: 15px; width: 45%;">
                <div style="font-size: 12px; font-weight: bold; color: #f1f5f9; text-transform: uppercase; margin-bottom: 6px;">Delivery Address</div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin-bottom: 14px;">
                  <strong style="color: #ffffff;">${customerName || 'Valued Customer'}</strong><br>
                  ${shippingAddress || 'Registered Delivery Address'}
                </div>

                <div style="font-size: 12px; font-weight: bold; color: #f1f5f9; text-transform: uppercase; margin-bottom: 4px;">SMS updates sent to</div>
                <div style="font-size: 13px; font-weight: bold; color: #38bdf8;">${phone || '7742320607'}</div>
              </td>
            </tr>
          </table>

          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #334155; font-size: 11px; color: #94a3b8; text-align: center;">
            You will receive the next update when your order is packed/shipped by the seller.
          </div>
        </div>

        <!-- Items Summary List -->
        <div style="margin: 20px 20px;">
          <div style="font-size: 13px; font-weight: bold; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Item Details</div>
          ${itemsListHtml}
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 20px; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #94a3b8;">
          <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">Thank you for shopping with Shraviko!</div>
          <div style="margin-bottom: 12px;">
            Got Questions? Please get in touch with our <a href="mailto:shraviko@gmail.com" style="color: #38bdf8; text-decoration: none;">Customer Support</a> or Call <a href="tel:+917742320607" style="color: #38bdf8; text-decoration: none;">+91 7742320607</a>.
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 10px;">
            This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.<br>
            © ${new Date().getFullYear()} Shraviko Sacred Atelier. All rights reserved.
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Flipkart-Style Order Confirmation Email generated for ${to}:`);
    console.log(`   Order ID: ${cleanId} | Total: ₹${totalAmount} | Expected: ${expectedDate}`);
    console.log(`   (Set EMAIL_USER and EMAIL_PASS in backend/.env to send live emails)\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Order for ${items?.[0]?.name || 'Shraviko Item'} has been successfully placed`,
      html: htmlTemplate,
    });
    console.log(`✅ Flipkart-style confirmation email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email send failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * 2. sendReturnRequestConfirmationEmail — Flipkart-styled Return Approval Email
 */
async function sendReturnRequestConfirmationEmail({ to, customerName, returnId, orderId, reason }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const formattedToday = getFormattedToday();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Return Request Approved — Shraviko</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #0b0f17; margin: 0; padding: 12px; color: #f8fafc;">
      
      <div style="max-width: 620px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Banner Bar -->
        <table style="width: 100%; background: #166534; padding: 14px 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">SHRAVIKO</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="background: #15803d; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; border: 1px solid #4ade80; letter-spacing: 0.5px;">Return Request Approved ✓</span>
            </td>
          </tr>
        </table>

        <!-- Subheader Row -->
        <table style="width: 100%; padding: 16px 20px 8px 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 15px; font-weight: bold; color: #ffffff;">Hi ${customerName || 'Valued Devotee'},</div>
              <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">Your return request has been approved.</div>
            </td>
            <td style="text-align: right; vertical-align: top; font-size: 12px; color: #94a3b8;">
              <div>Approved on <strong style="color: #ffffff;">${formattedToday}</strong></div>
              <div style="margin-top: 2px;">Return Ref <strong style="color: #38bdf8;">${returnId}</strong></div>
            </td>
          </tr>
        </table>

        <!-- Central Flipkart Card Box -->
        <div style="margin: 16px 20px; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px;">
          <div style="font-size: 14px; font-weight: bold; color: #4ade80; margin-bottom: 6px;">Reverse Pickup Scheduled via Shiprocket</div>
          <div style="font-size: 12px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
            1. Courier executive will collect your parcel within <strong>24–48 Hours</strong>.<br>
            2. Please keep the item packaged in its original condition with all accessories.<br>
            3. <strong>Return Reason:</strong> ${reason || 'Customer Return Request'}
          </div>

          <div style="text-align: center; padding-top: 10px; border-top: 1px solid #334155;">
            <a href="${frontendUrl}/#/track-order?orderId=${encodeURIComponent(orderId || '')}" 
               style="display: inline-block; background: #16a34a; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
              Track Return Journey
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 20px; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #94a3b8;">
          <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">Need help with your pickup?</div>
          <div>Contact <a href="mailto:shraviko@gmail.com" style="color: #38bdf8;">shraviko@gmail.com</a> or call <a href="tel:+917742320607" style="color: #38bdf8;">+91 7742320607</a>.</div>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Return Approval Email generated for ${to}:`);
    console.log(`   Return ID: ${returnId} | Order ID: ${orderId}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Return Request Approved #${orderId} — Shraviko`,
      html: htmlTemplate,
    });
    console.log(`✅ Return approval email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Return approval email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * 3. sendRefundConfirmationEmail — Flipkart-styled Refund Email
 */
async function sendRefundConfirmationEmail({ to, customerName, refundId, paymentId, amount, reason }) {
  const transporter = getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background-color: #0b0f17; padding: 12px; color: #f8fafc;">
      <div style="max-width: 620px; margin: 0 auto; background: #111827; border-radius: 12px; border: 1px solid #1f2937; padding: 20px;">
        <h2 style="color: #38bdf8; margin-top: 0;">Refund Processed Successfully</h2>
        <p style="font-size: 14px; color: #cbd5e1;">Hi ${customerName || 'Valued Customer'}, your refund for payment <strong>#${paymentId}</strong> has been initiated.</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <div style="font-size: 13px; color: #94a3b8;">Refund ID: <strong style="color: #ffffff;">${refundId}</strong></div>
          <div style="font-size: 18px; font-weight: bold; color: #22c55e; margin-top: 6px;">₹${(amount || 0).toLocaleString('en-IN')}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">Processing timeline: 5–7 Business Days to original payment source.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Refund Email generated for ${to}:`);
    console.log(`   Refund ID: ${refundId} | Amount: ₹${amount}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Refund Processed (${refundId}) — Shraviko`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * 4. sendOrderCancellationEmail — Exact Flipkart-styled Cancellation Email
 */
async function sendOrderCancellationEmail({ to, customerName, orderId, items, totalAmount, reason }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cleanId = orderId || `OD${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
  const itemTitle = items?.[0]?.name || items?.[0]?.title || 'Shraviko Sacred Creation';
  const itemPrice = totalAmount || items?.[0]?.price || 0;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your request to cancel ${itemTitle} from your order is being processed</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #0b0f17; margin: 0; padding: 12px; color: #f8fafc;">
      
      <div style="max-width: 620px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Header Banner Bar -->
        <table style="width: 100%; background: #1d4ed8; padding: 14px 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">SHRAVIKO</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="color: #fef08a; font-size: 13px; font-weight: bold; text-transform: none;">
                Item <span style="background: #f59e0b; color: #1e1b4b; padding: 2px 6px; border-radius: 4px;">Cancellation</span> is being processed
              </span>
            </td>
          </tr>
        </table>

        <!-- Notice Box -->
        <div style="margin: 20px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 18px; line-height: 1.6; font-size: 13px; color: #cbd5e1;">
          <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-bottom: 10px;">Hi ${customerName || 'Valued Customer'},</div>
          <p style="margin: 0 0 10px 0;">
            Based on your request, the <span style="background: #f59e0b; color: #0f172a; padding: 1px 5px; font-weight: bold; border-radius: 3px;">cancellation</span> of the below listed item from your <a href="${frontendUrl}/#/track-order?orderId=${encodeURIComponent(cleanId)}" style="color: #38bdf8; text-decoration: underline; font-weight: bold;">order ${cleanId}</a> is being processed by the seller.
          </p>
          <p style="margin: 0; color: #94a3b8;">
            Since the items have already been shipped or scheduled by the seller, please do not accept it if delivery is attempted by the delivery partner.
          </p>
          ${reason ? `<div style="margin-top: 10px; font-size: 12px; color: #fbbf24;"><strong>Reason:</strong> ${reason}</div>` : ''}
        </div>

        <!-- Cancelled Item Details Box -->
        <div style="margin: 0 20px 20px 20px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 70px; vertical-align: top; padding-right: 14px;">
                <div style="width: 64px; height: 64px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; text-align: center; line-height: 64px; font-size: 24px;">🚫</div>
              </td>
              <td style="vertical-align: top;">
                <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">${itemTitle} <span style="color: #38bdf8; font-weight: bold;">Rs. ${itemPrice.toLocaleString('en-IN')}</span></div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">Seller: Shraviko Sacred Atelier</div>
                <div style="font-size: 12px; color: #94a3b8;">Qty: 1</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Feedback & Recommendation Scale (NPS 1 to 5) -->
        <div style="margin: 0 20px 20px 20px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="font-size: 13px; color: #94a3b8; margin-bottom: 6px;">We would love to get your feedback.</div>
          <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 16px;">How likely are you to recommend Shraviko to your friends and colleagues?</div>

          <table style="margin: 0 auto 12px auto; border-collapse: collapse;">
            <tr>
              <td style="padding: 0 4px;"><a href="${frontendUrl}/#/review?rating=1&order_id=${encodeURIComponent(cleanId)}" style="display: block; width: 42px; height: 36px; line-height: 36px; background: #ef4444; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">1</a></td>
              <td style="padding: 0 4px;"><a href="${frontendUrl}/#/review?rating=2&order_id=${encodeURIComponent(cleanId)}" style="display: block; width: 42px; height: 36px; line-height: 36px; background: #f97316; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">2</a></td>
              <td style="padding: 0 4px;"><a href="${frontendUrl}/#/review?rating=3&order_id=${encodeURIComponent(cleanId)}" style="display: block; width: 42px; height: 36px; line-height: 36px; background: #eab308; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">3</a></td>
              <td style="padding: 0 4px;"><a href="${frontendUrl}/#/review?rating=4&order_id=${encodeURIComponent(cleanId)}" style="display: block; width: 42px; height: 36px; line-height: 36px; background: #84cc16; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">4</a></td>
              <td style="padding: 0 4px;"><a href="${frontendUrl}/#/review?rating=5&order_id=${encodeURIComponent(cleanId)}" style="display: block; width: 42px; height: 36px; line-height: 36px; background: #22c55e; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">5</a></td>
            </tr>
            <tr style="font-size: 10px; color: #94a3b8;">
              <td colspan="2" style="text-align: left; padding-top: 4px;">Very unlikely</td>
              <td></td>
              <td colspan="2" style="text-align: right; padding-top: 4px;">Very likely</td>
            </tr>
          </table>

          <div style="font-size: 11px; color: #64748b;">Your response will be recorded and you will be redirected to our feedback form.</div>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 20px; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #94a3b8;">
          <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">Hope to see you again soon.</div>
          <div style="margin-bottom: 12px;">
            Got Questions? Please get in touch with our <a href="mailto:shraviko@gmail.com" style="color: #38bdf8; text-decoration: none;">24x7 Customer Care</a> or Call <a href="tel:+917742320607" style="color: #38bdf8; text-decoration: none;">+91 7742320607</a>.
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 10px;">
            This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.<br>
            © ${new Date().getFullYear()} Shraviko Sacred Atelier. All rights reserved.
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n📧 [EMAIL MOCK] Flipkart-Style Cancellation Email generated for ${to}:`);
    console.log(`   Order ID: ${cleanId} | Item: ${itemTitle} | Price: ₹${itemPrice}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your request to cancel ${itemTitle} from your order is being processed`,
      html: htmlTemplate,
    });
    console.log(`✅ Flipkart-style cancellation email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Cancellation email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * 5. sendReturnNotificationToAdmin — Admin Alert
 */
async function sendReturnNotificationToAdmin({ orderId, phone, reason, refundType, details }) {
  const transporter = getTransporter();
  const adminEmail = config.email.adminEmail || 'info@shraviko.com';
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
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #C5A059;">📦 New Return Request Received</h2>
        <ul>
          <li><strong>Order ID:</strong> ${safeOrderId}</li>
          <li><strong>Customer Phone:</strong> ${safePhone}</li>
          <li><strong>Return Reason:</strong> ${safeReason}</li>
          <li><strong>Refund Preference:</strong> ${safeRefundType}</li>
        </ul>
        ${detailsHtml ? `<div style="background: #f9f9f9; padding: 15px; border-radius: 6px;"><ul>${detailsHtml}</ul></div>` : ''}
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
      subject: `🚨 [RETURN REQUEST] Order #${safeOrderId} (${safeReason})`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * 6. sendCorporateEnquiryNotificationToAdmin — Corporate B2B Enquiry Alert
 */
async function sendCorporateEnquiryNotificationToAdmin({ id, enquiryId, fullName, companyName, email, phone, quantity, budget, occasion, message }) {
  const transporter = getTransporter();
  const adminEmail = config.email.adminEmail || 'info@shraviko.com';
  const refCode = escapeHtml(enquiryId || id || `ENQ_${Date.now()}`);

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #2C2623;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #E8DFC7; padding: 25px; border-radius: 12px;">
        <h2>💼 New B2B Corporate Bulk Enquiry</h2>
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
      subject: `💼 [CORPORATE BULK ENQUIRY] ${escapeHtml(companyName)} — ${escapeHtml(fullName)}`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


/**
 * 7. sendReviewRequestEmail — Post-Delivery 1-Click Review Request Email
 */
async function sendReviewRequestEmail({ to, customerName, orderId, productName, productId }) {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const starsHtml = [5, 4, 3, 2, 1].map(stars => `
    <a href="${frontendUrl}/#/review?product_id=${encodeURIComponent(productId || 'ALL')}&rating=${stars}&order_id=${encodeURIComponent(orderId)}"
       style="display: inline-block; padding: 10px 14px; margin: 4px; background-color: #1e293b; border: 1px solid #38bdf8; border-radius: 8px; color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 14px;">
      ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} (${stars} Star${stars > 1 ? 's' : ''})
    </a>
  `).join('');

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background-color: #0b0f17; padding: 12px; color: #f8fafc;">
      <div style="max-width: 620px; margin: 0 auto; background: #111827; border-radius: 12px; border: 1px solid #1f2937; padding: 25px; text-align: center;">
        <h2 style="color: #ffffff;">How was your Sacred Experience?</h2>
        <p style="color: #cbd5e1; font-size: 14px;">Hi ${customerName || 'Valued Customer'}, thank you for ordering #${orderId}. How would you rate ${productName || 'your item'}?</p>
        <div style="margin: 20px 0;">${starsHtml}</div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n⭐ [EMAIL MOCK] Review Email generated for ${to}: Order ${orderId}\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shraviko Care" <${process.env.EMAIL_USER}>`,
      to,
      subject: `How was your Sacred Experience? #${orderId} — Shraviko`,
      html: htmlTemplate,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
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
