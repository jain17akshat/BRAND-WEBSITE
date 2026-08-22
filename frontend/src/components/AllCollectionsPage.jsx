import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Eye, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const CATEGORY_META = {
  brass:             { label: 'Brass Articles',         emoji: '🪔', color: '#B8860B', bg: '#FBF5E6' },
  copper:            { label: 'Copper Articles',        emoji: '🫗', color: '#B05C2E', bg: '#FBF0EA' },
  'mandir-essentials': { label: 'Mandir Essentials',   emoji: '📿', color: '#7B6B3A', bg: '#F5F0E6' },
  incense:           { label: 'Incense & Dhoop',        emoji: '🌿', color: '#4A7C59', bg: '#EDF5EF' },
  vastu:             { label: 'Vastu & Spiritual',      emoji: '🔯', color: '#6B4E9B', bg: '#F2EFF8' },
  yantras:           { label: 'Custom & Handcrafted',   emoji: '✨', color: '#7B5E3A', bg: '#F5F0EB' },
};

function ProductCard({ product, onAddToCart, onToggleWishlist, wishlistIds, onSelectProduct }) {
  const isWishlisted = wishlistIds?.includes(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-[#EAE0CD] hover:border-[#C5A059]/50 hover:shadow-lg transition-all duration-300 group flex flex-col"
      style={{ cursor: 'pointer' }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#F9F5EE]"
        style={{ aspectRatio: '1/1' }}
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = '/assets/Incense cover.jpg'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#C5A059] text-white text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.tag && (
          <span className="absolute top-2 right-2 bg-white/90 border border-[#EAE0CD] text-[#9B7E52] text-[9px] font-cinzel tracking-wide px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}
        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={e => { e.stopPropagation(); onToggleWishlist(product); }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-cinzel font-bold tracking-wide border transition-all ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/95 border-[#EAE0CD] text-[#6B5840] hover:border-[#C5A059] hover:text-[#C5A059]'}`}
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-rose-400' : ''}`} />
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSelectProduct(product); }}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/95 border border-[#EAE0CD] text-[#6B5840] text-[10px] font-cinzel font-bold tracking-wide hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
          >
            <Eye className="w-3 h-3" />
            Details
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {product.categoryName && (
          <p className="text-[9px] font-cinzel tracking-[0.25em] text-[#9B7E52] uppercase font-medium">
            {product.categoryName}
          </p>
        )}
        <h3
          className="text-xs font-cinzel font-semibold text-[#2C2623] leading-snug line-clamp-2 cursor-pointer hover:text-[#C5A059] transition-colors tracking-tight"
          onClick={() => onSelectProduct(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-auto pt-2 border-t border-[#EAE0CD]">
          {product.weightVariants ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-sans text-[#8C7A6B] font-light lowercase">from</span>
              <span className="font-cinzel font-bold text-[#2C2623] text-xs sm:text-sm">
                ₹{product.weightVariants[0].price.toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <span className="font-cinzel font-bold text-[#2C2623] text-xs sm:text-sm">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-[10px] text-[#A09484] line-through font-sans">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1C140F] text-white text-[10px] font-cinzel font-bold tracking-widest uppercase hover:bg-[#C5A059] transition-all duration-300 active:scale-95"
        >
          <ShoppingBag className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

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

  // Group products by category
  const grouped = useMemo(() => {
    const cats = Object.keys(CATEGORY_META);
    return cats.reduce((acc, cat) => {
      const prods = products.filter(p => p.category === cat);
      if (prods.length > 0) acc[cat] = prods;
      return acc;
    }, {});
  }, [products]);

  const sortProducts = (prods) => {
    if (sortBy === 'price-asc')  return [...prods].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...prods].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     return [...prods].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return prods;
  };

  const toggleCat = (cat) => setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));

  const catsToShow = activeFilter === 'all'
    ? Object.keys(grouped)
    : (grouped[activeFilter] ? [activeFilter] : []);

  const totalCount = products.filter(p =>
    activeFilter === 'all' ? true : p.category === activeFilter
  ).length;

  return (
    <div className="min-h-screen bg-[#FBF9F5]">

      {/* ── HERO HEADER ── */}
      <div
        className="relative py-16 sm:py-20 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C140F 0%, #2D1F10 50%, #1C140F 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5A059'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3Ccircle cx='30' cy='30' r='12' stroke='%23C5A059' stroke-width='0.6' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-[#9B7E52] text-xs font-cinzel tracking-widest uppercase mb-6 hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <p className="text-[10px] font-cinzel tracking-[0.4em] text-[#C5A059] uppercase mb-4">Sacred Collections</p>
          <h1
            className="font-cinzel font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
          >
            Shop All Collections
          </h1>
          <p className="text-[#D4C3A3]/80 font-light text-sm">
            {totalCount} sacred products across {catsToShow.length} categories — handcrafted in India
          </p>
        </div>
      </div>

      {/* ── FILTERS + SORT BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE0CD] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9B7E52] flex-shrink-0" />
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full font-cinzel text-[10px] tracking-widest uppercase border transition-all ${activeFilter === 'all' ? 'bg-[#1C140F] text-white border-[#1C140F]' : 'bg-white text-[#6B5840] border-[#EAE0CD] hover:border-[#C5A059]'}`}
            >
              All
            </button>
            {Object.entries(CATEGORY_META).map(([id, { label, emoji }]) =>
              grouped[id] ? (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-cinzel text-[10px] tracking-wide border transition-all ${activeFilter === id ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'bg-white text-[#6B5840] border-[#EAE0CD] hover:border-[#C5A059]'}`}
                >
                  <span>{emoji}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ) : null
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-cinzel text-[#9B7E52] tracking-widest uppercase">Sort</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-[11px] font-cinzel border border-[#EAE0CD] rounded-lg px-2.5 py-1.5 text-[#2C2623] bg-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
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
          const meta = CATEGORY_META[cat] || { label: cat, emoji: '✨', color: '#C5A059', bg: '#FBF5E6' };
          const prods = sortProducts(grouped[cat] || []);
          const isExpanded = expandedCats[cat] !== false; // default expanded
          const PREVIEW = 4;

          return (
            <section key={cat}>
              {/* Category heading */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EAE0CD]">
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: meta.bg }}
                  >
                    {meta.emoji}
                  </span>
                  <div>
                    <h2 className="font-cinzel font-bold text-[#2C2623]" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}>
                      {meta.label}
                    </h2>
                    <p className="text-[10px] text-[#9B7E52] font-cinzel tracking-widest">{prods.length} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-cinzel tracking-widest uppercase text-[#C5A059] border border-[#C5A059]/40 px-3 py-1.5 rounded-full hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all"
                  >
                    View All →
                  </button>
                  <button
                    onClick={() => toggleCat(cat)}
                    className="p-1.5 rounded-full border border-[#EAE0CD] text-[#9B7E52] hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Products grid */}
              {isExpanded && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {prods.slice(0, PREVIEW).map(product => (
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
                    <div className="mt-5 text-center">
                      <button
                        onClick={() => onSelectCategory(cat)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#C5A059]/50 text-[#C5A059] text-[10px] font-cinzel tracking-[0.2em] uppercase rounded-full hover:bg-[#C5A059] hover:text-white transition-all duration-300"
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
      <div
        className="py-14 text-center"
        style={{ background: 'linear-gradient(135deg, #1C140F, #2D1F10)' }}
      >
        <p className="text-[10px] font-cinzel tracking-[0.4em] text-[#C5A059] uppercase mb-3">Looking for something specific?</p>
        <h3 className="font-cinzel font-bold text-white text-xl mb-6">Can't find what you need?</h3>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#C5A059] text-[#1C140F] font-cinzel font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-[#E5C378] transition-all hover:scale-105 active:scale-95"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
