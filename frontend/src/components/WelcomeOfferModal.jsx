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
      }, 12000);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#2C2623]/50 backdrop-blur-xs animate-fade-in select-none">
      
      {/* Backdrop Click to Close */}
      <div 
        className="absolute inset-0" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      {/* Modal Container — Calm Ivory & Boutique Aesthetic */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] text-[#2C2623] rounded-3xl border border-[#EAE0CD] shadow-2xl overflow-hidden z-10 transform transition-all animate-scale-up">
        
        {/* Top Plum Ribbon */}
        <div className="h-2 w-full bg-[#57324F]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-[#7A6B5D] hover:text-[#2C2623] hover:bg-[#FBEAE5] transition-all shadow-xs border border-[#EAE0CD] z-20"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>

        {/* Modal Body */}
        <div className="px-6 pt-7 pb-6 text-center relative">
          
          {/* Logo Badge — Clean Aura Border */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-white p-0.5 bg-white shadow-md flex items-center justify-center overflow-hidden">
            <SafeImage 
              src="/assets/Logo/LOGO.png" 
              alt="Shraviko Official Emblem" 
              priority={true}
              containerClassName="w-full h-full rounded-full"
              className="w-full h-full object-contain rounded-full" 
            />
          </div>

          {/* New Store Launch Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FBEAE5] border border-[#57324F]/15 rounded-full text-[11px] font-manrope font-semibold text-[#57324F] mb-3">
            <Sparkles className="w-3 h-3 text-[#57324F]" />
            <span>Artisan Boutique Store</span>
          </div>

          <h2 className="font-fraunces text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623] mb-2">
            Welcome to Shraviko
          </h2>

          <p className="text-xs text-[#5C4A3E] font-manrope font-light leading-relaxed max-w-xs mx-auto mb-5">
            Crafting pure brassware, heavy copper vessels, &amp; organic temple flower incense. We bring authentic Indian heritage directly to your home.
          </p>

          {/* Trust Guarantee Cards */}
          <div className="grid grid-cols-3 gap-2 text-[11px] text-[#5C4A3E] font-manrope mb-5">
            <div className="bg-white border border-[#EAE0CD] p-2.5 rounded-2xl text-center">
              <span className="block text-[#57324F] font-bold text-xs mb-0.5">100%</span>
              <span>Pure Metalcraft</span>
            </div>
            <div className="bg-white border border-[#EAE0CD] p-2.5 rounded-2xl text-center">
              <span className="block text-emerald-700 font-bold text-xs mb-0.5">7-Day</span>
              <span>Easy Returns</span>
            </div>
            <div className="bg-white border border-[#EAE0CD] p-2.5 rounded-2xl text-center">
              <span className="block text-[#57324F] font-bold text-xs mb-0.5">Free</span>
              <span>Delivery 999+</span>
            </div>
          </div>

          {/* Launch Gift Banner */}
          <div className="bg-[#FBEAE5] border border-[#57324F]/20 rounded-2xl p-4 mb-5 shadow-xs">
            <p className="text-[11px] font-manrope uppercase tracking-wider text-[#57324F] font-bold mb-1">
              Celebration Launch Offer
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="text-left pl-1">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6B5D] block font-manrope">First Order Code</span>
                <span className="font-mono font-extrabold text-base tracking-wider text-[#2C2623]">WELCOME10</span>
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-4 py-2.5 rounded-xl font-manrope text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                  copied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white active:scale-95'
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
            className="text-xs text-[#57324F] hover:text-[#42253C] font-manrope font-semibold underline underline-offset-4 transition-colors"
          >
            Explore Sacred Collection
          </button>

        </div>
      </div>
    </div>
  );
};
