/**
 * convert-images.cjs
 * Run from: E:\Brand website\frontend
 *   node convert-images.cjs
 *
 * sharp is installed here (frontend/node_modules), so it resolves normally.
 * Paths are relative to frontend/ — going up one level to find public/ assets.
 */

'use strict';

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('\n❌ sharp not found. Run:  npm install sharp --save-dev\n');
  process.exit(1);
}

// All image paths relative to frontend/ directory
const TARGET_IMAGES = [
  // Hero poster images (LCP candidates — highest priority)
  { src: 'public/desktopvideo.jpeg', quality: 85 },
  { src: 'public/mobilevideo.png',   quality: 85 },

  // Hero slideshow images
  { src: 'public/assets/Pooja.png',            quality: 82 },
  { src: 'public/assets/Poojamobile.png',      quality: 82 },
  { src: 'public/assets/Candel.png',           quality: 82 },
  { src: 'public/assets/Candelmobile.png',     quality: 82 },
  { src: 'public/assets/Calm.png',             quality: 82 },
  { src: 'public/assets/Calmmobile.png',       quality: 82 },
  { src: 'public/assets/HERO1.png',            quality: 82 },
  { src: 'public/assets/HERO1MOBILEVIEW.png',  quality: 82 },
  { src: 'public/assets/HERO2.png',            quality: 82 },
  { src: 'public/assets/HERO2MBOILE.png',      quality: 82 },
  { src: 'public/assets/HERO3.png',            quality: 82 },
  { src: 'public/assets/HERO3MOBILE.png',      quality: 82 },
  { src: 'public/assets/HERO4.png',            quality: 82 },
  { src: 'public/assets/HERO4MOBILE.png',      quality: 82 },
  { src: 'public/assets/HERO5.png',            quality: 82 },
  { src: 'public/assets/HERO8.png',            quality: 82 },
  { src: 'public/assets/Hero6.png',            quality: 82 },

  // Category cover images
  { src: 'public/METALWARE.png',                 quality: 82 },
  { src: 'public/Metalwaremobile.png',           quality: 82 },
  { src: 'public/brasshero.png',                 quality: 82 },
  { src: 'public/brassmobileview.png',           quality: 82 },
  { src: 'public/copperhero.png',                quality: 82 },
  { src: 'public/coppermobileview.png',          quality: 82 },
  { src: 'public/copperatepcview.png',           quality: 82 },
  { src: 'public/copperatemobileview.png',       quality: 82 },
  { src: 'public/mandiressentials.png',          quality: 82 },
  { src: 'public/mandirphone view.png',          quality: 82 },
  { src: 'public/mandiressentialmobileview.png', quality: 82 },
  { src: 'public/assets/brasscover.png',         quality: 82 },
  { src: 'public/assets/Copper cover.png',       quality: 82 },
  { src: 'public/assets/Incense cover.jpg',      quality: 82 },
  { src: 'public/assets/handcrafted cover.jpg',  quality: 82 },

  // Launch / banner
  { src: 'public/assets/Launch2.png',       quality: 80 },
  { src: 'public/assets/Launch2mobile.png', quality: 80 },
  { src: 'public/assets/Launchmobile.png',  quality: 80 },
  { src: 'public/assets/launch3.png',       quality: 80 },

  // Energy stones / incense / essentials / bracelet
  { src: 'public/energystones mobile view.png', quality: 82 },
  { src: 'public/incesne hero.png',             quality: 82 },
  { src: 'public/incenemobile hero.png',        quality: 82 },
  { src: 'public/essentialhero.png',            quality: 82 },
  { src: 'public/braclet desktopview.png',      quality: 82 },
];

function sizeKB(p) {
  try { return fs.statSync(p).size / 1024; }
  catch { return 0; }
}

async function main() {
  const base = __dirname; // frontend/

  console.log('\n🔄  SHRAVIKO Image → WebP Conversion Pipeline\n');
  console.log('─'.repeat(68));

  let totalOrig = 0, totalWebp = 0, converted = 0, skipped = 0, failed = 0;
  const results = [];

  for (const target of TARGET_IMAGES) {
    const src = path.join(base, target.src);
    const ext = path.extname(src);
    const dest = src.slice(0, -ext.length) + '.webp';

    if (!fs.existsSync(src)) {
      console.log(`⚠️   SKIP (not found): ${target.src}`);
      skipped++;
      continue;
    }

    const origKB = sizeKB(src);

    // Skip if WebP already up to date
    if (fs.existsSync(dest)) {
      const srcMtime = fs.statSync(src).mtime;
      const destMtime = fs.statSync(dest).mtime;
      if (destMtime >= srcMtime) {
        const wkb = sizeKB(dest);
        console.log(`☑️   CACHED: ${path.basename(src)}  ${origKB.toFixed(0)} KB → ${wkb.toFixed(0)} KB`);
        totalOrig += origKB; totalWebp += wkb;
        results.push({ file: target.src, original: origKB.toFixed(0), webp: wkb.toFixed(0), status: 'cached' });
        skipped++;
        continue;
      }
    }

    try {
      await sharp(src).webp({ quality: target.quality, effort: 4 }).toFile(dest);
      const wkb = sizeKB(dest);
      const pct = (((origKB - wkb) / origKB) * 100).toFixed(0);
      console.log(`✅  ${path.basename(src)}`);
      console.log(`    ${origKB.toFixed(0)} KB  →  ${wkb.toFixed(0)} KB  (${pct}% smaller)`);
      totalOrig += origKB; totalWebp += wkb;
      results.push({ file: target.src, original: origKB.toFixed(0), webp: wkb.toFixed(0), savings: pct + '%', status: 'converted' });
      converted++;
    } catch (err) {
      console.error(`❌  FAILED: ${target.src}: ${err.message}`);
      results.push({ file: target.src, status: 'failed', error: err.message });
      failed++;
    }
  }

  const savedMB = (totalOrig - totalWebp) / 1024;
  const savedPct = totalOrig > 0 ? (((totalOrig - totalWebp) / totalOrig) * 100).toFixed(0) : 0;

  console.log('\n' + '─'.repeat(68));
  console.log('📊  SUMMARY');
  console.log('─'.repeat(68));
  console.log(`    Converted : ${converted}`);
  console.log(`    Skipped   : ${skipped}`);
  console.log(`    Failed    : ${failed}`);
  console.log(`\n    Original  : ${(totalOrig / 1024).toFixed(1)} MB`);
  console.log(`    WebP      : ${(totalWebp / 1024).toFixed(1)} MB`);
  console.log(`    Saved     : ${savedMB.toFixed(1)} MB  (${savedPct}% reduction)\n`);

  const reportPath = path.join(base, '..', 'image-optimization-results.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      results,
      summary: {
        converted, skipped, failed,
        totalOrigMB: (totalOrig / 1024).toFixed(1),
        totalWebpMB: (totalWebp / 1024).toFixed(1),
        savedMB: savedMB.toFixed(1)
      }
    }, null, 2)
  );
  console.log('📄  Results → ../image-optimization-results.json\n');
}

main().catch(console.error);
