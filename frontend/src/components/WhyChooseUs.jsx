import React from 'react';
import { BadgeCheck, PackageCheck, Truck, RotateCcw } from 'lucide-react';

const PILLARS = [
  { icon: BadgeCheck, label: 'Quality Checked', desc: 'Every sacred piece passes multi-point purity checks' },
  { icon: PackageCheck, label: 'Secure Packaging', desc: 'Damage-proof packaging for sacred metalcraft' },
  { icon: Truck, label: 'Reliable Delivery', desc: 'Express pan-India delivery with live tracking' },
  { icon: RotateCcw, label: 'Easy Returns', desc: 'Hassle-free 7-day return & exchange window' },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs font-manrope font-semibold tracking-wider text-[#57324F] uppercase mb-2">
            The Shraviko Promise
          </p>
          <h2 className="font-fraunces font-bold text-[#2C2623] text-2xl sm:text-3xl lg:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-3.5 mx-auto w-12 h-[2px] bg-[#57324F]/30" />
        </div>

        {/* Calm 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#EAE0CD] hover:border-[#57324F]/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FBEAE5] border border-[#57324F]/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                  <Icon className="w-7 h-7 text-[#57324F]" strokeWidth={1.75} />
                </div>
                <h3 className="font-manrope font-bold text-[#2C2623] text-base mb-1">
                  {pillar.label}
                </h3>
                <p className="text-xs text-[#7A6B5D] font-manrope font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
