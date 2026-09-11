import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PaymentLogos() {
  return (
    <div 
      className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1E1917] hover:bg-[#241E1C] border border-[#3A3431] rounded-full transition-all shadow-sm select-none"
      title="Protected by Razorpay 256-bit SSL Encryption"
    >
      <ShieldCheck className="w-4 h-4 text-[#00C4FF] shrink-0" />
      <span className="text-xs font-cinzel font-semibold text-[#EAE0CD] tracking-wider">
        Pay securely via <strong className="text-[#00C4FF] font-bold">Razorpay</strong>
      </span>
    </div>
  );
}
