/**
 * utils/dateUtils.js
 * ─────────────────────────────────────────────────────────
 * Shared date formatting utilities.
 */

/**
 * Formats a date string or timestamp into DD-MM-YYYY format
 */
function formatDate(dateInput) {
  if (!dateInput) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

module.exports = {
  formatDate,
};
