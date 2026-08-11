import React from 'react';

export const VisualGallery = () => {
  const images = [
    {
      src: '/brasshero.png',
      alt: 'Brass Craftsmanship',
      fallback: '/assets/brasscover.png',
      position: 'center 60%',
    },
    {
      src: '/copperhero.png',
      alt: 'Pure Copper Vessels',
      fallback: '/assets/Copper cover.png',
      position: 'center 40%',
    },
    {
      src: '/essentialhero.png',
      alt: 'Mandir Essentials Setup',
      fallback: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      position: 'center 35%',
    },
    {
      src: '/assets/handcrafted cover.jpg',
      alt: 'Artisan Handcrafted Living',
      fallback: '/assets/HERO2.png',
      position: 'center center',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10 text-center sm:text-left">
          <p className="text-[9px] sm:text-[10px] font-cinzel tracking-[0.28em] text-[#9B7E52] uppercase mb-1.5">
            Visual Story
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-cinzel font-bold text-[#2C2623] tracking-wide">
            From the Shraviko World
          </h2>
        </div>

        {/* 2-column grid on mobile, 4-column grid on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl bg-[#1C1715] aspect-square sm:aspect-[4/5]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onError={(e) => {
                  if (e.target.src !== img.fallback) e.target.src = img.fallback;
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hero-image-crisp"
                style={{ objectPosition: img.position }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
