import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

// Ленивая загрузка второстепенных страниц для ускорения первого входа
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Компонент загрузки
const PageLoader = () => (
  <div className="min-h-screen bg-[#080808] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </HelmetProvider>
  );
}
