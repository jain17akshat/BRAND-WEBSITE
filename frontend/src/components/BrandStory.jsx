import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { Button } from './Button';

export const BrandStory = ({ onDiscover }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FBEAE5]/40 border-b border-[#EAE2D7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: Asymmetric Warm Editorial Image */}
          <div 
            onClick={onDiscover}
            className="lg:col-span-6 relative cursor-pointer group"
          >
            {/* Pastel Sage Decorative Backdrop */}
            <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl bg-[#EBF2EB] -z-10 transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />

            {/* Main Stage Image Frame with 16px soft corners */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(42,34,30,0.08)] border border-[#EAE2D7] bg-white">
              <SafeImage
                src="/Outside images/brasshero.webp"
                alt="Shraviko Artisanal Heritage"
                fallbackSrc="/assets/brasscover.webp"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                style={{ objectPosition: 'center 60%' }}
              />
            </div>

            {/* Small Floating Craftsmanship Pill */}
            <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-[#EAE2D7] rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#57324F]" />
              <span className="font-manrope text-xs font-semibold text-[#2A221E]">
                Artisanal Udaipur Metalsmiths
              </span>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-[11px] sm:text-xs font-manrope font-semibold tracking-[0.18em] text-[#8C7D75] uppercase mb-2">
              Our Heritage &amp; Vow
            </p>
            <h2
              className="font-fraunces font-semibold text-[#2A221E] leading-tight mb-5 cursor-pointer text-2xl sm:text-3xl lg:text-4xl"
              onClick={onDiscover}
            >
              Rooted in Devotion.<br />
              Crafted for Modern Sanctuaries.
            </h2>
            <p className="text-sm sm:text-base text-[#685951] font-manrope leading-relaxed mb-4">
              Born in Udaipur, Rajasthan, with a sacred vision to revive timeless Vedic metalcraft, SHRAVIKO creates heirloom pooja essentials for daily devotional worship, mindful gifting, and peaceful living.
            </p>
            <p className="text-xs sm:text-sm text-[#8C7D75] font-manrope leading-relaxed mb-8">
              Every brass bell, copper vessel, and hand-rolled stick of organic agarbatti is fashioned by master generational artisans without compromise.
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="md"
                onClick={onDiscover}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Discover Our Story
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
