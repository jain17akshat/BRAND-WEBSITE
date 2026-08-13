import React from 'react';

export const Collections = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'brass',
      title: 'Brass',
      image: '/brasshero.png',
      mobileImage: '/brassmobileview.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center 55%',
      desktopPosition: 'center 60%',
    },
    {
      id: 'copper',
      title: 'Copper',
      image: '/copperhero.png',
      mobileImage: '/coppermobileview.png',
      fallback: '/assets/Copper cover.png',
      mobilePosition: 'center 40%',
      desktopPosition: 'center 40%',
    },
    {
      id: 'mandir-essentials',
      title: 'Mandir Essentials',
      image: '/essentialhero.png',
      mobileImage: '/mandiressentialmobileview.png',
      fallback: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      mobilePosition: 'center 35%',
      desktopPosition: 'center 40%',
    },
    {
      id: 'kits',
      title: 'Corporate Gifting',
      image: '/copperatepcview.png',
      mobileImage: '/copperatemobileview.png',
      fallback: '/assets/handcrafted cover.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
  ];

  return (
    <section className="py-8 sm:py-14 lg:py-20 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-5 sm:mb-8 lg:mb-12">
          <p className="text-[9px] sm:text-[10px] font-cinzel tracking-[0.28em] text-[#9B7E52] uppercase mb-1.5">Collections</p>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-cinzel font-bold text-[#2C2623] tracking-wide">
            Shop by Collection
          </h2>
        </div>

        {/* 2-col grid on mobile (always), 2-col on desktop too */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCategory && onSelectCategory(col.id)}
              className="group relative overflow-hidden rounded-xl cursor-pointer bg-[#1C1715]"
              /* Mobile: 4:5 portrait ratio — shows product well. Desktop: 3:2 landscape */
              style={{ aspectRatio: window.innerWidth < 640 ? '4/5' : '4/5' }}
            >
              {/* Mobile image */}
              <img
                src={col.mobileImage || col.image}
                alt={col.title}
                loading="lazy"
                onError={(e) => { if (e.target.src !== col.fallback) e.target.src = col.fallback; }}
                className="block sm:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hero-image-crisp"
                style={{ objectPosition: col.mobilePosition }}
              />
              {/* Desktop image */}
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                onError={(e) => { if (e.target.src !== col.fallback) e.target.src = col.fallback; }}
                className="hidden sm:block absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hero-image-crisp"
                style={{ objectPosition: col.desktopPosition }}
              />

              {/* Bottom gradient for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 p-3.5 sm:p-5 lg:p-7">
                <h3 className="font-cinzel font-bold text-white text-sm sm:text-base lg:text-xl tracking-wide mb-0.5 drop-shadow">
                  {col.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-cinzel text-[#D4B896] tracking-widest uppercase group-hover:text-white transition-colors">
                  Explore
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
