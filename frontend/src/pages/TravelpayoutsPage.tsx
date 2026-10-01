import React, { useState, useEffect, useRef } from 'react';
import { Plane, Hotel, Calendar, Users, Compass, ShieldCheck, Sparkles, MapPin, ArrowRight, ArrowLeft, Star, RefreshCw, Lock, Car, Check, Plus, Trash2, X, CheckCircle2, Ticket, ChevronDown, ChevronUp, Clock, Info, Luggage, AlertCircle, FileText, MessageSquare, Mail } from 'lucide-react';
import ModernDatePicker from '../components/ModernDatePicker';
import ComingSoonModal from '../components/ComingSoonModal';

// =========================================================================
// CONSTANTES DE SUGERENCIAS DE SKYSCANNER
// =========================================================================
const POPULAR_AIRPORTS = [
  { code: 'PUJ', name: 'Aeropuerto Internacional Punta Cana', city: 'Punta Cana', country: 'República Dominicana' },
  { code: 'SDQ', name: 'Aeropuerto Internacional Las Américas', city: 'Santo Domingo', country: 'República Dominicana' },
  { code: 'STI', name: 'Aeropuerto Internacional del Cibao', city: 'Santiago', country: 'República Dominicana' },
  { code: 'POP', name: 'Aeropuerto Internacional Gregorio Luperón', city: 'Puerto Plata', country: 'República Dominicana' },
  { code: 'LRM', name: 'Aeropuerto Internacional La Romana', city: 'La Romana', country: 'República Dominicana' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'EE.UU.' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood International Airport', city: 'Fort Lauderdale', country: 'EE.UU.' },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'EE.UU.' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'EE.UU.' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark / New York', country: 'EE.UU.' },
  { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'EE.UU.' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'EE.UU.' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'EE.UU.' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'EE.UU.' },
  { code: 'SJU', name: 'Aeropuerto Internacional Luis Muñoz Marín', city: 'San Juan', country: 'Puerto Rico' },
  { code: 'MAD', name: 'Aeropuerto Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'España' },
  { code: 'BCN', name: 'Aeropuerto Josep Tarradellas Barcelona-El Prat', city: 'Barcelona', country: 'España' },
  { code: 'CDG', name: 'Aéroport de Paris-Charles de Gaulle', city: 'París', country: 'Francia' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'Londres', country: 'Reino Unido' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Alemania' },
  { code: 'BOG', name: 'Aeropuerto Internacional El Dorado', city: 'Bogotá', country: 'Colombia' },
  { code: 'MDE', name: 'Aeropuerto Internacional José María Córdova', city: 'Medellín', country: 'Colombia' },
  { code: 'MEX', name: 'Aeropuerto Internacional Benito Juárez', city: 'Ciudad de México', country: 'México' },
  { code: 'CUN', name: 'Aeropuerto Internacional de Cancún', city: 'Cancún', country: 'México' },
  { code: 'PTY', name: 'Aeropuerto Internacional de Tocumen', city: 'Panamá', country: 'Panamá' },
  { code: 'LIM', name: 'Aeropuerto Internacional Jorge Chávez', city: 'Lima', country: 'Perú' },
  { code: 'EZE', name: 'Aeropuerto Internacional Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canadá' },
  { code: 'YUL', name: 'Aéroport international Pierre-Elliott-Trudeau', city: 'Montreal', country: 'Canadá' },
  { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canadá' }
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
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'cars'>('flights');
  
  // Estados de Control e Iframe Sandbox
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoadingFrame, setIsLoadingFrame] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando conexión segura...');
  const [progressWidth, setProgressWidth] = useState(0);

  // ==========================================
  // ESTADOS DE INTERACCIÓN PREMIUM (SKYSCANNER)
  // ==========================================
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multicity'>('round');
  const [flightAdults, setFlightAdults] = useState(1);
  const [flightChildren, setFlightChildren] = useState(0);
  const [flightCabin, setFlightCabin] = useState<'Economy' | 'Premium' | 'Business' | 'First'>('Economy');
  
  // Estado para viajes Multiciudad
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{ id: string; origin: string; destination: string; date: string }>>([
    {
      id: '1',
      origin: 'MIA',
      destination: 'PUJ',
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().split('T')[0];
      })()
    },
    {
      id: '2',
      origin: 'PUJ',
      destination: 'JFK',
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 21);
        return d.toISOString().split('T')[0];
      })()
    }
  ]);
  const [multiOriginSuggestIdx, setMultiOriginSuggestIdx] = useState<number | null>(null);
  const [multiDestSuggestIdx, setMultiDestSuggestIdx] = useState<number | null>(null);

  const handleAddLeg = () => {
    if (multiCityLegs.length >= 5) return;
    const lastLeg = multiCityLegs[multiCityLegs.length - 1];
    const nextDate = new Date(lastLeg.date + 'T00:00:00');
    nextDate.setDate(nextDate.getDate() + 7);
    setMultiCityLegs([
      ...multiCityLegs,
      {
        id: String(Date.now()),
        origin: lastLeg.destination,
        destination: 'SDQ',
        date: nextDate.toISOString().split('T')[0]
      }
    ]);
  };

  const handleRemoveLeg = (idx: number) => {
    if (multiCityLegs.length <= 2) return;
    setMultiCityLegs(multiCityLegs.filter((_, i) => i !== idx));
  };

  const handleUpdateLeg = (idx: number, field: 'origin' | 'destination' | 'date', value: string) => {
    setMultiCityLegs(multiCityLegs.map((leg, i) => i === idx ? { ...leg, [field]: value } : leg));
  };
  
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
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  // Estados para Modal de Reserva Directa de Vuelos (Duffel API)
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<any | null>(null);
  const [bookingPassenger, setBookingPassenger] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'm',
    email: '',
    phone: '',
    documentId: ''
  });
  const [paymentCard, setPaymentCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [isVerifyingPrice, setIsVerifyingPrice] = useState(false);
  const [verifiedPriceData, setVerifiedPriceData] = useState<any | null>(null);
  const [isSubmittingFlightBooking, setIsSubmittingFlightBooking] = useState(false);
  const [flightBookingSuccess, setFlightBookingSuccess] = useState<any | null>(null);
  const [flightBookingError, setFlightBookingError] = useState<string | null>(null);

  // Estados de Búsqueda Dinámica de Aeropuertos y Ciudades a Nivel Mundial
  const [originAirportsList, setOriginAirportsList] = useState<any[]>(POPULAR_AIRPORTS);
  const [destAirportsList, setDestAirportsList] = useState<any[]>(POPULAR_AIRPORTS);
  const [multiLegAirports, setMultiLegAirports] = useState<{ [key: string]: any[] }>({});
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const airportSearchTimerRef = useRef<any>(null);

  // Búsqueda en vivo de aeropuertos y ciudades a nivel mundial
  const searchAirportsApi = (query: string, setter: (list: any[]) => void) => {
    if (airportSearchTimerRef.current) {
      clearTimeout(airportSearchTimerRef.current);
    }

    const q = (query || '').trim();
    if (!q) {
      setter(POPULAR_AIRPORTS);
      return;
    }

    // Filtro instantáneo local para respuesta inmediata
    const qLower = q.toLowerCase();
    const localFiltered = POPULAR_AIRPORTS.filter(a =>
      a.code.toLowerCase().includes(qLower) ||
      a.name.toLowerCase().includes(qLower) ||
      (a.city && a.city.toLowerCase().includes(qLower)) ||
      (a.country && a.country.toLowerCase().includes(qLower))
    );
    if (localFiltered.length > 0) {
      setter(localFiltered);
    }

    // Consulta en vivo al backend (Duffel Places + Global Hubs) con debounce de 150ms
    airportSearchTimerRef.current = setTimeout(async () => {
      try {
        setIsLoadingAirports(true);
        const res = await fetch(`/api/airports/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.airports && Array.isArray(data.airports) && data.airports.length > 0) {
            setter(data.airports);
          }
        }
      } catch (err) {
        console.warn('Aviso: Búsqueda de aeropuertos', err);
      } finally {
        setIsLoadingAirports(false);
      }
    }, 150);
  };

  // Manejo de navegación segura hacia atrás sin salir de la página ni perder la búsqueda
  const closeBookingModal = () => {
    if (window.history.state?.modal === 'flight-booking') {
      window.history.back();
    } else {
      setSelectedFlightForBooking(null);
      setFlightBookingSuccess(null);
      setFlightBookingError(null);
      setVerifiedPriceData(null);
    }
  };

  // Escuchar popstate (botón atrás físico o gesto del navegador) para solo cerrar el modal y quedarse en los vuelos
  useEffect(() => {
    const handlePopState = () => {
      setSelectedFlightForBooking(null);
      setFlightBookingSuccess(null);
      setFlightBookingError(null);
      setVerifiedPriceData(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openFlightBookingModal = async (flight: any) => {
    // Empujar estado en historial para que el botón 'atrás' del navegador cierre el modal limpiamente
    window.history.pushState({ modal: 'flight-booking' }, '');

    setSelectedFlightForBooking(flight);
    setFlightBookingSuccess(null);
    setFlightBookingError(null);
    setVerifiedPriceData(null);

    // Formulario de pasajero y tarjeta completamente limpios para el nuevo cliente
    setBookingPassenger({
      title: 'Mr',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'm',
      email: '',
      phone: '',
      documentId: ''
    });
    setPaymentCard({
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    });

    const newIdempKey = 'ftdr_idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    setIdempotencyKey(newIdempKey);
    setIsVerifyingPrice(true);

    try {
      const res = await fetch('/api/flights/verify-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: flight.offerId })
      });
      if (res.ok) {
        const vData = await res.json();
        setVerifiedPriceData(vData);
      }
    } catch (vErr) {
      console.warn('Aviso: Verificación de tarifa offline o diferida', vErr);
    } finally {
      setIsVerifyingPrice(false);
    }
  };

  const handleConfirmFlightBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlightForBooking) return;
    setIsSubmittingFlightBooking(true);
    setFlightBookingError(null);

    try {
      const effectivePrice = verifiedPriceData?.finalTotal || selectedFlightForBooking.price;
      const res = await fetch('/api/flights/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          idempotencyKey,
          offerId: selectedFlightForBooking.offerId,
          passengerIds: selectedFlightForBooking.passengerIds,
          passengers: [
            {
              title: bookingPassenger.title,
              firstName: bookingPassenger.firstName,
              lastName: bookingPassenger.lastName,
              birthDate: bookingPassenger.birthDate,
              gender: bookingPassenger.gender,
              email: bookingPassenger.email,
              phone: bookingPassenger.phone,
              documentId: bookingPassenger.documentId
            }
          ],
          flight: {
            airline: selectedFlightForBooking.airline,
            logo: selectedFlightForBooking.logo,
            flightNumber: selectedFlightForBooking.flightNumber,
            origin: selectedFlightForBooking.origin,
            destination: selectedFlightForBooking.destination,
            departureTime: selectedFlightForBooking.departureTime,
            arrivalTime: selectedFlightForBooking.arrivalTime,
            departureDate: selectedFlightForBooking.departureDate,
            duration: selectedFlightForBooking.duration,
            stops: selectedFlightForBooking.stops,
            price: effectivePrice,
            cabin: flightCabin,
            legs: selectedFlightForBooking.legs
          },
          contact: {
            email: bookingPassenger.email,
            phone: bookingPassenger.phone
          },
          payment: {
            method: 'Tarjeta de Crédito / Débito (Stripe 256-bit SSL)',
            cardLast4: paymentCard.number ? paymentCard.number.replace(/\s+/g, '').slice(-4) : '••••',
            cardholderName: paymentCard.name || `${bookingPassenger.firstName} ${bookingPassenger.lastName}`
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo completar la reserva del vuelo.');
      }

      setFlightBookingSuccess(data.booking);
    } catch (err: any) {
      setFlightBookingError(err.message || 'Error al conectar con la pasarela de reservas.');
    } finally {
      setIsSubmittingFlightBooking(false);
    }
  };

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

  // Helper para consultar el motor de vuelos de forma limpia y directa
  const queryFlightSearch = async (searchQuery: string) => {
    const res = await fetch(`/api/flights/search?${searchQuery}`);
    return await res.json();
  };

  // ==========================================
  // DISPARADORES DE CONSULTA BACKEND
  // ==========================================
  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowComingSoonModal(true);
    return;
    
    setIsSearchingFlights(true);
    setHasSearchedFlights(true);
    setSearchError(null);
    setFlightResults([]);
    setIsLoadingFrame(true);
    setIframeUrl('loading_only');
    
    setProgressWidth(0);
    setLoadingMessage("Consultando disponibilidad y mejores tarifas aéreas en tiempo real...");
    
    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    try {
      const cabinParam = flightCabin === 'Business' || flightCabin === 'First' ? 'Business' : 'Economy';
      let queryString = '';

      if (tripType === 'multicity') {
        const slicesPayload = multiCityLegs.map(l => ({
          origin: l.origin.toUpperCase().trim(),
          destination: l.destination.toUpperCase().trim(),
          departure_date: l.date
        }));
        queryString = `slices=${encodeURIComponent(JSON.stringify(slicesPayload))}&adults=${flightAdults}&cabin=${cabinParam}`;
      } else {
        const returnDateParam = tripType === 'round' && returnDate ? `&returnDate=${returnDate}` : '';
        queryString = `origin=${origin}&destination=${destination}&departDate=${departDate}${returnDateParam}&adults=${flightAdults}&cabin=${cabinParam}`;
      }
      
      const data = await queryFlightSearch(queryString);
      
      clearInterval(progressInterval);
      setProgressWidth(100);
      
      setTimeout(() => {
        if (data && data.success) {
          setFlightResults(data.flights);
        } else {
          setSearchError(data?.error || 'No se encontraron vuelos disponibles en esta ruta.');
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
        setSearchError('Error de conexión con el motor de vuelos. Por favor reintenta tu búsqueda.');
        setIsLoadingFrame(false);
        setIframeUrl(null);
        setIsSearchingFlights(false);
      }, 500);
    }
  };

  // Helper para consultar el motor de Hoteles
  const queryHotelSearch = async (searchQuery: string) => {
    const res = await fetch(`/api/hotels/search?${searchQuery}`);
    return await res.json();
  };

  // Helper para consultar el motor de Rent a Car
  const queryCarSearch = async (searchQuery: string) => {
    const res = await fetch(`/api/cars/search?${searchQuery}`);
    return await res.json();
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
      const queryString = `destination=${encodeURIComponent(hotelDestination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${hotelGuests}`;
      const data = await queryHotelSearch(queryString);

      clearInterval(progressInterval);
      setProgressWidth(100);

      setTimeout(() => {
        if (data && data.success) {
          setHotelResults(data.hotels);
        } else {
          setHotelSearchError(data?.error || 'No se encontraron hoteles disponibles.');
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
        setHotelSearchError('Error de red al consultar el motor de hoteles.');
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
      const queryString = `pickup=${encodeURIComponent(carPickupLocation)}&dropoff=${encodeURIComponent(dropoffParam)}&pickupDate=${carPickupDate}&dropoffDate=${carDropoffDate}&age=${carAge}`;
      const data = await queryCarSearch(queryString);

      clearInterval(progressInterval);
      setProgressWidth(100);

      setTimeout(() => {
        if (data && data.success) {
          setCarResults(data.cars);
        } else {
          setCarSearchError(data?.error || 'No se encontraron coches disponibles.');
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
        setCarSearchError('Error de red al consultar el motor de renta car.');
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
    setShowComingSoonModal(true);
    return;
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
      const queryString = `origin=${originCode}&destination=PUJ&departDate=${departDate}&returnDate=${returnDate}&adults=1&cabin=Economy`;
      const data = await queryFlightSearch(queryString);
      
      clearInterval(progressInterval);
      setProgressWidth(100);
      
      setTimeout(() => {
        if (data && data.success) {
          setFlightResults(data.flights);
        } else {
          setSearchError(data?.error || 'No se encontraron vuelos.');
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
    const baseSearchUrl = `search?location=${encodeURIComponent(resortName)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=2&locale=es`;
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
            <div className="text-center max-w-4xl mx-auto mb-10 mt-8">
              <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-secondary/20 inline-flex items-center gap-2 mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <Clock className="w-4 h-4 text-secondary animate-pulse" /> Vuelos & Hoteles · Próximamente
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                Vuelos y Hoteles <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">Coming Soon</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto tracking-wide">
                Estamos finalizando la acreditación directa con las aerolíneas internacionales (Duffel API) y cadenas hoteleras. Mientras tanto, todas nuestras excursiones y traslados en Punta Cana están 100% activos con confirmación inmediata y pago seguro con Stripe.
              </p>
            </div>

            {/* Banner Oficial Coming Soon con CTA a Excursiones 100% Activas */}
            <div className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-secondary/15 via-black/50 to-cyan/15 border border-secondary/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary flex-shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-sm uppercase tracking-wider font-display">Vuelos, Hoteles y Rent-a-Car</span>
                    <span className="text-[9px] bg-secondary/20 text-secondary border border-secondary/40 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Soon</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Emisión de pasajes aéreos en acreditación técnica. <strong className="text-emerald-400">Excursiones VIP y Traslados PUJ 100% Operativos</strong> con emisión digital instantánea y pagos con Stripe.
                  </p>
                </div>
              </div>
              <a
                href="/"
                className="whitespace-nowrap bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black uppercase text-xs tracking-wider py-3.5 px-6 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-orange-900/30 flex-shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4" /> Ver Excursiones 100% Activas
              </a>
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
                  {(showOriginSuggest || showDestSuggest || showPassengerPopover || multiOriginSuggestIdx !== null || multiDestSuggestIdx !== null) && (
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => {
                        setShowOriginSuggest(false);
                        setShowDestSuggest(false);
                        setShowPassengerPopover(false);
                        setMultiOriginSuggestIdx(null);
                        setMultiDestSuggestIdx(null);
                      }} 
                    />
                  )}

                  {/* Trip Type Selector (Ida y vuelta / Solo ida / Multiciudad) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setTripType('round')}
                        className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition ${
                          tripType === 'round'
                            ? 'bg-secondary/15 text-secondary border-secondary/35 shadow-sm'
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
                            ? 'bg-secondary/15 text-secondary border-secondary/35 shadow-sm'
                            : 'text-gray-400 border-outline/50 hover:text-white hover:border-white'
                        }`}
                      >
                        Solo Ida
                      </button>
                      <button
                        type="button"
                        onClick={() => setTripType('multicity')}
                        className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
                          tripType === 'multicity'
                            ? 'bg-cyan/15 text-cyan border-cyan/35 shadow-sm'
                            : 'text-gray-400 border-outline/50 hover:text-white hover:border-white'
                        }`}
                      >
                        <Compass className="w-3 h-3" /> Multiciudades
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Tarifas Oficiales en Tiempo Real
                    </div>
                  </div>

                  {/* VISTA MULTICIUDAD: TRAMOS MÚLTIPLES */}
                  {tripType === 'multicity' ? (
                    <div className="flex flex-col gap-4">
                      {multiCityLegs.map((leg, index) => (
                        <div 
                          key={leg.id}
                          className="bg-bgDark/40 border border-outline/50 rounded-2xl p-4 flex flex-col gap-3 relative transition hover:border-secondary/40"
                        >
                          <div className="flex items-center justify-between border-b border-outline/25 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[10px]">
                                {index + 1}
                              </span>
                              Vuelo / Tramo {index + 1}
                            </span>
                            {multiCityLegs.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLeg(index)}
                                className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3 h-3" /> Eliminar tramo
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Origen del tramo */}
                            <div className="flex flex-col gap-1.5 relative">
                              <label className="text-[9px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-secondary" /> Origen
                              </label>
                              <input
                                type="text"
                                required
                                value={leg.origin}
                                onFocus={() => {
                                  setMultiOriginSuggestIdx(index);
                                  setMultiDestSuggestIdx(null);
                                  setShowPassengerPopover(false);
                                  searchAirportsApi(leg.origin, (list) => setMultiLegAirports(prev => ({ ...prev, [`origin_${index}`]: list })));
                                }}
                                onChange={(e) => {
                                  const v = e.target.value.toUpperCase();
                                  handleUpdateLeg(index, 'origin', v);
                                  searchAirportsApi(v, (list) => setMultiLegAirports(prev => ({ ...prev, [`origin_${index}`]: list })));
                                }}
                                placeholder="Ej: MIA, Madrid, París"
                                className="bg-bgDark border border-outline rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-secondary font-bold"
                              />
                              {multiOriginSuggestIdx === index && (
                                <div className="absolute top-[68px] left-0 right-0 bg-bgDark border border-outline rounded-xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 max-h-56 overflow-y-auto">
                                  <div className="flex items-center justify-between border-b border-outline/35 pb-1 mb-1">
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Aeropuertos y Ciudades</p>
                                    {isLoadingAirports && <RefreshCw className="w-3 h-3 text-secondary animate-spin" />}
                                  </div>
                                  {(multiLegAirports[`origin_${index}`] || POPULAR_AIRPORTS).map((airport) => (
                                    <button
                                      key={airport.code + '-' + (airport.city || airport.name)}
                                      type="button"
                                      onClick={() => {
                                        handleUpdateLeg(index, 'origin', airport.code);
                                        setMultiOriginSuggestIdx(null);
                                      }}
                                      className="flex items-center justify-between text-left p-1.5 rounded-lg hover:bg-surface/50 text-xs font-bold text-gray-300 hover:text-white"
                                    >
                                      <div>
                                        <p className="leading-tight text-white">{airport.name}</p>
                                        <p className="text-[8px] text-gray-400 font-normal">{airport.city ? `${airport.city}, ` : ''}{airport.country}</p>
                                      </div>
                                      <span className="text-secondary font-black ml-2 bg-secondary/10 px-1.5 py-0.5 rounded text-[11px] border border-secondary/20">{airport.code}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Destino del tramo */}
                            <div className="flex flex-col gap-1.5 relative">
                              <label className="text-[9px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan" /> Destino
                              </label>
                              <input
                                type="text"
                                required
                                value={leg.destination}
                                onFocus={() => {
                                  setMultiDestSuggestIdx(index);
                                  setMultiOriginSuggestIdx(null);
                                  setShowPassengerPopover(false);
                                  searchAirportsApi(leg.destination, (list) => setMultiLegAirports(prev => ({ ...prev, [`dest_${index}`]: list })));
                                }}
                                onChange={(e) => {
                                  const v = e.target.value.toUpperCase();
                                  handleUpdateLeg(index, 'destination', v);
                                  searchAirportsApi(v, (list) => setMultiLegAirports(prev => ({ ...prev, [`dest_${index}`]: list })));
                                }}
                                placeholder="Ej: PUJ, Cancún, SDQ"
                                className="bg-bgDark border border-outline rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-cyan font-bold"
                              />
                              {multiDestSuggestIdx === index && (
                                <div className="absolute top-[68px] left-0 right-0 bg-bgDark border border-outline rounded-xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 max-h-56 overflow-y-auto">
                                  <div className="flex items-center justify-between border-b border-outline/35 pb-1 mb-1">
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Destinos y Conexiones</p>
                                    {isLoadingAirports && <RefreshCw className="w-3 h-3 text-cyan animate-spin" />}
                                  </div>
                                  {(multiLegAirports[`dest_${index}`] || POPULAR_AIRPORTS).map((airport) => (
                                    <button
                                      key={airport.code + '-' + (airport.city || airport.name)}
                                      type="button"
                                      onClick={() => {
                                        handleUpdateLeg(index, 'destination', airport.code);
                                        setMultiDestSuggestIdx(null);
                                      }}
                                      className="flex items-center justify-between text-left p-1.5 rounded-lg hover:bg-surface/50 text-xs font-bold text-gray-300 hover:text-white"
                                    >
                                      <div>
                                        <p className="leading-tight text-white">{airport.name}</p>
                                        <p className="text-[8px] text-gray-400 font-normal">{airport.city ? `${airport.city}, ` : ''}{airport.country}</p>
                                      </div>
                                      <span className="text-cyan font-black ml-2 bg-cyan/10 px-1.5 py-0.5 rounded text-[11px] border border-cyan/20">{airport.code}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Fecha del tramo con ModernDatePicker */}
                            <div>
                              <ModernDatePicker
                                label="Fecha del Vuelo"
                                value={leg.date}
                                onChange={(newDate) => handleUpdateLeg(index, 'date', newDate)}
                                minDate={index === 0 ? new Date().toISOString().split('T')[0] : multiCityLegs[index - 1].date}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Botón Añadir otro tramo */}
                      {multiCityLegs.length < 5 && (
                        <button
                          type="button"
                          onClick={handleAddLeg}
                          className="self-start text-xs font-bold text-cyan hover:text-white border border-cyan/30 hover:border-cyan/70 px-4 py-2 rounded-xl transition flex items-center gap-1.5 bg-cyan/5 hover:bg-cyan/15 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" /> + Añadir otro tramo de vuelo
                        </button>
                      )}
                    </div>
                  ) : (
                    /* VISTA CLÁSICA: IDA Y VUELTA / SOLO IDA */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-30">
                      
                      {/* Origen Input con Autocomplete Popover Dinámico */}
                      <div className="flex flex-col gap-2 relative z-30">
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
                            searchAirportsApi(origin, setOriginAirportsList);
                          }}
                          onChange={(e) => {
                            const v = e.target.value.toUpperCase();
                            setOrigin(v);
                            searchAirportsApi(v, setOriginAirportsList);
                          }}
                          placeholder="Ej: MIA, Madrid, París, BOG..."
                          className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary font-bold"
                        />
                        
                        {showOriginSuggest && (
                          <div className="absolute top-[72px] left-0 right-0 bg-[#0d131f] border border-white/20 rounded-xl p-3 shadow-2xl z-[100] flex flex-col gap-1.5 animate-fadeIn max-h-72 overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-outline/35 pb-1 mb-1">
                              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                {originAirportsList.length > 0 ? 'Aeropuertos y Ciudades' : 'Buscando Aeropuertos...'}
                              </p>
                              {isLoadingAirports && (
                                <RefreshCw className="w-3 h-3 text-secondary animate-spin" />
                              )}
                            </div>
                            {originAirportsList.map((airport) => (
                              <button
                                key={airport.code + '-' + (airport.city || airport.name)}
                                type="button"
                                onClick={() => {
                                  setOrigin(airport.code);
                                  setShowOriginSuggest(false);
                                }}
                                className="flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface/50 transition text-xs font-bold text-gray-200 hover:text-white"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-secondary/15 text-secondary px-1.5 py-0.5 rounded font-black">✈️</span>
                                  <div>
                                    <p className="leading-tight text-white">{airport.name}</p>
                                    <p className="text-[9px] text-gray-400 font-normal">{airport.city ? `${airport.city}, ` : ''}{airport.country}</p>
                                  </div>
                                </div>
                                <span className="text-secondary font-black text-xs bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 ml-2">{airport.code}</span>
                              </button>
                            ))}
                            {originAirportsList.length === 0 && !isLoadingAirports && (
                              <p className="text-xs text-gray-400 text-center py-2">No se encontraron aeropuertos con "{origin}".</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Destino Input con Autocomplete Popover Dinámico */}
                      <div className="flex flex-col gap-2 relative z-30">
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
                            searchAirportsApi(destination, setDestAirportsList);
                          }}
                          onChange={(e) => {
                            const v = e.target.value.toUpperCase();
                            setDestination(v);
                            searchAirportsApi(v, setDestAirportsList);
                          }}
                          placeholder="Ej: PUJ, SDQ, Cancún..."
                          className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan font-bold"
                        />

                        {showDestSuggest && (
                          <div className="absolute top-[72px] left-0 right-0 bg-[#0d131f] border border-white/20 rounded-xl p-3 shadow-2xl z-[100] flex flex-col gap-1.5 animate-fadeIn max-h-72 overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-outline/35 pb-1 mb-1">
                              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                {destAirportsList.length > 0 ? 'Destinos y Conexiones' : 'Buscando Destinos...'}
                              </p>
                              {isLoadingAirports && (
                                <RefreshCw className="w-3 h-3 text-cyan animate-spin" />
                              )}
                            </div>
                            {destAirportsList.map((airport) => (
                              <button
                                key={airport.code + '-' + (airport.city || airport.name)}
                                type="button"
                                onClick={() => {
                                  setDestination(airport.code);
                                  setShowDestSuggest(false);
                                }}
                                className="flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface/50 transition text-xs font-bold text-gray-200 hover:text-white"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-cyan/15 text-cyan px-1.5 py-0.5 rounded font-black">✈️</span>
                                  <div>
                                    <p className="leading-tight text-white">{airport.name}</p>
                                    <p className="text-[9px] text-gray-400 font-normal">{airport.city ? `${airport.city}, ` : ''}{airport.country}</p>
                                  </div>
                                </div>
                                <span className="text-cyan font-black text-xs bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20 ml-2">{airport.code}</span>
                              </button>
                            ))}
                            {destAirportsList.length === 0 && !isLoadingAirports && (
                              <p className="text-xs text-gray-400 text-center py-2">No se encontraron aeropuertos con "{destination}".</p>
                            )}
                          </div>
                        )}
                        
                        {destination === 'PUJ' && (
                          <span className="absolute right-3.5 bottom-3.5 bg-cyan/10 text-cyan text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-cyan/20 pointer-events-none">
                            Punta Cana
                          </span>
                        )}
                      </div>

                      {/* Fecha Salida con ModernDatePicker */}
                      <ModernDatePicker
                        label="Salida"
                        value={departDate}
                        onChange={setDepartDate}
                        minDate={new Date().toISOString().split('T')[0]}
                        colorTheme="secondary"
                        required
                      />

                      {/* Fecha Regreso con ModernDatePicker */}
                      <ModernDatePicker
                        label="Vuelta"
                        value={tripType === 'oneway' ? '' : returnDate}
                        onChange={setReturnDate}
                        minDate={departDate}
                        disabled={tripType === 'oneway'}
                        colorTheme="cyan"
                        required={tripType === 'round'}
                      />

                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline/30 pt-4 relative z-10">
                    
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
                        className="bg-bgDark border border-outline rounded-xl py-3 px-4 text-left text-sm text-white focus:outline-none focus:border-secondary font-bold flex items-center justify-between"
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

                    {/* Botón Buscar Vuelo -> Vuelos Disponibles Coming Soon */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setShowComingSoonModal(true)}
                        className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-95"
                      >
                        <Clock className="w-4 h-4 text-white animate-pulse" /> Vuelos Disponibles — Coming Soon
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
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Tarifas en Tiempo Real · Disponibilidad Oficial Verificada
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                        ✈️ Vuelos Encontrados: {tripType === 'multicity' ? `${multiCityLegs.map(l => l.origin).join(' ➔ ')} ➔ ${multiCityLegs[multiCityLegs.length - 1].destination}` : `${origin} ➔ ${destination}`}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                        {tripType === 'multicity' 
                          ? `${multiCityLegs.length} Tramos Seleccionados | ${flightAdults + flightChildren} ${flightAdults + flightChildren === 1 ? 'Pasajero' : 'Pasajeros'} | Clase: ${flightCabin}`
                          : `Ida: ${departDate} ${tripType === 'round' && returnDate ? `| Vuelta: ${returnDate}` : ''} | ${flightAdults + flightChildren} ${flightAdults + flightChildren === 1 ? 'Pasajero' : 'Pasajeros'} | Clase: ${flightCabin}`
                        }
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
                        {processedFlights.map((flight) => {
                          const isExpanded = expandedFlightId === flight.id;
                          const outboundSlice = flight.slices?.[0];

                          return (
                            <div 
                              key={flight.id} 
                              className={`border transition-all duration-300 rounded-3xl overflow-hidden ${
                                isExpanded 
                                  ? 'border-secondary/60 bg-gradient-to-b from-[#101726] to-[#0a0f1d] shadow-2xl shadow-secondary/10' 
                                  : 'border-outline/40 hover:border-secondary/40 bg-bgDark/30 hover:bg-bgDark/50 shadow-lg'
                              }`}
                            >
                              {/* CABECERA PRINCIPAL DE LA TARJETA */}
                              <div className="p-5 md:p-6 flex flex-col gap-4">
                                
                                {/* Fila Superior: Aerolínea + Badges de Duffel y Equipaje */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={flight.logo} 
                                      alt={flight.airline} 
                                      className="w-9 h-9 rounded-xl object-contain bg-white/10 border border-white/10 p-1"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/AA.png';
                                      }}
                                    />
                                    <div>
                                      <p className="text-white text-sm font-black uppercase tracking-wide leading-tight">{flight.airline}</p>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                        {flight.flightNumber} {flight.slices?.[0]?.segments?.[0]?.aircraft ? `• ${flight.slices[0].segments[0].aircraft}` : ''}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[9px] bg-secondary/15 text-secondary border border-secondary/25 px-2.5 py-1 rounded-full font-black uppercase flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" /> Tarifa Oficial Duffel
                                    </span>
                                    <span className="text-[9px] bg-cyan/10 text-cyan border border-cyan/20 px-2.5 py-1 rounded-full font-black uppercase flex items-center gap-1">
                                      <Luggage className="w-3 h-3" /> {flight.checkedBagsCount > 0 ? `${flight.checkedBagsCount} Maleta en bodega` : 'Equipaje de mano incl.'}
                                    </span>
                                  </div>
                                </div>

                                {/* Fila Itinerario: Tramo de Ida */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                                  
                                  <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8 w-full md:w-3/5">
                                    {/* Salida */}
                                    <div className="text-left md:text-right min-w-[90px]">
                                      <p className="text-xl md:text-2xl font-black text-white tracking-tight">{flight.departureTime}</p>
                                      <p className="text-xs font-bold text-gray-300">{flight.origin}</p>
                                      {flight.originName && <p className="text-[9px] text-gray-500 truncate max-w-[120px]">{flight.originName}</p>}
                                    </div>

                                    {/* Trayecto y Escalas */}
                                    <div className="flex-1 flex flex-col items-center max-w-[200px] text-center">
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-secondary" /> {flight.duration}
                                      </span>
                                      <div className="w-full h-1 bg-outline/60 rounded-full relative flex items-center justify-center">
                                        <div className={`w-2.5 h-2.5 rounded-full ${flight.stopsCount === 0 ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-amber-400 ring-2 ring-amber-400/20'}`} />
                                      </div>
                                      <span className={`text-[9px] font-black uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                                        flight.stopsCount === 0 
                                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                                      }`}>
                                        {flight.stops}
                                      </span>
                                      {flight.layoversSummary && flight.layoversSummary.length > 0 && (
                                        <span className="text-[8px] text-amber-300 font-bold mt-1 bg-black/40 px-2 py-0.5 rounded border border-amber-500/20">
                                          {flight.layoversSummary.join(', ')}
                                        </span>
                                      )}
                                    </div>

                                    {/* Llegada */}
                                    <div className="text-right md:text-left min-w-[90px]">
                                      <p className="text-xl md:text-2xl font-black text-white tracking-tight">{flight.arrivalTime}</p>
                                      <p className="text-xs font-bold text-gray-300">{flight.destination}</p>
                                      {flight.destinationName && <p className="text-[9px] text-gray-500 truncate max-w-[120px]">{flight.destinationName}</p>}
                                    </div>
                                  </div>

                                  {/* Precio y Botones de Acción */}
                                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-2/5 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                    <div className="text-left md:text-right">
                                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Tarifa Final</span>
                                      <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
                                        ${flight.price} <span className="text-xs font-bold text-gray-400">USD</span>
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button 
                                        type="button"
                                        onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                                        className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 active:scale-95"
                                        title="Ver escalas e información detallada del vuelo"
                                      >
                                        <Info className="w-3.5 h-3.5 text-secondary" />
                                        <span className="hidden sm:inline">{isExpanded ? 'Ocultar' : 'Detalles'}</span>
                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>

                                      <button 
                                        type="button"
                                        onClick={() => openFlightBookingModal(flight)}
                                        className="bg-secondary hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition duration-300 flex items-center gap-1.5 active:scale-95 shadow-lg shadow-secondary/25 hover:scale-[1.02]"
                                      >
                                        Seleccionar ➔
                                      </button>
                                    </div>
                                  </div>

                                </div>

                                {/* Si es ida y vuelta y tiene vuelo de regreso, mostramos la fila de regreso resumida */}
                                {flight.returnSlice && (
                                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] bg-cyan/15 text-cyan border border-cyan/25 px-2 py-0.5 rounded font-black uppercase">Vuelta</span>
                                      <span className="text-white font-bold">{flight.returnSlice.origin.iata} ➔ {flight.returnSlice.destination.iata}</span>
                                      <span className="text-gray-400 text-[10px]">({flight.returnSlice.departureDate})</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                      <span>{flight.returnSlice.departureTime} - {flight.returnSlice.arrivalTime}</span>
                                      <span className="text-[10px] text-gray-400">({flight.returnSlice.duration})</span>
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${flight.returnSlice.stopsCount === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        {flight.returnSlice.stopsLabel}
                                      </span>
                                    </div>
                                  </div>
                                )}

                              </div>

                              {/* PANEL EXPANDIBLE: ITINERARIO COMPLETO TRAMO A TRAMO (DUFFEL FULL FLOW) */}
                              {isExpanded && (
                                <div className="border-t border-secondary/20 bg-black/40 p-5 md:p-7 flex flex-col gap-6 animate-fadeIn">
                                  
                                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                                        <Plane className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-black uppercase text-white tracking-wide">Itinerario Oficial y Escalas de Vuelo</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Conexiones directas verificadas con Duffel Global GDS</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-mono text-cyan bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-lg">
                                      {flight.offerId}
                                    </span>
                                  </div>

                                  {/* Slices / Tramos completos */}
                                  <div className="flex flex-col gap-6">
                                    {(flight.slices || [outboundSlice]).filter(Boolean).map((slice: any, sIdx: number) => (
                                      <div key={slice.sliceId || sIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                                          <span className="text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-bold">
                                              {sIdx + 1}
                                            </span>
                                            {slice.type || (sIdx === 0 ? 'Vuelo de Ida' : 'Vuelo de Vuelta')}: {slice.origin?.cityName || slice.origin?.name || slice.origin?.iata} ({slice.origin?.iata}) ➔ {slice.destination?.cityName || slice.destination?.name || slice.destination?.iata} ({slice.destination?.iata})
                                          </span>
                                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <span>Fecha: <strong className="text-white">{slice.departureDate}</strong></span>
                                            <span>•</span>
                                            <span>Duración total: <strong className="text-cyan">{slice.duration}</strong></span>
                                            <span>•</span>
                                            <span className={`font-bold ${slice.stopsCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>{slice.stopsLabel}</span>
                                          </div>
                                        </div>

                                        {/* Segmentos del Slice */}
                                        <div className="flex flex-col gap-4 pl-2 md:pl-4">
                                          {(slice.segments || []).map((seg: any, segIdx: number) => (
                                            <div key={seg.id || segIdx} className="flex flex-col gap-3">
                                              
                                              {/* Cabecera del Segmento */}
                                              <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 font-bold text-white">
                                                  <img 
                                                    src={seg.airlineLogo || flight.logo} 
                                                    alt={seg.airlineName} 
                                                    className="w-5 h-5 rounded object-contain bg-white/10 p-0.5" 
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/AA.png'; }}
                                                  />
                                                  <span>{seg.airlineName}</span>
                                                  <span className="text-secondary font-mono text-[10px]">Vuelo {seg.flightNumber}</span>
                                                  {seg.operatingCarrierName && (
                                                    <span className="text-[9px] text-gray-400 font-normal">({seg.operatingCarrierName})</span>
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                                  <span>Aeronave: <strong className="text-gray-200">{seg.aircraft}</strong></span>
                                                  <span>•</span>
                                                  <span>Cabina: <strong className="text-cyan">{seg.cabinName}</strong></span>
                                                </div>
                                              </div>

                                              {/* Timeline Origen -> Destino */}
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3 border-l-2 border-secondary/40 my-1">
                                                {/* Salida */}
                                                <div className="flex flex-col gap-0.5">
                                                  <span className="text-[10px] text-secondary font-black uppercase tracking-wider">Salida</span>
                                                  <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-black text-white">{seg.departingTime}</span>
                                                    <span className="text-xs font-bold text-cyan">{seg.origin?.iata}</span>
                                                  </div>
                                                  <p className="text-xs font-bold text-gray-200">{seg.origin?.name}</p>
                                                  {seg.origin?.cityName && <p className="text-[10px] text-gray-400">{seg.origin.cityName}</p>}
                                                  {seg.origin?.terminal && (
                                                    <span className="text-[9px] text-gray-400 font-mono mt-0.5">Terminal {seg.origin.terminal}</span>
                                                  )}
                                                </div>

                                                {/* Llegada */}
                                                <div className="flex flex-col gap-0.5">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Llegada</span>
                                                    <span className="text-[9px] text-gray-400 font-mono flex items-center gap-1">
                                                      <Clock className="w-3 h-3 text-gray-400" /> {seg.duration} en vuelo
                                                    </span>
                                                  </div>
                                                  <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-black text-white">{seg.arrivingTime}</span>
                                                    <span className="text-xs font-bold text-cyan">{seg.destination?.iata}</span>
                                                  </div>
                                                  <p className="text-xs font-bold text-gray-200">{seg.destination?.name}</p>
                                                  {seg.destination?.cityName && <p className="text-[10px] text-gray-400">{seg.destination.cityName}</p>}
                                                  {seg.destination?.terminal && (
                                                    <span className="text-[9px] text-gray-400 font-mono mt-0.5">Terminal {seg.destination.terminal}</span>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Escala / Conexión (Layover Alert) */}
                                              {seg.layoverAfter && (
                                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 my-1">
                                                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                  </div>
                                                  <div className="flex-1">
                                                    <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                                                      Conexión / Escala en {seg.layoverAfter.airportName || seg.layoverAfter.cityName} ({seg.layoverAfter.airportIata})
                                                    </p>
                                                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                                                      Tiempo de espera en aeropuerto: <strong className="text-white">{seg.layoverAfter.duration}</strong>. {seg.layoverAfter.changePlanes ? 'Requiere cambio de aeronave.' : 'Mismo avión.'}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                            </div>
                                          ))}
                                        </div>

                                      </div>
                                    ))}
                                  </div>

                                  {/* Políticas de Equipaje y Reglas de la Tarifa */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs">
                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                                        <Luggage className="w-3.5 h-3.5 text-cyan" /> Equipaje y Franquicia
                                      </span>
                                      <p className="text-gray-200 font-bold">
                                        • 1 Artículo personal / Equipaje de mano incluido en cabina
                                      </p>
                                      <p className="text-gray-300">
                                        • Equipaje facturado en bodega: <strong className="text-white">{flight.checkedBagsCount > 0 ? `${flight.checkedBagsCount} maleta(s) incluida(s)` : '0 maletas (puedes añadir maletas en el check-in)'}</strong>
                                      </p>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Condiciones de Tarifa Duffel
                                      </span>
                                      <p className="text-gray-300">
                                        • Cambios: <strong className="text-white">{flight.conditions?.changeBeforeDeparture || 'Permitidos con cargo según política de la aerolínea'}</strong>
                                      </p>
                                      <p className="text-gray-300">
                                        • Reembolso: <strong className="text-white">{flight.conditions?.refundBeforeDeparture || 'No reembolsable tras emisión'}</strong>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Botones de Acción al Final del Detalle */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                                    <button 
                                      type="button"
                                      onClick={() => setExpandedFlightId(null)}
                                      className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition flex items-center gap-1.5"
                                    >
                                      <ChevronUp className="w-4 h-4" /> Ocultar Detalles del Vuelo
                                    </button>

                                    <button 
                                      type="button"
                                      onClick={() => openFlightBookingModal(flight)}
                                      className="w-full sm:w-auto bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition duration-300 shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                      Seleccionar este Vuelo (${flight.price} USD) y Reservar <ArrowRight className="w-4 h-4" />
                                    </button>
                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })}
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

        {/* ==========================================
            MODAL DE RESERVA DIRECTA DE VUELOS (DUFFEL ENGINE + STRIPE SECURE PAY)
            ========================================== */}
        {selectedFlightForBooking && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
            <div className="max-w-xl w-full bg-[#0d131f] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl relative my-6">
              
              {/* Barra superior de navegación / Regresar a los vuelos */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl transition border border-white/10 group active:scale-95"
                  title="Volver a los resultados de búsqueda de vuelos"
                >
                  <ArrowLeft className="w-4 h-4 text-secondary group-hover:-translate-x-1 transition" />
                  <span>Volver a los Vuelos</span>
                </button>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
                  title="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {flightBookingSuccess ? (
                /* Pantalla de Éxito / Itinerario Completo */
                <div className="text-center py-4 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                    ¡Reserva Oficial Confirmada!
                  </h3>
                  
                  {/* Tarjeta de Confirmación de Pago e Itinerario */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full text-left flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">Localizador PNR Oficial</span>
                        <span className="text-xl font-black text-cyan tracking-widest">{flightBookingSuccess.ticketCode}</span>
                      </div>
                      <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-500/30">
                        {flightBookingSuccess.status || 'Confirmado'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 flex flex-col gap-1.5">
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase text-[10px]">Ruta / Itinerario:</span>
                        <span className="text-white font-bold">{flightBookingSuccess.tourName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase text-[10px]">Titular:</span>
                        <span className="text-white font-bold">{flightBookingSuccess.customerName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase text-[10px]">Correo:</span>
                        <span className="text-white font-bold">{flightBookingSuccess.email}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase text-[10px]">Método de Pago:</span>
                        <span className="text-emerald-400 font-bold">{flightBookingSuccess.paymentMethod || 'Stripe SSL 256-bit'}</span>
                      </p>
                      <div className="border-t border-white/10 pt-2 mt-1 flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-[10px]">Total Facturado:</span>
                        <strong className="text-xl font-black text-secondary">${flightBookingSuccess.amountPaid} USD</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-start gap-3 text-left w-full shadow-inner">
                    <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white mb-0.5">Confirmación enviada por Correo y SMS</p>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        Hemos enviado el itinerario completo y tu boleto oficial en PDF adjunto a <strong>{flightBookingSuccess.email}</strong>.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                    Tu boleto digital oficial con código QR y sello de Fire Tour DR está listo para descargar y presentar en el aeropuerto.
                  </p>

                  <div className="flex flex-col gap-2.5 w-full mt-2">
                    <a
                      href={`/api/reservations/${encodeURIComponent(flightBookingSuccess.ticketCode || flightBookingSuccess.id)}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                      className="w-full text-white font-black uppercase tracking-wider text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-sky-900/40 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> Descargar Boleto Oficial en PDF
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        const pnr = flightBookingSuccess.ticketCode || flightBookingSuccess.id;
                        const phoneClean = (flightBookingSuccess.phone || bookingPassenger.phone || '').replace(/[^\d+]/g, '');
                        const origin = window.location.origin;
                        const pdfUrl = `${origin}/api/reservations/${encodeURIComponent(pnr)}/pdf`;
                        const text = encodeURIComponent(
                          `✈️ *Fire Tour DR - Confirmación de Reserva de Vuelo*\n\n` +
                          `¡Hola ${flightBookingSuccess.customerName}! Tu vuelo ha sido emitido con éxito.\n` +
                          `🎟️ *Localizador PNR:* ${pnr}\n` +
                          `📍 *Itinerario:* ${flightBookingSuccess.tourName}\n` +
                          `💵 *Total Pagado:* $${flightBookingSuccess.amountPaid} USD\n\n` +
                          `📄 *Descarga tu boleto oficial en PDF con QR y logo aquí:*\n${pdfUrl}\n\n` +
                          `Presenta este PDF o código QR directamente en el mostrador del aeropuerto.`
                        );
                        window.open(`https://api.whatsapp.com/send?phone=${phoneClean}&text=${text}`, '_blank');
                      }}
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      className="w-full text-white font-black uppercase tracking-wider text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-900/40 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" /> Enviar Boleto por WhatsApp / SMS
                    </button>

                    <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = `/ticket/${flightBookingSuccess.id}`;
                        }}
                        className="flex-1 bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-600 text-white font-black uppercase tracking-wider text-xs py-3 rounded-xl transition shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" /> Ver Boleto Digital con QR
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = '/cuenta';
                        }}
                        className="px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition"
                      >
                        Mi Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Formulario de Pasajero, Verificación de Tarifa y Pago Seguro */
                <form onSubmit={handleConfirmFlightBooking} className="flex flex-col gap-4">
                  <div>
                    <span className="bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-secondary/25 inline-flex items-center gap-1.5 mb-2">
                      <Ticket className="w-3.5 h-3.5" /> Reserva Oficial Fire Tour DR
                    </span>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                      Confirmar Reserva de Vuelo
                    </h3>
                  </div>

                  {/* Resumen del Vuelo y Verificación de Precio */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedFlightForBooking.logo} 
                          alt={selectedFlightForBooking.airline} 
                          className="w-10 h-10 rounded-xl bg-white/10 p-1 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/AA.png';
                          }}
                        />
                        <div>
                          <p className="text-xs font-black uppercase text-white">{selectedFlightForBooking.airline}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{selectedFlightForBooking.origin} ➔ {selectedFlightForBooking.destination} • {selectedFlightForBooking.departureTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Tarifa Final</span>
                        <span className="text-xl font-black text-secondary">
                          ${verifiedPriceData?.finalTotal || selectedFlightForBooking.price} USD
                        </span>
                      </div>
                    </div>

                    {/* Desglose de Precio Transparente */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-[10px] flex flex-col gap-1 text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tarifa Neta Aerolínea:</span>
                        <span className="font-bold text-white">${verifiedPriceData?.baseAmount || Math.round((selectedFlightForBooking.price - 25) * 0.75)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Impuestos y Tasas Gubernamentales:</span>
                        <span className="font-bold text-white">${verifiedPriceData?.taxAmount || Math.round((selectedFlightForBooking.price - 25) * 0.25)} USD</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span className="text-gray-400">Tarifa de Emisión Oficial Fire Tour DR:</span>
                        <span className="font-bold text-cyan">$25.00 USD</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <div className="flex items-center gap-1.5">
                          {isVerifyingPrice ? (
                            <span className="text-amber-400 flex items-center gap-1 font-bold">
                              <RefreshCw className="w-3 h-3 animate-spin" /> Verificando tarifa en vivo con la aerolínea...
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Tarifa garantizada en tiempo real
                            </span>
                          )}
                        </div>
                        <span className="font-black text-white text-xs">
                          Total: ${verifiedPriceData?.finalTotal || selectedFlightForBooking.price} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {flightBookingError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs font-bold text-center">
                      ⚠️ {flightBookingError}
                    </div>
                  )}

                  {/* Campos del Pasajero Principal */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10 pb-1">
                      1. Datos del Pasajero Principal
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Trato</label>
                        <select
                          value={bookingPassenger.title}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, title: e.target.value })}
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                        >
                          <option value="Mr">Sr.</option>
                          <option value="Mrs">Sra.</option>
                          <option value="Miss">Srta.</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Nombre *</label>
                        <input
                          type="text"
                          required
                          value={bookingPassenger.firstName}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, firstName: e.target.value })}
                          placeholder="Nombre"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Apellido *</label>
                        <input
                          type="text"
                          required
                          value={bookingPassenger.lastName}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, lastName: e.target.value })}
                          placeholder="Apellido"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Fecha de Nacimiento *</label>
                        <input
                          type="date"
                          required
                          value={bookingPassenger.birthDate}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, birthDate: e.target.value })}
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Género *</label>
                        <select
                          value={bookingPassenger.gender}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, gender: e.target.value })}
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                        >
                          <option value="m">Masculino</option>
                          <option value="f">Femenino</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={bookingPassenger.email}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, email: e.target.value })}
                          placeholder="ejemplo@correo.com"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Teléfono WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={bookingPassenger.phone}
                          onChange={(e) => setBookingPassenger({ ...bookingPassenger, phone: e.target.value })}
                          placeholder="+1 (809) 000-0000"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-gray-400">Documento / Pasaporte</label>
                      <input
                        type="text"
                        value={bookingPassenger.documentId}
                        onChange={(e) => setBookingPassenger({ ...bookingPassenger, documentId: e.target.value })}
                        placeholder="Número de Pasaporte o ID Oficial"
                        className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>

                  {/* Sección de Pago Seguro (Stripe / Encriptación SSL 256-bit) */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan" /> 2. Pago Seguro Encriptado (Stripe Gateway)
                      </p>
                      <span className="text-[8px] bg-cyan/10 text-cyan border border-cyan/20 px-2 py-0.5 rounded font-black uppercase">
                        SSL 256-Bit
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Número de Tarjeta *</label>
                        <input
                          type="text"
                          required
                          value={paymentCard.number}
                          onChange={(e) => setPaymentCard({ ...paymentCard, number: e.target.value })}
                          placeholder="•••• •••• •••• ••••"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Expiración (MM/AA) *</label>
                        <input
                          type="text"
                          required
                          value={paymentCard.expiry}
                          onChange={(e) => setPaymentCard({ ...paymentCard, expiry: e.target.value })}
                          placeholder="MM/AA"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">CVC / Código de Seguridad *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={paymentCard.cvc}
                          onChange={(e) => setPaymentCard({ ...paymentCard, cvc: e.target.value })}
                          placeholder="CVC"
                          className="bg-black/50 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" /> Protección anti-duplicados activa (Idempotencia en KV). Sin prefinanciamiento.
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      className="order-2 sm:order-1 sm:w-2/5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition border border-white/10 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-400" /> Cancelar y Volver
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFlightBooking}
                      className="order-1 sm:order-2 flex-1 bg-secondary hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition duration-300 shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmittingFlightBooking ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Procesando Pago y Emitiendo Boleto...
                        </>
                      ) : (
                        <>
                          Pagar y Emitir Reserva (${verifiedPriceData?.finalTotal || selectedFlightForBooking.price} USD) <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Modal Coming Soon Informativo Oficial */}
      <ComingSoonModal 
        isOpen={showComingSoonModal} 
        onClose={() => setShowComingSoonModal(false)} 
      />
    </div>
  );
}
