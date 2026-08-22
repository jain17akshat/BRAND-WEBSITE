import React from 'react';
import { PRODUCTS } from '../data/products';
import { ArrowRight } from 'lucide-react';

export const MandirFeature = ({ onExplore, onSelectProduct, onAddToCart }) => {
  const essentialsProducts = PRODUCTS.filter(p => p.category === 'mandir-essentials');
  // Duplicate array 3x for seamless infinite marquee loop
  const marqueeItems = [...essentialsProducts, ...essentialsProducts, ...essentialsProducts];

  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#EAE0CD] overflow-hidden">
      <style>{`
        @keyframes mandirMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-mandir-marquee {
          display: flex;
          width: max-content;
          animation: mandirMarquee 38s linear infinite;
        }
        .animate-mandir-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── 1. LANDSCAPE FEATURE BANNER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#EAE0CD] bg-[#1C140F]">
          {/* Landscape Background Image */}
          <div className="relative w-full h-[300px] sm:h-[360px] lg:h-[400px] overflow-hidden">
            <img
              src="/essentialhero.png"
              alt="Mandir Essentials Collection"
              onError={(e) => { e.target.src = '/mandiressentialmobileview.png'; }}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
            />
            {/* Dark Landscape Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C140F]/95 via-[#1C140F]/75 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C140F]/80 via-transparent to-transparent" />
          </div>

          {/* Banner Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-2xl text-white z-10">
            <p className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#C5A059] uppercase mb-2 sm:mb-3 font-semibold">
              Collection Spotlight
            </p>
            <h2
              className="font-cinzel font-bold text-white leading-tight mb-3 sm:mb-4 drop-shadow"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
            >
              Mandir Essentials
            </h2>
            <p className="text-xs sm:text-sm text-[#D4C3A3]/90 font-light leading-relaxed mb-6 max-w-xl">
              Thoughtfully curated sacred essentials for everyday prayer, meditation & devotion — handcrafted malas, mala counters, gaumukhi bags, wooden chowkis & brass dhoopdanis.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-[#1C140F] text-xs font-cinzel font-bold tracking-widest uppercase rounded-full hover:bg-[#E5C378] transition-all duration-300 active:scale-95 shadow-lg group"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CONTINUOUS MANDIR ESSENTIALS MARQUEE (RIGHT TO LEFT) ── */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <h3 className="text-xs font-cinzel font-bold tracking-[0.2em] uppercase text-[#6B5840]">
              Mandir Essentials — Moving Catalog
            </h3>
          </div>
          <span className="text-[10px] font-cinzel text-[#9B7E52] uppercase tracking-wider hidden sm:inline">
            (Hover to Pause)
          </span>
        </div>

        {/* Outer scrolling marquee container */}
        <div className="overflow-hidden py-2">
          <div className="animate-mandir-marquee gap-4 sm:gap-6 px-4">
            {marqueeItems.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className="group flex-none w-[200px] sm:w-[240px] rounded-xl overflow-hidden bg-white border border-[#EAE0CD] hover:border-[#C5A059] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-[#F9F5EE]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/assets/Incense cover.jpg'; }}
                  />
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-[#1C140F]/85 text-[#E5C378] text-[9px] font-cinzel tracking-wider px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <h4 className="text-xs font-cinzel font-semibold text-[#2C2623] line-clamp-2 leading-snug group-hover:text-[#C5A059] transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE0CD]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-sans text-[#8C7A6B] font-light lowercase">from</span>
                      <span className="text-xs font-cinzel font-bold text-[#2C2623]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-cinzel font-bold text-[#C5A059] uppercase tracking-widest group-hover:translate-x-0.5 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
