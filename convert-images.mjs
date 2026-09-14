#!/usr/bin/env node
/**
 * convert-images.mjs
 * 
 * Converts large PNG/JPG/JPEG images in frontend/public (and all subdirectories) to WebP format.
 * Generates responsive variants:
 *  - base .webp (original max dimensions, quality 82-85)
 *  - -400w.webp (max width 400px, quality 82)
 *  - -800w.webp (max width 800px, quality 82)
 *  - -1200w.webp (max width 1200px, quality 82)
 * 
 * Skips processing when destination WebP files are already up-to-date.
 * Outputs image-optimization-results.json.
 */

import { promises as fs, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = __dirname;
const publicDir = path.join(baseDir, 'frontend', 'public');

const sharpPath = path.join(baseDir, 'frontend', 'node_modules', 'sharp', 'dist', 'index.cjs');
const sharpPathAlt = path.join(baseDir, 'frontend', 'node_modules', 'sharp', 'dist', 'index.js');

async function loadSharp() {
  if (existsSync(sharpPath)) {
    try {
      const { createRequire } = await import('module');
      const req = createRequire(import.meta.url);
      process.env.NODE_PATH = path.join(baseDir, 'frontend', 'node_modules');
      req.cache && Object.keys(req.cache).filter(k => k.includes('sharp')).forEach(k => delete req.cache[k]);
      return req(sharpPath);
    } catch (e) { /* fall through */ }
  }

  for (const p of [sharpPath, sharpPathAlt]) {
    if (existsSync(p)) {
      try {
        const mod = await import(pathToFileURL(p).href);
        return mod.default || mod;
      } catch (e) { /* fall through */ }
    }
  }

  try {
    const mod = await import('sharp');
    return mod.default || mod;
  } catch (e) {
    console.error('\n❌ Cannot load sharp from frontend/node_modules.');
    process.exit(1);
  }
}

async function getFilesRecursively(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await getFilesRecursively(filePath));
    } else {
      const ext = path.extname(file.name).toLowerCase();
      // Only process .png, .jpg, .jpeg — exclude already generated -400w/-800w/-1200w files or .webp
      if (['.png', '.jpg', '.jpeg'].includes(ext) && !file.name.includes('-400w') && !file.name.includes('-800w') && !file.name.includes('-1200w')) {
        results.push(filePath);
      }
    }
  }
  return results;
}

async function sizeKB(p) {
  try { return (await fs.stat(p)).size / 1024; }
  catch { return 0; }
}

