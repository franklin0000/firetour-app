import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShieldCheck, Tag } from 'lucide-react';

export default function TopPromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ftdr_promo_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('ftdr_promo_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white text-[11px] sm:text-xs font-bold py-1.5 px-3 relative z-50 flex items-center justify-center shadow-md">
      <div className="flex items-center gap-2 flex-wrap justify-center text-center">
        <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold">
          <Sparkles className="w-3 h-3 text-amber-300" /> Promoción Especial
        </span>
        <span>
          🌴 ¡Reserva online en <strong>Fire Tour DR</strong> con confirmación inmediata, cancelación gratuita y <strong>10% OFF</strong> con el código <span className="underline bg-white/20 px-1.5 py-0.2 rounded font-black tracking-wider">FIRE10</span>!
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-white/90">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Pago seguro con Stripe
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-full transition"
        title="Ocultar aviso"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
