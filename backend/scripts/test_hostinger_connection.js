/**
 * scripts/test_hostinger_connection.js
 * Safely probes connection to Hostinger Remote MySQL before executing sample test.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load temporary staging config
const stagingEnvPath = path.join(__dirname, '../.env.hostinger_staging');
if (!require('fs').existsSync(stagingEnvPath)) {
  console.error(`❌ Staging configuration file not found at: ${stagingEnvPath}`);
  console.error(`Please provide your Hostinger Remote MySQL hostname/IP to create .env.hostinger_staging.`);
  process.exit(1);
}

dotenv.config({ path: stagingEnvPath });

const mysql = require('mysql2/promise');

async function probeHostingerConnection() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;
  const password = process.env.DB_PASS;
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log('\n======================================================');
  console.log('🔍 PROBING HOSTINGER REMOTE MYSQL CONNECTION');
  console.log('======================================================');
  console.log(`  • Host:     ${host}`);
  console.log(`  • Port:     ${port}`);
  console.log(`  • Database: ${database}`);
  console.log(`  • User:     ${user}`);

  if (!host || host === '127.0.0.1' || host === 'localhost') {
    console.error(`❌ Failure: DB_HOST is set to local loopback (${host}). Please enter Hostinger's Remote MySQL hostname/IP.`);
    process.exit(1);
  }

  const dns = require('dns').promises;
  let targetHost = host;
  try {
    const resolved = await dns.lookup(host, { family: 4 });
    if (resolved && resolved.address) {
      targetHost = resolved.address;
      console.log(`  • Resolved IPv4: ${targetHost}`);
    }
  } catch (dnsErr) {
    console.warn(`  ⚠️ DNS IPv4 lookup warning: ${dnsErr.message}`);
  }

  try {
    const connection = await mysql.createConnection({
      host: targetHost,
      port,
      user,
      password,
      database,
      connectTimeout: 10000,
    });

    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log(`\n  ✅ SUCCESS: Connected to Hostinger Remote MySQL (${database})! Query test: ${rows[0].result}`);

    const [tables] = await connection.query('SHOW TABLES LIKE "orders"');
    console.log(`  ✅ Database schema verified. Table "orders" exists: ${tables.length > 0 ? 'YES' : 'NO'}`);

    await connection.end();
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Hostinger Remote MySQL Connection Failed:`, err.message);
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`👉 Tip: Ensure your local IP is added to Hostinger hPanel -> Databases -> Remote MySQL.`);
    }
    console.log('======================================================\n');
    process.exit(1);
  }
}

probeHostingerConnection();
