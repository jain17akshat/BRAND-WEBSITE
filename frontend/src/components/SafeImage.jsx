import React, { useState } from 'react';
import { getResponsiveImageSources } from '../utils/imageUtils';

/**
 * SafeImage — Universal Image Component with Premium Skeleton Shimmer Loading State
 * 
 * Guarantees:
 * 1. ZERO black flash or black placeholders during loading
 * 2. Instant skeleton shimmer placeholder with exact aspect ratio
 * 3. Smooth, layout-stable transition when image finishes decoding
 * 4. Automatic fallback handling on network error
 * 5. Native lazy loading & responsive fetch priority support
 * 6. Responsive WebP srcset resolution (-400w, -800w, -1200w)
 */
export const SafeImage = ({
  src,
  alt = 'Shraviko Luxury Asset',
  className = '',
  containerClassName = '',
  aspect = '',
  objectFit = 'object-contain',
  priority = false,
  fallbackSrc = '/assets/Logo/LOGO.png',
  dark = false,
  onLoad,
  onError,
  style,
  sizes,
  srcSet,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  const finalSrc = hasError ? (fallbackSrc || '/assets/Logo/LOGO.png') : src;
  const bgPlaceholderClass = dark ? 'bg-[#1E1A18]' : 'bg-[#F4EFE6]';

  const responsiveSources = React.useMemo(() => {
    if (hasError) return { isResponsive: false };
    return getResponsiveImageSources(finalSrc);
  }, [finalSrc, hasError]);

  return (
    <div
      className={`relative overflow-hidden ${aspect} ${bgPlaceholderClass} ${containerClassName}`}
    >
      {/* ── Skeleton Shimmer Overlay (Active until image decodes) ── */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 z-10 pointer-events-none ${
            dark ? 'skeleton-shimmer-dark' : 'skeleton-shimmer'
          }`}
          aria-hidden="true"
        />
      )}

      {/* ── Main Image ── */}
      <picture className="w-full h-full block">
        {responsiveSources.webpSrc && (
          <source
            type="image/webp"
            srcSet={srcSet || responsiveSources.webpSrcSet || responsiveSources.webpSrc}
            sizes={responsiveSources.webpSrcSet ? (sizes || "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px") : undefined}
          />
        )}
        <img
          src={responsiveSources.fallbackSrc || finalSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={priority ? 'high' : 'low'}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          style={style}
          className={`w-full h-full ${objectFit} transition-opacity duration-400 ease-out ${
            priority || isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      </picture>
    </div>
  );
};


export default SafeImage;
