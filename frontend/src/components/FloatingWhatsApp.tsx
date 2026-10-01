import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '15872257342',
  defaultMessage = '¡Hola Fire Tour DR! 🌴 Estoy viendo las excursiones en firetourdr.com y quiero información sobre reservas y disponibilidad.'
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Show a gentle greeting bubble after 4 seconds to encourage interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    const encoded = encodeURIComponent(defaultMessage);
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Tooltip Prompt */}
      {hasPrompted && !isOpen && (
        <div className="mb-3 hidden sm:flex items-center gap-2 bg-gray-950/95 text-white border border-emerald-500/30 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-bold text-gray-200">
            ¿Dudas con tu tour? <span className="text-emerald-400 font-extrabold">¡Escríbenos en vivo!</span>
          </p>
          <button 
            onClick={() => setHasPrompted(false)}
            className="text-gray-400 hover:text-white ml-1 p-0.5"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Quick Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 bg-gray-950/95 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
                  🔥
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-700 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Fire Tour DR <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  Atención en línea · Punta Cana
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-900/60 text-xs text-gray-300 space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-slate-200 leading-relaxed">
              👋 ¡Hola! Te ayudamos a reservar las mejores excursiones de Punta Cana (**Isla Saona VIP**, **Buggies**, **Parasailing** y **Traslados**).
            </div>
            <p className="text-[11px] text-gray-400 text-center font-medium">
              ⚡ Respuesta inmediata por WhatsApp
            </p>
          </div>

          {/* Action Button */}
          <div className="p-3 bg-gray-950 border-t border-white/5">
            <button
              onClick={handleSendMessage}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-[#25D366]/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              Iniciar Chat en WhatsApp
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-60 pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white text-transparent group-hover:scale-105 transition-transform" />
      </button>
    </div>
  );
}
