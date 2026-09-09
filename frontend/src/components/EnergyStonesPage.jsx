import React, { useState, useMemo } from 'react';
import { subscribeToLaunch } from '../services/api';
import {
  ArrowLeft,
  Sparkles,
  Gem,
  Heart,
  Zap,
  Shield,
  Sun,
  Flame,
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
  Lock,
  Star
} from 'lucide-react';

// The 39 purposes extracted from the user's reference image
export const PURPOSES = [
  { id: 'abundance', name: 'Abundance', category: 'wealth', icon: Sun, color: '#D4AF37', description: 'Attracts prosperity, financial growth, and infinite divine blessings.' },
  { id: 'anger', name: 'Anger', category: 'peace', icon: Flame, color: '#E05A47', description: 'Cools volatile emotions, releases frustration, and instills deep emotional balance.' },
  { id: 'anxiety', name: 'Anxiety', category: 'peace', icon: Moon, color: '#5B76C7', description: 'Soothes restless minds, relieves panic, and radiates tranquil inner harmony.' },
  { id: 'calm', name: 'Calm', category: 'peace', icon: Leaf, color: '#3B9A82', description: 'Encourages serene mental clarity and peaceful relaxation.' },
  { id: 'concentration', name: 'Concentration', category: 'growth', icon: Compass, color: '#2B8BB8', description: 'Sharpens attention span, clears brain fog, and aids dedicated focus.' },
  { id: 'communication-skills', name: 'Communication Skills', category: 'growth', icon: Zap, color: '#3B82F6', description: 'Unblocks Throat Chakra for confident, articulate, and truthful expression.' },
  { id: 'confidence', name: 'Confidence', category: 'growth', icon: Shield, color: '#D97706', description: 'Builds self-worth, overcomes self-doubt, and awakens inner radiance.' },
  { id: 'courage', name: 'Courage', category: 'growth', icon: Flame, color: '#DC2626', description: 'Instills warrior-like bravery to conquer fears and difficult decisions.' },
  { id: 'creativity', name: 'Creativity', category: 'growth', icon: Sparkles, color: '#9333EA', description: 'Inspires artistic expression, innovative ideas, and passionate drive.' },
  { id: 'depression', name: 'Depression', category: 'peace', icon: Sun, color: '#EAB308', description: 'Disperses heavy dark energies and fills the aura with uplifting golden light.' },
  { id: 'education', name: 'Education', category: 'growth', icon: Compass, color: '#0284C7', description: 'Enhances memory retention, academic success, and love for knowledge.' },
  { id: 'focus', name: 'Focus', category: 'growth', icon: Compass, color: '#059669', description: 'Keeps thoughts aligned toward goals without distraction.' },
  { id: 'fortune', name: 'Fortune', category: 'wealth', icon: Gem, color: '#B45309', description: 'Opens doors to sudden luck, windfall opportunities, and auspicious timing.' },
  { id: 'good-luck', name: 'Good Luck', category: 'wealth', icon: Sparkles, color: '#16A34A', description: 'Magnifies positive synchronicities and favorable outcomes.' },
  { id: 'growth', name: 'Growth', category: 'growth', icon: Leaf, color: '#15803D', description: 'Encourages continuous personal, spiritual, and professional evolution.' },
  { id: 'happiness', name: 'Happiness', category: 'peace', icon: Sun, color: '#F59E0B', description: 'Evokes genuine joy, laughter, and lighthearted emotional wellbeing.' },
  { id: 'healing', name: 'Healing', category: 'health', icon: Heart, color: '#10B981', description: 'Restores energetic alignment, vital health, and cellular rejuvenation.' },
  { id: 'health', name: 'Health', category: 'health', icon: Heart, color: '#059669', description: 'Promotes physical stamina, immunity, and overall body vitality.' },
  { id: 'joy', name: 'Joy', category: 'peace', icon: Sun, color: '#F59E0B', description: 'Awakens bliss, optimism, and appreciation for life’s moments.' },
  { id: 'love', name: 'Love', category: 'peace', icon: Heart, color: '#E11D48', description: 'Attracts soulful relationships, self-compassion, and heart chakra harmony.' },
  { id: 'luck', name: 'Luck', category: 'wealth', icon: Gem, color: '#D97706', description: 'Turns the tide of fortune in your favor.' },
  { id: 'meditation', name: 'Meditation', category: 'peace', icon: Moon, color: '#7C3AED', description: 'Deepens spiritual awareness, Third Eye insight, and silent stillness.' },
  { id: 'money', name: 'Money', category: 'wealth', icon: Gem, color: '#047857', description: 'Magnifies cash flow, business revenue, and financial stability.' },
  { id: 'motivation', name: 'Motivation', category: 'growth', icon: Zap, color: '#EA580C', description: 'Ignites drive, overcomes laziness, and fuels goal achievement.' },
  { id: 'negativity', name: 'Negativity', category: 'protection', icon: Shield, color: '#44403C', description: 'Absorbs and transmutes harmful environmental or evil-eye vibrations.' },
  { id: 'opportunity', name: 'Opportunity', category: 'wealth', icon: Sun, color: '#CA8A04', description: 'Attracts new career doors, partnerships, and prosperous deals.' },
  { id: 'peace', name: 'Peace', category: 'peace', icon: Moon, color: '#0284C7', description: 'Fosters deep tranquility and harmony in home and spirit.' },
  { id: 'positivity', name: 'Positivity', category: 'peace', icon: Sun, color: '#EAB308', description: 'Clears pessimistic aura and replaces it with optimistic light.' },
  { id: 'power', name: 'Power', category: 'growth', icon: Zap, color: '#B45309', description: 'Strengthens personal authority, leadership, and energetic aura.' },
  { id: 'pregnancy', name: 'Pregnancy', category: 'health', icon: Heart, color: '#DB2777', description: 'Provides nurturing feminine energy, motherly peace, and protective warmth.' },
  { id: 'progress', name: 'Progress', category: 'growth', icon: Compass, color: '#0D9488', description: 'Breaks through stagnant barriers to propel continuous advancement.' },
  { id: 'prosperity', name: 'Prosperity', category: 'wealth', icon: Gem, color: '#D97706', description: 'Ensures long-term wealth, comfort, and luxury living.' },
  { id: 'protection', name: 'Protection', category: 'protection', icon: Shield, color: '#27272A', description: 'Forms a formidable psychic shield against negative forces and jealousy.' },
  { id: 'stability', name: 'Stability', category: 'protection', icon: Shield, color: '#78350F', description: 'Grounds Root Chakra energy for emotional and financial security.' },
  { id: 'strength', name: 'Strength', category: 'growth', icon: Shield, color: '#991B1B', description: 'Provides physical endurance and mental fortitude during tough times.' },
  { id: 'success', name: 'Success', category: 'wealth', icon: Gem, color: '#CA8A04', description: 'Ensures victory in endeavors, exams, ventures, and career goals.' },
  { id: 'wealth', name: 'Wealth', category: 'wealth', icon: Gem, color: '#B45309', description: 'Builds permanent riches, asset accumulation, and luxury abundance.' },
  { id: 'will-power', name: 'Will Power', category: 'growth', icon: Flame, color: '#C2410C', description: 'Empowers disciplined habits, determination, and unshakeable focus.' },
  { id: 'wisdom', name: 'Wisdom', category: 'growth', icon: Moon, color: '#4F46E5', description: 'Expands spiritual intuition, wise decision-making, and ancient knowledge.' },
];

