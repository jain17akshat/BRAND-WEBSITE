import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const Testimonials = () => {
  const reviews = TESTIMONIALS.slice(0, 3);

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 sm:mb-14 text-center sm:text-left">
          <p className="text-xs font-manrope font-semibold tracking-wider text-[#57324F] uppercase mb-2">Verified Reviews</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fraunces font-bold text-[#2C2623]">
            What Our Customers Say
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE0CD] hover:border-[#57324F]/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Stars & Content */}
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-fraunces text-base font-semibold text-[#2C2623] mb-2 leading-snug">
                  "{t.title}"
                </h3>

                {/* Body */}
                <p className="text-xs sm:text-sm text-[#5C4A3E] font-manrope font-light leading-relaxed italic">
                  {t.review}
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                <div>
                  <p className="font-manrope text-xs font-bold text-[#2C2623]">{t.name}</p>
                  <p className="text-[11px] font-manrope text-[#7A6B5D]">{t.location}</p>
                </div>
                {t.verified && (
                  <div className="flex items-center gap-1 text-[11px] font-manrope font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
