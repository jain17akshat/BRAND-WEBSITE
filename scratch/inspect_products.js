const fs = require('fs');
const path = require('path');

const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
if (!match) {
  console.error('Could not find PRODUCTS array');
  process.exit(1);
}

const products = eval(match[1]);
console.log(`Total products in products.js: ${products.length}`);

products.forEach((p, idx) => {
  const name = p.name || p.title || 'UNKNOWN';
  console.log(`${idx + 1}. ID: ${p.id} | Name: ${name} | Category: ${p.category} | HSN: ${p.hsn || 'NOT_SET'} | Tax: ${p.taxRate || p.tax || 'NOT_SET'}`);
});
