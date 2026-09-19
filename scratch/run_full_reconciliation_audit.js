const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 1. Read Master Data from build_json.js and Excel file
const buildJsonPath = path.join(__dirname, '../build_json.js');
const buildJsonContent = fs.readFileSync(buildJsonPath, 'utf8');

const masterProducts = [];
const masterSkuMap = new Map();

const lines = buildJsonContent.split('\n');
let inTable = false;
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.includes('|  # | Product')) {
    inTable = true;
    continue;
  }
  if (inTable && trimmed.startsWith('|')) {
    const cols = trimmed.split('|').map(c => c.trim().replace(/`/g, ''));
    if (cols.length >= 6 && !cols[1].includes('-:')) {
      const num = parseInt(cols[1], 10);
      const title = cols[2];
      const sku = cols[3];
      const hsn = cols[4];
      const rawGst = cols[5];
      let gstRate = parseFloat(rawGst.replace('%', '').trim());
      
      let taxCode = 'GST_18';
      if (rawGst.includes('5')) taxCode = 'GST_5';
      else if (rawGst.includes('3')) taxCode = 'GST_3';
      else if (rawGst.includes('18')) taxCode = 'GST_18';
      
      const item = { num, title, sku, hsn, rawGst, gstRate, taxCode };
      masterProducts.push(item);
      
      if (!masterSkuMap.has(sku)) {
        masterSkuMap.set(sku, []);
      }
      masterSkuMap.get(sku).push(item);
    }
  }
}

// Read Excel file for additional tax code details
const excelPath = path.join(__dirname, '../S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls');
let excelSkuMap = new Map();
if (fs.existsSync(excelPath)) {
  const wb = xlsx.readFile(excelPath);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  for (const r of rows) {
    const sku = r['Seller SKU Id'];
    if (sku) {
      excelSkuMap.set(sku, {
        title: r['Product Title'],
        sku,
        hsn: String(r['Harmonized System Nomenclature - HSN'] || '').trim(),
        taxCode: String(r['Tax Code'] || '').trim()
      });
    }
  }
}

// 2. Read Backend products_tax.json
const backendTaxJsonPath = path.join(__dirname, '../backend/data/products_tax.json');
let backendTaxMap = {};
if (fs.existsSync(backendTaxJsonPath)) {
  backendTaxMap = JSON.parse(fs.readFileSync(backendTaxJsonPath, 'utf8'));
}

// 3. Read Backend catalog.js keys
const catalogModule = require('../backend/data/catalog.js');
const catalogKeys = Object.keys(catalogModule.catalog);

// 4. Read Frontend products.js
const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

// Parse frontend PRODUCTS array using Node VM or Regex
let feProducts = [];
try {
  // Extract PRODUCTS array text
  const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
  if (match) {
    // Clean text to parse as JS object
    const cleanJs = match[1];
    feProducts = eval(cleanJs);
  }
} catch (e) {
  console.log('Error parsing frontend PRODUCTS array:', e.message);
}

console.log(`\n======================================================`);
console.log(`📊 RECONCILIATION AUDIT DATA SUMMARY`);
console.log(`======================================================`);
console.log(`• Master Products Count:       ${masterProducts.length}`);
console.log(`• Excel Listing SKU Count:     ${excelSkuMap.size}`);
console.log(`• Backend products_tax Keys:   ${Object.keys(backendTaxMap).length}`);
console.log(`• Backend catalog.js Keys:    ${catalogKeys.length}`);
console.log(`• Frontend PRODUCTS Count:     ${feProducts.length}`);
console.log(`======================================================\n`);

// AUDIT CATEGORIES
const reportMatched = [];
const reportMissingFromWebsite = [];
const reportMismatched = [];
const reportWebsiteOnly = [];
const reportDuplicateSkus = [];
const reportMissingTaxData = [];
const reportWrongAssociation = [];
const reportUnresolved = [];

// Track duplicate SKUs in master
for (const [sku, list] of masterSkuMap.entries()) {
  if (list.length > 1) {
    reportDuplicateSkus.push({ sku, count: list.length, items: list });
  }
}

// Check Master SKUs against Website/Backend
for (const mItem of masterProducts) {
  const { sku, title, hsn, gstRate, taxCode, rawGst } = mItem;
  
  // Flag specific unresolved SKU requirement
  // "Treat SHR-GS-BR-07X05X09-1P / HSN 74198030 / GST_Old_12_New_5 as unresolved and flag it."
  if (sku === 'SHR-GS-BR-07X05X09-1P') {
    const excelInfo = excelSkuMap.get(sku);
    reportUnresolved.push({
      sku,
      title,
      hsn,
      masterGst: rawGst,
      excelTaxCode: excelInfo ? excelInfo.taxCode : 'GST_Old_12_New_5',
      reason: 'Flagged as unresolved GST mapping (GST_Old_12_New_5 requirement)'
    });
  }

  // Check backend products_tax.json
  const bTax = backendTaxMap[sku];
  
  // Check if SKU exists on website frontend or backend catalog
  // Search frontend PRODUCTS for item matching SKU or matching title / alias
  let feMatch = feProducts.find(p => p.sku === sku || p.id === sku);
  
  // If not matched by exact SKU, check if title or catalog alias matches
  let catalogMatch = catalogKeys.includes(sku);

  if (!bTax && !feMatch && !catalogMatch) {
    reportMissingFromWebsite.push({
      sku,
      title,
      hsn,
      gstRate,
      taxCode
    });
  } else {
    // Record exists on backend tax map or website
    let isMismatch = false;
    let mismatchReasons = [];

    if (bTax) {
      if (bTax.hsn !== hsn) {
        isMismatch = true;
        mismatchReasons.push(`HSN Mismatch: Master (${hsn}) vs Backend (${bTax.hsn})`);
      }
      if (parseFloat(bTax.tax) !== gstRate) {
        isMismatch = true;
        mismatchReasons.push(`GST Mismatch: Master (${gstRate}%) vs Backend (${bTax.tax}%)`);
      }
    } else {
      isMismatch = true;
      mismatchReasons.push(`Missing in backend products_tax.json`);
    }

    // Check if website has tax data attached (frontend products lack sku / hsn / gst)
    if (feMatch) {
      if (!feMatch.sku) {
        reportMissingTaxData.push({ sku, title, missing: ['SKU'] });
      }
      if (!feMatch.hsn) {
        reportMissingTaxData.push({ sku, title, missing: ['HSN'] });
      }
      if (feMatch.gst_rate === undefined) {
        reportMissingTaxData.push({ sku, title, missing: ['GST Rate'] });
      }
    }

    if (isMismatch) {
      reportMismatched.push({
        sku,
        title,
        masterHsn: hsn,
        masterGst: gstRate,
        backendTax: bTax,
        reasons: mismatchReasons
      });
    } else {
      reportMatched.push({
        sku,
        title,
        hsn,
        gstRate,
        taxCode
      });
    }
  }
}

// 4. Website-Only Products Audit
// Check frontend products and catalog.js keys that do not correspond to any master SKU
for (const p of feProducts) {
  const pId = p.id;
  const pSku = p.sku;
  if (pSku && !masterSkuMap.has(pSku)) {
    reportWebsiteOnly.push({ source: 'frontend', id: pId, sku: pSku, name: p.name });
  } else if (!pSku) {
    // Frontend product uses slug ID without explicit master SKU field
    // Check if any catalog key or alias maps to master SKU
    const catalogHasSku = catalogKeys.includes(pId);
    if (!catalogHasSku) {
      reportWebsiteOnly.push({ source: 'frontend (slug id without SKU mapping)', id: pId, name: p.name });
    }
  }
}

// Save Full Detailed Audit Json to scratch
const auditOutput = {
  summary: {
    totalMasterProducts: masterProducts.length,
    matchedCount: reportMatched.length,
    missingFromWebsiteCount: reportMissingFromWebsite.length,
    mismatchedCount: reportMismatched.length,
    websiteOnlyCount: reportWebsiteOnly.length,
    duplicateSkusCount: reportDuplicateSkus.length,
    missingTaxDataCount: reportMissingTaxData.length,
    unresolvedCount: reportUnresolved.length
  },
  reportMatched,
  reportMissingFromWebsite,
  reportMismatched,
  reportWebsiteOnly,
  reportDuplicateSkus,
  reportMissingTaxData,
  reportUnresolved
};

fs.writeFileSync(path.join(__dirname, 'reconciliation_audit_report.json'), JSON.stringify(auditOutput, null, 2));
console.log('✅ Reconciliation audit report generated successfully!');
