import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, ArrowRight, Loader2, AlertCircle, RefreshCw, CreditCard, QrCode, Building2, Banknote } from 'lucide-react';

export const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart
}) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    address: '402, Green Glen Heights, HSR Layout Sector 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102'
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99;
  const discount = 0;
  const grandTotal = subtotal + shipping - discount;

  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      subtitle: 'GPay, PhonePe, Paytm, BHIM (Fast & secure)',
      icon: QrCode,
      popular: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay, Diners',
      icon: CreditCard,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      subtitle: 'All major Indian banks supported',
      icon: Building2,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      subtitle: 'Pay via cash or UPI upon delivery',
      icon: Banknote,
    },
  ];

  const handleExecutePayment = (e) => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setPaymentError(false);

    // Simulate backend server-side verification and payment gateway flow
    setTimeout(() => {
      // 95% success rate for simulation
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        const generatedId = `SHR${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedId);
        setOrderComplete(true);
        setIsProcessing(false);
        onClearCart();
      } else {
        setIsProcessing(false);
        setPaymentError(true);
      }
    }, 1400);
  };

  const handleResetCheckout = () => {
    setOrderComplete(false);
    setPaymentError(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!orderComplete && !isProcessing) onClose();
        }}
        className="fixed inset-0 bg-[#171312]/80 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="relative bg-[#FBF9F5] rounded-2xl max-w-xl w-full border border-[#C5A059]/40 shadow-2xl overflow-hidden z-10 animate-slide-up my-4 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#231E1C] text-[#F9F5EC] border-b border-[#C5A059]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-[#F9F5EC]">
              {orderComplete ? 'Order Confirmation' : 'Secure Checkout'}
            </h3>
          </div>
          {!orderComplete && !isProcessing && (
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {orderComplete ? (
            /* 6. PAYMENT SUCCESS SCREEN */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-cinzel tracking-[0.25em] text-emerald-700 uppercase font-bold block mb-1">
                  ✓ Payment Successful
                </span>
                <h2 className="text-2xl font-cinzel font-bold text-[#2C2623]">
                  Order #{orderId}
                </h2>
                <p className="text-xl font-cinzel font-bold text-[#B8860B] mt-1">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-600 font-sans mt-2">
                  Your order has been confirmed & verified.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE0CD] text-xs text-left space-y-2 max-w-sm mx-auto shadow-sm">
                <div className="flex justify-between border-b border-[#F0E8DC] pb-2">
                  <span className="text-gray-500">Deliver To:</span>
                  <span className="font-semibold text-[#2C2623]">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0E8DC] pb-2">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-[#2C2623] text-right truncate max-w-[180px]">
                    {formData.address}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="font-semibold text-emerald-800">3–5 Business Days</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <button
                  onClick={handleResetCheckout}
                  className="w-full py-3 bg-[#231E1C] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-lg hover:bg-[#3A3431] transition-all min-h-[48px]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : paymentError ? (
            /* 7. PAYMENT FAILURE SCREEN */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-9 h-9 text-amber-700" />
              </div>

              <div>
                <h2 className="text-lg font-cinzel font-bold text-[#2C2623]">
                  Payment didn't go through
                </h2>
                <p className="text-xs text-gray-600 font-sans mt-2 max-w-xs mx-auto">
                  Your order details are still saved. Please try again or switch your payment method.
                </p>
              </div>

              <div className="pt-3 flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => handleExecutePayment()}
                  className="w-full py-3.5 bg-[#B8860B] text-white font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#9B7E52] transition-all flex items-center justify-center gap-2 min-h-[48px] shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Payment Again</span>
                </button>

                <button
                  onClick={() => setPaymentError(false)}
                  className="w-full py-3 bg-white text-[#2C2623] border border-[#EAE0CD] font-cinzel text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-[#F5F0E8] transition-all min-h-[48px]"
                >
                  Change Payment Method
                </button>
              </div>
            </div>
          ) : (
            /* MAIN CHECKOUT & PAYMENT FORM */
            <form onSubmit={handleExecutePayment} className="space-y-6">

              {/* Customer Address Details (compact) */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#8C6929] font-bold border-b border-[#EAE0CD] pb-2">
                  Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      required
                      className="w-full p-2.5 bg-white border border-[#EAE0CD] rounded-lg focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      required
                      className="w-full p-2.5 bg-white border border-[#EAE0CD] rounded-lg focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Address"
                      required
                      className="w-full p-2.5 bg-white border border-[#EAE0CD] rounded-lg focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 1. PAYMENT METHODS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAE0CD] pb-2">
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#8C6929] font-bold">
                    Payment Method
                  </h4>
                  <span className="text-[10px] text-gray-500 font-sans">Select one option</span>
                </div>

                <div className="space-y-2">
                  {paymentOptions.map((opt) => {
                    const isSelected = paymentMethod === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[52px] ${
                          isSelected
                            ? 'bg-[#231E1C] text-white border-[#B8860B] shadow-md'
                            : 'bg-white text-[#2C2623] border-[#EAE0CD] hover:border-[#DAB97B]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom Radio Icon */}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#E5C378] bg-[#E5C378]' : 'border-gray-400 bg-transparent'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#231E1C]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-cinzel text-xs font-bold tracking-wide">
                                {opt.name}
                              </span>
                              {opt.popular && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider ${
                                  isSelected ? 'bg-[#B8860B] text-white' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <p className={`text-[10px] font-sans mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                              {opt.subtitle}
                            </p>
                          </div>
                        </div>

                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#E5C378]' : 'text-gray-400'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. ORDER TOTAL BREAKDOWN */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE0CD] text-xs space-y-2">
                <div className="flex justify-between text-gray-600 font-sans">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-sans">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span> : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-sans">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-[#F0E8DC] pt-2 mt-2 flex justify-between items-center font-cinzel font-bold text-sm text-[#2C2623]">
                  <span>Total Payable</span>
                  <span className="text-base text-[#B8860B]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 3. PAYMENT BUTTON & 10. TRUST */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full min-h-[52px] py-3.5 bg-[#B8860B] hover:bg-[#9B7E52] text-white font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PROCESSING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>PAY ₹{grandTotal.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                {/* Trust reassurance */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-sans pt-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>🔒 256-Bit Encrypted & Verified Secure Payment</span>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
