#!/usr/bin/env node
/**
 * convert-images.mjs
 * 
 * Converts large PNG/JPG images in frontend/public to WebP format.
 * - sharp is resolved from frontend/node_modules (installed there)
 * - Generates WebP at quality 82-85
 * - Saves alongside original (e.g. HERO1.png -> HERO1.webp)  
 * - Does NOT delete originals (safe rollback)
 * - Reports before/after sizes
 * 
 * Usage (from E:\Brand website):
 *   node convert-images.mjs
 */

import { promises as fs, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = __dirname; // E:\Brand website

// Resolve sharp from frontend/node_modules since that's where it's installed
const sharpPath = path.join(baseDir, 'frontend', 'node_modules', 'sharp', 'lib', 'index.cjs');
const sharpPathAlt = path.join(baseDir, 'frontend', 'node_modules', 'sharp', 'lib', 'index.js');

async function loadSharp() {
  // Try CJS entry point first (most reliable across node versions)
  if (existsSync(sharpPath)) {
    try {
      const { createRequire } = await import('module');
      const req = createRequire(import.meta.url);
      // Point require at frontend/node_modules
      const originalPaths = require?.resolve?.paths?.('sharp') || [];
      process.env.NODE_PATH = path.join(baseDir, 'frontend', 'node_modules');
      req.cache && Object.keys(req.cache).filter(k => k.includes('sharp')).forEach(k => delete req.cache[k]);
      return req(sharpPath);
    } catch (e) { /* fall through */ }
  }

  // Try ESM dynamic import with full path
  for (const p of [sharpPath, sharpPathAlt]) {
    if (existsSync(p)) {
      try {
        const mod = await import(pathToFileURL(p).href);
        return mod.default || mod;
      } catch (e) { /* fall through */ }
    }
  }

  // Last resort: standard import (works if node_modules is in PATH)
  try {
    const mod = await import('sharp');
    return mod.default || mod;
  } catch (e) {
    console.error('\n❌ Cannot load sharp from frontend/node_modules.');
    console.error('   Make sure you ran: cd frontend && npm install sharp --save-dev');
    console.error('   Then retry: node convert-images.mjs\n');
    process.exit(1);
  }
}

// Target list: largest/most-loaded images, sorted by impact
const TARGET_IMAGES = [
  // Hero poster images (LCP candidates — highest priority)
  { src: 'frontend/public/desktopvideo.jpeg', quality: 85 },
  { src: 'frontend/public/mobilevideo.png',   quality: 85 },

  // Hero slideshow images (2.3–2.7 MB each)
  { src: 'frontend/public/assets/Pooja.png',            quality: 82 },
  { src: 'frontend/public/assets/Poojamobile.png',      quality: 82 },
  { src: 'frontend/public/assets/Candel.png',           quality: 82 },
  { src: 'frontend/public/assets/Candelmobile.png',     quality: 82 },
  { src: 'frontend/public/assets/Calm.png',             quality: 82 },
  { src: 'frontend/public/assets/Calmmobile.png',       quality: 82 },
  { src: 'frontend/public/assets/HERO1.png',            quality: 82 },
  { src: 'frontend/public/assets/HERO1MOBILEVIEW.png',  quality: 82 },
  { src: 'frontend/public/assets/HERO2.png',            quality: 82 },
  { src: 'frontend/public/assets/HERO2MBOILE.png',      quality: 82 },
  { src: 'frontend/public/assets/HERO3.png',            quality: 82 },
  { src: 'frontend/public/assets/HERO3MOBILE.png',      quality: 82 },
  { src: 'frontend/public/assets/HERO4.png',            quality: 82 },
  { src: 'frontend/public/assets/HERO4MOBILE.png',      quality: 82 },
  { src: 'frontend/public/assets/HERO5.png',            quality: 82 },
  { src: 'frontend/public/assets/HERO8.png',            quality: 82 },
  { src: 'frontend/public/assets/Hero6.png',            quality: 82 },

  // Category cover images
  { src: 'frontend/public/METALWARE.png',                    quality: 82 },
  { src: 'frontend/public/Metalwaremobile.png',              quality: 82 },
  { src: 'frontend/public/brasshero.png',                    quality: 82 },
  { src: 'frontend/public/brassmobileview.png',              quality: 82 },
  { src: 'frontend/public/copperhero.png',                   quality: 82 },
  { src: 'frontend/public/coppermobileview.png',             quality: 82 },
  { src: 'frontend/public/copperatepcview.png',              quality: 82 },
  { src: 'frontend/public/copperatemobileview.png',          quality: 82 },
  { src: 'frontend/public/mandiressentials.png',             quality: 82 },
  { src: 'frontend/public/mandirphone view.png',             quality: 82 },
  { src: 'frontend/public/mandiressentialmobileview.png',    quality: 82 },
  { src: 'frontend/public/assets/brasscover.png',            quality: 82 },
  { src: 'frontend/public/assets/Copper cover.png',          quality: 82 },
  { src: 'frontend/public/assets/Incense cover.jpg',         quality: 82 },
  { src: 'frontend/public/assets/handcrafted cover.jpg',     quality: 82 },

  // Launch / banner
  { src: 'frontend/public/assets/Launch2.png',       quality: 80 },
  { src: 'frontend/public/assets/Launch2mobile.png', quality: 80 },
  { src: 'frontend/public/assets/Launchmobile.png',  quality: 80 },
  { src: 'frontend/public/assets/launch3.png',       quality: 80 },

  // Energy stones / incense / essential
  { src: 'frontend/public/energystones mobile view.png', quality: 82 },
  { src: 'frontend/public/incesne hero.png',             quality: 82 },
  { src: 'frontend/public/incenemobile hero.png',        quality: 82 },
  { src: 'frontend/public/essentialhero.png',            quality: 82 },
  { src: 'frontend/public/braclet desktopview.png',      quality: 82 },
];

async function sizeKB(p) {
  try { return (await fs.stat(p)).size / 1024; }
  catch { return 0; }
}

async function main() {
  console.log('\n🔄  SHRAVIKO Image → WebP Conversion Pipeline\n');
  console.log('─'.repeat(68));

  const sharp = await loadSharp();
  console.log('✅  sharp loaded from frontend/node_modules\n');

  let totalOrig = 0, totalWebp = 0, converted = 0, skipped = 0, failed = 0;
  const results = [];

  for (const target of TARGET_IMAGES) {
    const src = path.join(baseDir, target.src);
    const ext = path.extname(src);
    const dest = src.slice(0, -ext.length) + '.webp';

    // Source file must exist
    if (!existsSync(src)) {
      console.log(`⚠️   SKIP (not found): ${target.src}`);
      skipped++;
      continue;
    }

    const origKB = await sizeKB(src);

    // Skip if WebP already up to date
    if (existsSync(dest)) {
      const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)]);
      if (destStat.mtime >= srcStat.mtime) {
        const wkb = await sizeKB(dest);
        console.log(`☑️   CACHED: ${path.basename(src)}  ${origKB.toFixed(0)} KB → ${wkb.toFixed(0)} KB`);
        totalOrig += origKB; totalWebp += wkb;
        results.push({ file: target.src, original: origKB.toFixed(0), webp: wkb.toFixed(0), status: 'cached' });
        skipped++;
        continue;
      }
    }

    try {
      await sharp(src).webp({ quality: target.quality, effort: 4 }).toFile(dest);
      const wkb = await sizeKB(dest);
      const pct = (((origKB - wkb) / origKB) * 100).toFixed(0);
      console.log(`✅  ${path.basename(src)}`);
      console.log(`    ${origKB.toFixed(0)} KB  →  ${wkb.toFixed(0)} KB  (${pct}% smaller)`);
      totalOrig += origKB; totalWebp += wkb;
      results.push({ file: target.src, original: origKB.toFixed(0), webp: wkb.toFixed(0), savings: pct + '%', status: 'converted' });
      converted++;
    } catch (err) {
      console.error(`❌  FAILED: ${target.src}:`, err.message);
      results.push({ file: target.src, status: 'failed', error: err.message });
      failed++;
    }
  }

  const savedMB = (totalOrig - totalWebp) / 1024;
  const savedPct = ((savedMB / (totalOrig / 1024)) * 100).toFixed(0);

  console.log('\n' + '─'.repeat(68));
  console.log('📊  SUMMARY');
  console.log('─'.repeat(68));
  console.log(`    Converted : ${converted}`);
  console.log(`    Skipped   : ${skipped}`);
  console.log(`    Failed    : ${failed}`);
  console.log(`\n    Original  : ${(totalOrig / 1024).toFixed(1)} MB`);
  console.log(`    WebP      : ${(totalWebp / 1024).toFixed(1)} MB`);
  console.log(`    Saved     : ${savedMB.toFixed(1)} MB  (${savedPct}% reduction)\n`);

  await fs.writeFile(
    path.join(baseDir, 'image-optimization-results.json'),
    JSON.stringify({ results, summary: { converted, skipped, failed, totalOrigMB: (totalOrig/1024).toFixed(1), totalWebpMB: (totalWebp/1024).toFixed(1), savedMB: savedMB.toFixed(1) } }, null, 2)
  );
  console.log('📄  Results → image-optimization-results.json\n');
}

main().catch(console.error);
