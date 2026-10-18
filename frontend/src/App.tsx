import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Compass, Calendar, MessageSquare, ShieldCheck, Plane, Mail, Phone, Globe, Instagram, MessageCircle, Hotel, User, Star, Building2, BookOpen, Shield, FileText, Camera } from 'lucide-react';
import CatalogPage from './pages/CatalogPage';
import ExcursionDetailsPage from './pages/ExcursionDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import DigitalTicketPage from './pages/DigitalTicketPage';
import ReservationsPage from './pages/ReservationsPage';
import ChatPage from './pages/ChatPage';
import TravelpayoutsPage from './pages/TravelpayoutsPage';
import FireTourLanding from './pages/FireTourLanding';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import ReviewsPage from './pages/ReviewsPage';
import PartnerTourPage from './pages/PartnerTourPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PuntaCanaGuidePage from './pages/PuntaCanaGuidePage';
import DominicanRepublicGuidePage from './pages/DominicanRepublicGuidePage';

import SuccessPage from './pages/SuccessPage';
import ResortLandingPage from './pages/ResortLandingPage';
import ComingSoonModal from './components/ComingSoonModal';
import LanguageSelector from './components/LanguageSelector';
import SmoothScroll from './components/SmoothScroll';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TopPromoBanner from './components/TopPromoBanner';

// Sticky Top Header Navigation component - Floating Pill Style
function Header({ onOpenComingSoon }: { onOpenComingSoon: () => void }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 sm:pt-6 px-2 sm:px-4 pointer-events-none">
      <header className="pointer-events-auto bg-black/75 backdrop-blur-2xl border border-white/10 rounded-full py-2 sm:py-2.5 px-3 sm:px-6 flex items-center justify-between shadow-glass w-full max-w-5xl transition-all duration-300 hover:bg-black/90 hover:border-white/20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🔥</span>
          <div className="hidden sm:block">
            <span className="font-extrabold text-base font-display tracking-tight text-white group-hover:text-secondary transition-colors">Fire Tour</span>
            <span className="text-[10px] text-cyan font-black ml-1 uppercase tracking-widest">DR</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-5 text-xs font-bold font-display uppercase tracking-wider">
            <Link 
              to="/" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/' ? 'text-secondary shadow-glow rounded-full' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className={`w-4 h-4 ${path === '/' ? 'text-secondary' : ''}`} /> 
              <span className="hidden sm:inline">Tours</span>
            </Link>

            <Link 
              to="/reviews" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/reviews' ? 'text-amber-400 shadow-glow rounded-full' : 'text-gray-400 hover:text-amber-300'
              }`}
              title="Reseñas y Opiniones de Aventureros"
            >
              <Star className={`w-4 h-4 ${path === '/reviews' ? 'text-amber-400 fill-amber-400' : 'text-amber-400/80'}`} /> 
              <span className="hidden md:inline">Reseñas</span>
            </Link>

            <Link 
              to="/vender-tours" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/vender-tours' ? 'text-secondary shadow-glow rounded-full' : 'text-gray-400 hover:text-white'
              }`}
              title="Vende tus Excursiones - Proveedores Oficiales"
            >
              <Building2 className={`w-4 h-4 ${path === '/vender-tours' ? 'text-secondary' : ''}`} /> 
              <span className="hidden lg:inline">Vender Tours</span>
              <span className="hidden sm:inline text-[7px] bg-secondary/20 text-secondary border border-secondary/40 px-1 py-0.2 rounded-full font-black uppercase tracking-wider">
                Socios
              </span>
            </Link>

            <Link 
              to="/blog" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path.startsWith('/blog') ? 'text-cyan font-extrabold shadow-glow-cyan rounded-full' : 'text-gray-400 hover:text-cyan'
              }`}
              title="Guías de Viaje y Consejos de Punta Cana"
            >
              <BookOpen className={`w-4 h-4 ${path.startsWith('/blog') ? 'text-cyan' : ''}`} /> 
              <span className="hidden sm:inline">Guías</span>
            </Link>

            <Link 
              to="/punta-cana" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/punta-cana' ? 'text-secondary font-extrabold shadow-glow rounded-full' : 'text-gray-400 hover:text-white'
              }`}
              title="Guía Oficial y Fotos de Punta Cana"
            >
              <Camera className={`w-4 h-4 ${path === '/punta-cana' ? 'text-secondary' : ''}`} /> 
              <span className="hidden md:inline">Punta Cana</span>
            </Link>

            <Link 
              to="/republica-dominicana" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/republica-dominicana' ? 'text-cyan font-extrabold shadow-glow-cyan rounded-full' : 'text-gray-400 hover:text-cyan'
              }`}
              title="Guía de Samaná, Las Terrenas, Barahona y Santo Domingo"
            >
              <Globe className={`w-4 h-4 ${path === '/republica-dominicana' ? 'text-cyan' : ''}`} /> 
              <span className="hidden lg:inline">RD Completa</span>
            </Link>

            {/* Vuelos Direct Page */}
            <Link 
              to="/vuelos"
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/vuelos' ? 'text-cyan' : 'text-gray-400 hover:text-cyan'
              }`}
              title="Vuelos Internacionales y Conexiones"
            >
              <Plane className="w-4 h-4 text-cyan/80" /> 
              <span className="hidden sm:inline">Vuelos</span>
            </Link>

            <Link 
              to="/reservations" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/reservations' ? 'text-secondary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className={`w-4 h-4 ${path === '/reservations' ? 'text-secondary' : ''}`} /> 
              <span className="hidden sm:inline">Reservas</span>
            </Link>
            
            <Link 
              to="/auth" 
              className={`flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
                path === '/auth' ? 'text-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-full px-2' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${path === '/auth' ? 'text-cyan' : ''}`}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="hidden sm:inline">Cuenta</span>
            </Link>
          </nav>

          {/* Language Selector Dropdown */}
          <div className="pl-1.5 border-l border-white/15 flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </header>
    </div>
  );
}

