import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const Collections = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'metalware',
      title: 'Artisanal Metalware',
      subtitle: 'Pure Brass & Heavy Copper',
      image: '/Outside images/METALWARE.webp',
      mobileImage: '/Outside images/Metalwaremobile.webp',
      fallback: '/assets/brasscover.webp',
      pastelBg: 'bg-[#F8F3E6]', // Champagne
      borderColor: 'border-[#EADCC8]',
    },
    {
      id: 'mandir-essentials',
      title: 'Mandir Essentials',
      subtitle: 'Altar Articles, Diyas & Thalis',
      image: '/pooja essentials.webp',
      mobileImage: '/Pooja esentials.webp',
      fallback: '/assets/brasscover.webp',
      pastelBg: 'bg-[#ECE8F3]', // Lavender
      borderColor: 'border-[#DDD6E8]',
    },
    {
      id: 'incense',
      title: 'Incense & Organic Dhoop',
      subtitle: 'Charcoal-Free Temple Florals',
      image: '/Outside images/incenseimagedesktop.webp',
      mobileImage: '/Outside images/incnesestickmobile.webp',
      fallback: '/assets/Incense cover.webp',
      pastelBg: 'bg-[#EBF2EB]', // Sage
      borderColor: 'border-[#D7E4D7]',
    },
    {
      id: 'kits',
      title: 'Corporate Gifting',
      subtitle: 'Bespoke Devotional Hampers',
      image: '/Outside images/essentialhero.webp',
      mobileImage: '/Outside images/mandiressentialmobileview.webp',
      fallback: '/assets/handcrafted cover.webp',
      pastelBg: 'bg-[#FBEAE5]', // Blush
      borderColor: 'border-[#F4D4CC]',
    },
    {
      id: 'energy-stones',
      title: 'Energy Stones & Pyramids',
      subtitle: 'Natural Healing Gemstones & Malas',
      image: '/Outside images/braclet desktopview.webp',
      mobileImage: '/Outside images/energystones mobile view.webp',
      fallback: '/assets/handcrafted cover.webp',
      pastelBg: 'bg-[#EAF1F5]', // Celestial Blue
      borderColor: 'border-[#D4E3EB]',
    },
    {
      id: 'vastu',
      title: 'Vastu & Sacred Yantras',
      subtitle: 'Geometric Harmonizers & Talismans',
      image: '/assets/luxmiyantra/laxmi1.webp',
      mobileImage: '/assets/luxmiyantra/laxmi1.webp',
      fallback: '/assets/brasscover.webp',
      pastelBg: 'bg-[#FDF1E6]', // Apricot
      borderColor: 'border-[#F8DCBE]',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="text-[11px] sm:text-xs font-manrope font-semibold tracking-[0.18em] text-[#8C7D75] uppercase mb-1.5">
              Curated By Intent
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fraunces font-semibold text-[#2A221E] leading-tight">
              Shop by Collection
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory && onSelectCategory('all-collections')}
            className="link-action text-sm self-start sm:self-auto cursor-pointer"
          >
            <span>View all collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCategory && onSelectCategory(col.id)}
              className={`group relative rounded-2xl p-4 sm:p-5 ${col.pastelBg} border ${col.borderColor} overflow-hidden transition-all duration-200 hover:shadow-[0_12px_28px_rgba(42,34,30,0.08)] cursor-pointer flex flex-col justify-between`}
            >
              {/* Product Visual Container with 16px soft corners */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-white/70">
                <SafeImage
                  src={col.image}
                  alt={col.title}
                  fallbackSrc={col.fallback}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Title & Arrow in Deep Plum */}
              <div className="flex items-end justify-between gap-3 pt-1">
                <div>
                  <h3 className="font-fraunces text-base sm:text-lg font-semibold text-[#2A221E] group-hover:text-[#57324F] transition-colors leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#685951] font-manrope mt-0.5">
                    {col.subtitle}
                  </p>
                </div>

                <span className="w-8 h-8 rounded-full bg-[#57324F] text-white flex items-center justify-center shrink-0 group-hover:bg-[#42253C] group-hover:translate-x-0.5 transition-all shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
