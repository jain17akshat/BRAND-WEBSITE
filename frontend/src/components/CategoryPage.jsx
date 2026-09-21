import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Heart, Eye, Check, Star, Sparkles } from 'lucide-react';
import { IncenseShowcase } from './IncenseShowcase';
import { CategoryPageSkeleton } from './Skeleton';
import { SafeImage } from './SafeImage';
import { ProductImage } from './ProductImage';

export const CategoryPage = ({
  category,
  categories,
  products,
  onBackToHome,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  onSelectProduct
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top only when switching between main categories
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [category?.id]);

  // Loading state when filter or sort changes
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [selectedSubcategory, sortBy]);

  // Filter products by category
  const categoryProducts = products.filter(
    (p) => p.category === category.id ||
      (category.id === 'all') ||
      (category.id === 'metalware' && (p.category === 'brass' || p.category === 'copper' || p.category === 'metalware')) ||
      (category.id === 'vastu' && (p.category === 'vastu' || (p.artType === 'yantra' && p.category !== 'yantras')))
  );

  // Filter by subcategory
  const filteredProducts = selectedSubcategory === 'all'
    ? categoryProducts
    : categoryProducts.filter((p) => p.subcategory === selectedSubcategory ||
        (selectedSubcategory === 'brass' && p.category === 'brass') ||
        (selectedSubcategory === 'copper' && p.category === 'copper') ||
        (selectedSubcategory === 'Sacred Malas & Rosaries' && (p.subcategory === 'Sacred Malas & Rosaries' || p.name.toLowerCase().includes('mala'))));

  // Helper check for Yantra plates/frames vs other Vastu items
  const isYantraPlate = (p) =>
    (p.artType === 'yantra' || p.subcategory?.includes('Yantra') || p.name?.toLowerCase().includes('yantra')) &&
    !p.id?.includes('turtle');

  // Sort products — exclude Coming Soon items entirely
  const sortedProducts = [...filteredProducts]
    .filter((p) => !p.isComingSoon && p.tag !== 'Coming Soon')
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;

      // Featured default order: For Vastu category, show Yantras first then other products
      if (category.id === 'vastu') {
        const aIsYantra = isYantraPlate(a);
        const bIsYantra = isYantraPlate(b);
        if (aIsYantra && !bIsYantra) return -1;
        if (!aIsYantra && bIsYantra) return 1;
      }

      // Featured default order for Mandir Essentials: Malas first, Chandan/Kapoor second, Chowki & others third
      if (category.id === 'mandir-essentials') {
        const getRank = (p) => {
          if (p.artType === 'mala' || p.subcategory === 'Sacred Malas & Rosaries' || p.name?.toLowerCase().includes('mala')) return 1;
          if (p.artType === 'chandan' || p.artType === 'kapoor' || p.name?.toLowerCase().includes('chandan') || p.name?.toLowerCase().includes('kapoor')) return 2;
          return 3;
        };
        const rankA = getRank(a);
        const rankB = getRank(b);
        if (rankA !== rankB) return rankA - rankB;
      }

      return 0; // featured default order
    });

  // Visual Subcategory Image Cards for rich category navigation
  const subcategoryVisualCards = category.id === 'metalware' ? [
    {
      id: 'all',
      title: 'All Metalware',
      subtitle: 'Complete Brass & Copper Collection',
      subcatKey: 'all',
      image: '/assets/brasscover.png'
    },
    {
      id: 'brass-articles',
      title: 'Brass Articles',
      subtitle: 'Bells, Kalash, Designer Thali & Statues',
      subcatKey: 'brass',
      image: '/assets/brasscover.png'
    },
    {
      id: 'copper-vessels',
      title: 'Copper Vessels & Utensils',
      subtitle: 'Water Pots, Jugs, Tumblers & Kalash',
      subcatKey: 'Copper Utensils',
      image: '/assets/Copper cover.png',
      badge: 'Ayurvedic Health'
    }
  ] : category.id === 'incense' ? [
    {
      id: 'all',
      title: 'All Varieties',
      subtitle: '16 Total Pack Options',
      subcatKey: 'all',
      image: '/assets/Incense cover.jpg',
      badge: 'Full Collection'
    },
    {
      id: 'no-bamboo',
      title: 'Bamboo-Free Agarbatti',
      subtitle: '50, 80 & 100 Sticks',
      subcatKey: 'Agarbatti (Without Bamboo)',
      image: '/assets/Incense cover.jpg',
      badge: '100% Organic'
    },
    {
      id: 'with-bamboo',
      title: 'Traditional Agarbatti',
      subtitle: '50, 80 & 100 Sticks',
      subcatKey: 'Agarbatti (With Bamboo)',
      image: '/assets/Incense cover.jpg',
      badge: 'Classic Aroma'
    },
    {
      id: 'dhoop-cones',
      title: 'Natural Dhoop Cones',
      subtitle: '12, 24, 40, 50, 100 & 200 Cones',
      subcatKey: 'Dhoop Cones',
      image: '/assets/Incense cover.jpg',
      badge: '6 Pack Sizes'
    },
    {
      id: 'dhoop-sticks',
      title: 'Charcoal-Free Dhoop Sticks',
      subtitle: '20, 50 & 100 Sticks',
      subcatKey: 'Dhoop Sticks',
      image: '/assets/Incense cover.jpg',
      badge: 'Natural Resin'
    },
    {
      id: 'sambrani',
      title: 'Loban & Sambrani Cups',
      subtitle: '12, 24 & 48 Cups',
      subcatKey: 'Sambrani Cups',
      image: '/assets/Incense cover.jpg',
      badge: 'Guggal & Ghee'
    }
  ] : category.id === 'brass' ? [
    {
      id: 'all',
      title: 'All Brass Articles',
      subtitle: 'Complete Masterpiece Catalog',
      subcatKey: 'all',
      image: '/assets/brasscover.png',
      badge: 'Full Collection'
    },
    {
      id: 'brass-bells',
      title: 'Artisanal Brass Bells',
      subtitle: 'Garuda, Nandi, Simple & Carved',
      subcatKey: 'Brass Bells',
      image: '/assets/brass bells/garduda 1.png',
      badge: 'Masterpiece Types'
    },
    {
      id: 'brass-kalash',
      title: 'Sacred Brass Kalash',
      subtitle: 'Handcrafted Virgin Brass Kalash Vessel',
      subcatKey: 'Brass Kalash',
      image: '/assets/brass kalash/kalash1.png',
      badge: 'Pooja Vessel'
    },
    {
      id: 'brass-design-thali',
      title: 'Designer Brass Thali',
      subtitle: 'Hand-Engraved Artisanal Design Thali',
      subcatKey: 'Brass Puja Thali',
      image: '/assets/brassdesign thali/design1.png',
      badge: 'Designer Thali'
    }
  ] : category.id === 'copper' ? [
    {
      id: 'all',
      title: 'All Copper Articles',
      subtitle: '99.6% Certified Pure Copper Collection',
      subcatKey: 'all',
      image: '/assets/Copper cover.png',
      badge: 'Full Collection'
    },
    {
      id: 'copper-kalash',
      title: 'Sacred Copper Kalash',
      subtitle: 'Hand-Hammered Tamra Kalash Vessel',
      subcatKey: 'Copper Kalash',
      image: '/assets/Copperkalsh/copperkalsh1.png',
      badge: 'Pooja Vessel'
    }
  ] : category.id === 'mandir-essentials' ? [
    {
      id: 'all',
      title: 'All Essentials',
      subtitle: 'Mandir Items & Malas',
      subcatKey: 'all',
      image: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      badge: 'Full Collection'
    },
    {
      id: 'malas',
      title: 'Sacred Malas & Rosaries',
      subtitle: 'Rudraksha, Sphatik, Tulsi, Karungali & Vaijanti',
      subcatKey: 'Sacred Malas & Rosaries',
      image: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      badge: 'Consecrated Malas'
    },
    {
      id: 'wooden-chowki',
      title: 'Wooden Chowki (Bajot)',
      subtitle: 'Solid Teakwood & Brass Inlay',
      subcatKey: 'Wooden Chowki',
      image: '/assets/Wooden Choki/chowki1.png',
      badge: 'Altar Platform'
    },
    {
      id: 'dhoopdani',
      title: 'Brass Dhoopdani',
      subtitle: 'Jali Lid & Insulated Handle',
      subcatKey: 'Puja Accessories',
      image: '/assets/dhoop dani/dhoop dani 1.jpg',
      badge: 'Incense Burner'
    },
    {
      id: 'japa-bags',
      title: 'Japa Bags & Counters',
      subtitle: 'Cotton Gaumukhi & Brass Counters',
      subcatKey: 'Japa Bags & Pouches',
      image: '/assets/Jap Bag/Bag1.jpg',
      badge: 'Japa Accessories'
    },
    {
      id: 'asan-mats',
      title: 'Velvet Asan & Storage',
      subtitle: 'Zari Brocade Mats & Teak Chests',
      subcatKey: 'Pooja Asan Mats',
      image: '/assets/Velvet asan/asan 1.png',
      badge: 'Altar Decor'
    }
  ] : [];

  if (category.id === 'incense') {
    return (
      <div className="min-h-screen bg-[#1C1715]">
        <IncenseShowcase />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center relative z-20">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] shadow-md transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24 text-[#2C2623]">

      {/* Category Hero Banner — Full Viewport Cover */}
      {/*
        Same image file used for both PC and mobile.
        Two <img> tags: mobile visible on <640px, desktop visible on ≥640px.
        Each has a different object-position so the focal point is always correct.
      */}
      <section
        className="relative w-full overflow-hidden bg-[#1C1715]"
        style={{ height: '100svh', minHeight: '100vh' }}
      >

        {/* Mobile Image — shown below sm breakpoint (< 640px) */}
        <div className="block sm:hidden absolute inset-0 h-full w-full">
          <SafeImage
            src={category.mobileImage || category.image || '/brasshero.webp'}
            alt={category.title || 'Category Collection'}
            fallbackSrc={category.fallbackImage || '/assets/brasscover.webp'}
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover hero-image-crisp"
            style={{ objectPosition: category.mobilePosition || 'center center' }}
          />
        </div>

        {/* Desktop Image — shown from sm breakpoint (≥ 640px) */}
        <div className="hidden sm:block absolute inset-0 h-full w-full">
          <SafeImage
            src={category.image || '/brasshero.webp'}
            alt={category.title || 'Category Collection'}
            fallbackSrc={category.fallbackImage || '/assets/brasscover.webp'}
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover hero-image-crisp"
            style={{ objectPosition: category.desktopPosition || 'center center' }}
          />
        </div>

        {/* Minimal Dark Overlay — preserves image vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* Category Title — centred in full viewport, offset for fixed navbar */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none" style={{ paddingTop: '70px' }}>
          <h1
            className="font-cinzel font-bold text-white tracking-wider uppercase text-center leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 8vw, 5rem)',
              textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            {category.title || category.name}
          </h1>
        </div>

      </section>

      {/* Back to Home Button Below Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] shadow-md transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Content Area */}
      {category.id === 'incense' ? (
        <IncenseShowcase />
      ) : (
        <div id="category-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {/* Subcategory Visual Filter Pills */}
          {subcategoryVisualCards && subcategoryVisualCards.length > 0 && (
            <div className="mb-6 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {subcategoryVisualCards.map((card) => {
                const isActive = selectedSubcategory === card.subcatKey;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setSelectedSubcategory(card.subcatKey);
                      const gridEl = document.getElementById('category-products-grid');
                      if (gridEl) {
                        const yOffset = -100;
                        const y = gridEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold transition-all whitespace-nowrap border cursor-pointer ${
                      isActive
                        ? 'active-category bg-[#FAF5EB] text-[#2C1F06] border-[#C5A059] font-bold shadow-xs scale-[1.02]'
                        : 'bg-white text-[#5A4D41] border-[#EAE0CD] hover:border-[#C5A059]/50 hover:bg-[#FAF5EB]/50'
                    }`}
                  >
                    <span>{card.title}</span>
                    {card.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-medium ${
                        isActive ? 'bg-[#C5A059]/20 text-[#2C1F06]' : 'bg-[#FAF5EB] text-[#8C7A6B]'
                      }`}>
                        {card.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter and Sort Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE0CD]">

            <div className="flex items-center gap-2">
              <span className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider">
                Showing: <span className="text-[#C5A059] font-bold">{selectedSubcategory === 'all' ? 'All Items' : selectedSubcategory}</span>
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-cinzel font-semibold text-[#755722] uppercase tracking-wider">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#EAE0CD] text-xs font-cinzel font-semibold text-[#2C2623] px-3.5 py-2 rounded-lg shadow-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="featured">Featured Items</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

          </div>

          {/* Product Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div id="category-products-grid" className="mt-8">
            {isLoading ? (
              <CategoryPageSkeleton count={8} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {sortedProducts.map((product, idx) => (
                  <CategoryProductCard
                    key={product.id}
                    product={product}
                    category={category}
                    isWishlisted={wishlistIds.includes(product.id)}
                    priority={idx < 4}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    onOpenQuickView={onOpenQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

// Internal Clean Product Card
const CategoryProductCard = ({
  product,
  category,
  isWishlisted,
  priority = false,
  onAddToCart,
  onToggleWishlist,
  onOpenQuickView,
  onSelectProduct
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleClickCard = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onOpenQuickView) {
      onOpenQuickView(product);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* Image Header with Hover Quick Add Overlay */}
      <div
        className="product-card-image-wrapper aspect-square overflow-hidden cursor-pointer bg-[#F9F6F0]"
        onClick={handleClickCard}
      >
        <ProductImage
          src={product.image}
          images={product.images}
          alt={product.name}
          artType={product.artType}
          fitMode={product.fitMode}
          aspect="aspect-square"
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />

        {/* Coming Soon Badge */}
        {product.isComingSoon && (
          <div className="absolute top-3 left-3 z-10 bg-[#2C1F06]/90 text-[#E5C378] text-[9px] sm:text-[10px] font-cinzel font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#E5C378]/40 shadow-lg backdrop-blur-md">
            Coming Soon
          </div>
        )}

        {/* Top Right Wishlist & Quick View Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist && onToggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all ${isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/80 hover:bg-white text-[#2C2623]'
              }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Quick Add Action Bar Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-10">
          {product.isComingSoon ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuickView && onOpenQuickView(product);
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] text-xs font-semibold font-cinzel flex items-center justify-center gap-1.5 shadow-lg border border-[#E5C378]/30"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Coming Soon • Preview</span>
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart && onAddToCart(product);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] text-xs font-semibold shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-[#E5C378]/30"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickView && onOpenQuickView(product);
                }}
                className="p-2 rounded-lg bg-white/90 hover:bg-white text-[#2C2623] text-xs font-medium shadow-lg transition-transform active:scale-95"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtle Category/Art Tag if available */}
          <p className="text-[9px] sm:text-[10px] font-cinzel tracking-[0.25em] text-[#9B7E52] uppercase mb-1 font-medium min-h-[16px] flex items-center">
            {product.categoryName || '\u00A0'}
          </p>
          {/* Elegant Product Title */}
          <h3
            onClick={handleClickCard}
            className="font-cinzel font-semibold text-xs sm:text-[15px] text-[#2C2623] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2 leading-snug tracking-tight min-h-[2.25rem] sm:min-h-[2.625rem] flex items-start"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-2.5 border-t border-[#EAE0CD] flex items-center justify-between gap-2 mt-auto">
          {!product.isComingSoon ? (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {product.weightVariants && product.weightVariants[0]?.price ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-sans text-[#8C7A6B] font-light lowercase">from</span>
                  <span className="text-sm sm:text-base font-cinzel font-bold text-[#2C2623]">
                    ₹{product.weightVariants[0].price.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : product.price ? (
                <span className="text-sm sm:text-base font-cinzel font-bold text-[#2C2623]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              ) : null}
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-stone-600 line-through font-sans font-medium">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-cinzel font-bold text-[#8C6D2D] uppercase tracking-wider">
              Launching Soon
            </span>
          )}

          {product.isComingSoon ? (
            <span className="px-2.5 py-1.5 rounded-lg bg-[#C5A059]/15 text-[#9B7E52] font-cinzel font-bold text-[10px] sm:text-xs tracking-wider uppercase border border-[#C5A059]/30">
              Coming Soon
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClickCard();
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] font-medium text-[11px] sm:text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 border border-[#E5C378]/20"
              title="View product details"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
