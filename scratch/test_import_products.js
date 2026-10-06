const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// Replace export const with global assignments
content = content.replace(/^export const /gm, 'globalThis.');

try {
  eval(content);
  console.log('PRODUCTS Array Length:', globalThis.PRODUCTS.length);
  console.log('CATEGORIES Array Length:', globalThis.CATEGORIES.length);

  const incenseProds = globalThis.PRODUCTS.filter(p => p.category === 'incense');
  console.log('\n--- INCENSE PRODUCTS (' + incenseProds.length + ') ---');
  incenseProds.forEach(p => console.log(`- [${p.id}] ${p.name}`));

  const brassProds = globalThis.PRODUCTS.filter(p => p.category === 'brass');
  console.log('\n--- BRASS PRODUCTS (' + brassProds.length + ') ---');
  brassProds.forEach(p => console.log(`- [${p.id}] ${p.name}`));

} catch (e) {
  console.error('EVAL ERROR:', e);
}
