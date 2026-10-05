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

// Map each Excel row to either a website product or mark as missing
const detailedComparison = excelProducts.map((row, index) => {
  const sku = (row['Seller SKU Id'] || '').trim();
  const title = (row['Product Title'] || '').trim();
  const subcat = (row['Sub-category'] || '').trim();
  const price = row['Your Selling Price'];
  const mrp = row['MRP'];
  const status = row['Listing Status'];

  let matchedId = null;

  // Direct SKU & Product Feature Map
  if (sku === 'SHR-BB-RND-03IN-001') matchedId = 'brass-bell-nandi';
  else if (sku === 'SHR-GB-05IN-001') matchedId = 'brass-bell-garuda';
  else if (sku === 'SHR-BB-N4-05IN-001' || sku === 'SHR-GHB-05IN-001') matchedId = 'brass-bell-simple';
  else if (sku === 'SHR-BRS-THL-06' || sku === 'SHR-BH-01') matchedId = 'brass-puja-thali-set';
  else if (sku === 'SHR-BRS-PTH-PK') matchedId = 'brass-design-thali-set';
  else if (sku === 'SHR-CPT-006') matchedId = 'copper-puja-thali-set';
  else if (sku === 'SHR-POO-BOX') matchedId = 'mandir-pooja-box-chest';
  else if (sku === 'SHR-BDIYA-001') matchedId = 'brass-aarti-kapoor-diya';
  else if (sku === 'SHR-AJ-004' || sku === 'SHR-AJ-01' || sku === 'SHR-CD-00' || sku === 'SHR-CD-05') matchedId = 'brass-akhand-jyot-deepak';
  else if (sku === 'SHR-PCS-SH01-70') matchedId = 'copper-panchpatra-pali-set';
  else if (sku === 'SHR-BRS-KLS-LTA') matchedId = 'brass-kalash-pooja-vessel';
  else if (sku === 'SHR-BRS-KMD-105') matchedId = 'brass-kamandal-holy-water-pot';
  else if (sku === 'SHR-BR-TRI-DMR-10CM-001') matchedId = 'brass-trishul-with-damru';
  else if (sku === 'SHR-GS-BR-07X05X09-1P') matchedId = 'brass-singhasan-deity-throne';
  else if (sku === 'SHR-LGI-BR-06-1P') matchedId = 'brass-ladoo-gopal-statue';
  else if (sku === 'SHR-RKI-BR-03X02X03-1P') matchedId = 'brass-radha-krishna-statue';
  else if (sku === 'SHR-GI-BR-055-1P') matchedId = 'brass-ganesh-ji-statue';
  else if (sku === 'SHR-BRS-PYR-3L') matchedId = 'vastu-brass-pyramid-multitier';
  else if (sku === 'SHR-GLS-TUR-15') matchedId = 'vastu-crystal-glass-turtle';
  else if (sku === 'SHR-SYC-GL-04-1P') matchedId = 'vastu-crystal-glass-yantra';
  else if (sku === 'SHR-SPH-SHL-25') matchedId = 'vastu-crystal-glass-shivling';
  else if (sku === 'SHR-WCH-SQ-L-01') matchedId = 'wooden-chowki-large-15x15';
  else if (sku === 'SHR-WOD-CHW-001') matchedId = 'wooden-chowki-carved-01';
  else if (sku === 'SHR-WD-DMR-001') matchedId = 'mandir-wooden-damru-shiva';
  else if (sku === 'SHR-DDM-H01-GD' || sku === 'SHR-DH-01' || sku === 'SHR-BD-01') matchedId = 'brass-dhoopdani-burner';
  else if (sku === 'SHR-TC-COMP-WG-01') matchedId = 'mandir-mala-counter-brass';
  else if (sku === 'SHR-CLY-03IN-001') matchedId = 'vastu-laxmi-siddha-yantra';
  else if (sku === 'SHR-CKY-03IN-001') matchedId = 'vastu-kuber-dhan-prapti-yantra';
  else if (sku === 'SHR-CGY-03IN-001') matchedId = 'vastu-ganesh-siddha-yantra';
  else if (sku === 'SHR-CSHY-03IN-001') matchedId = 'vastu-shani-siddha-yantra';
  else if (sku === 'SHR-YAN-MMR-001') matchedId = 'yantra-maha-mrityunjay';
  else if (sku === 'SHR-KSY-01') matchedId = 'yantra-kaal-sarp';
  else if (sku === 'SHR-YAN-MNG-001') matchedId = 'yantra-mangal';
  else if (sku === 'SHR-BAG-001') matchedId = 'yantra-baglamukhi';
  else if (sku === 'SHR-NMY-COP-003') matchedId = 'yantra-sarv-karya';
  else if (sku === 'SHR-TUL-MAL') matchedId = 'mandir-tulsi-mala';
  else if (sku === 'SHR-KGM-108-08') matchedId = 'mandir-karungali-mala';
  else if (sku === 'SHR-SPM-108-78') matchedId = 'mandir-sphatik-mala';
  else if (sku === 'SHR-RDM-5M-108-GMB') matchedId = 'mandir-rudraksh-mala';
  else if (sku === 'SHR-VJM-108-RD-36') matchedId = 'mandir-vaijanti-mala';
  else if (sku === 'SH-G-15') matchedId = 'sambrani-cups';
  else if (sku === 'SHR-CH-01' || sku === 'SHR-RO-1') matchedId = 'dhoop-cones';
  else if (sku === 'SHR-CM-01') matchedId = 'mandir-pure-loban';
  else if (sku === 'SH-KU-01') matchedId = 'mandir-pure-kumkum';
  else if (sku === 'SH-LAL-003') matchedId = 'mandir-lal-chandan';
  else if (sku === 'SHR-SF-04') matchedId = 'mandir-safed-chandan';
  else if (sku === 'SHR-CAM-09') matchedId = 'mandir-pure-camphor';
  else if (sku === 'SHR-CO-99') matchedId = 'mandir-cow-dung-cake';
  else if (sku === 'SHR-H-01') matchedId = 'mandir-hawan-samagri';
  else if (sku === 'SHR-CHN6' || sku === 'SHR-LAV-01' || sku === 'SHR-KE-01') matchedId = 'incense-no-bamboo';
  else if (sku === 'SHR-BA-01' || sku === 'SHR-OU-01' || sku === 'SHR-RSE-4') matchedId = 'incense-with-bamboo';

  const webProduct = websiteProducts.find(p => p.id === matchedId);

  return {
    index: index + 1,
    sku,
    title,
    subcat,
    price,
    mrp,
    status,
    isPresent: !!webProduct,
    webProduct: webProduct ? { id: webProduct.id, name: webProduct.name, category: webProduct.category } : null
  };
});

