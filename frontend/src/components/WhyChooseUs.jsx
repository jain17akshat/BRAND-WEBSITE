import React from 'react';
import { BadgeCheck, PackageCheck, Truck, RotateCcw } from 'lucide-react';

const PILLARS = [
  { icon: BadgeCheck, label: 'Quality Checked' },
  { icon: PackageCheck, label: 'Secure Packaging' },
  { icon: Truck, label: 'Reliable Delivery' },
  { icon: RotateCcw, label: 'Easy Returns' },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-10 sm:py-14 overflow-hidden">
      {/* Headline */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <p className="text-xs sm:text-sm font-cinzel tracking-[0.3em] text-[#C5A059] uppercase mb-2.5">
          The Shraviko Promise
        </p>
        <h2
          className="font-cinzel font-bold text-[#2C2623] leading-tight tracking-wide uppercase"
          style={{ fontSize: 'clamp(1.4rem, 3.8vw, 2.4rem)' }}
        >
          Why Choose Us
        </h2>
        <div className="mt-3.5 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
      </div>

      {/* Marquee strip */}
      <div className="why-choose-marquee-wrap">
        <div className="why-choose-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="why-choose-marquee-set" aria-hidden={copy === 1}>
              {PILLARS.map((pillar, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-4 sm:gap-5 px-7 sm:px-12 shrink-0 group cursor-default">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#C5A059]/15 via-[#EAE0CD]/30 to-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#C5A059]/50 group-hover:shadow-lg transition-all duration-300">
                      <pillar.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#C5A059] group-hover:text-[#8C6929] transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <span className="font-cinzel font-semibold text-[#2C2623] text-sm sm:text-base lg:text-lg tracking-wide whitespace-nowrap">
                      {pillar.label}
                    </span>
                  </div>
                  {/* Divider dot */}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/35 shrink-0" />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
