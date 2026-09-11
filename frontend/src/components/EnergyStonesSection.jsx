import React, { useState } from 'react';
import { subscribeToLaunch } from '../services/api';
import { SafeImage } from './SafeImage';
import {
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
  Lock,
  Hourglass
} from 'lucide-react';

// The 39 purposes extracted from the user's reference image
export const PURPOSES = [
  { id: 'abundance', name: 'Abundance', category: 'wealth', icon: Sun, color: 'from-amber-500/20 to-yellow-600/20', accent: '#D4AF37' },
  { id: 'anger', name: 'Anger', category: 'peace', icon: Flame, color: 'from-rose-500/20 to-orange-600/20', accent: '#E05A47' },
  { id: 'anxiety', name: 'Anxiety', category: 'peace', icon: Moon, color: 'from-indigo-500/20 to-blue-600/20', accent: '#5B76C7' },
  { id: 'calm', name: 'Calm', category: 'peace', icon: Leaf, color: 'from-teal-500/20 to-emerald-600/20', accent: '#3B9A82' },
  { id: 'concentration', name: 'Concentration', category: 'growth', icon: Compass, color: 'from-cyan-500/20 to-blue-600/20', accent: '#2B8BB8' },
  { id: 'communication-skills', name: 'Communication Skills', category: 'growth', icon: Zap, color: 'from-sky-500/20 to-indigo-600/20', accent: '#3B82F6' },
  { id: 'confidence', name: 'Confidence', category: 'growth', icon: Shield, color: 'from-amber-600/20 to-orange-500/20', accent: '#D97706' },
  { id: 'courage', name: 'Courage', category: 'growth', icon: Flame, color: 'from-red-500/20 to-amber-600/20', accent: '#DC2626' },
  { id: 'creativity', name: 'Creativity', category: 'growth', icon: Sparkles, color: 'from-purple-500/20 to-pink-600/20', accent: '#9333EA' },
  { id: 'depression', name: 'Depression', category: 'peace', icon: Sun, color: 'from-yellow-400/20 to-amber-500/20', accent: '#EAB308' },
  { id: 'education', name: 'Education', category: 'growth', icon: Compass, color: 'from-blue-500/20 to-teal-600/20', accent: '#0284C7' },
  { id: 'focus', name: 'Focus', category: 'growth', icon: Compass, color: 'from-emerald-500/20 to-teal-600/20', accent: '#059669' },
  { id: 'fortune', name: 'Fortune', category: 'wealth', icon: Gem, color: 'from-amber-500/20 to-yellow-500/20', accent: '#B45309' },
  { id: 'good-luck', name: 'Good Luck', category: 'wealth', icon: Sparkles, color: 'from-green-500/20 to-emerald-600/20', accent: '#16A34A' },
  { id: 'growth', name: 'Growth', category: 'growth', icon: Leaf, color: 'from-emerald-500/20 to-green-600/20', accent: '#15803D' },
  { id: 'happiness', name: 'Happiness', category: 'peace', icon: Sun, color: 'from-yellow-400/20 to-orange-400/20', accent: '#F59E0B' },
  { id: 'healing', name: 'Healing', category: 'health', icon: Heart, color: 'from-emerald-400/20 to-teal-500/20', accent: '#10B981' },
  { id: 'health', name: 'Health', category: 'health', icon: Heart, color: 'from-rose-400/20 to-emerald-500/20', accent: '#059669' },
  { id: 'joy', name: 'Joy', category: 'peace', icon: Sun, color: 'from-amber-400/20 to-pink-500/20', accent: '#F59E0B' },
  { id: 'love', name: 'Love', category: 'peace', icon: Heart, color: 'from-rose-500/20 to-pink-600/20', accent: '#E11D48' },
  { id: 'luck', name: 'Luck', category: 'wealth', icon: Gem, color: 'from-amber-500/20 to-emerald-600/20', accent: '#D97706' },
  { id: 'meditation', name: 'Meditation', category: 'peace', icon: Moon, color: 'from-violet-500/20 to-purple-600/20', accent: '#7C3AED' },
  { id: 'money', name: 'Money', category: 'wealth', icon: Gem, color: 'from-emerald-500/20 to-amber-500/20', accent: '#047857' },
  { id: 'motivation', name: 'Motivation', category: 'growth', icon: Zap, color: 'from-orange-500/20 to-red-600/20', accent: '#EA580C' },
  { id: 'negativity', name: 'Negativity', category: 'protection', icon: Shield, color: 'from-stone-600/20 to-zinc-800/20', accent: '#44403C' },
  { id: 'opportunity', name: 'Opportunity', category: 'wealth', icon: Sun, color: 'from-amber-500/20 to-yellow-600/20', accent: '#CA8A04' },
  { id: 'peace', name: 'Peace', category: 'peace', icon: Moon, color: 'from-sky-400/20 to-indigo-500/20', accent: '#0284C7' },
  { id: 'positivity', name: 'Positivity', category: 'peace', icon: Sun, color: 'from-yellow-400/20 to-amber-500/20', accent: '#EAB308' },
  { id: 'power', name: 'Power', category: 'growth', icon: Zap, color: 'from-amber-600/20 to-red-600/20', accent: '#B45309' },
  { id: 'pregnancy', name: 'Pregnancy', category: 'health', icon: Heart, color: 'from-pink-400/20 to-rose-400/20', accent: '#DB2777' },
  { id: 'progress', name: 'Progress', category: 'growth', icon: Compass, color: 'from-teal-500/20 to-cyan-600/20', accent: '#0D9488' },
  { id: 'prosperity', name: 'Prosperity', category: 'wealth', icon: Gem, color: 'from-amber-500/20 to-yellow-600/20', accent: '#D97706' },
  { id: 'protection', name: 'Protection', category: 'protection', icon: Shield, color: 'from-zinc-700/20 to-stone-900/20', accent: '#27272A' },
  { id: 'stability', name: 'Stability', category: 'protection', icon: Shield, color: 'from-amber-800/20 to-stone-700/20', accent: '#78350F' },
  { id: 'strength', name: 'Strength', category: 'growth', icon: Shield, color: 'from-red-600/20 to-stone-800/20', accent: '#991B1B' },
  { id: 'success', name: 'Success', category: 'wealth', icon: Gem, color: 'from-amber-500/20 to-emerald-600/20', accent: '#CA8A04' },
  { id: 'wealth', name: 'Wealth', category: 'wealth', icon: Gem, color: 'from-yellow-500/20 to-amber-600/20', accent: '#B45309' },
  { id: 'will-power', name: 'Will Power', category: 'growth', icon: Flame, color: 'from-orange-600/20 to-red-600/20', accent: '#C2410C' },
  { id: 'wisdom', name: 'Wisdom', category: 'growth', icon: Moon, color: 'from-indigo-600/20 to-violet-700/20', accent: '#4F46E5' },
];

