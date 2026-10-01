import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Compass, 
  DollarSign, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  MessageCircle, 
  Globe, 
  TrendingUp, 
  CreditCard,
  Camera,
  Trash2,
  Plus,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PartnerTourPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    location: 'Punta Cana / Bávaro',
    tourTitle: '',
    category: 'Aventura 4x4 / Buggy',
    duration: 'Medio Día (4 horas)',
    priceAdult: '',
    priceChild: '',
    capacity: 'Hasta 20 personas',
    included: '',
    description: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ applicationId: string; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const formDataUpload = new FormData();
    const count = Math.min(files.length, 8 - photos.length);
    for (let i = 0; i < count; i++) {
      formDataUpload.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload-multiple', {
        method: 'POST',
        body: formDataUpload
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.imageUrls)) {
          setPhotos(prev => [...prev, ...data.imageUrls].slice(0, 8));
        }
      } else {
        // Fallback: upload one by one if upload-multiple fails
        const newUrls: string[] = [];
        for (let i = 0; i < count; i++) {
          const singleData = new FormData();
          singleData.append('image', files[i]);
          const singleRes = await fetch('/api/upload', { method: 'POST', body: singleData });
          if (singleRes.ok) {
            const singleJson = await singleRes.json();
            if (singleJson.imageUrl) newUrls.push(singleJson.imageUrl);
          }
        }
        if (newUrls.length > 0) {
          setPhotos(prev => [...prev, ...newUrls].slice(0, 8));
        } else {
          setUploadError('No se pudieron procesar las imágenes. Por favor intenta de nuevo.');
        }
      }
    } catch (err) {
      setUploadError('Error de conexión al subir imágenes.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomUrl = () => {
    if (!customPhotoUrl.trim()) return;
    if (photos.length >= 8) {
      setUploadError('Límite de 8 fotografías alcanzado.');
      return;
    }
    setPhotos(prev => [...prev, customPhotoUrl.trim()].slice(0, 8));
    setCustomPhotoUrl('');
    setShowUrlInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName.trim()) {
      setErrorMessage('Por favor ingresa el nombre de la persona de contacto.');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMessage('Por favor proporciona al menos un número de WhatsApp o correo electrónico.');
      return;
    }
    if (!formData.tourTitle.trim()) {
      setErrorMessage('Por favor indica el título de la excursión que deseas promocionar.');
      return;
    }
    if (!formData.priceAdult || parseFloat(formData.priceAdult) <= 0) {
      setErrorMessage('Por favor ingresa un precio válido por adulto en USD.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      setErrorMessage('Por favor escribe una descripción de la excursión de al menos 20 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/partner/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos,
          included: formData.included.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData({
          applicationId: data.applicationId || 'partner_' + Date.now(),
          message: data.message || '¡Tu propuesta ha sido enviada con éxito!'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(data?.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
      }
    } catch (err) {
      setErrorMessage('Error de conexión al enviar la propuesta. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bgDark pb-24 pt-8">
      
      {/* Background Ambience Lights */}
      <div className="absolute top-1/6 left-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute top-2/4 right-1/4 w-[600px] h-[600px] bg-cyan/15 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 font-body">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/35 text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Programa Oficial de Proveedores & Socios Locales</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
            Vende y Promociona tus Excursiones con <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-cyan">
              Fire Tour DR
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            ¿Eres operador turístico, capitán de barco, rancho de buggies o guía oficial en República Dominicana? Conecta con miles de turistas internacionales y recibe reservas seguras pagadas por adelantado con Stripe.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto">
            <div className="bg-surface/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white font-display">Turistas Globales</p>
                <p className="text-[10px] text-gray-400">En más de 10 idiomas</p>
              </div>
            </div>

            <div className="bg-surface/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white font-display">Pagos en Stripe</p>
                <p className="text-[10px] text-gray-400">100% seguros y sin fraude</p>
              </div>
            </div>

            <div className="bg-surface/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white font-display">Aviso por WhatsApp</p>
                <p className="text-[10px] text-gray-400">Coordinación instantánea</p>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFICIOS DESTACADOS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-16">
          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-1">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black font-display text-white">Máxima Exposición</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Posicionamos tu excursión en nuestra web con fotografías de alta resolución, descripciones atractivas y reservas activas 24/7.
            </p>
          </div>

          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black font-display text-white">Cero Impagos</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Todos los clientes pagan la totalidad o el depósito por Stripe antes del tour. Olvídate de cancelaciones de última hora sin cobrar.
            </p>
          </div>

          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan/20 text-cyan flex items-center justify-center mb-1">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black font-display text-white">Tú Controlas Cupos</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Defines tus días de operación, horarios de salida y capacidad máxima de pasajeros para garantizar un servicio de calidad superior.
            </p>
          </div>

          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black font-display text-white">Check-in con QR</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cada cliente recibe un boleto digital oficial con código QR y PNR en PDF generado por Fire Tour DR para fácil verificación.
            </p>
          </div>
        </div>

        {/* SUCCESS VIEW OR FORM */}
        {successData ? (
          <div className="max-w-2xl mx-auto bg-surface/70 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] p-8 sm:p-12 text-center shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 mb-3 inline-block">
              Propuesta Recibida
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-display text-white mb-4">
              ¡Bienvenido a la Familia de Proveedores Fire Tour DR!
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Hemos registrado la propuesta de tu excursión <strong className="text-white">"{formData.tourTitle}"</strong> con el localizador <span className="font-mono text-cyan font-bold">{successData.applicationId}</span>.
            </p>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 mb-8 text-left text-xs text-gray-300 flex flex-col gap-2">
              <p className="text-white font-bold uppercase tracking-wider text-[10px] text-gray-400">Próximos Pasos:</p>
              <p>1. Nuestro equipo de calidad revisará las tarifas, itinerario y condiciones de seguridad.</p>
              <p>2. Te contactaremos por WhatsApp o correo en menos de 24 horas laborables.</p>
              <p>3. Una vez aprobada, tu excursión estará publicada y disponible para reserva internacional.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/15872257342?text=${encodeURIComponent(`Hola Fire Tour DR, acabo de enviar mi propuesta de excursión "${formData.tourTitle}" (ID: ${successData.applicationId}). Quiero coordinar la activación.`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-black font-black uppercase text-xs tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-black" /> Coordinar por WhatsApp Ahora
              </a>

              <button
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    companyName: '',
                    contactName: '',
                    phone: '',
                    email: '',
                    location: 'Punta Cana / Bávaro',
                    tourTitle: '',
                    category: 'Aventura 4x4 / Buggy',
                    duration: 'Medio Día (4 horas)',
                    priceAdult: '',
                    priceChild: '',
                    capacity: 'Hasta 20 personas',
                    included: '',
                    description: ''
                  });
                  setPhotos([]);
                }}
                className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition"
              >
                Enviar Otra Excursión
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-surface/60 backdrop-blur-2xl border border-white/15 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
            
            <div className="border-b border-white/10 pb-6 mb-8 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/15 px-3 py-1 rounded-full border border-secondary/30 mb-2 inline-block">
                Formulario de Afiliación Directa
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                Publica tu Excursión en Fire Tour DR
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Completa los datos de tu empresa y el servicio que deseas promocionar. La publicación es totalmente gratuita.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-xs text-red-300 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              
              {/* SECCIÓN 1: DATOS DEL OPERADOR */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan font-display mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> 1. Datos del Proveedor u Operador
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Nombre de la Empresa o Guía *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="Ej: Punta Cana Catamaran VIP"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Persona de Contacto *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      placeholder="Ej: Carlos Ramírez"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      WhatsApp / Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+1 (809) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="operaciones@tuempresa.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Zona Principal de Operación *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-cyan font-medium"
                    >
                      <option value="Punta Cana / Bávaro">Punta Cana / Bávaro</option>
                      <option value="Bayahibe / La Romana">Bayahibe / La Romana (Isla Saona / Catalina)</option>
                      <option value="Cap Cana">Cap Cana / Juanillo</option>
                      <option value="Samaná / Las Terrenas">Samaná / Las Terrenas (Ballenas / Cayo Levantado)</option>
                      <option value="Puerto Plata / Cabarete">Puerto Plata / Cabarete / Sosúa</option>
                      <option value="Santo Domingo">Santo Domingo (Zona Colonial)</option>
                      <option value="Otra Zona">Otra Zona en República Dominicana</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: DATOS DE LA EXCURSIÓN */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-secondary font-display mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4" /> 2. Detalles de la Excursión a Promover
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Título de la Excursión *
                    </label>
                    <input
                      type="text"
                      name="tourTitle"
                      required
                      placeholder="Ej: Tour Privado en Yate a Piscina Natural con Barra Libre & Ceviche"
                      value={formData.tourTitle}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Categoría del Tour *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-secondary font-medium"
                    >
                      <option value="Acuática / Marítima">Acuática / Marítima (Catamarán, Lanchas, Yate)</option>
                      <option value="Aventura 4x4 / Buggy">Aventura 4x4 / Buggies / ATVs</option>
                      <option value="Snorkel & Buceo">Snorkel, Arrecifes & Buceo</option>
                      <option value="Deportes Extremos">Parasailing / Tirolesas / Zipline</option>
                      <option value="Cultural & Histórico">Safari Cultural & Ciudad Colonial</option>
                      <option value="Cabalgata">Paseo a Caballo / Playa Salvaje</option>
                      <option value="Traslado Privado">Traslado Privado Aeropuerto PUJ</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Duración Estimada *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-secondary font-medium"
                    >
                      <option value="1 a 2 Horas">1 a 2 Horas</option>
                      <option value="Medio Día (4 horas)">Medio Día (4 horas)</option>
                      <option value="Día Completo (8 a 9 horas)">Día Completo (8 a 9 horas)</option>
                      <option value="Horario Flexible / Privado">Horario Flexible / Privado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Precio Adulto ($ USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-secondary font-bold text-xs">$</span>
                      <input
                        type="number"
                        name="priceAdult"
                        required
                        min="1"
                        placeholder="75"
                        value={formData.priceAdult}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-white/15 rounded-xl py-3 pl-8 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Precio Niño ($ USD Opcional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-cyan font-bold text-xs">$</span>
                      <input
                        type="number"
                        name="priceChild"
                        min="0"
                        placeholder="45 (o vacío si no aplica)"
                        value={formData.priceChild}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-white/15 rounded-xl py-3 pl-8 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Capacidad Máxima por Salida
                    </label>
                    <input
                      type="text"
                      name="capacity"
                      placeholder="Ej: Máximo 25 pasajeros / O excursión privada exclusiva"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      ¿Qué Incluye el Servicio? (Separados por coma)
                    </label>
                    <input
                      type="text"
                      name="included"
                      placeholder="Ej: Recogida en hotel, Bebidas y snacks, Equipo de snorkel, Guía bilingüe, Fotos"
                      value={formData.included}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 block">
                      Descripción Detallada del Itinerario *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      placeholder="Explica detalladamente qué experimentarán los turistas: paradas, puntos destacados, qué deben llevar (bloqueador, toalla), por qué tu tour es especial..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary font-medium resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: FOTOGRAFÍAS DE LA EXCURSIÓN */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-display flex items-center gap-2">
                    <Camera className="w-4 h-4" /> 3. Fotografías de la Excursión (Hasta 8 fotos)
                  </h3>
                  <span className="text-[10px] text-gray-400 font-bold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    {photos.length} de 8 fotos
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Sube fotos reales de tu barco, vehículos, actividades o paradas paradisíacas. La primera foto será la imagen de portada de la excursión.
                </p>

                {uploadError && (
                  <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300">
                    {uploadError}
                  </div>
                )}

                {/* Dropzone / Upload Trigger */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative group aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-lg"
                    >
                      <img 
                        src={photo} 
                        alt={`Foto excursión ${index + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                          ⭐ Portada
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-700 cursor-pointer"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {photos.length < 8 && (
                    <label 
                      className={`relative aspect-video sm:aspect-square rounded-2xl border-2 border-dashed ${
                        isUploading ? 'border-amber-400 bg-amber-500/10' : 'border-white/20 hover:border-amber-400/60 bg-black/30 hover:bg-white/5'
                      } flex flex-col items-center justify-center p-3 text-center transition cursor-pointer group`}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        disabled={isUploading}
                        onChange={e => handleFileUpload(e.target.files)} 
                        className="hidden" 
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Subiendo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            Subir Fotos
                          </span>
                          <span className="text-[9px] text-gray-500">
                            JPG, PNG, WEBP
                          </span>
                        </div>
                      )}
                    </label>
                  )}
                </div>

                {/* Direct URL toggle */}
                <div className="mt-2">
                  {!showUrlInput ? (
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className="text-[11px] text-cyan hover:text-cyan/80 font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> O agregar enlace directo de imagen (URL)
                    </button>
                  ) : (
                    <div className="flex gap-2 items-center bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/foto-barco.jpg"
                        value={customPhotoUrl}
                        onChange={e => setCustomPhotoUrl(e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none px-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomUrl}
                        className="bg-cyan hover:bg-cyan/80 text-black font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Añadir
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(false)}
                        className="text-gray-400 hover:text-white text-xs px-2 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* TÉRMINOS & SUBMIT */}
              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-gray-400 max-w-md">
                  Al enviar tu propuesta, aceptas ser contactado por el equipo de operaciones de Fire Tour DR para verificar licencias, seguros y coordinar comisiones y calendario.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black font-display text-xs uppercase tracking-wider py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-900/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enviando Propuesta...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enviar Propuesta de Excursión <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
