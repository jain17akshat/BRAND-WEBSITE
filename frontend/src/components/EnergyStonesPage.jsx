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

  // Get details of active selected purpose(s)
  const activePurposeObj = useMemo(() => {
    if (selectedPurposes.length === 1) {
      return PURPOSES.find(p => p.name === selectedPurposes[0]);
    }
    return null;
  }, [selectedPurposes]);

  return (
    <div className="min-h-screen bg-[#FDFAF5] pb-20 text-[#2C2623] select-none">
      
      {/* ── Standard Category Hero Section ── */}
      <section
        className="relative w-full overflow-hidden bg-[#1C1715]"
        style={{ height: '100svh', minHeight: '100vh' }}
      >
        {/* Mobile Image */}
        <img
          src="/energystones mobile view.png"
          alt="Energy Stones & Accessories"
          className="block sm:hidden absolute inset-0 h-full w-full object-cover hero-image-crisp"
          style={{ objectPosition: 'center center' }}
        />

        {/* Desktop Image */}
        <img
          src="/braclet desktopview.png"
          alt="Energy Stones & Accessories"
          className="hidden sm:block absolute inset-0 h-full w-full object-cover hero-image-crisp"
          style={{ objectPosition: 'center center' }}
        />

        {/* Minimal Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* Category Title — Centered in full viewport */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none" style={{ paddingTop: '70px' }}>
          <h1
            className="font-cinzel font-bold text-white tracking-wider uppercase text-center leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 8vw, 5rem)',
              textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            Energy Stones & Bracelets
          </h1>
        </div>
      </section>

      {/* Back to Home Button Below Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#231E1C] hover:bg-[#3A3431] text-[#E5C378] font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] shadow-md transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5C378] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>
      {/* ── Main Container: Pure "Coming Soon" Teaser Showcase ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <main className="space-y-8">
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
                <Gem className="w-10 h-10 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5C378]/20 border border-[#E5C378]/50 text-white text-xs font-cinzel font-bold uppercase tracking-widest">
                <Hourglass className="w-3.5 h-3.5 text-[#E5C378] animate-spin" style={{ animationDuration: '4s' }} />
                <span>Collection Launching Soon • Stay Tuned</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-white tracking-wide leading-tight">
                Sacred Energy Stones & Crystal Bracelets
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-base text-[#D9C49E] font-light leading-relaxed">
                We are hand-selecting 100% authentic gemstones, crystal bracelets, orgone pyramids, and sacred Japa malas purified with Ganga Jal and consecrated with Vedic mantras.
              </p>

              {/* Coming Soon Badge */}
              <div className="pt-6 border-t border-[#E5C378]/30 max-w-md mx-auto flex justify-center">
                <div className="px-6 py-2.5 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/50 text-[#E5C378] font-cinzel font-bold text-xs sm:text-sm uppercase tracking-[0.25em] shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E5C378]" />
                  <span>Coming Soon</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

    </div>
  );
};
