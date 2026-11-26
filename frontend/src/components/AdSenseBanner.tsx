import React, { useEffect, useRef, useState } from 'react';
import { isAppMode } from '../utils/appMode';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}: AdSenseBannerProps) {
  const appMode = isAppMode();
  const adRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  // Reserved container height to prevent CLS (measured live ad expansion: 280px)
  const containerMinHeight = format === 'rectangle' || format === 'fluid' || format === 'auto'
    ? '336px'
    : '140px';
  const insMinHeight = format === 'rectangle' || format === 'fluid' || format === 'auto'
    ? '280px'
    : '90px';

  // Lazy-trigger AdSense request only when user scrolls within 250px (boosts Active View >75%)
  useEffect(() => {
    if (appMode || typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [appMode]);

  useEffect(() => {
    if (appMode || !isVisible || pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, [appMode, isVisible]);

  if (appMode) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{ minHeight: containerMinHeight }}
      className={`my-8 flex flex-col items-center justify-center w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md ${className}`}
    >
      <span className="mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Publicidad</span>
      {isVisible ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: insMinHeight }}
          data-ad-client="ca-pub-7206413484396748"
          {...(slot && slot !== 'default' ? { 'data-ad-slot': slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      ) : (
        <div
          style={{ minHeight: insMinHeight }}
          className="w-full rounded-xl bg-white/5 flex items-center justify-center text-xs text-slate-500"
        >
          Espacio publicitario
        </div>
      )}
    </div>
  );
}
