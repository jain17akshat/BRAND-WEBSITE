# Shraviko — Production Deployment Guide & Readiness Checklist

This document provides complete instructions for deploying the **Shraviko Backend (Express)** and **Frontend (Vite / React)** applications to production, along with environment variable configurations, webhook setups, and a pre-launch verification checklist.

---

## 1. Backend Deployment Configuration

### Environment Variables (`backend/.env`)

Set `NODE_ENV=production` in your production environment. The backend includes a **Production Mock Gate** in `backend/config.js` that will immediately halt startup (`process.exit(1)`) if required production credentials or secrets are missing.

| Variable | Description | Source / Notes |
| :--- | :--- | :--- |
| `PORT` | HTTP Server Port | Set by hosting platform or default `4000` |
| `NODE_ENV` | Environment Mode | Set to `production` |
| `FRONTEND_URL` | Deployed Frontend Origin | e.g. `https://shraviko.com` |
| `CORS_EXTRA_ORIGINS` | Additional Allowed Origins | Optional comma-separated origins (e.g. `https://admin.shraviko.com`) |
| `RAZORPAY_KEY_ID` | Razorpay Live Key ID | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Key Secret | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_WEBHOOK_SECRET` | Secret token for webhook signatures | Set in Razorpay Dashboard -> Webhooks |
| `SHIPROCKET_EMAIL` | Shiprocket Account Email | [Shiprocket Dashboard](https://app.shiprocket.in/api-user) |
| `SHIPROCKET_PASSWORD` | Shiprocket Account Password | Shiprocket account credentials |
| `SHIPROCKET_CHANNEL_ID` | Shiprocket Channel ID | Shiprocket Channels settings |
| `SHIPROCKET_PICKUP_LOCATION` | Pickup Location Nickname | Defaults to `work` |
| `SHIPROCKET_WEBHOOK_TOKEN` | Shiprocket Webhook Token | Shiprocket Webhook settings |
| `DB_HOST` | MySQL Host | Hostinger / Production MySQL Host |
| `DB_PORT` | MySQL Port | Default `3306` |
| `DB_NAME` | MySQL Database Name | e.g. `shraviko_production` |
| `DB_USER` | MySQL Username | Production DB user |
| `DB_PASS` | MySQL Password | Production DB password |
| `EMAIL_USER` | Sender Email Address | Gmail SMTP address (e.g. `info@shraviko.com`) |
| `EMAIL_PASS` | Gmail App Password | Google Account -> Security -> App Passwords |
| `ADMIN_EMAIL` | Admin Alert Recipient | e.g. `orders@shraviko.com` |
| `ADMIN_PHONE` | Admin Contact Phone | e.g. `+917742320607` |

---

## 2. Frontend Deployment Configuration

### Environment Variables & Build Command

The frontend must be built with the production API endpoint specified.

1. Set `VITE_API_URL` during the build step:
   ```bash
   VITE_API_URL=https://api.shraviko.com/api
   ```
2. Run the build command inside `frontend/`:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy the generated static files inside `frontend/dist/` to your static host (Vercel, Netlify, Cloudflare Pages, Hostinger, Nginx, etc.).

---

## 3. Webhook Setup

### Razorpay Webhook Configuration
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/) -> **Settings** -> **Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL**: `https://api.shraviko.com/api/payments/webhook`
4. **Secret**: Enter the exact string configured in `RAZORPAY_WEBHOOK_SECRET` in `backend/.env`.
5. **Active Events**:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
6. Save Webhook.

---

## 4. Alternative Combined-Hosting Option

If you prefer serving the frontend static build directly from the Express backend on a single host/port:

1. Build the frontend: `cd frontend && npm run build`.
2. In `backend/index.js`, add static file serving and SPA catch-all route after API route mounts:
   ```javascript
   const path = require('path');
   app.use(express.static(path.join(__dirname, '../frontend/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
   ```

---

## 5. Production Readiness Verification Checklist

Before opening the site to live traffic, complete this verification checklist step by step:

