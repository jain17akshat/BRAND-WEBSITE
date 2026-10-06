const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// First restore original products.js if needed or remove any orphaned NEW PRODUCTS markers
if (content.includes('// --- NEW PRODUCTS ADDED ---')) {
  // Let's clean up
  const markerIdx = content.indexOf('// --- NEW PRODUCTS ADDED ---');
  content = content.slice(0, markerIdx);
  // Ensure it ends properly before ];
  const lastBracket = content.lastIndexOf('}');
  content = content.slice(0, lastBracket + 1) + '\n];\n';
}

// Strip PNG / JPG references in image paths to WEBP across the entire file
content = content.replace(/(['"]\/assets\/[^'"]+)\.(png|jpg|jpeg)(['"])/gi, '$1.webp$3');

// Update Incense Category in CATEGORIES to count: 14 and remove isComingSoon
content = content.replace(
  /{\s*id:\s*'incense',\s*name:\s*'Incense & Dhoop',\s*count:\s*\d+,\s*isComingSoon:\s*true\s*}/g,
  "{ id: 'incense', name: 'Incense & Dhoop', count: 14 }"
);

// Require our new products array from update_products_js.js definition
const updateScript = fs.readFileSync(path.join(__dirname, 'update_products_js.js'), 'utf8');
// Extract newProducts array using regex or eval
const match = updateScript.match(/const newProducts = (\[[\s\S]+?\]);\n\n\/\/ Append/);

if (!match) {
  console.error('Could not extract newProducts array!');
  process.exit(1);
}

const newProductsStr = match[1];

// Find the very end of PRODUCTS array. The PRODUCTS array ends with '];' at the end of the file.
const endOfFileIndex = content.lastIndexOf('];');
if (endOfFileIndex !== -1) {
  // Check if previous char is not a comma
  const beforeEnd = content.slice(0, endOfFileIndex).trimEnd();
  let prefix = ',\n  ';
  if (beforeEnd.endsWith('[')) {
    prefix = '\n  ';
  } else if (beforeEnd.endsWith(',')) {
    prefix = '\n  ';
  }

  // Remove surrounding brackets from newProductsStr to cleanly join
  const cleanedNewProducts = newProductsStr.trim().slice(1, -1).trim();

  const updatedContent = beforeEnd + prefix + '// --- NEW PRODUCTS ADDED ---\n  ' + cleanedNewProducts + '\n];\n';
  fs.writeFileSync(productsFilePath, updatedContent, 'utf8');
  console.log('Successfully inserted all new products at the end of PRODUCTS array!');
} else {
  console.error('Could not find ]; at end of file!');
}
