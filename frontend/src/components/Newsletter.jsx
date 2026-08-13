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
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Box */}
        <div className="bg-[#231E1C] text-[#F9F5EC] rounded-2xl p-6 sm:p-10 lg:p-14 border border-[#C5A059]/40 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A3431] text-[#E5C378] text-xs font-cinzel tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Join The Sacred Circle</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F9F5EC]">
              Receive 10% Off Your First Ritual Box
            </h2>

            <p className="text-xs sm:text-sm text-[#EAE0CD] font-sans font-light max-w-lg mx-auto leading-relaxed">
              Subscribe to receive private seasonal collection previews, Vedic ritual guide journals, and exclusive brass artisan stories.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-[#2A2421] text-[#F9F5EC] placeholder-gray-400 text-xs font-sans rounded-md border border-[#3A3431] focus:border-[#C5A059] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] text-[#171312] font-cinzel text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#E5C378] transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <span className="text-[10px] text-gray-400 block pt-2">
              We respect your privacy. Unsubscribe at any time with one click.
            </span>
          </div>

        </div>

        {/* Instagram Visual Showcase */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAE0CD]">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-widest text-[#8C6929]">#ShravikoHomeSanctuary</span>
              <h3 className="text-2xl font-cinzel font-bold text-[#2C2623]">
                Follow Us @ShravikoSacredLiving
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-cinzel uppercase tracking-wider text-[#C5A059] hover:text-[#967433] font-semibold flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">View Instagram</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instaPosts.map((post, idx) => (
              <div key={idx} className="group relative rounded-xl overflow-hidden shadow-sm border border-[#EAE0CD] cursor-pointer">
                <ProductImage
                  src=""
                  alt={post.title}
                  artType={post.artType}
                  aspect="aspect-square"
                />
                <div className="absolute inset-0 bg-[#231E1C]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                  <Instagram className="w-6 h-6 text-[#E5C378] mb-1" />
                  <span className="text-xs font-cinzel text-[#F9F5EC]">{post.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
