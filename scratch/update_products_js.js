const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsFilePath, 'utf8');

// Step 1: Update PNG/JPG in image paths to WEBP
content = content.replace(/(image[s]?:\s*(?:\[[^\]]+\]|'[^']+'))/g, (match) => {
  return match.replace(/\.png/gi, '.webp').replace(/\.jpg/gi, '.webp').replace(/\.jpeg/gi, '.webp');
});

// Also replace inside array elements if string matches .png or .jpg
content = content.replace(/(['"]\/assets\/[^'"]+)\.(png|jpg|jpeg)(['"])/gi, '$1.webp$3');

// Step 2: Remove isComingSoon from incense category
content = content.replace(
  /{\s*id:\s*'incense',\s*name:\s*'Incense & Dhoop',\s*count:\s*\d+,\s*isComingSoon:\s*true\s*}/g,
  "{ id: 'incense', name: 'Incense & Dhoop', count: 16 }"
);

// New products array definition
const newProducts = [
  // 1. Bakhoor Incense Sticks
  {
    id: 'shraviko-bakhoor-incense-sticks',
    name: 'Shraviko Premium Bakhoor Charcoal-Free Incense Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Incense Sticks',
    price: 249,
    originalPrice: 499,
    rating: 4.95,
    reviewsCount: 86,
    tag: 'Arabic Aroma',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Bakhoor sticks/Oudh1.webp',
    images: [
      '/assets/Bakhoor sticks/Oudh1.webp',
      '/assets/Bakhoor sticks/Oudh2.webp',
      '/assets/Bakhoor sticks/Oudh3.webp',
      '/assets/Bakhoor sticks/Oudh4.webp',
      '/assets/Bakhoor sticks/Oudh5.webp'
    ],
    purity: '100% Charcoal-Free Organic Flora',
    inStock: true,
    description: 'Immerse your home in the captivating scent of traditional Middle Eastern Bakhoor with Shraviko Premium Bakhoor Incense Sticks. Hand-rolled using natural essential oils, flower petals, and aromatic woods, these charcoal-free sticks release a warm, spicy, and woody aroma that calms the mind and purifies the atmosphere for worship and meditation.',
    specifications: [
      { label: 'Fragrance', value: 'Bakhoor Oudh' },
      { label: 'Type', value: 'Charcoal-Free Bamboo Sticks' },
      { label: 'Burn Time', value: '45-50 Minutes per stick' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Authentic rich Bakhoor aroma',
      '100% charcoal-free clean burn',
      'Relieves stress & anxiety',
      'Ideal for evening prayers & relaxation'
    ]
  },
  // 2. Kesar Incense Sticks
  {
    id: 'shraviko-kesar-incense-sticks',
    name: 'Shraviko Kesar Chandan Natural Incense Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Incense Sticks',
    price: 229,
    originalPrice: 449,
    rating: 4.96,
    reviewsCount: 94,
    tag: 'Saffron Fragrance',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Kesar sticks/Kesar1.webp',
    images: [
      '/assets/Kesar sticks/Kesar1.webp',
      '/assets/Kesar sticks/11a6d1ca-fb66-4ffa-80a0-5607d00b6e00.webp',
      '/assets/Kesar sticks/2fddb686-b57b-4313-805e-aedd15f6d406.webp',
      '/assets/Kesar sticks/4e1a0a4a-2438-47e0-b636-7a3346ee9010.webp'
    ],
    purity: '100% Pure Saffron & Chandan',
    inStock: true,
    description: 'Experience divine purity with Shraviko Kesar Chandan Natural Incense Sticks. Infused with pure Kashmiri saffron extract and white sandalwood powder, these sticks produce a sweet, uplifting fragrance that invokes positive vibrations and spiritual harmony during daily rituals.',
    specifications: [
      { label: 'Fragrance', value: 'Kesar Chandan (Saffron & Sandalwood)' },
      { label: 'Type', value: 'Natural Flora Incense Sticks' },
      { label: 'Burn Time', value: '45 Minutes per stick' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Enriched with real saffron & sandalwood notes',
      'Non-toxic and eco-friendly',
      'Enhances concentration during meditation',
      'Fills large spaces with sweet divine aroma'
    ]
  },
  // 3. Lavender Incense Sticks
  {
    id: 'shraviko-lavender-incense-sticks',
    name: 'Shraviko Relaxing French Lavender Incense Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Incense Sticks',
    price: 219,
    originalPrice: 399,
    rating: 4.92,
    reviewsCount: 72,
    tag: 'Soothing Aroma',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Lavender sticks/Lavender 1.webp',
    images: [
      '/assets/Lavender sticks/Lavender 1.webp',
      '/assets/Lavender sticks/Lavender 2.webp',
      '/assets/Lavender sticks/Lavender 3.webp',
      '/assets/Lavender sticks/Lavender 4.webp',
      '/assets/Lavender sticks/Lavender 5.webp',
      '/assets/Lavender sticks/Comparison.webp'
    ],
    purity: '100% Organic Floral Essential Oils',
    inStock: true,
    description: 'Calm your senses and create a peaceful sanctuary with Shraviko Relaxing French Lavender Incense Sticks. Crafted with pure lavender essential oils, these sticks deliver a soothing floral fragrance perfect for evening prayers, bedtime relaxation, yoga, and aromatherapy.',
    specifications: [
      { label: 'Fragrance', value: 'French Lavender' },
      { label: 'Type', value: 'Organic Incense Sticks' },
      { label: 'Burn Time', value: '45-50 Minutes' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Natural lavender essential oil infusion',
      'Promotes peaceful sleep & stress relief',
      'Low smoke, non-irritating formula',
      'Perfect for daily mador & yoga session'
    ]
  },
  // 4. Oudh Incense Sticks
  {
    id: 'shraviko-oudh-incense-sticks',
    name: 'Shraviko Royal Regal Oudh Incense Sticks',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Incense Sticks',
    price: 269,
    originalPrice: 549,
    rating: 4.97,
    reviewsCount: 110,
    tag: 'Royal Fragrance',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Oudh sticks/Oudh1.webp',
    images: [
      '/assets/Oudh sticks/Oudh1.webp',
      '/assets/Oudh sticks/Oudh2.webp',
      '/assets/Oudh sticks/Oudh3.webp',
      '/assets/Oudh sticks/Oudh4.webp',
      '/assets/Oudh sticks/Oudh5.webp'
    ],
    purity: '100% Pure Agarwood Oudh Extract',
    inStock: true,
    description: 'Indulge in luxury devotion with Shraviko Royal Regal Oudh Incense Sticks. Blended with deep agarwood resin extracts and oriental spices, these incense sticks emit a deep, majestic scent that elevates any sacred space into an opulent temple experience.',
    specifications: [
      { label: 'Fragrance', value: 'Regal Agarwood Oudh' },
      { label: 'Type', value: 'Charcoal-Free Premium Sticks' },
      { label: 'Burn Time', value: '50 Minutes' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Rich, long-lasting agarwood scent',
      'Purifies aura and dispels negative energy',
      'Handcrafted with natural botanical resins',
      'Includes ceramic incense stand'
    ]
  },
  // 5. Chandan Dhoop Cups
  {
    id: 'shraviko-chandan-dhoop-cups',
    name: 'Shraviko Organic Chandan Sambrani Dhoop Cups',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Dhoop Cups',
    price: 299,
    originalPrice: 599,
    rating: 4.98,
    reviewsCount: 124,
    tag: 'Pure Sandalwood',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Chandan Cup/ChandanCup1.webp',
    images: [
      '/assets/Chandan Cup/ChandanCup1.webp',
      '/assets/Chandan Cup/ChandanCup2.webp',
      '/assets/Chandan Cup/Chandan3.webp',
      '/assets/Chandan Cup/Chandan4.webp',
      '/assets/Chandan Cup/Chandan5.webp',
      '/assets/Chandan Cup/Chandan6.webp'
    ],
    purity: '100% Organic Cow Dung & Chandan',
    inStock: true,
    description: 'Fill your sacred space with divine fragrance using Shraviko Organic Chandan Sambrani Dhoop Cups. Formulated with authentic Mysore sandalwood powder, natural resins, and organic havan herbs inside a natural cup, these dhoop cups burn cleanly to spread soothing, spiritual vibrations.',
    specifications: [
      { label: 'Material', value: 'Organic Herbs, Loban & Chandan Resin' },
      { label: 'Quantity', value: '12 Cups per box with Burner Plate' },
      { label: 'Burn Time', value: '30-35 Minutes per cup' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      '100% natural, chemical-free composition',
      'Traditional havan samagri aroma inside cup',
      'Purifies indoor air and drives away negative vibes',
      'Includes metal/ceramic burner plate'
    ]
  },
  // 6. Guggul Dhoop Cups
  {
    id: 'shraviko-guggul-dhoop-cups',
    name: 'Shraviko Sacred Pure Guggul Dhoop Cups',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Dhoop Cups',
    price: 299,
    originalPrice: 599,
    rating: 4.97,
    reviewsCount: 115,
    tag: 'Sacred Guggul',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Guggl Cup/Cup11.webp',
    images: [
      '/assets/Guggl Cup/Cup11.webp',
      '/assets/Guggl Cup/Cup2.webp',
      '/assets/Guggl Cup/Cup3.webp',
      '/assets/Guggl Cup/Cup4.webp',
      '/assets/Guggl Cup/Cup5.webp'
    ],
    purity: '100% Natural Shuddh Guggul Resin',
    inStock: true,
    description: 'Worship with the potent cleansing energy of Shraviko Sacred Pure Guggul Dhoop Cups. Packed with raw shuddh guggul resin and natural herbs, these dhoop cups generate rich holy smoke that cleanses the environment of stagnant energy and leaves a traditional mandir fragrance.',
    specifications: [
      { label: 'Key Ingredient', value: 'Pure Himalayan Shuddh Guggul' },
      { label: 'Quantity', value: '12 Cups with Metal Holder' },
      { label: 'Burn Time', value: '30-35 Minutes' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Potent protective & air-purifying properties',
      'Used traditionally in daily morning & evening Hawan',
      'Rich smoke cleanses corners of home',
      'Eco-friendly biodegradable cup structure'
    ]
  },
  // 7. Rose (Gulab) Dhoop Cups
  {
    id: 'shraviko-rose-dhoop-cups',
    name: 'Shraviko Divine Gulab (Rose) Organic Dhoop Cups',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Dhoop Cups',
    price: 299,
    originalPrice: 599,
    rating: 4.94,
    reviewsCount: 89,
    tag: 'Fresh Rose',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Gulab Cups/Gulab1.webp',
    images: [
      '/assets/Gulab Cups/Gulab1.webp',
      '/assets/Gulab Cups/Gulab2.webp',
      '/assets/Gulab Cups/Gulab3.webp',
      '/assets/Gulab Cups/Gulab4.webp',
      '/assets/Gulab Cups/Gulab5.webp'
    ],
    purity: '100% Fresh Desi Gulab Petals',
    inStock: true,
    description: 'Evoke love, devotion, and tranquility with Shraviko Divine Gulab Dhoop Cups. Made with real Indian rose petal extracts and aromatic botanical gums, these dhoop cups produce a delicate floral perfume that creates a serene atmosphere for prayer.',
    specifications: [
      { label: 'Fragrance', value: 'Desi Gulab (Rose)' },
      { label: 'Quantity', value: '12 Organic Dhoop Cups' },
      { label: 'Burn Time', value: '30-35 Minutes' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Natural rose extract fragrance',
      'Relieves stress & promotes calm mood',
      'Chemical-free natural cup formulation',
      'Perfect for temple offerings & evening puja'
    ]
  },
  // 8. Chandan Camphor Fly Cone
  {
    id: 'shraviko-chandan-camphor-fly-cone',
    name: 'Shraviko Natural Chandan Camphor Air Purifying Fly Cones',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Camphor Cones',
    price: 349,
    originalPrice: 699,
    rating: 4.99,
    reviewsCount: 142,
    tag: 'Camphor & Chandan',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Camphor fly cone \'/flycone1.webp',
    images: [
      '/assets/Camphor fly cone \'/flycone1.webp',
      '/assets/Camphor fly cone \'/Fly2.webp',
      '/assets/Camphor fly cone \'/fly3.webp',
      '/assets/Camphor fly cone \'/fly4.webp',
      '/assets/Camphor fly cone \'/fly5.webp',
      '/assets/Camphor fly cone \'/Fly6.webp'
    ],
    purity: '100% Pure Bhimseni Kapoor & Chandan Oil',
    inStock: true,
    description: 'Keep flies, mosquitoes, and stale odors away naturally with Shraviko Natural Chandan Camphor Fly Cones. Infused with therapeutic-grade Bhimseni camphor and sandalwood oil, these hanging aromatic cones diffuse a powerful clarifying aroma continuously into your living space, mandir, or car.',
    specifications: [
      { label: 'Key Ingredients', value: 'Pure Bhimseni Camphor & Sandalwood Essential Oil' },
      { label: 'Duration', value: 'Diffuses up to 45 Days' },
      { label: 'Usage', value: 'Hanging Cone for Mandir, Rooms, Wardrobe & Car' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Dual action: repels insects & purifies room air',
      'Made with 100% natural camphor crystals',
      'Woody sandalwood scent creates calming vibe',
      'No electricity or flame needed'
    ]
  },
  // 9. Lavender Camphor Fly Cone
  {
    id: 'shraviko-lavender-camphor-fly-cone',
    name: 'Shraviko Natural Lavender Camphor Air Purifying Fly Cones',
    category: 'incense',
    categoryName: 'Incense & Dhoop',
    subcategory: 'Camphor Cones',
    price: 349,
    originalPrice: 699,
    rating: 4.98,
    reviewsCount: 138,
    tag: 'Camphor & Lavender',
    artType: 'incense',
    fitMode: 'contain',
    image: '/assets/Camphor fly cone \'/LAVfly1.webp',
    images: [
      '/assets/Camphor fly cone \'/LAVfly1.webp',
      '/assets/Camphor fly cone \'/Lav2.webp',
      '/assets/Camphor fly cone \'/Lav3.webp',
      '/assets/Camphor fly cone \'/Lav4.webp',
      '/assets/Camphor fly cone \'/LAv5.webp',
      '/assets/Camphor fly cone \'/lav6.webp'
    ],
    purity: '100% Pure Camphor & Lavender Essential Oil',
    inStock: true,
    description: 'Transform your indoor air while driving away pests with Shraviko Natural Lavender Camphor Fly Cones. Combining volatile pure camphor crystals with soothing French lavender oils, this hanging air freshener cone cleanses negative energy and maintains a fragrant environment without synthetic chemicals.',
    specifications: [
      { label: 'Key Ingredients', value: 'Pure Camphor & Lavender Oil' },
      { label: 'Duration', value: 'Diffuses up to 45 Days' },
      { label: 'Placement', value: 'Home, Pooja Room, Closet, Car' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Natural fly & pest repellent',
      'Soothing lavender fragrance relaxes mind',
      'Long-lasting aroma diffusion',
      '100% organic and child-safe'
    ]
  },
  // 10. Heavy Brass Dhoop Dani
  {
    id: 'shraviko-brass-dhoop-dani',
    name: 'Shraviko Traditional Heavy Brass Dhoop Dani Incense Burner',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Puja Accessories',
    price: 899,
    originalPrice: 1799,
    rating: 4.96,
    reviewsCount: 104,
    tag: 'Solid Brass',
    artType: 'diffuser',
    fitMode: 'contain',
    image: '/assets/Brass dhoop dani/0b1b19be-fb02-45fd-bad2-bfbe7a87e59b.webp',
    images: [
      '/assets/Brass dhoop dani/0b1b19be-fb02-45fd-bad2-bfbe7a87e59b.webp',
      '/assets/Brass dhoop dani/17e5d263-fb71-4aa0-ba11-923f64069f9e.webp',
      '/assets/Brass dhoop dani/94d9b4b9-3734-44ed-a7fc-4e92a8b3db2a.webp',
      '/assets/Brass dhoop dani/bb56e72c-be99-4ff8-86d3-bf5fcac09b8a.webp',
      '/assets/Brass dhoop dani/c1fa4ff7-fce1-460d-a342-990e66c4fb25.webp'
    ],
    purity: '100% Solid Heavy Brass',
    inStock: true,
    description: 'Elevate your daily ritual of burning dhoop, loban, and camphor with Shraviko Traditional Heavy Brass Dhoop Dani. Crafted from pure thick brass with exquisite traditional cut-out work, this sturdy burner allows smoke to billow gracefully while protecting surfaces from heat.',
    specifications: [
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Finish', value: 'Golden Antique Polish' },
      { label: 'Suitable For', value: 'Dhoop Cones, Loban, Camphor & Resin Burning' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Heavy-gauge heat resistant brass body',
      'Artisanal lattice lid for uniform smoke dispersion',
      'Sturdy pedestal base prevents tabletop burning',
      'Easy to clean and maintain'
    ]
  },
  // 11. Brass Handle Dhoop Burner
  {
    id: 'shraviko-brass-handle-dhoop',
    name: 'Shraviko Handled Brass Dhoop Dani & Aarti Burner',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Puja Accessories',
    price: 799,
    originalPrice: 1499,
    rating: 4.94,
    reviewsCount: 88,
    tag: 'Handled Burner',
    artType: 'diffuser',
    fitMode: 'contain',
    image: '/assets/Brasshandle dhoop/14337c71-2e35-4a53-aa8d-85a9d74465c9.webp',
    images: [
      '/assets/Brasshandle dhoop/14337c71-2e35-4a53-aa8d-85a9d74465c9.webp',
      '/assets/Brasshandle dhoop/2fe6aebb-ad87-41a2-9499-2711b38b4ba5.webp',
      '/assets/Brasshandle dhoop/a568d74e-8da8-4ab8-8b94-a5f2e9643306.webp',
      '/assets/Brasshandle dhoop/af0504dd-2ec7-49e3-a395-b5d78e9c2374.webp',
      '/assets/Brasshandle dhoop/ca838e17-6407-44d4-bee2-19618f4500a0.webp'
    ],
    purity: '100% Solid Brass with Heat-Safe Wooden/Brass Handle',
    inStock: true,
    description: 'Perform dhoop aarti effortlessly around your home with Shraviko Handled Brass Dhoop Burner. Features an extended heat-insulated handle that allows safe carrying while purifying rooms with dhoop smoke during evening prayers.',
    specifications: [
      { label: 'Material', value: 'Solid Brass' },
      { label: 'Handle Type', value: 'Extended Ergonomic Wooden/Brass Grip' },
      { label: 'Usage', value: 'Purifying Home Corners, Aarti Rituals' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Ergonomic long handle for safe handling',
      'Deep cup holds dhoop and burning charcoal',
      'Traditional handcrafted brass finish',
      'Ideal for temple and home rituals'
    ]
  },
  // 12. Brass Bhog Thali Set
  {
    id: 'shraviko-brass-bhog-thali',
    name: 'Shraviko Traditional Brass Bhog Thali Set for Laddu Gopal',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Thali',
    price: 699,
    originalPrice: 1299,
    rating: 4.97,
    reviewsCount: 96,
    tag: 'Bhog Thali Set',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/Bhoog thali/bhog 1.webp',
    images: [
      '/assets/Bhoog thali/bhog 1.webp',
      '/assets/Bhoog thali/bhog 2.webp',
      '/assets/Bhoog thali/bhog 3.webp',
      '/assets/Bhoog thali/bhog 4.webp',
      '/assets/Bhoog thali/bhog 5.webp'
    ],
    purity: '100% Solid Pure Brass',
    inStock: true,
    description: 'Offer divine Prasad to your deity in pure traditional elegance with Shraviko Brass Bhog Thali Set. Perfectly sized for Laddu Gopal ji and home mandirs, this brass set features a carved plate accompanied by miniature bowls and a glass for complete food offering rituals.',
    specifications: [
      { label: 'Material', value: '100% Solid Pure Brass' },
      { label: 'Includes', value: '1 Small Thali, Bowls & Glass' },
      { label: 'Usage', value: 'Daily Bhog Offering to Deity' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Pure brass construction considered most auspicious',
      'Smooth edges with delicate traditional border etching',
      'Easy to clean and maintain shine',
      'Perfect gift for Krishna Janmashtami & rituals'
    ]
  },
  // 13. Handcrafted Pure Brass Puja Bell
  {
    id: 'shraviko-brass-puja-bell',
    name: 'Shraviko Classic Handcrafted Brass Pooja Bell',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 549,
    originalPrice: 999,
    rating: 4.95,
    reviewsCount: 78,
    tag: 'Classic Ghanti',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/brass bells/brass bell 1.webp',
    images: [
      '/assets/brass bells/brass bell 1.webp',
      '/assets/brass bells/brass bell 2.webp',
      '/assets/brass bells/brass bell 3.webp',
      '/assets/brass bells/brass bell 4.webp'
    ],
    purity: '100% High-Resonance Solid Brass',
    inStock: true,
    description: 'Ring in auspiciousness and clarity with Shraviko Classic Handcrafted Brass Pooja Bell. Carefully cast from acoustically tuned brass, this bell rings with a clear, long-lasting chime that awakens spiritual energy and wards off negativity during Aarti.',
    specifications: [
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Sound', value: 'Clear & High Resonance Chime' },
      { label: 'Height', value: '5 Inches' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Superior acoustic brass casting',
      'Ergonomic handle for comfortable holding',
      'Traditional golden brass luster',
      'Essential for daily morning & evening mandir prayer'
    ]
  },
  // 14. Spiritual Symbol Engraved Brass Bell
  {
    id: 'shraviko-spiritual-engraved-bell',
    name: 'Shraviko Spiritual Carved Emblem Brass Pooja Bell',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 649,
    originalPrice: 1199,
    rating: 4.98,
    reviewsCount: 112,
    tag: 'Carved Bell',
    artType: 'bell',
    fitMode: 'contain',
    image: '/assets/Spritual bell/spritual bell.webp',
    images: [
      '/assets/Spritual bell/spritual bell.webp',
      '/assets/Spritual bell/spritual bell 2.webp',
      '/assets/Spritual bell/spritual 3.webp',
      '/assets/Spritual bell/438d90d4-9360-4e66-b3c2-0816eebba4e4.webp',
      '/assets/Spritual bell/7c33584e-470e-4807-a03b-632cc357ddaa.webp'
    ],
    purity: '100% Heavy Cast Brass',
    inStock: true,
    description: 'Enhance your temple room with Shraviko Spiritual Carved Emblem Brass Bell. Features sacred motif carvings on the dome and handle finial, generating a divine resonant sound frequency when rung.',
    specifications: [
      { label: 'Material', value: 'Pure Solid Heavy Brass' },
      { label: 'Finial Design', value: 'Sacred Emblem / Trishul / Garud Motif' },
      { label: 'Sound', value: 'Deep Divine Ringing Chime' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Intricate traditional relief carvings',
      'Balanced weight for effortless ringing',
      'Durable rust-proof brass body',
      'Ideal for festive rituals & temple installation'
    ]
  },
  // 15. Panch Aarti Brass Diya Set of 5
  {
    id: 'shraviko-brass-diya-set5',
    name: 'Shraviko Panch Aarti Brass Diya Set of 5',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Diyas',
    price: 749,
    originalPrice: 1399,
    rating: 4.96,
    reviewsCount: 91,
    tag: 'Diya Set',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Brass diyass set5/2fb03d7d-6b3d-4aad-bbad-2b9baf43988d.webp',
    images: [
      '/assets/Brass diyass set5/2fb03d7d-6b3d-4aad-bbad-2b9baf43988d.webp',
      '/assets/Brass diyass set5/53034a68-cc44-436e-829e-6fac61d5cd63.webp',
      '/assets/Brass diyass set5/6f4d42dd-6e3b-4d83-8b47-05de24a9f368.webp',
      '/assets/Brass diyass set5/d7dca6f2-a3a7-4395-b935-d3dcd0ffc495.webp',
      '/assets/Brass diyass set5/fe1bf299-e5cd-410d-8449-d0d14aa5d6af.webp'
    ],
    purity: '100% Solid Pure Brass',
    inStock: true,
    description: 'Illuminate your home with sacred radiance using Shraviko Panch Aarti Brass Diya Set of 5. Made from heavy-gauge brass, these oil lamps feature five deep wicks designed for Panch Aarti rituals during Diwali, Navratri, and daily temple worship.',
    specifications: [
      { label: 'Material', value: '100% Pure Brass' },
      { label: 'Quantity', value: 'Set of 5 Diyas' },
      { label: 'Oil Capacity', value: 'Generous oil reservoir for long burn' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Panch Aarti 5-wick traditional design',
      'Heavy base prevents oil spilling',
      'Bright golden brass luster',
      'Perfect for festive mandir lighting'
    ]
  },
  // 16. Royal Carved Brass Kuber Diya
  {
    id: 'shraviko-carved-brass-diya',
    name: 'Shraviko Royal Carved Brass Kuber Deepak',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Diyas',
    price: 499,
    originalPrice: 899,
    rating: 4.97,
    reviewsCount: 130,
    tag: 'Carved Diya',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Brass diyasss/139dc239-65e6-42ae-bb05-e866e519bed8.webp',
    images: [
      '/assets/Brass diyasss/139dc239-65e6-42ae-bb05-e866e519bed8.webp',
      '/assets/Brass diyasss/1dac21f4-ce81-4875-ab10-8ad4adc02312.webp',
      '/assets/Brass diyasss/205984c2-9ee8-4d4a-9037-7b4364c44753.webp',
      '/assets/Brass diyasss/a8618dad-d1e6-4e69-be72-fb9d4a382a95.webp',
      '/assets/Brass diyasss/fed91aa0-a096-41b7-919d-cdc273acf8cd.webp'
    ],
    purity: '100% Solid Brass',
    inStock: true,
    description: 'Add timeless devotion to your altar with Shraviko Royal Carved Brass Kuber Deepak. Handcrafted with traditional floral etchings along the rim, this brass oil lamp burns brightly to bring wealth, peace, and auspicious light into your home.',
    specifications: [
      { label: 'Material', value: 'Solid Heavy Brass' },
      { label: 'Finish', value: 'Polished Brass Gold' },
      { label: 'Wick Support', value: 'Single cotton wick guide' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Exquisite floral relief work',
      'Stable pedestal base',
      'Durable thick brass construction',
      'Auspicious Kuber lamp for wealth & prosperity'
    ]
  },
  // 17. Brass Cup Deepak with Base
  {
    id: 'shraviko-brass-cup-deepak',
    name: 'Shraviko Heavy Brass Cup Deepak with Pedestal',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Diyas',
    price: 599,
    originalPrice: 1099,
    rating: 4.95,
    reviewsCount: 82,
    tag: 'Cup Diya',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Cupdeepak/cup1.webp',
    images: [
      '/assets/Cupdeepak/cup1.webp',
      '/assets/Cupdeepak/2a8372db-735f-47d8-a3aa-f9d0cd74555f.webp',
      '/assets/Cupdeepak/4eaf8ea8-4371-43f9-941f-3c891d21376d.webp',
      '/assets/Cupdeepak/58427f28-cced-4e80-94eb-00bb86ba0299.webp',
      '/assets/Cupdeepak/680763a2-88d8-4eb9-927a-d23589e89c1d.webp',
      '/assets/Cupdeepak/77ac23dd-124f-4bd5-acba-77d89481a85d.webp'
    ],
    purity: '100% Heavy Cast Brass',
    inStock: true,
    description: 'Keep your temple flame steady and protected with Shraviko Heavy Brass Cup Deepak. Designed with a deep oil cup and elevated base, this diya prevents oil dripping and supports long burning hours for ghee or oil lamps.',
    specifications: [
      { label: 'Material', value: 'Heavy Cast Brass' },
      { label: 'Cup Depth', value: 'Deep Reservoir for Ghee/Oil' },
      { label: 'Base', value: 'Stable Raised Pedestal Base' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Deep reservoir prevents oil overflow',
      'Raised stem insulates altar surface',
      'High-grade solid brass material',
      'Ideal for long daily worship hours'
    ]
  },
  // 18. Brass Stand Diya Pillar
  {
    id: 'shraviko-brass-stand-diya',
    name: 'Shraviko Traditional Brass Stand Diya Pillar Lamp',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Diyas',
    price: 999,
    originalPrice: 1899,
    rating: 4.98,
    reviewsCount: 140,
    tag: 'Stand Diya',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Stand diyas/1ece5a44-32a5-4537-8c81-a057579514f9.webp',
    images: [
      '/assets/Stand diyas/1ece5a44-32a5-4537-8c81-a057579514f9.webp',
      '/assets/Stand diyas/507ac811-895e-43e7-8ffd-0330cdb4f6ed.webp',
      '/assets/Stand diyas/78eafd19-da26-4f34-9334-bdbc8242ffe9.webp',
      '/assets/Stand diyas/8479b7a9-a59f-4e81-89e5-610aaec86b79.webp',
      '/assets/Stand diyas/89a8b721-b2e9-45f1-bf16-197fc5fd69c2.webp'
    ],
    purity: '100% Solid Heavy Brass',
    inStock: true,
    description: 'Add majestic temple elegance to your home mandir with Shraviko Traditional Brass Stand Diya Pillar Lamp. Standing gracefully on a carved brass pillar, this lamp provides elevated lighting for your deities during major festival celebrations.',
    specifications: [
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Height', value: '8-10 Inches' },
      { label: 'Structure', value: 'Multi-tiered Pillar Stand' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Stately pillar stand design',
      'Holds flame at majestic altar height',
      'Solid heavy brass weight prevents tipping',
      'Grand centerpiece for festive mandir décor'
    ]
  },
  // 19. Stainless Steel Puja Dibbi Container
  {
    id: 'shraviko-stainless-steel-dibbi',
    name: 'Shraviko Pure Stainless Steel Puja Container Dibbi',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Puja Accessories',
    price: 199,
    originalPrice: 349,
    rating: 4.90,
    reviewsCount: 65,
    tag: 'Puja Dibbi',
    artType: 'container',
    fitMode: 'contain',
    image: '/assets/Steel dabi/dabi1.webp',
    images: [
      '/assets/Steel dabi/dabi1.webp',
      '/assets/Steel dabi/dabi2.webp',
      '/assets/Steel dabi/dabi3.webp',
      '/assets/Steel dabi/Dabi4.webp'
    ],
    purity: '100% Food-Grade Stainless Steel',
    inStock: true,
    description: 'Keep your sacred Kumkum, Roli, Akshat, and Chandan fresh and airtight with Shraviko Pure Stainless Steel Puja Container Dibbi. Made from rust-free food-grade steel with tight fitting lid for daily altar storage.',
    specifications: [
      { label: 'Material', value: 'Heavy Gauge Stainless Steel' },
      { label: 'Usage', value: 'Storing Kumkum, Chandan, Kapoor, Roli' },
      { label: 'Features', value: 'Airtight, Rust-Proof, Easy Clean' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Premium food-grade stainless steel',
      'Airtight lid keeps ingredients moisture-free',
      'Sleek polished finish',
      'Compact size for home temple tray'
    ]
  },
  // 20. Brass Lakshmi Charan Paduka
  {
    id: 'shraviko-brass-footprints',
    name: 'Shraviko Sacred Brass Lakshmi Charan Paduka Footprints',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Sacred Symbols',
    price: 499,
    originalPrice: 899,
    rating: 4.98,
    reviewsCount: 135,
    tag: 'Lakshmi Charan',
    artType: 'symbol',
    fitMode: 'contain',
    image: '/assets/footprints/1e8d07fc-efda-4a39-b89c-301f5b250a1c.webp',
    images: [
      '/assets/footprints/1e8d07fc-efda-4a39-b89c-301f5b250a1c.webp',
      '/assets/footprints/3b461aeb-0c2b-4b42-affb-b4a8d8147e8c.webp',
      '/assets/footprints/b6dbd6fe-882d-4267-bb9c-af08f09a3205.webp',
      '/assets/footprints/fea059b9-2a86-4cbf-afa1-2919e2bf2192.webp'
    ],
    purity: '100% Solid Brass with Auspicious Symbols',
    inStock: true,
    description: 'Invite Goddess Lakshmi\'s eternal blessings of wealth and prosperity into your home entrance or mandir with Shraviko Sacred Brass Lakshmi Charan Paduka. Engraved with auspicious Vedic symbols including Swastik, Shankh, Chakra, and Lotus.',
    specifications: [
      { label: 'Material', value: 'Solid Pure Brass' },
      { label: 'Symbols Engraved', value: 'Swastik, Shankh, Chakra, Lotus & Gada' },
      { label: 'Placement', value: 'Altar, Main Door Entrance, Safe Vault' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Auspicious Goddess Lakshmi divine footprints',
      'Detailed traditional symbol relief etching',
      'Attracts wealth, harmony & luck according to Vastu',
      'Solid brass build will never fade'
    ]
  },
  // 21. Pure Silver Plated Lakshmi Charan Paduka
  {
    id: 'shraviko-silver-footprints',
    name: 'Shraviko Pure Silver Plated Goddess Lakshmi Charan Paduka',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Sacred Symbols',
    price: 799,
    originalPrice: 1499,
    rating: 4.99,
    reviewsCount: 160,
    tag: 'Silver Plated',
    artType: 'symbol',
    fitMode: 'contain',
    image: '/assets/Silver Footprints/0907a81a-5fdb-42d5-8145-cf993e04f332.webp',
    images: [
      '/assets/Silver Footprints/0907a81a-5fdb-42d5-8145-cf993e04f332.webp',
      '/assets/Silver Footprints/5925b180-9243-4357-99b2-724b1edf3cb4.webp',
      '/assets/Silver Footprints/98c5835c-5ef8-4b40-9269-7fdf2c9159b3.webp',
      '/assets/Silver Footprints/9a8befc3-08d4-4d6c-a5c6-ff6a1f7f5808.webp',
      '/assets/Silver Footprints/af812ffb-70dc-49d7-b93e-83617f23d530.webp'
    ],
    purity: 'Pure 999 Silver Plated Finish',
    inStock: true,
    description: 'Welcome divine luck and abundance with Shraviko Pure Silver Plated Goddess Lakshmi Charan Paduka. Crafted with intense precision and coated in 999 silver sheen, this sacred paduka plate radiates pure Vastu energy.',
    specifications: [
      { label: 'Plating', value: '999 Pure Silver Plated' },
      { label: 'Packaging', value: 'Premium Velvet Gift Box' },
      { label: 'Suitable For', value: 'Pooja Room, Cash Locker, Diwali Gifting' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Lustrous 999 pure silver finish',
      'Detailed Vedic symbols of wealth',
      'Ideal gift for Griha Pravesh & Diwali',
      'Protective clear coat prevents tarnishing'
    ]
  },
  // 22. Diamond Cut Crystal & Brass Akhand Jyot
  {
    id: 'shraviko-diamond-akhand-jyot',
    name: 'Shraviko Diamond Cut Glass Brass Akhand Jyot Deepak',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Akhand Jyot',
    price: 849,
    originalPrice: 1599,
    rating: 4.97,
    reviewsCount: 128,
    tag: 'Diamond Cut Glass',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Daimon akhand jyot/112f3e84-07dd-4bee-88eb-18c269b5cb6d.webp',
    images: [
      '/assets/Daimon akhand jyot/112f3e84-07dd-4bee-88eb-18c269b5cb6d.webp',
      '/assets/Daimon akhand jyot/6b68aa13-98f7-49d4-b63d-21727db2d533.webp',
      '/assets/Daimon akhand jyot/6c2b206f-9719-40ba-b610-ed28baf399c8.webp',
      '/assets/Daimon akhand jyot/7d02af9f-b8e5-4825-9a47-b940d4c7469a.webp',
      '/assets/Daimon akhand jyot/cc438bbf-5a06-44bb-9bc4-3ca3e6841e25.webp'
    ],
    purity: 'Thermal Shock Resistant Borosilicate Glass & Heavy Brass',
    inStock: true,
    description: 'Maintain an eternal flame for hours without flickering with Shraviko Diamond Cut Glass Brass Akhand Jyot. Built with thick heat-resistant diamond-faceted glass and a solid brass base, this lamp reflects brilliant light across your mandir.',
    specifications: [
      { label: 'Glass Material', value: 'High Borosilicate Faceted Glass' },
      { label: 'Base & Lid', value: '100% Solid Brass' },
      { label: 'Burn Duration', value: 'Burns up to 24-36 Hours per refill' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Diamond cut glass creates sparkling light dispersion',
      'Wind-proof glass chimney keeps flame steady',
      'Heat resistant - stays cool at base',
      'Ideal for Navratri & continuous prayer'
    ]
  },
  // 23. Crystal Glass Brass Akhand Jyot
  {
    id: 'shraviko-crystal-glass-akhand-jyot',
    name: 'Shraviko Crystal Clear Borosilicate Glass Brass Akhand Jyot',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Akhand Jyot',
    price: 799,
    originalPrice: 1499,
    rating: 4.96,
    reviewsCount: 118,
    tag: 'Akhand Jyot',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Glass Akhjand Jyot/5005c08c-2040-4bef-bbfb-e18712832834.webp',
    images: [
      '/assets/Glass Akhjand Jyot/5005c08c-2040-4bef-bbfb-e18712832834.webp',
      '/assets/Glass Akhjand Jyot/627c05ea-585f-442c-be85-3c2aa4cd2995.webp',
      '/assets/Glass Akhjand Jyot/9ab57cb8-8a89-4a58-aadb-697f8a75d59b.webp',
      '/assets/Glass Akhjand Jyot/ac57bab6-41e9-446c-8fa7-b50eb57a6228.webp',
      '/assets/Glass Akhjand Jyot/ace2fde5-4e5b-4b69-8e5b-de3209de65fa.webp'
    ],
    purity: 'Heat Resistant Borosilicate Glass & Pure Brass',
    inStock: true,
    description: 'Perform uninterrupted ritual prayers with Shraviko Crystal Clear Glass Akhand Jyot. Features a protective glass dome fitted onto a polished brass oil cup, shielding the flame from breezes while spreading a serene glow.',
    specifications: [
      { label: 'Material', value: 'Borosilicate Glass & Brass' },
      { label: 'Burn Capacity', value: 'Long continuous burn hours' },
      { label: 'Safety', value: 'Windproof & heat-tested' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Crystal clear transparency for unobstructed flame visibility',
      'Brass top cap with air vents for stable combustion',
      'Removable glass for quick wick replacement',
      'Standard size suitable for all home mandirs'
    ]
  },
  // 24. Lotus Pattern Brass Akhand Jyot
  {
    id: 'shraviko-lotus-brass-akhand-jyot',
    name: 'Shraviko Lotus Petal Brass Glass Akhand Jyot Deepak',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Akhand Jyot',
    price: 899,
    originalPrice: 1699,
    rating: 4.99,
    reviewsCount: 152,
    tag: 'Lotus Design',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/Lotus Akhand jyot/0d5b513f-97f0-4517-9064-0d0d4c0aa651.webp',
    images: [
      '/assets/Lotus Akhand jyot/0d5b513f-97f0-4517-9064-0d0d4c0aa651.webp',
      '/assets/Lotus Akhand jyot/744f894f-b4e6-487c-9385-a14457885e49.webp',
      '/assets/Lotus Akhand jyot/774ad976-146f-489a-9f2d-bb5b338b46f2.webp',
      '/assets/Lotus Akhand jyot/b2feea7f-682f-4b11-b242-845092935c4b.webp',
      '/assets/Lotus Akhand jyot/c9cf5f68-e5cc-44b2-b3f6-48eeb99eaaa8.webp'
    ],
    purity: 'Pure Brass Lotus Pedestal with Thermal Glass',
    inStock: true,
    description: 'Adorn your altar with sacred sacred lotus symbolism with Shraviko Lotus Petal Brass Glass Akhand Jyot. Sculpted with lotus petal motifs around the brass cup base, this lamp holds the holy light steady for spiritual rituals.',
    specifications: [
      { label: 'Base Design', value: 'Sculpted Lotus Petal Brass Base' },
      { label: 'Glass', value: 'High Temperature Borosilicate Chimney' },
      { label: 'Burn Time', value: '24+ Hours continuous flame' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Sacred Kamal (Lotus) lotus petal crafting',
      'Wind-proof glass prevents draft extinguishing',
      'Easy oil/ghee refilling mechanism',
      'Highly auspicious gift for weddings & Pujas'
    ]
  },
  // 25. OM Top Brass Glass Akhand Jyot
  {
    id: 'shraviko-om-top-glass-akhand-jyot',
    name: 'Shraviko Sacred OM Engraved Brass Glass Akhand Jyot',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Akhand Jyot',
    price: 849,
    originalPrice: 1599,
    rating: 4.97,
    reviewsCount: 120,
    tag: 'OM Engraved',
    artType: 'diya',
    fitMode: 'contain',
    image: '/assets/OMtop Glass akhand jyot/16f3e0e9-7740-4d83-ad47-312b36b3ac4e.webp',
    images: [
      '/assets/OMtop Glass akhand jyot/16f3e0e9-7740-4d83-ad47-312b36b3ac4e.webp',
      '/assets/OMtop Glass akhand jyot/5f40e272-18fa-42bb-86e9-9c96ffe921e9.webp',
      '/assets/OMtop Glass akhand jyot/652e0444-2e94-43a9-8ad6-d5379d9471ea.webp',
      '/assets/OMtop Glass akhand jyot/6fdd6a59-7c11-44dc-8a2e-62647d413c4f.webp',
      '/assets/OMtop Glass akhand jyot/b6b3b817-2051-4f6f-8ae5-4613a4289edc.webp'
    ],
    purity: 'Pure Brass Top Cap with Sacred OM Cutout',
    inStock: true,
    description: 'Cast divine OM shadows and glowing radiance across your mandir with Shraviko Sacred OM Engraved Brass Glass Akhand Jyot. Featuring a carved brass top lid with OM ventilation apertures, this lamp offers protection and holy beauty.',
    specifications: [
      { label: 'Top Lid', value: 'Brass Cap with OM Silhouette Vents' },
      { label: 'Glass', value: 'High Clarity Borosilicate Glass' },
      { label: 'Base', value: 'Heavy Solid Brass Base' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    keyFeatures: [
      'Sacred OM cutouts project serene shadows when lit',
      'Durable brass and heat-resistant glass construction',
      'Provides steady flame for prolonged worship',
      'Comes with cotton wicks & brass wick holder'
    ]
  }
];

// Append new products before closing array bracket of PRODUCTS
const closingIndex = content.lastIndexOf('];');
if (closingIndex !== -1) {
  const formattedNewProducts = newProducts.map(p => JSON.stringify(p, null, 2)).join(',\n  ');
  const updatedContent = content.slice(0, closingIndex) + ',\n  // --- NEW PRODUCTS ADDED ---\n  ' + formattedNewProducts + '\n];\n';
  fs.writeFileSync(productsFilePath, updatedContent, 'utf8');
  console.log('Successfully updated products.js with ' + newProducts.length + ' new product cards!');
} else {
  console.error('Could not find closing bracket ]; in products.js');
}
