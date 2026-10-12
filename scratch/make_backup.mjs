import fs from 'fs';

fs.mkdirSync('scratch/backup', { recursive: true });
fs.copyFileSync('frontend/src/data/products.js', 'scratch/backup/products.js.bak');
fs.copyFileSync('backend/data/catalog.js', 'scratch/backup/catalog.js.bak');
console.log('Backups created successfully in scratch/backup/');
