'use strict';
const fs = require('fs');

const content = fs.readFileSync('src/data/products.js', 'utf8');
const lines = content.split('\n');

// For each product, print the lines around images: [
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
  'brass-cup-jyot-diya',
];

targets.forEach(id => {
  // Find the id line
  let idLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`'${id}'`) || lines[i].includes(`"${id}"`)) {
      idLine = i + 1; // 1-indexed
      break;
    }
  }
  if (idLine === -1) {
    console.log(`NOT FOUND: ${id}`);
    return;
  }
  
  // From idLine, find the images: line within next 60 lines
  for (let i = idLine; i < idLine + 60 && i < lines.length; i++) {
    const line = lines[i - 1]; // convert to 0-indexed
    if (line.trim().startsWith('images:')) {
      const endLine = i + 15 < lines.length ? i + 15 : lines.length;
      console.log(`\n=== ${id} (id at line ${idLine}) ===`);
      // Print lines from images: until closing ]
      let depth = 0;
      for (let j = i; j <= i + 15 && j <= lines.length; j++) {
        const l = lines[j - 1];
        console.log(`L${j}: ${l}`);
        depth += (l.match(/\[/g) || []).length;
        depth -= (l.match(/\]/g) || []).length;
        if (depth <= 0 && j > i) break;
      }
      break;
    }
  }
});
