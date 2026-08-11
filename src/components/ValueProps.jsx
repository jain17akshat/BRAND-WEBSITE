import React from 'react';

export const ValueProps = () => {
  const items = [
    'Handcrafted in India',
    'Premium Materials',
    'Thoughtful Gifting',
    'Made for Everyday Rituals',
  ];

  return (
    <section className="bg-[#FBF9F5] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 sm:py-6">
        {/* Desktop: horizontal row | Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 sm:gap-0 sm:divide-x sm:divide-[#EAE0CD]">
          {items.map((item, i) => (
            <div key={i} className="sm:px-8 first:pl-0 last:pr-0 flex items-center justify-center sm:justify-center">
              <span className="text-[10px] sm:text-[11px] font-cinzel tracking-[0.2em] text-[#6B5840] uppercase font-medium text-center">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
