'use strict';
const path = require('path');
const fs = require('fs');

const base = path.join(__dirname, 'public', 'assets');

const items = [
  { label: 'Pooja box', path: path.join(base, 'Pooja box', 'Pooja2.png') },
  { label: 'WoodenChowki Large', path: path.join(base, 'WoodenChowki Large', 'mainchowki.png') },
  { label: 'dhoop dani', path: path.join(base, 'dhoop dani', 'dhoop1.png') },
  { label: 'Hawan Samgri (hawannn2)', path: path.join(base, 'Hawan Samgri', 'hawannn2') },
  { label: 'Trishul', path: path.join(base, 'Trishul', 'trishull11.png') },
  { label: 'shani yantra', path: path.join(base, 'shani yantra', 'shanimain.png') },
  { label: 'glassturtle', path: path.join(base, 'glassturtle', 'glass main.png') },
  { label: 'Sarpyoh', path: path.join(base, 'Sarpyoh', 'mainimage.png') },
  { label: 'Mangal yantra', path: path.join(base, 'Mangal yantra', 'image3.webp') },
  { label: 'MahaMrityunjay', path: path.join(base, 'MahaMrityunjay', 'mahamritunjay.webp') },
  { label: 'Cup jyot', path: path.join(base, 'Cup jyot', 'cup66.png') }
];

items.forEach(item => {
  let exists = fs.existsSync(item.path);
  if (!exists) {
    // Check if hawannn2 has extension like .png, .jpg, .webp
    const dir = path.dirname(item.path);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const match = files.find(f => f.startsWith(path.basename(item.path)));
      if (match) {
        item.path = path.join(dir, match);
        exists = true;
      }
    }
  }
  console.log(`${item.label}: ${exists ? '✅ ' + item.path : '❌ NOT FOUND'}`);
});
