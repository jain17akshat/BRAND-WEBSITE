import React from 'react';

/**
 * JsonLd — Renders a JSON-LD structured data script tag.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", ... }} />
 *
 * Accepts a single object or an array of objects (renders as @graph).
 */
export const JsonLd = ({ data }) => {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
