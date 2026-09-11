import React from 'react';
import { SafeImage } from './SafeImage';

export const BrandStory = ({ onDiscover }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FBF9F5] border-b border-[#EAE0CD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Layered / Overlapping Imagery Composition */}
          <div 
            onClick={onDiscover}
            className="relative layered-composition-container scroll-reveal-left cursor-pointer group"
          >
            {/* Background Gold Frame Accent */}
            <div className="layered-gold-accent-frame" />

            {/* Main Primary Image */}
            <div className="layered-composition-main img-reveal-curtain overflow-hidden rounded-xl shadow-md border border-[#EAE0CD]" style={{ aspectRatio: '4/3' }}>
              <SafeImage
                src="/brasshero.webp"
                alt="Shraviko — Handcrafted in India"
                fallbackSrc="/assets/brasscover.webp"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover hero-image-crisp transform group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: 'center 60%' }}
              />
            </div>
          </div>

          {/* Content — Slide Right Reveal */}
          <div className="flex flex-col justify-center scroll-reveal-right">
            <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-4">
              Our Story
            </p>
            <h2
              className="font-cinzel font-bold text-[#2C2623] leading-tight mb-6 heading-gold-line cursor-pointer"
              onClick={onDiscover}
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)' }}
            >
              Rooted in Tradition.<br />Made for Today.
            </h2>
            <p className="text-sm sm:text-base text-[#6B5840] font-light leading-relaxed mb-8 max-w-md">
              Born from a local shop in Udaipur with a vision to elevate Indian ritual craftsmanship to the next stage, Shraviko creates sacred objects for worship, luxury gifting, and spiritual living.
            </p>

            <button
              onClick={onDiscover}
              className="self-start inline-flex items-center gap-2 text-sm font-cinzel font-semibold text-[#2C2623] border-b border-[#2C2623] pb-0.5 hover:text-[#9B7E52] hover:border-[#9B7E52] transition-all duration-300 magnetic-hover group tracking-wide cursor-pointer"
            >
              Discover Our Story
              <span className="transform group-hover:translate-x-1.5 transition-transform">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
