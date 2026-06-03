import React, { useState, useEffect, useRef } from 'react';
import { Plane, Hotel, Calendar, Users, Compass, ShieldCheck, Sparkles, MapPin, ArrowRight, Star, RefreshCw, Lock, Car, Check } from 'lucide-react';

// =========================================================================
// CONFIGURACIÓN DE AFILIADO DE TRAVELPAYOUTS
// =========================================================================
const TRAVELPAYOUTS_MARKER = '443038';
const TRAVELPAYOUTS_WHITE_LABEL_URL: string = ''; // Ej: 'https://vuelos.firetourdr.com'

// =========================================================================
// CONSTANTES DE SUGERENCIAS DE SKYSCANNER
// =========================================================================
const POPULAR_AIRPORTS = [
  { code: 'PUJ', name: 'Punta Cana International', country: 'República Dominicana' },
  { code: 'SDQ', name: 'Las Américas Santo Domingo', country: 'República Dominicana' },
  { code: 'MIA', name: 'Miami International Airport', country: 'EE.UU.' },
  { code: 'JFK', name: 'John F. Kennedy New York', country: 'EE.UU.' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', country: 'España' },
  { code: 'BOG', name: 'El Dorado Bogotá', country: 'Colombia' },
  { code: 'YYC', name: 'Calgary International Airport', country: 'Canadá' },
  { code: 'YYZ', name: 'Toronto Pearson International', country: 'Canadá' }
];

const POPULAR_HOTELS = [
  'Punta Cana, República Dominicana',
  'Santo Domingo, República Dominicana',
  'Las Terrenas, Samaná, RD',
  'Las Galeras, Samaná, RD',
  'Cabarete, Puerto Plata, RD',
  'Cap Cana, Punta Cana, RD'
];

export default function TravelpayoutsPage() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'cars'>('flights');
  
  // Estados de Control e Iframe Sandbox
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoadingFrame, setIsLoadingFrame] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando conexión segura...');
  const [progressWidth, setProgressWidth] = useState(0);

  // ==========================================
  // ESTADOS DE INTERACCIÓN PREMIUM (SKYSCANNER)
  // ==========================================
  const [tripType, setTripType] = useState<'round' | 'oneway'>('round');
  const [flightAdults, setFlightAdults] = useState(1);
  const [flightChildren, setFlightChildren] = useState(0);
  const [flightCabin, setFlightCabin] = useState<'Economy' | 'Premium' | 'Business' | 'First'>('Economy');
  
  // Sugeridores de Autocompletado
  const [showOriginSuggest, setShowOriginSuggest] = useState(false);
  const [showDestSuggest, setShowDestSuggest] = useState(false);
  const [showHotelSuggest, setShowHotelSuggest] = useState(false);
  const [showCarPickupSuggest, setShowCarPickupSuggest] = useState(false);
  const [showCarDropoffSuggest, setShowCarDropoffSuggest] = useState(false);
  
  // Popovers de Contadores
  const [showPassengerPopover, setShowPassengerPopover] = useState(false);
  const [showHotelGuestPopover, setShowHotelGuestPopover] = useState(false);
  
  // Renta Car Checkbox de Sincronización
  const [sameCarDropoff, setSameCarDropoff] = useState(true);

  // Clasificación y Filtros (Sorting & Filtering en Caliente)
  const [flightSort, setFlightSort] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [hotelSort, setHotelSort] = useState<'best' | 'cheapest' | 'stars'>('best');
  const [carSort, setCarSort] = useState<'best' | 'cheapest'>('best');
  const [flightStopsFilter, setFlightStopsFilter] = useState<'all' | 'direct' | 'stops'>('all');

  // ==========================================
  // FORM STATES POR DEFECTO
  // ==========================================
  const [origin, setOrigin] = useState('MIA');
  const [destination, setDestination] = useState('PUJ');
  const [departDate, setDepartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });

  const [hotelDestination, setHotelDestination] = useState('Punta Cana');
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [hotelGuests, setHotelGuests] = useState(2);

  const [carPickupLocation, setCarPickupLocation] = useState('Punta Cana (PUJ)');
  const [carDropoffLocation, setCarDropoffLocation] = useState('Punta Cana (PUJ)');
  const [carPickupDate, setCarPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [carDropoffDate, setCarDropoffDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [carAge, setCarAge] = useState(30);

  // States para resultados del motor backend
  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [hotelResults, setHotelResults] = useState<any[]>([]);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);
  const [hotelSearchError, setHotelSearchError] = useState<string | null>(null);

  const [carResults, setCarResults] = useState<any[]>([]);
  const [isSearchingCars, setIsSearchingCars] = useState(false);
  const [hasSearchedCars, setHasSearchedCars] = useState(false);
  const [carSearchError, setCarSearchError] = useState<string | null>(null);

  const loadingMessages = [
    "Buscando las mejores tarifas aéreas en tiempo real...",
    "Conectando con la red global de aerolíneas asociadas...",
    "Filtrando ofertas exclusivas en resorts de 5 estrellas...",
    "Estableciendo canal de reserva segura SSL encriptado...",
    "Cargando comparativa de itinerarios y disponibilidad..."
  ];

  // Incrementador y mensajes animados
  useEffect(() => {
    if (!isLoadingFrame) {
      setProgressWidth(0);
      return;
    }
    
    setLoadingMessage(loadingMessages[0]);
    setProgressWidth(10);
    
    let msgIndex = 1;
    const msgInterval = setInterval(() => {
      setLoadingMessage(loadingMessages[msgIndex % loadingMessages.length]);
      msgIndex++;
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 300);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [isLoadingFrame]);

  // ==========================================
  // DISPARADORES DE CONSULTA BACKEND
  // ==========================================
  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departDate) return;
    
    setIsSearchingFlights(true);
    setHasSearchedFlights(true);
    setSearchError(null);
    setFlightResults([]);
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');
    
    setProgressWidth(0);
    setLoadingMessage(loadingMessages[0]);
    
    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    try {
      const cabinParam = flightCabin === 'Business' || flightCabin === 'First' ? 'Business' : 'Economy';
      const returnDateParam = tripType === 'round' && returnDate ? `&returnDate=${returnDate}` : '';
      const response = await fetch(`http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&departDate=${departDate}${returnDateParam}&adults=${flightAdults}&cabin=${cabinParam}`);
      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgressWidth(100);
      
      setTimeout(() => {
        if (data.success) {
          setFlightResults(data.flights);
        } else {
          setSearchError(data.error || 'No se encontraron vuelos disponibles en esta ruta.');
        }
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingFlights(false);
        
        setTimeout(() => {
          const resElement = document.getElementById('native-flight-results');
          if (resElement) {
            resElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);
      
    } catch (err) {
      clearInterval(progressInterval);
      setProgressWidth(100);
      setTimeout(() => {
        setSearchError('Error de conexión con el motor de vuelos. Por favor verifica tu servidor Express.');
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingFlights(false);
      }, 500);
    }
  };

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelDestination || !checkIn || !checkOut) return;

    setIsSearchingHotels(true);
    setHasSearchedHotels(true);
    setHotelSearchError(null);
    setHotelResults([]);
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');

    setProgressWidth(0);
    setLoadingMessage("Buscando y comparando tarifas en cientos de agencias hoteleras...");

    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    try {
      const response = await fetch(`http://localhost:5000/api/hotels/search?destination=${encodeURIComponent(hotelDestination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${hotelGuests}`);
      const data = await response.json();

      clearInterval(progressInterval);
      setProgressWidth(100);

      setTimeout(() => {
        if (data.success) {
          setHotelResults(data.hotels);
        } else {
          setHotelSearchError(data.error || 'No se encontraron hoteles disponibles.');
        }
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingHotels(false);

        setTimeout(() => {
          const resElement = document.getElementById('native-hotel-results');
          if (resElement) {
            resElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setProgressWidth(100);
      setTimeout(() => {
        setHotelSearchError('Error de red al consultar el motor de hoteles. Verifica tu Express server.');
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingHotels(false);
      }, 500);
    }
  };

  const handleCarSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carPickupLocation || !carPickupDate || !carDropoffDate) return;

    setIsSearchingCars(true);
    setHasSearchedCars(true);
    setCarSearchError(null);
    setCarResults([]);
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');

    setProgressWidth(0);
    setLoadingMessage("Buscando las mejores ofertas en renta car en Punta Cana...");

    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    try {
      const dropoffParam = sameCarDropoff ? carPickupLocation : carDropoffLocation;
      const response = await fetch(`http://localhost:5000/api/cars/search?pickup=${encodeURIComponent(carPickupLocation)}&dropoff=${encodeURIComponent(dropoffParam)}&pickupDate=${carPickupDate}&dropoffDate=${carDropoffDate}&age=${carAge}`);
      const data = await response.json();

      clearInterval(progressInterval);
      setProgressWidth(100);

      setTimeout(() => {
        if (data.success) {
          setCarResults(data.cars);
        } else {
          setCarSearchError(data.error || 'No se encontraron coches disponibles.');
        }
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingCars(false);

        setTimeout(() => {
          const resElement = document.getElementById('native-car-results');
          if (resElement) {
            resElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setProgressWidth(100);
      setTimeout(() => {
        setCarSearchError('Error de red al consultar el motor de renta car. Verifica tu Express server.');
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingCars(false);
      }, 500);
    }
  };

  // Disparar búsqueda rápida de rutas populares
  const handlePopularRouteSearch = async (originCode: string) => {
    setOrigin(originCode.toUpperCase());
    setDestination('PUJ');
    setTripType('round');
    
    setIsSearchingFlights(true);
    setHasSearchedFlights(true);
    setSearchError(null);
    setFlightResults([]);
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');
    setProgressWidth(0);
    setLoadingMessage(loadingMessages[0]);
    
    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    try {
      const response = await fetch(`http://localhost:5000/api/flights/search?origin=${originCode}&destination=PUJ&departDate=${departDate}&returnDate=${returnDate}&adults=1&cabin=Economy`);
      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgressWidth(100);
      
      setTimeout(() => {
        if (data.success) {
          setFlightResults(data.flights);
        } else {
          setSearchError(data.error || 'No se encontraron vuelos.');
        }
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingFlights(false);
        
        setTimeout(() => {
          const resElement = document.getElementById('native-flight-results');
          if (resElement) {
            resElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setProgressWidth(100);
      setTimeout(() => {
        setSearchError('Error de red al consultar la ruta popular.');
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingFlights(false);
      }, 500);
    }
  };

  // Disparar redirección para reservas de resorts
  const handleResortSearch = (resortName: string) => {
    const baseSearchUrl = `search?location=${encodeURIComponent(resortName)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=2&marker=${TRAVELPAYOUTS_MARKER}&locale=es`;
    const searchUrl = `https://hotellook.com/${baseSearchUrl}`;
    
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');
    
    setTimeout(() => {
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      setIframeUrl(null);
      setIsLoadingFrame(false);
    }, 1800);
  };

  const handleClearIframe = () => {
    setIframeUrl(null);
    setIsLoadingFrame(false);
  };

  // ==========================================
  // FILTRADO Y ORDENACIÓN EN FRONTIER SKYSCANNER
  // ==========================================
  
  // Filtrado de Vuelos por Escalas y Ordenación
  const getProcessedFlights = () => {
    let list = [...flightResults];
    
    // Filtro de Escalas
    if (flightStopsFilter === 'direct') {
      list = list.filter(f => f.stops === 'Directo');
    } else if (flightStopsFilter === 'stops') {
      list = list.filter(f => f.stops !== 'Directo');
    }

    // Ordenación
    if (flightSort === 'cheapest') {
      list.sort((a, b) => a.price - b.price);
    } else if (flightSort === 'fastest') {
      const getMins = (durStr: string) => {
        const numbers = durStr.match(/\d+/g);
        if (!numbers) return 0;
        if (numbers.length === 2) return parseInt(numbers[0]) * 60 + parseInt(numbers[1]);
        return parseInt(numbers[0]);
      };
      list.sort((a, b) => getMins(a.duration) - getMins(b.duration));
    } else {
      // 'best' - balance rating/price
      list.sort((a, b) => {
        const aVal = a.price * 1.2 + (a.stops === 'Directo' ? 0 : 150);
        const bVal = b.price * 1.2 + (b.stops === 'Directo' ? 0 : 150);
        return aVal - bVal;
      });
    }

    return list;
  };

  // Ordenación de Hoteles
  const getProcessedHotels = () => {
    let list = [...hotelResults];

    if (hotelSort === 'cheapest') {
      const getCheapest = (h: any) => Math.min(...h.offers.map((o: any) => o.pricePerNight));
      list.sort((a, b) => getCheapest(a) - getCheapest(b));
    } else if (hotelSort === 'stars') {
      list.sort((a, b) => b.stars - a.stars);
    } else {
      // 'best' - rating
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  // Ordenación de Coches
  const getProcessedCars = () => {
    let list = [...carResults];

    if (carSort === 'cheapest') {
      const getCheapest = (c: any) => Math.min(...c.offers.map((o: any) => o.pricePerDay));
      list.sort((a, b) => getCheapest(a) - getCheapest(b));
    } else {
      // 'best' - rating
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  const processedFlights = getProcessedFlights();
  const processedHotels = getProcessedHotels();
  const processedCars = getProcessedCars();

  const popularRoutes = [
    { from: 'Miami (MIA)', price: '$210', originCode: 'MIA' },
    { from: 'New York (JFK)', price: '$340', originCode: 'JFK' },
    { from: 'Madrid (MAD)', price: '$620', originCode: 'MAD' },
    { from: 'Bogotá (BOG)', price: '$290', originCode: 'BOG' },
    { from: 'Calgary (YYC)', price: '$410', originCode: 'YYC' }
  ];

  const featuredResorts = [
    {
      name: 'Hard Rock Hotel & Casino Punta Cana',
      rating: 4.8,
      reviews: 4125,
      price: '$380',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
      desc: 'Lujo extremo todo incluido con 13 piscinas, el casino más vibrante del Caribe y una idílica playa privada.'
    },
    {
      name: 'Hyatt Ziva & Zilara Cap Cana',
      rating: 4.9,
      reviews: 2890,
      price: '$450',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600',
      desc: 'Ubicado en el exclusivo enclave privado de Cap Cana, este santuario caribeño destaca por su piscina infinita de ensueño.'
    },
    {
      name: 'Paradisus Palma Real Golf & Spa',
      rating: 4.7,
      reviews: 3120,
      price: '$310',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600',
      desc: 'Elegancia colonial española rodeada de jardines tropicales exóticos, campos de golf de campeonato y spa zen frente al mar.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-bgDark pb-20 pt-10">
      
      {/* Luces y gradientes traseros de ambiente premium */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute top-2/4 right-1/4 w-[600px] h-[600px] bg-cyan/15 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />

      {/* Contenedor Principal */}
      <div className="max-w-7xl mx-auto px-6 font-display">

        {/* 1. MODO VISOR ACTIVO (IFRAME EN-SITIO) */}
        {iframeUrl !== null ? (
          <div className="flex flex-col gap-6 animate-fadeIn relative z-10">
            
            {/* Cabecera del Visor de Vidrio Esmerilado */}
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
              <div className="flex items-center gap-4">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                </span>
                <div>
                  <h4 className="text-white text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary animate-pulse" /> Visor de Reservas Seguro
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <Lock className="w-3.5 h-3.5 text-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" /> Conexión Directa Encriptada SSL — Fire Tour DR
                  </p>
                </div>
              </div>

              <button
                onClick={handleClearIframe}
                className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-inner"
              >
                ← Volver a Buscar
              </button>
            </div>

            {/* Contenedor del Iframe & Pantalla de Carga */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              
              {/* Pantalla de Carga Premium Caribeña */}
              {isLoadingFrame && (
                <div className="absolute inset-0 z-40 bg-bgDark/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
                  
                  {/* Neon Spinner */}
                  <div className="relative mb-8 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-secondary animate-spin shadow-[0_0_30px_rgba(249,115,22,0.3)]"></div>
                    <RefreshCw className="w-8 h-8 text-cyan absolute animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
                  </div>

                  {/* Texto de Carga Dinámico */}
                  <h3 className="text-white font-black text-lg uppercase tracking-[0.2em] mb-3 max-w-lg leading-relaxed animate-pulse">
                    {loadingMessage}
                  </h3>
                  
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.15em] mb-8">
                    Manteniéndote seguro dentro de Fire Tour DR
                  </p>

                  {/* Barra de Progreso Dinámica */}
                  <div className="w-80 bg-black/50 border border-white/10 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-secondary via-orange-400 to-cyan h-full rounded-full transition-all duration-300 relative"
                      style={{ width: `${progressWidth}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1.5s_infinite]" />
                    </div>
                  </div>

                </div>
              )}

              {iframeUrl !== 'loading_only' && (
                <iframe
                  src={iframeUrl}
                  title="Búsqueda de Vuelos y Hoteles en Punta Cana"
                  onLoad={() => setIsLoadingFrame(false)}
                  className={`w-full h-[75vh] md:h-[85vh] bg-white transition-opacity duration-1000 ${
                    isLoadingFrame ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  }`}
                  allowFullScreen
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                />
              )}

            </div>

          </div>
        ) : (
          /* 2. MODO BUSCADOR Y CATÁLOGO POR DEFECTO */
          <div className="animate-fadeIn relative z-10">
            
            {/* Hero Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 mt-8">
              <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-secondary/20 inline-flex items-center gap-2 mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" /> Portal de Vuelos
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                Buscador de Vuelos <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">Exclusivos</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 font-bold leading-relaxed max-w-2xl mx-auto tracking-wide">
                Planifica tu viaje de ensueño al Caribe. Compara precios reales de vuelos globales sin salir de nuestro portal seguro.
              </p>
            </div>

            {/* Módulo Principal de Búsqueda de Vidrio Esmerilado */}
            <div className="bg-surface/30 backdrop-blur-xl border border-outline rounded-3xl p-5 md:p-8 shadow-2xl relative mb-16 max-w-4xl mx-auto">
              
              {/* ==========================================
                  FORMULARIO DE VUELOS (SKYSCANNER STYLE)
                  ========================================== */}
              {/* We only render the flights form now */}
              {(
                <form onSubmit={handleFlightSearch} className="flex flex-col gap-5 relative">
                  
                  {/* Shields de Clic Externo para Cerrar Popovers de Sugerencias */}
                  {(showOriginSuggest || showDestSuggest || showPassengerPopover) && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => {
                        setShowOriginSuggest(false);
                        setShowDestSuggest(false);
                        setShowPassengerPopover(false);
                      }} 
                    />
                  )}

                  {/* Trip Type Selector (Ida y vuelta / Solo ida) */}
                  <div className="flex items-center gap-4 mb-1">
                    <button
                      type="button"
                      onClick={() => setTripType('round')}
                      className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition ${
                        tripType === 'round'
                          ? 'bg-secondary/15 text-secondary border-secondary/35'
                          : 'text-gray-400 border-outline/50 hover:text-white hover:border-white'
                      }`}
                    >
                      Ida y Vuelta
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('oneway')}
                      className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition ${
                        tripType === 'oneway'
                          ? 'bg-secondary/15 text-secondary border-secondary/35'
                          : 'text-gray-400 border-outline/50 hover:text-white hover:border-white'
                      }`}
                    >
                      Solo Ida
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Origen Input con Autocomplete Popover */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary" /> Origen
                      </label>
                      <input
                        type="text"
                        required
                        value={origin}
                        onFocus={() => {
                          setShowOriginSuggest(true);
                          setShowDestSuggest(false);
                          setShowPassengerPopover(false);
                        }}
                        onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                        placeholder="MIA"
                        className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary font-bold z-50"
                      />
                      
                      {showOriginSuggest && (
                        <div className="absolute top-[72px] left-0 right-0 bg-bgDark border border-outline rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-1.5 animate-fadeIn">
                          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider border-b border-outline/35 pb-1 mb-1">
                            Aeropuertos Recomendados
                          </p>
                          {POPULAR_AIRPORTS.map((airport) => (
                            <button
                              key={airport.code}
                              type="button"
                              onClick={() => {
                                setOrigin(airport.code);
                                setShowOriginSuggest(false);
                              }}
                              className="flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface/50 transition text-xs font-bold text-gray-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-outline/40 px-1.5 py-0.5 rounded text-gray-400">✈️</span>
                                <div>
                                  <p className="leading-tight">{airport.name}</p>
                                  <p className="text-[8px] text-gray-500">{airport.country}</p>
                                </div>
                              </div>
                              <span className="text-secondary font-black">{airport.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Destino Input con Autocomplete Popover */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan" /> Destino
                      </label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onFocus={() => {
                          setShowDestSuggest(true);
                          setShowOriginSuggest(false);
                          setShowPassengerPopover(false);
                        }}
                        onChange={(e) => setDestination(e.target.value.toUpperCase())}
                        placeholder="PUJ"
                        className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan font-bold z-50"
                      />

                      {showDestSuggest && (
                        <div className="absolute top-[72px] left-0 right-0 bg-bgDark border border-outline rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-1.5 animate-fadeIn">
                          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider border-b border-outline/35 pb-1 mb-1">
                            Destinos Dominicanos y Conexiones
                          </p>
                          {POPULAR_AIRPORTS.map((airport) => (
                            <button
                              key={airport.code}
                              type="button"
                              onClick={() => {
                                setDestination(airport.code);
                                setShowDestSuggest(false);
                              }}
                              className="flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface/50 transition text-xs font-bold text-gray-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-outline/40 px-1.5 py-0.5 rounded text-gray-400">✈️</span>
                                <div>
                                  <p className="leading-tight">{airport.name}</p>
                                  <p className="text-[8px] text-gray-500">{airport.country}</p>
                                </div>
                              </div>
                              <span className="text-cyan font-black">{airport.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {destination === 'PUJ' && (
                        <span className="absolute right-3.5 bottom-3.5 bg-cyan/10 text-cyan text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-cyan/20 pointer-events-none">
                          Punta Cana
                        </span>
                      )}
                    </div>

                    {/* Fecha Salida Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Salida
                      </label>
                      <input
                        type="date"
                        required
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="bg-bgDark border border-outline rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-secondary font-bold"
                      />
                    </div>

                    {/* Fecha Regreso Input (Opcional - Condicionado a TripType) */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Vuelta
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required={tripType === 'round'}
                          disabled={tripType === 'oneway'}
                          value={tripType === 'oneway' ? '' : returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className={`bg-bgDark border border-outline rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-secondary font-bold w-full ${
                            tripType === 'oneway' ? 'opacity-35 cursor-not-allowed bg-surface/10' : ''
                          }`}
                        />
                        {tripType === 'oneway' && (
                          <div className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 pointer-events-none">
                            <Lock className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline/30 pt-4">
                    
                    {/* Pasajeros y Clase Consolidado (Popover Popup de Skyscanner) */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> Pasajeros y Clase
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPassengerPopover(!showPassengerPopover);
                          setShowOriginSuggest(false);
                          setShowDestSuggest(false);
                        }}
                        className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-left text-sm text-white focus:outline-none focus:border-secondary font-bold flex items-center justify-between z-50"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-secondary" />
                          {flightAdults + flightChildren} {flightAdults + flightChildren === 1 ? 'Viajero' : 'Viajeros'}, {
                            flightCabin === 'Economy' ? 'Turista' :
                            flightCabin === 'Premium' ? 'Turista Premium' :
                            flightCabin === 'Business' ? 'Ejecutiva' : 'Primera Clase'
                          }
                        </span>
                        <span className="text-[9px] bg-outline/40 px-2 py-0.5 rounded text-gray-400 uppercase">Cambiar</span>
                      </button>

                      {showPassengerPopover && (
                        <div className="absolute top-[72px] left-0 w-full md:w-[380px] bg-bgDark border border-outline rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-4 animate-scaleUp">
                          <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-widest border-b border-outline/30 pb-2 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-secondary animate-spin" /> Pasajeros y Clase
                          </h4>
                          
                          {/* Adultos */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-xs font-black uppercase">Adultos</p>
                              <p className="text-[8px] text-gray-500">Edad 18 o más</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={flightAdults <= 1}
                                onClick={() => setFlightAdults(prev => prev - 1)}
                                className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-white hover:border-secondary transition disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="text-white font-black text-sm w-4 text-center">{flightAdults}</span>
                              <button
                                type="button"
                                disabled={flightAdults >= 9}
                                onClick={() => setFlightAdults(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-white hover:border-secondary transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Niños */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-xs font-black uppercase">Niños</p>
                              <p className="text-[8px] text-gray-500">Edad 0-17 años</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={flightChildren <= 0}
                                onClick={() => setFlightChildren(prev => prev - 1)}
                                className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-white hover:border-secondary transition disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="text-white font-black text-sm w-4 text-center">{flightChildren}</span>
                              <button
                                type="button"
                                disabled={flightChildren >= 6}
                                onClick={() => setFlightChildren(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-white hover:border-secondary transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Clase de Cabina */}
                          <div className="flex flex-col gap-1.5 border-t border-outline/30 pt-3">
                            <p className="text-white text-[9px] font-black uppercase tracking-wider mb-1">Clase de Cabina</p>
                            <div className="grid grid-cols-2 gap-2">
                              {(['Economy', 'Premium', 'Business', 'First'] as const).map(c => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setFlightCabin(c)}
                                  className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-wide border transition ${
                                    flightCabin === c
                                      ? 'bg-secondary/15 text-secondary border-secondary/40'
                                      : 'bg-surface/20 text-gray-400 border-outline/40 hover:text-white'
                                  }`}
                                >
                                  {c === 'Economy' ? 'Turista' :
                                   c === 'Premium' ? 'Premium' :
                                   c === 'Business' ? 'Business' : 'Primera'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Botón Aplicar */}
                          <button
                            type="button"
                            onClick={() => setShowPassengerPopover(false)}
                            className="bg-secondary hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl transition duration-300 mt-2 shadow-md shadow-secondary/15 active:scale-95"
                          >
                            Hecho
                          </button>
                        </div>
                      )}

                    </div>

                    {/* Botón Buscar Vuelo */}
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-secondary hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/15 transition-all duration-300 active:scale-95 hover:scale-[1.01]"
                      >
                        Buscar Vuelos en Tiempo Real <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </form>
              )}



            </div>

            {/* ==========================================
                3. RESULTADOS NATIVOS DE VUELOS (SKYSCANNER STYLE)
                ========================================== */}
            {hasSearchedFlights && (
              <div id="native-flight-results" className="max-w-4xl mx-auto mb-16 animate-fadeIn">
                <div className="bg-surface/20 backdrop-blur-xl border border-outline rounded-3xl p-5 md:p-8 shadow-2xl relative">
                  
                  {/* Neon light behind */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Header de Resultados */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-outline/35 pb-5 mb-6 gap-4">
                    <div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Tarifas Disponibles En-Sitio
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                        ✈️ Vuelos Encontrados: {origin} ➔ {destination}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                        Ida: {departDate} {tripType === 'round' && returnDate ? `| Vuelta: ${returnDate}` : ''} | {flightAdults + flightChildren} {flightAdults + flightChildren === 1 ? 'Pasajero' : 'Pasajeros'} | Clase: {flightCabin}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setHasSearchedFlights(false);
                        setFlightResults([]);
                      }}
                      className="text-[9px] text-gray-400 hover:text-white font-black uppercase tracking-widest border border-outline hover:border-white px-4 py-2.5 rounded-xl transition active:scale-95 self-start md:self-center"
                    >
                      Limpiar
                    </button>
                  </div>

                  {searchError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 text-center text-xs font-bold uppercase tracking-wide">
                      ⚠️ {searchError}
                    </div>
                  ) : flightResults.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full border-4 border-outline border-t-secondary animate-spin mx-auto mb-4" />
                      <p className="text-xs text-gray-400 font-black uppercase tracking-wider">Cargando e itinerando tarifas aéreas del servidor...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      
                      {/* Pestañas de Clasificación Skyscanner & Filtros Rápidos */}
                      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-bgDark/45 border border-outline/40 p-4 rounded-2xl">
                        
                        {/* Skyscanner Sorting Tabs */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => setFlightSort('best')}
                            className={`flex-1 md:flex-none text-[9px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition ${
                              flightSort === 'best'
                                ? 'bg-secondary text-white border-secondary/40 shadow-md'
                                : 'text-gray-400 border-outline/35 hover:text-white'
                            }`}
                          >
                            ⭐ El Mejor
                          </button>
                          <button
                            onClick={() => setFlightSort('cheapest')}
                            className={`flex-1 md:flex-none text-[9px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition ${
                              flightSort === 'cheapest'
                                ? 'bg-secondary text-white border-secondary/40 shadow-md'
                                : 'text-gray-400 border-outline/35 hover:text-white'
                            }`}
                          >
                            💰 Más Barato
                          </button>
                          <button
                            onClick={() => setFlightSort('fastest')}
                            className={`flex-1 md:flex-none text-[9px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition ${
                              flightSort === 'fastest'
                                ? 'bg-secondary text-white border-secondary/40 shadow-md'
                                : 'text-gray-400 border-outline/35 hover:text-white'
                            }`}
                          >
                            ⚡ Más Rápido
                          </button>
                        </div>

                        {/* Escalas Filter */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <span className="text-[8px] text-gray-500 font-black uppercase tracking-wider hidden md:inline">Escalas:</span>
                          <div className="flex items-center gap-1.5 w-full md:w-auto">
                            {(['all', 'direct', 'stops'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => setFlightStopsFilter(s)}
                                className={`flex-1 md:flex-none py-1.5 px-3 rounded-lg text-[8px] font-black uppercase tracking-wide border transition ${
                                  flightStopsFilter === s
                                    ? 'bg-outline text-white border-white/20'
                                    : 'text-gray-400 border-outline/20 hover:text-white'
                                }`}
                              >
                                {s === 'all' ? 'Todos' : s === 'direct' ? 'Directos' : 'Con Escalas'}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Lista de Vuelos Filtrados y Ordenados */}
                      <div className="flex flex-col gap-4">
                        {processedFlights.map((flight) => (
                          <div 
                            key={flight.id} 
                            className="border border-outline/40 hover:border-secondary/45 bg-bgDark/20 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col md:flex-row items-center justify-between gap-6"
                          >
                            {/* Aerolínea */}
                            <div className="flex items-center gap-4 w-full md:w-1/4">
                              <img 
                                src={flight.logo} 
                                alt={flight.airline} 
                                className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-outline/35 p-1"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/AA.png';
                                }}
                              />
                              <div>
                                <p className="text-white text-xs font-black uppercase tracking-wide leading-tight">{flight.airline}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{flight.flightNumber}</p>
                              </div>
                            </div>

                            {/* Horarios e Itinerario */}
                            <div className="flex items-center justify-between md:justify-center gap-6 w-full md:w-2/5 border-y md:border-y-0 border-outline/20 py-3 md:py-0">
                              <div className="text-right">
                                <p className="text-white text-sm font-black tracking-tight">{flight.departureTime}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{flight.origin}</p>
                              </div>

                              <div className="flex-1 flex flex-col items-center relative max-w-[120px]">
                                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">{flight.duration}</span>
                                <div className="w-full h-0.5 bg-outline/50 relative flex items-center justify-center">
                                  <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan" />
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded ${
                                  flight.stops === 'Directo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {flight.stops}
                                </span>
                              </div>

                              <div className="text-left">
                                <p className="text-white text-sm font-black tracking-tight">{flight.arrivalTime}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{flight.destination}</p>
                              </div>
                            </div>

                            {/* Precio y Reserva */}
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-1/3">
                              <div className="text-left md:text-right">
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Ida por persona</p>
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400 text-xl font-black tracking-tight mt-0.5">
                                  ${flight.price} USD
                                </p>
                              </div>

                              <a 
                                href={flight.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-secondary hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl transition duration-300 flex items-center gap-1 active:scale-95 shadow-md shadow-secondary/15"
                              >
                                Ver Vuelo ➔
                              </a>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  <div className="bg-primary/20 border border-outline rounded-2xl p-4 flex gap-3 text-[10px] text-gray-400 items-start mt-6">
                    <ShieldCheck className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h5 className="font-black text-white mb-0.5 uppercase tracking-wide">Procesamiento Integrado en Fire Tour DR</h5>
                      <p className="leading-relaxed">Tus datos y selección de vuelos se sincronizan de forma segura con tu cuenta de afiliación en-sitio. Reservas encriptadas y respaldadas bajo estándares globales de la IATA.</p>
                    </div>
                  </div>

                </div>
              </div>
            )}



            {/* Rutas Populares de Skyscanner */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">
                    ✈️ Conexiones y Rutas Populares a Punta Cana
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Las tarifas de ida y vuelta más cotizadas por viajeros esta semana
                  </p>
                </div>
                <Compass className="w-6 h-6 text-secondary animate-pulse" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {popularRoutes.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePopularRouteSearch(route.originCode)}
                    className="bg-surface/30 hover:bg-surface/50 border border-outline hover:border-secondary p-4 rounded-2xl text-left transition duration-300 group flex flex-col justify-between h-28"
                  >
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Desde</p>
                      <p className="text-white text-xs font-black uppercase tracking-wide mt-0.5 group-hover:text-secondary transition">{route.from.split(' (')[0]}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">{route.from.match(/\(([^)]+)\)/)?.[1] || ''} ➔ PUJ</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[8px] text-gray-500 font-bold uppercase">Ida y vuelta</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400 text-xs font-black">{route.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>



          </div>
        )}

      </div>
    </div>
  );
}
