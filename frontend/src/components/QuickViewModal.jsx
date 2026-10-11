import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ShieldCheck, Check } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { ProductReviewsSection } from './ProductReviewsSection';

export const QuickViewModal = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(product ? (product.image || (product.images && product.images[0])) : '');

  const defaultVariant = product?.weightVariants
    ? (product.weightVariants.find((v) => v.default) || product.weightVariants[0])
    : null;

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [addedFeedback, setAddedFeedback] = useState(false);

  React.useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImg(product.image || (product.images && product.images[0]));
      if (product.weightVariants) {
        setSelectedVariant(product.weightVariants.find((v) => v.default) || product.weightVariants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOrigPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

  const handleAdd = () => {
    if (selectedVariant) {
      let cleanName = product.name;
      const w = selectedVariant.weight ? selectedVariant.weight.trim() : '';
      if (w && !cleanName.toLowerCase().includes(w.toLowerCase()) && !cleanName.includes('15×15')) {
        cleanName = `${cleanName} (${w})`;
      }
      onAddToCart({
        ...product,
        id: `${product.id}-${selectedVariant.weight.replace(/\s+/g, '')}`,
        name: cleanName,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        selectedWeight: selectedVariant.weight
      }, quantity);
    } else {
      onAddToCart(product, quantity);
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#171312]/70 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-3xl w-full border border-[#EAE0CD] shadow-2xl overflow-hidden z-10 animate-slide-up my-4 sm:my-8 max-h-[92vh] overflow-y-auto font-manrope">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white text-[#57324F] hover:bg-[#FBEAE5] border border-[#EAE0CD] flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image Frame */}
          <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#EAE0CD] flex flex-col items-center justify-center space-y-4">
            <div className={`w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-xs relative ${
              product.imageBackground === 'white'
                ? 'bg-white'
                : product.imageBackground === 'transparent'
                ? 'bg-[#FAF6EC]'
                : 'bg-[#FAF7F2]'
            }`}>
              <ProductImage
                src={selectedImg}
                alt={product.name}
                artType={product.artType}
                fitMode={product.fitMode || 'contain'}
                aspect="aspect-square"
                imageBackground={product.imageBackground}
                silhouetteShadow={product.imageBackground === 'transparent'}
              />
            </div>

            {/* Thumbnail Carousel if multiple images exist */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white ${
                      selectedImg === img ? 'border-[#57324F] scale-105 shadow-xs' : 'border-[#EAE0CD] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#FAF7F2]">
            <div>
              <div className="mb-1">
                <span className="text-[10px] font-manrope uppercase tracking-wider text-[#8C7A70] font-semibold">
                  {product.categoryName}
                </span>
              </div>

              <h2 className="font-fraunces text-xl sm:text-2xl font-medium text-[#2C221E] leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                {product.isComingSoon ? (
                  <span className="text-xl font-fraunces font-medium text-[#57324F]">
                    Coming Soon
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-manrope font-bold text-[#2C221E]">
                      ₹{(currentPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {currentOrigPrice && (
                      <span className="text-sm text-[#8C7A70] line-through font-manrope font-normal">
                        ₹{currentOrigPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Variant chips if available */}
              {product.weightVariants && product.weightVariants.length > 0 && !product.isComingSoon && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-manrope font-semibold text-[#6B5E57] uppercase tracking-wider block">
                    Option: <span className="text-[#2C221E] font-bold">{selectedVariant?.weight}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.weightVariants.map((v, i) => {
                      const isSel = selectedVariant?.weight === v.weight;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-[12px] text-xs font-manrope font-semibold border transition-all ${
                            isSel
                              ? 'bg-[#57324F] text-white border-[#57324F]'
                              : 'bg-white text-[#2C221E] border-[#EAE0CD] hover:border-[#57324F]/40'
                          }`}
                        >
                          {v.weight}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#EAE0CD]">
              {product.isComingSoon ? (
                <button
                  disabled
                  className="w-full py-3.5 bg-white text-[#8C7A70] font-manrope text-xs font-semibold rounded-[12px] cursor-not-allowed border border-[#EAE0CD] text-center"
                >
                  Collection Launching Soon
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {/* Quantity selector */}
                    <div className="flex items-center border border-[#EAE0CD] rounded-[12px] bg-white px-2 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Decrease quantity"
                        className="px-2 text-sm text-[#2C221E] font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-manrope font-bold text-[#2C221E]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Increase quantity"
                        className="px-2 text-sm text-[#2C221E] font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist toggle */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      className={`p-2.5 rounded-[12px] border transition-colors ${
                        isWishlisted
                          ? 'bg-[#57324F] border-[#57324F] text-white'
                          : 'border-[#EAE0CD] bg-white text-[#2C221E] hover:bg-[#FBEAE5]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAdd}
                    className={`w-full min-h-[48px] py-3 text-white font-manrope text-xs uppercase font-semibold tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-2 active:scale-98 ${
                      addedFeedback
                        ? 'bg-emerald-700'
                        : 'bg-[#57324F] hover:bg-[#42253C] shadow-xs'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Cart — ₹{((currentPrice || 0) * quantity).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C7A70] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#57324F]" />
                <span>In Stock • Ready for Pan-India Dispatch</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Reviews & Ratings Section */}
        <div className="border-t border-[#EAE0CD]">
          <ProductReviewsSection productId={product.id} productName={product.name} />
        </div>

      </div>
    </div>
  );
};
