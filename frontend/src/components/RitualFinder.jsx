import React, { useState } from 'react';
import { Compass, Sparkles, Check, ArrowRight, ShoppingBag } from 'lucide-react';

export const RitualFinder = ({ onAddToCart }) => {
  const [intent, setIntent] = useState('daily');
  const [space, setSpace] = useState('mandir');

  const intents = [
    { id: 'daily', label: 'Daily Meditation & Evening Prayer', icon: '🧘' },
    { id: 'housewarming', label: 'Housewarming & New Beginnings', icon: '🪔' },
    { id: 'festive', label: 'Festive Celebrations & Gifting', icon: '✨' },
    { id: 'purification', label: 'Space Cleansing & Energy Balance', icon: '🌿' }
  ];

  const spaces = [
    { id: 'mandir', label: 'Home Prayer Altar / Mandir' },
    { id: 'living', label: 'Living Room Console / Urli Placement' },
    { id: 'workspace', label: 'Executive Workspace / Desk' }
  ];

  const getRecommendation = () => {
    if (intent === 'daily') {
      return {
        title: 'Daily Devotion & Peace Bundle',
        items: ['Royal Astha Lakshmi Brass Pooja Thali', 'Vedic Sandalwood Incense Box', 'Pure Bhimseni Camphor'],
        originalPrice: 4890,
        bundlePrice: 3990,
        savings: 900,
        artType: 'thali'
      };
    } else if (intent === 'housewarming') {
      return {
        title: 'Griha Pravesh Auspicious Blessing Set',
        items: ['Saanjh Hand-Carved Peacock Brass Diya', 'Tamra Jal Hammered Copper Pitcher', 'Griha Pravesh Gift Hamper'],
        originalPrice: 7590,
        bundlePrice: 6200,
        savings: 1390,
        artType: 'kit'
      };
    } else if (intent === 'festive') {
      return {
        title: 'Royal Celebration Luxury Box',
        items: ['Hand-Etched 24K Gold Plated Sri Yantra', 'Kashmir Mogra Dhoop Cones', 'Nivedyam Kapoor Burner'],
        originalPrice: 6170,
        bundlePrice: 4950,
        savings: 1220,
        artType: 'yantra'
      };
    } else {
      return {
        title: 'Sacred Energy Cleansing Kit',
        items: ['Teakwood Handle Brass Kapoor Burner', 'Pure Bhimseni Camphor (250g)', 'Kashmir Mogra Dhoop'],
        originalPrice: 2760,
        bundlePrice: 2200,
        savings: 560,
        artType: 'diffuser'
      };
    }
  };

  const rec = getRecommendation();

  const handleAddBundle = () => {
    const bundleItem = {
      id: `ritual-bundle-${Date.now()}`,
      name: rec.title,
      category: 'kits',
      categoryName: 'Ritual Bundle',
      price: rec.bundlePrice,
      purity: 'Curated Vedic Bundle',
      image: '',
      artType: rec.artType
    };
    onAddToCart(bundleItem);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBEAE5] border border-[#57324F]/15 text-[#57324F] text-xs font-manrope font-semibold tracking-wide mb-3">
            <Compass className="w-3.5 h-3.5 text-[#57324F]" />
            <span>Interactive Finder</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-fraunces font-bold text-[#2C2623]">
            Curate Your Sacred Sanctuary
          </h2>
          <p className="text-xs sm:text-sm font-manrope text-[#5C4A3E] mt-1 font-light">
            Answer 2 quick questions to discover the ideal harmonized ritual bundle for your home.
          </p>
        </div>

        {/* Quiz & Recommendation Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-12 border border-[#EAE0CD] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center">
          
          {/* Left Column: Questions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 */}
            <div>
              <label className="text-xs font-manrope tracking-wider uppercase font-bold text-[#57324F] block mb-3">
                1. What is your primary intent?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {intents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIntent(item.id)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center gap-3 ${
                      intent === item.id
                        ? 'bg-[#57324F] text-white border-[#57324F] shadow-sm font-semibold'
                        : 'bg-[#FAF7F2] text-[#2C2623] border-[#EAE0CD] hover:border-[#57324F]/40'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-manrope leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <label className="text-xs font-manrope tracking-wider uppercase font-bold text-[#57324F] block mb-3">
                2. Where will this ritual setup be placed?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {spaces.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSpace(sp.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-manrope transition-all ${
                      space === sp.id
                        ? 'bg-[#57324F] text-white border-[#57324F] font-semibold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#5C4A3E] border-[#EAE0CD] hover:border-[#57324F]/40'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Recommendation Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF7F2] text-[#2C2623] p-6 sm:p-7 rounded-3xl border border-[#EAE0CD] shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#EAE0CD] pb-3">
                <span className="text-xs font-manrope uppercase tracking-wider text-[#57324F] font-semibold">Recommended Bundle</span>
                <span className="text-[11px] bg-[#FBEAE5] text-[#57324F] font-bold px-2.5 py-1 rounded-full border border-[#57324F]/15">
                  Save ₹{rec.savings}
                </span>
              </div>

              <div>
                <h3 className="font-fraunces text-xl font-bold text-[#2C2623]">
                  {rec.title}
                </h3>
                <p className="text-xs text-[#7A6B5D] font-manrope mt-0.5">
                  Curated for your selected sanctuary space.
                </p>
              </div>

              {/* Items included list */}
              <div className="space-y-2 py-2">
                {rec.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-manrope text-[#2C2623]">
                    <Check className="w-4 h-4 text-[#57324F]" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>

              {/* Bundle Price & Add to Cart */}
              <div className="pt-4 border-t border-[#EAE0CD] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-manrope font-bold text-[#57324F]">
                      ₹{rec.bundlePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#7A6B5D] line-through font-manrope">
                      ₹{rec.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-manrope font-medium">Bundle Discount Applied</span>
                </div>

                <button
                  onClick={handleAddBundle}
                  className="px-5 py-3 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm min-h-[46px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Get Bundle</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
