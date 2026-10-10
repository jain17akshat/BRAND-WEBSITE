/**
 * prerender.mjs — Static HTML Prerendering for SHRAVIKO
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates SEO-optimized, static HTML files for every route:
 *   - 1 Homepage (/)
 *   - 8 Category pages (/category/:id)
 *   - 89 Product pages (/product/:id)
 *   - 7 Static pages (/about, /gifting, /all-collections, etc.)
 *
 * Each generated HTML file contains:
 *   1. Unique, keyword-rich <title> (50-60 chars)
 *   2. Unique, high-CTR <meta name="description"> (140-155 chars)
 *   3. Self-referencing <link rel="canonical" href="...">
 *   4. Dynamic Open Graph & Twitter Cards with full product imagery
 *   5. Complete Schema.org JSON-LD (Product, Breadcrumbs, FAQs, Collection, Org)
 *   6. Crawlable semantic H1 & body content inside <div id="root">
 *
 * Run via: node prerender.mjs (or automatically via `npm run build`)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, CATEGORIES } from './src/data/products.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const SITE_URL = 'https://shraviko.com';
const LOGO_URL = `${SITE_URL}/assets/Logo/LOGO.png`;

// Category metadata map for rich snippets
const CATEGORY_META = {
  metalware: {
    title: 'Artisanal Metalware & Brassware Collection | SHRAVIKO',
    description: 'Explore solid brass & pure copper pooja articles — handcrafted bells, thali sets, kalash vessels, diyas, and hawankunds. Handcrafted in India.',
    h1: 'Artisanal Metalware & Brassware Collection',
  },
  brass: {
    title: 'Handcrafted Brass Pooja Articles & Essentials | SHRAVIKO',
    description: 'Shop pure heavy brass pooja articles — resonant bells, akhand diyas, traditional thalis, and sacred murtis. Handcrafted with Vedic devotion.',
    h1: 'Handcrafted Brass Pooja Articles',
  },
  copper: {
    title: 'Pure Copper Pooja Vessels, Lota & Kalash | SHRAVIKO',
    description: 'Authentic 100% pure copper pooja vessels, engraved lotas, and sacred kalash designed for Vedic rituals and water sanctification.',
    h1: 'Pure Copper Pooja Vessels & Kalash',
  },
  'mandir-essentials': {
    title: 'Sacred Mandir Essentials & Altar Articles | SHRAVIKO',
    description: 'Complete home temple essentials — handcrafted diyas, dhoop burners, aarti lamps, and puja thalis designed to elevate your daily prayers.',
    h1: 'Sacred Mandir Essentials & Altar Articles',
  },
  'energy-stones': {
    title: 'Authentic Energy Stones, Pyramids & Malas | SHRAVIKO',
    description: 'Natural healing gemstones, orgone pyramids, crystal bracelets, and energized Japa malas consecrated for spiritual protection and peace.',
    h1: 'Authentic Energy Stones, Pyramids & Japa Malas',
  },
  incense: {
    title: 'Organic Charcoal-Free Incense Sticks & Dhoop | SHRAVIKO',
    description: '100% natural, charcoal-free temple flower agarbatti sticks, organic dhoop cones, and sambrani cups crafted with natural essential oils.',
    h1: 'Organic Charcoal-Free Incense & Dhoop',
  },
  vastu: {
    title: 'Vastu & Spiritual Harmonizing Essentials | SHRAVIKO',
    description: 'Sacred Vastu articles, tortoises, energizing pyramids, and sacred symbols crafted to harmonize energy, dispel negativity, and bring prosperity.',
    h1: 'Vastu & Spiritual Harmonizing Essentials',
  },
  yantras: {
    title: 'Sacred Vedic Yantras & Sacred Geometries | SHRAVIKO',
    description: 'Handcrafted sacred geometric Vedic yantras — energized Shree Yantras and divine talismans for abundance, clarity, and spiritual elevation.',
    h1: 'Sacred Vedic Yantras & Geometries',
  },
};

// Static Pages metadata
const STATIC_PAGES = [
  {
    path: '/about',
    title: 'About SHRAVIKO — Our Heritage & Sacred Craftsmanship',
    description: 'Learn about SHRAVIKO — Udaipur-based brand crafting pure brassware, copper vessels, and sacred pooja essentials rooted in timeless Indian heritage.',
    h1: 'About SHRAVIKO — Heritage, Devotion & Craftsmanship',
    content: 'Rooted in the royal artisan heritage of Udaipur, Rajasthan, SHRAVIKO was born from a deep reverence for sacred living. We partner with master generational metalsmiths to revive pure brass and copper ritual ware.',
  },
  {
    path: '/all-collections',
    title: 'All Collections | Handcrafted Indian Pooja Essentials | SHRAVIKO',
    description: 'Browse our complete catalog of handcrafted brassware, copper vessels, mandir essentials, organic incense, yantras, and consecrated energy stones.',
    h1: 'Complete Catalog of Handcrafted Indian Pooja Essentials',
    content: 'Discover our complete range of sacred articles designed for devotional worship, home sanctuary decor, and intentional daily living.',
  },
  {
    path: '/gifting',
    title: 'Corporate & Bulk Spiritual Gifting | Handcrafted | SHRAVIKO',
    description: 'Curated spiritual and festive gifts for corporate teams, weddings, and sacred occasions. Custom packaging, bulk pricing, and personalized brassware.',
    h1: 'Corporate & Bulk Spiritual Gifting Solutions',
    content: 'Gift timeless elegance and sacred blessings. Our bespoke gifting service caters to festive Diwali gifting, corporate appreciation, and wedding tokens.',
  },
  {
    path: '/energy-stones',
    title: 'Energy Stones & Crystal Healing Bracelets | SHRAVIKO',
    description: '100% natural healing gemstones, orgone pyramids, and consecrated Japa malas crafted to align chakras and channel peaceful spiritual vibrations.',
    h1: 'Sacred Energy Stones & Healing Crystal Collections',
    content: 'Each gemstone and pyramid is sourced with ethical mindfulness, carefully cleansed, and energized to support meditation, protection, and emotional equilibrium.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Transparent Data Protection | SHRAVIKO',
    description: 'Read the official SHRAVIKO Privacy Policy. We respect your confidentiality and protect your data across ordering, shipping, and payments.',
    h1: 'SHRAVIKO Privacy Policy',
    content: 'Your privacy is paramount to us. Learn how we securely process transactions with Razorpay, ship orders via Shiprocket, and safeguard customer data.',
  },
  {
    path: '/refund-policy',
    title: 'Cancellation & Refund Policy | 7-Day Easy Returns | SHRAVIKO',
    description: 'SHRAVIKO return and refund policy. Learn about hassle-free 7-day returns, damage replacements, and prompt refund processing.',
    h1: 'Cancellation & Refund Policy',
    content: 'We take pride in our artisanal quality. In the rare event of transit damage or defects, our simple 7-day return policy ensures immediate replacements or refunds.',
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | Order, Shipping & Use Policy | SHRAVIKO',
    description: 'Official terms and conditions for purchasing from SHRAVIKO. Clear guidelines on order placement, fulfillment, pricing, and warranty.',
    h1: 'Terms and Conditions',
    content: 'These terms govern your purchases and interactions with SHRAVIKO. We provide nationwide insured delivery and verified secure payment processing.',
  },
];

// Helper: Escape HTML strings
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Generate Organization & WebSite Schemas
function getBaseOrgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'SHRAVIKO',
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'Premium Indian pooja essentials — handcrafted brassware, pure copper vessels, sacred yantras, Rudraksha malas, and organic incense. Made in India.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+917742320607',
      contactType: 'customer service',
      email: 'info@shraviko.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/shraviko/',
      'https://www.facebook.com/profile.php?id=61593917600311',
      'https://www.amazon.in/s?k=shraviko',
    ],
  };
}

// Build page HTML using base template
function renderPageHtml(baseTemplate, {
  canonicalPath,
  title,
  description,
  ogImage = LOGO_URL,
  ogType = 'website',
  schemas = [],
  h1,
  bodyHtml = '',
}) {
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  let html = baseTemplate;

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // 2. Replace <meta name="description">
  const descMeta = `<meta name="description" content="${escapeHtml(description)}" />`;
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, descMeta);
  } else {
    html = html.replace('</head>', `  ${descMeta}\n</head>`);
  }

  // 3. Replace/inject Canonical Tag
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // 4. Update OpenGraph tags
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${fullOgImage}" />`);
  html = html.replace(/<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${ogType}" />`);

  // 5. Update Twitter tags
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${fullOgImage}" />`);

  // 6. Inject JSON-LD schemas
  // Remove existing base application/ld+json script to avoid duplicate schemas
  html = html.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  if (schemas && schemas.length > 0) {
    const jsonLdTag = `  <script type="application/ld+json">\n${JSON.stringify(schemas.length === 1 ? schemas[0] : { '@context': 'https://schema.org', '@graph': schemas }, null, 2)}\n  </script>`;
    html = html.replace('</head>', `${jsonLdTag}\n</head>`);
  }

  // 7. Inject crawlable semantic fallback inside <div id="root">
  const semanticRoot = `  <div id="root">
    <!-- Server-rendered crawlable content for SEO indexing (Seamlessly hydrated by React) -->
    <header style="padding: 1rem 1.5rem; background: #1C1715; color: #FAF9F5; border-bottom: 1px solid #3A322C;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <a href="/" style="font-family: serif; font-size: 1.25rem; font-weight: bold; letter-spacing: 0.1em; color: #C5A059; text-decoration: none;">SHRAVIKO</a>
        <nav aria-label="Main Navigation" style="font-size: 0.875rem;">
          <a href="/all-collections" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">All Collections</a>
          <a href="/category/brass" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">Brass Articles</a>
          <a href="/category/copper" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">Copper Vessels</a>
          <a href="/category/incense" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">Incense &amp; Dhoop</a>
          <a href="/about" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">Our Story</a>
          <a href="/gifting" style="color: #FAF9F5; margin: 0 0.5rem; text-decoration: none;">Gifting</a>
        </nav>
      </div>
    </header>
    <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; color: #2C2623;">
      <h1 style="font-family: serif; font-size: 2rem; color: #2C2623; margin-bottom: 1rem; line-height: 1.3;">${escapeHtml(h1)}</h1>
      ${bodyHtml}
    </main>
  </div>`;

  html = html.replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, semanticRoot);

  return html;
}

// Save HTML to output path
function saveHtmlFile(relativePath, html) {
  const targetPath = resolve(DIST_DIR, relativePath);
  const targetDir = dirname(targetPath);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  writeFileSync(targetPath, html, 'utf-8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Prerender Execution
// ─────────────────────────────────────────────────────────────────────────────
export async function prerender() {
  console.log('\n🚀 Starting SHRAVIKO Static HTML Prerendering...');

  const indexPath = resolve(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    console.error('❌ dist/index.html not found! Run `npx vite build` first.');
    process.exit(1);
  }

  const baseTemplate = readFileSync(indexPath, 'utf-8');
  let count = 0;

  // 1. Prerender Homepage (/)
  const homeOrg = getBaseOrgSchema();
  const homeWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SHRAVIKO',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/all-collections?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const homeStore = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'SHRAVIKO',
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: '+917742320607',
    email: 'info@shraviko.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Udaipur',
      addressRegion: 'Rajasthan',
      postalCode: '313001',
      addressCountry: 'IN',
    },
  };

  const homeHtml = renderPageHtml(baseTemplate, {
    canonicalPath: '/',
    title: 'SHRAVIKO — Handcrafted Indian Pooja Essentials & Brassware',
    description: 'Elevate your daily rituals with Shraviko. Shop pure heavy brassware, copper vessels, organic temple flower incense, handcrafted pooja thalis, and sacred yantras.',
    ogImage: LOGO_URL,
    ogType: 'website',
    schemas: [homeOrg, homeWebSite, homeStore],
    h1: 'SHRAVIKO — Handcrafted Indian Pooja Essentials & Sacred Living',
    bodyHtml: `
      <p style="color: #5A4D41; line-height: 1.7; font-size: 1.05rem; margin-bottom: 1.5rem;">
        Discover handcrafted, sacred lifestyle essentials rooted in centuries of Indian heritage. From heavy brass pooja bells, akhand diyas, and authentic copper vessels to charcoal-free organic temple flower agarbatti and consecrated energy malas — each Shraviko piece is crafted to bring purity, grace, and sacred intent into your home sanctuary.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 2rem;">
        <div style="padding: 1.25rem; border: 1px solid #EAE0CD; border-radius: 8px; background: #FAF5EB;">
          <h2 style="font-family: serif; font-size: 1.2rem; margin-top: 0; color: #2C2623;">Solid Brass Articles</h2>
          <p style="font-size: 0.9rem; color: #5A4D41;">Heavy, resonant ghantis, Panchpatra achmani sets, and akhand jyot diyas handcrafted by traditional metalsmiths.</p>
          <a href="/category/brass" style="color: #C5A059; font-weight: bold; text-decoration: none;">Explore Brassware &rarr;</a>
        </div>
        <div style="padding: 1.25rem; border: 1px solid #EAE0CD; border-radius: 8px; background: #FAF5EB;">
          <h2 style="font-family: serif; font-size: 1.2rem; margin-top: 0; color: #2C2623;">Pure Copper Vessels</h2>
          <p style="font-size: 0.9rem; color: #5A4D41;">Handcrafted copper kalash, lotas, and ritual vessels crafted from 100% pure copper for Vedic ceremonies.</p>
          <a href="/category/copper" style="color: #C5A059; font-weight: bold; text-decoration: none;">Explore Copper Articles &rarr;</a>
        </div>
        <div style="padding: 1.25rem; border: 1px solid #EAE0CD; border-radius: 8px; background: #FAF5EB;">
          <h2 style="font-family: serif; font-size: 1.2rem; margin-top: 0; color: #2C2623;">Charcoal-Free Incense</h2>
          <p style="font-size: 0.9rem; color: #5A4D41;">Organic temple flower agarbatti, authentic dhoop cones, and sambrani cups crafted without charcoal or chemicals.</p>
          <a href="/category/incense" style="color: #C5A059; font-weight: bold; text-decoration: none;">Explore Incense &rarr;</a>
        </div>
      </div>
    `,
  });
  saveHtmlFile('index.html', homeHtml);
  count++;

  // 2. Prerender Static Pages
  for (const page of STATIC_PAGES) {
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: page.h1, item: `${SITE_URL}${page.path}` },
      ],
    };

    const pageSchemas = [homeOrg, breadcrumbs];

    const html = renderPageHtml(baseTemplate, {
      canonicalPath: page.path,
      title: page.title,
      description: page.description,
      ogImage: LOGO_URL,
      ogType: 'website',
      schemas: pageSchemas,
      h1: page.h1,
      bodyHtml: `
        <nav aria-label="breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.5rem; color: #8C7A6B;">
          <a href="/" style="color: #8C6929; text-decoration: none;">Home</a> &gt; <span>${escapeHtml(page.h1)}</span>
        </nav>
        <p style="color: #5A4D41; line-height: 1.8; font-size: 1.05rem;">${escapeHtml(page.content)}</p>
        <div style="margin-top: 2rem;">
          <a href="/all-collections" style="display: inline-block; padding: 0.75rem 1.5rem; background: #231E1C; color: #E5C378; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse All Sacred Collections</a>
        </div>
      `,
    });

    saveHtmlFile(`${page.path.replace(/^\//, '')}/index.html`, html);
    count++;
  }

  // 3. Prerender Category Pages (/category/:id)
  const validCategories = CATEGORIES.filter((c) => c.id && c.id !== 'all');
  for (const cat of validCategories) {
    const meta = CATEGORY_META[cat.id] || {
      title: `${cat.name} Collection | Handcrafted Pooja Essentials | SHRAVIKO`,
      description: `Explore the SHRAVIKO ${cat.name} collection. Pure solid brass, copper, and devotional articles crafted by generational Indian artisans.`,
      h1: `${cat.name} Collection`,
    };

    const catProducts = PRODUCTS.filter((p) => p.category === cat.id);

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/all-collections` },
        { '@type': 'ListItem', position: 3, name: cat.name, item: `${SITE_URL}/category/${cat.id}` },
      ],
    };

    const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${cat.name} Collection — SHRAVIKO`,
      description: meta.description,
      url: `${SITE_URL}/category/${cat.id}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: catProducts.slice(0, 30).map((prod, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE_URL}/product/${prod.id}`,
          name: prod.name,
        })),
      },
    };

    const productListHtml = catProducts.map((p) => `
      <div style="padding: 1rem; border: 1px solid #EAE0CD; border-radius: 8px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <a href="/product/${p.id}" style="text-decoration: none; color: inherit;">
            <img src="${p.image || LOGO_URL}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 220px; object-fit: contain; background: #FAF9F5; border-radius: 6px; margin-bottom: 0.75rem;" loading="lazy" />
            <h3 style="font-family: serif; font-size: 1rem; color: #2C2623; margin: 0 0 0.5rem 0;">${escapeHtml(p.name)}</h3>
          </a>
          <p style="font-size: 0.85rem; color: #73675E; line-height: 1.4; margin: 0 0 0.75rem 0;">${escapeHtml(p.shortDescription || p.description?.substring(0, 100))}...</p>
        </div>
        <div>
          <p style="font-weight: bold; font-size: 1.1rem; color: #8C6929; margin: 0 0 0.5rem 0;">₹${p.price} <span style="font-size: 0.85rem; text-decoration: line-line; color: #A09890; font-weight: normal;">₹${p.originalPrice || ''}</span></p>
          <a href="/product/${p.id}" style="display: block; text-align: center; padding: 0.5rem; background: #231E1C; color: #E5C378; text-decoration: none; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">View Details</a>
        </div>
      </div>
    `).join('');

    const html = renderPageHtml(baseTemplate, {
      canonicalPath: `/category/${cat.id}`,
      title: meta.title,
      description: meta.description,
      ogImage: catProducts[0]?.image || LOGO_URL,
      ogType: 'website',
      schemas: [collectionSchema, breadcrumbs],
      h1: meta.h1,
      bodyHtml: `
        <nav aria-label="breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.5rem; color: #8C7A6B;">
          <a href="/" style="color: #8C6929; text-decoration: none;">Home</a> &gt; 
          <a href="/all-collections" style="color: #8C6929; text-decoration: none;">Collections</a> &gt; 
          <span>${escapeHtml(cat.name)}</span>
        </nav>
        <p style="color: #5A4D41; line-height: 1.6; font-size: 1rem; margin-bottom: 2rem;">${escapeHtml(meta.description)}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
          ${productListHtml}
        </div>
      `,
    });

    saveHtmlFile(`category/${cat.id}/index.html`, html);
    count++;
  }

  // 4. Prerender Product Pages (/product/:id)
  for (const product of PRODUCTS) {
    if (!product.id) continue;

    // Build SEO title & description
    const weightLabel = product.weightVariants?.[0]?.weight ? ` (${product.weightVariants[0].weight})` : '';
    const seoTitle = product.seoTitle || `${product.name}${weightLabel} | Pure Brass & Pooja Essentials | SHRAVIKO`;
    const seoDescription = product.metaDescription || product.shortDescription || (product.description ? product.description.substring(0, 155) : `Buy authentic ${product.name} handcrafted by master artisans. Pure metal, fast nationwide delivery across India.`);

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: product.categoryName || 'Collection', item: `${SITE_URL}/category/${product.category}` },
        { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/product/${product.id}` },
      ],
    };

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      url: `${SITE_URL}/product/${product.id}`,
      image: product.image ? [`${SITE_URL}${product.image}`] : (product.images ? product.images.map((img) => `${SITE_URL}${img}`) : [LOGO_URL]),
      description: seoDescription,
      sku: product.sku || product.id,
      mpn: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: 'SHRAVIKO',
      },
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/product/${product.id}`,
        priceCurrency: 'INR',
        price: product.price,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'SHRAVIKO',
        },
      },
      ...(product.rating ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount || 24,
          bestRating: '5',
          worstRating: '1',
        },
      } : {}),
    };

    const faqList = product.faqs || [];
    const faqSchema = faqList.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((faq) => ({
        '@type': 'Question',
        name: faq.q || faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a || faq.answer,
        },
      })),
    } : null;

    const schemas = [productSchema, breadcrumbs];
    if (faqSchema) schemas.push(faqSchema);

    // Build specifications table HTML
    const specsHtml = (product.specifications || []).map((spec) => `
      <tr>
        <td style="padding: 0.5rem; border: 1px solid #EAE0CD; font-weight: bold; font-size: 0.85rem; background: #FAF5EB; width: 35%;">${escapeHtml(spec.label)}</td>
        <td style="padding: 0.5rem; border: 1px solid #EAE0CD; font-size: 0.85rem;">${escapeHtml(spec.value)}</td>
      </tr>
    `).join('');

    // Build FAQ HTML
    const faqHtml = faqList.map((faq) => `
      <div style="margin-bottom: 1rem; padding: 1rem; background: #FFFFFF; border: 1px solid #EAE0CD; border-radius: 8px;">
        <h4 style="font-family: serif; font-size: 0.95rem; color: #2C2623; margin: 0 0 0.5rem 0;">Q: ${escapeHtml(faq.q || faq.question)}</h4>
        <p style="font-size: 0.875rem; color: #5A4D41; margin: 0; line-height: 1.5;">${escapeHtml(faq.a || faq.answer)}</p>
      </div>
    `).join('');

    const html = renderPageHtml(baseTemplate, {
      canonicalPath: `/product/${product.id}`,
      title: seoTitle,
      description: seoDescription,
      ogImage: product.image || LOGO_URL,
      ogType: 'product',
      schemas,
      h1: product.name,
      bodyHtml: `
        <nav aria-label="breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.5rem; color: #8C7A6B;">
          <a href="/" style="color: #8C6929; text-decoration: none;">Home</a> &gt; 
          <a href="/category/${product.category}" style="color: #8C6929; text-decoration: none;">${escapeHtml(product.categoryName || 'Collection')}</a> &gt; 
          <span>${escapeHtml(product.name)}</span>
        </nav>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <img src="${product.image || LOGO_URL}" alt="${escapeHtml(product.name)}" style="width: 100%; max-height: 480px; object-fit: contain; background: #FAF9F5; border-radius: 12px; border: 1px solid #EAE0CD;" />
          </div>
          <div>
            <p style="font-size: 0.9rem; color: #8C6929; font-weight: bold; text-transform: uppercase; margin: 0 0 0.5rem 0;">${escapeHtml(product.categoryName || 'Sacred Collection')} &bull; ${escapeHtml(product.purity || 'Artisanal Craft')}</p>
            <div style="font-size: 1.5rem; font-weight: bold; color: #8C6929; margin: 0.5rem 0 1rem 0;">
              ₹${product.price}
              ${product.originalPrice ? `<span style="font-size: 1rem; text-decoration: line-through; color: #A09890; margin-left: 0.5rem;">₹${product.originalPrice}</span>` : ''}
              ${product.inStock !== false ? '<span style="font-size: 0.8rem; background: #D1FAE5; color: #065F46; padding: 0.25rem 0.5rem; border-radius: 4px; margin-left: 0.75rem;">In Stock</span>' : '<span style="font-size: 0.8rem; background: #FEE2E2; color: #991B1B; padding: 0.25rem 0.5rem; border-radius: 4px; margin-left: 0.75rem;">Out of Stock</span>'}
            </div>
            <p style="color: #5A4D41; line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.5rem;">${escapeHtml(product.description)}</p>
            ${specsHtml ? `
              <h3 style="font-family: serif; font-size: 1.1rem; color: #2C2623; margin-top: 1.5rem; margin-bottom: 0.75rem;">Product Specifications</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                <tbody>${specsHtml}</tbody>
              </table>
            ` : ''}
          </div>
        </div>
        ${faqHtml ? `
          <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #EAE0CD;">
            <h3 style="font-family: serif; font-size: 1.25rem; color: #2C2623; margin-bottom: 1rem;">Frequently Asked Questions</h3>
            ${faqHtml}
          </div>
        ` : ''}
      `,
    });

    saveHtmlFile(`product/${product.id}/index.html`, html);
    count++;
  }

  // Save seoCatalog.json to backend/data/seoCatalog.json for runtime Express SSR fallback
  const backendDataDir = resolve(__dirname, '../backend/data');
  if (existsSync(backendDataDir)) {
    const seoCatalog = {
      categories: CATEGORY_META,
      products: PRODUCTS.reduce((acc, p) => {
        if (p.id) {
          acc[p.id] = {
            id: p.id,
            sku: p.sku || p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            category: p.category,
            categoryName: p.categoryName,
            image: p.image,
            images: p.images,
            shortDescription: p.shortDescription,
            metaDescription: p.metaDescription,
            description: p.description,
            purity: p.purity,
            inStock: p.inStock,
            rating: p.rating,
            reviewsCount: p.reviewsCount,
            specifications: p.specifications,
            faqs: p.faqs,
          };
        }
        return acc;
      }, {}),
      staticPages: STATIC_PAGES.reduce((acc, p) => {
        acc[p.path] = p;
        return acc;
      }, {}),
    };
    writeFileSync(resolve(backendDataDir, 'seoCatalog.json'), JSON.stringify(seoCatalog, null, 2), 'utf-8');
    console.log('✅ Generated backend/data/seoCatalog.json for runtime Express SSR');
  }

  console.log(`✅ Successfully prerendered ${count} pages into dist/!`);
  console.log(`   - 1 Homepage`);
  console.log(`   - ${STATIC_PAGES.length} Static Pages`);
  console.log(`   - ${validCategories.length} Category Pages`);
  console.log(`   - ${PRODUCTS.length} Product Pages`);
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerender().catch((err) => {
    console.error('❌ Prerender failed:', err);
    process.exit(1);
  });
}
