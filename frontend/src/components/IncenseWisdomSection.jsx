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
      title: 'Aura Purification & Energy Shift',
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
    <section className="py-16 sm:py-24 bg-[#1E181D] text-[#FAF7F2] relative overflow-hidden border-t border-white/10">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FBEAE5] text-xs font-manrope font-semibold tracking-wide">
            <Feather className="w-3.5 h-3.5 text-[#FBEAE5]" />
            <span>Vedic Sensory &amp; Health Science</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-fraunces font-bold text-white tracking-tight leading-tight">
            The Sacred Wisdom of Vedic Incense
          </h2>

          <p className="text-sm sm:text-base font-manrope text-[#EAE0CD] font-light leading-relaxed">
            In ancient Bharat, lighting natural incense and Vedic dhoop was never a mere scent—it was a sacred daily ritual for air purification, mental tranquility, and spiritual elevation.
          </p>
        </div>

        {/* 4 PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/5 border border-white/10 hover:border-white/30 p-6 sm:p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FBEAE5] transition-all">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-manrope tracking-wider text-[#FBEAE5] uppercase bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-fraunces text-lg font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs font-manrope text-[#D4C3D0] leading-relaxed mb-6 font-light">
                    {pillar.description}
                  </p>
                </div>

                {/* Highlight Chip */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs font-manrope font-medium text-[#FBEAE5]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FBEAE5]" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DAILY RITUAL USAGE GUIDE */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-fraunces font-bold text-white mb-2">
              How to Integrate Incense into Your Daily Life
            </h3>
            <p className="text-xs sm:text-sm font-manrope text-[#D4C3D0]">
              Maximize the spiritual and therapeutic benefits of natural fragrances throughout your daily routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageGuides.map((guide) => (
              <div
                key={guide.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all"
              >
                <div className="text-2xl font-fraunces font-bold text-[#FBEAE5] mb-2 opacity-80">
                  {guide.step}
                </div>
                <h4 className="font-fraunces text-base font-bold text-white mb-1">
                  {guide.title}
                </h4>
                <p className="text-xs font-manrope font-semibold text-[#FBEAE5] mb-2">
                  Recommended: {guide.recommendation}
                </p>
                <p className="text-xs font-manrope text-[#D4C3D0] font-light leading-relaxed">
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