async function isUpToDate(srcPath, destPaths) {
  try {
    const srcStat = await fs.stat(srcPath);
    for (const d of destPaths) {
      if (!existsSync(d)) return false;
      const destStat = await fs.stat(d);
      if (destStat.mtime < srcStat.mtime) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('\n🔄  SHRAVIKO Recursive WebP + Multi-Resolution Variant Pipeline\n');
  console.log('─'.repeat(72));

  const sharp = await loadSharp();
  console.log('✅  sharp loaded successfully\n');

  const allImages = await getFilesRecursively(publicDir);
  console.log(`🔍  Found ${allImages.length} PNG/JPG images in frontend/public\n`);

  let convertedCount = 0;
  let cachedCount = 0;
  let failedCount = 0;
  let totalOrigKB = 0;
  let totalWebpKB = 0;

  const results = [];

  for (const srcPath of allImages) {
    const relativePath = path.relative(baseDir, srcPath).replace(/\\/g, '/');
    const dirName = path.dirname(srcPath);
    const ext = path.extname(srcPath);
    const baseName = path.basename(srcPath, ext);

    const baseWebp = path.join(dirName, `${baseName}.webp`);
    const w400Webp = path.join(dirName, `${baseName}-400w.webp`);
    const w800Webp = path.join(dirName, `${baseName}-800w.webp`);
    const w1200Webp = path.join(dirName, `${baseName}-1200w.webp`);

    const destFiles = [baseWebp, w400Webp, w800Webp, w1200Webp];

    const origKB = await sizeKB(srcPath);
    totalOrigKB += origKB;

    const cached = await isUpToDate(srcPath, destFiles);
    if (cached) {
      const wkb = await sizeKB(baseWebp);
      totalWebpKB += wkb;
      console.log(`☑️   CACHED: ${relativePath} (${origKB.toFixed(0)} KB → ${wkb.toFixed(0)} KB)`);
      cachedCount++;
      results.push({ file: relativePath, originalKB: origKB.toFixed(0), webpKB: wkb.toFixed(0), status: 'cached' });
      continue;
    }

    try {
      const image = sharp(srcPath);
      const metadata = await image.metadata();
      const origWidth = metadata.width || 1200;

      // 1. Base WebP (original size, quality 82)
      await image.clone().webp({ quality: 82, effort: 4 }).toFile(baseWebp);

      // 2. 400w variant (max width 400)
      if (origWidth > 400) {
        await image.clone().resize({ width: 400, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 82, effort: 4 }).toFile(w400Webp);
      } else {
        await image.clone().webp({ quality: 82, effort: 4 }).toFile(w400Webp);
      }

      // 3. 800w variant (max width 800)
      if (origWidth > 800) {
        await image.clone().resize({ width: 800, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 82, effort: 4 }).toFile(w800Webp);
      } else {
        await image.clone().webp({ quality: 82, effort: 4 }).toFile(w800Webp);
      }

      // 4. 1200w variant (max width 1200)
      if (origWidth > 1200) {
        await image.clone().resize({ width: 1200, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 82, effort: 4 }).toFile(w1200Webp);
      } else {
        await image.clone().webp({ quality: 82, effort: 4 }).toFile(w1200Webp);
      }

      const wkb = await sizeKB(baseWebp);
      const w400kb = await sizeKB(w400Webp);
      const pct = (((origKB - w400kb) / origKB) * 100).toFixed(0);

      totalWebpKB += w400kb; // Using card thumbnail size for stats comparison
      console.log(`✅  ${relativePath}`);
      console.log(`    Orig: ${origKB.toFixed(0)} KB  | Base WebP: ${wkb.toFixed(0)} KB | 400w: ${w400kb.toFixed(0)} KB (${pct}% smaller)`);

      convertedCount++;
      results.push({
        file: relativePath,
        originalWidth: origWidth,
        originalKB: origKB.toFixed(0),
        baseWebpKB: wkb.toFixed(0),
        w400KB: w400kb.toFixed(0),
        savingsPercent: pct + '%',
        status: 'converted'
      });
    } catch (err) {
      console.error(`❌  FAILED: ${relativePath}:`, err.message);
      failedCount++;
      results.push({ file: relativePath, status: 'failed', error: err.message });
    }
  }

  const savedMB = Math.max(0, (totalOrigKB - totalWebpKB) / 1024);
  const savedPct = totalOrigKB > 0 ? ((savedMB / (totalOrigKB / 1024)) * 100).toFixed(0) : 0;

  console.log('\n' + '─'.repeat(72));
  console.log('📊  SUMMARY');
  console.log('─'.repeat(72));
  console.log(`    Converted : ${convertedCount}`);
  console.log(`    Cached    : ${cachedCount}`);
  console.log(`    Failed    : ${failedCount}`);
  console.log(`\n    Total Original : ${(totalOrigKB / 1024).toFixed(1)} MB`);
  console.log(`    Card WebP (400w): ${(totalWebpKB / 1024).toFixed(1)} MB`);
  console.log(`    Bandwidth Saved: ${savedMB.toFixed(1)} MB (${savedPct}% reduction)\n`);

  await fs.writeFile(
    path.join(baseDir, 'image-optimization-results.json'),
    JSON.stringify({ results, summary: { converted: convertedCount, cached: cachedCount, failed: failedCount, totalOrigMB: (totalOrigKB/1024).toFixed(1), totalWebpMB: (totalWebpKB/1024).toFixed(1), savedMB: savedMB.toFixed(1) } }, null, 2)
  );
  console.log('📄  Results saved to image-optimization-results.json\n');
}

main().catch(console.error);

