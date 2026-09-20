'use strict';
const sharp = require('sharp');
const path = require('path');

async function check() {
  const file = path.join(__dirname, 'public', 'assets', 'Brass aarti', 'arrittti1.png');
  const meta = await sharp(file).metadata();
  console.log('arrittti1.png metadata:', meta.width, 'x', meta.height, 'format:', meta.format);
}

check().catch(console.error);