export const EnergyStonesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [selectedPurposeModal, setSelectedPurposeModal] = useState(null);
  const [emailNotify, setEmailNotify] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(() => localStorage.getItem('shraviko_energy_vip_subscribed') === 'true');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter logic
  const filteredPurposes = PURPOSES.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = emailNotify.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setIsSubmitting(true);
    try {
      await subscribeToLaunch({
        email: cleanEmail,
        purpose: selectedPurposeModal ? selectedPurposeModal.name : 'Energy Stones Section'
      });
      localStorage.setItem('shraviko_energy_vip_subscribed', 'true');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedPurposeModal(null);
      }, 3000);
    } catch (err) {
      console.warn('Backend subscription logged:', err.message);
      localStorage.setItem('shraviko_energy_vip_subscribed', 'true');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedPurposeModal(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="energy-stones" className="py-16 sm:py-24 bg-[#FDFAF5] border-b border-[#EAE0CD] relative overflow-hidden select-none">
      
      {/* Background Sacred Geometric Aura */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none -mr-20 -mt-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, #C5A059 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 opacity-10 pointer-events-none -ml-20 -mb-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, #967433 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 scroll-reveal-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EEDC] border border-[#DAB97B]/50 text-[#8C6D2D] mb-4 shadow-sm">
            <Gem className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.2em] uppercase">
              Energy Stones & Accessories
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#2C2623] tracking-wide mb-4 heading-gold-line">
            Harmonize Your Mind, Body & Spirit
          </h2>
          
          <p className="text-sm sm:text-base text-[#6B5840] font-light leading-relaxed">
            Hand-curated 100% natural healing gemstones, sacred orgone pyramids, and energized crystal accessories aligned with ancient Vedic frequencies.
          </p>
        </div>

        {/* ── HERO SHOWCASE BANNER ── */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#EAE0CD] bg-[#F4EFE6] mb-10 h-[220px] sm:h-[300px] lg:h-[340px]">
          {/* Mobile View Image */}
          <div className="block sm:hidden absolute inset-0 w-full h-full">
            <SafeImage
              src="/energystones mobile view.png"
              alt="Energy Stones & Crystal Bracelets"
              dark={true}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-center hero-image-crisp transform hover:scale-105 transition-transform duration-1000"
            />
          </div>
          {/* Desktop View Image */}
          <div className="hidden sm:block absolute inset-0 w-full h-full">
            <SafeImage
              src="/braclet desktopview.png"
              alt="Energy Stones & Crystal Bracelets"
              dark={true}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-center hero-image-crisp transform hover:scale-105 transition-transform duration-1000"
            />
          </div>
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1715]/90 via-[#1C1715]/60 to-transparent sm:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1715]/80 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 text-white z-10 max-w-xl">
            <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.3em] text-[#C5A059] uppercase font-bold mb-2">
              Sacred Gemstones & Bracelets
            </span>
            <h3 className="font-cinzel font-bold text-white text-xl sm:text-3xl lg:text-4xl leading-tight mb-2 drop-shadow">
              Crystal Bracelets & Mala Stones
            </h3>
            <p className="text-xs sm:text-sm text-[#E5D7C0] font-light leading-relaxed hidden sm:block">
              Consecrated natural crystals, healing orgone pyramids, and 100% authentic gemstone japa malas purified for your personal intention.
            </p>
          </div>
        </div>

      </div>

      {/* ── COMING SOON STAY TUNED MODAL ── */}
      {selectedPurposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl border border-[#DAB97B] p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPurposeModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5EEDC] text-[#3D2B1F] hover:bg-[#E8D9B8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F7F2E6] border border-[#DAB97B] flex items-center justify-center text-[#B8860B] mb-4 shadow-inner">
                <Gem className="w-7 h-7 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EEDC] text-[#7A5A1B] text-[10px] font-cinzel font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
                <span>Coming Soon • Stay Tuned</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#2C2623]">
                {selectedPurposeModal.name} Energy Stones
              </h3>
              
              <p className="text-xs sm:text-sm text-[#6B5840] font-light mt-2 leading-relaxed">
                We are currently hand-selecting and energizing our 100% natural crystal bracelets, mala stones, and orgone pyramids specifically crafted for <span className="font-semibold text-[#8C6D2D]">{selectedPurposeModal.name}</span>.
              </p>
            </div>

            {/* Notify Form */}
            {isSubmitted ? (
              <div className="mt-6 p-4 rounded-2xl bg-[#E8F5E9] border border-emerald-300 text-center text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You're on the VIP list! We will notify you first on launch.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="mt-6 space-y-3">
                <label className="block text-xs font-cinzel text-[#5C4B38] font-bold text-center">
                  Be the first to know when this collection drops:
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EAE0CD] text-xs text-[#2C2623] placeholder-[#A08E76] focus:outline-none focus:border-[#B8860B] shadow-inner disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] text-xs font-cinzel font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 border border-[#E5C378]/40 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Hourglass className="w-4 h-4 animate-spin text-[#E5C378]" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Registering...' : 'Notify Me On Launch'}</span>
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-[10px] text-[#A08E76] font-light">
                ✦ 100% Authentic Gemstones ✦ Vedic Energized ✦ Worldwide Dispatch
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
