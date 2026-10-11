import React, { useEffect, useRef } from 'react';
import { Heart, Award, Leaf, Globe, ArrowLeft, ArrowRight } from 'lucide-react';

const VALUES = [
  {
    icon: Heart,
    title: 'Made with Devotion',
    desc: 'Every piece we craft begins as an offering — shaped by hands that understand the sacred language of Indian ritual and artistry.',
  },
  {
    icon: Leaf,
    title: 'Sustainably Sourced',
    desc: 'We partner with eco-conscious artisans who use natural brass, pure copper, and ethically harvested herbs to protect the earth we revere.',
  },
  {
    icon: Award,
    title: 'Heritage Craftsmanship',
    desc: 'Our artisans carry centuries of metallurgical knowledge, preserving dying techniques of Rajasthan and South India in every piece.',
  },
  {
    icon: Globe,
    title: 'Sacred Living, Globally',
    desc: 'From Udaipur to your doorstep — we ship India’s living spiritual traditions to homes across the world with care and reverence.',
  },
];

export function AboutUsPage({ onBackToHome }) {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('about-revealed');
      }),
      { threshold: 0.08 }
    );
    sectionsRef.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-manrope">

      <style>{`
        .about-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .about-revealed { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-[#1E171D] text-white"
        style={{ minHeight: 'clamp(360px, 50vw, 540px)' }}
      >
        {/* Subtle dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1A1418 0%, #2A1C25 50%, #151014 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-20 sm:py-28 max-w-4xl mx-auto">
          <span className="text-xs font-manrope font-semibold tracking-wider text-[#FBEAE5] uppercase mb-4">
            Who We Are
          </span>
          <h1
            className="font-fraunces font-bold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
          >
            Sacred Living,<br />
            <span className="text-[#FBEAE5]">Crafted for You</span>
          </h1>
          <p className="max-w-xl mx-auto text-[#EAE0CD] font-light leading-relaxed text-sm sm:text-base">
            From a local shop in Udaipur to a global sacred brand — Shraviko was built to elevate authentic Indian ritual craftsmanship and bring sacred living to every home.
          </p>

          {/* Back button */}
          <button
            onClick={onBackToHome}
            className="mt-8 inline-flex items-center gap-2 text-[#FBEAE5] border border-white/20 px-5 py-2.5 rounded-xl font-manrope text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </section>

      {/* ── OUR STORY ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Image */}
            <div ref={addRef} className="about-hidden relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EAE0CD]" style={{ aspectRatio: '4/3' }}>
                <img
                  src="/Outside images/brasshero.webp"
                  alt="Shraviko Sacred Craftsmanship"
                  onError={e => { e.target.src = '/assets/brasscover.webp'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: 'center 60%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -right-2 bg-white border border-[#EAE0CD] rounded-2xl px-5 py-3.5 shadow-lg hidden sm:block">
                <p className="font-fraunces text-[#57324F] font-bold text-xs tracking-wide">Sacred Atelier</p>
                <p className="text-[11px] text-[#7A6B5D] font-manrope mt-0.5">Udaipur, Rajasthan</p>
              </div>
            </div>

            {/* Text */}
            <div ref={addRef} className="about-hidden flex flex-col gap-5" style={{ transitionDelay: '0.15s' }}>
              <span className="text-xs font-manrope font-semibold tracking-wider text-[#57324F] uppercase">Our Story</span>
              <h2 className="font-fraunces font-bold text-[#2C2623] leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)' }}>
                Rooted in Tradition.<br />
                <span className="text-[#57324F]">Made for Today.</span>
              </h2>
              <p className="text-[#5C4A3E] leading-relaxed font-light text-sm">
                The story of Shraviko began on the floor of a local shop in Udaipur. Day after day, watching local devotees, families, and seekers come in search of authentic brassware, pure copper vessels, and sacred puja essentials, our founder witnessed the deep love and demand for genuine ritual craftsmanship.
              </p>
              <p className="text-[#5C4A3E] leading-relaxed font-light text-sm">
                Seeing the warmth and devotion in people's eyes as they bought these handcrafted items locally sparked a bigger vision: Why keep this sacred heritage limited to a local storefront? Why not take this passion to the next stage, elevate the craftsmanship, and build something grand that reaches devotees across the country and the world?
              </p>
              <p className="text-[#5C4A3E] leading-relaxed font-light text-sm">
                Today, Shraviko works directly with master artisans across Rajasthan and South India to bring heirloom-quality brass diyas, copper vessels, consecrated mala beads, and spiritual lifestyle items to your home — crafted with devotion, preserved with pride, and scaled for modern living.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-[2px] bg-[#57324F]" />
                <span className="text-xs font-fraunces font-bold text-[#57324F] uppercase tracking-wider">Shraviko</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FBEAE5]/40 border-t border-b border-[#EAE0CD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRef} className="about-hidden text-center mb-14">
            <span className="text-xs font-manrope font-semibold tracking-wider text-[#57324F] uppercase mb-2 block">What Guides Us</span>
            <h2 className="font-fraunces font-bold text-[#2C2623] text-2xl sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                ref={addRef}
                className="about-hidden bg-white rounded-2xl p-7 shadow-xs border border-[#EAE0CD] hover:border-[#57324F]/30 hover:shadow-md transition-all duration-200 group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FBEAE5] border border-[#57324F]/15 flex items-center justify-center mb-5 group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5 text-[#57324F]" />
                </div>
                <h3 className="font-fraunces font-bold text-[#2C2623] text-base mb-2">{title}</h3>
                <p className="text-[#5C4A3E] text-xs leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>

          {/* E-E-A-T Business & Craft Authenticity Credentials */}
          <div ref={addRef} className="about-hidden mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE0CD] shadow-xs max-w-4xl mx-auto">
            <h3 className="font-fraunces font-bold text-[#2C2623] text-base mb-4 text-center">Authenticity &amp; Brand Transparency</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5C4A3E] leading-relaxed">
              <div className="border-b md:border-b-0 md:border-r border-[#EAE0CD] pb-4 md:pb-0 md:pr-4">
                <span className="font-bold text-[#2C2623] block mb-1">Registered Business</span>
                Based in Udaipur, Rajasthan, India.<br />
                <span className="font-mono text-[11px] text-[#57324F]">GSTIN: 08CODPJ2489F1ZT</span>
              </div>
              <div className="border-b md:border-b-0 md:border-r border-[#EAE0CD] pb-4 md:pb-0 md:pr-4">
                <span className="font-bold text-[#2C2623] block mb-1">Material Integrity</span>
                100% Solid Virgin Brass (Moradabad)<br />
                99.6% Pure Copper &amp; Authentic Himalayan Rudraksha
              </div>
              <div className="pb-0">
                <span className="font-bold text-[#2C2623] block mb-1">Worldwide Fulfillment</span>
                Safely packaged &amp; shipped across India and internationally from Udaipur.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION BANNER ─────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 bg-[#1A1418] text-white overflow-hidden text-center">
        <div ref={addRef} className="about-hidden relative z-10 max-w-3xl mx-auto px-4">
          <span className="text-xs font-manrope font-semibold tracking-wider text-[#FBEAE5] uppercase mb-4 block">Our Mission</span>
          <h2 className="font-fraunces font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>
            "To make sacred living accessible, beautiful, and meaningful for every home."
          </h2>
          <div className="w-16 h-[2px] bg-[#57324F] mx-auto mb-6" />
          <p className="text-[#EAE0CD]/80 font-light leading-relaxed max-w-xl mx-auto text-sm">
            We believe spirituality is not a performance — it is a way of life. And we exist to support that life with objects worthy of the sacred.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope font-semibold text-xs uppercase tracking-wider shadow-md transition-all duration-200 active:scale-95 min-h-[48px]"
          >
            <span>Explore Our Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
