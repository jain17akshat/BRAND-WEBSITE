import React from 'react';
import { Wind, ShieldCheck, Sparkles, Sun, Flower2, Flame, Heart, Feather } from 'lucide-react';

export const IncenseWisdomSection = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      badge: 'Clean Air Guarantee',
      title: '100% Charcoal-Free & Non-Toxic',
      description: 'Unlike commercial synthetic sticks made with coal dust and chemical fixatives that cause indoor smoke irritation, Shraviko incense is 100% charcoal-free. Hand-rolled using natural wood gums and pure essential oils for clean, pure breathing.',
      highlight: 'Zero Coal Dust • Non-Irritating'
    },
    {
      icon: Sparkles,
      badge: 'Ayurvedic Science',
      title: 'Therapeutic Aromatherapy & Calm',
      description: 'Authentic botanical scents like Mysore Sandalwood (Chandan), Kashmiri Saffron (Kesar), Desi Gulab, and French Lavender interact with the limbic system to lower cortisol, relieve stress, and deepen focus during meditation and prayer.',
      highlight: 'Reduces Stress • Enhances Focus'
    },
    {
      icon: Flame,
      badge: 'Vedic Cleansing',
      title: 'Aura Purification & Negative Energy Shift',
      description: 'Sacred resins like Shuddh Guggul, Pure Loban, Bhimseni Kapoor, and Sambrani have been revered in Vedic scriptures for millennia. Their fragrant smoke neutralizes airborne pathogens, dispels stagnant energy, and fills your space with divine peace.',
      highlight: 'Air Antimicrobial • Energy Neutralizer'
    },
    {
      icon: Flower2,
      badge: 'Sacred Upcycling',
      title: 'Recycled Temple Flower Devotion',
      description: 'Our incense sticks give new divine life to sacred flower garlands offered at Indian temple altars. Upcycled by skilled women artisans with devotion, protecting sacred rivers while creating sustainable livelihood.',
      highlight: '100% Eco-Friendly • Temple Flowers'
    }
  ];

  const usageGuides = [
    {
      step: '01',
      title: 'Morning Worship & Pooja',
      recommendation: 'Vedic Sandalwood & Kesar Chandan',
      desc: 'Light at dawn in your home mandir to invoke clarity, warmth, and auspicious divine energy for the day ahead.'
    },
    {
      step: '02',
      title: 'Evening Meditation & Calm',
      recommendation: 'French Lavender & Royal Regal Oudh',
      desc: 'Burn after dusk to wash away workday mental fatigue, soothe hyperactive nerves, and prepare for serene sleep.'
    },
    {
      step: '03',
      title: 'Home Dhuni & Space Cleansing',
      recommendation: 'Guggul, Loban & Sambrani Dhoop Cups',
      desc: 'Purify room corners during Tuesdays, Saturdays, and New Moon days to dispel negative vibrations and stale odors.'
    },
    {
      step: '04',
      title: 'Continuous Natural Freshness',
      recommendation: 'Chandan & Lavender Camphor Cones',
      desc: 'Hang in wardrobes, study spaces, or cars to continuously repel flies and insects while diffusing pure Bhimseni Kapoor aroma.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#181412] text-[#F9F5EC] relative overflow-hidden border-t border-[#C5A059]/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#9B7E52]/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Decorative Golden Pattern SVG */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5A059'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3Ccircle cx='30' cy='30' r='12' stroke='%23C5A059' stroke-width='0.5' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A231F] border border-[#C5A059]/40 text-[#E5C378] text-xs font-cinzel tracking-widest uppercase shadow-lg">
            <Feather className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Vedic Sensory & Health Science</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-wide leading-tight">
            The Sacred Wisdom & Importance of Vedic Incense
          </h2>

          <p className="text-sm sm:text-base font-sans text-[#D4CEBF] font-light leading-relaxed">
            In ancient Bharat, lighting natural incense and Vedic dhoop was never a mere scent—it was a sacred daily ritual for air purification, mental tranquility, and spiritual elevation.
          </p>
        </div>

        {/* 4 PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#231E1B]/90 border border-[#C5A059]/30 hover:border-[#E5C378] p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#2D2622] border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-[#181412] transition-all duration-300">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-cinzel tracking-widest text-[#C5A059] uppercase bg-[#181412] px-2.5 py-1 rounded-md border border-[#C5A059]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-white mb-3 group-hover:text-[#E5C378] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs font-sans text-[#C5BDB0] leading-relaxed mb-6 font-light">
                    {pillar.description}
                  </p>
                </div>

                {/* Highlight Chip */}
                <div className="pt-4 border-t border-[#C5A059]/20 flex items-center gap-1.5 text-[11px] font-cinzel font-semibold text-[#E5C378]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DAILY RITUAL USAGE GUIDE */}
        <div className="bg-gradient-to-r from-[#231E1B] via-[#2A231F] to-[#231E1B] border border-[#C5A059]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mb-2">
              How to Integrate Incense into Your Daily Life
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#D4CEBF]">
              Maximize the spiritual and therapeutic benefits of natural fragrances throughout your daily routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageGuides.map((guide) => (
              <div
                key={guide.step}
                className="bg-[#181412]/80 border border-[#C5A059]/30 rounded-xl p-5 hover:border-[#E5C378] transition-all"
              >
                <div className="text-2xl font-cinzel font-bold text-[#C5A059] mb-2 opacity-80">
                  {guide.step}
                </div>
                <h4 className="font-cinzel text-sm font-bold text-white mb-1">
                  {guide.title}
                </h4>
                <p className="text-[11px] font-cinzel font-semibold text-[#E5C378] mb-2">
                  Recommended: {guide.recommendation}
                </p>
                <p className="text-xs font-sans text-[#BDB5A6] font-light leading-relaxed">
                  {guide.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
