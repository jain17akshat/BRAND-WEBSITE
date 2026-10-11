import React, { useState } from 'react';
import { Wind, Sparkles, Bell, Check, Clock } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const IncenseShowcase = () => {
  const [email, setEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsNotified(true);
      setEmail('');
    }
  };

  return (
    <div className="relative w-full min-h-[85vh] bg-[#1C1715] text-[#F9F5EC] flex flex-col justify-center items-center overflow-hidden">
      
      {/* High-Res Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile View Image */}
        <div className="block sm:hidden absolute inset-0 w-full h-full">
          <SafeImage
            src="/Outside images/incnesestickmobile.webp"
            alt="Sacred Incense & Natural Dhoop"
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center opacity-35 hero-image-crisp scale-105"
          />
        </div>
        {/* Desktop View Image */}
        <div className="hidden sm:block absolute inset-0 w-full h-full">
          <SafeImage
            src="/Outside images/incenseimagedesktop.webp"
            alt="Sacred Incense & Natural Dhoop"
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-[center_65%] opacity-35 hero-image-crisp scale-105"
          />
        </div>
      </div>

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1715]/90 via-[#1C1715]/70 to-[#1C1715]/95 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12 space-y-6">
        
        {/* Top Atelier Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FBEAE5] text-xs font-manrope font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#FBEAE5]" />
          <span>Vedic Sensory Collection</span>
        </div>

        {/* Main Category Title */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-fraunces font-bold text-white tracking-tight drop-shadow-lg">
          Sacred Incense &amp; Natural Dhoop
        </h2>

        {/* Launching Soon Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#57324F]/40 border border-[#57324F]/80 text-[#FBEAE5] font-manrope font-semibold text-sm tracking-wider uppercase">
          <Clock className="w-4 h-4 text-[#FBEAE5]" />
          <span>Launching Soon</span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base font-manrope text-[#EAE0CD] font-light leading-relaxed max-w-xl mx-auto">
          Our 100% charcoal-free temple flower incense, hand-rolled agarbatti, and organic dhoop sticks are currently being crafted by master Vedic perfumers. Prepare your home for non-toxic aromatic elevation.
        </p>

        {/* VIP Launch Access Card */}
        <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md mt-4">
          <div className="text-center mb-4">
            <h3 className="font-fraunces text-base font-bold text-white flex items-center justify-center gap-2">
              <Wind className="w-4 h-4 text-[#FBEAE5]" />
              <span>Get Exclusive Launch VIP Access</span>
            </h3>
            <p className="text-xs text-[#EAE0CD]/80 font-manrope mt-1">
              Be notified the moment our hand-rolled temple incense is released.
            </p>
          </div>

          {isNotified ? (
            <div className="bg-white/15 border border-emerald-400/40 rounded-2xl p-3.5 text-center text-xs font-manrope text-white flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Thank you! You are on our VIP launch list.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white/15 border border-white/25 focus:border-[#57324F] rounded-xl px-4 py-3 text-xs text-white placeholder-white/60 focus:outline-none transition-all font-manrope"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 min-h-[46px]"
              >
                <Bell className="w-4 h-4" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
