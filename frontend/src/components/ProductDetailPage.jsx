import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Sparkles, Check, ChevronRight, Flame, Clock, Eye, Zap, FileText, Sliders, Shield, HelpCircle, CheckCircle2, Info } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { ProductCard } from './ProductCard';
import { ProductDetailSkeleton } from './Skeleton';
import { SafeImage } from './SafeImage';
import { PRODUCTS } from '../data/products';
import { JsonLd } from './JsonLd';

export const ProductDetailPage = ({
  product,
  onBackToCategory,
  onBackToHome,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  showToast,
  onSelectProduct
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
  const [addedFeedback, setAddedFeedback] = useState(false);

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

      // Dynamic preload link for high priority LCP image
      const primaryImg = product.image || (product.images && product.images[0]);
      if (primaryImg) {
        let link = document.querySelector('link[data-lcp-preload="true"]');
        if (!link) {
          link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.setAttribute('data-lcp-preload', 'true');
          document.head.appendChild(link);
        }
        link.href = primaryImg;
        link.setAttribute('fetchpriority', 'high');
      }

      // Background preload for other gallery thumbnails
      if (product.images && product.images.length > 0) {
        product.images.forEach((imgUrl) => {
          if (imgUrl) {
            const img = new Image();
            img.src = imgUrl;
          }
        });
      }

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
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
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `https://shraviko.com/product/${product.id}`,
    image: product.image ? [`https://shraviko.com${product.image}`] : (product.images ? product.images.map(img => `https://shraviko.com${img}`) : []),
    description: product.metaDescription || product.shortDescription || (product.description ? product.description.substring(0, 160) : ''),
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'SHRAVIKO'
    },
    offers: {
      '@type': 'Offer',
      url: `https://shraviko.com/product/${product.id}`,
      priceCurrency: 'INR',
      price: currentPrice || product.price,
      priceValidUntil: '2027-12-31',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'SHRAVIKO'
      }
    },
    ...(product.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount || 12,
        bestRating: '5',
        worstRating: '1'
      }
    } : {})
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://shraviko.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.categoryName || 'Collection',
        item: `https://shraviko.com/category/${product.category}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://shraviko.com/product/${product.id}`
      }
    ]
  };

  const faqSchema = product.faqs && product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q || faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a || faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C221E] font-manrope">
      <JsonLd data={[productSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]} />
      
      {/* Top Header Navigation Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#EAE0CD] pt-24 sm:pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-manrope font-medium text-[#6B5E57] overflow-x-auto scrollbar-none">
            <button onClick={onBackToHome} className="hover:text-[#57324F] transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8988F]" />
            <button onClick={() => onBackToCategory?.(product.category)} className="hover:text-[#57324F] transition-colors cursor-pointer">
              {product.categoryName || 'Collection'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8988F]" />
            <span className="text-[#2C221E] font-semibold line-clamp-1">{product.name}</span>
          </div>

        </div>
      </div>

      {/* Main Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FBEAE5] text-[#57324F] font-manrope text-xs font-semibold tracking-wide rounded-[12px] border border-[#57324F]/30 hover:border-[#57324F] transition-all shadow-xs active:scale-95 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#57324F] group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image Frame */}
            <div className={`relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-[#EAE0CD] ${
              product.imageBackground === 'white'
                ? 'bg-white'
                : product.imageBackground === 'transparent'
                ? 'bg-[#FAF6EC]'
                : 'bg-[#FAF7F2]'
            }`}>
              <ProductImage
                src={activeImg}
                alt={product.name}
                artType={product.artType}
                fitMode={product.fitMode || "contain"}
                aspect="aspect-square"
                imageBackground={product.imageBackground}
                silhouetteShadow={product.imageBackground === 'transparent'}
                className="w-full h-full p-2 sm:p-4"
                priority={true}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                        aria-label={`View product image ${idx + 1}`}
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
                <span className="text-[11px] font-manrope uppercase tracking-[0.2em] text-[#8C7A70] font-semibold">
                  {product.categoryName || 'Sacred Collection'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-fraunces font-medium text-[#2C221E] leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#6B5E57] font-manrope font-medium flex items-center gap-1.5 pt-1">
                <Sparkles className="w-4 h-4 text-[#57324F]" />
                <span>{product.purity || '100% Pure Virgin Brass'}</span>
              </p>
            </div>

            {/* Price Showcase / Coming Soon */}
            <div className="p-4 bg-white rounded-2xl border border-[#EAE0CD] flex items-center justify-between shadow-xs">
              {product.isComingSoon ? (
                <div>
                  <span className="text-xs text-[#8C7A70] font-manrope block mb-0.5">Availability</span>
                  <span className="text-xl sm:text-2xl font-fraunces font-medium text-[#57324F] tracking-tight">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-[#8C7A70] font-manrope block mb-0.5">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-manrope font-bold text-[#2C221E]">
                      ₹{(currentPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {currentOrigPrice && (
                      <span className="text-base font-manrope text-[#8C7A70] line-through font-normal">
                        ₹{currentOrigPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Weight / Variant Selector Chips */}
            {product.weightVariants && product.weightVariants.length > 0 && !product.isComingSoon && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-manrope font-semibold text-[#4A3E39] uppercase tracking-wider">
                    Select Option:
                  </span>
                  <span className="text-xs font-manrope font-bold text-[#57324F]">
                    {selectedVariant?.weight}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.weightVariants.map((variant, i) => {
                    const isSelected = selectedVariant?.weight === variant.weight;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2.5 rounded-[12px] text-xs font-manrope font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#57324F] text-white border-[#57324F] shadow-xs'
                            : 'bg-white text-[#2C221E] border-[#EAE0CD] hover:border-[#57324F]/50 hover:bg-[#FBEAE5]/30'
                        }`}
                      >
                        <span>{variant.weight}</span>
                        {variant.price && (
                          <span className={`ml-1.5 text-[11px] ${isSelected ? 'text-white/85' : 'text-[#8C7A70]'}`}>
                            ₹{variant.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Delivery Timeline + Assurance (Above the Fold) ── */}
            {!product.isComingSoon && (
              <div className="space-y-2.5">
                {/* Delivery Timeline */}
                <div className="flex items-center gap-3 p-3 bg-[#EBF2EB]/50 rounded-xl border border-[#C5D9C5]">
                  <div className="w-8 h-8 rounded-full bg-[#3B7A57]/15 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-[#3B7A57]" />
                  </div>
                  <div>
                    <span className="text-xs font-manrope font-semibold text-[#2C221E] block">
                      Estimated Delivery: 3–5 Business Days
                    </span>
                    <span className="text-[11px] text-[#3B7A57] font-manrope font-medium">
                      Free shipping on orders above ₹999 · Pan-India Express Delivery
                    </span>
                  </div>
                </div>

                {/* Brand Assurance Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Heritage Craft */}
                  <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EAE0CD]">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#EAE0CD] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#57324F]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-manrope font-bold text-[#2C221E] block uppercase tracking-wider">
                        Heritage Craft
                      </span>
                      <span className="text-[10px] text-[#8C7A70] font-manrope">100% Solid & Sacred</span>
                    </div>
                  </div>

                  {/* Express Delivery */}
                  <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EAE0CD]">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#EAE0CD] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#57324F]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-manrope font-bold text-[#2C221E] block uppercase tracking-wider">
                        Secure Transit
                      </span>
                      <span className="text-[10px] text-[#8C7A70] font-manrope">Insured Express Courier</span>
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
                  className="w-full min-h-[50px] py-3.5 bg-[#FAF7F2] text-[#8C7A70] font-manrope text-xs sm:text-sm font-semibold rounded-[12px] border border-[#EAE0CD] cursor-not-allowed text-center"
                >
                  Collection Launching Soon
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-manrope font-semibold text-[#4A3E39] uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-[#EAE0CD] rounded-[12px] bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2C221E] font-bold text-base flex items-center justify-center hover:bg-[#EAE0CD] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-manrope font-bold text-[#2C221E]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2C221E] font-bold text-base flex items-center justify-center hover:bg-[#EAE0CD] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    aria-label={addedFeedback ? "Added to cart" : "Add to cart"}
                    className={`flex-1 min-h-[50px] py-3.5 px-6 font-manrope text-sm font-semibold rounded-[12px] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 ${
                      addedFeedback
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#57324F] hover:bg-[#42253C] text-white'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-5 h-5 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Cart — ₹{((currentPrice || 0) * quantity).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Accordion & Info Tabs */}
            <div className="border-t border-[#EAE0CD] pt-6 space-y-4">
              {/* Tab Navigation */}
              <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EAE0CD] flex flex-wrap sm:flex-nowrap gap-1.5">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-manrope text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'bg-[#57324F] text-white shadow-xs'
                      : 'text-[#6B5E57] hover:text-[#57324F] hover:bg-white/70'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'description' ? 'text-white' : 'text-[#57324F]'}`} />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-manrope text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'bg-[#57324F] text-white shadow-xs'
                      : 'text-[#6B5E57] hover:text-[#57324F] hover:bg-white/70'
                  }`}
                >
                  <Sliders className={`w-3.5 h-3.5 ${activeTab === 'specs' ? 'text-white' : 'text-[#57324F]'}`} />
                  <span>Specs</span>
                </button>

                {product.careInstructions && (
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-manrope text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'care'
                        ? 'bg-[#57324F] text-white shadow-xs'
                        : 'text-[#6B5E57] hover:text-[#57324F] hover:bg-white/70'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${activeTab === 'care' ? 'text-white' : 'text-[#57324F]'}`} />
                    <span>Care</span>
                  </button>
                )}

                {product.faqs && (
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl font-manrope text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'faqs'
                        ? 'bg-[#57324F] text-white shadow-xs'
                        : 'text-[#6B5E57] hover:text-[#57324F] hover:bg-white/70'
                    }`}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'faqs' ? 'text-white' : 'text-[#57324F]'}`} />
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
          if (onSelectProduct) {
            onSelectProduct(p);
          } else {
            window.history.pushState(null, '', `/product/${p.id}`);
            window.dispatchEvent(new Event('popstate'));
          }
        }}
        onAddToCart={onAddToCart}
      />

      {/* Mobile Sticky Bottom Purchase Bar */}
      {!product.isComingSoon && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#FAF7F2]/95 border-t border-[#EAE0CD] z-30 shadow-lg flex items-center justify-between gap-3 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-manrope text-[#8C7A70] uppercase block font-semibold">Total Price</span>
            <span className="text-base font-manrope font-bold text-[#2C221E]">₹{((currentPrice || 0) * quantity).toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 min-h-[46px] py-2.5 px-4 bg-[#57324F] hover:bg-[#42253C] text-white font-manrope text-xs font-semibold rounded-[12px] shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
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
    <section className="bg-white border-t border-[#EAE0CD] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE0CD] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#57324F]" />
            <span className="text-[11px] font-manrope font-semibold text-[#57324F] uppercase tracking-[0.18em]">
              You May Also Like
            </span>
          </div>
          <h2 className="font-fraunces font-medium text-2xl sm:text-3xl text-[#2C221E]">
            Complete Your Sacred Collection
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {related.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
              onAddToCart={(p) => onAddToCart(p, 1)}
              onToggleWishlist={onToggleWishlist}
              priority={idx < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
