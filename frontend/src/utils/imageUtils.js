/**
 * imageUtils.js — Utilities for generating responsive WebP & fallback image sources.
 */

export function getResponsiveImageSources(src) {
  if (!src || typeof src !== 'string') {
    return { webpSrc: '', webpSrcSet: '', fallbackSrc: src || '', isResponsive: false };
  }

  // Skip external URLs, data URLs, SVGs, or videos
  if (src.startsWith('http') || src.startsWith('data:') || src.endsWith('.svg') || src.endsWith('.mp4') || src.endsWith('.gif')) {
    return { webpSrc: src, webpSrcSet: '', fallbackSrc: src, isResponsive: false };
  }

  // Strip extension
  const lastDotIdx = src.lastIndexOf('.');
  if (lastDotIdx === -1) {
    return { webpSrc: src, webpSrcSet: '', fallbackSrc: src, isResponsive: false };
  }

  const basePath = src.substring(0, lastDotIdx);
  // Strip variant suffix if src already passed with -400w etc.
  const cleanBasePath = basePath.replace(/-(400w|800w|1200w)$/, '');
  const ext = src.substring(lastDotIdx).toLowerCase();

  const webpSrc = `${cleanBasePath}.webp`;
  const webpSrcSet = `${cleanBasePath}-400w.webp 400w, ${cleanBasePath}-800w.webp 800w, ${cleanBasePath}-1200w.webp 1200w`;
  
  // Fallback to original image or PNG
  const fallbackSrc = ext === '.webp' ? `${cleanBasePath}.png` : src;

  return {
    webpSrc,
    webpSrcSet,
    fallbackSrc,
    isResponsive: true
  };
}
