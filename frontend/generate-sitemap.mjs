/**
 * generate-sitemap.mjs
 * 
 * Generates sitemap.xml from products.js data at build time.
 * Run via: node generate-sitemap.mjs
 * Automatically runs before `vite build` via the "prebuild" npm script.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://shraviko.com';

// Read and extract product/category data from products.js
// We parse it manually since it uses `export const` syntax
const productsFile = readFileSync(resolve(__dirname, 'src/data/products.js'), 'utf-8');

// Extract product IDs
const productIdRegex = /id:\s*'([^']+)'/g;
const productIds = [];
let match;
while ((match = productIdRegex.exec(productsFile)) !== null) {
  // Skip IDs from TESTIMONIALS or non-product sections (numeric IDs)
  if (!/^\d+$/.test(match[1])) {
    productIds.push(match[1]);
  }
}
// Deduplicate (some IDs may appear in references)
const uniqueProductIds = [...new Set(productIds)];

// Extract category IDs
const categoryIdRegex = /{\s*id:\s*'([^']+)',\s*name:/g;
const categoryIds = [];
while ((match = categoryIdRegex.exec(productsFile)) !== null) {
  if (match[1] !== 'all') {
    categoryIds.push(match[1]);
  }
}
const uniqueCategoryIds = [...new Set(categoryIds)];

// Static pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/all-collections', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/gifting', priority: '0.7', changefreq: 'weekly' },
  { path: '/energy-stones', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
];

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static pages
for (const page of staticPages) {
  xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Category pages
for (const catId of uniqueCategoryIds) {
  xml += `  <url>
    <loc>${SITE_URL}/category/${catId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Product pages
for (const prodId of uniqueProductIds) {
  xml += `  <url>
    <loc>${SITE_URL}/product/${prodId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>
`;

const outputPath = resolve(__dirname, 'public/sitemap.xml');
writeFileSync(outputPath, xml, 'utf-8');

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   → ${staticPages.length} static pages`);
console.log(`   → ${uniqueCategoryIds.length} category pages`);
console.log(`   → ${uniqueProductIds.length} product pages`);
console.log(`   → ${staticPages.length + uniqueCategoryIds.length + uniqueProductIds.length} total URLs`);
