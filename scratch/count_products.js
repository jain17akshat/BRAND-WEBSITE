const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

const matches = (content.match(/id:\s*['"]([^'"]+)['"]/g) || []).map(m => m.replace(/id:\s*['"]([^'"]+)['"]/, '$1'));
console.log('Total product IDs count:', matches.length);
console.log('Last 30 Product IDs:\n', matches.slice(-30));
