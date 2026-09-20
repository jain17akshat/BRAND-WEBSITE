'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fixPadding() {
  const srcPath = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.png');
  const webpPath = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.webp');

  const meta = await sharp(srcPath).metadata();
  console.log(`Original size: ${meta.width}x${meta.height}`);

  // Get corner pixel color or extend with background
  // Extract a small 10x10 patch from top-left corner to get background color
  const cornerStats = await sharp(srcPath)
    .extract({ left: 0, top: 0, width: 10, height: 10 })
    .stats();

  const r = Math.round(cornerStats.channels[0].mean);
  const g = Math.round(cornerStats.channels[1].mean);
  const b = Math.round(cornerStats.channels[2].mean);
  const bgColor = { r, g, b, alpha: 1 };
  console.log(`Background color detected: rgb(${r}, ${g}, ${b})`);

  // Scale down original image to ~84% and extend borders by 8% on all sides
  const innerW = Math.round(meta.width * 0.84);
  const innerH = Math.round(meta.height * 0.84);
  const padTopBottom = Math.round((meta.height - innerH) / 2);
  const padLeftRight = Math.round((meta.width - innerW) / 2);

  const resizedBuffer = await sharp(srcPath)
    .resize(innerW, innerH, { fit: 'contain', background: bgColor })
    .toBuffer();

  const paddedImage = sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 4,
      background: bgColor
    }
  }).composite([
    { input: resizedBuffer, top: padTopBottom, left: padLeftRight }
  ]);

  // Overwrite original PNG and WEBP with perfectly padded version
  await paddedImage.png().toFile(srcPath + '.tmp');
  fs.renameSync(srcPath + '.tmp', srcPath);

  await sharp(srcPath).webp({ quality: 88, effort: 4 }).toFile(webpPath);

  console.log('✅ Padded arrittti1.png & arrittti1.webp successfully with ~8% margin on all sides!');
}

fixPadding().catch(console.error);
