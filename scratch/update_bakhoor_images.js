const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

const pPos = content.indexOf("id: 'shraviko-bakhoor-incense-sticks'");
if (pPos !== -1) {
  const endPos = content.indexOf('}', pPos);
  let block = content.slice(pPos, endPos);
  
  block = block.replace(/image:\s*['"][^'"]+['"]/, "image: '/assets/Bakhoor sticks/Bakhoor4.webp'");
  block = block.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      '/assets/Bakhoor sticks/Bakhoor4.webp',\n      '/assets/Bakhoor sticks/Bakhoor 1.webp',\n      '/assets/Bakhoor sticks/Bakhoor2.webp',\n      '/assets/Bakhoor sticks/Bakhoor3.webp',\n      '/assets/Bakhoor sticks/Bakhoor5.webp'\n    ]`);
  
  content = content.slice(0, pPos) + block + content.slice(endPos);
  fs.writeFileSync(productsFilePath, content, 'utf8');
  console.log('Successfully updated Bakhoor incense sticks images!');
} else {
  console.error('Could not find shraviko-bakhoor-incense-sticks in products.js');
}
