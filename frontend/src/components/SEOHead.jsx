import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://shraviko.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/Logo/LOGO.png`;
const SITE_NAME = 'SHRAVIKO';

/**
 * SEOHead — Reusable component for dynamic per-page meta tags.
 *
 * Props:
 *   title        — Page title (rendered as <title>)
 *   description  — Meta description
 *   canonicalPath — Path relative to root, e.g. "/product/brass-bell-garuda"
 *   ogImage      — Absolute URL for og:image (defaults to LOGO)
 *   ogType       — og:type value (defaults to "website")
 */
export const SEOHead = ({
  title = `${SITE_NAME} — Premium Indian Pooja Essentials`,
  description = 'Elevate daily rituals with Shraviko. Pure brassware, heavy copper vessels, organic temple flower incense, handcrafted pooja thalis, and sacred yantras.',
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}) => {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  // Ensure ogImage is always absolute
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </Helmet>
  );
};
