import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, ArrowLeft, Loader, Printer, CreditCard, Mail, Phone, CheckCircle2, ShieldCheck, HelpCircle, MapPin, Info } from 'lucide-react';
import type { Reservation } from '../types';

export default function DigitalTicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [reservation, setReservation] = useState<Reservation | null>(
    (location.state as { reservation: Reservation })?.reservation || null
  );
  const [loading, setLoading] = useState(!reservation);

  useEffect(() => {
    if (!reservation) {
      const fetchTicketDetails = async () => {
        try {
          const response = await fetch(`/api/reservations`);
          const list: Reservation[] = await response.json();
          const match = list.find(r => r.id === parseInt(id || ''));
          if (match) {
            setReservation(match);
          }
        } catch (err) {
          console.error("Error loading ticket: ", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTicketDetails();
    }
  }, [id, reservation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex justify-center items-center text-secondary">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold font-display">Boleto no encontrado</h2>
        <button 
          onClick={() => navigate('/')} 
          className="bg-secondary text-white px-6 py-2.5 rounded-xl font-bold font-display hover:bg-orange-600 transition"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Generates a real interactive QR code dynamically using public QR server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${reservation.ticketCode}&color=0A192F&bgcolor=FFFFFF`;

  // Dynamic label helpers based on custom negative IDs
  const isCustom = reservation.tourId < 0;
  const isFlight = reservation.tourId === -1;
  const isHotel = reservation.tourId === -2;
  const isCar = reservation.tourId === -3;

  const getServiceTypeLabel = () => {
    if (isFlight) return 'Vuelo Reservado';
    if (isHotel) return 'Hospedaje Reservado';
    if (isCar) return 'Alquiler de Auto';
    return 'Excursión Seleccionada';
  };

  const getDateLabel = () => {
    if (isFlight) return 'Fecha de Salida';
    if (isHotel) return 'Fecha de Check-In';
    if (isCar) return 'Fecha de Recogida';
    return 'Fecha del Tour';
  };

  const getGuestsLabel = () => {
    if (isHotel) return 'Lista de Huéspedes';
    if (isCar) return 'Conductores Registrados';
    return 'Lista de Pasajeros';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Dynamic printer stylesheet injected locally */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .print-hide {
            display: none !important;
          }
          .print-ticket-container {
            border: 2px solid #111827 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0px !important;
            display: flex !important;
            flex-direction: row !important;
          }
          .print-text-black {
            color: #000000 !important;
          }
          .print-text-gray {
            color: #4b5563 !important;
          }
          .print-bg-light {
            background-color: #f3f4f6 !important;
          }
          .print-border-solid {
            border-style: solid !important;
            border-color: #111827 !important;
          }
          .print-barcode {
            background: repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px) !important;
          }
          .print-qr {
            border: 1px solid #111827 !important;
          }
        }
      `}} />

      {/* Decorative Blur Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan/15 rounded-full blur-[100px] pointer-events-none animate-pulse print-hide" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none print-hide" />

      {/* Top Banner Success Alert */}
      <div className="max-w-4xl w-full mb-8 text-center animate-fadeIn print-hide relative z-20">
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-bold px-8 py-5 rounded-[2rem] text-sm inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="tracking-wide">¡Reserva Procesada con Éxito por la Pasarela Encriptada de Stripe!</span>
        </div>
      </div>

      {/* 🎫 BOARDING PASS & RECEIPT CONTAINER */}
      <div className="print-ticket-container max-w-4xl w-full bg-surface/50 backdrop-blur-3xl border border-white/20 rounded-[3rem] overflow-hidden shadow-premium flex flex-col md:flex-row relative animate-scaleIn hover:shadow-glow transition-all duration-700 group z-20">
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none print-hide" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none print-hide" />

        {/* Top visual accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan via-secondary to-orange-400 opacity-80 print-hide" />

        {/* =========================================================
            LADO IZQUIERDO: DETALLES DEL CLIENTE Y RECIBO FORMAL
            ========================================================= */}
        <div className="flex-[2] p-8 md:p-12 border-b md:border-b-0 md:border-r border-dashed border-white/20 relative z-10">
          
          {/* Circular Cutouts for visual split design (placed on the divider border) */}
          <div className="hidden md:block absolute -top-6 -right-6 w-12 h-12 bg-bgDark border-b border-l border-white/20 rounded-full z-10 shadow-inner print-hide" />
          <div className="hidden md:block absolute -bottom-6 -right-6 w-12 h-12 bg-bgDark border-t border-l border-white/20 rounded-full z-10 shadow-inner print-hide" />

          {/* Receipt Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">🔥</span>
              <div>
                <span className="font-black text-xl font-display tracking-tight text-white print-text-black drop-shadow-md">FIRE TOUR</span>
                <span className="text-xs bg-secondary text-white font-extrabold px-2 py-0.5 rounded-md ml-1 shadow-glow">DR</span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-4 py-2 rounded-full text-[10px] uppercase tracking-widest inline-flex items-center gap-2 print-text-black print-bg-light shadow-inner">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping print-hide" /> Confirmado y Pagado
              </span>
            </div>
          </div>

          {/* Barcode strip decoration */}
          <div className="h-10 bg-gradient-to-r from-white via-gray-300 to-white/20 rounded-xl opacity-20 mb-10 print-barcode flex items-center justify-center font-mono text-[10px] tracking-[0.5em] text-black select-none print-text-black font-black shadow-inner">
            {reservation.ticketCode}
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col gap-8">
            
            {/* Section 1: Customer Contact details */}
            <div className="bg-black/30 border border-white/10 rounded-[1.5rem] p-6 print-bg-light print-border-solid flex flex-col gap-5 shadow-inner">
              <h4 className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-white/10 pb-3 print-text-black">
                Información del Cliente
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-semibold">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Pasajero Principal</span>
                  <span className="font-black text-white block print-text-black tracking-wide">{reservation.customerName}</span>
                </div>
                
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Correo Electrónico</span>
                  <span className="font-black text-white block flex items-center gap-2 print-text-black break-all">
                    <Mail className="w-4 h-4 text-cyan flex-shrink-0 print-hide" />
                    {reservation.email}
                  </span>
                </div>

                <div className="sm:col-span-2 mt-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Teléfono / WhatsApp</span>
                  <span className="font-black text-white block flex items-center gap-2 print-text-black">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 print-hide" />
                    {reservation.phone || 'No Provisto'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Booking details */}
            <div className="bg-black/30 border border-white/10 rounded-[1.5rem] p-6 print-bg-light print-border-solid flex flex-col gap-5 shadow-inner">
              <h4 className="text-[11px] text-cyan font-black uppercase tracking-[0.2em] border-b border-white/10 pb-3 print-text-black flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan" /> Detalles de Reserva
              </h4>
              
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">{getServiceTypeLabel()}</span>
                <h3 className="font-black text-xl text-white font-display leading-tight print-text-black">
                  {reservation.tourName}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-semibold pt-2 border-t border-white/5">
                
                {/* Date */}
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex justify-center items-center">
                    <Calendar className="w-5 h-5 text-secondary print-hide drop-shadow-md" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">{getDateLabel()}</span>
                    <span className="font-black text-white mt-0.5 block print-text-black">{reservation.date}</span>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 flex justify-center items-center">
                    <Users className="w-5 h-5 text-cyan print-hide drop-shadow-md" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">{getGuestsLabel()}</span>
                    <span className="font-black text-white mt-0.5 block print-text-black">
                      {reservation.guests} {reservation.guests === 1 ? 'Persona' : 'Personas'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2.5: Pickup & Hotel Logistics (Only if present in reservation) */}
            {reservation.hotelName && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-[1.5rem] p-6 print-bg-light print-border-solid flex flex-col gap-5 shadow-glow">
                <h4 className="text-[11px] text-secondary font-black uppercase tracking-[0.2em] border-b border-secondary/20 pb-3 print-text-black flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary print-hide" /> Logística de Recogida VIP
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-semibold">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Hotel / Resort</span>
                    <span className="font-black text-white block print-text-black">{reservation.hotelName}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Habitación / Villa</span>
                    <span className="font-black text-white block print-text-black">
                      {reservation.roomNumber || 'No Provisto'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 text-xs text-gray-300 leading-relaxed font-semibold border-t border-secondary/20 pt-3 flex items-start gap-2 print-text-black">
                    <Info className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>El autobús de traslado de Fire Tour DR le recogerá en el lobby principal de este hotel. Por favor, esté listo 15 minutos antes de la hora indicada.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Financial Details & Stripe Confirmation */}
            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-6">
              <div className="flex items-center gap-4 self-center">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white shadow-inner print-hide">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] block mb-1">Método de Pago</span>
                  <span className="text-sm font-black text-white block print-text-black">
                    {reservation.paymentMethod || 'Stripe Secure Credit Card'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-12 print-bg-light print-border-solid shadow-glow">
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Depósito Pagado Hoy</span>
                  <span className="text-secondary text-2xl font-black font-display print-text-black drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                    ${reservation.amountPaid} USD
                  </span>
                </div>
                {reservation.balanceDue !== undefined && reservation.balanceDue > 0 && (
                  <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-4 flex items-center justify-between gap-12 print-bg-light print-border-solid shadow-inner">
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">A pagar el día del tour:</span>
                    <span className="text-white text-xl font-black font-display print-text-black">
                      ${reservation.balanceDue} USD
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            LADO DERECHO: QR CODE INTERACTIVO Y TALÓN DE EMBARQUE
            ========================================================= */}
        <div className="flex-1 p-8 md:p-12 bg-black/40 backdrop-blur-3xl border-l border-white/10 flex flex-col items-center justify-between gap-10 relative z-10 shadow-inner">
          
          {/* Circles Cutout For mobile styling */}
          <div className="md:hidden absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-bgDark border-b border-l border-white/20 rounded-full z-10 shadow-inner print-hide" />

          {/* Perforation line decorative bar */}
          <div className="absolute top-0 bottom-0 left-0 border-l-[2px] border-dashed border-white/20 hidden md:block print-border-solid" />

          {/* Ticket Header repeat */}
          <div className="text-center w-full">
            <span className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-2">Código del Boleto</span>
            <span className="font-mono text-2xl text-cyan font-black tracking-[0.25em] block print-text-black drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">{reservation.ticketCode}</span>
          </div>

          {/* Dynamic Interactive QR Code */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-5 rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.2)] border-4 border-white/10 print-qr flex items-center justify-center transform transition-transform hover:scale-105 duration-500">
              <img 
                src={qrCodeUrl} 
                alt="QR Interactive Pass" 
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 style=%22background:white;fill:%230A192F;font-family:sans-serif;font-size:12px;text-anchor:middle;%22><text x=%2280%22 y=%2285%22>Pass Code QR</text></svg>";
                }}
              />
            </div>
            
            <p className="text-[10px] text-gray-300 font-black tracking-[0.1em] uppercase text-center max-w-[220px] leading-relaxed print-text-gray">
              Presenta este código QR interactivo en la terminal o al guía VIP
            </p>
          </div>

          {/* Printable Button CTA */}
          <button 
            type="button"
            onClick={handlePrint}
            className="w-full bg-secondary hover:bg-orange-600 text-white font-black font-display py-3.5 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-secondary/15 hover:shadow-secondary/25 active:scale-95 cursor-pointer print-hide"
          >
            <Printer className="w-4 h-4 text-white" /> Imprimir Recibo / PDF
          </button>

        </div>

      </div>

      {/* =========================================================
          BOTONES DE NAVEGACIÓN Y SOPORTE INFERIORES
          ========================================================= */}
      <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 print-hide relative z-20">
        
        <button 
          onClick={() => navigate('/reservations')}
          className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 text-white font-bold font-display py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-inner hover:shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" /> Mis Reservas Guardadas
        </button>

        <div className="bg-cyan/10 backdrop-blur-md border border-cyan/20 rounded-2xl px-4 py-3 flex items-center justify-center gap-2 text-[10px] text-cyan font-black uppercase tracking-[0.1em] text-center shadow-glow">
          <ShieldCheck className="w-5 h-5 text-cyan animate-pulse flex-shrink-0" />
          Seguridad SSL Encriptada
        </div>

        <button 
          onClick={() => navigate('/chat')}
          className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-cyan text-white hover:text-cyan font-bold font-display py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-inner hover:shadow-glow"
        >
          <HelpCircle className="w-4 h-4" /> Soporte VIP 24/7
        </button>

      </div>

    </div>
  );
}
