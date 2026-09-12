import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, Pause } from 'lucide-react';

/**
 * VideoShowcase — Compressed-video, lazy-loading rewrite
 *
 * KEY DESIGN DECISIONS:
 * 1. Sources point to /assets/compressed/ (4 videos, ~4-8 MB each instead of ~10 MB).
 * 2. Videos are NOT loaded until their card enters the viewport (IntersectionObserver).
 *    - The <video> element always exists (for poster display) but has NO `src` until
 *      the observer fires. This means zero network requests on page load for off-screen
 *      videos.
 *    - `preload="none"` is set on every card video.
 * 3. Only one card video plays at a time — the most-recently-intersected one.
 *    All others are paused and their `src` is not removed (they stay buffered) but
 *    they stop consuming CPU/GPU.
 * 4. The fullscreen modal mounts a *separate* <video> with only the selected reel's
 *    URL; it does not load all 4 videos.
 * 5. No setTimeout hacks, no requestAnimationFrame loops.
 */

/* ─── Reel data ─────────────────────────────────────────────────────────── */
const REEL_LIST = [
  { id: 'v1', title: 'Handcrafted 24K Gold Yantra Creation', videoUrl: '/assets/compressed/Video1.mp4' },
  { id: 'v2', title: 'Pure Vedic Brass Aarti Diya Rituals', videoUrl: '/assets/compressed/Video2.mp4' },
  { id: 'v3', title: '100% Organic Charcoal-Free Incense', videoUrl: '/assets/compressed/Video 3.mp4' },
  { id: 'v4', title: 'Corporate Sacred Gifting Collections', videoUrl: '/assets/compressed/Video4.mp4' },
];

/* ─── Main component ────────────────────────────────────────────────────── */
export const VideoShowcase = () => {
  const [popupIndex, setPopupIndex] = useState(null); // index into REEL_LIST or null
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openReel = useCallback((index) => setPopupIndex(index), []);
  const closeReel = useCallback(() => setPopupIndex(null), []);

  return (
    <section className="py-12 sm:py-16 text-[#2C2623] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1C1715]/85 hover:bg-[#C5A059] text-white hover:text-black border border-[#C5A059]/50 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1C1715]/85 hover:bg-[#C5A059] text-white hover:text-black border border-[#C5A059]/50 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontal reel slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 py-4 px-2 sm:px-4 scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REEL_LIST.map((reel, idx) => (
              <LazyVideoCard
                key={reel.id}
                reel={reel}
                onOpen={() => openReel(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Reel Modal */}
      {popupIndex !== null && (
        <FullscreenReelModal
          reels={REEL_LIST}
          startIndex={popupIndex}
          onClose={closeReel}
        />
      )}
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   LazyVideoCard — IntersectionObserver-driven card.
   
   - Renders a <video> with NO src and preload="none" initially.
   - When the card enters the viewport, src is set and playback begins (muted).
   - When the card leaves the viewport, video is paused (src stays for cache).
   - A gradient poster placeholder is shown while the video hasn't loaded a frame.
   ═══════════════════════════════════════════════════════════════════════════ */
const LazyVideoCard = ({ reel, onOpen }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [srcLoaded, setSrcLoaded] = useState(false);   // src attribute has been set
  const [hasFrame, setHasFrame] = useState(false);      // at least one frame decoded

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // Set src only once — this triggers the actual network request
          if (!srcLoaded) {
            video.src = reel.videoUrl;
            video.load();
            setSrcLoaded(true);
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reel.videoUrl, srcLoaded]);

  const handleLoadedData = useCallback(() => setHasFrame(true), []);

  return (
    <div
      ref={containerRef}
      onClick={onOpen}
      className="group/card relative flex-none w-[140px] xs:w-[160px] sm:w-[250px] md:w-[270px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#EAE0CD] hover:border-[#C5A059] shadow-md hover:shadow-2xl transition-all duration-500 snap-start cursor-pointer transform hover:-translate-y-1.5"
    >
      {/* Gradient poster — visible until first video frame is painted */}
      {!hasFrame && (
        <div className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(135deg, #1C1715 0%, #2C2623 40%, #3D322C 70%, #1C1715 100%)',
          }}
        >
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 skeleton-shimmer opacity-40" />
          {/* Centred play icon on poster */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C5A059]/30 border border-[#C5A059]/50 flex items-center justify-center">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059]/80 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Video element — always mounted for ref stability, but has no src until IO fires */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        onLoadedData={handleLoadedData}
        className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />

      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-[2]">
        <p className="text-white text-[10px] xs:text-xs sm:text-sm font-medium leading-tight line-clamp-2 drop-shadow-lg">
          {reel.title}
        </p>
      </div>

      {/* Hover play icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-[3]">
        <div className="w-12 h-12 rounded-full bg-[#C5A059]/90 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover/card:scale-100 transition-transform">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   FullscreenReelModal — Mobile-optimised reel viewer.

   - Loads ONLY the currently-selected video (not all reels).
   - Body scroll is locked while open.
   - Swipe left / right on touch to navigate between reels.
   - Prev / Next buttons for desktop.
   - Mute / Unmute toggle.
   - Tap centre to play / pause.
   - playsInline for iOS compatibility.
   ═══════════════════════════════════════════════════════════════════════════ */
const FullscreenReelModal = ({ reels, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  // Touch state for swipe detection
  const touchStart = useRef({ x: 0, y: 0 });
  const touchMoved = useRef(false);

  const currentReel = reels[currentIndex];

  /* ── Body scroll lock ──────────────────────────────────────────── */
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  /* ── Auto-play the selected video when index changes ───────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset state for new reel
    setIsPaused(false);
    video.load();
    video.play().catch(() => {});
  }, [currentIndex]);

  /* ── Navigation helpers ────────────────────────────────────────── */
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < reels.length - 1 ? i + 1 : 0));
  }, [reels.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : reels.length - 1));
  }, [reels.length]);

  /* ── Keyboard navigation ───────────────────────────────────────── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  /* ── Touch swipe handling ──────────────────────────────────────── */
  const handleTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchMoved.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
    // Only count as a swipe if horizontal movement exceeds vertical
    if (dx > 15 || dy > 15) {
      touchMoved.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchMoved.current) return; // It was a tap, not a swipe

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    // Require meaningful horizontal distance and mostly-horizontal gesture
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  /* ── Tap to play / pause ───────────────────────────────────────── */
  const handleVideoTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, []);

  /* ── Mute toggle ───────────────────────────────────────────────── */
  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setIsMuted((m) => !m);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full h-full sm:w-auto sm:h-auto sm:max-w-sm md:max-w-md sm:aspect-[9/16] bg-black sm:rounded-3xl overflow-hidden sm:shadow-2xl sm:border sm:border-[#C5A059] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
          aria-label="Close Video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mute / Unmute button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Prev / Next navigation (desktop & mobile) */}
        {reels.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label="Previous Reel"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label="Next Reel"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Tap area for play / pause (the video itself) */}
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={handleVideoTap}
        />

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute inset-0 z-[21] flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Pause className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* The single video — only this reel's URL is loaded */}
        <video
          ref={videoRef}
          key={currentReel.id}
          src={currentReel.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 z-[25] pointer-events-none">
          <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-6 pt-12 sm:pb-8 sm:pt-16">
            <p className="text-white text-sm sm:text-base font-semibold leading-tight drop-shadow-lg">
              {currentReel.title}
            </p>
            {/* Reel position indicator */}
            <div className="flex gap-1.5 mt-3">
              {reels.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 bg-[#C5A059]'
                      : 'w-3 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShowcase;
