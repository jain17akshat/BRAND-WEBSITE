import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export const ProductImage = ({ src, hoverSrc, images, alt, artType = 'brass', className = '', aspect = 'aspect-square', fitMode }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (hoverSrc && hoverSrc !== src) return [src, hoverSrc];
    return [src];
  }, [src, hoverSrc, images]);

  React.useEffect(() => {
    let timer;
    if (isHovered && imageList.length > 1) {
      timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % imageList.length);
      }, 1200);
    } else {
      setActiveIndex(0);
    }
    return () => clearInterval(timer);
  }, [isHovered, imageList]);

  const isContain = fitMode === 'contain' || (src && (src.includes('brass bells') || src.includes('brass%20bells') || src.includes('garud bell') || src.includes('garud%20bell') || src.includes('nandi bell') || src.includes('nandi%20bell') || src.includes('simple bell') || src.includes('simple%20bell') || src.includes('commonbell') || src.includes('Wooden Choki') || src.includes('Wooden%20Choki') || src.includes('pyramid') || src.includes('pyramid%20') || src.includes('Trishul') || src.includes('trishul') || src.includes('Brass aarti') || src.includes('Brass%20aarti') || src.includes('aarti') || src.includes('akhand jyot') || src.includes('akhand%20jyot') || src.includes('Cup jyot') || src.includes('Cup%20jyot') || src.includes('cup') || src.includes('kamandal') || src.includes('Brass kamandal') || src.includes('Brass%20kamandal') || src.includes('pancpatra') || src.includes('pancpatra set') || src.includes('pancpatra%20set') || src.includes('patra') || src.includes('thali') || src.includes('Brass thali') || src.includes('Brass%20thali') || src.includes('Copper thali') || src.includes('Copper%20thali') || src.includes('gomukhi') || src.includes('shringi') || src.includes('singhasan') || src.includes('sighasan') || src.includes('hawankund') || src.includes('kund') || src.includes('chawar') || src.includes('chawr') || src.includes('Jap Bag') || src.includes('Jap%20Bag') || src.includes('bag') || src.includes('mala counter') || src.includes('mala%20counter') || src.includes('counter') || src.includes('Pooja box') || src.includes('Pooja%20box') || src.includes('poobjabox') || src.includes('poojabox') || src.includes('Shankh') || src.includes('shankh') || src.includes('Velvet asan') || src.includes('Velvet%20asan') || src.includes('asan') || src.includes('Ganeshyantra') || src.includes('Ganesh') || src.includes('Glassyantra') || src.includes('glass') || src.includes('Kuber yantra') || src.includes('kuber') || src.includes('laxmi') || src.includes('luxmiyantra') || src.includes('luxmi') || src.includes('shani') || src.includes('ladoo') || src.includes('gopal') || src.includes('kamdhenu') || src.includes('ganeshji') || src.includes('radhakrishna') || src.includes('krishna') || src.includes('glassturtle') || src.includes('turtle') || src.includes('dhoop dani') || src.includes('dhoopdani') || src.includes('glass shivling') || src.includes('shivling') || src.includes('rudraksh') || src.includes('sphatik') || src.includes('tulsi') || src.includes('vaijanti') || src.includes('karungali') || src.includes('Damru') || src.includes('damru') || src.includes('mala')));

  // If source image exists and hasn't errored
  if (src && !imgError) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden ${aspect} ${className} ${isContain ? 'bg-[#F9F6F0]' : ''}`}
      >
        {imageList.map((imgSrc, idx) => (
          <img
            key={imgSrc + idx}
            src={imgSrc}
            alt={alt || 'Shraviko Sacred Product'}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className={`w-full h-full transition-all duration-700 ${
              idx === activeIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100 absolute inset-0'
            } ${isContain ? 'object-contain p-2 sm:p-3' : 'object-cover'}`}
          />
        ))}

        {/* Slide Indicator Dots on Hover */}
        {imageList.length > 1 && isHovered && (
          <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
            {imageList.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === activeIndex ? 'w-3.5 bg-[#C5A059]' : 'w-1.5 bg-black/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }


  // Premium Vector / Geometric Brass Artwork Fallback Frame
  const getArtIcon = () => {
    switch (artType) {
      case 'diya':
        return (
          <svg className="w-20 h-20 text-[#B8934A]" viewBox="0 0 100 100" fill="none">
            {/* Diya Oil Lamp Vector */}
            <path d="M50 15 C52 25, 60 32, 50 45 C40 32, 48 25, 50 15 Z" fill="url(#flameGrad)" />
            <path d="M20 52 C20 70, 80 70, 80 52 C70 58, 30 58, 20 52 Z" fill="url(#brassGrad)" stroke="#755722" strokeWidth="1.5" />
            <ellipse cx="50" cy="52" rx="30" ry="6" fill="#967433" opacity="0.6" />
            <path d="M35 70 L65 70 L60 82 L40 82 Z" fill="url(#brassGrad)" />
          </svg>
        );
      case 'thali':
        return (
          <svg className="w-24 h-24 text-[#B8934A]" viewBox="0 0 100 100" fill="none">
            {/* Pooja Thali Motif */}
            <circle cx="50" cy="50" r="42" stroke="url(#brassGrad)" strokeWidth="3" fill="#F4EAD6" />
            <circle cx="50" cy="50" r="36" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            {/* Small bowls */}
            <circle cx="36" cy="40" r="8" fill="url(#brassGrad)" stroke="#755722" strokeWidth="1" />
            <circle cx="64" cy="40" r="8" fill="url(#brassGrad)" stroke="#755722" strokeWidth="1" />
            <circle cx="50" cy="65" r="10" fill="url(#brassGrad)" stroke="#755722" strokeWidth="1" />
            <path d="M50 32 L52 38 L58 38 L53 42 L55 48 L50 44 L45 48 L47 42 L42 38 L48 38 Z" fill="#C5A059" />
          </svg>
        );
      case 'copper':
        return (
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            {/* Copper Pitcher */}
            <path d="M35 30 L65 30 L70 75 C70 82, 30 82, 30 75 Z" fill="url(#copperGrad)" stroke="#8C3F27" strokeWidth="1.5" />
            <ellipse cx="50" cy="30" rx="15" ry="4" fill="#B85D3B" />
            <path d="M68 38 C80 38, 80 65, 66 68" stroke="url(#copperGrad)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'incense':
        return (
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            {/* Incense Wisps & Holder */}
            <path d="M30 75 L70 75 C70 80, 30 80, 30 75 Z" fill="url(#brassGrad)" />
            <line x1="45" y1="75" x2="65" y2="25" stroke="#4A3525" strokeWidth="2" strokeLinecap="round" />
            <path d="M65 25 C62 18, 70 14, 66 8" stroke="#D9C7A5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M68 20 C74 15, 67 10, 72 4" stroke="#D9C7A5" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        );
      case 'yantra':
        return (
          <svg className="w-22 h-22" viewBox="0 0 100 100" fill="none">
            {/* Sacred Geometry Sri Yantra Frame */}
            <rect x="12" y="12" width="76" height="76" stroke="url(#brassGrad)" strokeWidth="2" fill="#F8F1E3" />
            <circle cx="50" cy="50" r="32" stroke="#C5A059" strokeWidth="1" />
            <polygon points="50,22 76,68 24,68" stroke="#967433" strokeWidth="1.5" fill="none" />
            <polygon points="50,78 76,32 24,32" stroke="#967433" strokeWidth="1.5" fill="none" />
            <polygon points="50,30 68,62 32,62" stroke="#C5A059" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="3" fill="#B8934A" />
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 text-[#B8934A]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="36" stroke="url(#brassGrad)" strokeWidth="2" />
            <path d="M50 25 C60 38, 75 50, 50 75 C25 50, 40 38, 50 25 Z" fill="#EAE0CD" stroke="#C5A059" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden product-art-bg ${aspect} ${className} flex flex-col items-center justify-center p-6 border border-[#EAE0CD] group`}>
      {/* SVG Gradients Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C378" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#8C6929" />
          </linearGradient>
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D98064" />
            <stop offset="50%" stopColor="#B85D3B" />
            <stop offset="100%" stopColor="#78341D" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative Gold Corner Frames */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C5A059]/40"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C5A059]/40"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C5A059]/40"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C5A059]/40"></div>

      {/* Center Artwork Icon */}
      <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 flex items-center justify-center drop-shadow-md">
        {getArtIcon()}
      </div>

      {/* Subtle Label */}
      <div className="mt-3 text-center z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase font-cinzel text-[#967433] bg-[#FAF5EB] px-2.5 py-0.5 rounded border border-[#E0D2B8]">
          Shraviko Heritage Artwork
        </span>
      </div>

      {/* Hover Instruction Overlay for User */}
      <div className="absolute inset-0 bg-[#2C2623]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white z-20">
        <ImageIcon className="w-6 h-6 text-[#E5C378] mb-2" />
        <span className="text-xs font-serif text-[#F2EBDC] tracking-wide mb-1">Add Product Image</span>
        <span className="text-[10px] text-gray-300 max-w-[180px] leading-tight">
          Pass image URL in <code className="text-[#E5C378]">products.js</code> to replace placeholder
        </span>
      </div>
    </div>
  );
};
