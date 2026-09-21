import React, { useState, useRef, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getResponsiveImageSources } from '../utils/imageUtils';

/**
 * ProductImage — Optimized image component
 * 
 * KEY PERFORMANCE FIXES:
 * 1. Renders ONLY the currently active image in the DOM using responsive <picture> with WebP srcset.
 * 2. Automatic resolution variant serving (-400w, -800w, -1200w).
 * 3. Memoized heavy isContain string-check logic.
 * 4. Proper lazy/eager loading — priority prop controls fetchpriority & loading attributes.
 */

export const ProductImage = ({
  src,
  hoverSrc,
  images,
  alt,
  artType = 'brass',
  className = '',
  aspect = 'aspect-square',
  fitMode = 'cover',
  priority = false,
  sizes
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

  const isCover = fitMode !== 'contain';

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (secondarySrc && !secondaryPrefetchedRef.current) {
      secondaryPrefetchedRef.current = true;
      const img = new window.Image();
      const sources = getResponsiveImageSources(secondarySrc);
      img.src = sources.webpSrc || secondarySrc;
      img.onload = () => setSecondaryLoaded(true);
    }
  }, [secondarySrc]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const showSecondary = isHovered && secondarySrc && secondaryLoaded;
  const activeSrc = showSecondary ? secondarySrc : primarySrc;
  const responsiveSources = React.useMemo(() => getResponsiveImageSources(activeSrc), [activeSrc]);

  if (src && !imgError) {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`product-card-image-wrapper ${aspect} ${className} bg-[#F9F6F0]`}
      >
        {/* Skeleton shimmer — visible only until primary image loads */}
        {!primaryLoaded && (
          <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
        )}

        <picture className="w-full h-full block flex items-center justify-center">
          {responsiveSources.webpSrc && (
            <source
              type="image/webp"
              srcSet={responsiveSources.webpSrcSet || responsiveSources.webpSrc}
              sizes={responsiveSources.webpSrcSet ? (sizes || "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px") : undefined}
            />
          )}
          <img
            src={responsiveSources.fallbackSrc || activeSrc}
            alt={alt || 'Shraviko Sacred Product'}
            width={400}
            height={400}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchpriority={priority ? 'high' : undefined}
            onLoad={() => {
              if (!primaryLoaded) setPrimaryLoaded(true);
            }}
            onError={() => setImgError(true)}
            className={`product-card-image ${
              isCover ? 'object-cover' : 'object-contain p-2 sm:p-3'
            } transition-opacity duration-400 ${
              priority || primaryLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              isHovered ? 'scale-105' : 'scale-100'
            } transition-all duration-500`}
          />
        </picture>


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
