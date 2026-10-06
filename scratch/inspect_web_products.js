const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsContent = fs.readFileSync(productsFilePath, 'utf8');

// Find all image path references in products.js
const imageMatches = productsContent.match(/['"](?:\/assets|\/Outside images|\/outside assets)[^'"]+['"]/g) || [];
console.log('Total image path strings in products.js:', imageMatches.length);

const outsideMatches = productsContent.match(/['"][^'"]*Outside[^'"]*['"]/gi) || [];
console.log('Outside image matches:', outsideMatches);

const comingSoonMatches = productsContent.match(/['"][^'"]*comingsoon[^'"]*['"]/gi) || [];
console.log('Coming soon matches:', comingSoonMatches);

// Extract product objects by parsing or regex
// Let's load products if possible or regex match ids
const ids = (productsContent.match(/id:\s*['"]([^'"]+)['"]/g) || []).map(s => s.replace(/id:\s*['"]([^'"]+)['"]/, '$1'));
console.log('Total product IDs in products.js:', ids.length);

const assetsDir = path.join(__dirname, '..', 'frontend', 'public', 'assets');
const folders = fs.readdirSync(assetsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const folderUsage = {};
folders.forEach(f => {
  const reg = new RegExp('/assets/' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/', 'i');
  folderUsage[f] = reg.test(productsContent);
});

console.log('\n--- Asset Folders in products.js ---');
const used = folders.filter(f => folderUsage[f]);
const unused = folders.filter(f => !folderUsage[f]);
console.log('Used folders (' + used.length + '):', used);
console.log('Unused folders (' + unused.length + '):', unused);
