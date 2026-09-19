const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 1. Load Master 56 Products from build_json.js
const buildJsonPath = path.join(__dirname, '../build_json.js');
const buildJsonContent = fs.readFileSync(buildJsonPath, 'utf8');

const masterList = [];
const masterSkuCounts = {};

const lines = buildJsonContent.split('\n');
let tableStarted = false;
for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.includes('|  # | Product')) {
    tableStarted = true;
    continue;
  }
  if (tableStarted && line.startsWith('|')) {
    const cols = line.split('|').map(c => c.trim().replace(/`/g, ''));
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
      
      masterSkuCounts[sku] = (masterSkuCounts[sku] || 0) + 1;
      masterList.push({ num, title, sku, hsn, rawGst, gstRate, taxCode });
    }
  }
}

// 2. Load Excel listing file (S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls)
const excelPath = path.join(__dirname, '../S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls');
const excelSkuMap = {};
if (fs.existsSync(excelPath)) {
  const wb = xlsx.readFile(excelPath);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  for (const r of rows) {
    const sku = r['Seller SKU Id'];
    if (sku) {
      excelSkuMap[sku] = {
        title: r['Product Title'],
        sku,
        hsn: String(r['Harmonized System Nomenclature - HSN'] || '').trim(),
        taxCode: String(r['Tax Code'] || '').trim()
      };
    }
  }
}

// 3. Load Backend products_tax.json
const taxJsonPath = path.join(__dirname, '../backend/data/products_tax.json');
let backendTaxMap = {};
if (fs.existsSync(taxJsonPath)) {
  backendTaxMap = JSON.parse(fs.readFileSync(taxJsonPath, 'utf8'));
}

// 4. Load Backend catalog.js
const catalogModule = require('../backend/data/catalog.js');
const catalogKeys = Object.keys(catalogModule.catalog);

// 5. Load Frontend PRODUCTS
const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

// Parse frontend PRODUCTS array
let feProducts = [];
try {
  const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
  if (match) {
    feProducts = eval(match[1]);
  }
} catch (e) {
  console.log('Error parsing frontend PRODUCTS array:', e.message);
}

// 6. Explicit mapping between Website Slug IDs and Master SKUs based on product titles & attributes
const slugToSkuMapping = {
  'brass-bell-garuda': 'SHR-GB-05IN-001',
  'brass-bell-nandi': 'SHR-BB-RND-03IN-001', // or SHR-BB-N4-05IN-001
  'brass-bell-simple': 'SHR-GHB-05IN-001',
  'brass-bell-carved': 'SHR-GHB-05IN-001', // double check
  'brass-puja-thali-set': 'SHR-BRS-THL-06',
  'brass-aarti-kapoor-diya': 'SHR-BDIYA-001',
  'brass-akhand-jyot-deepak': 'SHR-AJ-004',
  'brass-cup-jyot-diya': 'SHR-AJ-004',
  'brass-kamandal-holy-water-pot': 'SHR-BRS-KMD-105',
  'brass-trishul-with-damru': 'SHR-BR-TRI-DMR-10CM-001',
  'brass-trishul-standing-emblem': 'SHR-BR-TRI-DMR-10CM-001',
  'brass-gomukhi-shringi-abhishekam': 'SHR-BRS-KLS-LTA', // needs verification
  'brass-singhasan-deity-throne': 'SHR-GS-BR-07X05X09-1P',
  'brass-ladoo-gopal-statue': 'SHR-LGI-BR-06-1P',
  'brass-kalash-pooja-vessel': 'SHR-BRS-KLS-LTA',
  'brass-design-thali-set': 'SHR-BRS-PTH-PK',
  'copper-panchpatra-pali-set': 'SHR-PCS-SH01-70',
  'copper-puja-thali-set': 'SHR-CPT-006',
  'copper-hawan-kund-pyre': 'SHR-HK-11-001',
  'copper-kalash-pooja-vessel': 'SHR-BRS-KLS-LTA',
  'incense-no-bamboo': 'SHR-CHN6',
  'incense-with-bamboo': 'SHR-RSE-4',
  'dhoop-cones': 'SHR-CM-01',
  'dhoop-sticks': 'SHR-CM-01',
  'sambrani-cups': 'SH-G-15',
  'wooden-chowki-carved-01': 'SHR-WOD-CHW-001',
  'wooden-chowki-large-15x15': 'SHR-WCH-SQ-L-01',
  'brass-dhoopdani-burner': 'SHR-DDM-H01-GD',
  'mandir-mala-counter-brass': 'SHR-TC-COMP-WG-01',
  'mandir-pooja-box-chest': 'SHR-POO-BOX',
  'essentials-brass-chawar-whisk': null, // Website product without master SKU
  'mandir-jap-bag-gaumukhi': null,
  'mandir-royal-velvet-asan-mat': null,
  'brass-aarti-bell-ghanti': 'SHR-BB-N4-05IN-001',
  'mandir-copper-akhand-jyot': 'SHR-AJ-004',
  'vastu-ganesh-siddha-yantra': 'SHR-CGY-03IN-001',
  'vastu-kuber-dhan-prapti-yantra': 'SHR-CKY-03IN-001',
  'vastu-laxmi-siddha-yantra': 'SHR-CLY-03IN-001',
  'vastu-shani-siddha-yantra': 'SHR-CSHY-03IN-001',
  'vastu-crystal-glass-yantra': 'SHR-SYC-GL-04-1P',
  'vastu-brass-pyramid-multitier': 'SHR-BRS-PYR-3L',
  'vastu-crystal-glass-turtle': 'SHR-GLS-TUR-15',
  'brass-kamdhenu-cow-statue': null,
  'brass-ganesh-ji-statue': 'SHR-GI-BR-055-1P',
  'brass-radha-krishna-statue': 'SHR-RKI-BR-03X02X03-1P',
  'vastu-crystal-glass-shivling': 'SHR-SPH-SHL-25',
  'mandir-rudraksh-mala': 'SHR-RDM-5M-108-GMB',
  'mandir-sphatik-mala': 'SHR-SPM-108-78',
  'mandir-tulsi-mala': 'SHR-TUL-MAL',
  'mandir-vaijanti-mala': 'SHR-VJM-108-RD-36',
  'mandir-karungali-mala': 'SHR-KGM-108-08',
  'mandir-wooden-damru-shiva': 'SHR-WD-DMR-001'
};

// PERFORM DETAILED AUDIT
const reportMatched = [];
const reportMissingFromWebsite = [];
const reportMismatched = [];
const reportWebsiteOnly = [];
const reportDuplicateSkus = [];
const reportMissingTaxData = [];
const reportWrongAssociation = [];
const reportUnresolved = [];

// 1. DUPLICATE SKUs IN MASTER
for (const [sku, count] of Object.entries(masterSkuCounts)) {
  if (count > 1) {
    const dups = masterList.filter(m => m.sku === sku);
    reportDuplicateSkus.push({ sku, count, products: dups });
  }
}

// 2. UNRESOLVED FLAG
// "Treat SHR-GS-BR-07X05X09-1P / HSN 74198030 / GST_Old_12_New_5 as unresolved and flag it."
const unresolvedItem = masterList.find(m => m.sku === 'SHR-GS-BR-07X05X09-1P');
if (unresolvedItem) {
  const excelInfo = excelSkuMap['SHR-GS-BR-07X05X09-1P'];
  reportUnresolved.push({
    sku: 'SHR-GS-BR-07X05X09-1P',
    productName: unresolvedItem.title,
    hsn: unresolvedItem.hsn,
    masterGstRate: `${unresolvedItem.gstRate}%`,
    excelTaxCode: excelInfo ? excelInfo.taxCode : 'GST_Old_12_New_5',
    reason: 'Flagged as UNRESOLVED tax mapping (GST_Old_12_New_5 / 5% vs 12% discrepancy).'
  });
}

// 3. AUDIT MASTER SKUs
for (const m of masterList) {
  const { sku, title, hsn, gstRate, taxCode, rawGst } = m;
  const bTax = backendTaxMap[sku];
  const inCatalog = catalogKeys.includes(sku);
  const excelRow = excelSkuMap[sku];

  // Find website product using this SKU
  const feProduct = feProducts.find(p => p.sku === sku || slugToSkuMapping[p.id] === sku);

  // Check if SKU is missing tax data on website
  if (feProduct) {
    const missing = [];
    if (!feProduct.sku) missing.push('SKU (website product uses slug ID without SKU property)');
    if (!feProduct.hsn) missing.push('HSN (missing on frontend product object)');
    if (feProduct.gst_rate === undefined) missing.push('GST Rate (missing on frontend product object)');
    
    reportMissingTaxData.push({
      websiteId: feProduct.id,
      websiteName: feProduct.name,
      mappedSku: sku,
      missingFields: missing
    });
  }

  // Evaluate Reconciliation Status for SKU
  let mismatches = [];

  if (excelRow) {
    if (excelRow.hsn && excelRow.hsn !== hsn) {
      mismatches.push(`HSN mismatch: Master (${hsn}) vs Flipkart Excel (${excelRow.hsn})`);
    }
    if (excelRow.taxCode && !excelRow.taxCode.includes(String(gstRate)) && !excelRow.taxCode.includes('Old')) {
      mismatches.push(`Tax Code mismatch: Master (${taxCode}) vs Flipkart Excel (${excelRow.taxCode})`);
    }
  }

  if (bTax) {
    if (String(bTax.hsn) !== String(hsn)) {
      mismatches.push(`HSN mismatch: Master (${hsn}) vs Backend JSON (${bTax.hsn})`);
    }
    if (parseFloat(bTax.tax) !== gstRate) {
      mismatches.push(`GST Rate mismatch: Master (${gstRate}%) vs Backend JSON (${bTax.tax}%)`);
    }
  } else {
    mismatches.push(`SKU missing from backend products_tax.json`);
  }

  // Check if SKU exists on Website/Backend Catalog
  if (!inCatalog && !feProduct) {
    reportMissingFromWebsite.push({
      sku,
      productName: title,
      hsn,
      gstRate: `${gstRate}%`,
      taxCode
    });
  } else if (mismatches.length > 0) {
    reportMismatched.push({
      sku,
      productName: title,
      masterHsn: hsn,
      masterGst: `${gstRate}%`,
      backendData: bTax || 'Not in backend JSON',
      excelData: excelRow ? { hsn: excelRow.hsn, taxCode: excelRow.taxCode } : 'Not in Excel',
      discrepancies: mismatches
    });
  } else {
    reportMatched.push({
      sku,
      productName: title,
      hsn,
      gstRate: `${gstRate}%`,
      taxCode
    });
  }
}

// 4. WEBSITE-ONLY PRODUCTS
for (const p of feProducts) {
  const mappedSku = slugToSkuMapping[p.id];
  if (!mappedSku) {
    reportWebsiteOnly.push({
      websiteId: p.id,
      productName: p.name,
      price: p.price,
      reason: 'Website product has no corresponding SKU in Master (56 products)'
    });
  }
}

// 5. WRONG PRODUCT-SKU ASSOCIATION AUDIT
// Compare product titles between Master SKU and Website Product Name
for (const p of feProducts) {
  const mappedSku = slugToSkuMapping[p.id];
  if (mappedSku) {
    const masterItem = masterList.find(m => m.sku === mappedSku);
    if (masterItem) {
      // Compare keywords in title
      const masterNameClean = masterItem.title.toLowerCase();
      const feNameClean = p.name.toLowerCase();
      
      // Check if completely different product types (e.g. Bell vs Lota vs Thali)
      const keywords = ['bell', 'thali', 'diya', 'kalash', 'yantra', 'mala', 'incense', 'chowki', 'damru', 'pyramid', 'turtle', 'idol', 'statue', 'box'];
      const masterKeywords = keywords.filter(k => masterNameClean.includes(k));
      const feKeywords = keywords.filter(k => feNameClean.includes(k));
      
      const hasOverlap = masterKeywords.some(k => feKeywords.includes(k));
      if (!hasOverlap && masterKeywords.length > 0 && feKeywords.length > 0) {
        reportWrongAssociation.push({
          websiteId: p.id,
          websiteName: p.name,
          mappedSku,
          masterProductName: masterItem.title,
          issue: `Website product "${p.name}" mapped to SKU "${mappedSku}" (${masterItem.title}) with different product type!`
        });
      }
    }
  }
}

const auditOutput = {
  totalMasterProducts: masterList.length,
  matchedCount: reportMatched.length,
  missingFromWebsiteCount: reportMissingFromWebsite.length,
  mismatchedCount: reportMismatched.length,
  websiteOnlyCount: reportWebsiteOnly.length,
  duplicateSkusCount: reportDuplicateSkus.length,
  missingTaxDataCount: reportMissingTaxData.length,
  wrongAssociationCount: reportWrongAssociation.length,
  unresolvedCount: reportUnresolved.length,
  reportMatched,
  reportMissingFromWebsite,
  reportMismatched,
  reportWebsiteOnly,
  reportDuplicateSkus,
  reportMissingTaxData,
  reportWrongAssociation,
  reportUnresolved
};

fs.writeFileSync(path.join(__dirname, 'reconciliation_full_results.json'), JSON.stringify(auditOutput, null, 2));
console.log('✅ Reconciliation Deep Audit completed successfully!');
console.log(JSON.stringify({
  totalMasterProducts: masterList.length,
  matched: reportMatched.length,
  missingFromWebsite: reportMissingFromWebsite.length,
  mismatched: reportMismatched.length,
  websiteOnly: reportWebsiteOnly.length,
  duplicateSkus: reportDuplicateSkus.length,
  missingTaxData: reportMissingTaxData.length,
  wrongAssociation: reportWrongAssociation.length,
  unresolved: reportUnresolved.length
}, null, 2));
