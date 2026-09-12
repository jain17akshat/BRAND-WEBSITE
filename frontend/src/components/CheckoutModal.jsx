import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, ArrowRight, Loader2, AlertCircle, RefreshCw, CreditCard, QrCode, Building2, Banknote } from 'lucide-react';
import { createRazorpayOrder, verifyPayment } from '../services/api';
import { PaymentLogos } from './PaymentLogos';

export const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  appliedPromo
}) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const isSubmittingRef = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Load Razorpay checkout.js script once
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const isWelcomeApplied = appliedPromo?.code === 'WELCOME10';
  const discount = isWelcomeApplied ? Math.round(subtotal * 0.10) : (appliedPromo?.discount || 0);
  // ₹50 prepaid incentive for online payments
  const PREPAID_INCENTIVE = 50;
  const isPrepaidMethod = paymentMethod !== 'cod';
  const prepaidSaving = isPrepaidMethod ? PREPAID_INCENTIVE : 0;
  const grandTotal = Math.max(0, subtotal + shipping - discount - prepaidSaving);

  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      subtitle: 'GPay, PhonePe, Paytm, BHIM (Fast & secure)',
      icon: QrCode,
      popular: true,
      prepaidSave: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay, Diners',
      icon: CreditCard,
      prepaidSave: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      subtitle: 'All major Indian banks supported',
      icon: Building2,
      prepaidSave: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      subtitle: 'Pay via cash or UPI upon delivery · ₹50 extra savings available online',
      icon: Banknote,
    },
  ];

  const handleExecutePayment = async (e) => {
    if (e) e.preventDefault();
    if (isSubmittingRef.current || isProcessing) return;

    setPaymentError(false);
    setErrorMessage('');

    // Client-side input validation & normalization
    const cleanPhone = String(formData.phone || '').replace(/\D/g, '').slice(-10);
    const PHONE_RE = /^[6-9]\d{9}$/;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PINCODE_RE = /^\d{6}$/;

    if (!formData.name || formData.name.trim().length === 0) {
      setErrorMessage('Please enter your full name.');
      setPaymentError(true);
      return;
    }

    if (!cleanPhone || !PHONE_RE.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      setPaymentError(true);
      return;
    }

    if (!formData.email || !EMAIL_RE.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      setPaymentError(true);
      return;
    }

    if (!formData.address || formData.address.trim().length < 5) {
      setErrorMessage('Please enter your complete delivery address (at least 5 characters).');
      setPaymentError(true);
      return;
    }

    if (!formData.city || formData.city.trim().length === 0) {
      setErrorMessage('Please enter your city.');
      setPaymentError(true);
      return;
    }

    const cleanPincode = String(formData.pincode || '').replace(/\D/g, '');
    if (!cleanPincode || !PINCODE_RE.test(cleanPincode)) {
      setErrorMessage('Please enter a valid 6-digit PIN code.');
      setPaymentError(true);
      return;
    }

    const customerData = {
      ...formData,
      name: formData.name.trim().slice(0, 100),
      email: formData.email.trim().toLowerCase().slice(0, 254),
      phone: cleanPhone,
      address: formData.address.trim().slice(0, 250),
      city: formData.city.trim().slice(0, 100),
      pincode: cleanPincode,
    };

    isSubmittingRef.current = true;
    setIsProcessing(true);

    try {
      // 1. Generate receipt ID
      const receipt = `SHR${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. COD (Cash on Delivery) Order Path
      if (paymentMethod === 'cod') {
        const verified = await verifyPayment({
          razorpay_order_id:   `order_COD_${Date.now()}`,
          razorpay_payment_id: `pay_COD_${Date.now()}`,
          razorpay_signature:  'cod_signature',
          cart: cartItems,
          customer: customerData,
          payment_method: 'cod',
          couponCode: appliedPromo?.code || null,
        });
        setOrderId(verified.internal_order_id || receipt);
        setOrderComplete(true);
        setIsProcessing(false);
        isSubmittingRef.current = false;
        onClearCart();
        return;
      }

      // 3. Online Payment (Razorpay) Path
      const { order, key_id, _mock } = await createRazorpayOrder({
        amount: Number(grandTotal),   // in ₹ — server converts to paise
        receipt,
        couponCode: appliedPromo?.code || null,
        cart: cartItems,
        customer: customerData,
        notes: {
          promo_code: appliedPromo?.code || 'NONE',
          discount_amount: discount
        }
      });

      // 2a. Mock mode — skip modal, go straight to verify
      if (_mock) {
        const verified = await verifyPayment({
          razorpay_order_id:   order.id,
          razorpay_payment_id: `pay_MOCK${Date.now()}`,
          razorpay_signature:  'mock_signature',
          cart: cartItems,
          customer: customerData,
          couponCode: appliedPromo?.code || null,
        });
        setOrderId(verified.internal_order_id || receipt);
        setOrderComplete(true);
        setIsProcessing(false);
        isSubmittingRef.current = false;
        onClearCart();
        return;
      }

      // 2b. Live mode — open Razorpay modal
      const options = {
        key:         key_id,
        amount:      order.amount,
        currency:    order.currency,
        name:        'Shraviko',
        description: 'Sacred & Artisan Products',
        order_id:    order.id,
        prefill: {
          name:    customerData.name,
          email:   customerData.email,
          contact: customerData.phone,
        },
        theme:   { color: '#C5A059' },
        modal:   { ondismiss: () => { setIsProcessing(false); isSubmittingRef.current = false; } },
        handler: async (response) => {
          try {
            // 3. Verify payment signature on server
            const verified = await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              cart: cartItems,
              customer: customerData,
              couponCode: appliedPromo?.code || null,
            });
            setOrderId(verified.internal_order_id || receipt);
            setOrderComplete(true);
            setIsProcessing(false);
            isSubmittingRef.current = false;
            onClearCart();
          } catch (vErr) {
            setErrorMessage(vErr.message || 'Signature verification failed.');
            setPaymentError(true);
            setIsProcessing(false);
            isSubmittingRef.current = false;
          }
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout script not loaded yet. Please wait a moment or refresh.');
      }
      new window.Razorpay(options).open();

    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Server connection lost. Please verify the server is running and try again.');
      setPaymentError(true);
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResetCheckout = () => {
    setOrderComplete(false);
    setPaymentError(false);
    setIsProcessing(false);
    isSubmittingRef.current = false;
    onClose();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!orderComplete && !isProcessing) onClose();
        }}
        className="fixed inset-0 bg-[#171312]/80 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="relative bg-[#FBF9F5] rounded-2xl max-w-xl w-full border border-[#C5A059]/40 shadow-2xl overflow-hidden z-10 animate-slide-up my-auto max-h-[90dvh] sm:max-h-[92vh] flex flex-col">

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
                  {errorMessage || 'Your order details are still saved. Please try again or switch your payment method.'}
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
          ) : isProcessing ? (
            /* 8. MOBILE OPTIMIZED PROCESSING SCREEN */
            <div className="text-center py-10 px-4 space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#E5C378]/30 border-t-[#B8860B] animate-spin" />
                <ShieldCheck className="w-7 h-7 text-[#B8860B] absolute inset-0 m-auto" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-cinzel tracking-[0.25em] text-[#8C6929] uppercase font-bold block">
                  Securing Transaction
                </span>
                <h3 className="text-lg sm:text-xl font-cinzel font-bold text-[#2C2623]">
                  {paymentMethod === 'cod' ? 'Confirming Your Order...' : 'Processing Payment...'}
                </h3>
                <p className="text-xs text-gray-600 font-sans max-w-xs mx-auto leading-relaxed">
                  {paymentMethod === 'cod'
                    ? 'Placing your Cash on Delivery order with express delivery.'
                    : 'Please complete the payment in the secure window. Do not refresh or close this window.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-sans pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>🔒 256-Bit Encrypted Secure Channel</span>
              </div>
            </div>
          ) : (
            /* MAIN CHECKOUT & PAYMENT FORM */
            <form onSubmit={handleExecutePayment} className="space-y-5 sm:space-y-6">

              {/* Customer Address Details (compact) */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#8C6929] font-bold border-b border-[#EAE0CD] pb-2">
                  Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-xs font-sans">
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      maxLength={100}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-xl sm:rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      maxLength={15}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-Digit Phone Number *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-xl sm:rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      value={formData.email}
                      maxLength={254}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-xl sm:rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.address}
                      maxLength={250}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat / House No. / Building / Street Address *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-xl sm:rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.city}
                      maxLength={100}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.pincode}
                      maxLength={6}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Pincode *"
                      required
                      className="w-full p-3 sm:p-2.5 bg-white border border-[#EAE0CD] rounded-lg focus:border-[#C5A059] focus:outline-none min-h-[46px] sm:min-h-[42px] text-sm sm:text-xs"
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

                {/* Prepaid Incentive Banner */}
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-base">💸</span>
                  <span className="text-[11px] font-cinzel font-bold text-emerald-800 uppercase tracking-wide">
                    Save ₹{PREPAID_INCENTIVE} — Pay Online Instead of COD
                  </span>
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
                            <div className="flex items-center gap-2 flex-wrap">
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
                              {opt.prepaidSave && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider ${
                                  isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  SAVE ₹{PREPAID_INCENTIVE}
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
                  <div className="flex justify-between text-emerald-700 font-sans font-medium">
                    <span>Discount ({appliedPromo?.code || 'WELCOME10'})</span>
                    <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {prepaidSaving > 0 && (
                  <div className="flex justify-between text-emerald-700 font-sans font-medium">
                    <span>Prepaid Saving 💸</span>
                    <span className="font-bold">-₹{prepaidSaving}</span>
                  </div>
                )}
                <div className="border-t border-[#F0E8DC] pt-2 mt-2 flex justify-between items-center font-cinzel font-bold text-sm text-[#2C2623]">
                  <span>Total Payable</span>
                  <span className="text-base text-[#B8860B]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 3. PAYMENT BUTTON & 10. TRUST */}
              <div className="space-y-3 pt-1">
                {/* Razorpay Secure Badge */}
                <div className="flex justify-center">
                  <PaymentLogos dark={false} className="w-full sm:w-auto" />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full min-h-[52px] py-3.5 bg-[#B8860B] hover:bg-[#9B7E52] text-white font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{paymentMethod === 'cod' ? 'PLACING COD ORDER...' : 'PROCESSING PAYMENT...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{paymentMethod === 'cod' ? `CONFIRM COD ORDER — ₹${grandTotal.toLocaleString('en-IN')}` : `PAY ₹${grandTotal.toLocaleString('en-IN')}`}</span>
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
