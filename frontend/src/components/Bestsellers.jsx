import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const Bestsellers = ({
  products = [],
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  onSelectProduct,
  onSelectCategory,
  heading = 'Most Loved Sacred Pieces',
  subheading = 'Artisanal brassware, resonant bells and pure ritual vessels cherished across India.',
  limit = 4,
  filterFn = null,
}) => {
  // Apply optional filter, then take `limit` items
  const displayProducts = (filterFn ? products.filter(filterFn) : products).slice(0, limit);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-[#EAE2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="text-[11px] sm:text-xs font-manrope font-semibold tracking-[0.18em] text-[#8C7D75] uppercase mb-1.5">
              Customer Favorites
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fraunces font-semibold text-[#2A221E] leading-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-2 text-sm text-[#685951] font-manrope max-w-2xl">{subheading}</p>
            )}
          </div>
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('all-collections')}
              className="link-action text-sm self-start sm:self-auto cursor-pointer"
            >
              <span>Explore all</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Grid — 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              onOpenQuickView={onOpenQuickView}
              priority={idx < 4}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
