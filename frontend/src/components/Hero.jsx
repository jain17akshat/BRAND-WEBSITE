import React, { useState, useEffect } from 'react';

export const Hero = ({ onExploreClick, onRitualsClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Ordered for best mobile experience first
  const heroImages = [
    {
      id: 'hero-mobile-1',
      // Mobile: portrait-friendly. Desktop: landscape
      mobileImage: '/brassmobileview.png',
      desktopImage: '/brasshero.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center 50%',
      desktopPosition: 'center 60%',
    },
    {
      id: 'hero-3',
      mobileImage: '/assets/HERO 3.png',
      desktopImage: '/assets/HERO 3.png',
      fallback: '/assets/HERO2.png',
      mobilePosition: 'center 40%',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-copper',
      mobileImage: '/coppermobileview.png',
      desktopImage: '/copperhero.png',
      fallback: '/assets/Copper cover.png',
      mobilePosition: 'center 40%',
      desktopPosition: 'center 40%',
    },
    {
      id: 'hero-essentials',
      mobileImage: '/mandiressentialmobileview.png',
      desktopImage: '/essentialhero.png',
      fallback: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      mobilePosition: 'center 35%',
      desktopPosition: 'center 40%',
    },
    {
      id: 'hero-2',
      mobileImage: '/assets/HERO2.png',
      desktopImage: '/assets/HERO2.png',
      fallback: '/assets/handcrafted cover.jpg',
      mobilePosition: 'center 40%',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-7',
      mobileImage: '/assets/HERO7.png',
      desktopImage: '/assets/HERO7.png',
      fallback: '/assets/HERO2.png',
      mobilePosition: 'center 35%',
      desktopPosition: 'center center',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#1C1715] select-none"
      /* Mobile: 520px fixed. Tablet+: scales with viewport up to 700px */
      style={{ height: 'clamp(520px, 75vh, 700px)' }}
    >
      {/* Image Slides */}
      {heroImages.map((slide, idx) => {
        const isActive = idx === activeSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Mobile portrait image — hidden on sm+ */}
            <img
              src={slide.mobileImage}
              alt="Shraviko Sacred Collection"
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchpriority={idx === 0 ? 'high' : 'low'}
              onError={(e) => { if (e.target.src !== slide.fallback) e.target.src = slide.fallback; }}
              className="block sm:hidden absolute inset-0 w-full h-full object-cover hero-image-crisp"
              style={{ objectPosition: slide.mobilePosition }}
            />
            {/* Desktop image — hidden below sm */}
            <img
              src={slide.desktopImage}
              alt="Shraviko Sacred Collection"
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchpriority={idx === 0 ? 'high' : 'low'}
              onError={(e) => { if (e.target.src !== slide.fallback) e.target.src = slide.fallback; }}
              className="hidden sm:block absolute inset-0 w-full h-full object-cover hero-image-crisp"
              style={{ objectPosition: slide.desktopPosition }}
            />
          </div>
        );
      })}

      {/* Very subtle gradient — only at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/50 pointer-events-none" />

      {/* Hero Content — bottom-aligned, mobile-first sizing */}
      <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-12 lg:px-20 pb-10 sm:pb-14 lg:pb-20">
        <div className="max-w-sm sm:max-w-lg">
          {/* Eyebrow */}
          <p className="text-[9px] sm:text-[10px] font-cinzel tracking-[0.3em] text-[#D4B896] uppercase mb-2.5 sm:mb-3">
            Sacred Living · Handcrafted in India
          </p>

          {/* Headline — readable on 375px */}
          <h1
            className="font-cinzel font-bold text-white leading-tight mb-3 sm:mb-4"
            style={{
              fontSize: 'clamp(1.6rem, 8vw, 3.5rem)',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            Sacred Objects.<br />Timeless Craft.
          </h1>

          {/* Subtext — hidden on very small screens to avoid clutter */}
          <p
            className="hidden xs:block text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-6 sm:mb-8"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            Thoughtfully crafted pieces for your mandir, rituals, gifting, and everyday spiritual living.
          </p>
          <p
            className="xs:hidden text-xs text-white/80 font-light leading-relaxed mb-5"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            For your mandir, rituals & gifting.
          </p>

          {/* CTAs — Primary only on mobile, both on sm+ */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExploreClick}
              className="px-5 py-3 sm:px-6 sm:py-3 bg-white text-[#2C1F06] text-[10px] sm:text-xs font-cinzel font-bold tracking-widest uppercase rounded hover:bg-[#FAF0D9] transition-all duration-300 active:scale-95 shadow-md min-h-[44px]"
            >
              Shop Collection
            </button>
            <button
              onClick={onRitualsClick}
              className="hidden sm:flex items-center px-5 py-3 bg-transparent text-white text-xs font-cinzel font-semibold tracking-widest uppercase rounded border border-white/60 hover:bg-white/10 hover:border-white transition-all duration-300 min-h-[44px]"
            >
              Mandir Essentials
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
