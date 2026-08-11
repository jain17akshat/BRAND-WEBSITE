import React, { useEffect, useRef } from 'react';
import { ArrowUp, Instagram, Facebook, Share2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = ({ onSelectCategory }) => {
  const revealPanelRef = useRef(null);
  const brandTextRef = useRef(null);
  const tagTextRef = useRef(null);
  const glowRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const panel = revealPanelRef.current;
    const brand = brandTextRef.current;
    const tag   = tagTextRef.current;
    const glow  = glowRef.current;
    if (!panel || !brand || !tag) return;

    let fired = false;

    const doReveal = () => {
      if (fired) return;
      fired = true;

      // ── Smooth GPU-accelerated CSS reveal ──
      brand.classList.add('footer-revealed');
      tag.classList.add('footer-revealed');
      if (glow) glow.classList.add('footer-revealed');

      // Remove will-change after animation to free GPU memory
      setTimeout(() => {
        if (brand) brand.style.willChange = 'auto';
      }, 700);
    };

    const isVisible = () => {
      const r = panel.getBoundingClientRect();
      return r.top < window.innerHeight + 100 && r.bottom > 0;
    };

    const onScroll = () => {
      if (isVisible()) {
        doReveal();
        cleanup();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          doReveal();
          cleanup();
        }
      },
      { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
    );

    const cleanup = () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };

    observer.observe(panel);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    // Immediate check if already visible on mount
    if (isVisible()) {
      setTimeout(doReveal, 100);
    }

    return cleanup;
  }, []);





  return (
    <footer className="relative bg-[#090807] text-[#EAE0CD]">

      {/* ── 1. Main Footer Info Grid ── */}
      <div className="relative z-20 bg-[#171312] border-t border-[#C5A059]/30 pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 pb-10 border-b border-[#2D2623]">

            {/* Col 1: Brand Block */}
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.2em] text-[#F9F5EC]">
                  SHRAVIKO
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] font-cinzel uppercase text-[#C5A059] font-medium">
                  Awaken Within • Sacred Living
                </span>
              </div>

              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
                Shraviko Sacred Living bridges age-old Vedic metalcraft with clean, contemporary
                Indian design — heirloom brass, heavy copper vessels, and organic flower incense
                for peaceful modern homes.
              </p>

              <div className="flex items-center gap-2.5">
                {[
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Share2, label: 'Share' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-[#231E1C] border border-[#3A3431] flex items-center justify-center text-gray-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Shop Links */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-[10px] sm:text-xs font-semibold text-[#E5C378] tracking-widest uppercase">
                Shop
              </h4>
              <ul className="space-y-2 text-xs text-gray-400 font-light">
                {[
                  { label: 'Brass Pooja Items', cat: 'brass' },
                  { label: 'Pure Copper Vessels', cat: 'copper' },
                  { label: 'Incense & Dhoop', cat: 'incense' },
                  { label: 'Pooja Hampers', cat: 'kits' },
                  { label: 'Yantras & Idols', cat: 'yantras' },
                  { label: 'Daily Puja Samagri', cat: 'essentials' },
                ].map(({ label, cat }) => (
                  <li key={cat}>
                    <button onClick={() => onSelectCategory(cat)} className="hover:text-[#C5A059] transition-colors text-left">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Heritage */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-[10px] sm:text-xs font-semibold text-[#E5C378] tracking-widest uppercase">
                Heritage
              </h4>
              <ul className="space-y-2 text-xs text-gray-400 font-light">
                {[
                  { label: 'Our Artisan Story', href: '#brand-story' },
                  { label: 'Brass & Copper Care', href: '#' },
                  { label: 'Temple Flower Upcycling', href: '#' },
                  { label: 'Vedic Ritual Journal', href: '#' },
                  { label: 'Corporate Gifting', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="hover:text-[#C5A059] transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <h4 className="font-cinzel text-[10px] sm:text-xs font-semibold text-[#E5C378] tracking-widest uppercase">
                Sacred Studio
              </h4>
              <div className="space-y-2.5 text-xs text-gray-400 font-light">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Shraviko Sacred Atelier, Civil Lines, Jaipur 302006, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>+91 (0141) 289-4020</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>care@shraviko.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-gray-500 font-light">
            <span className="text-center sm:text-left">
              © {new Date().getFullYear()} Shraviko Sacred Living Pvt Ltd. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-center items-center gap-1.5">
              {['UPI', 'VISA', 'Mastercard', 'RuPay', 'Net Banking'].map((m) => (
                <span key={m} className="bg-[#231E1C] px-2 py-0.5 rounded border border-[#3A3431] text-[10px]">{m}</span>
              ))}
            </div>
            <button onClick={scrollToTop} className="flex items-center gap-1 text-[#C5A059] hover:text-[#E5C378] transition-colors font-cinzel text-[10px] sm:text-xs uppercase tracking-widest">
              Back to Top <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 2. SHRAVIKO Reveal Panel ── */}
      <div
        ref={revealPanelRef}
        className="relative bg-[#0A0807] border-t border-[#C5A059]/20 overflow-hidden select-none"
        style={{ paddingTop: 'clamp(2.5rem, 7vw, 6rem)', paddingBottom: 'clamp(2.5rem, 7vw, 6rem)' }}
      >
        {/* Gold radial glow */}
        <div
          ref={glowRef}
          className="footer-glow absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(197,160,89,0.25) 0%, transparent 70%)',
          }}
        />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171312]/60 via-transparent to-[#050404] pointer-events-none" />

        {/* Wordmark content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h2
            ref={brandTextRef}
            className="footer-wordmark font-cinzel font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FAF0D9] via-[#D4AF62] to-[#7A5E28] w-full text-center"
            style={{
              fontSize: 'clamp(1.75rem, 14vw, 6.875rem)',
              letterSpacing: '0.1em',
            }}
          >
            SHRAVIKO
          </h2>
          <p
            ref={tagTextRef}
            className="footer-tagline font-cinzel font-medium uppercase text-[#C5A059] text-center"
            style={{
              marginTop: 'clamp(0.5rem, 1.5vw, 1.25rem)',
              fontSize: 'clamp(0.5rem, 2.2vw, 0.85rem)',
              letterSpacing: 'clamp(0.15em, 0.6vw + 0.1em, 0.5em)',
            }}
          >
            AWAKEN WITHIN • SACRED LIVING
          </p>
        </div>
      </div>

    </footer>
  );
};
