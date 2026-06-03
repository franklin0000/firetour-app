import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Users, ShieldCheck, Mail, Phone, User, Loader, ArrowLeft, Lock, MapPin } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inicializar Stripe con la clave pública de Producción (Live)
const stripePromise = loadStripe('pk_live_51Te0ecBFxtpxngws3onLiw40h7f4S3qqSOwpsxVsGFUoVGiOXDKLkQJuZQ15Xya8m70TNS1AVic0ubfNjZz1yEag00VLTzGSMP');

function CheckoutForm({ checkoutData, clientSecret }: { checkoutData: any, clientSecret: string }) {
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

    if (!stripe || !elements) return;

    if (!customerName || !email || !phone || !hotelName || !roomNumber) {
      setErrorMessage("Por favor, completa todos los campos, incluyendo tu Hotel de estancia y Número de habitación para coordinar tu traslado.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Guardar los datos del formulario localmente para recuperarlos en la SuccessPage
      // en caso de que el método de pago (ej. Criptomonedas) redirija al usuario
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
        balanceDue: checkoutData.balanceDue,
        hotelName,
        roomNumber
      };
      localStorage.setItem('pendingCheckout', JSON.stringify(pendingCheckout));

      if (clientSecret.includes('mock')) {
        // Modo simulador local
        console.warn("[Simulador Stripe] Ejecutando redirección mock...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate(`/success?payment_intent=${clientSecret}`);
        return;
      }

      // Procesamiento de Pago con Elements
      const { error } = await stripe.confirmPayment({
        elements,
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

                {/* Stripe PaymentElement IFrame */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#08131d] p-4 rounded-xl border border-outline focus-within:border-cyan hover:border-white/20 transition duration-300 shadow-inner">
                    <PaymentElement id="payment-element" options={paymentElementOptions as any} />
                  </div>
                  
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
                disabled={loading || !stripe}
                className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-white font-black tracking-wide font-display py-4 rounded-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Procesando Transacción con Banco...
                  </>
                ) : (
                  <>
                    Pagar Reserva Segura (${checkoutData.totalPrice} USD)
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

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2.5 pt-3">
              {checkoutData.isCustom ? (
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Precio Total</span>
                  <span>${checkoutData.totalPrice} USD</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Precio Total Excursión</span>
                  <span>${checkoutData.totalPrice} USD</span>
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
                  <span className="text-white text-sm font-black">${checkoutData.balanceDue} USD</span>
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
  
  const checkoutData = (location.state as any)?.checkoutData || (location.state as any);

  useEffect(() => {
    if (!checkoutData) {
      navigate('/');
      return;
    }

    // Solicitar el PaymentIntent inmediatamente
    fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: checkoutData.depositToPay * 100, // centavos
        tourId: checkoutData.tourId,
        email: 'pending@checkout.com'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch(console.error);
  }, [checkoutData, navigate]);

  if (!checkoutData || !clientSecret) {
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center">
        <Loader className="w-10 h-10 text-cyan animate-spin" />
      </div>
    );
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#0ea5e9',
      colorBackground: '#08131d',
      colorText: '#ffffff',
    },
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm checkoutData={checkoutData} clientSecret={clientSecret} />
    </Elements>
  );
}
