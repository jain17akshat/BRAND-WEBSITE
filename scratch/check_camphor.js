const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'assets');
const camphorDirName = fs.readdirSync(dir).find(d => d.toLowerCase().includes('camphor'));
console.log('Camphor dir name:', camphorDirName);

if (camphorDirName) {
  const fullPath = path.join(dir, camphorDirName);
  const files = fs.readdirSync(fullPath);
  console.log('Files in camphor dir:', files);
}
