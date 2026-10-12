import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));

console.log('--- ALL 86 CSV PRODUCTS ---');
csvProducts.forEach((c, i) => {
  console.log(`[${i+1}] SKU: "${c.sku}" | Price: ₹${c.currentPrice} | Title: "${c.title}"`);
});

console.log('\n--- ALL 91 WEBSITE PRODUCTS ---');
PRODUCTS.forEach((p, i) => {
  console.log(`[${i+1}] ID: "${p.id}" | Price: ₹${p.price} | Name: "${p.name}" | ArtType: "${p.artType || ''}"`);
});
