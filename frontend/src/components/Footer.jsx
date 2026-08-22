import React, { useEffect, useRef } from 'react';
import { ArrowUp, Instagram, Facebook, Share2, Mail, Phone, MapPin } from 'lucide-react';
import { PaymentLogos } from './PaymentLogos';

export const Footer = ({ onSelectCategory, onGoSupport, onGoPrivacy, onGoRefundPolicy, onGoTerms, onGoAbout }) => {
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
      <div className="relative z-20 bg-[#171312] border-t border-[#C5A059]/30 pt-14 pb-10 overflow-hidden">
        {/* Moving Background Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none animate-bg-pan-slow"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='40' cy='40' r='12' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Ccircle cx='40' cy='40' r='22' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='34' stroke='%23ffffff' stroke-width='0.3' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Sweeping Light Sheen Beam */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/3 h-[200%] absolute -top-1/2 left-0 bg-gradient-to-r from-transparent via-[#C5A059]/15 to-transparent blur-xl animate-golden-shimmer-sweep pointer-events-none" />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-[#E5C378]/70 rounded-full blur-[1px] animate-float-sparkle-1" />
          <div className="absolute top-[60%] left-[45%] w-2.5 h-2.5 bg-[#C5A059]/80 rounded-full blur-[1px] animate-float-sparkle-2" />
          <div className="absolute top-[25%] left-[80%] w-2 h-2 bg-[#E5C378]/60 rounded-full blur-[1px] animate-float-sparkle-1" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 pb-10 border-b border-[#2D2623]">

            {/* Col 1: Brand Block */}
            <div className="col-span-2 lg:col-span-2 space-y-4 relative">

              <div className="flex flex-col items-start gap-2 relative z-10">
                <img
                  src="/assets/Logo/CURRENT LOGO.png"
                  alt="Shraviko Sacred Living"
                  className="h-28 w-28 object-contain rounded-full drop-shadow-lg transition-transform duration-500 hover:scale-105"
                  style={{ aspectRatio: '1 / 1' }}
                />
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] font-cinzel uppercase text-[#C5A059] font-medium">
                  Awaken Within • Sacred Living
                </span>
              </div>

              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs relative z-10">
                Shraviko Sacred Living bridges age-old Vedic metalcraft with clean, contemporary
                Indian design — heirloom brass, heavy copper vessels, and organic flower incense
                for peaceful modern homes.
              </p>

              <div className="flex items-center gap-2.5 relative z-10">
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
                  { label: 'Vastu & Spiritual', cat: 'vastu' },
                  { label: 'Yantras & Idols', cat: 'yantras' },
                  { label: 'Mandir Essentials', cat: 'mandir-essentials' },
                ].map(({ label, cat }) => (
                  <li key={cat}>
                    <button onClick={() => onSelectCategory(cat)} className="hover:text-[#C5A059] transition-colors text-left">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Help & Policies */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-[10px] sm:text-xs font-semibold text-[#E5C378] tracking-widest uppercase">
                Help & Policies
              </h4>
              <ul className="space-y-2 text-xs text-gray-400 font-light">
                <li>
                  <button onClick={onGoAbout} className="hover:text-[#C5A059] transition-colors text-left font-medium text-[#E5C378]">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={onGoSupport} className="hover:text-[#C5A059] transition-colors text-left font-medium">
                    My Orders &amp; Tracking
                  </button>
                </li>
                <li>
                  <button onClick={onGoRefundPolicy || onGoSupport} className="hover:text-[#C5A059] transition-colors text-left">
                    Cancellation & Refund Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoPrivacy || onGoSupport} className="hover:text-[#C5A059] transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoTerms || onGoSupport} className="hover:text-[#C5A059] transition-colors text-left">
                    Terms & Conditions
                  </button>
                </li>
                {[
                  { label: 'Our Artisan Story', href: '#brand-story' },
                  { label: 'Brass & Copper Care', href: '#' },
                  { label: 'Temple Flower Upcycling', href: '#' },
                  { label: 'Vedic Ritual Journal', href: '#' },
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
                  <span>+91 7742320607</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>info@shraviko.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] text-gray-500 font-light">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
              <span>© {new Date().getFullYear()} Shraviko Sacred Living Pvt Ltd. All rights reserved.</span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <button
                onClick={onGoPrivacy || onGoSupport}
                className="hover:text-[#C5A059] transition-colors underline font-medium"
              >
                Privacy Policy
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={onGoRefundPolicy || onGoSupport}
                className="hover:text-[#C5A059] transition-colors underline font-medium"
              >
                Cancellation & Refund Policy
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={onGoTerms || onGoSupport}
                className="hover:text-[#C5A059] transition-colors underline font-medium"
              >
                Terms & Conditions
              </button>
            </div>

            <PaymentLogos />

            <button onClick={scrollToTop} className="flex items-center gap-1 text-[#C5A059] hover:text-[#E5C378] transition-colors font-cinzel text-[10px] sm:text-xs uppercase tracking-widest">
              Back to Top <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 2. SHRAVIKO Reveal Panel — Animated Sacred Aura ── */}
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

        {/* Moving Background Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none animate-bg-pan-slow"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='40' cy='40' r='12' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Ccircle cx='40' cy='40' r='22' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='34' stroke='%23ffffff' stroke-width='0.3' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Sweeping Light Sheen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/3 h-[200%] absolute -top-1/2 left-0 bg-gradient-to-r from-transparent via-[#E5C378]/20 to-transparent blur-xl animate-golden-shimmer-sweep pointer-events-none" />
        </div>

        {/* Floating Sparkles in Reveal Panel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-[#FAF0D9]/70 rounded-full blur-[1px] animate-float-sparkle-1" />
          <div className="absolute top-[70%] left-[75%] w-2.5 h-2.5 bg-[#D4AF62]/80 rounded-full blur-[1px] animate-float-sparkle-2" />
        </div>

        {/* Giant Rotating Sacred Mandala Aura behind SHRAVIKO text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15 animate-spin-slow">
          <svg className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[600px] lg:h-[600px] text-[#C5A059]" viewBox="0 0 200 200" fill="currentColor">
            <g transform="translate(100,100)">
              <circle r="95" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
              <circle r="82" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle r="68" fill="none" stroke="currentColor" strokeWidth="0.5" />
              {[...Array(16)].map((_, i) => (
                <path key={i} d="M 0,-68 Q 14,-42 0,-16 Q -14,-42 0,-68" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 22.5})`} />
              ))}
              {[...Array(32)].map((_, i) => (
                <circle key={i} cx={82 * Math.cos((i * 11.25 * Math.PI) / 180)} cy={82 * Math.sin((i * 11.25 * Math.PI) / 180)} r="1.5" fill="currentColor" />
              ))}
            </g>
          </svg>
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171312]/60 via-transparent to-[#050404] pointer-events-none" />

        {/* Wordmark content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h2
            ref={brandTextRef}
            className="footer-wordmark font-cinzel font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FAF0D9] via-[#D4AF62] to-[#7A5E28] w-full text-center drop-shadow-2xl"
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
