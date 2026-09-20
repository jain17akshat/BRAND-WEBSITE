'use strict';
const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'src', 'data', 'products.js');
const content = fs.readFileSync(productsFile, 'utf8');

// Parse products array using regex or simple inspection
const productBlocks = content.split(/\{\s*id:/).slice(1);

const targetTerms = [
  'pooja box', 'chowki', 'dhoop dani', 'dhoopdani', 'hawan', 'trishul',
  'shani', 'turtle', 'glass', 'sarp', 'mangal', 'mrityunjay', 'cup jyot'
];

productBlocks.forEach(block => {
  const idMatch = block.match(/^\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const imageMatch = block.match(/image:\s*'([^']+)'/);
  const categoryMatch = block.match(/category:\s*'([^']+)'/);

  if (idMatch && nameMatch) {
    const id = idMatch[1];
    const name = nameMatch[1];
    const img = imageMatch ? imageMatch[1] : '';
    const cat = categoryMatch ? categoryMatch[1] : '';

    const lower = (id + ' ' + name + ' ' + img + ' ' + cat).toLowerCase();
    const matches = targetTerms.filter(t => lower.includes(t));

    if (matches.length > 0) {
      console.log(`ID: ${id}`);
      console.log(`Name: ${name}`);
      console.log(`Category: ${cat}`);
      console.log(`Image: ${img}`);
      console.log(`Matched Terms: ${matches.join(', ')}`);
      console.log('---');
    }
  }
});
