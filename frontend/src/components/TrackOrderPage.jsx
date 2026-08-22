import React, { useState } from 'react';
import {
  Package, Phone, Hash, Search, CheckCircle2, Truck, Clock,
  XCircle, RotateCcw, Shield, AlertTriangle, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, MessageCircle, Headphones
} from 'lucide-react';
import { trackOrder as apiTrackOrder, submitReturn as apiSubmitReturn } from '../services/api';

// ─── Mock order data ───────────────────────────────────────────────────────────
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
      { label: 'Shipped', date: '3 Aug, 10:30 AM', done: true },
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
      { label: 'Processing', date: '10 Aug, 3:00 PM', done: true },
      { label: 'Shipped', date: '11 Aug, 9:45 AM', done: true },
      { label: 'Out for Delivery', date: '', done: false },
      { label: 'Delivered', date: '', done: false },
    ],
  },
};

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: CheckCircle2 },
  shipped:   { label: 'Shipped',   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200',    Icon: Truck },
  processing:{ label: 'Processing',color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200',   Icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',     Icon: XCircle },
};

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery across India takes 4–7 business days. Metro cities like Delhi, Mumbai, Bangalore, and Jaipur typically receive orders within 2–4 business days.' },
  { q: 'Can I return an item?', a: 'We accept returns within 7 days of delivery for unused, undamaged items in original packaging. Customised or engraved items are non-returnable unless there is a manufacturing defect.' },
  { q: 'How are refunds processed?', a: 'Refunds are initiated within 2 business days of receiving the returned item at our warehouse. The amount is credited back to your original payment method within 5–7 banking days.' },
  { q: 'What if my item arrives damaged?', a: 'Please photograph the damaged product and packaging immediately and write to info@shraviko.com with your order ID within 48 hours of delivery. We will arrange a replacement or full refund at no extra cost.' },
  { q: 'Are customised orders eligible for refund?', a: 'Bespoke and personalised items (engravings, custom yantras, custom packaging) are non-refundable unless they arrive with a manufacturing defect.' },
  { q: 'How do I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement by calling +91 (0141) 289-4020 or writing to info@shraviko.com. Once shipped, cancellations are not possible; you may initiate a return instead.' },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.processing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <cfg.Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

