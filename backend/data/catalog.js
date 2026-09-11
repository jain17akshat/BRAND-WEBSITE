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
  'brass-design-thali-set': 550,

  // Copper Articles
  'copper-panchpatra-pali-set': 300,
  'copper-puja-thali-set': 1200,
  'copper-hawan-kund-pyre': 2200,
  'copper-kalash-pooja-vessel': 1490,

  // Incense & Dhoop
  'incense-no-bamboo': 149,
  'incense-with-bamboo': 129,
  'dhoop-cones': 179,
  'dhoop-sticks': 249,
  'sambrani-cups': 199,

  // Mandir Essentials
  'wooden-chowki-carved-01': 990,
  'wooden-chowki-large-15x15': 1350,
  'brass-dhoopdani-burner': 499,
  'mandir-mala-counter-brass': 349,
  'mandir-pooja-box-chest': 450,
  'essentials-brass-chawar-whisk': 1290,
  'mandir-jap-bag-gaumukhi': 290,
  'mandir-royal-velvet-asan-mat': 490,
  'brass-aarti-bell-ghanti': 650,
  'mandir-copper-akhand-jyot': 1290,

  // Vastu & Spiritual
  'vastu-ganesh-siddha-yantra': 349,
  'vastu-kuber-dhan-prapti-yantra': 349,
  'vastu-laxmi-siddha-yantra': 349,
  'vastu-shani-siddha-yantra': 349,
  'vastu-crystal-glass-yantra': 1590,
  'vastu-brass-pyramid-multitier': 399,
  'vastu-crystal-glass-turtle': 349,
  'brass-kamdhenu-cow-statue': 2490,
  'brass-ganesh-ji-statue': 2290,
  'brass-radha-krishna-statue': 2890,
  'vastu-crystal-glass-shivling': 370,

  // Malas
  'mandir-rudraksh-mala': 699,
  'mandir-sphatik-mala': 1699,
  'mandir-tulsi-mala': 250,
  'mandir-vaijanti-mala': 250,
  'mandir-karungali-mala': 250,
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

  // Copper Kalash variants
  'copper-kalash-pooja-vessel-64g(Small/DailyPooja)': 790,
  'copper-kalash-pooja-vessel-240g(Large/Sthapana&Ceremonies)': 1490,

  // Kamdhenu variants
  'brass-kamdhenu-cow-statue-Compact(7×3×5cm-70G)': 1490,
  'brass-kamdhenu-cow-statue-Medium(450G-5Inch)': 2490,
  'brass-kamdhenu-cow-statue-RoyalLarge(850G-7Inch)': 3890,

  // Incense variants
  'incense-no-bamboo-50SticksPack': 149,
  'incense-no-bamboo-80SticksPack': 219,
  'incense-no-bamboo-100SticksPack': 269,

  'incense-with-bamboo-50SticksPack': 129,
  'incense-with-bamboo-80SticksPack': 189,
  'incense-with-bamboo-100SticksPack': 229,

  'dhoop-cones-12ConesTrialPack': 99,
  'dhoop-cones-24ConesSmallPack': 179,
  'dhoop-cones-40ConesTwinPack(80Cones)': 299,
  'dhoop-cones-50ConesRetailPack': 349,
  'dhoop-cones-100ConesValueBox': 599,
  'dhoop-cones-200ConesFamilyTinBox': 999,

  'dhoop-sticks-20SticksPack': 119,
  'dhoop-sticks-50SticksPack': 249,
  'dhoop-sticks-100SticksValueBox': 449,
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

module.exports = {
  catalog,
  variantPrices,
  getProductPrice,
  calculateCartSubtotal,
};
