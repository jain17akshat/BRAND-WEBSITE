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
    <footer className="relative bg-[#1A1418] text-[#EAE0CD] font-sans">
      {/* ── 0. Top Customer Care & Services Bar — Calm Boutique Layout ── */}
      <div className="bg-[#FAF7F2] text-[#2C2623] py-6 sm:py-7 border-b border-[#EAE0CD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 items-center">
            
            {/* 1. Happy to help */}
            <div
              onClick={onGoSupport}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#FBEAE5]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE0CD] flex items-center justify-center shrink-0 group-hover:border-[#57324F] transition-all">
                <MessageSquare className="w-5 h-5 text-[#57324F]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold font-manrope text-[#2C2623] group-hover:text-[#57324F] transition-colors">
                  Happy to Help
                </h4>
                <p className="text-[11px] text-[#7A6B5D] font-manrope">
                  Chat or email
                </p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div
              onClick={onGoRefundPolicy || onGoSupport}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#FBEAE5]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE0CD] flex items-center justify-center shrink-0 group-hover:border-[#57324F] transition-all">
                <RotateCcw className="w-5 h-5 text-[#57324F]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold font-manrope text-[#2C2623] group-hover:text-[#57324F] transition-colors">
                  Easy Returns
                </h4>
                <p className="text-[11px] text-[#7A6B5D] font-manrope">
                  7-day hassle free
                </p>
              </div>
            </div>

            {/* 3. Securely Packed */}
            <div
              onClick={onGoSupport}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#FBEAE5]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE0CD] flex items-center justify-center shrink-0 group-hover:border-[#57324F] transition-all">
                <ShieldCheck className="w-5 h-5 text-[#57324F]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold font-manrope text-[#2C2623] group-hover:text-[#57324F] transition-colors">
                  Secure Packaging
                </h4>
                <p className="text-[11px] text-[#7A6B5D] font-manrope">
                  Sacred & safe delivery
                </p>
              </div>
            </div>

            {/* 4. Free Delivery */}
            <div
              onClick={onGoSupport}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#FBEAE5]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE0CD] flex items-center justify-center shrink-0 group-hover:border-[#57324F] transition-all">
                <Truck className="w-5 h-5 text-[#57324F]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold font-manrope text-[#2C2623] group-hover:text-[#57324F] transition-colors">
                  Free Delivery
                </h4>
                <p className="text-[11px] text-[#7A6B5D] font-manrope">
                  Above ₹999 pan-India
                </p>
              </div>
            </div>

            {/* 5. Check Order Status */}
            <div
              onClick={onGoSupport}
              className="col-span-2 md:col-span-1 flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#FBEAE5]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE0CD] flex items-center justify-center shrink-0 group-hover:border-[#57324F] transition-all">
                <Package className="w-5 h-5 text-[#57324F]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold font-manrope text-[#2C2623] group-hover:text-[#57324F] transition-colors">
                  Order Status
                </h4>
                <p className="text-[11px] text-[#7A6B5D] font-manrope">
                  Real-time live tracking
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 1. Main Luxury Footer Section ── */}
      <div className="relative z-20 bg-[#1A1418] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">

            {/* Col 1: Brand Block (Span 2 on desktop) */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/Logo/LOGO.png"
                  alt="Shraviko Official Emblem"
                  className="h-16 w-16 object-contain rounded-full border border-white/20 p-0.5 bg-white shadow-md"
                  style={{ aspectRatio: '1 / 1' }}
                />
                <div>
                  <span className="font-fraunces text-lg sm:text-xl font-bold text-white tracking-wide">
                    SHRAVIKO
                  </span>
                  <p className="text-[11px] font-manrope text-[#D4C3D0]">Curated Indian Living</p>
                </div>
              </div>

              <p className="text-xs text-[#D4C3D0] font-manrope font-light leading-relaxed max-w-sm italic border-l-2 border-[#57324F] pl-3">
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
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-[#D4C3D0] hover:text-white hover:border-[#57324F] hover:bg-[#57324F]/30 transition-all"
                    >
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </a>
                  ))}
                </div>

                {/* Compact Also Available On */}
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-manrope font-semibold tracking-wider text-[#D4C3D0] uppercase">
                    Also Available On
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Amazon */}
                    <a
                      href="https://www.amazon.in/s?k=shraviko"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shop Shraviko on Amazon"
                      className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    >
                      <img
                        src="/amaazon.png"
                        alt="Amazon India"
                        className="h-5 w-auto object-contain"
                      />
                    </a>

                    {/* Flipkart */}
                    <a
                      href="https://www.flipkart.com/shraviko-sphatik-shivling-decorative-showpiece-6-35-cm/p/itm7792c0df90a81?pid=SHIHQMCDBHYUFBHE&lid=LSTSHIHQMCDBHYUFBHESVJAQG&marketplace=FLIPKART&q=shraviko+shivling+&store=arb%2Fuj2%2Fz1t&srno=s_1_23&otracker=search&otracker1=search&fm=Search&iid=76c5c2be-57e0-433f-b4f6-f3a230c3c997.SHIHQMCDBHYUFBHE.SEARCH&ppt=sp&ppn=sp&ssid=ypmh054fgg0000001789024161589&qH=edbcd4a2d5bd0faa&ov_redirect=true&ov_redirect=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shop Shraviko on Flipkart"
                      className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    >
                      <img
                        src="/flipkart logo.png"
                        alt="Flipkart"
                        className="h-5 w-auto object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Shop */}
            <div className="space-y-3.5">
              <h4 className="font-fraunces text-sm font-semibold text-white tracking-wide pb-1 border-b border-white/10">
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D4C3D0] font-manrope">
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
                      className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Help & Policies */}
            <div className="space-y-3.5">
              <h4 className="font-fraunces text-sm font-semibold text-white tracking-wide pb-1 border-b border-white/10">
                Help &amp; Policies
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D4C3D0] font-manrope">
                <li>
                  <button onClick={onGoAbout} className="hover:text-white hover:underline underline-offset-4 transition-colors text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={onGoSupport} className="hover:text-white hover:underline underline-offset-4 transition-colors text-left">
                    My Orders &amp; Tracking
                  </button>
                </li>
                <li>
                  <button onClick={onGoRefundPolicy || onGoSupport} className="hover:text-white hover:underline underline-offset-4 transition-colors text-left">
                    Cancellation &amp; Refund Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoPrivacy || onGoSupport} className="hover:text-white hover:underline underline-offset-4 transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={onGoTerms || onGoSupport} className="hover:text-white hover:underline underline-offset-4 transition-colors text-left">
                    Terms &amp; Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div className="space-y-3.5">
              <h4 className="font-fraunces text-sm font-semibold text-white tracking-wide pb-1 border-b border-white/10">
                Contact Us
              </h4>
              <div className="space-y-3 text-xs text-[#D4C3D0] font-manrope leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FBEAE5] shrink-0 mt-0.5" />
                  <span>Udaipur, Rajasthan 313001, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FBEAE5] shrink-0" />
                  <span>+91 7742320607</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FBEAE5] shrink-0" />
                  <a href="mailto:info@shraviko.com" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                    info@shraviko.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D4C3D0] font-manrope">
            <div className="text-center md:text-left space-y-0.5">
              <p>© {new Date().getFullYear()} Shraviko. All rights reserved.</p>
              <p className="text-[11px] text-white/50 tracking-wide">
                GSTIN: 08CODPJ2489F1ZT &nbsp;·&nbsp; Registered in Rajasthan, India
              </p>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-manrope text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 2. Official Brand Emblem Sign-off (No font recreation) ── */}
      <div className="relative bg-[#130E12] border-t border-white/10 py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
          <img
            src="/assets/Logo/LOGO.png"
            alt="Shraviko Official Emblem"
            className="w-12 h-12 rounded-full p-0.5 bg-white object-contain shadow-md"
          />
          <p className="font-fraunces text-base sm:text-lg text-white font-medium">
            Handcrafted with devotion in Udaipur, Rajasthan
          </p>
          <p className="text-xs font-manrope text-white/50 max-w-md">
            Dedicated to bringing authentic Indian metalcraft, sacred scents, and Vedic living to thoughtful sanctuaries worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
