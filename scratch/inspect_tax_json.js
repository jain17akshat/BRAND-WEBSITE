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

console.log('Keys in products_tax.json:', Object.keys(taxData).length);
console.log('Sample entries in products_tax.json:', Object.entries(taxData).slice(0, 10));
