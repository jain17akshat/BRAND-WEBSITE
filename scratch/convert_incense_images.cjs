const sharp = require('../frontend/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const outsideDir = path.join(__dirname, '../frontend/public/Outside images');

const images = [
  { src: path.join(outsideDir, 'incenseimagedesktop.png'),  dest: path.join(outsideDir, 'incenseimagedesktop.webp'),  quality: 82 },
  { src: path.join(outsideDir, 'incnesestickmobile.png'),   dest: path.join(outsideDir, 'incnesestickmobile.webp'),   quality: 82 },
];

(async () => {
  for (const img of images) {
    if (!fs.existsSync(img.src)) { console.log('NOT FOUND:', img.src); continue; }
    await sharp(img.src).webp({ quality: img.quality }).toFile(img.dest);
    const srcKB  = (fs.statSync(img.src).size  / 1024).toFixed(1);
    const destKB = (fs.statSync(img.dest).size / 1024).toFixed(1);
    console.log(`✅  ${path.basename(img.src)}  ${srcKB} KB  →  ${path.basename(img.dest)}  ${destKB} KB`);
  }
})();
