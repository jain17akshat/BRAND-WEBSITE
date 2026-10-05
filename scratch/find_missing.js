const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Load Excel
const excelPath = path.join(__dirname, '..', 'S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls');
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Filter out description row (row 0 if it's header explanation)
const excelProducts = rawData.filter(row => row['Product Title'] && row['Product Title'] !== 'Title of your product as on Flipkart.com');

// Load Website Products from products.js safely
const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

// Extract products using regex/ast or object matching
// First, extract text between 'export const PRODUCTS = [' and 'export const FRAGRANCE_SAMPLERS ='
let mainProductsText = productsJsContent.substring(
  productsJsContent.indexOf('export const PRODUCTS = [') + 'export const PRODUCTS = ['.length,
  productsJsContent.indexOf('export const FRAGRANCE_SAMPLERS =')
).trim();

// Remove trailing ];
if (mainProductsText.endsWith('];')) {
  mainProductsText = mainProductsText.slice(0, -2).trim();
}

// Also check trailing products after TESTIMONIALS (kumkum and loban)
const trailingProductsText = productsJsContent.substring(
  productsJsContent.indexOf('// Pure Roli Kumkum Powder')
).replace('];', '').trim();

let websiteProducts = [];
try {
  const code = `
    const PRODUCTS = [ ${mainProductsText} , ${trailingProductsText} ];
    return PRODUCTS;
  `;
  websiteProducts = new Function(code)();
} catch (e) {
  console.error("Error evaluating PRODUCTS array:", e);
}

console.log(`=== Excel Products Count: ${excelProducts.length} ===`);
console.log(`=== Website Products Count: ${websiteProducts.length} ===`);

// Clean/normalize string helper
function cleanString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/shraviko/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getKeywords(str) {
  const words = cleanString(str).split(' ').filter(w => w.length > 2);
  return new Set(words);
}

const matchResults = [];

excelProducts.forEach((eProd, idx) => {
  const eTitle = eProd['Product Title'] || '';
  const eSku = eProd['Seller SKU Id'] || '';
  const eClean = cleanString(eTitle);
  const eWords = getKeywords(eTitle);

  let bestMatch = null;
  let bestScore = 0;
  let matchType = 'NONE';
  let matchedDetails = '';

  websiteProducts.forEach(wProd => {
    const wName = wProd.name || '';
    const wId = String(wProd.id || '');
    const wClean = cleanString(wName);
    const wWords = getKeywords(wName + ' ' + (wProd.subcategory || '') + ' ' + (wProd.category || ''));

    // Check SKU match in ID or specs or name
    let isSkuMatch = false;
    if (eSku) {
      const cleanSku = eSku.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanId = wId.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanId.includes(cleanSku) || cleanSku.includes(cleanId)) {
        isSkuMatch = true;
      }
    }

    // Check word overlap score
    let overlapCount = 0;
    eWords.forEach(w => {
      if (wWords.has(w) || wClean.includes(w)) overlapCount++;
    });
    const score = eWords.size > 0 ? overlapCount / eWords.size : 0;

    // Check exact title clean inclusion
    const isSubstring = eClean.length > 5 && wClean.length > 5 && (eClean.includes(wClean) || wClean.includes(eClean));

    if (isSkuMatch) {
      if (bestScore < 0.95) {
        bestScore = 0.95;
        bestMatch = wProd;
        matchType = 'EXACT_SKU';
      }
    } else if (isSubstring && score > 0.4) {
      if (score + 0.3 > bestScore) {
        bestScore = Math.min(1.0, score + 0.3);
        bestMatch = wProd;
        matchType = 'SUBSTRING';
      }
    } else if (score > bestScore) {
      bestScore = score;
      bestMatch = wProd;
      matchType = score >= 0.45 ? 'FUZZY' : 'LOW';
    }
  });

  const isMatched = bestScore >= 0.45;

  matchResults.push({
    excelIndex: idx + 1,
    sku: eSku,
    title: eTitle,
    subCategory: eProd['Sub-category'],
    status: eProd['Listing Status'],
    mrp: eProd['MRP'],
    sellingPrice: eProd['Your Selling Price'],
    matchedProduct: isMatched ? bestMatch : null,
    matchScore: bestScore,
    matchType: isMatched ? matchType : 'NONE',
    closestCandidate: bestMatch
  });
});

const matched = matchResults.filter(r => r.matchType !== 'NONE');
const missing = matchResults.filter(r => r.matchType === 'NONE');

console.log("\n=============================================");
console.log(`SUMMARY:`);
console.log(`Total Products in Excel Sheet: ${excelProducts.length}`);
console.log(`Products PRESENT on Website: ${matched.length}`);
console.log(`Products NOT PRESENT on Website: ${missing.length}`);
console.log("=============================================\n");

fs.writeFileSync(path.join(__dirname, 'match_report.json'), JSON.stringify(matchResults, null, 2));

console.log("--- PRODUCTS NOT FOUND ON WEBSITE ---");
missing.forEach((m, i) => {
  console.log(`\n${i + 1}. SKU: ${m.sku}`);
  console.log(`   Title: ${m.title}`);
  console.log(`   Sub-Category: ${m.subCategory}`);
  console.log(`   Status: ${m.status} | Price: ₹${m.sellingPrice} (MRP: ₹${m.mrp})`);
  if (m.closestCandidate && m.matchScore > 0.25) {
    console.log(`   Closest Match on Web (Score: ${(m.matchScore * 100).toFixed(0)}%): [ID: ${m.closestCandidate.id}] ${m.closestCandidate.name}`);
  } else {
    console.log(`   Closest Match on Web: None`);
  }
});
