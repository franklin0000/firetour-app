import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck, Check, Sparkles, AlertCircle, ArrowRight, MessageCircle, Star, Users, Phone, ChevronRight } from 'lucide-react';
import { getResortBySlug, RESORTS_DATA } from '../data/resorts';
import { trackPageView } from '../utils/analytics';

export default function ResortLandingPage() {
  const { hotelSlug } = useParams<{ hotelSlug: string }>();
  const navigate = useNavigate();

  const resort = getResortBySlug(hotelSlug || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (resort) {
      document.title = `Excursiones y Tours desde ${resort.name} | Fire Tour DR`;
      trackPageView(`Resort Landing - ${resort.name}`);
    }
  }, [resort]);

  if (!resort) {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface border border-white/10 p-8 rounded-3xl shadow-premium">
          <AlertCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display text-white mb-2">Hotel no encontrado</h2>
          <p className="text-gray-400 text-sm mb-6">
            No encontramos la página de este resort, pero brindamos servicio de recogida en <b>todos los hoteles</b> de Punta Cana, Bávaro, Uvero Alto y Cap Cana.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-glow"
          >
            Ver Catálogo Completo de Tours
          </button>
        </div>
      </div>
    );
  }

  // Schema JSON-LD for Google Rich Snippets
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": `Excursiones desde ${resort.name}`,
    "description": `Reserva excursiones y actividades con recogida garantizada en el lobby de ${resort.name}, Punta Cana. Isla Saona VIP, Buggies Macao y Parasailing.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": resort.zone,
      "addressRegion": "La Altagracia",
      "addressCountry": "DO"
    },
    "touristType": ["Adventure", "Beach", "Family", "Couples"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Tours desde ${resort.name}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "TouristTrip",
            "name": "Isla Saona All Inclusive VIP"
          },
          "price": "79.00",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "TouristTrip",
            "name": "Buggies 4x4 Macao & Cueva Taína"
          },
          "price": "55.00",
          "priceCurrency": "USD"
        }
      ]
    }
  };

  const toursList = [
    {
      id: 1,
      name: "Isla Saona All Inclusive VIP",
      badge: "MÁS POPULAR",
      price: 79,
      hotelPrice: resort.hotelLobbyPriceSaona,
      pickup: resort.pickupTimeSaona,
      image: "https://www.firetourdr.com/tours/excursions/tour_1/001.jpg",
      desc: "Lancha rápida + Catamarán gigante con animación, barra libre, piscina natural con estrellas de mar y buffet frente al mar."
    },
    {
      id: 2,
      name: "Buggies 4x4 en Macao & Cueva Taína",
      badge: "MÁXIMA ADRENALINA",
      price: 55,
      hotelPrice: resort.hotelLobbyPriceBuggies,
      pickup: resort.pickupTimeBuggies,
      image: "https://www.firetourdr.com/tours/excursions/tour_2/001.jpg",
      desc: "Aventura todoterreno por senderos de fango, baño en cenote cueva subterránea, casa típica dominicana y Playa Macao."
    },
    {
      id: 3,
      name: "Parasailing en las Alturas de Punta Cana",
      badge: "VISTAS 360°",
      price: 75,
      hotelPrice: resort.hotelLobbyPriceParasail,
      pickup: resort.pickupTimeParasail,
      image: "https://www.firetourdr.com/tours/excursions/tour_3/001.jpg",
      desc: "Vuela a más de 100 metros de altura sobre las aguas turquesas del Caribe. Despegue y aterrizaje seguro desde la lancha."
    },
    {
      id: 4,
      name: "Traslado Privado Aeropuerto PUJ ↔ Hotel",
      badge: "CERO ESPERAS",
      price: 45,
      hotelPrice: 85,
      pickup: "Según tu vuelo",
      image: "https://www.firetourdr.com/tours/excursions/tour_4/001.jpg",
      desc: "Vehículo privado exclusivo con chofer en sala de llegadas con tu cartel de bienvenida. Climatizado y directo a tu lobby."
    }
  ];

  const handleBookTour = (tourId: number) => {
    navigate(`/excursion/${tourId}`);
  };

  return (
    <div className="bg-bgDark text-white min-h-screen font-sans -mt-24">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Cinematic Hero */}
      <div className="relative w-full min-h-[560px] pt-32 pb-20 px-4 md:px-8 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={resort.image}
            alt={resort.name}
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bgDark via-bgDark/80 to-bgDark/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-bgDark/60 to-bgDark" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Breadcrumb / Location Badge */}
          <div className="inline-flex items-center gap-2 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-gray-300 mb-6 shadow-glow">
            <MapPin className="w-3.5 h-3.5 text-secondary animate-pulse" />
            <span>Punta Cana</span>
            <span className="text-white/30">•</span>
            <span className="text-secondary">{resort.zone}</span>
            <span className="text-white/30">•</span>
            <span className="text-cyan font-mono">{resort.distanceToAirport} del PUJ</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display tracking-tight uppercase leading-tight mb-4 max-w-4xl text-white">
            Excursiones y Tours con Recogida en <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-amber-300">
              {resort.name}
            </span>
          </h1>

          <p className="text-sm md:text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
            Transporte directo puerta a puerta desde el lobby de tu hotel. Precios de operador local sin las comisiones abusivas del stand del resort.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
            <a
              href="#tours"
              className="w-full sm:w-auto bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black uppercase tracking-wider py-4 px-8 rounded-2xl text-xs md:text-sm font-display transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 flex items-center justify-center gap-2"
            >
              Ver Tours Disponibles <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/15872257342?text=${encodeURIComponent(`¡Hola Fire Tour DR! Estoy hospedado en ${resort.name} y me gustaría consultar disponibilidad para excursiones.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold uppercase tracking-wider py-4 px-6 rounded-2xl text-xs md:text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Directo
            </a>
          </div>

          {/* Meeting Point Guarantee Banner */}
          <div className="mt-8 bg-surface/80 border border-white/10 backdrop-blur-xl px-6 py-3.5 rounded-2xl flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Punto de Encuentro Oficial:
            </span>
            <span className="font-semibold text-white">{resort.meetingPoint}</span>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-16">

        {/* COMPARISON TABLE: The High-Converting Value Anchor */}
        <section className="bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-secondary text-[11px] font-black uppercase tracking-widest font-display bg-secondary/10 px-3.5 py-1.5 rounded-full border border-secondary/20">
              Ahorro Real Sin Intermediarios
            </span>
            <h2 className="text-2xl md:text-4xl font-black font-display uppercase tracking-tight text-white mt-3">
              ¿Por qué pagar hasta el doble en el mostrador del hotel?
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              Comparamos los precios habituales de venta en el lobby de <b>{resort.name}</b> frente a nuestra tarifa oficial directa de operador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Saona Card */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-white font-display">Isla Saona All Inclusive VIP</h3>
                <p className="text-xs text-gray-400 mt-1">Lancha + Catamarán + Almuerzo + Barra Libre</p>
                
                <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">En el lobby del hotel:</span>
                    <span className="text-red-400 line-through font-bold">${resort.hotelLobbyPriceSaona} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-sm">Con Fire Tour DR:</span>
                    <span className="text-secondary font-black text-2xl font-display">$79 USD</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Ahorras ${resort.hotelLobbyPriceSaona - 79} USD / pers.
                </span>
                <span className="text-gray-400">Recogida: {resort.pickupTimeSaona}</span>
              </div>
            </div>

            {/* Buggies Card */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-white font-display">Buggies 4x4 Macao & Cueva</h3>
                <p className="text-xs text-gray-400 mt-1">Todoterreno + Cenote + Playa Macao</p>
                
                <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">En el lobby del hotel:</span>
                    <span className="text-red-400 line-through font-bold">${resort.hotelLobbyPriceBuggies} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-sm">Con Fire Tour DR:</span>
                    <span className="text-secondary font-black text-2xl font-display">$55 USD</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Ahorras ${resort.hotelLobbyPriceBuggies - 55} USD / pers.
                </span>
                <span className="text-gray-400">Recogida: {resort.pickupTimeBuggies.split('/')[0]}</span>
              </div>
            </div>

            {/* Group Viral Banner */}
            <div className="bg-gradient-to-br from-secondary/20 via-orange-950/40 to-black border-2 border-secondary/50 rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              <div>
                <div className="flex items-center gap-2 text-secondary text-xs font-black uppercase tracking-widest font-display">
                  <Sparkles className="w-4 h-4 animate-spin" /> Promo Grupal Exclusiva
                </div>
                <h3 className="font-black text-xl text-white font-display mt-2">
                  ¡Reserva 5 personas y la 6ta va 100% GRATIS!
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  ¿Viajas con familia o amigos? Si tu grupo suma 6 o más personas en cualquier excursión, aplicamos el descuento completo de un pasajero en tu checkout.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-secondary/30 flex items-center justify-between">
                <span className="text-xs text-white font-bold">Código Automático:</span>
                <span className="bg-secondary text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                  GRUPO6_GRATIS
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* TOURS CATALOG WITH DIRECT HOTEL BOOKING */}
        <section id="tours" className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-cyan text-xs font-black uppercase tracking-widest font-display">
                Disponibilidad en Vivo
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight text-white mt-1">
                Excursiones con Salida desde {resort.name}
              </h2>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-md">
              Todos los precios incluyen recogida y retorno garantizado al lobby de {resort.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toursList.map((t) => (
              <div
                key={t.id}
                className="bg-surface/70 border border-white/10 hover:border-secondary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-glow group flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bgDark via-transparent to-black/30" />
                  
                  <span className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {t.badge}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-cyan" /> Recogida: {t.pickup}
                    </span>
                    <div className="text-right bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-xl border border-white/10">
                      <span className="text-[10px] text-gray-400 block uppercase">Por persona</span>
                      <span className="text-secondary font-black text-xl font-display">${t.price} USD</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black font-display text-white group-hover:text-secondary transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓ Reserva con solo $25</span>
                      <span>•</span>
                      <span>Paga resto en tour</span>
                    </div>

                    <button
                      onClick={() => handleBookTour(t.id)}
                      className="w-full sm:w-auto bg-secondary hover:bg-orange-600 text-white font-bold font-display uppercase tracking-wider text-xs py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-glow"
                    >
                      Reservar Ahora <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOGISTICS & WHAT TO BRING */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-surface/50 border border-white/10 rounded-3xl p-8 flex flex-col gap-6">
            <h3 className="text-xl font-black font-display text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" /> Logística de Recogida en {resort.name}
            </h3>
            
            <div className="flex flex-col gap-4 text-xs md:text-sm text-gray-300">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary font-black flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <p><b>Confirmación Inmediata:</b> Recibirás tu ticket digital oficial por email y WhatsApp con los datos de tu chofer y número de contacto directo.</p>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary font-black flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <p><b>Llegada del Chofer:</b> El chofer se presenta puntualmente en el lobby con cartel de Fire Tour DR y el nombre del pasajero principal registrado.</p>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary font-black flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <p><b>Retorno Cómodo:</b> Al finalizar la excursión, el transporte te regresa exactamente al mismo lobby donde te recogió.</p>
              </div>
            </div>
          </div>

          <div className="bg-surface/50 border border-white/10 rounded-3xl p-8 flex flex-col gap-6">
            <h3 className="text-xl font-black font-display text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan" /> Recomendaciones para Huéspedes
            </h3>
            
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Pide toallas de playa en el módulo de toallas de tu resort antes de salir al tour.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Lleva protector solar biodegradable para cuidar el arrecife y las estrellas de mar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ten a mano dinero en efectivo (USD o Pesos Dominicanos) para pagar el saldo restante y propinas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Para Buggies, lleva ropa cómoda que no te importe manchar de barro o arcilla roja.</span>
              </li>
            </ul>
          </div>

        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="bg-surface/40 border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              Preguntas Frecuentes desde {resort.name}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              Todo lo que necesitas saber antes de subir a tu aventura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resort.faqs.map((faq, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                <h4 className="font-bold text-sm text-white font-display flex items-start gap-2">
                  <span className="text-secondary font-black">Q:</span> {faq.q}
                </h4>
                <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* OTHER HOTELS LINKS FOR GOOGLEBOT CRAWLER */}
        <section className="border-t border-white/10 pt-10">
          <h4 className="text-sm font-black font-display uppercase tracking-wider text-gray-400 mb-4">
            También operamos con recogida diaria en estos resorts:
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {RESORTS_DATA.filter(r => r.slug !== resort.slug).map(r => (
              <Link
                key={r.slug}
                to={`/hoteles/${r.slug}`}
                className="bg-surface/60 hover:bg-surface border border-white/10 hover:border-secondary/40 text-gray-400 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
