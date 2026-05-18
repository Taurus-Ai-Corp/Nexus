import React from 'react';
import { Activity, BarChart3, TrendingUp, Zap } from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  return (
    <div className="glow-card p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Live AI Dashboard</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span className="text-sm text-neon-green font-medium">STATUS: ACTIVE</span>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E0E0E0]" />
            <span className="text-sm text-[#E0E0E0]">Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-white">2,847</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E0E0E0]" />
            <span className="text-sm text-[#E0E0E0]">AI Score</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white">94%</p>
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="#00FF7F"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={75.4}
                  strokeDashoffset={75.4 * (1 - 0.94)}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#E0E0E0]" />
            <span className="text-sm text-[#E0E0E0]">ROI</span>
          </div>
          <p className="text-2xl font-bold text-neon-green">312%</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#E0E0E0]" />
            <span className="text-sm text-[#E0E0E0]">Neural Activity</span>
          </div>
          <p className="text-lg font-bold text-white">1.2M</p>
        </div>
      </div>

      {/* Neural Network Activity Chart */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#E0E0E0]">Neural Network Activity</h4>
        <div className="flex items-end gap-1 h-16">
          {[0.3, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.95, 0.7, 0.6, 0.8, 0.5].map((height, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-[#AA00FF] to-[#7B00FF] rounded-sm flex-1 transition-all duration-500"
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#E0E0E0]">
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-neon-green rounded-full"></div>
            COLLECTING...
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            PROCESSING...
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            AI LEARNING
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '94%' }}></div>
        </div>
      </div>
    </div>
  );
};
