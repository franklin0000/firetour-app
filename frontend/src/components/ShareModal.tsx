import React, { useState } from 'react';
import { Share2, X, Check, Copy, MessageCircle, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  description = 'Descubre las mejores excursiones en Punta Cana con Fire Tour DR.'
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`🌴 ¡Mira esta excursión en Punta Cana con Fire Tour DR!\n\n🔥 ${title}\n${description}\n\n👉 Reserva aquí: `) + encodedUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5 fill-[#25D366] text-transparent" />,
      color: 'hover:bg-[#25D366]/20 border-[#25D366]/30',
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5 text-[#229ED9]" />,
      color: 'hover:bg-[#229ED9]/20 border-[#229ED9]/30',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:bg-[#1877F2]/20 border-[#1877F2]/30',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'Twitter / X',
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:bg-white/20 border-white/30',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}&via=firetourdr`, '_blank');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in" onClick={onClose}>
      <div 
        className="bg-gray-950 border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-secondary" />
            <h3 className="font-extrabold text-white text-lg tracking-tight">Compartir Excursión</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-300 font-medium">
          Envía este tour a tus amigos, pareja o grupo de viaje para organizar la aventura:
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          {shareChannels.map((ch, i) => (
            <button
              key={i}
              onClick={ch.action}
              className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border ${ch.color} text-white font-bold text-xs transition duration-200 cursor-pointer`}
            >
              {ch.icon}
              <span>{ch.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            O copia el enlace directo
          </label>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-gray-300 px-2 flex-1 focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                copied 
                  ? 'bg-emerald-500 text-black font-extrabold' 
                  : 'bg-secondary hover:bg-secondary/90 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
