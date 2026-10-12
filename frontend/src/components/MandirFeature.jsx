import React, { useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

// Products to hide from the catalog
const EXCLUDED_IDS = [
  'essentials-brass-chawar-whisk',
  'mandir-royal-velvet-asan-mat',
];

export const MandirFeature = ({ onExplore, onSelectProduct, onAddToCart }) => {
  const scrollRef = useRef(null);

  const essentialsProducts = PRODUCTS.filter(
    p => p.category === 'mandir-essentials' && !EXCLUDED_IDS.includes(p.id) && !p.isComingSoon
  );

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE0CD] overflow-hidden">

      {/* ── 1. LANDSCAPE FEATURE BANNER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#EAE0CD] bg-[#1C140F]">
          {/* Landscape Background Image */}
          <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden">
            {/* Mobile View Image */}
            <div className="block sm:hidden absolute inset-0 w-full h-full">
              <SafeImage
                src="/Pooja esentials.webp"
                alt="Mandir Essentials Collection"
                fallbackSrc="/pooja essentials.webp"
                dark={true}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Desktop View Image */}
            <div className="hidden sm:block absolute inset-0 w-full h-full">
              <SafeImage
                src="/pooja essentials.webp"
                alt="Mandir Essentials Collection"
                fallbackSrc="/Pooja esentials.webp"
                dark={true}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Dark Landscape Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C140F]/95 via-[#1C140F]/75 to-transparent sm:w-3/4 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C140F]/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Banner Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-2xl text-white z-10">
            <span className="text-xs font-manrope font-semibold tracking-wider text-[#FBEAE5] uppercase mb-2">
              Collection Spotlight
            </span>
            <h2
              className="font-fraunces font-bold text-white leading-tight mb-3 drop-shadow"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              Mandir Essentials
            </h2>
            <p className="text-xs sm:text-sm text-[#EAE0CD] font-manrope font-light leading-relaxed mb-6 max-w-xl">
              Thoughtfully curated sacred essentials for everyday prayer, meditation &amp; devotion — handcrafted malas, mala counters, gaumukhi bags, wooden chowkis &amp; brass dhoopdanis.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white text-xs font-manrope font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-md group min-h-[48px]"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FLUID SNAP-SCROLL CATALOG ROW (User controlled, no dizzy continuous marquee) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-manrope font-semibold text-[#57324F] uppercase tracking-wider block">Featured Essentials</span>
            <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-[#2C2623]">
              Curated Puja Essentials
            </h3>
          </div>

          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-xl bg-white border border-[#EAE0CD] hover:border-[#57324F] flex items-center justify-center text-[#2C2623] hover:text-[#57324F] transition-all shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-xl bg-white border border-[#EAE0CD] hover:border-[#57324F] flex items-center justify-center text-[#2C2623] hover:text-[#57324F] transition-all shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {essentialsProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product)}
              className="group flex-none w-[220px] sm:w-[260px] snap-start rounded-2xl overflow-hidden bg-white border border-[#EAE0CD] hover:border-[#57324F]/30 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Product Image */}
              <div className={`relative aspect-square overflow-hidden rounded-t-[17px] ${
                product.imageBackground === 'white'
                  ? 'bg-white'
                  : product.imageBackground === 'transparent'
                  ? 'bg-[#FAF6EC]'
                  : 'bg-[#FAF7F2]'
              }`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${
                    product.imageBackground === 'transparent'
                      ? 'drop-shadow-[0_8px_16px_rgba(42,34,30,0.14)]'
                      : ''
                  }`}
                  onError={(e) => { e.target.src = '/assets/Incense cover.jpg'; }}
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                <h4 className="text-xs sm:text-sm font-manrope font-semibold text-[#2C2623] line-clamp-2 leading-snug group-hover:text-[#57324F] transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-[#FAF7F2]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[11px] font-manrope text-[#7A6B5D]">from</span>
                    <span className="text-sm font-manrope font-bold text-[#2C2623]">
                      ₹{(product.price || product.weightVariants?.[0]?.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-manrope font-semibold text-[#57324F] group-hover:translate-x-0.5 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
