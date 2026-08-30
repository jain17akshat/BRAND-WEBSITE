import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Sparkles, Check, ChevronRight, Flame, Clock, Eye, Zap } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { ProductDetailSkeleton } from './Skeleton';
import { PRODUCTS } from '../data/products';

export const ProductDetailPage = ({
  product,
  onBackToCategory,
  onBackToHome,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  showToast
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Selected Gallery Image State
  const initialImg = product?.image || (product?.images && product?.images[0]) || '';
  const [activeImg, setActiveImg] = useState(initialImg);

  // Selected Weight Variant State
  const defaultVariant = product?.weightVariants
    ? (product.weightVariants.find((v) => v.default) || product.weightVariants[0])
    : null;

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Urgency: random stock left + viewer count (stable per product load)
  const urgencyData = useMemo(() => ({
    stockLeft: Math.floor(Math.random() * 5) + 2,   // 2–6
    viewers:   Math.floor(Math.random() * 12) + 8,  // 8–19
  }), [product?.id]);

  // Countdown: 23-min rolling timer synced to current time
  const getCountdownSeconds = () => {
    const now = new Date();
    return (23 - (now.getMinutes() % 23)) * 60 - now.getSeconds();
  };
  const [countdown, setCountdown] = useState(getCountdownSeconds);
  useEffect(() => {
    const t = setInterval(() => setCountdown(s => s <= 1 ? getCountdownSeconds() : s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  useEffect(() => {
    if (product) {
      setIsLoading(true);
      setActiveImg(product.image || (product.images && product.images[0]) || '');
      if (product.weightVariants) {
        setSelectedVariant(product.weightVariants.find((v) => v.default) || product.weightVariants[0]);
      } else {
        setSelectedVariant(null);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.scrollTo(0, 0);

      // Preload all gallery images in background for instant thumbnail switching
      if (product.images && product.images.length > 0) {
        product.images.forEach((imgUrl) => {
          if (imgUrl) {
            const img = new Image();
            img.src = imgUrl;
          }
        });
      }

      const timer = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [product?.id]);

  if (!product) return null;
  if (isLoading) return <ProductDetailSkeleton />;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOrigPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

  const discountPercent = currentOrigPrice
    ? Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100)
    : null;

  const handleAddToCart = () => {
    const itemToAdd = selectedVariant
      ? {
          ...product,
          id: `${product.id}-${selectedVariant.weight.replace(/\s+/g, '')}`,
          name: `${product.name} (${selectedVariant.weight})`,
          price: selectedVariant.price,
          originalPrice: selectedVariant.originalPrice,
          selectedWeight: selectedVariant.weight
        }
      : product;

    onAddToCart(itemToAdd, quantity);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24 text-[#2C2623]">
      
      {/* Top Header Navigation Bar */}
      <div className="bg-[#1C1715] border-b border-[#3A322C] pt-24 sm:pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-cinzel tracking-wider text-[#C5A059] uppercase overflow-x-auto scrollbar-none">
            <button onClick={onBackToHome} className="hover:text-white transition-colors">Home</button>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <button onClick={onBackToCategory} className="hover:text-white transition-colors">
              {product.categoryName || 'Collection'}
            </button>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className="text-white font-semibold line-clamp-1">{product.name}</span>
          </div>

        </div>
      </div>

      {/* Main Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="mb-6">
          <button
            onClick={onBackToCategory || onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] transition-all shadow-md active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Catalog</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image Frame */}
            <div className={`relative aspect-[4/3] sm:aspect-[1/1] rounded-2xl overflow-hidden shadow-xl border border-[#EAE0CD] ${
              product.fitMode === 'contain' || (activeImg && activeImg.includes('brass bells'))
                ? 'bg-[#F9F6F0]'
                : 'bg-[#F4EFE6]'
            }`}>
              <ProductImage
                src={activeImg}
                alt={product.name}
                artType={product.artType}
                fitMode={product.fitMode}
                aspect="aspect-full"
                className="w-full h-full"
              />



              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 hover:bg-white text-[#2C2623]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Carousel (Gallery Switcher) */}
            {product.images && product.images.length > 1 && (
              <div className="space-y-2">
                <span className="text-[11px] font-cinzel font-bold text-[#755722] uppercase tracking-wider block">
                  Product Gallery ({product.images.length} High-Res Views):
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.images.map((img, idx) => {
                    const isActive = activeImg === img;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImg(img)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                          isActive
                            ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 scale-105 shadow-md'
                            : 'border-[#EAE0CD] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`View ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Value Trust Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#EAE0CD]">
              <div className="bg-white p-3.5 rounded-xl border border-[#EAE0CD] text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] mx-auto" />
                <span className="text-[11px] font-cinzel font-bold text-[#2C2623] block">100% Authentic</span>
                <span className="text-[9px] text-gray-500 block">Vedic Certified</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#EAE0CD] text-center space-y-1">
                <Truck className="w-5 h-5 text-[#C5A059] mx-auto" />
                <span className="text-[11px] font-cinzel font-bold text-[#2C2623] block">Pan-India Express</span>
                <span className="text-[9px] text-gray-500 block">Safe Packaging</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#EAE0CD] text-center space-y-1">
                <RotateCcw className="w-5 h-5 text-[#C5A059] mx-auto" />
                <span className="text-[11px] font-cinzel font-bold text-[#2C2623] block">7-Day Return</span>
                <span className="text-[9px] text-gray-500 block">Hassle Free</span>
              </div>
            </div>

          </div>

          {/* Right Column: Product Specs & Weight Child Selection */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  {product.categoryName || 'Sacred Collection'}
                </span>
                <div className="flex items-center gap-1.5 bg-[#FAF0D9] px-3 py-1 rounded-full border border-[#EAD7AF]">
                  <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                  <span className="font-bold text-xs text-[#2C2623]">{product.rating || 4.9}</span>
                  <span className="text-gray-500 text-xs">({product.reviewsCount || 120} Verified Reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#2C2623] leading-snug">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#755722] font-cinzel font-semibold flex items-center gap-1.5 pt-1">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>{product.purity || '100% Pure Virgin Brass'}</span>
              </p>
            </div>

            {/* Price Showcase */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAE0CD] flex items-baseline justify-between shadow-sm">
              <div>
                <span className="text-xs text-gray-500 font-cinzel block mb-0.5">Special Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-cinzel font-bold text-[#2C2623]">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {currentOrigPrice && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{currentOrigPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
              {discountPercent && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#8B0000] text-white text-xs font-cinzel font-bold uppercase tracking-wider shadow">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Child Listing Weight Selection Container */}
            {product.weightVariants && product.weightVariants.length > 0 && (
              <div className="p-5 bg-white rounded-2xl border-2 border-[#C5A059]/40 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAE0CD] pb-2">
                  <div>
                    <span className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Select Heavy-Gauge Weight Option *
                    </span>
                    <span className="text-[11px] text-gray-500 font-sans font-light">
                      Choose desired weight variant for custom thickness & sound resonance
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#231E1C] text-[#E5C378] text-xs font-cinzel font-bold">
                    Selected: {selectedVariant?.weight || '300 G'}
                  </span>
                </div>

                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 pt-1">
                  {product.weightVariants.map((variant) => {
                    const isSelected = selectedVariant?.weight === variant.weight;
                    return (
                      <button
                        key={variant.weight}
                        onClick={() => setSelectedVariant(variant)}
                        className={`py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#231E1C] text-[#E5C378] border-[#C5A059] ring-2 ring-[#C5A059]/60 shadow-md scale-105'
                            : 'bg-[#FBF9F5] text-[#2C2623] border-[#EAE0CD] hover:bg-[#F6F1E7] hover:border-[#C5A059]/40'
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs font-cinzel font-bold block">{variant.weight}</span>
                        <span className={`text-[9px] sm:text-[10px] mt-0.5 block font-semibold ${isSelected ? 'text-[#E5C378]' : 'text-[#755722]'}`}>
                          ₹{variant.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Delivery Timeline + Urgency (Above the Fold, above Add to Cart) ── */}
            <div className="space-y-2.5">

              {/* Delivery Timeline */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-xs font-cinzel font-bold text-emerald-800 block">
                    Estimated Delivery: 3–5 Business Days
                  </span>
                  <span className="text-[10px] text-emerald-700 font-sans">
                    Free shipping on orders above ₹999 · Pan-India Express Delivery
                  </span>
                </div>
              </div>

              {/* Urgency Row — Stock + Viewers */}
              <div className="grid grid-cols-2 gap-2">
                {/* Stock Left */}
                <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl border border-red-200">
                  <Flame className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
                  <div>
                    <span className="text-[10px] font-cinzel font-bold text-red-700 block uppercase tracking-wide">
                      Only {urgencyData.stockLeft} Left!
                    </span>
                    <span className="text-[9px] text-red-600 font-sans">Selling fast today</span>
                  </div>
                </div>
                {/* Viewer Count */}
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-cinzel font-bold text-amber-700 block uppercase tracking-wide">
                      {urgencyData.viewers} Viewing Now
                    </span>
                    <span className="text-[9px] text-amber-600 font-sans">High demand</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF0D9] rounded-xl border border-[#E0CEAA]">
                <Clock className="w-4 h-4 text-[#8C6929] shrink-0" />
                <span className="text-[11px] font-cinzel font-bold text-[#5A3E10] uppercase tracking-wide">
                  Special Price Ends In:
                </span>
                <span className="ml-auto font-mono text-sm font-bold text-[#8C0000] bg-white px-2.5 py-0.5 rounded-lg border border-red-200 shadow-sm">
                  {mm}:{ss}
                </span>
              </div>

            </div>

            {/* Quantity Selector & Add to Cart Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-[#EAE0CD] rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-[#F6F1E7] text-[#2C2623] font-bold text-base flex items-center justify-center hover:bg-[#EAE0CD] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-cinzel font-bold text-[#2C2623]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-[#F6F1E7] text-[#2C2623] font-bold text-base flex items-center justify-center hover:bg-[#EAE0CD] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 sm:py-4 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 border border-[#C5A059]/40 transform hover:scale-[1.01] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>Add to Sacred Cart — ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>
            </div>

            {/* Accordion & Info Tabs */}
            <div className="border-t border-[#EAE0CD] pt-6 space-y-4">
              <div className="flex border-b border-[#EAE0CD] overflow-x-auto scrollbar-none gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-3 px-3 font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'border-[#C5A059] text-[#2C2623]'
                      : 'border-transparent text-gray-400 hover:text-[#2C2623]'
                  }`}
                >
                  Description & Features
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 px-3 font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'border-[#C5A059] text-[#2C2623]'
                      : 'border-transparent text-gray-400 hover:text-[#2C2623]'
                  }`}
                >
                  Specifications
                </button>
                {product.careInstructions && (
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-3 px-3 font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === 'care'
                        ? 'border-[#C5A059] text-[#2C2623]'
                        : 'border-transparent text-gray-400 hover:text-[#2C2623]'
                    }`}
                  >
                    Care & Maintenance
                  </button>
                )}
                {product.faqs && (
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`pb-3 px-3 font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === 'faqs'
                        ? 'border-[#C5A059] text-[#2C2623]'
                        : 'border-transparent text-gray-400 hover:text-[#2C2623]'
                    }`}
                  >
                    FAQs
                  </button>
                )}
              </div>

              {activeTab === 'description' && (
                <div className="text-xs text-[#5C5450] font-light leading-relaxed space-y-4">
                  <p className="text-sm font-sans text-[#2C2623]">{product.description}</p>
                  
                  {product.keyFeatures && (
                    <div className="space-y-2 pt-2">
                      <span className="font-cinzel text-xs font-bold text-[#8C6929] uppercase tracking-wider block">
                        Key Features & Highlights
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-xs text-[#4A4441]">
                        {product.keyFeatures.map((feat, i) => (
                          <li key={i} className="leading-normal">{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2 text-xs">
                  {product.specifications ? (
                    product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-[#EAE0CD]/60">
                        <span className="text-gray-500 font-cinzel font-medium">{spec.label}:</span>
                        <span className="font-bold text-[#2C2623] text-right ml-4">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-gray-500">Standard Vedic brassware specifications apply.</div>
                  )}
                  {selectedVariant && (
                    <div className="flex justify-between py-2 border-b border-[#EAE0CD]/60">
                      <span className="text-gray-500 font-cinzel font-medium">Selected Variant:</span>
                      <span className="font-bold text-[#C5A059]">{selectedVariant.weight}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'care' && product.careInstructions && (
                <div className="space-y-2 text-xs text-[#4A4441]">
                  <span className="font-cinzel text-xs font-bold text-[#8C6929] uppercase tracking-wider block mb-2">
                    Brass Care Guidelines
                  </span>
                  <ul className="space-y-2 list-disc list-inside font-sans leading-relaxed">
                    {product.careInstructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'faqs' && product.faqs && (
                <div className="space-y-3 text-xs">
                  {product.faqs.map((faq, i) => (
                    <div key={i} className="p-3 bg-[#FAF0D9]/50 rounded-xl border border-[#EAD7AF]">
                      <h4 className="font-cinzel font-bold text-[#2C2623] mb-1">Q: {faq.q}</h4>
                      <p className="text-[#5C5450] font-sans font-light leading-relaxed">A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ── Related Products Section ── */}
      <RelatedProducts
        currentProduct={product}
        allProducts={PRODUCTS}
        onSelectProduct={(p) => {
          // Navigate via hash — App.jsx parseHash handles it
          window.location.hash = `#/product/${p.id}`;
        }}
        onAddToCart={onAddToCart}
      />

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#1C1715] border-t border-[#C5A059]/40 z-30 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-cinzel text-[#C5A059] uppercase block font-semibold">Total Price</span>
          <span className="text-base font-cinzel font-bold text-white">₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-4 bg-[#C5A059] hover:bg-[#B58F47] text-[#171312] font-cinzel text-xs uppercase font-bold tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

/* ─── Related Products Sub-Component ───────────────────────────────────── */
const RelatedProducts = ({ currentProduct, allProducts, onSelectProduct, onAddToCart }) => {
  const [added, setAdded] = useState(null);

  const related = useMemo(() => {
    if (!currentProduct || !allProducts) return [];
    return allProducts
      .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 4);
  }, [currentProduct?.id, allProducts]);

  if (related.length === 0) return null;

  return (
    <section className="bg-[#F4EFE6] border-t border-[#EAE0CD] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#E0CEAA] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="text-[11px] font-cinzel font-bold text-[#755722] uppercase tracking-[0.2em]">
              You May Also Like
            </span>
          </div>
          <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#2C1F06] uppercase tracking-wide">
            Complete Your Sacred Collection
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {related.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;
            const isAdded = added === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#C5A059]/60 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square bg-[#F9F6F0] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/assets/Incense cover.jpg'; }}
                  />
                  {discount && (
                    <span className="absolute top-2 right-2 bg-[#8B0000] text-white text-[9px] font-cinzel font-bold px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-cinzel font-bold text-[#C5A059] uppercase tracking-wider block mb-0.5">
                      {product.categoryName || product.category}
                    </span>
                    <h3 className="font-cinzel font-semibold text-xs text-[#2C1F06] line-clamp-2 leading-snug group-hover:text-[#B8860B] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0E8DC]">
                    <div>
                      <span className="text-xs font-bold text-[#2C1F06]">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through ml-1">
                          ₹{product.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, 1);
                        setAdded(product.id);
                        setTimeout(() => setAdded(null), 1500);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-cinzel font-bold uppercase tracking-wide transition-all flex items-center gap-1 active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF5EB] text-[#755722] hover:bg-[#C5A059] hover:text-white border border-[#E0CEAA]'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                      {isAdded ? 'Added' : 'Add'}
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
