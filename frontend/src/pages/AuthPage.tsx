import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck, LogOut, Calendar } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';

  const fetchUserReservations = async (email: string) => {
    setLoadingReservations(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reservations?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setUserReservations(data);
      }
    } catch (err) {
      console.error("Error fetching user reservations", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchUserReservations(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUserReservations([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      setCurrentUser(data);
      fetchUserReservations(data.email);
      
      if (returnUrl !== '/') {
        navigate(returnUrl === '/checkout' ? -1 : returnUrl);
      }
      setLoading(false);
    } catch (err) {
      setError('Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-bgDark text-white pt-24 pb-20 px-4 md:px-8 relative font-sans">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Profile */}
            <div className="w-full md:w-1/3 bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-premium flex flex-col items-center text-center h-fit">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <User className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-2xl font-black font-display tracking-tight uppercase">Mi Cuenta</h1>
              <p className="text-secondary font-bold mt-2 text-lg">{currentUser.name}</p>
              <p className="text-gray-400 text-sm mb-8">{currentUser.email}</p>

              <button 
                onClick={handleLogout}
                className="w-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white hover:text-red-400 font-bold uppercase tracking-widest py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>

            {/* Main Content Dashboard */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-premium">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <Calendar className="w-6 h-6 text-cyan" />
                  <h2 className="text-xl font-black font-display tracking-widest uppercase">Mis Reservaciones</h2>
                </div>

                {loadingReservations ? (
                  <div className="text-center py-10 text-gray-500 animate-pulse">Cargando reservas...</div>
                ) : userReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-sm">Aún no tienes reservaciones registradas.</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-6 text-cyan font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Explorar Excursiones
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {userReservations.map((res: any, idx: number) => (
                      <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-cyan/30 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-cyan font-bold uppercase tracking-widest">Reserva #{res.id}</span>
                            <h3 className="text-lg font-bold font-display text-white mt-1 group-hover:text-cyan transition-colors">{res.tourName || `Tour ID: ${res.tourId}`}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                              <span className="text-white">{res.date}</span> • {res.guests} {res.guests === 1 ? 'Persona' : 'Personas'}
                            </p>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              Depósito Pagado
                            </div>
                            <button 
                              onClick={() => navigate(`/ticket/${res.id}`)}
                              className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              Ver Ticket <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDark text-white pt-32 pb-20 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin 
              ? 'Accede a tus reservas y tickets digitales.' 
              : 'Únete para una experiencia de reserva más rápida y segura.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan transition-colors" />
              <input 
                type="text" 
                placeholder="Nombre Completo" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-all"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan transition-colors" />
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan transition-colors" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan hover:bg-cyan-400 text-white font-black uppercase tracking-widest py-4 rounded-xl text-xs mt-2 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Ingresar a mi cuenta' : 'Crear mi cuenta')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-secondary font-bold hover:text-white transition-colors"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
            </button>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" /> Datos Protegidos
        </div>
      </div>
    </div>
  );
}
