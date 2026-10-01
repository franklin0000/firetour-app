import React, { useState, useEffect } from 'react';
import { Pencil, Save, X, Image as ImageIcon, DollarSign, Edit3, Type, CalendarDays, Users, Phone, Mail, Hotel, CreditCard, Hash, Clock, Search, Filter, ChevronDown, RefreshCw, TicketCheck, ShoppingBag, FileText, ExternalLink, Star, Building2, MessageSquare, CheckCircle2, MessageCircle, MapPin, Tag, Check, Camera } from 'lucide-react';
import { Tour } from '../types';

interface Reservation {
  id: number;
  ticketCode: string;
  tourId: number;
  tourName: string;
  tourImage: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  hotelName: string;
  roomNumber: string;
  createdAt: string;
}

interface ReviewItem {
  id: number;
  tourId?: number;
  name: string;
  email?: string;
  country?: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
  verified?: boolean;
}

interface PartnerApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  tourTitle: string;
  category: string;
  duration: string;
  priceAdult: number;
  priceChild?: number;
  capacity?: number;
  includes?: string[];
  description: string;
  status: string;
  photos?: string[];
  createdAt: string;
}

type AdminTab = 'reservations' | 'tours' | 'reviews' | 'partners';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('reservations');

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Tours state
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [toursLoading, setToursLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');

  // Partners state
  const [partners, setPartners] = useState<PartnerApplication[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');

  const userEmail = (() => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u).email : ''; } catch { return ''; } })();

  // Fetch reservations
  const fetchReservations = () => {
    setResLoading(true);
    fetch(`/api/reservations?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        const sorted = Array.isArray(data) ? data.sort((a: Reservation, b: Reservation) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) : [];
        setReservations(sorted);
        setResLoading(false);
      })
      .catch(() => setResLoading(false));
  };

  // Fetch reviews
  const fetchReviews = () => {
    setReviewsLoading(true);
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setReviewsLoading(false);
      })
      .catch(() => setReviewsLoading(false));
  };

  // Fetch partner applications
  const fetchPartners = () => {
    setPartnersLoading(true);
    fetch('/api/partner/applications')
      .then(res => res.json())
      .then(data => {
        setPartners(Array.isArray(data.applications) ? data.applications : []);
        setPartnersLoading(false);
      })
      .catch(() => setPartnersLoading(false));
  };

  // Initial fetch for counters
  useEffect(() => {
    fetch('/api/tours?limit=200')
      .then(res => res.json())
      .then(data => {
        setTours(data.tours || []);
        setToursLoading(false);
      });
    fetchReviews();
    fetchPartners();
  }, []);

  useEffect(() => {
    if (activeTab === 'reservations') fetchReservations();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'partners') fetchPartners();
  }, [activeTab]);

  const handleSaveTour = async () => {
    if (!editingTour) return;
    try {
      const res = await fetch(`/api/tours/${editingTour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTour)
      });
      const updatedTour = await res.json();
      setTours(tours.map(t => t.id === updatedTour.id ? updatedTour : t));
      setEditingTour(null);
    } catch (err) {
      alert('Error al guardar los cambios.');
    }
  };

  // Filter reservations
  const filtered = reservations.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.ticketCode.toLowerCase().includes(q) ||
      r.tourName.toLowerCase().includes(q) ||
      r.hotelName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filtered.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const totalGuests = filtered.reduce((sum, r) => sum + (r.guests || 0), 0);

  const statusColor = (status: string) => {
    if (status === 'Confirmado') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'Pendiente') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('es-DO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch { return iso; }
  };

  return (
    <div className="min-h-screen bg-bgDark p-4 md:p-8 relative z-10 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            🛠️ Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Administración</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Fire Tour DR · Gestión completa de reservas y excursiones</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-0">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-t-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'reservations' ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
          >
            <TicketCheck className="w-4 h-4" /> Reservaciones
            <span className="bg-cyan-500/30 text-cyan-300 text-xs px-2 py-0.5 rounded-full">{reservations.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-t-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'tours' ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Excursiones
            <span className="bg-cyan-500/30 text-cyan-300 text-xs px-2 py-0.5 rounded-full">{tours.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-t-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Reseñas
            <span className="bg-amber-500/30 text-amber-300 text-xs px-2 py-0.5 rounded-full">{reviews.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-t-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'partners' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-gray-400 hover:text-white'}`}
          >
            <Building2 className="w-4 h-4 text-secondary" /> Proveedores / Socios
            <span className="bg-secondary/30 text-secondary text-xs px-2 py-0.5 rounded-full font-black">{partners.length}</span>
          </button>
        </div>

        {/* ===== RESERVACIONES TAB ===== */}
        {activeTab === 'reservations' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Reservas', value: reservations.length, icon: '🎟️', color: 'from-cyan-600 to-blue-700' },
                { label: 'Ingresos Totales', value: `$${reservations.reduce((s, r) => s + r.amountPaid, 0).toLocaleString()} USD`, icon: '💵', color: 'from-emerald-600 to-green-700' },
                { label: 'Clientes Totales', value: reservations.reduce((s, r) => s + r.guests, 0), icon: '👥', color: 'from-violet-600 to-purple-700' },
                { label: 'Confirmadas', value: reservations.filter(r => r.status === 'Confirmado').length, icon: '✅', color: 'from-amber-600 to-orange-700' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/10`}>
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-black text-xl">{stat.value}</div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, código de ticket, hotel..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">Todos los estados</option>
                  <option value="Confirmado" className="bg-gray-900">✅ Confirmado</option>
                  <option value="Pendiente" className="bg-gray-900">⏳ Pendiente</option>
                  <option value="Cancelado" className="bg-gray-900">❌ Cancelado</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <button
                onClick={fetchReservations}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition flex items-center gap-2 text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>

            {/* Results count */}
            {searchQuery || statusFilter !== 'all' ? (
              <p className="text-gray-500 text-xs mb-4">
                Mostrando <span className="text-cyan-400 font-bold">{filtered.length}</span> de {reservations.length} reservas
                {totalRevenue > 0 && <> · Ingresos filtrados: <span className="text-emerald-400 font-bold">${totalRevenue.toLocaleString()} USD</span></>}
                {totalGuests > 0 && <> · Personas: <span className="text-violet-400 font-bold">{totalGuests}</span></>}
              </p>
            ) : null}

            {resLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <RefreshCw className="animate-spin mr-2 w-5 h-5" /> Cargando reservaciones...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <TicketCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold">No se encontraron reservaciones</p>
                <p className="text-sm mt-1">Intenta cambiar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReservation(r)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Tour image */}
                      <div className="w-full md:w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        {r.tourImage ? (
                          <img src={r.tourImage} alt={r.tourName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">🏖️</div>
                        )}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border ${statusColor(r.status)} mr-2`}>
                              {r.status}
                            </span>
                            <span className="text-xs font-mono text-cyan-400 font-bold">{r.ticketCode}</span>
                          </div>
                          <span className="text-emerald-400 font-black text-lg">${r.amountPaid} USD</span>
                        </div>
                        <p className="text-white font-bold text-sm truncate mb-1">{r.tourName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.customerName}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{r.date}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.guests} persona{r.guests !== 1 ? 's' : ''}</span>
                          {r.hotelName && <span className="flex items-center gap-1"><Hotel className="w-3 h-3" />{r.hotelName}</span>}
                        </div>
                      </div>

                      <div className="text-gray-600 group-hover:text-cyan-400 transition text-xs hidden md:block">
                        {formatDate(r.createdAt)} →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TOURS TAB ===== */}
        {activeTab === 'tours' && (
          <div>
            {toursLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <RefreshCw className="animate-spin mr-2 w-5 h-5" /> Cargando excursiones...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tours.map(tour => (
                  <div key={tour.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-4 hover:border-cyan-500/40 transition duration-300">
                    <div className="relative h-36">
                      <img src={tour.image} alt={tour.name} className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/20">
                        ID: {tour.id}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-black uppercase leading-tight line-clamp-2">{tour.name}</h3>
                      <p className="text-cyan-400 font-black text-lg mt-1">${tour.price} USD</p>
                    </div>
                    <button
                      onClick={() => setEditingTour(tour)}
                      className="bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-white border border-white/10 hover:border-cyan-500/50 rounded-xl py-2.5 flex justify-center items-center gap-2 transition duration-300 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar Excursión
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === 'reviews' && (
          <div>
            {/* Reviews Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Reseñas', value: reviews.length, icon: '⭐', color: 'from-amber-600 to-yellow-700' },
                { 
                  label: 'Calificación Media', 
                  value: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) + ' ★' : '5.0 ★', 
                  icon: '✨', 
                  color: 'from-orange-600 to-amber-700' 
                },
                { label: 'Excelencia (5★)', value: reviews.filter(r => r.rating === 5).length, icon: '🏆', color: 'from-emerald-600 to-teal-700' },
                { label: 'Votos de Utilidad', value: reviews.reduce((acc, r) => acc + (r.helpfulCount || 0), 0), icon: '👍', color: 'from-cyan-600 to-blue-700' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/10`}>
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-black text-xl">{stat.value}</div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar reseñas por cliente, comentario, país..."
                  value={reviewSearch}
                  onChange={e => setReviewSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition placeholder-gray-500"
                />
              </div>
              <button
                onClick={fetchReviews}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition flex items-center gap-2 text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>

            {reviewsLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <RefreshCw className="animate-spin mr-2 w-5 h-5" /> Cargando reseñas...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-30 text-amber-400" />
                <p className="font-bold">No hay reseñas registradas aún</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews
                  .filter(r => !reviewSearch || r.name.toLowerCase().includes(reviewSearch.toLowerCase()) || r.comment.toLowerCase().includes(reviewSearch.toLowerCase()))
                  .map(rev => (
                    <div key={rev.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                              {rev.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold text-sm">{rev.name}</h4>
                                {rev.country && (
                                  <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{rev.country}</span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-500">{rev.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg">
                            <span className="text-amber-400 font-black text-xs">{rev.rating}.0</span>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed italic mb-4 line-clamp-4">
                          "{rev.comment}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1.5 text-cyan-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verificada
                        </span>
                        <span className="text-gray-400 font-bold">
                          👍 {rev.helpfulCount || 0} personas encontraron esto útil
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PARTNERS TAB ===== */}
        {activeTab === 'partners' && (
          <div>
            {/* Partners Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Propuestas Recibidas', value: partners.length, icon: '🤝', color: 'from-secondary to-orange-700' },
                { label: 'Capitanes & Operadores', value: partners.filter(p => p.category?.includes('barco') || p.category?.includes('acuatico')).length, icon: '🛥️', color: 'from-blue-600 to-cyan-700' },
                { label: 'Aventuras Terrestres', value: partners.filter(p => !p.category?.includes('barco')).length, icon: '🏎️', color: 'from-amber-600 to-yellow-700' },
                { label: 'En Proceso de Revisión', value: partners.filter(p => p.status === 'Pendiente' || !p.status).length, icon: '⏳', color: 'from-violet-600 to-purple-700' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/10`}>
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-black text-xl">{stat.value}</div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, contacto, tour, email..."
                  value={partnerSearch}
                  onChange={e => setPartnerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-secondary transition placeholder-gray-500"
                />
              </div>
              <button
                onClick={fetchPartners}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition flex items-center gap-2 text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>

            {partnersLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <RefreshCw className="animate-spin mr-2 w-5 h-5" /> Cargando propuestas de proveedores...
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30 text-secondary" />
                <p className="font-bold">No hay solicitudes de proveedores aún</p>
                <p className="text-xs text-gray-600 mt-1">Las nuevas postulaciones desde el portal de proveedores aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {partners
                  .filter(p => !partnerSearch || 
                    p.companyName?.toLowerCase().includes(partnerSearch.toLowerCase()) || 
                    p.contactName?.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                    p.tourTitle?.toLowerCase().includes(partnerSearch.toLowerCase())
                  )
                  .map(app => (
                    <div key={app.id} className="bg-white/5 border border-white/10 hover:border-secondary/40 rounded-2xl p-5 md:p-6 transition">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-secondary/20 text-secondary border border-secondary/30 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {app.category || 'Excursión'}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {app.location}
                            </span>
                            <span className="text-xs text-gray-500">• {app.duration}</span>
                          </div>
                          
                          <h3 className="text-white text-lg font-black">{app.tourTitle}</h3>
                          <p className="text-gray-400 text-xs mt-1">
                            Operado por: <span className="text-white font-bold">{app.companyName}</span> ({app.contactName})
                          </p>

                          <p className="text-gray-300 text-xs mt-3 leading-relaxed line-clamp-3 bg-black/30 p-3 rounded-xl border border-white/5">
                            {app.description}
                          </p>

                          {app.includes && app.includes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {app.includes.map((inc, i) => (
                                <span key={i} className="text-[10px] bg-white/5 text-gray-300 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5 text-emerald-400" /> {inc}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.photos && app.photos.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/5">
                              <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5" /> Fotografías de la Excursión ({app.photos.length})
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {app.photos.map((photo, pIdx) => (
                                  <a
                                    key={pIdx}
                                    href={photo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 hover:border-amber-400 transition"
                                  >
                                    <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                    {pIdx === 0 && (
                                      <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-[7px] text-amber-300 text-center font-bold uppercase py-0.5">
                                        Portada
                                      </span>
                                    )}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-start lg:items-end justify-between gap-4 min-w-[200px] border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                          <div>
                            <div className="text-left lg:text-right">
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Precio Adulto</span>
                              <span className="text-emerald-400 font-black text-2xl">${app.priceAdult} USD</span>
                              {app.priceChild ? (
                                <span className="block text-[11px] text-gray-400">Niños: ${app.priceChild} USD</span>
                              ) : null}
                            </div>
                            {app.capacity ? (
                              <span className="block text-left lg:text-right text-[11px] text-gray-500 mt-1">
                                Capacidad: {app.capacity} personas
                              </span>
                            ) : null}
                          </div>

                          <div className="flex flex-col w-full gap-2">
                            <a
                              href={`https://wa.me/${app.phone ? app.phone.replace(/[^0-9]/g, '') : ''}?text=Hola%20${encodeURIComponent(app.contactName)}%2C%20te%20contactamos%20desde%20Fire%20Tour%20DR%20sobre%20tu%20propuesta%20"${encodeURIComponent(app.tourTitle)}"`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                            >
                              <MessageCircle className="w-4 h-4 fill-black" /> Contactar por WhatsApp
                            </a>
                            <a
                              href={`mailto:${app.email}?subject=Propuesta%20Excursión%20Fire%20Tour%20DR%20-%20${encodeURIComponent(app.tourTitle)}`}
                              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition"
                            >
                              <Mail className="w-4 h-4 text-cyan-400" /> Responder Email
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== RESERVATION DETAIL MODAL ===== */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setSelectedReservation(null)}>
          <div
            className="bg-gray-950 border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-6 rounded-t-3xl relative">
              <button onClick={() => setSelectedReservation(null)} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Detalle de Reserva</p>
              <h2 className="text-white font-black text-2xl tracking-tight">{selectedReservation.ticketCode}</h2>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border mt-2 ${statusColor(selectedReservation.status)}`}>
                {selectedReservation.status}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Tour */}
              <div className="flex gap-3 bg-white/5 rounded-2xl p-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {selectedReservation.tourImage ? (
                    <img src={selectedReservation.tourImage} alt="" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">🏖️</div>}
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Excursión</p>
                  <p className="text-white font-bold text-sm">{selectedReservation.tourName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">ID: #{selectedReservation.tourId}</p>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">👤 Datos del Cliente</p>
                {[
                  { icon: <Users className="w-4 h-4 text-cyan-400" />, label: 'Nombre', value: selectedReservation.customerName },
                  { icon: <Mail className="w-4 h-4 text-blue-400" />, label: 'Email', value: selectedReservation.email },
                  { icon: <Phone className="w-4 h-4 text-green-400" />, label: 'Teléfono', value: selectedReservation.phone || '—' },
                  { icon: <CalendarDays className="w-4 h-4 text-violet-400" />, label: 'Fecha del Tour', value: selectedReservation.date },
                  { icon: <Users className="w-4 h-4 text-amber-400" />, label: 'Personas', value: `${selectedReservation.guests} persona${selectedReservation.guests !== 1 ? 's' : ''}` },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {row.icon}
                    <span className="text-gray-500 text-xs w-24">{row.label}:</span>
                    <span className="text-white text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Hotel */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">🏨 Hotel de Recogida</p>
                <div className="flex items-center gap-3">
                  <Hotel className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-500 text-xs w-24">Hotel:</span>
                  <span className="text-white text-sm font-semibold">{selectedReservation.hotelName || '—'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-500 text-xs w-24">Habitación:</span>
                  <span className="text-white text-sm font-semibold">{selectedReservation.roomNumber || '—'}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gradient-to-r from-emerald-900/60 to-green-900/60 border border-emerald-500/20 rounded-2xl p-4">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">💵 Información de Pago</p>
                <p className="text-white font-black text-3xl">${selectedReservation.amountPaid} USD</p>
                <div className="flex items-center gap-3 mt-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-400 text-sm">{selectedReservation.paymentMethod}</span>
                </div>
              </div>

              {/* Action Buttons for Admin */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`/api/reservations/${encodeURIComponent(selectedReservation.ticketCode || selectedReservation.id)}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Ver / Descargar PDF Oficial
                </a>
                <a
                  href={`/ticket/${encodeURIComponent(selectedReservation.ticketCode || selectedReservation.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-gray-300" /> Abrir Pase Digital (QR)
                </a>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Reserva creada: {formatDate(selectedReservation.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOUR EDIT MODAL ===== */}
      {editingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-950 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
            <button onClick={() => setEditingTour(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-tight">Editando #{editingTour.id}</h2>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Type className="w-3.5 h-3.5 text-cyan-400" /> Título de la excursión
                </label>
                <input
                  type="text"
                  value={editingTour.name}
                  onChange={e => setEditingTour({ ...editingTour, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Precio (USD)
                </label>
                <input
                  type="number"
                  value={editingTour.price}
                  onChange={e => setEditingTour({ ...editingTour, price: parseFloat(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition font-black text-lg"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Fotografía
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={editingTour.image}
                    onChange={e => setEditingTour({ ...editingTour, image: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition text-sm"
                  />
                  <label className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-4 flex items-center justify-center cursor-pointer transition">
                    <span className="text-xs uppercase tracking-widest">Subir</span>
                    <input
                      type="file" accept="image/*" className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.imageUrl) setEditingTour({ ...editingTour, image: data.imageUrl });
                        } catch { alert('Error al subir la imagen'); }
                      }}
                    />
                  </label>
                </div>
                {editingTour.image && (
                  <div className="mt-3 relative h-32 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={editingTour.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button onClick={() => setEditingTour({ ...editingTour, image: '' })} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
                        Borrar Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Edit3 className="w-3.5 h-3.5 text-violet-400" /> Descripción Detallada
                </label>
                <textarea
                  value={editingTour.desc}
                  onChange={e => setEditingTour({ ...editingTour, desc: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-400 transition resize-none text-sm leading-relaxed"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
              <button onClick={() => setEditingTour(null)} className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition">
                Cancelar
              </button>
              <button onClick={handleSaveTour} className="px-6 py-3 rounded-xl bg-cyan-500 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/20">
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
