import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const Testimonials = () => {
  const reviews = TESTIMONIALS.slice(0, 3);

  return (
    <section className="py-14 sm:py-20 bg-[#F8F3EC] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-2">Reviews</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#2C2623] tracking-wide">
            What Our Customers Say
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE0CD] hover:border-[#C5A059]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Stars */}
              <div>
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-[#D97706] text-[#D97706]' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-sm font-semibold text-[#2C2623] mb-2 leading-snug">
                  "{t.title}"
                </h3>

                {/* Body */}
                <p className="text-xs text-[#6B5840] font-light leading-relaxed italic">
                  {t.review}
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-xs font-bold text-[#2C2623]">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.location}</p>
                </div>
                {t.verified && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
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
