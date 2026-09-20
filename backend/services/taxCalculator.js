/**
 * services/taxCalculator.js
 * ─────────────────────────────────────────────────────────
 * Centralized Tax Calculation Engine for SHRAVIKO / SHASHWAT ENTERPRISES.
 * Single source of truth for Taxable Value, GST Rates, CGST, SGST, IGST,
 * Place of Supply, and B2B/B2C classification across checkout, invoicing,
 * returns, credit notes, and GST ledger reporting.
 */

const SELLER_STATE = 'Rajasthan';
const SELLER_STATE_CODE = '08';
const SELLER_GSTIN = '08CODPJ2489F1ZT';
const SELLER_PAN = 'CODPJ2489F';
const SELLER_TRADE_NAME = 'SHASHWAT ENTERPRISES';
const SELLER_LEGAL_NAME = 'AKSHAT JAIN';

/**
 * State to GST State Code mapping table
 */
const STATE_CODES = {
  'JAMMU AND KASHMIR': '01',
  'HIMACHAL PRADESH': '02',
  'PUNJAB': '03',
  'CHANDIGARH': '04',
  'UTTARAKHAND': '05',
  'HARYANA': '06',
  'DELHI': '07',
  'RAJASTHAN': '08',
  'UTTAR PRADESH': '09',
  'BIHAR': '10',
  'SIKKIM': '11',
  'ARUNACHAL PRADESH': '12',
  'NAGALAND': '13',
  'MANIPUR': '14',
  'MIZORAM': '15',
  'TRIPURA': '16',
  'MEGHALAYA': '17',
  'ASSAM': '18',
  'WEST BENGAL': '19',
  'JHARKHAND': '20',
  'ODISHA': '21',
  'CHHATTISGARH': '22',
  'MADHYA PRADESH': '23',
  'GUJARAT': '24',
  'DADRA AND NAGAR HAVELI AND DAMAN AND DIU': '26',
  'MAHARASHTRA': '27',
  'ANDHRA PRADESH': '28',
  'KARNATAKA': '29',
  'GOA': '30',
  'LAKSHADWEEP': '31',
  'KERALA': '32',
  'TAMIL NADU': '33',
  'PUDUCHERRY': '34',
  'ANDAMAN AND NICOBAR ISLANDS': '35',
  'TELANGANA': '36',
  'LADAKH': '37'
};

function getStateCode(stateName) {
  if (!stateName) return SELLER_STATE_CODE;
  const clean = String(stateName).trim().toUpperCase();
  return STATE_CODES[clean] || SELLER_STATE_CODE;
}

/**
 * Formats Place of Supply string (e.g. "08-Rajasthan" or "29-Karnataka")
 */
function getPlaceOfSupply(stateName) {
  const state = stateName ? String(stateName).trim() : SELLER_STATE;
  const code = getStateCode(state);
  return `${code}-${state}`;
}

/**
 * Classifies transaction as B2B or B2C
 */
function classifyB2B(customerGstin) {
  if (customerGstin && typeof customerGstin === 'string' && customerGstin.trim().length === 15) {
    return 'B2B';
  }
  return 'B2C';
}

/**
 * Calculates item-level tax breakdown
 */
function calculateItemTax({ price = 0, quantity = 1, discount = 0, gstRate = 18, customerState = '', hsn = '83061000' }) {
  const q = Math.max(1, Number(quantity) || 1);
  const unitPrice = Math.max(0, Number(price) || 0);
  const disc = Math.max(0, Number(discount) || 0);
  const rate = Math.max(0, Number(gstRate) || 0);

  const grossLine = unitPrice * q;
  const netLine = Math.max(0, grossLine - disc);

  // Inclusive GST math: Taxable = NetLine / (1 + Rate/100)
  const taxableValue = netLine / (1 + (rate / 100));
  const totalTax = netLine - taxableValue;

  const isIntraState = !customerState || String(customerState).trim().toLowerCase() === SELLER_STATE.toLowerCase();

  let cgst = 0, sgst = 0, igst = 0;
  if (isIntraState) {
    cgst = totalTax / 2;
    sgst = totalTax / 2;
  } else {
    igst = totalTax;
  }

  return {
    hsn,
    quantity: q,
    unitPrice: Number(unitPrice.toFixed(2)),
    grossLine: Number(grossLine.toFixed(2)),
    discount: Number(disc.toFixed(2)),
    netLine: Number(netLine.toFixed(2)),
    taxableValue: Number(taxableValue.toFixed(2)),
    gstRate: rate,
    totalTax: Number(totalTax.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    igst: Number(igst.toFixed(2)),
    supplyType: isIntraState ? 'INTRA_STATE' : 'INTER_STATE',
    placeOfSupply: getPlaceOfSupply(customerState),
    stateCode: getStateCode(customerState)
  };
}

/**
 * Calculates complete order tax breakdown for an array of items
 */
function calculateOrderTax(items = [], customerState = '', customerGstin = '') {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalTax = 0;
  let grandTotal = 0;

  const enrichedItems = (items || []).map((item, index) => {
    const price = item.price || item.selling_price || 0;
    const quantity = item.quantity || item.units || item.qty || 1;
    const discount = item.discount || 0;
    const gstRate = item.gst_rate !== undefined ? item.gst_rate : (item.tax !== undefined ? item.tax : 18);
    const hsn = item.hsn || item.hsn_code || '83061000';

    const calc = calculateItemTax({ price, quantity, discount, gstRate, customerState, hsn });

    subtotal += calc.grossLine;
    totalDiscount += calc.discount;
    totalTaxable += calc.taxableValue;
    totalCgst += calc.cgst;
    totalSgst += calc.sgst;
    totalIgst += calc.igst;
    totalTax += calc.totalTax;
    grandTotal += calc.netLine;

    return {
      index: index + 1,
      name: item.name || item.product || 'Sacred Item',
      title: item.title || item.name || 'Sacred Living Item',
      sku: item.sku || item.id || `SKU-ITEM-${index + 1}`,
      hsn,
      quantity,
      unit_price: calc.unitPrice,
      discount: calc.discount,
      taxable_value: calc.taxableValue,
      gst_rate: gstRate,
      cgst: calc.cgst,
      sgst: calc.sgst,
      igst: calc.igst,
      total_tax_amount: calc.totalTax,
      total_item_amount: calc.netLine
    };
  });

  const isIntraState = !customerState || String(customerState).trim().toLowerCase() === SELLER_STATE.toLowerCase();

  return {
    items: enrichedItems,
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    taxableValue: Number(totalTaxable.toFixed(2)),
    cgst: Number(totalCgst.toFixed(2)),
    sgst: Number(totalSgst.toFixed(2)),
    igst: Number(totalIgst.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    supplyType: isIntraState ? 'INTRA_STATE' : 'INTER_STATE',
    placeOfSupply: getPlaceOfSupply(customerState),
    b2bClass: classifyB2B(customerGstin),
    sellerDetails: {
      legalName: SELLER_LEGAL_NAME,
      tradeName: SELLER_TRADE_NAME,
      gstin: SELLER_GSTIN,
      pan: SELLER_PAN,
      state: SELLER_STATE,
      stateCode: SELLER_STATE_CODE
    }
  };
}

module.exports = {
  SELLER_LEGAL_NAME,
  SELLER_TRADE_NAME,
  SELLER_GSTIN,
  SELLER_PAN,
  SELLER_STATE,
  SELLER_STATE_CODE,
  getStateCode,
  getPlaceOfSupply,
  classifyB2B,
  calculateItemTax,
  calculateOrderTax
};
