/**
 * backend/services/seoRenderer.js
 * ─────────────────────────────────────────────────────────────
 * Server-Side SEO & Meta Injection Service for Shraviko.
 *
 * Responsibilities:
 *   1. Serves static prerendered HTML from frontend/dist if available.
 *   2. Dynamic runtime SSR/Meta injection fallback for every URL.
 *   3. Enforces real HTTP 404 status codes for invalid products/categories
 *      (Eliminates "soft 404s" flagged in SEO Audit).
 *   4. Ensures search engine crawlers always receive unique titles,
 *      meta descriptions, self-referencing canonicals, and JSON-LD schemas.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://shraviko.com';
const LOGO_URL = `${SITE_URL}/assets/Logo/LOGO.png`;

let catalog = null;
function loadCatalog() {
  if (catalog) return catalog;
  try {
    const catalogPath = path.join(__dirname, '../data/seoCatalog.json');
    if (fs.existsSync(catalogPath)) {
      catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    }
  } catch (err) {
    console.warn('⚠️ Could not load seoCatalog.json in seoRenderer:', err.message);
  }
  return catalog;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Handle incoming HTML route requests
 */
function handleSeoRequest(req, res, frontendDistPath) {
  const rawPath = req.path;
  const cleanPath = rawPath.replace(/\/$/, '') || '/';

  // 1. Check if a pre-rendered static HTML file exists on disk
  if (cleanPath !== '/') {
    const prerenderedPath = path.join(frontendDistPath, cleanPath, 'index.html');
    if (fs.existsSync(prerenderedPath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.sendFile(prerenderedPath);
    }
  } else {
    const homePath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(homePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.sendFile(homePath);
    }
  }

  // 2. Fallback to runtime dynamic SEO injection
  const baseIndexPath = path.join(frontendDistPath, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    return res.status(503).send('Site build in progress. Please refresh in a moment.');
  }

  let htmlTemplate = fs.readFileSync(baseIndexPath, 'utf8');
  const catData = loadCatalog();

  // Route: /product/:id
  if (cleanPath.startsWith('/product/')) {
    const prodId = cleanPath.replace('/product/', '').trim().toLowerCase();
    const product = catData && catData.products ? (catData.products[prodId] || Object.values(catData.products).find(p => p.id.toLowerCase() === prodId || (p.sku && p.sku.toLowerCase() === prodId))) : null;

    if (!product) {
      // Real HTTP 404 (No Soft 404!)
      res.status(404);
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      const notFoundHtml = htmlTemplate
        .replace(/<title>.*?<\/title>/i, '<title>Product Not Found | SHRAVIKO</title>')
        .replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="The sacred product you are searching for is not available or has moved. Explore our complete handcrafted collections." />')
        .replace('</head>', '  <meta name="robots" content="noindex, follow" />\n</head>')
        .replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, `
          <div id="root">
            <main style="max-width: 600px; margin: 4rem auto; text-align: center; font-family: serif; padding: 2rem; color: #2C2623;">
              <h1 style="font-size: 2rem; color: #8C6929; margin-bottom: 1rem;">Sacred Item Not Found</h1>
              <p style="color: #5A4D41; line-height: 1.6; margin-bottom: 2rem;">The product you are looking for is currently unavailable or the link may have changed.</p>
              <a href="/all-collections" style="display: inline-block; padding: 0.75rem 1.75rem; background: #231E1C; color: #E5C378; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse All Collections</a>
            </main>
          </div>
        `);
      return res.send(notFoundHtml);
    }

    // Valid Product — Inject dynamic SEO tags & Schema
    const weightLabel = product.weightVariants?.[0]?.weight ? ` (${product.weightVariants[0].weight})` : '';
    const title = product.seoTitle || `${product.name}${weightLabel} | Pure Brass & Pooja Essentials | SHRAVIKO`;
    const description = product.metaDescription || product.shortDescription || (product.description ? product.description.substring(0, 155) : `Buy authentic ${product.name} handcrafted by master artisans.`);
    const canonicalUrl = `${SITE_URL}/product/${product.id}`;
    const ogImage = product.image ? (product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`) : LOGO_URL;

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      url: canonicalUrl,
      image: [ogImage],
      description,
      sku: product.sku || product.id,
      mpn: product.sku || product.id,
      brand: { '@type': 'Brand', name: 'SHRAVIKO' },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'INR',
        price: product.price,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'SHRAVIKO' },
      },
      ...(product.rating ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount || 20,
          bestRating: '5',
          worstRating: '1',
        },
      } : {}),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: product.categoryName || 'Collection', item: `${SITE_URL}/category/${product.category}` },
        { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
      ],
    };

    const schemas = [productSchema, breadcrumbSchema];
    if (product.faqs && product.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: product.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q || faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.a || faq.answer },
        })),
      });
    }

    let dynamicHtml = htmlTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
      .replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${ogImage}" />`)
      .replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
      .replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${ogImage}" />`);

    const jsonLdTag = `  <script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas }, null, 2)}\n  </script>`;
    dynamicHtml = dynamicHtml.replace('</head>', `${jsonLdTag}\n</head>`);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.send(dynamicHtml);
  }

  // Route: /category/:id
  if (cleanPath.startsWith('/category/')) {
    const catId = cleanPath.replace('/category/', '').trim().toLowerCase();
    const catMeta = catData && catData.categories ? catData.categories[catId] : null;

    if (!catMeta) {
      // Real HTTP 404
      res.status(404);
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      const notFoundHtml = htmlTemplate
        .replace(/<title>.*?<\/title>/i, '<title>Category Not Found | SHRAVIKO</title>')
        .replace('</head>', '  <meta name="robots" content="noindex, follow" />\n</head>');
      return res.send(notFoundHtml);
    }

    const title = catMeta.title;
    const description = catMeta.description;
    const canonicalUrl = `${SITE_URL}/category/${catId}`;

    let dynamicHtml = htmlTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.send(dynamicHtml);
  }

  // Default SPA shell
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  return res.sendFile(baseIndexPath);
}

module.exports = { handleSeoRequest };
