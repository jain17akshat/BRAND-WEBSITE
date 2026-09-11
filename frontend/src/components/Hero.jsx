import React, { useState, useEffect, useRef } from 'react';

export const Hero = ({ onExploreClick, onRitualsClick, onVideoSlideChange }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const mobileVideoRef = useRef(null);
  const desktopVideoRef = useRef(null);

  // Detect mobile viewport eagerly to prevent loading unneeded videos
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroSlides = [
    {
      id: 'hero-launch',
      mobileVideo: '/Logo_animation_for_luxury_brand_202609091407.mp4',
      desktopVideo: '/Logo_animation_on_ivory_paper_202609091440.mp4',
      mobileImage: '/mobilevideo.webp',
      desktopImage: '/desktopvideo.webp',
      fallback: '/desktopvideo.webp',
      mobilePosition: 'center top',
      desktopPosition: 'center center',
      duration: 12000, // Longer for video playback
    },
    {
      id: 'hero-pooja',
      mobileImage: '/assets/Poojamobile.webp',
      desktopImage: '/assets/Pooja.webp',
      fallback: '/assets/brasscover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-candel',
      mobileImage: '/assets/Candelmobile.webp',
      desktopImage: '/assets/Candel.webp',
      fallback: '/assets/brasscover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-calm',
      mobileImage: '/assets/Calmmobile.webp',
      desktopImage: '/assets/Calm.webp',
      fallback: '/assets/brasscover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-4',
      mobileImage: '/assets/HERO4MOBILE.webp',
      desktopImage: '/assets/HERO4.webp',
      fallback: '/assets/Hero4.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-1',
      mobileImage: '/assets/HERO1MOBILEVIEW.webp',
      desktopImage: '/assets/HERO1.webp',
      fallback: '/assets/brasscover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-2',
      mobileImage: '/assets/HERO2MBOILE.webp',
      desktopImage: '/assets/HERO2.webp',
      fallback: '/assets/brasscover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-3',
      mobileImage: '/assets/HERO3MOBILE.webp',
      desktopImage: '/assets/HERO3.webp',
      fallback: '/assets/HERO2.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-copper',
      mobileImage: '/coppermobileview.webp',
      desktopImage: '/copperhero.webp',
      fallback: '/assets/Copper cover.webp',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
      duration: 4500,
    },
    {
      id: 'hero-mandir',
      mobileImage: '/mandirphone view.webp',
      desktopImage: '/mandiressentials.webp',
      fallback: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      mobilePosition: 'center 45%',
      desktopPosition: 'center 45%',
      duration: 4500,
    },
  ];

  // REMOVED: Aggressive upfront preload of all 20 hero images on mount.
  // Previously this created ~20 new Image() instances immediately, saturating the
  // browser request queue and delaying LCP. Instead, prefetch only the NEXT slide
  // image ~1 second before the transition fires.
  useEffect(() => {
    const nextIdx = (activeSlide + 1) % heroSlides.length;
    const nextSlide = heroSlides[nextIdx];
    const currentDuration = heroSlides[activeSlide]?.duration || 4500;

    // Preload next slide's image 1 second before the transition
    const preloadDelay = Math.max(currentDuration - 1000, 0);
    const timer = setTimeout(() => {
      const imgSrc = isMobile ? nextSlide.mobileImage : nextSlide.desktopImage;
      if (imgSrc && !nextSlide.mobileVideo && !nextSlide.desktopVideo) {
        const img = new window.Image();
        img.src = imgSrc;
      }
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [activeSlide, isMobile, heroSlides.length]);

  // Play/pause videos when the launch slide becomes active
  useEffect(() => {
    const isVideoSlide = activeSlide === 0;

    // Mobile video
    if (mobileVideoRef.current) {
      if (isVideoSlide && isMobile) {
        mobileVideoRef.current.currentTime = 0;
        mobileVideoRef.current.play().catch(() => {});
      } else {
        mobileVideoRef.current.pause();
      }
    }

    // Desktop video
    if (desktopVideoRef.current) {
      if (isVideoSlide && !isMobile) {
        desktopVideoRef.current.currentTime = 0;
        desktopVideoRef.current.play().catch(() => {});
      } else {
        desktopVideoRef.current.pause();
      }
    }
  }, [activeSlide, isMobile]);

  // Notify parent when video slide becomes active/inactive
  useEffect(() => {
    const isVideoSlide = activeSlide === 0;
    if (onVideoSlideChange) {
      onVideoSlideChange(isVideoSlide);
    }
  }, [activeSlide]);

  // Per-slide custom display duration timer
  useEffect(() => {
    const currentDuration = heroSlides[activeSlide]?.duration || 4500;
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [activeSlide, heroSlides.length]);

  const [touchStartX, setTouchStartX] = useState(null);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

  const isVideoActive = activeSlide === 0;

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`
        relative w-full overflow-hidden
        bg-[#1C1715]
        select-none
        transition-all duration-700
        ${isVideoActive
          ? 'h-screen pt-0'
          : 'h-[700px] sm:h-[760px] lg:h-[680px] xl:h-[720px] pt-[84px] lg:pt-0'
        }
      `}
    >
      {/* VIDEO / IMAGE SLIDES */}
      {heroSlides.map((slide, idx) => {
        const isActive = idx === activeSlide;
        const hasVideo = slide.mobileVideo || slide.desktopVideo;

        return (
          <div
            key={slide.id}
            className={`
              absolute inset-0
              transition-opacity
              duration-1000
              ease-in-out
              img-reveal-scale
              ${isActive ? 'opacity-100 is-visible' : 'opacity-0 pointer-events-none'}
            `}
          >
            {/* ── Mobile Video (shown only on mobile < 640px) ── */}
            {slide.mobileVideo && isMobile && (
              <video
                ref={idx === 0 ? mobileVideoRef : null}
                src={slide.mobileVideo}
                poster={slide.mobileImage || slide.fallback}
                muted
                playsInline
                autoPlay
                preload="metadata"
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  block sm:hidden
                "
                style={{ objectPosition: 'center center' }}
              />
            )}

            {/* ── Desktop Video (shown only on desktop >= 640px) ── */}
            {slide.desktopVideo && !isMobile && (
              <video
                ref={idx === 0 ? desktopVideoRef : null}
                src={slide.desktopVideo}
                poster={slide.desktopImage || slide.fallback}
                muted
                playsInline
                autoPlay
                preload="metadata"
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  hidden sm:block
                "
                style={{ objectPosition: 'center center' }}
              />
            )}

            {/* ── Fallback static image (hidden when video is available on that viewport) ── */}
            {!hasVideo && (
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet={slide.mobileImage}
                />
                <img
                  src={slide.desktopImage}
                  alt="Shraviko Collection"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  fetchpriority={idx === 0 ? 'high' : 'low'}
                  width="1920"
                  height="1080"
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
                    objectPosition: slide.mobilePosition || 'center top',
                  }}
                />
              </picture>
            )}

            {/* For slides with video: show static image only as a non-video-viewport fallback */}
            {hasVideo && (
              <picture className={`
                ${slide.mobileVideo ? 'hidden' : 'block'} 
                ${slide.desktopVideo ? 'sm:hidden' : 'sm:block'}
              `}>
                <source
                  media="(max-width: 639px)"
                  srcSet={slide.mobileImage}
                />
                <img
                  src={slide.desktopImage}
                  alt="Shraviko Collection"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchpriority={idx === 0 ? 'high' : 'low'}
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
                    objectPosition: slide.mobilePosition || 'center top',
                  }}
                />
              </picture>
            )}
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

      {/* PREVIOUS SLIDE BUTTON */}
      <button
        onClick={handlePrevSlide}
        aria-label="Previous Slide"
        className="
          absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-11 sm:h-11 rounded-full
          bg-black/30 hover:bg-black/60 backdrop-blur-md
          border border-white/20 hover:border-[#C5A059]
          text-white/80 hover:text-[#C5A059]
          flex items-center justify-center
          transition-all duration-300
          shadow-lg active:scale-90 focus:outline-none
        "
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* NEXT SLIDE BUTTON */}
      <button
        onClick={handleNextSlide}
        aria-label="Next Slide"
        className="
          absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-11 sm:h-11 rounded-full
          bg-black/30 hover:bg-black/60 backdrop-blur-md
          border border-white/20 hover:border-[#C5A059]
          text-white/80 hover:text-[#C5A059]
          flex items-center justify-center
          transition-all duration-300
          shadow-lg active:scale-90 focus:outline-none
        "
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* HERO CONTENT — Centered floating Shop Collection button (Hidden on hero-launch slide) */}
      {heroSlides[activeSlide]?.id !== 'hero-launch' && (
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-14 sm:pb-16 lg:pb-20">
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
              magnetic-hover
              hover:shadow-[0_8px_40px_rgba(197,160,89,0.4)]
              active:scale-95
            "
          >
            Shop Collection
          </button>
        </div>
      )}

      {/* HERO IMAGE SLIDER INDICATOR DOTS */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
        {heroSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`
              h-2 rounded-full transition-all duration-300 focus:outline-none
              ${idx === activeSlide
                ? 'w-7 sm:w-8 bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.8)]'
                : 'w-2 bg-white/40 hover:bg-white/80'
              }
            `}
          />
        ))}
      </div>

    </section>
  );
};
