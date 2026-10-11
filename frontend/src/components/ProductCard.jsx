import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { ProductImage } from './ProductImage';

/**
 * ProductCard — Boutique, consistent product card for SHRAVIKO.
 * 
 * Supports three distinct image treatments based on explicit `imageBackground` field:
 *  1. 'photo' (Default): Coloured or lifestyle backgrounds. Softly rounded neutral ivory image area,
 *     preserves complete photo naturally, depth on outer card, no artificial drop shadow on product.
 *  2. 'white': Pure white background photos. Pure white image area, seamless edge blending,
 *     preserves photo's natural lighting/shadows, avoids contrasting inset frame.
 *  3. 'transparent': Cutout products. Rested on soft pastel canvas (blush, sage, lavender, apricot, champagne)
 *     with restrained silhouette shadow for dimensional appearance.
 * 
 * Consistent Card Specs:
 *  - Approximately 18px rounded corners (rounded-[18px])
 *  - Subtle border (border-[#EAE2D7]) and soft outer shadow
 *  - Desktop hover lift (-translate-y-1.5) with gentle unclipped image zoom (scale-[1.04])
 *  - Object-contain by default to guarantee full product visibility
 *  - Stable Manrope typography, prices and deep-plum #57324F action buttons
 */
export const ProductCard = ({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  wishlistIds = [],
  onOpenQuickView,
  priority = false,
  pastelBg,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  // Active wishlist determination (supports both boolean flag and IDs array)
  const isItemWishlisted = Boolean(isWishlisted || (wishlistIds && wishlistIds.includes(product.id)));

  // Pricing calculations
  const currentPrice = product.weightVariants?.[0]?.price || product.price || 0;
  const originalPrice = product.weightVariants?.[0]?.originalPrice || product.originalPrice;
  const hasVariants = Boolean(product.weightVariants && product.weightVariants.length > 1);
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  // 1. Explicit Image Background Treatment
  // Strictly support 'photo' | 'white' | 'transparent'. Default unclassified to 'photo'.
  // Do NOT guess transparency from file extension.
  const rawTreatment = (product.imageBackground || '').trim().toLowerCase();
  const treatment = (rawTreatment === 'white' || rawTreatment === 'transparent') ? rawTreatment : 'photo';

  // 2. Curated pastel palette for transparent cutouts and surrounding harmonies:
  // Blush, Sage, Lavender, Apricot, Champagne
  const getPastelTheme = () => {
    if (product.pastelColor) return product.pastelColor;
    const cat = (product.category || product.categoryName || '').toLowerCase();
    if (cat.includes('mandir') || cat.includes('kumkum') || cat.includes('pooja')) {
      return { bg: 'bg-[#FDF2F0]', border: 'border-[#F5DDD8]', name: 'blush' };
    }
    if (cat.includes('incense') || cat.includes('dhoop') || cat.includes('herbal')) {
      return { bg: 'bg-[#F0F5EE]', border: 'border-[#DCE8D8]', name: 'sage' };
    }
    if (cat.includes('vastu') || cat.includes('yantra') || cat.includes('spiritual')) {
      return { bg: 'bg-[#F4F1F8]', border: 'border-[#E5DEEE]', name: 'lavender' };
    }
    if (cat.includes('copper')) {
      return { bg: 'bg-[#FDF3EA]', border: 'border-[#F6DFCF]', name: 'apricot' };
    }
    // Brass / metalware / default
    return { bg: 'bg-[#FAF6EC]', border: 'border-[#EFE6D1]', name: 'champagne' };
  };

  const pastel = getPastelTheme();

  // Apply visual treatment styling
  let imageAreaBgClass = 'bg-[#FAF7F2]';
  let imageAreaDividerClass = 'border-b border-[#F2ECE2]';
  let isSilhouette = false;

  if (treatment === 'white') {
    // 2. White-background treatment: pure white canvas, seamless photo edge blend, no contrasting inset frame
    imageAreaBgClass = 'bg-white';
    imageAreaDividerClass = 'border-b border-[#F6F2EB]';
    isSilhouette = false;
  } else if (treatment === 'transparent') {
    // 3. Transparent cutout treatment: soft pastel background with restrained silhouette shadow
    imageAreaBgClass = pastelBg || pastel.bg;
    imageAreaDividerClass = `border-b ${pastel.border}`;
    isSilhouette = true;
  } else {
    // 1. Existing coloured/lifestyle treatment (default): neutral surrounding card colour (#FAF7F2),
    // softly rounded image area, preserves complete photo naturally without false recolouring
    imageAreaBgClass = 'bg-[#FAF7F2]';
    imageAreaDividerClass = 'border-b border-[#F2ECE2]';
    isSilhouette = false;
  }

  // Preserve complete product visibility: contain by default, allow cover only if explicitly approved
  const fitMode = product.fitMode === 'cover' ? 'cover' : 'contain';

  const handleClickCard = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onOpenQuickView) {
      onOpenQuickView(product);
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={handleClickCard}
      className="group relative bg-white rounded-[18px] border border-[#EAE2D7] overflow-hidden shadow-[0_4px_16px_rgba(42,34,30,0.04)] hover:shadow-[0_14px_32px_rgba(42,34,30,0.09)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between h-full cursor-pointer"
    >
      {/* 1. Image Canvas (Consistent proportions, 18px top corner conformity, specific image treatment) */}
      <div className={`relative aspect-square overflow-hidden rounded-t-[17px] ${imageAreaBgClass} ${imageAreaDividerClass}`}>
        <ProductImage
          src={product.image}
          images={product.images}
          alt={product.name}
          artType={product.artType}
          fitMode={fitMode}
          aspect="aspect-square"
          priority={priority}
          imageBackground={treatment}
          silhouetteShadow={isSilhouette}
          className="w-full h-full p-3.5 sm:p-5 transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />

        {/* Wishlist Button (Accessible, high-contrast, backdrop blur) */}
        <button
          onClick={handleWishlist}
          type="button"
          aria-label={isItemWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-xs ${
            isItemWishlisted
              ? 'bg-[#57324F] text-white scale-105'
              : 'bg-white/90 hover:bg-white text-[#2A221E] hover:text-[#57324F]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isItemWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Genuine Badges: Coming Soon / Discount / Authentic tag */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.isComingSoon ? (
            <span className="bg-[#57324F] text-white text-[9px] sm:text-[10px] font-manrope font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Coming Soon
            </span>
          ) : discountPercent && discountPercent >= 10 ? (
            <span className="bg-[#FAF7F2] text-[#57324F] border border-[#57324F]/30 text-[9px] sm:text-[10px] font-manrope font-bold px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : product.tag ? (
            <span className="bg-white/90 text-[#685951] text-[9px] sm:text-[10px] font-manrope font-medium px-2 py-0.5 rounded-md border border-[#EAE2D7]/80">
              {product.tag}
            </span>
          ) : null}
        </div>
      </div>

      {/* 2. Content & Shopping Hierarchy (Stable layout preventing layout shift on hover) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Spaced Uppercase Collection Category */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-manrope font-semibold uppercase tracking-[0.16em] text-[#8C7D75] truncate">
              {product.categoryName || 'Sacred Living'}
            </span>
            {product.rating && (
              <span className="inline-flex items-center gap-1 text-[11px] font-manrope font-semibold text-[#2A221E] shrink-0">
                <Star className="w-3 h-3 text-[#C29A5B] fill-current" />
                <span>{product.rating}</span>
              </span>
            )}
          </div>

          {/* Product Title in Manrope Semibold */}
          <h3 className="font-manrope font-semibold text-xs sm:text-[14px] text-[#2A221E] group-hover:text-[#57324F] transition-colors line-clamp-2 leading-snug min-h-[2.25rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>

        {/* Price & Shopping Controls */}
        <div className="pt-2.5 mt-2 border-t border-[#F2ECE2] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {hasVariants && (
              <span className="text-[10px] font-manrope text-[#8C7D75] font-medium lowercase">
                from
              </span>
            )}
            <span className="text-sm sm:text-base font-manrope font-bold text-[#2A221E]">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xs font-manrope text-[#8C7D75] line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Shopping Action Buttons */}
          {!product.isComingSoon ? (
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`flex-1 sm:flex-none h-9 px-3.5 rounded-xl font-manrope text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white shadow-xs'
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>

              {onOpenQuickView && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickView(product);
                  }}
                  className="w-9 h-9 rounded-xl border border-[#EAE2D7] hover:border-[#57324F] bg-white text-[#2A221E] hover:text-[#57324F] inline-flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={`Quick view ${product.name}`}
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <span className="text-[11px] font-manrope font-semibold text-[#8C7D75]">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
