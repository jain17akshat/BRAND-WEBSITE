import React from 'react';

export const BrandStory = ({ onDiscover }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#FBF9F5] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Image */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-[#EAE0CD]" style={{ aspectRatio: '4/3' }}>
            <img
              src="/brasshero.png"
              alt="Shraviko — Handcrafted in India"
              onError={(e) => { if (e.target.src !== '/assets/brasscover.png') e.target.src = '/assets/brasscover.png'; }}
              className="absolute inset-0 w-full h-full object-cover hero-image-crisp"
              style={{ objectPosition: 'center 60%' }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-4">
              Our Story
            </p>
            <h2
              className="font-cinzel font-bold text-[#2C2623] leading-tight mb-6"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              Rooted in Tradition.<br />Made for Today.
            </h2>
            <p className="text-sm sm:text-base text-[#6B5840] font-light leading-relaxed mb-8 max-w-md">
              Shraviko brings together traditional Indian craftsmanship and contemporary design to create objects for worship, gifting, and everyday spiritual living.
            </p>

            <button
              onClick={onDiscover}
              className="self-start inline-flex items-center gap-2 text-sm font-cinzel font-semibold text-[#2C2623] border-b border-[#2C2623] pb-0.5 hover:text-[#9B7E52] hover:border-[#9B7E52] transition-all duration-300 group tracking-wide"
            >
              Discover Our Story
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
