const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// 1. Brass Dhoop Dani Burner update
// Product 1: shraviko-brass-dhoop-dani
let p1Pos = content.indexOf("id: 'shraviko-brass-dhoop-dani'");
if (p1Pos !== -1) {
  let endPos = content.indexOf('}', p1Pos);
  let block = content.slice(p1Pos, endPos);
  block = block.replace(/image:\s*['"][^'"]+['"]/, "image: '/assets/Brass dhoop dani/a3efb112-77c8-4e72-b8f3-4f8c27247174.webp'");
  block = block.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      '/assets/Brass dhoop dani/a3efb112-77c8-4e72-b8f3-4f8c27247174.webp',\n      '/assets/Brass dhoop dani/0b1b19be-fb02-45fd-bad2-bfbe7a87e59b.webp',\n      '/assets/Brass dhoop dani/17e5d263-fb71-4aa0-ba11-923f64069f9e.webp',\n      '/assets/Brass dhoop dani/94d9b4b9-3734-44ed-a7fc-4e92a8b3db2a.webp'\n    ]`);
  block = block.replace(/category:\s*['"][^'"]+['"]/, "category: 'brass'");
  block = block.replace(/categoryName:\s*['"][^'"]+['"]/, "categoryName: 'Brass Articles'");
  content = content.slice(0, p1Pos) + block + content.slice(endPos);
}

// Product 1b: brass-dhoopdani-burner (ensure also brass category)
let p1bPos = content.indexOf("id: 'brass-dhoopdani-burner'");
if (p1bPos !== -1) {
  let endPos = content.indexOf('}', p1bPos);
  let block = content.slice(p1bPos, endPos);
  block = block.replace(/category:\s*['"][^'"]+['"]/, "category: 'brass'");
  block = block.replace(/categoryName:\s*['"][^'"]+['"]/, "categoryName: 'Brass Articles'");
  content = content.slice(0, p1bPos) + block + content.slice(endPos);
}

// 2. Bhoog Thali update (shraviko-brass-bhog-thali)
let p2Pos = content.indexOf("id: 'shraviko-brass-bhog-thali'");
if (p2Pos !== -1) {
  let endPos = content.indexOf('}', p2Pos);
  let block = content.slice(p2Pos, endPos);
  block = block.replace(/image:\s*['"][^'"]+['"]/, "image: '/assets/Bhoog thali/thali2.webp'");
  block = block.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      '/assets/Bhoog thali/thali2.webp',\n      '/assets/Bhoog thali/bhog 1.webp',\n      '/assets/Bhoog thali/bhog 3.webp',\n      '/assets/Bhoog thali/bhog 4.webp',\n      '/assets/Bhoog thali/bhog 5.webp'\n    ]`);
  block = block.replace(/category:\s*['"][^'"]+['"]/, "category: 'brass'");
  block = block.replace(/categoryName:\s*['"][^'"]+['"]/, "categoryName: 'Brass Articles'");
  content = content.slice(0, p2Pos) + block + content.slice(endPos);
}

// 3. Brass Akhand Jyot with Glass Cover update (brass-akhand-jyot-deepak)
let p3Pos = content.indexOf("id: 'brass-akhand-jyot-deepak'");
if (p3Pos !== -1) {
  let endPos = content.indexOf('}', p3Pos);
  let block = content.slice(p3Pos, endPos);
  block = block.replace(/image:\s*['"][^'"]+['"]/, "image: '/assets/GlassAkahnd/27c54221-f212-4e31-a093-5f2caff456e4.webp'");
  block = block.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      '/assets/GlassAkahnd/27c54221-f212-4e31-a093-5f2caff456e4.webp',\n      '/assets/akhand jyot/akhand jyot 2.webp',\n      '/assets/akhand jyot/akhand jyot 1.webp',\n      '/assets/akhand jyot/akhand jyot 3.webp'\n    ]`);
  block = block.replace(/category:\s*['"][^'"]+['"]/, "category: 'brass'");
  block = block.replace(/categoryName:\s*['"][^'"]+['"]/, "categoryName: 'Brass Articles'");
  content = content.slice(0, p3Pos) + block + content.slice(endPos);
}

fs.writeFileSync(productsFilePath, content, 'utf8');
console.log('Successfully updated main images and categories for Brass Dhoop Dani, Bhog Thali, and Brass Akhand Jyot!');
