import React, { useState } from 'react';
import { Compass, MapPin, Sun, Waves, Utensils, ShieldCheck, Camera, CheckCircle2, ArrowRight, Star, Heart, Clock, DollarSign, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { REAL_GALLERY_PHOTOS, GalleryPhoto } from '../data/galleryPhotos';

export default function PuntaCanaGuidePage() {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'playas' | 'saona' | 'aventura' | 'cultura' | 'relax'>('todos');
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = activeFilter === 'todos' 
    ? REAL_GALLERY_PHOTOS 
    : REAL_GALLERY_PHOTOS.filter((p) => p.tag === activeFilter);

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section with Real Photo Background Accent */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-14 bg-gradient-to-br from-surface via-black to-secondary/15 shadow-premium">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest">
              <Compass className="w-4 h-4" /> Destino República Dominicana
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-tight">
              Guía Oficial de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-amber-300">Punta Cana</span>: Todo lo que Debes Saber
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              El paraíso del este dominicano donde el Océano Atlántico se abraza con el Mar Caribe. Descubre zonas hoteleras, playas cristalinas vírgenes, gastronomía local, clima y las excursiones más emocionantes documentadas con fotos 100% reales de nuestros aventureros.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#galeria-real" 
                className="px-6 py-3 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow flex items-center gap-2"
              >
                <Camera className="w-4 h-4" /> Ver Fotos Reales
              </a>
              <Link 
                to="/" 
                className="px-6 py-3 rounded-full bg-white/10 text-white font-bold font-display text-sm hover:bg-white/20 transition-all border border-white/15"
              >
                Explorar Excursiones
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 h-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/gallery/facebook_1792088865961.jpg" 
              alt="Playa de arena blanca en Punta Cana" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-xs font-bold text-white">
              Isla Saona • Aguas Turquesas
            </div>
          </div>
        </div>

        {/* Section 1: Introduction to Punta Cana */}
        <section className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-6 leading-relaxed">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <MapPin className="w-4 h-4" /> Visión General del Destino
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            ¿Por qué Punta Cana es el epicentro del turismo caribeño?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Situada en el extremo oriental de la provincia de <strong className="text-white">La Altagracia</strong> en la República Dominicana, Punta Cana abarca más de 50 kilómetros de litoral ininterrumpido. Su fama mundial proviene de la finura de su arena blanca —compuesta por restos microscópicos de coral que nunca queman la planta del pie, incluso al mediodía bajo el sol caribeño— y de la barrera de arrecifes coralinos que frena el oleaje exterior en casi toda la costa de Bávaro.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-secondary font-extrabold text-2xl font-display">+50 km</span>
              <p className="text-xs text-gray-400">De playas paradisíacas de arena de coral blanco y aguas turquesas.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan font-extrabold text-2xl font-display">28°C / 82°F</span>
              <p className="text-xs text-gray-400">Temperatura media anual del agua del mar, idónea para bañarse todo el año.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-amber-400 font-extrabold text-2xl font-display">300 Días</span>
              <p className="text-xs text-gray-400">De sol radiante al año con una brisa tropical atemperada y refrescante.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Neighborhoods & Zones */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              Las Zonas y Distritos de Punta Cana
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Cada área de la costa este dominicana posee su propio estilo y encanto. Conoce dónde te hospedas o qué sectores explorar:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-surface/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 hover:border-secondary/40 transition">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold text-lg font-display">
                01
              </div>
              <h3 className="text-xl font-bold font-display text-white">Bávaro & El Cortecito</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                El corazón vibrante de Punta Cana. Aquí se concentran la mayoría de resorts con todo incluido, plazas comerciales, centros de buceo, bares de playa y vida nocturna con sabor dominicano.
              </p>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">Ideal para: Entretenimiento y playa</span>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 hover:border-cyan/40 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center font-bold text-lg font-display">
                02
              </div>
              <h3 className="text-xl font-bold font-display text-white">Cap Cana & Juanillo</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                El enclave más exclusivo y lujoso del Caribe. Cuenta con la marina deportiva de pesca deportiva más moderna, el campo de golf Punta Espada (Jack Nicklaus) y la playa Juanillo con palmeras de postal.
              </p>
              <span className="text-[11px] font-bold text-cyan uppercase tracking-wider block">Ideal para: Lujo, calma y golf</span>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4 hover:border-amber-400/40 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg font-display">
                03
              </div>
              <h3 className="text-xl font-bold font-display text-white">Macao & Uvero Alto</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                La zona norte salvaje y virgen. Famosa por sus olas perfectas para el surf en Playa Macao, acantilados de piedra caliza y el punto de partida de las expediciones de Buggies 4x4 todoterreno.
              </p>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Ideal para: Adrenalina y naturaleza pura</span>
            </div>

          </div>
        </section>

        {/* Real Photo Highlight Banner (Photos from prompt and user folder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan/15 text-cyan text-xs font-bold uppercase tracking-wider">
              Autenticidad Garantizada
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Experiencias reales, sin filtros de catálogo
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              En Fire Tour DR no utilizamos imágenes genéricas de agencias impersonales. Todas las fotos de nuestra plataforma corresponden a nuestros pasajeros disfrutando en los catamaranes, bañándose en las piscinas naturales y descansando en las hamacas caribeñas de Isla Saona y Punta Cana.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Más de 4,500 viajeros felices este año
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden border border-white/15 h-44 sm:h-52">
              <img 
                src="/gallery/facebook_1791837976637.jpg" 
                alt="Chica bajo palmera en playa de Punta Cana" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/15 h-44 sm:h-52">
              <img 
                src="/gallery/facebook_1792088108970.jpg" 
                alt="Grupo de amigos bajo palmera en Punta Cana" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/15 h-44 sm:h-52">
              <img 
                src="/gallery/facebook_1792088042689.jpg" 
                alt="Chica descansando en palmera curva sobre la arena" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/15 h-44 sm:h-52">
              <img 
                src="/gallery/facebook_1792088950614.jpg" 
                alt="Turistas descansando en hamacas frente a la playa" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Clima y Mejor Época */}
        <section className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Sun className="w-4 h-4" /> Meteorología y Épocas del Año
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            ¿Cuál es la mejor época para viajar a Punta Cana?
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            <p>
              El clima de Punta Cana es tropical húmedo y seco, con temperaturas suaves y constantes. Se distinguen principalmente dos temporadas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-display text-base text-secondary">
                  ☀️ Temporada Seca (Diciembre a Abril)
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Es la temporada dorada. Prácticamente no hay lluvias, la humedad ambiente baja al 65-70% y las brisas nocturnas son sumamente placenteras (21°C). El mar en la costa caribeña se encuentra plano como un espejo.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-display text-base text-cyan">
                  🌴 Temporada Tropical (Mayo a Noviembre)
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Temperaturas más cálidas (32°C) y aguas del mar en su punto más templado (29°C). Aunque pueden formarse chubascos vespertinos, suelen durar 15 minutos antes de que vuelva a brillar un sol radiante.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-3 text-xs text-gray-300 mt-4">
              <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Tip contra el Sargazo:</strong>
                Si en algún momento del verano las corrientes del Atlántico arrastran algas a ciertas costas abiertas, las islas del Mar Caribe del sur —como <strong className="text-white">Isla Saona e Isla Catalina</strong>— están protegidas geográficamente y sus aguas permanecen cristalinas y turquesas todo el año.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Gastronomía Dominicana */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              Sabor Dominicano: Platos que Tienes que Probar
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              La gastronomía dominicana es una fusión criolla de herencia taína, española y africana. No te vayas sin saborear:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-surface/80 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🍲</span>
              <h4 className="font-bold text-white font-display">La Bandera Dominicana</h4>
              <p className="text-xs text-gray-400">
                El plato patrio por excelencia: arroz blanco, habichuelas rojas guisadas, carne tierna (pollo o res) y plátanos maduros fritos.
              </p>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🐟</span>
              <h4 className="font-bold text-white font-display">Pescado Frito con Tostones</h4>
              <p className="text-xs text-gray-400">
                Chillo o mero fresco condimentado con limón, ajo y orégano local, frito crujiente frente al mar en Playa Macao.
              </p>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🍌</span>
              <h4 className="font-bold text-white font-display">Mangú con los Tres Golpes</h4>
              <p className="text-xs text-gray-400">
                Puré de plátanos verdes servido con salami dominicano frito, queso frito crocante y huevos con cebollitas encurtidas.
              </p>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🍷</span>
              <h4 className="font-bold text-white font-display">La Mamajuana</h4>
              <p className="text-xs text-gray-400">
                El elixir autóctono macerado con raíces, hojas aromáticas, corteza de árboles, ron dominicano, vino tinto y miel pura de abeja.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Practical Tips for Visitors */}
        <section className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Consejos Prácticos & Seguridad
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Guía de Supervivencia y Datos Útiles en Punta Cana
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Moneda y Métodos de Pago:</strong>
                  <span className="text-xs text-gray-400">El dólar estadounidense (USD) es aceptado casi universalmente en hoteles, taxis y excursiones. No obstante, para pequeños comercios en el pueblo o propinas, cambiar a pesos dominicanos (DOP) en bancos oficiales resulta conveniente.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Seguridad Turística (POLITUR):</strong>
                  <span className="text-xs text-gray-400">Punta Cana es uno de los destinos más seguros de América Latina, con una policía especializada (POLITUR) dedicada exclusivamente a la protección y orientación de los visitantes en playas y zonas hoteleras.</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Waves className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Agua Potable y Salud:</strong>
                  <span className="text-xs text-gray-400">En República Dominicana se debe consumir siempre agua purificada embotellada (todos los resorts y nuestros catamaranes la suministran sin límite). Usa siempre protector solar con alto factor SPF.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Electricidad y Enchufes:</strong>
                  <span className="text-xs text-gray-400">El voltaje estándar es de 110V a 60Hz con clavijas estándar americanas de dos patas planas (Tipo A/B). Los viajeros europeos necesitan adaptador de clavija.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Real Interactive Photo Gallery */}
        <section id="galeria-real" className="space-y-8 pt-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
              <Camera className="w-4 h-4" /> Galería de la Comunidad
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Punta Cana a través del lente de nuestros viajeros
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Fotos reales tomadas en nuestras excursiones de Isla Saona, buggy safaris en Macao y playas secretas.
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              {(['todos', 'playas', 'saona', 'aventura', 'cultura', 'relax'] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition ${
                    activeFilter === tag 
                      ? 'bg-secondary text-white shadow-glow' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Real Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedImage(photo)}
                className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-glass hover:border-secondary/60 transition-all duration-300"
              >
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-black">{photo.tag}</span>
                  <p className="text-xs font-bold text-white leading-snug">{photo.title}</p>
                  <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan" /> {photo.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {selectedImage && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div 
                className="bg-surface border border-white/20 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.title}
                    className="max-h-[70vh] w-auto object-contain" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-secondary transition font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 pt-0 space-y-1">
                  <span className="text-xs text-secondary font-bold uppercase tracking-wider">{selectedImage.tag}</span>
                  <h4 className="text-lg font-bold font-display text-white">{selectedImage.title}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan" /> {selectedImage.location}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Call to action: Book Tour */}
        <div className="bg-gradient-to-r from-secondary/20 via-surface to-cyan/20 border border-secondary/40 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            ¿Listo para vivir la magia de Punta Cana?
          </h3>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Garantiza tu cupo con las mejores tarifas locales, cancelación gratuita y recogida directa en tu hotel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/"
              className="px-8 py-3.5 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow flex items-center gap-2"
            >
              Explorar Catálogo de Excursiones <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/contacto"
              className="px-6 py-3.5 rounded-full bg-white/10 text-white font-bold font-display text-sm hover:bg-white/20 transition-all border border-white/15"
            >
              Consultar con un Asesor
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
