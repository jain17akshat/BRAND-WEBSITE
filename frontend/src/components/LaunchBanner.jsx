import React from 'react';
import { Truck, Gift, ShieldCheck, Tag } from 'lucide-react';

export const LaunchBanner = ({ onCopyCode }) => {
  return (
    <section className="bg-[#FAF7F2] border-b border-[#EAE0CD] py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Top Tag — USE CODE: WELCOME10 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#57324F]/20 bg-[#57324F] text-white shadow-xs mb-3.5 transition-transform hover:scale-[1.02]">
          <Tag className="w-3.5 h-3.5 text-[#FBEAE5]" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            USE CODE: <strong className="text-[#FBEAE5] font-bold underline decoration-white/40 underline-offset-4">WELCOME10</strong>
          </span>
          <span className="text-[10px] bg-[#FBEAE5] text-[#57324F] font-manrope font-bold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
            10% OFF
          </span>
        </div>

        {/* 3 Offer Columns with Dividers */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-6 divide-x divide-[#EAE0CD] max-w-4xl">
          
          {/* Column 1: FREE SHIPPING */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border border-[#EAE0CD] flex items-center justify-center mb-1.5 text-[#57324F] shadow-xs">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-manrope text-[11px] sm:text-xs font-bold text-[#2C2623] tracking-wide">
              Free Shipping
            </h4>
            <p className="text-[10px] sm:text-[11px] font-manrope text-[#7A6B5D] mt-0.5">
              On orders above ₹999
            </p>
          </div>

          {/* Column 2: SPECIAL GIFT */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border border-[#EAE0CD] flex items-center justify-center mb-1.5 text-[#57324F] shadow-xs">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-manrope text-[11px] sm:text-xs font-bold text-[#2C2623] tracking-wide">
              Special Gift
            </h4>
            <p className="text-[10px] sm:text-[11px] font-manrope text-[#7A6B5D] mt-0.5">
              On orders above ₹2,499
            </p>
          </div>

          {/* Column 3: PREMIUM QUALITY */}
          <div className="flex flex-col items-center text-center px-1 sm:px-4 pl-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white border border-[#EAE0CD] flex items-center justify-center mb-1.5 text-[#57324F] shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-manrope text-[11px] sm:text-xs font-bold text-[#2C2623] tracking-wide">
              Pure Metalcraft
            </h4>
            <p className="text-[10px] sm:text-[11px] font-manrope text-[#7A6B5D] mt-0.5">
              Authentic Indian artisans
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
