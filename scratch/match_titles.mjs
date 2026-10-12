import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));

// Helper to tokenize
function tokenize(str) {
  if (!str) return [];
  return str.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['shraviko', 'for', 'and', 'with', 'the', 'inch'].includes(w));
}

// Compare each CSV product to PRODUCTS
const matches = [];

for (const cp of csvProducts) {
  const cTokens = tokenize(cp.title);
  let bestScore = 0;
  let bestProd = null;

  for (const p of PRODUCTS) {
    const pTokens = tokenize(p.name + ' ' + (p.seoTitle || '') + ' ' + (p.id || ''));
    
    // Calculate overlap
    let common = 0;
    cTokens.forEach(t => {
      if (pTokens.includes(t)) common++;
    });

    const score = common / Math.max(1, Math.min(cTokens.length, pTokens.length));
    if (score > bestScore) {
      bestScore = score;
      bestProd = p;
    }
  }

  matches.push({
    csvSku: cp.sku,
    csvTitle: cp.title,
    csvPrice: cp.currentPrice,
    csvStatus: cp.status,
    matchedId: bestProd ? bestProd.id : null,
    matchedName: bestProd ? bestProd.name : null,
    matchedWebPrice: bestProd ? bestProd.price : null,
    matchedOriginalPrice: bestProd ? bestProd.originalPrice : null,
    score: bestScore
  });
}

// Sort by score
matches.sort((a, b) => b.score - a.score);

console.log('High confidence matches (score >= 0.5):', matches.filter(m => m.score >= 0.5).length);
console.log('Medium confidence matches (0.3 <= score < 0.5):', matches.filter(m => m.score >= 0.3 && m.score < 0.5).length);
console.log('Low confidence matches (score < 0.3):', matches.filter(m => m.score < 0.3).length);

fs.writeFileSync('scratch/match_results.json', JSON.stringify(matches, null, 2), 'utf8');
