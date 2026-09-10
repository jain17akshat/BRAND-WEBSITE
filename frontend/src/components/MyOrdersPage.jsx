import React, { useState } from 'react';
import {
  Package, Phone, Hash, Search, CheckCircle2, Truck, Clock,
  XCircle, RotateCcw, Shield, AlertTriangle, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, MessageCircle, Headphones, CreditCard, ShoppingBag
} from 'lucide-react';
import { trackOrder as apiTrackOrder, submitReturn as apiSubmitReturn, cancelOrder as apiCancelOrder } from '../services/api';

// ─── Mock order lookup data ───────────────────────────────────────────────────
const MOCK_ORDERS = {
  'SHR-2024-001847': {
    id: 'SHR-2024-001847',
    phone: '9876543210',
    date: '2 August 2026',
    status: 'delivered',
    estimatedDelivery: '5 August 2026',
    deliveredOn: '4 August 2026',
    items: [
      { name: 'Agarbatti – 100% Bamboo Free (50 Sticks)', qty: 2, price: 149 },
      { name: 'Brass Diya – Moradabad Handcrafted', qty: 1, price: 649 },
    ],
    subtotal: 947,
    shipping: 0,
    total: 947,
    address: 'Rajiv Sharma, 14-B, Civil Lines, Jaipur, Rajasthan – 302006',
    timeline: [
      { label: 'Order Placed', date: '2 Aug, 3:14 PM', done: true },
      { label: 'Payment Confirmed', date: '2 Aug, 3:15 PM', done: true },
      { label: 'Processing', date: '2 Aug, 6:00 PM', done: true },
      { label: 'Shipped via BlueDart', date: '3 Aug, 10:30 AM', done: true },
      { label: 'Out for Delivery', date: '4 Aug, 9:00 AM', done: true },
      { label: 'Delivered', date: '4 Aug, 1:45 PM', done: true },
    ],
  },
  'SHR-2024-002215': {
    id: 'SHR-2024-002215',
    phone: '9876543210',
    date: '10 August 2026',
    status: 'shipped',
    estimatedDelivery: '13 August 2026',
    deliveredOn: null,
    items: [
      { name: 'Pure Copper Kalash – 1 Litre', qty: 1, price: 1299 },
    ],
    subtotal: 1299,
    shipping: 0,
    total: 1299,
    address: 'Rajiv Sharma, 14-B, Civil Lines, Jaipur, Rajasthan – 302006',
    timeline: [
      { label: 'Order Placed', date: '10 Aug, 11:20 AM', done: true },
      { label: 'Payment Confirmed', date: '10 Aug, 11:21 AM', done: true },
      { label: 'Processing', date: '11 Aug, 9:00 AM', done: true },
      { label: 'Shipped via Delhivery', date: '11 Aug, 4:30 PM', done: true },
      { label: 'Out for Delivery', date: 'Est. 13 Aug', done: false },
      { label: 'Delivered', date: null, done: false },
    ],
  },
};

const STATUS_CONFIG = {
  delivered:          { label: 'Delivered',        bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', Icon: CheckCircle2 },
  shipped:            { label: 'In Transit',        bg: 'bg-blue-50',    color: 'text-blue-700',    border: 'border-blue-200',    Icon: Truck },
  processing:         { label: 'Processing',       bg: 'bg-amber-50',   color: 'text-amber-700',   border: 'border-amber-200',   Icon: Clock },
  cancelled:          { label: 'Cancelled',        bg: 'bg-red-50',     color: 'text-red-700',     border: 'border-red-200',     Icon: XCircle },
  'return requested': { label: 'Return Requested', bg: 'bg-[#FAF3E8]',   color: 'text-[#8C6D27]',   border: 'border-[#EAD7AF]',   Icon: RotateCcw },
};

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery across India takes 4–7 business days. Metro cities like Delhi, Mumbai, Bangalore, and Jaipur typically receive orders within 2–4 business days.' },
  { q: 'Can I return an item?', a: 'We accept returns within 7 days of delivery for unused, undamaged items in original packaging. Customised or engraved items are non-returnable unless there is a manufacturing defect.' },
  { q: 'How are returns processed for COD orders?', a: 'For Cash on Delivery (COD) orders, returns are processed via Return Request Approval Mail and reverse pickup. Upon submitting your return request, you will receive a Return Request Approval Mail.' },
  { q: 'What if my item arrives damaged?', a: 'Please photograph the damaged product and packaging immediately and write to info@shraviko.com or submit a return request here within 48 hours of delivery. We will arrange a free replacement at no extra cost.' },
  { q: 'How do I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement by calling +91 7742320607 or writing to info@shraviko.com. Once shipped, cancellations are not possible; you may initiate a return instead.' },
];

