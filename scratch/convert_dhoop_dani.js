const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const folder = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'Brass dhoop dani');
const pngPath = path.join(folder, 'a3efb112-77c8-4e72-b8f3-4f8c27247174.png');
const webpPath = path.join(folder, 'a3efb112-77c8-4e72-b8f3-4f8c27247174.webp');

async function convert() {
  if (fs.existsSync(pngPath)) {
    await sharp(pngPath).toFile(webpPath);
    console.log('Converted a3efb112-77c8-4e72-b8f3-4f8c27247174.png to webp!');
  } else {
    console.log('PNG file not found, checking if WebP exists:', fs.existsSync(webpPath));
  }
}

convert();
