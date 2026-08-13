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
    <section className="py-12 sm:py-16 lg:py-20 bg-[#F6F1E7] border-b border-[#EAE0CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#DAB97B]/40 text-[#755722] text-xs font-cinzel tracking-widest uppercase mb-2">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Interactive Finder</span>
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-[#2C2623]">
            Curate Your Sacred Sanctuary
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#4A4441] mt-1 font-light">
            Answer 2 quick questions to discover the ideal harmonized ritual bundle for your home.
          </p>
        </div>

        {/* Quiz & Recommendation Container */}
        <div className="bg-[#FBF9F5] rounded-2xl p-4 sm:p-6 lg:p-10 border border-[#EAE0CD] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start lg:items-center">
          
          {/* Left Column: Questions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 */}
            <div>
              <label className="text-xs font-cinzel tracking-wider uppercase font-semibold text-[#8C6929] block mb-3">
                1. What is your primary intent?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {intents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIntent(item.id)}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all flex items-center gap-3 ${
                      intent === item.id
                        ? 'bg-[#231E1C] text-[#E5C378] border-[#C5A059] shadow-md font-semibold'
                        : 'bg-white text-[#2C2623] border-[#EAE0CD] hover:border-[#C5A059]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="font-sans leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <label className="text-xs font-cinzel tracking-wider uppercase font-semibold text-[#8C6929] block mb-3">
                2. Where will this ritual setup be placed?
              </label>
              <div className="flex flex-wrap gap-3">
                {spaces.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSpace(sp.id)}
                    className={`px-4 py-2.5 rounded-lg border text-xs font-sans transition-all ${
                      space === sp.id
                        ? 'bg-[#FAF0D9] text-[#755722] border-[#C5A059] font-semibold'
                        : 'bg-white text-[#4A4441] border-[#EAE0CD] hover:border-[#C5A059]'
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
            <div className="bg-[#231E1C] text-[#F9F5EC] p-6 rounded-xl border border-[#C5A059]/40 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#3A3431] pb-3">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#E5C378]">Recommended Bundle</span>
                <span className="text-[10px] bg-[#C5A059] text-[#171312] font-bold px-2 py-0.5 rounded">
                  Save ₹{rec.savings}
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#F9F5EC]">
                  {rec.title}
                </h3>
                <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Curated for your selected sanctuary space.
                </p>
              </div>

              {/* Items included list */}
              <div className="space-y-2 py-2">
                {rec.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#EAE0CD]">
                    <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>

              {/* Bundle Price & Add to Cart */}
              <div className="pt-3 border-t border-[#3A3431] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-cinzel font-bold text-[#E5C378]">
                      ₹{rec.bundlePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{rec.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-400">Bundle Discount Applied</span>
                </div>

                <button
                  onClick={handleAddBundle}
                  className="px-4 py-2.5 bg-[#C5A059] text-[#171312] font-cinzel text-xs uppercase font-bold tracking-wider rounded hover:bg-[#E5C378] transition-all flex items-center gap-1.5 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
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