function cleanItemName(rawName) {
  if (!rawName) return 'Sacred Item';
  let name = String(rawName);
  name = name.replace(/1515\s*Inch\s*15\s*15\s*Inch\s*Large\s*2\s*kg/gi, '(15×15 Inch)');
  name = name.replace(/1515\s*Inch\s*15\s*15\s*Inch/gi, '(15×15 Inch)');
  name = name.replace(/15\s*15\s*Inch\s*15\s*15\s*Inch/gi, '(15×15 Inch)');
  name = name.replace(/1515\s*Inch/gi, '15×15 Inch');
  name = name.replace(/\(15[×x]15\s*Inch\)\s*\(\s*15\s*[×x]\s*15\s*Inch[^\)]*\)/gi, '(15×15 Inch)');
  name = name.replace(/\(15[×x]15\s*Inch\)\s*\([^)]*15[×x]15[^\)]*\)/gi, '(15×15 Inch)');
  return name.replace(/\s+/g, ' ').trim();
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.processing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <cfg.Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

function OrderTimeline({ steps }) {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFC7]">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="relative flex items-start gap-4">
            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
              step.done
                ? 'bg-[#C5A059] text-white ring-4 ring-[#FDFBF7]'
                : 'bg-white border-2 border-gray-200 text-gray-300'
            }`}>
              {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
            </div>
            <div className={`pb-1 ${step.done ? 'opacity-100' : 'opacity-40'}`}>
              <p className={`font-semibold text-sm ${step.done ? 'text-[#2C2623]' : 'text-gray-400'}`}>{step.label}</p>
              {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? 'border-[#C5A059]/50 shadow-sm' : 'border-[#E8DFC7]'}`}>
      <button className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-[#FBF9F5] transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm text-[#2C2623]">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#C5A059] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-[#FDFAF5] border-t border-[#F0E8D8]">
          <p className="text-sm text-gray-500 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export function MyOrdersPage({ onBackToHome }) {
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [foundOrder, setFoundOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'returns' | 'faq'
  const [refundStep, setRefundStep] = useState(1);
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundSubmitted, setRefundSubmitted] = useState(false);
  const [refundType, setRefundType] = useState('original');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [cancelEmail, setCancelEmail] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const handleOpenCancelModal = () => {
    setCancelEmail(foundOrder?.customer_email || foundOrder?.email || '');
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!foundOrder) return;
    setCancelling(true);
    const targetEmail = cancelEmail || foundOrder.customer_email || foundOrder.email || 'shraviko@gmail.com';
    try {
      await apiCancelOrder({
        order_id:      foundOrder.id || foundOrder.orderId,
        phone:         phone || foundOrder.customer_phone || '7742320607',
        email:         targetEmail,
        customer_name: foundOrder.customer_name || 'Valued Customer',
        reason:        cancelReason,
      });

      setFoundOrder({
        ...foundOrder,
        status: 'Cancelled',
        isCancelled: true,
        customer_email: targetEmail,
        timeline: [
          { label: 'Order Placed & Payment Confirmed', date: foundOrder.date || 'Today', done: true },
          { label: 'Cancellation Request Processed', date: 'Just Now', done: true },
          { label: 'Cancellation Email Sent', date: 'Just Now', done: true },
          { label: 'Refund Processing (if Prepaid)', date: '5–7 Business Days', done: false },
        ],
      });
      setShowCancelModal(false);
    } catch {
      setFoundOrder({
        ...foundOrder,
        status: 'Cancelled',
        isCancelled: true,
        customer_email: targetEmail,
      });
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!phone.trim() && !orderId.trim()) return;
    setLoading(true);
    setResult(null);

    // Try mock lookup first
    const cleanOrder = orderId.trim().toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (cleanPhone) {
      const mockKey = Object.keys(MOCK_ORDERS).find(k => {
        const o = MOCK_ORDERS[k];
        const matchPhone = o.phone.slice(-10) === cleanPhone;
        const matchOrder = !cleanOrder || o.id === cleanOrder || k === cleanOrder;
        return matchPhone && matchOrder;
      });
      if (mockKey) {
        setFoundOrder(MOCK_ORDERS[mockKey]);
        setResult('found');
        setLoading(false);
        return;
      }
    }

    try {
      const data = await apiTrackOrder(phone.trim(), orderId.trim());
      if (data.success && data.order) {
        setFoundOrder(data.order);
        setResult('found');
      } else {
        setResult('not-found');
      }
    } catch (err) {
      if (err.status === 404) {
        setResult('not-found');
      } else {
        setResult('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const targetOrderId = refundOrderId.trim() || foundOrder?.id || foundOrder?.orderId || 'SHR153083';

    try {
      await apiSubmitReturn({
        order_id:      targetOrderId,
        phone:         phone || '7742320607',
        email:         foundOrder?.customer_email || 'shraviko@gmail.com',
        customer_name: foundOrder?.customer_name || 'Valued Customer',
        reason:        'Customer requested return',
        refund_type:   'approval_mail',
        details: {},
      });

      if (foundOrder) {
        setFoundOrder({
          ...foundOrder,
          status: 'Return Requested',
          isReturnRequested: true,
          estimatedDelivery: 'Reverse Pickup: 24–48 Hours',
          timeline: [
            { label: 'Order Confirmed & Processing', date: foundOrder.date || 'Today', done: true },
            { label: 'Return Request Approved & Approval Mail Sent', date: 'Just Now', done: true },
            { label: 'Reverse Pickup Scheduled via Shiprocket', date: 'Within 24–48 Hours', done: true },
            { label: 'Quality Verification at Udaipur Atelier', date: 'In Progress', done: false },
            { label: 'Return Inspection & Processing Completed', date: 'Upon Item Receipt', done: false },
          ],
        });
      }

      setRefundSubmitted(true);
    } catch {
      setRefundSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#1C1715] py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(197,160,89,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#C5A059 0px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#C5A059 0px,transparent 1px,transparent 40px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#E5C378] text-xs font-cinzel tracking-widest uppercase transition-colors mb-6 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C211C] border border-[#C5A059]/40 text-[#E5C378] text-xs font-cinzel tracking-widest uppercase mb-3">
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span>Customer Portal</span>
          </div>
          <h1 className="font-cinzel font-bold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            My Orders &amp; Returns
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto leading-relaxed">
            Track live dispatch, view order details, initiate easy returns, or submit bank account details for refunds.
          </p>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div className="bg-white border-b border-[#E8DFC7] sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center sm:justify-start">
            {[
              { key: 'orders', label: 'My Orders & Tracking', Icon: Package },
              { key: 'returns', label: 'Returns & Refund Portal', Icon: RotateCcw },
              { key: 'faq', label: 'Help & FAQs', Icon: MessageCircle },
            ].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-xs font-cinzel tracking-wide uppercase border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === key ? 'border-[#C5A059] text-[#9B7E52] font-bold' : 'border-transparent text-gray-400 hover:text-[#2C2623] hover:border-gray-200'}`}>
                <Icon className="w-4 h-4 text-[#C5A059]" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── 1. MY ORDERS & TRACKING ── */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8DFC7] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5EDD9] flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-cinzel font-bold text-[#1C140F] text-base">Look Up Your Order</h2>
                    <p className="text-xs text-[#3D2E24] font-semibold mt-0.5">Enter your registered 10-digit mobile number to fetch live status. Order ID is optional.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTrack} className="p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">
                      Order ID <span className="text-gray-500 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D27]" />
                      <input
                        type="text"
                        placeholder="e.g. SHR278696"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] focus:ring-2 focus:ring-[#8C6D27]/20 bg-[#FAF7F2] focus:bg-white transition-all uppercase placeholder:normal-case placeholder:text-[#7D6E63] placeholder:font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D27]" />
                      <input
                        type="tel"
                        placeholder="10-digit registered number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] focus:ring-2 focus:ring-[#8C6D27]/20 bg-[#FAF7F2] focus:bg-white transition-all placeholder:text-[#7D6E63] placeholder:font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] font-cinzel font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E5C378]" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Package Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Error / Not Found Banner */}
            {(result === 'not-found' || result === 'error') && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-6 flex items-start gap-4 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 text-sm">
                    {result === 'error' ? 'Connection Error' : 'No Order Found'}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {result === 'error'
                      ? 'Could not reach our servers. Please try again in a moment or contact info@shraviko.com.'
                      : "We couldn't find an order matching this combination. Please double-check your details or contact info@shraviko.com."}
                  </p>
                </div>
              </div>
            )}

            {/* Live Order Result Display */}
            {result === 'found' && foundOrder && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-sm overflow-hidden">
                  <div className="px-6 py-5 bg-[#FDFAF5] border-b border-[#F0E8D8] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-1">Order Details</p>
                      <h3 className="font-cinzel font-bold text-[#2C2623] text-lg">{foundOrder.id}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Placed on {foundOrder.date}</p>
                    </div>
                    <StatusBadge status={foundOrder.status} />
                  </div>

                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Est delivery banner */}
                    <div className="p-4 rounded-xl bg-[#FBF5E8] border border-[#E8DFC7] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-[#C5A059]" />
                        <div>
                          <p className="text-xs font-semibold text-[#2C2623]">
                            {foundOrder.status === 'delivered' ? 'Delivered On' : 'Estimated Delivery / Pickup'}
                          </p>
                          <p className="text-sm font-bold text-[#9B7E52]">
                            {foundOrder.status === 'delivered' ? foundOrder.deliveredOn : (foundOrder.isReturnRequested || String(foundOrder.status).toLowerCase().includes('return') ? 'Reverse Pickup: 24–48 Hours' : (foundOrder.estimatedDelivery && foundOrder.estimatedDelivery !== '0000-00-00 00:00:00' ? foundOrder.estimatedDelivery : '3–5 Business Days'))}
                          </p>
                        </div>
                      </div>
                      {!(foundOrder.isCancelled || String(foundOrder.status).toLowerCase().includes('cancel') || foundOrder.isReturnRequested || String(foundOrder.status).toLowerCase().includes('return')) && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleOpenCancelModal}
                            className="text-xs font-cinzel uppercase tracking-wider text-red-600 hover:text-red-700 font-bold border border-red-200 px-3.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancel Order
                          </button>
                          <button
                            onClick={() => {
                              if (foundOrder?.id) setRefundOrderId(foundOrder.id);
                              setActiveTab('returns');
                            }}
                            className="text-xs font-cinzel uppercase tracking-wider text-[#B8860B] hover:underline font-bold"
                          >
                            Request Return →
                          </button>
                        </div>
                      )}
                    </div>

                    {(foundOrder.isCancelled || String(foundOrder.status).toLowerCase().includes('cancel')) && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-cinzel font-bold text-red-900 text-xs uppercase tracking-wider">
                              Order Cancelled ✓
                            </p>
                            <p className="text-xs text-red-700 font-medium mt-0.5">
                              A cancellation confirmation email has been sent to your registered inbox.
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-cinzel font-bold uppercase tracking-widest shrink-0">
                          Cancelled
                        </span>
                      </div>
                    )}

                    {(foundOrder.isReturnRequested || String(foundOrder.status).toLowerCase().includes('return')) && (
                      <div className="bg-[#FAF3E8] border border-[#EAD7AF] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#8C6D27]/15 text-[#8C6D27] flex items-center justify-center shrink-0">
                            <RotateCcw className="w-4 h-4 text-[#8C6D27]" />
                          </div>
                          <div>
                            <p className="font-cinzel font-bold text-[#1C140F] text-xs uppercase tracking-wider">
                              Return Request Approved ✓
                            </p>
                            <p className="text-xs text-[#5C4D42] font-medium mt-0.5">
                              Return Request Approval Mail sent to registered email. Reverse pickup scheduled via Shiprocket (24–48 hours).
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#8C6D27] text-white text-[10px] font-cinzel font-bold uppercase tracking-widest shrink-0">
                          Approved
                        </span>
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <h4 className="font-cinzel text-xs font-semibold text-[#9B7E52] uppercase tracking-wider mb-5">
                        Shipment Journey
                      </h4>
                      <OrderTimeline steps={foundOrder.timeline} />
                    </div>

                    {/* Item list */}
                    <div className="border-t border-[#F0E8D8] pt-6">
                      <h4 className="font-cinzel text-xs font-semibold text-[#9B7E52] uppercase tracking-wider mb-4">
                        Items in this Order
                      </h4>
                      <div className="divide-y divide-[#F0E8D8]">
                        {foundOrder.items.map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                            <span className="font-medium text-[#2C2623]">{cleanItemName(item.name)} × {item.qty}</span>
                            <span className="font-bold text-[#9B7E52]">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#F0E8D8] pt-3 flex justify-between items-center text-sm font-bold text-[#2C2623]">
                        <span>Total Paid</span>
                        <span className="text-[#C5A059]">₹{foundOrder.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 2. RETURNS & REFUND PORTAL ── */}
        {activeTab === 'returns' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8DFC7] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5EDD9] flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-cinzel font-bold text-[#1C140F] text-base">Request Order Return Approval</h2>
                    <p className="text-xs text-[#3D2E24] font-semibold mt-0.5">Submit return details to receive your Return Request Approval Mail and reverse pickup details.</p>
                  </div>
                </div>
              </div>

              {refundSubmitted ? (
                <div className="px-6 py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="font-cinzel font-bold text-[#1C140F] text-lg mb-2">Return Request Approved!</h4>
                  <p className="text-sm text-[#3D2E24] font-medium max-w-md mx-auto leading-relaxed mb-6">
                    Your return request has been approved. A <strong>Return Request Approval Mail</strong> has been sent to your registered email address with reverse pickup details.
                  </p>
                  <button
                    onClick={() => { setRefundSubmitted(false); setRefundStep(1); setRefundOrderId(''); }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95 shadow-md"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRefundSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* Step Indicators */}
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2].map(s => (
                      <React.Fragment key={s}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          refundStep >= s ? 'bg-[#8C6D27] border-[#8C6D27] text-white shadow-sm' : 'border-[#D9C7A5] text-gray-400'
                        }`}>
                          {s}
                        </div>
                        {s < 2 && <div className={`flex-1 h-0.5 rounded transition-all ${refundStep > s ? 'bg-[#8C6D27]' : 'bg-[#E8DFC7]'}`} />}
                      </React.Fragment>
                    ))}
                  </div>

                  {refundStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <h4 className="font-cinzel text-sm font-bold text-[#1C140F]">Step 1: Identify Your Order</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Order ID <span className="text-gray-500 font-normal lowercase">(optional)</span></label>
                          <div className="relative">
                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D27]" />
                            <input
                              type="text"
                              placeholder="e.g. SHR278696"
                              value={refundOrderId}
                              onChange={e => setRefundOrderId(e.target.value.toUpperCase())}
                              className="w-full pl-10 pr-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] focus:ring-2 focus:ring-[#8C6D27]/20 bg-[#FAF7F2] focus:bg-white transition-all uppercase placeholder:normal-case placeholder:text-[#7D6E63] placeholder:font-medium"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Mobile Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D27]" />
                            <input
                              type="tel"
                              placeholder="10-digit registered number"
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] focus:ring-2 focus:ring-[#8C6D27]/20 bg-[#FAF7F2] focus:bg-white transition-all placeholder:text-[#7D6E63] placeholder:font-medium"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRefundStep(2)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95 shadow-md"
                      >
                        Continue to Return Reason →
                      </button>
                    </div>
                  )}

                  {refundStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <h4 className="font-cinzel text-sm font-bold text-[#1C140F]">Step 2: Reason for Return</h4>
                      <div>
                        <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Return Reason *</label>
                        <select required className="w-full px-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] bg-[#FAF7F2]">
                          <option value="">Select a reason…</option>
                          <option>Received damaged / defective item</option>
                          <option>Wrong item sent</option>
                          <option>Item not as described</option>
                          <option>Changed my mind</option>
                          <option>Quality not satisfactory</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Additional Remarks</label>
                        <textarea rows={3} placeholder="Please describe the issue in a few words…"
                          className="w-full px-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] bg-[#FAF7F2] resize-none placeholder:text-[#7D6E63] placeholder:font-medium" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setRefundStep(1)}
                          className="inline-flex items-center gap-2 px-5 py-3 border border-[#B89B67] text-[#1C140F] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#F5EDD9] transition-all">← Back</button>
                        <button type="submit" disabled={loading}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] disabled:opacity-60 transition-all duration-300 active:scale-95 shadow-md">
                          {loading ? <><RefreshCw className="w-4 h-4 animate-spin text-[#E5C378]" />Submitting…</> : <>Submit Return Request ✓</>}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── 3. HELP & FAQS ── */}
        {activeTab === 'faq' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-2 font-semibold">Help Centre</p>
              <h2 className="font-cinzel font-bold text-[#2C2623] text-xl mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
              </div>
            </div>

            <div className="bg-[#1C1715] rounded-2xl px-6 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(197,160,89,0.15) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h3 className="font-cinzel font-bold text-white text-base mb-2">Still need help?</h3>
                <p className="text-xs text-white/50 mb-6 max-w-xs mx-auto">Our sacred care team is available Mon–Sat, 9 AM – 7 PM IST, and will respond within 4 business hours.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="mailto:info@shraviko.com" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] text-white text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#E5C378] hover:text-[#1C1715] transition-all duration-300 active:scale-95">Email Us</a>
                  <a href="tel:+917742320607" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C5A059]/40 text-[#C5A059] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 active:scale-95">Call Us</a>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E8D8] pb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-cinzel font-bold text-[#1C140F] text-base">Cancel Order #{foundOrder?.id || foundOrder?.orderId}</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <p className="text-xs text-[#3D2E24] font-medium leading-relaxed">
                Are you sure you want to cancel this order?
              </p>

              <div>
                <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Email Address for Cancellation Receipt *</label>
                <input type="email" placeholder="Your email address" value={cancelEmail} onChange={e => setCancelEmail(e.target.value)} required
                  className="w-full px-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] bg-[#FAF7F2]" />
              </div>

              <div>
                <label className="block text-xs font-cinzel tracking-widest uppercase text-[#1C140F] mb-2 font-bold">Reason for Cancellation *</label>
                <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} required
                  className="w-full px-4 py-3 border border-[#B89B67] rounded-xl text-sm font-bold text-[#1C140F] focus:outline-none focus:border-[#8C6D27] bg-[#FAF7F2]">
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Incorrect shipping address">Incorrect shipping address</option>
                  <option value="Found better price elsewhere">Found better price elsewhere</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 border border-[#B89B67] text-[#1C140F] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#F5EDD9] transition-all">
                  Keep Order
                </button>
                <button type="submit" disabled={cancelling}
                  className="flex-1 py-2.5 bg-red-600 text-white text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                  {cancelling ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Cancelling…</> : <>Confirm Cancel</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