const missingListings = detailedComparison.filter(item => !item.isPresent);
const presentListings = detailedComparison.filter(item => item.isPresent);

console.log(`Audited ${detailedComparison.length} listings in Excel:`);
console.log(`- Present on Website: ${presentListings.length}`);
console.log(`- MISSING from Website: ${missingListings.length}`);

// Group missing items by product type / unique SKU for clear reporting
const uniqueMissingBySku = [];
const seenSkus = new Set();

missingListings.forEach(item => {
  if (!seenSkus.has(item.sku)) {
    seenSkus.add(item.sku);
    uniqueMissingBySku.push(item);
  }
});

console.log(`\nUnique Missing SKUs/Products Count: ${uniqueMissingBySku.length}`);

fs.writeFileSync(path.join(__dirname, 'final_comparison_report.json'), JSON.stringify({
  totalListings: detailedComparison.length,
  presentCount: presentListings.length,
  missingCount: missingListings.length,
  uniqueMissingCount: uniqueMissingBySku.length,
  uniqueMissingProducts: uniqueMissingBySku,
  allMissingListings: missingListings
}, null, 2));

console.log("\n=======================================================");
console.log("UNIQUE PRODUCTS IN EXCEL NOT FOUND ON THE WEBSITE:");
console.log("=======================================================");

uniqueMissingBySku.forEach((item, idx) => {
  console.log(`${idx + 1}. [SKU: ${item.sku}] ${item.title}`);
  console.log(`   Category: ${item.subcat} | Price: ₹${item.price} (MRP: ₹${item.mrp}) | Status: ${item.status}\n`);
});
