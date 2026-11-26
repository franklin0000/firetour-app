import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ServerDataProvider, type ServerData } from './context/ServerDataContext';

// Synchronous imports for Server Pre-rendering (ensures full HTML without suspense delays)
import CatalogPage from './pages/CatalogPage';
import ExcursionDetailsPage from './pages/ExcursionDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import DigitalTicketPage from './pages/DigitalTicketPage';
import ReservationsPage from './pages/ReservationsPage';
import ChatPage from './pages/ChatPage';
import TravelpayoutsPage from './pages/TravelpayoutsPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import ReviewsPage from './pages/ReviewsPage';
import PartnerTourPage from './pages/PartnerTourPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PuntaCanaGuidePage from './pages/PuntaCanaGuidePage';
import DominicanRepublicGuidePage from './pages/DominicanRepublicGuidePage';
import SuccessPage from './pages/SuccessPage';
import ResortLandingPage from './pages/ResortLandingPage';

export { BLOG_POSTS } from './data/blogData';
export { RESORTS_DATA } from './data/resorts';

export function render(url: string, contextData: ServerData = {}) {
  return renderToString(
    <ServerDataProvider value={contextData}>
      <StaticRouter location={url}>
        <Layout>
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

            {/* Legal & Trust Pages */}
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

            {/* Punta Cana Comprehensive Guide */}
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
        </Layout>
      </StaticRouter>
    </ServerDataProvider>
  );
}
