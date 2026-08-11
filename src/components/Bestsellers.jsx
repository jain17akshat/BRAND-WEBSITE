import React from 'react';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { ProductImage } from './ProductImage';

export const Bestsellers = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  onSelectProduct,
  heading = 'Most Loved',
  subheading = null,
  limit = 4,
  filterFn = null,
}) => {
  // Apply optional filter, then take `limit` items
  const displayProducts = (filterFn ? products.filter(filterFn) : products)
    .slice(0, limit);

  const handleCardClick = (product) => {
    if (onSelectProduct) onSelectProduct(product);
    else if (onOpenQuickView) onOpenQuickView(product);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-2">Our Selection</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#2C2623] tracking-wide">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-2 text-sm text-[#6B5840] font-light">{subheading}</p>
          )}
        </div>

        {/* Product Grid — 4-col desktop, 2-col tablet, horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 sm:gap-6 scrollbar-none">
          {displayProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group flex-none w-[72vw] sm:w-auto snap-start rounded-xl overflow-hidden bg-[#FDFAF7] border border-[#EAE0CD] hover:border-[#C5A059]/60 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(product)}
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    artType={product.artType}
                    fitMode={product.fitMode}
                    aspect="aspect-square"
                  />

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#2C2623] hover:text-[#A63A2B] flex items-center justify-center transition-colors shadow-sm"
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#A63A2B] text-[#A63A2B]' : ''}`} />
                  </button>

                  {/* Quick view on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); if (onOpenQuickView) onOpenQuickView(product); }}
                      className="px-3 py-1.5 bg-white text-[#2C2623] text-[10px] font-cinzel uppercase tracking-wider rounded hover:bg-[#FAF0D9] transition-colors flex items-center gap-1.5 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-[#D97706] text-[#D97706]' : 'text-gray-200 fill-gray-200'}`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">({product.reviewsCount})</span>
                    </div>

                    {/* Name */}
                    <h3
                      onClick={() => handleCardClick(product)}
                      className="font-cinzel text-xs sm:text-sm font-semibold text-[#2C2623] hover:text-[#9B7E52] transition-colors line-clamp-2 cursor-pointer leading-snug mb-3"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Price + Add to Cart */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F0E8DC]">
                    <div>
                      <span className="text-sm font-cinzel font-bold text-[#2C2623]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through ml-1.5">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-2 rounded-lg bg-[#2C1F06] text-[#E5C378] hover:bg-[#3D2B0A] transition-all active:scale-95 shadow-sm"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
