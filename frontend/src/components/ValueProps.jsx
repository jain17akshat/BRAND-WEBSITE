import React from 'react';
import { Award, Sparkles, Gift, ShieldCheck } from 'lucide-react';

export const ValueProps = () => {
  const items = [
    { title: 'Handcrafted in India', icon: Sparkles, color: 'text-[#C5A059]' },
    { title: 'Premium Materials', icon: Award, color: 'text-[#C5A059]' },
    { title: 'Thoughtful Gifting', icon: Gift, color: 'text-[#C5A059]' },
    { title: 'Certified Authentic', icon: ShieldCheck, color: 'text-[#3B7A57]' },
  ];

  return (
    <section className="bg-[#FAF5EB] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-5">
        {/* Desktop: horizontal row | Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 sm:gap-0 sm:divide-x sm:divide-[#EAE0CD]">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="sm:px-6 first:pl-0 last:pr-0 flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <span className="text-[10px] sm:text-[11px] font-cinzel tracking-[0.2em] text-[#2C1F06] uppercase font-bold text-center">
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
