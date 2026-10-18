import React from 'react';
import { Compass, MapPin, Waves, Mountain, Sun, Landmark, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DominicanRepublicGuidePage() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-14 bg-gradient-to-br from-surface via-black to-cyan/15 shadow-premium">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-widest">
              <Compass className="w-4 h-4" /> La Guía Definitiva del País
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-tight">
              Descubre la <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue-400 to-secondary">República Dominicana</span> Completa
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Más allá de los resorts de Punta Cana: desde las costas salvajes de <strong className="text-white">Las Terrenas y Samaná</strong>, los ríos cristalinos de <strong className="text-white">Los Patos en Barahona</strong>, hasta los 500 años de historia de la <strong className="text-white">Zona Colonial de Santo Domingo</strong> y las cumbres montañosas de Jarabacoa.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#regiones" 
                className="px-6 py-3 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow flex items-center gap-2"
              >
                Explorar por Regiones <ArrowRight className="w-4 h-4" />
              </a>
              <Link 
                to="/punta-cana" 
                className="px-6 py-3 rounded-full bg-white/10 text-white font-bold font-display text-sm hover:bg-white/20 transition-all border border-white/15"
              >
                Ver Guía de Punta Cana
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 h-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/gallery/facebook_1792088865961.jpg" 
              alt="Playas de República Dominicana" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-xs font-bold text-white">
              República Dominicana • Caribe Auténtico
            </div>
          </div>
        </div>

        {/* Quick Regional Navigation Anchor Bar */}
        <div id="regiones" className="bg-surface/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs font-bold font-display uppercase tracking-wider">
          <a href="#samana" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan/20 hover:text-cyan transition whitespace-nowrap">
            🌴 Samaná & Las Terrenas
          </a>
          <a href="#barahona" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-secondary/20 hover:text-secondary transition whitespace-nowrap">
            🌊 Barahona & Sur Profundo
          </a>
          <a href="#santo-domingo" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 transition whitespace-nowrap">
            🏛️ Santo Domingo Capital
          </a>
          <a href="#punta-cana-resumen" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-400/20 hover:text-emerald-400 transition whitespace-nowrap">
            ⛵ Punta Cana & Saona
          </a>
          <a href="#montana" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-400/20 hover:text-purple-400 transition whitespace-nowrap">
            ⛰️ Jarabacoa & Cordillera
          </a>
        </div>

        {/* Region 1: Samaná & Las Terrenas */}
        <section id="samana" className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-widest mb-1">
                <Waves className="w-4 h-4" /> La Joya Verde del Noreste
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Samaná & Las Terrenas: El Paraíso Bohemio y Salvaje
              </h2>
            </div>
            <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1.5 rounded-full shrink-0">
              Península de Samaná
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            La península de <strong className="text-white">Samaná</strong> es el secreto mejor guardado de la República Dominicana. A diferencia de las extensas llanuras hoteleras del este, aquí las montañas cubiertas de densos cocoteros caen directamente sobre calas secretas de arena dorada y aguas color esmeralda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-white text-cyan flex items-center gap-2">
                <Sun className="w-4 h-4" /> Las Terrenas: Playas Cosón, Bonita y Las Ballenas
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Antiguo pueblo pesquero que evolucionó en un cosmopolita enclave bohemio con influencia francesa e italiana. En <strong className="text-white">Playa Bonita</strong> y <strong className="text-white">Playa Cosón</strong> podrás pasear kilómetros bajo palmeras vírgenes y disfrutar de alta gastronomía de mariscos frescos en el Pueblo de los Pescadores.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-white text-secondary flex items-center gap-2">
                <Waves className="w-4 h-4" /> Playa Rincón & Caño Frío (Las Galeras)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Reconocida internacionalmente por prestigiosas revistas de viajes como una de las 10 playas más hermosas del mundo. En su extremo occidental se encuentra <strong className="text-white">Caño Frío</strong>, un río de manglar de aguas heladas y transparentes que desemboca en el mar tibio.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-white text-amber-400 flex items-center gap-2">
                🐋 Santuario de Ballenas Jorobadas (Enero a Marzo)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Cada año, más de 3,000 ballenas jorobadas migran desde el Atlántico Norte a la cálida <strong className="text-white">Bahía de Samaná</strong> para cortejar, aparearse y dar a luz a sus ballenatos. Presenciar los saltos acrobáticos de estos colosos marinos de 40 toneladas es una de las experiencias ecológicas más sublimes del planeta.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-white text-emerald-400 flex items-center gap-2">
                ⛰️ Salto del Limón & Cayo Levantado
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Una impresionante cascada de más de 40 metros escondida en la selva tropical, accesible a caballo o senderismo, perfecta para un refrescante baño en su poza natural. En la bahía destaca <strong className="text-white">Cayo Levantado</strong> (conocida históricamente como la Isla Bacardí).
              </p>
            </div>
          </div>
        </section>

        {/* Region 2: Barahona & El Sur Profundo */}
        <section id="barahona" className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-1">
                <Mountain className="w-4 h-4" /> La Belleza Virgen del Caribe
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Barahona & El Sur Profundo: Los Patos, Larimar y Bahía de las Águilas
              </h2>
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/30 px-3 py-1.5 rounded-full shrink-0">
              Suroeste Dominicano
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            El Suroeste dominicano, conocido como el <strong className="text-white">«Sur Profundo»</strong>, es la región más diversa, misteriosa y ecológicamente intacta del país. La Sierra de Bahoruco desciende abruptamente hacia un mar de azul cobalto y turquesa eléctrico, creando paisajes de una belleza dramática inigualable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center font-bold text-lg font-display">
                01
              </div>
              <h3 className="text-lg font-bold font-display text-white">Los Patos de Barahona</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Hogar del <strong className="text-white">río más corto del mundo</strong> (apenas unos 500 metros desde su manantial hasta la playa). Sus aguas de manantial heladas y ultra cristalinas forman un balneario natural donde podrás bañarte a escasos metros de una playa única de piedras blancas redondeadas bañadas por el mar Caribe.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold text-lg font-display">
                02
              </div>
              <h3 className="text-lg font-bold font-display text-white">San Rafael & Los Balnearios</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                En San Rafael, una cascada de agua dulce fría cae de la montaña formando terrazas y piscinas naturales antes de desembocar en una playa de olas turquesas. Alrededor, los restaurantes típicos preparan pescado frito fresco servido con tostones crocantes y aguacate criollo.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg font-display">
                03
              </div>
              <h3 className="text-lg font-bold font-display text-white">Bahía de las Águilas (Pedernales)</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Considerada unánimemente la <strong className="text-white">playa más virgen y espectacular del Caribe</strong>. Ubicada en el Parque Nacional Jaragua, cuenta con más de 8 kilómetros de arena blanca talco y aguas inmóviles con visibilidad submarina total, sin un solo hotel ni rascacielos en el horizonte.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan/10 via-surface to-secondary/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 text-cyan" /> El Larimar: La Piedra Única en el Mundo
              </h4>
              <p className="text-xs text-gray-300">
                En las montañas de Los Chupaderos (Barahona) se encuentra la <strong className="text-white">única mina del planeta</strong> donde se extrae el Larimar, una rara variedad de pectolita volcánica de color azul celeste que solo existe en la República Dominicana.
              </p>
            </div>
          </div>
        </section>

        {/* Region 3: Santo Domingo (La Capital Primada) */}
        <section id="santo-domingo" className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
                <Landmark className="w-4 h-4" /> Cuna de la Historia del Nuevo Mundo
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Santo Domingo: La Primada de América y la Zona Colonial
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full shrink-0">
              Patrimonio de la Humanidad UNESCO
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Fundada en 1496 por Bartolomé Colón, <strong className="text-white">Santo Domingo</strong> es el asentamiento europeo más antiguo en continuo funcionamiento de todo el continente americano. Es una metrópolis fascinante que une 500 años de patrimonio colonial con la vibrante energía moderna caribeña.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-display text-base text-amber-400">
                  🏛️ Monumentos Históricos de la Ciudad Colonial
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-300 pl-2">
                  <li><strong className="text-white">Catedral Primada de América:</strong> La primera catedral del continente, consagrada por el Papa Paulo III en 1546.</li>
                  <li><strong className="text-white">Alcázar de Colón:</strong> El palacio virreinal de Diego Colón (hijo de Cristóbal Colón), construido en piedra de coral sin clavos.</li>
                  <li><strong className="text-white">Calle Las Damas:</strong> La calle adoquinada más antigua del Nuevo Mundo, flanqueada por casonas señoriales.</li>
                  <li><strong className="text-white">Fortaleza Ozama:</strong> La estructura militar de defensa europea más antigua de América.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-display text-base text-cyan">
                  💎 Parque Nacional Los Tres Ojos & Malecón
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  A solo minutos del centro histórico se encuentra una cueva subterránea de piedra caliza con cuatro lagos de agua pura (los lagos Azufre, Nevera, Damas y Los Zaramagullones), que sirvió de centro ceremonial para los indios taínos. Por la tarde, el <strong className="text-white">Malecón frente al Mar Caribe</strong> se llena de música, brisa y vida social.
                </p>
                <div className="pt-2 text-xs text-secondary font-bold">
                  Distancia desde Punta Cana: 2 horas por la Autopista del Coral.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Region 4: Jarabacoa y la Cordillera Central */}
        <section id="montana" className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-6 scroll-mt-28">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <Mountain className="w-4 h-4" /> La Ciudad de la Eterna Primavera
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Jarabacoa, Constanza & El Pico Duarte: El Caribe de Montaña
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            República Dominicana no solo es mar y sol: en el corazón de la isla se erige la <strong className="text-white">Cordillera Central</strong>, con el <strong className="text-white">Pico Duarte (3,087 metros)</strong>, la cumbre más alta de todas las Antillas. Aquí el clima desciende hasta los 12°C-18°C (e incluso bajo cero en las noches de invierno en Valle Nuevo).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block text-sm">Rafting en el Río Yaque del Norte</span>
              <p className="text-gray-400">El único río del Caribe donde se practica rafting en rápidos clase II y III entre cañones tropicales.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block text-sm">Constanza y Valle Nuevo</span>
              <p className="text-gray-400">Cultivo de fresas frescas, flores ornamentales y hortalizas en el valle más alto de la isla.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block text-sm">Cascadas Gemelas de Jimenoa y Baiguate</span>
              <p className="text-gray-400">Cataratas de aguas cristalinas rodeadas de puentes colgantes de madera y bosques de pinos.</p>
            </div>
          </div>
        </section>

        {/* Region 5: Punta Cana & Saona (Connection) */}
        <section id="punta-cana-resumen" className="bg-gradient-to-r from-secondary/20 via-surface to-cyan/20 border border-secondary/40 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/15 px-3 py-1 rounded-full">
            <Camera className="w-4 h-4" /> La Costa Este
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            Punta Cana, Bayahíbe e Isla Saona
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed">
            El punto neurálgico de las excursiones premium operadas directamente por <strong className="text-white">Fire Tour DR</strong>. Catamaranes a vela, arrecifes de coral, piscinas naturales con estrellas de mar y expediciones todoterreno en buggies 4x4.
          </p>
          
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link 
              to="/punta-cana" 
              className="px-8 py-3.5 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow flex items-center gap-2"
            >
              Ver Guía y Fotos de Punta Cana <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/" 
              className="px-6 py-3.5 rounded-full bg-white/10 text-white font-bold font-display text-sm hover:bg-white/20 transition-all border border-white/15"
            >
              Ver Catálogo de Tours
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
