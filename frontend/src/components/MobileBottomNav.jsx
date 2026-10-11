import React from 'react';
import { Home, Grid2x2, Search, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav = ({
  cartCount = 0,
  wishlistCount = 0,
  currentPage = 'home',
  onGoHome,
  onOpenCategories,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
}) => {
  const isHomeActive = currentPage === 'home';
  const isCategoriesActive =
    currentPage === 'all-collections' ||
    currentPage === 'category' ||
    currentPage === 'energy-stones' ||
    currentPage === 'gifting';

  const items = [
    { label: 'Home', onClick: onGoHome, icon: Home, active: isHomeActive },
    { label: 'Categories', onClick: onOpenCategories, icon: Grid2x2, active: isCategoriesActive },
    { label: 'Search', onClick: onOpenSearch, icon: Search },
    {
      label: 'Wishlist',
      icon: Heart,
      onClick: onOpenWishlist,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      label: 'Cart',
      icon: ShoppingBag,
      onClick: onOpenCart,
      badge: cartCount > 0 ? cartCount : null,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EAE0CD] shadow-[0_-4px_20px_rgba(87,50,79,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map(({ label, icon: Icon, onClick, badge, active }) => (
          <button
            key={label}
            onClick={onClick}
            aria-label={label}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 py-1 rounded-xl transition-all active:scale-95 ${
              active
                ? 'text-[#57324F] font-bold'
                : 'text-[#6B5840] hover:text-[#57324F]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${active ? 'text-[#57324F] stroke-[2.25]' : 'stroke-[1.75]'}`} />
              {badge != null && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#57324F] text-white text-[9px] font-bold font-manrope rounded-full flex items-center justify-center shadow-xs">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-manrope ${active ? 'text-[#57324F] font-semibold' : 'text-[#6B5840]'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
