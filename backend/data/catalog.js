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

const fs = require('fs');
const path = require('path');
let productsTaxMap = {};
try {
  productsTaxMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'products_tax.json'), 'utf8'));
} catch (err) {
  console.warn('⚠️ Could not load products_tax.json. Invoice tax calculation will fail if products are not found.', err.message);
}


const catalog = {
  'brass-bell-garuda': 715,
  'brass-bell-nandi': 715,
  'brass-bell-simple': 600,
  'brass-bell-carved': 999,
  'brass-puja-thali-set': 599,
  'brass-aarti-kapoor-diya': 449,
  'brass-akhand-jyot-deepak': 450,
  'brass-cup-jyot-diya': 500,
  'brass-singhasan-deity-throne': 699,
  'brass-ladoo-gopal-statue': 999,
  'brass-kalash-pooja-vessel': 449,
  'brass-design-thali-set': 599,
  'copper-panchpatra-pali-set': 270,
  'copper-puja-thali-set': 699,
  'copper-hawan-kund-pyre': 2350,
  'copper-kalash-pooja-vessel': 799,
  'vastu-ganesh-siddha-yantra': 380,
  'vastu-kuber-dhan-prapti-yantra': 370,
  'vastu-laxmi-siddha-yantra': 360,
  'vastu-shani-siddha-yantra': 350,
  'vastu-crystal-glass-yantra': 350,
  'vastu-brass-pyramid-multitier': 400,
  'vastu-crystal-glass-turtle': 350,
  'brass-kamdhenu-cow-statue': 649,
  'brass-ganesh-ji-statue': 549,
  'brass-radha-krishna-statue': 449,
  'vastu-crystal-glass-shivling': 450,
  'mandir-rudraksh-mala': 299,
  'mandir-sphatik-mala': 999,
  'mandir-tulsi-mala': 249,
  'mandir-vaijanti-mala': 269,
  'mandir-karungali-mala': 249,
  'mandir-lal-chandan': 220,
  'mandir-pure-camphor': 280,
  'mandir-bhimseni-kapoor': 399,
  'mandir-safed-chandan': 280,
  'wooden-chowki-carved-01': 650,
  'brass-dhoopdani-burner': 999,
  'mandir-mala-counter-brass': 269,
  'mandir-pooja-box-chest': 495,
  'mandir-wooden-damru-shiva': 278,
  'yantra-kaal-sarp': 350,
  'yantra-mangal': 360,
  'yantra-sarv-karya': 250,
  'yantra-baglamukhi': 999,
  'mandir-cow-dung-cake': 320,
  'mandir-hawan-samagri': 380,
  'yantra-maha-mrityunjay': 350,
  'mandir-pure-kumkum': 230,
  'mandir-pure-loban': 239,
  'shraviko-bakhoor-incense-sticks': 240,
  'shraviko-kesar-incense-sticks': 249,
  'shraviko-lavender-incense-sticks': 220,
  'shraviko-oudh-incense-sticks': 230,
  'shraviko-chandan-dhoop-cups': 220,
  'shraviko-guggul-dhoop-cups': 239,
  'shraviko-rose-dhoop-cups': 229,
  'shraviko-sandalwood-incense-sticks': 220,
  'shraviko-rose-incense-sticks': 220,
  'shraviko-chandan-camphor-fly-cone': 260,
  'shraviko-lavender-camphor-fly-cone': 260,
  'shraviko-brass-dhoop-dani': 988,
  'shraviko-brass-handle-dhoop': 799,
  'shraviko-brass-bhog-thali': 279,
  'shraviko-brass-puja-bell': 499,
  'shraviko-spiritual-engraved-bell': 649,
  'shraviko-brass-diya-set5': 399,
  'shraviko-carved-brass-diya': 499,
  'shraviko-brass-cup-deepak': 899,
  'shraviko-peacock-brass-stand-diya': 999,
  'shraviko-spire-brass-stand-diya': 1399,
  'shraviko-stainless-steel-dibbi': 249,
  'shraviko-brass-footprints': 249,
  'shraviko-silver-footprints': 699,
  'shraviko-diamond-akhand-jyot': 849,
  'shraviko-crystal-glass-akhand-jyot': 799,
  'shraviko-lotus-brass-akhand-jyot': 599,
  'shraviko-om-top-glass-akhand-jyot': 849,
  'shraviko-brass-glass-akhand-jyot-cover': 1899,
  'shraviko-brass-puja-dibbi': 349,
  'shraviko-mogra-incense-sticks': 249,
  'shraviko-musk-incense-sticks': 299,
  'yantra-navgraha': 350,
  'mandir-orange-sindoor': 199,
  'yantra-saraswati': 499,
  'shraviko-stainless-steel-incense-holder': 299,
  'SHR-GB-05IN-001': 715,
  'SHR-SYC-GL-04-1P': 350,
  'SHR-KA-001': 649,
  'SHR-KSY-01': 350,
  'incense-no-bamboo': 166,
  'incense-with-bamboo': 143,
  'dhoop-cones': 499,
  'dhoop-sticks': 277,
  'sambrani-cups': 221,
};

