import React from 'react';

export const MandirFeature = ({ onExplore }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#F8F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0 rounded-2xl overflow-hidden shadow-sm border border-[#EAE0CD]">

          {/* Image — 55% on desktop, full-width on mobile */}
          <div className="relative overflow-hidden" style={{ minHeight: 'clamp(280px, 50vw, 560px)' }}>
            {/* Mobile */}
            <img
              src="/mandiressentialmobileview.png"
              alt="Mandir Essentials"
              onError={(e) => { if (e.target.src !== '/essentialhero.png') e.target.src = '/essentialhero.png'; }}
              className="block lg:hidden absolute inset-0 w-full h-full object-cover hero-image-crisp"
              style={{ objectPosition: 'center 35%' }}
            />
            {/* Desktop */}
            <img
              src="/essentialhero.png"
              alt="Mandir Essentials"
              onError={(e) => { if (e.target.src !== '/assets/Rudraksh Mala/rudraksh mala 1.png') e.target.src = '/assets/Rudraksh Mala/rudraksh mala 1.png'; }}
              className="hidden lg:block absolute inset-0 w-full h-full object-cover hero-image-crisp"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>

          {/* Content — 45% on desktop */}
          <div className="bg-white flex flex-col justify-center px-8 sm:px-12 py-12 sm:py-16">
            <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-4">
              Collection Spotlight
            </p>
            <h2 className="font-cinzel font-bold text-[#2C2623] leading-tight mb-5"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Mandir<br />Essentials
            </h2>
            <p className="text-sm text-[#6B5840] font-light leading-relaxed mb-3">
              Everyday objects for a more meaningful ritual.
            </p>
            <p className="text-sm text-[#8A7060] font-light leading-relaxed mb-10">
              Thoughtfully chosen essentials for prayer, meditation, devotion, and everyday spiritual living — malas, mala counters, jap bags, pooja boxes, and wooden chowkis.
            </p>

            {/* Product highlights */}
            <ul className="space-y-2 mb-10">
              {['Sacred Malas & Japa Bags', 'Wooden Chowkis', 'Pooja Boxes & Accessories'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-[#6B5840] font-cinzel tracking-wide">
                  <span className="w-1 h-1 rounded-full bg-[#C5A059] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={onExplore}
              className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold tracking-widest uppercase rounded hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95 shadow group"
            >
              Explore Essentials
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
