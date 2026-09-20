'use strict';
const fs = require('fs');
const path = require('path');

const checks = [
  ['Pooja box/Pooja2.webp', 'mandir-pooja-box-chest'],
  ['WoodenChowki Large/mainchowki.webp', 'wooden-chowki-large-15x15'],
  ['dhoop dani/dhoop1.webp', 'brass-dhoopdani-burner'],
  ['Hawan Samgri/hawannn2.webp', 'mandir-hawan-samagri'],
  ['Trishul/trishull11.webp', 'brass-trishul-standing-emblem'],
  ['shani yantra/shanimain.webp', 'vastu-shani-siddha-yantra'],
  ['glassturtle/glass main.webp', 'vastu-crystal-glass-turtle'],
  ['Sarpyoh/mainimage.webp', 'yantra-kaal-sarp'],
  ['Mangal yantra/image3.webp', 'yantra-mangal'],
  ['MahaMrityunjay/mahamritunjay.webp', 'yantra-maha-mrityunjay'],
  ['Cup jyot/cup66.webp', 'brass-cup-jyot-diya'],
];

const base = path.join(__dirname, 'public', 'assets');
let allOk = true;

checks.forEach(([relPath, productId]) => {
  const full = path.join(base, relPath);
  const exists = fs.existsSync(full);
  if (!exists) allOk = false;
  console.log(`${exists ? '✅ OK' : '❌ MISSING'} | ${productId} | /assets/${relPath}`);
});

if (!allOk) {
  console.log('\n⚠️  Some WebP files are missing! Need to regenerate them.');
} else {
  console.log('\n✅ All WebP files verified on disk!');
}

// Now verify products.js has correct image paths
const productsContent = fs.readFileSync(path.join(__dirname, 'src', 'data', 'products.js'), 'utf8');

checks.forEach(([relPath, productId]) => {
  const expectedPath = `/assets/${relPath}`;
  const idRegex = new RegExp(`id:\\s*'${productId}'[\\s\\S]*?image:\\s*'([^']+)'`, 'm');
  const match = productsContent.match(idRegex);
  if (match) {
    const actual = match[1];
    const ok = actual === expectedPath;
    console.log(`${ok ? '✅' : '❌'} products.js [${productId}]: image = '${actual}'${ok ? '' : ` (expected '${expectedPath}')`}`);
  } else {
    console.log(`❌ NOT FOUND in products.js: ${productId}`);
  }
});
