const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// 1. Revert brass-akhand-jyot-deepak to its original image and images array
let pPos = content.indexOf("id: 'brass-akhand-jyot-deepak'");
if (pPos !== -1) {
  let endPos = content.indexOf('}', pPos);
  let block = content.slice(pPos, endPos);
  block = block.replace(/image:\s*['"][^'"]+['"]/, "image: '/assets/akhand jyot/akhand jyot 2.webp'");
  block = block.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      '/assets/akhand jyot/akhand jyot 2.webp',\n      '/assets/akhand jyot/akhand jyot 1.webp',\n      '/assets/akhand jyot/akhand jyot 3.webp'\n    ]`);
  content = content.slice(0, pPos) + block + content.slice(endPos);
}

// 2. Define the new separate product object
const newProductObj = {
  id: 'shraviko-brass-glass-akhand-jyot-cover',
  name: 'Shraviko Pure Brass Akhand Jyot Deepak with Protective Glass Cover',
  category: 'brass',
  categoryName: 'Brass Articles',
  subcategory: 'Brass Diyas',
  price: 799,
  originalPrice: 1499,
  rating: 4.98,
  reviewsCount: 115,
  tag: 'Glass Cover',
  artType: 'diya',
  fitMode: 'contain',
  image: '/assets/GlassAkahnd/27c54221-f212-4e31-a093-5f2caff456e4.webp',
  images: [
    '/assets/GlassAkahnd/27c54221-f212-4e31-a093-5f2caff456e4.webp',
    '/assets/GlassAkahnd/2ac727c0-8cbf-46a2-b895-e742683f660a.webp',
    '/assets/GlassAkahnd/3a251c51-c10f-485f-97ae-4568b61eb659.webp',
    '/assets/GlassAkahnd/5a281778-bcb1-4abc-bcd2-6919b11fdc15.webp',
    '/assets/GlassAkahnd/76cf440a-f67a-4be0-b08e-3ce9c1943862.webp',
    '/assets/GlassAkahnd/d86c5da5-4d05-4378-963b-c9d4456c3de2.webp'
  ],
  purity: '100% Solid Brass Base & Heat-Resistant Borosilicate Glass',
  inStock: true,
  description: 'Illuminate your home temple continuously with Shraviko Pure Brass Akhand Jyot Deepak with Protective Glass Cover. Crafted from high-density heavy brass with a heat-treated borosilicate glass cylinder, this Akhand Jyot holds a steady, wind-protected flame for extended prayers and festive rituals.',
  specifications: [
    { label: 'Material', value: '100% Solid Brass Base & Borosilicate Glass Chimney' },
    { label: 'Feature', value: 'Wind-Proof Protective Glass Chimney' },
    { label: 'Burn Duration', value: 'Long Continuous Burn per Oil/Ghee Refill' },
    { label: 'Country of Origin', value: 'Made in India' }
  ],
  keyFeatures: [
    'Protective glass cylinder shields flame from drafts & breezes',
    'Heavy brass pedestal base ensures firm stability',
    'Detachable glass chimney for easy wick maintenance & refilling',
    'Ideal for Navratri, Diwali, & daily mandir Akhand Jyot'
  ]
};

// 3. Insert this product inside PRODUCTS array (just before export const FRAGRANCE_SAMPLERS)
const fragranceIndex = content.indexOf('export const FRAGRANCE_SAMPLERS');
if (fragranceIndex !== -1) {
  const productsEndIndex = content.lastIndexOf('];', fragranceIndex);
  const beforeEnd = content.slice(0, productsEndIndex).trimEnd();
  const afterEnd = content.slice(productsEndIndex);

  const formattedNewProd = ',\n  // --- NEW GLASS AKHAND JYOT CARD ---\n  ' + JSON.stringify(newProductObj, null, 2);

  content = beforeEnd + formattedNewProd + '\n' + afterEnd;
  fs.writeFileSync(productsFilePath, content, 'utf8');
  console.log('Successfully created separate product card shraviko-brass-glass-akhand-jyot-cover in Brass section!');
} else {
  console.error('Could not locate FRAGRANCE_SAMPLERS position!');
}
