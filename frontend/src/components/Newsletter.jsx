import React, { useState } from 'react';
import { Mail, Sparkles, Instagram, ArrowRight } from 'lucide-react';
import { ProductImage } from './ProductImage';

export const Newsletter = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onSubscribe(email);
      setEmail('');
    }
  };

  const instaPosts = [
    { title: 'Morning Mandir Lighting', artType: 'diya' },
    { title: 'Kashmir Mogra Cones', artType: 'dhoop' },
    { title: 'Brass Urli Floating Lotus', artType: 'thali' },
    { title: 'Tamra Jal Morning Water', artType: 'copper' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Box in Calm Pastel Blush */}
        <div className="bg-[#FBEAE5] text-[#2C2623] rounded-3xl p-6 sm:p-12 lg:p-16 border border-[#57324F]/15 shadow-sm relative overflow-hidden text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#57324F]/20 text-[#57324F] text-xs font-manrope font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#57324F]" />
              <span>Join The Sacred Circle</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fraunces font-bold text-[#2C2623] leading-tight">
              Receive 10% Off Your First Ritual Box
            </h2>

            <p className="text-xs sm:text-sm text-[#5C4A3E] font-manrope font-light max-w-lg mx-auto leading-relaxed">
              Subscribe to receive private seasonal collection previews, Vedic ritual guide journals, and exclusive brass artisan stories.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-[#7A6B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-white text-[#2C2623] placeholder-[#8A796B] text-xs font-manrope rounded-xl border border-[#EAE0CD] focus:border-[#57324F] focus:ring-2 focus:ring-[#57324F]/15 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white font-manrope text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-md min-h-[48px]"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <span className="text-[11px] text-[#7A6B5D] font-manrope block pt-2">
              We respect your privacy. Unsubscribe at any time with one click.
            </span>
          </div>

        </div>

        {/* Instagram Visual Showcase */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAE0CD]">
            <div>
              <span className="text-xs font-manrope font-semibold tracking-wider text-[#57324F] uppercase">#ShravikoHomeSanctuary</span>
              <h3 className="text-xl sm:text-2xl font-fraunces font-bold text-[#2C2623] mt-0.5">
                Follow Us @ShravikoSacredLiving
              </h3>
            </div>
            <a
              href="https://www.instagram.com/shraviko/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-manrope font-semibold text-[#57324F] hover:text-[#42253C] hover:underline underline-offset-4 flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">View Instagram</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instaPosts.map((post, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/shraviko/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden shadow-xs border border-[#EAE0CD] cursor-pointer block bg-white"
              >
                <ProductImage
                  src=""
                  alt={post.title}
                  artType={post.artType}
                  aspect="aspect-square"
                />
                <div className="absolute inset-0 bg-[#2C2623]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center text-white">
                  <Instagram className="w-6 h-6 text-[#FBEAE5] mb-1" />
                  <span className="text-xs font-manrope text-white font-medium">{post.title}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
