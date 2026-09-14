import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'data', 'products.js');
let content = fs.readFileSync(filePath, 'utf8');

const productsStart = content.indexOf('export const PRODUCTS = [');
const productsEnd = content.indexOf('export const FRAGRANCE_SAMPLERS = [');

if (productsStart !== -1) {
    let beforeProducts = content.substring(0, productsStart);
    let productsBlock = content.substring(productsStart, productsEnd !== -1 ? productsEnd : content.length);
    let afterProducts = productsEnd !== -1 ? content.substring(productsEnd) : '';

    productsBlock = productsBlock.replace(/name:\s*(['"])(.*?)\1/g, (match, quote, pName) => {
        if (/^shraviko\b/i.test(pName.trim())) {
            return match;
        }
        // Capitalize Shraviko properly
        return `name: ${quote}Shraviko ${pName}${quote}`;
    });

    fs.writeFileSync(filePath, beforeProducts + productsBlock + afterProducts, 'utf8');
    console.log('Successfully updated product names.');
} else {
    console.log('PRODUCTS array not found.');
}
