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

              {/* Social & Available On */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-3">
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

                {/* Compact Also Available On */}
                <div className="pt-2 space-y-1.5">
                  <p className="text-[9px] font-cinzel font-semibold tracking-widest text-[#9B7E52] uppercase">
                    Also Available On
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Amazon */}
                    <a
                      href="https://www.amazon.in/s?k=shraviko"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shop Shraviko on Amazon"
                      className="inline-flex items-center transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    >
                      <img
                        src="/amaazon.png"
                        alt="Amazon India"
                        className="h-6 w-auto object-contain"
                      />
                    </a>

                    {/* Flipkart */}
                    <a
                      href="https://www.flipkart.com/shraviko-sphatik-shivling-decorative-showpiece-6-35-cm/p/itm7792c0df90a81?pid=SHIHQMCDBHYUFBHE&lid=LSTSHIHQMCDBHYUFBHESVJAQG&marketplace=FLIPKART&q=shraviko+shivling+&store=arb%2Fuj2%2Fz1t&srno=s_1_23&otracker=search&otracker1=search&fm=Search&iid=76c5c2be-57e0-433f-b4f6-f3a230c3c997.SHIHQMCDBHYUFBHE.SEARCH&ppt=sp&ppn=sp&ssid=ypmh054fgg0000001789024161589&qH=edbcd4a2d5bd0faa&ov_redirect=true&ov_redirect=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shop Shraviko on Flipkart"
                      className="inline-flex items-center transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    >
                      <img
                        src="/flipkart logo.png"
                        alt="Flipkart"
                        className="h-6 w-auto object-contain"
                      />
                    </a>
                  </div>
                </div>
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
