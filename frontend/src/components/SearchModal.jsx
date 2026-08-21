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
      <div className="relative bg-[#FBF9F5] rounded-2xl max-w-2xl w-full border border-[#C5A059]/40 shadow-2xl overflow-hidden z-10 animate-slide-up max-h-[85vh] flex flex-col">
        
        {/* Search Bar Input Header */}
        <div className="p-4 sm:p-6 bg-[#231E1C] text-white border-b border-[#3A3431] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brass diyas, copper pitchers, temple incense..."
            autoFocus
            className="w-full bg-transparent text-sm font-sans text-[#F9F5EC] placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <span className="text-xs font-cinzel tracking-wider uppercase text-[#8C6929] font-semibold block">
                Popular Sacred Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(sug)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAF0D9] text-[#755722] border border-[#EAD7AF] text-xs font-sans hover:border-[#C5A059] transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-cinzel text-[#2C2623] font-semibold">No ritual items found matching "{query}"</p>
              <p className="text-xs text-gray-500 font-sans">Try searching for "brass", "copper", "incense", or "thali".</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-cinzel text-[#8C6929] uppercase tracking-wider block font-semibold">
                Matching Sacred Items
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  className="p-3 rounded-lg bg-white border border-[#EAE0CD] hover:border-[#C5A059] flex items-center justify-between gap-3 shadow-xs transition-colors"
                >
                  <div
                    onClick={() => {
                      onOpenQuickView(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-14 h-14 rounded overflow-hidden shrink-0">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        artType={product.artType}
                        aspect="aspect-square"
                      />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-xs font-semibold text-[#2C2623] hover:text-[#967433]">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-[#8C6929] font-sans block">
                        {product.purity} • ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#231E1C] text-[#E5C378] text-[11px] font-cinzel uppercase font-semibold rounded hover:bg-[#3A3431] shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