// Global Layout & Footer
function Footer() {
  return (
    <footer className="bg-surface border-t border-outline pt-16 pb-12 px-6 mt-16 text-xs text-gray-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Brand & Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="font-extrabold text-base text-white font-display block">Fire Tour DR</span>
              <span className="text-[10px] text-cyan font-bold tracking-widest uppercase">Punta Cana Adventures</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Ecosistema digital líder para reservar excursiones exclusivas y traslados seguros en República Dominicana.
          </p>
          <div className="space-y-2 text-xs pt-1">
            <a href="mailto:booking.inf@firetourdr.com" className="flex items-center gap-2 hover:text-cyan transition-colors">
              <Mail className="w-3.5 h-3.5 text-cyan" /> booking.inf@firetourdr.com
            </a>
            <a href="https://wa.me/15872257342" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> +1 (587) 225-7342 (24/7)
            </a>
            <p className="text-gray-500 text-[11px]">
              Av. España, Bávaro - Punta Cana, La Altagracia, RD
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <a href="https://instagram.com/firetourdr" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E1306C]/20 hover:border-[#E1306C]/40 hover:text-[#E1306C] transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://firetourdr.com/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan/20 hover:border-cyan/40 hover:text-cyan transition">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Explorar & Experiencias */}
        <div className="space-y-3">
          <h4 className="font-bold font-display text-white text-sm uppercase tracking-wider">
            Experiencias
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Catálogo Completo de Tours</Link>
            </li>
            <li>
              <Link to="/excursion/1" className="hover:text-white transition-colors">Isla Saona All Inclusive VIP</Link>
            </li>
            <li>
              <Link to="/excursion/2" className="hover:text-white transition-colors">Buggies Macao 4x4 Off-Road</Link>
            </li>
            <li>
              <Link to="/excursion/4" className="hover:text-white transition-colors">Traslados Aeropuerto Punta Cana (PUJ)</Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Reseñas de Clientes
              </Link>
            </li>
            <li>
              <Link to="/vender-tours" className="hover:text-secondary transition-colors">
                Proveedores: Vender Tours
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Guías de Viaje & Blog */}
        <div className="space-y-3">
          <h4 className="font-bold font-display text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan" /> Guías & Consejos
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/republica-dominicana" className="text-cyan font-bold hover:underline">
                🇩🇴 Guía Completa República Dominicana
              </Link>
            </li>
            <li>
              <Link to="/punta-cana" className="text-secondary font-bold hover:underline">
                Guía Oficial & Fotos de Punta Cana
              </Link>
            </li>
            <li>
              <Link to="/blog/guia-las-terrenas-samana-playas-ballenas" className="hover:text-white transition-colors line-clamp-1">
                Samaná & Las Terrenas: Ballenas & Rincón
              </Link>
            </li>
            <li>
              <Link to="/blog/guia-barahona-los-patos-bahia-de-las-aguilas" className="hover:text-white transition-colors line-clamp-1">
                Barahona: Los Patos & Bahía de las Águilas
              </Link>
            </li>
            <li>
              <Link to="/blog/guia-santo-domingo-zona-colonial-tres-ojos" className="hover:text-white transition-colors line-clamp-1">
                Santo Domingo: Zona Colonial & Tres Ojos
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-cyan font-bold hover:underline">
                Centro de Guías de Turismo
              </Link>
            </li>
            <li>
              <Link to="/blog/guia-completa-isla-saona-punta-cana" className="hover:text-white transition-colors line-clamp-1">
                Guía Definitiva Isla Saona
              </Link>
            </li>
            <li>
              <Link to="/blog/buggies-macao-punta-cana-consejos-seguridad" className="hover:text-white transition-colors line-clamp-1">
                Buggies 4x4 Macao: Seguridad & Ruta
              </Link>
            </li>
            <li>
              <Link to="/blog/traslados-aeropuerto-punta-cana-puj-consejos" className="hover:text-white transition-colors line-clamp-1">
                Traslados en Aeropuerto PUJ
              </Link>
            </li>
            <li>
              <Link to="/blog/clima-punta-cana-mejor-epoca-viajar-sargazo" className="hover:text-white transition-colors line-clamp-1">
                Clima y Mejor Época para Viajar
              </Link>
            </li>
            <li>
              <Link to="/blog/top-5-mejores-playas-punta-cana-republica-dominicana" className="hover:text-white transition-colors line-clamp-1">
                Top 5 Playas Más Espectaculares
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Confianza, Legal & Soporte */}
        <div className="space-y-3">
          <h4 className="font-bold font-display text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-secondary" /> Legal & Confianza
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/sobre-nosotros" className="hover:text-white transition-colors">
                Sobre Nosotros (Quiénes Somos)
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-white transition-colors">
                Contacto & Soporte Directo
              </Link>
            </li>
            <li>
              <Link to="/politica-de-privacidad" className="hover:text-white transition-colors font-medium">
                Política de Privacidad y Cookies
              </Link>
            </li>
            <li>
              <Link to="/terminos-y-condiciones" className="hover:text-white transition-colors font-medium">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">
                Política de Cancelación y Reembolsos
              </Link>
            </li>
            <li>
              <Link to="/reservations" className="hover:text-white transition-colors">
                Consulta de Tickets & Vouchers
              </Link>
            </li>
          </ul>

          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-cyan font-bold bg-primary/40 border border-outline rounded-full px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Pagos Seguros con Stripe
            </div>
          </div>
        </div>

      </div>

      {/* Programmatic Resort Links for SEO Crawlers */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 mt-10">
        <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider text-center">
          Recogida Incluida en Hoteles y Resorts de Punta Cana:
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
          <Link to="/hoteles/hard-rock-hotel-punta-cana" className="hover:text-secondary transition-colors">Hard Rock Hotel</Link>
          <span>•</span>
          <Link to="/hoteles/riu-republica" className="hover:text-secondary transition-colors">Riu Republica</Link>
          <span>•</span>
          <Link to="/hoteles/riu-palace-punta-cana" className="hover:text-secondary transition-colors">Riu Palace</Link>
          <span>•</span>
          <Link to="/hoteles/barcelo-bavaro-palace" className="hover:text-secondary transition-colors">Barceló Bávaro</Link>
          <span>•</span>
          <Link to="/hoteles/grand-palladium-punta-cana" className="hover:text-secondary transition-colors">Grand Palladium</Link>
          <span>•</span>
          <Link to="/hoteles/bahia-principe-bavaro" className="hover:text-secondary transition-colors">Bahía Príncipe</Link>
          <span>•</span>
          <Link to="/hoteles/iberostar-grand-bavaro" className="hover:text-secondary transition-colors">Iberostar Bávaro</Link>
          <span>•</span>
          <Link to="/hoteles/secrets-royal-beach" className="hover:text-secondary transition-colors">Secrets Royal Beach</Link>
          <span>•</span>
          <Link to="/hoteles/lopesan-costa-bavaro" className="hover:text-secondary transition-colors">Lopesan Costa Bávaro</Link>
          <span>•</span>
          <Link to="/hoteles/dreams-onyx-punta-cana" className="hover:text-secondary transition-colors">Dreams Onyx</Link>
          <span>•</span>
          <Link to="/hoteles/majestic-elegance-punta-cana" className="hover:text-secondary transition-colors">Majestic Elegance</Link>
          <span>•</span>
          <Link to="/hoteles/hyatt-ziva-cap-cana" className="hover:text-secondary transition-colors">Hyatt Ziva Cap Cana</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/5 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
        <p>© {new Date().getFullYear()} Fire Tour DR. Todos los derechos reservados. Operador Turístico Certificado en Punta Cana, República Dominicana.</p>
        <div className="flex items-center gap-4">
          <Link to="/politica-de-privacidad" className="hover:underline">Privacidad</Link>
          <Link to="/terminos-y-condiciones" className="hover:underline">Términos</Link>
          <Link to="/contacto" className="hover:underline">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}

