/**
 * mockMode.js
 * ─────────────────────────────────────────────────────────
 * Attaches mock-mode flags to every request so route handlers
 * can check `req.mock.razorpay` / `req.mock.shiprocket`
 * without importing config themselves.
 *
 * Also logs a one-time warning at startup if mock mode is on.
 */

const config = require('../config');

// ── One-time startup banner ────────────────────────────────
const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

let bannerPrinted = false;

function printBanner() {
  if (bannerPrinted) return;
  bannerPrinted = true;

  const rzStatus = config.razorpay.isMock
    ? `${YELLOW}MOCK${RESET} (add RAZORPAY_KEY_ID + KEY_SECRET to .env to go live)`
    : `${GREEN}LIVE${RESET}`;

  const srStatus = config.shiprocket.isMock
    ? `${YELLOW}MOCK${RESET} (add SHIPROCKET_EMAIL + PASSWORD to .env to go live)`
    : `${GREEN}LIVE${RESET}`;

  console.log(`
${BOLD}┌───────────────────────────────────────────────────┐${RESET}
${BOLD}│        Shraviko Backend — Integration Status       │${RESET}
${BOLD}├───────────────────────────────────────────────────┤${RESET}
  💳 Razorpay  : ${rzStatus}
  📦 Shiprocket: ${srStatus}
${BOLD}└───────────────────────────────────────────────────┘${RESET}
`);
}

/**
 * mockMode — Express middleware
 * Attaches req.mock = { razorpay: bool, shiprocket: bool }
 */
function mockMode(req, res, next) {
  printBanner();

  req.mock = {
    razorpay:   config.razorpay.isMock,
    shiprocket: config.shiprocket.isMock,
  };

  next();
}

module.exports = mockMode;
