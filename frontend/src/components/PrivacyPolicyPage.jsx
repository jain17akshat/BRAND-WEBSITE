import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export function PrivacyPolicyPage({ onBackToHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2623] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F5EFE0] text-[#3D2B1F] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#DAB97B]/40 shadow-sm transition-all active:scale-95 mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-[#B8860B]" />
          <span>Back to Home</span>
        </button>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE0] border border-[#DAB97B]/50 text-[#8C6D27] text-xs font-cinzel tracking-widest uppercase font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#2C1F06] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6859] font-light max-w-lg mx-auto leading-relaxed">
            Last Updated: August 2026 · Shraviko Sacred Living respects your privacy and is committed to protecting your personal data.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E8DFC7] shadow-lg space-y-8 text-sm leading-relaxed text-[#4A3E37]">

          <section className="space-y-3">
            <h2 className="text-lg font-cinzel font-bold text-[#2C1F06] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#B8860B]" />
              1. Information We Collect
            </h2>
            <p>
              When you visit or place an order on <strong>Shraviko.com</strong>, we collect personal details necessary to process your transaction and fulfill your delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li><strong>Contact Information:</strong> Full name, email address, mobile phone number, and shipping address.</li>
              <li><strong>Order History:</strong> Products purchased, payment receipts, and delivery tracking identifiers.</li>
              <li><strong>Device & Browsing Data:</strong> IP address, browser type, and interaction logs collected via essential cookies to improve site performance.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F0E8D8]">
            <h2 className="text-lg font-cinzel font-bold text-[#2C1F06] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#B8860B]" />
              2. How We Use Your Data
            </h2>
            <p>Your information is strictly used for the following operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>Processing online payments securely via Razorpay payment gateway.</li>
              <li>Generating AWB shipping labels and real-time delivery notifications via Shiprocket logistics partners (*Delhivery, BlueDart, DTDC*).</li>
              <li>Sending automated 0-second email order receipts, invoice PDFs, and tracking status updates.</li>
              <li>Providing customer care support for inquiries, replacements, or returns.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F0E8D8]">
            <h2 className="text-lg font-cinzel font-bold text-[#2C1F06] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
              3. Data Protection & Security
            </h2>
            <p>
              We enforce 256-bit SSL encryption across all website pages. Your sensitive financial information (*credit/debit card details, UPI credentials, net banking passwords*) is handled directly by PCI-DSS compliant payment gateway (Razorpay) and is <strong>never stored on our servers</strong>.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F0E8D8]">
            <h2 className="text-lg font-cinzel font-bold text-[#2C1F06] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B8860B]" />
              4. Third-Party Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to third-party marketing companies. Data is shared exclusively with certified logistical and payment providers strictly to fulfill your order:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li><strong>Razorpay Software Private Limited</strong> (Payment verification & refunds).</li>
              <li><strong>Shiprocket / Bigfoot Retail Solutions</strong> (Order dispatch & SMS/WhatsApp delivery alerts).</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F0E8D8]">
            <h2 className="text-lg font-cinzel font-bold text-[#2C1F06]">
              5. Contact Us Regarding Your Privacy
            </h2>
            <p>
              If you have any questions or wish to request data correction or deletion, please reach out to our privacy compliance desk:
            </p>
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DFC7] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B8860B]" />
                <span>Email: <a href="mailto:info@shraviko.com" className="text-[#B8860B] underline font-semibold">info@shraviko.com</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B8860B]" />
                <span>Phone: +91 7742320607</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span>Address: Shraviko Sacred Atelier, Civil Lines, Jaipur, Rajasthan – 302006</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
