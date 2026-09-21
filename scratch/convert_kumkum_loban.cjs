'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertAssets() {
  const kumkumDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'KumKum');
  const lobanDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'Loban');

  for (const dir of [kumkumDir, lobanDir]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f.endsWith('.png')) {
        const src = path.join(dir, f);
        const webpName = f.replace(/\.png$/i, '.webp').replace(/\s+/g, '');
        const dest = path.join(dir, webpName);
        console.log(`Converting ${f} -> ${webpName}`);
        await sharp(src).webp({ quality: 88, effort: 4 }).toFile(dest);

        // Standard WebP name like KumKum1.webp
        const baseName = webpName.replace(/\.webp$/, '');
        const variants = [400, 800, 1200];
        for (const w of variants) {
          const varDest = path.join(dir, `${baseName}-${w}w.webp`);
          await sharp(src)
            .resize(w, null, { fit: 'contain', withoutEnlargement: true })
            .webp({ quality: 85, effort: 4 })
            .toFile(varDest);
        }
      }
    }
  }
  console.log('✅ Kumkum & Loban assets successfully converted to WebP & responsive variants.');
}

convertAssets().catch(console.error);
