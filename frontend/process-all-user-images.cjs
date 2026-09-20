'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const base = path.join(__dirname, 'public', 'assets');

const items = [
  {
    id: 'mandir-pooja-box-chest',
    src: path.join(base, 'Pooja box', 'Pooja2.png'),
    webRelativeDir: '/assets/Pooja box',
    destBaseName: 'Pooja2'
  },
  {
    id: 'wooden-chowki-large-15x15',
    src: path.join(base, 'WoodenChowki Large', 'mainchowki.png'),
    webRelativeDir: '/assets/WoodenChowki Large',
    destBaseName: 'mainchowki'
  },
  {
    id: 'brass-dhoopdani-burner',
    src: path.join(base, 'dhoop dani', 'dhoop1.png'),
    webRelativeDir: '/assets/dhoop dani',
    destBaseName: 'dhoop1'
  },
  {
    id: 'mandir-hawan-samagri',
    src: path.join(base, 'Hawan Samgri', 'hawannn2'),
    webRelativeDir: '/assets/Hawan Samgri',
    destBaseName: 'hawannn2'
  },
  {
    id: 'brass-trishul-standing-emblem',
    src: path.join(base, 'Trishul', 'trishull11.png'),
    webRelativeDir: '/assets/Trishul',
    destBaseName: 'trishull11'
  },
  {
    id: 'vastu-shani-siddha-yantra',
    src: path.join(base, 'shani yantra', 'shanimain.png'),
    webRelativeDir: '/assets/shani yantra',
    destBaseName: 'shanimain'
  },
  {
    id: 'vastu-crystal-glass-turtle',
    src: path.join(base, 'glassturtle', 'glass main.png'),
    webRelativeDir: '/assets/glassturtle',
    destBaseName: 'glass main'
  },
  {
    id: 'yantra-kaal-sarp',
    src: path.join(base, 'Sarpyoh', 'mainimage.png'),
    webRelativeDir: '/assets/Sarpyoh',
    destBaseName: 'mainimage'
  },
  {
    id: 'yantra-mangal',
    src: path.join(base, 'Mangal yantra', 'image3.webp'),
    webRelativeDir: '/assets/Mangal yantra',
    destBaseName: 'image3'
  },
  {
    id: 'yantra-maha-mrityunjay',
    src: path.join(base, 'MahaMrityunjay', 'mahamritunjay.webp'),
    webRelativeDir: '/assets/MahaMrityunjay',
    destBaseName: 'mahamritunjay'
  },
  {
    id: 'brass-cup-jyot-diya',
    src: path.join(base, 'Cup jyot', 'cup66.png'),
    webRelativeDir: '/assets/Cup jyot',
    destBaseName: 'cup66'
  }
];

async function processImages() {
  console.log('--- Processing All 11 Product Images ---');

  for (const item of items) {
    if (!fs.existsSync(item.src)) {
      console.error(`❌ Source missing for ${item.id}: ${item.src}`);
      continue;
    }

    const inputBuf = fs.readFileSync(item.src);
    const meta = await sharp(inputBuf).metadata();
    const dir = path.dirname(item.src);

    console.log(`Processing [${item.id}] -> ${item.destBaseName} (${meta.width}x${meta.height})...`);

    // 1. Save base WebP
    const webpPath = path.join(dir, `${item.destBaseName}.webp`);
    const webpBuf = await sharp(inputBuf).webp({ quality: 88, effort: 4 }).toBuffer();
    fs.writeFileSync(webpPath, webpBuf);
    console.log(`  ✅ Saved ${item.destBaseName}.webp`);

    // 2. Generate responsive WebP variants (-400w, -800w, -1200w)
    const sizes = [400, 800, 1200];
    for (const w of sizes) {
      const variantPath = path.join(dir, `${item.destBaseName}-${w}w.webp`);
      const h = Math.round((w / meta.width) * meta.height);
      const variantBuf = await sharp(inputBuf)
        .resize(w, h, { fit: 'contain' })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      fs.writeFileSync(variantPath, variantBuf);
      console.log(`  ✅ Saved ${item.destBaseName}-${w}w.webp`);
    }

    item.webpUrl = `${item.webRelativeDir}/${item.destBaseName}.webp`;
  }

  console.log('\n✨ All image processing complete!');
  return items;
}

