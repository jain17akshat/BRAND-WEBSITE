import fs from 'fs';
import { PRODUCTS } from '../frontend/src/data/products.js';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));

// Print all 91 products on website
const websiteList = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.originalPrice,
  weightVariants: p.weightVariants
}));

fs.writeFileSync('scratch/website_products.json', JSON.stringify(websiteList, null, 2), 'utf8');
console.log('Saved website_products.json. Total:', websiteList.length);
