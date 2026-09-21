'use strict';
const sharp = require('sharp');
const path = require('path');

async function analyze() {
  const srcPath = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'Brass aarti', 'arrittti1.png');
  const img = sharp(srcPath);
  const meta = await img.metadata();
  console.log('Image dimensions:', meta.width, 'x', meta.height);

  // Sample corner pixel (0,0)
  const corner = await img.extract({ left: 0, top: 0, width: 5, height: 5 }).stats();
  console.log('Corner (0,0) RGB:', corner.channels.map(c => Math.round(c.mean)));

  // Sample center area (500,500)
  const center = await img.extract({ left: 495, top: 495, width: 10, height: 10 }).stats();
  console.log('Center (500,500) RGB:', center.channels.map(c => Math.round(c.mean)));

  // Sample (100, 100) inside the inner photo region
  const innerSample = await img.extract({ left: 100, top: 100, width: 10, height: 10 }).stats();
  console.log('Inner (100,100) RGB:', innerSample.channels.map(c => Math.round(c.mean)));
}

analyze().catch(console.error);
