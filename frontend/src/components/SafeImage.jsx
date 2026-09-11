import React, { useState } from 'react';

/**
 * SafeImage — Universal Image Component with Premium Skeleton Shimmer Loading State
 * 
 * Guarantees:
 * 1. ZERO black flash or black placeholders during loading
 * 2. Instant skeleton shimmer placeholder with exact aspect ratio
 * 3. Smooth, layout-stable transition when image finishes decoding
 * 4. Automatic fallback handling on network error
 * 5. Native lazy loading & responsive fetch priority support
 * 6. Reduced motion compliance
 */
export const SafeImage = ({
  src,
  alt = 'Shraviko Luxury Asset',
  className = '',
  containerClassName = '',
  aspect = '',
  objectFit = 'object-cover',
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
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'low'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        srcSet={srcSet}
        style={style}
        className={`w-full h-full ${objectFit} transition-opacity duration-400 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default SafeImage;
