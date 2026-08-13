const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');

console.log('🧹 Starting cleanup of root directory...');

// 1. Move root public/ folder into frontend/public/
const rootPublic = path.join(rootDir, 'public');
const frontendPublic = path.join(frontendDir, 'public');

if (fs.existsSync(rootPublic)) {
  if (fs.existsSync(frontendPublic)) {
    fs.rmSync(frontendPublic, { recursive: true, force: true });
  }
  fs.renameSync(rootPublic, frontendPublic);
  console.log('✅ Moved public/ asset folder to frontend/public/');
}

// 2. Remove legacy redundant files and directories from root
const legacyItems = [
  'src',
  'server',
  'brass bells',
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'standalone_preview.html',
  'video_view.html',
  'READ_ME_IMAGE_INSTRUCTIONS.md',
  'package-lock.json'
];

legacyItems.forEach((item) => {
  const fullPath = path.join(rootDir, item);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Removed legacy item: ${item}`);
  }
});

console.log('\n✨ Root directory cleanup complete!');
console.log('Your root folder now contains only:');
console.log(' ├── frontend/');
console.log(' ├── backend/');
console.log(' ├── package.json');
console.log(' ├── .gitignore');
console.log(' └── README.md');
