import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convert() {
  const dir = path.join(__dirname, 'public', 'assets', 'Bagalmukhi');
  const files = ['bagalmukhi1', 'mukhi2', 'mukhi3'];
  for (const file of files) {
      const input = path.join(dir, `${file}.png`);
      const output = path.join(dir, `${file}.webp`);
      
      if (fs.existsSync(input)) {
        await sharp(input).webp().toFile(output);
        console.log(`Converted ${file}.png to ${file}.webp`);
        fs.unlinkSync(input);
      } else {
        console.log('File not found:', input);
      }
  }
}
convert().catch(console.error);
