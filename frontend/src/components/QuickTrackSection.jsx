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
    <section className="py-14 sm:py-20 bg-[#FAF7F2] relative overflow-hidden border-t border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBEAE5] border border-[#57324F]/15 text-[#57324F] text-xs font-manrope font-semibold tracking-wide mb-4">
            <Truck className="w-3.5 h-3.5 text-[#57324F]" />
            <span>Shiprocket Live Tracking</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-fraunces font-bold text-[#2C2623] tracking-tight mb-3">
            Track Your Sacred Order
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4A3E] font-manrope font-light max-w-lg mx-auto leading-relaxed">
            Enter your registered 10-digit mobile number to fetch real-time dispatch, AWB, and courier delivery updates.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EAE0CD] relative">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-manrope uppercase tracking-wider text-[#2C2623] font-semibold mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit registered number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-[#EAE0CD] focus:outline-none focus:border-[#57324F] focus:ring-2 focus:ring-[#57324F]/15 text-sm text-[#2C2623] font-manrope placeholder-[#8A796B] bg-[#FAF7F2] focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-manrope uppercase tracking-wider text-[#2C2623] font-semibold mb-1.5">
                  Order ID <span className="text-[#8A796B] font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHR278696"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#EAE0CD] focus:outline-none focus:border-[#57324F] focus:ring-2 focus:ring-[#57324F]/15 text-sm text-[#2C2623] font-manrope placeholder-[#8A796B] bg-[#FAF7F2] focus:bg-white transition-all shadow-xs"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Package Now</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-manrope flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Result if order returned */}
          {orderData && (
            <div className="mt-6 pt-6 border-t border-[#EAE0CD] space-y-3 font-manrope text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2C2623]">Order #{orderData.id || orderData.orderId}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold uppercase text-[10px]">
                  {orderData.status || 'Active'}
                </span>
              </div>
              <p className="text-[#5C4A3E]">
                Courier: <strong>{orderData.courier || 'Shiprocket Partner'}</strong> · AWB: {orderData.awb || 'Generated'}
              </p>
              <button
                type="button"
                onClick={onGoSupport}
                className="text-[#57324F] hover:underline font-semibold flex items-center gap-1 pt-1"
              >
                <span>View Full Timeline in Customer Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
