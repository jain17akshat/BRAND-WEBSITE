const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, '..', 'frontend', 'public');
const items = fs.readdirSync(pubDir);
console.log('Public folder items:', items);

items.forEach(item => {
  const fullPath = path.join(pubDir, item);
  if (fs.statSync(fullPath).isDirectory()) {
    console.log(`Directory: ${item}`, fs.readdirSync(fullPath).slice(0, 10));
  }
});
