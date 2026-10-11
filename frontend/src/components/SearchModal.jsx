import React, { useState } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductImage } from './ProductImage';

export const SearchModal = ({
  isOpen,
  onClose,
  products,
  onOpenQuickView,
  onAddToCart
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const suggestions = ['Brass Diya', 'Copper Pitcher', 'Sandalwood Incense', 'Pooja Thali', 'Sri Yantra', 'Camphor'];

  const results = query.trim() === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        p.purity.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto flex items-start justify-center p-2 sm:p-6 pt-8 sm:pt-16">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#171312]/75 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Container */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#EAE0CD] shadow-2xl overflow-hidden z-10 animate-slide-up max-h-[85vh] flex flex-col font-manrope">
        
        {/* Search Bar Input Header */}
        <div className="p-4 sm:p-5 bg-white text-[#2C221E] border-b border-[#EAE0CD] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#57324F] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brass diyas, copper pitchers, temple incense..."
            autoFocus
            className="w-full bg-transparent text-sm font-manrope text-[#2C221E] placeholder-[#8C7A70] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="text-xs text-[#8C7A70] hover:text-[#2C221E]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search modal"
            className="p-1 text-[#8C7A70] hover:text-[#2C221E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-3.5">
              <span className="text-xs font-manrope tracking-wider uppercase text-[#57324F] font-semibold block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(sug)}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#4A3E39] border border-[#EAE0CD] text-xs font-manrope font-medium hover:border-[#57324F]/40 hover:bg-[#FBEAE5]/30 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-base font-fraunces text-[#2C221E] font-medium">No sacred items found matching "{query}"</p>
              <p className="text-xs text-[#6B5E57] font-manrope">Try searching for "brass", "copper", "incense", or "thali".</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-manrope text-[#57324F] uppercase tracking-wider block font-semibold">
                Matching Items ({results.length})
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-white border border-[#EAE0CD] hover:border-[#57324F]/40 flex items-center justify-between gap-3 shadow-xs transition-colors"
                >
                  <div
                    onClick={() => {
                      onOpenQuickView(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#FAF7F2]">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        artType={product.artType}
                        aspect="aspect-square"
                      />
                    </div>
                    <div>
                      <h4 className="font-manrope text-xs sm:text-sm font-semibold text-[#2C221E] hover:text-[#57324F] line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-[11px] text-[#8C7A70] font-manrope block">
                        {product.purity} {product.isComingSoon ? '• Coming Soon' : (product.price || product.weightVariants?.[0]?.price) ? `• ₹${(product.price || product.weightVariants?.[0]?.price).toLocaleString('en-IN')}` : ''}
                      </span>
                    </div>
                  </div>

                  {product.isComingSoon ? (
                    <span className="px-2.5 py-1 rounded-[12px] bg-[#FAF7F2] text-[#8C7A70] text-[10px] font-manrope font-semibold uppercase shrink-0 border border-[#EAE0CD]">
                      Soon
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#57324F] hover:bg-[#42253C] text-white text-xs font-manrope font-semibold rounded-[12px] shrink-0 transition-colors shadow-xs"
                    >
                      + Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
