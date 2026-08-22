export const CATEGORIES = [
  { id: 'all', name: 'All Collections' },
  { id: 'brass', name: 'Brass Articles', count: 17 },
  { id: 'copper', name: 'Copper Articles', count: 4 },
  { id: 'mandir-essentials', name: 'Mandir Essentials', count: 13 },
  { id: 'incense', name: 'Incense & Dhoop', count: 5 },
  { id: 'vastu', name: 'Vastu & Spiritual', count: 9 },
  { id: 'yantras', name: 'Custom & Handcrafted', count: 3 }
];

export const PRODUCTS = [
  // 1. Garuda Headed Brass Bell
  {
    id: 'brass-bell-garuda',
    name: 'Garud Headed Brass Pooja Bell',
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
    purity: '100% Solid Heavy Brass',
    inStock: true,
    description: 'Add a distinctive traditional element to your worship space with this Garud Headed Brass Pooja Bell. Crafted from brass, this traditional ghanti features a detailed Garud-inspired handle that gives the bell a distinctive devotional appearance. The combination of the classic brass bell form and sculpted Garud design makes it suitable for both functional worship and traditional display. Designed for hand-held use, it can be used during daily puja, Aarti, temple rituals, bhajan, meditation and festive ceremonies. The bell produces a clear, resonant sound when rung.',
    specifications: [
      { label: 'Product', value: 'Garud Headed Brass Pooja Bell' },
      { label: 'Material', value: '100% Solid Heavy Brass' },
      { label: 'Handle Motif', value: 'Detailed Garud-Inspired Handle' },
      { label: 'Sound Quality', value: 'Clear & Resonant Ringing Chime' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Temple Rituals, Bhajan, Meditation & Festive Ceremonies' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Garud Headed Brass Pooja Bell' }
    ],
    keyFeatures: [
      'Detailed Garud-inspired handle',
      'Traditional brass construction',
      'Clear and resonant sound',
      'Comfortable hand-held design',
      'Suitable for daily worship and Aarti',
      'Ideal for home mandirs and temples',
      'Traditional devotional décor',
      'Suitable for festive and religious gifting'
    ],
    careInstructions: [
      'Wipe the bell with a soft, dry cloth after daily use.',
      'Periodically use a brass cleaner to restore and maintain its traditional luster.',
      'Avoid harsh chemicals and abrasive scrubbers that may scratch the surface.',
      'Store in a clean, dry location when not in use.'
    ],
    faqs: [
      { q: 'What is the handle design of this bell?', a: 'It features a detailed Garud-inspired handle, symbolizing divine protection as the sacred Vahana of Lord Vishnu.' },
      { q: 'What does the bell sound like?', a: 'It produces a clear, high-frequency resonant chime designed for temple and home altar worship.' },
      { q: 'Is it suitable for daily puja?', a: 'Yes, it is ergonomically designed for comfortable daily morning and evening Aarti.' },
      { q: 'Can it be gifted?', a: 'Yes, it makes a meaningful gift for family, friends, housewarmings, and religious festivals.' }
    ]
  },
  // 2. Nandi Headed Brass Bell
  {
    id: 'brass-bell-nandi',
    name: 'Nandi Headed Brass Pooja Bell',
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
    purity: '100% Solid Heavy Brass',
    inStock: true,
    description: 'Bring a distinctive traditional character to your sacred space with this Nandi Headed Brass Pooja Bell. Crafted from brass, the bell combines the classic form of a traditional temple ghanti with a detailed Nandi-inspired handle, creating a devotional piece that stands out in any home mandir. The Nandi-headed design adds a meaningful traditional element to the bell, while the brass construction gives it a timeless appearance suited to Indian worship spaces. Its hand-held design makes it convenient to use during daily puja, Aarti, temple rituals, bhajan and other devotional practices. The bell produces a clear, resonant sound when rung.',
    specifications: [
      { label: 'Product', value: 'Nandi Headed Brass Pooja Bell' },
      { label: 'Material', value: '100% Solid Heavy Brass' },
      { label: 'Handle Motif', value: 'Traditional Nandi-Inspired Handle' },
      { label: 'Sound Quality', value: 'Clear & Resonant Ringing Chime' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Temple Rituals, Bhajan & Festive Worship' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Nandi Headed Brass Pooja Bell' }
    ],
    keyFeatures: [
      'Traditional Nandi-inspired handle design',
      'Crafted from high-quality solid brass',
      'Clear and resonant ringing sound',
      'Comfortable hand-held design',
      'Suitable for daily puja and Aarti',
      'Ideal for home mandirs and temples',
      'Traditional Indian devotional accessory',
      'Suitable for religious and festive gifting'
    ],
    careInstructions: [
      'Wipe the bell with a soft, dry cloth after daily use.',
      'Periodically use a brass cleaner to restore and maintain its traditional luster.',
      'Avoid harsh chemicals and abrasive scrubbers that may scratch the surface.',
      'Store in a clean, dry location when not in use.'
    ],
    faqs: [
      { q: 'What is the handle design of this bell?', a: 'It features a detailed Nandi-inspired handle, representing sacred devotion in Lord Shiva\'s traditions.' },
      { q: 'What does the bell sound like?', a: 'It produces a clear, long-vibrating resonant acoustic chime designed for sacred puja rituals.' },
      { q: 'Is it suitable for daily puja?', a: 'Yes, its ergonomic hand-held design makes it comfortable for daily morning and evening Aarti.' },
      { q: 'Can it be gifted?', a: 'Yes, it makes a thoughtful gift for housewarmings, weddings, Navratri, and religious ceremonies.' }
    ]
  },
  // 3. Simple Traditional Brass Bell
  {
    id: 'brass-bell-simple',
    name: 'Traditional Brass Pooja Bell',
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
    purity: '100% Solid Brass',
    inStock: true,
    description: 'Keep your worship space rooted in timeless Indian tradition with this Traditional Brass Pooja Bell. Crafted from brass, this classic ghanti features a simple traditional design that fits naturally into home mandirs, puja rooms and temple spaces. Designed for everyday devotional use, the bell produces a clear, resonant sound and can be rung during puja, Aarti, bhajan, meditation and religious ceremonies. Its straightforward design makes it a practical addition to any worship setup without taking away from the traditional character of the space. The brass construction gives the bell a classic appearance that complements other brass puja essentials.',
    specifications: [
      { label: 'Product', value: 'Traditional Brass Pooja Bell' },
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Design', value: 'Classic Smooth Dome Bell Form' },
      { label: 'Sound Quality', value: 'Clear & Resonant Ringing Chime' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Bhajan, Meditation & Temple Ceremonies' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Traditional Brass Pooja Bell' }
    ],
    keyFeatures: [
      'Classic traditional bell design',
      'Crafted from high-quality brass',
      'Clear and resonant ringing sound',
      'Easy-to-hold design',
      'Suitable for daily puja and Aarti',
      'Ideal for home mandir and temple use',
      'Complements traditional puja décor',
      'Suitable for gifting on religious occasions'
    ],
    careInstructions: [
      'Wipe the bell with a soft, dry cloth after daily use.',
      'Periodically use a brass cleaner to restore and maintain its traditional luster.',
      'Avoid harsh chemicals and abrasive scrubbers that may scratch the surface.',
      'Store in a clean, dry location when not in use.'
    ],
    faqs: [
      { q: 'What is the design style of this bell?', a: 'It features a classic, smooth traditional bell design that fits naturally into any mandir.' },
      { q: 'What does the bell sound like?', a: 'It produces a clear, resonant ringing chime for daily puja rituals.' },
      { q: 'Is it easy to hold?', a: 'Yes, it features an easy-to-hold handle suitable for daily Aarti.' },
      { q: 'Can it be gifted?', a: 'Yes, it is a versatile gift for housewarmings, weddings, festivals, and religious ceremonies.' }
    ]
  },
  // 4. Brass Ganesh Ghanti
  {
    id: 'brass-bell-carved',
    name: 'Brass Ganesh Ghanti',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Bells',
    price: 1690,
    originalPrice: 2150,
    rating: 4.99,
    reviewsCount: 190,
    tag: 'Ganesh Finial',
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
    purity: '100% Solid Heavy Brass',
    inStock: true,
    description: 'Bring a traditional devotional accent to your mandir with the Brass Ganesh Ghanti. Crafted from brass and featuring a distinctive Ganesh-inspired design, this traditional hand bell combines everyday puja functionality with detailed Indian craftsmanship. The Ganesh design gives the bell a distinctive appearance, making it a natural addition to a home temple, puja room or devotional space. Its hand-held construction allows it to be conveniently used during daily puja, Aarti, bhajan, meditation and religious ceremonies. The brass bell produces a clear, resonant sound when rung and complements other traditional brass puja accessories.',
    specifications: [
      { label: 'Product', value: 'Brass Ganesh Ghanti' },
      { label: 'Material', value: '100% Solid Heavy Brass' },
      { label: 'Handle Motif', value: 'Distinctive Ganesh-Inspired Design' },
      { label: 'Sound Quality', value: 'Clear & Resonant Ringing Sound' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Bhajan, Meditation & Religious Ceremonies' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Ganesh Ghanti' }
    ],
    keyFeatures: [
      'Distinctive Ganesh-inspired design',
      'Traditional brass construction',
      'Clear and resonant ringing sound',
      'Comfortable hand-held design',
      'Suitable for daily puja and Aarti',
      'Ideal for home mandirs and temples',
      'Traditional Indian devotional accessory',
      'Suitable for religious and festive gifting'
    ],
    careInstructions: [
      'Wipe the bell with a soft, dry cloth after daily use.',
      'Periodically use a brass cleaner to restore and maintain its traditional luster.',
      'Avoid harsh chemicals and abrasive scrubbers that may scratch the surface.',
      'Store in a clean, dry location when not in use.'
    ],
    faqs: [
      { q: 'What is the handle motif of this bell?', a: 'It features a sculpted Lord Ganesh design, invoking wisdom and auspicious blessings for all rituals.' },
      { q: 'What does the bell sound like?', a: 'It produces a clear, resonant acoustic chime for temple and home worship.' },
      { q: 'Is it comfortable for daily Aarti?', a: 'Yes, its ergonomic hand-held design ensures convenient daily use.' },
      { q: 'Can it be gifted?', a: 'Yes, a meaningful gift for housewarmings, weddings, Ganesh Chaturthi, and festivals.' }
    ]
  },

  // 2. Brass Pooja Thali Set
  {
    id: 'brass-puja-thali-set',
    name: 'Pure Brass Pooja Thali',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Puja Thali',
    price: 2190,
    originalPrice: 2790,
    rating: 4.99,
    reviewsCount: 195,
    tag: 'Engraved Floral',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/Brass thali/thali 1.jpg',
    images: [
      '/assets/Brass thali/thali 1.jpg',
      '/assets/Brass thali/thali 2.jpg',
      '/assets/Brass thali/Brass thali.jpg',
      '/assets/Brass thali/thali 3.jpg',
      '/assets/Brass thali/thali 4.jpg'
    ],
    weightVariants: [
      { weight: '8 Inch Thali', price: 1490, originalPrice: 1890 },
      { weight: '10 Inch Thali', price: 2190, originalPrice: 2790, default: true },
      { weight: '12 Inch Royal Thali', price: 3290, originalPrice: 3990 }
    ],
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'Bring a timeless touch of Indian craftsmanship to your worship space with the Shraviko Pure Brass Pooja Thali. Crafted from brass and finished with traditional engraved detailing, this round puja thali is designed to become a practical and elegant part of your daily worship rituals. The engraved floral design adds a refined traditional character to the thali, while its open surface provides convenient space for arranging essential puja items such as diyas, kumkum, roli, akshat, flowers, incense and prasad. Whether used for daily puja at home or during special occasions, the brass thali fits naturally into Aarti, festive worship, religious ceremonies and traditional celebrations.',
    shortDescription: 'Traditional Pure Brass Pooja Thali featuring engraved floral detailing and a polished finish. Designed for Aarti, daily puja, festivals and religious ceremonies, with ample space for arranging essential worship items. Available in multiple sizes.',
    seoTitle: 'Pure Brass Pooja Thali | Traditional Brass Aarti Plate for Home Mandir',
    metaDescription: 'Shop the Shraviko Pure Brass Pooja Thali with traditional engraved floral detailing. Ideal for daily puja, Aarti, festivals, home mandir and religious ceremonies.',
    specifications: [
      { label: 'Product', value: 'Pure Brass Pooja Thali' },
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Design', value: 'Engraved Floral Detailing & Traditional Round Form' },
      { label: 'Finish', value: 'Polished Traditional Brass' },
      { label: 'Multipurpose Space For', value: 'Diyas, Kumkum, Roli, Akshat, Flowers, Incense & Prasad' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Home Mandir, Temple, Diwali, Navratri & Festive Gifting' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Pure Brass Pooja Thali' }
    ],
    keyFeatures: [
      'Pure Brass Construction – Crafted from brass with a traditional polished finish.',
      'Engraved Floral Design – Decorative detailing adds a classic Indian aesthetic.',
      'Designed for Puja & Aarti – Suitable for arranging essential items during worship.',
      'Multipurpose Use – Ideal for diyas, kumkum, roli, akshat, flowers, incense and prasad.',
      'Traditional Round Form – Classic thali shape suited to everyday worship and ceremonies.',
      'Easy to Maintain – Brass can be cleaned and polished to maintain its traditional appearance.',
      'Suitable for Gifting – A practical traditional gift for housewarmings, weddings and festivals.',
      'Multiple Size Options – Available in different sizes for different worship and gifting needs.'
    ],
    careInstructions: [
      'Wipe the thali with a soft cloth after use.',
      'Use a suitable brass-cleaning product when deeper cleaning is required.',
      'Avoid abrasive scrubbers that may scratch the surface.',
      'Remove moisture and residue before storing.',
      'Keep the thali in a clean, dry place when not in use.'
    ],
    faqs: [
      { q: 'What is this thali made of?', a: 'It is crafted from pure brass with traditional engraved floral detailing and a polished finish.' },
      { q: 'What items can be arranged on the thali?', a: 'It provides ample open space for diyas, kumkum, roli, akshat, flowers, incense, bell, and prasad.' },
      { q: 'Is it suitable for daily Aarti and festivals?', a: 'Yes, it is ideal for daily home puja, Aarti, Diwali, Navratri, Lakshmi Puja, and special ceremonies.' },
      { q: 'How do I clean and care for the brass thali?', a: 'Wipe with a soft cloth after use, use a brass cleaner for deeper polishing, avoid abrasive scrubbers, and dry thoroughly.' },
      { q: 'Is this thali available in multiple sizes?', a: 'Yes, available in multiple diameter sizes to suit different mandir setups and gifting needs.' },
      { q: 'Is it suitable for gifting?', a: 'Yes, it is a traditional gift for housewarmings, weddings, festivals, and religious occasions.' }
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
    name: 'Pure Brass Panchmukhi Aarti Diya',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Aarti & Diyas',
    price: 1690,
    originalPrice: 2190,
    rating: 4.98,
    reviewsCount: 134,
    tag: '5-Wick Panchmukhi',
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
      { weight: '5-Wick Panchmukhi', price: 1690, originalPrice: 2190, default: true },
      { weight: '7-Wick Royal Aarti', price: 2490, originalPrice: 3190 }
    ],
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'Crafted from solid brass, this traditional five-wick Panchmukhi Aarti lamp combines functional design with classic Indian puja craftsmanship. Features five dedicated wick holders, a sturdy integrated handle for holding during Aarti, and a balanced base for safe placement.',
    specifications: [
      { label: 'Product', value: 'Panchmukhi Aarti Diya' },
      { label: 'Material', value: 'Pure Brass / Solid Brass' },
      { label: 'Design', value: 'Panchmukhi (5-Wick)' },
      { label: 'Wick Holders', value: '5 Dedicated Holders' },
      { label: 'Handle', value: 'Sturdy Integrated Handle' },
      { label: 'Finish', value: 'Polished Traditional Brass' },
      { label: 'Suitable For', value: 'Daily Puja, Aarti, Temple & Festive Use' },
      { label: 'Recommended Fuel', value: 'Pure Ghee, Sesame Oil or Mustard Oil' },
      { label: 'Wick Type', value: 'Cotton Wick' },
      { label: 'What\'s Included', value: '1 × Pure Brass Panchmukhi Aarti Diya' }
    ],
    keyFeatures: [
      'Solid Brass Construction – Made from high-quality brass with a traditional polished finish.',
      'Panchmukhi 5-Wick Design – Five dedicated wick holders for performing Aarti with multiple flames.',
      'Comfortable Handle – Sturdy integrated handle for holding the diya during Aarti.',
      'Stable Base – Designed with a balanced base for stable placement when used on a suitable surface.',
      'Traditional Design – Inspired by traditional Indian brass puja lamps.',
      'Versatile Use – Suitable for daily worship, Aarti, festivals, temple rituals and special religious occasions.',
      'Easy to Maintain – Can be wiped with a soft cloth and periodically polished to maintain its appearance.'
    ],
    careInstructions: [
      'Wipe the diya with a soft, dry cloth after use.',
      'For deeper cleaning, use a suitable brass-cleaning product.',
      'Avoid abrasive scrubbers that may scratch the surface.',
      'Keep the diya dry when not in use.',
      'Allow the diya to cool completely before cleaning.'
    ],
    faqs: [
      { q: 'Is this diya made from brass?', a: 'Yes, this product is made from solid brass with a polished traditional finish.' },
      { q: 'How many wicks can be used?', a: 'The diya has five dedicated wick holders designed for five cotton wicks.' },
      { q: 'Can I use ghee in this diya?', a: 'Yes. Pure ghee, sesame oil, and mustard oil can all be used with suitable cotton wicks.' },
      { q: 'Can this diya be used for Aarti?', a: 'Yes. The integrated handle makes it suitable for holding during Aarti.' },
      { q: 'What is included in the package?', a: '1 × Pure Brass Panchmukhi Aarti Diya.' },
      { q: 'Is this suitable as a gift?', a: 'Yes. Ideal for housewarming, weddings, festivals, religious ceremonies and traditional gifting.' }
    ]
  },

  // 5. Brass Akhand Jyot Deep
  {
    id: 'brass-akhand-jyot-deepak',
    name: 'Brass Akhand Jyot Diya with Protective Cover',
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
      { weight: 'Small (Standard)', price: 1290, originalPrice: 1690 },
      { weight: 'Medium (Akhand)', price: 1890, originalPrice: 2490, default: true },
      { weight: 'Large (Royal)', price: 2690, originalPrice: 3290 }
    ],
    purity: 'Premium Brass Construction with Om Finial',
    inStock: true,
    description: 'Bring a timeless element of Indian tradition to your sacred space with the Shraviko Brass Akhand Jyot Diya. Crafted from brass and finished with traditional detailing, this diya is designed for daily puja, Akhand Jyot, meditation and festive worship. Features a protective decorative cover that reduces the effect of air movement on the flame, an elegant Om finial, detailed cutwork, and a stable brass base.',
    specifications: [
      { label: 'Product', value: 'Brass Akhand Jyot Diya with Protective Cover' },
      { label: 'Material', value: 'Premium Solid Brass' },
      { label: 'Design Element', value: 'Elegant Om Finial & Detailed Cutwork' },
      { label: 'Flame Cover', value: 'Protective Decorative Cover Around Flame' },
      { label: 'Base', value: 'Stable Heavy Brass Base' },
      { label: 'Suitable For', value: 'Daily Puja, Akhand Jyot, Meditation, Temple & Festive Worship' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Akhand Jyot Diya with Protective Cover' }
    ],
    keyFeatures: [
      'Premium Brass Construction – Solid brass build with traditional detailing.',
      'Traditional Decorative Design – Detailed cutwork with an elegant Om finial.',
      'Protective Flame Cover – Helps reduce the effect of light air movement on the flame.',
      'Stable Brass Base – Designed for safe, stable placement on any puja altar.',
      'Suitable for Akhand Jyot – Engineered for uninterrupted devotional use during Navratri & daily rituals.',
      'Festive & Daily Worship – Ideal for Daily Puja, Aarti, Meditation, Diwali, Navratri, and Lakshmi Puja.',
      'Thoughtful Gifting – Ideal for housewarmings, weddings, festivals, and religious occasions.',
      'Made in India – Authentic Indian artisanal craftsmanship.'
    ],
    careInstructions: [
      'Clean the diya regularly using a soft, dry cloth.',
      'For deeper cleaning, use a suitable brass-cleaning product and dry thoroughly afterward.',
      'Avoid abrasive materials that may scratch the brass surface.',
      'Always allow the diya to cool completely before cleaning or handling the area around the flame.',
      'Place on a stable, heat-resistant surface away from curtains, paper, clothing, and flammable materials.'
    ],
    faqs: [
      { q: 'What makes this Akhand Jyot Diya windproof?', a: 'It features a protective decorative cutwork cover that shields the flame from light air movement.' },
      { q: 'Can this be used for continuous 24-hour Akhand Jyot?', a: 'Yes, it is specially designed for uninterrupted Akhand Jyot during Navratri, festivals, and daily rituals.' },
      { q: 'How should I clean the brass cover?', a: 'Allow the diya to cool completely, then wipe with a soft dry cloth or brass polish.' },
      { q: 'What fuel can be used?', a: 'Pure ghee, sesame oil, or mustard oil can be used with cotton wicks.' }
    ]
  },

  // 6. Brass Cup Jyot Diya (Brass Akhand Jyot Deepak)
  {
    id: 'brass-cup-jyot-diya',
    name: 'Shraviko Brass Akhand Jyot Deepak',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Akhand Jyot',
    price: 1490,
    originalPrice: 1990,
    rating: 4.96,
    reviewsCount: 122,
    tag: 'Akhand Deepak',
    artType: 'jyot',
    fitMode: 'contain',
    image: '/assets/Cup jyot/cup 2.png',
    images: [
      '/assets/Cup jyot/cup 2.png',
      '/assets/Cup jyot/akhand jyot cup 1.png',
      '/assets/Cup jyot/cup 3.png'
    ],
    weightVariants: [
      { weight: 'Small Deepak', price: 990, originalPrice: 1290 },
      { weight: 'Medium Deepak', price: 1490, originalPrice: 1990, default: true },
      { weight: 'Large Royal Deepak', price: 2190, originalPrice: 2790 }
    ],
    purity: '100% Solid Brass with Traditional Polished Finish',
    inStock: true,
    description: 'The Shraviko Brass Akhand Jyot Deepak brings together traditional Indian craftsmanship and timeless design in a diya made for sacred spaces and everyday worship. Crafted from brass with a polished traditional finish, this oil lamp is designed for puja, Akhand Jyot, Aarti, meditation and festive rituals. Its classic form complements home mandirs, prayer rooms and temple spaces while retaining the understated character of a traditional Indian deepak. Features a sturdy brass construction and a dedicated wick holder.',
    shortDescription: 'Traditional brass Akhand Jyot Deepak crafted for daily puja, Aarti, meditation and festive worship. Its classic brass construction and timeless design make it a fitting addition to home mandirs, temples and devotional spaces.',
    seoTitle: 'Brass Akhand Jyot Deepak | Traditional Brass Diya for Puja & Mandir',
    metaDescription: 'Shop the Shraviko Brass Akhand Jyot Deepak, a traditional brass oil lamp for daily puja, Aarti, Akhand Jyot, home mandir, temple worship and festivals.',
    specifications: [
      { label: 'Product', value: 'Brass Akhand Jyot Deepak' },
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Design', value: 'Traditional Deepak Form with Dedicated Wick Holder' },
      { label: 'Finish', value: 'Polished Traditional Brass' },
      { label: 'Base', value: 'Stable Heavy Brass Base' },
      { label: 'Suitable For', value: 'Daily Puja, Akhand Jyot, Aarti, Meditation & Temple Worship' },
      { label: 'Fuel Options', value: 'Pure Ghee or Lamp Oil' },
      { label: 'Wick Type', value: 'Cotton Wick' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Akhand Jyot Deepak' }
    ],
    keyFeatures: [
      'Traditional Brass Construction – Crafted from brass with a classic polished finish.',
      'Traditional Deepak Design – Inspired by the timeless form of Indian oil lamps used in devotional practices.',
      'Designed for Puja – Suitable for daily worship, Aarti, Akhand Jyot and religious ceremonies.',
      'Stable Base – Designed for steady placement on an appropriate, heat-resistant surface.',
      'Dedicated Wick Holder – Designed to hold a cotton wick securely while lighting.',
      'Versatile Use – Suitable for home mandirs, puja rooms, temples, meditation spaces and festive settings.',
      'Timeless Décor – Complements traditional Indian interiors and devotional spaces.',
      'Made in India – Reflecting traditional Indian design and craftsmanship.'
    ],
    careInstructions: [
      'Wipe the deepak with a soft cloth after use.',
      'Use a suitable brass cleaner when deeper cleaning is required.',
      'Avoid abrasive scrubbers and harsh cleaning materials.',
      'Remove remaining oil or residue before long-term storage.',
      'Store in a clean, dry place when not in use.',
      'Always allow the diya to cool completely before cleaning.'
    ],
    faqs: [
      { q: 'What is this diya made of?', a: 'The deepak is crafted from solid brass and features a traditional polished finish.' },
      { q: 'Can this deepak be used for Akhand Jyot?', a: 'Yes. It is designed for devotional use including Akhand Jyot, provided it is used with a suitable wick and compatible lamp oil or ghee and monitored appropriately.' },
      { q: 'Can I use ghee in this diya?', a: 'Yes, ghee can be used if it is suitable for the wick and lamp design.' },
      { q: 'Can I use lamp oil?', a: 'Yes, suitable lamp oil can be used according to your preferred puja practice.' },
      { q: 'Is it suitable for a home mandir?', a: 'Yes. Its traditional design makes it suitable for home mandirs, puja rooms and other devotional spaces.' },
      { q: 'Can it be used for Aarti?', a: 'It can be used as part of puja and Aarti practices. Always handle a lit diya carefully and keep it away from flammable materials.' },
      { q: 'How do I maintain the brass finish?', a: 'Wipe the deepak with a soft cloth and use a suitable brass-cleaning product periodically when required. Avoid abrasive materials.' },
      { q: 'Is this suitable as a gift?', a: 'Yes. A traditional brass deepak can be a meaningful gifting choice for housewarmings, weddings, festivals and religious occasions.' }
    ]
  },

  // 7. Brass Rishi Kamandal
  {
    id: 'brass-kamandal-holy-water-pot',
    name: 'Brass Kamandal with Lid',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Sacred Ritual Vessels',
    price: 2490,
    originalPrice: 3190,
    rating: 4.98,
    reviewsCount: 146,
    tag: 'Gangajali Vessel',
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
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'Bring a timeless element of Indian tradition to your worship space with the Shraviko Brass Kamandal with Lid. Designed in a classic rounded form with traditional detailing, this brass pooja vessel is suitable for keeping Gangajal and for use during daily worship, temple rituals and religious ceremonies. The matching lid provides a convenient way to keep the vessel covered when it is not being used, while the traditional brass construction gives it a distinctive appearance that complements other pooja essentials. The Kamandal can be used for Gangajal, pooja rituals, havan and other traditional ceremonies.',
    shortDescription: 'Traditional brass Kamandal with matching lid, designed for Gangajal, daily puja, temple rituals and religious ceremonies. Its classic rounded design makes it a practical and timeless addition to your home mandir and pooja collection.',
    seoTitle: 'Brass Kamandal with Lid | Traditional Gangajali for Pooja & Mandir',
    metaDescription: 'Shop the Shraviko Brass Kamandal with Lid, a traditional pooja vessel suitable for Gangajal, daily worship, temple rituals, havan and religious ceremonies.',
    specifications: [
      { label: 'Product', value: 'Brass Kamandal with Lid' },
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Design', value: 'Traditional Rounded Vessel with Matching Lid' },
      { label: 'Features', value: 'Matching Protective Lid & Ergonomic Handle' },
      { label: 'Suitable For', value: 'Gangajal Storage, Daily Puja, Temple Worship, Havan & Religious Ceremonies' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Kamandal with Lid' }
    ],
    keyFeatures: [
      'Traditional Brass Construction – Classic brass vessel designed for devotional use.',
      'Matching Lid – Helps keep the vessel covered when not in use.',
      'Traditional Rounded Design – Inspired by the classic form of an Indian Kamandal.',
      'Multipurpose Pooja Vessel – Suitable for Gangajal and various traditional worship practices.',
      'Compact & Convenient – Easy to place in a home mandir or puja space.',
      'Versatile Ritual Use – Suitable for puja, temple worship, havan and religious ceremonies.',
      'Traditional Décor – Complements brass diyas, bells, thalis and other mandir essentials.',
      'Suitable for Gifting – A traditional gift option for religious and family occasions.'
    ],
    careInstructions: [
      'Wipe the Kamandal and lid with a soft cloth.',
      'Use a suitable brass-cleaning product when deeper cleaning is required.',
      'Avoid abrasive scrubbers that may scratch the surface.',
      'Keep the vessel dry when storing it.',
      'Clean and dry the inside before storing for extended periods.'
    ],
    faqs: [
      { q: 'What is this vessel used for?', a: 'It is a traditional Gangajali used for storing Gangajal, holy water, and conducting puja and havan rituals.' },
      { q: 'Does it include a matching lid?', a: 'Yes, it comes with a matching protective brass lid to keep the vessel covered.' },
      { q: 'How do I clean and care for the brass Kamandal?', a: 'Wipe with a soft cloth, use brass polish for deeper cleaning, avoid abrasive scrubbers, and dry thoroughly inside and out.' },
      { q: 'Is it suitable for temple visits and home mandirs?', a: 'Yes, its compact design makes it convenient for home mandirs and portable for temple visits.' },
      { q: 'Is it suitable as a gift?', a: 'Yes, a thoughtful gift for housewarmings, weddings, festivals, and religious occasions.' }
    ]
  },

  // 8. Brass Trishul
  {
    id: 'brass-trishul-with-damru',
    name: 'Brass Trishul with Damru & Stand',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Symbols & Statues',
    price: 2890,
    originalPrice: 3590,
    rating: 4.99,
    reviewsCount: 162,
    tag: 'Shiva Emblem',
    artType: 'trishul',
    fitMode: 'contain',
    image: '/assets/Trishul with damru/trishul with damru1.png',
    images: [
      '/assets/Trishul with damru/trishul with damru1.png',
      '/assets/Trishul with damru/trishul with damru2.png',
      '/assets/Trishul with damru/trishul with damru3.png'
    ],
    weightVariants: [
      { weight: '6 Inch Classic', price: 1490, originalPrice: 1890 },
      { weight: '9 Inch with Damru', price: 2890, originalPrice: 3590, default: true },
      { weight: '12 Inch Ornate Royal', price: 4290, originalPrice: 5190 }
    ],
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'Bring a distinctive element of Shaivite tradition to your devotional space with the Shraviko Brass Trishul with Damru & Stand. Crafted in brass, this decorative Trishul combines two traditional symbols associated with Lord Shiva in a compact standing design. The Trishul (trident) and Damru together give this piece a strong traditional and devotional character. The integrated stand allows the Trishul to be displayed upright without requiring wall mounting. Suitable for home mandir, Pooja Ghar, meditation space, office desk, or car dashboard.',
    specifications: [
      { label: 'Product', value: 'Brass Trishul with Damru & Stand' },
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Symbolism', value: 'Lord Shiva Sacred Trishul Trident & Damru' },
      { label: 'Structure', value: 'Integrated Stable Brass Display Stand' },
      { label: 'Suitable For', value: 'Home Mandir, Pooja Ghar, Meditation Space, Office Desk & Car Dashboard' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Trishul with Damru & Stand' }
    ],
    keyFeatures: [
      'Trishul & Damru Design – Combines two traditional symbols associated with Lord Shiva.',
      'Brass Construction – Crafted from brass with a traditional finish.',
      'Stable Display Stand – Designed for convenient upright placement.',
      'Compact Decorative Form – Suitable for smaller devotional spaces.',
      'Versatile Display – Ideal for home mandirs, Pooja Ghar, offices and meditation spaces.',
      'Traditional Religious Décor – Complements other Shiva and brass devotional accessories.',
      'Suitable for Gifting – Appropriate for Mahashivratri, housewarming and religious occasions.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth to remove dust.',
      'Use a suitable brass-cleaning product when required.',
      'Avoid abrasive scrubbers or harsh chemicals.',
      'Brass naturally develops a patina over time.'
    ],
    faqs: [
      { q: 'What symbols are featured on this piece?', a: 'It features both the sacred Trishul (trident) and the Damru drum associated with Lord Shiva.' },
      { q: 'Does it require wall mounting or installation?', a: 'No, it comes with an integrated stable brass base for upright placement on any flat surface.' },
      { q: 'Where can this Trishul be placed?', a: 'It is suitable for home mandirs, Pooja Ghar, meditation rooms, office desks, and car dashboards.' },
      { q: 'Is it suitable for Mahashivratri gifting?', a: 'Yes, it makes a meaningful gift for Mahashivratri, housewarmings, and Shaivite religious occasions.' }
    ]
  },

  // 9. Standing Altar Trishul
  {
    id: 'brass-trishul-standing-emblem',
    name: 'Brass Trishul with Stand',
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
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'Add a timeless symbol of Lord Shiva to your sacred space with the Shraviko Brass Trishul with Stand. Crafted in brass with a traditional finish, this Trishul is designed as a simple and elegant devotional display piece for home temples, pooja rooms and other sacred spaces. The Trishul (trident) is one of the most widely recognised symbols associated with Lord Shiva. Its traditional form gives the piece a distinctive devotional character while keeping the design simple enough to complement different styles of mandir décor. The included stand allows the Trishul to be displayed upright on a stable surface without requiring wall mounting.',
    specifications: [
      { label: 'Product', value: 'Brass Trishul with Stand' },
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Symbolism', value: 'Lord Shiva Sacred Trishul Trident' },
      { label: 'Structure', value: 'Integrated Stable Round Pedestal Stand' },
      { label: 'Suitable For', value: 'Home Mandir, Pooja Ghar, Meditation Space, Office Desk & Car Dashboard' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Trishul with Stand' }
    ],
    keyFeatures: [
      'Traditional Trishul Design – Inspired by the classic symbol associated with Lord Shiva.',
      'Brass Construction – Crafted from brass with a traditional finish.',
      'Stable Display Stand – Allows convenient upright placement.',
      'Simple Traditional Form – Suitable for both traditional and contemporary devotional spaces.',
      'Versatile Display – Ideal for home mandirs, Pooja Ghar, offices and meditation spaces.',
      'Devotional Décor – Complements other Shiva and traditional brass accessories.',
      'Suitable for Gifting – A traditional choice for Mahashivratri and religious occasions.'
    ],
    careInstructions: [
      'Clean the Trishul gently with a soft, dry cloth.',
      'For deeper cleaning, use a suitable brass-cleaning product.',
      'Avoid abrasive materials and harsh chemicals.',
      'Natural changes in the appearance of brass over time are normal.'
    ],
    faqs: [
      { q: 'What does the Trishul symbolize?', a: 'The Trishul (trident) is the sacred emblem of Lord Shiva, representing creation, protection, and transformation.' },
      { q: 'Does this Trishul need wall mounting?', a: 'No, it comes with an integrated round brass stand for stable upright placement.' },
      { q: 'Where can I display this Trishul?', a: 'It can be placed in home mandirs, Pooja Ghar, meditation spaces, office desks, shelves, or car dashboards.' },
      { q: 'Is it suitable for Mahashivratri gifting?', a: 'Yes, it makes a meaningful gift for Mahashivratri, housewarmings, and religious ceremonies.' }
    ]
  },

  // 9. Brass Gomukhi Shringi
  {
    id: 'brass-gomukhi-shringi-abhishekam',
    name: 'Pure Brass Gaumukh Shringi',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Sacred Abhishekam Vessels',
    price: 1490,
    originalPrice: 1890,
    rating: 4.98,
    reviewsCount: 152,
    tag: 'Gomukhi Patra',
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
      { weight: 'Small (4.5 cm)', price: 690, originalPrice: 890 },
      { weight: 'Small-Medium (5 cm)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (6.25 cm)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Large (7 cm)', price: 1990, originalPrice: 2490 },
      { weight: 'Extra Large (8 cm)', price: 2590, originalPrice: 3190 }
    ],
    purity: '100% Pure Solid Brass',
    inStock: true,
    description: 'The Shraviko Pure Brass Gaumukh Shringi is a traditional pooja accessory designed for performing Shivling Abhishek. Crafted from brass with a traditional finish, it features a distinctive Gaumukh-inspired spout designed to direct ritual offerings toward the Shivling. The Shringi can be used with commonly used Abhishek offerings such as water, Gangajal, milk and Panchamrit, according to your family\'s or religious practice. Its traditional form makes it a natural addition to a Shiva-focused home mandir, temple or puja setup.',
    shortDescription: 'Traditional Pure Brass Gaumukh Shringi designed for Shivling Abhishek. Suitable for water, Gangajal, milk and Panchamrit during daily Shiva worship, Rudrabhishek, Sawan and Mahashivratri.',
    seoTitle: 'Pure Brass Gaumukh Shringi | Gomukhi Abhishek Patra for Shivling',
    metaDescription: 'Shop the Shraviko Pure Brass Gaumukh Shringi for Shivling Abhishek. Traditional Gomukhi Patra for water, Gangajal, milk and Panchamrit during Shiva Puja.',
    specifications: [
      { label: 'Product Type', value: 'Gaumukh Shringi / Gomukhi Abhishek Patra' },
      { label: 'Material', value: '100% Pure Solid Brass' },
      { label: 'Finish', value: 'Traditional / Polished Brass' },
      { label: 'Design', value: 'Traditional Gaumukh Spout' },
      { label: 'Primary Use', value: 'Shivling Abhishek' },
      { label: 'Suitable Offerings', value: 'Water, Gangajal, Milk, Panchamrit' },
      { label: 'Suitable For', value: 'Home Mandir, Temple, Pooja Room' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'Pack Quantity', value: '1 Piece' },
      { label: 'What\'s Included', value: '1 × Pure Brass Gaumukh Shringi' }
    ],
    keyFeatures: [
      'Traditional Gaumukh Design – Features a distinctive Gaumukh-inspired outlet traditionally associated with Abhishek rituals and Shiva worship.',
      'Brass Construction – Crafted from brass with a traditional finish that complements other brass items in your mandir.',
      'Designed for Shivling Abhishek – Suitable for directing ritual offerings toward the Shivling during Abhishek.',
      'Suitable for Multiple Offerings – Can be used with water, Gangajal, milk and Panchamrit according to your worship practice.',
      'Compact Pooja Essential – Designed to fit conveniently into a home mandir, puja cabinet or Shiva worship setup.',
      'For Daily & Festive Worship – Suitable for daily Shiva puja, Rudrabhishek, Sawan, Mahashivratri and religious ceremonies.',
      'Traditional Gifting Choice – A suitable devotional gift for Shiva devotees, housewarmings, festivals and religious occasions.'
    ],
    careInstructions: [
      'Rinse the Shringi immediately after use.',
      'Wipe with a soft cloth and dry thoroughly before storage.',
      'Use a suitable brass-cleaning product when required for deeper polishing.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Store in a clean, dry place.'
    ],
    faqs: [
      { q: 'What is the primary use of this Gaumukh Shringi?', a: 'It is specially designed for directing liquid offerings (water, Gangajal, milk, Panchamrit) toward the Shivling during Abhishek rituals.' },
      { q: 'What offerings can be used in the Shringi?', a: 'You can use water, Gangajal, raw milk, honey, ghee, and Panchamrit according to your puja practice.' },
      { q: 'How do I clean the Shringi after Panchamrit or milk Abhishek?', a: 'Rinse thoroughly with clean water immediately after use, wipe with a soft cloth, and dry completely before storing.' },
      { q: 'Is it available in multiple sizes?', a: 'Yes, available in 5 sizes ranging from Small (4.5 cm) to Extra Large (8 cm) for various Shivling sizes.' },
      { q: 'Is this suitable as a gift for Shiva devotees?', a: 'Yes, it makes a sacred devotional gift for Sawan, Mahashivratri, housewarmings, and religious ceremonies.' }
    ]
  },

  // 10. Brass Simhasanam Throne
  {
    id: 'brass-singhasan-deity-throne',
    name: 'Brass God Singhasan',
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
    purity: '100% Solid Brass with Polished Finish',
    inStock: true,
    description: 'Give your deity idols a traditional and elegant place in your home mandir with the Shraviko Brass God Singhasan. Crafted from brass with a polished traditional finish, this decorative singhasan is designed as a dedicated seating platform for small deity idols. The singhasan can be used with Laddu Gopal, Krishna, Kanha, Laxmi, Ganesh and other suitable deity idols, making it a versatile addition to your pooja collection. Its detailed design adds a traditional character to your mandir while providing an elevated platform for displaying your chosen deity.',
    shortDescription: 'Traditional brass God Singhasan designed as a decorative seating platform for Laddu Gopal, Krishna, Kanha, Laxmi, Ganesh and other suitable deity idols. Ideal for home mandirs, daily puja, festive decoration and religious occasions.',
    seoTitle: 'Brass God Singhasan for Laddu Gopal | Traditional Pooja Chowki',
    metaDescription: 'Shop the Shraviko Brass God Singhasan for Laddu Gopal, Krishna, Laxmi and Ganesh idols. Traditional pooja chowki for home mandir, daily worship and festivals.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Type', value: 'God Singhasan / Pooja Chowki' },
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Finish', value: 'Polished Brass / Gold Tone' },
      { label: 'Shape', value: 'Rectangle Platform' },
      { label: 'Suitable For', value: 'Laddu Gopal, Krishna, Laxmi & Ganesh Idols' },
      { label: 'Number of Pieces', value: '1' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Brass God Singhasan' }
    ],
    keyFeatures: [
      'Traditional Brass Construction – Crafted from brass with a polished traditional finish.',
      'Designed for Deity Idols – Suitable for Laddu Gopal, Krishna, Kanha, Laxmi, Ganesh and other appropriately sized idols.',
      'Decorative Singhasan Design – Detailed traditional styling adds character to your mandir arrangement.',
      'Elevated Display – Provides a dedicated seating platform for displaying a deity idol.',
      'Versatile Pooja Use – Suitable for daily worship, festive decoration and religious ceremonies.',
      'Home Mandir Essential – Designed to complement home temples and puja rooms.',
      'Traditional Gifting Option – Suitable for housewarming, weddings, festivals and religious occasions.',
      'Easy to Maintain – Can be cleaned with a soft cloth to maintain its appearance.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth.',
      'Keep away from prolonged moisture.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Use a suitable brass cleaner when deeper cleaning is required.',
      'Keep the singhasan dry when not in use.',
      'Handle carefully to protect the decorative detailing.'
    ],
    faqs: [
      { q: 'What deity idols can be placed on this Singhasan?', a: 'It is suitable for Laddu Gopal, Krishna, Kanha, Laxmi, Ganesh, and other small-to-medium deity idols.' },
      { q: 'Does it include the deity idol shown in images?', a: 'No, the package includes 1 × Brass God Singhasan (deity idols are shown for display purposes).' },
      { q: 'How do I clean and maintain the brass Singhasan?', a: 'Wipe gently with a soft dry cloth, avoid harsh scrubbers, and dry thoroughly.' },
      { q: 'Is it suitable for housewarming and festive gifting?', a: 'Yes, it makes a traditional gift for housewarmings, Janmashtami, Diwali, Ganesh Chaturthi, and weddings.' }
    ]
  },

  // 11. Laddu Gopal Brass Idol
  {
    id: 'brass-ladoo-gopal-statue',
    name: 'Shraviko Brass Laddu Gopal Idol',
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
      '/assets/ladoo gopal/ladoo gopal 1.png',
      '/assets/ladoo gopal/ladoogopal4.png',
      '/assets/ladoo gopal/ladoogpal3.jpg',
      '/assets/ladoo gopal/ladoo5.png'
    ],
    weightVariants: [
      { weight: 'Size 0 (6 cm)', price: 690, originalPrice: 890 },
      { weight: 'Size 1 (7 cm)', price: 990, originalPrice: 1290 },
      { weight: 'Size 2 (8 cm)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Size 3 (10 cm)', price: 1890, originalPrice: 2490 },
      { weight: 'Size 4 (12 cm)', price: 2590, originalPrice: 3290 },
      { weight: 'Size 5 (14 cm)', price: 3490, originalPrice: 4290 },
      { weight: 'Size 6 (18 cm)', price: 4890, originalPrice: 5990 }
    ],
    purity: '100% Solid Brass with Traditional Finish',
    inStock: true,
    description: 'The Shraviko Brass Laddu Gopal Idol is a beautifully designed devotional piece for your home mandir, Pooja Ghar, temple, or prayer space. Crafted from brass, it features a traditional golden-brass appearance that complements both classic and contemporary pooja setups. Designed as Laddu Gopal, Bal Gopal, and Krishna Ji, this idol is suitable for daily worship as well as festive occasions. Its detailed traditional form makes it a meaningful addition to your devotional collection while adding an elegant touch to your mandir decor.',
    shortDescription: 'Traditional Shraviko Brass Laddu Gopal Idol crafted for home mandir, daily puja, Janmashtami celebrations, and religious gifting. Available in multiple sizes from 6 cm to 18 cm.',
    seoTitle: 'Shraviko Brass Laddu Gopal Idol | Bal Gopal Krishna Statue for Mandir',
    metaDescription: 'Shop the Shraviko Brass Laddu Gopal Idol for home mandir, daily worship, Janmashtami celebrations and religious gifting. Available in multiple sizes.',
    specifications: [
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Deity', value: 'Laddu Gopal / Bal Gopal / Krishna Ji' },
      { label: 'Product Type', value: 'Devotional Idol' },
      { label: 'Colour / Tone', value: 'Golden / Brass Tone' },
      { label: 'Finish', value: 'Traditional Polished' },
      { label: 'Pack Quantity', value: '1 Piece' },
      { label: 'Available Sizes', value: '6 cm, 7 cm, 8 cm, 10 cm, 12 cm, 14 cm, 18 cm' },
      { label: 'Suitable For', value: 'Home Mandir, Pooja Room & Temple' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Shraviko Brass Laddu Gopal Idol' }
    ],
    keyFeatures: [
      'Pure Brass Construction – Crafted from brass with a traditional golden-brass finish.',
      'Sacred Deity Form – Designed as Laddu Gopal, Bal Gopal, and Krishna Ji.',
      'Daily & Festive Worship – Ideal for daily pooja, Janmashtami, and special celebrations.',
      'Home Mandir Essential – Complements classic and contemporary temple setups.',
      'Available in Multiple Sizes – Choose from 6 cm up to 18 cm.',
      'Devotional Gifting – Suitable for housewarming ceremonies, Janmashtami, and religious gifts.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth to remove dust.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Keep the idol away from prolonged moisture to maintain its appearance.',
      'Brass may naturally develop a patina over time, which is a normal characteristic of the material.'
    ],
    faqs: [
      { q: 'What deity is represented by this idol?', a: 'It represents Laddu Gopal (Bal Gopal / Baby Krishna Ji).' },
      { q: 'What sizes are available for this idol?', a: 'Available in 7 size variants: 6 cm, 7 cm, 8 cm, 10 cm, 12 cm, 14 cm, and 18 cm.' },
      { q: 'Is it suitable for daily worship and Janmashtami?', a: 'Yes, it is ideal for daily mandir pooja as well as Janmashtami celebrations.' },
      { q: 'How do I clean and care for the idol?', a: 'Wipe gently with a soft dry cloth, avoid harsh chemicals or moisture, and let natural brass patina develop.' },
      { q: 'Is this idol suitable for gifting?', a: 'Yes, a sacred gift for housewarmings, weddings, Janmashtami, and religious occasions.' }
    ]
  },

  // 15B. Brass Kalash Pooja Vessel
  {
    id: 'brass-kalash-pooja-vessel',
    name: 'Brass Pooja Kalash Lota',
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
    purity: '100% Solid Brass with Polished Finish',
    inStock: true,
    description: 'Bring a traditional touch to your pooja rituals with the Shraviko Brass Pooja Kalash Lota. Crafted from brass, this traditional Kalash Lota is designed for use during daily pooja, abhishek and religious ceremonies. It can be used to hold water, Gangajal and other liquids required during worship. Its classic design complements both traditional and contemporary pooja arrangements, making it suitable for a home temple, Pooja Ghar, mandir or devotional space. The Kalash Lota can be used during Ganesh Pooja, Krishna Pooja, Shiva Pooja, Devi Pooja, Havan, Grah Pravesh, Diwali and other festive or religious occasions.',
    shortDescription: 'A traditional brass Kalash Lota designed for daily pooja, abhishek and religious rituals. Its classic form makes it a practical addition to your home mandir, pooja room or devotional setup.',
    seoTitle: 'Brass Pooja Kalash Lota | Traditional Brass Pooja Vessel | Shraviko',
    metaDescription: 'Shop Shraviko Brass Pooja Kalash Lota for daily pooja, abhishek, home temple and religious rituals. A traditional brass pooja accessory for your mandir.',
    specifications: [
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Product Type', value: 'Pooja Kalash Lota' },
      { label: 'Colour / Tone', value: 'Brass / Golden' },
      { label: 'Shape', value: 'Round' },
      { label: 'Usage', value: 'Pooja, Abhishek & Religious Rituals' },
      { label: 'Suitable For', value: 'Home Temple, Pooja Room & Mandir' },
      { label: 'Pack Quantity', value: '1 Piece' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Brass Pooja Kalash Lota' }
    ],
    keyFeatures: [
      'Pure Brass Construction – Crafted from brass with a polished traditional finish.',
      'Designed for Abhishek & Pooja – Ideal for holding water, Gangajal, and ritual liquids during worship.',
      'Multi-Deity Ceremonies – Suitable for Ganesh Pooja, Krishna Pooja, Shiva Pooja, Devi Pooja, and Havan.',
      'Festive & Grah Pravesh Essential – Perfect for Grah Pravesh, Diwali, Navratri, and religious ceremonies.',
      'Classic Round Form – Traditional Kalash Lota shape that complements home mandir setups.',
      'Devotional Gifting – A timeless brass gift for housewarmings, festivals, and religious occasions.'
    ],
    careInstructions: [
      'Wipe with a soft, dry cloth after use.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Keep the product dry when not in use.',
      'Natural brass may develop a patina over time, which is a normal characteristic of the material.'
    ],
    faqs: [
      { q: 'What is this Kalash Lota used for?', a: 'It is designed for daily pooja, Abhishek, storing Gangajal, and holding ritual liquids during ceremonies.' },
      { q: 'Which ceremonies is this Kalash suitable for?', a: 'Suitable for Ganesh Pooja, Krishna Pooja, Shiva Pooja, Devi Pooja, Havan, Grah Pravesh, Diwali, and Navratri.' },
      { q: 'How do I clean and care for the brass Kalash?', a: 'Wipe with a soft, dry cloth after use, avoid abrasive scrubbers or harsh chemicals, and keep dry.' },
      { q: 'Is it suitable for devotional gifting?', a: 'Yes, a timeless traditional gift for housewarmings, weddings, festivals, and religious rituals.' }
    ]
  },

  // 15C. Hand-Engraved Artisanal Brass Design Puja Thali Set
  {
    id: 'brass-design-thali-set',
    name: 'Brass Peacock Pooja Thali',
    category: 'brass',
    categoryName: 'Brass Articles',
    subcategory: 'Brass Puja Thali',
    price: 2290,
    originalPrice: 2890,
    rating: 4.99,
    reviewsCount: 152,
    tag: 'Peacock Thali',
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
      { weight: '6 Inch Peacock Thali', price: 1190, originalPrice: 1490 },
      { weight: '8 Inch Peacock Thali', price: 1690, originalPrice: 2190 },
      { weight: '10 Inch Peacock Thali', price: 2290, originalPrice: 2890, default: true },
      { weight: '12 Inch Royal Peacock Thali', price: 3290, originalPrice: 3990 }
    ],
    purity: '100% Solid Brass with Traditional Polish',
    inStock: true,
    description: 'Bring the elegance of traditional Indian craftsmanship to your worship space with the Shraviko Brass Peacock Pooja Thali. Designed with a detailed peacock motif, this round brass thali adds a traditional character to your pooja arrangement while providing a practical surface for organizing essential ritual items. Use it to arrange diya, kumkum, roli, akshat, flowers, incense, prasad and other pooja essentials during daily worship. Made for daily rituals and special occasions including Aarti, Bhog, Tilak, Prasad, Diwali, Navratri, Ganesh Chaturthi, Janmashtami, housewarming ceremonies, and weddings.',
    shortDescription: 'A beautifully detailed brass pooja thali featuring a traditional peacock design, made for aarti, bhog, tilak, prasad and everyday worship. A timeless addition to your home mandir and festive celebrations.',
    seoTitle: 'Brass Peacock Pooja Thali | Traditional Aarti Thali | Shraviko',
    metaDescription: 'Shop Shraviko Brass Peacock Pooja Thali for aarti, bhog, tilak and prasad. Traditional decorative brass thali for home temples, mandirs, daily pooja and festivals.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Name', value: 'Brass Peacock Pooja Thali' },
      { label: 'Material', value: '100% Solid Brass' },
      { label: 'Design Motif', value: 'Traditional Peacock Detailing' },
      { label: 'Shape', value: 'Round' },
      { label: 'Finish', value: 'Traditional Brass Finish' },
      { label: 'Colour / Tone', value: 'Brass / Golden' },
      { label: 'Usage', value: 'Pooja, Aarti, Bhog, Tilak & Prasad' },
      { label: 'Suitable For', value: 'Home Temple, Pooja Room & Mandir' },
      { label: 'Available Sizes', value: '6 Inch, 8 Inch, 10 Inch, 12 Inch' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Shraviko Brass Peacock Pooja Thali' }
    ],
    keyFeatures: [
      'Peacock Design Motif – Features detailed traditional peacock artwork that adds distinct beauty to your mandir.',
      'Pure Brass Construction – Crafted from high-quality brass with a traditional polished golden finish.',
      'Multipurpose Ritual Surface – Ideal for organizing diyas, kumkum, roli, akshat, flowers, incense, and prasad.',
      'Everyday & Festive Worship – Suitable for Aarti, Bhog, Tilak, Prasad, Diwali, Navratri, Ganesh Chaturthi, and Janmashtami.',
      'Available in Multiple Sizes – Choose from 6 Inch, 8 Inch, 10 Inch, and 12 Inch sizes.',
      'Traditional Gifting Option – A thoughtful gift for housewarmings, weddings, and setting up a new pooja space.'
    ],
    careInstructions: [
      'Clean gently with a soft cloth.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Dry completely after washing.',
      'Store in a dry place when not in use.',
      'Brass naturally develops a patina over time, which is a normal characteristic of the material.'
    ],
    faqs: [
      { q: 'What is the motif on this thali?', a: 'It features a detailed traditional peacock design etched into the brass surface.' },
      { q: 'What rituals can I perform using this thali?', a: 'It is ideal for Aarti, Bhog offerings, Tilak, Prasad distribution, and daily pooja rituals.' },
      { q: 'What sizes are available for this thali?', a: 'Available in 4 size variants: 6 Inch, 8 Inch, 10 Inch, and 12 Inch.' },
      { q: 'How do I clean and care for the peacock thali?', a: 'Clean gently with a soft cloth, dry completely after washing, avoid abrasive scrubbers or harsh chemicals, and store dry.' },
      { q: 'Is it suitable for gifting?', a: 'Yes, a thoughtful gift for housewarming ceremonies, weddings, festivals, and new home mandir setups.' }
    ]
  },

  // 13. Copper Panchpatra Set
  {
    id: 'copper-panchpatra-pali-set',
    name: 'Pure Copper Panchpatra Udharini Set with Snake Head Spoon',
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
      { weight: 'Standard Set (70g / 150 ml)', price: 890, originalPrice: 1190 },
      { weight: 'Medium Set (250 ml)', price: 1290, originalPrice: 1690, default: true },
      { weight: 'Royal Heavy Set (400 ml)', price: 1890, originalPrice: 2390 }
    ],
    purity: '100% Pure Copper with Hammered Finish',
    inStock: true,
    description: 'Bring a traditional element to your worship space with the Shraviko Pure Copper Panchpatra Udharini Set. The set includes a copper Panchpatra paired with a traditionally styled snake-head Udharini spoon, making it suitable for rituals where water or other offerings are required. The included Udharini features a distinctive snake-head design, giving the set a traditional and decorative character. The Panchpatra can be used for keeping Gangajal, Charanamrit, Panchamrit and water during worship. The traditional hammered copper finish adds texture and visual character while maintaining its authentic traditional appearance.',
    shortDescription: 'A traditional pure copper Panchpatra and Udharini set designed for daily pooja, Gangajal, Charanamrit and other religious rituals. Featuring a distinctive snake-head Udharini spoon and traditional hammered finish, it is a functional addition to your home mandir and pooja collection.',
    seoTitle: 'Pure Copper Panchpatra Udharini Set | Snake Head Spoon | Shraviko',
    metaDescription: 'Shop Shraviko Pure Copper Panchpatra Udharini Set with traditional snake-head spoon. Ideal for daily pooja, Gangajal, Charanamrit, Panchamrit, home mandir and religious rituals.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Name', value: 'Pure Copper Panchpatra Udharini Set' },
      { label: 'Material', value: '100% Pure Copper' },
      { label: 'Set Includes', value: '1 × Copper Panchpatra + 1 × Snake Head Udharini Spoon' },
      { label: 'Spoon Motif', value: 'Traditional Snake Head Design' },
      { label: 'Finish', value: 'Hammered & Polished Finish' },
      { label: 'Usage', value: 'Daily Pooja, Gangajal, Charanamrit & Panchamrit' },
      { label: 'Dimensions', value: 'Height 6.4 cm × Diameter 6.6 cm (Approx. 70g)' },
      { label: 'Suitable For', value: 'Home Temple, Mandir & Pooja Room' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Copper Panchpatra, 1 × Copper Snake Head Udharini Spoon' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Crafted from pure copper with a traditional hammered and polished finish.',
      'Snake-Head Udharini Spoon – Includes a uniquely sculpted snake-head Udharini spoon for precise ritual pouring.',
      'Multi-Purpose Ritual Vessel – Ideal for Gangajal, Charanamrit, Panchamrit, and sacred water offerings.',
      'Versatile Pooja Application – Suitable for daily worship, Havan, Rudrabhishek, Diwali, Navratri, and Shivratri.',
      'Traditional Hammered Finish – Intricate hammered texture adds visual depth and authentic artisanal charm.',
      'Thoughtful Religious Gift – Perfect for housewarmings, weddings, festivals, and sacred pooja ceremonies.'
    ],
    careInstructions: [
      'Clean gently with a soft cloth.',
      'Keep the copper pieces dry after washing.',
      'Avoid abrasive scrubbers that can scratch the surface.',
      'Use a suitable copper-cleaning method when required (e.g., pitambari or lemon/salt).',
      'Natural copper may develop a darker or patinated appearance over time.'
    ],
    faqs: [
      { q: 'What is included in this set?', a: '1 × Pure Copper Panchpatra vessel and 1 × Copper Snake Head Udharini spoon.' },
      { q: 'What offerings can be stored in the Panchpatra?', a: 'It is ideal for storing Gangajal, Charanamrit, Panchamrit, and sacred ritual water.' },
      { q: 'What is the significance of the snake-head spoon?', a: 'The snake-head Udharini is a traditional Vedic ritual motif designed for easy handling and precise ritual pouring.' },
      { q: 'How do I clean and maintain copper vessels?', a: 'Wipe with a soft cloth after use, dry thoroughly, and use pitambari or lemon with salt to restore copper shine.' },
      { q: 'Is it suitable for religious gifting?', a: 'Yes, an ideal gift for housewarmings, weddings, Diwali, Navratri, and sacred ceremonies.' }
    ]
  },

  // 14. Copper Puja Thali Set
  {
    id: 'copper-puja-thali-set',
    name: 'Pure Copper Pooja Thali',
    category: 'copper',
    categoryName: 'Copper Articles',
    subcategory: 'Copper Puja Thali',
    price: 1790,
    originalPrice: 2290,
    rating: 4.98,
    reviewsCount: 164,
    tag: 'Pure Copper Thali',
    artType: 'thali',
    fitMode: 'contain',
    image: '/assets/Copper thali/copper thali 1.png',
    images: [
      '/assets/Copper thali/copper thali 1.png',
      '/assets/Copper thali/copperthali6.png',
      '/assets/Copper thali/copper thali1.png',
      '/assets/Copper thali/copper thali 2.png',
      '/assets/Copper thali/copper thali 3.jpg',
      '/assets/Copper thali/copper thali  5.png'
    ],
    weightVariants: [
      { weight: '6 Inch Copper Thali', price: 1190, originalPrice: 1490 },
      { weight: '8 Inch Copper Thali', price: 1790, originalPrice: 2290, default: true },
      { weight: '10 Inch Royal Copper Thali', price: 2490, originalPrice: 3190 }
    ],
    purity: '100% Pure Copper with Traditional Finish',
    inStock: true,
    description: 'The Shraviko Pure Copper Pooja Thali is designed for traditional Indian worship and devotional ceremonies. Its simple round form and copper construction make it a practical addition to your home mandir, pooja room or temple setup. Use the thali to arrange essential pooja items such as diya, kumkum, flowers, akshat, prasad, incense sticks and other worship accessories. Its open design allows you to organize your pooja essentials conveniently during daily worship and special ceremonies.',
    shortDescription: 'Bring traditional elegance to your pooja space with the Shraviko Pure Copper Pooja Thali. Crafted from copper with a classic handcrafted finish, it is suitable for daily aarti, festivals, home temple rituals and religious ceremonies. Available in 6-inch, 8-inch and 10-inch sizes.',
    seoTitle: 'Pure Copper Pooja Thali | Copper Aarti Plate | Shraviko',
    metaDescription: 'Shop Shraviko Pure Copper Pooja Thali for daily aarti, home temple, mandir and religious ceremonies. Available in 6, 8 and 10 inch sizes.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Name', value: 'Pure Copper Pooja Thali' },
      { label: 'Material', value: '100% Pure Copper' },
      { label: 'Product Type', value: 'Pooja Thali / Aarti Plate' },
      { label: 'Shape', value: 'Round' },
      { label: 'Available Sizes', value: '6 Inch, 8 Inch, 10 Inch' },
      { label: 'Finish', value: 'Traditional / Polished' },
      { label: 'Usage', value: 'Daily Pooja, Aarti & Religious Ceremonies' },
      { label: 'Suitable For', value: 'Home Temple, Mandir & Pooja Room' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Pure Copper Pooja Thali' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Crafted from pure copper with a classic handcrafted finish.',
      'Multi-Purpose Aarti Plate – Suitable for daily aarti, organizing diyas, kumkum, flowers, akshat, prasad, and incense.',
      'Everyday & Festive Rituals – Ideal for home mandirs, Diwali, Navratri, Ganesh Chaturthi, and temple worship.',
      'Available in Multiple Sizes – Choose from 6-inch, 8-inch, and 10-inch diameter variants.',
      'Timeless Handcrafted Appearance – Complements both traditional and contemporary pooja room arrangements.',
      'Traditional Gifting Choice – Perfect for housewarming ceremonies, weddings, festivals, and religious occasions.'
    ],
    careInstructions: [
      'Wipe with a soft, dry cloth after use.',
      'Keep the thali dry when not in use.',
      'Avoid abrasive scrubbers that may scratch the copper surface.',
      'Do not use harsh chemicals or strong cleaning agents.',
      'Copper naturally develops a patina over time due to oxidation.',
      'Use a suitable copper-cleaning method when you want to restore its shine.'
    ],
    faqs: [
      { q: 'What sizes are available for this copper thali?', a: 'Available in 3 sizes: 6 Inch, 8 Inch, and 10 Inch.' },
      { q: 'What can be arranged on this thali?', a: 'It provides ample space for diyas, kumkum, flowers, akshat, prasad, incense sticks, and bell.' },
      { q: 'How do I clean and maintain pure copper thalis?', a: 'Wipe dry after use, avoid abrasive scrubbers, and clean with pitambari or lemon/salt to restore its natural copper luster.' },
      { q: 'Is it suitable for festive gifting?', a: 'Yes, a classic traditional gift for Diwali, Navratri, housewarmings, weddings, and religious ceremonies.' }
    ]
  },

  // 15. Copper Hawan Kund
  {
    id: 'copper-hawan-kund-pyre',
    name: 'Pure Copper Hawan Kund with Dual Handles',
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
      { weight: '4 Inch (Compact)', price: 990, originalPrice: 1290 },
      { weight: '5.5 Inch (Home Use)', price: 1590, originalPrice: 1990 },
      { weight: '7 Inch (Family Havan)', price: 2490, originalPrice: 3190, default: true },
      { weight: '8.5 Inch (Large Ritual)', price: 3490, originalPrice: 4290 },
      { weight: '13 Inch (Temple Ceremony)', price: 5490, originalPrice: 6890 }
    ],
    purity: '100% Solid Pure Copper',
    inStock: true,
    description: 'The Shraviko Pure Copper Hawan Kund is designed for traditional fire rituals and devotional ceremonies. Its square structure provides a practical space for conducting Havan and Yagya rituals at home, in temples or during religious gatherings. Made from copper, the Hawan Kund has a traditional metallic appearance that complements a variety of pooja arrangements. The kund features two side handles that make it easier to lift and reposition when required. The flat-bottom square construction allows the Hawan Kund to sit securely on a suitable heat-resistant surface during use.',
    shortDescription: 'Bring traditional craftsmanship to your sacred rituals with the Shraviko Pure Copper Hawan Kund. Designed with a classic square shape and dual side handles, it is suitable for Havan, Yagya, Homam, Agnihotra, Griha Pravesh and other religious ceremonies. Available in multiple sizes for different pooja requirements.',
    seoTitle: 'Pure Copper Hawan Kund with Handles | Havan Kund | Shraviko',
    metaDescription: 'Shop Shraviko Pure Copper Hawan Kund with dual handles for Havan, Yagya, Homam, Agnihotra and religious ceremonies. Available in multiple sizes.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Name', value: 'Pure Copper Hawan Kund' },
      { label: 'Material', value: '100% Pure Copper' },
      { label: 'Shape', value: 'Square Pyramidal' },
      { label: 'Handles', value: 'Dual Side Ring Handles' },
      { label: 'Finish', value: 'Traditional / Polished' },
      { label: 'Available Sizes', value: '4 Inch, 5.5 Inch, 7 Inch, 8.5 Inch, 13 Inch' },
      { label: 'Usage', value: 'Havan, Yagya, Homam, Agnihotra & Religious Rituals' },
      { label: 'Suitable For', value: 'Home, Temple & Religious Ceremonies' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Pure Copper Hawan Kund' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Made from high-quality copper for traditional fire rituals.',
      'Dual Side Handles – Ergonomic side handles for easy lifting, repositioning, and handling.',
      'Stable Square Design – Flat-bottom square pyramidal shape ensures steady placement on heat-resistant surfaces.',
      'Multiple Size Options – Available in 5 sizes ranging from 4-inch up to 13-inch.',
      'Versatile Ceremonial Pyre – Suitable for Havan, Yagya, Homam, Agnihotra, Griha Pravesh, Satyanarayan Pooja, and Navgraha Pooja.',
      'Sacred Fire Safety – Designed with proper depth and rim clearance for safe ritual combustion.'
    ],
    careInstructions: [
      'Allow the Hawan Kund to cool completely before handling or cleaning.',
      'Place it only on a stable, heat-resistant, non-flammable surface.',
      'Keep away from curtains, paper, furniture and other combustible materials.',
      'Never leave an active fire unattended and keep children/pets away.',
      'Clean with a soft cloth after the kund has completely cooled.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Copper may naturally develop a darker patina over time.'
    ],
    faqs: [
      { q: 'What sizes are available for this Hawan Kund?', a: 'Available in 5 sizes: 4 Inch, 5.5 Inch, 7 Inch, 8.5 Inch, and 13 Inch.' },
      { q: 'What rituals is this Hawan Kund suitable for?', a: 'Ideal for Havan, Yagya, Homam, Agnihotra, Griha Pravesh, Satyanarayan Pooja, and Navgraha Pooja.' },
      { q: 'What safety precautions should be followed?', a: 'Place on a heat-resistant surface, keep away from flammable items, never leave active fire unattended, and cool completely before cleaning.' },
      { q: 'How do I clean and care for the copper Hawan Kund?', a: 'Allow to cool completely, wipe ash with a dry soft cloth, avoid abrasive scrubbers, and use copper cleaner for deep polishing.' }
    ]
  },

  // 15C. Copper Kalash Pooja Vessel
  {
    id: 'copper-kalash-pooja-vessel',
    name: 'Pure Copper Kalash',
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
      { weight: '64 g (Small / Daily Pooja)', price: 790, originalPrice: 990 },
      { weight: '240 g (Large / Sthapana & Ceremonies)', price: 1490, originalPrice: 1890, default: true }
    ],
    purity: '100% Pure Copper',
    inStock: true,
    description: 'The Shraviko Pure Copper Kalash is a traditional pooja accessory designed for devotional and religious use. Made from copper, its classic form complements traditional pooja arrangements and home mandir setups. The Kalash can be used for keeping water and ritual offerings according to your customary pooja practices. It is suitable for daily worship as well as occasions such as Havan, Griha Pravesh, Diwali, Navratri, Ganesh Pooja, Satyanarayan Pooja and other religious ceremonies. Its simple and traditional design makes it easy to pair with other pooja essentials.',
    shortDescription: 'Bring a traditional touch to your pooja space with the Shraviko Pure Copper Kalash. Crafted from copper in a classic Kalash design, it is suitable for daily pooja, home temples, mandirs and religious ceremonies.',
    seoTitle: 'Pure Copper Kalash | Traditional Copper Pooja Vessel | Shraviko',
    metaDescription: 'Shop Shraviko Pure Copper Kalash for daily pooja, home temple, Havan, Griha Pravesh, Diwali, Navratri and religious ceremonies. Available in 64g and 240g variants.',
    specifications: [
      { label: 'Brand', value: 'Shraviko' },
      { label: 'Product Name', value: 'Pure Copper Kalash' },
      { label: 'Material', value: '100% Pure Copper' },
      { label: 'Product Type', value: 'Pooja Kalash' },
      { label: 'Shape', value: 'Round' },
      { label: 'Colour', value: 'Copper' },
      { label: 'Available Options', value: '64 g and 240 g' },
      { label: 'Suitable For', value: 'Pooja, Home Temple, Mandir & Religious Ceremonies' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'Quantity', value: '1 Piece' },
      { label: 'What\'s Included', value: '1 × Pure Copper Kalash' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Crafted from pure copper in a traditional round Kalash form.',
      'Water & Ritual Offerings – Suitable for storing water, Gangajal, and ritual offerings during worship.',
      'Versatile Ceremonial Vessel – Ideal for Havan, Griha Pravesh, Diwali, Navratri, Ganesh Pooja, and Satyanarayan Pooja.',
      'Easy to Pair – Pairs seamlessly with copper/brass pooja thalis, Panchpatra Udharini, and diyas.',
      'Available Weight Variants – Offered in 64 g and 240 g weight variants.',
      'Traditional Mandir Decor – Complements both home temples and larger mandir setups.'
    ],
    careInstructions: [
      'Clean gently with a soft cloth.',
      'Keep dry when not in use.',
      'Avoid abrasive scrubbers and harsh chemicals.',
      'Copper naturally develops a patina over time; this is a normal characteristic of the material.'
    ],
    faqs: [
      { q: 'What weight variants are available for this copper Kalash?', a: 'Available in 64 g and 240 g options.' },
      { q: 'What can be kept inside the Kalash?', a: 'It is designed for keeping water, Gangajal, milk, and sacred ritual offerings during pooja.' },
      { q: 'Which ceremonies is this Kalash suitable for?', a: 'Suitable for daily pooja, Havan, Griha Pravesh, Diwali, Navratri, Ganesh Pooja, and Satyanarayan Pooja.' },
      { q: 'How do I clean and care for the copper Kalash?', a: 'Clean gently with a soft cloth, keep dry after use, avoid abrasive scrubbers, and use pitambari or lemon/salt to restore shine.' }
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
    name: 'Wooden Pooja Chowki',
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
      '/assets/Wooden Choki/chowki4.jpg',
      '/assets/Wooden Choki/chowki 2.png',
      '/assets/Wooden Choki/chowki5.jpg',
      '/assets/Wooden Choki/chowki6.png'
    ],
    weightVariants: [
      { weight: '12 x 8 Inch Hand-Painted', price: 1890, originalPrice: 2490, default: true }
    ],
    purity: 'Handcrafted Wood with Traditional Painting',
    inStock: true,
    description: 'The Shraviko Wooden Pooja Chowki is a beautifully crafted traditional platform designed for home temples, pooja rooms and festive arrangements. Made from wood and finished with detailed hand-painted artwork, it combines traditional Indian aesthetics with practical everyday use. Use it as a base for God idols, Kalash, Diyas, Panchpatra, Shankh, Pooja Thali and other sacred accessories. Its sturdy tabletop construction provides a stable surface while the decorative artwork adds character to your mandir setup. Suitable for daily pooja, Diwali, Navratri, Ganesh Chaturthi, Janmashtami, and housewarming ceremonies.',
    shortDescription: 'Add a traditional touch to your pooja space with this handcrafted Wooden Pooja Chowki. Designed with traditional painted detailing, it provides an elegant and stable platform for idols, Kalash, diyas and other pooja essentials.',
    seoTitle: 'Wooden Pooja Chowki | Hand-Painted Wooden Bajot for Mandir | Shraviko',
    metaDescription: 'Shop Shraviko Handcrafted Wooden Pooja Chowki for home temples, god idols, kalash and pooja thalis. Traditional hand-painted wooden bajot for mandir.',
    specifications: [
      { label: 'Product Type', value: 'Wooden Pooja Chowki' },
      { label: 'Material', value: 'Wood' },
      { label: 'Finish', value: 'Hand Painted' },
      { label: 'Colour', value: 'Multicolor' },
      { label: 'Shape', value: 'Rectangle' },
      { label: 'Size', value: '12 × 8 Inch' },
      { label: 'Weight', value: 'Approx. 350 g' },
      { label: 'Mounting', value: 'Tabletop' },
      { label: 'Handmade', value: 'Yes' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Wooden Pooja Chowki' }
    ],
    keyFeatures: [
      'Handcrafted Wooden Construction – Made from quality seasoned wood for durability and stability.',
      'Traditional Hand-Painted Artwork – Detailed artisanal painting adds vibrant traditional character to your mandir.',
      'Stable Tabletop Design – Sturdy 4-leg construction ensures steady placement of sacred items.',
      'Ideal for Idols & Pooja Essentials – Perfect base for God Idols, Kalash, Diyas, Panchpatra, Shankh, and Pooja Thalis.',
      'Suitable for Daily & Festive Pooja – Ideal for daily worship, Diwali, Navratri, Ganesh Chaturthi, Janmashtami, and Griha Pravesh.',
      'Made in India – Authentic traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth.',
      'Keep away from prolonged exposure to water and excessive moisture to preserve the wooden surface and painted detailing.'
    ],
    faqs: [
      { q: 'What can be placed on this wooden chowki?', a: 'It is designed as a base for deity idols, Kalash, diyas, Panchpatra, Shankh, and pooja thalis.' },
      { q: 'What size is this chowki?', a: 'The dimensions are 12 × 8 inches with a weight of approx. 350 g.' },
      { q: 'How do I clean and maintain the painted wooden chowki?', a: 'Wipe gently with a soft dry cloth and avoid water or prolonged moisture to protect the hand-painted artwork.' },
      { q: 'Is it suitable for festive celebrations and housewarmings?', a: 'Yes, it makes an elegant traditional platform for Diwali, Navratri, Janmashtami, Ganesh Chaturthi, and housewarming ceremonies.' }
    ]
  },

  // 22. Brass Dhoopdani
  {
    id: 'brass-dhoopdani-burner',
    name: 'Metal Dhoop Dani with Handle',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Puja Accessories',
    price: 1290,
    originalPrice: 1690,
    rating: 4.96,
    reviewsCount: 185,
    tag: 'Dhoop Dani',
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
      { weight: 'Standard Gold (370 g - 25x11x16 cm)', price: 1290, originalPrice: 1690, default: true }
    ],
    purity: 'Polished Metal with Gold Finish',
    inStock: true,
    description: 'The Shraviko Metal Dhoop Dani is designed for traditional dhuni and incense rituals at home, in temples and during festive ceremonies. Its classic metal construction and decorative gold finish give it a traditional appearance that complements your pooja setup. The sturdy handle makes it convenient to carry while performing dhuni around your home or pooja space. The perforated lid allows airflow while helping keep burning material and ash contained. Suitable for Loban, Sambrani, Guggal, Bakhoor, Dhoop Powder, Camphor and other suitable incense materials.',
    shortDescription: 'Bring a traditional touch to your daily pooja with this Metal Dhoop Dani. Designed with a convenient handle and ventilated lid, it is suitable for burning dhoop, loban, sambrani, guggal, bakhoor and other incense materials.',
    seoTitle: 'Metal Dhoop Dani with Handle | Traditional Incense & Loban Burner | Shraviko',
    metaDescription: 'Shop Shraviko Metal Dhoop Dani with handle for loban, sambrani, dhoop, guggal and camphor. Traditional gold finish incense burner for home mandir.',
    specifications: [
      { label: 'Product Type', value: 'Metal Dhoop Dani' },
      { label: 'Material', value: 'Metal' },
      { label: 'Colour', value: 'Gold' },
      { label: 'Finish', value: 'Polished' },
      { label: 'Shape', value: 'Round' },
      { label: 'Handle', value: 'Yes (Insulated Grip)' },
      { label: 'Weight', value: 'Approx. 370 g' },
      { label: 'Dimensions', value: '25 × 11 × 16 cm' },
      { label: 'Reusable', value: 'Yes' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Metal Dhoop Dani' }
    ],
    keyFeatures: [
      'Durable Metal Construction – Crafted from quality metal with a polished gold finish.',
      'Convenient Handle – Sturdy handle makes it easy to carry around the home for dhuni rituals.',
      'Ventilated Perforated Lid – Allows steady smoke dispersion while keeping active ash contained.',
      'Multi-Incense Compatibility – Ideal for Loban, Sambrani cups, Guggal, Bakhoor, Dhoop powder, and Camphor.',
      'Reusable & Easy to Clean – Simple ash removal and easy wiping after cooling.',
      'Made in India – Traditional Indian artisanal incense burner craftsmanship.'
    ],
    careInstructions: [
      'Allow the burner to cool completely before handling or cleaning.',
      'Remove ash after each use and wipe the surface with a soft, dry cloth.',
      'Keep the product dry when not in use.'
    ],
    faqs: [
      { q: 'What incense materials can be burned in this dhoop dani?', a: 'It is suitable for dhoop cones/sticks, loban, sambrani cups, guggal, bakhoor, dhoop powder, and camphor.' },
      { q: 'Is the handle safe to hold while performing dhuni?', a: 'Yes, the sturdy handle allows you to carry the burner safely around the home while performing dhuni.' },
      { q: 'How do I clean and remove ash from the burner?', a: 'Allow it to cool completely, empty the ash, and wipe with a soft dry cloth.' },
      { q: 'What are the dimensions and weight of this dhoop dani?', a: 'Dimensions are 25 × 11 × 16 cm with an approximate weight of 370 g.' }
    ]
  },

  // 23. Brass Chawar Whisk
  {
    id: 'essentials-brass-chawar-whisk',
    name: 'Premium Temple Chawar Sahib',
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
    purity: 'Metal Handle & Soft Synthetic Hair',
    inStock: true,
    description: 'The Shraviko Temple Chawar Sahib is a traditional ceremonial accessory designed for devotional and religious settings. It features soft white synthetic fibers paired with a durable metal handle, offering a comfortable grip and an elegant appearance during ceremonial use. Also known as Chaur Sahib, Chawar, Chavar, Chanwara or Temple Fly Whisk, it can be used as part of traditional worship and seva in Mandirs, Gurudwaras, home temples and devotional spaces. Its classic design makes it suitable for Laddu Gopal seva, Krishna worship, pooja ceremonies, festivals and religious occasions.',
    shortDescription: 'Bring a traditional ceremonial touch to your pooja space with this Premium Temple Chawar Sahib, featuring soft white synthetic fibers and a sturdy metal handle. Suitable for Mandir, Gurudwara, home temple and devotional ceremonies.',
    seoTitle: 'Premium Temple Chawar Sahib | Chaur Sahib for Mandir & Gurudwara | Shraviko',
    metaDescription: 'Shop Shraviko Premium Temple Chawar Sahib with soft white synthetic fibers and durable metal handle. Ideal for Mandir, Gurudwara, Laddu Gopal seva and home temple worship.',
    specifications: [
      { label: 'Product Type', value: 'Temple Chawar Sahib' },
      { label: 'Material', value: 'Soft Synthetic Hair / Fibers' },
      { label: 'Hair Colour', value: 'White' },
      { label: 'Handle Material', value: 'Durable Metal' },
      { label: 'Available Sizes', value: 'Small / Medium / Large' },
      { label: 'Usage', value: 'Mandir, Gurudwara & Home Pooja' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Temple Chawar Sahib' }
    ],
    keyFeatures: [
      'Soft White Synthetic Fibers – Premium silky-soft white fibers crafted for gentle and respectful deity Seva.',
      'Durable Metal Handle – Sturdy metal handle with an ergonomic comfortable grip for ceremonial use.',
      'Multi-Faith Ceremonial Use – Suitable for Mandirs, Gurudwaras, home temples, and sacred devotional spaces.',
      'Laddu Gopal & Krishna Seva – Ideal for Laddu Gopal seva, Krishna worship, Aarti, and religious festivals.',
      'Available in Multiple Sizes – Choose from Small, Medium, and Large variants to fit your mandir setup.',
      'Made in India – Traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Store the Chawar Sahib in a clean, dry place when not in use.',
      'Gently remove dust from the fibers and avoid excessive moisture or harsh cleaning agents to maintain the appearance and softness of the fibers.'
    ],
    faqs: [
      { q: 'What is this Chawar Sahib used for?', a: 'It is a traditional ceremonial fly whisk used in Mandirs, Gurudwaras, and home temples for deity Seva (such as Laddu Gopal & Krishna worship) and Aarti.' },
      { q: 'What materials are used in this Chawar Sahib?', a: 'It features premium soft white synthetic hair fibers attached to a durable metal handle.' },
      { q: 'What sizes are available?', a: 'Available in Small, Medium, and Large size options.' },
      { q: 'How do I clean and store the Chawar Sahib?', a: 'Gently brush dust from the fibers, avoid moisture or harsh detergents, and store in a clean, dry location.' }
    ]
  },

  // 24. Jap Bag Gaumukhi
  {
    id: 'mandir-jap-bag-gaumukhi',
    name: 'Pure Cotton Gomukhi Japa Mala Bag',
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
      { weight: 'Single Pack (With Sakshi Counter)', price: 490, originalPrice: 690, default: true },
      { weight: 'Pack of 2 Bags', price: 890, originalPrice: 1290 },
      { weight: 'Gift Pack of 5 Bags', price: 1990, originalPrice: 2890 }
    ],
    purity: '100% Pure Cotton in Bhagwa / Saffron',
    inStock: true,
    description: 'The Shraviko Gomukhi Japa Mala Bag is designed for devotees who regularly practice mantra chanting and use a Japa Mala. Made from cotton and designed in the traditional Gomukhi (Gaumukhi) style, the bag allows you to keep your mala covered while providing a comfortable way to perform daily Jaap. A Sakshi Mala counter is included to help keep track of chanting rounds, while the integrated zipper pocket provides convenient storage for small essentials such as a digital counter or keys. Lightweight and easy to carry for home, temple, satsang, meditation, travel and pilgrimages. Suitable for standard 108-bead malas including Tulsi, Rudraksha, Neem, Chandan, Sphatik and Vaijanti malas.',
    shortDescription: 'Carry and use your sacred mala comfortably with this Pure Cotton Gomukhi Japa Mala Bag. Featuring a traditional Gomukhi design, Sakshi Mala counter and convenient zipper pocket, it is designed for daily Jaap, mantra chanting, meditation and spiritual practice.',
    seoTitle: 'Pure Cotton Gomukhi Japa Mala Bag | Gaumukhi Bag with Counter | Shraviko',
    metaDescription: 'Shop Shraviko Pure Cotton Gomukhi Japa Mala Bag with Sakshi Mala counter and zipper pocket. Ideal for daily Jaap, mantra chanting, Rudraksha and Tulsi malas.',
    specifications: [
      { label: 'Product Type', value: 'Gomukhi Japa Mala Bag' },
      { label: 'Material', value: '100% Pure Cotton' },
      { label: 'Colour', value: 'Bhagwa / Saffron' },
      { label: 'Pattern', value: 'Solid' },
      { label: 'Design Style', value: 'Traditional Gomukhi' },
      { label: 'Closure', value: 'Integrated Zipper Pocket' },
      { label: 'Dimensions', value: 'Approx. 15 × 10 × 20 cm' },
      { label: 'Weight', value: 'Approx. 80 g' },
      { label: 'Mala Compatibility', value: 'Standard 108-Bead Malas (Tulsi, Rudraksha, etc.)' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Gomukhi Japa Mala Bag, 1 × Sakshi Mala Counter' }
    ],
    keyFeatures: [
      'Cotton Gomukhi Design – Traditional Gaumukhi shape crafted from breathable pure cotton in Bhagwa/Saffron.',
      'Sakshi Mala Counter Included – Comes with a Sakshi Mala counter to effortlessly track completed chanting rounds.',
      'Integrated Zipper Pocket – Convenient built-in zip pocket to store digital counters, keys, or sacred items.',
      'Standard 108-Bead Mala Compatibility – Ideal for Tulsi, Rudraksha, Neem, Chandan, Sphatik, and Vaijanti malas.',
      'Lightweight & Portable – Easy to carry for home Jaap, temple visits, satsangs, meditation, and spiritual pilgrimages.',
      'Made in India – Authentic traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Keep the bag dry and clean.',
      'For routine cleaning, gently wipe or hand wash according to the fabric\'s care requirements.',
      'Allow it to dry completely before storing your mala inside.'
    ],
    faqs: [
      { q: 'What is included with this Japa Mala Bag?', a: 'The package includes 1 × Pure Cotton Gomukhi Japa Mala Bag and 1 × Sakshi Mala counter.' },
      { q: 'Which malas are compatible with this bag?', a: 'It fits standard 108-bead malas such as Tulsi, Rudraksha, Neem, Chandan, Sphatik, and Vaijanti malas.' },
      { q: 'What is the function of the Sakshi Mala counter and zipper pocket?', a: 'The Sakshi Mala counter helps track completed chanting rounds, and the zipper pocket securely holds small items like keys or a digital counter.' },
      { q: 'How do I wash and maintain the cotton Japa bag?', a: 'Hand wash gently in cold water, avoid bleach, and line dry completely before placing your sacred mala inside.' }
    ]
  },

  // 25. Mala Counter Set
  {
    id: 'mandir-mala-counter-brass',
    name: 'Digital Japa Counter',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Mala Counters',
    price: 390,
    originalPrice: 590,
    rating: 4.98,
    reviewsCount: 182,
    tag: 'Digital Counter',
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
      { weight: 'Single Pack (1 Pc)', price: 390, originalPrice: 590, default: true },
      { weight: 'Pack of 2 Counters', price: 690, originalPrice: 990 },
      { weight: 'Pack of 5 Counters', price: 1490, originalPrice: 1990 }
    ],
    purity: 'Digital LCD Finger Tally Counter',
    inStock: true,
    description: 'The Shraviko Digital Japa Counter is a compact counting device designed to help you keep track of repetitions during mantra chanting, Naam Jaap, meditation, prayer and Mala Jaap. Designed to be worn on the finger, it allows you to count repetitions with a simple click while keeping your attention on your practice. The LCD display makes the current count easy to read, and the compact design makes the counter convenient to carry in a pocket or pooja bag. Whether used at home, in a temple, during satsang, meditation or while travelling, this digital counter is a practical accessory.',
    shortDescription: 'Keep track of your mantra chanting, Naam Jaap, Mala Jaap and prayer counts with this compact Digital Japa Counter. Its finger-friendly design and clear LCD display make counting simple and convenient during daily spiritual practice.',
    seoTitle: 'Digital Japa Counter | Finger Tally Counter for Naam & Mantra Jaap | Shraviko',
    metaDescription: 'Shop Shraviko Digital Japa Counter for Mantra Jaap, Naam Jaap, Mala counting, meditation and prayer. Compact finger tally counter with LCD display.',
    specifications: [
      { label: 'Product Type', value: 'Digital Japa Counter' },
      { label: 'Display', value: 'Clear Digital LCD' },
      { label: 'Operation', value: 'Finger Click Button' },
      { label: 'Design', value: 'Ergonomic Finger Counter / Tally Ring' },
      { label: 'Power Source', value: 'Button Cell Battery Included' },
      { label: 'Weight', value: 'Approx. 20–30 g' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Digital Japa Counter' }
    ],
    keyFeatures: [
      'Digital LCD Display – Clear, high-visibility digital LCD screen for effortless count reading.',
      'Easy Finger-Click Operation – Ergonomic soft-strap finger counter for seamless click counting.',
      'Compact & Lightweight – Ultra-lightweight (20-30g) and compact for carrying in pockets or pooja bags.',
      'Simple Reset Function – One-touch quick reset button to clear counts for new chanting rounds.',
      'Multi-Purpose Chanting – Ideal for Mantra Jaap, Naam Jaap, Mala Jaap, meditation, prayer, and Tasbeeh counting.',
      'Long-Lasting Battery – Powered by reliable button cell battery for extended daily spiritual practice.'
    ],
    careInstructions: [
      'Keep the counter away from excessive moisture and water.',
      'Store it in a dry place when not in use.',
      'Avoid dropping or applying excessive pressure to the display and buttons.'
    ],
    faqs: [
      { q: 'What is this Digital Japa Counter used for?', a: 'It is used to keep accurate digital count during Mantra Jaap, Naam Jaap, Mala Jaap, meditation, prayer, and Tasbeeh counting.' },
      { q: 'How does the finger counter work?', a: 'You wear the soft adjustable strap on your finger and press the main click button with your thumb for each chant repetition.' },
      { q: 'Does it have a reset button?', a: 'Yes, it includes a simple one-click reset button to restart counting whenever needed.' },
      { q: 'Is a battery included with the counter?', a: 'Yes, it comes pre-fitted with a long-lasting button cell battery ready for immediate use.' }
    ]
  },

  // 26. Pooja Box Organizer Chest
  {
    id: 'mandir-pooja-box-chest',
    name: 'Stainless Steel Pooja Box with 7 Removable Containers',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Pooja Storage & Chests',
    price: 990,
    originalPrice: 1290,
    rating: 4.99,
    reviewsCount: 196,
    tag: '7-in-1 Pooja Box',
    artType: 'box',
    fitMode: 'contain',
    image: '/assets/Pooja box/Poojafront.png',
    images: [
      '/assets/Pooja box/Poojafront.png',
      '/assets/Pooja box/poojabox1.jpg',
      '/assets/Pooja box/poobjabox2.png',
      '/assets/Pooja box/Pooja box.jpg',
      '/assets/Pooja box/pooja box 3.jpg',
      '/assets/Pooja box/pooja box 4.png'
    ],
    weightVariants: [
      { weight: 'Standard 7-in-1 Set (11x4 cm)', price: 990, originalPrice: 1290, default: true },
      { weight: 'Pack of 2 Sets', price: 1790, originalPrice: 2390 }
    ],
    purity: 'Premium Stainless Steel with 7 Removable Cups',
    inStock: true,
    description: '7 Essentials. One Elegant Pooja Box. The Shraviko Stainless Steel Pooja Box is designed to keep your commonly used pooja materials organized and easily accessible. It comes with 7 individual removable containers, allowing you to separate different pooja essentials instead of keeping them in multiple loose boxes. Use the containers for roli, kumkum, sindoor, haldi, chawal, chandan, akshat and other frequently used pooja samagri. Made from stainless steel with a classic silver finish that fits conveniently on a mandir shelf, pooja cabinet, drawer or travel pooja kit.',
    shortDescription: 'Keep your daily pooja essentials neatly organized with this Stainless Steel Pooja Box featuring 7 removable containers. Its compact round design is ideal for storing roli, kumkum, haldi, chawal, chandan, sindoor and other pooja samagri in one convenient place.',
    seoTitle: 'Stainless Steel Pooja Box with 7 Removable Containers | Shraviko',
    metaDescription: 'Shop Shraviko Stainless Steel Pooja Box with 7 removable containers. Ideal for storing roli, kumkum, haldi, chawal, chandan and pooja samagri.',
    specifications: [
      { label: 'Product Type', value: 'Stainless Steel Pooja Box' },
      { label: 'Material', value: 'Durable Stainless Steel' },
      { label: 'Colour', value: 'Polished Silver' },
      { label: 'Shape', value: 'Round' },
      { label: 'Number of Containers', value: '7 Removable Containers' },
      { label: 'Approx. Diameter', value: '11 cm' },
      { label: 'Approx. Height', value: '4 cm' },
      { label: 'Lid Type', value: 'Lift-Off Lid' },
      { label: 'Usage', value: 'Pooja, Mandir, Travel & Gifting' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Stainless Steel Pooja Box, 7 × Removable Inner Containers' }
    ],
    keyFeatures: [
      '7 Removable Inner Containers – Includes 7 individual removable cups for effortless organization and separate samagri storage.',
      'Durable Stainless Steel Construction – Premium stainless steel with a classic polished silver finish.',
      'Compact Round Design – Space-saving round container (11 cm diameter × 4 cm height) fitting mandir shelves and travel kits.',
      'Lift-Off Protective Lid – Keeps roli, kumkum, haldi, chawal, chandan, sindoor, and akshat clean and spill-free.',
      'Easy to Organize & Carry – Ideal for home mandirs, daily worship, travel pooja kits, and festive rituals.',
      'Ideal for Religious Gifting – Practical and elegant gift for housewarmings, weddings, and festive occasions.'
    ],
    careInstructions: [
      'Wipe the box and containers with a soft, dry or slightly damp cloth after use.',
      'Keep the box dry before storing pooja materials inside.',
      'Avoid abrasive cleaning materials that may scratch the stainless-steel surface.'
    ],
    faqs: [
      { q: 'How many containers are included inside the pooja box?', a: 'It includes 7 individual removable inner containers.' },
      { q: 'What can be stored inside the 7 containers?', a: 'It is ideal for storing roli, kumkum, sindoor, haldi, chawal, akshat, and chandan.' },
      { q: 'What are the dimensions of this pooja box?', a: 'Approx. 11 cm in diameter and 4 cm in height.' },
      { q: 'Is it suitable for travel pooja kits?', a: 'Yes, its compact round covered design makes it ideal for travel pooja setups and home mandir storage.' }
    ]
  },

  // 27. Velvet Pooja Asan Mat
  {
    id: 'mandir-royal-velvet-asan-mat',
    name: 'Red Velvet Pooja Aasan Cloth with Golden Border – Pack of 3',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Pooja Asan Mats',
    price: 590,
    originalPrice: 890,
    rating: 4.97,
    reviewsCount: 142,
    tag: 'Velvet Asan',
    artType: 'asan',
    fitMode: 'contain',
    image: '/assets/Velvet asan/asan1.png',
    images: [
      '/assets/Velvet asan/asan1.png',
      '/assets/Velvet asan/asan2.jpg',
      '/assets/Velvet asan/asan3.png',
      '/assets/Velvet asan/asan4.png',
      '/assets/Velvet asan/asan5.jpg'
    ],
    weightVariants: [
      { weight: 'Pack of 3 (14 × 26 Inch)', price: 590, originalPrice: 890, default: true },
      { weight: 'Pack of 6 (14 × 26 Inch)', price: 1090, originalPrice: 1590 }
    ],
    purity: 'Soft Micro-Velvet & Golden Lace Border',
    inStock: true,
    description: 'Bring a traditional and elegant touch to your home temple with our Red Velvet Pooja Aasan Cloth. Made from soft velvet fabric and finished with a decorative golden lace border, this aasan is designed for placing God idols on chowkis, temple platforms, pooja shelves and other sacred spaces. The rich red color and traditional golden border complement the beauty of your mandir while creating a neat and graceful setting for daily pooja and festive occasions. Its 14 × 26 inch rectangular size provides ample space for a variety of idols and pooja arrangements. The pack of 3 makes it convenient to use across multiple idols or different areas of your home temple. The cloth is washable, reusable and suitable for regular use.',
    shortDescription: 'Red Velvet Pooja Aasan Cloth with decorative golden lace border (Pack of 3, Size 14 × 26 inch). Soft, washable, and reusable pedestal cloth for God idols, chowkis, and home mandirs.',
    seoTitle: 'Red Velvet Pooja Aasan Cloth with Golden Border (Pack of 3) | Shraviko',
    metaDescription: 'Shop Red Velvet Pooja Aasan Cloth with Golden Border (Pack of 3). Soft washable velvet mat for God idols, chowkis, mandir shelves, and festive setups. Size 14x26 inch.',
    specifications: [
      { label: 'Product', value: 'Red Velvet Pooja Aasan Cloth' },
      { label: 'Fabric Material', value: 'Soft Micro-Velvet' },
      { label: 'Border Detail', value: 'Decorative Golden Lace Border' },
      { label: 'Color', value: 'Rich Devotional Red' },
      { label: 'Dimensions', value: '14 × 26 Inches' },
      { label: 'Pack Quantity', value: 'Pack of 3 Aasan Cloths' },
      { label: 'Maintenance', value: 'Washable & Reusable' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '3 × Red Velvet Pooja Aasan Cloths' }
    ],
    keyFeatures: [
      'Soft and Elegant Velvet Fabric – Premium micro-velvet material with a luxurious texture.',
      'Decorative Golden Lace Border – Intricate golden zari lace lining that enhances your mandir aesthetics.',
      'Generous 14 × 26 Inch Size – Spacious rectangular dimensions suitable for chowkis, platforms, and large idols.',
      'Convenient Pack of 3 – Comes in a set of 3 to accommodate multiple deities and altar spaces.',
      'Washable & Reusable – Durable fabric easy to clean, maintain, and reuse for regular worship.',
      'Versatile Devotional Decor – Ideal for home mandirs, Ganesh Baithak, festive decorations, and religious rituals.'
    ],
    careInstructions: [
      'Gently hand wash in cold water using mild detergent when required.',
      'Do not bleach or scrub the golden lace border vigorously.',
      'Air dry flat in shade and iron lightly on low heat from the reverse side if needed.'
    ],
    faqs: [
      { q: 'What is the size of each aasan cloth?', a: 'Each red velvet aasan cloth measures 14 × 26 inches.' },
      { q: 'How many aasan cloths are included in the pack?', a: 'This product comes as a Pack of 3 aasan cloths.' },
      { q: 'Is the velvet cloth washable?', a: 'Yes, the fabric is gentle hand-washable and reusable for regular worship.' },
      { q: 'What can this aasan cloth be used for?', a: 'It is ideal for placing God idols, decorating chowkis, lining temple shelves, Ganesh Baithak, and festive altar setups.' }
    ]
  },

  // 28. Ganesh Siddha Yantra Frame
  {
    id: 'vastu-ganesh-siddha-yantra',
    name: 'Pure Copper Ganesh Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Yantras',
    price: 990,
    originalPrice: 1290,
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
      { weight: '3 x 3 Inches (Pure Copper)', price: 990, originalPrice: 1290, default: true },
      { weight: 'Pack of 2 Yantras', price: 1790, originalPrice: 2390 }
    ],
    purity: '100% Pure Copper Sheet',
    inStock: true,
    description: 'Add a traditional touch to your devotional space with this Pure Copper Ganesh Yantra, featuring an intricately engraved design associated with Lord Ganesha. The yantra is crafted from copper and features traditional geometric patterns, sacred symbols and detailed engraving that reflect the traditional character of Indian devotional art. Its compact design makes it convenient to place in a home temple, pooja room, office, shop, study area or other devotional spaces. Lord Ganesha is traditionally revered in Hindu culture and associated with wisdom, auspicious beginnings and the removal of obstacles.',
    shortDescription: 'Bring a traditional devotional element to your space with this Shree Ganesh Yantra, crafted in copper with detailed traditional engraving. Ideal for pooja rooms, home temples, offices, shops and religious gifting.',
    seoTitle: 'Pure Copper Ganesh Yantra | Shree Ganesh Yantra for Pooja | Shraviko',
    metaDescription: 'Shop Shree Ganesh Yantra crafted in copper with traditional engraving. Ideal for home temple, pooja room, office, shop, Ganesh Chaturthi and religious gifting.',
    specifications: [
      { label: 'Product Name', value: 'Ganesh Yantra' },
      { label: 'Product Type', value: 'Copper Yantra' },
      { label: 'Material', value: 'Pure Copper' },
      { label: 'Shape', value: 'Square' },
      { label: 'Size', value: '3 × 3 Inches' },
      { label: 'Design', value: 'Shree Ganesh Yantra' },
      { label: 'Finish', value: 'Traditional Engraved' },
      { label: 'Colour', value: 'Copper' },
      { label: 'Usage', value: 'Pooja & Devotional Display' },
      { label: 'Suitable For', value: 'Home, Office, Shop & Pooja Room' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Shree Ganesh Yantra' }
    ],
    keyFeatures: [
      'Traditional Shree Ganesh Yantra – Intricately engraved sacred geometric patterns and symbols.',
      'Pure Copper Construction – Crafted from quality copper with a traditional metallic appearance.',
      'Detailed Traditional Engraving – Fine artisanal etching that reflects rich Indian devotional art.',
      'Compact Square Format (3 × 3 Inches) – Fits conveniently on home mandir altars, office desks, and shop counters.',
      'Associated with Lord Ganesha – Revered for auspicious beginnings, wisdom, and removal of obstacles.',
      'Ideal for Daily Pooja & Gifting – Perfect for Ganesh Chaturthi, housewarmings, Diwali, and festive occasions.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth after use.',
      'Copper naturally develops a patina over time.',
      'If you want to maintain a brighter finish, use a suitable copper-cleaning method and avoid harsh abrasive materials that may damage the engraving.'
    ],
    faqs: [
      { q: 'What is a Ganesh Yantra?', a: 'A Ganesh Yantra is a traditional devotional design associated with Lord Ganesha used in Hindu worship and devotional practices.' },
      { q: 'What is this Ganesh Yantra made from?', a: 'This yantra is crafted from pure copper with traditional engraved geometric patterns.' },
      { q: 'Where can I place the Ganesh Yantra?', a: 'It can be placed in a home temple, pooja room, office desk, shop counter, or study space.' },
      { q: 'Can it be used during Ganesh Chaturthi?', a: 'Yes, it is ideal for traditional devotional worship and display during Ganesh Chaturthi and other religious festivals.' },
      { q: 'Is this yantra suitable for gifting?', a: 'Yes, its traditional design makes it a thoughtful gift for housewarming, business inaugurations, weddings, and religious ceremonies.' }
    ]
  },

  // 29. Kuber Dhan Prapti Yantra
  {
    id: 'vastu-kuber-dhan-prapti-yantra',
    name: 'Pure Copper Kuber Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Wealth Yantras',
    price: 990,
    originalPrice: 1290,
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
      { weight: '5 × 5 cm (Pure Copper Plate)', price: 990, originalPrice: 1290, default: true },
      { weight: 'Pack of 2 Yantras', price: 1790, originalPrice: 2390 }
    ],
    purity: '100% Pure Copper Sheet',
    inStock: true,
    description: 'Add a traditional touch to your devotional space with this Pure Copper Kuber Yantra, crafted with an engraved sacred design traditionally associated with Lord Kubera. Made from copper with a traditional polished finish, the yantra features detailed geometric patterns and inscriptions that give it an authentic devotional appearance. Its compact 5 × 5 cm square design makes it easy to place on a pooja altar, shelf, office desk, shop counter or other suitable devotional space. The Kuber Yantra is traditionally incorporated into pooja and devotional practices, particularly during occasions such as Diwali, Dhanteras, housewarming ceremonies and business inaugurations.',
    shortDescription: 'Bring a traditional devotional element to your space with this Pure Copper Kuber Yantra, featuring an intricately engraved design associated with Lord Kubera. Its compact 5 × 5 cm size makes it convenient for home temples, pooja rooms, offices and shops.',
    seoTitle: 'Pure Copper Kuber Yantra | 5 × 5 cm Kubera Yantram | Shraviko',
    metaDescription: 'Shop Pure Copper Kuber Yantra with traditional engraved design. Compact 5 × 5 cm Kubera Yantram for home temple, pooja room, office, shop and religious gifting.',
    specifications: [
      { label: 'Product Name', value: 'Kuber Yantra' },
      { label: 'Product Type', value: 'Copper Yantra' },
      { label: 'Material', value: 'Pure Copper' },
      { label: 'Design', value: 'Kuber Yantra' },
      { label: 'Shape', value: 'Square' },
      { label: 'Size', value: '5 × 5 cm' },
      { label: 'Finish', value: 'Polished / Engraved' },
      { label: 'Colour', value: 'Copper' },
      { label: 'Quantity', value: '1 Piece' },
      { label: 'Usage', value: 'Pooja & Devotional Display' },
      { label: 'Suitable For', value: 'Home, Office, Shop, Pooja Room' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Pure Copper Kuber Yantra' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Crafted from quality copper with a polished, engraved finish.',
      'Traditional Kuber Yantra Design – Detailed geometric patterns and inscriptions associated with Lord Kubera.',
      'Compact 5 × 5 cm Size – Square plate design fitting conveniently on mandirs, desks, or shop registers.',
      'Ideal for Office, Shop & Home – Suitable for home temples, pooja rooms, offices, and commercial spaces.',
      'Perfect for Festive Pooja – Traditional addition for Diwali, Dhanteras, housewarmings, and business inaugurations.',
      'Appropriate for Religious Gifting – Thoughtful spiritual gift for friends, family, and colleagues.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth after use.',
      'Copper naturally develops a patina over time due to oxidation.',
      'If you want to maintain its brighter appearance, use a suitable copper-cleaning method and avoid abrasive materials that could damage the engraving.',
      'Keep the yantra in a dry place when not in use.'
    ],
    faqs: [
      { q: 'What is a Kuber Yantra?', a: 'A Kuber Yantra is a traditional sacred geometric design associated with Lord Kubera, used in Hindu devotional and worship practices.' },
      { q: 'What is the material and size of this Kuber Yantra?', a: 'It is crafted from pure copper with a polished/engraved finish and measures 5 × 5 cm.' },
      { q: 'Where can I place the Kuber Yantra?', a: 'It can be placed on home mandir altars, pooja room shelves, office desks, or shop cash counters.' },
      { q: 'Is it suitable for Diwali and Dhanteras pooja?', a: 'Yes, it is traditionally used during Diwali, Dhanteras, housewarming ceremonies, and business inaugurations.' },
      { q: 'How do I clean and preserve the copper yantra?', a: 'Wipe with a soft dry cloth and clean with lemon/salt or copper polish to maintain shine. Avoid harsh abrasives.' }
    ]
  },

  // 30. Sampoorna Mahalakshmi Siddha Yantra Frame
  {
    id: 'vastu-laxmi-siddha-yantra',
    name: 'Pure Copper Lakshmi Kuber Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Mahalakshmi Yantras',
    price: 990,
    originalPrice: 1290,
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
      { weight: '5 × 5 cm (Pure Copper Plate)', price: 990, originalPrice: 1290, default: true },
      { weight: 'Pack of 2 Yantras', price: 1790, originalPrice: 2390 }
    ],
    purity: '100% Pure Copper Sheet',
    inStock: true,
    description: 'Bring traditional craftsmanship and devotional design to your spiritual space with this Pure Copper Shree Lakshmi Kuber Yantra. Crafted from copper and finished with a detailed traditional engraving, this yantra features sacred geometric patterns associated with Goddess Lakshmi and Lord Kubera in Hindu devotional traditions. The compact 5 × 5 cm square design makes it convenient to place on a pooja altar, temple shelf, office desk, shop counter, locker or other suitable devotional space. It can be incorporated into daily pooja and traditional worship practices and is especially suitable for occasions such as Diwali, Dhanteras, housewarming ceremonies and business inaugurations.',
    shortDescription: 'Add a traditional devotional element to your space with this Pure Copper Lakshmi Kuber Yantra, featuring an engraved design associated with Goddess Lakshmi and Lord Kubera. Its compact 5 × 5 cm format is suitable for home temples, pooja rooms, offices, shops and devotional displays.',
    seoTitle: 'Pure Copper Lakshmi Kuber Yantra | 5 × 5 cm | Shraviko',
    metaDescription: 'Shop Pure Copper Lakshmi Kuber Yantra with traditional engraved design. Compact 5 × 5 cm yantra for home temple, pooja room, office, shop and religious gifting.',
    specifications: [
      { label: 'Product Name', value: 'Lakshmi Kuber Yantra' },
      { label: 'Product Type', value: 'Copper Yantra' },
      { label: 'Material', value: 'Pure Copper' },
      { label: 'Design', value: 'Lakshmi Kuber' },
      { label: 'Shape', value: 'Square' },
      { label: 'Size', value: '5 × 5 cm' },
      { label: 'Finish', value: 'Polished / Engraved' },
      { label: 'Colour', value: 'Copper' },
      { label: 'Quantity', value: '1 Piece' },
      { label: 'Usage', value: 'Pooja & Devotional Display' },
      { label: 'Placement', value: 'Flat / Wall Display' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Pure Copper Lakshmi Kuber Yantra' }
    ],
    keyFeatures: [
      'Pure Copper Construction – Crafted from high-grade copper with a traditional polished, engraved finish.',
      'Traditional Lakshmi Kuber Yantra Design – Detailed geometric patterns associated with Goddess Lakshmi and Lord Kubera.',
      'Compact 5 × 5 cm Size – Square plate design fitting conveniently on mandir altars, office desks, shop counters, or lockers.',
      'Ideal for Office & Home Spaces – Suitable for home temples, pooja rooms, offices, and commercial establishments.',
      'Festive & Daily Worship – Ideal for daily pooja, Diwali, Dhanteras, housewarmings, and business inaugurations.',
      'Festive & Religious Gifting – Thoughtful devotional gift for festivals, corporate inaugurations, and religious events.'
    ],
    careInstructions: [
      'Copper naturally develops a patina over time.',
      'Wipe the yantra gently with a soft, dry cloth after handling.',
      'If you want to maintain its brighter copper appearance, use a suitable copper-cleaning method. Avoid abrasive materials that could scratch the engraved surface.',
      'Store in a dry place when not in use.'
    ],
    faqs: [
      { q: 'What is a Lakshmi Kuber Yantra?', a: 'A Lakshmi Kuber Yantra is a traditional sacred geometric design associated with Goddess Lakshmi and Lord Kubera, used in Hindu devotional worship.' },
      { q: 'What is the material and dimensions of this yantra?', a: 'It is made from pure copper with an engraved finish and measures 5 × 5 cm.' },
      { q: 'Where can this yantra be placed?', a: 'It can be placed in home temples, pooja rooms, office desks, shop cash counters, or lockers.' },
      { q: 'Is it suitable for Diwali and Dhanteras pooja?', a: 'Yes, it is traditionally used during Diwali, Dhanteras, housewarming ceremonies, and business inaugurations.' },
      { q: 'How do I clean and maintain the copper yantra?', a: 'Wipe gently with a soft dry cloth and polish with lemon/salt or copper cleaner to maintain shine. Avoid harsh abrasives.' }
    ]
  },

  // 31. Shree Shani Yantra
  {
    id: 'vastu-shani-siddha-yantra',
    name: 'Shree Shani Yantra',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Shani Yantras',
    price: 990,
    originalPrice: 1290,
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
      { weight: '3 × 3 Inches (Pure Copper)', price: 990, originalPrice: 1290, default: true },
      { weight: 'Pack of 2 Yantras', price: 1790, originalPrice: 2390 }
    ],
    purity: '100% Pure Copper Sheet',
    inStock: true,
    description: 'The Shree Shani Yantra is a traditional Vedic yantra dedicated to Lord Shani (Saturn), who is associated in Hindu traditions with discipline, responsibility, patience, justice and karma. Crafted from copper with a detailed traditional engraving, this yantra features the geometric design associated with Shani worship. Its compact 3 × 3 inch square format makes it convenient to place on a pooja altar, home temple, office desk, meditation area or other dedicated spiritual space. The yantra can be incorporated into daily pooja, prayer, meditation and devotional practices according to individual beliefs and traditions.',
    shortDescription: 'Bring a traditional devotional element to your pooja space with this Shree Shani Yantra, crafted from copper and featuring a traditional engraved design associated with Lord Shani. Its compact 3 × 3 inch size makes it suitable for home temples, pooja rooms, offices and meditation spaces.',
    seoTitle: 'Shree Shani Yantra | Pure Copper 3 × 3 Inch Yantra | Shraviko',
    metaDescription: 'Shop Shree Shani Yantra crafted from copper with traditional engraving. 3 × 3 inch devotional yantra for home temple, pooja room, office and spiritual spaces.',
    specifications: [
      { label: 'Product Name', value: 'Shree Shani Yantra' },
      { label: 'Product Type', value: 'Shani Yantra' },
      { label: 'Material', value: 'Pure Copper' },
      { label: 'Shape', value: 'Square' },
      { label: 'Size', value: '3 × 3 Inches' },
      { label: 'Design', value: 'Shani Yantra' },
      { label: 'Finish', value: 'Engraved / Natural Copper' },
      { label: 'Colour', value: 'Copper' },
      { label: 'Quantity', value: '1 Piece' },
      { label: 'Usage', value: 'Pooja, Prayer & Devotional Practices' },
      { label: 'Suitable For', value: 'Home, Temple, Office, Meditation Space' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Shree Shani Yantra' }
    ],
    keyFeatures: [
      'Traditional Shani Yantra Design – Sacred geometric engravings dedicated to Lord Shani (Saturn).',
      'Pure Copper Construction – Crafted from quality copper with detailed etched surface.',
      'Compact 3 × 3 Inch Size – Square format fitting conveniently on mandir altars, office desks, and meditation rooms.',
      'Dedicated to Lord Shani – Revered for discipline, responsibility, patience, justice, and karma.',
      'Suitable for Daily Pooja – Ideal for Saturday worship, Shani poojas, and devotional practices.',
      'Made in India – Authentic traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Keep the yantra in a clean, dry place.',
      'Wipe gently with a soft cloth to remove dust and fingerprints.',
      'Copper naturally develops a patina over time due to oxidation.',
      'If cleaning the copper, use an appropriate copper-cleaning method and avoid abrasive materials or harsh chemicals that could damage the engraved surface.'
    ],
    faqs: [
      { q: 'What is a Shree Shani Yantra?', a: 'A Shree Shani Yantra is a traditional Vedic sacred geometric design dedicated to Lord Shani (Saturn).' },
      { q: 'What material and size is this yantra?', a: 'It is crafted from pure copper with an engraved surface and measures 3 × 3 inches.' },
      { q: 'Where can the Shani Yantra be placed?', a: 'It can be placed in home temples, pooja rooms, office desks, or meditation spaces.' },
      { q: 'How do I clean and maintain the copper Shani Yantra?', a: 'Gently wipe with a soft cloth and polish periodically with lemon/salt or copper cleaner. Avoid harsh abrasives.' },
      { q: 'Is this yantra suitable for daily worship?', a: 'Yes, it is suitable for daily pooja, Saturday prayers, meditation, and devotional practices.' }
    ]
  },

  // 32. Crystal Glass Sri Vastu Yantra Plaque
  {
    id: 'vastu-crystal-glass-yantra',
    name: 'Sphatik Shree Yantra Cone',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Glass Yantras',
    price: 1590,
    originalPrice: 1990,
    rating: 4.98,
    reviewsCount: 162,
    tag: 'Shree Yantra',
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
      { weight: 'Standard 4 cm Cone (Boxed)', price: 1590, originalPrice: 1990, default: true },
      { weight: 'Pack of 2 Cones (Gift Pack)', price: 2890, originalPrice: 3690 }
    ],
    purity: 'High-Clarity Sphatik Crystal Glass',
    inStock: true,
    description: 'Bring a traditional devotional element to your pooja space with this Shree Yantra Cone, featuring a compact cone-shaped design inspired by the traditional Shree Yantra. The Shree Yantra is a revered geometric symbol in Hindu spiritual traditions and is commonly incorporated into pooja, prayer and meditation practices. Its compact form makes it convenient for placement in a home temple, pooja room, office, meditation area or devotional display. With an approximate 4 cm size, the cone occupies minimal space while adding a distinctive traditional element to your spiritual setup. It comes securely packed in a box, making it suitable for personal use as well as religious gifting.',
    shortDescription: 'A compact and elegant Shree Yantra cone designed for devotional spaces, pooja rooms and meditation areas. Its traditional geometric design and approximately 4 cm size make it easy to place on a pooja altar, shelf or dedicated spiritual space.',
    seoTitle: 'Sphatik Shree Yantra Cone | 4 cm Pooja & Meditation Yantra | Shraviko',
    metaDescription: 'Shop a traditional Shree Yantra Cone for pooja, meditation and home temple décor. Compact 4 cm design with box packaging, ideal for devotional spaces and gifting.',
    specifications: [
      { label: 'Product Name', value: 'Shree Yantra Cone' },
      { label: 'Product Type', value: 'Cone-Shaped Yantra' },
      { label: 'Material', value: 'Sphatik / Crystal' },
      { label: 'Colour', value: 'Clear / Transparent' },
      { label: 'Size', value: 'Approx. 4 cm' },
      { label: 'Quantity', value: '1 Piece' },
      { label: 'Packaging', value: 'Protective Box' },
      { label: 'Usage', value: 'Pooja, Prayer, Meditation & Devotional Display' },
      { label: 'Suitable For', value: 'Home Temple, Pooja Room, Office' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Shree Yantra Cone, 1 × Protective Box' }
    ],
    keyFeatures: [
      'Traditional Shree Yantra Design – Revered sacred geometric pyramid/cone symbol for pooja and meditation.',
      'Cone-Shaped Form – Elegant 3D cone geometry designed for home temples and spiritual display.',
      'Compact Approx. 4 cm Size – Fits conveniently on mandir altars, shelves, or meditation corners.',
      'High-Clarity Crystal Finish – Clear transparent material offering a brilliant, timeless appearance.',
      'Protective Box Packaging – Comes securely boxed (Pack of 1) for safe delivery and devotional gifting.',
      'Made in India – Authentic traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Handle carefully and place the product on a stable surface.',
      'Clean gently with a soft, dry cloth.',
      'Avoid dropping, scratching or applying excessive pressure to the product.'
    ],
    faqs: [
      { q: 'What is the material and size of this Shree Yantra Cone?', a: 'It is crafted from clear Sphatik/Crystal with an approximate height of 4 cm.' },
      { q: 'Where can I place the Shree Yantra Cone?', a: 'It can be placed on home mandir altars, pooja room shelves, meditation corners, or office desks.' },
      { q: 'What is included in the package?', a: 'The package includes 1 × Shree Yantra Cone and 1 × Protective Box.' },
      { q: 'How should I clean and maintain the Yantra Cone?', a: 'Handle gently, place on a stable surface, and clean with a soft dry cloth. Avoid dropping or harsh abrasives.' },
      { q: 'Is it suitable for religious gifting?', a: 'Yes, its compact size and protective box packaging make it ideal for devotional gifting and festive occasions.' }
    ]
  },

  // 33. Vastu Brass Pyramid
  {
    id: 'vastu-brass-pyramid-multitier',
    name: 'Shraviko Premium Brass Vastu Pyramid',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Pyramids',
    price: 1490,
    originalPrice: 1890,
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
      { weight: 'Pack of 1', price: 690, originalPrice: 890 },
      { weight: 'Pack of 2', price: 1290, originalPrice: 1690 },
      { weight: 'Pack of 3', price: 1790, originalPrice: 2390, default: true },
      { weight: 'Pack of 4', price: 2290, originalPrice: 2990 }
    ],
    purity: '100% Solid Heavy Virgin Brass',
    inStock: true,
    description: 'Bring a touch of traditional Indian craftsmanship to your space with the Shraviko Premium Brass Vastu Pyramid. Crafted from brass with a refined golden finish, this compact three-layer pyramid combines traditional design with an elegant decorative appeal. Its distinctive pyramid structure makes it suitable for pooja rooms, home temples, study tables, office desks, shop counters, shelves, and meditation spaces. The compact form allows it to fit naturally into both traditional and contemporary interiors. Made from brass and finished with attention to detail, this pyramid is designed to complement your spiritual and decorative surroundings. Its classic golden appearance adds a subtle traditional character to your space without being overly elaborate.',
    shortDescription: 'Shraviko Premium Brass Vastu Pyramid with a refined golden finish and 3-layer design. Crafted for pooja rooms, home temples, office desks, study tables, and meditation spaces. Available in single and multi-packs.',
    seoTitle: 'Shraviko Premium Brass Vastu Pyramid (3-Layer Golden Finish) | Shraviko',
    metaDescription: 'Shop Shraviko Premium Brass Vastu Pyramid. Crafted from pure brass with a golden polished finish for pooja rooms, home mandirs, office desks and study tables. Available in Packs of 1, 2, 3 and 4.',
    specifications: [
      { label: 'Product Type', value: 'Vastu Brass Pyramid' },
      { label: 'Material', value: '100% Solid Virgin Brass' },
      { label: 'Design Structure', value: '3-Layer Pyramid' },
      { label: 'Finish', value: 'Golden / Polished' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'Usage', value: 'Pooja, Mandir Decor, Office Desks & Meditation' },
      { label: 'Available Packs', value: 'Pack of 1, 2, 3, and 4' }
    ],
    keyFeatures: [
      'Pure Brass Construction – Crafted from solid high-grade brass with a refined golden polish.',
      '3-Layer Pyramid Design – Classic three-tiered geometric structure for traditional and spiritual appeal.',
      'Compact & Versatile Placement – Fits easily in home mandirs, pooja rooms, study tables, office desks, and shop counters.',
      'Thoughtful Gifting Choice – Suitable for housewarming ceremonies, Diwali, festivals, and office inaugurations.',
      'Complements All Interiors – Blends naturally into both traditional and contemporary decor styles.'
    ],
    careInstructions: [
      'Wipe with a soft, dry cloth after regular use to remove dust.',
      'Periodically polish with a brass cleaner to retain its golden luster.',
      'Avoid harsh chemicals or abrasive scrubbers that may scratch the surface.'
    ],
    faqs: [
      { q: 'Where can I place the Brass Vastu Pyramid?', a: 'It can be placed in pooja rooms, home temples, office desks, study tables, shop counters, shelves, or meditation spaces.' },
      { q: 'What material is the pyramid made of?', a: 'It is crafted from solid brass with a golden polished finish.' },
      { q: 'What pack options are available?', a: 'It is available in Packs of 1, 2, 3, and 4.' },
      { q: 'Is it suitable for gifting?', a: 'Yes, it makes an ideal gift for housewarming, Diwali, festivals, and office inaugurations.' }
    ]
  },

  // 34. Crystal Glass Vastu Turtle
  {
    id: 'vastu-crystal-glass-turtle',
    name: 'Shraviko Crystal Turtle with Glass Plate',
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
    description: 'Add an elegant touch of traditional symbolism to your space with the Shraviko Crystal Turtle with Glass Plate. Crafted with a clear, polished crystal finish and presented on a matching glass plate, this decorative piece combines refined aesthetics with the timeless symbolism of the turtle. The turtle has long been regarded in Feng Shui and Vastu traditions as a symbol associated with stability, longevity, protection, and balance. This piece is designed for those who appreciate these traditional practices while looking for a sophisticated decorative accent for their surroundings. The transparent finish allows light to reflect beautifully across the surface, giving the turtle a clean and refined appearance. The accompanying glass plate provides an elevated presentation and a dedicated base for display.',
    shortDescription: 'Shraviko Crystal Turtle with matching glass plate crafted from polished optical crystal glass. Associated with stability, longevity, and wealth in Feng Shui and Vastu traditions.',
    seoTitle: 'Shraviko Crystal Turtle with Glass Plate | Vastu & Feng Shui Tortoise | Shraviko',
    metaDescription: 'Shop Shraviko Crystal Turtle with Glass Plate. Crafted from polished optical crystal glass for home decor, office desks, living rooms, and spiritual spaces.',
    specifications: [
      { label: 'Product', value: 'Crystal Turtle with Glass Plate' },
      { label: 'Material', value: 'High-Purity Optical Crystal Glass & Glass Plate' },
      { label: 'Color & Finish', value: 'Transparent / High-Clarity Polished' },
      { label: 'Design Motif', value: 'Sacred Kurma / Tortoise' },
      { label: 'Usage', value: 'Home Décor, Office Décor, Vastu & Traditional Display' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Crystal Turtle, 1 × Matching Glass Display Plate' }
    ],
    keyFeatures: [
      'Elegant Crystal Craftsmanship – Crafted from clear, high-clarity optical glass with light-reflecting facets.',
      'Matching Glass Plate Base – Comes with a dedicated transparent glass plate for elevated display.',
      'Symbol of Stability & Longevity – Rooted in Feng Shui and Vastu traditions for balance, protection, and harmony.',
      'Versatile Placement – Suitable for living room shelves, office desks, study tables, mandirs, and reception counters.',
      'Meaningful Gifting Choice – Ideal gift for housewarming ceremonies, weddings, festivals, and office inaugurations.'
    ],
    careInstructions: [
      'Handle with care as it is crafted from optical glass.',
      'Clean regularly with a soft, lint-free cloth or dry microfiber cloth to remove dust and fingerprints.',
      'Avoid abrasive scrubbers, harsh chemicals, or dropping on hard surfaces.'
    ],
    faqs: [
      { q: 'What is included in the package?', a: 'The package includes one polished crystal turtle and one matching glass display plate.' },
      { q: 'Where should the Crystal Turtle be placed?', a: 'It can be placed in living rooms, display shelves, office desks, study tables, home temples, or reception counters.' },
      { q: 'What material is the turtle made of?', a: 'It is crafted from high-clarity polished optical crystal glass.' },
      { q: 'Is it suitable for gifting?', a: 'Yes, its elegant presentation makes it a popular choice for housewarmings, festivals, corporate gifting, and weddings.' }
    ]
  },

  // 35. Dakshinavarti Shankh
  {
    id: 'mandir-dakshinavarti-shankh',
    name: 'Shraviko Natural Dakshinavarti Shankh',
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
    description: 'Bring a revered symbol of Indian spiritual tradition into your sacred space with the Shraviko Natural Dakshinavarti Shankh. This naturally formed right-handed conch shell is carefully selected for its traditional form, natural appearance, and suitability for pooja and devotional spaces. Known traditionally as a Dakshinavarti Shankh, its opening curves towards the right when viewed from the front. In Hindu tradition, the Dakshinavarti Shankh holds special significance and is commonly kept in home temples and used as part of devotional practices. Each Shankh is naturally formed, giving every piece its own subtle variations in shape, markings, texture, and size. Our shells are carefully selected for their overall appearance and traditional form before being prepared for your sacred space.',
    shortDescription: 'Shraviko Natural Dakshinavarti Shankh (right-handed non-blowable conch shell) carefully selected for home mandirs, daily puja, Abhishek, and sacred rituals.',
    seoTitle: 'Shraviko Natural Dakshinavarti Shankh (Right-Handed Conch Shell) | Shraviko',
    metaDescription: 'Shop Shraviko Natural Dakshinavarti Shankh. Authentic right-handed ocean conch shell for home temples, daily pooja, Abhishek, Diwali and housewarming gifting.',
    specifications: [
      { label: 'Product', value: 'Natural Dakshinavarti Shankh' },
      { label: 'Type', value: 'Right-Handed Conch Shell (Non-Blowable)' },
      { label: 'Material', value: '100% Natural Ocean Conch Shell' },
      { label: 'Color', value: 'Natural Off-White / Cream' },
      { label: 'Size Range', value: 'Approximately 3.5–5 inches (Variations apply)' },
      { label: 'Usage', value: 'Pooja, Devotional Display, Abhishek & Rituals' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Natural Dakshinavarti Shankh' }
    ],
    keyFeatures: [
      'Authentic Right-Handed Spiral – Naturally formed shell opening towards the right, sacred to Goddess Lakshmi & Lord Vishnu.',
      'Carefully Selected Natural Shells – Handpicked for traditional shape, natural texture, and aesthetic grace.',
      'Ideal for Pooja & Abhishek – Perfect for home altars, mandirs, temple display, and holding ritual offerings.',
      'Non-Blowable Worship Shankh – Traditionally placed in altars for devotional presence and prosperity blessings.',
      'Meaningful Traditional Gift – Thoughtful choice for housewarmings, Diwali, Navratri, weddings, and temple ceremonies.'
    ],
    careInstructions: [
      'Clean gently with plain water or Gangajal and dry with a soft cloth.',
      'Do not expose to harsh chemicals, strong detergents, or boiling hot liquids.',
      'Place securely on a soft fabric asan, stand, or brass base to prevent accidental rolling.'
    ],
    faqs: [
      { q: 'Is this Dakshinavarti Shankh blowable?', a: 'No, Dakshinavarti (right-handed) Shankhs are non-blowable worship shells kept in altars for devotional rituals.' },
      { q: 'What makes a Dakshinavarti Shankh special?', a: 'It features a natural right-turning spiral, which is traditionally associated with Goddess Lakshmi and Lord Vishnu.' },
      { q: 'Are all pieces identical?', a: 'No, as each shell is naturally formed by nature, subtle variations in size, shape, color, and texture make each piece unique.' },
      { q: 'Can it be used for Abhishek?', a: 'Yes, it can be used during traditional pooja and Abhishek practices according to your family customs.' }
    ]
  },

  // 36. Vamavarti Shankha
  {
    id: 'mandir-vamavarti-shankh',
    name: 'Shraviko Vamavarti Blowing Shankh',
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
    description: 'Bring a timeless element of Indian devotional tradition into your sacred space with the Shraviko Vamavarti Blowing Shankh. Naturally formed and selected for its traditional appearance, this white conch shell is suitable for pooja, aarti, devotional ceremonies, and home temple display. The Shankh holds an important place in Hindu worship and is traditionally blown during various religious rituals and ceremonies. Its distinctive natural form also makes it a beautiful addition to a home mandir or spiritual space. Every conch shell is naturally formed, so each piece has its own character. Natural variations in shape, size, texture, colour, markings, and surface appearance are expected and make each Shankh unique.',
    shortDescription: 'Shraviko Vamavarti Blowing Shankh naturally formed for smooth blowing during daily pooja, Aarti, and religious ceremonies. Approx. 5-inch natural white conch shell.',
    seoTitle: 'Shraviko Vamavarti Blowing Shankh (Natural White Conch Shell) | Shraviko',
    metaDescription: 'Shop Shraviko Vamavarti Blowing Shankh. Authentic left-handed blowable ocean conch shell for home temples, daily pooja, Aarti, festive worship, and gifting.',
    specifications: [
      { label: 'Product', value: 'Vamavarti Blowing Shankh' },
      { label: 'Type', value: 'Vamavarti (Left-Handed Spiral)' },
      { label: 'Blowable', value: 'Yes (Blowing Conch Shell)' },
      { label: 'Material', value: 'Natural Ocean Conch Shell' },
      { label: 'Colour', value: 'Natural White' },
      { label: 'Approximate Size', value: '5 inches' },
      { label: 'Usage', value: 'Pooja, Aarti & Devotional Practices' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Natural Vamavarti Blowing Shankh' }
    ],
    keyFeatures: [
      'Authentic Blowable Shankh – Features a smooth natural mouthpiece suitable for traditional ritual blowing.',
      'Naturally Formed Shell – Unique natural white conch shell with distinctive organic contours and textures.',
      'Essential for Pooja & Aarti – Traditionally blown during morning/evening Aarti, auspicious ceremonies, and festivals.',
      'Devotional Mandir Decor – Makes a beautiful sacred centerpiece when displayed on altars and mandir shelves.',
      'Thoughtful Spiritual Gift – Ideal for housewarmings, Diwali, Navratri, weddings, and temple inaugurations.'
    ],
    careInstructions: [
      'Clean gently with plain water after blowing or ritual use and allow to dry thoroughly.',
      'Store upright or on a soft fabric cushion/asan to protect the natural mouthpiece.',
      'Do not use harsh chemical cleaners, bleach, or boiling water.'
    ],
    faqs: [
      { q: 'Is this Vamavarti Shankh blowable?', a: 'Yes, this Vamavarti Shankh is naturally formed with a mouthpiece suitable for blowing during Aarti and rituals.' },
      { q: 'What sound does the blowing Shankh produce?', a: 'When blown correctly, it produces a clear, deep resonant chime traditionally associated with divine cosmic vibrations.' },
      { q: 'Are all shells identical in shape and color?', a: 'No, because each shell is naturally formed in the ocean, subtle variations in size, shape, markings, and texture are natural.' },
      { q: 'How should I clean the Shankh after blowing?', a: 'Rinse with clean water, wipe gently with a soft cloth, and let it dry completely in a clean space.' }
    ]
  },

  // 37. Kamdhenu Cow & Calf
  {
    id: 'brass-kamdhenu-cow-statue',
    name: 'Shraviko Brass Kamdhenu Cow with Calf Idol',
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
      { weight: 'Compact (7 × 3 × 5 cm - 70 G)', price: 1490, originalPrice: 1890 },
      { weight: 'Medium (450 G - 5 Inch)', price: 2490, originalPrice: 3190, default: true },
      { weight: 'Royal Large (850 G - 7 Inch)', price: 3890, originalPrice: 4790 }
    ],
    purity: '100% Solid Heavy Virgin Brass',
    inStock: true,
    description: 'Bring a timeless symbol of Indian tradition into your sacred space with the Shraviko Brass Kamdhenu Cow with Calf Idol. Crafted in brass with a traditional finish, this beautifully detailed figurine features Kamdhenu with her calf and adds a meaningful devotional presence to your home or workspace. In Hindu tradition, Kamdhenu is revered as a sacred cow and is associated with nurturing, abundance, care, and maternal protection. The cow and calf together represent the enduring bond of care and nourishment, making this figurine a meaningful addition to traditional spaces. The brass construction gives the idol a warm, timeless appearance that complements both traditional and contemporary interiors.',
    shortDescription: 'Shraviko Brass Kamdhenu Cow with Calf Idol with traditional brass finish (~7 × 3 × 5 cm, 70g weight). Symbol of nurturing, abundance, and Vastu harmony for home & office.',
    seoTitle: 'Shraviko Brass Kamdhenu Cow with Calf Idol (Gau Mata Figurine) | Shraviko',
    metaDescription: 'Shop Shraviko Brass Kamdhenu Cow with Calf Idol. Handcrafted traditional brass Gau Mata figurine for home mandirs, living room shelves, office desks, and housewarming gifting.',
    specifications: [
      { label: 'Product', value: 'Kamdhenu Cow with Calf Idol' },
      { label: 'Material', value: '100% Solid Heavy Virgin Brass' },
      { label: 'Finish', value: 'Traditional Brass Polish' },
      { label: 'Color', value: 'Brass / Golden' },
      { label: 'Design Motif', value: 'Kamdhenu Cow with Calf' },
      { label: 'Dimensions', value: 'Approximately 7 × 3 × 5 cm' },
      { label: 'Weight', value: 'Approximately 70 g' },
      { label: 'Usage', value: 'Pooja & Home Décor' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Brass Kamdhenu Cow with Calf Idol' }
    ],
    keyFeatures: [
      'Authentic Brass Craftsmanship – Solid brass figurine with intricate detailing of Gau Mata and her calf.',
      'Symbol of Abundance & Nurturing – Kamdhenu revered in Vastu and Hindu traditions for prosperity and maternal protection.',
      'Compact & Versatile Size – Dimensions approx. 7 × 3 × 5 cm (70g), ideal for home mandirs, desks, and shelves.',
      'Complements All Interiors – Warm golden brass luster fits both classic and modern interior themes.',
      'Meaningful Gifting Choice – Thoughtful traditional gift for housewarmings, Diwali, weddings, and office inaugurations.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth to remove dust.',
      'Avoid prolonged exposure to water and harsh chemical cleaners.',
      'Use standard brass polish periodically if you wish to restore original shine.'
    ],
    faqs: [
      { q: 'What material is the Kamdhenu Cow idol made of?', a: 'It is crafted from solid brass with a traditional golden polish.' },
      { q: 'What are the dimensions and weight of the figurine?', a: 'It measures approximately 7 × 3 × 5 cm and weighs around 70 grams.' },
      { q: 'Where can I place the Kamdhenu Cow with Calf idol?', a: 'It can be placed in home mandirs, living room shelves, office desks, study tables, or reception counters.' },
      { q: 'What is the significance of Kamdhenu Cow with Calf in Vastu?', a: 'Kamdhenu with her calf symbolizes abundance, maternal care, peace, and positive energy harmony in home and workplace.' }
    ]
  },

  // 38. Siddhi Vinayak Ganesh Ji
  {
    id: 'brass-ganesh-ji-statue',
    name: 'Shraviko Pure Brass Lord Ganesha Idol',
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
      { weight: 'Compact (5.5 cm - 84 G)', price: 990, originalPrice: 1390 },
      { weight: 'Medium (4.5 Inch - 400 G)', price: 2290, originalPrice: 2890, default: true },
      { weight: 'Royal Large (6.5 Inch - 750 G)', price: 3690, originalPrice: 4590 }
    ],
    purity: '100% Solid Heavy Golden Brass',
    inStock: true,
    description: 'Bring timeless craftsmanship and devotional beauty to your sacred space with the Shraviko Pure Brass Lord Ganesha Idol. Crafted in brass with a refined polished finish, this traditional Ganesh Murti is designed for home temples, pooja rooms, offices, and other spaces where you wish to keep a revered symbol of Lord Ganesha. Lord Ganesha is traditionally worshipped as the deity associated with wisdom, auspicious beginnings, and the removal of obstacles. This idol is suitable for daily worship as well as festive and devotional occasions. The idol is crafted in brass and finished to highlight the intricate features of Lord Ganesha. Its warm golden appearance complements both traditional pooja spaces and contemporary interiors.',
    shortDescription: 'Shraviko Pure Brass Lord Ganesha Idol with golden polished finish (~5.5 cm height, 84g weight). Ideal for home mandirs, office desks, study tables, and Ganesh Chaturthi gifting.',
    seoTitle: 'Shraviko Pure Brass Lord Ganesha Idol (Golden Polished Murti) | Shraviko',
    metaDescription: 'Shop Shraviko Pure Brass Lord Ganesha Idol. Handcrafted golden brass Ganesh murti for home temples, office desks, car dashboards, and Ganesh Chaturthi gifting.',
    specifications: [
      { label: 'Product', value: 'Lord Ganesha Idol' },
      { label: 'Material', value: '100% Solid Heavy Brass' },
      { label: 'Finish', value: 'Polished Golden Brass' },
      { label: 'Height', value: 'Approximately 5.5 cm' },
      { label: 'Weight', value: 'Approximately 84 g' },
      { label: 'Usage', value: 'Pooja & Home Décor' },
      { label: 'Suitable For', value: 'Home, Office & Sacred Spaces' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Pure Brass Lord Ganesha Idol' }
    ],
    keyFeatures: [
      'Pure Brass Craftsmanship – Crafted from solid brass with a warm, polished golden finish.',
      'Symbol of Wisdom & Good Fortune – Lord Ganesha revered for auspicious beginnings and obstacle removal.',
      'Compact & Versatile Size – Height approx. 5.5 cm, weight 84g, perfect for mandirs, office desks, and car dashboards.',
      'Intricate Handcrafted Detail – Sculpts traditional facial features, trunk, and devotional aura.',
      'Thoughtful Auspicious Gift – Ideal choice for Ganesh Chaturthi, housewarming, office inauguration, and Diwali.'
    ],
    careInstructions: [
      'Wipe gently with a soft, dry cloth to remove dust.',
      'Avoid prolonged exposure to moisture and harsh chemical cleaners.',
      'Use standard brass polish periodically if you wish to restore intense luster.'
    ],
    faqs: [
      { q: 'What is the material and finish of this Ganesha idol?', a: 'It is crafted from solid brass with a polished golden finish.' },
      { q: 'What are the dimensions and weight of the idol?', a: 'It stands approximately 5.5 cm high and weighs about 84 grams.' },
      { q: 'Where can I place this brass Ganesha idol?', a: 'It can be placed in home mandirs, office desks, study tables, reception counters, or securely on car dashboards.' },
      { q: 'Is this idol suitable for Ganesh Chaturthi and housewarming gifting?', a: 'Yes, it makes a meaningful traditional gift for auspicious occasions, housewarmings, and festivals.' }
    ]
  },

  // 39. Radha Krishna Divine Idol
  {
    id: 'brass-radha-krishna-statue',
    name: 'Shraviko Pure Brass Radha Krishna Idol',
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
      { weight: 'Compact (8.8 cm - 310 G)', price: 1790, originalPrice: 2290 },
      { weight: 'Medium (5.5 Inch - 550 G)', price: 2890, originalPrice: 3690, default: true },
      { weight: 'Royal Large (7.5 Inch - 950 G)', price: 4490, originalPrice: 5490 }
    ],
    purity: '100% Solid Heavy Polished Brass',
    inStock: true,
    description: 'Bring the timeless beauty of Radha and Krishna into your sacred space with the Shraviko Pure Brass Radha Krishna Idol. Crafted in brass with a refined polished finish, this traditional murti represents the enduring bond of Radha and Krishna and adds an elegant devotional presence to your home. In Hindu tradition, Radha and Krishna are revered as symbols of divine love, devotion, harmony, and spiritual connection. This idol is suitable for daily worship as well as traditional home décor. Made from brass and finished to highlight the intricate details of Radha and Krishna, the idol combines traditional artistry with a warm golden appearance. Its compact form makes it easy to incorporate into both traditional and contemporary spaces.',
    shortDescription: 'Shraviko Pure Brass Radha Krishna Idol with golden polished finish (~8.8 cm height, 310g weight). Symbol of divine love & harmony for home mandirs and wedding/Janmashtami gifting.',
    seoTitle: 'Shraviko Pure Brass Radha Krishna Idol (Golden Polished Murti) | Shraviko',
    metaDescription: 'Shop Shraviko Pure Brass Radha Krishna Idol. Handcrafted golden brass Radha Krishna murti for home temples, living room decor, Janmashtami, weddings and anniversaries.',
    specifications: [
      { label: 'Product', value: 'Radha Krishna Idol' },
      { label: 'Material', value: '100% Solid Heavy Brass' },
      { label: 'Finish', value: 'Polished Golden Brass' },
      { label: 'Height', value: 'Approximately 8.8 cm' },
      { label: 'Dimensions', value: 'Approximately 5.5 × 3.5 × 8.8 cm' },
      { label: 'Weight', value: 'Approximately 310 g' },
      { label: 'Usage', value: 'Pooja & Home Décor' },
      { label: 'Suitable For', value: 'Home, Office & Sacred Spaces' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Pure Brass Radha Krishna Idol' }
    ],
    keyFeatures: [
      'Pure Brass Craftsmanship – Solid brass construction with an elegant polished golden finish.',
      'Symbol of Divine Love & Harmony – Revered representation of the eternal bond of Radha and Krishna.',
      'Compact & Elegant Size – Dimensions 5.5 × 3.5 × 8.8 cm (310g), ideal for home mandirs and living room altars.',
      'Intricate Sculpted Artistry – Detailed facial features, flute motif, and traditional divine adornments.',
      'Ideal Auspicious Gift – Perfect choice for Janmashtami, weddings, anniversaries, housewarming, and Diwali.'
    ],
    careInstructions: [
      'Clean gently with a soft, dry cloth to remove dust.',
      'Avoid prolonged exposure to moisture and harsh chemical cleaners.',
      'Use standard brass polish periodically if you wish to maintain its original luster.'
    ],
    faqs: [
      { q: 'What is the material and finish of the Radha Krishna idol?', a: 'It is crafted from solid brass with a polished golden finish.' },
      { q: 'What are the exact dimensions and weight?', a: 'It stands approximately 8.8 cm high, measures 5.5 × 3.5 × 8.8 cm, and weighs about 310 grams.' },
      { q: 'Where can I place this brass idol?', a: 'It can be placed in home mandirs, living room display shelves, office desks, meditation corners, or spiritual display areas.' },
      { q: 'Is it suitable for wedding and anniversary gifting?', a: 'Yes, as a symbol of divine love and harmony, it makes an exceptional gift for weddings, anniversaries, Janmashtami, and housewarmings.' }
    ]
  },

  // 41. Glass Shivling
  {
    id: 'vastu-crystal-glass-shivling',
    name: 'Shraviko Natural Sphatik Shivling',
    category: 'vastu',
    categoryName: 'Vastu & Spiritual',
    subcategory: 'Vastu Energy Items',
    price: 1690,
    originalPrice: 2190,
    rating: 4.99,
    reviewsCount: 175,
    tag: 'Sphatik Shivling',
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
      { weight: 'Small (2.5 cm - Compact)', price: 990, originalPrice: 1290 },
      { weight: 'Medium (4.5 cm - Standard)', price: 1690, originalPrice: 2190, default: true },
      { weight: 'Royal Large (6 cm - Master)', price: 2690, originalPrice: 3290 }
    ],
    purity: 'Natural Sphatik / Clear Quartz Crystal',
    inStock: true,
    description: 'Bring a timeless symbol of devotion into your sacred space with the Shraviko Natural Sphatik Shivling. Crafted from Sphatik (clear quartz) with a smooth polished finish, this compact Shivling is designed for traditional worship, meditation, and devotional spaces. In Hindu tradition, the Shivling is a revered representation of Lord Shiva and holds an important place in daily worship and spiritual practices. Sphatik Shivlings are traditionally valued for their clear, natural appearance and are commonly placed in home temples and pooja spaces. The transparent appearance of Sphatik gives the Shivling a distinctive and elegant look. Its smooth polished surface highlights the natural character of the crystal while maintaining the traditional form of the Shivling.',
    shortDescription: 'Shraviko Natural Sphatik Shivling crafted from clear quartz crystal with a smooth polished finish. Ideal for home mandirs, daily puja, meditation, and Mahashivratri gifting.',
    seoTitle: 'Shraviko Natural Sphatik Shivling (Clear Quartz) | Shraviko',
    metaDescription: 'Shop Shraviko Natural Sphatik Shivling. Crafted from clear quartz crystal with a polished finish for home mandirs, daily puja, meditation, and Mahashivratri worship.',
    specifications: [
      { label: 'Product', value: 'Sphatik Shivling' },
      { label: 'Material', value: 'Natural Sphatik / Clear Quartz' },
      { label: 'Finish', value: 'Smooth Polished' },
      { label: 'Color', value: 'Transparent' },
      { label: 'Height', value: 'Approximately 2.5 cm' },
      { label: 'Design', value: 'Traditional Sacred Shivling' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'Usage', value: 'Pooja, Devotional Practices & Meditation' },
      { label: 'What\'s Included', value: '1 × Natural Sphatik Shivling' }
    ],
    keyFeatures: [
      'Natural Sphatik / Clear Quartz – Handcrafted from natural clear quartz crystal with light-reflecting transparency.',
      'Smooth Polished Finish – Crafted with smooth polished surfaces highlighting the natural character of the crystal.',
      'Compact for Everyday Worship – Approx. 2.5 cm height, perfect for home mandirs, pooja thalis, and prayer altars.',
      'Symbol of Lord Shiva – Revered representation of Shiva energy for Rudrabhishek, meditation, and daily puja.',
      'Meaningful Devotional Gift – Thoughtful choice for Mahashivratri, Shravan, housewarming ceremonies, and festivals.'
    ],
    careInstructions: [
      'Handle gently with care as Sphatik crystal is a natural mineral material.',
      'Clean softly using plain water or Gangajal and dry with a soft cloth.',
      'Avoid harsh chemical detergents, boiling hot water, or dropping on hard surfaces.'
    ],
    faqs: [
      { q: 'Is this Shivling made of natural Sphatik crystal?', a: 'Yes, it is crafted from natural Sphatik (clear quartz) with natural crystal inclusions.' },
      { q: 'What is the height of the Sphatik Shivling?', a: 'The compact size features a height of approximately 2.5 cm.' },
      { q: 'Where can I place the Sphatik Shivling?', a: 'It can be placed in home mandirs, pooja thalis, meditation rooms, study tables, or personal altar spaces.' },
      { q: 'Is it suitable for Abhishek?', a: 'Yes, natural Sphatik Shivling can be used for ritual Abhishek with water, Gangajal, milk, or Panchamrit.' }
    ]
  },

  // 42. Panchmukhi Himalayan Rudraksha Mala
  {
    id: 'mandir-rudraksh-mala',
    name: '5 Mukhi Rudraksha Mala with Gomukhi Bag',
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
      { weight: '7–8 mm (108+1 Beads with Gomukhi Bag)', price: 1290, originalPrice: 1690, default: true },
      { weight: 'Pack of 2 Malas with Bags', price: 2390, originalPrice: 3190 }
    ],
    purity: 'Natural 5 Mukhi Rudraksha Beads with Gomukhi Bag',
    inStock: true,
    description: 'The Shraviko 5 Mukhi Rudraksha Mala is crafted with natural Rudraksha beads and designed in the traditional 108+1 bead format, making it suitable for regular mantra chanting and spiritual practices. Each bead can be used for keeping track of mantra repetitions during Jaap, meditation and prayer. The included Gomukhi Jaap Bag provides a convenient way to keep the mala covered and protected during chanting and storage. With its traditional appearance and comfortable bead size, the mala can be used at home, during temple visits, meditation sessions, yoga practice and other devotional occasions. It is suitable for both men and women.',
    shortDescription: 'Bring a traditional touch to your daily spiritual practice with this 5 Mukhi Rudraksha Mala, featuring natural Rudraksha beads arranged in a traditional 108+1 bead configuration. Ideal for Jaap, meditation, yoga, pooja and devotional practices.',
    seoTitle: '5 Mukhi Rudraksha Mala 108+1 Beads with Gomukhi Bag | Panchmukhi Rudraksha | Shraviko',
    metaDescription: 'Shop Shraviko 5 Mukhi Rudraksha Mala 108+1 beads with Gomukhi bag. Natural Panchmukhi Rudraksha Jaap mala for meditation, pooja, mantra chanting and yoga.',
    specifications: [
      { label: 'Product Type', value: 'Rudraksha Jaap Mala' },
      { label: 'Rudraksha Type', value: '5 Mukhi (Panchmukhi)' },
      { label: 'Bead Count', value: '108 + 1 Sumeru Guru Bead' },
      { label: 'Bead Size', value: '7–8 mm' },
      { label: 'Bead Material', value: 'Natural Rudraksha' },
      { label: 'Colour', value: 'Natural Brown' },
      { label: 'Suitable For', value: 'Men & Women' },
      { label: 'Included Accessory', value: 'Gomukhi Jaap Bag' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × 5 Mukhi Rudraksha Mala, 1 × Gomukhi Jaap Bag' }
    ],
    keyFeatures: [
      'Natural 5 Mukhi Rudraksha Beads – Handcrafted from authentic Panchmukhi Rudraksha beads.',
      'Traditional 108+1 Bead Configuration – Formatted with 108 chanting beads plus 1 Sumeru Guru bead.',
      '7–8 mm Bead Size – Smooth, uniform bead diameter ideal for smooth counting during meditation.',
      'Gomukhi Jaap Bag Included – Comes with a protective Gomukhi bag to keep your mala clean during chanting.',
      'Ideal for Jaap, Meditation & Yoga – Enhances focus during mantra chanting, daily pooja, yoga, and temple visits.',
      'Suitable for Men & Women – Universal devotional accessory for daily spiritual practice and gifting.'
    ],
    careInstructions: [
      'Keep the Rudraksha Mala away from prolonged exposure to water, moisture, perfumes and harsh chemicals.',
      'Store it inside the Gomukhi bag or another clean, dry place when not in use.',
      'Handle the beads and thread gently to maintain their condition.'
    ],
    faqs: [
      { q: 'What is the bead count and size of this Rudraksha Mala?', a: 'It features 108 chanting beads plus 1 Sumeru Guru bead in a comfortable 7–8 mm bead size.' },
      { q: 'Is a Gomukhi Jaap Bag included with the mala?', a: 'Yes, each mala comes with a protective Gomukhi Jaap bag.' },
      { q: 'Who can use this 5 Mukhi Rudraksha Mala?', a: 'It is suitable for both men and women for Mantra Jaap, meditation, yoga, daily pooja, and temple visits.' },
      { q: 'How do I care for and maintain my Rudraksha Mala?', a: 'Keep dry, avoid perfumes/harsh chemicals, store inside the Gomukhi bag when not in use, and handle with care.' }
    ]
  },

  // 43. Natural Crystal Quartz Sphatik Mala
  {
    id: 'mandir-sphatik-mala',
    name: 'Natural Sphatik Mala 108+1 Beads',
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
      { weight: '7–8 mm Smooth Round (108+1)', price: 1490, originalPrice: 1890, default: true },
      { weight: 'Pack of 2 Sphatik Malas', price: 2690, originalPrice: 3490 }
    ],
    purity: 'Natural Crystal Quartz (Sphatik) Beads',
    inStock: true,
    description: 'Bring traditional elegance to your spiritual practice with this Natural Sphatik Mala, featuring 108 beads with one Sumeru bead in the traditional jaap mala configuration. The smooth, polished crystal quartz beads provide a comfortable grip during mantra chanting and meditation. The mala can be used for daily jaap, pooja, meditation, yoga and prayer, or worn as a traditional spiritual accessory. Its transparent crystal appearance gives the mala a simple and timeless look, making it suitable for both men and women. It can also be a thoughtful gift for devotees and meditation practitioners.',
    shortDescription: 'A traditional 108+1 bead Sphatik Mala crafted with smooth, transparent crystal quartz beads. Suitable for mantra jaap, meditation, yoga, pooja and devotional practices, and can also be worn as a spiritual accessory.',
    seoTitle: 'Natural Sphatik Mala 108+1 | Crystal Quartz Jaap Mala | Shraviko',
    metaDescription: 'Shop Natural Sphatik Mala with 108+1 crystal quartz beads, suitable for mantra jaap, meditation, pooja and yoga. Traditional design for daily spiritual practice.',
    specifications: [
      { label: 'Product Type', value: 'Sphatik Jaap Mala' },
      { label: 'Material', value: 'Natural Crystal / Sphatik' },
      { label: 'Bead Count', value: '108 + 1 Sumeru' },
      { label: 'Bead Size', value: '7–8 mm' },
      { label: 'Colour', value: 'Transparent / Clear' },
      { label: 'Bead Finish', value: 'Smooth & Polished' },
      { label: 'Suitable For', value: 'Men & Women' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Natural Sphatik Mala' }
    ],
    keyFeatures: [
      'Natural Sphatik / Crystal Quartz Beads – Crafted with transparent crystal quartz beads in a smooth, polished finish.',
      'Traditional 108+1 Bead Configuration – Formatted with 108 chanting beads plus 1 Sumeru Guru bead.',
      '7–8 mm Bead Size – Smooth, uniform bead size ideal for smooth counting during meditation.',
      'Multi-Purpose Spiritual Accessory – Suitable for Mantra Jaap, meditation, yoga practice, and daily pooja.',
      'Can Be Worn – Elegant transparent appearance suitable to be worn daily as a spiritual rosary necklace.',
      'Suitable for Men & Women – Universal devotional accessory for daily practice and spiritual gifting.'
    ],
    careInstructions: [
      'Handle the crystal beads carefully and avoid prolonged exposure to water, perfumes, oils and harsh chemicals.',
      'Wipe gently with a soft, dry cloth and store the mala in a clean, dry place when not in use.'
    ],
    faqs: [
      { q: 'What is included with the Sphatik Mala?', a: 'The package includes one Natural Sphatik Mala with 108+1 beads.' },
      { q: 'How many beads are in the mala?', a: 'The mala contains 108 beads plus one Sumeru bead.' },
      { q: 'Can the Sphatik Mala be used for Jaap?', a: 'Yes. Its traditional 108+1 configuration makes it suitable for mantra chanting and jaap.' },
      { q: 'Can it be worn as a spiritual accessory?', a: 'Yes, the mala can be used as a traditional spiritual accessory as well as for meditation and prayer.' },
      { q: 'How should I clean the mala?', a: 'Gently wipe the beads with a soft, dry cloth and avoid harsh chemicals, perfumes and prolonged exposure to moisture.' }
    ]
  },

  // 44. Vrindavan Dham Pure Organic Tulsi Mala
  {
    id: 'mandir-tulsi-mala',
    name: 'Original Tulsi Mala 108 Beads',
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
      { weight: '108 Beads (7 mm Natural Wood)', price: 690, originalPrice: 990, default: true },
      { weight: 'Pack of 2 Tulsi Malas', price: 1190, originalPrice: 1690 }
    ],
    purity: 'Natural Organic Tulsi Wood',
    inStock: true,
    description: 'Bring the timeless tradition of Tulsi into your daily spiritual practice with this Original Tulsi Mala, crafted from natural Tulsi wood beads and designed with the traditional 108-bead configuration. Tulsi has an important place in Hindu devotional traditions and is commonly associated with devotion, purity and worship. This mala can be used for mantra chanting, jaap, meditation, yoga, pooja, bhajan, kirtan and temple visits. The smooth, lightweight beads provide a comfortable grip during chanting and make the mala suitable for regular devotional use. Its traditional appearance also makes it suitable to wear as a spiritual accessory.',
    shortDescription: 'Embrace a traditional approach to daily devotion with this 108-bead Tulsi Mala, crafted from natural Tulsi wood. Suitable for mantra jaap, meditation, pooja, yoga, chanting and devotional practices.',
    seoTitle: 'Original Tulsi Mala 108 Beads | Natural Tulsi Wood Jaap Mala | Shraviko',
    metaDescription: 'Shop Original Tulsi Mala with 108 natural Tulsi wood beads. Ideal for jaap, mantra chanting, meditation, pooja, yoga and daily devotional practice.',
    specifications: [
      { label: 'Product Type', value: 'Tulsi Jaap Mala' },
      { label: 'Material', value: 'Natural Tulsi Wood' },
      { label: 'Number of Beads', value: '108 Beads' },
      { label: 'Bead Size', value: '7 mm' },
      { label: 'Bead Shape', value: 'Round' },
      { label: 'Colour', value: 'Natural' },
      { label: 'Usage', value: 'Jaap, Meditation, Pooja & Chanting' },
      { label: 'Suitable For', value: 'Men & Women' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Original Tulsi Mala — 108 Beads' }
    ],
    keyFeatures: [
      'Natural Tulsi Wood Beads – Crafted from authentic natural Tulsi wood.',
      'Traditional 108-Bead Design – Formatted with 108 smooth round beads.',
      '7 mm Bead Size – Lightweight 7 mm round beads for comfortable daily chanting grip.',
      'Multi-Purpose Devotional Accessory – Ideal for Mantra Jaap, meditation, yoga, pooja, bhajan, and kirtan.',
      'Suitable for Men & Women – Universal devotional rosary for daily wear and spiritual practice.',
      'Handcrafted in India – Authentic traditional Indian devotional craftsmanship.'
    ],
    careInstructions: [
      'Tulsi is a natural wood material and should be handled carefully.',
      'Keep the mala away from prolonged contact with water, perfumes, oils and harsh chemicals.',
      'Store it in a clean, dry place when not in use and gently wipe it with a soft cloth when required.'
    ],
    faqs: [
      { q: 'How many beads does this Tulsi Mala have?', a: 'This mala has 108 Tulsi wood beads.' },
      { q: 'What can the Tulsi Mala be used for?', a: 'It is suitable for mantra jaap, chanting, meditation, yoga, pooja, bhajan, kirtan and other devotional practices.' },
      { q: 'Is this mala made from natural Tulsi wood?', a: 'Yes, the product is made using natural Tulsi wood beads.' },
      { q: 'Can it be worn daily?', a: 'Yes, its lightweight design makes it suitable for regular wear, provided it is cared for properly.' },
      { q: 'How should I care for Tulsi beads?', a: 'Avoid prolonged exposure to water, perfumes and oils. Store the mala in a dry place and clean it gently with a soft cloth.' }
    ]
  },

  // 45. Natural White Seed Lord Krishna Vaijanti Mala
  {
    id: 'mandir-vaijanti-mala',
    name: 'Original Vaijanti Mala 108+1 Beads with Rudraksha',
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
      { weight: 'Standard 108+1 Seed Mala (with Rudraksha)', price: 890, originalPrice: 1190, default: true },
      { weight: 'Pack of 2 Vaijanti Malas', price: 1590, originalPrice: 2190 }
    ],
    purity: 'Natural Vaijanti Seeds with Rudraksha Sumeru Bead',
    inStock: true,
    description: 'Bring a traditional element to your daily devotional practice with this Original Vaijanti Mala, handcrafted using natural Vaijanti seeds and finished with a Rudraksha Sumeru bead. The mala features a traditional 108+1 bead configuration, making it suitable for mantra chanting, jaap, meditation, yoga and daily pooja. Each natural Vaijanti seed has its own individual texture, shape and appearance, giving every mala a distinctive character. The lightweight construction and durable thread make it convenient for regular spiritual practice and devotional use. Its traditional appearance also makes it suitable to wear as a spiritual accessory. Vaijanti Mala is traditionally associated with Lord Vishnu and Lord Krishna.',
    shortDescription: 'A traditionally crafted 108+1 Vaijanti Mala made from natural Vaijanti seeds with a Rudraksha Sumeru bead. Suitable for mantra jaap, meditation, pooja, yoga, temple visits and devotional practices.',
    seoTitle: 'Original Vaijanti Mala 108+1 | Natural Vaijayanti Seed Mala | Shraviko',
    metaDescription: 'Shop Original Vaijanti Mala with 108+1 natural Vaijanti seeds and Rudraksha Sumeru. Ideal for jaap, meditation, pooja, yoga and daily devotional practice.',
    specifications: [
      { label: 'Product Type', value: 'Vaijanti Jaap Mala' },
      { label: 'Material', value: 'Natural Vaijanti Seeds' },
      { label: 'Sumeru Bead', value: 'Rudraksha' },
      { label: 'Bead Count', value: '108 + 1' },
      { label: 'Bead Shape', value: 'Natural / Oval' },
      { label: 'Bead Size', value: '8–11 mm' },
      { label: 'Colour', value: 'Natural Off-White' },
      { label: 'Length', value: 'Approx. 36 Inches' },
      { label: 'Weight', value: 'Approx. 60 g' },
      { label: 'Suitable For', value: 'Men & Women' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Original Vaijanti Mala with Rudraksha Sumeru' }
    ],
    keyFeatures: [
      'Natural Vaijanti Seeds – Crafted from authentic natural Vaijanti seeds with unique natural textures.',
      'Traditional 108+1 Bead Configuration – Formatted with 108 seed beads plus 1 Rudraksha Sumeru Guru bead.',
      'Rudraksha Sumeru Bead – Crowned with a natural Rudraksha Sumeru bead for traditional spiritual completion.',
      'Associated with Lord Krishna & Vishnu – Sacred garland traditionally associated with victory and devotion.',
      'Lightweight & Comfortable – Approx. 36-inch length and 60g weight, easy for daily wear or chanting.',
      'Handcrafted in India – Authentic traditional Indian artisanal rosary.'
    ],
    careInstructions: [
      'Vaijanti seeds are natural material and should be handled with care.',
      'Avoid prolonged contact with water, perfumes, oils and harsh chemicals.',
      'Store the mala in a clean, dry place when not in use and gently wipe it with a soft cloth.'
    ],
    faqs: [
      { q: 'What is this Vaijanti Mala made from?', a: 'It is made from natural Vaijanti seeds and features a Rudraksha Sumeru bead.' },
      { q: 'How many beads does the mala have?', a: 'The mala has 108 beads plus one Sumeru bead.' },
      { q: 'What is Vaijanti Mala traditionally used for?', a: 'It is traditionally used for mantra chanting, jaap, meditation, pooja, and devotional practices associated with Lord Krishna & Vishnu.' },
      { q: 'Can the mala be worn?', a: 'Yes, it can be used for spiritual practice and worn as a traditional devotional accessory.' },
      { q: 'Are all Vaijanti seeds identical?', a: 'No, natural seeds can vary slightly in shape, texture, and appearance, which adds to the product\'s unique natural character.' }
    ]
  },

  // 46. Natural Black Ebony Wood Karungali Mala
  {
    id: 'mandir-karungali-mala',
    name: 'Original Natural Karungali Mala 108 Beads',
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
      { weight: '8 mm (108 Beads - Natural Black Ebony)', price: 1590, originalPrice: 2190, default: true },
      { weight: 'Pack of 2 Karungali Malas', price: 2890, originalPrice: 3890 }
    ],
    purity: 'Natural Karungali (Black Ebony Wood)',
    inStock: true,
    description: 'Bring traditional craftsmanship into your spiritual routine with this Original Natural Karungali Mala, handcrafted from natural Karungali (Black Ebony) wood. Featuring 108 wooden beads, the mala is designed for mantra chanting, jaap, meditation, yoga, pooja and other devotional practices. The natural finish preserves the distinctive character and texture of the wood, giving each mala a simple and traditional appearance. The 8 mm beads provide a comfortable grip during chanting and make the mala convenient for regular spiritual practice. Its lightweight wooden construction also allows it to be worn as a traditional spiritual accessory.',
    shortDescription: 'A traditional 108-bead Karungali Mala handcrafted from natural Black Ebony wood. Suitable for mantra jaap, meditation, yoga, pooja and daily devotional practices, with a distinctive natural wooden appearance.',
    seoTitle: 'Original Karungali Mala 108 Beads | Black Ebony Wood Jaap Mala | Shraviko',
    metaDescription: 'Shop Original Natural Karungali Mala made from Black Ebony wood with 108 beads. Ideal for jaap, meditation, yoga, pooja and daily spiritual practice.',
    specifications: [
      { label: 'Product Type', value: 'Karungali Jaap Mala' },
      { label: 'Material', value: 'Natural Karungali / Black Ebony Wood' },
      { label: 'Number of Beads', value: '108 Beads' },
      { label: 'Bead Size', value: '8 mm' },
      { label: 'Bead Shape', value: 'Round' },
      { label: 'Finish', value: 'Natural / Unpolished' },
      { label: 'Colour', value: 'Natural Black' },
      { label: 'Weight', value: 'Approx. 35 g' },
      { label: 'Length', value: 'Approx. 38 cm' },
      { label: 'Suitable For', value: 'Men & Women' },
      { label: 'Country of Origin', value: 'India' },
      { label: 'What\'s Included', value: '1 × Original Natural Karungali Mala — 108 Beads' }
    ],
    keyFeatures: [
      'Natural Karungali / Black Ebony Wood – Handcrafted from authentic dense Black Ebony wood.',
      'Traditional 108-Bead Design – Formatted with 108 smooth round wooden beads.',
      '8 mm Round Beads – Comfortable 8 mm diameter for smooth counting during meditation.',
      'Natural / Unpolished Finish – Preserves the authentic dark wood texture and grain.',
      'Lightweight & Comfortable – Approx. 35g weight and 38 cm length for comfortable wear and daily chanting.',
      'Suitable for Men & Women – Universal devotional rosary for daily wear, meditation, and gifting.'
    ],
    careInstructions: [
      'Karungali is a natural wood material and should be handled with care.',
      'Avoid prolonged exposure to water, perfumes, oils and harsh chemicals.',
      'Store the mala in a clean, dry place when not in use.',
      'Wipe gently with a soft, dry cloth when required.'
    ],
    faqs: [
      { q: 'What is the Karungali Mala made from?', a: 'This mala is made from natural Karungali, also known as Black Ebony wood.' },
      { q: 'How many beads are included?', a: 'The mala contains 108 beads.' },
      { q: 'What is the mala used for?', a: 'It is suitable for mantra jaap, meditation, yoga, pooja, prayer and other devotional practices.' },
      { q: 'Can the mala be worn?', a: 'Yes. It can be used during spiritual practices or worn as a traditional wooden spiritual accessory.' },
      { q: 'How should I care for the mala?', a: 'Keep it away from prolonged moisture, perfumes and harsh chemicals. Store it in a dry place and wipe it gently with a soft cloth.' },
      { q: 'Does every mala look exactly the same?', a: 'No. Natural wood can have slight variations in colour, grain and texture, which adds to the natural character of each piece.' }
    ]
  },

  // 47. Shraviko Wooden Damru
  {
    id: 'mandir-wooden-damru-shiva',
    name: 'Shraviko Wooden Damru',
    category: 'mandir-essentials',
    categoryName: 'Mandir Essentials',
    subcategory: 'Devotional Instruments',
    price: 790,
    originalPrice: 1090,
    rating: 4.98,
    reviewsCount: 164,
    tag: 'Wooden Damru',
    artType: 'damru',
    fitMode: 'contain',
    image: '/assets/Damru/damru1.jpg',
    images: [
      '/assets/Damru/damru1.jpg',
      '/assets/Damru/damru2.jpg',
      '/assets/Damru/damru3.jpg',
      '/assets/Damru/Damru4.jpg',
      '/assets/Damru/Wooden Damru.png'
    ],
    weightVariants: [
      { weight: 'Standard 6 Inch Damru', price: 790, originalPrice: 1090, default: true },
      { weight: 'Pack of 2 Wooden Damrus', price: 1490, originalPrice: 1990 }
    ],
    purity: '100% Natural Wood & Leather',
    inStock: true,
    description: 'Celebrate the timeless tradition associated with Lord Shiva with the Shraviko Wooden Damru. Crafted from natural wood with leather drum heads, this traditional handheld percussion instrument is designed for pooja, devotional singing, cultural occasions, and spiritual spaces. The Damru, also known as Damaru or Damroo, holds a special place in Hindu tradition and is traditionally associated with Lord Shiva. Its distinctive shape and rhythmic sound make it an integral part of many devotional and cultural practices. Made with a natural wooden body and leather drum heads, the Damru retains the simple character of a traditional Indian percussion instrument. When rotated by its handle, the attached beaters strike the drum heads to create the characteristic rhythmic sound of a Damru.',
    shortDescription: 'Shraviko Wooden Damru (6-inch handheld traditional percussion instrument) crafted from natural wood and leather drum heads for Shiva Puja, Aarti, Bhajan, and Kirtan.',
    seoTitle: 'Shraviko Wooden Damru (6-Inch Traditional Handheld Instrument) | Shraviko',
    metaDescription: 'Shop Shraviko Wooden Damru. Traditional handheld percussion instrument crafted from natural wood and leather for Shiva Puja, Mahashivratri, Sawan, Bhajan and Kirtan.',
    specifications: [
      { label: 'Product', value: 'Wooden Damru / Damaru' },
      { label: 'Material', value: 'Natural Wood & Leather Drum Heads' },
      { label: 'Colour', value: 'Natural Brown' },
      { label: 'Finish', value: 'Natural Handcrafted Polish' },
      { label: 'Size', value: 'Approximately 6 inches' },
      { label: 'Instrument Type', value: 'Handheld Traditional Percussion Instrument' },
      { label: 'Usage', value: 'Pooja, Bhajan, Kirtan, Mahashivratri & Cultural Activities' },
      { label: 'Country of Origin', value: 'Made in India' },
      { label: 'What\'s Included', value: '1 × Shraviko Wooden Damru with Attached Beaters' }
    ],
    keyFeatures: [
      'Traditional Handcrafted Construction – Natural wooden body with authentic leather drum heads.',
      'Rhythmic Traditional Sound – Hand-rotation mechanism with dual beaters creates rhythmic devotional sound.',
      'Lord Shiva Devotional Symbolism – Sacred instrument associated with Lord Shiva, ideal for Mahashivratri and Sawan worship.',
      'Compact & Easy to Hold – 6-inch ergonomic form easy for children and adults to hold during Bhajans and Kirtans.',
      'Versatile Devotional Decor – Suitable for home altars, temple decor, meditation spaces, and cultural performances.'
    ],
    careInstructions: [
      'Keep the Damru away from prolonged moisture and direct exposure to water.',
      'Store in a clean, dry place when not in use.',
      'Wipe the wooden body gently with a soft dry cloth.'
    ],
    faqs: [
      { q: 'Is this Damru made of natural wood and leather?', a: 'Yes, it is crafted from natural wood with authentic leather drum heads.' },
      { q: 'What is the size of the Damru?', a: 'It measures approximately 6 inches in height.' },
      { q: 'How does the Damru produce sound?', a: 'Rotating the handle back and forth causes the attached string beaters to strike the dual drum heads, producing rhythmic sound.' },
      { q: 'What occasions is the Wooden Damru suitable for?', a: 'It is ideal for Shiva Puja, Mahashivratri, Sawan, Rudrabhishek, Bhajan, Kirtan, and traditional home decor.' }
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
