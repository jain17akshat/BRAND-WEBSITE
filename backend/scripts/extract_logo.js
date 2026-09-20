const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractLogo() {
  const srcPath = 'C:/Users/jain7/.gemini/antigravity-ide/brain/a18b6b6b-49df-46e5-a8dc-a6a704c44661/media__1789893601784.png';
  const destDir = path.join(__dirname, '../assets');
  const destPath = path.join(destDir, 'shraviko_logo.png');
  const defaultLogoPath = path.join(destDir, 'logo.png');

  if (!fs.existsSync(srcPath)) {
    console.error('Source image not found at', srcPath);
    return;
  }

  const meta = await sharp(srcPath).metadata();
  console.log(`Dimensions: ${meta.width} x ${meta.height}`);

  // In the reference image (width ~890, height ~1260), top-left logo is in top-left region
  const cropLeft = Math.round(meta.width * 0.045);
  const cropTop = Math.round(meta.height * 0.015);
  const cropWidth = Math.round(meta.width * 0.43);
  const cropHeight = Math.round(meta.height * 0.105);

  await sharp(srcPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .toFile(destPath);

  fs.copyFileSync(destPath, defaultLogoPath);

  console.log('✅ SHRAVIKO logo extracted successfully to:', destPath);
}

extractLogo().catch(err => console.error('Logo extraction failed:', err));
