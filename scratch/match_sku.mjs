import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));

console.log('Website products count:', PRODUCTS.length);
console.log('CSV products count:', csvProducts.length);

// Count how many products have SKU in products.js
let feWithSku = 0;
PRODUCTS.forEach(p => {
  if (p.sku) feWithSku++;
});
console.log(`Website products with SKU: ${feWithSku} / ${PRODUCTS.length}`);

// Match by exact SKU
const matchedBySku = [];
const unmatchedCsv = [];

for (const cp of csvProducts) {
  const match = PRODUCTS.find(p => p.sku && p.sku.toLowerCase() === cp.sku.toLowerCase());
  if (match) {
    matchedBySku.push({
      csv: cp,
      website: match
    });
  } else {
    unmatchedCsv.push(cp);
  }
}

console.log(`Matched by SKU: ${matchedBySku.length}`);
console.log(`Unmatched CSV rows: ${unmatchedCsv.length}`);

// Print some SKU matches and unmatched examples
console.log('\n--- Sample SKU matches ---');
matchedBySku.slice(0, 5).forEach(m => {
  console.log(`SKU: ${m.csv.sku} | CSV Price: ${m.csv.currentPrice} | Web Price: ${m.website.price} | Name: ${m.website.name}`);
});

console.log('\n--- Sample Unmatched CSV ---');
unmatchedCsv.slice(0, 10).forEach(u => {
  console.log(`SKU: ${u.sku} | Price: ${u.currentPrice} | Title: ${u.title}`);
});
