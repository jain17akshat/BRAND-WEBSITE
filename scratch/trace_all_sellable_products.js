const fs = require('fs');
const path = require('path');

// Load catalog & tax map functions
const catalogModule = require('../backend/data/catalog');

// Load frontend PRODUCTS array
const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

let feProducts = [];
try {
  const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
  if (match) {
    feProducts = eval(match[1]);
  }
} catch (e) {
  console.error('Failed to parse PRODUCTS:', e.message);
  process.exit(1);
}

// Load Master 56 products from build_json.js for authoritative reference
const buildJsonPath = path.join(__dirname, '../build_json.js');
const buildJsonContent = fs.readFileSync(buildJsonPath, 'utf8');

const masterMapBySku = {};
const masterMapByTitle = {};
const lines = buildJsonContent.split('\n');
let inTable = false;
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.includes('|  # | Product')) { inTable = true; continue; }
  if (inTable && trimmed.startsWith('|')) {
    const cols = trimmed.split('|').map(c => c.trim().replace(/`/g, ''));
    if (cols.length >= 6 && !cols[1].includes('-:')) {
      const sku = cols[3];
      const item = {
        num: parseInt(cols[1], 10),
        title: cols[2],
        sku: cols[3],
        hsn: cols[4],
        rawGst: cols[5],
        gstRate: parseFloat(cols[5].replace('%', '').trim()),
        taxCode: cols[5].includes('5') ? 'GST_5' : (cols[5].includes('18') ? 'GST_18' : (cols[5].includes('3') ? 'GST_3' : cols[5]))
      };
      masterMapBySku[sku] = item;
      masterMapByTitle[cols[2].toLowerCase()] = item;
    }
  }
}

// Explicit Intended SKU Mapping for Frontend Slugs (used for auditing correctness)
const intendedSkuMap = {
  'brass-bell-garuda': 'SHR-GB-05IN-001',
  'brass-bell-nandi': 'SHR-BB-RND-03IN-001',
  'brass-bell-simple': 'SHR-GHB-05IN-001',
  'brass-bell-carved': 'SHR-GHB-05IN-001',
  'brass-puja-thali-set': 'SHR-BRS-THL-06',
  'brass-aarti-kapoor-diya': 'SHR-BDIYA-001',
  'brass-akhand-jyot-deepak': 'SHR-AJ-004',
  'brass-cup-jyot-diya': 'SHR-AJ-004',
  'brass-kamandal-holy-water-pot': 'SHR-BRS-KMD-105',
  'brass-trishul-with-damru': 'SHR-BR-TRI-DMR-10CM-001',
  'brass-trishul-standing-emblem': 'SHR-BR-TRI-DMR-10CM-001',
  'brass-gomukhi-shringi-abhishekam': 'SHR-BRS-KLS-LTA',
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
  'essentials-brass-chawar-whisk': null,
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
  'mandir-wooden-damru-shiva': 'SHR-WD-DMR-001',
  'mandir-dakshinavarti-shankh': null,
  'mandir-vamavarti-shankh': null,
  'yantra-kaal-sarp': null,
  'yantra-mangal': null,
  'yantra-sarv-karya': null,
  'yantra-baglamukhi': null
};

console.log(`Analyzing ${feProducts.length} website products...\n`);

const results = [];

for (const p of feProducts) {
  const slug = p.id;
  const name = p.name;
  const sentSku = p.sku || null; // What frontend cart actually sends (currently null for all!)
  const intendedSku = intendedSkuMap[slug] || null;
  
  // Test backend price lookup
  let priceLookupOk = false;
  let priceErr = null;
  try {
    catalogModule.getProductPrice({ id: slug, quantity: 1 });
    priceLookupOk = true;
  } catch (e) {
    priceErr = e.message;
  }

  // Test backend tax enrichment lookup
  let taxEnrichOk = false;
  let enrichedResult = null;
  let taxErr = null;
  try {
    enrichedResult = catalogModule.enrichCartItemWithTax({ id: slug, name, quantity: 1 }, 'Rajasthan');
    taxEnrichOk = true;
  } catch (e) {
    taxErr = e.message;
  }

  // Determine Exact Status
  let status = '';
  let issueNotes = '';

  const isWebsiteOnly = intendedSku === null || [
    'brass-kamdhenu-cow-statue',
    'essentials-brass-chawar-whisk',
    'mandir-jap-bag-gaumukhi',
    'mandir-royal-velvet-asan-mat',
    'mandir-dakshinavarti-shankh',
    'mandir-vamavarti-shankh',
    'yantra-kaal-sarp',
    'yantra-mangal',
    'yantra-sarv-karya',
    'yantra-baglamukhi'
  ].includes(slug);

  if (intendedSku === 'SHR-GS-BR-07X05X09-1P') {
    status = 'UNRESOLVED TAX';
    issueNotes = 'Intentionally UNRESOLVED tax mapping (GST_Old_12_New_5 transition flag). Must be resolved prior to launch.';
  } else if (isWebsiteOnly) {
    status = 'WEBSITE-ONLY';
    issueNotes = `Product has no record in 56-product Master. Backend tax lookup fails (${taxErr}). Cannot pass invoice generation safely.`;
  } else if (!sentSku) {
    // Frontend sends slug ID without explicit SKU field
    // Check if backend recognizes slug ID as tax key
    if (!taxEnrichOk) {
      status = 'SKU MISSING';
      issueNotes = `Frontend product object lacks explicit 'sku' property ('${slug}' sent to backend). Backend products_tax.json lacks key '${slug}'. Cart checkout fails with MISSING_TAX_DATA.`;
    } else {
      status = 'VERIFIED';
      issueNotes = `Successfully resolved to backend SKU ${enrichedResult?.sku}.`;
    }
  }

  const masterRef = masterMapBySku[intendedSku] || null;

  results.push({
    slug,
    name,
    sentSku: sentSku || `(none - sends '${slug}')`,
    backendSkuMatched: taxEnrichOk ? (enrichedResult?.sku || slug) : (intendedSku || 'NONE'),
    hsn: taxEnrichOk ? enrichedResult?.hsn : (masterRef?.hsn || 'N/A'),
    gstRate: taxEnrichOk ? `${enrichedResult?.gst_rate}%` : (masterRef ? `${masterRef.gstRate}%` : 'N/A'),
    taxCode: taxEnrichOk ? `GST_${enrichedResult?.gst_rate}` : (masterRef?.taxCode || 'N/A'),
    status,
    issueNotes,
    checkoutSafe: taxEnrichOk
  });
}

fs.writeFileSync(path.join(__dirname, 'sellable_mapping_audit_results.json'), JSON.stringify(results, null, 2));

// Summary Counters
const summary = {
  totalSellableProducts: feProducts.length,
  verified: results.filter(r => r.status === 'VERIFIED').length,
  skuMissing: results.filter(r => r.status === 'SKU MISSING').length,
  skuNotFound: results.filter(r => r.status === 'SKU NOT FOUND').length,
  wrongSku: results.filter(r => r.status === 'WRONG SKU').length,
  hsnGstMismatch: results.filter(r => r.status === 'HSN/GST MISMATCH').length,
  unresolvedTax: results.filter(r => r.status === 'UNRESOLVED TAX').length,
  websiteOnly: results.filter(r => r.status === 'WEBSITE-ONLY').length,
};

console.log('📊 AUDIT SUMMARY COUNTERS:');
console.log(JSON.stringify(summary, null, 2));
