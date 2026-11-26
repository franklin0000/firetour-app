import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Code-split / lazy-loaded route pages (Fix 3: Performance)
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const ExcursionDetailsPage = React.lazy(() => import('./pages/ExcursionDetailsPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const DigitalTicketPage = React.lazy(() => import('./pages/DigitalTicketPage'));
const ReservationsPage = React.lazy(() => import('./pages/ReservationsPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const TravelpayoutsPage = React.lazy(() => import('./pages/TravelpayoutsPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const ReviewsPage = React.lazy(() => import('./pages/ReviewsPage'));
const PartnerTourPage = React.lazy(() => import('./pages/PartnerTourPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const DeleteAccountPage = React.lazy(() => import('./pages/DeleteAccountPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const PuntaCanaGuidePage = React.lazy(() => import('./pages/PuntaCanaGuidePage'));
const DominicanRepublicGuidePage = React.lazy(() => import('./pages/DominicanRepublicGuidePage'));
const SuccessPage = React.lazy(() => import('./pages/SuccessPage'));
const ResortLandingPage = React.lazy(() => import('./pages/ResortLandingPage'));

function RouteLoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <span className="text-3xl mb-3 animate-bounce">🔥</span>
      <p className="text-xs text-gray-400">Cargando experiencia...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/excursiones" element={<CatalogPage />} />
            <Route path="/excursion/:id" element={<ExcursionDetailsPage />} />
            <Route path="/hoteles/:hotelSlug" element={<ResortLandingPage />} />
            <Route path="/excursiones-desde/:hotelSlug" element={<ResortLandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/ticket/:id" element={<DigitalTicketPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/mis-reservas" element={<ReservationsPage />} />
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
            <Route path="/privacy-policy" element={<Navigate to="/politica-de-privacidad" replace />} />
            <Route path="/eliminar-cuenta" element={<DeleteAccountPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
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
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
