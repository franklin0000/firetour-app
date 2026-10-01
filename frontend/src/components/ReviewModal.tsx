import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare, Sparkles, Send, MapPin, User, Mail, Compass } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId?: number | null;
  tourName?: string | null;
  onReviewAdded?: (newReview: any) => void;
}

const DEFAULT_TOURS = [
  { id: 1, name: 'Isla Saona All Inclusive VIP: Catamarán & Piscina Natural' },
  { id: 2, name: 'Buggies 4x4 Macao: Cenote Subterráneo & Playa' },
  { id: 3, name: 'Catamarán Party Boat & Snorkel Arrecife de Coral' },
  { id: 4, name: 'Parasailing Extremo en las Costas de Bávaro' },
  { id: 5, name: 'Santo Domingo Histórico VIP: Zona Colonial & Tres Ojos' },
  { id: 6, name: 'Safari Dominicano Cultural & Cascada El Limón' },
];

export default function ReviewModal({
  isOpen,
  onClose,
  tourId,
  tourName,
  onReviewAdded
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [selectedTourId, setSelectedTourId] = useState<number | null>(tourId || 1);
  const [selectedTourName, setSelectedTourName] = useState<string>(tourName || DEFAULT_TOURS[0].name);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRatingHover = (val: number) => setHoverRating(val);
  const handleRatingLeave = () => setHoverRating(null);
  const handleRatingClick = (val: number) => setRating(val);

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return '¡Experiencia Inolvidable! (5/5)';
      case 4: return 'Muy Buena Experiencia (4/5)';
      case 3: return 'Buena Experiencia (3/5)';
      case 2: return 'Aceptable (2/5)';
      case 1: return 'Por Mejorar (1/5)';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage('Por favor comparte un comentario de al menos 10 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const activeTourName = tourName || selectedTourName || 'Experiencia General Fire Tour DR';
    const activeTourId = tourId || selectedTourId;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          country: country.trim() || 'República Dominicana',
          rating,
          comment: comment.trim(),
          tourId: activeTourId,
          tourName: activeTourName
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        if (onReviewAdded) {
          onReviewAdded(data.review);
        }
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      } else {
        setErrorMessage(data?.error || 'No se pudo publicar la reseña. Inténtalo de nuevo.');
      }
    } catch (err) {
      setErrorMessage('Error de conexión al enviar la reseña. Verifica tu conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative z-10 w-full max-w-xl bg-surface/95 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-secondary/20 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan/20 rounded-full blur-[70px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black font-display text-white mb-2">
              ¡Muchas Gracias por tu Reseña!
            </h3>
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              Tu comentario ha sido publicado en Fire Tour DR y ayudará a miles de viajeros a elegir la mejor experiencia en Punta Cana.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Opinión de Viajero</span>
              </div>
              <h3 className="text-2xl font-black font-display text-white tracking-tight">
                Comparte tu Experiencia
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Cuéntale a la comunidad de Fire Tour DR cómo fue tu aventura en el Caribe.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Star Rating Picker */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  ¿Cómo calificarías tu experiencia?
                </span>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating !== null ? hoverRating : rating;
                    const isFilled = star <= activeRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={handleRatingLeave}
                        onClick={() => handleRatingClick(star)}
                        className="p-1 hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled 
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' 
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                </span>
              </div>

              {/* Excursion Selector (if not prefilled) */}
              {!tourId && (
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan" /> Excursión que Realizaste
                  </label>
                  <select
                    value={selectedTourId || ''}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      setSelectedTourId(id);
                      const found = DEFAULT_TOURS.find(t => t.id === id);
                      if (found) setSelectedTourName(found.name);
                    }}
                    className="w-full bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-cyan font-medium"
                  >
                    {DEFAULT_TOURS.map(t => (
                      <option key={t.id} value={t.id} className="bg-bgDark text-white">
                        {t.name}
                      </option>
                    ))}
                    <option value="" className="bg-bgDark text-white">Otra Excursión / Experiencia General</option>
                  </select>
                </div>
              )}

              {/* Inputs Grid: Name & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-secondary" /> Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: María Rodríguez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan" /> Ciudad / País
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Madrid, España / Miami, EE.UU."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan font-medium"
                  />
                </div>
              </div>

              {/* Optional Email */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Correo Electrónico (Opcional)
                  </span>
                  <span className="text-[10px] text-gray-500 normal-case font-normal">No se mostrará públicamente</span>
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Tu Comentario o Reseña *
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {comment.length} caracteres
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="¿Qué tal estuvo la guía, la comida, los paisajes, el transporte? Comparte detalles para ayudar a otros turistas..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-amber-500 via-secondary to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black font-display text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Publicando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Publicar mi Reseña
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
