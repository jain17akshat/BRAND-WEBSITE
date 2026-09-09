import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, ShoppingCart, Menu, X, Truck, Sparkles } from 'lucide-react';

const logoUrl = '/assets/Logo/CURRENT LOGO.png';

export const Navbar = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  onGoHome,
  onGoSupport,
  hideNavbar = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);

      if (currentY > 100) {
        if (currentY > lastScrollY.current + 5) {
          setIsVisible(false);
        } else if (currentY < lastScrollY.current - 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', category: 'all' },
    { label: 'Metalware', category: 'metalware' },
    { label: 'Mandir Essentials', category: 'mandir-essentials' },
    { label: 'Energy Stones', category: 'energy-stones' },
    { label: 'Incense & Dhoop', category: 'incense' },
    { label: 'Vastu & Spiritual', category: 'vastu' },
    { label: 'Corporate Gifting', category: 'kits' },
  ];

  return (
    <>
      {/* Premium Luxury Aura & Styling for brand text */}
      <style>{`
        @keyframes goldAuraPulse {
          0%, 100% {
            text-shadow: 0 0 8px rgba(197, 160, 89, 0.25), 0 0 16px rgba(197, 160, 89, 0.1);
          }
          50% {
            text-shadow: 0 0 14px rgba(197, 160, 89, 0.45), 0 0 24px rgba(197, 160, 89, 0.2);
          }
        }
        .nav-brand-effect {
          font-family: 'Cinzel Decorative', 'Cinzel', serif;
          color: #2C1F06;
          transition: all 0.4s ease;
          animation: goldAuraPulse 4s ease-in-out infinite;
        }
        .group:hover .nav-brand-effect,
        .nav-brand-effect:hover {
          color: #8C6D2D;
          text-shadow: 0 0 16px rgba(197, 160, 89, 0.6), 0 0 28px rgba(212, 175, 55, 0.35);
        }
      `}</style>
      {/* ── Solid Premium Luxury Header with Curved Corners (100% Non-Transparent) ── */}
      <header
        className={`fixed top-2 sm:top-3.5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${(isVisible && !hideNavbar) ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        style={{ pointerEvents: (isVisible && !hideNavbar) ? 'auto' : 'none' }}
      >
        {/* Solid White Floating Capsule with Curved Corners */}
        <div className={`max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-full border border-stone-200/80 overflow-hidden transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'
          }`}>

          {/* ── Top bar: 52px Logo | Category Links | Action Buttons ── */}
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between relative" style={{ height: '68px' }}>

            {/* LEFT — Mobile Toggle & Desktop Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 z-10">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#3D2B1F] hover:text-[#B8860B] transition-colors rounded-full hover:bg-[#F5F0E8]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={onGoHome}
                className="hidden lg:flex items-center group focus:outline-none py-1"
                title="Shraviko - Home"
              >
                <img
                  src="/trasnparwtnt bg.png"
                  alt="Shraviko"
                  className="transition-transform duration-300 group-hover:scale-105 object-contain"
                  style={{ height: '52px', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(120,80,0,0.18))' }}
                />
              </button>
            </div>

            {/* CENTER (MOBILE ONLY) — Perfectly Centered Mobile Logo */}
            <button
              onClick={onGoHome}
              className="lg:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none z-10 active:scale-95 transition-transform duration-200"
              title="Shraviko - Home"
            >
              <img
                src="/trasnparwtnt bg.png"
                alt="Shraviko"
                className="object-contain"
                style={{ height: '44px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(120,80,0,0.18))' }}
              />
            </button>

            {/* CENTER — Spacious Category Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-3 lg:gap-4.5 xl:gap-6 mx-3">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <button
                    key={link.category}
                    onClick={() => onSelectCategory(link.category)}
                    className={`text-[11px] xl:text-xs tracking-[0.1em] uppercase font-sans transition-all relative py-1.5 whitespace-nowrap ${isActive
                      ? 'text-[#B8860B] font-bold'
                      : 'text-[#3D2B1F] hover:text-[#B8860B] font-semibold'
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#B8860B] via-[#E5C378] to-[#B8860B] rounded-full animate-fade-in" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT — Action Buttons (Search, Wishlist) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenSearch}
                className="hidden sm:flex p-2.5 rounded-full bg-[#F8F5EF] hover:bg-[#EDE4D0] text-[#3D2B1F] hover:text-[#B8860B] border border-[#DAB97B]/40 transition-all shadow-sm magnetic-hover group"
                title="Search Products"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">Search</span>
              </button>

              <button
                onClick={onOpenWishlist}
                className="p-2.5 rounded-full bg-[#F8F5EF] hover:bg-[#EDE4D0] text-[#3D2B1F] hover:text-[#B8860B] border border-[#DAB97B]/40 transition-all shadow-sm magnetic-hover relative group"
                title="Saved Items"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-110 text-[#3D2B1F] group-hover:text-[#A63A2B]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A63A2B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-md cart-badge-bounce">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Menu Backdrop & Drawer Modal ── */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto z-50 lg:hidden bg-white/95 backdrop-blur-md rounded-2xl border border-[#DAB97B]/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="p-4 border-b border-[#DAB97B]/20 bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#3D2B1F]">Quick Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#3D2B1F] hover:bg-[#EDE4D0] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1.5 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <button
                    key={link.category}
                    onClick={() => {
                      onSelectCategory(link.category);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs tracking-widest uppercase font-sans p-3 rounded-xl flex items-center justify-between transition-all ${isActive
                        ? 'bg-[#2C2623] text-[#D4AF37] font-bold shadow-sm'
                        : 'text-[#3D2B1F] hover:bg-[#FAF7F2] hover:text-[#B8860B] font-semibold'
                      }`}
                  >
                    <span>{link.label}</span>
                    <span className={`text-xs ${isActive ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`}>→</span>
                  </button>
                );
              })}
              {onGoSupport && (
                <button
                  onClick={() => {
                    onGoSupport();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-xs tracking-widest uppercase font-sans p-3 rounded-xl flex items-center justify-between transition-all bg-[#FAF3E8] text-[#B8860B] font-bold border border-[#EAD7AF]/80 mt-2"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    My Orders &amp; Returns
                  </span>
                  <span className="text-xs text-[#B8860B]">→</span>
                </button>
              )}
              <div className="pt-3 text-[11px] font-sans text-[#B8860B] italic text-center opacity-80">
                “Bringing Vedic Purity &amp; Timeless Heritage to Modern Homes”
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── 2. Dedicated Floating Cart Quick Action Trigger (Bottom-Right, Desktop only) ── */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenCart}
          className="skeu-btn-gold px-4 py-3 rounded-full flex items-center gap-2.5 shadow-2xl transition-all duration-300 hover:scale-105 group"
          title="Open Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5 text-[#2C1F06]" />
          <span className="text-xs font-sans tracking-wider font-bold text-[#2C1F06]">
            CART
          </span>
          {cartCount > 0 && (
            <span className="w-6 h-6 bg-[#2C1F06] text-[#E5C378] text-xs font-bold rounded-full flex items-center justify-center shadow-inner">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