const variantPrices = {
  'incense-no-bamboo-50SticksPack': 166,
  'incense-no-bamboo-80SticksPack': 243,
  'incense-no-bamboo-100SticksPack': 299,
  'incense-with-bamboo-50SticksPack': 143,
  'incense-with-bamboo-80SticksPack': 210,
  'incense-with-bamboo-100SticksPack': 254,
  'dhoop-cones-12ConesTrialPack': 110,
  'dhoop-cones-24ConesSmallPack': 199,
  'dhoop-cones-40ConesTwinPack(80Cones)': 332,
  'dhoop-cones-50ConesRetailPack': 388,
  'dhoop-cones-100ConesValueBox': 666,
  'dhoop-cones-200ConesFamilyTinBox': 1110,
  'dhoop-sticks-20SticksPack': 132,
  'dhoop-sticks-50SticksPack': 277,
  'dhoop-sticks-100SticksValueBox': 499,
  'brass-bell-garuda-90g': 715,
  'brass-bell-nandi-90g': 715,
  'brass-bell-simple-90g': 600,
  'brass-bell-carved-90g': 999,
  'brass-puja-thali-set-6Inch(80g)': 599,
  'brass-aarti-kapoor-diya-L14cm×B12cm×H6Inch(150g)': 449,
  'brass-akhand-jyot-deepak-L13cm×B24cm×H13cm(120g)': 450,
  'brass-cup-jyot-diya-L13cm×B24cm×H13cm(120g)': 500,
  'brass-singhasan-deity-throne-L18cm×B13cm×H23cm(280g)': 699,
  'brass-ladoo-gopal-statue-L13cm×B13cm×H10cm(800g)': 999,
  'brass-kalash-pooja-vessel-Size4Inch(100g)': 449,
  'brass-design-thali-set-19×19×19cm(10g)': 599,
  'copper-panchpatra-pali-set-L10cm×B10cm×H10cm(20g)': 270,
  'copper-puja-thali-set-11Inch(360g)': 699,
  'copper-hawan-kund-pyre-L25cm×B25cm×H10cm(540g)': 2350,
  'copper-kalash-pooja-vessel-64g(Small/DailyPooja)': 499,
  'copper-kalash-pooja-vessel-240g(Large/Sthapana&Ceremonies)': 799,
  'vastu-ganesh-siddha-yantra-3×3Inches(20g)': 380,
  'vastu-kuber-dhan-prapti-yantra-3×3Inches(20g)': 370,
  'vastu-laxmi-siddha-yantra-3×3Inches(20g)': 360,
  'vastu-shani-siddha-yantra-3×3Inches(20g)': 350,
  'vastu-crystal-glass-yantra-5×4×5cm(70gMeru)': 350,
  'vastu-brass-pyramid-multitier-L10cm×B10cm×H8cm(15g)': 400,
  'vastu-crystal-glass-turtle-L35cm×B15cm×H15cm(300g)': 350,
  'brass-kamdhenu-cow-statue-Compact(7×3×5cm-70G)': 499,
  'brass-kamdhenu-cow-statue-Medium(450G-5Inch)': 649,
  'brass-kamdhenu-cow-statue-RoyalLarge(850G-7Inch)': 1299,
  'brass-ganesh-ji-statue-L8cm×B5cm×H7cm(130g)': 549,
  'brass-radha-krishna-statue-L8cm×B5cm×H8cm(130g)': 449,
  'vastu-crystal-glass-shivling-L6cm×B6cm×H6cm(90g)': 450,
  'mandir-rudraksh-mala-Length12cm(20g)': 299,
  'mandir-sphatik-mala-Length34cm(30g)': 999,
  'mandir-tulsi-mala-Length40cm(20g)': 249,
  'mandir-vaijanti-mala-Length32cm(30g)': 269,
  'mandir-karungali-mala-Length42cm(26g)': 249,
  'mandir-lal-chandan-100gPack': 220,
  'mandir-lal-chandan-250gValuePack': 299,
  'mandir-pure-camphor-100gJar': 280,
  'mandir-pure-camphor-250gJar': 389,
  'mandir-bhimseni-kapoor-100gPack': 399,
  'mandir-bhimseni-kapoor-500gPack': 959,
  'mandir-safed-chandan-100gPack': 280,
  'mandir-safed-chandan-250gValuePack': 379,
  'wooden-chowki-carved-01-L38cm×B12cm×H5cm(350g)': 650,
  'brass-dhoopdani-burner-L25cm×B12cm×H16cm(300g)': 999,
  'mandir-mala-counter-brass-L10cm×B10cm×H10cm(25g)': 269,
  'mandir-pooja-box-chest-L15cm×B15cm×H2cm(300g)': 495,
  'mandir-wooden-damru-shiva-Size5Inch(60g)': 278,
  'yantra-kaal-sarp-Standard': 350,
  'yantra-mangal-Standard': 360,
  'yantra-sarv-karya-Standard': 250,
  'yantra-baglamukhi-Standard': 999,
  'mandir-cow-dung-cake-Packof6Cakes': 320,
  'mandir-hawan-samagri-100gPack': 380,
  'mandir-hawan-samagri-250gPack': 569,
  'mandir-hawan-samagri-1kgPack': 1139,
  'yantra-maha-mrityunjay-Standard3x3InchCopperYantra': 350,
  'mandir-pure-kumkum-250gPack': 230,
  'mandir-pure-loban-100gPack': 239,
  'mandir-pure-loban-500gPack': 429,
  'mandir-pure-loban-1kgPack': 569,
  'shraviko-sandalwood-incense-sticks-Packof1Box(approx.50sticks)': 220,
  'shraviko-sandalwood-incense-sticks-Packof3Boxes(approx.150sticks)': 579,
  'shraviko-rose-incense-sticks-Packof1Box(approx.50sticks)': 220,
  'shraviko-rose-incense-sticks-Packof3Boxes(approx.150sticks)': 549,
  'shraviko-peacock-brass-stand-diya-SingleDiya(12Inch/~750g)': 999,
  'shraviko-peacock-brass-stand-diya-Pairof2Diyas(12Inch/~1.5kg)': 1839,
  'shraviko-spire-brass-stand-diya-SingleDiya(12Inch/~700g)': 1399,
  'shraviko-spire-brass-stand-diya-Pairof2Diyas(12Inch/~1.4kg)': 2569,
  'shraviko-brass-puja-dibbi-Medium(60g)': 349,
  'shraviko-mogra-incense-sticks-Packof1(100g-approx.40sticks)': 249,
  'shraviko-musk-incense-sticks-Packof1(100g-approx.40sticks)': 299,
  'yantra-navgraha-3×3Inches(HeavyCopperPlate)': 350,
  'mandir-orange-sindoor-100gJar': 199,
  'yantra-saraswati-3×3Inches(PureCopperPlate)': 499,
  'shraviko-stainless-steel-incense-holder-Standard10InchTower': 299,
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

/**
 * Validates and enriches a cart item with HSN, GST rate, and reverse-calculated taxable values.
 * Assumes the authoritative selling price is GST inclusive.
 */
function enrichCartItemWithTax(item, customerState) {
  const rawId = String(item.id || item.productId || item.sku || '').trim();
  let taxInfo = productsTaxMap[rawId];

  // Fallback 1: check item.productId
  if (!taxInfo && item.productId) {
    taxInfo = productsTaxMap[item.productId];
  }

  // Fallback 2: check item.sku
  if (!taxInfo && item.sku) {
    taxInfo = productsTaxMap[item.sku];
  }

  // Fallback 3: strip variant suffix (e.g. 'mandir-bhimseni-kapoor-100gPack' -> 'mandir-bhimseni-kapoor')
  if (!taxInfo) {
    const parts = rawId.split('-');
    while (parts.length > 1 && !taxInfo) {
      parts.pop();
      const candidate = parts.join('-');
      if (productsTaxMap[candidate]) {
        taxInfo = productsTaxMap[candidate];
        break;
      }
    }
  }

  // Some items might be explicitly tax-exempt, but for this project, all items MUST have a mapping.
  if (!taxInfo || !taxInfo.hsn || taxInfo.tax === undefined || taxInfo.tax === null) {
    throw new AppError(`Missing HSN or GST mapping for product "${item.name || rawId}". Order cannot be finalized without tax data.`, 400, 'MISSING_TAX_DATA');
  }

  // Verification step for unverified or ambiguous tax mappings (e.g. GST_Old_12_New_5 or **Verify**)
  if (typeof taxInfo.tax === 'string' && (
      taxInfo.tax.includes('Verify') || 
      taxInfo.tax.includes('GST_Old') || 
      taxInfo.tax.includes('Unresolved') ||
      isNaN(parseFloat(taxInfo.tax))
  )) {
    throw new AppError(`GST rate for product "${item.name || rawId}" requires manual verification before invoice generation. Tax Code: ${taxInfo.tax}`, 400, 'UNVERIFIED_TAX_DATA');
  }

  const authoritativePrice = getProductPrice(item); // inclusive of GST
  const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));
  const gstRatePercent = parseFloat(taxInfo.tax);

  if (isNaN(gstRatePercent)) {
    throw new AppError(`Invalid GST rate for product "${item.name || rawId}".`, 400, 'INVALID_TAX_DATA');
  }

  // Reverse calculate taxable value
  // Formula: Taxable Value = Inclusive Price / (1 + GST_Rate / 100)
  const taxableValuePerUnit = authoritativePrice / (1 + (gstRatePercent / 100));
  const totalTaxableValue = taxableValuePerUnit * qty;
  const totalItemAmount = authoritativePrice * qty; // Total inclusive
  const totalGstAmount = totalItemAmount - totalTaxableValue;

  // Determine intra-state vs inter-state
  // Seller State: Rajasthan (from GST image)
  const isIntraState = customerState && customerState.trim().toLowerCase() === 'rajasthan';

  let cgst = 0, sgst = 0, igst = 0;
  if (isIntraState) {
    cgst = totalGstAmount / 2;
    sgst = totalGstAmount / 2;
  } else {
    igst = totalGstAmount;
  }

  return {
    ...item,
    sku: rawId,
    name: taxInfo.title || item.name, // prefer master name if available
    hsn: taxInfo.hsn,
    gst_rate: gstRatePercent,
    price: authoritativePrice, // inclusive
    taxable_value: parseFloat(totalTaxableValue.toFixed(2)),
    taxable_value_per_unit: parseFloat(taxableValuePerUnit.toFixed(2)),
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    igst: parseFloat(igst.toFixed(2)),
    total_tax_amount: parseFloat(totalGstAmount.toFixed(2)),
    total_item_amount: totalItemAmount,
    quantity: qty,
    units: qty
  };
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

  // 1. Pre-validate all items before deducting any
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

  // 2. Deduct from stock registry
  for (const item of cart) {
    const rawId = String(item.id || item.productId || '').trim();
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));
    const currentStock = getAvailableStock(rawId);
    setProductStock(rawId, Math.max(0, currentStock - qty));
  }

  return true;
}

async function restoreInventoryForCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return;

  for (const item of cart) {
    const rawId = String(item.id || item.productId || '').trim();
    const qty = Math.max(1, parseInt(item.quantity || item.units || 1, 10));
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
  enrichCartItemWithTax,
};
