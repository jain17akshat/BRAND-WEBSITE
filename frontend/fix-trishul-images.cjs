'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fixTrishulImages() {
  const trishulDir = path.join(__dirname, 'public', 'assets', 'Trishul');
  if (!fs.existsSync(trishulDir)) {
    console.error('Trishul dir not found:', trishulDir);
    return;
  }

  const baseFiles = ['trishul 2.webp', 'Trishul1.webp', 'trihsul 3.webp', 'trishul 4.webp'];

  for (const file of baseFiles) {
    const srcPath = path.join(trishulDir, file);
    if (!fs.existsSync(srcPath)) {
      console.log(`Skipping missing ${file}`);
      continue;
    }

    // Read into buffer to avoid file lock
    const inputBuf = fs.readFileSync(srcPath);
    const meta = await sharp(inputBuf).metadata();
    console.log(`\nProcessing ${file} (${meta.width}x${meta.height})...`);

    // Detect background color from top-left corner
    const cornerStats = await sharp(inputBuf)
      .extract({ left: 0, top: 0, width: Math.min(15, meta.width), height: Math.min(15, meta.height) })
      .stats();

    const r = Math.round(cornerStats.channels[0].mean);
    const g = Math.round(cornerStats.channels[1].mean);
    const b = Math.round(cornerStats.channels[2].mean);
    const bgColor = { r, g, b, alpha: 1 };
    console.log(`  Bg color: rgb(${r}, ${g}, ${b})`);

    const canvasSize = Math.max(meta.width, meta.height, 1200);
    const innerSize = Math.round(canvasSize * 0.78); // 78% size -> 11% margin all around

    const resizedBuffer = await sharp(inputBuf)
      .resize(innerSize, innerSize, { fit: 'contain', background: bgColor })
      .toBuffer();

    const paddedBuffer = await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: bgColor
      }
    }).composite([
      { input: resizedBuffer, top: Math.round((canvasSize - innerSize) / 2), left: Math.round((canvasSize - innerSize) / 2) }
    ]).webp({ quality: 90, effort: 4 }).toBuffer();

    const baseName = path.basename(file, '.webp');

    // Save base file
    const baseDest = path.join(trishulDir, `${baseName}.webp`);
    fs.writeFileSync(baseDest, paddedBuffer);
    console.log(`  ✅ Saved ${baseName}.webp`);

    // Generate responsive variants: -400w, -800w, -1200w
    const sizes = [400, 800, 1200];
    for (const w of sizes) {
      const variantDest = path.join(trishulDir, `${baseName}-${w}w.webp`);
      const variantBuf = await sharp(paddedBuffer)
        .resize(w, w, { fit: 'contain', background: bgColor })
        .webp({ quality: 88, effort: 4 })
        .toBuffer();
      fs.writeFileSync(variantDest, variantBuf);
      console.log(`  ✅ Saved ${baseName}-${w}w.webp`);
    }
  }

  console.log('\n✨ All Trishul images padded and responsive variants re-generated!');
}

fixTrishulImages().catch(console.error);
