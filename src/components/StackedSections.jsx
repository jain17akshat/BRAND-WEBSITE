import React, { useEffect, useRef } from 'react';

/**
 * StackedSections Component
 * Reusable full-viewport section stacking wrapper component.
 * Pins each 100vh section at top: 0 while the next section glides up and covers it completely.
 */
export function StackedSections({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const cardElements = containerRef.current?.querySelectorAll('.stacked-card');
    if (!cardElements || cardElements.length === 0) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      cardElements.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const inner = card.querySelector('.stacked-inner');
        
        if (inner) {
          // Calculate how far into view the card is (0 to 1)
          const progress = Math.min(Math.max((vh - rect.top) / vh, 0), 1);
          const scale = 0.95 + progress * 0.05; // Smooth scale from 0.95 -> 1.0
          const opacity = 0.9 + progress * 0.1; // Smooth opacity from 0.9 -> 1.0

          inner.style.transform = `scale(${scale})`;
          inner.style.opacity = `${opacity}`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [children]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#FBF9F5]">
      {React.Children.map(children, (child, index) => {
        if (!child) return null;

        // Ascending z-index so subsequent sections layer over previous ones (1, 2, 3...)
        const zIndex = index + 1;

        return (
          <div
            key={index}
            className="stacked-card sticky top-0 w-full min-h-screen flex flex-col justify-center overflow-hidden"
            style={{
              zIndex,
              willChange: 'transform'
            }}
          >
            <div
              className="stacked-inner w-full transition-transform duration-150 ease-out"
              style={{
                willChange: 'transform, opacity',
                transformOrigin: 'center center'
              }}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StackedSections;
