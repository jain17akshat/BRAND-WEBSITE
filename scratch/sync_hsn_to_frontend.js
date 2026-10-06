const fs = require('fs');
const path = require('path');

const fePath = path.join(__dirname, '../frontend/src/data/products.js');
let feContent = fs.readFileSync(fePath, 'utf8');

const reportPath = path.join(__dirname, 'master_hsn_tax_report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const reportMap = {};
report.forEach(item => {
  reportMap[item.id] = item;
});

// Match products array definition
const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
if (!match) {
  console.error('Could not find PRODUCTS in products.js');
  process.exit(1);
}

const products = eval(match[1]);

products.forEach(p => {
  const r = reportMap[p.id];
  if (r) {
    p.hsn = r.hsn;
    p.taxRate = parseFloat(r.taxRate.replace('%', ''));
    p.taxCode = r.taxCode;
  }
});

const updatedProductsStr = JSON.stringify(products, null, 2);
feContent = feContent.replace(match[1], updatedProductsStr);

fs.writeFileSync(fePath, feContent);
console.log(`Successfully synced HSN and Tax attributes into ${products.length} products in frontend/src/data/products.js`);
