import React from 'react';
import { SafeImage } from './SafeImage';

export const Collections = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'metalware',
      title: 'Metalware (Brass & Copper)',
      image: '/METALWARE.png',
      mobileImage: '/Metalwaremobile.png',
      fallback: '/assets/brasscover.png',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'mandir-essentials',
      title: 'Mandir Essentials',
      image: '/mandiressentials.png',
      mobileImage: '/mandirphone view.png',
      fallback: '/assets/Rudraksh Mala/rudraksh mala 1.png',
      mobilePosition: 'center 45%',
      desktopPosition: 'center 45%',
    },
    {
      id: 'incense',
      title: 'Incense & Dhoop',
      image: '/incesne hero.png',
      mobileImage: '/incesne hero.png',
      fallback: '/assets/Incense cover.jpg',
      mobilePosition: 'center center',
      desktopPosition: 'center center',
    },
    {
      id: 'kits',
      title: 'Corporate Gifting',
      image: '/essentialhero.png',
      mobileImage: '/mandiressentialmobileview.png',
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
              className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/3] sm:aspect-[16/10] shadow-xs"
            >
              {/* Mobile image */}
              <div className="block sm:hidden absolute inset-0 w-full h-full">
                <SafeImage
                  src={col.mobileImage || col.image}
                  alt={col.title}
                  fallbackSrc={col.fallback}
                  dark={true}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hero-image-crisp"
                  style={{ objectPosition: col.mobilePosition }}
                />
              </div>
              {/* Desktop image */}
              <div className="hidden sm:block absolute inset-0 w-full h-full">
                <SafeImage
                  src={col.image}
                  alt={col.title}
                  fallbackSrc={col.fallback}
                  dark={true}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hero-image-crisp"
                  style={{ objectPosition: col.desktopPosition }}
                />
              </div>

              {/* Bottom gradient for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

              {/* Card Label */}
              <div className="absolute bottom-2.5 left-3 sm:bottom-4 sm:left-5 right-3 z-10">
                <h3 className="font-cinzel text-xs sm:text-lg font-bold text-[#F5EAD4] tracking-wide leading-tight group-hover:text-white transition-colors">
                  {col.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
