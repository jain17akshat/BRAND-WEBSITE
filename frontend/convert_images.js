import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folders = [
  'MahaMrityunjay',
  'Mangal yantra',
  'Sarv kary',
  'Sarpyoh'
];

const basePath = path.join(__dirname, 'public', 'assets');

async function convertImages() {
  for (const folder of folders) {
    const dirPath = path.join(basePath, folder);
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory not found: ${dirPath}`);
        continue;
    }
    const files = fs.readdirSync(dirPath);
    
    let index = 1;
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.jpg')) {
        const inputPath = path.join(dirPath, file);
        const outputPath = path.join(dirPath, `image${index}.webp`);
        
        await sharp(inputPath).webp().toFile(outputPath);
        console.log(`Converted ${file} to image${index}.webp in ${folder}`);
        fs.unlinkSync(inputPath);
        index++;
      }
    }
  }
}

convertImages().catch(console.error);
