/**
 * routes/gstAdmin.js
 * ─────────────────────────────────────────────────────────
 * Backend GST Reporting & Reconciliation Endpoints (No Frontend UI).
 * Allows backend report generation & reconciliation validation directly
 * from Hostinger MySQL `gst_transactions` table.
 *
 * Endpoints:
 *   GET /api/gst/reconcile?year=2026&month=09
 *   GET /api/gst/export?year=2026&month=09&type=all|sales|credit_notes|b2b|b2c
 *   GET /api/gst/audit-log?order_id=SHR123456
 */

const express = require('express');
const router = express.Router();
const requireAdminAuth = require('../middleware/adminAuth');
const { reconcileGST, generateGSTCSVReport } = require('../services/gstLedgerService');
const { getAuditTrail } = require('../services/auditLogService');
const { AppError } = require('../middleware/errorHandler');

// Require admin authentication for all administrative GST endpoints
router.use(requireAdminAuth);

// ── GET /api/gst/reconcile ────────────────────────────────
router.get('/reconcile', async (req, res, next) => {
  try {
    const today = new Date();
    const year = parseInt(req.query.year || today.getFullYear(), 10);
    const month = parseInt(req.query.month || (today.getMonth() + 1), 10);

    const report = await reconcileGST(year, month);
    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/gst/export ───────────────────────────────────
router.get('/export', async (req, res, next) => {
  try {
    const today = new Date();
    const year = parseInt(req.query.year || today.getFullYear(), 10);
    const month = parseInt(req.query.month || (today.getMonth() + 1), 10);
    const type = String(req.query.type || 'all').toLowerCase();

    const csvData = await generateGSTCSVReport(type, year, month);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="GST_Report_${type}_${year}_${month}.csv"`);
    res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/gst/audit-log ────────────────────────────────
router.get('/audit-log', async (req, res, next) => {
  try {
    const { order_id } = req.query;
    if (!order_id) {
      return next(new AppError('order_id query parameter is required.', 400, 'INVALID_INPUT'));
    }

    const logs = await getAuditTrail(order_id);
    res.json({ success: true, order_id, audit_logs: logs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
