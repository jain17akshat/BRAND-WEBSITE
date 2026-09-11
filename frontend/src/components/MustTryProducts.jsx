import React, { useState, useRef, useCallback } from 'react';
import { Star, ShoppingBag, Eye, Heart, Sparkles, Flame, Check } from 'lucide-react';

export const MustTryProducts = ({
  products = [],
  onAddToCart,
  onSelectProduct,
  onOpenQuickView,
  onToggleWishlist,
  wishlistIds = []
}) => {
  // Select top products to showcase in the Must-Try slider
  const itemsToDisplay = React.useMemo(() => {
    if (products && products.length > 0) {
      // Pick products with highest ratings or specific tags
      const filtered = products.filter(
        (p) => p.rating >= 4.8 || p.tag || p.isBestseller || p.category === 'brass' || p.category === 'copper'
      );
      return filtered.length >= 6 ? filtered.slice(0, 10) : products.slice(0, 10);
    }
    return [];
  }, [products]);

  if (!itemsToDisplay || itemsToDisplay.length === 0) return null;

  // Duplicate items twice to create seamless continuous marquee loop
  const marqueeItems = [...itemsToDisplay, ...itemsToDisplay];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF6EE] via-[#F4EFE6] to-[#FAF6EE] overflow-hidden border-b border-[#EAE0CD] relative select-none">
      
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0D9] border border-[#E0CEAA] mb-3">
          <Flame className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
          <span className="text-[11px] font-cinzel font-bold text-[#755722] uppercase tracking-[0.2em]">
            Handpicked Devotional Treasures
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
        </div>

        <h2 className="font-cinzel font-bold text-2xl sm:text-4xl text-[#2C1F06] tracking-wide uppercase drop-shadow-xs">
          Must-Try Sacred Products
        </h2>

        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C5A059]" />
          <span className="text-[#C5A059] text-xs font-serif italic">Pure Vedic Quality</span>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C5A059]" />
        </div>
      </div>

      {/* Infinite Right-to-Left Sliding Marquee Track */}
      <div className="relative w-full overflow-hidden py-2">
        
        {/* Left & Right Gradient Shadows for Seamless Fade Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF6EE] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF6EE] to-transparent z-20 pointer-events-none" />

        {/* Sliding Flex Container */}
        <div className="animate-marquee-rtl flex items-center gap-4 sm:gap-6 px-4 hover:[animation-play-state:paused] transition-all">
          {marqueeItems.map((product, idx) => (
            <MustTryCard
              key={`${product.id}-${idx}`}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
              onOpenQuickView={onOpenQuickView}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual Product Card inside Marquee
const MustTryCard = ({
  product,
  isWishlisted,
  onAddToCart,
  onSelectProduct,
  onOpenQuickView,
  onToggleWishlist
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const cardImages = React.useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    return [product.image || '/assets/Incense cover.webp'];
  }, [product]);

  const primarySrc = cardImages[0];
  const secondarySrc = cardImages.length > 1 ? cardImages[1] : null;
  const [primaryLoaded, setPrimaryLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const secondaryPrefetchedRef = useRef(false);

  // Determine active image — only show secondary when hover+loaded
  const showSecondary = isHovered && secondarySrc && secondaryLoaded;
  const activeSrc = showSecondary ? secondarySrc : primarySrc;

  const handleHoverEnter = useCallback(() => {
    setIsHovered(true);
    // Prefetch secondary image only on hover (not on initial render)
    if (secondarySrc && !secondaryPrefetchedRef.current) {
      secondaryPrefetchedRef.current = true;
      const img = new window.Image();
      img.src = secondarySrc;
      img.onload = () => setSecondaryLoaded(true);
    }
  }, [secondarySrc]);

  const handleHoverLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 1500);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onClick={() => (onSelectProduct ? onSelectProduct(product) : onOpenQuickView && onOpenQuickView(product))}
      className="w-[240px] sm:w-[280px] flex-shrink-0 bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
    >
      {/* Product Image Area — SINGLE active image in DOM */}
      <div className="relative aspect-square overflow-hidden bg-[#F9F6F0]">
        {!primaryLoaded && <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />}

        {/* Single <img> — src swaps on hover after secondary is prefetched */}
        <img
          src={activeSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => { if (!primaryLoaded) setPrimaryLoaded(true); }}
          onError={(e) => {
            if (e.target.src !== '/assets/Incense cover.webp') {
              e.target.src = '/assets/Incense cover.webp';
            }
          }}
          className={`w-full h-full object-contain p-4 transition-all duration-500 ${
            primaryLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* MUST TRY Badge */}
        <span className="absolute top-2.5 left-2.5 z-20 bg-[#2C1F06] text-[#E5C378] text-[9px] font-cinzel font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#C5A059]/40 shadow-sm">
          MUST TRY
        </span>


        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(product);
          }}
          className={`absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
            isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-[#3D2B1F] hover:bg-white hover:text-[#B8860B]'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5 bg-white">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
            <span className="uppercase font-cinzel font-bold text-[#9C7830] tracking-wider truncate">
              {product.category || 'Sacred Item'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-cinzel font-semibold text-xs sm:text-sm text-[#2C1F06] line-clamp-2 leading-snug group-hover:text-[#B8860B] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#2C1F06]">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-stone-400 line-through ml-1.5 font-sans">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-cinzel font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 active:scale-95 ${
              addedToast
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FAF5EB] text-[#755722] hover:bg-[#C5A059] hover:text-white border border-[#E0CEAA]'
            }`}
          >
            {addedToast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
