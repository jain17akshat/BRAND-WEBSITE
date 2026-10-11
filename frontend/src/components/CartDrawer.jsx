import React, { useState, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Gift, Package, Sparkles, Truck } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { PaymentLogos } from './PaymentLogos';

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
    threshold: 999,
    icon: Truck,
    label: 'Free Shipping',
    reward: 'Free Express Delivery',
    chipLabel: '✦ Free Shipping Unlocked',
  },
  {
    id: 'gift',
    threshold: 2499,
    icon: Gift,
    label: 'Special Gift',
    reward: 'Free Sacred Gift',
    chipLabel: '✦ Special Gift Added',
  },
  {
    id: 'mystery',
    threshold: 4999,
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
    <div className="bg-[#EBF2EB]/60 px-3 sm:px-5 pt-3.5 pb-3 border-b border-[#D5E2D5] font-manrope">

      {/* Dynamic message */}
      <p className="text-[11px] font-manrope text-center text-[#2C221E] mb-3 leading-snug">
        {allUnlocked ? (
          <span className="font-semibold text-emerald-800 flex items-center justify-center gap-1">
            ✨ All rewards unlocked — thank you for your sacred order!
          </span>
        ) : (
          <>
            Add{' '}
            <span className="font-bold text-[#57324F]">
              ₹{amountNeeded.toLocaleString('en-IN')}
            </span>{' '}
            more to unlock{' '}
            <span className="font-semibold text-[#57324F]">
              {nextMilestone?.reward}
            </span>
            !
          </>
        )}
      </p>

      {/* Track + Dots Container */}
      <div className="relative mx-5 mt-1">
        {/* Track background */}
        <div className="absolute left-0 right-0 top-[11px] h-1.5 bg-[#DCE8DC] rounded-full overflow-hidden">
          <div
            className="cart-progress-fill"
            style={{ width: `${progressPercent}%`, backgroundColor: '#57324F' }}
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
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isUnlocked
                  ? 'bg-[#57324F] text-white shadow-xs'
                  : 'bg-white text-[#8C7A70] border border-[#D5E2D5]'
              }`}>
                {isUnlocked && m.threshold > 0 ? (
                  <Check className="w-3 h-3 text-white milestone-check" strokeWidth={3} />
                ) : (
                  <IconComp className="w-3 h-3" />
                )}
              </div>
              {/* Centered label under dot */}
              <span
                className={`mt-1 text-[9px] font-manrope font-semibold leading-tight text-center whitespace-nowrap ${
                  isUnlocked ? 'text-[#57324F]' : 'text-[#8C7A70]'
                }`}
              >
                {m.label}
              </span>
              <span
                className={`text-[8px] font-manrope leading-none text-center ${
                  isUnlocked ? 'text-emerald-700 font-medium' : 'text-[#A09282]'
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
            <span key={m.id} className="text-[10px] font-manrope font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#57324F] border border-[#57324F]/20 shadow-2xs">
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
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;

  // Calculate discount dynamically if WELCOME10 is applied
  const isWelcomeApplied = appliedPromo?.code === 'WELCOME10';
  const discount = isWelcomeApplied ? Math.round(subtotal * 0.10) : (appliedPromo?.discount || 0);

  // ₹50 prepaid incentive for online checkout preview
  const PREPAID_INCENTIVE = 50;
  const prepaidSaving = subtotal > 0 ? PREPAID_INCENTIVE : 0;

  const handleApply = (e) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (cleaned === 'WELCOME10') {
      onApplyPromo({ code: 'WELCOME10', discountPercent: 10 });
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Use code WELCOME10 for 10% OFF!');
    }
  };

  const finalTotal = Math.max(0, subtotal + shippingFee - discount - prepaidSaving);

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
          <div className="p-5 sm:p-6 bg-[#FAF7F2] text-[#2C221E] border-b border-[#EAE0CD] flex items-center justify-between font-manrope">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#57324F]" />
              <h3 className="font-fraunces text-lg font-medium text-[#2C221E]">
                Your Shopping Cart
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-1 text-[#8C7A70] hover:text-[#2C221E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── 3-Tier Progress Bar ── */}
          <CartProgressBar subtotal={subtotal} />

          {/* Cart Items List */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 font-manrope">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#EAE0CD] flex items-center justify-center text-[#57324F]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-fraunces text-xl font-medium text-[#2C221E]">Your Cart is Empty</h4>
                <p className="text-xs text-[#6B5E57] max-w-xs font-normal">
                  Explore our bestselling brassware, copper vessels, and temple flower incense to begin your daily ritual.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-3 bg-[#57324F] hover:bg-[#42253C] text-white font-manrope text-xs uppercase tracking-wider font-semibold rounded-[12px] transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE0CD] flex gap-3 shadow-xs"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FAF7F2]">
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
                        <h4 className="font-manrope text-xs font-semibold text-[#2C221E] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-[#A8988F] hover:text-[#57324F] transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#8C7A70] font-manrope block mt-0.5">
                        {item.purity || item.selectedWeight}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EAE0CD] rounded-[10px] bg-[#FAF7F2]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1 hover:bg-[#F2EBDC] transition-colors"
                        >
                          <Minus className="w-3 h-3 text-[#2C221E]" />
                        </button>
                        <span className="px-2 text-xs font-manrope font-semibold text-[#2C221E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1 hover:bg-[#F2EBDC] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[#2C221E]" />
                        </button>
                      </div>

                      <span className="font-manrope text-xs font-bold text-[#2C221E]">
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
            <div className="p-5 sm:p-6 bg-white border-t border-[#EAE0CD] space-y-4 font-manrope">
              
              {/* Promo Input */}
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-[#EBF2EB] border border-[#C5D9C5] p-2.5 rounded-[12px] text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="font-bold tracking-wider">CODE: {appliedPromo.code}</p>
                      <p className="text-[10px] text-emerald-800">10% Launch Discount Applied</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 text-sm">-₹{discount.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="p-1 hover:bg-emerald-200 rounded text-emerald-800 transition-colors"
                      title="Remove promo code"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <form onSubmit={handleApply} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          if (promoError) setPromoError('');
                        }}
                        placeholder="Promo code (e.g. WELCOME10)"
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] text-xs text-[#2C221E] border border-[#EAE0CD] rounded-[12px] focus:outline-none focus:border-[#57324F] uppercase font-medium placeholder:normal-case"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#57324F] hover:bg-[#42253C] text-white text-xs font-semibold rounded-[12px] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && (
                    <p className="text-[11px] text-rose-700 font-medium pl-1">{promoError}</p>
                  )}
                </div>
              )}

              {/* Subtotal summary */}
              <div className="space-y-1.5 text-xs text-[#6B5E57]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C221E]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedPromo?.code || 'WELCOME10'})</span>
                    <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-[#3B7A57] font-semibold uppercase" : "font-semibold text-[#2C221E]"}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                {prepaidSaving > 0 && (
                  <div className="flex justify-between text-[#3B7A57] font-medium">
                    <span>Prepaid Saving 💸</span>
                    <span className="font-bold">-₹{prepaidSaving.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-manrope font-bold text-[#2C221E] pt-2 border-t border-[#EAE0CD]">
                  <span>Total Payable</span>
                  <span className="text-base text-[#57324F]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full min-h-[50px] py-3.5 bg-[#57324F] hover:bg-[#42253C] text-white font-manrope text-sm font-semibold rounded-[12px] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="flex justify-center pt-1">
                <PaymentLogos dark={false} className="w-full" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