export const EnergyStonesPage = ({ onBackToHome }) => {
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [purposeSearchQuery, setPurposeSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [emailNotify, setEmailNotify] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter 39 purposes list in the sidebar search box
  const filteredSidebarPurposes = useMemo(() => {
    return PURPOSES.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(purposeSearchQuery.toLowerCase());
      const matchesCat = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [purposeSearchQuery, activeCategoryFilter]);

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
    setActiveCategoryFilter('all');
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = emailNotify.trim();
    if (cleanEmail) {
      try {
        await subscribeToLaunch({
          email: cleanEmail,
          purpose: activePurposeObj ? activePurposeObj.name : selectedPurposes.join(', ') || 'General'
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
                  placeholder="Search purpose (Anger, Money...)"
                  value={purposeSearchQuery}
                  onChange={(e) => setPurposeSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FBF9F5] border border-[#EAE0CD] text-xs text-[#2C2623] placeholder-[#A08E76] focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              {/* Category Quick Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All (39)' },
                  { id: 'wealth', label: 'Wealth' },
                  { id: 'health', label: 'Health' },
                  { id: 'peace', label: 'Peace' },
                  { id: 'growth', label: 'Growth' },
                  { id: 'protection', label: 'Shield' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategoryFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-cinzel font-bold tracking-wider transition-colors ${
                      activeCategoryFilter === tab.id
                        ? 'bg-[#2C1F06] text-[#E5C378]'
                        : 'bg-[#F7F2E8] text-[#6B5840] hover:bg-[#EFE7D6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 39 Purpose Checkbox List */}
              <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSidebarPurposes.map((item) => {
                  const isChecked = selectedPurposes.includes(item.name);
                  const IconComp = item.icon;

                  return (
                    <label
                      key={item.id}
                      onClick={() => handleTogglePurpose(item.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#F5EEDC] text-[#2C1F06] font-bold border border-[#DAB97B]/60 shadow-sm'
                          : 'hover:bg-[#FDFBF7] text-[#5C4B38]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-[#2C1F06] border-[#2C1F06] text-[#E5C378]' : 'border-[#D1C2A5] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-cinzel">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <IconComp className="w-3 h-3 opacity-60" style={{ color: item.color }} />
                      </div>
                    </label>
                  );
                })}
              </div>

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
                  {activePurposeObj ? activePurposeObj.description : (
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

            {/* Purpose Highlights Grid (Overview of benefits) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE0CD] shadow-sm">
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-[#2C2623] mb-6 text-center">
                Why Shraviko Energy Stones & Accessories?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-2xl bg-[#FDFAF5] border border-[#EAE0CD]">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#F5EEDC] text-[#B8860B] flex items-center justify-center mb-3">
                    <Gem className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel font-bold text-xs text-[#2C2623] mb-1">100% Certified Natural</h4>
                  <p className="text-[11px] text-[#7A6750] font-light">
                    Unheated, untreated Grade-A natural gemstones sourced directly from sacred origin mines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFAF5] border border-[#EAE0CD]">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#F5EEDC] text-[#B8860B] flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel font-bold text-xs text-[#2C2623] mb-1">Vedic Consecration</h4>
                  <p className="text-[11px] text-[#7A6750] font-light">
                    Purified with holy Ganga Jal and infused with intention-specific Vedic mantras prior to dispatch.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFAF5] border border-[#EAE0CD]">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#F5EEDC] text-[#B8860B] flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-cinzel font-bold text-xs text-[#2C2623] mb-1">Intention Aligned</h4>
                  <p className="text-[11px] text-[#7A6750] font-light">
                    Tailored for specific life goals — Wealth, Peace, Anxiety Relief, Health & Spiritual Growth.
                  </p>
                </div>
              </div>
            </div>

          </main>

        </div>
      </div>

    </div>
  );
};
