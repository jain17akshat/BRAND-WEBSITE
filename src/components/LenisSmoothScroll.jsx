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
    // Disable browser default scroll restoration to avoid starting at bottom on navigation
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Add official Lenis HTML classes
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    const lerpFactor = 0.1; // Optimal responsiveness without lag

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

    // Track native window scroll (e.g. window.scrollTo(0,0) or programmatic page jumps)
    const onNativeScroll = () => {
      const actualY = window.scrollY;
      // If external code reset scroll (e.g. to 0 on page change)
      if (Math.abs(actualY - scrollRef.current.current) > 30) {
        scrollRef.current.current = actualY;
        scrollRef.current.target = actualY;
      }
    };

    const updateScroll = () => {
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

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
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
      window.removeEventListener('scroll', onNativeScroll);
      document.removeEventListener('click', onAnchorClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [options.smoothWheel]);

  const scrollTo = (target, opts = {}) => {
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
    const finalTop = Math.min(Math.max(top, 0), Math.max(maxScroll, 0));

    scrollRef.current.target = finalTop;
    if (opts.immediate) {
      scrollRef.current.current = finalTop;
      window.scrollTo(0, finalTop);
    }
  };

  return (
    <LenisContext.Provider value={{ ...lenisState, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};
