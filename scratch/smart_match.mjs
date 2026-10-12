import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));

// Let's create smart matching rules based on product keywords and categories
const results = [];

for (const c of csvProducts) {
  const cTitle = c.title.toLowerCase();
  const cSku = c.sku.toLowerCase();
  
  // Find candidates among website products
  let candidates = PRODUCTS.map(p => {
    let score = 0;
    const pName = p.name.toLowerCase();
    const pId = p.id.toLowerCase();
    const pDesc = (p.shortDescription || '').toLowerCase();
    
    // Check specific keyword combinations
    if (cSku.includes('tulsi') || cTitle.includes('tulsi')) {
      if (pId.includes('tulsi')) score += 50;
    }
    if (cSku.includes('rudraksh') || cTitle.includes('rudraksha')) {
      if (pId.includes('rudraksh')) score += 50;
    }
    if (cTitle.includes('sphatik')) {
      if (pId.includes('sphatik')) score += 50;
    }
    if (cTitle.includes('karungali') || cTitle.includes('ebony')) {
      if (pId.includes('karungali')) score += 50;
    }
    if (cTitle.includes('vaijanti')) {
      if (pId.includes('vaijanti')) score += 50;
    }
    if (cTitle.includes('bheemseni') || cTitle.includes('kapoor') || cTitle.includes('camphor')) {
      if (pId.includes('kapoor') || pId.includes('camphor')) score += 50;
    }
    if (cTitle.includes('samidha')) {
      if (pId.includes('samidha')) score += 50;
    }
    if (cTitle.includes('hawan samagri') || cTitle.includes('havan samagri')) {
      if (pId.includes('hawan-samagri')) score += 50;
    }
    if (cTitle.includes('cow dung') || cTitle.includes('gobar')) {
      if (pId.includes('cow-dung')) score += 50;
    }
    if (cTitle.includes('sindoor') || cTitle.includes('chola')) {
      if (pId.includes('sindoor')) score += 50;
    }
    if (cTitle.includes('lal chandan') || cTitle.includes('rakta')) {
      if (pId.includes('lal-chandan')) score += 50;
    }
    if (cTitle.includes('safed chandan') || (cTitle.includes('chandan') && cTitle.includes('tika'))) {
      if (pId.includes('safed-chandan')) score += 40;
    }
    if (cTitle.includes('dhoop dani') || cTitle.includes('loban')) {
      if (pId.includes('dhoopdani') || pId.includes('dhoop-dani')) score += 50;
    }
    if (cTitle.includes('garuda') || cTitle.includes('garud')) {
      if (pId.includes('garuda') || pId.includes('garud')) score += 50;
    }
    if (cTitle.includes('nandi')) {
      if (pId.includes('nandi')) score += 50;
    }
    if (cTitle.includes('mayur') || cTitle.includes('peacock')) {
      if (pId.includes('mayur') || pId.includes('peacock')) score += 50;
    }
    if (cTitle.includes('vilakku') || cTitle.includes('kerala')) {
      if (pId.includes('vilakku') || pId.includes('kerala') || pId.includes('samai')) score += 40;
    }
    if (cTitle.includes('kansa') || cTitle.includes('bronze')) {
      if (pId.includes('kansa') || pId.includes('bell')) score += 30;
    }
    if (cTitle.includes('panchpatra') || cTitle.includes('pali')) {
      if (pId.includes('panchpatra')) score += 50;
    }
    if (cTitle.includes('hawan kund') || cTitle.includes('pyre')) {
      if (pId.includes('hawan-kund')) score += 50;
    }
    if (cTitle.includes('kalash') || cTitle.includes('lota')) {
      if (pId.includes('kalash')) score += 50;
      if (cTitle.includes('copper') && pId.includes('copper')) score += 20;
      if (cTitle.includes('brass') && pId.includes('brass')) score += 20;
    }
    if (cTitle.includes('kamdhenu') || cTitle.includes('cow')) {
      if (pId.includes('kamdhenu')) score += 50;
    }
    if (cTitle.includes('singhasan') || cTitle.includes('throne')) {
      if (pId.includes('singhasan')) score += 50;
    }
    if (cTitle.includes('chowki') || cTitle.includes('bajot')) {
      if (pId.includes('chowki')) score += 50;
    }
    if (cTitle.includes('shree yantra') || cTitle.includes('sri yantra')) {
      if (pId.includes('shree-yantra') || pId.includes('shri-yantra')) score += 50;
    }
    if (cTitle.includes('kuber')) {
      if (pId.includes('kuber')) score += 50;
    }
    if (cTitle.includes('laxmi') || cTitle.includes('lakshmi')) {
      if (pId.includes('laxmi') || pId.includes('lakshmi')) score += 40;
    }
    if (cTitle.includes('ganesh') || cTitle.includes('ganpati')) {
      if (pId.includes('ganesh')) score += 50;
    }
    if (cTitle.includes('shani')) {
      if (pId.includes('shani')) score += 50;
    }
    if (cTitle.includes('turtle') || cTitle.includes('kurma') || cTitle.includes('tortoise')) {
      if (pId.includes('turtle')) score += 50;
    }
    if (cTitle.includes('pyramid')) {
      if (pId.includes('pyramid')) score += 50;
    }
    if (cTitle.includes('shivling') || cTitle.includes('lingam')) {
      if (pId.includes('shivling')) score += 50;
    }
    if (cTitle.includes('damru')) {
      if (pId.includes('damru')) score += 50;
    }
    if (cTitle.includes('incense stand') || cTitle.includes('tower')) {
      if (pId.includes('holder') || pId.includes('stand') || pId.includes('tower')) score += 40;
    }
    if (cTitle.includes('mogra')) {
      if (pId.includes('mogra')) score += 50;
    }
    if (cTitle.includes('rose') || cTitle.includes('gulab')) {
      if (pId.includes('rose') || pId.includes('gulab')) score += 50;
    }
    if (cTitle.includes('lavender')) {
      if (pId.includes('lavender')) score += 50;
    }
    if (cTitle.includes('sandalwood') || (cTitle.includes('chandan') && cTitle.includes('incense'))) {
      if (pId.includes('sandalwood') || pId.includes('chandan-incense')) score += 50;
    }
    if (cTitle.includes('oudh') || cTitle.includes('oud')) {
      if (pId.includes('oudh') || pId.includes('oud')) score += 50;
    }
    if (cTitle.includes('bakhoor')) {
      if (pId.includes('bakhoor')) score += 50;
    }
    if (cTitle.includes('musk') || cTitle.includes('kasturi')) {
      if (pId.includes('musk')) score += 50;
    }

    return { product: p, score };
  });

  candidates.sort((a, b) => b.score - a.score);
  results.push({
    csv: c,
    topMatch: candidates[0]
  });
}

fs.writeFileSync('scratch/smart_matches.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Done smart matching.');
