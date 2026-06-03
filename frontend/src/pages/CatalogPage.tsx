import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Shield, Award, MapPin, Clock, ArrowRight, Loader } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Tour } from '../types';

export default function CatalogPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Framer Motion Scroll Drivers
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const videoScale = useTransform(scrollY, [0, 1500], [1.1, 1]);
  const text1Opacity = useTransform(scrollY, [0, 300, 600], [1, 1, 0]);
  const text2Opacity = useTransform(scrollY, [400, 800, 1200], [0, 1, 0]);
  const text3Opacity = useTransform(scrollY, [1000, 1400], [0, 1]);
  const text1Y = useTransform(scrollY, [0, 600], [0, -150]);
  const text2Y = useTransform(scrollY, [400, 1200], [100, -100]);
  const text3Y = useTransform(scrollY, [1000, 1500], [100, -50]);
  
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // 1. Fetch tours from backend paginated endpoint
  const fetchTours = async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours?page=${pageNum}&limit=4&category=${category}&query=${searchQuery}&_t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      
      if (reset) {
        setTours(data.tours);
      } else {
        setTours(prev => [...prev, ...data.tours]);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error fetching tours: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when filters or search change
  useEffect(() => {
    setPage(1);
    fetchTours(1, true);
  }, [category, searchQuery]);

  // Trigger paginated load when page changes
  useEffect(() => {
    if (page > 1) {
      fetchTours(page);
    }
  }, [page]);

  // 2. Setup Infinite Scroll window listener
  useEffect(() => {
    const handleInfiniteScroll = () => {
      // Check if user is near the bottom
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150) {
        if (hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      }
    };
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, [hasMore, loading]);

  // Force autoplay execution
  useEffect(() => {
    const playVideos = () => {
      if (video1Ref.current) video1Ref.current.play().catch(() => {});
      if (video2Ref.current) video2Ref.current.play().catch(() => {});
    };
    playVideos();
    window.addEventListener('click', playVideos, { once: true });
    window.addEventListener('touchstart', playVideos, { once: true });
    return () => {
      window.removeEventListener('click', playVideos);
      window.removeEventListener('touchstart', playVideos);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white select-none bg-black -mt-24">
      
      {/* 🎬 GLOBAL FIXED BACKGROUND VIDEO */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none">
        <motion.video
          ref={video2Ref}
          src="/video2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            scale: videoScale,
            filter: 'contrast(125%) saturate(135%) brightness(85%) hue-rotate(5deg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ============================================================= */}
      {/* 🎬 FRAMER MOTION PARALLAX HEADER                             */}
      {/* ============================================================= */}
      <section className="relative h-[250vh] w-full z-10">
        
        {/* Full-bleed video player pinned in background */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <motion.video
            ref={video1Ref}
            src="/video1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              filter: 'contrast(125%) saturate(135%) brightness(85%) hue-rotate(5deg)',
            }}
          />
        </div>

        {/* Floating Text 1 */}
        <motion.div 
          className="absolute top-[35vh] left-0 right-0 flex justify-center items-center pointer-events-none"
          style={{ opacity: text1Opacity, y: text1Y }}
        >
          <div className="max-w-3xl px-6 text-center">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-secondary font-black text-xs uppercase tracking-[0.4em] font-display bg-secondary/10 px-5 py-2 rounded-full border border-secondary/20 backdrop-blur-xl shadow-glow inline-block"
            >
              Fire Tour DR presenta
            </motion.span>
            <h1 className="text-6xl md:text-9xl font-black font-display tracking-tighter text-white mt-8 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] leading-[0.9]">
              DESCUBRE EL <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-500 to-cyan drop-shadow-none">PARAÍSO</span>
            </h1>
            <div className="mt-12 flex justify-center animate-bounce">
              <span className="text-secondary text-3xl drop-shadow-glow">↓</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Text 2 */}
        <motion.div 
          className="absolute top-[120vh] left-0 right-0 flex justify-center items-center pointer-events-none"
          style={{ opacity: text2Opacity, y: text2Y }}
        >
          <div className="max-w-xl bg-black/40 border border-white/10 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-[30px] text-center pointer-events-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent pointer-events-none" />
            <span className="relative text-cyan font-black text-[10px] uppercase tracking-[0.4em] font-display bg-cyan/10 px-4 py-1.5 rounded-full border border-cyan/20">
              Servicios VIP
            </span>
            <h2 className="relative text-4xl font-black font-display text-white mt-6 tracking-tight drop-shadow-md">ITINERARIOS EXCLUSIVOS</h2>
            <p className="relative text-gray-300 text-sm mt-4 leading-relaxed font-bold tracking-wide">
              Explora la Isla Saona en un catamarán privado con barra libre, almuerzo gourmet y snorkel en arrecifes de coral vivos.
            </p>
          </div>
        </motion.div>

        {/* Floating Text 3 */}
        <motion.div 
          className="absolute top-[200vh] left-0 right-0 flex justify-center items-center pointer-events-none"
          style={{ opacity: text3Opacity, y: text3Y }}
        >
          <div className="text-center px-4">
            <span className="text-secondary font-black text-xs uppercase tracking-[0.4em] font-display">
              Reserva Hoy
            </span>
            <h3 className="text-5xl md:text-8xl font-black font-display tracking-tight text-white mt-4 leading-none drop-shadow-2xl">
              ¿Listo para Zarpar?
            </h3>
            <div className="mt-12 flex justify-center">
              <div className="w-1 h-20 bg-gradient-to-b from-secondary to-transparent rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>

      </section>

      {/* ============================================================= */}
      {/* 📅 EXCURSIONS CATALOG CONTAINER (Interactive & Infinite)     */}
      {/* ============================================================= */}
      <div className="relative bg-black/60 backdrop-blur-[50px] py-20 px-4 md:px-8 max-w-7xl mx-auto z-20 -mt-20 rounded-t-[3rem] border-t border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
        
        {/* Value Pitch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface border border-outline p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Shield className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-white font-display">Reserva 100% Segura</h4>
              <p className="text-xs text-gray-400 mt-1">Pagos encriptados de extremo a extremo mediante tecnología Stripe.</p>
            </div>
          </div>
          <div className="bg-surface border border-outline p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-cyan/10 text-cyan rounded-xl"><Compass className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-white font-display">Itinerarios Premium</h4>
              <p className="text-xs text-gray-400 mt-1">Excursiones curadas al detalle con almuerzos gourmet y barra libre.</p>
            </div>
          </div>
          <div className="bg-surface border border-outline p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Award className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-white font-display">Garantía Fire Tour</h4>
              <p className="text-xs text-gray-400 mt-1">Cancelación gratuita hasta 24 horas antes y guías locales certificados.</p>
            </div>
          </div>
        </div>

        {/* Controls: Search and Categories */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-outline">
          <div>
            <h2 className="text-3xl font-extrabold font-display">Catálogo de Excursiones</h2>
            <p className="text-gray-400 text-sm mt-1">Explora actividades increíbles en Punta Cana con carga fluida en vivo.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
              <input
                type="text"
                placeholder="Buscar tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary/50 rounded-full py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-hide">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'adventure', label: '🌋 Aventura' },
                { id: 'water', label: '⛵ Agua' },
                { id: 'relax', label: '🌴 Relax' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold font-display whitespace-nowrap border transition-all duration-300 ${
                    category === cat.id
                      ? 'bg-secondary border-secondary text-white shadow-glow'
                      : 'bg-black/40 backdrop-blur-md border-white/5 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: index * 0.15 }}
              onClick={() => navigate(`/excursion/${tour.id}`)}
              className="group bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-premium hover:shadow-glow hover:border-secondary/30 hover:-translate-y-3 transition-all duration-500 cursor-pointer flex flex-col relative"
            >
              {/* Subtle top glare effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

              {/* Image & Badge */}
              <div className="relative h-64 overflow-hidden bg-black">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 200 100%22 style=%22background:%230A192F;fill:%2394a3b8;font-family:Inter;font-size:12px;text-anchor:middle;%22><text x=%22100%22 y=%2255%22>Experiencia Dominicana</text></svg>";
                  }}
                />
                <span className={`absolute top-4 right-4 z-20 text-[10px] font-black tracking-widest uppercase font-display px-4 py-2 rounded-full border backdrop-blur-md shadow-lg ${
                  tour.id === 1 ? 'bg-secondary/90 text-white border-white/20' : 'bg-black/60 text-cyan border-white/10'
                }`}>
                  {tour.badge}
                </span>
                
                {/* Price tag */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-baseline gap-1.5 shadow-lg group-hover:border-secondary/50 transition-colors duration-500">
                  <span className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Desde</span>
                  <span className="text-white group-hover:text-secondary transition-colors duration-300 text-2xl font-black font-display leading-none">${tour.price}</span>
                  <span className="text-gray-400 text-[10px] font-bold">USD</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-7 flex flex-col flex-1 gap-4 relative z-20">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> {tour.duration}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan" /> {tour.difficulty}</div>
                </div>

                <h3 className="text-xl font-bold font-display text-white group-hover:text-secondary transition-colors leading-tight">
                  {tour.name}
                </h3>
                
                <p className="text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed flex-1">
                  {tour.desc}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 pt-5 border-t border-white/5">
                  <div className="flex text-yellow-500 text-sm tracking-widest drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">★★★★★</div>
                  <span className="text-white text-xs font-bold">{tour.rating}</span>
                  <span className="text-gray-500 text-[10px] font-bold tracking-wider">({tour.reviews} OPINIONES)</span>
                </div>

                {/* Button */}
                <button className="w-full mt-4 bg-white/5 border border-white/10 group-hover:border-secondary/50 group-hover:bg-secondary text-gray-300 group-hover:text-white font-bold font-display py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg group-hover:shadow-glow">
                  Ver Detalles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading Spinner / Empty State */}
        <div className="mt-12 text-center flex flex-col items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <Loader className="w-5 h-5 animate-spin" /> Cargando más aventuras...
            </div>
          )}

          {!loading && !hasMore && tours.length > 0 && (
            <p className="text-gray-500 text-sm font-medium">Has llegado al final de nuestra colección premium de Punta Cana.</p>
          )}

          {!loading && tours.length === 0 && (
            <div className="p-12 text-gray-400">
              <p className="text-lg">No encontramos tours que coincidan con tu búsqueda.</p>
              <button 
                onClick={() => { setCategory('all'); setSearchQuery(''); }}
                className="mt-4 bg-secondary text-white font-bold px-6 py-2.5 rounded-xl text-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
