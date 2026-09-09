import React, { useState, useMemo } from 'react';
import { subscribeToLaunch } from '../services/api';
import {
  ArrowLeft,
  Sparkles,
  Gem,
  Heart,
  Shield,
  Moon,
  Compass,
  Leaf,
  Bell,
  CheckCircle2,
  X,
  Search,
  Hourglass,
  SlidersHorizontal,
  Filter,
  Check,
  RotateCcw,
  Eye,
  TrendingUp,
  Coins,
  GraduationCap
} from 'lucide-react';

// The 8 Core Purposes matching GemsMantra reference image
export const PURPOSES = [
  {
    id: 'wealth-prosperity',
    name: 'Wealth & Prosperity',
    subtext: 'Dhan & samriddhi',
    category: 'wealth',
    icon: Coins,
    color: '#D4AF37',
    description: 'Attracts financial abundance, business prosperity, cash flow, and permanent dhan & samriddhi.',
    keywords: ['money', 'wealth', 'prosperity', 'abundance', 'fortune', 'luck', 'opportunity', 'dhan', 'samriddhi']
  },
  {
    id: 'career-success',
    name: 'Career & Success',
    subtext: 'Naukri, business & growth',
    category: 'growth',
    icon: TrendingUp,
    color: '#2563EB',
    description: 'Promotes career promotions, job growth, business victories, and professional success.',
    keywords: ['career', 'success', 'growth', 'progress', 'power', 'motivation', 'courage', 'confidence', 'naukri', 'business']
  },
  {
    id: 'love-marriage',
    name: 'Love & Marriage',
    subtext: 'Prem & vivah',
    category: 'peace',
    icon: Heart,
    color: '#E11D48',
    description: 'Fosters romantic harmony, attracts soulful life partners, heals relationships, and awakens prem & vivah yoga.',
    keywords: ['love', 'marriage', 'happiness', 'joy', 'pregnancy', 'harmony', 'relationship', 'prem', 'vivah']
  },
  {
    id: 'protection',
    name: 'Protection',
    subtext: 'Suraksha kavach',
    category: 'protection',
    icon: Shield,
    color: '#475569',
    description: 'Creates a formidable spiritual suraksha kavach guarding against unseen harms, fear, and obstacles.',
    keywords: ['protection', 'stability', 'strength', 'courage', 'will power', 'suraksha', 'kavach']
  },
  {
    id: 'health-healing',
    name: 'Health & Healing',
    subtext: 'Aarogya & shakti',
    category: 'health',
    icon: Leaf,
    color: '#10B981',
    description: 'Restores vital physical stamina, emotional vitality, cellular healing, and aarogya shakti.',
    keywords: ['health', 'healing', 'pregnancy', 'vitality', 'strength', 'positivity', 'aarogya', 'shakti']
  },
  {
    id: 'peace-of-mind',
    name: 'Peace of Mind',
    subtext: 'Shanti & santulan',
    category: 'peace',
    icon: Moon,
    color: '#6366F1',
    description: 'Soothes anger, quiets racing thoughts, relieves anxiety, and restores deep shanti & santulan.',
    keywords: ['peace', 'anger', 'anxiety', 'calm', 'depression', 'meditation', 'positivity', 'shanti', 'santulan']
  },
  {
    id: 'education-focus',
    name: 'Education & Focus',
    subtext: 'Vidya & ekagrata',
    category: 'growth',
    icon: GraduationCap,
    color: '#0284C7',
    description: 'Enhances memory retention, academic concentration, exam success, and vidya & ekagrata.',
    keywords: ['education', 'focus', 'concentration', 'wisdom', 'communication skills', 'creativity', 'vidya', 'ekagrata']
  },
  {
    id: 'negativity-removal',
    name: 'Negativity Removal',
    subtext: 'Nazar & vastu dosh',
    category: 'protection',
    icon: Eye,
    color: '#78350F',
    description: 'Disperses evil eye (nazar), clears home Vastu dosh, and purifies stagnant environmental vibrations.',
    keywords: ['negativity', 'nazar', 'vastu', 'protection', 'shield', 'cleansing', 'dosh']
  }
];

