import React, { useEffect } from 'react';
import { RotateCcw, ShieldCheck, AlertCircle, Clock, ArrowLeft, Mail, Phone, CheckCircle2 } from 'lucide-react';

export function RefundPolicyPage({ onBackToHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2623] pt-24 pb-20 font-manrope">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FBEAE5] text-[#57324F] font-manrope text-xs font-semibold rounded-xl border border-[#57324F]/25 shadow-xs transition-all active:scale-95 mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-[#57324F]" />
          <span>Back to Home</span>
        </button>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBEAE5] border border-[#57324F]/15 text-[#57324F] text-xs font-manrope font-semibold tracking-wide mb-4">
            <RotateCcw className="w-4 h-4" />
            <span>Customer Assurance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-fraunces font-bold text-[#2C2623] tracking-tight mb-4">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6B5D] font-light max-w-lg mx-auto leading-relaxed font-manrope">
            At Shraviko, we stand behind the quality and purity of our metalcraft, diyas, and incense products.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE0CD] shadow-sm space-y-8 text-sm leading-relaxed text-[#4A3E37]">

          {/* Key Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0CD]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div>
                <h4 className="font-fraunces font-bold text-[#2C2623] text-sm">7-Day Window</h4>
                <p className="text-[11px] text-[#7A6B5D]">Easy returns after delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#57324F] flex-shrink-0" />
              <div>
                <h4 className="font-fraunces font-bold text-[#2C2623] text-sm">5–7 Day Credit</h4>
                <p className="text-[11px] text-[#7A6B5D]">Fast refund processing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div>
                <h4 className="font-fraunces font-bold text-[#2C2623] text-sm">100% Replacement</h4>
                <p className="text-[11px] text-[#7A6B5D]">For transit defects</p>
              </div>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              1. 7-Day Return Eligibility
            </h2>
            <p>
              We offer a <strong>7-day return guarantee</strong> from the date of delivery. To be eligible for a return:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>The item must be unused, unwashed, and in the same pristine condition that you received it.</li>
              <li>Items must be returned in their original gift box packaging with tag certificates intact.</li>
              <li>Proof of purchase (Order ID or invoice receipt) is required.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              2. Damaged or Defective Deliveries
            </h2>
            <p>
              In the rare event that your product arrives damaged during transit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>Please photograph the damaged item and original outer box immediately upon opening.</li>
              <li>Email the photos and your Order ID to <a href="mailto:info@shraviko.com" className="text-[#57324F] underline font-semibold">info@shraviko.com</a> within <strong>48 hours of delivery</strong>.</li>
              <li>Our team will arrange a free reverse pickup and dispatch a brand-new replacement at zero additional charge.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              3. Non-Returnable Items
            </h2>
            <p>For hygiene and custom craft reasons, the following categories are non-returnable unless defective:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>Custom-engraved yantras, bespoke brass thalis, or personalized temple plaques.</li>
              <li>Opened packs of incense sticks, dhoop cones, or organic sambrani cups.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              4. Refund Timelines &amp; Method
            </h2>
            <p>
              Once your returned item is received and inspected at our Udaipur atelier:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>Refunds are processed within <strong>2 business days</strong>.</li>
              <li>Prepaid orders are refunded back to your original payment method via Razorpay (*credited within 5 to 7 banking days*).</li>
              <li>For Cash on Delivery (COD) orders, returns are processed via Return Request Approval Mail and reverse pickup confirmation.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              5. Order Cancellation Policy
            </h2>
            <p>
              You may cancel your order within <strong>2 hours of placement</strong> before it enters warehouse processing by contacting <a href="mailto:info@shraviko.com" className="text-[#57324F] underline font-semibold">info@shraviko.com</a> or calling <strong>+91 7742320607</strong>. Once shipped, orders cannot be cancelled; however, you can initiate a return upon delivery.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
