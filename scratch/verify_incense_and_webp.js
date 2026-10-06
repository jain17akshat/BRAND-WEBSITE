const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

content = content.replace(/export const/g, 'const');
const fn = new Function(content + '; return { CATEGORIES, PRODUCTS };');
const { CATEGORIES, PRODUCTS } = fn();

const incenseCat = CATEGORIES.find(c => c.id === 'incense');
console.log('Incense Category:', incenseCat);

const incenseProducts = PRODUCTS.filter(p => p.category === 'incense');
console.log('Total Incense Products:', incenseProducts.length);
console.log('Incense products coming soon count:', incenseProducts.filter(p => p.isComingSoon).length);

const pngProducts = PRODUCTS.filter(p => p.image && (p.image.includes('.png') || p.image.includes('.jpg')));
console.log('Products still having .png or .jpg image:', pngProducts.length);

console.log('\n--- All Product Categories Summary ---');
CATEGORIES.forEach(c => {
  const count = PRODUCTS.filter(p => p.category === c.id || (c.id === 'all')).length;
  console.log(`${c.id}: ${c.name} -> ${count} products in PRODUCTS array`);
});
