import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, ShieldAlert, Award, ChevronRight, CheckCircle2, 
  ArrowLeft, Loader, Map, Clock, Star, ShieldCheck, Compass, Heart, 
  Share2, Info, ChevronDown, Check, ThumbsUp, Send, Landmark, Smile, 
  X, ZoomIn, Eye, Sparkles, TrendingUp, Languages, AlertCircle 
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Tour } from '../types';

// Returns an array of photos for a specific tour
const getTourPhotos = (tour: Tour): string[] => {
  if (tour.photos && tour.photos.length > 0) {
    return tour.photos;
  }
  return [tour.image];
};

// Skeleton Screen for an premium, smooth page load experience
function ExcursionDetailsSkeleton() {
  return (
    <div className="bg-bgDark text-white min-h-screen py-10 px-4 md:px-8 animate-pulse">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="h-5 w-36 bg-slate-800/80 rounded-lg" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-4 h-[400px]">
            <div className="col-span-3 bg-slate-800/80 rounded-3xl h-full" />
            <div className="hidden md:flex flex-col gap-3 h-full justify-between">
              <div className="h-[120px] bg-slate-800/80 rounded-xl" />
              <div className="h-[120px] bg-slate-800/80 rounded-xl" />
              <div className="h-[120px] bg-slate-800/80 rounded-xl" />
            </div>
          </div>
          <div className="h-20 bg-slate-800/80 rounded-2xl" />
          <div className="h-44 bg-slate-800/80 rounded-3xl" />
          <div className="h-64 bg-slate-800/80 rounded-3xl" />
        </div>
        <div className="h-[520px] bg-slate-800/80 rounded-3xl" />
      </div>
    </div>
  );
}

// Highly customized contextual mock reviews generated dynamically based on the tour name and tags
const getReviewsForTour = (tourName: string, tag: string) => {
  const normalizedTag = tag.toLowerCase();
  if (normalizedTag === 'water') {
    return [
      {
        name: "Sofía Martínez",
        avatarBg: "from-blue-500 to-teal-400",
        rating: 5,
        date: "Hace 1 semana",
        comment: `¡Increíble experiencia marítima! Reservé "${tourName}" y superó todas mis expectativas. El catamarán de Fire Tour DR es de primera clase, muy cómodo y limpio. Hacer snorkel con los peces de colores y estrellas de mar fue mágico, y las bebidas flotantes en la piscina natural cerraron con broche de oro. ¡10/10!`,
        helpfulCount: 24
      },
      {
        name: "John Davis",
        avatarBg: "from-orange-500 to-pink-500",
        rating: 5,
        date: "Hace 3 semanas",
        comment: "Excellent service from the pick-up to the return! The team of Fire Tour DR was extremely professional and fun. The lunch was surprisingly delicious with typical Dominican food. Booking with Stripe online was fast and super secure. Highly recommended for couples and families.",
        helpfulCount: 15
      },
      {
        name: "Marc Leblanc",
        avatarBg: "from-purple-500 to-indigo-500",
        rating: 4,
        date: "Hace 1 mes",
        comment: "Muy bello recorrido, aguas turquesas espectaculares. El personal es súper animado y nos hicieron bailar a todos en el barco. Recuerda traer bloqueador biodegradable para proteger los arrecifes. Todo el servicio de Fire Tour DR estuvo impecable.",
        helpfulCount: 8
      }
    ];
  } else if (normalizedTag === 'adventure') {
    return [
      {
        name: "Carlos Gómez",
        avatarBg: "from-amber-500 to-orange-600",
        rating: 5,
        date: "Hace 4 días",
        comment: `¡Pura adrenalina! La excursión "${tourName}" es obligatoria si visitas Punta Cana. Conducir el Buggy por el barro fue divertidísimo. La visita a la cueva natural subterránea es asombrosa, y el chapuzón en el agua helada nos devolvió la vida. Junior, nuestro guía VIP de Fire Tour DR, fue un genio.`,
        helpfulCount: 32
      },
      {
        name: "Emily Watson",
        avatarBg: "from-red-500 to-pink-600",
        rating: 5,
        date: "Hace 2 semanas",
        comment: "Super exciting off-road tour! I was a bit scared of driving the ATV at first, but the safety briefing and equipment provided by Fire Tour DR were excellent. Macao Beach stops are breathtaking. Bring clothes you don't mind ruining, you will get very muddy!",
        helpfulCount: 19
      },
      {
        name: "Alessandro Rossi",
        avatarBg: "from-emerald-500 to-teal-600",
        rating: 4,
        date: "Hace 3 semanas",
        comment: "Una experiencia salvaje y divertida. La degustación de café y cacao orgánico en el rancho típico dominicano fue una grata sorpresa, riquísima. Una excelente manera de ver el verdadero campo dominicano. El Buggy 4x4 garantizado por Fire Tour DR andaba al 100%.",
        helpfulCount: 11
      }
    ];
  } else {
    return [
      {
        name: "Valeria Ruiz",
        avatarBg: "from-pink-500 to-rose-400",
        rating: 5,
        date: "Hace 5 días",
        comment: `Una tarde mágica que jamás olvidaremos. Contratar "${tourName}" fue un acierto total. Montar a caballo por la orilla del mar con el atardecer caribeño de fondo fue sacado de una película. Los caballos están impecablemente cuidados y son muy dóciles, perfectos para principiantes.`,
        helpfulCount: 18
      },
      {
        name: "Robert Miller",
        avatarBg: "from-teal-500 to-emerald-400",
        rating: 5,
        date: "Hace 2 semanas",
        comment: "Peaceful, scenic, and deeply connecting. The VIP transportation picked us up exactly on time. Our private guide from Fire Tour DR was extremely knowledgeable about the local flora and fauna. Perfect romantic experience, and the souvenir bottle of rum was a beautiful touch!",
        helpfulCount: 12
      },
      {
        name: "Clara Dupont",
        avatarBg: "from-indigo-500 to-cyan-500",
        rating: 4,
        date: "Hace 1 mes",
        comment: "Muy relajante y hermoso. Los senderos naturales son preciosos y la brisa del océano cabalgando es inigualable. Los guías te ayudan en todo momento y te toman unas fotos espectaculares. Una cara de Punta Cana que vale muchísimo la pena conocer.",
        helpfulCount: 6
      }
    ];
  }
};

