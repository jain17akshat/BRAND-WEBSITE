'use strict';
const fs = require('fs');

let content = fs.readFileSync('src/data/products.js', 'utf8');

const updates = [
  {
    id: 'mandir-pooja-box-chest',
    newMain: "/assets/Pooja box/Pooja2.webp",
    oldImages: `[ '/assets/Pooja box/Poojafront.webp', '/assets/Pooja box/poojabox1.webp', '/assets/Pooja box/poobjabox2.webp', '/assets/Pooja box/Pooja box.webp', '/assets/Pooja box/pooja box 3.webp', '/assets/Pooja box/pooja box 4.webp' ]`,
    newImages: `[ '/assets/Pooja box/Pooja2.webp', '/assets/Pooja box/Poojafront.webp', '/assets/Pooja box/poojabox1.webp', '/assets/Pooja box/poobjabox2.webp', '/assets/Pooja box/Pooja box.webp', '/assets/Pooja box/pooja box 3.webp', '/assets/Pooja box/pooja box 4.webp' ]`,
  },
  {
    id: 'wooden-chowki-large-15x15',
    newMain: "/assets/WoodenChowki Large/mainchowki.webp",
    oldImages: `[ '/assets/WoodenChowki Large/chowki4.webp', '/assets/WoodenChowki Large/chowki5.webp', '/assets/WoodenChowki Large/chowki444.webp', '/assets/WoodenChowki Large/sizechowki.webp', '/assets/WoodenChowki Large/chowki6.webp' ]`,
    newImages: `[ '/assets/WoodenChowki Large/mainchowki.webp', '/assets/WoodenChowki Large/chowki4.webp', '/assets/WoodenChowki Large/chowki5.webp', '/assets/WoodenChowki Large/chowki444.webp', '/assets/WoodenChowki Large/sizechowki.webp', '/assets/WoodenChowki Large/chowki6.webp' ]`,
  },
  {
    id: 'brass-dhoopdani-burner',
    newMain: "/assets/dhoop dani/dhoop1.webp",
    oldImages: `[ '/assets/dhoop dani/dhoop dani 1.webp', '/assets/dhoop dani/dhoop dani 2.webp', '/assets/dhoop dani/dhoop dani 4.webp', '/assets/dhoop dani/dhoop dani 5.webp' ]`,
    newImages: `[ '/assets/dhoop dani/dhoop1.webp', '/assets/dhoop dani/dhoop dani 1.webp', '/assets/dhoop dani/dhoop dani 2.webp', '/assets/dhoop dani/dhoop dani 4.webp', '/assets/dhoop dani/dhoop dani 5.webp' ]`,
  },
  {
    id: 'mandir-hawan-samagri',
    newMain: "/assets/Hawan Samgri/hawannn2.webp",
    oldImages: `[ '/assets/Hawan Samgri/Hawan1.webp', '/assets/Hawan Samgri/Hawan2.webp', '/assets/Hawan Samgri/Hawan3.webp', '/assets/Hawan Samgri/Hawan4.webp', '/assets/Hawan Samgri/Hawan5.webp', '/assets/Hawan Samgri/Hawan6.webp' ]`,
    newImages: `[ '/assets/Hawan Samgri/hawannn2.webp', '/assets/Hawan Samgri/Hawan1.webp', '/assets/Hawan Samgri/Hawan2.webp', '/assets/Hawan Samgri/Hawan3.webp', '/assets/Hawan Samgri/Hawan4.webp', '/assets/Hawan Samgri/Hawan5.webp', '/assets/Hawan Samgri/Hawan6.webp' ]`,
  },
  {
    id: 'brass-trishul-standing-emblem',
    newMain: "/assets/Trishul/trishull11.webp",
    oldImages: `[ '/assets/Trishul/trishul 2.webp', '/assets/Trishul/Trishul1.webp', '/assets/Trishul/trihsul 3.webp', '/assets/Trishul/trishul 4.webp' ]`,
    newImages: `[ '/assets/Trishul/trishull11.webp', '/assets/Trishul/trishul 2.webp', '/assets/Trishul/Trishul1.webp', '/assets/Trishul/trihsul 3.webp', '/assets/Trishul/trishul 4.webp' ]`,
  },
  {
    id: 'vastu-shani-siddha-yantra',
    newMain: "/assets/shani yantra/shanimain.webp",
    oldImages: `[ '/assets/shani yantra/shani1.webp', '/assets/shani yantra/shani3.webp', '/assets/shani yantra/shani 4.webp', '/assets/shani yantra/laxmi 4.webp' ]`,
    newImages: `[ '/assets/shani yantra/shanimain.webp', '/assets/shani yantra/shani1.webp', '/assets/shani yantra/shani3.webp', '/assets/shani yantra/shani 4.webp', '/assets/shani yantra/laxmi 4.webp' ]`,
  },
  {
    id: 'vastu-crystal-glass-turtle',
    newMain: "/assets/glassturtle/glass main.webp",
    oldImages: `[ '/assets/glassturtle/Glass turtle 1.webp', '/assets/glassturtle/glass turtle 2.webp', '/assets/glassturtle/turutle 3.webp', '/assets/glassturtle/turtle4.webp' ]`,
    newImages: `[ '/assets/glassturtle/glass main.webp', '/assets/glassturtle/Glass turtle 1.webp', '/assets/glassturtle/glass turtle 2.webp', '/assets/glassturtle/turutle 3.webp', '/assets/glassturtle/turtle4.webp' ]`,
  },
  {
    id: 'yantra-kaal-sarp',
    newMain: "/assets/Sarpyoh/mainimage.webp",
    oldImages: `[ '/assets/Sarpyoh/image1.webp', '/assets/Sarpyoh/image2.webp', '/assets/Sarpyoh/image3.webp', '/assets/luxmiyantra/laxmi 4-1200w.webp' ]`,
    newImages: `[ '/assets/Sarpyoh/mainimage.webp', '/assets/Sarpyoh/image1.webp', '/assets/Sarpyoh/image2.webp', '/assets/Sarpyoh/image3.webp', '/assets/luxmiyantra/laxmi 4-1200w.webp' ]`,
  },
  {
    id: 'yantra-mangal',
    newMain: "/assets/Mangal yantra/image3.webp",
    oldImages: `[ '/assets/Mangal yantra/image1.webp', '/assets/Mangal yantra/image2.webp', '/assets/Mangal yantra/image3.webp', '/assets/Mangal yantra/image4.webp', '/assets/luxmiyantra/laxmi 4-1200w.webp' ]`,
    newImages: `[ '/assets/Mangal yantra/image3.webp', '/assets/Mangal yantra/image1.webp', '/assets/Mangal yantra/image2.webp', '/assets/Mangal yantra/image4.webp', '/assets/luxmiyantra/laxmi 4-1200w.webp' ]`,
  },
  {
    id: 'brass-cup-jyot-diya',
    newMain: "/assets/Cup jyot/cup66.webp",
    oldImages: `[ '/assets/Cup jyot/cup 2.webp', '/assets/Cup jyot/akhand jyot cup 1.webp', '/assets/Cup jyot/cup 3.webp' ]`,
    newImages: `[ '/assets/Cup jyot/cup66.webp', '/assets/Cup jyot/cup 2.webp', '/assets/Cup jyot/akhand jyot cup 1.webp', '/assets/Cup jyot/cup 3.webp' ]`,
  },
];

let changed = 0;
updates.forEach(({ id, oldImages, newImages }) => {
  if (content.includes(oldImages)) {
    content = content.replace(oldImages, newImages);
    console.log(`✅ Updated images[0] for: ${id}`);
    changed++;
  } else {
    console.log(`❌ Could not find images array for: ${id} — may need manual check`);
  }
});

fs.writeFileSync('src/data/products.js', content, 'utf8');
console.log(`\nDone. ${changed}/${updates.length} products updated.`);
