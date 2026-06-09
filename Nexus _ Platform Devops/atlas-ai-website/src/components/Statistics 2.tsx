import React from 'react';
import { Layout, Users, Zap, Target, CheckCircle, Star } from 'lucide-react';

export const Statistics: React.FC = () => {
  const stats = [
    {
      icon: Layout,
      number: '60+',
      label: 'AI Templates',
      color: 'from-[#00EEFF] to-[#00FF7F]'
    },
    {
      icon: Zap,
      number: '9',
      label: 'Platforms',
      color: 'from-[#7B00FF] to-[#AA00FF]'
    },
    {
      icon: Users,
      number: '25+',
      label: 'AI Agents',
      color: 'from-[#00EEFF] to-[#AA00FF]'
    },
    {
      icon: Target,
      number: '1000+',
      label: 'Automations',
      color: 'from-[#00FF7F] to-[#7B00FF]'
    },
    {
      icon: Users,
      number: '10K+',
      label: 'Active Users',
      color: 'from-[#AA00FF] to-[#00EEFF]'
    },
    {
      icon: CheckCircle,
      number: '99.2%',
      label: 'Success Rate',
      color: 'from-[#00FF7F] to-[#00EEFF]'
    }
  ];

  const achievements = [
    {
      number: '15,439',
      label: 'Completed Campaigns'
    },
    {
      number: '8,924',
      label: 'Active Users'
    },
    {
      number: '$2.4M',
      label: 'Revenue Generated'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center space-y-4 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.number}</p>
                  <p className="text-[#E0E0E0] text-sm">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Statistics */}
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center space-y-2">
              <p className="text-4xl font-bold gradient-text">{achievement.number}</p>
              <p className="text-lg text-[#E0E0E0]">{achievement.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
