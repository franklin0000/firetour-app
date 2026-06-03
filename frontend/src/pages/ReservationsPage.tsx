import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, ArrowRight, Loader, Compass } from 'lucide-react';
import type { Reservation } from '../types';

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth?returnUrl=/reservations');
      return;
    }

    const user = JSON.parse(userStr);

    const fetchReservationsList = async () => {
      try {
        const response = await fetch(`/api/reservations?email=${encodeURIComponent(user.email)}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('user');
            navigate('/auth?returnUrl=/reservations');
          }
          throw new Error('No autorizado');
        }

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        console.error("Error loading reservations: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservationsList();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgDark flex justify-center items-center text-secondary">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-bgDark text-white min-h-screen py-12 px-4 md:px-8 relative font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Mis Reservas</h1>
            <p className="text-gray-400 text-sm mt-3 tracking-wide">Consulta tus pases de abordaje y el estatus de tus viajes VIP reservados.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary hover:text-white font-black uppercase tracking-widest font-display px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 w-full md:w-auto shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] group"
          >
            Reservar Más Aventuras <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Reservations List */}
        {reservations.length > 0 ? (
          <div className="flex flex-col gap-8">
            {reservations.map(res => (
              <div 
                key={res.id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden p-6 md:p-8 shadow-inner hover:shadow-glow hover:border-secondary/40 transition-all duration-500 flex flex-col md:flex-row items-center gap-8 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Photo */}
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 relative">
                  <img src={res.tourImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-3 w-full relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] text-cyan font-black font-mono uppercase tracking-[0.2em]">{res.ticketCode}</span>
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/35 px-3 py-1.5 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> {res.status}
                    </div>
                  </div>

                  <h3 className="font-black text-2xl font-display text-white drop-shadow-md">{res.tourName}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-gray-400 pt-3 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-2 font-bold tracking-wide">
                      <Calendar className="w-4 h-4 text-secondary drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" /> {res.date}
                    </div>
                    <div className="flex items-center gap-2 font-bold tracking-wide">
                      <Users className="w-4 h-4 text-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" /> {res.guests} {res.guests === 1 ? 'Pasajero' : 'Pasajeros'}
                    </div>
                    <div className="flex flex-col gap-1 col-span-2 md:col-span-1 text-white font-black uppercase tracking-widest text-[10px]">
                      <span className="flex items-center gap-1">Depósito: <span className="text-secondary text-base ml-1 drop-shadow-md">${res.amountPaid} USD</span></span>
                      {res.balanceDue !== undefined && res.balanceDue > 0 && (
                        <span className="text-cyan font-bold text-[9px] bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20 self-start">
                          PENDIENTE: ${res.balanceDue} USD
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="w-full md:w-auto relative z-10 flex-shrink-0">
                  <button 
                    onClick={() => navigate(`/ticket/${res.id}`)}
                    className="w-full bg-gradient-to-r from-cyan/20 to-cyan/10 border border-cyan/30 hover:border-cyan text-cyan hover:text-white font-black font-display uppercase tracking-widest px-6 py-4 rounded-2xl text-[10px] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan/40 backdrop-blur-md"
                  >
                    <FileText className="w-5 h-5 drop-shadow-md" /> Ver Pase Digital (QR)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-16 text-center flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <Compass className="w-20 h-20 text-secondary/40 animate-float mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] relative z-10" />
            <h2 className="text-3xl font-black font-display text-white relative z-10">¿Aún no tienes aventuras reservadas?</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed relative z-10">
              El paraíso de Punta Cana te espera. Explora nuestro catálogo de excursiones premium de catamarán, tirolinas y atardeceres mágicos.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-secondary hover:bg-orange-500 text-white font-black uppercase tracking-widest font-display px-8 py-4 rounded-2xl text-xs shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-300 mt-6 relative z-10 transform hover:-translate-y-1"
            >
              Explorar Excursiones VIP
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
