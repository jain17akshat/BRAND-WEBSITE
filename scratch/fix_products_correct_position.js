const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// 1. Remove // --- NEW PRODUCTS ADDED --- and everything added after it in TESTIMONIALS
if (content.includes('// --- NEW PRODUCTS ADDED ---')) {
  const markerIdx = content.indexOf('// --- NEW PRODUCTS ADDED ---');
  // Trim everything from marker to end of TESTIMONIALS, and restore TESTIMONIALS closing ];
  const beforeMarker = content.slice(0, markerIdx).trimEnd();
  // Ensure TESTIMONIALS closes with ];
  content = beforeMarker + '\n];\n';
}

// 2. Extract newProducts string from updateScript
const updateScript = fs.readFileSync(path.join(__dirname, 'update_products_js.js'), 'utf8');
const match = updateScript.match(/const newProducts = (\[[\s\S]+?\]);\n\n\/\/ Append/);
if (!match) {
  console.error('Could not extract newProducts string!');
  process.exit(1);
}
const newProductsStr = match[1].trim().slice(1, -1).trim();

// 3. Find end of PRODUCTS array (just before export const FRAGRANCE_SAMPLERS)
const fragranceIndex = content.indexOf('export const FRAGRANCE_SAMPLERS');
if (fragranceIndex === -1) {
  console.error('Could not find export const FRAGRANCE_SAMPLERS!');
  process.exit(1);
}

// Search backwards from fragranceIndex for ];
const productsEndIndex = content.lastIndexOf('];', fragranceIndex);

const beforeProductsEnd = content.slice(0, productsEndIndex).trimEnd();
const afterProductsEnd = content.slice(productsEndIndex);

const updatedContent = beforeProductsEnd + ',\n  // --- NEW PRODUCTS ADDED ---\n  ' + newProductsStr + '\n' + afterProductsEnd;

fs.writeFileSync(productsFilePath, updatedContent, 'utf8');
console.log('Successfully inserted new products into PRODUCTS array before FRAGRANCE_SAMPLERS!');
