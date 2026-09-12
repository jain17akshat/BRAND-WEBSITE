/**
 * backend/data/catalog.js
 * ─────────────────────────────────────────────────────────
 * Authoritative Server-Side Product Catalog.
 * Enforces price integrity across payment creation, verification, and order processing.
 *
 * PRICING STRATEGY (applied 2026-09-12):
 *   All selling prices are set so that a 10% WELCOME10 coupon brings
 *   the customer's payable amount back to the original intended price.
 *   Formula: displayPrice = Math.round(originalPrice / 0.90)
 *   This is a ~11.11% markup that the coupon exactly reverses.
 *
 *   DO NOT re-run this calculation on already-adjusted prices.
 *   These values are final and should only be changed manually.
 */

const catalog = {
  // Brass Articles
  'brass-bell-garuda': 722,            // was 650
  'brass-bell-nandi': 722,             // was 650
  'brass-bell-simple': 722,            // was 650
  'brass-bell-carved': 722,            // was 650
  'brass-puja-thali-set': 554,         // was 499
  'brass-aarti-kapoor-diya': 1878,     // was 1690
  'brass-akhand-jyot-deepak': 500,     // was 450
  'brass-cup-jyot-diya': 500,          // was 450
  'brass-kamandal-holy-water-pot': 2767,// was 2490
  'brass-trishul-with-damru': 3211,    // was 2890
  'brass-trishul-standing-emblem': 2100,// was 1890
  'brass-gomukhi-shringi-abhishekam': 1656, // was 1490
  'brass-singhasan-deity-throne': 3211, // was 2890
  'brass-ladoo-gopal-statue': 2000,    // was 1800
  'brass-kalash-pooja-vessel': 1544,   // was 1390
  'brass-design-thali-set': 611,       // was 550

  // Copper Articles
  'copper-panchpatra-pali-set': 333,   // was 300
  'copper-puja-thali-set': 1333,       // was 1200
  'copper-hawan-kund-pyre': 2444,      // was 2200
  'copper-kalash-pooja-vessel': 1656,  // was 1490

  // Incense & Dhoop
  'incense-no-bamboo': 166,            // was 149
  'incense-with-bamboo': 143,          // was 129
  'dhoop-cones': 199,                  // was 179
  'dhoop-sticks': 277,                 // was 249
  'sambrani-cups': 221,                // was 199

  // Mandir Essentials
  'wooden-chowki-carved-01': 1100,     // was 990
  'wooden-chowki-large-15x15': 1500,   // was 1350
  'brass-dhoopdani-burner': 554,       // was 499
  'mandir-mala-counter-brass': 388,    // was 349
  'mandir-pooja-box-chest': 500,       // was 450
  'essentials-brass-chawar-whisk': 1433,// was 1290
  'mandir-jap-bag-gaumukhi': 322,      // was 290
  'mandir-royal-velvet-asan-mat': 544,  // was 490
  'brass-aarti-bell-ghanti': 722,      // was 650
  'mandir-copper-akhand-jyot': 1433,   // was 1290

  // Vastu & Spiritual
  'vastu-ganesh-siddha-yantra': 388,   // was 349
  'vastu-kuber-dhan-prapti-yantra': 388,// was 349
  'vastu-laxmi-siddha-yantra': 388,    // was 349
  'vastu-shani-siddha-yantra': 388,    // was 349
  'vastu-crystal-glass-yantra': 1767,  // was 1590
  'vastu-brass-pyramid-multitier': 443, // was 399
  'vastu-crystal-glass-turtle': 388,   // was 349
  'brass-kamdhenu-cow-statue': 2767,   // was 2490
  'brass-ganesh-ji-statue': 2544,      // was 2290
  'brass-radha-krishna-statue': 3211,  // was 2890
  'vastu-crystal-glass-shivling': 411, // was 370

  // Malas
  'mandir-rudraksh-mala': 777,         // was 699
  'mandir-sphatik-mala': 1888,         // was 1699
  'mandir-tulsi-mala': 278,            // was 250
  'mandir-vaijanti-mala': 278,         // was 250
  'mandir-karungali-mala': 278,        // was 250
  'mandir-wooden-damru-shiva': 433,    // was 390
};

