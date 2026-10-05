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

console.log(`=== Excel Products Count: ${excelProducts.length} ===`);

// Load Website Products from products.js
const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

// Parse PRODUCTS array from products.js
// We can extract JSON-like structure or evaluate in a VM context by converting export to module.exports
let websiteProducts = [];
try {
  const codeToRun = productsJsContent
    .replace(/export const CATEGORIES =/g, 'const CATEGORIES =')
    .replace(/export const PRODUCTS =/g, 'module.exports.PRODUCTS =')
    .replace(/export const /g, 'const ');
  
  const tempFile = path.join(__dirname, 'temp_products.js');
  fs.writeFileSync(tempFile, codeToRun, 'utf8');
  const loaded = require(tempFile);
  websiteProducts = loaded.PRODUCTS;
  fs.unlinkSync(tempFile);
} catch (e) {
  console.error("Error parsing products.js:", e);
}

console.log(`=== Website Products Count: ${websiteProducts.length} ===`);

// Clean/normalize string helper
function normalize(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log("\n--- EXCEL PRODUCTS LIST ---");
excelProducts.forEach((p, idx) => {
  console.log(`${idx + 1}. [SKU: ${p['Seller SKU Id']}] ${p['Product Title']} (Status: ${p['Listing Status']}, Sub-cat: ${p['Sub-category']})`);
});

console.log("\n--- WEBSITE PRODUCTS LIST ---");
websiteProducts.forEach((p, idx) => {
  console.log(`${idx + 1}. [ID: ${p.id}] ${p.name} (Category: ${p.category})`);
});
