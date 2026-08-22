import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Collections } from './components/Collections';
import { Bestsellers } from './components/Bestsellers';
import { BrandStory } from './components/BrandStory';
import { ValueProps } from './components/ValueProps';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';
import { CategoryPage } from './components/CategoryPage';
import { CorporateGiftingPage } from './components/CorporateGiftingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { LenisProvider } from './components/LenisSmoothScroll';
import { MandirFeature } from './components/MandirFeature';
import { VisualGallery } from './components/VisualGallery';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MyOrdersPage } from './components/MyOrdersPage';
import { VideoShowcase } from './components/VideoShowcase';
import { QuickTrackSection } from './components/QuickTrackSection';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { RefundPolicyPage } from './components/RefundPolicyPage';
import { TermsPage } from './components/TermsPage';
import { HomePageDecorations } from './components/HomePageDecorations';
import { AboutUsPage } from './components/AboutUsPage';
import { AllCollectionsPage } from './components/AllCollectionsPage';

export function App() {
  // Page Routing & Active Category State
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'category' | 'gifting' | 'product' | 'support'
  const [selectedCategoryId, setSelectedCategoryId] = useState('incense');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Scroll Progress — direct DOM update (no setState = no re-render on every scroll)
  const progressBarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && progressBarRef.current) {
        const pct = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        progressBarRef.current.style.width = `${pct}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '120px 0px 120px 0px', // Triggers 120px before entering viewport for seamless mobile touch scrolling
      threshold: 0.01
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.smooth-reveal, .scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    // Mobile fallback timer: ensure all elements become visible
    const fallbackTimer = setTimeout(() => {
      elements.forEach((el) => el.classList.add('is-visible'));
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [currentPage]);

  const categoryDetailsMap = {
    incense: {
      id: 'incense',
      title: 'Incense & Dhoop',
      name: 'Incense & Dhoop',
      image: '/assets/Incense cover.jpg',
      description: 'Explore our complete artisanal collection of 100% natural, charcoal-free agarbatti sticks, organic dhoop cones, dhoop sticks, and sambrani cups.'
    },
    brass: {
      id: 'brass',
      title: 'Brass Articles',
      name: 'Brass Articles',
      image: '/brasshero.png',
      mobileImage: '/brassmobileview.png',
      fallbackImage: '/assets/brasscover.png',
      // object-position: mobile shows bottom-center where items cluster; desktop shows full wide scene
      mobilePosition: 'center 70%',
      desktopPosition: 'center 55%',
      description: 'Discover heirloom-quality Moradabad virgin brass diyas, thalis, puja bells, kamandalam, and ritual camphor burners.'
    },
    copper: {
      id: 'copper',
      title: 'Copper Articles',
      name: 'Copper Articles',
      image: '/copperhero.png',
      mobileImage: '/coppermobileview.png',
      fallbackImage: '/assets/Copper cover.png',
      // Copper kalash is center-frame, keep centered on both
      mobilePosition: 'center 40%',
      desktopPosition: 'center 45%',
      description: 'Hand-hammered 99.6% certified pure copper water pitchers, tumblers, and sacred Panchapatra vessels.'
    },
    kits: {
      id: 'kits',
      title: 'Corporate & Bulk Gifting',
      name: 'Corporate & Bulk Gifting',
      image: '/images/categories/gifting.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      description: 'Auspicious festive hampers, wedding favor caskets, and corporate gift hampers.'
    },
    yantras: {
      id: 'yantras',
      title: 'Custom & Handcrafted',
      name: 'Custom & Handcrafted',
      image: '/assets/handcrafted cover.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      description: 'Bespoke 24K gold plated brass yantras and custom-engraved temple idols.'
    },
    vastu: {
      id: 'vastu',
      title: 'Vastu & Spiritual',
      name: 'Vastu & Spiritual',
      image: '/assets/luxmiyantra/laxmi1.png',
      // Yantra is a square design — center perfectly on both
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      description: 'Consecrated 24K gold-plated Vastu Yantras, Mahalakshmi, Kuber, and crystal plaques for home & altar energy harmonization.'
    },
    'mandir-essentials': {
      id: 'mandir-essentials',
      title: 'Mandir Essentials',
      name: 'Mandir Essentials',
      image: '/essentialhero.png',
      mobileImage: '/mandiressentialmobileview.png',
      fallbackImage: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      // Mandir image — key items in center, show slightly higher on mobile
      mobilePosition: 'center 35%',
      desktopPosition: 'center 40%',
      description: 'Sacred Himalayan Rudraksha, Sphatik, Vrindavan Tulsi, Vaijanti & Karungali Japa Malas, wooden chowkis, brass dhoopdani, and puja accessories.'
    }
  };

  const [cartItems, setCartItems] = useState([
    {
      id: 'incense-no-bamboo-50',
      name: 'Agarbatti(without bamboo)(50 sticks)',
      price: 149,
      quantity: 2,
      purity: '100% Bamboo-Free & Charcoal-Free',
      image: '/assets/Incense cover.jpg',
      artType: 'incense'
    }
  ]);
  const [wishlistIds, setWishlistIds] = useState(['incense-no-bamboo-80', 'dhoop-cone-regular-40-pack2']);

  // Modals & Drawers State
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
  };

  // Cart Actions
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          purity: product.purity,
          image: product.image,
          artType: product.artType
        }
      ];
    });

    showToast('Added to Cart', `${product.name} added to your sacred cart.`, 'cart');
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('Removed from Wishlist', `${product.name} removed from saved items.`, 'wishlist');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('Saved to Wishlist', `${product.name} saved to your sacred wishlist.`, 'wishlist');
    }
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  // Hash-based URL Routing & Deep Link Sync
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'home') {
        setCurrentPage('home');
        return;
      }

      if (hash.startsWith('category/')) {
        const catId = hash.split('/')[1];
        if (catId) {
          setSelectedCategoryId(catId);
          setCurrentPage('category');
        }
      } else if (hash.startsWith('product/')) {
        const prodId = hash.split('/')[1];
        const prod = PRODUCTS.find((p) => String(p.id) === String(prodId));
        if (prod) {
          setSelectedProduct(prod);
          setCurrentPage('product');
        }
      } else if (hash === 'gifting') {
        setCurrentPage('gifting');
      } else if (hash === 'track-order' || hash === 'support') {
        setCurrentPage('support');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Navigation handlers for Multi-page view — Jump instantly to top (0,0)
  const resetScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    resetScrollToTop();
  }, [currentPage, selectedProduct?.id, selectedCategoryId]);

  const handleSelectCategory = (catId) => {
    if (catId === 'all') {
      setCurrentPage('home');
      window.location.hash = '#/home';
    } else if (catId === 'kits' || catId === 'gifting') {
      setCurrentPage('gifting');
      setSelectedCategoryId('kits');
      window.location.hash = '#/gifting';
    } else {
      setSelectedCategoryId(catId);
      setCurrentPage('category');
      window.location.hash = `#/category/${catId}`;
    }
    resetScrollToTop();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.location.hash = `#/product/${product.id}`;
    resetScrollToTop();
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    window.location.hash = '#/home';
    resetScrollToTop();
  };

  const handleGoSupport = () => {
    setCurrentPage('support');
    window.location.hash = '#/track-order';
    resetScrollToTop();
  };

  const handleGoPrivacy = () => {
    setCurrentPage('privacy');
    window.location.hash = '#/privacy-policy';
    resetScrollToTop();
  };

  const handleGoRefundPolicy = () => {
    setCurrentPage('refund-policy');
    window.location.hash = '#/refund-policy';
    resetScrollToTop();
  };

  const handleGoTerms = () => {
    setCurrentPage('terms');
    window.location.hash = '#/terms-and-conditions';
    resetScrollToTop();
  };

  return (
    <LenisProvider options={{ duration: 1.0, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true, syncTouch: true, touchMultiplier: 1.5 }}>
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#2C2623]">

        {/* Golden Top Scroll Progress Indicator */}
        <div ref={progressBarRef} className="scroll-progress-bar" style={{ width: '0%' }} />

        {/* Navigation */}
        <Navbar
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setCartOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          activeCategory={
            currentPage === 'home' ? 'all'
              : currentPage === 'gifting' ? 'kits'
                : currentPage === 'category' ? selectedCategoryId
                  : 'all'
          }
          onSelectCategory={handleSelectCategory}
          onGoHome={handleGoHome}
          onGoSupport={handleGoSupport}
        />

        {/* Main Content Pages */}
        <main className="flex-1">
          {currentPage === 'terms' ? (
            /* Dedicated Terms & Conditions Page */
            <TermsPage onBackToHome={handleGoHome} />
          ) : currentPage === 'privacy' ? (
            /* Dedicated Privacy Policy Page */
            <PrivacyPolicyPage onBackToHome={handleGoHome} />
          ) : currentPage === 'refund-policy' ? (
            /* Dedicated Refund & Cancellation Policy Page */
            <RefundPolicyPage onBackToHome={handleGoHome} />
          ) : currentPage === 'about' ? (
            /* Dedicated About Us Page */
            <AboutUsPage onBackToHome={handleGoHome} />
          ) : currentPage === 'all-collections' ? (
            /* All Products — Category-wise listing */
            <AllCollectionsPage
              products={PRODUCTS}
              categories={CATEGORIES}
              onBackToHome={handleGoHome}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onSelectCategory={handleSelectCategory}
            />
          ) : currentPage === 'support' || currentPage === 'my-orders' ? (
            /* Dedicated My Orders & Returns Portal */
            <MyOrdersPage onBackToHome={handleGoHome} />
          ) : currentPage === 'product' ? (
            /* Dedicated Product Details Page View */
            <ProductDetailPage
              product={selectedProduct}
              onBackToCategory={() => setCurrentPage('category')}
              onBackToHome={handleGoHome}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={selectedProduct && wishlistIds.includes(selectedProduct.id)}
              showToast={showToast}
            />
          ) : currentPage === 'gifting' ? (
            /* Dedicated Corporate Gifting & Bulk Enquiry Page View */
            <CorporateGiftingPage
              onBackToHome={handleGoHome}
              showToast={showToast}
            />
          ) : currentPage === 'category' ? (
            /* Dedicated Category Page View */
            <CategoryPage
              category={categoryDetailsMap[selectedCategoryId] || {
                id: selectedCategoryId,
                title: selectedCategoryId.toUpperCase(),
                name: selectedCategoryId.toUpperCase(),
                image: '/assets/Incense cover.jpg',
                description: 'Sacred collection'
              }}
              categories={CATEGORIES}
              products={PRODUCTS}
              onBackToHome={handleGoHome}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onOpenQuickView={(product) => setQuickViewProduct(product)}
              onSelectProduct={handleSelectProduct}
            />
          ) : (
            /* ── Premium Minimal Homepage ── */
            <>
              {/* 1. Hero — full-width image carousel with minimal text */}
              <Hero
                onExploreClick={() => {
                  setCurrentPage('all-collections');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onRitualsClick={() => handleSelectCategory('mandir-essentials')}
              />


              {/* 2. Trust Strip — immediately below hero */}
              <ValueProps />

              {/* 3. Shop by Collection — 4 large visual cards */}
              <div className="smooth-reveal">
                <Collections onSelectCategory={handleSelectCategory} />
              </div>

              {/* 4. Most Loved Products — Glass Shivling, Nandi Bell, Brass Pyramid, Copper Kalash */}
              <div className="smooth-reveal">
                <Bestsellers
                  products={['vastu-crystal-glass-shivling', 'brass-bell-nandi', 'vastu-brass-pyramid-multitier', 'copper-kalash-pooja-vessel']
                    .map(id => PRODUCTS.find(p => p.id === id))
                    .filter(Boolean)}
                  heading="Most Loved"
                  limit={4}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  onOpenQuickView={(product) => setQuickViewProduct(product)}
                  onSelectProduct={handleSelectProduct}
                />
              </div>

              {/* 5. Mandir Essentials Editorial Feature */}
              <div className="smooth-reveal">
                <MandirFeature
                  onExplore={() => handleSelectCategory('mandir-essentials')}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                />
              </div>



              {/* 7. Brand Story */}
              <div id="brand-story" className="smooth-reveal">
                <BrandStory onDiscover={() => { }} />
              </div>

              {/* 8. Corporate Gifting Section */}
              <div className="smooth-reveal">
                <section className="py-14 sm:py-20 bg-[#1C1715] text-white relative overflow-hidden">
                  {/* Background image */}
                  <img
                    src="/copperatepcview.png"
                    alt="Corporate Gifting"
                    className="block sm:hidden absolute inset-0 w-full h-full object-cover opacity-25 hero-image-crisp"
                    style={{ objectPosition: 'center center' }}
                  />
                  <img
                    src="/copperatepcview.png"
                    alt="Corporate Gifting"
                    className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-20 hero-image-crisp"
                    style={{ objectPosition: 'center center' }}
                  />
                  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                      <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#C5A059] uppercase mb-4">Corporate & Bulk</p>
                      <h2 className="font-cinzel font-bold text-white leading-tight mb-5" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.75rem)' }}>
                        Thoughtful Gifts.<br />Meaningful Impact.
                      </h2>
                      <p className="text-sm text-white/70 font-light leading-relaxed mb-8 max-w-md">
                        Curated spiritual and lifestyle gifts for teams, clients, celebrations, and special occasions.
                      </p>
                      {/* Benefit badges */}
                      <div className="flex flex-wrap gap-3 mb-10">
                        {['Bulk Orders', 'Custom Packaging', 'Customisation'].map((b) => (
                          <span key={b} className="px-4 py-1.5 border border-[#C5A059]/40 text-[#D4B896] text-[10px] font-cinzel tracking-widest uppercase rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSelectCategory('kits')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-[#1C1715] text-xs font-cinzel font-bold tracking-widest uppercase rounded hover:bg-[#E5C378] transition-all duration-300 active:scale-95 group"
                      >
                        Explore Corporate Gifting
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* 9. Brand Landscape Banner — Animated Sacred Aura & Dynamic Elements */}
              <div className="smooth-reveal">
                <section
                  className="relative w-full overflow-hidden select-none"
                  style={{
                    background: 'linear-gradient(135deg, #B87A08 0%, #D89218 30%, #F5BA28 55%, #E59F12 80%, #C4820A 100%)',
                    minHeight: 'clamp(160px, 25vw, 260px)',
                  }}
                >
                  {/* 1. Moving Background Pattern (Continuous Slow Pan) */}
                  <div
                    className="absolute inset-0 opacity-[0.09] pointer-events-none animate-bg-pan-slow"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='40' cy='40' r='12' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Ccircle cx='40' cy='40' r='22' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='34' stroke='%23ffffff' stroke-width='0.3' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '80px 80px',
                    }}
                  />

                  {/* 2. Sweeping Light Sheen (Shimmer Beam across banner) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-1/3 h-[200%] absolute -top-1/2 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-lg animate-golden-shimmer-sweep pointer-events-none" />
                  </div>

                  {/* 3. Floating Golden Dust Particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] left-[12%] w-2.5 h-2.5 bg-white/70 rounded-full blur-[1px] animate-float-sparkle-1" />
                    <div className="absolute top-[65%] left-[30%] w-2 h-2 bg-yellow-100/80 rounded-full blur-[1px] animate-float-sparkle-2" />
                    <div className="absolute top-[25%] left-[55%] w-3 h-3 bg-white/60 rounded-full blur-[1px] animate-float-sparkle-1" style={{ animationDelay: '1.5s' }} />
                    <div className="absolute top-[70%] left-[78%] w-2 h-2 bg-amber-100/90 rounded-full blur-[1px] animate-float-sparkle-2" style={{ animationDelay: '2.5s' }} />
                    <div className="absolute top-[15%] left-[88%] w-2.5 h-2.5 bg-white/75 rounded-full blur-[1px] animate-float-sparkle-1" style={{ animationDelay: '3.2s' }} />
                  </div>

                  {/* 4. Rotating Sacred Sun Mandala (Aura behind the Logo) */}
                  <div className="absolute left-[2%] sm:left-[4%] lg:left-[6%] top-1/2 -translate-y-1/2 pointer-events-none opacity-25 animate-spin-slow">
                    <svg className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px] text-white" viewBox="0 0 200 200" fill="currentColor">
                      <g transform="translate(100,100)">
                        <circle r="90" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                        <circle r="78" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle r="65" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        {[...Array(12)].map((_, i) => (
                          <path key={i} d="M 0,-65 Q 12,-40 0,-15 Q -12,-40 0,-65" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 30})`} />
                        ))}
                        {[...Array(24)].map((_, i) => (
                          <circle key={i} cx={78 * Math.cos((i * 15 * Math.PI) / 180)} cy={78 * Math.sin((i * 15 * Math.PI) / 180)} r="2" fill="currentColor" />
                        ))}
                      </g>
                    </svg>
                  </div>

                  {/* 5. Rotating Sacred Mandala (Aura behind OM Symbol on Right) */}
                  <div className="absolute right-[2%] sm:right-[5%] lg:right-[8%] top-1/2 -translate-y-1/2 pointer-events-none opacity-20 animate-spin-reverse-slow hidden sm:block">
                    <svg className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[290px] lg:h-[290px] text-white" viewBox="0 0 200 200" fill="currentColor">
                      <g transform="translate(100,100)">
                        <circle r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        <circle r="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        {[...Array(16)].map((_, i) => (
                          <path key={i} d="M 0,-70 C 10,-50 10,-30 0,-10 C -10,-30 -10,-50 0,-70" fill="none" stroke="currentColor" strokeWidth="0.9" transform={`rotate(${i * 22.5})`} />
                        ))}
                      </g>
                    </svg>
                  </div>

                  {/* Inner layout — logo left, text center, deco right */}
                  <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 gap-4">

                    {/* LEFT — Clean logo without any border or background wrapper */}
                    <div className="flex-shrink-0 flex items-center relative">
                      <img
                        src="/assets/Logo/CURRENT LOGO.png"
                        alt="Shraviko Sacred Living"
                        className="rounded-full object-contain drop-shadow-xl relative z-10 transition-transform duration-500 hover:scale-105"
                        style={{
                          width: 'clamp(120px, 18vw, 220px)',
                          height: 'clamp(120px, 18vw, 220px)',
                          aspectRatio: '1 / 1',
                        }}
                      />
                    </div>

                    {/* CENTER — Big & Bold Message (Guaranteed 2 Lines) */}
                    <div className="flex-1 text-center px-1 sm:px-4">
                      <h2
                        className="font-cinzel font-extrabold text-white leading-tight tracking-wider uppercase drop-shadow-lg sm:whitespace-nowrap"
                        style={{
                          fontSize: 'clamp(0.85rem, 2.7vw, 2.2rem)',
                          textShadow: '2px 4px 10px rgba(80,35,0,0.45)',
                        }}
                      >
                        From Daily Pooja to Festive Rituals
                      </h2>
                      <p
                        className="font-cinzel font-black text-[#FFF8E7] tracking-[0.25em] uppercase mt-1 sm:mt-2 drop-shadow-md sm:whitespace-nowrap"
                        style={{
                          fontSize: 'clamp(0.95rem, 3.2vw, 2.4rem)',
                          textShadow: '2px 4px 12px rgba(80,35,0,0.55)',
                        }}
                      >
                        WE HAVE IT ALL
                      </p>
                    </div>

                    {/* RIGHT — Decorative OM / Sacred symbol with breathing pulse animation */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center text-white/40 font-serif select-none hidden sm:flex animate-sacred-om-pulse"
                      style={{ fontSize: 'clamp(48px, 10vw, 110px)', lineHeight: 1 }}
                    >
                      ॐ
                    </div>

                  </div>
                </section>
              </div>

              {/* 10. Video Reels — Artisan Stories & Craft in Motion */}
              <div className="smooth-reveal">
                <VideoShowcase />
              </div>





            </>
          )}
        </main>

        {/* Footer with bottom padding on mobile for sticky nav */}
        <div className="pb-16 md:pb-0">
          <Footer
            onSelectCategory={handleSelectCategory}
            onGoSupport={handleGoSupport}
            onGoPrivacy={handleGoPrivacy}
            onGoRefundPolicy={handleGoRefundPolicy}
            onGoTerms={handleGoTerms}
            onGoAbout={() => setCurrentPage('about')}
          />
        </div>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <MobileBottomNav
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          wishlistCount={wishlistIds.length}
          onGoHome={handleGoHome}
          onOpenCategories={() => {
            handleSelectCategory('brass');
          }}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* Slide-out Cart Drawer */}
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onProceedToCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />

        {/* Wishlist Drawer */}
        <WishlistDrawer
          isOpen={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlistProducts={wishlistProducts}
          onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((wId) => wId !== id))}
          onAddToCart={handleAddToCart}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          products={PRODUCTS}
          onOpenQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={handleAddToCart}
        />

        {/* Quick View Product Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        />

        {/* Checkout Simulator Modal */}
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cartItems={cartItems}
          onClearCart={handleClearCart}
        />

        {/* Toast Notification Container */}
        <Toast toast={toast} onClose={() => setToast(null)} />

      </div>
    </LenisProvider>
  );
}

export default App;
