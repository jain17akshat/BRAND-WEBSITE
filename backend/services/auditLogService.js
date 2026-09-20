/**
 * services/auditLogService.js
 * ─────────────────────────────────────────────────────────
 * Financial Audit Logger for SHRAVIKO / SHASHWAT ENTERPRISES.
 * Records immutable timeline events for all order & financial state transitions:
 *   INVOICE_CREATED, CREDIT_NOTE_CREATED, REFUND_INITIATED,
 *   ORDER_DELIVERED, RETURN_ACCEPTED, GST_LEDGER_POSTED, etc.
 */

const { getPool } = require('../database/db');

const inMemoryAuditLogs = [];

/**
 * Logs a financial event into MySQL financial_audit_log (and memory fallback)
 */
async function logEvent({
  eventType,
  entityType = 'ORDER',
  entityId,
  orderId,
  invoiceNumber = null,
  creditNoteNumber = null,
  previousStatus = null,
  newStatus = null,
  metadata = {},
  source = 'SYSTEM'
}) {
  const record = {
    id: Date.now(),
    event_type: eventType,
    entity_type: entityType,
    entity_id: String(entityId || orderId || 'UNKNOWN'),
    order_id: orderId || null,
    invoice_number: invoiceNumber || null,
    credit_note_number: creditNoteNumber || null,
    previous_status: previousStatus || null,
    new_status: newStatus || null,
    metadata_json: JSON.stringify(metadata || {}),
    source,
    created_at: new Date().toISOString()
  };

  inMemoryAuditLogs.unshift(record);

  const p = getPool();
  if (!p) return record;

  try {
    const [res] = await p.query(
      `INSERT INTO financial_audit_log
       (event_type, entity_type, entity_id, order_id, invoice_number, credit_note_number, previous_status, new_status, metadata_json, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.event_type,
        record.entity_type,
        record.entity_id,
        record.order_id,
        record.invoice_number,
        record.credit_note_number,
        record.previous_status,
        record.new_status,
        record.metadata_json,
        record.source
      ]
    );
    record.id = res.insertId;
    return record;
  } catch (err) {
    console.error('⚠️ Could not persist financial audit event to DB:', err.message);
    return record;
  }
}

/**
 * Fetches audit trail for a specific order or entity ID
 */
async function getAuditTrail(orderId) {
  const cleanId = String(orderId || '').trim().toUpperCase();
  if (!cleanId) return [];

  const p = getPool();
  if (p) {
    try {
      const [rows] = await p.query(
        `SELECT * FROM financial_audit_log WHERE UPPER(order_id) = ? OR UPPER(entity_id) = ? ORDER BY id ASC`,
        [cleanId, cleanId]
      );
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.error('⚠️ Could not fetch audit trail from DB:', err.message);
    }
  }

  return inMemoryAuditLogs.filter(l => String(l.order_id || l.entity_id).toUpperCase() === cleanId);
}

module.exports = {
  logEvent,
  getAuditTrail
};
