import React from 'react';
import { Truck, Gift, ShieldCheck, Tag } from 'lucide-react';

export const LaunchBanner = ({ onCopyCode }) => {
  return (
    <section className="bg-gradient-to-r from-[#FAF3E5] via-[#FFFDF7] to-[#FAF3E5] border-b border-[#E8DCC4] py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Top Tag — USE CODE: WELCOME10 */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-md border border-[#D4AF37]/60 bg-[#FAF0D9]/80 shadow-xs mb-3.5 transition-transform hover:scale-[1.02]">
          <Tag className="w-3.5 h-3.5 text-[#8C6929]" />
          <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-[#5A4118] uppercase">
            USE CODE: <strong className="text-[#8C6929] font-bold underline decoration-[#D4AF37]/50 underline-offset-4">WELCOME10</strong>
          </span>
          <span className="text-[10px] bg-[#8C6929] text-white font-sans font-bold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
            10% OFF
          </span>
        </div>

        {/* 3 Offer Columns with Dividers */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-6 divide-x divide-[#E8DCC4] max-w-4xl">
          
          {/* Column 1: FREE SHIPPING */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF0D9] border border-[#E0D0B0] flex items-center justify-center mb-1.5 text-[#8C6929] shadow-xs">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C2623] uppercase tracking-wider">
              Free Shipping
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#7A6752] mt-0.5 font-medium">
              On orders above ₹999
            </p>
          </div>

          {/* Column 2: SPECIAL GIFT */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF0D9] border border-[#E0D0B0] flex items-center justify-center mb-1.5 text-[#8C6929] shadow-xs">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C2623] uppercase tracking-wider">
              Special Gift
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#7A6752] mt-0.5 font-medium">
              On orders above ₹2,499
            </p>
          </div>

          {/* Column 3: PREMIUM QUALITY */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF0D9] border border-[#E0D0B0] flex items-center justify-center mb-1.5 text-[#8C6929] shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C2623] uppercase tracking-wider">
              Premium Quality
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#7A6752] mt-0.5 font-medium">
              Trusted by thousands
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