export const EnergyStonesPage = ({ onBackToHome }) => {
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [purposeSearchQuery, setPurposeSearchQuery] = useState('');
  const [emailNotify, setEmailNotify] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter 8 purposes list in sidebar search box
  const filteredSidebarPurposes = useMemo(() => {
    if (!purposeSearchQuery.trim()) return PURPOSES;
    const q = purposeSearchQuery.toLowerCase();
    return PURPOSES.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesSubtext = p.subtext.toLowerCase().includes(q);
      const matchesKeywords = p.keywords.some(k => k.includes(q));
      return matchesName || matchesSubtext || matchesKeywords;
    });
  }, [purposeSearchQuery]);

  // Toggle purpose selection in sidebar
  const handleTogglePurpose = (purposeName) => {
    setSelectedPurposes((prev) =>
      prev.includes(purposeName)
        ? prev.filter((p) => p !== purposeName)
        : [...prev, purposeName]
    );
  };

  const handleResetFilters = () => {
    setSelectedPurposes([]);
    setPurposeSearchQuery('');
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = emailNotify.trim();
    if (cleanEmail) {
      try {
        await subscribeToLaunch({
          email: cleanEmail,
          purpose: selectedPurposes.length > 0 ? selectedPurposes.join(', ') : 'General Energy Stones'
        });
      } catch (err) {
        console.warn('Backend subscription logged:', err.message);
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmailNotify('');
      }, 4000);
    }
  };

  // Get details of active selected purpose(s)
  const activePurposeObj = useMemo(() => {
    if (selectedPurposes.length === 1) {
      return PURPOSES.find(p => p.name === selectedPurposes[0]);
    }
    return null;
  }, [selectedPurposes]);

  return (
    <div className="min-h-screen bg-[#FDFAF5] pt-24 pb-20 text-[#2C2623] select-none">
      
      {/* ── Top Header Banner ── */}
      <div className="bg-[#FAF5EC] border-b border-[#EAE0CD] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Glow background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-cinzel font-semibold text-[#8C6D2D] hover:text-[#2C1F06] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EEDC] border border-[#DAB97B]/50 text-[#8C6D2D] text-[10px] sm:text-xs font-cinzel font-bold tracking-widest uppercase mb-3">
                <Gem className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
                <span>Sacred Gemstone Collection</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#2C2623] tracking-wide heading-gold-line">
                Energy Stones & Accessories
              </h1>
              
              <p className="mt-3 text-xs sm:text-sm text-[#6B5840] font-light max-w-2xl leading-relaxed">
                100% Authentic Natural Gemstones, Orgone Healing Pyramids, Crystal Bracelets & Sacred Japa Malas — Consecrated & Energized for Specific Intentions.
              </p>
            </div>

            {/* Launch Status Pill */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5C378] px-4 py-2.5 rounded-2xl shadow-md flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] animate-ping" />
              <div>
                <p className="text-[10px] font-cinzel font-bold text-[#8C6D2D] uppercase tracking-widest">
                  Collection Launching Soon
                </p>
                <p className="text-[11px] text-[#5C4B38] font-medium">
                  Stay Tuned • VIP Early Access
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Main Container: Sidebar + Pure "Coming Soon" Teaser Showcase ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EAE0CD] text-xs font-cinzel font-bold text-[#2C2623] shadow-sm active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B8860B]" />
            <span>Select Purpose ({selectedPurposes.length})</span>
          </button>

          <span className="text-xs font-cinzel text-[#8C6D2D] font-bold uppercase tracking-wider">
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ── SIDEBAR: SHOP BY PURPOSE FILTERS ── */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl overflow-y-auto transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:bg-transparent lg:p-0 lg:shadow-none lg:overflow-visible
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            
            {/* Mobile Sidebar Close Button */}
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#EAE0CD]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="font-cinzel font-bold text-xs uppercase text-[#2C2623]">Shop by Purpose</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-full bg-[#F5EEDC] text-[#2C2623]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#EAE0CD] shadow-sm space-y-6 sticky top-28">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-[#F0E6D2] pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#B8860B]" />
                  <h3 className="font-cinzel font-bold text-sm text-[#2C2623] tracking-wide">
                    Shop by Purpose
                  </h3>
                </div>

                {selectedPurposes.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-cinzel text-[#A63A2B] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Purpose Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7E52]" />
                <input
                  type="text"
                  placeholder="Search purpose (Dhan, Health, Nazar...)"
                  value={purposeSearchQuery}
                  onChange={(e) => setPurposeSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FBF9F5] border border-[#EAE0CD] text-xs text-[#2C2623] placeholder-[#A08E76] focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              {/* 8 Main Purpose Checkbox List matching GemsMantra reference */}
              <div className="space-y-2.5">
                {filteredSidebarPurposes.map((item) => {
                  const isChecked = selectedPurposes.includes(item.name);
                  const IconComp = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleTogglePurpose(item.name)}
                      className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-[#F5EEDC] border-[#DAB97B] shadow-sm'
                          : 'bg-[#FDFBF7] border-[#EAE0CD] hover:border-[#C5A059] hover:bg-white'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                          isChecked ? 'bg-[#2C1F06] border-[#2C1F06] text-[#E5C378]' : 'border-[#D1C2A5] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {/* Purpose Name + Subtext */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-cinzel font-bold text-xs text-[#2C2623] group-hover:text-[#8C6D2D] transition-colors leading-tight truncate">
                            {item.name}
                          </h4>
                          <IconComp className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                        </div>
                        <p className="text-[11px] text-[#8C7A65] font-light mt-0.5 capitalize">
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredSidebarPurposes.length === 0 && (
                <p className="text-center text-xs text-[#7A6750] py-4">
                  No purpose matches "{purposeSearchQuery}".
                </p>
              )}

            </div>
          </aside>

          {/* ── MAIN SHOWCASE AREA: PURE "COMING SOON • STAY TUNED" SHOWCASE ── */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Active Purpose Banner Indicator (If Selected) */}
            {selectedPurposes.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#EAE0CD] shadow-sm flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-cinzel text-[#8C6D2D] font-bold">Active Purpose Filter:</span>
                  {selectedPurposes.map(pName => (
                    <span
                      key={pName}
                      onClick={() => handleTogglePurpose(pName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C1F06] text-[#E5C378] text-xs font-cinzel font-bold hover:bg-[#3D2B0A] cursor-pointer shadow-sm"
                    >
                      <span>{pName}</span>
                      <X className="w-3 h-3 text-[#E5C378]" />
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-cinzel text-[#A63A2B] hover:underline font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Main Luxury "Coming Soon • Stay Tuned" Showcase Hero Box */}
            <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#2C1F06] via-[#3D2B0A] to-[#1C1505] text-[#E5C378] border border-[#E5C378]/40 shadow-2xl overflow-hidden text-center">
              
              {/* Background Sacred Sun Aura */}
              <div className="absolute inset-0 opacity-15 pointer-events-none animate-spin-slow flex items-center justify-center">
                <svg className="w-[500px] h-[500px] text-[#E5C378]" viewBox="0 0 200 200" fill="currentColor">
                  <g transform="translate(100,100)">
                    <circle r="90" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                    <circle r="78" fill="none" stroke="currentColor" strokeWidth="1" />
                    {[...Array(12)].map((_, i) => (
                      <path key={i} d="M 0,-65 Q 12,-40 0,-15 Q -12,-40 0,-65" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 30})`} />
                    ))}
                  </g>
                </svg>
              </div>

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                
                {/* Gem Icon Aura */}
                <div className="w-20 h-20 mx-auto rounded-full bg-[#E5C378]/15 border border-[#E5C378]/50 flex items-center justify-center text-[#E5C378] shadow-2xl">
                  {activePurposeObj ? (
                    <activePurposeObj.icon className="w-10 h-10 animate-bounce" style={{ color: activePurposeObj.color }} />
                  ) : (
                    <Gem className="w-10 h-10 animate-pulse" />
                  )}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5C378]/20 border border-[#E5C378]/50 text-white text-xs font-cinzel font-bold uppercase tracking-widest">
                  <Hourglass className="w-3.5 h-3.5 text-[#E5C378] animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Collection Launching Soon • Stay Tuned</span>
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-white tracking-wide leading-tight">
                  {activePurposeObj ? (
                    <>Energy Stones & Accessories for <span className="text-[#E5C378]">{activePurposeObj.name}</span></>
                  ) : selectedPurposes.length > 0 ? (
                    <>Energy Stones for <span className="text-[#E5C378]">{selectedPurposes.join(', ')}</span></>
                  ) : (
                    <>Sacred Energy Stones & Crystal Accessories</>
                  )}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-base text-[#D9C49E] font-light leading-relaxed">
                  {activePurposeObj ? (
                    <>{activePurposeObj.description} <br/><span className="text-[#E5C378] font-semibold mt-1 inline-block">({activePurposeObj.subtext})</span></>
                  ) : (
                    "We are hand-selecting 100% authentic gemstones, crystal bracelets, orgone pyramids, and sacred Japa malas purified with Ganga Jal and consecrated with Vedic mantras for your selected purpose."
                  )}
                </p>

                {/* Form Notification Box */}
                <div className="pt-6 border-t border-[#E5C378]/30 max-w-md mx-auto">
                  {isSubmitted ? (
                    <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Thank you! You are registered for VIP Early Access on Launch Day.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email for early access..."
                        value={emailNotify}
                        onChange={(e) => setEmailNotify(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/95 text-xs text-[#2C2623] placeholder-[#8C8070] focus:outline-none focus:ring-2 focus:ring-[#E5C378] shadow-inner"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-[#E5C378] hover:bg-[#F3D693] text-[#2C1F06] text-xs font-cinzel font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Notify Me</span>
                      </button>
                    </form>
                  )}
                  <p className="text-[10px] text-[#B59D72] mt-2 font-light">
                    ✦ Be the first to be notified 1 hour before official release ✦
                  </p>
                </div>

              </div>
            </div>

            {/* Visual Purpose Grid Cards (Overview of the 8 purposes matching screenshot) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE0CD] shadow-sm">
              <div className="mb-6 text-center">
                <span className="text-[10px] font-cinzel font-bold tracking-[0.2em] text-[#9B7E52] uppercase">
                  Intentional Gemstone Pairings
                </span>
                <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#2C2623] mt-1">
                  Browse Purposes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PURPOSES.map((item) => {
                  const IconComp = item.icon;
                  const isChecked = selectedPurposes.includes(item.name);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleTogglePurpose(item.name)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between magnetic-hover ${
                        isChecked
                          ? 'bg-[#F5EEDC] border-[#B8860B] shadow-md'
                          : 'bg-[#FDFBF7] border-[#EAE0CD] hover:border-[#C5A059] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#E5D7BE] shadow-sm"
                          style={{ color: item.color }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5EEDC] text-[#7A5A1B]">
                          Soon
                        </span>
                      </div>

                      <div>
                        <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#2C2623]">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#8C7A65] font-light mt-0.5">
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>

        </div>
      </div>

    </div>
  );
};
