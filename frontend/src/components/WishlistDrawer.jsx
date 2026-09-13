import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductImage } from './ProductImage';

export const WishlistDrawer = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#171312]/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-drawer border-l border-[#EAE0CD] flex flex-col justify-between animate-slide-up">
          
          {/* Header */}
          <div className="p-6 bg-[#231E1C] text-[#F9F5EC] border-b border-[#C5A059]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#A63A2B] fill-[#A63A2B]" />
              <h3 className="font-cinzel text-base font-semibold tracking-wider text-[#F9F5EC]">
                Saved Ritual Items
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist drawer"
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F6F1E7] border border-[#EAE0CD] flex items-center justify-center text-[#A63A2B]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-cinzel text-lg font-semibold text-[#2C2623]">No Saved Items Yet</h4>
                <p className="text-xs text-[#4A4441] max-w-xs font-light">
                  Click the heart icon on any product to save your favorite brassware, copper vessels, and incense sets.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-lg bg-white border border-[#EAE0CD] flex gap-3 shadow-xs"
                >
                  <div className="w-20 h-20 rounded overflow-hidden shrink-0">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      artType={product.artType}
                      aspect="aspect-square"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-cinzel text-xs font-semibold text-[#2C2623] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="text-gray-400 hover:text-[#A63A2B] transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#8C6929] font-sans block mt-0.5">
                        {product.purity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {product.isComingSoon ? (
                        <span className="text-[10px] font-cinzel font-bold text-[#8C6D2D] uppercase tracking-wider">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="font-cinzel text-xs font-bold text-[#2C2623]">
                          ₹{(product.price || product.weightVariants?.[0]?.price || 0).toLocaleString('en-IN')}
                        </span>
                      )}

                      {!product.isComingSoon && (
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="px-2.5 py-1 bg-[#231E1C] text-[#E5C378] text-[10px] font-cinzel uppercase font-semibold rounded hover:bg-[#3A3431] flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
