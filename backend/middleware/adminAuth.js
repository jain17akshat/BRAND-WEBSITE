/**
 * middleware/adminAuth.js
 * ─────────────────────────────────────────────────────────
 * Enforces backend admin authentication & authorization.
 * Returns:
 *   - 401 Unauthorized if no authentication credentials provided.
 *   - 403 Forbidden if credentials are provided but invalid or non-admin.
 */

const crypto = require('crypto');
const config = require('../config');

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const customHeaderToken = req.headers['x-admin-token'] || req.headers['x-admin-key'] || req.headers['x-api-key'] || '';

  let incomingToken = customHeaderToken;
  if (!incomingToken && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      incomingToken = authHeader.slice(7).trim();
    } else {
      incomingToken = authHeader.trim();
    }
  }

  // 1. Unauthenticated requests (no auth token provided) -> 401 Unauthorized
  if (!incomingToken) {
    console.warn(`⛔ Unauthorized access attempt to ${req.originalUrl}: Missing admin token`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token is required',
    });
  }

  // 2. Validate token against server admin configuration
  const configuredAdminToken = config.admin?.apiKey || process.env.ADMIN_API_KEY || process.env.ADMIN_TOKEN || '';

  if (!configuredAdminToken) {
    console.error(`❌ Admin Auth Error: Admin token is not configured on server`);
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access disabled on server',
    });
  }

  const tokenBuf = Buffer.from(String(incomingToken));
  const expectedBuf = Buffer.from(String(configuredAdminToken));

  const isValid = tokenBuf.length === expectedBuf.length && crypto.timingSafeEqual(tokenBuf, expectedBuf);

  if (!isValid) {
    console.warn(`⛔ Forbidden access attempt to ${req.originalUrl}: Invalid admin credentials`);
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid admin credentials',
    });
  }

  req.isAdmin = true;
  next();
}

module.exports = requireAdminAuth;
