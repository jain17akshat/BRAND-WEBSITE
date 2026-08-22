import React from 'react';

/* ── Keyframes injected once ─────────────────────────────────────────────── */
const STYLE = `
  @keyframes cw  { to { transform: rotate(360deg);  } }
  @keyframes ccw { to { transform: rotate(-360deg); } }
  @keyframes bob {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(180deg); }
  }
`;

/* ── Chakra Wheel ─────────────────────────────────────────────────────────── */
function Chakra({ size = 160, top, left, right, bottom, speed = '22s', reverse = false, delay = '0s' }) {
  const pos = {};
  if (top !== undefined) pos.top = top;
  if (left !== undefined) pos.left = left;
  if (right !== undefined) pos.right = right;
  if (bottom !== undefined) pos.bottom = bottom;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 2,
      pointerEvents: 'none',
      ...pos,
    }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        style={{
          animation: `${reverse ? 'ccw' : 'cw'} ${speed} linear infinite`,
          animationDelay: delay,
          opacity: 0.18,
          color: '#B8860B',
          filter: 'drop-shadow(0 0 6px rgba(197,160,89,0.5))',
        }}
      >
        {/* Outer dashed ring */}
        <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="2" strokeDasharray="8 5" />
        <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="1" />
        {/* 12 spokes */}
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="100" y1="16" x2="100" y2="184"
            stroke="currentColor" strokeWidth="1"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
        {/* 12 lotus petals */}
        {[...Array(12)].map((_, i) => (
          <path key={i}
            d="M100,100 Q116,74 100,50 Q84,74 100,100"
            stroke="currentColor" strokeWidth="1.2" fill="rgba(197,160,89,0.08)"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        {/* Inner rings & hub */}
        <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="14" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="5" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ── Lotus Mandala ───────────────────────────────────────────────────────── */
function Lotus({ size = 160, top, left, right, bottom, speed = '36s', delay = '0s' }) {
  const pos = {};
  if (top !== undefined) pos.top = top;
  if (left !== undefined) pos.left = left;
  if (right !== undefined) pos.right = right;
  if (bottom !== undefined) pos.bottom = bottom;

  return (
    <div style={{ position: 'fixed', zIndex: 2, pointerEvents: 'none', ...pos }}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none"
        style={{
          animation: `cw ${speed} linear infinite`,
          animationDelay: delay,
          opacity: 0.16,
          color: '#C5A059',
          filter: 'drop-shadow(0 0 8px rgba(197,160,89,0.45))',
        }}
      >
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" strokeDasharray="5 7" />
        {[...Array(8)].map((_, i) => (
          <ellipse key={i} cx="100" cy="58" rx="16" ry="46"
            stroke="currentColor" strokeWidth="1.4" fill="rgba(197,160,89,0.06)"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <ellipse key={i} cx="100" cy="70" rx="10" ry="32"
            stroke="currentColor" strokeWidth="0.8" fill="none"
            transform={`rotate(${i * 45 + 22.5} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="8" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ── Sri Yantra / Sacred Hex ─────────────────────────────────────────────── */
function SriYantra({ size = 150, top, left, right, bottom, delay = '0s' }) {
  const pos = {};
  if (top !== undefined) pos.top = top;
  if (left !== undefined) pos.left = left;
  if (right !== undefined) pos.right = right;
  if (bottom !== undefined) pos.bottom = bottom;

  return (
    <div style={{ position: 'fixed', zIndex: 2, pointerEvents: 'none', ...pos }}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none"
        style={{
          animation: `bob 8s ease-in-out infinite`,
          animationDelay: delay,
          opacity: 0.14,
          color: '#D4A017',
          filter: 'drop-shadow(0 0 6px rgba(212,160,23,0.5))',
        }}
      >
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" />
        <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.8" />
        {/* Up triangle */}
        <polygon points="100,18 180,152 20,152"
          stroke="currentColor" strokeWidth="1.8" fill="rgba(212,160,23,0.05)" />
        {/* Down triangle */}
        <polygon points="100,182 20,48 180,48"
          stroke="currentColor" strokeWidth="1.8" fill="rgba(212,160,23,0.05)" />
        {/* Spokes */}
        {[0, 60, 120].map(a => (
          <line key={a} x1="100" y1="8" x2="100" y2="192"
            stroke="currentColor" strokeWidth="0.7"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ── Main exported component ─────────────────────────────────────────────── */
export function HomePageDecorations() {
  return (
    <>
      <style>{STYLE}</style>

      {/* Desktop chakras — edges of viewport */}
      <Chakra size={180} top="18vh" right="12px" speed="22s" />
      <Lotus size={160} top="38vh" left="10px" speed="34s" delay="1s" />
      <SriYantra size={140} top="58vh" right="14px" delay="2s" />
      <Chakra size={150} top="75vh" left="8px" speed="28s" reverse delay="0.5s" />
      <Lotus size={170} top="92vh" right="10px" speed="40s" delay="3s" />
      <Chakra size={160} top="115vh" left="6px" speed="24s" delay="1.5s" />
      <SriYantra size={130} top="135vh" right="8px" delay="4s" />
      <Lotus size={180} top="155vh" left="4px" speed="38s" delay="2.5s" />
      <Chakra size={170} top="175vh" right="6px" speed="20s" reverse delay="0.8s" />
      <SriYantra size={150} top="195vh" left="10px" delay="1.2s" />

      {/* Mobile — smaller, same edges */}
      <Chakra size={70} top="22vh" right="4px" speed="20s" />
      <Lotus size={65} top="55vh" left="2px" speed="32s" delay="2s" />
      <Chakra size={70} top="88vh" right="4px" speed="26s" reverse delay="1s" />
      <Lotus size={65} top="120vh" left="2px" speed="36s" delay="3s" />
    </>
  );
}
