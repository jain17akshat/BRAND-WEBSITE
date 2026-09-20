const fs = require('fs');
const path = require('path');

const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
const feProducts = eval(match[1]);

const buildJsonPath = path.join(__dirname, '../build_json.js');
const buildJsonContent = fs.readFileSync(buildJsonPath, 'utf8');

const masterMapBySku = {};
const lines = buildJsonContent.split('\n');
let inTable = false;
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.includes('|  # | Product')) { inTable = true; continue; }
  if (inTable && trimmed.startsWith('|')) {
    const cols = line.split('|').map(c => c.trim().replace(/`/g, ''));
    if (cols.length >= 6 && !cols[1].includes('-:')) {
      const sku = cols[3];
      masterMapBySku[sku] = {
        title: cols[2],
        sku: cols[3],
        hsn: cols[4],
        rawGst: cols[5],
        gstRate: parseFloat(cols[5].replace('%', '').trim()),
        taxCode: cols[5].includes('5') ? 'GST_5' : (cols[5].includes('18') ? 'GST_18' : (cols[5].includes('3') ? 'GST_3' : cols[5]))
      };
    }
  }
}

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

const tableRows = [];

for (const p of feProducts) {
  const slug = p.id;
  const name = p.name;
  const sentSku = p.sku || 'NONE'; // What frontend currently sends
  const intendedSku = intendedSkuMap[slug];


  let status = 'SKU MISSING';
  let matchedSku = 'NONE';
  let hsn = 'N/A';
  let gstRate = 'N/A';
  let taxCode = 'N/A';
  let notes = '';

  if (intendedSku === 'SHR-GS-BR-07X05X09-1P') {
    status = 'UNRESOLVED TAX';
    matchedSku = 'SHR-GS-BR-07X05X09-1P';
    hsn = '74198030';
    gstRate = '5% / 12%';
    taxCode = 'GST_Old_12_New_5';
    notes = 'Flagged as UNRESOLVED TAX (GST_Old_12_New_5 transitional rate). Tax rate must be confirmed before production.';
  } else if (!intendedSku) {
    status = 'WEBSITE-ONLY';
    matchedSku = 'NONE';
    hsn = 'MISSING';
    gstRate = 'MISSING';
    taxCode = 'MISSING';
    notes = 'Product is not in the 56-product Master reference. Lacks SKU, HSN, and GST. Checkout fails with MISSING_TAX_DATA.';
  } else {
    status = 'SKU MISSING';
    matchedSku = 'NONE (Intended: ' + intendedSku + ')';
    hsn = masterRef ? masterRef.hsn : 'N/A';
    gstRate = masterRef ? masterRef.gstRate + '%' : 'N/A';
    taxCode = masterRef ? masterRef.taxCode : 'N/A';
    notes = `Frontend product object lacks 'sku' property. Cart sends slug '${slug}', which fails backend tax lookup in products_tax.json.`;
  }

  tableRows.push({
    slug,
    name,
    sentSku,
    matchedSku,
    hsn,
    gstRate,
    taxCode,
    status,
    notes
  });
}

fs.writeFileSync(path.join(__dirname, 'audit_table_full.json'), JSON.stringify(tableRows, null, 2));
console.log(`Generated audit table for ${tableRows.length} products.`);
