import React, { useEffect, useRef } from 'react';
import { ArrowUp, Instagram, Facebook, Share2, Mail, Phone, MapPin } from 'lucide-react';
import { PaymentLogos } from './PaymentLogos';

export const Footer = ({
  onSelectCategory,
  onGoSupport,
  onGoPrivacy,
  onGoRefundPolicy,
  onGoTerms,
  onGoAbout
}) => {
  const revealPanelRef = useRef(null);
  const brandTextRef = useRef(null);
  const tagTextRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const panel = revealPanelRef.current;
    const brand = brandTextRef.current;
    const tag = tagTextRef.current;
    if (!panel || !brand || !tag) return;

    let fired = false;

    const doReveal = () => {
      if (fired) return;
      fired = true;

      brand.classList.add('footer-revealed');
      tag.classList.add('footer-revealed');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          doReveal();
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative bg-[#110E0D] text-[#EAE0CD] font-sans">
      {/* ── 1. Main Luxury Footer Section ── */}
      <div className="relative z-20 bg-[#161211] border-t border-[#382E29] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#2C2420]">

            {/* Col 1: Brand Block (Span 2 on desktop) */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/Logo/CURRENT LOGO.png"
                  alt="Shraviko"
                  className="h-20 w-20 object-contain rounded-full border border-[#D4AF37]/30 p-1 bg-[#1C1715] shadow-md"
                  style={{ aspectRatio: '1 / 1' }}
                />
                <div>
                  <h3 className="font-brand text-lg sm:text-xl font-bold text-[#F5EAD4] tracking-widest uppercase">
                    Shraviko
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#B5A895] font-light leading-relaxed max-w-sm italic border-l-2 border-[#C5A059]/50 pl-3">
                "Where devotion meets craftsmanship — every piece carries the soul of a tradition that has burned bright for centuries."
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                {[
                  { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/shraviko/' },
                  { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593917600311' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-[#231E1C] border border-[#3E342F] flex items-center justify-center text-[#B5A895] hover:text-[#E5C378] hover:border-[#E5C378] transition-all"
                  >
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Shop */}
            <div className="space-y-3.5">
              <h4 className="font-cinzel text-xs font-bold text-[#E5C378] tracking-widest uppercase pb-1 border-b border-[#2C2420]">
                Shop
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B5A895] font-light">
                {[
                  { label: 'Metalware', cat: 'metalware' },
                  { label: 'Incense & Dhoop', cat: 'incense' },
                  { label: 'Vastu & Spiritual', cat: 'vastu' },
                  { label: 'Mandir Essentials', cat: 'mandir-essentials' },
                  { label: 'Corporate Gifting', cat: 'kits' },
                ].map(({ label, cat }) => (
                  <li key={cat}>
                    <button
                      onClick={() => onSelectCategory(cat)}
                      className="hover:text-[#E5C378] transition-colors text-left font-normal"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Help & Policies */}
            <div className="space-y-3.5">
              <h4 className="font-cinzel text-xs font-bold text-[#E5C378] tracking-widest uppercase pb-1 border-b border-[#2C2420]">
                Help &amp; Policies
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B5A895] font-light">
                <li>
                  <button onClick={onGoAbout} className="hover:text-[#E5C378] transition-colors text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={onGoSupport} className="hover:text-[#E5C378] transition-colors text-left">
                    My Orders &amp; Tracking
                  </button>
                </li>
                <li>
                  <button onClick={onGoRefundPolicy || onGoSupport} className="hover:text-[#E5C378] transition-colors text-left">
                    Cancellation &amp; Refund Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoPrivacy || onGoSupport} className="hover:text-[#E5C378] transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoTerms || onGoSupport} className="hover:text-[#E5C378] transition-colors text-left">
                    Terms &amp; Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Sacred Studio Contact */}
            <div className="space-y-3.5">
              <h4 className="font-cinzel text-xs font-bold text-[#E5C378] tracking-widest uppercase pb-1 border-b border-[#2C2420]">
                Sacred Studio
              </h4>
              <div className="space-y-3 text-xs text-[#B5A895] font-light leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Udaipur, Rajasthan 313001, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>+91 7742320607</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <a href="mailto:info@shraviko.com" className="hover:text-[#E5C378] transition-colors">
                    info@shraviko.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C7E6C]">
            <div className="text-center md:text-left font-light space-y-0.5">
              <p>© {new Date().getFullYear()} Shraviko. All rights reserved.</p>
              <p className="text-[10px] text-[#6B5E50] tracking-wide">
                GSTIN: 08CODPJ2489F1ZT &nbsp;·&nbsp; Registered in Rajasthan, India
              </p>
            </div>

            <PaymentLogos />

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#C5A059] hover:text-[#E5C378] transition-colors font-cinzel text-xs uppercase tracking-widest font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── Also Available On: Amazon & Flipkart ── */}
      <div className="bg-[#0E0C0B] border-t border-[#2C2420] py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">

          {/* Label with side dividers */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#3E342F]" />
            <p className="text-[9px] font-sans tracking-[0.35em] text-[#6B5E50] uppercase whitespace-nowrap">Also Available On</p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#3E342F]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">

            {/* ── Amazon ── */}
            <a
              href="https://www.amazon.in/s?k=shraviko"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shop Shraviko on Amazon India"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-[#FF9900]/20 bg-[#19140F] hover:bg-[#231A0B] hover:border-[#FF9900]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_24px_rgba(255,153,0,0.12)] active:scale-95"
            >
              <svg width="90" height="30" viewBox="0 0 90 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="21" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="21" fill="#FF9900" letterSpacing="-0.5">amazon</text>
                <path d="M5 27 Q 45 36 85 24" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M77 21 L85 24 L80 30" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.6rem', color: '#FF9900', opacity: 0.65, fontWeight: 700, marginLeft: '-4px', marginTop: '8px' }}>.in</span>
            </a>

            <span className="w-1.5 h-1.5 rounded-full bg-[#3E342F] hidden sm:block" />

            {/* ── Flipkart ── */}
            <a
              href="https://www.flipkart.com/search?q=shraviko"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shop Shraviko on Flipkart"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-[#2874F0]/20 bg-[#0F1219] hover:bg-[#111827] hover:border-[#2874F0]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_24px_rgba(40,116,240,0.12)] active:scale-95"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="5" fill="#2874F0"/>
                <rect x="8" y="8" width="10" height="2.5" rx="1.25" fill="white"/>
                <rect x="8" y="12.75" width="7.5" height="2.5" rx="1.25" fill="white"/>
                <rect x="8" y="8" width="2.5" height="13" rx="1.25" fill="white"/>
              </svg>
              <span style={{ fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: '1.1rem', color: '#2874F0', letterSpacing: '-0.02em' }}>
                Flipkart
              </span>
            </a>

          </div>
        </div>
      </div>

      {/* ── 2. SHRAVIKO Grand Metallic Wordmark Panel ── */}
      <div
        ref={revealPanelRef}
        className="relative bg-[#0E0C0B] border-t border-[#2C2420] overflow-hidden select-none py-14 sm:py-20"
      >
        {/* Subtle Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(197,160,89,0.12) 0%, transparent 80%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h2
            ref={brandTextRef}
            className="font-brand font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FAF0D9] via-[#D4AF62] to-[#6B5020] w-full text-center drop-shadow-2xl tracking-[0.14em]"
            style={{
              fontSize: 'clamp(2.2rem, 13vw, 6.5rem)',
            }}
          >
            SHRAVIKO
          </h2>
        </div>
      </div>
    </footer>
  );
};
