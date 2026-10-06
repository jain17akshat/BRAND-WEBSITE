const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'frontend', 'public', 'assets');
const unusedFolders = [
  'Bakhoor sticks',
  'Bhoog thali',
  'brass bells',
  'Brass dhoop dani',
  'Brass diyass set5',
  'Brass diyasss',
  'Brasshandle dhoop',
  "Camphor fly cone '",
  'Chandan Cup',
  'Cupdeepak',
  'Daimon akhand jyot',
  'footprints',
  'Glass Akhjand Jyot',
  'GlassAkahnd',
  'Guggl Cup',
  'Gulab Cups',
  'Kesar sticks',
  'Lavender sticks',
  'Lotus Akhand jyot',
  'OMtop Glass akhand jyot',
  'Oudh sticks',
  'Silver Footprints',
  'Spritual bell',
  'Stand diyas',
  'Steel dabi'
];

const folderDetails = {};

unusedFolders.forEach(folder => {
  const fullPath = path.join(assetsDir, folder);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    // Get main webp files (exclude responsive sizes like -400w, -800w, -1200w if main file exists)
    let webps = files.filter(f => f.endsWith('.webp') && !/-\d+w\.webp$/i.test(f));
    if (webps.length === 0) {
      // Fallback if only responsive webps exist
      webps = files.filter(f => f.endsWith('.webp'));
    }
    folderDetails[folder] = webps.map(w => `/assets/${folder}/${w}`);
  }
});

console.log(JSON.stringify(folderDetails, null, 2));
