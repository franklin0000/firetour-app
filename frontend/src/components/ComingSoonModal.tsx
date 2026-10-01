import React from 'react';
import { X, Plane, Hotel, Car, CheckCircle2, Compass, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleExploreTours = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative z-10 w-full max-w-2xl bg-surface/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/40 text-secondary text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 shadow-sm">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>Próximamente · Coming Soon</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight leading-tight mb-3">
          Vuelos, Hoteles y Rent-a-Car <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">
            Disponibles Brevemente
          </span>
        </h2>

        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto mb-8 font-medium">
          Estamos completando la integración oficial con aerolíneas y cadenas hoteleras para ofrecerte la emisión directa al mejor precio garantizado y sin intermediarios.
        </p>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 text-left">
          
          {/* Card 1: Flights */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan mb-3">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-black text-sm text-white font-display">Vuelos</span>
                <span className="text-[9px] bg-secondary/20 text-secondary font-black px-2 py-0.5 rounded-full uppercase">Soon</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">Conexión directa GDS e IATA en homologación final.</p>
            </div>
          </div>

          {/* Card 2: Hotels */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-black text-sm text-white font-display">Hoteles</span>
                <span className="text-[9px] bg-secondary/20 text-secondary font-black px-2 py-0.5 rounded-full uppercase">Soon</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">Resorts all-inclusive en Punta Cana y el Caribe.</p>
            </div>
          </div>

          {/* Card 3: Cars */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-3">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-black text-sm text-white font-display">Rent-a-Car</span>
                <span className="text-[9px] bg-secondary/20 text-secondary font-black px-2 py-0.5 rounded-full uppercase">Soon</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">Vehículos y SUVs con entrega en el aeropuerto PUJ.</p>
            </div>
          </div>

        </div>

        {/* 100% Active Guarantee Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs text-gray-200">
            <span className="font-bold text-white block">Excursiones y Traslados 100% Operativos:</span>
            <span>Saona VIP, Buggies Macao, Catamarán, Parasailing y Traslados PUJ activos con pagos seguros por Stripe y confirmación instantánea.</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExploreTours}
            className="flex-1 bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black font-display uppercase tracking-wider text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Compass className="w-4 h-4" /> Ver Excursiones 100% Activas <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold font-display text-xs py-4 px-6 rounded-2xl transition cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
