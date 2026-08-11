import React, { useState } from 'react';
import { ArrowLeft, Gift, ShieldCheck, Truck, Award, Send, CheckCircle2, Sparkles, Building2, Mail, Phone, User, Package, FileText } from 'lucide-react';

export const CorporateGiftingPage = ({ onBackToHome, showToast }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    quantity: '50-100',
    budget: '1000-2500',
    occasion: 'Diwali Corporate Gifting',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (showToast) {
      showToast(
        'Enquiry Received!',
        'Thank you! Our Corporate Gifting Concierge will reach out within 4 business hours with a customized proposal.',
        'success'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24 text-[#2C2623]">

      {/* Hero Header Banner — Full Viewport Cover */}
      <div
        className="relative w-full overflow-hidden bg-[#1C1715]"
        style={{ height: '100svh', minHeight: '100vh' }}
      >
        {/* Mobile Image — shown below sm breakpoint (< 640px) */}
        <img
          src="/copperatemobileview.png"
          alt="Corporate & Bulk Gifting"
          onError={(e) => {
            if (e.target.src !== '/assets/handcrafted cover.jpg') {
              e.target.src = '/assets/handcrafted cover.jpg';
            }
          }}
          className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center hero-image-crisp"
        />

        {/* Desktop Image — shown from sm breakpoint (≥ 640px) */}
        <img
          src="/copperatepcview.png"
          alt="Corporate & Bulk Gifting"
          onError={(e) => {
            if (e.target.src !== '/assets/HERO2.png') {
              e.target.src = '/assets/HERO2.png';
            }
          }}
          className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center hero-image-crisp"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none" style={{ paddingTop: '70px' }}>
          <h1
            className="font-cinzel font-bold text-white tracking-wider uppercase text-center leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 8vw, 5rem)',
              textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            Corporate & Bulk Gifting
          </h1>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Back to Home Button Below Hero Section */}
        <div className="mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] shadow-md transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* 4 Key Gifting Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-[#EAE0CD] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0D9] text-[#755722] flex items-center justify-center text-xl font-bold border border-[#DAB97B]/40">
              🪔
            </div>
            <h3 className="text-base font-cinzel font-bold text-[#2C2623]">Custom Festival Kits</h3>
            <p className="text-xs text-[#5C5450] font-light leading-relaxed">
              Curated festive pooja kits with solid brass diyas, A2 ghee wicks, organic incense sticks, and Kashmir dhoop cones in velvet caskets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE0CD] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0D9] text-[#755722] flex items-center justify-center text-xl font-bold border border-[#DAB97B]/40">
              🌿
            </div>
            <h3 className="text-base font-cinzel font-bold text-[#2C2623]">Incense & Dhoop Sets</h3>
            <p className="text-xs text-[#5C5450] font-light leading-relaxed">
              Pure bamboo-free & charcoal-free agarbatti sticks, natural dhoop cones, dhoop sticks, and loban sambrani cups in custom boxes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE0CD] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0D9] text-[#755722] flex items-center justify-center text-xl font-bold border border-[#DAB97B]/40">
              ✨
            </div>
            <h3 className="text-base font-cinzel font-bold text-[#2C2623]">Custom Metal Engraving</h3>
            <p className="text-xs text-[#5C5450] font-light leading-relaxed">
              Laser-etch your company logo, greeting, or recipient name onto heavy-gauge brassware, copper tumblers, and silver coins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE0CD] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0D9] text-[#755722] flex items-center justify-center text-xl font-bold border border-[#DAB97B]/40">
              📦
            </div>
            <h3 className="text-base font-cinzel font-bold text-[#2C2623]">End-to-End B2B Fulfillment</h3>
            <p className="text-xs text-[#5C5450] font-light leading-relaxed">
              Direct door-to-door delivery across multiple office locations or employee addresses with personalized greeting cards.
            </p>
          </div>
        </div>

        {/* Featured Hamper Varieties Section */}
        <div className="mb-16 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-cinzel tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
              Bespoke Bulk Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#2C2623]">
              Curated Festival & Incense Hampers
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5450] font-light max-w-xl mx-auto">
              Select from our most popular corporate hamper configurations or customize your own mixture of brassware, copperware, and incense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Box 1 */}
            <div className="bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#231E1C] relative">
                  <img
                    src="/images/categories/gifting.png"
                    alt="Custom Festival & Pooja Kit"
                    onError={(e) => { e.target.src = '/assets/Incense cover.jpg'; }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#231E1C]/90 text-[#E5C378] text-[9px] font-cinzel font-bold px-2 py-1 rounded">
                    Festival Special
                  </span>
                </div>
                <h3 className="text-base font-cinzel font-bold text-[#2C2623]">
                  Shubh Aarambh Festival Pooja Kit
                </h3>
                <p className="text-xs text-[#5C5450] font-light leading-relaxed">
                  Includes Moradabad brass diya, organic bamboo-free incense sticks, Kashmir Mogra dhoop cones, A2 cow ghee wicks, and a brass bell in a gold velvet casket.
                </p>
              </div>
              <span className="text-xs font-cinzel font-bold text-[#C5A059] block pt-2 border-t border-[#F0EA99]/40">
                Customizable Box & Logo Card
              </span>
            </div>

            {/* Box 2 */}
            <div className="bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#231E1C] relative">
                  <img
                    src="/assets/Incense cover.jpg"
                    alt="Organic Incense & Dhoop Set"
                    className="w-full h-full object-cover object-bottom"
                  />
                  <span className="absolute top-2 left-2 bg-[#231E1C]/90 text-[#E5C378] text-[9px] font-cinzel font-bold px-2 py-1 rounded">
                    Incense & Dhoop
                  </span>
                </div>
                <h3 className="text-base font-cinzel font-bold text-[#2C2623]">
                  Vedic Aroma Incense & Dhoop Casket
                </h3>
                <p className="text-xs text-[#5C5450] font-light leading-relaxed">
                  Contains bamboo-free agarbatti (50 sticks), Kashmir Mogra dhoop cones (24 cones), charcoal-free dhoop sticks (20 sticks), and 12 Loban Sambrani cups with brass holder.
                </p>
              </div>
              <span className="text-xs font-cinzel font-bold text-[#C5A059] block pt-2 border-t border-[#F0EA99]/40">
                100% Eco-Friendly & Charcoal-Free
              </span>
            </div>

            {/* Box 3 */}
            <div className="bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#231E1C] relative">
                  <img
                    src="/assets/brasscover.png"
                    alt="Brassware Pooja Hamper"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#231E1C]/90 text-[#E5C378] text-[9px] font-cinzel font-bold px-2 py-1 rounded">
                    Laser Engraved
                  </span>
                </div>
                <h3 className="text-base font-cinzel font-bold text-[#2C2623]">
                  Heritage Brassware & Diya Set
                </h3>
                <p className="text-xs text-[#5C5450] font-light leading-relaxed">
                  Solid virgin brass peacock diya lamp, hand-chased thali plate, carved bell, and camphor burner with laser-engraved corporate branding.
                </p>
              </div>
              <span className="text-xs font-cinzel font-bold text-[#C5A059] block pt-2 border-t border-[#F0EA99]/40">
                100% Virgin Lead-Free Brass
              </span>
            </div>

            {/* Box 4 */}
            <div className="bg-white rounded-2xl border border-[#EAE0CD] overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#231E1C] relative">
                  <img
                    src="/assets/Copper cover.png"
                    alt="Copper Wellness Corporate Set"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#231E1C]/90 text-[#E5C378] text-[9px] font-cinzel font-bold px-2 py-1 rounded">
                    Ayurvedic Wellness
                  </span>
                </div>
                <h3 className="text-base font-cinzel font-bold text-[#2C2623]">
                  Tamra Jal Pure Copper Pitcher & Glasses
                </h3>
                <p className="text-xs text-[#5C5450] font-light leading-relaxed">
                  Hand-hammered 99.6% certified pure copper pitcher (1.5L) with two engraved copper tumblers in an ivory velvet presentation box.
                </p>
              </div>
              <span className="text-xs font-cinzel font-bold text-[#C5A059] block pt-2 border-t border-[#F0EA99]/40">
                Lab-Certified Pure Copper
              </span>
            </div>

          </div>
        </div>

        {/* Form Container Section */}
        <div className="bg-white rounded-3xl border border-[#EAE0CD] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* Left Visual Column */}
          <div className="lg:col-span-5 bg-[#1C1715] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C1715] via-[#231E1C] to-[#141110] z-0"></div>

            <div className="relative z-10 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-[10px] font-cinzel tracking-widest uppercase border border-[#C5A059]/40">
                B2B Bulk Enquiries
              </span>

              <h2 className="text-3xl font-cinzel font-bold text-white leading-tight">
                Request a Custom Bulk Quote & Digital Mockup
              </h2>

              <p className="text-xs sm:text-sm text-[#D4CEBF] font-light leading-relaxed">
                Fill in your project specifications and our corporate gifting specialist will respond within 4 hours with tailored sample designs and wholesale volume pricing.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#3A322C]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">Volume discounts from 25 to 5,000+ units</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">Free digital box sample with company logo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">GST 18% input credit tax invoices</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-[#3A322C]/60 flex items-center gap-4 text-xs text-gray-400">
              <span>Direct Concierge:</span>
              <span className="text-[#E5C378] font-cinzel font-bold">+91 98765 43210</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12">
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#FAF0D9] text-[#755722] border-2 border-[#DAB97B] mx-auto flex items-center justify-center text-3xl">
                  🪔
                </div>
                <h3 className="text-2xl font-cinzel font-bold text-[#2C2623]">Enquiry Received!</h3>
                <p className="text-sm text-[#5C5450] max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <span className="font-semibold text-[#2C2623]">{formData.fullName}</span>! Our corporate gifting manager has received your bulk enquiry for <span className="font-semibold text-[#2C2623]">{formData.companyName}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-[#231E1C] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-lg shadow hover:bg-[#3A3431]"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Company / Organization *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Acma Tech Solutions"
                        className="w-full pl-10 pr-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@company.com"
                        className="w-full pl-10 pr-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      WhatsApp / Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  {/* Quantity Tier */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Estimated Quantity *
                    </label>
                    <select
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                    >
                      <option value="25-50">25 - 50 Units</option>
                      <option value="50-100">50 - 100 Units</option>
                      <option value="100-500">100 - 500 Units</option>
                      <option value="500+">500+ Units (Mega Wholesale)</option>
                    </select>
                  </div>

                  {/* Budget Per Gift */}
                  <div className="space-y-2">
                    <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                      Target Budget Per Gift
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                    >
                      <option value="500-1000">₹500 - ₹1,000 per gift</option>
                      <option value="1000-2500">₹1,000 - ₹2,500 per gift</option>
                      <option value="2500-5000">₹2,500 - ₹5,000 per gift</option>
                      <option value="5000+">₹5,000+ Luxury Hamper</option>
                    </select>
                  </div>

                </div>

                {/* Event / Preferred Hamper Type */}
                <div className="space-y-2">
                  <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                    Preferred Hamper / Occasion Type *
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                  >
                    <option value="Custom Festival Kits">Custom Festival & Pooja Kits (Diya, Ghee Wicks & Incense)</option>
                    <option value="Incense & Dhoop Hampers">Organic Incense Sticks & Dhoop Hampers (Agarbatti, Cones & Sambrani)</option>
                    <option value="Brassware & Pooja Thali Hampers">Heritage Brassware & Pooja Thali Sets</option>
                    <option value="Copper Wellness Pitcher & Glass Sets">Tamra Jal Pure Copper Wellness Sets</option>
                    <option value="Diwali Corporate Gifting">Diwali & Festive Corporate Gifting</option>
                    <option value="Employee Rewards">Employee Rewards & Milestone Recognition</option>
                    <option value="Wedding Favors">Wedding Return Favors & Auspicious Ceremonies</option>
                    <option value="Other Custom Project">Other Custom Bespoke Project</option>
                  </select>
                </div>

                {/* Custom Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                    Customization & Requirements Notes
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mention any specific brass/copper products, box branding preferences, or delivery deadline..."
                    className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-[#E5C378]" />
                  <span>Submit Bulk Enquiry Request</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
