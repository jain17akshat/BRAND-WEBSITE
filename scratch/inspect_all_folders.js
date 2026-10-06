const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'frontend', 'public', 'assets');
const folders = fs.readdirSync(assetsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('Total asset folders:', folders.length);

const folderDetails = folders.map(f => {
  const p = path.join(assetsDir, f);
  const files = fs.readdirSync(p).filter(file => !file.startsWith('.'));
  const webps = files.filter(file => file.endsWith('.webp'));
  const pngs = files.filter(file => file.endsWith('.png'));
  const jpegs = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));
  return { folder: f, filesCount: files.length, webps: webps.length, pngs: pngs.length, jpegs: jpegs.length, sample: files.slice(0, 5) };
});

console.log(JSON.stringify(folderDetails, null, 2));
