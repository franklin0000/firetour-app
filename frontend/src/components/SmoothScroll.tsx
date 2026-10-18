import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Highly-optimized, responsive smooth scrolling settings
    // Prevents sluggish wheel locking, preserves horizontal wheel/trackpad scrolling
    const lenis = new Lenis({
      duration: 0.85, // Snappy & natural response, avoids heavy sluggish wheel momentum
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth expoOut
      orientation: 'vertical',
      gestureOrientation: 'vertical', // Let horizontal gestures pass through naturally
      smoothWheel: true,
      wheelMultiplier: 1.15, // Immediate response to mouse wheel rotation
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Keep Lenis in sync with dynamic DOM height changes (async tour loading, images, etc.)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const onWindowResize = () => lenis.resize();
    window.addEventListener('resize', onWindowResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onWindowResize);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = undefined;
    };
  }, []);

  // When route changes, immediately reset scroll to top (0,0) and recalculate layout
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    }
  }, [location.pathname]);

  return <>{children}</>;
}
