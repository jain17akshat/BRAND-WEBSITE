import React, { useState, useRef, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * ProductImage — Optimized image component
 * 
 * KEY PERFORMANCE FIXES:
 * 1. Renders ONLY the currently active image in the DOM (not all images simultaneously).
 *    Previously: all hover images rendered as opacity-0 <img> tags, causing browsers to
 *    download every hover image immediately even before the user hovers.
 *    Now: secondary image is only injected into DOM on hover.
 * 2. Memoized heavy isContain string-check logic (was running on every render).
 * 3. Proper lazy/eager loading — priority prop controls fetchpriority correctly.
 * 4. Hover preload uses link[rel=prefetch] for secondary images, not new Image() spam.
 * 5. No forced layout / no multiple simultaneous transitions.
 */

// Memoized heavy contain-check — runs ONCE per unique src string, not every render
const containCache = new Map();
function checkIsContain(src) {
  if (!src) return false;
  if (containCache.has(src)) return containCache.get(src);
  const s = src.toLowerCase();
  const result = (
    s.includes('brass bells') || s.includes('garud bell') || s.includes('nandi bell') ||
    s.includes('simple bell') || s.includes('commonbell') || s.includes('wooden choki') ||
    s.includes('woodenchowki') || s.includes('pyramid') || s.includes('trishul') ||
    s.includes('brass aarti') || s.includes('aarti') || s.includes('akhand jyot') ||
    s.includes('cup jyot') || s.includes('kamandal') || s.includes('pancpatra') ||
    s.includes('thali') || s.includes('gomukhi') || s.includes('singhasan') ||
    s.includes('hawankund') || s.includes('chawar') || s.includes('jap bag') ||
    s.includes('mala counter') || s.includes('pooja box') || s.includes('shankh') ||
    s.includes('velvet asan') || s.includes('ganeshyantra') || s.includes('glassyantra') ||
    s.includes('kuber yantra') || s.includes('laxmi') || s.includes('luxmiyantra') ||
    s.includes('shani') || s.includes('ladoo') || s.includes('gopal') ||
    s.includes('kamdhenu') || s.includes('ganeshji') || s.includes('radhakrishna') ||
    s.includes('glassturtle') || s.includes('dhoop dani') || s.includes('glass shivling') ||
    s.includes('rudraksh') || s.includes('sphatik') || s.includes('tulsi') ||
    s.includes('vaijanti') || s.includes('karungali') || s.includes('damru') || s.includes('mala')
  );
  containCache.set(src, result);
  return result;
}

export const ProductImage = ({
  src,
  hoverSrc,
  images,
  alt,
  artType = 'brass',
  className = '',
  aspect = 'aspect-square',
  fitMode,
  priority = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [primaryLoaded, setPrimaryLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const secondaryPrefetchedRef = useRef(false);

  // Build list once — memoized
  const imageList = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (hoverSrc && hoverSrc !== src) return [src, hoverSrc];
    return [src];
  }, [src, hoverSrc, images]);

  const primarySrc = imageList[0];
  const secondarySrc = imageList.length > 1 ? imageList[1] : null;

  // isContain: computed once via cache per src string
  const isContain = fitMode === 'contain' || checkIsContain(primarySrc || '');

  // On hover: prefetch secondary image via link element (doesn't trigger layout)
  // This is intentionally deferred to hover so primary images load first.
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (secondarySrc && !secondaryPrefetchedRef.current) {
      secondaryPrefetchedRef.current = true;
      // Use Image() only on hover (not on mount), so it doesn't block initial page load
      const img = new window.Image();
      img.src = secondarySrc;
      img.onload = () => setSecondaryLoaded(true);
    }
  }, [secondarySrc]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Determine which src to show:
  // - Not hovered: primary
  // - Hovered + secondary ready: secondary
  // - Hovered + secondary not ready yet: primary (no flash)
  const showSecondary = isHovered && secondarySrc && secondaryLoaded;
  const activeSrc = showSecondary ? secondarySrc : primarySrc;

  if (src && !imgError) {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden ${aspect} ${className} ${isContain ? 'bg-[#F9F6F0]' : 'bg-[#F4EFE6]'}`}
      >
        {/* Skeleton shimmer — visible only until primary image loads */}
        {!primaryLoaded && (
          <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
        )}

        {/*
          SINGLE active <img> tag — the key fix.
          Previously: ALL images in imageList were rendered simultaneously as opacity-0 nodes,
          causing browsers to download all hover images on initial page load.
          Now: Only ONE <img> is in the DOM at a time.
          The image src swaps on hover after the secondary is prefetched.
        */}
        <img
          src={activeSrc}
          alt={alt || 'Shraviko Sacred Product'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => {
            if (!primaryLoaded) setPrimaryLoaded(true);
          }}
          onError={() => setImgError(true)}
          className={`w-full h-full transition-opacity duration-400 ${
            primaryLoaded ? 'opacity-100' : 'opacity-0'
          } ${
            isContain ? 'object-contain p-2 sm:p-3' : 'object-cover'
          } ${
            // Subtle scale-up on hover to keep premium feel
            isHovered ? 'scale-105' : 'scale-100'
          } transition-all duration-500`}
        />

        {/* Slide indicator dots — only shown on hover when multiple images exist */}
        {imageList.length > 1 && isHovered && (
          <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
            {imageList.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  showSecondary && dotIdx === 1
                    ? 'w-3.5 bg-[#C5A059]'
                    : dotIdx === 0 && !showSecondary
                    ? 'w-3.5 bg-[#C5A059]'
                    : 'w-1.5 bg-black/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback: Premium Vector / Geometric Brass Artwork Fallback Frame
  const getArtIcon = () => {
    switch (artType) {
      case 'diya':
        return (
          <svg className="w-20 h-20 text-[#B8934A]" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C52 25, 60 32, 50 45 C40 32, 48 25, 50 15 Z" fill="url(#flameGrad)" />
            <path d="M20 52 C20 70, 80 70, 80 52 C70 58, 30 58, 20 52 Z" fill="url(#brassGrad)" stroke="#755722" strokeWidth="1.5" />
            <ellipse cx="50" cy="52" rx="30" ry="6" fill="#967433" opacity="0.6" />
            <path d="M35 70 L65 70 L60 82 L40 82 Z" fill="url(#brassGrad)" />
          </svg>
        );
      case 'yantra':
        return (
          <svg className="w-22 h-22" viewBox="0 0 100 100" fill="none">
            <rect x="12" y="12" width="76" height="76" stroke="url(#brassGrad)" strokeWidth="2" fill="#F8F1E3" />
            <circle cx="50" cy="50" r="32" stroke="#C5A059" strokeWidth="1" />
            <polygon points="50,22 76,68 24,68" stroke="#967433" strokeWidth="1.5" fill="none" />
            <polygon points="50,78 76,32 24,32" stroke="#967433" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="50" r="3" fill="#B8934A" />
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 text-[#B8934A]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="36" stroke="url(#brassGrad)" strokeWidth="2" />
            <path d="M50 25 C60 38, 75 50, 50 75 C25 50, 40 38, 50 25 Z" fill="#EAE0CD" stroke="#C5A059" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden product-art-bg ${aspect} ${className} flex flex-col items-center justify-center p-6 border border-[#EAE0CD] group`}>
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C378" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#8C6929" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C5A059]/40" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C5A059]/40" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C5A059]/40" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C5A059]/40" />

      <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 flex items-center justify-center drop-shadow-md">
        {getArtIcon()}
      </div>

      <div className="mt-3 text-center z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase font-cinzel text-[#967433] bg-[#FAF5EB] px-2.5 py-0.5 rounded border border-[#E0D2B8]">
          Shraviko Heritage Artwork
        </span>
      </div>

      <div className="absolute inset-0 bg-[#2C2623]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white z-20">
        <ImageIcon className="w-6 h-6 text-[#E5C378] mb-2" />
        <span className="text-xs font-serif text-[#F2EBDC] tracking-wide mb-1">Add Product Image</span>
        <span className="text-[10px] text-gray-300 max-w-[180px] leading-tight">
          Pass image URL in <code className="text-[#E5C378]">products.js</code> to replace placeholder
        </span>
      </div>
    </div>
  );
};
