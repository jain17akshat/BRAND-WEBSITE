'use strict';
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src', 'data', 'products.js'), 'utf8');
const matches = content.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)'/g);

for (const m of matches) {
  console.log(`${m[1]} | ${m[2]} | ${m[3]}`);
}
