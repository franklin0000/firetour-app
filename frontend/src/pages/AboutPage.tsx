import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, MapPin, Award, Users, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Conoce Nuestra Historia
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight">
            Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-amber-300">Fire Tour DR</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400">
            Conectamos a viajeros de todo el mundo con las experiencias más auténticas, seguras y memorables de Punta Cana y la República Dominicana.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-secondary/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Nuestra Misión</h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Transformar cada viaje a República Dominicana en una vivencia inolvidable. Eliminamos las complicaciones e incertidumbres de reservar en la playa o mediante intermediarios informales, ofreciendo un catálogo verificado con los mejores precios garantizados, confirmación inmediata y soporte personalizado 24/7.
            </p>
          </div>

          <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-cyan/20 text-cyan flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Nuestra Visión</h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Ser el referente tecnológico y de confianza para el turismo en el Caribe, impulsando un turismo sostenible que respalde a las comunidades locales, a los capitanes de embarcación autóctonos y a los guías certificados que hacen de este país un paraíso único.
            </p>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Por qué los aventureros nos eligen</h2>
            <p className="text-sm text-gray-400 mt-2">Seguridad, transparencia y servicio directo sin intermediarios abusivos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white font-display text-lg">Operadores 100% Verificados</h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Cada catamarán, buggy y vehículo cuenta con inspección técnica rigurosa y pólizas de seguro de pasajeros vigentes.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan/10 text-cyan mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white font-display text-lg">Recogida Puerta a Puerta</h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Coordinamos transporte climatizado con recogida y retorno directo en el lobby de los principales resorts de Punta Cana y Bávaro.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white font-display text-lg">Garantía Meteorológica</h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Si las condiciones marítimas impiden la navegación segura, reprogramamos tu tour sin recargo o devolvemos tu dinero.
              </p>
            </div>
          </div>
        </div>

        {/* Operational Presence in Dominican Republic */}
        <div className="bg-gradient-to-r from-secondary/10 via-surface to-cyan/10 border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan bg-cyan/10 px-3 py-1 rounded-full">
            <Users className="w-4 h-4" /> Equipo Local en Terreno
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            Pasión Dominicana en Cada Aventura
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed">
            Nuestro equipo central y coordinadores de campo residen permanentemente en <strong className="text-white">Punta Cana y Bayahíbe</strong>. Vivimos y respiramos este destino cada día, lo que nos permite ofrecerte información en tiempo real sobre el clima, las mejores horas para navegar y recomendaciones exclusivas que ninguna agencia tradicional te dará.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              to="/" 
              className="px-6 py-3 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow"
            >
              Explorar Catálogo de Tours
            </Link>
            <Link 
              to="/contacto" 
              className="px-6 py-3 rounded-full bg-white/10 text-white font-bold font-display text-sm hover:bg-white/20 transition-all border border-white/15"
            >
              Contactar al Equipo
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
