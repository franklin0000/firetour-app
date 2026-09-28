import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Users, ShieldCheck, Mail, Phone, User, Loader, ArrowLeft, Lock, MapPin, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { trackInitiateCheckout } from '../utils/analytics';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inicializar Stripe con la clave pública de Producción (Live)
const stripePromise = loadStripe('pk_live_51Te0ecBFxtpxngws3onLiw40h7f4S3qqSOwpsxVsGFUoVGiOXDKLkQJuZQ15Xya8m70TNS1AVic0ubfNjZz1yEag00VLTzGSMP');

function CheckoutForm({ checkoutData, clientSecret, isMock }: { checkoutData: any, clientSecret: string, isMock?: boolean }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthGate, setShowAuthGate] = useState(true);

  // Coupon & Group Discount Engine
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return checkoutData.isGroupDiscountActive ? 'GRUPO6_GRATIS' : null;
  });
  const [couponDiscount, setCouponDiscount] = useState<number>(() => {
    return Number(checkoutData.freeGuestDiscount) || 0;
  });
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(() => {
    if (checkoutData.isGroupDiscountActive) {
      return { type: 'success', message: `¡Beneficio Grupal: 6to pasajero 100% GRATIS (-$${checkoutData.freeGuestDiscount} USD)!` };
    }
    return null;
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'VIP5') {
      const discount = Math.round(Number(checkoutData.totalPrice || 100) * 0.05);
      setAppliedCoupon('VIP5');
      setCouponDiscount(discount);
      setCouponFeedback({ type: 'success', message: `¡Cupón VIP5 aplicado! Ahorras -$${discount} USD (5% OFF).` });
    } else if (clean === 'PUNTACANA10') {
      const discount = Math.round(Number(checkoutData.totalPrice || 100) * 0.10);
      setAppliedCoupon('PUNTACANA10');
      setCouponDiscount(discount);
      setCouponFeedback({ type: 'success', message: `¡Cupón PUNTACANA10 aplicado! Ahorras -$${discount} USD (10% OFF).` });
    } else if (clean === 'GRUPOFREE') {
      const guests = Number(checkoutData.adults || 0) + Number(checkoutData.children || 0);
      if (guests < 4) {
        setCouponFeedback({ type: 'error', message: 'El cupón GRUPOFREE requiere un mínimo de 4 personas en la reserva.' });
        return;
      }
      const discount = Number(checkoutData.tourPrice || 79);
      setAppliedCoupon('GRUPOFREE');
      setCouponDiscount(discount);
      setCouponFeedback({ type: 'success', message: `¡Cupón GRUPOFREE aplicado! 1 Pasajero 100% gratis (-$${discount} USD).` });
    } else {
      setCouponFeedback({ type: 'error', message: 'Código de cupón inválido o no reconocido.' });
    }
  };

  const extraDiscount = appliedCoupon && appliedCoupon !== 'GRUPO6_GRATIS' ? couponDiscount : 0;
  const currentTotal = Math.max(0, Number(checkoutData.totalPrice) - extraDiscount);
  const currentBalanceDue = Math.max(0, Number(checkoutData.balanceDue) - extraDiscount);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCustomerName(user.name || '');
        setEmail(user.email || '');
        setShowAuthGate(false);
      } catch (e) {}
    }
  }, []);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMock && (!stripe || !elements)) return;

    if (!customerName || !email || !phone || !hotelName || !roomNumber) {
      setErrorMessage("Por favor, completa todos los campos, incluyendo tu Hotel de estancia y Número de habitación para coordinar tu traslado.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const pendingCheckout = {
        tourId: checkoutData.tourId,
        tourName: checkoutData.tourName,
        tourImage: checkoutData.tourImage,
        customerName,
        email,
        phone,
        date: checkoutData.date,
        guests: checkoutData.adults + checkoutData.children,
        amountPaid: checkoutData.depositToPay,
        balanceDue: currentBalanceDue,
        couponApplied: appliedCoupon,
        couponDiscount: couponDiscount,
        hotelName,
        roomNumber
      };
      localStorage.setItem('pendingCheckout', JSON.stringify(pendingCheckout));

      if (isMock || clientSecret.includes('mock') || !stripe) {
        console.warn("[Simulador Stripe] Ejecutando redirección mock...");
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate(`/success?payment_intent=mock_pi_${Date.now()}`);
        return;
      }

      // Procesamiento de Pago con Elements
      const { error } = await stripe.confirmPayment({
        elements: elements!,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              name: customerName,
              email: email,
              phone: phone,
            }
          }
        }
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          throw new Error(error.message);
        } else {
          throw new Error("Ocurrió un error inesperado al procesar tu pago.");
        }
      }

    } catch (err: any) {
      console.error("Payment flow error: ", err);
      setLoading(false);
      setErrorMessage(err.message || "Error al procesar el pago. Verifica tu tarjeta o conexión.");
    }
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
    style: {
      theme: 'night',
      variables: {
        colorPrimary: '#0ea5e9',
        colorBackground: '#08131d',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }
    }
  };

  if (showAuthGate) {
    return (
      <div className="bg-bgDark text-white min-h-screen py-20 px-4 md:px-8 relative font-sans flex items-center justify-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-orange-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight uppercase mb-4">Asegura tu Reserva</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto text-sm md:text-base">
            Crea una cuenta para guardar tus tickets digitales y acceder rápidamente a tu información, o continúa sin registrarte.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/auth?returnUrl=/checkout')}
              className="bg-cyan hover:bg-cyan-400 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> Iniciar Sesión / Crear Cuenta
            </button>
            <button 
              onClick={() => setShowAuthGate(false)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest py-4 px-8 rounded-xl text-xs transition-all flex items-center justify-center"
            >
              Continuar como Invitado
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgDark text-white min-h-screen py-10 px-4 md:px-8 relative font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto mb-6">
        <button 
          onClick={() => {
            if (checkoutData.isCustom) {
              navigate('/travelpayouts');
            } else {
              navigate(`/excursion/${checkoutData.tourId}`);
            }
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm font-bold transition font-display"
        >
          <ArrowLeft className="w-4 h-4" /> Modificar Itinerario
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 relative z-10">
        
        {/* Left Column: Form Info (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          <div className="bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-premium relative overflow-hidden">
            {/* Top glowing edge */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
            
            <h2 className="text-2xl font-black font-display border-b border-white/10 pb-5 mb-8 flex items-center gap-3 text-white">
              <User className="w-6 h-6 text-secondary drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" /> Datos del Pasajero Principal
            </h2>

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-5">
              
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display">Nombre Completo en Pasaporte</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display">Correo de Reserva</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="email"
                      required
                      placeholder="ticket@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#08131d] border border-outline focus:border-secondary rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none transition font-semibold"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display">WhatsApp / Móvil</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="tel"
                      required
                      placeholder="+1 (809) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#08131d] border border-outline focus:border-secondary rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none transition font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Hotel & Room Number grid for Pickup Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline/35 pt-4">
                
                {/* Hotel Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan" /> Hotel / Resort de Estancia (Recogida)
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Meliá Punta Cana Beach Resort"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full bg-[#08131d] border border-outline focus:border-secondary rounded-xl py-3 px-4 text-sm focus:outline-none transition font-semibold"
                  />
                </div>

                {/* Room Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display flex items-center gap-1">
                    <span className="text-[11px]">🔑</span> Número de Habitación / Villa
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Habitación 2404"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-[#08131d] border border-outline focus:border-secondary rounded-xl py-3 px-4 text-sm focus:outline-none transition font-semibold"
                  />
                </div>

              </div>

              {/* Secure Payment section */}
              <div className="mt-8">
                <div className="flex justify-between items-end border-b border-outline/50 pb-3 mb-4">
                  <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan" /> Pasarela Encriptada
                  </h2>
                  <div className="flex gap-1.5 items-center bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border border-green-500/20">
                    <Lock className="w-3 h-3" /> PCI-DSS 256bit
                  </div>
                </div>

                {/* Payment Input Area */}
                <div className="flex flex-col gap-4">
                  {isMock ? (
                    <div className="bg-[#08131d] p-5 rounded-2xl border border-secondary/40 flex flex-col gap-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-secondary text-xs font-black uppercase tracking-widest font-display">
                          <span>💳</span> Tarjeta de Pago Simulada
                        </div>
                        <span className="bg-secondary/20 text-secondary border border-secondary/30 text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase">
                          Modo Demo
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Modo de prueba activo. Puedes completar tu reserva y emitir tu ticket digital sin realizar cargos reales a tu tarjeta.
                      </p>
                      <input 
                        type="text" 
                        disabled 
                        value="•••• •••• •••• 4242 (Tarjeta Segura Verificada)" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white font-mono opacity-80"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#08131d] p-4 rounded-xl border border-outline focus-within:border-cyan hover:border-white/20 transition duration-300 shadow-inner">
                      <PaymentElement id="payment-element" options={paymentElementOptions as any} />
                    </div>
                  )}
                  
                  {/* Error Messaging */}
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl font-bold shadow-sm animate-pulse">
                      ⚠️ {errorMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                disabled={loading || (!isMock && !stripe)}
                className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black tracking-wide font-display py-4 rounded-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Procesando Transacción con Banco...
                  </>
                ) : (
                  <>
                    Pagar Depósito de Reserva (${checkoutData.depositToPay} USD)
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Right Column: Checkout Summary (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-surface/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 shadow-glow flex flex-col gap-6 relative overflow-hidden sticky top-32 transform transition-transform hover:-translate-y-1 duration-500">
            {/* Top glowing edge */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-70" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan/10 rounded-full blur-[80px] pointer-events-none" />
            
            <h3 className="text-xl font-black font-display text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <span className="text-cyan">🎫</span> Ticket de Compra
            </h3>
            
            {/* Tour info */}
            <div className="flex items-center gap-5 py-4 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-inner relative group">
                <img src={checkoutData.tourImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div>
                <h4 className="font-black text-base text-white leading-tight font-display">{checkoutData.tourName}</h4>
                <p className="text-xs text-secondary mt-1.5 font-bold tracking-widest uppercase">Tasa Oficial: ${checkoutData.tourPrice} USD</p>
              </div>
            </div>

            {/* Itinerary Summary */}
            <div className="flex flex-col gap-3.5 py-3 border-b border-outline/30 text-xs font-semibold">
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan" /> 
                  {checkoutData.dateLabel || 'Fecha Operativa'}
                </span>
                <span className="text-white bg-[#08131d] px-2 py-1 rounded-md border border-outline/50">{checkoutData.date}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" /> 
                  {checkoutData.guestsLabel || 'Lista de Pasajeros'}
                </span>
                <span className="text-white text-right font-bold">
                  {checkoutData.isCustom && checkoutData.tourId === -3 ? (
                    `${checkoutData.adults} Conductor (${checkoutData.carAge} años)`
                  ) : checkoutData.isCustom && checkoutData.tourId === -2 ? (
                    `${checkoutData.adults} ${checkoutData.adults === 1 ? 'Huésped' : 'Huéspedes'}`
                  ) : (
                    <>
                      {checkoutData.adults} {checkoutData.adults === 1 ? 'Adulto' : 'Adultos'}
                      {checkoutData.children > 0 && <br/>}
                      {checkoutData.children > 0 && `+ ${checkoutData.children} ${checkoutData.children === 1 ? 'Niño' : 'Niños'}`}
                    </>
                  )}
                </span>
              </div>
            </div>

                        {/* Promo Code / Coupon Section */}
            <div className="py-3 border-b border-outline/30 flex flex-col gap-2.5">
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-display flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan">
                  <Tag className="w-3.5 h-3.5" /> ¿Tienes un Cupón de Descuento?
                </span>
                {appliedCoupon && (
                  <span className="text-emerald-400 text-[9px] font-bold">Activo</span>
                )}
              </label>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. VIP5, PUNTACANA10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#08131d] border border-outline focus:border-cyan rounded-xl py-2 px-3 text-xs uppercase font-mono tracking-wider focus:outline-none text-white"
                />
                <button
                  type="submit"
                  className="bg-cyan/20 hover:bg-cyan/30 border border-cyan/40 text-cyan text-xs font-bold font-display uppercase tracking-wider px-3.5 py-2 rounded-xl transition"
                >
                  Aplicar
                </button>
              </form>

              {couponFeedback && (
                <div className={`text-[11px] p-2 rounded-lg font-bold flex items-center gap-1.5 ${
                  couponFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {couponFeedback.type === 'success' ? <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> : '⚠️'}
                  <span>{couponFeedback.message}</span>
                </div>
              )}

              {/* Quick Coupon Chips */}
              {!appliedCoupon && (
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                  <span>Sugerencias:</span>
                  <button type="button" onClick={() => { setCouponCode('VIP5'); }} className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">VIP5 (-5%)</button>
                  <button type="button" onClick={() => { setCouponCode('PUNTACANA10'); }} className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">PUNTACANA10 (-10%)</button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2.5 pt-3">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Precio Regular</span>
                <span>${checkoutData.subtotalPrice || checkoutData.totalPrice} USD</span>
              </div>

              {checkoutData.isGroupDiscountActive && (
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> 6to Pasajero Gratis</span>
                  <span>-${checkoutData.freeGuestDiscount} USD</span>
                </div>
              )}

              {appliedCoupon && appliedCoupon !== 'GRUPO6_GRATIS' && (
                <div className="flex justify-between items-center text-[11px] font-bold text-cyan uppercase tracking-widest bg-cyan/10 px-2.5 py-1 rounded-md">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Cupón {appliedCoupon}</span>
                  <span>-${couponDiscount} USD</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Cargos e Impuestos</span>
                <span className="text-cyan bg-cyan/10 px-2 py-0.5 rounded text-[10px]">INCLUIDOS</span>
              </div>
              
              <div className="bg-black/60 border border-secondary/30 rounded-2xl p-5 mt-4 flex flex-col justify-between shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-white text-sm font-bold font-display uppercase tracking-widest text-secondary">Total a Debitar Hoy (Depósito)</span>
                  <span className="text-white text-3xl font-black drop-shadow-md">${checkoutData.depositToPay} <span className="text-sm font-bold text-gray-400">USD</span></span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 relative z-10">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">A pagar en efectivo el día del tour:</span>
                  <span className="text-white text-sm font-black">${currentBalanceDue} USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Trust Badges */}
          <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4 items-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="absolute inset-0 bg-cyan blur-2xl opacity-30 rounded-full animate-pulse" />
              <ShieldCheck className="w-12 h-12 text-cyan relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-white text-sm font-display tracking-widest uppercase">Protegido por Stripe™</h4>
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Sistema encriptado punto a punto de grado militar. Auditado y protegido bajo la normativa <b className="text-white">PCI-DSS Nivel 1</b>.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Wrapper component to inject Stripe Context globally into the form
export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [isMockMode, setIsMockMode] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  
  // Persistir o recuperar checkoutData de sesión
  const [checkoutData, setCheckoutData] = useState<any>(() => {
    const fromState = (location.state as any)?.checkoutData || (location.state as any);
    if (fromState && fromState.tourId) {
      try {
        sessionStorage.setItem('ftdr_checkout_session', JSON.stringify(fromState));
      } catch (e) {}
      return fromState;
    }
    try {
      const saved = sessionStorage.getItem('ftdr_checkout_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    if (!checkoutData) return;
    trackInitiateCheckout({
      tourName: checkoutData.tourName || 'Excursion',
      tourId: checkoutData.tourId || 1,
      totalPrice: Number(checkoutData.totalPrice) || 0,
      guests: (Number(checkoutData.adults) || 1) + (Number(checkoutData.children) || 0)
    });
    setLoadingIntent(true);
    setFetchError('');

    fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(Number(checkoutData.depositToPay) * 100), // centavos
        tourId: checkoutData.tourId,
        tourName: checkoutData.tourName,
        tourImage: checkoutData.tourImage,
        email: 'pending@checkout.com'
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Error del servidor (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (data.clientSecret && data.clientSecret.includes('_secret_')) {
          setClientSecret(data.clientSecret);
          setIsMockMode(false);
        } else if (data.isMock || (data.clientSecret && data.clientSecret.includes('mock'))) {
          setClientSecret(data.clientSecret || 'mock_secret');
          setIsMockMode(true);
        } else {
          throw new Error("No se pudo obtener una clave de sesión válida.");
        }
      })
      .catch((err: any) => {
        console.error("[Checkout Intent Error]:", err);
        setFetchError(err.message || "Error al conectar con la pasarela de pago.");
      })
      .finally(() => {
        setLoadingIntent(false);
      });
  }, [checkoutData]);

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface border border-white/10 p-8 rounded-3xl shadow-premium">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white mb-2">No hay excursión seleccionada</h2>
          <p className="text-gray-400 text-sm mb-6">
            Para iniciar tu proceso de reserva y pago seguro, primero selecciona tu excursión en el catálogo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-glow"
          >
            Ver Catálogo de Excursiones
          </button>
        </div>
      </div>
    );
  }

  if (fetchError && !clientSecret) {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface border border-red-500/30 p-8 rounded-3xl shadow-premium">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white mb-2">Error en la Sesión de Pago</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {fetchError}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setFetchError('');
                setCheckoutData({ ...checkoutData }); // reintentar
              }}
              className="w-full bg-cyan hover:bg-cyan-400 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-glow"
            >
              Reintentar Sesión de Pago
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 px-6 rounded-xl transition"
            >
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingIntent || !clientSecret) {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 text-cyan animate-spin" />
        <p className="text-gray-400 text-xs font-bold font-display uppercase tracking-widest animate-pulse">
          Iniciando Sesión Encriptada con Stripe...
        </p>
      </div>
    );
  }

  if (isMockMode) {
    return <CheckoutForm checkoutData={checkoutData} clientSecret={clientSecret} isMock={true} />;
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#0ea5e9',
      colorBackground: '#08131d',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm checkoutData={checkoutData} clientSecret={clientSecret} isMock={false} />
    </Elements>
  );
}
