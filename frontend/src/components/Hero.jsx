import React, { useState, useEffect } from 'react';

export const Hero = ({ onExploreClick, onRitualsClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = [
    {
      id: 'hero-launch',
      mobileImage: '/assets/Launchmobile.png',
      desktopImage: '/assets/Launch.png',
      fallback: '/assets/Pooja.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 9000, // Stay longer (9 seconds) for the launch banner slide!
    },
    {
      id: 'hero-pooja',
      mobileImage: '/assets/Poojamobile.png',
      desktopImage: '/assets/Pooja.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-candel',
      mobileImage: '/assets/Candelmobile.png',
      desktopImage: '/assets/Candel.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-calm',
      mobileImage: '/assets/Calmmobile.png',
      desktopImage: '/assets/Calm.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-4',
      mobileImage: '/assets/HERO4MOBILE.png',
      desktopImage: '/assets/HERO4.png',
      fallback: '/assets/Hero4.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-1',
      mobileImage: '/assets/HERO1MOBILEVIEW.png',
      desktopImage: '/assets/HERO1.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-2',
      mobileImage: '/assets/HERO2MBOILE.png',
      desktopImage: '/assets/HERO2.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-3',
      mobileImage: '/assets/HERO3MOBILE.png',
      desktopImage: '/assets/HERO3.png',
      fallback: '/assets/HERO2.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-copper',
      mobileImage: '/coppermobileview.png',
      desktopImage: '/copperhero.png',
      fallback: '/assets/Copper cover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
  ];

  // Preload images silently in background
  useEffect(() => {
    heroImages.forEach((img) => {
      const desktop = new Image();
      desktop.src = img.desktopImage;
      const mobile = new Image();
      mobile.src = img.mobileImage;
    });
  }, []);

  // Per-slide custom display duration timer
  useEffect(() => {
    const currentDuration = heroImages[activeSlide]?.duration || 4500;
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [activeSlide, heroImages.length]);

  return (
    <section
      className="
        relative w-full overflow-hidden
        bg-[#1C1715]
        select-none
        h-[560px]
        sm:h-[620px]
        lg:h-[680px]
        xl:h-[720px]
      "
    >
      {/* IMAGE SLIDES */}
      {heroImages.map((slide, idx) => {
        const isActive = idx === activeSlide;

        return (
          <div
            key={slide.id}
            className={`
              absolute inset-0
              transition-opacity
              duration-1000
              ease-in-out
              ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
          >
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={slide.mobileImage}
              />

              <img
                src={slide.desktopImage}
                alt="Shraviko Sacred Collection"
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={idx === 0 ? 'high' : 'low'}
                onError={(e) => {
                  if (e.currentTarget.src !== slide.fallback) {
                    e.currentTarget.src = slide.fallback;
                  }
                }}
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                "
                style={{
                  objectPosition: slide.desktopPosition,
                }}
              />
            </picture>
          </div>
        );
      })}

      {/* IMAGE OVERLAY */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-gradient-to-t
          from-black/45
          via-black/10
          to-transparent
        "
      />

      {/* HERO CONTENT — Centered floating Shop Collection button */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-12 sm:pb-16 lg:pb-20">
        <button
          onClick={onExploreClick}
          style={{
            animation: 'heroFloat 3s ease-in-out infinite',
          }}
          className="
            min-h-[48px]
            rounded-full
            bg-white/90
            backdrop-blur-sm
            px-8 py-3.5
            text-xs
            font-cinzel
            font-bold
            tracking-[0.2em]
            uppercase
            text-[#2C1F06]
            shadow-2xl
            border border-white/60
            transition-all
            duration-300
            hover:bg-white
            hover:scale-105
            hover:shadow-[0_8px_40px_rgba(197,160,89,0.4)]
            active:scale-95
          "
        >
          Shop Collection
        </button>
      </div>

      {/* SLIDE INDICATORS (DOTS) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === activeSlide
                ? 'w-6 h-1.5 bg-[#E5C378]'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
