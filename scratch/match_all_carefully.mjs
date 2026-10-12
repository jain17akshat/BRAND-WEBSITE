import fs from 'fs';

const csvProducts = JSON.parse(fs.readFileSync('scratch/csv_parsed.json', 'utf8'));
const webProducts = JSON.parse(fs.readFileSync('scratch/website_products.json', 'utf8'));

// Build explicit/domain mappings first, then fuzzy fallback
const explicitMap = {
  // Hawan / Samagri / Camphor
  'SHR-SS-01': 'mandir-samidha-wood',
  'SHR-BK-01': 'mandir-bhimseni-kapoor',
  'SHR-H-01': 'mandir-hawan-samagri',
  'SHR-CD-01': 'mandir-cow-dung-cake',
  'SH-G-15': 'sambrani-cups',
  
  // Incense / Dhoop / Stand
  'SHR-AS-01': 'stainless-steel-incense-holder',
  'SHR-DC-01': 'dhoop-cones',
  'SHR-MU-01': 'shraviko-musk-incense-sticks',
  'SHR-MG-01': 'shraviko-mogra-incense-sticks',
  'SHR-RSE-4': 'shraviko-rose-incense-sticks',
  'SHR-LAV-01': 'shraviko-lavender-incense-sticks',
  'SHR-CHN6': 'shraviko-sandalwood-incense-sticks',
  'SHR-KE-01': 'shraviko-kesar-incense-sticks',
  'SHR-OU-01': 'shraviko-oudh-incense-sticks',
  'SHR-BA-01': 'shraviko-bakhoor-incense-sticks',
  'SHR-FC-01': 'shraviko-chandan-camphor-fly-cone',
  'SHR-LFC-01': 'shraviko-lavender-camphor-fly-cone',
  'SHR-BD-01': 'brass-dhoopdani-burner',
  
  // Tilak / Oils / Sindoor / Camphor
  'SHR-KO-02': 'mandir-kesar-ashtagandha',
  'SHR-CO-01': 'mandir-safed-chandan',
  'SHR-SI-01': 'mandir-orange-sindoor',
  'SH-LAL-003': 'mandir-lal-chandan',
  'SH-KU-01': 'mandir-pure-camphor', // or kumkum if exists
  
  // Pads / Silver / Chowki
  'SHR-GF-01': 'shraviko-silver-footprints',
  'SHR-WC-01': 'wooden-chowki-carved-01',
  'SHR-CW-01': 'wooden-chowki-carved-01',
  
  // Malas
  'QH-Z85W-AUFO': 'mandir-tulsi-mala',
  'SHR-VJM-108-RD-36': 'mandir-vaijanti-mala',
  'SHR-KM-108-RD-01': 'mandir-karungali-mala',
  'SHR-RM-108-01': 'mandir-rudraksh-mala',
  'SHR-SM-108-01': 'mandir-sphatik-mala',
  'SHR-TC-COMP-WG-01': 'mandir-mala-counter-brass',
  'SHR-TC-01': 'mandir-mala-counter-brass',
  
  // Bells
  'SHR-SB-01': 'brass-bell-carved', // Kansa bell
  'SHR-PB-ROUND-04': 'brass-bell-simple',
  'SHR-GB-05IN-001': 'brass-bell-garuda',
  'SHR-NB-01': 'brass-bell-nandi',
  'SHR-MB-01': 'brass-bell-laddu-gopal',
  'SHR-PB-01': 'brass-aarti-bell-ghanti',
  
  // Diyas & Lamps
  'SHR-SD-02': 'brass-kerala-vilakku-diya',
  'SHR-KD-01': 'shraviko-peacock-brass-stand-diya',
  'SHR-LA-02': 'brass-lotus-diya',
  'SHR-AJ-01': 'brass-akhand-jyot-deepak',
  'SHR-AJD-BR-1324-01': 'brass-akhand-jyot-deepak',
  'SH-DI-01': 'crystal-lotus-diya',
  'SHR-DD-01': 'shraviko-brass-diya-set5',
  'SHR-DI-001': 'shraviko-brass-diya-set5',
  'SHR-C-01': 'shraviko-brass-cup-deepak',
  'SHR-GA-01': 'copper-garba-deepam',
  'SHR-AD-01': 'brass-aarti-kapoor-diya',
  'SHR-PMA-01': 'brass-punchmukhi-aarti',
  
  // Thalis & Vessels
  'SHR-BR-PT-06': 'brass-puja-thali-set',
  'L5-8YAV-16OD': 'copper-puja-thali-set',
  'SHR-BH-01': 'brass-design-thali-set',
  'SHR-PP-01': 'copper-panchpatra-pali-set',
  'SHR-HK-01': 'copper-hawan-kund-pyre',
  'SHR-CK-01': 'copper-kalash-pooja-vessel',
  'SHR-BK-02': 'brass-kalash-pooja-vessel',
  'SHR-KM-01': 'brass-kamandal-holy-water-pot',
  
  // Statues & Idols
  'SHR-KA-001': 'brass-kamdhenu-cow-statue',
  'SHR-LGI-BR-06-1P': 'brass-ladoo-gopal-statue',
  'SHR-RKI-BR-03X02X03-1P': 'brass-radha-krishna-statue',
  'SHR-GI-01': 'brass-ganesh-ji-statue',
  'SHR-SDT-01': 'brass-singhasan-deity-throne',
  
  // Yantras & Vastu
  'SHR-GS-SL-635-01': 'vastu-crystal-glass-shivling',
  'SHR-SYC-05': 'vastu-crystal-glass-yantra',
  'SHR-SYC-GL-04-1P': 'vastu-crystal-glass-yantra',
  'SHR-CGT-01': 'vastu-crystal-glass-turtle',
  'SHR-BP-01': 'vastu-brass-pyramid-multitier',
  'SHR-GY-01': 'vastu-ganesh-siddha-yantra',
  'SHR-KY-01': 'vastu-kuber-dhan-prapti-yantra',
  'SHR-LY-01': 'vastu-laxmi-siddha-yantra',
  'SHR-SY-01': 'vastu-shani-siddha-yantra',
  'SHR-MY-01': 'yantra-mangal',
  'SHR-SKSY-01': 'yantra-sarv-karya',
  'SHR-MMY-01': 'yantra-mahamrityunjaya',
  'IH-99GG-CHFF': 'yantra-kaal-sarp',
  'SHR-NY-03': 'yantra-navgraha',
  'SHR-BY-01': 'yantra-baglamukhi',
  'SHR-SY-02': 'yantra-saraswati',
  
  // Kits & Boxes
  'SHR-NK-1': 'navratri-pooja-kit',
  'SHR-PB-7C-15CM-01': 'mandir-pooja-box-chest',
  'SHR-DB-01': 'brass-mandir-dabbi',
  'SHR-SM-1': 'mandir-pooja-box-chest',
  'SHR-WD-01': 'mandir-wooden-damru-shiva',
};

// Check which CSV rows match using explicit map
console.log('Explicit mappings count:', Object.keys(explicitMap).length);

const matchedReport = [];
const unmappedCsv = [];

for (const c of csvProducts) {
  if (explicitMap[c.sku]) {
    const targetId = explicitMap[c.sku];
    const webP = webProducts.find(p => p.id === targetId);
    matchedReport.push({
      sku: c.sku,
      title: c.title,
      csvPrice: c.currentPrice,
      webId: targetId,
      webFound: !!webP,
      webName: webP ? webP.name : 'NOT FOUND IN PRODUCTS',
      webPrice: webP ? webP.price : null,
      webOriginalPrice: webP ? webP.originalPrice : null
    });
  } else {
    unmappedCsv.push(c);
  }
}

console.log(`Mapped via explicit map: ${matchedReport.length}`);
console.log(`Unmapped CSV rows: ${unmappedCsv.length}`);

fs.writeFileSync('scratch/mapped_explicit.json', JSON.stringify(matchedReport, null, 2), 'utf8');
fs.writeFileSync('scratch/unmapped_csv.json', JSON.stringify(unmappedCsv, null, 2), 'utf8');
