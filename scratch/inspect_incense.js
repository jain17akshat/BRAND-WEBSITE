const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

content = content.replace(/export const/g, 'const');
const fn = new Function(content + '; return { CATEGORIES, PRODUCTS };');
const { CATEGORIES, PRODUCTS } = fn();

const incenseProducts = PRODUCTS.filter(p => p.category === 'incense' || p.categoryName === 'Incense & Dhoop');
console.log('Incense products count:', incenseProducts.length);
incenseProducts.forEach(p => console.log(`- [${p.id}] ${p.name} (category: ${p.category})`));
