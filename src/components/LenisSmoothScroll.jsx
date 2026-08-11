import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const LenisContext = createContext({
  scroll: 0,
  progress: 0,
  direction: 0,
  scrollTo: () => {}
});

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children, options = {} }) => {
  const [lenisState, setLenisState] = useState({ scroll: 0, progress: 0, direction: 0 });
  const scrollRef = useRef({
    current: typeof window !== 'undefined' ? window.scrollY : 0,
    target: typeof window !== 'undefined' ? window.scrollY : 0,
    direction: 0
  });

  const animFrameRef = useRef(null);

  useEffect(() => {
    // Add official Lenis HTML classes
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    // Cubic Ease-Out: (t) => 1 - Math.pow(1 - t, 3)
    const easing = options.easing || ((t) => 1 - Math.pow(1 - t, 3));
    const duration = options.duration || 1.0;
    const lerpFactor = 0.1; // Optimal responsiveness without lag

    let lastTime = performance.now();

    const onWheel = (e) => {
      // Ignore nested scrollable containers (modals, drawers, dropdowns)
      let target = e.target;
      while (target && target !== document.body && target !== document.documentElement) {
        if (
          target.hasAttribute?.('data-lenis-prevent') ||
          target.classList?.contains('overflow-y-auto') ||
          target.classList?.contains('overflow-auto') ||
          target.getAttribute?.('role') === 'dialog'
        ) {
          return; // Preserve native nested container scroll
        }
        target = target.parentElement;
      }

      // Smooth wheel interpolation on desktop
      if (options.smoothWheel !== false) {
        e.preventDefault();
        const delta = e.deltaY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollRef.current.target = Math.min(Math.max(scrollRef.current.target + delta, 0), maxScroll);
      }
    };

    const updateScroll = (now) => {
      const current = scrollRef.current.current;
      const target = scrollRef.current.target;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        const step = diff * lerpFactor;
        scrollRef.current.current += step;
        const newScroll = scrollRef.current.current;
        window.scrollTo(0, newScroll);

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? newScroll / maxScroll : 0;
        const direction = diff > 0 ? 1 : -1;

        setLenisState({
          scroll: newScroll,
          progress: Math.min(Math.max(progress, 0), 1),
          direction
        });
      } else {
        scrollRef.current.current = target;
      }

      animFrameRef.current = requestAnimationFrame(updateScroll);
    };

    // Attach wheel listener only for smooth wheel scrolling
    window.addEventListener('wheel', onWheel, { passive: false });
    animFrameRef.current = requestAnimationFrame(updateScroll);

    // Smooth Anchor Link Handling (#section)
    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          const element = document.querySelector(targetId);
          if (element) {
            e.preventDefault();
            const top = element.getBoundingClientRect().top + window.scrollY;
            scrollRef.current.target = top;
          }
        }
      }
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('click', onAnchorClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const scrollTo = (target) => {
    let top = 0;
    if (typeof target === 'number') {
      top = target;
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) top = el.getBoundingClientRect().top + window.scrollY;
    } else if (target && target.nodeType === 1) {
      top = target.getBoundingClientRect().top + window.scrollY;
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollRef.current.target = Math.min(Math.max(top, 0), maxScroll);
  };

  return (
    <LenisContext.Provider value={{ ...lenisState, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};
