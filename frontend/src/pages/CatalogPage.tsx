import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Compass, Shield, Award, MapPin, Clock, ArrowRight, Loader, Sparkles, Hotel, Tag, ChevronRight, Camera, BookOpen } from 'lucide-react';
import { RESORTS_DATA, getResortBySlug } from '../data/resorts';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Tour } from '../types';
import AdSenseBanner from '../components/AdSenseBanner';

export default function CatalogPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  
  // Framer Motion Scroll Drivers
  const { scrollY } = useScroll();
  const heroVideoScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const heroVideoOpacity = useTransform(scrollY, [0, 600], [1, 0.35]);
  const videoScale = useTransform(scrollY, [0, 1500], [1.1, 1]);
  
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // 1. Fetch tours from backend paginated endpoint with fallback to static CDN tours.json
  const fetchTours = async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    try {
      let fetchedTours: Tour[] = [];
      let moreAvailable = false;

      const response = await fetch(`/api/tours?page=${pageNum}&limit=4&category=${category}&query=${encodeURIComponent(searchQuery)}&_t=${Date.now()}`, { cache: 'no-store' });
      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data.tours) && data.tours.length > 0) {
          fetchedTours = data.tours;
          moreAvailable = Boolean(data.hasMore);
        }
      }

      // If API didn't return tours (e.g. static CDN deployment fallback)
      if (fetchedTours.length === 0) {
        const staticRes = await fetch(`/data/tours.json?_t=${Date.now()}`);
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          let all: Tour[] = staticData.tours || [];
          if (category !== 'all') {
            const cat = category.toLowerCase();
            all = all.filter(t => (t.category && t.category.toLowerCase() === cat) || (t.tag && t.tag.toLowerCase() === cat));
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            all = all.filter(t => (t.name && t.name.toLowerCase().includes(q)) || (t.desc && t.desc.toLowerCase().includes(q)));
          }
          const start = (pageNum - 1) * 4;
          fetchedTours = all.slice(start, start + 4);
          moreAvailable = start + 4 < all.length;
        }
      }

      if (reset) {
        setTours(fetchedTours);
      } else {
        setTours(prev => [...prev, ...fetchedTours]);
      }
      setHasMore(moreAvailable);
    } catch (err) {
      console.error("Error fetching tours, trying static fallback: ", err);
      try {
        const staticRes = await fetch(`/data/tours.json?_t=${Date.now()}`);
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          let all: Tour[] = staticData.tours || [];
          if (category !== 'all') {
            const cat = category.toLowerCase();
            all = all.filter(t => (t.category && t.category.toLowerCase() === cat) || (t.tag && t.tag.toLowerCase() === cat));
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            all = all.filter(t => (t.name && t.name.toLowerCase().includes(q)) || (t.desc && t.desc.toLowerCase().includes(q)));
          }
          const start = (pageNum - 1) * 4;
          const fallbackTours = all.slice(start, start + 4);
          if (reset) {
            setTours(fallbackTours);
          } else {
            setTours(prev => [...prev, ...fallbackTours]);
          }
          setHasMore(start + 4 < all.length);
        }
      } catch (fallbackErr) {
        console.error("Critical: Could not load fallback tours:", fallbackErr);
      }
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

  // Force autoplay execution & reset document title
  useEffect(() => {
    document.title = 'Fire Tour DR - Excursiones Premium en Punta Cana | Mejores Tours y Traslados';
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
    <div className="relative min-h-screen text-white bg-black -mt-24">
      
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
            {/* 📱 MOBILE HERO (< md): Responsive 1-screen viewport without 250vh empty space */}
      <section className="relative min-h-[520px] h-[85vh] w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden md:hidden z-10 pt-16">
        <div className="absolute inset-0 bg-black/55 z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-sm flex flex-col items-center">
          <span className="text-secondary font-black text-[10px] uppercase tracking-[0.25em] font-display bg-secondary/15 px-4 py-1.5 rounded-full border border-secondary/30 backdrop-blur-xl shadow-glow mb-4 inline-block">
            🔥 PUNTA CANA ADVENTURES
          </span>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white leading-[1.05] drop-shadow-2xl">
            DESCUBRE EL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">
              PARAÍSO
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-xs">
            Excursiones oficiales en Punta Cana. Isla Saona VIP, Buggies Macao y Parasailing con recogida directa en tu resort.
          </p>

          <div className="flex flex-col w-full gap-2.5 mt-6">
            <a
              href="#catalogo-tours"
              className="w-full bg-gradient-to-r from-secondary to-orange-500 text-white font-black font-display uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-glow flex items-center justify-center gap-2"
            >
              Ver Excursiones y Precios <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="https://wa.me/15872257342?text=Hola%20Fire%20Tour%20DR%2C%20estoy%20en%20Punta%20Cana%20y%20quiero%20informaci%C3%B3n"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold font-display uppercase tracking-wider text-xs py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <span className="text-base">💬</span> WhatsApp Atención 24/7
            </a>
          </div>

          <div className="mt-5 flex items-center gap-3 text-[10px] text-gray-400">
            <span>⭐ 4.9/5 (1,420 reseñas)</span>
            <span>•</span>
            <span className="text-emerald-400">✓ Cancelación Gratis</span>
          </div>

          <a href="#catalogo-tours" className="mt-4 text-secondary animate-bounce text-xl">
            ↓
          </a>
        </div>
      </section>

      {/* 🖥️ DESKTOP HERO (>= md): Fluid, non-sticky & instant mouse-wheel responsive */}
      <section className="relative min-h-[580px] h-[90vh] lg:h-[92vh] w-full hidden md:flex flex-col justify-center items-center text-center px-6 overflow-hidden z-10 pt-20">
        
        {/* Full-bleed video player background with smooth parallax */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <motion.video
            ref={video1Ref}
            src="/video1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              scale: heroVideoScale,
              opacity: heroVideoOpacity,
              filter: 'contrast(120%) saturate(130%) brightness(75%) hue-rotate(5deg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/85" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl flex flex-col items-center">
          <motion.span 
            initial={{ scale: 0.85, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-secondary font-black text-xs uppercase tracking-[0.35em] font-display bg-secondary/15 px-6 py-2 rounded-full border border-secondary/30 backdrop-blur-xl shadow-glow mb-6 inline-block"
          >
            🔥 Fire Tour DR • Excursiones Oficiales Punta Cana
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black font-display tracking-tight text-white leading-[0.95] drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
          >
            DESCUBRE EL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">
              PARAÍSO
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-200 text-base lg:text-lg mt-6 leading-relaxed max-w-2xl font-medium drop-shadow-md"
          >
            Isla Saona VIP en Catamarán, Buggies Macao 4x4, Parasailing y Traslados Privados Aeropuerto PUJ con recogida directa en tu resort y cancelación gratis.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-4 mt-8"
          >
            <a
              href="#catalogo-tours"
              className="bg-gradient-to-r from-secondary to-orange-500 hover:from-secondary hover:to-orange-600 text-white font-black font-display uppercase tracking-wider text-sm py-4 px-8 rounded-2xl shadow-glow flex items-center gap-2 transform hover:-translate-y-0.5 transition duration-200"
            >
              Ver Excursiones y Precios <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="https://wa.me/15872257342?text=Hola%20Fire%20Tour%20DR%2C%20estoy%20en%20Punta%20Cana%20y%20quiero%20informaci%C3%B3n"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-bold font-display uppercase tracking-wider text-sm py-4 px-6 rounded-2xl flex items-center gap-2 backdrop-blur-xl transition"
            >
              <span className="text-lg">💬</span> WhatsApp Atención 24/7
            </a>
          </motion.div>

          {/* Social Proof & Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex items-center gap-4 text-xs text-gray-300 backdrop-blur-md bg-black/40 px-6 py-2.5 rounded-full border border-white/10"
          >
            <span>⭐ 4.9/5 (1,420+ Reseñas Verificadas)</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">✓ Cancelación Gratuita 24h</span>
            <span>•</span>
            <span className="text-cyan font-semibold">🛡️ Pago 100% Seguro</span>
          </motion.div>

          <a 
            href="#catalogo-tours" 
            className="mt-8 text-secondary hover:text-white transition-colors animate-bounce flex flex-col items-center gap-1 group cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-white">Explorar Tours</span>
            <span className="text-2xl drop-shadow-glow">↓</span>
          </a>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 📅 EXCURSIONS CATALOG CONTAINER (Interactive & Infinite)     */}
      {/* ============================================================= */}
      <div className="relative bg-black/60 backdrop-blur-[50px] py-8 md:py-20 px-3 md:px-8 max-w-7xl mx-auto z-20 md:-mt-20 rounded-t-[2rem] md:rounded-t-[3rem] border-t border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
        
        {/* 🔥 VIRAL GROUP PROMO BANNER & RESORT SELECTOR */}
        <div className="flex flex-col gap-6 mb-12">
          
          {/* Banner Oferta Viral Grupal */}
          <div className="bg-gradient-to-r from-secondary/25 via-orange-950/40 to-black/80 border-2 border-secondary/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(249,115,22,0.25)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0 text-2xl shadow-inner">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    OFERTA VIRAL
                  </span>
                  <span className="text-secondary text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Tiempo Limitado
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-display text-white mt-1.5 leading-tight">
                  ¡Si reservas para 5 personas, la 6ta viaja 100% GRATIS!
                </h3>
                <p className="text-gray-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
                  Aplica automáticamente en el checkout para Isla Saona VIP, Buggies Macao y Parasail. Ahorro de hasta -$79 USD por grupo. Usa el código <b className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">GRUPOFREE</b> o <b className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">VIP5</b>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10 flex-shrink-0">
              <a
                href="#catalogo-tours"
                className="bg-secondary hover:bg-orange-600 text-white font-black font-display uppercase tracking-wider text-xs py-3.5 px-6 rounded-xl transition text-center shadow-glow flex items-center justify-center gap-2"
              >
                Ver Excursiones <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Selector Interactivo de Hotel de Recogida */}
          <div className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-premium flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white font-display text-sm md:text-base flex items-center gap-2">
                  <span>¿En qué Resort te hospedas?</span>
                  <span className="text-[10px] text-cyan font-bold bg-cyan/10 px-2 py-0.5 rounded-full border border-cyan/20">Recogida Incluida</span>
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Consulta el horario exacto de recogida en tu lobby y ahorra hasta un 50% vs mostrador del hotel.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="bg-[#08131d] border border-outline focus:border-cyan text-white text-xs font-semibold py-3 px-4 rounded-xl focus:outline-none w-full sm:w-64 cursor-pointer"
              >
                <option value="">Selecciona tu Resort...</option>
                {RESORTS_DATA.map(r => (
                  <option key={r.slug} value={r.slug}>{r.name}</option>
                ))}
              </select>

              {selectedHotel && (
                <button
                  type="button"
                  onClick={() => navigate(`/hoteles/${selectedHotel}`)}
                  className="w-full sm:w-auto bg-cyan hover:bg-cyan-400 text-black font-black font-display uppercase tracking-wider text-xs py-3 px-5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Ver Horario y Ahorro <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Banner Desplegado cuando se selecciona hotel */}
          {selectedHotel && (() => {
            const resInfo = getResortBySlug(selectedHotel);
            if (!resInfo) return null;
            return (
              <div className="bg-[#08131d]/90 border border-cyan/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan font-bold">📍 {resInfo.name}</span>
                  <span className="text-gray-400">• Recogida Saona: <b className="text-white">{resInfo.pickupTimeSaona}</b></span>
                  <span className="text-gray-400">• Buggies: <b className="text-white">{resInfo.pickupTimeBuggies.split('/')[0]}</b></span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ahorras ${resInfo.hotelLobbyPriceSaona - 79} USD/persona
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/hoteles/${resInfo.slug}`)}
                  className="text-cyan hover:text-white font-bold text-xs underline font-display flex items-center gap-1"
                >
                  Ver Detalles de tu Lobby →
                </button>
              </div>
            );
          })()}

        </div>

        <div id="catalogo-tours" />

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

        {/* ============================================================= */}
        {/* 🔍 CONTROLS: CENTERED HEADER, SEARCH & LUXURY CATEGORY DOCK   */}
        {/* ============================================================= */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-12 pb-10 border-b border-white/10">
          
          {/* Badge */}
          <span className="text-secondary font-black text-[11px] uppercase tracking-[0.3em] font-display bg-secondary/15 px-5 py-2 rounded-full border border-secondary/30 backdrop-blur-xl mb-4 inline-flex items-center gap-2 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" /> Experiencias Oficiales en Punta Cana
          </span>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Catálogo de Excursiones
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
            Explora actividades increíbles en Punta Cana con carga fluida en vivo, precios oficiales sin intermediarios y recogida incluida en tu resort.
          </p>

          {/* Centered Search Bar */}
          <div className="relative w-full max-w-lg mt-7 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              placeholder="Buscar tours (ej: Saona, Buggies, Parasail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 backdrop-blur-2xl border border-white/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 rounded-full py-3.5 pl-12 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none transition-all shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:border-white/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold bg-white/10 hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* Centered Category Filter Icons Dock */}
          <div className="w-full mt-8">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <span>Filtrar por Categoría:</span>
              {category !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className="text-secondary hover:underline normal-case font-medium text-xs"
                >
                  (Mostrar todas)
                </button>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto px-2">
              {[
                { id: 'all', emoji: '🔥', label: 'Todas' },
                { id: 'saona', emoji: '🏝️', label: 'Isla Saona' },
                { id: 'buggy', emoji: '🏎️', label: 'Buggies 4x4' },
                { id: 'parasail', emoji: '🪂', label: 'Parasailing' },
                { id: 'transfer', emoji: '🚐', label: 'Traslados PUJ' },
                { id: 'water', emoji: '⛵', label: 'Catamarán' },
                { id: 'adventure', emoji: '🌋', label: 'Aventura' },
                { id: 'nightlife', emoji: '🎉', label: 'Coco Bongo' },
                { id: 'relax', emoji: '🌴', label: 'Ecoturismo' }
              ].map(cat => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold font-display uppercase tracking-wider transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r from-secondary to-orange-500 border-secondary text-white shadow-[0_0_25px_rgba(255,69,0,0.5)] scale-105 ring-2 ring-secondary/30'
                        : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-secondary/40 text-gray-300 hover:text-white backdrop-blur-md transform hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-base sm:text-lg leading-none">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Status */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Tag className="w-3.5 h-3.5 text-secondary" />
            <span>
              {category === 'all' && !searchQuery
                ? 'Mostrando todas las excursiones'
                : `Filtro activo: ${searchQuery ? `"${searchQuery}" • ` : ''}${
                    category === 'all'
                      ? 'Todas'
                      : category === 'saona'
                      ? 'Isla Saona'
                      : category === 'buggy'
                      ? 'Buggies 4x4'
                      : category === 'parasail'
                      ? 'Parasailing'
                      : category === 'transfer'
                      ? 'Traslados PUJ'
                      : category === 'water'
                      ? 'Catamarán'
                      : category === 'adventure'
                      ? 'Aventura'
                      : category === 'nightlife'
                      ? 'Coco Bongo'
                      : 'Ecoturismo'
                  }`}
            </span>
            {(category !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setCategory('all');
                  setSearchQuery('');
                }}
                className="text-secondary hover:text-white underline font-semibold ml-1 cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>

        </div>

        {/* AdSense Placement */}
        <AdSenseBanner className="max-w-4xl mx-auto my-6" />

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
                  tour.id === 1 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300/40 shadow-glow' :
                  tour.id === 2 ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-400/40 shadow-glow' :
                  tour.id === 3 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300/40 shadow-glow' :
                  tour.id === 4 ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400/40 shadow-glow' :
                  'bg-black/60 text-cyan border-white/10'
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

        {/* Real Community Photos & Punta Cana Destination Showcase */}
        <section className="mt-24 pt-16 border-t border-white/10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" /> Momentos Reales
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Punta Cana en los Ojos de Nuestros Viajeros
              </h2>
              <p className="text-sm text-gray-400 max-w-xl">
                Fotos 100% auténticas tomadas por nuestros aventureros en Isla Saona, buggy safaris en Macao y playas secretas.
              </p>
            </div>

            <Link
              to="/punta-cana"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-wider hover:bg-cyan/25 transition shrink-0"
            >
              <BookOpen className="w-4 h-4" /> Leer Guía Oficial de Punta Cana
            </Link>
          </div>

          {/* 6 Real Photos Showcase Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1791837976637.jpg" 
                alt="Turista bajo palmeras en Punta Cana"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Playa Bávaro • Paraíso</span>
              </div>
            </div>

            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1792088108970.jpg" 
                alt="Amigos disfrutando del sol dominicano"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Amigos • Catamarán</span>
              </div>
            </div>

            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1792088042689.jpg" 
                alt="Relax en palmera curva de Isla Saona"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Canto de la Playa • Saona</span>
              </div>
            </div>

            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1791838610500.jpg" 
                alt="Costa de aguas cristalinas y palmeras vírgenes"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Mar Caribe • Vista Panorámica</span>
              </div>
            </div>

            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1792088950614.jpg" 
                alt="Hamacas bajo palmeras en playa privada"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Relax en Hamacas</span>
              </div>
            </div>

            <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              <img 
                src="/gallery/facebook_1791838696169.jpg" 
                alt="Buggies 4x4 en ruta de Macao"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white leading-tight">Buggies 4x4 • Macao</span>
              </div>
            </div>
          </div>

          {/* Guide Teaser Callout Banner */}
          <div className="bg-gradient-to-r from-secondary/15 via-surface to-cyan/15 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                ¿Planeando tu primera vez en República Dominicana?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                Lee nuestra guía completa sobre el clima mes a mes, qué zonas elegir (Bávaro vs Cap Cana vs Macao), cómo evitar el sargazo y consejos locales de dinero y transporte.
              </p>
            </div>
            <Link
              to="/punta-cana"
              className="px-6 py-3 rounded-full bg-secondary text-white font-bold font-display text-xs sm:text-sm hover:scale-105 transition shadow-glow shrink-0 flex items-center gap-2"
            >
              Explorar Guía Punta Cana <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
}
