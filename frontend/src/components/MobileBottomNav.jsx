import React from 'react';
import { Home, Grid2x2, Search, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav = ({
  cartCount = 0,
  wishlistCount = 0,
  onGoHome,
  onOpenCategories,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
}) => {
  const items = [
    { label: 'Home', onClick: onGoHome, icon: Home },
    { label: 'Categories', onClick: onOpenCategories, icon: Grid2x2 },
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
      highlight: true,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-[#FBF9F5]/95 backdrop-blur-md border-t border-[#EAE0CD] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {items.map(({ label, icon: Icon, onClick, badge, highlight }) => (
          <button
            key={label}
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition-all active:scale-95 ${
              highlight
                ? 'text-[#2C1F06]'
                : 'text-[#6B5840] hover:text-[#2C1F06]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${highlight ? 'text-[#B8860B]' : ''}`} />
              {badge != null && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#A63A2B] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-cinzel tracking-wide ${highlight ? 'text-[#B8860B] font-bold' : ''}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
