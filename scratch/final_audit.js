const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = path.join(__dirname, '..', 'S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls');
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const excelProducts = rawData.filter(row => row['Product Title'] && row['Product Title'] !== 'Title of your product as on Flipkart.com');

const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

let mainProductsText = productsJsContent.substring(
  productsJsContent.indexOf('export const PRODUCTS = [') + 'export const PRODUCTS = ['.length,
  productsJsContent.indexOf('export const FRAGRANCE_SAMPLERS =')
).trim();

if (mainProductsText.endsWith('];')) {
  mainProductsText = mainProductsText.slice(0, -2).trim();
}

const trailingProductsText = productsJsContent.substring(
  productsJsContent.indexOf('// Pure Roli Kumkum Powder')
).replace('];', '').trim();

let websiteProducts = [];
try {
  const code = `
    const PRODUCTS = [ ${mainProductsText} , ${trailingProductsText} ];
    return PRODUCTS;
  `;
  websiteProducts = new Function(code)();
} catch (e) {
  console.error("Error evaluating PRODUCTS array:", e);
}

// Explicit mapping function for all Excel listings based on domain audit
function evaluateListing(row) {
  const sku = (row['Seller SKU Id'] || '').trim();
  const title = (row['Product Title'] || '').trim();
  const subcat = (row['Sub-category'] || '').trim();
  const price = row['Your Selling Price'];
  const mrp = row['MRP'];
  const status = row['Listing Status'];

  let matchedWebId = null;
  let matchedWebName = null;
  let statusReason = '';

  // Specific SKU/Title matching
  if (sku === 'SHR-SB-01') {
    statusReason = 'Kansa (Bronze) Pooja Bell 5 Inch is not in website catalog';
  } else if (sku === 'SHR-DI-001' || sku === 'SHR-DD-01') {
    statusReason = 'Brass Diya Set of 5 (2 inch / 1 inch) is not listed on website';
  } else if (sku === 'SHR-C-01') {
    statusReason = 'Small 3-inch Brass Table Diya standalone listing not on website';
  } else if (sku === 'SHR-DI-01') {
    statusReason = 'Crystal Lotus Diya is not in website catalog';
  } else if (sku === 'SHR-LA-02') {
    statusReason = 'Brass Lotus Diya Stand (5 inch) is not in website catalog';
  } else if (sku === 'SHR-SD-02' || sku === 'SHR-KD-01') {
    statusReason = 'Kerala Samai / Peacock Kutthu Vilakku Oil Lamp Stand (12/13 inch) is not on website';
  } else if (sku === 'SHR-DB-01') {
    statusReason = 'Brass Mandir Dabbi (Pooja Box 5 cm) is not in website catalog';
  } else if (sku === 'SHR-FP-1') {
    statusReason = 'Brass Laxmi Religious Footprint (Charan Paduka) is not in website catalog';
  } else if (sku === 'SHR-CSY-03IN-001') {
    statusReason = 'Copper Saraswati Yantra 3x3 is not in website catalog';
  } else if (sku === 'SHR-CNY-03IN-001') {
    statusReason = 'Copper Navgraha Yantra 3x3 is not in website catalog';
  } else if (sku === 'SHR-FC-01' || sku === 'SHR-LFC-01') {
    statusReason = 'Camphor Fly Cone Air Freshener (Sandalwood / Lavender) is not in website catalog';
  } else if (sku === 'SHR-SA-01') {
    statusReason = 'SHR-SA-01 (Raw Havan item 250g) is not listed on website';
  } else if (sku === 'SHR-HK-11-001') {
    statusReason = 'SHR-HK-11 (Bulk Hawan Kund / Item 500g) is not listed on website';
  }

  // If not explicitly missing, let's find matched website product
  if (!statusReason) {
    if (sku === 'SHR-BB-RND-03IN-001') matchedWebId = 'brass-bell-nandi';
    else if (sku === 'SHR-GB-05IN-001') matchedWebId = 'brass-bell-garuda';
    else if (sku === 'SHR-BB-N4-05IN-001' || sku === 'SHR-GHB-05IN-001') matchedWebId = 'brass-bell-simple';
    else if (sku === 'SHR-BRS-THL-06' || sku === 'SHR-BH-01') matchedWebId = 'brass-puja-thali-set';
    else if (sku === 'SHR-BRS-PTH-PK') matchedWebId = 'brass-design-thali-set';
    else if (sku === 'SHR-CPT-006') matchedWebId = 'copper-puja-thali-set';
    else if (sku === 'SHR-POO-BOX') matchedWebId = 'mandir-pooja-box-chest';
    else if (sku === 'SHR-BDIYA-001') matchedWebId = 'brass-aarti-kapoor-diya';
    else if (sku === 'SHR-AJ-004' || sku === 'SHR-AJ-01' || sku === 'SHR-CD-00') matchedWebId = 'brass-akhand-jyot-deepak';
    else if (sku === 'SHR-PCS-SH01-70') matchedWebId = 'copper-panchpatra-pali-set';
    else if (sku === 'SHR-BRS-KLS-LTA') matchedWebId = 'brass-kalash-pooja-vessel';
    else if (sku === 'SHR-BRS-KMD-105') matchedWebId = 'brass-kamandal-holy-water-pot';
    else if (sku === 'SHR-BR-TRI-DMR-10CM-001') matchedWebId = 'brass-trishul-with-damru';
    else if (sku === 'SHR-GS-BR-07X05X09-1P') matchedWebId = 'brass-singhasan-deity-throne';
    else if (sku === 'SHR-LGI-BR-06-1P') matchedWebId = 'brass-ladoo-gopal-statue';
    else if (sku === 'SHR-RKI-BR-03X02X03-1P') matchedWebId = 'brass-radha-krishna-statue';
    else if (sku === 'SHR-BRS-PYR-3L') matchedWebId = 'vastu-brass-pyramid-multitier';
    else if (sku === 'SHR-GLS-TUR-15') matchedWebId = 'vastu-crystal-glass-turtle';
    else if (sku === 'SHR-SYC-GL-04-1P') matchedWebId = 'vastu-crystal-glass-yantra';
    else if (sku === 'SHR-SPH-SHL-25') matchedWebId = 'vastu-crystal-glass-shivling';
    else if (sku === 'SHR-WCH-SQ-L-01') matchedWebId = 'wooden-chowki-large-15x15';
    else if (sku === 'SHR-WOD-CHW-001') matchedWebId = 'wooden-chowki-carved-01';
    else if (sku === 'SHR-WD-DMR-001') matchedWebId = 'mandir-wooden-damru-shiva';
    else if (sku === 'SHR-DDM-H01-GD' || sku === 'SHR-DH-01') matchedWebId = 'brass-dhoopdani-burner';
    else if (sku === 'SHR-TC-COMP-WG-01') matchedWebId = 'mandir-mala-counter-brass';
    else if (sku === 'SHR-CLY-03IN-001') matchedWebId = 'vastu-laxmi-siddha-yantra';
    else if (sku === 'SHR-CKY-03IN-001') matchedWebId = 'vastu-kuber-dhan-prapti-yantra';
    else if (sku === 'SHR-CGY-03IN-001') matchedWebId = 'vastu-ganesh-siddha-yantra';
    else if (sku === 'SHR-CSHY-03IN-001') matchedWebId = 'vastu-shani-siddha-yantra';
    else if (sku === 'SHR-YAN-MMR-001') matchedWebId = 'yantra-maha-mrityunjay';
    else if (sku === 'SHR-KSY-01') matchedWebId = 'yantra-kaal-sarp';
    else if (sku === 'SHR-YAN-MNG-001') matchedWebId = 'yantra-mangal';
    else if (sku === 'SHR-BAG-001') matchedWebId = 'yantra-baglamukhi';
    else if (sku === 'SHR-NMY-COP-003') matchedWebId = 'yantra-sarv-karya';
    else if (sku === 'SHR-TUL-MAL') matchedWebId = 'mandir-tulsi-mala';
    else if (sku === 'SHR-KGM-108-08') matchedWebId = 'mandir-karungali-mala';
    else if (sku === 'SHR-SPM-108-78') matchedWebId = 'mandir-sphatik-mala';
    else if (sku === 'SHR-RDM-5M-108-GMB') matchedWebId = 'mandir-rudraksh-mala';
    else if (sku === 'SHR-VJM-108-RD-36') matchedWebId = 'mandir-vaijanti-mala';
    else if (sku === 'SH-G-15') matchedWebId = 'sambrani-cups';
    else if (sku === 'SHR-CH-01' || sku === 'SHR-RO-1') matchedWebId = 'dhoop-cones';
    else if (sku === 'SHR-CM-01') matchedWebId = 'mandir-pure-loban';
    else if (sku === 'SH-KU-01') matchedWebId = 'mandir-pure-kumkum';
    else if (sku === 'SH-LAL-003') matchedWebId = 'mandir-lal-chandan';
    else if (sku === 'SHR-SF-04') matchedWebId = 'mandir-safed-chandan';
    else if (sku === 'SHR-CAM-09') matchedWebId = 'mandir-pure-camphor';
    else if (sku === 'SHR-CO-99') matchedWebId = 'mandir-cow-dung-cake';
    else if (sku === 'SHR-H-01') matchedWebId = 'mandir-hawan-samagri';
    else if (sku === 'SHR-CHN6' || sku === 'SHR-LAV-01' || sku === 'SHR-KE-01') matchedWebId = 'incense-no-bamboo';
    else if (sku === 'SHR-BA-01' || sku === 'SHR-OU-01' || sku === 'SHR-RSE-4') matchedWebId = 'incense-with-bamboo';

    if (matchedWebId) {
      const found = websiteProducts.find(wp => wp.id === matchedWebId);
      if (found) {
        matchedWebName = found.name;
      }
    }
  }

  return {
    sku,
    title,
    subcat,
    price,
    mrp,
    status,
    isMissing: !matchedWebId,
    matchedWebId,
    matchedWebName,
    statusReason
  };
}

const audit = excelProducts.map(evaluateListing);
const missing = audit.filter(a => a.isMissing);
const present = audit.filter(a => !a.isMissing);

console.log("=== FINAL AUDIT RESULT ===");
console.log(`Total Excel Listings Audited: ${excelProducts.length}`);
console.log(`Listings Present on Website: ${present.length}`);
console.log(`Listings MISSING from Website: ${missing.length}`);

fs.writeFileSync(path.join(__dirname, 'final_audit.json'), JSON.stringify({
  total: excelProducts.length,
  presentCount: present.length,
  missingCount: missing.length,
  missingProducts: missing,
  presentProducts: present
}, null, 2));

console.log("\n--- MISSING PRODUCTS SUMMARY BY CATEGORY ---");
const missingBySubcat = {};
missing.forEach(m => {
  if (!missingBySubcat[m.subcat]) missingBySubcat[m.subcat] = [];
  missingBySubcat[m.subcat].push(m);
});

Object.keys(missingBySubcat).forEach(subcat => {
  console.log(`\nCategory: ${subcat} (${missingBySubcat[subcat].length} items):`);
  missingBySubcat[subcat].forEach(p => {
    console.log(`  - [SKU: ${p.sku}] ${p.title} (₹${p.price})`);
  });
});
