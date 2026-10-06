const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');
content = content.replace(/export const/g, 'const');
const fn = new Function(content + '; return { PRODUCTS };');
const { PRODUCTS } = fn();

const targetProducts = PRODUCTS.filter(p =>
  p.name.toLowerCase().includes('dhoop dani') ||
  p.name.toLowerCase().includes('bhog thali') ||
  p.name.toLowerCase().includes('akhand jyot') ||
  p.id.includes('dhoop-dani') ||
  p.id.includes('bhog-thali') ||
  p.id.includes('akhand-jyot')
);

console.log('Target products count:', targetProducts.length);
targetProducts.forEach(p => {
  console.log(`- ID: ${p.id}`);
  console.log(`  Name: ${p.name}`);
  console.log(`  Category: ${p.category} (${p.categoryName})`);
  console.log(`  Image: ${p.image}`);
});
