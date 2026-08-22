import React from 'react';

export function PaymentLogos() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 select-none">
      
      {/* UPI Official Badge */}
      <div
        className="h-7 px-2.5 bg-[#1E1917] hover:bg-[#28221F] border border-[#3A3431] rounded-md flex items-center justify-center transition-all shadow-sm"
        title="UPI Payments Powered by NPCI"
      >
        <svg className="h-3.5 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Green & Orange Triangles */}
          <path d="M12 8L24 20L12 32H4L16 20L4 8H12Z" fill="#00B86B" />
          <path d="M22 8L34 20L22 32H14L26 20L14 8H22Z" fill="#FF5E00" />
          {/* UPI Text */}
          <text x="38" y="27" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="20" fill="#FFFFFF" letterSpacing="0.5">UPI</text>
        </svg>
      </div>

      {/* VISA Official Badge */}
      <div
        className="h-7 px-2.5 bg-[#1E1917] hover:bg-[#28221F] border border-[#3A3431] rounded-md flex items-center justify-center transition-all shadow-sm"
        title="Visa Secured"
      >
        <svg className="h-3.5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="24" fontFamily="'Trebuchet MS', sans-serif" fontWeight="bold" fontStyle="italic" fontSize="26" fill="#1434CB">
            V<tspan fill="#F7B600">I</tspan><tspan fill="#FFFFFF">SA</tspan>
          </text>
        </svg>
      </div>

      {/* Mastercard Official Badge */}
      <div
        className="h-7 px-2.5 bg-[#1E1917] hover:bg-[#28221F] border border-[#3A3431] rounded-md flex items-center justify-center transition-all shadow-sm"
        title="Mastercard Identity Check"
      >
        <svg className="h-4 w-auto" viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="20" r="16" fill="#EB001B" />
          <circle cx="45" cy="20" r="16" fill="#F79E1B" fillOpacity="0.92" />
          <path d="M35 7.6A15.9 15.9 0 0 1 41 20A15.9 15.9 0 0 1 35 32.4A15.9 15.9 0 0 1 29 20A15.9 15.9 0 0 1 35 7.6Z" fill="#FF5F00" />
        </svg>
      </div>

      {/* RuPay Official Badge */}
      <div
        className="h-7 px-2.5 bg-[#1E1917] hover:bg-[#28221F] border border-[#3A3431] rounded-md flex items-center justify-center transition-all shadow-sm"
        title="RuPay Card"
      >
        <svg className="h-3.5 w-auto" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="23" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="21" fill="#FFFFFF">Ru</text>
          <text x="32" y="23" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="21" fill="#00A859">Pay</text>
          <path d="M80 6L94 16L80 26H72L86 16L72 6H80Z" fill="#F37023" />
          <path d="M90 6L104 16L90 26H82L96 16L82 6H90Z" fill="#00A859" />
        </svg>
      </div>

      {/* Razorpay Secured Badge */}
      <div
        className="h-7 px-2.5 bg-[#1E1917] hover:bg-[#28221F] border border-[#3A3431] rounded-md flex items-center justify-center transition-all shadow-sm gap-1.5"
        title="Protected by Razorpay 256-bit Encryption"
      >
        <svg className="h-3.5 w-auto text-[#0C2340]" viewBox="0 0 90 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 22L16 4H26L18 22H8Z" fill="#0C2340" />
          <path d="M14 26L22 4L32 26H14Z" fill="#2B84EA" />
          <text x="36" y="21" fontFamily="sans-serif" fontWeight="bold" fontSize="13" fill="#00C4FF">Razorpay</text>
        </svg>
      </div>

    </div>
  );
}
