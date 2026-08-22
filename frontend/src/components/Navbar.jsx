import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Truck } from 'lucide-react';

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
  onGoSupport
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
    { label: 'Brass', category: 'brass' },
    { label: 'Copper', category: 'copper' },
    { label: 'Mandir Essentials', category: 'mandir-essentials' },
    { label: 'Incense & Dhoop', category: 'incense' },
    { label: 'Vastu & Spiritual', category: 'vastu' },
    { label: 'Corporate Gifting', category: 'kits' },
  ];

  return (
    <>
      {/* ── Solid Premium Luxury Header with Curved Corners (100% Non-Transparent) ── */}
      <header
        className={`fixed top-2 sm:top-3.5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        {/* Solid White Floating Capsule with Curved Corners */}
        <div className={`max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-full border border-stone-200/80 overflow-hidden transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'
          }`}>

          {/* ── Top bar: 52px Logo | Category Links | Action Buttons ── */}
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between" style={{ height: '68px' }}>

            {/* LEFT — Mobile Toggle & Standalone Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#3D2B1F] hover:text-[#B8860B] transition-colors rounded-full hover:bg-[#F5F0E8]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={onGoHome}
                className="flex items-center group focus:outline-none"
                title="Shraviko Sacred Living - Home"
              >
                <img
                  src={logoUrl}
                  alt="Shraviko Sacred Living"
                  style={{
                    height: '52px',
                    width: '52px',
                    aspectRatio: '1 / 1',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  className="rounded-full transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            </div>

            {/* CENTER — Spacious Category Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-3 lg:gap-4.5 xl:gap-6 mx-3">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.category;
                return (
                  <button
                    key={link.category}
                    onClick={() => onSelectCategory(link.category)}
                    className={`text-[11px] xl:text-xs tracking-[0.1em] uppercase font-cinzel transition-all relative py-1.5 whitespace-nowrap ${isActive
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
                className="hidden sm:flex p-2.5 rounded-full bg-[#F8F5EF] hover:bg-[#EDE4D0] text-[#3D2B1F] hover:text-[#B8860B] border border-[#DAB97B]/40 transition-all shadow-sm active:scale-95 group"
                title="Search Products"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="sr-only">Search</span>
              </button>

              <button
                onClick={onOpenWishlist}
                className="p-2.5 rounded-full bg-[#F8F5EF] hover:bg-[#EDE4D0] text-[#3D2B1F] hover:text-[#B8860B] border border-[#DAB97B]/40 transition-all shadow-sm active:scale-95 relative"
                title="Saved Items"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A63A2B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-md animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Dropdown Menu (Solid White) */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#DAB97B]/30 px-6 py-6 animate-fade-in bg-white">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.category}
                    onClick={() => {
                      onSelectCategory(link.category);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm tracking-wider uppercase font-cinzel py-2.5 border-b border-[#DAB97B]/20 flex items-center justify-between transition-colors ${activeCategory === link.category ? 'text-[#B8860B] font-bold' : 'text-[#3D2B1F] hover:text-[#B8860B]'
                      }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-[#B8860B]">→</span>
                  </button>
                ))}
                {onGoSupport && (
                  <button
                    onClick={() => {
                      onGoSupport();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm tracking-wider uppercase font-cinzel py-2.5 border-b border-[#DAB97B]/20 flex items-center justify-between transition-colors text-[#B8860B] font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#B8860B]" />
                      My Orders &amp; Returns
                    </span>
                    <span className="text-xs text-[#B8860B]">→</span>
                  </button>
                )}
                <div className="pt-3 text-xs font-serif text-[#B8860B] italic text-center">
                  “Bringing Vedic Purity &amp; Timeless Heritage to Modern Homes”
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. Dedicated Floating Cart Quick Action Trigger (Bottom-Right, Desktop only) ── */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenCart}
          className="skeu-btn-gold px-4 py-3 rounded-full flex items-center gap-2.5 shadow-2xl transition-all duration-300 hover:scale-105 group"
          title="Open Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5 text-[#2C1F06]" />
          <span className="text-xs font-cinzel tracking-wider font-bold text-[#2C1F06]">
            CART
          </span>
          <span className="w-6 h-6 bg-[#2C1F06] text-[#E5C378] text-xs font-bold rounded-full flex items-center justify-center shadow-inner">
            {cartCount}
          </span>
        </button>
      </div>
    </>
  );
};
