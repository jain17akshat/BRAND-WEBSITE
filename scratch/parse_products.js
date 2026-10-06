const fs = require('fs');
const path = require('path');

const fePath = path.join(__dirname, '../frontend/src/data/products.js');
const feContent = fs.readFileSync(fePath, 'utf8');

const match = feContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);[\r\n]+export/);
const products = eval(match[1]);

function getName(p) {
  if (p.name) return p.name;
  if (p.title) return p.title;
  if (p.specifications && Array.isArray(p.specifications)) {
    const prodSpec = p.specifications.find(s => s.label === 'Product' || s.label === 'Item' || s.label === 'Product Name');
    if (prodSpec) return prodSpec.value;
  }
  return p.tag ? `Shraviko ${p.tag}` : p.id;
}

const detailedList = products.map((p, index) => {
  const name = getName(p);
  const category = p.category;
  return {
    index: index + 1,
    id: p.id,
    name: name,
    category: category,
    subcategory: p.subcategory || '',
    sku: p.sku || 'N/A'
  };
});

console.log(JSON.stringify(detailedList, null, 2));
fs.writeFileSync(path.join(__dirname, 'all_products_extracted.json'), JSON.stringify(detailedList, null, 2));
