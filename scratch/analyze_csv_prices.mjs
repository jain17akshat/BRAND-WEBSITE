import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';
import catalogModule from '../backend/data/catalog.js';

const { catalog, variantPrices } = catalogModule;

// Simple CSV parser for quoted fields
function parseCSV(text) {
  const lines = text.split('\r\n').join('\n').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let insideQuote = false;
    let field = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
}

const csvRaw = fs.readFileSync('manage_products_data (5).csv', 'utf8');
const rows = parseCSV(csvRaw);
const header = rows[0];
const dataRows = rows.slice(1);

console.log('Total rows in CSV:', dataRows.length);

const parsedProducts = [];
for (const r of dataRows) {
  const [sku, asin, title, status, lastChanged, currentPriceStr, buyBoxPriceStr, inventory, fees] = r;
  const cleanPrice = currentPriceStr ? parseFloat(currentPriceStr.replace(/,/g, '')) : null;
  parsedProducts.push({
    sku,
    asin,
    title,
    status,
    currentPrice: cleanPrice,
    rawPrice: currentPriceStr,
  });
}

console.log('Sample parsed row:', parsedProducts[0]);

// Output all CSV products
fs.writeFileSync('scratch/csv_parsed.json', JSON.stringify(parsedProducts, null, 2), 'utf8');