// Map of variant-specific pricing for items with multiple options
const variantPrices = {
  // Kamandal variants
  'brass-kamandal-holy-water-pot-500ML(0.5L)': 1878,       // was 1690
  'brass-kamandal-holy-water-pot-1Litre(1.0L)': 2767,      // was 2490
  'brass-kamandal-holy-water-pot-2Litres(2.0L)': 4322,     // was 3890

  // Trishul standing variants
  'brass-trishul-standing-emblem-6InchAltarTrishul': 1433,  // was 1290
  'brass-trishul-standing-emblem-9InchHeavyTrishul': 2100,  // was 1890
  'brass-trishul-standing-emblem-12InchTempleTrishul': 3322, // was 2990

  // Gaumukh Shringi variants
  'brass-gomukhi-shringi-abhishekam-Small(4.5cm)': 767,    // was 690
  'brass-gomukhi-shringi-abhishekam-Small-Medium(5cm)': 1100, // was 990
  'brass-gomukhi-shringi-abhishekam-Medium(6.25cm)': 1656, // was 1490
  'brass-gomukhi-shringi-abhishekam-Large(7cm)': 2211,     // was 1990
  'brass-gomukhi-shringi-abhishekam-ExtraLarge(8cm)': 2878, // was 2590

  // Copper Kalash variants
  'copper-kalash-pooja-vessel-64g(Small/DailyPooja)': 878, // was 790
  'copper-kalash-pooja-vessel-240g(Large/Sthapana&Ceremonies)': 1656, // was 1490

  // Kamdhenu variants
  'brass-kamdhenu-cow-statue-Compact(7×3×5cm-70G)': 1656,  // was 1490
  'brass-kamdhenu-cow-statue-Medium(450G-5Inch)': 2767,    // was 2490
  'brass-kamdhenu-cow-statue-RoyalLarge(850G-7Inch)': 4322, // was 3890

  // Incense variants
  'incense-no-bamboo-50SticksPack': 166,                   // was 149
  'incense-no-bamboo-80SticksPack': 243,                   // was 219
  'incense-no-bamboo-100SticksPack': 299,                  // was 269

  'incense-with-bamboo-50SticksPack': 143,                 // was 129
  'incense-with-bamboo-80SticksPack': 210,                 // was 189
  'incense-with-bamboo-100SticksPack': 254,                // was 229

  'dhoop-cones-12ConesTrialPack': 110,                     // was 99
  'dhoop-cones-24ConesSmallPack': 199,                     // was 179
  'dhoop-cones-40ConesTwinPack(80Cones)': 332,             // was 299
  'dhoop-cones-50ConesRetailPack': 388,                    // was 349
  'dhoop-cones-100ConesValueBox': 666,                     // was 599
  'dhoop-cones-200ConesFamilyTinBox': 1110,                // was 999

  'dhoop-sticks-20SticksPack': 132,                        // was 119
  'dhoop-sticks-50SticksPack': 277,                        // was 249
  'dhoop-sticks-100SticksValueBox': 499,                   // was 449
};

// ─── Coupon Definitions ───────────────────────────────────
const COUPONS = {
  WELCOME10: {
    discountPercent: 10,
    description: '10% off your order',
    stackable: false,
    appliesToShipping: false,
  },
};

/**
 * Validate a coupon code and calculate the discount amount.
 * @param {string} code  — the coupon code (case-insensitive)
 * @param {number} subtotal — the eligible product subtotal (before discount)
 * @returns {{ valid: boolean, discountAmount: number, reason?: string }}
 */
function validateCoupon(code, subtotal) {
  if (!code || typeof code !== 'string') {
    return { valid: false, discountAmount: 0, reason: 'No coupon code provided' };
  }

  const cleaned = code.trim().toUpperCase();
  const coupon = COUPONS[cleaned];

  if (!coupon) {
    return { valid: false, discountAmount: 0, reason: `Unknown coupon code: "${cleaned}"` };
  }

  if (typeof subtotal !== 'number' || subtotal <= 0) {
    return { valid: false, discountAmount: 0, reason: 'Subtotal must be a positive number' };
  }

  const discountAmount = Math.round(subtotal * (coupon.discountPercent / 100));

  return {
    valid: true,
    discountAmount,
    discountPercent: coupon.discountPercent,
    code: cleaned,
  };
}

