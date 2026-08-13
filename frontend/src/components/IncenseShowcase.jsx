import React, { useState } from 'react';
import { Wind, Sparkles, Bell, Check, Clock } from 'lucide-react';

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
      <img
        src="/assets/Incense cover.jpg"
        alt="Sacred Incense & Natural Dhoop"
        className="absolute inset-0 w-full h-full object-cover object-[center_65%] opacity-35 hero-image-crisp scale-105"
      />

      {/* Dark Ambient Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1715]/85 via-[#1C1715]/70 to-[#1C1715]/95 backdrop-blur-[2px] pointer-events-none" />

      {/* Warm Ambient Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#C5A059]/15 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12 space-y-6">
        
        {/* Top Atelier Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A2421]/90 border border-[#C5A059]/50 text-[#E5C378] text-xs font-cinzel tracking-widest uppercase shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
          <span>Vedic Sensory Collection</span>
        </div>

        {/* Main Category Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-cinzel font-bold text-white tracking-tight drop-shadow-2xl">
          Sacred Incense & Natural Dhoop
        </h1>

        {/* Prominent Launching Soon Badge */}
        <div className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-gradient-to-r from-[#C5A059]/30 via-[#E5C378]/40 to-[#C5A059]/30 border-2 border-[#E5C378] text-[#F5C767] font-cinzel font-bold text-base sm:text-lg tracking-widest uppercase shadow-[0_0_30px_rgba(229,195,120,0.3)] animate-pulse my-2">
          <Clock className="w-5 h-5 text-[#E5C378]" />
          <span>Launching Soon</span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base font-sans text-[#D4CEBF] font-light leading-relaxed max-w-xl mx-auto drop-shadow-md">
          Our 100% charcoal-free temple flower incense, hand-rolled agarbatti, and organic dhoop sticks are currently being crafted by master Vedic perfumers. Prepare your home for non-toxic aromatic elevation.
        </p>

        {/* VIP Launch Access Card */}
        <div className="w-full max-w-md bg-[#2A2421]/80 border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md mt-4">
          <div className="text-center mb-4">
            <h3 className="font-cinzel text-sm font-bold text-[#F9F5EC] flex items-center justify-center gap-2">
              <Wind className="w-4 h-4 text-[#C5A059]" />
              <span>Get Exclusive Launch VIP Access</span>
            </h3>
            <p className="text-[11px] text-gray-300 font-sans mt-1">
              Be notified the moment our hand-rolled temple incense is released.
            </p>
          </div>

          {isNotified ? (
            <div className="bg-[#171312] border border-[#C5A059]/50 rounded-xl p-3.5 text-center text-xs font-sans text-[#E5C378] flex items-center justify-center gap-2 shadow-inner">
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
                className="flex-1 bg-[#171312] border border-[#3A3431] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#F9F5EC] placeholder-gray-500 focus:outline-none transition-all font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#E5C378] text-[#171312] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shrink-0"
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
