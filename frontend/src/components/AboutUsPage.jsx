import React, { useEffect, useRef } from 'react';
import { Heart, Award, Leaf, Globe, ArrowLeft } from 'lucide-react';

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
    desc: 'From Udaipur to your doorstep — we ship Indias living spiritual traditions to homes across the world with care and reverence.',
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
    <div className="min-h-screen bg-[#FBF9F5] font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        .about-hidden { opacity: 0; transform: translateY(32px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .about-revealed { opacity: 1 !important; transform: translateY(0) !important; }
        @keyframes slowPan { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .hero-gradient { animation: slowPan 15s ease infinite; background-size: 200% 200%; }
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        .float-orb-1 { animation: floatOrb 6s ease-in-out infinite; }
        .float-orb-2 { animation: floatOrb 8s ease-in-out infinite 2s; }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 30s linear infinite; }
      `}</style>

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: 'clamp(380px, 55vw, 600px)' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 hero-gradient"
          style={{
            background: 'linear-gradient(135deg, #1C140F 0%, #2D1F10 30%, #3D2912 55%, #251810 80%, #120C08 100%)',
          }}
        />
        {/* Mandala pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5A059' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='40' cy='40' r='14' stroke='%23C5A059' stroke-width='0.8' fill='none'/%3E%3Ccircle cx='40' cy='40' r='28' stroke='%23C5A059' stroke-width='0.5' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        {/* Floating orbs */}
        <div className="float-orb-1 absolute top-[15%] left-[8%] w-32 h-32 rounded-full bg-[#C5A059]/10 blur-2xl pointer-events-none" />
        <div className="float-orb-2 absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-[#E5C378]/8 blur-3xl pointer-events-none" />

        {/* Rotating chakra wheel */}
        <div className="spin-slow absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#C5A059]">
            <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 5" />
            {[...Array(12)].map((_, i) => (
              <line key={i} x1="100" y1="10" x2="100" y2="190"
                stroke="currentColor" strokeWidth="0.8"
                transform={`rotate(${i * 15} 100 100)`} />
            ))}
            {[...Array(12)].map((_, i) => (
              <path key={i} d="M100,100 Q114,76 100,52 Q86,76 100,100"
                stroke="currentColor" strokeWidth="1" fill="none"
                transform={`rotate(${i * 30} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-20 sm:py-28">
          <p className="text-[10px] sm:text-[11px] font-cinzel tracking-[0.4em] text-[#C5A059] uppercase mb-5">
            Who We Are
          </p>
          <h1
            className="font-cinzel font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            Sacred Living,<br />
            <span className="text-[#E5C378]">Crafted for You</span>
          </h1>
          <p className="max-w-xl mx-auto text-[#D4C3A3]/85 font-light leading-relaxed"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.05rem)' }}>
            From a local shop in Udaipur to a global sacred brand — Shraviko was built to elevate authentic Indian ritual craftsmanship and bring sacred living to every home.
          </p>

          {/* Back button */}
          <button
            onClick={onBackToHome}
            className="mt-8 inline-flex items-center gap-2 text-[#C5A059] border border-[#C5A059]/40 px-5 py-2.5 rounded-full font-cinzel text-xs tracking-widest uppercase hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </section>

      {/* ── OUR STORY ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <div ref={addRef} className="about-hidden relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#EAE0CD]" style={{ aspectRatio: '4/3' }}>
                <img
                  src="/brasshero.webp"
                  alt="Shraviko Artisan"
                  onError={e => { e.target.src = '/assets/brasscover.webp'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: 'center 60%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-5 -right-4 bg-[#1C140F] border border-[#C5A059]/40 rounded-2xl px-5 py-4 shadow-xl hidden sm:block">
                <p className="font-cinzel text-[#C5A059] font-bold text-xs tracking-widest uppercase">Sacred Atelier</p>
                <p className="text-[10px] text-[#9B7E52] tracking-widest uppercase mt-0.5">Udaipur, Rajasthan</p>
              </div>
            </div>

            {/* Text */}
            <div ref={addRef} className="about-hidden flex flex-col gap-6" style={{ transitionDelay: '0.15s' }}>
              <p className="text-[10px] font-cinzel tracking-[0.35em] text-[#9B7E52] uppercase">Our Story</p>
              <h2 className="font-cinzel font-bold text-[#2C2623] leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}>
                Rooted in Tradition.<br />
                <span className="text-[#9B7E52]">Made for Today.</span>
              </h2>
              <p className="text-[#6B5840] leading-relaxed font-light">
                The story of Shraviko began on the floor of a local shop in Udaipur. Day after day, watching local devotees, families, and seekers come in search of authentic brassware, pure copper vessels, and sacred puja essentials, our founder witnessed the deep love and demand for genuine ritual craftsmanship.
              </p>
              <p className="text-[#6B5840] leading-relaxed font-light">
                Seeing the warmth and devotion in people's eyes as they bought these handcrafted items locally sparked a bigger vision: Why keep this sacred heritage limited to a local storefront? Why not take this passion to the next stage, elevate the craftsmanship, and build something grand that reaches devotees across the country and the world?
              </p>
              <p className="text-[#6B5840] leading-relaxed font-light">
                Today, Shraviko works directly with master artisans across Rajasthan and South India to bring heirloom-quality brass diyas, copper vessels, consecrated mala beads, and spiritual lifestyle items to your home — crafted with devotion, preserved with pride, and scaled for modern living.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-[2px] bg-[#C5A059]" />
                <span className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase">Shraviko</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#F4EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRef} className="about-hidden text-center mb-14">
            <p className="text-[10px] font-cinzel tracking-[0.35em] text-[#9B7E52] uppercase mb-4">What Guides Us</p>
            <h2 className="font-cinzel font-bold text-[#2C2623]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                ref={addRef}
                className="about-hidden bg-white rounded-2xl p-7 shadow-sm border border-[#EAE0CD] hover:shadow-md hover:border-[#C5A059]/40 transition-all duration-300 group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FBF9F5] border border-[#EAE0CD] flex items-center justify-center mb-5 group-hover:bg-[#C5A059]/10 group-hover:border-[#C5A059]/30 transition-all">
                  <Icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h3 className="font-cinzel font-bold text-[#2C2623] text-sm mb-3">{title}</h3>
                <p className="text-[#6B5840] text-xs leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION BANNER ─────────────────────────────────────────────────── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C140F, #2D1F10, #1C140F)' }}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5A059'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3Ccircle cx='30' cy='30' r='10' stroke='%23C5A059' stroke-width='0.6' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div ref={addRef} className="about-hidden relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-[10px] font-cinzel tracking-[0.4em] text-[#C5A059] uppercase mb-6">Our Mission</p>
          <h2 className="font-cinzel font-bold text-white leading-tight mb-8"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
            "To make sacred living accessible, beautiful, and meaningful for every home."
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mb-8" />
          <p className="text-[#D4C3A3]/80 font-light leading-relaxed">
            We believe spirituality is not a performance — it is a way of life. And we exist to support that life with objects worthy of the sacred.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-[#1C140F] font-cinzel font-bold text-xs tracking-[0.2em] uppercase shadow-lg hover:bg-[#E5C378] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Explore Our Collections
          </button>
        </div>
      </section>

    </div>
  );
}