const { AppError } = require('../middleware/errorHandler');

/**
 * Get authoritative server-side price for a product item or variant
 */
function getProductPrice(item) {
  if (!item) {
    throw new AppError('Product item details are required', 400, 'UNKNOWN_PRODUCT');
  }

  const rawId = String(item.id || item.productId || '').trim();

  // 1. Check exact item variant ID
  if (variantPrices[rawId] !== undefined) {
    return variantPrices[rawId];
  }

  // 2. Check if item has weight/variant field attached
  if (item.weight) {
    const variantId = `${rawId}-${String(item.weight).replace(/\s+/g, '')}`;
    if (variantPrices[variantId] !== undefined) {
      return variantPrices[variantId];
    }
  }

  // 3. Check base catalog ID
  if (catalog[rawId] !== undefined) {
    return catalog[rawId];
  }

  // 4. Extract base ID if rawId contains variant suffix (e.g., 'brass-bell-garuda-90g')
  const baseId = rawId.split('-').slice(0, -1).join('-');
  if (baseId && catalog[baseId] !== undefined) {
    return catalog[baseId];
  }

  // Reject unknown product IDs
  throw new AppError(`Unknown or uncatalogued product ID: "${rawId || 'empty'}"`, 400, 'UNKNOWN_PRODUCT');
}

/**
 * Recompute total amount for a cart based on authoritative catalog prices
 */
function calculateCartSubtotal(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((subtotal, item) => {
    const unitPrice = getProductPrice(item);
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));
    return subtotal + (unitPrice * qty);
  }, 0);
}

// ── In-Memory Stock Control (Initial Documented Default: 100 units/item) ──
const stockRegistry = new Map();

function getAvailableStock(itemOrId) {
  const rawId = typeof itemOrId === 'string' ? itemOrId : String(itemOrId?.id || itemOrId?.productId || '').trim();
  if (stockRegistry.has(rawId)) {
    return stockRegistry.get(rawId);
  }
  return 100; // Documented initial default stock
}

function setProductStock(rawId, stockQuantity) {
  stockRegistry.set(rawId, Math.max(0, parseInt(stockQuantity, 10) || 0));
}

async function deductInventoryForCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return true;

  for (const item of cart) {
    const rawId = String(item.id || item.productId || '').trim();
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));
    const currentStock = getAvailableStock(rawId);

    if (currentStock < qty) {
      throw new AppError(
        `Product "${item.name || rawId}" is out of stock. Requested: ${qty}, Available: ${currentStock}.`,
        409,
        'OUT_OF_STOCK'
      );
    }
  }

  const { deductStockAtomic } = require('../database/db');
  for (const item of cart) {
    const rawId = String(item.id || item.productId || '').trim();
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));

    const success = await deductStockAtomic(rawId, qty);
    if (!success) {
      throw new AppError(
        `Insufficient stock to complete purchase for "${item.name || rawId}".`,
        409,
        'OUT_OF_STOCK'
      );
    }

    const currentStock = getAvailableStock(rawId);
    setProductStock(rawId, Math.max(0, currentStock - qty));
  }

  return true;
}

async function restoreInventoryForCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return;

  const { restoreStockAtomic } = require('../database/db');
  for (const item of cart) {
    const rawId = String(item.id || item.productId || '').trim();
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));

    await restoreStockAtomic(rawId, qty);
    const currentStock = getAvailableStock(rawId);
    setProductStock(rawId, currentStock + qty);
  }
}

module.exports = {
  catalog,
  variantPrices,
  COUPONS,
  getProductPrice,
  calculateCartSubtotal,
  validateCoupon,
  getAvailableStock,
  setProductStock,
  deductInventoryForCart,
  restoreInventoryForCart,
};
