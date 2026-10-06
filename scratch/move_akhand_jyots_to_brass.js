const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

const idsToMove = [
  'shraviko-diamond-akhand-jyot',
  'shraviko-crystal-glass-akhand-jyot',
  'shraviko-lotus-brass-akhand-jyot',
  'shraviko-om-top-glass-akhand-jyot'
];

idsToMove.forEach(id => {
  const idPos = content.indexOf(`id: '${id}'`);
  if (idPos !== -1) {
    const endPos = content.indexOf('}', idPos);
    let block = content.slice(idPos, endPos);
    block = block.replace("category: 'mandir-essentials'", "category: 'brass'");
    block = block.replace("categoryName: 'Mandir Essentials'", "categoryName: 'Brass Articles'");
    content = content.slice(0, idPos) + block + content.slice(endPos);
  }
});

fs.writeFileSync(productsFilePath, content, 'utf8');
console.log('Successfully updated categories for all 4 Akhand Jyot products to Brass Articles!');
