import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Eye, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const CATEGORY_META = {
  metalware:         { label: 'Metalware (Brass & Copper)', emoji: '🪔', color: '#B8860B', bg: '#FBF5E6' },
  brass:             { label: 'Brass Articles',         emoji: '🪔', color: '#B8860B', bg: '#FBF5E6' },
  copper:            { label: 'Copper Articles',        emoji: '🫗', color: '#B05C2E', bg: '#FBF0EA' },
  'mandir-essentials': { label: 'Mandir Essentials',   emoji: '📿', color: '#7B6B3A', bg: '#F5F0E6' },
  vastu:             { label: 'Vastu & Spiritual',      emoji: '🔯', color: '#6B4E9B', bg: '#F2EFF8' },
  yantras:           { label: 'Custom & Handcrafted',   emoji: '✨', color: '#7B5E3A', bg: '#F5F0EB' },
};

import { ProductCard } from './ProductCard';

export function AllCollectionsPage({
  products = [],
  categories = [],
  onBackToHome,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onSelectProduct,
  onSelectCategory,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [expandedCats, setExpandedCats] = useState({});

  // Group products by category — exclude Coming Soon items
  const grouped = useMemo(() => {
    const cats = Object.keys(CATEGORY_META);
    return cats.reduce((acc, cat) => {
      const prods = products.filter(p => p.category === cat && !p.isComingSoon && p.tag !== 'Coming Soon');
      if (prods.length > 0) acc[cat] = prods;
      return acc;
    }, {});
  }, [products]);

  const sortProducts = (prods) => {
    return [...prods].sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating')     return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  };

  const toggleCat = (cat) => setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));

  const catsToShow = activeFilter === 'all'
    ? Object.keys(grouped)
    : (grouped[activeFilter] ? [activeFilter] : []);

  const totalCount = products.filter(p =>
    activeFilter === 'all' ? true : p.category === activeFilter
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-manrope">

      {/* ── HERO HEADER ── */}
      <div
        className="relative py-16 sm:py-20 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C221E 0%, #3D2D27 50%, #2C221E 100%)' }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-white/80 text-xs font-manrope font-medium tracking-wide mb-6 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <p className="text-[11px] font-manrope font-semibold tracking-[0.2em] text-[#FBEAE5] uppercase mb-3">Boutique Catalogue</p>
          <h1
            className="font-fraunces font-medium text-white mb-3 tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Shop All Collections
          </h1>
          <p className="text-[#FAF7F2]/80 font-normal text-sm max-w-md mx-auto">
            {totalCount} sacred products across {catsToShow.length} categories — handcrafted in India
          </p>
        </div>
      </div>

      {/* ── FILTERS + SORT BAR ── */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE0CD] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#57324F] flex-shrink-0" />
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-manrope text-xs font-semibold tracking-wide border transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#57324F] text-white border-[#57324F] shadow-xs'
                  : 'bg-white text-[#4A3E39] border-[#EAE0CD] hover:border-[#57324F]/40 hover:bg-[#FBEAE5]/30'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_META).map(([id, { label }]) =>
              grouped[id] ? (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-manrope text-xs font-semibold tracking-wide border transition-all ${
                    activeFilter === id
                      ? 'bg-[#57324F] text-white border-[#57324F] shadow-xs'
                      : 'bg-white text-[#4A3E39] border-[#EAE0CD] hover:border-[#57324F]/40 hover:bg-[#FBEAE5]/30'
                  }`}
                >
                  {label}
                </button>
              ) : null
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-manrope font-semibold text-[#8C7A70] uppercase tracking-wider">Sort</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs font-manrope border border-[#EAE0CD] rounded-[12px] px-3 py-1.5 text-[#2C221E] bg-white focus:outline-none focus:border-[#57324F] cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS BY CATEGORY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {catsToShow.map(cat => {
          const meta = CATEGORY_META[cat] || { label: cat, emoji: '✨', color: '#57324F', bg: '#FAF7F2' };
          const prods = sortProducts(grouped[cat] || []);
          const isExpanded = expandedCats[cat] !== false; // default expanded
          const PREVIEW = 4;

          return (
            <section key={cat}>
              {/* Category heading */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="font-fraunces font-medium text-xl sm:text-2xl text-[#2C221E]">
                      {meta.label}
                    </h2>
                    <p className="text-[11px] text-[#8C7A70] font-manrope tracking-wider">{prods.length} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-manrope tracking-wide text-[#57324F] border border-[#57324F]/30 px-3.5 py-1.5 rounded-full hover:bg-[#FBEAE5] transition-all font-semibold"
                  >
                    View All →
                  </button>
                  <button
                    onClick={() => toggleCat(cat)}
                    aria-label={isExpanded ? `Collapse ${meta.label} category` : `Expand ${meta.label} category`}
                    className="p-1.5 rounded-full border border-[#EAE0CD] text-[#57324F] hover:bg-[#FBEAE5] transition-all"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Products grid */}
              {isExpanded && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {prods.slice(0, PREVIEW).filter(product => product.image).map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        wishlistIds={wishlistIds}
                        onSelectProduct={onSelectProduct}
                      />
                    ))}
                  </div>
                  {prods.length > PREVIEW && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => onSelectCategory(cat)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#57324F]/30 text-[#57324F] text-xs font-manrope font-semibold rounded-full hover:bg-[#FBEAE5] transition-all"
                      >
                        See all {prods.length} {meta.label} →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          );
        })}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="py-14 sm:py-16 text-center bg-[#FBEAE5]/40 border-t border-[#EAE0CD]">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-[11px] font-manrope font-semibold tracking-[0.2em] text-[#57324F] uppercase mb-2">Looking for something specific?</p>
          <h3 className="font-fraunces font-medium text-2xl sm:text-3xl text-[#2C221E] mb-6">Can't find what you need?</h3>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#57324F] hover:bg-[#42253C] text-white font-manrope font-semibold text-xs tracking-wider uppercase rounded-[12px] shadow-sm transition-all active:scale-95"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
