import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { trackOrder as apiTrackOrder } from '../services/api';

export function QuickTrackSection({ onGoSupport }) {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() && !orderId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const data = await apiTrackOrder(phone.trim(), orderId.trim());
      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        setErrorMsg('No order found matching these details. Please check your registered mobile number.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to fetch tracking data right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] relative overflow-hidden border-t border-b border-[#E8DFC7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE0] border border-[#DAB97B] text-[#5C420D] text-xs font-cinzel tracking-widest uppercase font-bold mb-4 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#5C420D]" />
            <span>Shiprocket Live Tracking</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#1C140F] tracking-tight mb-3">
            Track Your Sacred Order
          </h2>
          <p className="text-xs sm:text-sm text-[#3D2E24] font-semibold max-w-lg mx-auto leading-relaxed">
            Enter your registered 10-digit mobile number to fetch real-time dispatch, AWB, and courier delivery updates.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#C5A059]/40 relative">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-cinzel uppercase tracking-wider text-[#1C140F] font-bold mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit registered number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#B89B67] focus:outline-none focus:ring-2 focus:ring-[#8C6D27] text-sm text-[#1C140F] font-bold placeholder-[#7D6E63] bg-[#FAF7F2] focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase tracking-wider text-[#1C140F] font-bold mb-1.5">
                  Order ID <span className="text-gray-500 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHR278696"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#B89B67] focus:outline-none focus:ring-2 focus:ring-[#8C6D27] text-sm text-[#1C140F] font-bold placeholder-[#7D6E63] bg-[#FAF7F2] focus:bg-white transition-all shadow-xs"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#3D2B1F] hover:bg-[#2C1F06] text-[#E5C378] font-cinzel font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#E5C378] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Package Now</span>
                </>
              )}
            </button>
          </form>

          {/* Quick hint */}
          <div className="mt-4 pt-4 border-t border-[#F0E8D8] flex items-center justify-between text-xs text-[#7A6859]">
            <span>Need help with returns or refunds?</span>
            <button
              onClick={onGoSupport}
              className="text-[#B8860B] hover:underline font-semibold font-cinzel uppercase tracking-wider text-[11px] inline-flex items-center gap-1"
            >
              <span>My Orders &amp; Returns Portal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Order Result Display */}
          {orderData && (
            <div className="mt-6 pt-6 border-t border-[#E8DFC7] space-y-5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#F8F5EF] border border-[#DAB97B]/40">
                <div>
                  <span className="text-[10px] uppercase font-cinzel text-gray-500 tracking-wider">Order Status</span>
                  <div className="font-cinzel font-bold text-[#2C1F06] text-base capitalize mt-0.5">
                    {orderData.status}
                  </div>
                </div>

                {orderData.courier && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-cinzel text-gray-500 tracking-wider">Courier Partner</span>
                    <div className="font-semibold text-xs text-[#3D2B1F] mt-0.5">
                      {orderData.courier} {orderData.awb ? `(AWB: ${orderData.awb})` : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Steps */}
              {orderData.timeline && orderData.timeline.length > 0 && (
                <div className="space-y-3 pl-2">
                  {orderData.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        step.done ? 'bg-[#B8860B] text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${step.done ? 'text-[#2C1F06]' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.date && <p className="text-[11px] text-gray-500">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
