/**
 * backend/data/catalog.js
 * ─────────────────────────────────────────────────────────
 * Authoritative Server-Side Product Catalog.
 * Enforces price integrity across payment creation, verification, and order processing.
 */

const catalog = {
  // Brass Articles
  'brass-bell-garuda': 650,
  'brass-bell-nandi': 650,
  'brass-bell-simple': 650,
  'brass-bell-carved': 650,
  'brass-puja-thali-set': 499,
  'brass-aarti-kapoor-diya': 1690,
  'brass-akhand-jyot-deepak': 450,
  'brass-cup-jyot-diya': 450,
  'brass-kamandal-holy-water-pot': 2490,
  'brass-trishul-with-damru': 2890,
  'brass-trishul-standing-emblem': 1890,
  'brass-gomukhi-shringi-abhishekam': 1490,
  'brass-singhasan-deity-throne': 2890,
  'brass-ladoo-gopal-statue': 1800,
  'brass-kalash-pooja-vessel': 1390,
  'brass-design-thali-set': 1290,

  // Copper Articles
  'copper-panchpatra-pali-set': 690,
  'copper-puja-thali-set': 1890,
  'copper-hawan-kund-pyre': 1490,
  'copper-kalash-pooja-vessel': 890,

  // Incense & Dhoop
  'incense-no-bamboo': 299,
  'incense-with-bamboo': 249,
  'dhoop-cones': 199,
  'dhoop-sticks': 229,
  'sambrani-cups': 349,

  // Mandir Essentials
  'wooden-chowki-carved-01': 1490,
  'wooden-chowki-large-15x15': 2490,
  'brass-dhoopdani-burner': 890,
  'mandir-mala-counter-brass': 490,
  'mandir-pooja-box-chest': 1890,
  'essentials-brass-chawar-whisk': 1290,
  'mandir-jap-bag-gaumukhi': 290,
  'mandir-royal-velvet-asan-mat': 490,
  'brass-aarti-bell-ghanti': 650,
  'mandir-copper-akhand-jyot': 1290,

  // Vastu & Spiritual
  'vastu-ganesh-siddha-yantra': 890,
  'vastu-kuber-dhan-prapti-yantra': 890,
  'vastu-laxmi-siddha-yantra': 890,
  'vastu-shani-siddha-yantra': 890,
  'vastu-crystal-glass-yantra': 1290,
  'vastu-brass-pyramid-multitier': 1490,
  'vastu-crystal-glass-turtle': 690,
  'brass-kamdhenu-cow-statue': 2190,
  'brass-ganesh-ji-statue': 2490,
  'brass-radha-krishna-statue': 3890,
  'vastu-crystal-glass-shivling': 990,

  // Malas
  'mandir-rudraksh-mala': 490,
  'mandir-sphatik-mala': 890,
  'mandir-tulsi-mala': 390,
  'mandir-vaijanti-mala': 590,
  'mandir-karungali-mala': 1190,
  'mandir-wooden-damru-shiva': 390,
};

// Map of variant-specific pricing for items with multiple options
const variantPrices = {
  // Kamandal variants
  'brass-kamandal-holy-water-pot-500ML(0.5L)': 1690,
  'brass-kamandal-holy-water-pot-1Litre(1.0L)': 2490,
  'brass-kamandal-holy-water-pot-2Litres(2.0L)': 3890,

  // Trishul standing variants
  'brass-trishul-standing-emblem-6InchAltarTrishul': 1290,
  'brass-trishul-standing-emblem-9InchHeavyTrishul': 1890,
  'brass-trishul-standing-emblem-12InchTempleTrishul': 2990,

  // Gaumukh Shringi variants
  'brass-gomukhi-shringi-abhishekam-Small(4.5cm)': 690,
  'brass-gomukhi-shringi-abhishekam-Small-Medium(5cm)': 990,
  'brass-gomukhi-shringi-abhishekam-Medium(6.25cm)': 1490,
  'brass-gomukhi-shringi-abhishekam-Large(7cm)': 1990,
  'brass-gomukhi-shringi-abhishekam-ExtraLarge(8cm)': 2590,
};

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

  // 2. Check base catalog ID
  if (catalog[rawId] !== undefined) {
    return catalog[rawId];
  }

  // 3. Extract base ID if rawId contains variant suffix (e.g., 'brass-bell-garuda-90g')
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

module.exports = {
  catalog,
  variantPrices,
  getProductPrice,
  calculateCartSubtotal,
};
