'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fixBorderAndPadding() {
  const pngPath = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.png');
  const webpPath = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.webp');

  if (!fs.existsSync(pngPath)) {
    console.error('Source PNG file not found:', pngPath);
    return;
  }

  const img = sharp(pngPath);
  const meta = await img.metadata();
  console.log(`Input image size: ${meta.width}x${meta.height}`);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  function getPixel(x, y) {
    const idx = (y * info.width + x) * info.channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  // Check corner pixel color
  const cornerRGB = getPixel(0, 0);
  console.log(`Corner (0,0) color: RGB(${cornerRGB.join(', ')})`);

  // Detect border offset from top-left moving diagonally
  let borderOffset = 0;
  for (let p = 0; p < Math.min(meta.width, meta.height) / 4; p++) {
    const rgb = getPixel(p, p);
    // If color matches the artificial beige border (approx R:220-240, G:210-230, B:195-215)
    const isBorderColor = (rgb[0] >= 220 && rgb[0] <= 240) &&
                          (rgb[1] >= 210 && rgb[1] <= 230) &&
                          (rgb[2] >= 195 && rgb[2] <= 215);
    if (!isBorderColor) {
      borderOffset = p;
      break;
    }
  }

  console.log(`Detected artificial border offset: ${borderOffset}px`);

  let cropBox;
  if (borderOffset > 0) {
    cropBox = {
      left: borderOffset,
      top: borderOffset,
      width: meta.width - (borderOffset * 2),
      height: meta.height - (borderOffset * 2)
    };
  } else {
    cropBox = { left: 0, top: 0, width: meta.width, height: meta.height };
  }

  console.log(`Cropping to region: left=${cropBox.left}, top=${cropBox.top}, width=${cropBox.width}, height=${cropBox.height}`);

  // Create sharp instance cropped to clean photo area
  const croppedPipeline = sharp(pngPath).extract(cropBox);

  // Save clean PNG
  await croppedPipeline.clone().png({ compressionLevel: 8 }).toFile(pngPath + '.tmp');
  fs.renameSync(pngPath + '.tmp', pngPath);

  // Save clean main WEBP
  await sharp(pngPath).webp({ quality: 90, effort: 4 }).toFile(webpPath);

  console.log('✅ Overwritten main arrittti1.png and arrittti1.webp cleanly without artificial borders.');

  // Also update/regenerate responsive variants (-400w, -800w, -1200w)
  const variants = [
    { suffix: '-400w.webp', width: 400 },
    { suffix: '-800w.webp', width: 800 },
    { suffix: '-1200w.webp', width: 1200 }
  ];

  for (const variant of variants) {
    const targetWidth = Math.min(variant.width, cropBox.width);
    const variantPath = path.join(__dirname, 'public', 'assets', 'Brass aarti', `arrittti1${variant.suffix}`);

    await sharp(pngPath)
      .resize(targetWidth, null, { fit: 'contain', withoutEnlargement: true })
      .webp({ quality: 88, effort: 4 })
      .toFile(variantPath);

    console.log(`✅ Generated responsive variant: arrittti1${variant.suffix} (${targetWidth}px)`);
  }

  console.log('🎉 All arrittti1 image assets successfully processed and saved without borders!');
}

fixBorderAndPadding().catch(err => {
  console.error('Error fixing image border:', err);
  process.exit(1);
});