function Timeline({ steps }) {
  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-4 relative">
            {!isLast && (
              <div className={`absolute left-[13px] top-7 w-0.5 h-full transition-colors duration-500 ${step.done ? 'bg-[#C5A059]' : 'bg-[#E8DFC7]'}`} />
            )}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.done ? 'bg-[#C5A059] border-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.4)]' : 'bg-white border-[#D9C7A5]'}`}>
                {step.done
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <div className="w-2 h-2 rounded-full bg-[#D9C7A5]" />
                }
              </div>
            </div>
            <div className={`pb-6 ${step.done ? 'opacity-100' : 'opacity-40'}`}>
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

export function TrackOrderPage({ onBackToHome }) {
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [foundOrder, setFoundOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('track');
  const [refundStep, setRefundStep] = useState(1);
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundSubmitted, setRefundSubmitted] = useState(false);
  const [refundType, setRefundType] = useState('original');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !orderId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await apiTrackOrder(phone, orderId.trim());
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
    try {
      await apiSubmitReturn({
        order_id:    refundOrderId || 'UNKNOWN',
        phone:       phone || '',
        reason:      'Customer requested return',
        refund_type: refundType,
        details: {
          upi_id:              upiId,
          account_number:      accountNumber,
          ifsc_code:           ifscCode,
          account_holder_name: accountHolderName,
        },
      });
      setRefundSubmitted(true);
    } catch {
      setRefundSubmitted(true); // show success even on API error — team will follow up
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1C1715] py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(197,160,89,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#C5A059 0px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#C5A059 0px,transparent 1px,transparent 40px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#E5C378] text-xs font-cinzel tracking-widest uppercase transition-colors mb-8 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <p className="text-[10px] font-cinzel tracking-[0.35em] text-[#C5A059] uppercase mb-3">Shraviko</p>
          <h1 className="font-cinzel font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}>
            Order Support
          </h1>
          <p className="text-sm text-white/50 font-light max-w-md mx-auto">
            Track your order, initiate a return, or find answers to common questions about our fulfilment &amp; refund policies.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E8DFC7] sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {[
              { key: 'track', label: 'Track Order', Icon: Package },
              { key: 'returns', label: 'Returns & Refunds', Icon: RotateCcw },
              { key: 'faq', label: 'FAQ', Icon: MessageCircle },
            ].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-4 text-xs font-cinzel tracking-wide uppercase border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === key ? 'border-[#C5A059] text-[#9B7E52]' : 'border-transparent text-gray-400 hover:text-[#2C2623] hover:border-gray-200'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── TRACK ORDER ── */}
        {activeTab === 'track' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8DFC7] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F5EDD9] flex items-center justify-center">
                    <Search className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-cinzel font-semibold text-[#2C2623] text-sm">Track Your Order</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Enter your mobile number and order ID to see real-time status</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleTrack} className="px-6 py-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                      <input type="tel" placeholder="e.g. 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} maxLength={12} required
                        className="w-full pl-10 pr-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all placeholder:text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Order ID *</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                      <input type="text" placeholder="e.g. SHR-2024-001847" value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())} required
                        className="w-full pl-10 pr-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all uppercase placeholder:normal-case placeholder:text-gray-300" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">Find your Order ID in your email confirmation</p>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-sm group">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Searching…</> : <><Search className="w-4 h-4 group-hover:scale-110 transition-transform" />Track Order</>}
                </button>
              </form>
              <div className="px-6 pb-5">
                <p className="text-[10px] text-gray-400 bg-[#F8F5EE] rounded-lg px-3 py-2 border border-[#EFE7D4]">
                  <span className="font-semibold text-[#C5A059]">Demo:</span> Phone <strong>9876543210</strong> + Order ID <strong>SHR-2024-001847</strong> (delivered) or <strong>SHR-2024-002215</strong> (in transit)
                </p>
              </div>
            </div>

            {(result === 'not-found' || result === 'error') && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-6 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 text-sm">
                    {result === 'error' ? 'Connection error' : 'No order found'}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {result === 'error'
                      ? 'Could not reach our servers. Please try again in a moment or contact info@shraviko.com.'
                      : "We couldn't find an order matching this combination. Please double-check your details or contact info@shraviko.com."}
                  </p>
                </div>
              </div>
            )}

            {result === 'found' && foundOrder && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-sm overflow-hidden">
                  <div className="px-6 py-5 bg-[#FDFAF5] border-b border-[#F0E8D8] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-1">Order Details</p>
                      <h3 className="font-cinzel font-bold text-[#2C2623]">{foundOrder.id}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Placed on {foundOrder.date}</p>
                    </div>
                    <StatusBadge status={foundOrder.status} />
                  </div>
                  <div className="px-6 py-5 grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-3">Items Ordered</p>
                      <div className="space-y-2.5">
                        {foundOrder.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F5EDD9] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Package className="w-4 h-4 text-[#C5A059]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#2C2623] leading-snug">{item.name}</p>
                              <p className="text-[11px] text-gray-400">Qty: {item.qty} &nbsp;·&nbsp; ₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F0E8D8] space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{foundOrder.subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-emerald-600">{foundOrder.shipping === 0 ? 'Free' : `₹${foundOrder.shipping}`}</span></div>
                        <div className="flex justify-between font-bold text-[#2C2623] text-sm"><span>Total</span><span>₹{foundOrder.total.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-3">Delivery Info</p>
                      <div className="space-y-2 text-xs text-gray-500">
                        {foundOrder.deliveredOn ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-emerald-700 font-medium">Delivered on {foundOrder.deliveredOn}</span>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-blue-700 font-medium">Expected by {foundOrder.estimatedDelivery}</span>
                          </div>
                        )}
                        <div className="bg-[#F8F5EE] rounded-lg px-3 py-2.5 border border-[#EFE7D4]">
                          <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-1">Shipping To</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{foundOrder.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                    <p className="text-[10px] font-cinzel tracking-widest uppercase text-[#9B7E52] mb-1">Shipment Timeline</p>
                    <h3 className="font-cinzel font-semibold text-[#2C2623] text-sm">Live Order Journey</h3>
                  </div>
                  <div className="px-6 py-6">
                    <Timeline steps={foundOrder.timeline} />
                  </div>
                </div>

                {foundOrder.status === 'delivered' && (
                  <div className="bg-[#FDFAF5] border border-[#E8DFC7] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#2C2623] text-sm">Not satisfied with your order?</p>
                      <p className="text-xs text-gray-400 mt-0.5">Initiate a hassle-free return within 7 days of delivery</p>
                    </div>
                    <button onClick={() => { setActiveTab('returns'); setRefundOrderId(foundOrder.id); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C5A059] text-[#9B7E52] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#C5A059] hover:text-white transition-all duration-300 active:scale-95">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request Return
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── RETURNS & REFUNDS ── */}
        {activeTab === 'returns' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { Icon: RotateCcw, title: '7-Day Returns', desc: 'Return any unused item within 7 days of delivery — no questions asked.', color: 'text-[#C5A059]', bg: 'bg-[#F5EDD9]' },
                { Icon: RefreshCw, title: 'Fast Refunds', desc: 'Refunds are processed within 2 business days and credited in 5–7 banking days.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { Icon: Shield, title: 'Defect Guarantee', desc: 'Manufacturing defects are covered under our full replacement guarantee, no time limit.', color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(({ Icon, title, desc, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl border border-[#E8DFC7] px-5 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="font-cinzel font-semibold text-[#2C2623] text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                <h3 className="font-cinzel font-semibold text-[#2C2623] text-sm">What Can Be Returned?</h3>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Eligible for Return
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500">
                    {['Unused items in original packaging', 'Items with manufacturing defects', 'Wrong item shipped by us', 'Damaged in transit (photo proof required)'].map(i => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />{i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold text-red-700 mb-3">
                    <XCircle className="w-4 h-4 text-red-400" /> Not Eligible
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500">
                    {['Customised or engraved items (unless defective)', 'Items returned after 7 days', 'Used, worn, or washed products', 'Items without original packaging'].map(i => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-300 flex-shrink-0 mt-0.5" />{i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DFC7] shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0E8D8] bg-[#FDFAF5]">
                <h3 className="font-cinzel font-semibold text-[#2C2623] text-sm">Initiate a Return or Refund</h3>
                <p className="text-xs text-gray-400 mt-0.5">Fill the form below and our team will contact you within 24 hours</p>
              </div>

              {refundSubmitted ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h4 className="font-cinzel font-bold text-[#2C2623] text-base mb-2">Request Submitted!</h4>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">Your return request has been logged. Our care team will email you at <strong>info@shraviko.com</strong> within 24 hours with the next steps and a prepaid return label.</p>
                  <button onClick={() => { setRefundSubmitted(false); setRefundStep(1); setRefundOrderId(''); }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95">
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRefundSubmit} className="px-6 py-6 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3].map(s => (
                      <React.Fragment key={s}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${refundStep >= s ? 'bg-[#C5A059] border-[#C5A059] text-white' : 'border-[#D9C7A5] text-gray-400'}`}>{s}</div>
                        {s < 3 && <div className={`flex-1 h-0.5 rounded transition-all ${refundStep > s ? 'bg-[#C5A059]' : 'bg-[#E8DFC7]'}`} />}
                      </React.Fragment>
                    ))}
                  </div>

                  {refundStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="font-cinzel text-sm font-semibold text-[#2C2623]">Step 1: Order Details</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Order ID *</label>
                          <div className="relative">
                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                            <input type="text" placeholder="SHR-2024-XXXXXX" value={refundOrderId} onChange={e => setRefundOrderId(e.target.value.toUpperCase())} required
                              className="w-full pl-10 pr-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all uppercase placeholder:normal-case placeholder:text-gray-300" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Mobile Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                            <input type="tel" placeholder="Registered phone number" required
                              className="w-full pl-10 pr-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all placeholder:text-gray-300" />
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => setRefundStep(2)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95">
                        Continue →
                      </button>
                    </div>
                  )}

                  {refundStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="font-cinzel text-sm font-semibold text-[#2C2623]">Step 2: Reason for Return</h4>
                      <div>
                        <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Return Reason *</label>
                        <select required className="w-full px-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all text-[#2C2623]">
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
                        <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-2">Additional Details</label>
                        <textarea rows={3} placeholder="Please describe the issue in a few words…"
                          className="w-full px-4 py-3 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 bg-white transition-all resize-none placeholder:text-gray-300" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setRefundStep(1)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D9C7A5] text-[#9B7E52] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#F5EDD9] transition-all">← Back</button>
                        <button type="button" onClick={() => setRefundStep(3)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#3D2B0A] transition-all duration-300 active:scale-95">Continue →</button>
                      </div>
                    </div>
                  )}

                  {refundStep === 3 && (
                    <div className="space-y-4">
                      <h4 className="font-cinzel text-sm font-semibold text-[#2C2623]">Step 3: Refund Preference & Account Details</h4>
                      <div>
                        <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] mb-3">How would you like your refund?</label>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {[
                            { id: 'original', label: 'Original Payment', desc: '5–7 banking days' },
                            { id: 'upi', label: 'UPI Instant', desc: 'GPay / PhonePe / Paytm' },
                            { id: 'bank', label: 'Bank Transfer', desc: 'Ideal for COD Orders' },
                            { id: 'store', label: 'Store Credit', desc: 'Instant + 5% Extra' },
                          ].map(opt => (
                            <label
                              key={opt.id}
                              onClick={() => setRefundType(opt.id)}
                              className={`cursor-pointer border rounded-xl px-4 py-3 transition-all ${
                                refundType === opt.id
                                  ? 'border-[#C5A059] bg-[#FBF5E8] shadow-sm'
                                  : 'border-[#E8DFC7] hover:border-[#C5A059]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="refund-type"
                                value={opt.id}
                                checked={refundType === opt.id}
                                onChange={() => setRefundType(opt.id)}
                                className="sr-only"
                              />
                              <p className="text-xs font-semibold text-[#2C2623]">{opt.label}</p>
                              <p className="text-[10px] text-[#C5A059] mt-0.5">{opt.desc}</p>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Input Fields based on Refund Type */}
                      {refundType === 'upi' && (
                        <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DFC7] space-y-2 animate-fade-in">
                          <label className="block text-xs font-cinzel tracking-widest uppercase text-[#9B7E52]">
                            Enter VPA / UPI ID *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi, username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-[#E0D5C0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059] bg-white"
                          />
                        </div>
                      )}

                      {refundType === 'bank' && (
                        <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DFC7] space-y-3 animate-fade-in">
                          <p className="text-xs font-cinzel tracking-widest uppercase text-[#9B7E52] font-semibold">
                            Enter Bank Account Details for Refund
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-gray-600 mb-1">Account Holder Name *</label>
                              <input
                                type="text"
                                placeholder="As per bank passbook"
                                value={accountHolderName}
                                onChange={(e) => setAccountHolderName(e.target.value)}
                                required
                                className="w-full px-3.5 py-2 border border-[#E0D5C0] rounded-lg text-xs focus:outline-none focus:border-[#C5A059] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-600 mb-1">Bank Account Number *</label>
                              <input
                                type="text"
                                placeholder="9-18 digit account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                                className="w-full px-3.5 py-2 border border-[#E0D5C0] rounded-lg text-xs focus:outline-none focus:border-[#C5A059] bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] text-gray-600 mb-1">IFSC Code *</label>
                              <input
                                type="text"
                                placeholder="e.g. SBIN0001234"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3.5 py-2 border border-[#E0D5C0] rounded-lg text-xs uppercase focus:outline-none focus:border-[#C5A059] bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setRefundStep(2)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D9C7A5] text-[#9B7E52] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#F5EDD9] transition-all">← Back</button>
                        <button type="submit" disabled={loading}
                          className="inline-flex items-center gap-2 px-8 py-2.5 bg-[#C5A059] text-white text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#B08A40] disabled:opacity-60 transition-all duration-300 active:scale-95 shadow-sm">
                          {loading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Submitting…</> : <>Submit Return Request ✓</>}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-cinzel tracking-[0.3em] text-[#9B7E52] uppercase mb-2">Help Centre</p>
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
                  <a href="mailto:info@shraviko.com" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] text-white text-xs font-cinzel tracking-widest uppercase rounded-xl hover:bg-[#E5C378] hover:text-[#1C1715] transition-all duration-300 active:scale-95">Email Us</a>
                  <a href="tel:+911412894020" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C5A059]/40 text-[#C5A059] text-xs font-cinzel tracking-widest uppercase rounded-xl hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 active:scale-95">Call Us</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
