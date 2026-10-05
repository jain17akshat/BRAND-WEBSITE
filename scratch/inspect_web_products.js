const fs = require('fs');
const path = require('path');

const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

let mainProductsText = productsJsContent.substring(
  productsJsContent.indexOf('export const PRODUCTS = [') + 'export const PRODUCTS = ['.length,
  productsJsContent.indexOf('export const FRAGRANCE_SAMPLERS =')
).trim();

if (mainProductsText.endsWith('];')) {
  mainProductsText = mainProductsText.slice(0, -2).trim();
}

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

// Print all web product IDs and names
websiteProducts.forEach(p => {
  console.log(`- [${p.id}] ${p.name}`);
});