processImages().then(results => {
  // Now update products.js
  const productsFile = path.join(__dirname, 'src', 'data', 'products.js');
  let content = fs.readFileSync(productsFile, 'utf8');

  results.forEach(item => {
    if (item.id === 'yantra-maha-mrityunjay') {
      // Check if already in products.js
      if (content.includes("'yantra-maha-mrityunjay'")) {
        console.log(`Product ${item.id} already exists in products.js`);
      } else {
        console.log(`Adding new product ${item.id} to products.js...`);
        const newProductStr = `
  {
    id: 'yantra-maha-mrityunjay',
    name: 'SHRAVIKO Shri Mahamrityunjay Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Sacred Yantras',
    price: 499,
    originalPrice: 899,
    rating: 4.98,
    reviewsCount: 114,
    tag: 'Copper Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '${item.webpUrl}',
    images: [
      '${item.webpUrl}'
    ],
    weightVariants: [
      { weight: 'Standard 3x3 Inch Copper Yantra', price: 499, originalPrice: 899, default: true }
    ],
    purity: '100% Pure Embossed Copper Plate',
    inStock: true,
    description: 'Invoke divine health, protection, and spiritual liberation with the SHRAVIKO Shri Mahamrityunjay Yantra. Crafted on pure copper, this sacred geometric emblem carries the potent vibrations of Lord Shiva (Mahadev) to dispel illness, fear of premature death, and negative energies from your home.',
    specifications: [
      { label: 'Product', value: 'Shri Mahamrityunjay Yantra' },
      { label: 'Material', value: 'Pure Solid Copper' },
      { label: 'Deity', value: 'Lord Shiva (Mahadev)' },
      { label: 'Suitable For', value: 'Pooja Ghar, Altar, Health & Healing Rituals' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Sacred Mahamrityunjay geometric inscription',
      'Etched on pure copper with polished finish',
      'Dispels health obstacles and negative energy',
      'Ideal for home mandir, altar, and gifting'
    ],
    careInstructions: [
      'Wipe clean with a soft dry cloth. Keep away from harsh acidic cleaners.'
    ],
    faqs: [
      { q: 'Which direction should this Yantra be placed in?', a: 'Place it facing East or North in your home mandir or worship area.' }
    ]
  },`;

        // Insert before the last closing bracket of PRODUCTS array
        const insertIdx = content.lastIndexOf('];');
        if (insertIdx !== -1) {
          content = content.slice(0, insertIdx) + newProductStr + '\n' + content.slice(insertIdx);
          console.log(`✅ Added ${item.id} to products.js`);
        }
      }
    } else {
      // Update existing product in content
      const regex = new RegExp(`(id:\\s*'${item.id}'[\\s\\S]*?image:\\s*')([^']+)(')`, 'm');
      const match = content.match(regex);
      if (match) {
        content = content.replace(regex, `$1${item.webpUrl}$3`);
        console.log(`✅ Updated main image for ${item.id} -> ${item.webpUrl}`);
      } else {
        console.warn(`⚠️ Could not find regex match for product ${item.id}`);
      }

      // Also prepend to images array if not present
      const imagesRegex = new RegExp(`(id:\\s*'${item.id}'[\\s\\S]*?images:\\s*\\[\\s*)`, 'm');
      const imgMatch = content.match(imagesRegex);
      if (imgMatch) {
        // Check if webpUrl is already in images array
        if (!content.includes(`'${item.webpUrl}'`)) {
          content = content.replace(imagesRegex, `$1\n      '${item.webpUrl}',`);
          console.log(`✅ Prepended ${item.webpUrl} to images array of ${item.id}`);
        }
      }
    }
  });

  fs.writeFileSync(productsFile, content);
  console.log('\n🎉 Successfully updated products.js with all 11 main product card images!');
}).catch(console.error);
