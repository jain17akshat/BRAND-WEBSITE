const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDir(filePath, fileList);
    } else if (/\.(js|jsx|ts|tsx|css|html|json)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(__dirname, '..', 'frontend', 'src');
const allSrcFiles = scanDir(srcDir);

const outsideRefs = [];
const brassBellsRefs = [];

allSrcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.toLowerCase().includes('outside images') || content.toLowerCase().includes('outside assets')) {
    outsideRefs.push(file);
  }
  if (content.toLowerCase().includes('/brass bells/')) {
    brassBellsRefs.push(file);
  }
});

console.log('Files referencing Outside images / outside assets:', outsideRefs);
console.log('Files referencing /brass bells/:', brassBellsRefs);
