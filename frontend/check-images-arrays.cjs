'use strict';
const fs = require('fs');

const content = fs.readFileSync('src/data/products.js', 'utf8');

const targets = [
  'mandir-pooja-box-chest',
  'wooden-chowki-large-15x15',
  'brass-dhoopdani-burner',
  'mandir-hawan-samagri',
  'brass-trishul-standing-emblem',
  'vastu-shani-siddha-yantra',
  'vastu-crystal-glass-turtle',
  'yantra-kaal-sarp',
  'yantra-mangal',
  'yantra-maha-mrityunjay',
  'brass-cup-jyot-diya',
];

targets.forEach(id => {
  // Extract the images array for each product
  const regex = new RegExp(`id:\\s*'${id}'[\\s\\S]*?images:\\s*(\\[[\\s\\S]*?\\])`, 'm');
  const m = content.match(regex);
  if (m) {
    console.log(`\n[${id}]`);
    console.log('images:', m[1].replace(/\s+/g, ' ').trim());
  } else {
    console.log(`\n[${id}] - NOT FOUND`);
  }
});
