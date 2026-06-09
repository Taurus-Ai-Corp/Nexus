import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIToolsPage from './pages/AIToolsPage';
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
        {/* All pages with layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ai-tools" element={<AIToolsPage />} />
              
              {/* Language-specific routes */}
              <Route path="/fr" element={<HomePage />} />
              <Route path="/fr/analytics" element={<AnalyticsPage />} />
              <Route path="/fr/ai-tools" element={<AIToolsPage />} />
              
              <Route path="/es" element={<HomePage />} />
              <Route path="/es/analytics" element={<AnalyticsPage />} />
              <Route path="/es/ai-tools" element={<AIToolsPage />} />
              
              <Route path="/de" element={<HomePage />} />
              <Route path="/de/analytics" element={<AnalyticsPage />} />
              <Route path="/de/ai-tools" element={<AIToolsPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
