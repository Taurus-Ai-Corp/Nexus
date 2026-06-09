import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Brain, FileText, Zap, ChevronRight } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Campaign Management',
      description: 'Streamline your marketing campaigns with intelligent automation and real-time optimization.',
      status: 'AI: Optimizing'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Deep insights powered by machine learning algorithms to maximize your marketing ROI.',
      status: 'AI: Learning'
    },
    {
      icon: FileText,
      title: 'Content Management',
      description: 'Create, manage, and optimize content across all your marketing channels seamlessly.',
      status: 'AI: Optimizing'
    },
    {
      icon: Zap,
      title: 'Automation Suite',
      description: 'Powerful automation tools that work 24/7 to grow your business while you sleep.',
      status: 'AI: Learning'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Modern Marketing
          </h2>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize your marketing campaigns with the power of AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glow-card-green p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#00FF7F] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                
                <p className="text-[#E0E0E0] leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-neon-green font-medium">{feature.status}</span>
                  </div>
                  <div className="progress-bar w-24">
                    <div className="progress-fill" style={{ width: `${85 + index * 5}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/features" className="glow-button px-8 py-3 text-lg flex items-center gap-2 mx-auto">
            Explore All Features
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
