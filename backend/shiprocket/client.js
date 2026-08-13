/**
 * shiprocket/client.js
 * ─────────────────────────────────────────────────────────
 * Axios instance pre-configured for Shiprocket API.
 * Automatically injects the Bearer token on every request.
 * Handles 401 → token refresh → retry (once).
 */

const axios = require('axios');
const { getToken, invalidateToken } = require('./auth');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

const shiprocketAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: inject auth token ─────────────────
shiprocketAxios.interceptors.request.use(async (reqConfig) => {
  const token = await getToken();
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// ── Response interceptor: handle 401 with one retry ────────
let _isRetrying = false;

shiprocketAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !_isRetrying) {
      _isRetrying = true;
      invalidateToken();

      try {
        const freshToken = await getToken();
        if (freshToken) {
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          _isRetrying = false;
          return shiprocketAxios(originalRequest);
        }
      } catch {
        // Retry failed — fall through to rejection
      }

      _isRetrying = false;
    }

    return Promise.reject(error);
  }
);

module.exports = shiprocketAxios;
