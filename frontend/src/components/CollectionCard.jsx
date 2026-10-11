import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * CollectionCard — Pastel collection card for boutique shopping.
 * 
 * Props:
 *  - id: category id
 *  - name: display name
 *  - title: headline
 *  - image: photo path
 *  - count: number of items
 *  - pastelBg: CSS color or Tailwind class (e.g. 'bg-[#F8F3E6]')
 *  - onSelectCategory: click handler
 */
export const CollectionCard = ({
  id,
  name,
  title,
  image,
  count,
  pastelBg = 'bg-[#FAF7F2]',
  onSelectCategory,
}) => {
  return (
    <div
      onClick={() => onSelectCategory && onSelectCategory(id)}
      className={`group relative rounded-2xl p-5 sm:p-6 ${pastelBg} border border-[#EAE2D7] overflow-hidden transition-all duration-200 hover:shadow-[0_12px_28px_rgba(42,34,30,0.08)] cursor-pointer flex flex-col justify-between`}
    >
      {/* Visual Image Presentation */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-white/60">
        <img
          src={image}
          alt={name || title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />
        {count && (
          <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#2A221E] text-[10px] sm:text-xs font-manrope font-semibold px-2.5 py-1 rounded-full shadow-2xs">
            {count} items
          </span>
        )}
      </div>

      {/* Editorial Content */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-fraunces text-lg sm:text-xl font-semibold text-[#2A221E] group-hover:text-[#57324F] transition-colors leading-tight">
            {title || name}
          </h3>
          <p className="text-xs text-[#685951] font-manrope mt-1">
            Handcrafted with devotion
          </p>
        </div>

        {/* Small Deep-Plum Action Pill */}
        <span className="w-8 h-8 rounded-full bg-[#57324F] text-white flex items-center justify-center shrink-0 group-hover:bg-[#42253C] group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
