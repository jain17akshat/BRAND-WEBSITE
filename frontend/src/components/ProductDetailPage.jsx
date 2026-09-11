import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Sparkles, Check, ChevronRight, Flame, Clock, Eye, Zap, FileText, Sliders, Shield, HelpCircle, CheckCircle2, Info } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { ProductDetailSkeleton } from './Skeleton';
import { SafeImage } from './SafeImage';
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
    let cleanName = product.name;
    if (selectedVariant && selectedVariant.weight) {
      const w = selectedVariant.weight.trim();
      if (!cleanName.toLowerCase().includes(w.toLowerCase()) && !cleanName.includes('15×15')) {
        cleanName = `${cleanName} (${w})`;
      }
    }
    const itemToAdd = selectedVariant
      ? {
          ...product,
          id: `${product.id}-${selectedVariant.weight.replace(/\s+/g, '')}`,
          name: cleanName,
          price: selectedVariant.price,
          originalPrice: selectedVariant.originalPrice,
          selectedWeight: selectedVariant.weight
        }
      : product;

    onAddToCart(itemToAdd, quantity);
  };

  const handleBack = () => {
    if (window.history && window.history.length > 1) {
      window.history.back();
    } else if (onBackToCategory) {
      onBackToCategory(product?.category);
    } else {
      onBackToHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24 text-[#2C2623]">
      
      {/* Top Header Navigation Bar */}
      <div className="bg-[#1C1715] border-b border-[#3A322C] pt-24 sm:pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-cinzel tracking-wider text-[#C5A059] uppercase overflow-x-auto scrollbar-none">
            <button onClick={onBackToHome} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <button onClick={() => onBackToCategory?.(product.category)} className="hover:text-white transition-colors cursor-pointer">
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
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] transition-all shadow-md active:scale-95 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
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
                        <SafeImage
                          src={img}
                          alt={`View ${idx + 1}`}
                          containerClassName="w-full h-full"
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
              </div>

              <h1 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#2C2623] leading-snug">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#755722] font-cinzel font-semibold flex items-center gap-1.5 pt-1">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>{product.purity || '100% Pure Virgin Brass'}</span>
              </p>
            </div>

            {/* Price Showcase / Coming Soon */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAE0CD] flex items-center justify-between shadow-sm">
              {product.isComingSoon ? (
                <div>
                  <span className="text-xs text-gray-500 font-cinzel block mb-0.5">Availability</span>
                  <span className="text-xl sm:text-2xl font-cinzel font-bold text-[#8C6D2D] uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-gray-500 font-cinzel block mb-0.5">Special Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-sans font-bold text-[#2C2623]">
                      ₹{(currentPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {currentOrigPrice && (
                      <span className="text-base font-sans text-gray-400 line-through">
                        ₹{currentOrigPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Delivery Timeline + Urgency (Above the Fold) ── */}
            {!product.isComingSoon && (
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

                {/* Brand Assurance Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Heritage Craft */}
                  <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EAE0CD]">
                    <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#9B7E52]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-cinzel font-bold text-[#2C2623] block uppercase tracking-wider">
                        Heritage Craft
                      </span>
                      <span className="text-[9px] text-[#6B5840] font-sans">100% Solid & Sacred</span>
                    </div>
                  </div>

                  {/* Express Delivery */}
                  <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EAE0CD]">
                    <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9B7E52]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-cinzel font-bold text-[#2C2623] block uppercase tracking-wider">
                        Secure Transit
                      </span>
                      <span className="text-[9px] text-[#6B5840] font-sans">Insured & Express Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Actions */}
            {product.isComingSoon ? (
              <div className="pt-2">
                <button
                  disabled
                  className="w-full py-4 bg-[#C5A059]/20 text-[#8C6D2D] font-cinzel text-xs sm:text-sm uppercase font-bold tracking-widest rounded-xl border border-[#C5A059]/40 cursor-not-allowed text-center shadow-inner"
                >
                  Collection Launching Soon
                </button>
              </div>
            ) : (
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
                    <span>Add to Sacred Cart — ₹{((currentPrice || 0) * quantity).toLocaleString('en-IN')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Accordion & Info Tabs */}
            <div className="border-t border-[#EAE0CD] pt-6 space-y-4">
              {/* Tab Navigation */}
              <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EAE0CD]/80 shadow-inner flex flex-wrap sm:flex-nowrap gap-1.5">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'bg-[#2C2623] text-[#D4AF37] shadow-md scale-[1.01]'
                      : 'text-[#6E645E] hover:text-[#2C2623] hover:bg-white/70'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'description' ? 'text-[#D4AF37]' : 'text-[#8C6929]'}`} />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'bg-[#2C2623] text-[#D4AF37] shadow-md scale-[1.01]'
                      : 'text-[#6E645E] hover:text-[#2C2623] hover:bg-white/70'
                  }`}
                >
                  <Sliders className={`w-3.5 h-3.5 ${activeTab === 'specs' ? 'text-[#D4AF37]' : 'text-[#8C6929]'}`} />
                  <span>Specs</span>
                </button>

                {product.careInstructions && (
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'care'
                        ? 'bg-[#2C2623] text-[#D4AF37] shadow-md scale-[1.01]'
                        : 'text-[#6E645E] hover:text-[#2C2623] hover:bg-white/70'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${activeTab === 'care' ? 'text-[#D4AF37]' : 'text-[#8C6929]'}`} />
                    <span>Care</span>
                  </button>
                )}

                {product.faqs && (
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl font-cinzel text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'faqs'
                        ? 'bg-[#2C2623] text-[#D4AF37] shadow-md scale-[1.01]'
                        : 'text-[#6E645E] hover:text-[#2C2623] hover:bg-white/70'
                    }`}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'faqs' ? 'text-[#D4AF37]' : 'text-[#8C6929]'}`} />
                    <span>FAQs</span>
                  </button>
                )}
              </div>

              {/* Tab Contents Card */}
              <div className="p-5 sm:p-6 bg-gradient-to-b from-[#FAF7F2]/60 to-white rounded-2xl border border-[#EAE0CD]/80 shadow-sm transition-all duration-300">
                {activeTab === 'description' && (
                  <div className="space-y-5 animate-fadeIn">
                    <p className="text-sm font-sans text-[#3D3531] leading-relaxed border-l-2 border-[#C5A059] pl-3.5 py-0.5 italic bg-[#FAF3E8]/50 rounded-r-lg">
                      {product.description}
                    </p>

                    {product.keyFeatures && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#8C6929]" />
                          <span className="font-cinzel text-xs font-bold text-[#8C6929] uppercase tracking-wider">
                            Key Features & Highlights
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {product.keyFeatures.map((feat, i) => (
                            <div 
                              key={i} 
                              className="p-3 rounded-xl bg-white border border-[#EAE0CD]/90 shadow-xs hover:border-[#C5A059]/50 transition-all flex items-start gap-2.5 group"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#8C6929] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8C6929] group-hover:text-white transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs text-[#3D3531] font-sans leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.specifications ? (
                        product.specifications.map((spec, i) => {
                          const isLongValue = (spec.value && spec.value.length > 25) || (spec.label && spec.label.length > 20);
                          return (
                            <div 
                              key={i} 
                              className={`p-3.5 rounded-xl bg-white border border-[#EAE0CD]/90 shadow-xs flex items-center justify-between gap-3 hover:border-[#C5A059]/40 transition-colors ${
                                isLongValue ? 'col-span-1 sm:col-span-2' : 'col-span-1'
                              }`}
                            >
                              <span className="text-[11px] text-[#7A6B63] font-cinzel font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                                {spec.label}
                              </span>
                              <span className="font-bold text-[#2C2623] text-xs font-sans bg-[#FAF3E8] px-3 py-1.5 rounded-lg border border-[#EAD7AF]/60 text-right whitespace-nowrap shrink-0 overflow-x-auto scrollbar-none">
                                {spec.value}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-4 text-center text-xs text-gray-500 italic">
                          Standard Sacred Vedic brassware specifications apply.
                        </div>
                      )}
                      {selectedVariant && (
                        <div className="p-3.5 rounded-xl bg-[#FAF3E8] border border-[#EAD7AF] shadow-xs flex items-center justify-between gap-3 col-span-1 sm:col-span-2">
                          <span className="text-[11px] text-[#8C6929] font-cinzel font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">Selected Option</span>
                          <span className="font-bold text-[#2C2623] text-xs font-sans bg-white px-3 py-1.5 rounded-lg border border-[#EAD7AF]/60 text-right whitespace-nowrap">{selectedVariant.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'care' && product.careInstructions && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-[#8C6929]" />
                      <span className="font-cinzel text-xs font-bold text-[#8C6929] uppercase tracking-wider">
                        Sacred Maintenance Guidelines
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {product.careInstructions.map((step, i) => (
                        <div 
                          key={i} 
                          className="p-3 rounded-xl bg-white border border-[#EAE0CD]/90 shadow-xs flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#2C2623] text-[#D4AF37] font-cinzel font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <p className="text-xs text-[#3D3531] font-sans leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faqs' && product.faqs && (
                  <div className="space-y-3 animate-fadeIn">
                    {product.faqs.map((faq, i) => (
                      <div 
                        key={i} 
                        className="p-4 bg-white rounded-xl border border-[#EAE0CD] shadow-xs space-y-2 hover:border-[#C5A059]/40 transition-all"
                      >
                        <h4 className="font-cinzel font-bold text-[#2C2623] text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#8C6929]/15 text-[#8C6929] font-bold text-[10px] flex items-center justify-center shrink-0">Q</span>
                          {faq.q}
                        </h4>
                        <p className="text-[#5C5450] font-sans text-xs leading-relaxed pl-7 border-l-2 border-[#FAF0D9]">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
      {!product.isComingSoon && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#1C1715] border-t border-[#C5A059]/40 z-30 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-cinzel text-[#C5A059] uppercase block font-semibold">Total Price</span>
            <span className="text-base font-cinzel font-bold text-white">₹{((currentPrice || 0) * quantity).toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-4 bg-[#C5A059] hover:bg-[#B58F47] text-[#171312] font-cinzel text-xs uppercase font-bold tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      )}
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
    <section className="bg-[#FBF9F5] border-t border-[#EAE0CD] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
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
