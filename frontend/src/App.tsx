import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Compass, Calendar, MessageSquare, ShieldCheck, Plane, Mail, Phone, Globe, Instagram, MessageCircle } from 'lucide-react';
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

// Sticky Top Header Navigation component - Floating Pill Style
function Header() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <header className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 md:px-8 flex items-center justify-between shadow-glass w-full max-w-5xl transition-all duration-300 hover:bg-black/60 hover:border-white/20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🔥</span>
          <div className="hidden sm:block">
            <span className="font-extrabold text-base font-display tracking-tight text-white group-hover:text-secondary transition-colors">Fire Tour</span>
            <span className="text-[10px] text-cyan font-black ml-1 uppercase tracking-widest">DR</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8 text-xs font-bold font-display uppercase tracking-wider">
          <Link 
            to="/" 
            className={`flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
              path === '/' ? 'text-secondary shadow-glow rounded-full' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className={`w-4 h-4 ${path === '/' ? 'text-secondary' : ''}`} /> 
            <span className="hidden sm:inline">Tours</span>
          </Link>
          <Link 
            to="/travelpayouts" 
            className={`flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
              path === '/travelpayouts' ? 'text-secondary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plane className={`w-4 h-4 ${path === '/travelpayouts' ? 'text-cyan' : ''}`} /> 
            <span className="hidden sm:inline">Vuelos</span>
          </Link>

          <Link 
            to="/reservations" 
            className={`flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
              path === '/reservations' ? 'text-secondary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className={`w-4 h-4 ${path === '/reservations' ? 'text-secondary' : ''}`} /> 
            <span className="hidden sm:inline">Reservas</span>
          </Link>
          
          <Link 
            to="/auth" 
            className={`flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
              path === '/auth' ? 'text-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-full px-2' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${path === '/auth' ? 'text-cyan' : ''}`}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="hidden sm:inline">Cuenta</span>
          </Link>
        </nav>
      </header>
    </div>
  );
}

// Global Layout & Footer
function Footer() {
  return (
    <footer className="bg-surface border-t border-outline py-8 px-6 mt-16 text-center text-xs text-gray-500 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="font-bold text-white font-display">Fire Tour DR</span>
        <span className="text-secondary font-bold">Punta Cana Adventures</span>
      </div>
      <p className="max-w-md leading-relaxed">
        El principal ecosistema digital para reservar experiencias exclusivas de turismo en la República Dominicana.
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-4 text-gray-400 mt-2">
        <span className="flex items-center gap-2 hover:text-cyan transition-colors cursor-default"><Mail className="w-4 h-4 text-cyan" /> booking.inf@firetourdr.com</span>
        <span className="hidden md:inline text-white/20">•</span>
        
        <a href="https://wa.me/15872257342" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
          <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp: +1 (587) 225-7342
        </a>
        <span className="hidden md:inline text-white/20">•</span>

        <a href="https://instagram.com/firetourdr" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#E1306C] transition-colors">
          <Instagram className="w-4 h-4 text-[#E1306C]" /> @firetourdr
        </a>
        <span className="hidden md:inline text-white/20">•</span>

        <a href="https://firetourdr.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan transition-colors">
          <Globe className="w-4 h-4 text-white" /> firetourdr.com
        </a>
      </div>

      <div className="flex items-center gap-1.5 text-cyan font-bold bg-primary/20 border border-outline rounded-full px-3 py-1 mt-2">
        <ShieldCheck className="w-4 h-4" /> Pagos Asegurados vía Stripe
      </div>
      <p className="mt-4 text-[10px]">© {new Date().getFullYear()} Fire Tour DR. Todos los derechos reservados.</p>
    </footer>
  );
}

import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <div className="bg-bgDark min-h-screen text-white flex flex-col font-body pt-24">
          
          {/* Navigation */}
          <Header />

          {/* Dynamic Route Pages */}
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/excursion/:id" element={<ExcursionDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/ticket/:id" element={<DigitalTicketPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/travelpayouts" element={<TravelpayoutsPage />} />
              <Route path="/admin-secreto-123" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

        </div>
      </BrowserRouter>
    </SmoothScroll>
  );
}
