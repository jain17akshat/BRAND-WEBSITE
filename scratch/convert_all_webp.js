const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'assets');

async function convertPngsInFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const pngs = files.filter(f => f.toLowerCase().endsWith('.png'));
  let converted = 0;

  for (const png of pngs) {
    const baseName = png.replace(/\.png$/i, '');
    const webpPath = path.join(folderPath, baseName + '.webp');
    
    // Skip if webp already exists
    if (fs.existsSync(webpPath)) continue;

    const srcPath = path.join(folderPath, png);
    try {
      await sharp(srcPath)
        .webp({ quality: 82 })
        .toFile(webpPath);
      converted++;
      console.log(`  ✓ ${png} → ${baseName}.webp`);
    } catch (err) {
      console.error(`  ✗ Failed: ${png} - ${err.message}`);
    }
  }
  return converted;
}

async function main() {
  const folders = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalConverted = 0;

  for (const folder of folders) {
    const folderPath = path.join(ASSETS_DIR, folder);
    const files = fs.readdirSync(folderPath);
    const pngs = files.filter(f => f.toLowerCase().endsWith('.png'));
    const existingWebps = files.filter(f => f.toLowerCase().endsWith('.webp'));

    // Check which PNGs don't have a corresponding webp
    const needsConversion = pngs.filter(png => {
      const base = png.replace(/\.png$/i, '');
      return !existingWebps.some(w => w.replace(/\.webp$/i, '') === base);
    });

    if (needsConversion.length > 0) {
      console.log(`\n[${folder}] Converting ${needsConversion.length} PNGs...`);
      const count = await convertPngsInFolder(folderPath);
      totalConverted += count;
    }
  }

  console.log(`\n=== DONE: Converted ${totalConverted} images to WebP ===`);
}

main().catch(console.error);
