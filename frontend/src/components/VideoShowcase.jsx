import React, { useState, useRef } from 'react';
import { Film, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export const VideoShowcase = () => {
  const [popupVideo, setPopupVideo] = useState(null);
  const sliderRef = useRef(null);

  const reelList = [
    { id: 'v1', title: 'Handcrafted 24K Gold Yantra Creation', videoUrl: '/assets/Video1.mp4' },
    { id: 'v2', title: 'Pure Vedic Brass Aarti Diya Rituals', videoUrl: '/assets/Video2.mp4' },
    { id: 'v3', title: '100% Organic Charcoal-Free Incense', videoUrl: '/assets/Video 3.mp4' },
    { id: 'v4', title: 'Corporate Sacred Gifting Collections', videoUrl: '/assets/Video4.mp4' },
    { id: 'v5', title: 'Authentic Vastu Energy Alignment', videoUrl: '/assets/Video5.mp4' }
  ];

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 text-[#2C2623] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0D9] border border-[#EAD7AF] text-[#755722] text-xs font-cinzel tracking-widest uppercase shadow-xs">
            <Film className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Sacred Video Reels</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#2C2623] tracking-tight">
            Artisan Stories & Craft in Motion
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans font-light">
            Swipe right to left to explore live craft demonstrations & sacred rituals
          </p>
        </div>

        {/* Carousel Container with Overlay Buttons on Both Ends */}
        <div className="relative group">
          
          {/* Left Arrow Button on Left End */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1C1715]/85 hover:bg-[#C5A059] text-white hover:text-black border border-[#C5A059]/50 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button on Right End */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1C1715]/85 hover:bg-[#C5A059] text-white hover:text-black border border-[#C5A059]/50 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Ultra-Smooth Horizontal Scroll Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 py-4 px-2 sm:px-4 scrollbar-none scroll-smooth -webkit-overflow-scrolling-touch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reelList.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setPopupVideo(reel)}
                className="group/card relative flex-none w-[160px] xs:w-[185px] sm:w-[250px] md:w-[270px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#EAE0CD] hover:border-[#C5A059] shadow-md hover:shadow-2xl transition-all duration-500 snap-start cursor-pointer transform hover:-translate-y-1.5"
              >
                {/* HTML5 Autoplaying Video */}
                <video
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay Gradient & Play Icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059]/90 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover/card:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Reel Title Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs font-cinzel text-white font-medium line-clamp-2 drop-shadow-md">
                    {reel.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Pop-up Full-Screen Video Reel Modal */}
      {popupVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setPopupVideo(null)}
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pop-up Close Button */}
            <button
              onClick={() => setPopupVideo(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
              aria-label="Close Pop-up Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pop-up Video Player */}
            <video
              src={popupVideo.videoUrl}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

    </section>
  );
};

export default VideoShowcase;
