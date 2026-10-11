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
        className="absolute inset-0 bg-[#2C2623]/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#EAE0CD] flex flex-col justify-between animate-slide-up">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#EAE0CD] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FBEAE5] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#57324F] fill-[#57324F]" />
              </div>
              <div>
                <h3 className="font-fraunces text-lg font-bold text-[#2C2623]">
                  Saved Items
                </h3>
                <p className="text-[11px] font-manrope text-[#7A6B5D]">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist drawer"
              className="p-2 text-[#7A6B5D] hover:text-[#2C2623] hover:bg-[#FBEAE5] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-16 h-16 rounded-2xl bg-[#FBEAE5] border border-[#57324F]/15 flex items-center justify-center text-[#57324F]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-fraunces text-xl font-bold text-[#2C2623]">No Saved Items Yet</h4>
                <p className="text-xs text-[#7A6B5D] max-w-xs font-manrope font-light leading-relaxed">
                  Click the heart icon on any brassware, copper vessel, or incense item to save your favorites for later.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE0CD] flex gap-3.5 shadow-xs hover:border-[#57324F]/30 transition-all"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FAF7F2]">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      artType={product.artType}
                      aspect="aspect-square"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-manrope text-xs font-semibold text-[#2C2623] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="text-[#9C8B7D] hover:text-rose-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#7A6B5D] font-manrope block mt-0.5">
                        {product.purity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF7F2]">
                      {product.isComingSoon ? (
                        <span className="text-[10px] font-manrope font-bold text-[#57324F] uppercase tracking-wider">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="font-manrope text-xs font-bold text-[#2C2623]">
                          ₹{(product.price || product.weightVariants?.[0]?.price || 0).toLocaleString('en-IN')}
                        </span>
                      )}

                      {!product.isComingSoon && (
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="px-3 py-1.5 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white text-[11px] font-manrope font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
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
