import React, { useEffect, useRef } from 'react';

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
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, []);

  return (
    <div className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md ${className}`}>
      <span className="mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Publicidad</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-7206413484396748"
        {...(slot && slot !== 'default' ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
