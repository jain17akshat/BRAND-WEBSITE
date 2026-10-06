const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// Strip 'export ' to test in CommonJS Function context
content = content.replace(/export const/g, 'const');

try {
  new Function(content);
  console.log('SYNTAX CHECK PASSED! products.js is syntactically valid JS.');
} catch (e) {
  console.error('SYNTAX CHECK FAILED!', e.message);
}
