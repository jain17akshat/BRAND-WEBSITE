import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, 'public', 'assets', 'Sarpyoh'),
  path.join(__dirname, 'public', 'assets', 'Bagalmukhi'),
  path.join(__dirname, 'public', 'assets', 'Sarv kary')
];

const sizes = [400, 800, 1200];

async function run() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.webp') && !file.includes('-400w') && !file.includes('-800w') && !file.includes('-1200w')) {
        const srcPath = path.join(dir, file);
        const name = file.replace('.webp', '');
        
        for (const width of sizes) {
          const destPath = path.join(dir, `${name}-${width}w.webp`);
          if (!fs.existsSync(destPath)) {
            try {
              await sharp(srcPath).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(destPath);
              console.log(`Generated ${name}-${width}w.webp`);
            } catch (e) {
              console.error(`Failed to generate ${name}-${width}w.webp:`, e);
            }
          }
        }
      }
    }
  }
  console.log('All responsive variants generated successfully.');
}
run().catch(console.error);
