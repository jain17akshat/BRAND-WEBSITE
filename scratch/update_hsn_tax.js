const fs = require('fs');
const path = require('path');

const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
const feProducts = eval(match[1]);

const taxJsonPath = path.join(__dirname, '../backend/data/products_tax.json');
let taxData = {};
if (fs.existsSync(taxJsonPath)) {
  taxData = JSON.parse(fs.readFileSync(taxJsonPath, 'utf8'));
}

function getName(p) {
  if (p.name) return p.name;
  if (p.title) return p.title;
  if (p.specifications && Array.isArray(p.specifications)) {
    const prodSpec = p.specifications.find(s => s.label === 'Product' || s.label === 'Item' || s.label === 'Product Name');
    if (prodSpec) return prodSpec.value;
  }
  return p.tag ? `Shraviko ${p.tag}` : p.id;
}

const masterReport = [];

feProducts.forEach((p, idx) => {
  const id = p.id;
  const sku = p.sku;
  const name = getName(p);
  const category = p.category;
  const subcategory = p.subcategory || '';

  let hsn = '74181021'; // default brass
  let tax = 5;
  let taxCode = 'GST_5';
  let categoryLabel = 'Brass Articles';

  // Rule 1: Incense Sticks & Dhoop Cups / Cones -> HSN 33074100, Tax 5%
  if (category === 'incense' || subcategory.includes('Incense') || subcategory.includes('Dhoop') || subcategory.includes('Camphor Cones') || id.includes('incense') || id.includes('dhoop') || id.includes('sambrani') || id.includes('camphor-fly')) {
    hsn = '33074100';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Incense & Dhoop';
  }
  // Rule 2: Brass Articles -> HSN 74181021, Tax 5%
  else if (category === 'brass' || subcategory.includes('Brass') || id.includes('brass') || id.includes('bell') || id.includes('thali') || id.includes('diya') || id.includes('jyot') || id.includes('kamandal') || id.includes('trishul') || id.includes('dhoopdani') || id.includes('dhoop-dani') || id.includes('chawar') || id.includes('singhasan') || id.includes('ladoo-gopal') || id.includes('kamdhenu') || id.includes('ganesh-ji') || id.includes('radha-krishna')) {
    hsn = '74181021';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Brass Articles';
  }
  // Rule 3: Copper Articles -> HSN 74181010, Tax 5%
  else if (category === 'copper' || id.includes('copper')) {
    hsn = '74181010';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Copper Articles';
  }
  // Rule 4: Yantras (Metal Emblems) -> HSN 83062900, Tax 12%
  else if (id.includes('yantra') || subcategory.includes('Yantras')) {
    hsn = '83062900';
    tax = 12;
    taxCode = 'GST_12';
    categoryLabel = 'Vastu & Yantras';
  }
  // Rule 5: Wooden Items -> HSN 44219990, Tax 12%
  else if (id.includes('wooden') || id.includes('chowki') || id.includes('pooja-box')) {
    hsn = '44219990';
    tax = 12;
    taxCode = 'GST_12';
    categoryLabel = 'Wooden Articles';
  }
  // Rule 6: Malas -> HSN 71179090 (or 71161000 for Sphatik), Tax 5% / 3%
  else if (id.includes('mala')) {
    if (id.includes('sphatik')) {
      hsn = '71161000';
      tax = 3;
      taxCode = 'GST_3';
    } else {
      hsn = '71179090';
      tax = 5;
      taxCode = 'GST_5';
    }
    categoryLabel = 'Mandir Essentials (Malas)';
  }
  // Rule 7: Pure Camphor / Kapoor -> HSN 29142100, Tax 18%
  else if (id.includes('camphor') || id.includes('kapoor')) {
    hsn = '29142100';
    tax = 18;
    taxCode = 'GST_18';
    categoryLabel = 'Mandir Essentials (Camphor)';
  }
  // Rule 8: Glass & Crystal Articles (Turtle, Shivling, Glass Yantra) -> HSN 70189010, Tax 18%
  else if (id.includes('crystal') || id.includes('glass')) {
    hsn = '70189010';
    tax = 18;
    taxCode = 'GST_18';
    categoryLabel = 'Vastu & Crystal Articles';
  }
  // Rule 9: Sacred Shells (Shankh) -> HSN 05080010, Tax 5%
  else if (id.includes('shankh')) {
    hsn = '05080010';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Mandir Essentials (Shankh)';
  }
  // Rule 10: Hawan Samagri & Herbs -> HSN 33074900, Tax 5%
  else if (id.includes('hawan') || id.includes('kumkum') || id.includes('loban') || id.includes('chandan')) {
    hsn = '33074900';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Mandir Essentials (Pooja Ingredients)';
  }
  // Rule 11: Cow Dung Cakes -> HSN 31010099, Tax 0% / 5%
  else if (id.includes('cow-dung')) {
    hsn = '31010099';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Mandir Essentials';
  }
  // Rule 12: Stainless Steel Dibbi -> HSN 73239390, Tax 12%
  else if (id.includes('stainless-steel')) {
    hsn = '73239390';
    tax = 12;
    taxCode = 'GST_12';
    categoryLabel = 'Mandir Essentials';
  }
  // Rule 13: Silver Footprints -> HSN 71179090, Tax 12%
  else if (id.includes('silver-footprints')) {
    hsn = '71179090';
    tax = 12;
    taxCode = 'GST_12';
    categoryLabel = 'Vastu Articles';
  }
  // Rule 14: Textile Aasan & Japa Bag -> HSN 63079090, Tax 5%
  else if (id.includes('asan') || id.includes('jap-bag')) {
    hsn = '63079090';
    tax = 5;
    taxCode = 'GST_5';
    categoryLabel = 'Mandir Essentials';
  }

  // Update taxData for both product ID and SKU if present
  taxData[id] = { title: name, hsn: hsn, tax: tax };
  if (sku && sku !== 'N/A') {
    taxData[sku] = { title: name, hsn: hsn, tax: tax };
  }

  masterReport.push({
    srNo: idx + 1,
    id,
    sku: sku || 'N/A',
    name,
    categoryLabel,
    hsn,
    taxRate: `${tax}%`,
    taxCode
  });
});

// Save updated products_tax.json
fs.writeFileSync(taxJsonPath, JSON.stringify(taxData, null, 2));
console.log(`Updated backend/data/products_tax.json with ${Object.keys(taxData).length} total lookup keys.`);

// Save master report for output
fs.writeFileSync(path.join(__dirname, 'master_hsn_tax_report.json'), JSON.stringify(masterReport, null, 2));
console.log(`Generated master HSN & Tax report for ${masterReport.length} products.`);
