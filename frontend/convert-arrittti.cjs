'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convert() {
  const src = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.png');
  const destWebp = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.webp');
  
  if (!fs.existsSync(src)) {
    console.error(`Source file not found: ${src}`);
    return;
  }

  const origSize = (fs.statSync(src).size / 1024).toFixed(0);
  await sharp(src).webp({ quality: 85, effort: 4 }).toFile(destWebp);
  const newSize = (fs.statSync(destWebp).size / 1024).toFixed(0);
  
  console.log(`✅ Converted arrittti1.png -> arrittti1.webp (${origSize} KB -> ${newSize} KB)`);
}

convert().catch(console.error);
