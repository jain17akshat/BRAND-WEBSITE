'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetBase = path.join(__dirname, 'public', 'assets');

const targetDirs = [
  'Safed Chandan',
  'Lal Chanda',
  'Kapoor',
  'Bheemseni kapoor',
  'Cow dung',
  'Hawan Samgri'
];

async function convertDir(dirName) {
  const dirPath = path.join(assetBase, dirName);
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  console.log(`\nConverting images in: ${dirName}...`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const srcPath = path.join(dirPath, file);
      const destName = path.basename(file, ext) + '.webp';
      const destPath = path.join(dirPath, destName);

      try {
        const origSize = fs.statSync(srcPath).size / 1024;
        await sharp(srcPath).webp({ quality: 82, effort: 4 }).toFile(destPath);
        const newSize = fs.statSync(destPath).size / 1024;
        console.log(`  ✅ ${file} -> ${destName} (${origSize.toFixed(0)} KB -> ${newSize.toFixed(0)} KB)`);
      } catch (err) {
        console.error(`  ❌ Error converting ${file}: ${err.message}`);
      }
    }
  }
}

async function run() {
  for (const d of targetDirs) {
    await convertDir(d);
  }
  console.log('\n✨ All conversions finished!');
}

run();
