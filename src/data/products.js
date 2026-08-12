export const CATEGORIES = [
  { id: 'all', name: 'All Collections' },
  { id: 'brass', name: 'Brass Articles', count: 17 },
  { id: 'copper', name: 'Copper Articles', count: 5 },
  { id: 'mandir-essentials', name: 'Mandir Essentials', count: 12 },
  { id: 'incense', name: 'Incense & Dhoop', count: 5 },
  { id: 'vastu', name: 'Vastu & Spiritual', count: 11 },
  { id: 'kits', name: 'Pooja Kits & Boxes', count: 1 },
  { id: 'yantras', name: 'Custom & Handcrafted', count: 3 }
];

export const PRODUCTS = [
  // 1. Garuda Headed Brass Bell
  {
    id: 'brass-bell-garuda',
    name: 'Sacred Garuda Headed Pure Virgin Brass Pooja Ghanti',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 1490,
    originalPrice: 1890,
    rating: 4.98,
    reviewsCount: 148,
    tag: 'Garuda Finial',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/garud bell/garduda 1.png',
    images: [
      '/assets/garud bell/garduda 1.png',
      '/assets/garud bell/garuda 2.png',
      '/assets/garud bell/garud 3.png',
      '/assets/garud bell/garuda 4.png'
    ],
    weightVariants: [
      { weight: '100 G', price: 490, originalPrice: 650 },
      { weight: '150 G', price: 690, originalPrice: 890 },
      { weight: '200 G', price: 890, originalPrice: 1150 },
      { weight: '250 G', price: 1190, originalPrice: 1490 },
      { weight: '300 G', price: 1490, originalPrice: 1890, default: true },
      { weight: '400 G', price: 1890, originalPrice: 2290 },
      { weight: '500 G', price: 2390, originalPrice: 2890 }
    ],
    purity: '100% Pure Virgin Lead-Free Brass',
    inStock: true,
    description: 'Handcrafted solid virgin brass pooja ghanti featuring a masterfully carved Lord Garuda finial handle. Hand-tuned clapper emits a high-frequency acoustic chime for temple and daily altar rituals.',
    specifications: [
      { label: 'Finial Type', value: 'Lord Garuda Sacred Motif' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' },
      { label: 'Gallery Included', value: '4 Full Angle Views' }
    ]
  },
  // 2. Nandi Headed Brass Bell
  {
    id: 'brass-bell-nandi',
    name: 'Sacred Nandi Headed Pure Virgin Brass Pooja Bell',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 1390,
    originalPrice: 1750,
    rating: 4.96,
    reviewsCount: 132,
    tag: 'Nandi Finial',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/nandi bell/nandi bell 1.jpg',
    images: [
      '/assets/nandi bell/nandi bell 1.jpg',
      '/assets/nandi bell/nandi bell 2.jpg',
      '/assets/nandi bell/nandi bell 3.png',
      '/assets/nandi bell/nandi 4.png',
      '/assets/nandi bell/nandi 5.png'
    ],
    weightVariants: [
      { weight: '100 G', price: 450, originalPrice: 600 },
      { weight: '150 G', price: 650, originalPrice: 850 },
      { weight: '200 G', price: 850, originalPrice: 1100 },
      { weight: '250 G', price: 1090, originalPrice: 1390 },
      { weight: '300 G', price: 1390, originalPrice: 1750, default: true },
      { weight: '400 G', price: 1790, originalPrice: 2190 },
      { weight: '500 G', price: 2250, originalPrice: 2690 }
    ],
    purity: '100% Pure Virgin Lead-Free Brass',
    inStock: true,
    description: 'Traditional sand-cast brass ghanti featuring the sacred Nandi Bull handle. Precision-tuned clapper produces a clear, long-vibrating acoustic frequency for home mandirs.',
    specifications: [
      { label: 'Finial Type', value: 'Sacred Nandi Bull Handle' },
      { label: 'Material', value: '100% Virgin Heavy Brass' },
      { label: 'Gallery Included', value: '5 Full Angle Views' }
    ]
  },
  // 3. Simple Traditional Brass Bell
  {
    id: 'brass-bell-simple',
    name: 'Classic Traditional Pure Virgin Brass Pooja Ghanti',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 990,
    originalPrice: 1290,
    rating: 4.92,
    reviewsCount: 165,
    tag: 'Classic Design',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/simple bell/simple bell 5.png',
    images: [
      '/assets/simple bell/simple bell 5.png',
      '/assets/simple bell/simple bell 4.png',
      '/assets/simple bell/simple bell 3.png',
      '/assets/simple bell/simple bell 1.jpg'
    ],
    weightVariants: [
      { weight: '100 G', price: 350, originalPrice: 490 },
      { weight: '150 G', price: 490, originalPrice: 650 },
      { weight: '200 G', price: 650, originalPrice: 850 },
      { weight: '250 G', price: 850, originalPrice: 1090 },
      { weight: '300 G', price: 990, originalPrice: 1290, default: true },
      { weight: '400 G', price: 1390, originalPrice: 1690 },
      { weight: '500 G', price: 1790, originalPrice: 2190 }
    ],
    purity: '100% Pure Virgin Lead-Free Brass',
    inStock: true,
    description: 'Timeless bell-shaped brass pooja ghanti with a heavy-weighted clapper. Ideal for daily morning and evening home altar rituals and auspicious chants.',
    specifications: [
      { label: 'Design Type', value: 'Classic Smooth Dome Bell' },
      { label: 'Material', value: '100% Virgin Brass' },
      { label: 'Gallery Included', value: '4 Full Angle Views' }
    ]
  },
  // 4. Carved Common Brass Headed Bell
  {
    id: 'brass-bell-carved',
    name: 'Royal Carved Brass Headed Masterpiece Temple Bell',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 1690,
    originalPrice: 2150,
    rating: 4.99,
    reviewsCount: 190,
    tag: 'Brass Headed',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/commonbell/brass bell 1.png',
    images: [
      '/assets/commonbell/brass bell 1.png',
      '/assets/commonbell/brass bell 2.png',
      '/assets/commonbell/brass bell 3.png',
      '/assets/commonbell/brass bell 4.png',
      '/assets/commonbell/brassbell 5.png'
    ],
    weightVariants: [
      { weight: '100 G', price: 550, originalPrice: 750 },
      { weight: '150 G', price: 790, originalPrice: 990 },
      { weight: '200 G', price: 1090, originalPrice: 1350 },
      { weight: '250 G', price: 1390, originalPrice: 1750 },
      { weight: '300 G', price: 1690, originalPrice: 2150, default: true },
      { weight: '400 G', price: 2190, originalPrice: 2650 },
      { weight: '500 G', price: 2690, originalPrice: 3250 }
    ],
    purity: 'Heavy Gauge Carved Brass',
    inStock: true,
    description: 'Elaborately hand-carved brass headed bell with intricate architectural motifs along the handle and sound dome. Heirloom acoustic resonance.',
    specifications: [
      { label: 'Finial Type', value: 'Carved Brass Head Handle' },
      { label: 'Material', value: 'Heavy Sand-Cast Brass' },
      { label: 'Gallery Included', value: '5 Full Angle Views' }
    ]
  },

  // 2. Brass Pooja Thali Set
  {
    id: 'brass-puja-thali-set',
    name: 'Sacred Hand-Engraved Pure Virgin Brass Puja Thali Ritual Set',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Puja Thali',
    price: 2190,
    originalPrice: 2790,
    rating: 4.99,
    reviewsCount: 195,
    tag: 'Brass Thali Set',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/Brass thali/thali 2.jpg',
    images: [
      '/assets/Brass thali/thali 2.jpg',
      '/assets/Brass thali/Brass thali.jpg',
      '/assets/Brass thali/thali 1.jpg',
      '/assets/Brass thali/thali 3.jpg',
      '/assets/Brass thali/thali 4.jpg'
    ],
    weightVariants: [
      { weight: '8 Inch (5 Pcs Set)', price: 1490, originalPrice: 1890 },
      { weight: '10 Inch (7 Pcs Set)', price: 2190, originalPrice: 2790, default: true },
      { weight: '12 Inch Royal Set', price: 3290, originalPrice: 3990 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Royal hand-engraved heavy virgin brass Puja Thali set complete with matched katori bowls, diya burner, bell, and incense holder. Sculpted with traditional Gayatri Mantra embossing.',
    specifications: [
      { label: 'Set Includes', value: 'Embossed Brass Thali, 2 Katoris, Diya, Ghanti & Agarbatti Stand' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' },
      { label: 'Finish', value: 'High Luster Hand Polished Luster' },
      { label: 'Gallery Included', value: '5 High-Resolution Full Angle Views' }
    ]
  },

  // 3. Peacock Brass Diya
  {
    id: 'saanjh-peacock-brass-diya',
    name: 'Saanjh Hand-Carved Peacock Pure Virgin Brass Diya',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Diyas',
    price: 1890,
    originalPrice: 2250,
    rating: 4.95,
    reviewsCount: 94,
    tag: 'Peacock Diya',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Brass aarti/Brass aarti 1.png',
    images: [
      '/assets/Brass aarti/Brass aarti 1.png',
      '/assets/Brass aarti/brass aarti 2.png',
      '/assets/Brass aarti/brass aarti 3.png',
      '/assets/Brass aarti/brass aarti 4.png'
    ],
    weightVariants: [
      { weight: 'Single Peacock Diya', price: 1890, originalPrice: 2250, default: true },
      { weight: 'Pair of Peacock Diyas', price: 3490, originalPrice: 4200 }
    ],
    purity: 'Lead-Free Pure Brass',
    inStock: true,
    description: 'An exquisite single-wick oil lamp featuring a sculpted royal peacock handle. Emits a warm, radiant flame that creates serene meditative shadows.',
    specifications: [
      { label: 'Material', value: 'Pure Brass (Lead-Free & Unadulterated)' },
      { label: 'Oil Capacity', value: '45 ml (approx. 4 hours burn time)' },
      { label: 'Weight', value: '680 grams' }
    ]
  },

  // 4. Brass Kapoor Aarti Diya
  {
    id: 'brass-aarti-kapoor-diya',
    name: 'Sacred Hand-Carved Pure Virgin Brass Kapoor Aarti Diya & Burner',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Aarti & Diyas',
    price: 1690,
    originalPrice: 2190,
    rating: 4.98,
    reviewsCount: 134,
    tag: 'Brass Aarti',
    artType: 'aarti',
    fitMode: 'contain',
    image: '/assets/Brass aarti/Aarti1.jpg',
    images: [
      '/assets/Brass aarti/Aarti1.jpg',
      '/assets/Brass aarti/aarti2.jpg',
      '/assets/Brass aarti/aarti 3.jpg',
      '/assets/Brass aarti/aarti 4.jpg'
    ],
    weightVariants: [
      { weight: 'Single Wick', price: 990, originalPrice: 1290 },
      { weight: '5 Wick Panch Aarti', price: 1690, originalPrice: 2190, default: true },
      { weight: '7 Wick Royal Aarti', price: 2490, originalPrice: 3190 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Hand-chased solid virgin brass Aarti burner featuring a heat-insulated carved handle, lotus wick wells, and camphor burner disc. Designed according to temple traditions for daily morning and evening Sandhya Aarti.',
    specifications: [
      { label: 'Aarti Type', value: 'Panch Aarti & Kapoor Burner' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' },
      { label: 'Handle', value: 'Heat-Insulated Ergonomic Brass Handle' }
    ]
  },

  // 5. Brass Akhand Jyot Deep
  {
    id: 'brass-akhand-jyot-deepak',
    name: 'Sacred Borosilicate Glass & Virgin Brass Akhand Jyot Deep',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Akhand Jyot',
    price: 1890,
    originalPrice: 2490,
    rating: 4.99,
    reviewsCount: 178,
    tag: 'Akhand Jyot',
    artType: 'jyot',
    fitMode: 'contain',
    image: '/assets/akhand jyot/akhand jyot 2.png',
    images: [
      '/assets/akhand jyot/akhand jyot 2.png',
      '/assets/akhand jyot/akhand jyot 1.png',
      '/assets/akhand jyot/akhand jyot 3.png',
      '/assets/akhand jyot/akhand jyot  size.png'
    ],
    weightVariants: [
      { weight: 'Small (10.5 cm)', price: 1290, originalPrice: 1690 },
      { weight: 'Medium (13.5 cm)', price: 1890, originalPrice: 2490, default: true },
      { weight: 'Large (16.5 cm)', price: 2690, originalPrice: 3290 }
    ],
    purity: 'Heat-Resistant Borosilicate Glass Chimney & Virgin Brass',
    inStock: true,
    description: 'Heavy virgin brass Akhand Jyot deepak with premium heat-resistant borosilicate glass chimney. Windproof design engineered for continuous 24-hour non-stop auspicious oil lamp lighting during Navratri and daily rituals.',
    specifications: [
      { label: 'Chimney Glass', value: 'Thermal Shock Resistant Borosilicate' },
      { label: 'Base & Cap', value: '100% Virgin Heavy Brass' },
      { label: 'Burn Duration', value: 'Up to 24 Hours Continuous Lighting' }
    ]
  },

  // 6. Brass Cup Jyot Diya
  {
    id: 'brass-cup-jyot-diya',
    name: 'Royal Bell Glass Chimney Pure Brass Cup Jyot Diya',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Akhand Jyot',
    price: 1490,
    originalPrice: 1990,
    rating: 4.96,
    reviewsCount: 122,
    tag: 'Cup Jyot',
    artType: 'jyot',
    fitMode: 'contain',
    image: '/assets/Cup jyot/cup 2.png',
    images: [
      '/assets/Cup jyot/cup 2.png',
      '/assets/Cup jyot/akhand jyot cup 1.png',
      '/assets/Cup jyot/cup 3.png'
    ],
    weightVariants: [
      { weight: 'Small Cup (8 cm)', price: 990, originalPrice: 1290 },
      { weight: 'Medium Cup (11 cm)', price: 1490, originalPrice: 1990, default: true },
      { weight: 'Large Cup (14 cm)', price: 2190, originalPrice: 2790 }
    ],
    purity: 'Solid Virgin Brass & Borosilicate Glass',
    inStock: true,
    description: 'Compact bell-shaped brass cup jyot with protective glass shield. Safe, flame-enclosed design preventing oil spills and wind extinction in home mandirs.',
    specifications: [
      { label: 'Design Type', value: 'Enclosed Cup Jyot Diya' },
      { label: 'Material', value: 'Heavy Virgin Brass & Glass Shield' }
    ]
  },

  // 7. Brass Rishi Kamandal
  {
    id: 'brass-kamandal-holy-water-pot',
    name: 'Sacred Hand-Chased Pure Virgin Brass Rishi Kamandal',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Sacred Ritual Vessels',
    price: 2490,
    originalPrice: 3190,
    rating: 4.98,
    reviewsCount: 146,
    tag: 'Brass Kamandal',
    artType: 'kamandal',
    fitMode: 'contain',
    image: '/assets/Brass kamandal/kamndal1.jpg',
    images: [
      '/assets/Brass kamandal/kamndal1.jpg',
      '/assets/Brass kamandal/Brass Kamndal.jpg',
      '/assets/Brass kamandal/kanmdal2.jpg',
      '/assets/Brass kamandal/kamndal 3.png',
      '/assets/Brass kamandal/kamndal 4.jpg',
      '/assets/Brass kamandal/kamndal 5.png'
    ],
    weightVariants: [
      { weight: '500 ML (0.5 L)', price: 1690, originalPrice: 2190 },
      { weight: '1 Litre (1.0 L)', price: 2490, originalPrice: 3190, default: true },
      { weight: '2 Litres (2.0 L)', price: 3890, originalPrice: 4690 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Traditional hand-chased solid virgin brass Kamandal vessel with an ergonomic arched handle, spouted neck, and protective brass lid. Handcrafted in Moradabad for storing sacred Gangajal, holy water, and Vedic ritual oblations.',
    specifications: [
      { label: 'Vessel Type', value: 'Vedic Spouted Rishi Kamandal' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' }
    ]
  },

  // 8. Brass Trishul
  {
    id: 'brass-trishul-with-damru',
    name: 'Sacred Lord Shiva Pure Virgin Brass Trishul with Damru',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Symbols & Statues',
    price: 2890,
    originalPrice: 3590,
    rating: 4.99,
    reviewsCount: 162,
    tag: 'Brass Trishul',
    artType: 'trishul',
    fitMode: 'contain',
    image: '/assets/Trishul with damru/trishul with damru1.png',
    images: [
      '/assets/Trishul with damru/trishul with damru1.png',
      '/assets/Trishul with damru/trishul with damru2.png',
      '/assets/Trishul/trishul 2.png',
      '/assets/Trishul/trishul 4.png'
    ],
    weightVariants: [
      { weight: '6 Inch Classic', price: 1490, originalPrice: 1890 },
      { weight: '9 Inch with Damru', price: 2890, originalPrice: 3590, default: true },
      { weight: '12 Inch Ornate Royal', price: 4290, originalPrice: 5190 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Masterfully hand-cast solid virgin brass Trishul featuring an intricately sculpted Damru drum, sacred Tripundra markings, and a heavy pedestal base.',
    specifications: [
      { label: 'Deity Symbol', value: 'Lord Shiva Trident & Sacred Damru' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' }
    ]
  },

  // 9. Standing Altar Trishul
  {
    id: 'brass-trishul-standing-emblem',
    name: 'Sacred Lord Shiva Pure Virgin Brass Standing Altar Trishul',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Symbols & Statues',
    price: 1890,
    originalPrice: 2490,
    rating: 4.98,
    reviewsCount: 145,
    tag: 'Standing Trishul',
    artType: 'trishul',
    fitMode: 'contain',
    image: '/assets/Trishul/trishul 2.png',
    images: [
      '/assets/Trishul/trishul 2.png',
      '/assets/Trishul/Trishul1.png',
      '/assets/Trishul/trihsul 3.png',
      '/assets/Trishul/trishul 4.png'
    ],
    weightVariants: [
      { weight: '6 Inch Altar Trishul', price: 1290, originalPrice: 1690 },
      { weight: '9 Inch Heavy Trishul', price: 1890, originalPrice: 2490, default: true },
      { weight: '12 Inch Temple Trishul', price: 2990, originalPrice: 3790 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Traditional solid virgin brass standing Trishul emblem with triple prongs and heavy round brass pedestal base for home mandir altars.',
    specifications: [
      { label: 'Deity Emblem', value: 'Lord Shiva Holy Trishul' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' },
      { label: 'Gallery Included', value: '4 Full Angle Views' }
    ]
  },

  // 9. Brass Gomukhi Shringi
  {
    id: 'brass-gomukhi-shringi-abhishekam',
    name: 'Sacred Hand-Carved Pure Virgin Brass Gomukhi Shringi Vessel',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Sacred Abhishekam Vessels',
    price: 1490,
    originalPrice: 1890,
    rating: 4.98,
    reviewsCount: 152,
    tag: 'Gomukhi Shringi',
    artType: 'gomukhi',
    fitMode: 'contain',
    image: '/assets/gomukhi/shringi 2.jpg',
    images: [
      '/assets/gomukhi/shringi 2.jpg',
      '/assets/gomukhi/shringi1.jpg',
      '/assets/gomukhi/shringi 3.jpg',
      '/assets/gomukhi/shringi 4.jpg'
    ],
    weightVariants: [
      { weight: 'Small (6 Inch)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (9 Inch)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Royal Large (12 Inch)', price: 2190, originalPrice: 2690 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Traditional hand-carved solid virgin brass Gomukhi Shringi (Cow-Face Cow Horn Vessel) designed for Shivling Abhishekam. Features fine cow-head spout detailing for pouring sacred water, milk, and Panchamrit during Rudrabhishekam rituals.',
    specifications: [
      { label: 'Ritual Function', value: 'Shivling Rudrabhishekam & Holy Water Pouring' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' }
    ]
  },

  // 10. Brass Simhasanam Throne
  {
    id: 'brass-singhasan-deity-throne',
    name: 'Royal Hand-Carved Pure Virgin Brass Simhasanam Deity Throne',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Sacred Altar Thrones',
    price: 2890,
    originalPrice: 3690,
    rating: 4.99,
    reviewsCount: 168,
    tag: 'Brass Singhasan',
    artType: 'singhasan',
    fitMode: 'contain',
    image: '/assets/singhasan/sighasan 1.jpg',
    images: [
      '/assets/singhasan/sighasan 1.jpg',
      '/assets/singhasan/sighasan 2.png',
      '/assets/singhasan/singhasan 3.png'
    ],
    weightVariants: [
      { weight: 'Small (4 Inch Idol Base)', price: 1890, originalPrice: 2390 },
      { weight: 'Medium (6 Inch Idol Base)', price: 2890, originalPrice: 3690, default: true },
      { weight: 'Royal Large (8 Inch Base)', price: 4290, originalPrice: 5190 }
    ],
    purity: '100% Solid Heavy Virgin Lead-Free Brass',
    inStock: true,
    description: 'Royal hand-carved solid virgin brass Simhasanam (Deity Throne) featuring an intricately sculpted Prabhavali arch, lion-carved legs, and sacred Chattra umbrella canopy. Crafted in Moradabad for home mandir idols and festival Altar worship.',
    specifications: [
      { label: 'Throne Structure', value: 'Sculpted Prabhavali Arch & Chattra Canopy' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' }
    ]
  },

  // 11. Laddu Gopal Brass Idol
  {
    id: 'brass-ladoo-gopal-statue',
    name: 'Sacred Hand-Carved Pure Virgin Brass Laddu Gopal Idol',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Idols',
    price: 1890,
    originalPrice: 2490,
    rating: 4.99,
    reviewsCount: 192,
    tag: 'Laddu Gopal Idol',
    artType: 'brass',
    fitMode: 'contain',
    image: '/assets/ladoo gopal/ladoogopal 2.png',
    images: [
      '/assets/ladoo gopal/ladoogopal 2.png',
      '/assets/ladoo gopal/ladoogopal4.png',
      '/assets/ladoo gopal/ladoogpal3.jpg',
      '/assets/ladoo gopal/ladoo5.png'
    ],
    weightVariants: [
      { weight: 'Size 0 (100 G - 2 Inch)', price: 890, originalPrice: 1190 },
      { weight: 'Size 1 (180 G - 2.5 Inch)', price: 1290, originalPrice: 1690 },
      { weight: 'Size 2 (300 G - 3 Inch)', price: 1890, originalPrice: 2490, default: true },
      { weight: 'Size 3 (500 G - 3.5 Inch)', price: 2590, originalPrice: 3290 },
      { weight: 'Size 4 (800 G - 4 Inch)', price: 3490, originalPrice: 4290 }
    ],
    purity: '100% Pure Virgin Lead-Free Solid Brass',
    inStock: true,
    description: 'Masterfully hand-carved pure virgin brass Laddu Gopal (Bal Gopal / Baby Krishna) idol featuring intricate facial engraving, smooth sacred luster, and solid hand-cast weight. Ideal for home mandir altar worship, daily rituals, and Janmashtami celebration.',
    specifications: [
      { label: 'Deity Motif', value: 'Bal Gopal / Sacred Baby Krishna' },
      { label: 'Material', value: '100% Lead-Free Virgin Heavy Brass' }
    ]
  },

  // 15B. Brass Kalash Pooja Vessel
  {
    id: 'brass-kalash-pooja-vessel',
    name: 'Sacred Pure Virgin Brass Pooja Kalash Vessel',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Kalash',
    price: 1390,
    originalPrice: 1790,
    rating: 4.98,
    reviewsCount: 145,
    tag: 'Pure Brass Kalash',
    artType: 'kalash',
    fitMode: 'contain',
    image: '/assets/brass kalash/kalash1.png',
    images: [
      '/assets/brass kalash/kalash1.png',
      '/assets/brass kalash/kalash2.png',
      '/assets/brass kalash/kalash3.png',
      '/assets/brass kalash/kalash4.png'
    ],
    weightVariants: [
      { weight: 'Small (300 ml)', price: 890, originalPrice: 1190 },
      { weight: 'Medium (500 ml)', price: 1390, originalPrice: 1790, default: true },
      { weight: 'Large (1 Liter)', price: 1990, originalPrice: 2490 },
      { weight: 'Royal Heavy (1.5 Liter)', price: 2690, originalPrice: 3290 }
    ],
    purity: '100% Pure Virgin Lead-Free Solid Brass',
    inStock: true,
    description: 'Handcrafted solid virgin brass Kalash (Purna Kumbha) vessel with smooth radiant luster and heavy weighted body. Designed according to traditional Vedic Shilpa Shastra for Kalash Sthapana, Griha Pravesh, Navratri puja, Varalakshmi vratham, and daily altar water offerings.',
    specifications: [
      { label: 'Vessel Type', value: 'Vedic Purna Kumbha Sacred Kalash' },
      { label: 'Material', value: '100% Virgin Lead-Free Brass' },
      { label: 'Crafting', value: 'Hand-Molded & Polished Artisanal Finish' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  },

  // 15C. Hand-Engraved Artisanal Brass Design Puja Thali Set
  {
    id: 'brass-design-thali-set',
    name: 'Hand-Engraved Artisanal Pure Virgin Brass Design Puja Thali Set',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Puja Thali',
    price: 2290,
    originalPrice: 2890,
    rating: 4.99,
    reviewsCount: 152,
    tag: 'Designer Brass Thali',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/brassdesign thali/design1.png',
    images: [
      '/assets/brassdesign thali/design1.png',
      '/assets/brassdesign thali/design 2.png',
      '/assets/brassdesign thali/design3.png',
      '/assets/brassdesign thali/design4.png'
    ],
    weightVariants: [
      { weight: '8 Inch Designer Thali', price: 1690, originalPrice: 2190 },
      { weight: '10 Inch Designer Thali Set', price: 2290, originalPrice: 2890, default: true },
      { weight: '12 Inch Royal Designer Thali Set', price: 3290, originalPrice: 3990 }
    ],
    purity: '100% Pure Virgin Lead-Free Solid Brass',
    inStock: true,
    description: 'Exquisitely hand-carved solid virgin brass design Puja Thali set featuring intricate traditional embossed artwork, ornate peacock & floral border etchings, and heavy gauge brass metal. Ideal for festival celebrations, daily mandir rituals, and auspicious Griha Pravesh gifting.',
    specifications: [
      { label: 'Thali Style', value: 'Artisanal Hand-Engraved Designer Motif' },
      { label: 'Material', value: '100% Virgin Lead-Free Heavy Brass' },
      { label: 'Crafting', value: 'Hand-Chased Precision Metalwork' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  },

  // 12. Copper Pitcher Set
  {
    id: 'shraviko-copper-01',
    name: 'Tamra Jal Hand-Hammered Pure Copper Pitcher & Glass Set',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Copper Vessels',
    price: 2850,
    originalPrice: 3400,
    rating: 4.97,
    reviewsCount: 88,
    tag: 'Pure Copper',
    artType: 'copper',
    fitMode: 'contain',
    image: '/assets/Copper cover.png',
    images: [
      '/assets/Copper cover.png'
    ],
    weightVariants: [
      { weight: '1.5L Pitcher + 2 Glasses', price: 2850, originalPrice: 3400, default: true },
      { weight: '1.5L Pitcher + 4 Glasses', price: 3650, originalPrice: 4400 }
    ],
    purity: '99.6% Certified Pure Copper',
    inStock: true,
    description: 'Hand-hammered pure copper pitcher (1.5L capacity) with two matching copper tumblers. Overnight water storage in copper promotes natural alkalinity and digestive harmony.',
    specifications: [
      { label: 'Purity Level', value: '99.6% Lab-Certified Virgin Copper' },
      { label: 'Capacity', value: 'Pitcher 1.5 Liters, Tumbler 300ml each' }
    ]
  },

  // 13. Copper Panchpatra Set
  {
    id: 'copper-panchpatra-pali-set',
    name: 'Sacred Tamra Pure Copper Panchapatra & Achamani Pali Set',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Copper Vessels',
    price: 1290,
    originalPrice: 1690,
    rating: 4.99,
    reviewsCount: 184,
    tag: 'Panchpatra Set',
    artType: 'panchapatra',
    fitMode: 'contain',
    image: '/assets/pancpatra set/patra 1.jpg',
    images: [
      '/assets/pancpatra set/patra 1.jpg',
      '/assets/pancpatra set/patra 2.jpg',
      '/assets/pancpatra set/patra3.jpg',
      '/assets/pancpatra set/patra 4.jpg',
      '/assets/pancpatra set/patra 4.png'
    ],
    weightVariants: [
      { weight: 'Standard Set (150 ml)', price: 890, originalPrice: 1190 },
      { weight: 'Medium Set (250 ml)', price: 1290, originalPrice: 1690, default: true },
      { weight: 'Royal Heavy Set (400 ml)', price: 1890, originalPrice: 2390 }
    ],
    purity: '99.6% Certified Uncoated Pure Copper',
    inStock: true,
    description: 'Traditional hand-hammered 99.6% pure copper Panchpatra tumbler with hand-crafted Achamani Pali spoon. Designed according to Vedic traditions for sanctified holy water offerings, Charanamrit, and puja Achamanam.',
    specifications: [
      { label: 'Set Contents', value: '1 Pure Copper Panchpatra Vessel + 1 Copper Pali Spoon' },
      { label: 'Material', value: '99.6% Certified Pure Uncoated Copper' }
    ]
  },

  // 14. Copper Puja Thali Set
  {
    id: 'copper-puja-thali-set',
    name: 'Sacred Tamra Hand-Hammered Pure Copper Puja Thali Set',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Copper Puja Thali',
    price: 2490,
    originalPrice: 3190,
    rating: 4.98,
    reviewsCount: 164,
    tag: 'Copper Thali Set',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/Copper thali/copperthali6.png',
    images: [
      '/assets/Copper thali/copperthali6.png',
      '/assets/Copper thali/copper thali 1.png',
      '/assets/Copper thali/copper thali1.png',
      '/assets/Copper thali/copper thali 2.png',
      '/assets/Copper thali/copper thali 3.jpg',
      '/assets/Copper thali/copper thali  5.png'
    ],
    weightVariants: [
      { weight: '9 Inch Set', price: 1790, originalPrice: 2290 },
      { weight: '11 Inch Set', price: 2490, originalPrice: 3190, default: true },
      { weight: '13 Inch Royal Set', price: 3690, originalPrice: 4490 }
    ],
    purity: '99.6% Certified Uncoated Pure Copper',
    inStock: true,
    description: 'Authentic hand-hammered pure copper Puja Thali set designed for holy Vedic offerings, Abhishekam, and daily morning temple rituals.',
    specifications: [
      { label: 'Set Type', value: '99.6% Pure Hammered Copper Altar Thali' },
      { label: 'Material', value: 'Certified Uncoated Pure Copper' }
    ]
  },

  // 15. Copper Hawan Kund
  {
    id: 'copper-hawan-kund-pyre',
    name: 'Sacred Tamra Hand-Hammered Pure Copper Hawan Kund Altar',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Sacred Homa Vessels',
    price: 2490,
    originalPrice: 3190,
    rating: 4.99,
    reviewsCount: 172,
    tag: 'Copper Hawan Kund',
    artType: 'hawankund',
    fitMode: 'contain',
    image: '/assets/hawankund/kund 1.jpg',
    images: [
      '/assets/hawankund/kund 1.jpg',
      '/assets/hawankund/kund 2.png',
      '/assets/hawankund/kund 3.png',
      '/assets/hawankund/kund 4.png'
    ],
    weightVariants: [
      { weight: 'Small (6 x 6 Inch)', price: 1490, originalPrice: 1890 },
      { weight: 'Medium (9 x 9 Inch)', price: 2490, originalPrice: 3190, default: true },
      { weight: 'Royal Large (12 x 12 Inch)', price: 3890, originalPrice: 4690 }
    ],
    purity: '99.6% Certified Uncoated Pure Copper',
    inStock: true,
    description: 'Heavy 99.6% pure copper Hawan Kund pyre featuring double copper ring handles, stepped pyramidal Yagna base, and heavy gauge copper walls. Designed according to Vedic Shilpa Shastra for sacred Homa rituals, Yajna, and Navratri Havans.',
    specifications: [
      { label: 'Pyre Structure', value: 'Traditional 3-Step Pyramidal Copper Kund' },
      { label: 'Material', value: '99.6% Certified Pure Uncoated Copper' }
    ]
  },

  // 15C. Copper Kalash Pooja Vessel
  {
    id: 'copper-kalash-pooja-vessel',
    name: 'Sacred Tamra Hand-Hammered Pure Copper Kalash Vessel',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Copper Kalash',
    price: 1490,
    originalPrice: 1890,
    rating: 4.99,
    reviewsCount: 168,
    tag: 'Pure Copper Kalash',
    artType: 'kalash',
    fitMode: 'contain',
    image: '/assets/Copperkalsh/copperkalsh1.png',
    images: [
      '/assets/Copperkalsh/copperkalsh1.png',
      '/assets/Copperkalsh/copperkalash2.png',
      '/assets/Copperkalsh/copperkalsh3.png',
      '/assets/Copperkalsh/copperkalsh5.png'
    ],
    weightVariants: [
      { weight: 'Small (300 ml)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (500 ml)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Large (1 Liter)', price: 2190, originalPrice: 2690 },
      { weight: 'Royal Heavy (1.5 Liter)', price: 2890, originalPrice: 3490 }
    ],
    purity: '99.6% Certified Pure Uncoated Copper',
    inStock: true,
    description: 'Authentic 99.6% lab-certified pure copper Kalash vessel (Tamra Jal Kumbh). Crafted with traditional hand-hammered finish for sacred altar water storage, Abhishekam rituals, Kalash Sthapana, and daily health-restorative Tamra Jal drinking.',
    specifications: [
      { label: 'Vessel Type', value: 'Vedic Tamra Jal Purna Kumbha' },
      { label: 'Material', value: '99.6% Certified Uncoated Pure Copper' },
      { label: 'Crafting', value: 'Hand-Hammered Traditional Texture' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  },

  // 16. Agarbatti (Without Bamboo)
  {
    id: 'incense-no-bamboo',
    name: '100% Organic Bamboo-Free Temple Agarbatti',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Agarbatti (Without Bamboo)',
    price: 149,
    originalPrice: 199,
    rating: 4.96,
    reviewsCount: 188,
    tag: 'Bamboo-Free',
    artType: 'incense',
    image: '/assets/Incense cover.jpg',
    weightVariants: [
      { weight: '50 Sticks Pack', price: 149, originalPrice: 199, default: true },
      { weight: '80 Sticks Pack', price: 219, originalPrice: 289 },
      { weight: '100 Sticks Pack', price: 269, originalPrice: 349 }
    ],
    purity: '100% Bamboo-Free & Charcoal-Free',
    inStock: true,
    description: '100% Natural organic temple flower incense sticks made without bamboo or charcoal. Eco-friendly and clean-burning for pure air and serene daily worship.',
    specifications: [
      { label: 'Bamboo Content', value: '0% Bamboo Core' },
      { label: 'Smoke', value: 'Low Smoke Natural Resin' }
    ]
  },

  // 17. Agarbatti (With Bamboo)
  {
    id: 'incense-with-bamboo',
    name: 'Traditional Sacred Temple Agarbatti Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Agarbatti (With Bamboo)',
    price: 129,
    originalPrice: 169,
    rating: 4.88,
    reviewsCount: 160,
    tag: 'Classic Scent',
    artType: 'incense',
    image: '/assets/Incense cover.jpg',
    weightVariants: [
      { weight: '50 Sticks Pack', price: 129, originalPrice: 169, default: true },
      { weight: '80 Sticks Pack', price: 189, originalPrice: 249 },
      { weight: '100 Sticks Pack', price: 229, originalPrice: 299 }
    ],
    purity: 'Natural Fragrance Oils & Herbal Gums',
    inStock: true,
    description: 'Traditional bamboo core agarbatti sticks crafted with sacred temple flower extracts, natural resins, and essential oils for long-lasting aroma.',
    specifications: [
      { label: 'Scent Notes', value: 'Mysore Sandalwood & Kashmiri Mogra' },
      { label: 'Burn Duration', value: 'Approx. 45 Mins per Stick' }
    ]
  },

  // 18. Natural Dhoop Cones
  {
    id: 'dhoop-cones',
    name: 'Sacred Natural Organic Dhoop Cones',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Dhoop Cones',
    price: 179,
    originalPrice: 229,
    rating: 4.94,
    reviewsCount: 220,
    tag: 'Natural Dhoop',
    artType: 'dhoop',
    image: '/assets/Incense cover.jpg',
    weightVariants: [
      { weight: '12 Cones Trial Pack', price: 99, originalPrice: 129 },
      { weight: '24 Cones Small Pack', price: 179, originalPrice: 229, default: true },
      { weight: '40 Cones Twin Pack (80 Cones)', price: 299, originalPrice: 399 },
      { weight: '50 Cones Retail Pack', price: 349, originalPrice: 449 },
      { weight: '100 Cones Value Box', price: 599, originalPrice: 799 },
      { weight: '200 Cones Family Tin Box', price: 999, originalPrice: 1399 }
    ],
    purity: 'Organic Sambrani & Ghee Cones',
    inStock: true,
    description: 'Organic dhoop cones made from recycled sacred temple flowers, natural tree resins, and pure Desi Ghee. Includes brass/ceramic burner disc.',
    specifications: [
      { label: 'Resin Type', value: 'Natural Guggal & Benzoin' },
      { label: 'Burn Time', value: 'Approx. 35 Mins per Cone' }
    ]
  },

  // 19. Charcoal-Free Dhoop Sticks
  {
    id: 'dhoop-sticks',
    name: 'Charcoal-Free Herbal Dhoop Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Dhoop Sticks',
    price: 249,
    originalPrice: 319,
    rating: 4.91,
    reviewsCount: 155,
    tag: 'Charcoal-Free',
    artType: 'dhoop',
    image: '/assets/Incense cover.jpg',
    weightVariants: [
      { weight: '20 Sticks Pack', price: 119, originalPrice: 149 },
      { weight: '50 Sticks Pack', price: 249, originalPrice: 319, default: true },
      { weight: '100 Sticks Value Box', price: 449, originalPrice: 599 }
    ],
    purity: '100% Charcoal-Free Dhoop Sticks',
    inStock: true,
    description: 'Thick herbal dhoop sticks made with Frankincense and Desi Ghee. Slow-burning for deep meditation and hawan rituals.',
    specifications: [
      { label: 'Formulation', value: '100% Herbal & Resin Derived' },
      { label: 'Burn Duration', value: '45 Mins per Stick' }
    ]
  },

  // 20. Loban & Sambrani Cups
  {
    id: 'sambrani-cups',
    name: 'Sacred Vedic Loban & Guggal Sambrani Cups',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Sambrani Cups',
    price: 199,
    originalPrice: 249,
    rating: 4.97,
    reviewsCount: 280,
    tag: 'Loban & Guggal',
    artType: 'dhoop',
    image: '/assets/Incense cover.jpg',
    weightVariants: [
      { weight: '12 Cups Pack', price: 199, originalPrice: 249, default: true },
      { weight: '24 Cups Pack', price: 349, originalPrice: 449 },
      { weight: '48 Cups Mega Pack', price: 599, originalPrice: 799 }
    ],
    purity: '100% Pure Natural Loban & Guggal Resin',
    inStock: true,
    description: 'Authentic ready-to-use Sambrani Dhoop Cups filled with pure natural Guggal, Benzoin, and Cow Ghee for home energy purification.',
    specifications: [
      { label: 'Contents', value: 'Charcoal Cup + Guggal & Loban Granules' },
      { label: 'Included Holder', value: 'Ceramic Fiber Fire Safety Plate' }
    ]
  },

  // 21. Wooden Chowki (Bajot)
  {
    id: 'wooden-chowki-carved-01',
    name: 'Sacred Hand-Carved Teakwood Pooja Wooden Chowki (Bajot)',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Wooden Chowki',
    price: 1890,
    originalPrice: 2490,
    rating: 4.98,
    reviewsCount: 124,
    tag: 'Pooja Chowki',
    artType: 'chowki',
    fitMode: 'contain',
    image: '/assets/Wooden Choki/chowki1.png',
    images: [
      '/assets/Wooden Choki/chowki1.png',
      '/assets/Wooden Choki/chowki 2.png',
      '/assets/Wooden Choki/chowki4.jpg',
      '/assets/Wooden Choki/chowki5.jpg',
      '/assets/Wooden Choki/chowki6.png'
    ],
    weightVariants: [
      { weight: '10 x 10 Inch Teakwood', price: 1290, originalPrice: 1690 },
      { weight: '12 x 12 Inch Teakwood', price: 1890, originalPrice: 2490, default: true },
      { weight: '12 x 12 Inch Meenakari Brass', price: 2190, originalPrice: 2790 },
      { weight: '15 x 15 Inch Royal Carved', price: 2690, originalPrice: 3290 }
    ],
    purity: '100% Solid Seasoned Teakwood & Brass Accents',
    inStock: true,
    description: 'Traditional hand-crafted wooden bajot/chowki carved from seasoned solid teakwood with golden brass inlay legs and auspicious floral motifs. Perfect for deity idols, kalash sthapana, and temple rituals.',
    specifications: [
      { label: 'Material', value: 'Solid Seasoned Teakwood' },
      { label: 'Craftsmanship', value: 'Hand-Carved with Brass Accents' },
      { label: 'Gallery Included', value: '5 High-Res Views' }
    ]
  },

  // 22. Brass Dhoopdani
  {
    id: 'brass-dhoopdani-burner',
    name: 'Sacred Handcrafted Pure Brass Dhoopdani Incense Burner',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Puja Accessories',
    price: 1290,
    originalPrice: 1690,
    rating: 4.96,
    reviewsCount: 185,
    tag: 'Brass Dhoopdani',
    artType: 'diffuser',
    fitMode: 'contain',
    image: '/assets/dhoop dani/dhoop dani 1.jpg',
    images: [
      '/assets/dhoop dani/dhoop dani 1.jpg',
      '/assets/dhoop dani/dhoop dani 2.jpg',
      '/assets/dhoop dani/dhoop dani 4.jpg',
      '/assets/dhoop dani/dhoop dani 5.jpg'
    ],
    weightVariants: [
      { weight: 'Small (150 G - 4 Inch)', price: 890, originalPrice: 1190 },
      { weight: 'Medium (280 G - 5.5 Inch)', price: 1290, originalPrice: 1690, default: true },
      { weight: 'Royal Large (450 G - 7 Inch)', price: 1890, originalPrice: 2390 }
    ],
    purity: '100% Solid Virgin Lead-Free Brass',
    inStock: true,
    description: 'Traditional handcrafted virgin brass Dhoopdani (sacred incense & dhoop burner) featuring a lattice jali lid and insulated handle. Perfect for burning dhoop cones, sambrani cups, guggal, and camphor to purify home energy.',
    specifications: [
      { label: 'Material', value: '100% Solid Heavy Lead-Free Virgin Brass' },
      { label: 'Design', value: 'Perforated Lattice Jali Lid + Insulated Handle' }
    ]
  },

  // 23. Brass Chawar Whisk
  {
    id: 'essentials-brass-chawar-whisk',
    name: 'Sacred Hand-Crafted Pure Brass Handle Chawar Whisk',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Mandir Essentials',
    price: 1490,
    originalPrice: 1890,
    rating: 4.99,
    reviewsCount: 168,
    tag: 'Sacred Chawar',
    artType: 'chawar',
    fitMode: 'contain',
    image: '/assets/chawar/Chawar.jpg',
    images: [
      '/assets/chawar/Chawar.jpg',
      '/assets/chawar/chawar 1.jpg',
      '/assets/chawar/chawar 2.jpg',
      '/assets/chawar/chawar 3.jpg',
      '/assets/chawar/chawr 4.png'
    ],
    weightVariants: [
      { weight: 'Small (12 Inch)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (18 Inch)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Royal Large (24 Inch)', price: 2190, originalPrice: 2690 }
    ],
    purity: 'Embossed Solid Brass Handle & Silky Soft Fibers',
    inStock: true,
    description: 'Sacred Royal Chawar whisk with hand-carved solid brass handle and silky soft white bristles. Used in temples and home altars for royal deity Seva and Aarti fan worship.',
    specifications: [
      { label: 'Handle Material', value: '100% Solid Heavy Brass' },
      { label: 'Bristles', value: 'Ultra-Soft Silky White Whisk Fibers' }
    ]
  },

  // 24. Jap Bag Gaumukhi
  {
    id: 'mandir-jap-bag-gaumukhi',
    name: 'Sacred Hand-Embroidered Pure Cotton Japa Mala Gaumukhi Bag',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Japa Bags & Pouches',
    price: 490,
    originalPrice: 690,
    rating: 4.99,
    reviewsCount: 215,
    tag: 'Sacred Japa Bag',
    artType: 'bag',
    fitMode: 'contain',
    image: '/assets/Jap Bag/Bag1.jpg',
    images: [
      '/assets/Jap Bag/Bag1.jpg',
      '/assets/Jap Bag/Japa Bag.jpg',
      '/assets/Jap Bag/bag2.png',
      '/assets/Jap Bag/bag3.png',
      '/assets/Jap Bag/bag4.png'
    ],
    weightVariants: [
      { weight: 'Single Pack (1 Pc)', price: 490, originalPrice: 690, default: true },
      { weight: 'Pack of 2 Bags', price: 890, originalPrice: 1290 },
      { weight: 'Gift Pack of 5 Bags', price: 1990, originalPrice: 2890 }
    ],
    purity: '100% Pure Organic Cotton with Silk Thread Embroidery',
    inStock: true,
    description: 'Traditional Gaumukhi shape Japa Mala pouch hand-stitched from 100% breathable organic cotton with Hare Krishna / Om embroidery and inner zipper pocket.',
    specifications: [
      { label: 'Bag Type', value: 'Vedic Gaumukhi Japa Mala Pouch' },
      { label: 'Material', value: '100% Organic Breathable Cotton' }
    ]
  },

  // 25. Mala Counter Set
  {
    id: 'mandir-mala-counter-brass',
    name: 'Royal Hand-Chased Pure Virgin Brass Japa Mala Counter Set',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Mala Counters',
    price: 690,
    originalPrice: 990,
    rating: 4.98,
    reviewsCount: 182,
    tag: 'Brass Mala Counter',
    artType: 'counter',
    fitMode: 'contain',
    image: '/assets/mala counter/malacover.png',
    images: [
      '/assets/mala counter/malacover.png',
      '/assets/mala counter/mala counter 1.jpg',
      '/assets/mala counter/mala counter 2.jpg',
      '/assets/mala counter/mala counter 3.jpg',
      '/assets/mala counter/mala counter 4.png'
    ],
    weightVariants: [
      { weight: 'Standard Pair (108 Bead Counter)', price: 690, originalPrice: 990, default: true },
      { weight: 'Deluxe Silver Plated Pair', price: 990, originalPrice: 1390 },
      { weight: 'Pack of 3 Pairs', price: 1790, originalPrice: 2490 }
    ],
    purity: 'Solid Virgin Brass & Silk Tassel Threads',
    inStock: true,
    description: 'Traditional hand-chased solid virgin brass Japa Mala tally counter pair featuring 10 counting beads per strand, Vajra/Bell finials, and red silk tassels.',
    specifications: [
      { label: 'Counter Mechanism', value: '10-Bead Dual Strand Tally Counter' },
      { label: 'Material', value: 'Solid Virgin Brass with Silk Tassels' }
    ]
  },

  // 26. Pooja Box Organizer Chest
  {
    id: 'mandir-pooja-box-chest',
    name: 'Sacred Hand-Carved Brass & Teakwood Pooja Box Organizer Chest',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Pooja Storage & Chests',
    price: 2490,
    originalPrice: 3190,
    rating: 4.99,
    reviewsCount: 196,
    tag: 'Pooja Box',
    artType: 'box',
    fitMode: 'contain',
    image: '/assets/Pooja box/poobjabox2.png',
    images: [
      '/assets/Pooja box/poobjabox2.png',
      '/assets/Pooja box/Pooja box.jpg',
      '/assets/Pooja box/poojabox1.jpg',
      '/assets/Pooja box/pooja box 3.jpg',
      '/assets/Pooja box/pooja box 4.png'
    ],
    weightVariants: [
      { weight: 'Standard Box (4 Compartments)', price: 1690, originalPrice: 2190 },
      { weight: 'Deluxe Chest (6 Compartments)', price: 2490, originalPrice: 3190, default: true },
      { weight: 'Royal Heritage Chest (9 Compartments)', price: 3890, originalPrice: 4690 }
    ],
    purity: 'Solid Teakwood & Hand-Embossed Brass Sheeting',
    inStock: true,
    description: 'Royal hand-crafted teakwood ritual storage box lined with embossed brass foil, velvet interior, and multi-compartment dividers.',
    specifications: [
      { label: 'Chest Material', value: 'Seasoned Teakwood & Hand-Embossed Brass' },
      { label: 'Interior', value: 'Velvet-Lined Divided Compartments' }
    ]
  },

  // 27. Velvet Pooja Asan Mat
  {
    id: 'mandir-royal-velvet-asan-mat',
    name: 'Sacred Royal Velvet Deity Pooja Asan Mat Cloth',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Pooja Asan Mats',
    price: 390,
    originalPrice: 590,
    rating: 4.97,
    reviewsCount: 142,
    tag: 'Velvet Asan',
    artType: 'asan',
    fitMode: 'contain',
    image: '/assets/Velvet asan/asan 1.png',
    images: [
      '/assets/Velvet asan/asan 1.png',
      '/assets/Velvet asan/asan 2.png',
      '/assets/Velvet asan/asan 3.png',
      '/assets/Velvet asan/asan 4.png'
    ],
    weightVariants: [
      { weight: '8 x 8 Inch Mat', price: 390, originalPrice: 590, default: true },
      { weight: '12 x 12 Inch Mat', price: 690, originalPrice: 990 },
      { weight: '18 x 18 Inch Mat', price: 1190, originalPrice: 1590 }
    ],
    purity: 'Heavy Micro-Velvet & Zari Embroidery',
    inStock: true,
    description: 'Sacred royal velvet deity mat with golden zari brocade lace border. Designed as an auspicious pedestal cloth for idols, chowkis, and thalis.',
    specifications: [
      { label: 'Brocade Work', value: 'Golden Zari Lace & Sequin Embroidery' },
      { label: 'Usage', value: 'Idol Throne Mat, Chowki Base, Mandir Altar' }
    ]
  },

  // 28. Ganesh Siddha Yantra Frame
  {
    id: 'vastu-ganesh-siddha-yantra',
    name: 'Sacred 24K Gold Plated Shri Ganesh Siddha Yantra Frame',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Yantras',
    price: 1890,
    originalPrice: 2490,
    rating: 4.99,
    reviewsCount: 185,
    tag: 'Ganesh Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/Ganeshyantra/Ganesh 1.png',
    images: [
      '/assets/Ganeshyantra/Ganesh 1.png',
      '/assets/Ganeshyantra/Ganesh2.png',
      '/assets/Ganeshyantra/ganesh 3.png',
      '/assets/Ganeshyantra/gNESH4.png'
    ],
    weightVariants: [
      { weight: 'Small (4 x 4 Inch Plate)', price: 1290, originalPrice: 1690 },
      { weight: 'Medium (6 x 6 Inch Plate)', price: 1890, originalPrice: 2490, default: true },
      { weight: 'Royal Large (9 x 9 Inch Framed)', price: 2990, originalPrice: 3890 }
    ],
    purity: '24K Gold Plated Solid Heavy Gauge Brass',
    inStock: true,
    description: 'Consecrated Vastu Ganesh Yantra micro-etched on 24K gold-plated brass plate. Removes obstacles (Vighnaharta), brings wisdom and prosperity.',
    specifications: [
      { label: 'Yantra Energy', value: 'Obstacle Removal & Wisdom Activation' },
      { label: 'Material', value: '24K Fine Gold Plated Heavy Brass Sheet' }
    ]
  },

  // 29. Kuber Dhan Prapti Yantra
  {
    id: 'vastu-kuber-dhan-prapti-yantra',
    name: 'Sacred 24K Gold Plated Kuber Dhan Prapti Vastu Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Wealth Yantras',
    price: 1990,
    originalPrice: 2590,
    rating: 5.0,
    reviewsCount: 230,
    tag: 'Kuber Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/Kuber yantra/kuber 1.png',
    images: [
      '/assets/Kuber yantra/kuber 1.png',
      '/assets/Kuber yantra/kuber 2.png',
      '/assets/Kuber yantra/kuber 3.png',
      '/assets/Kuber yantra/kuber4.png',
      '/assets/Kuber yantra/laxmi 4.jpg'
    ],
    weightVariants: [
      { weight: 'Small (4 x 4 Inch Plate)', price: 1390, originalPrice: 1790 },
      { weight: 'Medium (6 x 6 Inch Plate)', price: 1990, originalPrice: 2590, default: true },
      { weight: 'Royal Large (9 x 9 Inch Framed)', price: 3190, originalPrice: 3990 }
    ],
    purity: '24K Gold Plated Heavy Gauge Brass',
    inStock: true,
    description: 'Authentic Vedic Kuber Yantra sacred grid micro-engraved on 24K gold plated brass. Invokes Lord Kuber blessings for wealth attraction.',
    specifications: [
      { label: 'Yantra Energy', value: 'Wealth Manifestation & Treasury Protection' },
      { label: 'Material', value: '24K Fine Gold Plated Heavy Brass Sheet' }
    ]
  },

  // 30. Sampoorna Mahalakshmi Siddha Yantra Frame
  {
    id: 'vastu-laxmi-siddha-yantra',
    name: 'Sacred 24K Gold Plated Shri Sampoorna Mahalakshmi Siddha Yantra Frame',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Mahalakshmi Yantras',
    price: 2290,
    originalPrice: 2890,
    rating: 5.0,
    reviewsCount: 214,
    tag: 'Mahalakshmi Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/luxmiyantra/laxmi1.png',
    images: [
      '/assets/luxmiyantra/laxmi1.png',
      '/assets/luxmiyantra/laxmi 2.png',
      '/assets/luxmiyantra/luxmi3.png',
      '/assets/luxmiyantra/laxmi 4.jpg',
      '/assets/luxmiyantra/laxmi5.png'
    ],
    weightVariants: [
      { weight: 'Small (4 x 4 Inch Plate)', price: 1490, originalPrice: 1890 },
      { weight: 'Medium (6 x 6 Inch Plate)', price: 2290, originalPrice: 2890, default: true },
      { weight: 'Royal Large (9 x 9 Inch Framed)', price: 3490, originalPrice: 4290 }
    ],
    purity: '24K Gold Plated Heavy Gauge Solid Brass Sheet',
    inStock: true,
    description: 'Consecrated Sampoorna Mahalakshmi Vastu Yantra micro-engraved on 24K gold-plated brass plate. Invokes Goddess Mahalakshmi blessings for continuous prosperity and abundance.',
    specifications: [
      { label: 'Yantra Energy', value: 'Mahalakshmi Blessing & Abundance Activation' },
      { label: 'Material', value: '24K Fine Gold Plated Heavy Brass Sheet' }
    ]
  },

  // 31. Shani Dev Vastu Siddha Yantra Frame
  {
    id: 'vastu-shani-siddha-yantra',
    name: 'Sacred 24K Gold Plated Shri Shani Dev Vastu Siddha Yantra Frame',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Shani Yantras',
    price: 2190,
    originalPrice: 2790,
    rating: 5.0,
    reviewsCount: 184,
    tag: 'Shani Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/shani yantra/shani1.png',
    images: [
      '/assets/shani yantra/shani1.png',
      '/assets/shani yantra/shani3.png',
      '/assets/shani yantra/shani 4.png',
      '/assets/shani yantra/laxmi 4.jpg'
    ],
    weightVariants: [
      { weight: 'Small (4 x 4 Inch Plate)', price: 1390, originalPrice: 1790 },
      { weight: 'Medium (6 x 6 Inch Plate)', price: 2190, originalPrice: 2790, default: true },
      { weight: 'Royal Large (9 x 9 Inch Framed)', price: 3290, originalPrice: 4190 }
    ],
    purity: '24K Gold Plated Heavy Gauge Solid Brass Sheet',
    inStock: true,
    description: 'Consecrated 24K Gold-Plated Shri Shani Dev Vastu Siddha Yantra micro-etched on pure heavy-gauge brass. Alleviates Shani Sade Sati and restores karmic balance.',
    specifications: [
      { label: 'Yantra Energy', value: 'Saturn Protection & Sade Sati Relief' },
      { label: 'Material', value: '24K Fine Gold Plated Heavy Brass Sheet' }
    ]
  },

  // 32. Crystal Glass Sri Vastu Yantra Plaque
  {
    id: 'vastu-crystal-glass-yantra',
    name: 'Sacred Crystal Beveled Glass Sri Vastu Yantra Plaque',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Glass Yantras',
    price: 2190,
    originalPrice: 2790,
    rating: 4.98,
    reviewsCount: 162,
    tag: 'Glass Yantra',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/Glassyantra/Glass1.png',
    images: [
      '/assets/Glassyantra/Glass1.png',
      '/assets/Glassyantra/glass2.png',
      '/assets/Glassyantra/glass 3.png',
      '/assets/Glassyantra/glass4.png'
    ],
    weightVariants: [
      { weight: 'Medium (5 x 5 Inch Glass)', price: 1590, originalPrice: 1990 },
      { weight: 'Large (7 x 7 Inch Beveled Glass)', price: 2190, originalPrice: 2790, default: true },
      { weight: 'Executive Royal Stand Set', price: 3290, originalPrice: 4190 }
    ],
    purity: 'High-Transmission Beveled Optical Crystal Glass & Gold Foil',
    inStock: true,
    description: 'Precision laser-engraved 24K gold foil glass Vastu Yantra plaque crafted from crystal-clear optical glass to reflect positive energy.',
    specifications: [
      { label: 'Yantra Structure', value: 'Optically Pure Beveled Crystal Glass' },
      { label: 'Foil Plating', value: '24K Pure Gold Micro-Layered Inlay' }
    ]
  },

  // 33. Vastu Brass Pyramid
  {
    id: 'vastu-brass-pyramid-multitier',
    name: 'Sacred Vastu Multi-Grid Pure Brass Energy Pyramid',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Pyramids',
    price: 2490,
    originalPrice: 3190,
    rating: 4.98,
    reviewsCount: 148,
    tag: 'Vastu Energy',
    artType: 'pyramid',
    fitMode: 'contain',
    image: '/assets/pyramid/pyramid4.png',
    images: [
      '/assets/pyramid/pyramid4.png',
      '/assets/pyramid/pyramid1.png',
      '/assets/pyramid/pyramid2.png',
      '/assets/pyramid/pyramid 3.png'
    ],
    weightVariants: [
      { weight: '3 x 3 Inch', price: 1490, originalPrice: 1890 },
      { weight: '4 x 4 Inch', price: 2490, originalPrice: 3190, default: true },
      { weight: '6 x 6 Inch', price: 3890, originalPrice: 4690 }
    ],
    purity: '100% Solid Heavy Virgin Brass',
    inStock: true,
    description: 'Precision-engineered multi-grid Vastu brass pyramid designed according to sacred geometric proportions to neutralize directional doshas.',
    specifications: [
      { label: 'Geometry', value: 'Vedic 9-Grid Pyramid Yantra' },
      { label: 'Material', value: '100% Solid Virgin Brass' }
    ]
  },

  // 34. Crystal Glass Vastu Turtle
  {
    id: 'vastu-crystal-glass-turtle',
    name: 'Sacred Crystal Glass Vastu Tortoise (Kurma Yantra) with Plate',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Energy Items',
    price: 1490,
    originalPrice: 1890,
    rating: 4.97,
    reviewsCount: 178,
    tag: 'Vastu Kurma',
    artType: 'yantra',
    fitMode: 'contain',
    image: '/assets/glassturtle/Glass turtle 1.jpg',
    images: [
      '/assets/glassturtle/Glass turtle 1.jpg',
      '/assets/glassturtle/glass turtle 2.jpg',
      '/assets/glassturtle/turutle 3.jpg',
      '/assets/glassturtle/turtle4.jpg'
    ],
    weightVariants: [
      { weight: 'Small (3.5 Inch Glass Plate Set)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (5 Inch Crystal Glass Set)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Royal Large (7 Inch Heavy Crystal Set)', price: 2390, originalPrice: 2990 }
    ],
    purity: 'High-Transmission Beveled Optical Crystal Glass',
    inStock: true,
    description: 'Consecrated high-clarity crystal glass Vastu tortoise (Kurma) set with decorative glass water plate for stability, longevity, and wealth.',
    specifications: [
      { label: 'Vastu Symbol', value: 'Kurma Dev / Stability & Abundance' },
      { label: 'Material', value: 'Optical Grade Beveled Crystal Glass' }
    ]
  },

  // 35. Dakshinavarti Shankh
  {
    id: 'mandir-dakshinavarti-shankh',
    name: 'Sacred Natural Lakshmi Dakshinavarti Shankh (Right-Handed Conch)',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Sacred Conch Shells',
    price: 3490,
    originalPrice: 4290,
    rating: 4.99,
    reviewsCount: 245,
    tag: 'Dakshinavarti Shankh',
    artType: 'shankh',
    fitMode: 'contain',
    image: '/assets/Shankh/shankhD 2.jpg',
    images: [
      '/assets/Shankh/shankhD 2.jpg',
      '/assets/Shankh/ShankhD1.jpg',
      '/assets/Shankh/shankhD3.png',
      '/assets/Shankh/shankhD4.jpg',
      '/assets/Shankh/shankhD4.png'
    ],
    weightVariants: [
      { weight: 'Small (3 - 4 Inch)', price: 2190, originalPrice: 2790 },
      { weight: 'Medium (5 - 6 Inch)', price: 3490, originalPrice: 4290, default: true },
      { weight: 'Royal Large (7 - 8 Inch)', price: 5490, originalPrice: 6890 }
    ],
    purity: '100% Natural Consecrated Sea Conch Shell',
    inStock: true,
    description: 'Consecrated right-handed Valampuri Dakshinavarti Shankh associated with Goddess Lakshmi and Lord Vishnu. Attracts wealth and neutralizes Vastu flaws.',
    specifications: [
      { label: 'Conch Type', value: 'Valampuri Dakshinavarti (Right-Handed Spiral)' },
      { label: 'Material', value: '100% Natural Ocean Shell' }
    ]
  },

  // 36. Vamavarti Shankha
  {
    id: 'mandir-vamavarti-shankh',
    name: 'Sacred Blowing Vamavarti Shankha (Left-Handed Ritual Conch)',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Sacred Conch Shells',
    price: 1890,
    originalPrice: 2490,
    rating: 4.98,
    reviewsCount: 198,
    tag: 'Vamavarti Shankha',
    artType: 'shankh',
    fitMode: 'contain',
    image: '/assets/Shankh/ShankhV2.jpg',
    images: [
      '/assets/Shankh/ShankhV2.jpg',
      '/assets/Shankh/shankhV1.png',
      '/assets/Shankh/shankhV3.png',
      '/assets/Shankh/shankhV4.png'
    ],
    weightVariants: [
      { weight: 'Small Blowing (5 Inch)', price: 1290, originalPrice: 1690 },
      { weight: 'Loud Resonance Medium (7 Inch)', price: 1890, originalPrice: 2490, default: true },
      { weight: 'Temple Master Large (9 Inch)', price: 2890, originalPrice: 3590 }
    ],
    purity: '100% Natural High-Resonance Blowing Conch',
    inStock: true,
    description: 'Authentic left-handed Vamavarti Shankh engineered with smooth natural mouthpiece for easy blowing. Emits deep cosmic Om sound frequency.',
    specifications: [
      { label: 'Conch Type', value: 'Blowing Vamavarti (Left-Handed Spiral)' },
      { label: 'Sound Resonance', value: 'High-Pitch Om Frequency Sound' }
    ]
  },

  // 37. Kamdhenu Cow & Calf
  {
    id: 'brass-kamdhenu-cow-statue',
    name: 'Sacred Handcrafted Pure Virgin Brass Kamdhenu Cow & Calf Idol',
    category: 'yantras',
    categoryName: 'Custom & Handcrafted',
    subcategory: 'Handcrafted Idols',
    price: 2490,
    originalPrice: 3190,
    rating: 4.98,
    reviewsCount: 165,
    tag: 'Handcrafted Brass',
    artType: 'brass',
    fitMode: 'contain',
    image: '/assets/kamdhenu/kamdhenu1.jpg',
    images: [
      '/assets/kamdhenu/kamdhenu1.jpg',
      '/assets/kamdhenu/kamdhenu 2.jpg',
      '/assets/kamdhenu/kamdhenu 3.jpg',
      '/assets/kamdhenu/kamdhenu 4.jpg'
    ],
    weightVariants: [
      { weight: 'Small (250 G - 3.5 Inch)', price: 1490, originalPrice: 1890 },
      { weight: 'Medium (450 G - 5 Inch)', price: 2490, originalPrice: 3190, default: true },
      { weight: 'Royal Large (850 G - 7 Inch)', price: 3890, originalPrice: 4790 }
    ],
    purity: '100% Solid Virgin Lead-Free Brass',
    inStock: true,
    description: 'Hand-carved pure virgin brass Kamdhenu Cow and Calf (Gau Mata) idol. Symbolizes wish fulfillment, maternal protection, and Vastu harmony.',
    specifications: [
      { label: 'Deity Motif', value: 'Kamdhenu Sacred Wish-Fulfilling Cow & Calf' },
      { label: 'Material', value: '100% Solid Heavy Virgin Brass' }
    ]
  },

  // 38. Siddhi Vinayak Ganesh Ji
  {
    id: 'brass-ganesh-ji-statue',
    name: 'Sacred Handcrafted Pure Virgin Brass Siddhi Vinayak Ganesh Idol',
    category: 'yantras',
    categoryName: 'Custom & Handcrafted',
    subcategory: 'Handcrafted Idols',
    price: 2290,
    originalPrice: 2890,
    rating: 5.0,
    reviewsCount: 210,
    tag: 'Handcrafted Brass',
    artType: 'brass',
    fitMode: 'contain',
    image: '/assets/ganeshji/brassganesh4.jpg',
    images: [
      '/assets/ganeshji/brassganesh4.jpg',
      '/assets/ganeshji/brassganesh1.png',
      '/assets/ganeshji/brass ganesh2.jpg',
      '/assets/ganeshji/brassganesh3.png',
      '/assets/ganeshji/brassganesh5.png'
    ],
    weightVariants: [
      { weight: 'Small (200 G - 3 Inch)', price: 1390, originalPrice: 1790 },
      { weight: 'Medium (400 G - 4.5 Inch)', price: 2290, originalPrice: 2890, default: true },
      { weight: 'Royal Large (750 G - 6.5 Inch)', price: 3690, originalPrice: 4590 }
    ],
    purity: '100% Pure Virgin Lead-Free Brass',
    inStock: true,
    description: 'Handcrafted solid virgin brass Lord Siddhi Vinayak Ganesha idol with detailed trunk, halo aura, and bowl of modaks for obstacle removal.',
    specifications: [
      { label: 'Deity Motif', value: 'Lord Siddhi Vinayak Ganesha' },
      { label: 'Material', value: '100% Solid Heavy Lead-Free Virgin Brass' }
    ]
  },

  // 39. Radha Krishna Divine Idol
  {
    id: 'brass-radha-krishna-statue',
    name: 'Sacred Handcrafted Pure Virgin Brass Radha Krishna Divine Idol',
    category: 'yantras',
    categoryName: 'Custom & Handcrafted',
    subcategory: 'Handcrafted Idols',
    price: 2890,
    originalPrice: 3690,
    rating: 5.0,
    reviewsCount: 248,
    tag: 'Handcrafted Brass',
    artType: 'brass',
    fitMode: 'contain',
    image: '/assets/radhakrishna/krishna1.jpg',
    images: [
      '/assets/radhakrishna/krishna1.jpg',
      '/assets/radhakrishna/krishna2.png',
      '/assets/radhakrishna/krishna3.png',
      '/assets/radhakrishna/krishna4.png'
    ],
    weightVariants: [
      { weight: 'Small (300 G - 3.5 Inch)', price: 1790, originalPrice: 2290 },
      { weight: 'Medium (550 G - 5.5 Inch)', price: 2890, originalPrice: 3690, default: true },
      { weight: 'Royal Large (950 G - 7.5 Inch)', price: 4490, originalPrice: 5490 }
    ],
    purity: '100% Pure Virgin Lead-Free Solid Brass',
    inStock: true,
    description: 'Exquisitely hand-carved pure virgin brass Radha Krishna divine love idol with detailed flute, peacock feather, and ornate traditional garments.',
    specifications: [
      { label: 'Deity Motif', value: 'Divine Radha Krishna Pair' },
      { label: 'Material', value: '100% Solid Heavy Virgin Brass' }
    ]
  },

  // 40. Griha Pravesh Pooja Kit
  {
    id: 'shraviko-kit-01',
    name: 'Griha Pravesh & Shubh Aarambh Luxury Pooja Hamper',
    category: 'kits',
    categoryName: 'Pooja Kits',
    price: 5900,
    originalPrice: 7200,
    rating: 5.0,
    reviewsCount: 76,
    tag: 'Luxury Gift Box',
    artType: 'kit',
    image: '/assets/Pooja box/poojabox 1.png',
    images: [
      '/assets/Pooja box/poojabox 1.png',
      '/assets/Pooja box/poojabox 2.png',
      '/assets/Pooja box/poojabox 3.png',
      '/assets/Pooja box/poobjabox 4.png'
    ],
    weightVariants: [
      { weight: 'Standard Luxury Hamper', price: 5900, originalPrice: 7200, default: true },
      { weight: 'Royal Grand Hamper Set', price: 8500, originalPrice: 9900 }
    ],
    purity: 'Curated Heritage Collection',
    inStock: true,
    description: 'An auspicious ritual box designed for new home blessings, weddings, and milestones. Housed in an ivory & gold rigid velvet box with personalized gift card.',
    specifications: [
      { label: 'Contents', value: 'Brass Diya, Silver-Plated Bell, Organic Kumkum, Camphor, Incense Box, Brass Kalash, Cotton Wicks, Sacred Thread' }
    ]
  },

  // 41. Glass Shivling
  {
    id: 'vastu-crystal-glass-shivling',
    name: 'Sacred Optical Crystal Glass Shivling with Jaladhari Nandi Base',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Energy Items',
    price: 1690,
    originalPrice: 2190,
    rating: 4.99,
    reviewsCount: 175,
    tag: 'Glass Shivling',
    artType: 'shivling',
    fitMode: 'contain',
    image: '/assets/glass shivling/Glass shivling 1.jpg',
    images: [
      '/assets/glass shivling/Glass shivling 1.jpg',
      '/assets/glass shivling/glass shivling 2.jpg',
      '/assets/glass shivling/shivlin 3.jpg',
      '/assets/glass shivling/glass shivlingg 4.jpg',
      '/assets/glass shivling/shivling 5.jpg'
    ],
    weightVariants: [
      { weight: 'Small (3 Inch - 200 G)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (4.5 Inch - 450 G)', price: 1690, originalPrice: 2190, default: true },
      { weight: 'Royal Large (6 Inch - 850 G)', price: 2690, originalPrice: 3290 }
    ],
    purity: 'High-Transmission Beveled Optical Crystal Glass',
    inStock: true,
    description: 'Sacred optical-grade crystal glass Shivling featuring a precision-polished Jaladhari pedestal. Radiates divine cosmic light energy, neutralizes Vastu doshas, and brings peace, purity, and spiritual elevation to home altars.',
    specifications: [
      { label: 'Material', value: 'High-Purity Optical Beveled Crystal Glass' },
      { label: 'Ritual Function', value: 'Vastu Energy Harmonizer & Shivling Abhishekam' },
      { label: 'Gallery Included', value: '5 High-Resolution Full Angle Views' }
    ]
  },

  // 42. Panchmukhi Himalayan Rudraksha Mala
  {
    id: 'mandir-rudraksh-mala',
    name: 'Sacred Consecrated Panchmukhi Himalayan Rudraksha Japa Mala (108+1)',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Sacred Malas & Rosaries',
    price: 1290,
    originalPrice: 1690,
    rating: 4.99,
    reviewsCount: 245,
    tag: 'Rudraksha Mala',
    artType: 'mala',
    fitMode: 'contain',
    image: '/assets/Rudraksh Mala/rudraksh mala 1.png',
    images: [
      '/assets/Rudraksh Mala/rudraksh mala 1.png',
      '/assets/Rudraksh Mala/rudraksh 2.png',
      '/assets/Rudraksh Mala/rudraksh 6.png',
      '/assets/Rudraksh Mala/rudraksh mala 4.png'
    ],
    weightVariants: [
      { weight: '6mm (108+1 Small Beads)', price: 890, originalPrice: 1190 },
      { weight: '8mm (108+1 Standard Beads)', price: 1290, originalPrice: 1690, default: true },
      { weight: '10mm (108+1 Royal Heavy Beads)', price: 1890, originalPrice: 2390 }
    ],
    purity: '100% Certified Original Himalayan 5-Mukhi Rudraksha',
    inStock: true,
    description: 'Consecrated 5-Mukhi Himalayan Rudraksha Japa Mala with 108+1 bindu beads. Hand-knotted with silk thread for Japa meditation, Lord Shiva worship, and radiating protective electromagnetic energy.',
    specifications: [
      { label: 'Bead Count', value: '108 + 1 Sacred Bindu Guru Bead' },
      { label: 'Material', value: '100% Original Himalayan 5-Mukhi Rudraksha' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  },

  // 43. Natural Crystal Quartz Sphatik Mala
  {
    id: 'mandir-sphatik-mala',
    name: 'Sacred Natural Cool Quartz Sphatik Japa Mala (108+1 Beads)',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Sacred Malas & Rosaries',
    price: 1490,
    originalPrice: 1890,
    rating: 4.98,
    reviewsCount: 198,
    tag: 'Sphatik Mala',
    artType: 'mala',
    fitMode: 'contain',
    image: '/assets/Sphatik mala/sphatik 2.png',
    images: [
      '/assets/Sphatik mala/sphatik 2.png',
      '/assets/Sphatik mala/sphatik 1.jpg',
      '/assets/Sphatik mala/sphatik 3.jpg',
      '/assets/Sphatik mala/sphatik 4.png',
      '/assets/Sphatik mala/sphatik 5.png',
      '/assets/Sphatik mala/sphatik 6.png'
    ],
    weightVariants: [
      { weight: '6mm Diamond Cut (108+1)', price: 990, originalPrice: 1290 },
      { weight: '8mm Smooth Round (108+1)', price: 1490, originalPrice: 1890, default: true },
      { weight: '10mm Royal Crystal (108+1)', price: 2190, originalPrice: 2790 }
    ],
    purity: '100% Original High-Clarity Himalayan Sphatik Crystal',
    inStock: true,
    description: 'Natural clear quartz Sphatik (rock crystal) Japa Mala associated with Goddess Lakshmi and Lord Shiva. Cool to touch, enhances concentration, reduces body heat, and amplifies mantra vibrations.',
    specifications: [
      { label: 'Bead Count', value: '108 + 1 Crystal Guru Bead' },
      { label: 'Material', value: '100% High-Transmission Crystal Quartz' },
      { label: 'Gallery Included', value: '6 High-Resolution Full Angle Views' }
    ]
  },

  // 44. Vrindavan Dham Pure Organic Tulsi Mala
  {
    id: 'mandir-tulsi-mala',
    name: 'Sacred Vrindavan Dham Pure Organic Tulsi Kanthi & Japa Mala',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Sacred Malas & Rosaries',
    price: 690,
    originalPrice: 990,
    rating: 5.0,
    reviewsCount: 310,
    tag: 'Tulsi Mala',
    artType: 'mala',
    fitMode: 'contain',
    image: '/assets/Tulsi mala/tulsi mala.png',
    images: [
      '/assets/Tulsi mala/tulsi mala.png',
      '/assets/Tulsi mala/tulsi mala 1.jpg',
      '/assets/Tulsi mala/tulsi mala 2.png',
      '/assets/Tulsi mala/tulsi mala 3.jpg',
      '/assets/Tulsi mala/tulsi 5.png'
    ],
    weightVariants: [
      { weight: 'Single Round Neck Kanthi', price: 390, originalPrice: 590 },
      { weight: '2-Round Sacred Neck Kanthi', price: 590, originalPrice: 790 },
      { weight: '108+1 Bead Japa Mala (8mm)', price: 690, originalPrice: 990, default: true },
      { weight: '3-Round Heavy ISKCON Kanthi', price: 890, originalPrice: 1190 }
    ],
    purity: '100% Authentic Vrindavan Holy Tulsi Wood',
    inStock: true,
    description: 'Consecrated Vrindavan Tulsi wood Japa & Kanthi Mala. Sacred to Lord Vishnu and Lord Krishna, bringing aura protection, mind peace, and spiritual purity.',
    specifications: [
      { label: 'Origin', value: 'Authentic Vrindavan Dham Holy Basil Stem' },
      { label: 'Significance', value: 'Lord Krishna & Vishnu Devotional Protection' },
      { label: 'Gallery Included', value: '5 High-Resolution Full Angle Views' }
    ]
  },

  // 45. Natural White Seed Lord Krishna Vaijanti Mala
  {
    id: 'mandir-vaijanti-mala',
    name: 'Sacred Natural White Seed Lord Krishna Vaijanti Japa Mala',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Sacred Malas & Rosaries',
    price: 890,
    originalPrice: 1190,
    rating: 4.97,
    reviewsCount: 162,
    tag: 'Vaijanti Mala',
    artType: 'mala',
    fitMode: 'contain',
    image: '/assets/Vaijanti mala/vaijanti 1.jpg',
    images: [
      '/assets/Vaijanti mala/vaijanti 1.jpg',
      '/assets/Vaijanti mala/vaijanti 2.jpg',
      '/assets/Vaijanti mala/vaijant 4.png',
      '/assets/Vaijanti mala/vajainti 5.png'
    ],
    weightVariants: [
      { weight: 'Standard 108+1 Seed Mala', price: 890, originalPrice: 1190, default: true },
      { weight: 'Royal Heavy Threaded Mala', price: 1290, originalPrice: 1690 }
    ],
    purity: '100% Original Wild Braj Forest Vaijanti Seeds',
    inStock: true,
    description: 'Natural polished white Vaijanti seed rosary, the victory garland favored by Lord Krishna and Goddess Radha. Invokes victory, overcomes obstacles, and attracts positive energy.',
    specifications: [
      { label: 'Bead Material', value: '100% Natural Wild Vaijanti Seeds' },
      { label: 'Spiritual Symbol', value: 'Garland of Victory (Vaijayanti)' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  },

  // 46. Natural Black Ebony Wood Karungali Mala
  {
    id: 'mandir-karungali-mala',
    name: 'Sacred Natural Black Ebony Wood Karungali Japa & Wearing Mala',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Sacred Malas & Rosaries',
    price: 1590,
    originalPrice: 2190,
    rating: 4.99,
    reviewsCount: 215,
    tag: 'Karungali Mala',
    artType: 'mala',
    fitMode: 'contain',
    image: '/assets/Karungali mala/karungali 2.jpg',
    images: [
      '/assets/Karungali mala/karungali 2.jpg',
      '/assets/Karungali mala/karungali 3.jpg',
      '/assets/Karungali mala/karungali 5.png',
      '/assets/Karungali mala/karungali 6.png'
    ],
    weightVariants: [
      { weight: '6mm (108+1 Beads)', price: 1190, originalPrice: 1590 },
      { weight: '8mm (108+1 Beads)', price: 1590, originalPrice: 2190, default: true },
      { weight: '10mm Heavy Ebony (108+1)', price: 2290, originalPrice: 2890 }
    ],
    purity: '100% Original Pure Dense South Indian Karungali (Black Ebony Wood)',
    inStock: true,
    description: 'Authentic heavy dense Karungali (Black Ebony) wood mala sacred to Lord Murugan and Mars (Angaraka). Absorbs negative vibrations, bestows willpower, courage, health, and Vastu protection.',
    specifications: [
      { label: 'Wood Grade', value: '100% Natural Dense Black Ebony Karungali' },
      { label: 'Astrological Energy', value: 'Mars / Angaraka & Lord Murugan Protection' },
      { label: 'Gallery Included', value: '4 High-Resolution Full Angle Views' }
    ]
  }
];

export const FRAGRANCE_SAMPLERS = [
  { id: 'f1', name: 'Temple Sandalwood', notes: 'Woody • Warm • Sacred', desc: 'Sourced from Mysore groves, calming for deep meditation.' },
  { id: 'f2', name: 'Kashmir White Mogra', notes: 'Floral • Sweet • Serene', desc: 'Wild jasmine flowers harvested at midnight under full moon.' },
  { id: 'f3', name: 'Assam Royal Oudh', notes: 'Deep • Smoky • Luxurious', desc: 'Resinous agarwood creating an opulent spiritual atmosphere.' },
  { id: 'f4', name: 'Vedic Sambrani & Guggal', notes: 'Earthy • Herbal • Cleansing', desc: 'Ancient tree resins traditionally burned for home energy purification.' }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya Deshmukh',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    title: 'Breathtaking Craftsmanship & Weight!',
    review: 'I ordered the Astha Lakshmi Brass Pooja Thali for our new apartment. The solid weight, hand-etched details, and warm luster are beyond anything available in regular markets. It feels like an heirloom piece.',
    verified: true,
    productPurchased: 'Royal Astha Lakshmi Brass Pooja Thali Set'
  },
  {
    id: 2,
    name: 'Vikram & Radhika Sharma',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'The Incense is Truly Zero Smoke',
    review: 'Most commercial agarbattis give me headaches due to synthetic perfume and charcoal. Shraviko’s Temple Sandalwood incense has a gentle, soothing aroma that lingers softly without filling the room with black smoke.',
    verified: true,
    productPurchased: 'Vedic Sandalwood & Sacred Lotus Incense'
  },
  {
    id: 3,
    name: 'Priya Sundaram',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    title: 'Exquisite Gift Packaging',
    review: 'Sent the Griha Pravesh hamper to my brother in Delhi for his housewarming. He was stunned by the velvet presentation box and the purity of the pure brass diya and copper items.',
    verified: true,
    productPurchased: 'Griha Pravesh Luxury Pooja Hamper'
  }
];
