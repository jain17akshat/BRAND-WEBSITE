import React, { useState, useEffect } from 'react';

export const Hero = ({ onExploreClick, onRitualsClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = [
    {
      id: 'hero-pooja',
      mobileImage: '/assets/Poojamobile.png',
      desktopImage: '/assets/Pooja.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-candel',
      mobileImage: '/assets/Candelmobile.png',
      desktopImage: '/assets/Candel.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-calm',
      mobileImage: '/assets/Calmmobile.png',
      desktopImage: '/assets/Calm.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-4',
      mobileImage: '/assets/HERO4MOBILE.png',
      desktopImage: '/assets/HERO4.png',
      fallback: '/assets/Hero4.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-1',
      mobileImage: '/assets/HERO1MOBILEVIEW.png',
      desktopImage: '/assets/HERO1.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-2',
      mobileImage: '/assets/HERO2MBOILE.png',
      desktopImage: '/assets/HERO2.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-3',
      mobileImage: '/assets/HERO3MOBILE.png',
      desktopImage: '/assets/HERO3.png',
      fallback: '/assets/HERO2.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'hero-copper',
      mobileImage: '/coppermobileview.png',
      desktopImage: '/copperhero.png',
      fallback: '/assets/Copper cover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
  ];

  useEffect(() => {
    // Preload remaining hero slide images silently in memory
    heroImages.forEach((img) => {
      const desktop = new Image();
      desktop.src = img.desktopImage;
      const mobile = new Image();
      mobile.src = img.mobileImage;
    });

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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

      {/* HERO CONTENT — Clean Shop Collection button only */}
      <div
        className="
          absolute inset-0 z-10
          flex items-end justify-between
          px-5
          sm:px-12
          lg:px-20
          pb-10
          sm:pb-14
          lg:pb-20
        "
      >
        <div>
          <button
            onClick={onExploreClick}
            className="
              min-h-[44px]
              rounded
              bg-white
              px-6 py-3.5
              text-xs
              font-cinzel
              font-bold
              tracking-widest
              uppercase
              text-[#2C1F06]
              shadow-xl
              transition-all
              duration-300
              hover:bg-[#FAF0D9]
              active:scale-95
            "
          >
            Shop Collection
          </button>
        </div>

        {/* Netflix-style Slide Indicators */}
        <div className="flex items-center gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-8 bg-[#E5C378]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
