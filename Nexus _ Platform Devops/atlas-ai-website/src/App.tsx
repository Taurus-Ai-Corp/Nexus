import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './pages/Homepage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { InsightsPage } from './pages/InsightsPage';
import { SignupPage } from './pages/SignupPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiesPage } from './pages/CookiesPage';
import { DataProtectionPage } from './pages/DataProtectionPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A26] to-[#0E0E2F] relative overflow-x-hidden">
        <div className="grid-background min-h-screen">
          <div className="floating-dots"></div>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/data-protection" element={<DataProtectionPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
