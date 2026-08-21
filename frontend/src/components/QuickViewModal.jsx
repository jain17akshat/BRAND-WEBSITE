import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ShieldCheck, Check } from 'lucide-react';
import { ProductImage } from './ProductImage';

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

  React.useEffect(() => {
    if (product) {
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
      onAddToCart({
        ...product,
        id: `${product.id}-${selectedVariant.weight.replace(/\s+/g, '')}`,
        name: `${product.name} (${selectedVariant.weight})`,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        selectedWeight: selectedVariant.weight
      }, quantity);
    } else {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#171312]/70 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-[#FBF9F5] rounded-2xl max-w-3xl w-full border border-[#C5A059]/40 shadow-2xl overflow-hidden z-10 animate-slide-up my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#231E1C] text-[#E5C378] hover:bg-[#3A3431] flex items-center justify-center transition-colors shadow"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image Frame */}
          <div className="p-6 bg-[#F6F1E7] border-b md:border-b-0 md:border-r border-[#EAE0CD] flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-md relative bg-white">
              <ProductImage
                src={selectedImg}
                alt={product.name}
                artType={product.artType}
                fitMode={product.fitMode}
                aspect="aspect-square"
              />
            </div>

            {/* Thumbnail Carousel if multiple images exist */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#C5A059] scale-105 shadow-md' : 'border-[#EAE0CD] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="mb-1">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#8C6929] font-medium">
                  {product.categoryName}
                </span>
              </div>

              <h2 className="font-cinzel text-xl font-bold text-[#2C2623] leading-snug">
                {product.name}
              </h2>



              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-cinzel font-bold text-[#2C2623]">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentOrigPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{currentOrigPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>




            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#EAE0CD]">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-[#EAE0CD] rounded bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm text-[#2C2623]"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2C2623]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 text-sm text-[#2C2623]"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-2.5 rounded border border-[#EAE0CD] hover:border-[#A63A2B] text-[#2C2623] transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#A63A2B] text-[#A63A2B]' : ''}`} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAdd}
                className="w-full py-3.5 bg-[#231E1C] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-md hover:bg-[#3A3431] shadow-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/40"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>Add to Cart — ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>In Stock • Ready for Pan-India Dispatch</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
