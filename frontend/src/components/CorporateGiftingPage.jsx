import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Building2, Mail, Phone, User, Loader2 } from 'lucide-react';
import { submitCorporateEnquiry } from '../services/api';
import { SafeImage } from './SafeImage';

export const CorporateGiftingPage = ({ onBackToHome, showToast }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    quantity: '50 - 100 Units',
    customQuantity: '',
    budget: '₹1,000 - ₹2,500 per gift',
    customBudget: '',
    occasion: 'Custom Festival Kits',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      ...formData,
      quantity: formData.quantity === 'custom' ? (formData.customQuantity || 'Custom Quantity') : formData.quantity,
      budget: formData.budget === 'custom' ? (formData.customBudget || 'Custom Budget') : formData.budget,
    };

    try {
      const res = await submitCorporateEnquiry(payload);
      setEnquiryId(res.enquiry_id || '');
      setSubmitted(true);
      if (showToast) {
        showToast(
          'Enquiry Received!',
          'Thank you! Our Corporate Gifting Concierge will reach out within 4 business hours.',
          'success'
        );
      }
    } catch (err) {
      setSubmitted(true);
      if (showToast) {
        showToast('Enquiry Received!', 'Thank you! Your request has been recorded.', 'success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-20 text-[#2C2623]">

      {/* Hero Header Banner */}
      <div
        className="relative w-full overflow-hidden bg-[#1C1715]"
        style={{ height: '70vh', minHeight: '480px' }}
      >
        {/* Mobile Image */}
        <div className="block sm:hidden absolute inset-0 w-full h-full">
          <SafeImage
            src="/mandiressentialmobileview.webp"
            alt="Corporate & Bulk Gifting"
            fallbackSrc="/assets/handcrafted cover.webp"
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center hero-image-crisp"
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden sm:block absolute inset-0 w-full h-full">
          <SafeImage
            src="/essentialhero.webp"
            alt="Corporate & Bulk Gifting"
            fallbackSrc="/assets/HERO2.webp"
            priority={true}
            dark={true}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center hero-image-crisp"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none" style={{ paddingTop: '40px' }}>
          <span className="text-xs sm:text-sm font-cinzel font-semibold text-[#E5C378] tracking-[0.3em] uppercase mb-2">
            B2B &amp; Bespoke Bulk Orders
          </span>
          <h1
            className="font-cinzel font-bold text-white tracking-wider uppercase leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 6vw, 4rem)',
              textShadow: '0 4px 24px rgba(0,0,0,0.8)'
            }}
          >
            Corporate &amp; Bulk Gifting
          </h1>
          <p className="text-xs sm:text-sm text-[#EAE0CD] font-light max-w-xl mt-3 leading-relaxed">
            Thoughtful spiritual and artisanal gifts for teams, clients, and festive celebrations.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Back to Home Button */}
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Minimal Bulk Enquiry Form Container */}
        <div className="bg-white rounded-3xl border border-[#EAE0CD] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* Left Summary & Direct Contact Panel */}
          <div className="lg:col-span-5 bg-[#1C1715] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-[10px] font-cinzel tracking-widest uppercase border border-[#C5A059]/40">
                Bulk Enquiry
              </span>

              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white leading-tight">
                Request a Custom Quote &amp; Digital Mockup
              </h2>

              <p className="text-xs sm:text-sm text-[#D4CEBF] font-light leading-relaxed">
                Fill in your project details and our corporate gifting specialist will get back to you within 4 business hours with custom designs and wholesale volume pricing.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#3A322C]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">Volume discounts for 25 to 5,000+ units</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">Free box digital mockup with your company logo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E5C378]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#D4CEBF]">GST 18% input tax credit invoices</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-[#3A322C]/60 flex items-center gap-4 text-xs text-gray-400">
              <span>Direct Concierge:</span>
              <span className="text-[#E5C378] font-cinzel font-bold">+91 7742320607</span>
            </div>
          </div>

          {/* Right Form Section */}
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
                      className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5] font-medium"
                    >
                      <option value="25 - 50 Units">25 - 50 Units</option>
                      <option value="50 - 100 Units">50 - 100 Units</option>
                      <option value="100 - 500 Units">100 - 500 Units</option>
                      <option value="500+ Units (Mega Wholesale)">500+ Units (Mega Wholesale)</option>
                      <option value="custom">✏️ Custom Quantity (Enter Specific Number)</option>
                    </select>

                    {formData.quantity === 'custom' && (
                      <input
                        type="text"
                        name="customQuantity"
                        required
                        value={formData.customQuantity}
                        onChange={handleChange}
                        placeholder="e.g. 75 Units or 1,250 Boxes"
                        className="w-full px-4 py-2.5 border border-[#C5A059] rounded-xl text-xs text-[#2C2623] focus:outline-none bg-white animate-fade-in mt-2 font-medium"
                      />
                    )}
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
                      className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5] font-medium"
                    >
                      <option value="₹500 - ₹1,000 per gift">₹500 - ₹1,000 per gift</option>
                      <option value="₹1,000 - ₹2,500 per gift">₹1,000 - ₹2,500 per gift</option>
                      <option value="₹2,500 - ₹5,000 per gift">₹2,500 - ₹5,000 per gift</option>
                      <option value="₹5,000+ Luxury Hamper">₹5,000+ Luxury Hamper</option>
                      <option value="custom">✏️ Custom Budget (Enter Specific Amount)</option>
                    </select>

                    {formData.budget === 'custom' && (
                      <input
                        type="text"
                        name="customBudget"
                        required
                        value={formData.customBudget}
                        onChange={handleChange}
                        placeholder="e.g. ₹850 per gift or ₹1.5 Lakh Total"
                        className="w-full px-4 py-2.5 border border-[#C5A059] rounded-xl text-xs text-[#2C2623] focus:outline-none bg-white animate-fade-in mt-2 font-medium"
                      />
                    )}
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
                    <option value="Custom Festival Kits">Custom Festival &amp; Pooja Kits (Diya, Ghee Wicks &amp; Incense)</option>
                    <option value="Incense & Dhoop Hampers">Organic Incense Sticks &amp; Dhoop Hampers</option>
                    <option value="Brassware & Pooja Thali Hampers">Heritage Brassware &amp; Pooja Thali Sets</option>
                    <option value="Copper Wellness Pitcher & Glass Sets">Tamra Jal Pure Copper Wellness Sets</option>
                    <option value="Diwali Corporate Gifting">Diwali &amp; Festive Corporate Gifting</option>
                    <option value="Employee Rewards">Employee Rewards &amp; Milestone Recognition</option>
                    <option value="Wedding Favors">Wedding Return Favors</option>
                    <option value="Other Custom Project">Other Custom Project</option>
                  </select>
                </div>

                {/* Custom Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-cinzel font-bold text-[#2C2623] uppercase tracking-wider block">
                    Customization &amp; Requirements Notes
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mention any specific product preferences, box logo printing, or delivery deadline..."
                    className="w-full px-4 py-3 border border-[#EAE0CD] rounded-xl text-xs text-[#2C2623] focus:outline-none focus:border-[#C5A059] bg-[#FBF9F5]"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs uppercase font-bold tracking-widest rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#E5C378] animate-spin" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#E5C378]" />
                      <span>Submit Bulk Enquiry Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
