import fs from 'fs';

const matches = JSON.parse(fs.readFileSync('scratch/match_results.json', 'utf8'));

console.log('Total matches:', matches.length);

matches.forEach((m, i) => {
  console.log(`[${i+1}] SKU: ${m.csvSku} | CSV: ₹${m.csvPrice} | Web: ₹${m.matchedWebPrice} | Score: ${m.score.toFixed(2)}`);
  console.log(`     CSV Title: ${m.csvTitle.substring(0, 80)}`);
  console.log(`     Web Prod:  ${m.matchedId} (${m.matchedName})`);
  console.log('----------------------------------------------------');
});
