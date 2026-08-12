import React, { useEffect } from 'react';
import { CheckCircle, ShoppingBag, Heart, Sparkles, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-[#C5A059]" />;
      case 'wishlist':
        return <Heart className="w-5 h-5 text-[#A63A2B] fill-[#A63A2B]" />;
      case 'newsletter':
        return <Sparkles className="w-5 h-5 text-[#C5A059]" />;
      default:
        return <CheckCircle className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-slide-up">
      <div className="bg-[#2C2623] text-[#F9F5EC] p-4 rounded-lg shadow-2xl border border-[#C5A059]/40 flex items-start gap-3 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 bottom-0 w-1 brass-gradient-bg"></div>

        <div className="p-1 rounded-full bg-[#3A3431] mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-cinzel text-xs tracking-wider text-[#E5C378] font-medium uppercase">
            {toast.title || 'Notification'}
          </h4>
          <p className="text-xs text-[#EAE0CD] mt-0.5 leading-relaxed font-sans">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