// Mobile Bottom Navigation Bar (Persistent Thumb Navigation)
function MobileBottomNav({ onOpenComingSoon }: { onOpenComingSoon: () => void }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-2xl border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            path === '/' ? 'text-secondary' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold font-display uppercase tracking-wider">Tours</span>
        </Link>

        {/* Guías de Viaje Mobile Button */}
        <Link 
          to="/blog"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            path.startsWith('/blog') ? 'text-cyan' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 text-cyan" />
          <span className="text-[10px] font-bold font-display uppercase tracking-wider text-cyan">Guías</span>
        </Link>

        <a 
          href="https://wa.me/15872257342?text=Hola%20Fire%20Tour%20DR%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20excursiones" 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#25D366] hover:scale-105 transition"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366] text-black flex items-center justify-center -mt-3 shadow-[0_0_15px_rgba(37,211,102,0.6)]">
            <MessageCircle className="w-5 h-5 fill-black" />
          </div>
          <span className="text-[10px] font-black font-display uppercase tracking-wider text-[#25D366]">Chat</span>
        </a>

        <Link 
          to="/reservations" 
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            path === '/reservations' ? 'text-secondary' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold font-display uppercase tracking-wider">Tickets</span>
        </Link>

        <Link 
          to="/auth" 
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            path === '/auth' || path === '/cuenta' ? 'text-cyan' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold font-display uppercase tracking-wider">Cuenta</span>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <SmoothScroll>
      <BrowserRouter>
        <div className="bg-bgDark min-h-screen text-white flex flex-col font-body pb-16 md:pb-0 overflow-x-hidden">
          
          {/* Top Promotional Announcement Banner */}
          <TopPromoBanner />

          {/* Navigation */}
          <div className="pt-2 sm:pt-4">
            <Header onOpenComingSoon={() => setShowComingSoon(true)} />
          </div>

          {/* Dynamic Route Pages */}
          <main className="flex-1 w-full relative pt-16 sm:pt-20">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/excursion/:id" element={<ExcursionDetailsPage />} />
              <Route path="/hoteles/:hotelSlug" element={<ResortLandingPage />} />
              <Route path="/excursiones-desde/:hotelSlug" element={<ResortLandingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/ticket/:id" element={<DigitalTicketPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/cuenta" element={<AuthPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/opiniones" element={<Navigate to="/reviews" replace />} />
              <Route path="/vender-tours" element={<PartnerTourPage />} />
              <Route path="/proveedores" element={<Navigate to="/vender-tours" replace />} />
              <Route path="/socios" element={<Navigate to="/vender-tours" replace />} />
              <Route path="/vuelos" element={<TravelpayoutsPage />} />
              <Route path="/travelpayouts" element={<Navigate to="/vuelos" replace />} />
              <Route path="/travel" element={<Navigate to="/vuelos" replace />} />

              {/* Legal & Trust Pages (AdSense & E-E-A-T Compliance) */}
              <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
              <Route path="/privacy" element={<Navigate to="/politica-de-privacidad" replace />} />
              <Route path="/terminos-y-condiciones" element={<TermsPage />} />
              <Route path="/terms" element={<Navigate to="/terminos-y-condiciones" replace />} />
              <Route path="/cancelaciones" element={<TermsPage />} />
              <Route path="/sobre-nosotros" element={<AboutPage />} />
              <Route path="/about" element={<Navigate to="/sobre-nosotros" replace />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/contact" element={<Navigate to="/contacto" replace />} />

              {/* Travel Guides & Editorial Content Hub */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/guias" element={<Navigate to="/blog" replace />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Punta Cana Comprehensive Guide & Real Photo Showcase */}
              <Route path="/punta-cana" element={<PuntaCanaGuidePage />} />
              <Route path="/guia-punta-cana" element={<Navigate to="/punta-cana" replace />} />

              {/* Comprehensive Dominican Republic Destination Guide */}
              <Route path="/republica-dominicana" element={<DominicanRepublicGuidePage />} />
              <Route path="/destinos" element={<Navigate to="/republica-dominicana" replace />} />
              <Route path="/samana" element={<Navigate to="/republica-dominicana" replace />} />
              <Route path="/barahona" element={<Navigate to="/republica-dominicana" replace />} />
              <Route path="/santo-domingo" element={<Navigate to="/republica-dominicana" replace />} />

              <Route path="/admin-secreto-123" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Floating WhatsApp Contact & Booking Widget */}
          <FloatingWhatsApp />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav onOpenComingSoon={() => setShowComingSoon(true)} />

          {/* Coming Soon Modal */}
          <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />

        </div>
      </BrowserRouter>
    </SmoothScroll>
  );
}
