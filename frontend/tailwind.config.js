/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['clamp(0.6rem, 0.55rem + 0.25vw, 0.7rem)', { lineHeight: '1.2' }],
        'xs': ['clamp(0.6875rem, 0.65rem + 0.3vw, 0.75rem)', { lineHeight: '1.4' }],
        'sm': ['clamp(0.78125rem, 0.72rem + 0.4vw, 0.875rem)', { lineHeight: '1.45' }],
        'base': ['clamp(0.875rem, 0.8rem + 0.5vw, 1rem)', { lineHeight: '1.5' }],
        'lg': ['clamp(1rem, 0.9rem + 0.6vw, 1.125rem)', { lineHeight: '1.5' }],
        'xl': ['clamp(1.125rem, 0.98rem + 0.8vw, 1.25rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.25rem, 1.05rem + 1.1vw, 1.5rem)', { lineHeight: '1.35' }],
        '3xl': ['clamp(1.5rem, 1.2rem + 1.6vw, 1.875rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(1.75rem, 1.35rem + 2.2vw, 2.25rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(2rem, 1.45rem + 3vw, 3rem)', { lineHeight: '1.15' }],
        '6xl': ['clamp(2.35rem, 1.6rem + 4vw, 3.75rem)', { lineHeight: '1.1' }],
      },
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F2EBDC',
          300: '#E8DDC6',
          400: '#D9C7A5',
        },
        charcoal: {
          50: '#4A4441',
          100: '#3A3431',
          800: '#231E1C',
          900: '#171312',
        },
        brass: {
          100: '#FAF0D9',
          200: '#EAD7AF',
          300: '#DAB97B',
          400: '#C5A059',
          500: '#B8934A',
          600: '#967433',
          700: '#755722',
        },
        sacred: {
          vermilion: '#A63A2B',
          saffron: '#D97706',
          copper: '#B85D3B',
          sandal: '#D4A373',
          teak: '#4A3525'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Cinzel', 'Georgia', 'serif'],
        heading: ['Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'brass-sm': '0 2px 8px rgba(197, 160, 89, 0.15)',
        'brass-md': '0 4px 20px rgba(197, 160, 89, 0.2)',
        'luxury': '0 10px 30px -5px rgba(23, 19, 18, 0.08)',
        'drawer': '-10px 0 40px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bg-pan-slow': 'bgPan 30s linear infinite',
        'golden-shimmer-sweep': 'goldenShimmerSweep 6s ease-in-out infinite',
        'float-sparkle-1': 'floatSparkle1 5s ease-in-out infinite',
        'float-sparkle-2': 'floatSparkle2 7s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        bgPan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        goldenShimmerSweep: {
          '0%': { transform: 'translateX(-120%) rotate(15deg)', opacity: '0' },
          '30%': { opacity: '1' },
          '70%': { opacity: '0.8' },
          '100%': { transform: 'translateX(350%) rotate(15deg)', opacity: '0' },
        },
        floatSparkle1: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-18px) scale(1.3)', opacity: '1' },
        },
        floatSparkle2: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.5' },
          '50%': { transform: 'translateY(-24px) scale(1.5)', opacity: '0.9' },
        },
      }
    },
  },
  plugins: [],
}
