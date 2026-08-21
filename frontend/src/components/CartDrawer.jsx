import React, { useState, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Gift, Package, Sparkles, Truck } from 'lucide-react';
import { ProductImage } from './ProductImage';

/* ─── Milestone definitions ──────────────────────────────────────────── */
const MILESTONES = [
  {
    id: 'start',
    threshold: 0,
    icon: ShoppingBag,
    label: 'Cart',
    reward: '',
    chipLabel: '',
  },
  {
    id: 'shipping',
    threshold: 2999,
    icon: Truck,
    label: 'Free Shipping',
    reward: 'Free Express Delivery',
    chipLabel: '✦ Free Shipping Unlocked',
  },
  {
    id: 'gift',
    threshold: 4999,
    icon: Gift,
    label: 'Free Gift',
    reward: 'Free Brass Diya',
    chipLabel: '✦ Free Brass Diya Added',
  },
  {
    id: 'mystery',
    threshold: 7499,
    icon: Sparkles,
    label: 'Mystery Box',
    reward: 'Mystery Sacred Box',
    chipLabel: '✦ Mystery Sacred Box Unlocked',
  },
];

/* ─── CartProgressBar sub-component ────────────────────────────────── */
const CartProgressBar = ({ subtotal }) => {
  const unlockedBefore = useRef(new Set());

  const maxThreshold = MILESTONES[MILESTONES.length - 1].threshold;
  const allUnlocked = subtotal >= maxThreshold;
  const progressPercent = Math.min(100, (subtotal / maxThreshold) * 100);
  const nextMilestone = MILESTONES.find((m) => m.threshold > 0 && subtotal < m.threshold);
  const amountNeeded = nextMilestone ? nextMilestone.threshold - subtotal : 0;

  MILESTONES.forEach((m) => {
    if (m.threshold > 0 && subtotal >= m.threshold && !unlockedBefore.current.has(m.id)) {
      unlockedBefore.current.add(m.id);
    }
  });

  const milestoneClass = (m) => {
    if (subtotal >= m.threshold) return 'cart-milestone unlocked';
    if (nextMilestone?.id === m.id) return 'cart-milestone next-target';
    return 'cart-milestone';
  };

  return (
    <div className="bg-[#FAF0D9] px-3 sm:px-5 pt-3.5 pb-3 border-b border-[#EAD7AF]">

      {/* Dynamic message */}
      <p className="text-[11px] font-sans text-center text-[#755722] mb-3 leading-snug">
        {allUnlocked ? (
          <span className="font-cinzel font-bold text-emerald-800 flex items-center justify-center gap-1">
            ✨ All rewards unlocked — thank you for your sacred order!
          </span>
        ) : (
          <>
            Add{' '}
            <span className="font-bold text-[#2C2623]">
              ₹{amountNeeded.toLocaleString('en-IN')}
            </span>{' '}
            more to unlock{' '}
            <span className="font-semibold text-[#8C6929]">
              {nextMilestone?.reward}
            </span>
            !
          </>
        )}
      </p>

      {/* Track + Dots Container */}
      <div className="relative mx-5 mt-1">
        {/* Track background */}
        <div className="absolute left-0 right-0 top-[11px] h-1.5 bg-[#E8DDC6] rounded-full overflow-hidden">
          <div
            className="cart-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone dots */}
        {MILESTONES.map((m) => {
          const posPercent = (m.threshold / maxThreshold) * 100;
          const IconComp = m.icon;
          const isUnlocked = subtotal >= m.threshold;

          return (
            <div
              key={m.id}
              className="absolute z-10 flex flex-col items-center -translate-x-1/2"
              style={{
                left: `${posPercent}%`,
                top: 0,
              }}
            >
              <div className={milestoneClass(m)}>
                {isUnlocked && m.threshold > 0 ? (
                  <Check className="w-3 h-3 text-white milestone-check" strokeWidth={3} />
                ) : (
                  <IconComp className={`w-3 h-3 ${isUnlocked ? 'text-white' : 'text-[#8C6929]'}`} />
                )}
              </div>
              {/* Centered label under dot */}
              <span
                className={`mt-1 text-[9px] font-sans font-semibold leading-tight text-center whitespace-nowrap ${
                  isUnlocked ? 'text-[#8C6929]' : 'text-[#A89070]'
                }`}
              >
                {m.label}
              </span>
              <span
                className={`text-[8px] font-sans leading-none text-center ${
                  isUnlocked ? 'text-emerald-700 font-medium' : 'text-[#C0A87A]'
                }`}
              >
                ₹{m.threshold.toLocaleString('en-IN')}
              </span>
            </div>
          );
        })}

        {/* Spacer height for dot + text labels */}
        <div className="h-[54px]" />
      </div>

      {/* Gift unlock chips */}
      {MILESTONES.filter((m) => m.chipLabel && subtotal >= m.threshold).length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
          {MILESTONES.filter((m) => m.chipLabel && subtotal >= m.threshold).map((m) => (
            <span key={m.id} className="gift-unlock-chip">
              {m.chipLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── CartDrawer ────────────────────────────────────────────────────── */
export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 2999;

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SACRED10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'SHRAVIKO200' || promoCode.trim().toUpperCase() === 'ARKA200') {
      setDiscount(200);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try SACRED10 or SHRAVIKO200');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#171312]/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-drawer border-l border-[#EAE0CD] flex flex-col justify-between animate-slide-up">
          
          {/* Drawer Header */}
          <div className="p-6 bg-[#231E1C] text-[#F9F5EC] border-b border-[#C5A059]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-cinzel text-base font-semibold tracking-wider text-[#F9F5EC]">
                Your Sacred Cart
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── 3-Tier Progress Bar ── */}
          <CartProgressBar subtotal={subtotal} />

          {/* Cart Items List */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F6F1E7] border border-[#EAE0CD] flex items-center justify-center text-[#967433]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-cinzel text-lg font-semibold text-[#2C2623]">Your Cart is Empty</h4>
                <p className="text-xs text-[#4A4441] max-w-xs font-light">
                  Explore our bestselling brassware, copper vessels, and temple flower incense to begin your daily ritual.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-[#231E1C] text-[#E5C378] font-cinzel text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-white border border-[#EAE0CD] flex gap-3 shadow-xs"
                >
                  <div className="w-20 h-20 rounded overflow-hidden shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      artType={item.artType}
                      aspect="aspect-square"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-cinzel text-xs font-semibold text-[#2C2623] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-[#A63A2B] transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#8C6929] font-sans block mt-0.5">
                        {item.purity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EAE0CD] rounded bg-[#FBF9F5]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F2EBDC] transition-colors"
                        >
                          <Minus className="w-3 h-3 text-[#2C2623]" />
                        </button>
                        <span className="px-2 text-xs font-sans font-semibold text-[#2C2623]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F2EBDC] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[#2C2623]" />
                        </button>
                      </div>

                      <span className="font-cinzel text-xs font-bold text-[#2C2623]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#F6F1E7] border-t border-[#EAE0CD] space-y-4">
              
              {/* Promo Input */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. SACRED10)"
                    className="w-full pl-8 pr-3 py-2 bg-white text-xs text-[#2C2623] border border-[#DAB97B]/60 rounded focus:outline-none uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#231E1C] text-[#E5C378] text-xs font-cinzel uppercase font-semibold rounded hover:bg-[#3A3431]"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="flex justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span>Promo Applied (SACRED10)</span>
                  <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Subtotal summary */}
              <div className="space-y-1.5 text-xs text-[#4A4441]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C2623]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-semibold">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-cinzel font-bold text-[#2C2623] pt-2 border-t border-[#EAE0CD]">
                  <span>Total</span>
                  <span className="text-base text-[#967433]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#231E1C] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-md hover:bg-[#3A3431] shadow-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/40"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>100% Encrypted &amp; Insured Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

