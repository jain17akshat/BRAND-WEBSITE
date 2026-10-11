import React from 'react';
import { Award, Sparkles, Gift, ShieldCheck } from 'lucide-react';

export const ValueProps = () => {
  const items = [
    { title: 'Handcrafted in India', icon: Sparkles, color: 'text-[#57324F]' },
    { title: 'Pure Solid Metalware', icon: Award, color: 'text-[#57324F]' },
    { title: 'Thoughtful Gifting', icon: Gift, color: 'text-[#57324F]' },
    { title: 'Certified Authentic', icon: ShieldCheck, color: 'text-emerald-700' },
  ];

  return (
    <section className="bg-[#FAF7F2] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-5">
        {/* Desktop: horizontal row | Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 sm:gap-0 sm:divide-x sm:divide-[#EAE0CD]">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="sm:px-6 first:pl-0 last:pr-0 flex items-center justify-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <span className="text-xs sm:text-[13px] font-manrope font-semibold text-[#2C2623] tracking-wide text-center">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
