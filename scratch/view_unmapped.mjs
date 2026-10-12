import fs from 'fs';

const unmapped = JSON.parse(fs.readFileSync('scratch/unmapped_csv.json', 'utf8'));
unmapped.forEach((u, i) => {
  console.log(`[${i+1}] SKU: "${u.sku}" | Price: ₹${u.currentPrice} | Title: "${u.title}"`);
});
