import React from 'react';

/**
 * Base Skeleton Block with Shimmer Effect
 */
export const Skeleton = ({
  className = '',
  width,
  height,
  borderRadius = 'rounded-md',
  dark = false
}) => {
  return (
    <div
      className={`${dark ? 'skeleton-shimmer-dark' : 'skeleton-shimmer'} ${borderRadius} ${className}`}
      style={{
        width: width !== undefined ? width : '100%',
        height: height !== undefined ? height : '100%',
      }}
    />
  );
};

/**
 * Product Card Skeleton (Image + Details + Action button)
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-[#EAE0CD] p-3 sm:p-4 flex flex-col justify-between shadow-xs">
      <div>
        {/* Aspect Square Image Placeholder */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3">
          <Skeleton className="w-full h-full" borderRadius="rounded-lg" />
        </div>

        {/* Category / Subtitle Badge */}
        <Skeleton height={12} width="40%" className="mb-2" />

        {/* Product Title Skeleton (2 lines) */}
        <Skeleton height={16} width="85%" className="mb-1.5" />
        <Skeleton height={14} width="60%" className="mb-3" />
      </div>

      <div>
        {/* Price & Discount Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton height={18} width="35%" />
          <Skeleton height={14} width="25%" />
        </div>

        {/* Add to Cart Button Skeleton */}
        <Skeleton height={38} borderRadius="rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Category Page Grid Skeleton (8 Product Cards Grid)
 */
export const CategoryPageSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Product Detail Page Skeleton (Large image gallery + info panel)
 */
export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Large Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="w-full h-full" borderRadius="rounded-2xl" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full" borderRadius="rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info Panel Skeleton */}
        <div className="space-y-5">
          <Skeleton height={14} width="30%" />
          <Skeleton height={32} width="80%" />
          <Skeleton height={20} width="40%" />

          <div className="py-4 border-y border-[#EAE0CD] space-y-2">
            <Skeleton height={16} width="95%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="75%" />
          </div>

          <div className="flex gap-4 items-center pt-2">
            <Skeleton height={48} width={120} borderRadius="rounded-lg" />
            <Skeleton height={48} className="flex-1" borderRadius="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
