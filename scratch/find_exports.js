const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const content = fs.readFileSync(productsFilePath, 'utf8');

const matches = [];
const reg = /^export const ([A-Za-z0-9_]+)\s*=/gm;
let m;
while ((m = reg.exec(content)) !== null) {
  matches.push({ name: m[1], index: m.index });
}

console.log('Exported constants in products.js:');
matches.forEach((m, idx) => {
  const nextIndex = matches[idx + 1] ? matches[idx + 1].index : content.length;
  console.log(`- ${m.name}: char ${m.index} to ${nextIndex}`);
});
