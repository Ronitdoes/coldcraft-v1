'use client';

import { useEffect } from 'react';

export function ViewportFix() {
  useEffect(() => {
    const updateVh = () => {
      // Calculate 1% of the viewport height
      const vh = window.innerHeight * 0.01;
      // Set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial calculation
    updateVh();

    // Re-calculate on resize
    // We use a debounce-like approach or check for significant changes
    // to avoid jitter when the URL bar pops in/out
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only update if width changed (orientation change) 
      // or if height change is significant (not just URL bar)
      if (currentWidth !== lastWidth) {
        updateVh();
        lastWidth = currentWidth;
      }
    };

    window.addEventListener('resize', handleResize);
    // Also listen for orientationchange for better mobile support
    window.addEventListener('orientationchange', updateVh);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, []);

  return null;
}
