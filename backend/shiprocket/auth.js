/**
 * shiprocket/auth.js
 * ─────────────────────────────────────────────────────────
 * Manages Shiprocket JWT authentication.
 *
 * - Fetches token via POST /auth/login on first call
 * - Caches token in memory (avoids repeated logins)
 * - Automatically refreshes every 9 days (tokens expire in 10)
 * - Returns null cleanly in mock mode
 */

const axios = require('axios');
const config = require('../config');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let _token        = null;
let _tokenExpiry  = null;
let _refreshTimer = null;

/**
 * fetchToken — logs in to Shiprocket and stores JWT
 */
async function fetchToken() {
  if (config.shiprocket.isMock) return null;

  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      email:    config.shiprocket.email,
      password: config.shiprocket.password,
    });

    _token       = data.token;
    _tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days in ms

    console.log('✅ Shiprocket JWT acquired (expires in ~9 days)');
    scheduleRefresh();
    return _token;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error(`❌ Shiprocket auth failed: ${msg}`);
    _token = null;
    return null;
  }
}

/**
 * scheduleRefresh — sets a timer to auto-refresh the token
 */
function scheduleRefresh() {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  const ms = 9 * 24 * 60 * 60 * 1000; // 9 days
  _refreshTimer = setTimeout(fetchToken, ms);
  // Prevent timer from keeping Node process alive
  if (_refreshTimer.unref) _refreshTimer.unref();
}

/**
 * getToken — returns valid cached token, or fetches a new one
 * @returns {Promise<string|null>}
 */
async function getToken() {
  if (config.shiprocket.isMock) return null;

  if (_token && _tokenExpiry && Date.now() < _tokenExpiry) {
    return _token;
  }

  return fetchToken();
}

/**
 * invalidateToken — call when a request gets a 401 from Shiprocket
 */
function invalidateToken() {
  _token       = null;
  _tokenExpiry = null;
}

module.exports = { getToken, invalidateToken };
