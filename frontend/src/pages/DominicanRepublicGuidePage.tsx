import React from 'react';
import { Compass, MapPin, Waves, Mountain, Sun, Landmark, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DominicanRepublicGuidePage() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-surface via-black to-cyan/15 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-widest">
                <Compass className="w-4 h-4" /> La Guía Definitiva del País
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
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

            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                <img 
                  src="/gallery/guides/rd-playa-rincon.webp?v=2" 
                  alt="Playa Rincón en Samaná, República Dominicana" 
                  width={1200}
                  height={675}
                  {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
                  decoding="sync"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-xs font-bold text-white">
                  República Dominicana • Playas, Ríos y Naturaleza Real
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Regional Navigation Anchor Bar */}
        <div id="regiones" className="bg-surface/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs font-bold font-display uppercase tracking-wider">
          <a href="#samana" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan/20 hover:text-cyan transition whitespace-nowrap">
            🌴 Samaná & Las Terrenas
          </a>
          <a href="#playas" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-sky-400/20 hover:text-sky-400 transition whitespace-nowrap">
            🏖️ Mejores Playas de RD
          </a>
          <a href="#rios" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-400/20 hover:text-emerald-400 transition whitespace-nowrap">
            💧 Ríos Naturales
          </a>
          <a href="#barahona" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-secondary/20 hover:text-secondary transition whitespace-nowrap">
            🌊 Barahona & Sur Profundo
          </a>
          <a href="#santo-domingo" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 transition whitespace-nowrap">
            🏛️ Santo Domingo Capital
          </a>
          <a href="#montana" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-400/20 hover:text-purple-400 transition whitespace-nowrap">
            ⛰️ Jarabacoa & Cordillera
          </a>
          <a href="#punta-cana-resumen" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-orange-400/20 hover:text-orange-400 transition whitespace-nowrap">
            ⛵ Punta Cana & Saona
          </a>
        </div>

        {/* Region 1: Samaná & Las Terrenas */}
        <section id="samana" className="bg-surface/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-glass space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-widest mb-1">
                <Waves className="w-4 h-4" /> La Joya Verde del Noreste
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Samaná & Las Terrenas: Playas Vírgenes, Cascadas y Ballenas
              </h2>
            </div>
            <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1.5 rounded-full shrink-0">
              Península de Samaná
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            La península de <strong className="text-white">Samaná</strong> es el tesoro verde más espectacular de la República Dominicana. Aquí las montañas cubiertas por millones de cocoteros descienden directamente sobre bahías vírgenes, ríos de manglar helados y calas secretas a las que muchas veces solo se llega en bote o 4x4. A apenas 2.5 horas de Santo Domingo por la Autopista Juan Pablo II y el Boulevard Turístico del Atlántico, ofrece la mayor densidad de playas paradisíacas del país.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-las-terrenas.webp?v=2" alt="Playa Las Terrenas con botes de pescadores y cocoteros en Samaná" loading="eager" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Las Terrenas — Costa de palmeras y pescadores</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-playa-rincon.webp?v=2" alt="Playa Rincón en Las Galeras, Samaná, República Dominicana" loading="eager" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Playa Rincón — Aguas turquesas en Las Galeras</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-salto-limon.webp?v=2" alt="Cascada Salto del Limón en Samaná, República Dominicana" loading="eager" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Salto del Limón — Cascada selvática de 40 m</figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-cyan flex items-center gap-2">
                <Sun className="w-4 h-4" /> Las Terrenas: Cosón, Bonita y Las Ballenas
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Antiguo pueblo pesquero convertido en enclave cosmopolita con esencia francesa, italiana y dominicana. <strong className="text-white">Playa Bonita</strong> combina surf suave y piscina natural en Punta Bonita; <strong className="text-white">Playa Cosón</strong> ofrece kilómetros vírgenes de palmeras; <strong className="text-white">Playa Las Ballenas</strong> y <strong className="text-white">Punta Popy</strong> brillan por sus aguas calmas, kitesurf y el vibrante <strong className="text-white">Pueblo de los Pescadores</strong> frente al mar.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-secondary flex items-center gap-2">
                <Waves className="w-4 h-4" /> Playa Rincón & Caño Frío (Las Galeras)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Reconocida constantemente entre las 10 playas más hermosas del mundo: más de 3 km de arena blanca flanqueados por acantilados verdes. En su extremo oeste desemboca <strong className="text-white">Caño Frío</strong>, un río cristalino y helado entre manglares donde puedes nadar en agua dulce a metros del mar turquesa.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-sky-400 flex items-center gap-2">
                🏝️ Playas Secretas: Frontón, Madama, Morón y Ermitaño
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                En Las Galeras te esperan <strong className="text-white">Playa Frontón</strong> (al pie de un farallón vertical de 90 m ideal para snorkel) y <strong className="text-white">Playa Madama</strong> (cala escondida con cueva). Cerca de El Limón, <strong className="text-white">Playa Morón</strong> y <strong className="text-white">Playa El Ermitaño</strong> conservan selva virgen intacta sin construcciones.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-amber-400 flex items-center gap-2">
                🐋 Santuario de Ballenas Jorobadas (Ene–Mar)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Del 15 de enero al 30 de marzo, más de 3,000 ballenas jorobadas migran a la <strong className="text-white">Bahía de Samaná</strong> para aparearse y dar a luz. Ver saltar estos gigantes de 40 toneladas desde embarcaciones autorizadas es uno de los mayores espectáculos marinos del planeta.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-emerald-400 flex items-center gap-2">
                ⛰️ Salto del Limón & Cayo Levantado
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                El <strong className="text-white">Salto del Limón</strong> es una cascada selvática de más de 40 metros con una poza verde esmeralda accesible a pie o a caballo. En la bahía brilla <strong className="text-white">Cayo Levantado</strong> (Isla Bacardí), rodeada de aguas turquesa cristalinas.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold font-display text-purple-400 flex items-center gap-2">
                🌿 Parque Nacional Los Haitises
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Accesible en lancha desde el puerto de Samaná o Sabana de la Mar: un laberinto de mogotes kársticos cubiertos de selva húmeda, manglares infinitos, aves endémicas y cuevas con pictogramas originales de los indígenas taínos.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/blog/guia-las-terrenas-samana-playas-ballenas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-xs font-bold hover:bg-cyan/25 transition"
            >
              Leer Guía Detallada de Samaná y Las Terrenas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* New Section: Ranking de las Mejores Playas de República Dominicana */}
        <section id="playas" className="bg-surface/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-glass space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest mb-1">
                <Waves className="w-4 h-4" /> Más de 1,600 km de Costa Caribeña y Atlántica
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Las Mejores Playas de República Dominicana por Región
              </h2>
            </div>
            <span className="text-xs font-bold text-sky-400 bg-sky-400/10 border border-sky-400/30 px-3 py-1.5 rounded-full shrink-0">
              Top Playas RD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-bahia-aguilas.webp?v=2" alt="Bahía de las Águilas en Pedernales, República Dominicana" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Bahía de las Águilas — 8 km de playa virgen en Pedernales</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-cayo-arena.webp?v=2" alt="Cayo Levantado, isla de arena blanca y aguas turquesa en la Bahía de Samaná" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Cayo Levantado (Isla Bacardí) — Aguas cristalinas en Samaná</figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-lg font-bold font-display text-cyan">🏝️ Costa Este & Miches</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li><strong className="text-white">Isla Saona (Canto de la Playa):</strong> Arena blanca como talco y piscina natural con estrellas de mar.</li>
                <li><strong className="text-white">Playa Esmeralda (Miches):</strong> Kilómetros vírgenes de cocoteros intactos frente a la Bahía de Samaná.</li>
                <li><strong className="text-white">Playa Juanillo (Cap Cana) & Playa Bávaro:</strong> Aguas turquesas calmas protegidas por arrecifes.</li>
                <li><strong className="text-white">Playa Macao & Bayahíbe / Isla Catalina:</strong> Olas para surf en Macao y el mejor snorkel de coral en Catalina y Dominicus.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-lg font-bold font-display text-sky-400">🌊 Costa Norte (María Trinidad Sánchez, Puerto Plata y Montecristi)</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li><strong className="text-white">Cayo Arena (Punta Rucia):</strong> Banco de arena blanco en medio del océano rodeado de peces tropicales.</li>
                <li><strong className="text-white">Playa Grande & Playa Preciosa (Río San Juan):</strong> Arena dorada extensa, acantilados verdes y oleaje imponente.</li>
                <li><strong className="text-white">Playa Diamante & Arroyo Salado (Cabrera):</strong> Bahía poco profunda sin olas en Diamante y río frío desembocando al mar en Arroyo Salado.</li>
                <li><strong className="text-white">Cabarete, Sosúa y El Morro (Montecristi):</strong> Capital mundial del kitesurf, cala transparente de Sosúa y acantilados dorados al noroeste.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-lg font-bold font-display text-secondary">🌴 Península de Samaná</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li><strong className="text-white">Playa Rincón & Playa Frontón:</strong> Consideradas entre las playas más bellas del Caribe y el mundo.</li>
                <li><strong className="text-white">Playa Bonita, Playa Cosón & Las Ballenas (Las Terrenas):</strong> Palmerales interminables, surf y atardeceres dorados.</li>
                <li><strong className="text-white">Playa Madama, Playa Morón & Playa El Ermitaño:</strong> Joyas vírgenes para viajeros que buscan naturaleza pura.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-lg font-bold font-display text-amber-400">💎 Sur Profundo (Pedernales, Barahona y Baní)</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li><strong className="text-white">Bahía de las Águilas (Pedernales):</strong> 8 km de arena impoluta sin un solo hotel dentro del Parque Nacional Jaragua.</li>
                <li><strong className="text-white">Playa San Rafael & Los Patos (Barahona):</strong> Aguas color turquesa eléctrico abrazadas por ríos helados de montaña.</li>
                <li><strong className="text-white">Playa Quemaito & Salinas de Baní:</strong> Guijarros de aguas tranquilas en Barahona y dunas desérticas junto al mar en Peravia.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* New Section: Ríos Naturales y Balnearios de República Dominicana */}
        <section id="rios" className="bg-surface/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-glass space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" /> Aguas Dulces, Charcos Turquesa y Cascadas
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                Los Ríos Naturales Más Lindos de República Dominicana
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1.5 rounded-full shrink-0">
              Ríos & Balnearios RD
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Además de sus costas, República Dominicana es un paraíso de <strong className="text-white">ríos de agua dulce cristalina, pozas azul turquesa, manantiales helados y saltos selváticos</strong>. Para los dominicanos y viajeros aventureros, bañarse en un río natural de montaña es tan imprescindible como ir a la playa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-damajagua-charcos.webp?v=2" alt="27 Charcos de Damajagua en Puerto Plata, República Dominicana" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">27 Charcos de Damajagua — Cascadas y pozas en Puerto Plata</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-jarabacoa-salto.webp?v=2" alt="Salto de Jimenoa en la Cordillera Central, Jarabacoa" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Salto de Jimenoa — Aguas frescas de montaña en Jarabacoa</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg group">
              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
                <img src="/gallery/guides/rd-rio-chavon.webp?v=2" alt="Panorámica del Río Chavón en La Romana, República Dominicana" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="px-3.5 py-2.5 text-xs text-gray-300 border-t border-white/10">Río Chavón — Cañón selvático navegable en La Romana</figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-base font-bold font-display text-cyan">💎 Cibao & Costa Norte</h3>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li><strong className="text-white">Río Partido (Salcedo / Tenares):</strong> Famoso por sus pozas de color azul turquesa intenso rodeadas de bosque húmedo.</li>
                <li><strong className="text-white">27 Charcos de Damajagua (Puerto Plata):</strong> Toboganes de piedra natural y saltos de agua cristalina en un cañón tropical.</li>
                <li><strong className="text-white">Río Jamao al Norte & Río Sonador:</strong> Charcos color esmeralda en Espaillat y aguas refrescantes en Yásica.</li>
                <li><strong className="text-white">Río Arroyo Salado & Laguna Dudú (Cabrera):</strong> Manantial frío junto a la playa y cenotes de agua dulce para lanzarse en tirolina.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-base font-bold font-display text-emerald-400">⛰️ Cordillera Central (Jarabacoa, Constanza y Bonao)</h3>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li><strong className="text-white">Río Yaque del Norte & La Confluencia:</strong> El río más largo del país, único en el Caribe para rafting en rápidos.</li>
                <li><strong className="text-white">Río Jimenoa & Río Baiguate:</strong> Saltos de agua imponentes con puentes colgantes entre pinares en Jarabacoa.</li>
                <li><strong className="text-white">Río Fula, Río Masipedro & Saltos de Jima (Bonao):</strong> Aguas heladas súper transparentes y 9 charcos encadenados en la reserva natural de Jima.</li>
                <li><strong className="text-white">Salto de Aguas Blancas (Constanza):</strong> La cascada más alta de las Antillas (83 m) a más de 1,600 m de altitud.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5">
              <h3 className="text-base font-bold font-display text-secondary">🌊 Sur Profundo (Barahona)</h3>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li><strong className="text-white">Río Los Patos:</strong> El río más corto del mundo (~500 m) con agua helada ultra cristalina a pasos del Mar Caribe.</li>
                <li><strong className="text-white">Río y Balneario San Rafael:</strong> Terrazas y piscinas naturales frías escalonadas frente a la playa.</li>
                <li><strong className="text-white">Balneario La Plaza (Río Bahoruco):</strong> Pozas escondidas de agua azul lechosa entre rocas blancas en la sierra.</li>
                <li><strong className="text-white">Río Nizaito, Villa Miriam & Mata de Maíz:</strong> Piscinas naturales de montaña en Paraíso y Polo.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-2.5 md:col-span-2 lg:col-span-3">
              <h3 className="text-base font-bold font-display text-amber-400">🌴 Noreste, Este y Cerca de Santo Domingo</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                En Samaná brillan <strong className="text-white">Caño Frío</strong> (río de manglar helado en Playa Rincón) y el <strong className="text-white">Río/Salto del Limón</strong>. En Monte Plata (a ~1 hora de Santo Domingo) destacan el cristalino <strong className="text-white">Río Comate</strong>, <strong className="text-white">Salto de Socoa</strong> y <strong className="text-white">Salto Alto de Bayaguana</strong>. En el Este son imperdibles el navegable <strong className="text-white">Río Chavón</strong> (La Romana), el cenote <strong className="text-white">Hoyo Azul</strong> (Cap Cana) y las lagunas de agua dulce del <strong className="text-white">Parque Ecológico Ojos Indígenas</strong> (Punta Cana), mientras en San Cristóbal resaltan el balneario <strong className="text-white">La Toma</strong> y el <strong className="text-white">Río Manyaco</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/blog/guia-mejores-playas-y-rios-naturales-republica-dominicana"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition"
            >
              Ver Guía Completa de Playas y Todos los Ríos Naturales de RD <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Region 2: Barahona & El Sur Profundo */}
        <section id="barahona" className="bg-surface/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-glass space-y-8 scroll-mt-28">
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

          <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 max-w-4xl mx-auto shadow-xl">
            <div className="w-full aspect-[16/9] overflow-hidden bg-slate-900">
              <img src="/gallery/guides/rd-barahona-rios.webp?v=2" alt="Acantilados y mar turquesa eléctrico en la costa de Barahona, Sur Profundo" loading="lazy" decoding="sync" width={1200} height={675} className="w-full h-full object-cover object-center" />
            </div>
            <figcaption className="px-4 py-2.5 text-xs text-gray-300 border-t border-white/10">Acantilados y aguas color turquesa intenso en la costa de Barahona, Sur Profundo</figcaption>
          </figure>

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
