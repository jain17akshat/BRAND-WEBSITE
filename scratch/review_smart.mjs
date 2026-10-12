import fs from 'fs';

const results = JSON.parse(fs.readFileSync('scratch/smart_matches.json', 'utf8'));

console.log('Total results:', results.length);

const matched = [];
const unmatched = [];

results.forEach((r, i) => {
  if (r.topMatch.score >= 30) {
    matched.push(r);
  } else {
    unmatched.push(r);
  }
});

console.log(`Matched with score >= 30: ${matched.length}`);
console.log(`Unmatched / Low score: ${unmatched.length}`);

console.log('\n--- UNMATCHED / LOW SCORE ITEMS ---');
unmatched.forEach(u => {
  console.log(`SKU: ${u.csv.sku} | Price: ₹${u.csv.currentPrice} | Title: "${u.csv.title}"`);
  console.log(`  Top candidate: ${u.topMatch.product.id} (${u.topMatch.product.name}) [Score: ${u.topMatch.score}]`);
});
