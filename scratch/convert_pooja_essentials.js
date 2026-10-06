const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const pubDir = path.join(__dirname, '../frontend/public');

const phonePng = path.join(pubDir, 'Pooja esentials.png');
const desktopPng = path.join(pubDir, 'pooja essentials.png');

console.log('Checking existence of files:');
console.log('Phone PNG:', fs.existsSync(phonePng) ? 'FOUND' : 'NOT FOUND', phonePng);
console.log('Desktop PNG:', fs.existsSync(desktopPng) ? 'FOUND' : 'NOT FOUND', desktopPng);

async function convert() {
  if (fs.existsSync(phonePng)) {
    const phoneWebp = path.join(pubDir, 'Pooja esentials.webp');
    await sharp(phonePng)
      .webp({ quality: 82 })
      .toFile(phoneWebp);
    console.log('Converted Phone PNG to WebP:', phoneWebp, '(' + (fs.statSync(phoneWebp).size / 1024).toFixed(1) + ' KB)');
  }

  if (fs.existsSync(desktopPng)) {
    const desktopWebp = path.join(pubDir, 'pooja essentials.webp');
    await sharp(desktopPng)
      .webp({ quality: 82 })
      .toFile(desktopWebp);
    console.log('Converted Desktop PNG to WebP:', desktopWebp, '(' + (fs.statSync(desktopWebp).size / 1024).toFixed(1) + ' KB)');
  }
}

convert().catch(err => console.error('Error during conversion:', err));
