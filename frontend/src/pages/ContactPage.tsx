import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Clock, Send, CheckCircle2, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    // Simulate successful form submission
    setSubmitted(true);
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(`Hola Fire Tour DR, mi nombre es ${formData.name || 'Viajero'}. Consulta: ${formData.message || 'Quisiera información sobre las excursiones en Punta Cana'}`);
    window.open(`https://wa.me/15872257342?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-widest">
            <MessageCircle className="w-4 h-4" /> Estamos para Servirte
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Contáctanos & Soporte Directo
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-400">
            ¿Tienes dudas sobre una excursión, recogida en tu hotel o deseas una cotización privada? Nuestro equipo local responde en minutos.
          </p>
        </div>

        {/* Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="bg-surface/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6 shadow-premium">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/10 pb-4">
                Información de Contacto
              </h3>

              <div className="space-y-5 text-sm">
                <a 
                  href="https://wa.me/15872257342" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-gray-300 hover:text-white transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-black" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">WhatsApp 24/7 (Respuesta Rápida)</span>
                    <span className="text-xs text-[#25D366] font-medium">+1 (587) 225-7342</span>
                  </div>
                </a>

                <a 
                  href="mailto:booking.inf@firetourdr.com"
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">Correo Electrónico</span>
                    <span className="text-xs text-gray-400 break-all">booking.inf@firetourdr.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">Ubicación Operativa</span>
                    <span className="text-xs text-gray-400">Av. España, Bávaro - Punta Cana, República Dominicana</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">Horario de Operación</span>
                    <span className="text-xs text-gray-400">Lunes a Domingo: 7:00 AM - 10:00 PM (AST)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-premium">
              <h3 className="text-2xl font-bold font-display text-white mb-2">Envíanos un Mensaje</h3>
              <p className="text-sm text-gray-400 mb-6">
                Completa el formulario y te contactaremos en un plazo máximo de 2 horas.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold font-display text-white">¡Mensaje Recibido con Éxito!</h4>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Gracias <strong className="text-white">{formData.name}</strong>. Un coordinador de Fire Tour DR revisará tu solicitud y se pondrá en contacto al correo <strong className="text-cyan">{formData.email}</strong>.
                  </p>
                  <button 
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="text-xs text-gray-400 underline hover:text-white pt-2 block mx-auto"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Carlos Santana"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Correo Electrónico *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nombre@ejemplo.com"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Teléfono / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 809 000 0000"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Motivo de Consulta</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan transition"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="saona">Dudas Excursión Isla Saona</option>
                        <option value="buggies">Dudas Buggies Macao 4x4</option>
                        <option value="traslados">Traslados Aeropuerto PUJ</option>
                        <option value="privado">Tours Privados y Grupos</option>
                        <option value="otro">Otras consultas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Mensaje o Pregunta *</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos fecha aproximada de viaje, hotel de estancia o qué dudas tienes..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Enviar Consulta
                    </button>

                    <button 
                      type="button"
                      onClick={openWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold font-display text-sm hover:bg-[#25D366]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" /> Enviar por WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Quick FAQ Section */}
        <div className="bg-surface/50 border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2 text-cyan font-bold font-display text-lg">
            <HelpCircle className="w-5 h-5" /> Preguntas Frecuentes Rápidas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">¿Cómo sé a qué hora me recogen en mi hotel?</h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Una vez recibida tu reserva, te enviamos el voucher digital y 24 horas antes confirmamos por WhatsApp la hora exacta de pick-up en el lobby de tu resort.
              </p>
            </div>
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">¿Qué pasa si llueve el día del tour?</h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                En el trópico las lluvias suelen ser pasajeras. Si la Armada restringe la navegación o hay tormenta severa, reprogramamos sin costo o emitimos el reembolso total.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
