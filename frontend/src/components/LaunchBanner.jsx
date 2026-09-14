import React from 'react';
import { Truck, Gift, ShieldCheck, Tag } from 'lucide-react';

export const LaunchBanner = ({ onCopyCode }) => {
  return (
    <section className="bg-[#FAF5EB] border-b border-[#EAE0CD] py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Top Tag — USE CODE: WELCOME10 */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-md border border-[#C5A059]/40 bg-[#2C1F06] text-[#E5C378] shadow-xs mb-3.5 transition-transform hover:scale-[1.02]">
          <Tag className="w-3.5 h-3.5 text-[#E5C378]" />
          <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider uppercase">
            USE CODE: <strong className="text-[#E5C378] font-bold underline decoration-[#C5A059]/50 underline-offset-4">WELCOME10</strong>
          </span>
          <span className="text-[10px] bg-[#C5A059] text-[#2C1F06] font-sans font-bold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
            10% OFF
          </span>
        </div>

        {/* 3 Offer Columns with Dividers */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-6 divide-x divide-[#EAE0CD] max-w-4xl">
          
          {/* Column 1: FREE SHIPPING */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center mb-1.5 text-[#C5A059] shadow-xs">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C1F06] uppercase tracking-wider">
              Free Shipping
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#6B5840] mt-0.5 font-medium">
              On orders above ₹999
            </p>
          </div>

          {/* Column 2: SPECIAL GIFT */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center mb-1.5 text-[#C5A059] shadow-xs">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C1F06] uppercase tracking-wider">
              Special Gift
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#6B5840] mt-0.5 font-medium">
              On orders above ₹2,499
            </p>
          </div>

          {/* Column 3: PREMIUM QUALITY */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center mb-1.5 text-[#C5A059] shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-cinzel text-[11px] sm:text-xs font-bold text-[#2C1F06] uppercase tracking-wider">
              Premium Quality
            </h4>
            <p className="text-[9px] sm:text-[11px] font-sans text-[#6B5840] mt-0.5 font-medium">
              Trusted by thousands
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
