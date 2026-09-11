import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PaymentLogos({ dark = true, className = '' }) {
  return (
    <div 
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm select-none ${
        dark 
          ? 'bg-[#1E1917] hover:bg-[#241E1C] border-[#3A3431] text-[#EAE0CD]'
          : 'bg-[#F9F6F0] hover:bg-[#F4EFE6] border-[#E5DCC9] text-[#2C2623]'
      } ${className}`}
      title="Protected by Razorpay 256-bit SSL Encryption"
    >
      <ShieldCheck className="w-4 h-4 text-[#00C4FF] shrink-0" />
      <span className="text-xs font-cinzel font-semibold tracking-wider">
        Pay securely via <strong className="text-[#00C4FF] font-bold">Razorpay</strong>
      </span>
    </div>
  );
}
