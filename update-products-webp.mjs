import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, 'frontend', 'src', 'data', 'products.js');

async function main() {
  let content = await fs.readFile(productsPath, 'utf8');
  // Replace .png, .jpg, .jpeg in image paths with .webp
  const updatedContent = content.replace(/(['"]\/assets\/[^'"]+?)\.(png|jpg|jpeg)(['"])/gi, '$1.webp$3');
  await fs.writeFile(productsPath, updatedContent, 'utf8');
  console.log('✅ Updated products.js image paths to .webp');
}

main().catch(console.error);
