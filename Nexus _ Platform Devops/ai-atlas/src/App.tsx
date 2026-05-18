import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import InsightsPage from './pages/InsightsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import DataProtection from './pages/DataProtection';
import { useEffect } from 'react';

// Component to handle location-based redirects
const LocationBasedRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // This would normally use the GeoTargeting provider
  // This is a simplified example that detects browser language
  useEffect(() => {
    // Only redirect on the root route and only once
    if (location.pathname !== '/') return;

    // Check if we've already redirected
    const hasRedirected = sessionStorage.getItem('geo_redirect');
    if (hasRedirected) return;

    // Get browser language
    const browserLang = navigator.language.split('-')[0];
    
    // Map of supported languages and their routes
    const supportedLangs: { [key: string]: string } = {
      fr: '/fr',
      es: '/es',
      de: '/de'
    };

    // If the user's language is supported and not already at that route
    if (supportedLangs[browserLang] && !location.pathname.startsWith(supportedLangs[browserLang])) {
      // Store that we've redirected
      sessionStorage.setItem('geo_redirect', 'true');
      
      // For this demo, we'll just log instead of actually redirecting
      console.log(`Would redirect to ${supportedLangs[browserLang]} based on browser language ${browserLang}`);
      // navigate(supportedLangs[browserLang]);
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <LocationBasedRouter />
      <Routes>
        {/* Signup page without layout */}
        <Route path="/signup" element={<SignupPage />} />
        
        {/* All other pages with layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              
              {/* Language-specific routes */}
              <Route path="/fr" element={<HomePage />} />
              <Route path="/fr/features" element={<FeaturesPage />} />
              <Route path="/fr/insights" element={<InsightsPage />} />
              <Route path="/fr/pricing" element={<PricingPage />} />
              <Route path="/fr/contact" element={<ContactPage />} />
              
              <Route path="/es" element={<HomePage />} />
              <Route path="/es/features" element={<FeaturesPage />} />
              <Route path="/es/insights" element={<InsightsPage />} />
              <Route path="/es/pricing" element={<PricingPage />} />
              <Route path="/es/contact" element={<ContactPage />} />
              
              <Route path="/de" element={<HomePage />} />
              <Route path="/de/features" element={<FeaturesPage />} />
              <Route path="/de/insights" element={<InsightsPage />} />
              <Route path="/de/pricing" element={<PricingPage />} />
              <Route path="/de/contact" element={<ContactPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
