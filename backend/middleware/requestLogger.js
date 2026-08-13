/**
 * requestLogger.js
 * ─────────────────────────────────────────────────────────
 * Logs every incoming request with method, path, IP, and
 * the time taken to respond. Colour-coded by status code.
 */

const RESET  = '\x1b[0m';
const DIM    = '\x1b[2m';
const BOLD   = '\x1b[1m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const WHITE  = '\x1b[37m';

function colorStatus(code) {
  if (code >= 500) return `${RED}${code}${RESET}`;
  if (code >= 400) return `${YELLOW}${code}${RESET}`;
  if (code >= 300) return `${CYAN}${code}${RESET}`;
  return `${GREEN}${code}${RESET}`;
}

function pad(str, len) {
  return String(str).padEnd(len, ' ').slice(0, len);
}

/**
 * requestLogger — Express middleware
 * Logs: [timestamp] METHOD /path (IP) → STATUS in Xms
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const ip    = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?';

  res.on('finish', () => {
    const ms      = Date.now() - start;
    const method  = pad(req.method, 7);
    const path    = pad(req.originalUrl, 40);
    const status  = colorStatus(res.statusCode);
    const time    = `${BOLD}${ms}ms${RESET}`;
    const ipStr   = `${DIM}${ip}${RESET}`;
    const ts      = new Date().toISOString().replace('T', ' ').slice(0, 19);

    console.log(
      `${DIM}[${ts}]${RESET} ${CYAN}${method}${RESET} ${WHITE}${path}${RESET} ${ipStr} → ${status} ${time}`
    );
  });

  next();
}

module.exports = requestLogger;