- [ ] **1. Live SMTP Email Delivery Test**
  - Verify corporate enquiry email delivery by testing live enquiry form submission on site.
  - Confirm the notification email arrives cleanly in the `ADMIN_EMAIL` inbox.

- [ ] **2. Backend Production Startup & Mock Gate**
  - Start backend with `NODE_ENV=production npm start`.
  - Confirm log shows `🚀 Shraviko server running on port 4000` without any `FATAL` mock gate aborts.

- [ ] **3. Health Check Endpoint**
  - Curl or open `GET https://api.shraviko.com/api/health`.
  - Confirm HTTP 200 status response:
    ```json
    {
      "status": "ok",
      "service": "Shraviko API",
      "mode": {
        "razorpay": "live",
        "shiprocket": "live"
      }
    }
    ```

- [ ] **4. Frontend Asset & Image Loading**
  - Open the deployed frontend URL in browser.
  - Verify homepage, product catalog, and modal images load cleanly without 404 broken image links or case-sensitivity errors.

- [ ] **5. Test Payment & Order Verification**
  - Perform a live test transaction on frontend.
  - Verify Razorpay checkout modal opens, completes, and calls `POST /api/payments/verify`.
  - Verify server responds with internal order ID format `SHR######`.

- [ ] **6. Order Confirmation Email & Database Persistence**
  - Confirm customer confirmation email and admin alert email arrive.
  - Verify order row appears in MySQL `orders` table.

- [ ] **7. Shiprocket Fulfillment Creation & Tracking**
  - Confirm shipment order creation log in backend.
  - Query order status via frontend Track Order page (`/api/track?orderId=SHR######&phone=XXXXXXXXXX`) and confirm tracking data is returned.

---

## 6. Hostinger Combined Deployment (Frontend + Backend Together)

Follow these step-by-step instructions to deploy both the **Frontend** and **Backend** together on **Hostinger**:

### Step 1: Prepare Production Build & Code
1. In your local terminal, ensure the frontend build is generated:
   ```bash
   npm run build
   ```
   *This compiles the Vite frontend into `frontend/dist`.*
2. Our `backend/index.js` automatically serves the static assets in `frontend/dist` and handles SPA route fallbacks when deployed!

---

### Step 2: Set Up Hostinger MySQL Database (hPanel)
1. Log in to **Hostinger hPanel** → Go to **Databases** → **MySQL Databases**.
2. Create a new database (e.g. `u123456789_shraviko`) and a database user with a secure password.
3. Save the Database Host (usually `localhost`), Database Name, Username, and Password.
4. *Note: The backend auto-initializes all required database tables (`orders`, `returns`, `enquiries`, `reviews`) when it starts up!*

---

### Step 3: Deploy on Hostinger Node.js Web App (hPanel)
1. Go to **Hostinger hPanel** → **Website** → **Node.js**.
2. Select your Node.js version (Recommended: **Node.js 18.x or 20.x**).
3. Set **Application Root**: `/public_html` (or project root directory).
4. Set **Application Startup File**: `backend/index.js`.
5. Set Environment Variables in Hostinger Node.js panel or upload `backend/.env`:
   ```env
   NODE_ENV=production
   PORT=4000
   FRONTEND_URL=https://yourdomain.com
   DB_HOST=localhost
   DB_USER=u123456789_user
   DB_PASS=YourSecurePassword
   DB_NAME=u123456789_shraviko
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   SHIPROCKET_EMAIL=...
   SHIPROCKET_PASSWORD=...
   SHIPROCKET_CHANNEL_ID=...
   EMAIL_USER=info@shraviko.com
   EMAIL_PASS=...
   ADMIN_EMAIL=orders@shraviko.com
   ```
6. Click **Run NPM Install** and **Restart Application**.

---

### Step 4: Webhook URLs for Live Services
Once live on your domain (e.g. `https://yourdomain.com`):

- **Razorpay Webhook URL**:
  `https://yourdomain.com/api/payments/webhook`
- **Shiprocket Webhook URL**:
  `https://yourdomain.com/api/fulfillment-updates`

