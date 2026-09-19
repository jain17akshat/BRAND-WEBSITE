const fs = require('fs');
const content = fs.readFileSync('./frontend/src/data/products.js', 'utf8');
const match = content.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
const products = eval(match[1]);
const fields = products.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sku: p.sku || null,
  hasSku: !!p.sku,
  weightVariants: p.weightVariants ? p.weightVariants.map(w=>w.weight) : [],
  inStock: p.inStock,
  specifications: p.specifications ? p.specifications.slice(0,3) : []
}));
fs.writeFileSync('./scratch/all_fe_products.json', JSON.stringify(fields, null, 2));
console.log('written', fields.length, 'products');
