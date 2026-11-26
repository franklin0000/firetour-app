import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, ArrowRight, Loader, Compass, LogOut, Mail, MapPin, ShieldCheck, RefreshCw } from 'lucide-react';
import type { Reservation } from '../types';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { AUTH_CHANGE_EVENT, type AuthUser, clearStoredUser, getStoredUser } from '../utils/auth';

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(getStoredUser()));
  const [fetchError, setFetchError] = useState('');

  const fetchReservationsForUser = useCallback(async (activeUser: AuthUser | null) => {
    if (!activeUser?.email) {
      setReservations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError('');
    try {
      const response = await fetch(`/api/reservations?email=${encodeURIComponent(activeUser.email)}`);
      if (!response.ok) {
        if (response.status === 401) {
          clearStoredUser();
          setUser(null);
          return;
        }
        throw new Error('No se pudieron cargar tus reservas.');
      }
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error loading reservations: ', err);
      setFetchError(err.message || 'Error al consultar tus reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const next = getStoredUser();
      setUser(next);
      fetchReservationsForUser(next);
    };
    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, [fetchReservationsForUser]);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setReservations([]);
  };

  if (!user) {
    return (
      <div className="bg-bgDark text-white min-h-screen pt-28 pb-20 px-4 md:px-8 relative font-sans flex items-center justify-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-xl bg-surface/90 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-glow">
            <Calendar className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight">Mis Reservas</h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md mx-auto">
              Inicia sesión con tu cuenta de <strong className="text-white">Google</strong> para ver al instante todas las excursiones, códigos QR y vouchers oficiales vinculados a tu correo electrónico.
            </p>
          </div>

          <div className="pt-2">
            <GoogleSignInButton
              text="continue_with"
              theme="filled_black"
              size="large"
              width={320}
              onSuccess={(loggedUser) => {
                setUser(loggedUser);
                fetchReservationsForUser(loggedUser);
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Acceso seguro verificado por Google • Sin contraseñas</span>
          </div>

          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <Link to="/auth?returnUrl=/reservations" className="text-cyan hover:underline font-bold">
              ¿Prefieres entrar con correo y contraseña?
            </Link>
            <a href="mailto:booking.inf@firetourdr.com" className="hover:text-white inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-secondary" /> booking.inf@firetourdr.com
            </a>
          </div>
          <div className="text-center pt-1">
            <Link to="/eliminar-cuenta" className="text-[11px] text-gray-500 hover:text-red-400 underline transition-colors">
              Solicitar eliminación de cuenta / Request account deletion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgDark text-white min-h-screen pt-24 pb-20 px-4 md:px-8 relative font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with Linked Google Profile */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black font-display">Mis Reservas</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full py-1.5 pl-1.5 pr-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-cyan/50"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-cyan/20 text-cyan text-xs font-black flex items-center justify-center">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{user.name}</span>
                  <span className="text-[11px] text-cyan">{user.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fetchReservationsForUser(user)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition cursor-pointer"
                title="Actualizar lista"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan' : ''}`} /> Actualizar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-xs text-gray-300 hover:text-red-400 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-secondary/15 hover:bg-secondary border border-secondary/40 text-secondary hover:text-white font-black uppercase tracking-widest font-display px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 w-full lg:w-auto shadow-glow cursor-pointer group"
          >
            Reservar Más Aventuras <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {fetchError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 text-xs font-bold">
            ⚠️ {fetchError}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-secondary">
            <Loader className="w-8 h-8 animate-spin" />
            <p className="text-xs text-gray-400 font-semibold">Consultando reservas vinculadas a {user.email}...</p>
          </div>
        ) : reservations.length > 0 ? (
          <div className="flex flex-col gap-6">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-surface/90 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-7 shadow-glass hover:border-secondary/40 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 relative group"
              >
                {/* Photo */}
                <div className="w-full md:w-48 aspect-[3/2] rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10 relative">
                  <img
                    src={res.tourImage || '/tours/excursions/tour_1/001.webp'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    alt={res.tourName}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-2.5 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-cyan font-black font-mono uppercase tracking-[0.2em]">
                      {res.ticketCode || `RES-${res.id}`}
                    </span>
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/35 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> {res.status || 'Confirmado'}
                    </div>
                  </div>

                  <h2 className="font-black text-xl sm:text-2xl font-display text-white leading-tight">{res.tourName}</h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-300 pt-3 border-t border-white/10 mt-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Calendar className="w-4 h-4 text-secondary" /> {res.date}
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      <Users className="w-4 h-4 text-cyan" /> {res.guests} {res.guests === 1 ? 'Pasajero' : 'Pasajeros'}
                    </div>
                    <div className="flex flex-col gap-1 col-span-2 sm:col-span-1 text-white font-black uppercase tracking-wider text-[10px]">
                      <span>Depósito: <span className="text-secondary text-sm ml-1">${res.amountPaid} USD</span></span>
                      {res.balanceDue !== undefined && res.balanceDue > 0 && (
                        <span className="text-cyan font-bold text-[9px] bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20 self-start">
                          PENDIENTE: ${res.balanceDue} USD
                        </span>
                      )}
                    </div>
                  </div>

                  {res.hotelName && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      Recogida: <strong className="text-gray-200">{res.hotelName}</strong>
                      {res.roomNumber ? ` (Hab. ${res.roomNumber})` : ''}
                    </p>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="w-full md:w-44 flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
                  <a
                    href={`/api/reservations/${encodeURIComponent(res.ticketCode || res.id)}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-cyan hover:bg-cyan-400 text-black font-black font-display uppercase tracking-wider px-4 py-3 rounded-2xl text-[11px] flex items-center justify-center gap-2 transition cursor-pointer text-center"
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" /> Voucher PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate(`/ticket/${res.ticketCode || res.id}`, { state: { reservation: res } })}
                    className="w-full bg-white/5 border border-white/15 hover:border-white/35 text-white font-bold font-display uppercase tracking-wider px-4 py-2.5 rounded-2xl text-[11px] flex items-center justify-center gap-2 transition hover:bg-white/10 cursor-pointer"
                  >
                    Pase con QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface/90 border border-white/10 rounded-[2.5rem] p-12 sm:p-16 text-center flex flex-col items-center justify-center gap-5 shadow-glass">
            <Compass className="w-16 h-16 text-secondary/60" />
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Aún no tienes reservas con {user.email}
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
              Cada reserva que realices usando este correo de Google aparecerá automáticamente aquí con su código QR y voucher oficial. Si reservaste con otro correo, escríbenos a{' '}
              <a href="mailto:booking.inf@firetourdr.com" className="text-cyan hover:underline font-semibold">
                booking.inf@firetourdr.com
              </a>.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-secondary hover:bg-orange-500 text-white font-black uppercase tracking-widest font-display px-8 py-4 rounded-2xl text-xs shadow-glow transition-all duration-300 mt-2 cursor-pointer"
            >
              Explorar Excursiones VIP
            </button>
          </div>
        )}

        {/* Account Privacy & Deletion Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <Link to="/politica-de-privacidad" className="hover:text-gray-300 transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/eliminar-cuenta" className="hover:text-red-400 underline transition-colors">
            Solicitar eliminación de cuenta / Request account deletion
          </Link>
        </div>
      </div>
    </div>
  );
}
