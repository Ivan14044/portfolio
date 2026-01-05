import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ProjectPage from './pages/ProjectPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ThankYouPage from './pages/ThankYouPage';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

// Trigger build
export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
      <CookieConsent />
    </HelmetProvider>
  );
}
