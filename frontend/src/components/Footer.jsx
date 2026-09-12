import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Instagram, Facebook, Share2, Mail, Phone, MapPin, MessageSquare, Package, RotateCcw, Truck, ShieldCheck } from 'lucide-react';

const WORDMARK_LETTERS = ['S', 'H', 'R', 'A', 'V', 'I', 'K', 'O'];

export const Footer = ({
  onSelectCategory,
  onGoSupport,
  onGoPrivacy,
  onGoRefundPolicy,
  onGoTerms,
  onGoAbout
}) => {
  const revealPanelRef = useRef(null);
  const [typedLength, setTypedLength] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const panel = revealPanelRef.current;
    if (!panel) return;

    let timer;
    let fired = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          let current = 0;
          timer = setInterval(() => {
            current++;
            setTypedLength(current);
            if (current >= WORDMARK_LETTERS.length) {
              clearInterval(timer);
              setTimeout(() => setIsTypingDone(true), 300);
            }
          }, 95);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(panel);
    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="relative bg-[#110E0D] text-[#EAE0CD] font-sans">
      {/* ── 0. Top Customer Care & Services Bar — Marquee ── */}
      <div className="bg-white text-[#2C2623] py-5 sm:py-6 overflow-hidden">
        <div className="footer-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="footer-marquee-content" aria-hidden={copy === 1}>

              {/* 1. Happy to help */}
              <div
                onClick={onGoSupport}
                className="flex items-center gap-4 cursor-pointer group px-8 sm:px-12 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4EBE0] border-2 border-[#E5DAC8] flex items-center justify-center shrink-0 group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-9 h-9 text-[#2C2623] group-hover:text-[#B8860B] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#2C2623] group-hover:text-[#B8860B] transition-colors whitespace-nowrap">
                    Happy to help
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B5D] font-light whitespace-nowrap">
                    Chat or email
                  </p>
                </div>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40 shrink-0" />

              {/* 2. Easy Returns */}
              <div
                onClick={onGoRefundPolicy || onGoSupport}
                className="flex items-center gap-4 cursor-pointer group px-8 sm:px-12 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4EBE0] border-2 border-[#E5DAC8] flex items-center justify-center shrink-0 group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <RotateCcw className="w-9 h-9 text-[#2C2623] group-hover:text-[#B8860B] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#2C2623] group-hover:text-[#B8860B] transition-colors whitespace-nowrap">
                    Easy Returns
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B5D] font-light whitespace-nowrap">
                    Quick &amp; hassle-free
                  </p>
                </div>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40 shrink-0" />

              {/* 3. Securely Packed */}
              <div
                onClick={onGoSupport}
                className="flex items-center gap-4 cursor-pointer group px-8 sm:px-12 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4EBE0] border-2 border-[#E5DAC8] flex items-center justify-center shrink-0 group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-9 h-9 text-[#2C2623] group-hover:text-[#B8860B] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#2C2623] group-hover:text-[#B8860B] transition-colors whitespace-nowrap">
                    Securely Packed
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B5D] font-light whitespace-nowrap">
                    Sacred items, safe delivery
                  </p>
                </div>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40 shrink-0" />

              {/* 4. Free Delivery */}
              <div
                onClick={onGoSupport}
                className="flex items-center gap-4 cursor-pointer group px-8 sm:px-12 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4EBE0] border-2 border-[#E5DAC8] flex items-center justify-center shrink-0 group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <Truck className="w-9 h-9 text-[#2C2623] group-hover:text-[#B8860B] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#2C2623] group-hover:text-[#B8860B] transition-colors whitespace-nowrap">
                    Free Delivery
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B5D] font-light whitespace-nowrap">
                    All over India
                  </p>
                </div>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40 shrink-0" />

              {/* 5. Check Order Status */}
              <div
                onClick={onGoSupport}
                className="flex items-center gap-4 cursor-pointer group px-8 sm:px-12 shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-[#F4EBE0] border-2 border-[#E5DAC8] flex items-center justify-center shrink-0 group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <Package className="w-9 h-9 text-[#2C2623] group-hover:text-[#B8860B] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#2C2623] group-hover:text-[#B8860B] transition-colors whitespace-nowrap">
                    Check Order Status
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B5D] font-light whitespace-nowrap">
                    Updates &amp; tracking
                  </p>
                </div>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40 shrink-0" />

            </div>
          ))}
        </div>
      </div>
      {/* ── 1. Main Luxury Footer Section ── */}
      <div className="relative z-20 bg-[#161211] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#2C2420]">

            {/* Col 1: Brand Block (Span 2 on desktop) */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/Logo/LOGO.png"
                  alt="Shraviko"
                  className="h-20 w-20 object-contain rounded-full border-2 border-white p-0.5 bg-white shadow-md"
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
                   Contact Us
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

      {/* ── 2. SHRAVIKO Grand Metallic Wordmark Panel with Typing & Gold Shimmer Effect ── */}
      <div
        ref={revealPanelRef}
        className="relative bg-[#0E0C0B] border-t border-[#2C2420] overflow-hidden select-none pt-14 pb-28 sm:py-20"
      >
        {/* Radial Ambient Gold Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            typedLength > 0 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(197,160,89,0.16) 0%, transparent 80%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="flex items-center justify-center font-brand font-black leading-none tracking-[0.14em] drop-shadow-2xl">
            {WORDMARK_LETTERS.map((letter, idx) => {
              const isRevealed = idx < typedLength;
              return (
                <span
                  key={idx}
                  className={`inline-block transition-all duration-300 ${
                    isRevealed ? 'animate-letter-pop opacity-100' : 'opacity-0 translate-y-4 scale-75'
                  } ${
                    isTypingDone
                      ? 'footer-shimmer-text'
                      : 'text-transparent bg-clip-text bg-gradient-to-b from-[#FAF0D9] via-[#D4AF62] to-[#6B5020]'
                  }`}
                  style={{
                    fontSize: 'clamp(2.2rem, 13vw, 6.5rem)',
                  }}
                >
                  {letter}
                </span>
              );
            })}

            {/* Glowing Golden Cursor during typing */}
            {!isTypingDone && typedLength > 0 && (
              <span
                className="inline-block w-1 sm:w-1.5 bg-[#E5C378] animate-cursor-blink ml-1 rounded-full shadow-[0_0_12px_#E5C378]"
                style={{
                  height: 'clamp(1.8rem, 10vw, 5rem)',
                }}
              />
            )}
        </div>
      </div>
    </div>
  </footer>
  );
};
