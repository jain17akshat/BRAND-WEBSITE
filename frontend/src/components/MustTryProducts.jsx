import React, { useState, useRef, useCallback } from 'react';
import { Star, ShoppingBag, Eye, Heart, Sparkles, Flame, Check } from 'lucide-react';
import { ProductImage } from './ProductImage';

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
    <section className="py-12 sm:py-16 bg-[#F8F3E6]/60 overflow-hidden border-b border-[#EAE0CD]/80 relative select-none">
      
      {/* Background Subtle Pastel Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FBEAE5]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#EBF2EB]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE0CD] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#57324F]" />
          <span className="text-[11px] font-manrope font-semibold text-[#57324F] uppercase tracking-[0.18em]">
            Curated Artisanal Treasures
          </span>
        </div>

        <h2 className="font-fraunces font-medium text-2xl sm:text-4xl text-[#2C221E] tracking-tight">
          Must-Try Sacred Pieces
        </h2>

        <p className="mt-2 text-sm text-[#6B5E57] font-manrope max-w-md mx-auto">
          Handcrafted brassware and pure temple fragrances loved across homes.
        </p>
      </div>

      {/* Fluid Horizontal Scroll Track with Snapping */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none">
          {itemsToDisplay.map((product) => (
            <div key={product.id} className="snap-start shrink-0">
              <MustTryCard
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
                onOpenQuickView={onOpenQuickView}
                onToggleWishlist={onToggleWishlist}
              />
            </div>
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
    return [product.image || '/assets/Incense cover.jpg'];
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
      onClick={() => (onSelectProduct ? onSelectProduct(product) : onOpenQuickView && onOpenQuickView(product))}
      className="w-[250px] sm:w-[280px] flex-shrink-0 bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#57324F]/30 transition-all duration-250 group cursor-pointer flex flex-col justify-between h-full"
    >
      {/* Product Image Area */}
      <div className={`product-card-image-wrapper aspect-square overflow-hidden rounded-t-[17px] relative ${
        product.imageBackground === 'white'
          ? 'bg-white'
          : product.imageBackground === 'transparent'
          ? 'bg-[#FAF6EC]'
          : 'bg-[#FAF7F2]'
      }`}>
        <ProductImage
          src={product.image}
          images={product.images}
          alt={product.name}
          artType={product.artType}
          fitMode={product.fitMode || 'contain'}
          aspect="aspect-square"
          sizes="280px"
          imageBackground={product.imageBackground}
          silhouetteShadow={product.imageBackground === 'transparent'}
          className="transition-transform duration-300 ease-out group-hover:scale-103"
        />

        {/* MUST TRY Badge */}
        <span className="absolute top-3 left-3 z-20 bg-[#FAF7F2] text-[#57324F] text-[10px] font-manrope font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#57324F]/20 shadow-xs">
          Must-Try
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
            isWishlisted
              ? 'bg-[#57324F] text-white'
              : 'bg-white/90 text-[#4A3E39] hover:bg-[#FBEAE5] hover:text-[#57324F]'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category */}
          <p className="text-[10px] font-manrope font-semibold text-[#8C7A70] uppercase tracking-wider mb-1 min-h-[16px] flex items-center truncate">
            {product.categoryName || product.category || 'Sacred Collection'}
          </p>

          {/* Product Name */}
          <h3 className="font-manrope font-medium text-xs sm:text-sm text-[#2C221E] line-clamp-2 leading-snug group-hover:text-[#57324F] transition-colors min-h-[2.25rem] sm:min-h-[2.5rem] flex items-start">
            {product.name}
          </h3>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="pt-2.5 border-t border-[#F4EFE6] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-sm font-manrope font-bold text-[#2C221E]">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-[#8C7A70] line-through ml-1.5 font-manrope font-normal">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label={addedToast ? `Added ${product.name} to cart` : `Add ${product.name} to cart`}
            className={`min-w-[76px] h-9 px-3 rounded-[12px] text-xs font-manrope font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              addedToast
                ? 'bg-emerald-700 text-white'
                : 'bg-[#57324F] text-white hover:bg-[#42253C] shadow-xs'
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
