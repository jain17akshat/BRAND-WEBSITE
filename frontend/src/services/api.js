/**
 * src/services/api.js
 * ─────────────────────────────────────────────────────────
 * All frontend → backend API calls in one place.
 * Uses the Vite proxy (/api → http://localhost:4000).
 */

const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error?.message || `Request failed: ${res.status}`);
    err.code   = data?.error?.code || 'UNKNOWN_ERROR';
    err.status = res.status;
    throw err;
  }

  return data;
}

// ── Shiprocket / Order: Tracking ──────────────────────────
export async function trackOrder(phone, orderId) {
  const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  const cleanId    = String(orderId || '').replace(/^[#\s]+/, '').trim();
  return request(`/track?orderId=${encodeURIComponent(cleanId)}&phone=${cleanPhone}`);
}

// ── Shiprocket / Order: Cancel Order ─────────────────────────
export async function cancelOrder({ order_id, email, phone, customer_name, reason }) {
  const cleanId = String(order_id || '').replace(/^[#\s]+/, '').trim();
  return request(`/orders/${encodeURIComponent(cleanId)}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ email, phone, customer_name, reason }),
  });
}

// ── Shiprocket / Returns: Submit Return ────────────────────
export async function submitReturn({ order_id, phone, email, customer_name, reason, refund_type, details }) {
  return request('/returns/request', {
    method: 'POST',
    body: JSON.stringify({ order_id, phone, email, customer_name, reason, refund_type, details }),
  });
}

// ── Shiprocket: Check Rates ───────────────────────────────
export async function checkRates({ delivery_pincode, weight = 0.5, cod = false }) {
  return request('/rates/check', {
    method: 'POST',
    body: JSON.stringify({ pickup_pincode: 302006, delivery_pincode, weight, cod }),
  });
}

// ── Razorpay: Create Order ────────────────────────────────
export async function createRazorpayOrder({ amount, receipt }) {
  return request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount, receipt }),
  });
}

// ── Razorpay: Verify Payment ──────────────────────────────
export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  cart,
  customer,
  payment_method,
}) {
  return request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      customer,
      payment_method,
    }),
  });
}

// ── Razorpay: Refund ──────────────────────────────────────
export async function submitRefund({ payment_id, amount, reason }) {
  return request('/payments/refund', {
    method: 'POST',
    body: JSON.stringify({ payment_id, amount, reason }),
  });
}

// ── Corporate Bulk Enquiry ────────────────────────────────
export async function submitCorporateEnquiry(data) {
  return request('/enquiries/corporate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Energy Stones Launch Subscription ─────────────────────
export async function subscribeToLaunch({ email, purpose }) {
  return request('/enquiries/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  });
}

// ── Product Reviews & Ratings ──────────────────────────────
export async function fetchProductReviews(productId) {
  return request(`/reviews/${encodeURIComponent(productId || 'ALL')}`);
}

export async function submitProductReview(reviewData) {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

// ── Health Check ──────────────────────────────────────────
export async function healthCheck() {
  return request('/health');
}
