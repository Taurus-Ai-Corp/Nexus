import React, { useState } from 'react';
import { Play, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LiveDashboard } from '../components/LiveDashboard';
import { PlaceholderModal } from '../components/Modal';

export const Hero: React.FC = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Create AI-Powered Marketing Campaigns 10x Faster</span>
                <br />
                <span className="text-white">And Grow Your Business With </span>
                <span className="inline-flex items-center gap-2 text-white">
                  <Rocket className="w-8 h-8 gradient-text" />
                  Atlas AI!
                </span>
              </h1>
              
              <p className="text-lg text-[#E0E0E0] max-w-2xl">
                The most advanced AI automation platform with{' '}
                <span className="text-neon-green font-semibold">60+</span> templates,{' '}
                <span className="text-neon-green font-semibold">9</span> platform integrations, and{' '}
                <span className="text-neon-green font-semibold">25+</span> AI agents at your command.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="glow-button px-8 py-3 text-lg">
                  Start Free Trial
                </Link>
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="glow-button-outline px-8 py-3 text-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Live Dashboard */}
            <div className="relative slide-up">
              <LiveDashboard />
            </div>
          </div>
        </div>
      </section>

      <PlaceholderModal 
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        type="demo"
      />
    </>
  );
};
