/**
 * shiprocket/pickup.js
 * ─────────────────────────────────────────────────────────
 * Fetches and caches valid pickup location from seller's Shiprocket account.
 */

const srClient = require('./client');
const config   = require('../config');

let cachedPickupLocation = null;

async function getValidPickupLocation() {
  if (cachedPickupLocation) return cachedPickupLocation;

  if (config.shiprocket.isMock) return 'Primary';

  try {
    const { data } = await srClient.get('/settings/company/pickup');
    const addresses = data?.data?.shipping_address || [];
    if (addresses.length > 0) {
      // If user specified an explicit env variable that matches one of the locations, use it
      const envLoc = config.shiprocket.pickupLocation;
      const matched = addresses.find(a => String(a.pickup_location).toLowerCase() === String(envLoc).toLowerCase());
      
      if (matched) {
        cachedPickupLocation = matched.pickup_location;
      } else {
        // Fallback to first active registered pickup address
        const primary = addresses.find(a => String(a.pickup_location).toLowerCase() === 'primary');
        cachedPickupLocation = primary ? primary.pickup_location : addresses[0].pickup_location;
      }

      console.log(`📦 Auto-detected Shiprocket Pickup Location: "${cachedPickupLocation}" (Account Locations: ${addresses.map(a => `"${a.pickup_location}"`).join(', ')})`);
      return cachedPickupLocation;
    }
  } catch (err) {
    console.error('⚠️ Could not fetch Shiprocket pickup locations:', err.response?.data?.message || err.message);
  }

  cachedPickupLocation = config.shiprocket.pickupLocation || 'Primary';
  return cachedPickupLocation;
}

module.exports = { getValidPickupLocation };
