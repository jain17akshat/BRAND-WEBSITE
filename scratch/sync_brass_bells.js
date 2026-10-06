const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'public', 'brass bells');
const destDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'brass bells');

if (fs.existsSync(srcDir)) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile() && !fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
  console.log('Successfully synced brass bells images into public/assets/brass bells!');
}
