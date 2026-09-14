import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convert() {
  const input = path.join(__dirname, 'public', 'assets', 'Sarv kary', 'sarv1.png');
  const output = path.join(__dirname, 'public', 'assets', 'Sarv kary', 'sarv1.webp');
  
  if (fs.existsSync(input)) {
    await sharp(input).webp().toFile(output);
    console.log('Converted sarv1.png to sarv1.webp');
    fs.unlinkSync(input);
  } else {
    console.log('File not found:', input);
  }
}
convert().catch(console.error);
