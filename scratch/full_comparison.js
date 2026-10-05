const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 1. Read Excel file
const excelPath = path.join(__dirname, '..', 'S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls');
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Filter out description row
const excelProducts = rawData.filter(row => row['Product Title'] && row['Product Title'] !== 'Title of your product as on Flipkart.com');

// 2. Read Website Products
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

console.log(`Excel Count: ${excelProducts.length}, Website Count: ${websiteProducts.length}`);

// Let's create a lookup mapping for every website product by ID and key attributes
const webById = {};
websiteProducts.forEach(wp => {
  webById[wp.id] = wp;
});

// Let's inspect each Excel product and check exact match against website products
const fullReport = excelProducts.map((ep, idx) => {
  const title = (ep['Product Title'] || '').trim();
  const sku = (ep['Seller SKU Id'] || '').trim();
  const subcat = (ep['Sub-category'] || '').trim();
  const status = (ep['Listing Status'] || '').trim();
  const mrp = ep['MRP'];
  const price = ep['Your Selling Price'];

  // Manual matching logic based on exact product definition
  let matchedWebsiteId = null;
  let matchedWebsiteName = null;

  // SKU exact / partial mapping rules:
  // 1. Bells
  if (sku === 'SHR-BB-RND-03IN-001') { matchedWebsiteId = 'brass-bell-nandi'; }
  else if (sku === 'SHR-GB-05IN-001' || title.toLowerCase().includes('garuda head pooja bell')) { matchedWebsiteId = 'brass-bell-garuda'; }
  else if (sku === 'SHR-BB-N4-05IN-001') { matchedWebsiteId = 'brass-bell-round-nandi'; } // check if in web
  else if (sku === 'SHR-GHB-05IN-001') { matchedWebsiteId = 'brass-bell-simple'; }

  // 2. Diyas
  else if (sku === 'SHR-BDIYA-001' || title.toLowerCase().includes('panchmukhi aarti diya')) { matchedWebsiteId = 'brass-aarti-kapoor-diya'; }
  else if (sku === 'SHR-AJ-004' || title.toLowerCase().includes('akhand jyot diya with om')) { matchedWebsiteId = 'brass-akhand-jyot-om'; }
  else if (sku === 'SHR-DI-001' || title.toLowerCase().includes('brass diya set of 5')) { matchedWebsiteId = 'brass-diya-set-5'; }

  // 3. Yantras
  else if (sku === 'SHR-YAN-MMR-001') { matchedWebsiteId = 'vastu-mahamrityunjaya-siddha-yantra'; }
  else if (sku === 'SHR-KSY-01') { matchedWebsiteId = 'vastu-kaal-sarp-dosh-yantra'; }
  else if (sku === 'SHR-CLY-03IN-001') { matchedWebsiteId = 'vastu-laxmi-siddha-yantra'; }
  else if (sku === 'SHR-CKY-03IN-001') { matchedWebsiteId = 'vastu-laxmi-kuber-yantra'; }
  else if (sku === 'SHR-CGY-03IN-001') { matchedWebsiteId = 'vastu-ganesh-siddha-yantra'; }
  else if (sku === 'SHR-CSY-03IN-001') { matchedWebsiteId = 'vastu-saraswati-yantra'; }
  else if (sku === 'SHR-YAN-MNG-001') { matchedWebsiteId = 'vastu-mangal-yantra'; }

  // 4. Incense & Dhoop & Havan
  else if (sku === 'SH-G-15') { matchedWebsiteId = 'incense-guggul-cups'; }
  else if (sku === 'SHR-CH-01') { matchedWebsiteId = 'incense-sandalwood-cups'; }
  else if (sku === 'SHR-RO-1') { matchedWebsiteId = 'incense-rose-cups'; }
  else if (sku === 'SHR-CM-01') { matchedWebsiteId = 'mandir-pure-loban'; }
  else if (sku === 'SH-KU-01') { matchedWebsiteId = 'mandir-pure-kumkum'; }
  else if (sku === 'SH-LAL-003') { matchedWebsiteId = 'mandir-lal-chandan'; }
  else if (sku === 'SHR-SF-04') { matchedWebsiteId = 'mandir-safed-chandan'; }
  else if (sku === 'SHR-CAM-09') { matchedWebsiteId = 'mandir-pure-camphor'; }
  else if (sku === 'SHR-CO-99') { matchedWebsiteId = 'mandir-cow-dung-cakes'; }
  else if (sku === 'SHR-FC-01') { matchedWebsiteId = 'camphor-cone-sandalwood'; }
  else if (sku === 'SHR-LFC-01') { matchedWebsiteId = 'camphor-cone-lavender'; }
  else if (sku === 'SHR-DDM-H01-GD') { matchedWebsiteId = 'brass-dhoopdani-burner'; }

  // 5. Malas
  else if (sku === 'SHR-TUL-MAL') { matchedWebsiteId = 'mandir-tulsi-mala'; }
  else if (sku === 'SHR-KGM-108-08') { matchedWebsiteId = 'mandir-karungali-mala'; }
  else if (sku === 'SHR-SPM-108-78') { matchedWebsiteId = 'mandir-sphatik-mala'; }
  else if (sku === 'SHR-RDM-5M-108-GMB') { matchedWebsiteId = 'mandir-rudraksha-mala-108'; }
  else if (sku === 'SHR-TC-COMP-WG-01') { matchedWebsiteId = 'mandir-mala-counter-brass'; }

  // 6. Thalis & Vessels
  else if (sku === 'SHR-BRS-PTH-PK') { matchedWebsiteId = 'brass-peacock-pooja-thali'; }
  else if (sku === 'SHR-BRS-THL-06' || sku === 'SHR-BH-01') { matchedWebsiteId = 'brass-pooja-thali-standard'; }
  else if (sku === 'SHR-CPT-006') { matchedWebsiteId = 'copper-puja-thali-set'; }
  else if (sku === 'SHR-PCS-SH01-70') { matchedWebsiteId = 'copper-panchpatra-udharini-set'; }
  else if (sku === 'SHR-BRS-KLS-LTA') { matchedWebsiteId = 'brass-pooja-kalash-lota'; }
  else if (sku === 'SHR-BRS-KMD-105') { matchedWebsiteId = 'brass-kamandal-holy-water-pot'; }
  else if (sku === 'SHR-DB-01') { matchedWebsiteId = 'brass-mandir-dabbi'; }

  // 7. Showpieces / Chowki / Decor
  else if (sku === 'SHR-WCH-SQ-L-01') { matchedWebsiteId = 'wooden-chowki-large-15x15'; }
  else if (sku === 'SHR-RKI-BR-03X02X03-1P') { matchedWebsiteId = 'brass-radha-krishna-statue'; }
  else if (sku === 'SHR-SYC-GL-04-1P') { matchedWebsiteId = 'shree-yantra-crystal-glass-pyramid'; }
  else if (sku === 'SHR-SPH-SHL-25') { matchedWebsiteId = 'sphatik-shivling-crystal'; }
  else if (sku === 'SHR-BR-TRI-DMR-10CM-001') { matchedWebsiteId = 'brass-trishul-damru-stand'; }
  else if (sku === 'SHR-FP-1') { matchedWebsiteId = 'brass-laxmi-charan-paduka'; }

  // Fallback direct check against websiteProducts list by ID or title
  if (!matchedWebsiteId) {
    const directWeb = websiteProducts.find(wp => wp.id.toLowerCase() === sku.toLowerCase() || wp.name.toLowerCase() === title.toLowerCase());
    if (directWeb) {
      matchedWebsiteId = directWeb.id;
    }
  }

  // Validate if matchedWebsiteId actually exists in websiteProducts
  const existsInWeb = websiteProducts.find(wp => wp.id === matchedWebsiteId);
  if (existsInWeb) {
    matchedWebsiteName = existsInWeb.name;
  } else {
    matchedWebsiteId = null;
    matchedWebsiteName = null;
  }

  return {
    index: idx + 1,
    sku,
    title,
    subcat,
    status,
    mrp,
    price,
    inWebsite: !!matchedWebsiteId,
    websiteId: matchedWebsiteId,
    websiteName: matchedWebsiteName
  };
});

fs.writeFileSync(path.join(__dirname, 'full_report.json'), JSON.stringify(fullReport, null, 2));

const notInWeb = fullReport.filter(r => !r.inWebsite);
const inWeb = fullReport.filter(r => r.inWebsite);

console.log("\n=============================================");
console.log(`TOTAL EXCEL ITEMS: ${fullReport.length}`);
console.log(`MATCHED ON WEBSITE: ${inWeb.length}`);
console.log(`NOT PRESENT ON WEBSITE: ${notInWeb.length}`);
console.log("=============================================\n");

console.log("--- LIST OF PRODUCTS NOT ON WEBSITE ---");
notInWeb.forEach((r, i) => {
  console.log(`${i + 1}. [SKU: ${r.sku}] ${r.title} | Sub-cat: ${r.subcat} | Price: ₹${r.price}`);
});
