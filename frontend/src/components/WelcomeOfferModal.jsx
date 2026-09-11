import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const WelcomeOfferModal = ({ onApplyCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user already dismissed modal in this session
    const hasDismissed = sessionStorage.getItem('shraviko_welcome_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('shraviko_welcome_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon('WELCOME10');

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-md animate-fade-in select-none">
      
      {/* Backdrop Click to Close */}
      <div 
        className="absolute inset-0" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      {/* Modal Container — Matching Website Warm Ivory & Gold Aesthetic */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] text-[#2C1F06] rounded-3xl border border-[#E8DFC7] shadow-2xl overflow-hidden z-10 transform transition-all animate-scale-up">
        
        {/* Top Gold Metallic Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#B8860B] via-[#E5C378] to-[#B8860B]" />

        {/* ── EASY CLOSING BUTTON (Top Right X) ── */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-[#F5F0E8] text-[#7A6859] hover:text-[#2C1F06] hover:bg-[#EAE2D3] transition-all shadow-sm active:scale-95 group border border-[#E8DFC7] z-20"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>

        {/* Modal Body */}
        <div className="px-6 pt-7 pb-6 text-center relative">
          
          {/* Logo Badge — Clean White Aura Border */}
          <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-white p-0.5 bg-white shadow-md flex items-center justify-center overflow-hidden">
            <SafeImage 
              src="/assets/Logo/LOGO.png" 
              alt="Shraviko" 
              priority={true}
              containerClassName="w-full h-full rounded-full"
              className="w-full h-full object-contain rounded-full" 
            />
          </div>

          {/* New Store Launch Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F5EDD9] border border-[#C5A059]/40 rounded-full text-[10px] font-cinzel font-bold text-[#8C6D27] uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Newly Launched Artisan Store</span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight text-[#2C1F06] mb-2">
            WELCOME TO SHRAVIKO
          </h2>

          <p className="text-xs text-[#5C4A3E] font-light leading-relaxed max-w-xs mx-auto mb-5">
            Crafting pure brassware, heavy copper vessels, &amp; organic temple flower incense. We bring authentic Indian heritage directly from master artisans to your home.
          </p>

          {/* Trust Guarantee Cards */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-[#5C4A3E] mb-5">
            <div className="bg-[#FAF6EC] border border-[#E8DFC7] p-2 rounded-xl text-center">
              <span className="block text-[#C5A059] font-bold text-xs mb-0.5">100%</span>
              <span>Pure Metalcraft</span>
            </div>
            <div className="bg-[#FAF6EC] border border-[#E8DFC7] p-2 rounded-xl text-center">
              <span className="block text-emerald-600 font-bold text-xs mb-0.5">7-Day</span>
              <span>Easy Returns</span>
            </div>
            <div className="bg-[#FAF6EC] border border-[#E8DFC7] p-2 rounded-xl text-center">
              <span className="block text-blue-600 font-bold text-xs mb-0.5">COD</span>
              <span>Pay on Delivery</span>
            </div>
          </div>

          {/* Launch Gift Banner */}
          <div className="bg-gradient-to-r from-[#F7F2E6] via-[#FAF6EC] to-[#F7F2E6] border border-[#C5A059]/40 rounded-2xl p-3.5 mb-5 shadow-sm">
            <p className="text-[10px] font-cinzel uppercase tracking-wider text-[#8C6D27] font-semibold mb-1">
              🎉 Launch Celebration Offer
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="text-left pl-1">
                <span className="text-[9px] uppercase tracking-wider text-[#7A6859] block font-cinzel">First Order Code</span>
                <span className="font-mono font-extrabold text-base tracking-wider text-[#2C1F06]">WELCOME10</span>
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#C5A059] hover:bg-[#B8860B] text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>10% OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleClose}
            className="text-xs text-[#7A6859] hover:text-[#2C1F06] font-cinzel tracking-wider uppercase underline underline-offset-4 transition-colors"
          >
            Explore Sacred Collection
          </button>

        </div>
      </div>
    </div>
  );
};
