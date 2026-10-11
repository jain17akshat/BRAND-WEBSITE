import React, { useEffect } from 'react';
import { Scale, FileText, CheckCircle2, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export function TermsPage({ onBackToHome }) {
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
            <Scale className="w-4 h-4" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-fraunces font-bold text-[#2C2623] tracking-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6B5D] font-light max-w-lg mx-auto leading-relaxed font-manrope">
            Last Updated: August 2026 · Please read these terms carefully before accessing or placing an order on Shraviko.com.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE0CD] shadow-sm space-y-8 text-sm leading-relaxed text-[#4A3E37]">

          <section className="space-y-3">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#57324F]" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or purchasing products from <strong>Shraviko Pvt. Ltd.</strong> ("Shraviko", "we", "us"), you agree to be bound by these Terms &amp; Conditions. If you do not agree to all terms, you may not access the website.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              2. Artisan Craft &amp; Product Variation
            </h2>
            <p>
              Our brass, copper, and lifestyle products are handcrafted by traditional Indian artisans using age-old metalworking techniques:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C4A3E]">
              <li>Minor variations in hand-engravings, surface finish, weight (+/- 5%), or natural patina oxidation are inherent characteristics of authentic pure copper and brass metalcraft.</li>
              <li>Product imagery on screen may vary slightly in tone due to natural lighting and display screen color calibrations.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              3. Pricing, Payments &amp; GST Taxes
            </h2>
            <p>
              All prices listed on Shraviko.com are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). We reserve the right to modify prices without prior notice; however, orders already placed and paid for will not be affected.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              4. Intellectual Property
            </h2>
            <p>
              All content on Shraviko.com — including brand trademarks, photography, product designs, copy text, logos, and UI elements — is the exclusive property of Shraviko Pvt. Ltd. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              5. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any legal disputes or claims arising out of the use of this website shall be subject to the exclusive jurisdiction of courts in <strong>Udaipur, Rajasthan</strong>.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#FAF7F2]">
            <h2 className="text-lg font-fraunces font-bold text-[#2C2623]">
              6. Contact Information
            </h2>
            <p>
              For legal notices, billing queries, or terms inquiries, please contact us:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0CD] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#57324F]" />
                <span>Email: <a href="mailto:info@shraviko.com" className="text-[#57324F] underline font-semibold">info@shraviko.com</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#57324F]" />
                <span>Phone: +91 7742320607</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#57324F] shrink-0 mt-0.5" />
                <span>Address: Shraviko Sacred Atelier, Udaipur, Rajasthan 313001</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
