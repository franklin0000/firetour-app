import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare, Plus, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

interface ReviewItem {
  id: number | string;
  tourId?: number | null;
  tourName: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatarBg?: string;
  helpfulCount: number;
  verified?: boolean;
  country?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5stars' | 'saona' | 'buggy' | 'water'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          return;
        }
      }
    } catch (e) {
      console.warn('[Fetch Reviews Error]', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Reseñas y Opiniones Reales | Fire Tour DR Punta Cana';
    fetchReviews();
  }, []);

  const handleReviewAdded = (newReview: ReviewItem) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleVoteHelpful = async (id: number | string) => {
    const key = String(id);
    if (votedMap[key]) return;

    setVotedMap(prev => ({ ...prev, [key]: true }));
    setReviews(prev => prev.map(r => {
      if (String(r.id) === key) {
        return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
      }
      return r;
    }));

    try {
      await fetch(`/api/reviews/${id}/vote`, { method: 'POST' });
    } catch (e) {}
  };

  const filteredReviews = reviews.filter(r => {
    if (selectedFilter === '5stars') return r.rating === 5;
    if (selectedFilter === 'saona') return (r.tourName || '').toLowerCase().includes('saona');
    if (selectedFilter === 'buggy') return (r.tourName || '').toLowerCase().includes('buggy');
    if (selectedFilter === 'water') return (r.tourName || '').toLowerCase().includes('catamarán') || (r.tourName || '').toLowerCase().includes('snorkel');
    return true;
  });

  return (
    <div className="relative min-h-screen bg-bgDark pb-24 pt-6">
      
      {/* Background Ambience Lights */}
      <div className="absolute top-1/6 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-2/4 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[130px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 font-body">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Opiniones 100% Reales y Certificadas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mb-4 leading-tight">
            Lo que Dicen Nuestros <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-secondary to-cyan">
              Aventureros en Punta Cana
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Más de 15,000 turistas de todo el mundo han vivido las mejores excursiones con Fire Tour DR. Descubre sus experiencias y comparte la tuya.
          </p>

          {/* Action Call: Leave a Review */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-secondary to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black font-display text-xs uppercase tracking-wider py-4 px-8 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-orange-900/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Escribir una Reseña / Subir Comentario
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold font-display text-xs uppercase tracking-wider py-4 px-7 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              Explorar Excursiones <ArrowRight className="w-4 h-4 text-cyan" />
            </Link>
          </div>
        </div>

        {/* Global Rating Scorecard */}
        <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            <div className="text-center md:border-r border-white/10 py-2">
              <span className="text-5xl sm:text-6xl font-black font-display text-white tracking-tight">4.9</span>
              <div className="flex gap-1 justify-center my-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Valoración Media Global
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 text-xs text-gray-300 font-medium px-2">
              <div className="flex items-center gap-3">
                <span className="w-16 text-right font-bold text-gray-400">5 Estrellas</span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-secondary w-[92%] rounded-full" />
                </div>
                <span className="w-10 text-right font-bold text-white">92%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-right font-bold text-gray-400">4 Estrellas</span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[7%] rounded-full" />
                </div>
                <span className="w-10 text-right font-bold text-white">7%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-right font-bold text-gray-400">3 Estrellas</span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 w-[1%] rounded-full" />
                </div>
                <span className="w-10 text-right font-bold text-white">1%</span>
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col justify-center text-center">
              <span className="text-2xl font-black text-cyan font-display">100%</span>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mt-1">
                Satisfacción Garantizada
              </span>
              <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                Atención personalizada con recogida en hotel y guías VIP.
              </p>
            </div>

          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-secondary" /> Filtrar:
            </span>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`text-xs font-bold font-display uppercase tracking-wider px-4 py-2 rounded-xl border transition ${
                selectedFilter === 'all'
                  ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              Todas ({reviews.length})
            </button>
            <button
              onClick={() => setSelectedFilter('5stars')}
              className={`text-xs font-bold font-display uppercase tracking-wider px-4 py-2 rounded-xl border transition flex items-center gap-1 ${
                selectedFilter === '5stars'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" /> 5 Estrellas
            </button>
            <button
              onClick={() => setSelectedFilter('saona')}
              className={`text-xs font-bold font-display uppercase tracking-wider px-4 py-2 rounded-xl border transition ${
                selectedFilter === 'saona'
                  ? 'bg-cyan text-black font-black border-cyan shadow-md shadow-cyan/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              Isla Saona
            </button>
            <button
              onClick={() => setSelectedFilter('buggy')}
              className={`text-xs font-bold font-display uppercase tracking-wider px-4 py-2 rounded-xl border transition ${
                selectedFilter === 'buggy'
                  ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              Buggies 4x4
            </button>
            <button
              onClick={() => setSelectedFilter('water')}
              className={`text-xs font-bold font-display uppercase tracking-wider px-4 py-2 rounded-xl border transition ${
                selectedFilter === 'water'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              Catamarán & Snorkel
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-black uppercase tracking-wider text-secondary hover:text-orange-400 transition flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" /> Dejar mi Comentario
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => {
            const hasVoted = Boolean(votedMap[String(rev.id)]);
            const avatarGrad = rev.avatarBg || 'from-amber-500 to-orange-600';
            const initial = (rev.name || 'V').charAt(0).toUpperCase();

            return (
              <div 
                key={rev.id}
                className="bg-surface/60 backdrop-blur-xl border border-white/10 hover:border-secondary/40 p-6 rounded-3xl flex flex-col justify-between gap-4 transition duration-300 shadow-lg relative group"
              >
                <div>
                  {/* Top user profile header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatarGrad} flex items-center justify-center font-black font-display text-white text-lg shadow-md`}>
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm font-display">{rev.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Viajero Verificado
                          </span>
                          {rev.country && (
                            <span className="text-[10px] text-gray-400 font-medium">{rev.country}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Star rating */}
                    <div className="flex gap-0.5 text-amber-400 bg-black/40 border border-white/10 px-2 py-1 rounded-xl">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tour tag badge */}
                  {rev.tourName && (
                    <div className="mb-3">
                      <span className="inline-block text-[10px] font-bold text-cyan bg-cyan/10 border border-cyan/20 px-2.5 py-0.5 rounded-lg max-w-full truncate">
                        🌴 {rev.tourName}
                      </span>
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-gray-400 font-display">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {rev.date}
                  </span>

                  <button
                    onClick={() => handleVoteHelpful(rev.id)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition font-bold text-[10px] uppercase cursor-pointer ${
                      hasVoted
                        ? 'bg-secondary/15 border-secondary/40 text-secondary'
                        : 'border-white/10 bg-black/30 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {hasVoted ? '¡Votado Útil!' : '¿Útil?'} ({rev.helpfulCount})
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
            <p className="text-base font-bold text-white mb-1">No hay reseñas para este filtro todavía.</p>
            <p className="text-xs">¡Sé el primero en compartir tu experiencia en esta categoría!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-secondary text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Escribir Reseña
            </button>
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />

    </div>
  );
}
