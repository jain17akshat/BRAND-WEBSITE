import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Eye, Check, Star, Sparkles } from 'lucide-react';
import { IncenseShowcase } from './IncenseShowcase';

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

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo(0, 0);
  }, [category?.id]);

  // Filter products by category
  const categoryProducts = products.filter(
    (p) => p.category === category.id ||
      (category.id === 'all') ||
      (category.id === 'vastu' && (p.category === 'vastu' || (p.artType === 'yantra' && p.category !== 'yantras')))
  );

  // Filter by subcategory
  const filteredProducts = selectedSubcategory === 'all'
    ? categoryProducts
    : categoryProducts.filter((p) => p.subcategory === selectedSubcategory || (selectedSubcategory === 'Sacred Malas & Rosaries' && (p.subcategory === 'Sacred Malas & Rosaries' || p.name.toLowerCase().includes('mala'))));

  // Helper check for Yantra plates/frames vs other Vastu items
  const isYantraPlate = (p) =>
    (p.artType === 'yantra' || p.subcategory?.includes('Yantra') || p.name?.toLowerCase().includes('yantra')) &&
    !p.id?.includes('turtle');

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
    return 0; // featured default order
  });

  // Visual Subcategory Image Cards for rich category navigation
  const subcategoryVisualCards = category.id === 'incense' ? [
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
      badge: '4 Masterpiece Types'
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
      subtitle: '12 Mandir Items & Malas',
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
      badge: '5 Consecrated Malas'
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
        <img
          src={category.mobileImage || category.image || '/brasshero.png'}
          alt={category.title || 'Category Collection'}
          onError={(e) => {
            // If mobileImage fails, fall back to desktop image
            if (category.mobileImage && e.target.src !== (category.image || '/brasshero.png')) {
              e.target.src = category.image || '/brasshero.png';
            } else if (category.fallbackImage && e.target.src !== category.fallbackImage) {
              e.target.src = category.fallbackImage;
            } else if (e.target.src !== '/assets/brasscover.png') {
              e.target.src = '/assets/brasscover.png';
            }
          }}
          className="block sm:hidden absolute inset-0 h-full w-full object-cover hero-image-crisp"
          style={{ objectPosition: category.mobilePosition || 'center center' }}
        />

        {/* Desktop Image — shown from sm breakpoint (≥ 640px) */}
        <img
          src={category.image || '/brasshero.png'}
          alt={category.title || 'Category Collection'}
          onError={(e) => {
            if (category.fallbackImage && e.target.src !== category.fallbackImage) {
              e.target.src = category.fallbackImage;
            } else if (e.target.src !== '/assets/brasscover.png') {
              e.target.src = '/assets/brasscover.png';
            }
          }}
          className="hidden sm:block absolute inset-0 h-full w-full object-cover hero-image-crisp"
          style={{ objectPosition: category.desktopPosition || 'center center' }}
        />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

          {/* Visual Subcategory Image Cards Grid */}
          {subcategoryVisualCards.length > 0 && (
            <div className="mb-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-cinzel tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
                    Interactive Collection Varieties
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#2C2623]">
                    Select {category.title || category.name} Variety
                  </h2>
                </div>
                <span className="text-xs font-cinzel text-gray-500 hidden sm:inline">
                  Click any variety to view all items below
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {subcategoryVisualCards.map((card) => {
                  const isActive = selectedSubcategory === card.subcatKey;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedSubcategory(card.subcatKey)}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden shadow-sm transition-all duration-300 aspect-[4/3] sm:aspect-[1/1] flex flex-col justify-end border ${isActive
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/60 scale-105 shadow-xl'
                        : 'border-[#EAE0CD] hover:border-[#C5A059]/50 hover:scale-102'
                        }`}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity ${isActive ? 'from-black/95 via-black/50 to-black/20' : 'from-black/85 via-black/40 to-transparent'
                        }`}></div>

                      {/* Active Checkmark Pill */}
                      {isActive && (
                        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#C5A059] text-[#171312] flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="relative z-10 p-3 flex flex-col justify-end text-left">
                        <span className="text-[9px] font-cinzel uppercase font-bold text-[#E5C378] tracking-wider block">
                          {card.badge}
                        </span>
                        <h3 className="text-xs sm:text-sm font-cinzel font-bold text-white leading-snug group-hover:text-[#E5C378] transition-colors">
                          {card.title}
                        </h3>
                        <span className="text-[10px] text-gray-300 font-sans font-light mt-0.5 block">
                          {card.subtitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter and Sort Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE0CD]">

            <div className="flex items-center gap-2">
              <span className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider">
                Showing: <span className="text-[#C5A059] font-bold">{selectedSubcategory === 'all' ? 'All Items' : selectedSubcategory}</span> ({filteredProducts.length} Items)
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
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {sortedProducts.map((product) => (
              <CategoryProductCard
                key={product.id}
                product={product}
                category={category}
                isWishlisted={wishlistIds.includes(product.id)}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onOpenQuickView={onOpenQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
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

  return (
    <div className="group relative bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Image Header */}
      <div
        className={`relative aspect-[4/3] overflow-hidden cursor-pointer ${product.fitMode === 'contain' || (product.image && product.image.includes('brass bells'))
          ? 'bg-[#F9F6F0]'
          : 'bg-[#F4EFE6]'
          }`}
        onClick={handleClickCard}
      >
        <img
          src={product.image || category.image || '/assets/Incense cover.jpg'}
          alt={product.name}
          onError={(e) => {
            if (e.target.src !== '/assets/Incense cover.jpg') {
              e.target.src = '/assets/Incense cover.jpg';
            }
          }}
          className={`w-full h-full transform group-hover:scale-105 transition-transform duration-500 ${product.fitMode === 'contain' || (product.image && product.image.includes('brass bells'))
            ? 'object-contain p-3'
            : 'object-cover'
            }`}
        />

        {/* Quick Action Overlay Buttons */}
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView && onOpenQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#2C2623] flex items-center justify-center shadow-md backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          <span className="text-[9px] sm:text-[10px] font-cinzel uppercase tracking-[0.15em] text-[#C5A059] block font-semibold truncate">
            {product.tag || product.subcategory || product.categoryName || 'Sacred Collection'}
          </span>
          <h3
            onClick={handleClickCard}
            className="text-xs sm:text-base font-cinzel font-bold text-[#2C2623] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2 mt-0.5 sm:mt-1 leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Weight / Size Variants Tag Pill */}
        {product.weightVariants && product.weightVariants.length > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FAF0D9] border border-[#EAD7AF] text-[9px] sm:text-[10px] font-cinzel font-bold text-[#755722] w-fit">
            <span>{product.weightVariants.length} Options ({product.weightVariants[0].weight} – {product.weightVariants[product.weightVariants.length - 1].weight})</span>
          </div>
        )}

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs">
          <div className="flex items-center text-[#D4AF37]">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          </div>
          <span className="font-semibold text-[#2C2623]">{product.rating || 4.9}</span>
          <span className="text-gray-400 text-[9px] sm:text-[10px]">(Verified)</span>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-[#F0EA99]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
          <div>
            <div className="text-sm sm:text-lg font-cinzel font-bold text-[#2C2623]">
              {product.weightVariants ? `From ₹${product.weightVariants[0].price}` : `₹${product.price.toLocaleString('en-IN')}`}
            </div>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleClickCard}
            className="w-full sm:w-auto px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-[10px] sm:text-xs uppercase font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95"
          >
            <span>Details</span>
            <span>→</span>
          </button>
        </div>

      </div>

    </div>
  );
};
