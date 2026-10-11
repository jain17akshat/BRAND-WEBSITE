import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Truck, Sparkles } from 'lucide-react';

const LOGO_URL = '/assets/Logo/LOGO.png';

export const Navbar = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  activeCategory = 'all',
  onSelectCategory,
  onGoHome,
  onGoSupport,
  hideNavbar = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 15);

      if (currentY > 120) {
        if (currentY > lastScrollY.current + 6) {
          setIsVisible(false);
        } else if (currentY < lastScrollY.current - 6) {
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
    { label: 'All Collections', category: 'all-collections' },
    { label: 'Brass Articles', category: 'brass' },
    { label: 'Copper Vessels', category: 'copper' },
    { label: 'Mandir Essentials', category: 'mandir-essentials' },
    { label: 'Incense & Dhoop', category: 'incense' },
    { label: 'Energy Stones', category: 'energy-stones' },
    { label: 'Corporate Gifting', category: 'kits' },
  ];

  return (
    <>
      {/* ── Compact Ivory Header ── */}
      <header
        className={`fixed top-2 sm:top-3 left-0 right-0 z-50 px-2.5 sm:px-4 lg:px-6 transition-all duration-300 ease-out ${
          isVisible && !hideNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ pointerEvents: isVisible && !hideNavbar ? 'auto' : 'none' }}
      >
        <div
          className={`max-w-[1440px] mx-auto bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#EAE2D7] transition-all duration-200 ${
            isScrolled
              ? 'shadow-[0_8px_24px_rgba(42,34,30,0.08)] bg-white/95'
              : 'shadow-[0_4px_16px_rgba(42,34,30,0.04)]'
          }`}
        >
          <div className="px-3 sm:px-6 lg:px-6 flex items-center justify-between relative h-14 sm:h-16">
            
            {/* LEFT — Mobile Hamburger & Official Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 z-10">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#2A221E] hover:text-[#57324F] transition-colors rounded-xl hover:bg-[#FBEAE5] cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={onGoHome}
                aria-label="Shraviko - Return to Homepage"
                className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57324F] rounded-lg py-1 cursor-pointer"
                title="Shraviko - Home"
              >
                <img
                  src={LOGO_URL}
                  alt="SHRAVIKO"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </button>
            </div>

            {/* CENTER — Navigation Links in Manrope */}
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 mx-2 flex-1">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <button
                    key={link.category}
                    onClick={() => onSelectCategory(link.category)}
                    className={`text-xs xl:text-[13px] tracking-normal font-manrope transition-all py-1.5 px-2.5 xl:px-3 rounded-full whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-white font-semibold bg-[#57324F] shadow-xs'
                        : 'text-[#2A221E] hover:text-[#57324F] font-medium hover:bg-[#FBEAE5]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT — Actions (Search, Wishlist, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 z-10">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                aria-label="Search pooja articles"
                className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-[#FBEAE5] text-[#2A221E] hover:text-[#57324F] border border-[#EAE2D7] transition-all shadow-2xs cursor-pointer"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                aria-label={`View saved items (${wishlistCount} items)`}
                className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-[#FBEAE5] text-[#2A221E] hover:text-[#57324F] border border-[#EAE2D7] transition-all shadow-2xs relative cursor-pointer"
                title="Saved Items"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#57324F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Header Cart Button (Deep Plum) */}
              <button
                onClick={onOpenCart}
                aria-label={`Open shopping cart (${cartCount} items)`}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-white text-[#57324F] text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-3 right-3 max-w-lg mx-auto z-50 lg:hidden bg-[#FAF7F2] rounded-2xl border border-[#EAE2D7] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="p-4 border-b border-[#EAE2D7] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#57324F]" />
                <span className="font-fraunces font-semibold text-sm text-[#2A221E]">
                  Browse Collections
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#2A221E] hover:bg-[#FBEAE5] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <button
                    key={link.category}
                    onClick={() => {
                      onSelectCategory(link.category);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left text-sm font-manrope p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#57324F] text-white font-semibold shadow-xs'
                        : 'text-[#2A221E] hover:bg-[#FBEAE5] hover:text-[#57324F] font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs opacity-70">→</span>
                  </button>
                );
              })}
              {onGoSupport && (
                <button
                  onClick={() => {
                    onGoSupport();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-manrope p-3 rounded-xl flex items-center justify-between transition-all bg-white text-[#57324F] font-semibold border border-[#EAE2D7] mt-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#57324F]" />
                    Track Order &amp; Returns
                  </span>
                  <span className="text-xs">→</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