export default function ExcursionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox Gallery State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Timeline Accordion active index
  const [activeTimelineStep, setActiveTimelineStep] = useState<number | null>(0);

  // Booking Calculator State
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Interactive review feedback counters
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});

  // Mobile Bottom Bar visibility State
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);

  // References to scroll targets
  const calculatorRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Framer Motion Parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const imageScale = useTransform(scrollY, [0, 1000], [1, 1.3]);
  const contentY = useTransform(scrollY, [0, 600], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`/api/tours/${id}?_t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Tour not found");
        const data = await response.json();
        setTour(data);
      } catch (err) {
        console.error("Error loading tour details: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
  }, [id]);

  // Scroll detection for Mobile Floating Booking CTA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyMobileBar(true);
      } else {
        setShowStickyMobileBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <ExcursionDetailsSkeleton />;
  }

  if (!tour) {
    return (
      <div className="relative min-h-screen bg-bgDark font-body select-none -mt-24 flex flex-col justify-center items-center gap-5">
        <div className="bg-surface border border-outline p-8 rounded-3xl flex flex-col items-center max-w-sm text-center shadow-premium">
          <AlertCircle className="w-12 h-12 text-secondary mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold font-display mb-2">Excursión no encontrada</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Lo sentimos, el enlace parece estar desactualizado o la aventura no está disponible temporalmente.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-secondary hover:bg-orange-600 text-white py-3 rounded-xl font-extrabold font-display transition duration-300 shadow-md shadow-secondary/20"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const photos = getTourPhotos(tour);
  const reviewsPool = getReviewsForTour(tour.name, tour.tag);

  // Price calculations
  const priceAdults = tour.price * adults;
  const priceChildren = Math.round(tour.price * 0.6) * children; // Children get 40% discount!
  const totalPrice = priceAdults + priceChildren;
  const depositToPay = (adults + children) * 25;
  const balanceDue = totalPrice - depositToPay;

  const handleProceedToCheckout = () => {
    if (!date) {
      alert("Por favor, selecciona una fecha para tu excursión.");
      calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/checkout', {
      state: {
        tourId: tour.id,
        tourName: tour.name,
        tourImage: tour.image,
        tourPrice: tour.price,
        date,
        adults,
        children,
        totalPrice,
        depositToPay,
        balanceDue
      }
    });
  };

  const handleMobileScrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoteHelpful = (idx: number) => {
    if (votedReviews[idx]) return;
    setVotedReviews(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="bg-bgDark text-white min-h-screen selection:bg-secondary selection:text-white relative font-sans -mt-24">

      
      {/* Cinematic Edge-to-Edge Hero Header with Framer Motion Parallax */}
      <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden group">
        <motion.div 
          className="absolute inset-0 bg-black"
          style={{ y: heroY, scale: imageScale }}
        >
          <img 
            src={photos[0]} 
            alt={tour.name} 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Deep gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bgDark via-bgDark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-bgDark/80 via-transparent to-transparent" />
        </motion.div>

        {/* Back Button Overlay */}
        <div className="absolute top-8 left-4 md:left-12 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 hover:border-white/30 text-sm font-bold transition-all duration-300 shadow-lg group-hover:shadow-glow"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1.5 transition-transform duration-300" /> 
            Volver
          </button>
        </div>

        {/* Hero Content */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 flex flex-col items-start max-w-7xl mx-auto"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] font-display px-4 py-2 rounded-full border backdrop-blur-md shadow-glow mb-4 ${
            tour.id === 1 ? 'bg-secondary/90 text-white border-white/20' : 'bg-black/60 text-cyan border-white/10'
          }`}>
            {tour.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-black font-display leading-tight drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 max-w-4xl">
            {tour.name}
          </h1>
          
          {/* Mini Gallery Trigger */}
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex gap-3">
            <button 
              onClick={() => { setActivePhotoIndex(0); setIsLightboxOpen(true); }}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-sm font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg"
            >
              <ZoomIn className="w-4 h-4" /> Ver Galería Completa
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 -mt-10 relative z-30 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-2 flex flex-col gap-8"
        >

          {/* Key Facts Dashboard (Glassmorphism row with neat highlights) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface/40 border border-white/10 p-5 rounded-[2rem] text-center backdrop-blur-xl shadow-premium relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
            <div className="flex flex-col items-center p-2 relative z-10">
              <Clock className="w-6 h-6 text-secondary mb-2 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em]">Duración</p>
              <p className="text-white font-black font-display text-base mt-1">{tour.duration}</p>
            </div>
            <div className="border-l border-white/5 flex flex-col items-center p-2 relative z-10">
              <TrendingUp className="w-6 h-6 text-cyan mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em]">Dificultad</p>
              <p className="text-white font-black font-display text-base mt-1">{tour.difficulty}</p>
            </div>
            <div className="border-l border-white/5 flex flex-col items-center p-2 col-span-1 relative z-10">
              <Languages className="w-6 h-6 text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em]">Idiomas</p>
              <p className="text-white font-black font-display text-base mt-1">Esp / Eng</p>
            </div>
            <div className="border-l border-white/5 flex flex-col items-center p-2 col-span-1 cursor-pointer hover:bg-white/5 rounded-2xl transition-all duration-300 relative z-10" onClick={handleScrollToReviews}>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400 mb-2 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em]">Valoración</p>
              <p className="text-secondary font-black font-display text-base mt-1 flex items-center justify-center gap-1">
                ★ {tour.rating} <span className="text-xs text-gray-400 font-medium">({tour.reviews || 100})</span>
              </p>
            </div>
          </div>

          {/* Description & Structured Highlights block */}
          {tour.id === 1 ? (
            <div className="bg-surface/50 border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-premium relative overflow-hidden backdrop-blur-xl">
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />
              
              <h3 className="text-2xl md:text-3xl font-black font-display mb-6 border-b border-white/10 pb-6 flex items-center gap-3 text-white relative z-10">
                <Sparkles className="w-6 h-6 text-secondary animate-pulse" /> 
                Experiencia Exclusiva
              </h3>

              <p className="text-gray-300 text-base leading-relaxed mb-10 text-justify relative z-10">
                {tour.desc}
              </p>

              {/* Pillars grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-8">
                
                {/* Buggy / ATV card */}
                <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex gap-5 hover:border-secondary/40 hover:bg-white/5 transition-all duration-500 group shadow-inner">
                  <div className="w-14 h-14 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-500">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-display uppercase tracking-widest group-hover:text-secondary transition-colors">
                      Adrenalina Pura
                    </h4>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                      Conduce tu propio ATV o Buggy de última generación por senderos rurales escarpados, cruzando pistas de barro salvaje.
                    </p>
                  </div>
                </div>

                {/* Cenote card */}
                <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex gap-5 hover:border-cyan/40 hover:bg-white/5 transition-all duration-500 group shadow-inner">
                  <div className="w-14 h-14 bg-cyan/10 text-cyan border border-cyan/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-display uppercase tracking-widest group-hover:text-cyan transition-colors">
                      Cenote Sagrado
                    </h4>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                      Explora una espectacular cueva subterránea de piedra caliza y sumérgete en aguas frescas y cristalinas 100% naturales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Fire Tour VIP Guarantee Bar */}
              <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl text-xs text-gray-300 flex gap-4 items-start relative z-10 backdrop-blur-md shadow-glow">
                <ShieldCheck className="w-6 h-6 text-secondary flex-shrink-0 drop-shadow-md" />
                <div>
                  <h5 className="font-bold text-white mb-1 uppercase tracking-widest">Garantía VIP Fire Tour DR</h5>
                  <p className="leading-relaxed">Operamos directamente esta excursión sin intermediarios. Garantizamos vehículos modernos con mantenimiento diario, guías locales certificados y recogida puntual VIP.</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-surface/50 border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-premium backdrop-blur-xl">
              <h3 className="text-2xl font-black font-display mb-6 border-b border-white/10 pb-5 flex items-center gap-3 text-white">
                <Compass className="w-6 h-6 text-secondary" /> Detalles de la Aventura
              </h3>
              <div className="space-y-6 text-gray-300 text-base leading-relaxed">
                <p className="text-justify">
                  {tour.desc}
                </p>
                
                {/* Contextual highlighted card */}
                <div className="bg-cyan/10 border border-cyan/20 p-5 rounded-2xl text-xs text-gray-300 flex gap-4 items-start shadow-glow">
                  <Info className="w-5 h-5 text-cyan flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-white mb-1 uppercase tracking-widest">Experiencia Premium</h5>
                    <p className="leading-relaxed">Todos nuestros tours cuentan con vehículos modernos con aire acondicionado, conductores profesionales y guías locales certificados.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inclusions & Travel Tips ("What's Included" and "What to Bring") */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inclusions */}
            <div className="bg-surface/50 border border-outline/40 p-6 rounded-3xl">
              <h3 className="text-lg font-bold font-display mb-4 border-b border-outline pb-3 flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ¿Qué está incluido?
              </h3>
              <ul className="flex flex-col gap-3">
                {tour.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Tips / What to Bring */}
            <div className="bg-surface/50 border border-outline/40 p-6 rounded-3xl">
              <h3 className="text-lg font-bold font-display mb-4 border-b border-outline pb-3 flex items-center gap-2 text-white">
                <ShieldAlert className="w-5 h-5 text-secondary" /> Recomendaciones
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li className="flex gap-2.5 items-start">
                  <span className="text-secondary font-black mt-0.5">•</span>
                  <span>Traje de baño puesto, toallas y ropa extra para cambiarte.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-secondary font-black mt-0.5">•</span>
                  <span>Protector solar y repelente de insectos biodegradable.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-secondary font-black mt-0.5">•</span>
                  <span>Lentes de sol, gorra y calzado cómodo que pueda mojarse.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-secondary font-black mt-0.5">•</span>
                  <span>Dinero en efectivo extra para recuerdos, souvenirs y propinas.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Interactive vertical roadmap itinerary (Awwwards Timeline Accordion) */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="bg-gradient-to-br from-surface to-[#081223] border border-outline/50 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
              {/* Premium Background Glow Effect */}
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-xl md:text-2xl font-bold font-display mb-8 border-b border-outline/50 pb-4 flex items-center gap-2.5 relative z-10 text-white">
                <Map className="w-6 h-6 text-cyan" /> Itinerario Dinámico de la Aventura
              </h3>
              
              <div className="flex flex-col gap-0 relative z-10 ml-2">
                {tour.itinerary.map((step, idx) => {
                  const isExpanded = activeTimelineStep === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-5 group cursor-pointer`}
                      onClick={() => setActiveTimelineStep(isExpanded ? null : idx)}
                    >
                      {/* Left timeline markers with glows */}
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 shadow-md ${
                            isExpanded 
                              ? 'border-secondary bg-secondary/20 shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110 text-secondary' 
                              : 'border-outline bg-[#08131d] text-white hover:border-cyan hover:shadow-[0_0_10px_rgba(0,189,214,0.3)]'
                          } z-10 relative`}
                        >
                          <span className="text-xs font-black font-display">{idx + 1}</span>
                        </div>
                        {idx !== tour.itinerary!.length - 1 && (
                          <div className={`w-0.5 h-full min-h-[3.5rem] bg-gradient-to-b transition-colors duration-500 ${
                            isExpanded 
                              ? 'from-secondary/60 to-transparent' 
                              : 'from-outline/70 to-transparent group-hover:from-cyan/50'
                          }`} />
                        )}
                      </div>
                      
                      {/* Right timeline details accordion */}
                      <div className="pb-8 pt-1.5 flex-1 select-none">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border transition-colors duration-300 ${
                            isExpanded 
                              ? 'bg-secondary/15 text-secondary border-secondary/35' 
                              : 'bg-outline/40 text-gray-400 border-outline'
                          }`}>
                            {step.time}
                          </span>
                          <h4 className={`font-bold font-display text-sm md:text-base transition-colors ${isExpanded ? 'text-secondary font-black' : 'text-white'}`}>
                            {step.title}
                          </h4>
                          <ChevronDown className={`w-4 h-4 ml-auto text-gray-500 transition-transform duration-300 ${isExpanded ? 'transform rotate-180 text-secondary' : ''}`} />
                        </div>
                        
                        {/* Animated collapsible content */}
                        <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                          <p className="text-gray-400 text-xs md:text-sm leading-relaxed pl-1 border-l border-outline/30">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Proof & Customer Reviews Panel */}
          <div ref={reviewsRef} className="bg-surface/50 border border-outline/40 p-6 md:p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold font-display mb-6 border-b border-outline pb-4 flex items-center gap-2.5 text-white">
              <Smile className="w-5 h-5 text-amber-400" /> Reseñas de Aventureros Realistas
            </h3>

            {/* Ratings Summary Header Graph */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-bgDark/40 p-5 rounded-2xl border border-outline/40 items-center">
              
              {/* Massive stars summary */}
              <div className="text-center md:border-r border-outline/40 py-2">
                <p className="text-5xl font-black font-display text-white">{tour.rating}</p>
                <div className="flex gap-1 justify-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(tour.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{tour.reviews || 100} opiniones certificadas</p>
              </div>

              {/* Graphical distribution bars */}
              <div className="col-span-2 flex flex-col gap-2.5 text-xs text-gray-400 font-display px-2">
                <div className="flex items-center gap-3">
                  <span className="w-10">5 estrellas</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[88%] rounded-full" />
                  </div>
                  <span className="w-8 text-right font-bold text-white">88%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10">4 estrellas</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[10%] rounded-full" />
                  </div>
                  <span className="w-8 text-right font-bold text-white">10%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10">3 estrellas</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 w-[2%] rounded-full" />
                  </div>
                  <span className="w-8 text-right font-bold text-white">2%</span>
                </div>
              </div>

            </div>

            {/* Individual Review Feeds */}
            <div className="flex flex-col gap-6">
              {reviewsPool.map((review, idx) => (
                <div key={idx} className="bg-surface/80 border border-outline/30 p-5 rounded-2xl flex flex-col gap-3 hover:border-outline transition duration-300">
                  <div className="flex justify-between items-start gap-4">
                    {/* User profile row */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${review.avatarBg} flex items-center justify-center font-bold font-display text-white text-sm shadow`}>
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">{review.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                            Compra Verificada
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    {/* Rating stars display */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans text-justify">
                    "{review.comment}"
                  </p>

                  {/* Helpfulness counter */}
                  <div className="flex justify-between items-center border-t border-outline/30 pt-3 mt-1 text-[11px] text-gray-500 font-display">
                    <span className="flex items-center gap-1 text-emerald-400/80">
                      <ShieldCheck className="w-3.5 h-3.5" /> Recomienda este producto
                    </span>
                    <button 
                      onClick={() => handleVoteHelpful(idx)}
                      disabled={votedReviews[idx]}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition font-bold ${
                        votedReviews[idx] 
                          ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                          : 'border-outline bg-[#08131d] hover:border-gray-500 text-gray-400'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" /> 
                      {votedReviews[idx] ? '¡Votado!' : '¿Es útil?'} ({votedReviews[idx] ? review.helpfulCount + 1 : review.helpfulCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </motion.div>

        {/* Right Column: Live Booking Calculator Sidebar (Stays sticky on desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-6 relative z-30"
        >
          
          <div ref={calculatorRef} className="bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-premium sticky top-32">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              <h3 className="text-lg font-black font-display text-white tracking-wide">Calculadora de Reserva</h3>
            </div>

            
            {/* Price display */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Precio por Adulto</span>
              <span className="text-secondary text-2xl font-black font-display flex items-baseline gap-1">
                ${tour.price} <span className="text-xs text-gray-400 font-bold">USD</span>
              </span>
            </div>

            {/* Inputs grid */}
            <div className="flex flex-col gap-4">
              
              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan drop-shadow-md" /> Fecha del Viaje
                </label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} 
                    className="bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 w-full font-bold font-display shadow-inner transition-all group-hover:border-white/30 cursor-pointer"
                  />
                </div>
              </div>

              {/* Adults Input */}
              <div className="flex items-center justify-between border-t border-outline/40 pt-4 mt-2">
                <div>
                  <label className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-secondary" /> Adultos
                  </label>
                  <p className="text-gray-500 text-[9px] mt-0.5">Precio base (${tour.price} USD)</p>
                </div>
                <div className="flex items-center gap-3 bg-bgDark border border-outline rounded-full px-2.5 py-1">
                  <button 
                    disabled={adults <= 1}
                    onClick={() => setAdults(prev => prev - 1)}
                    className="w-7 h-7 rounded-full border border-outline/50 bg-[#08131d] text-white hover:border-secondary font-black flex items-center justify-center disabled:opacity-30 disabled:hover:border-outline/50 transition"
                  >
                    -
                  </button>
                  <span className="text-white font-extrabold font-display text-sm w-4 text-center">{adults}</span>
                  <button 
                    onClick={() => setAdults(prev => prev + 1)}
                    className="w-7 h-7 rounded-full border border-outline/50 bg-[#08131d] text-white hover:border-secondary font-black flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Input with marked discount */}
              <div className="flex items-center justify-between border-t border-outline/40 pt-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <label className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan" /> Niños
                    </label>
                    <span className="bg-cyan/10 text-cyan text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-cyan/20">
                      -40% OFF
                    </span>
                  </div>
                  <p className="text-gray-500 text-[9px] mt-0.5">De 2 a 12 años (${Math.round(tour.price * 0.6)} USD)</p>
                </div>
                <div className="flex items-center gap-3 bg-bgDark border border-outline rounded-full px-2.5 py-1">
                  <button 
                    disabled={children <= 0}
                    onClick={() => setChildren(prev => prev - 1)}
                    className="w-7 h-7 rounded-full border border-outline/50 bg-[#08131d] text-white hover:border-secondary font-black flex items-center justify-center disabled:opacity-30 disabled:hover:border-outline/50 transition"
                  >
                    -
                  </button>
                  <span className="text-white font-extrabold font-display text-sm w-4 text-center">{children}</span>
                  <button 
                    onClick={() => setChildren(prev => prev + 1)}
                    className="w-7 h-7 rounded-full border border-outline/50 bg-[#08131d] text-white hover:border-secondary font-black flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Strict itemized bill breakdowns */}
            <div className="bg-bgDark/80 border border-outline/50 rounded-2xl p-4 mt-6 flex flex-col gap-2 text-xs font-display">
              <div className="flex justify-between items-center text-gray-400">
                <span>Precio Total de la Excursión</span>
                <span className="text-white font-bold">${totalPrice} USD</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Cargos de Gestión e Impuestos</span>
                <span className="text-emerald-400 font-extrabold uppercase text-[9px] tracking-wide">Gratis / Incluidos</span>
              </div>
              
              <div className="border-t border-outline/50 my-2 pt-3 flex flex-col gap-2 font-display">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-sm">Depósito a Pagar Ahora ($25 x Persona)</span>
                  <span className="text-secondary text-2xl font-black tracking-tight">${depositToPay} <span className="text-[10px] text-gray-500 font-normal">USD</span></span>
                </div>
                <div className="flex justify-between items-center mt-2 px-3 py-2 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="text-gray-300 font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> Saldo a pagar el día del tour:
                  </span>
                  <span className="text-white font-black">${balanceDue} USD</span>
                </div>
              </div>
            </div>

            {/* CTA action button */}
            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-secondary hover:bg-orange-600 text-white font-extrabold font-display py-4 rounded-2xl flex items-center justify-center gap-2 mt-6 shadow-lg shadow-secondary/15 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Completar Reserva <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secure Stripe Purchase Certificate */}
          <div className="bg-surface/30 border border-outline/30 rounded-2xl p-4 flex gap-3 text-xs text-gray-400 items-start">
            <Landmark className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white mb-0.5 uppercase tracking-wide">Pago 100% Protegido</h5>
              <p className="leading-relaxed">Tus transacciones se procesan mediante Stripe de forma segura utilizando encriptación avanzada AES de 256 bits.</p>
            </div>
          </div>

        </motion.div>

      </div>

      {/* Modern Lightbox Gallery Overlay Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          {/* Lightbox Header */}
          <div className="flex justify-between items-center max-w-6xl mx-auto w-full border-b border-white/10 pb-4">
            <span className="font-display font-bold text-white/60 text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan animate-spin" /> Galería Multimedia de Fire Tour DR
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:text-secondary bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-full transition duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Big Showcase Slider */}
          <div className="flex-1 flex items-center justify-center relative max-w-5xl mx-auto w-full my-6">
            <button 
              disabled={activePhotoIndex === 0}
              onClick={() => setActivePhotoIndex(prev => prev - 1)}
              className="absolute left-2 md:left-4 z-10 text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 p-3 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img 
              src={photos[activePhotoIndex]} 
              alt="expanded-tour-gallery" 
              className="max-h-[70vh] max-w-full object-contain rounded-2xl border border-white/5 shadow-2xl select-none"
            />
            <button 
              disabled={activePhotoIndex === photos.length - 1}
              onClick={() => setActivePhotoIndex(prev => prev + 1)}
              className="absolute right-2 md:right-4 z-10 text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 p-3 rounded-full transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Navigating thumbnails slider at the bottom */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex gap-3 justify-center overflow-x-auto pb-4">
              {photos.map((photo, i) => (
                <button 
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activePhotoIndex === i 
                      ? 'border-secondary scale-105 shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                      : 'border-white/10 opacity-55 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt={`nav-thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 font-bold font-display mt-2 uppercase tracking-widest">
              Foto {activePhotoIndex + 1} de {photos.length}
            </p>
          </div>
        </div>
      )}

      {/* Mobile-Sticky Bottom Floating Reservation Bar (Hides on Desktop, active after scrolling past banner) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-lg border-t border-outline/50 px-5 py-4 flex items-center justify-between transition-transform duration-500 lg:hidden shadow-2xl ${
        showStickyMobileBar ? 'transform translate-y-0' : 'transform translate-y-full'
      }`}>
        <div className="font-display">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Precio Total Estimado</p>
          <p className="text-secondary text-xl font-black">${totalPrice} <span className="text-[10px] text-gray-400 font-bold">USD</span></p>
        </div>
        <button 
          onClick={handleMobileScrollToCalculator}
          className="bg-secondary hover:bg-orange-600 active:scale-95 text-white font-extrabold font-display text-sm py-3 px-6 rounded-xl flex items-center gap-1.5 transition duration-300 shadow-md shadow-secondary/15"
        >
          Reservar Ahora <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
