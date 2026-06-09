import React, { useState, useEffect } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: string;
}

interface CircularMetric {
  label: string;
  value: string;
  icon: string;
  color: 'cyan' | 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color, trend, trendValue, icon }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''));

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setAnimatedValue(Math.floor(targetValue * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [targetValue]);

  const colorClasses = {
    blue: 'border-cyan-400 text-cyan-400 shadow-cyan-400/30',
    green: 'border-green-400 text-green-400 shadow-green-400/30',
    purple: 'border-purple-400 text-purple-400 shadow-purple-400/30',
    orange: 'border-orange-400 text-orange-400 shadow-orange-400/30',
    cyan: 'border-cyan-500 text-cyan-500 shadow-cyan-500/30'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400'
  };

  return (
    <div className={`holo-card p-6 targeting-circle ${colorClasses[color]} relative group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {icon && <div className="text-2xl mb-2">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold animate-counter ${colorClasses[color].split(' ')[1]}`}>
            {value.includes('%') ? `${animatedValue}%` : 
             value.includes('K') ? `${(animatedValue/1000).toFixed(1)}K` :
             value.includes('M') ? `${(animatedValue/1000000).toFixed(1)}M` : 
             animatedValue.toLocaleString()}
          </span>
          {trend && trendValue && (
            <span className={`text-sm ${trendColors[trend]} flex items-center`}>
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
      
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-current rounded-full pulse-glow" />
    </div>
  );
};

interface DataVisualizationProps {
  title: string;
  data: number[];
  color: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ title, data, color }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="holo-card p-6 data-stream">
      <h3 className="text-lg font-semibold mb-4 glow-text">{title}</h3>
      <div className="flex items-end justify-between h-32 space-x-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-transparent to-current rounded-t opacity-80 hover:opacity-100 transition-opacity"
            style={{
              height: `${(value / maxValue) * 100}%`,
              color: color,
              filter: 'drop-shadow(0 0 10px currentColor)',
              animationDelay: `${index * 0.1}s`,
              animation: 'data-flow 2s ease-in-out infinite'
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        {data.map((_, index) => (
          <span key={index}>W{index + 1}</span>
        ))}
      </div>
    </div>
  );
};

const CircularDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const circularMetrics: CircularMetric[] = [
    { label: "AI Templates", value: "60+", icon: "⚡", color: "cyan", trend: 12 },
    { label: "Platforms", value: "9", icon: "🌐", color: "blue", trend: 8 },
    { label: "AI Agents", value: "25+", icon: "🤖", color: "purple", trend: 15 },
    { label: "Automations", value: "1000+", icon: "🔄", color: "green", trend: 25 },
    { label: "Active Users", value: "10K+", icon: "👥", color: "orange", trend: 18 },
    { label: "Success Rate", value: "99.2%", icon: "📈", color: "pink", trend: 5 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getColorClasses = (color: CircularMetric['color']) => {
    const colors = {
      cyan: { border: 'border-cyan-500/60', text: 'text-cyan-400', shadow: 'shadow-cyan-500/50', glow: 'shadow-cyan-500/30' },
      blue: { border: 'border-blue-500/60', text: 'text-blue-400', shadow: 'shadow-blue-500/50', glow: 'shadow-blue-500/30' },
      purple: { border: 'border-purple-500/60', text: 'text-purple-400', shadow: 'shadow-purple-500/50', glow: 'shadow-purple-500/30' },
      green: { border: 'border-green-500/60', text: 'text-green-400', shadow: 'shadow-green-500/50', glow: 'shadow-green-500/30' },
      orange: { border: 'border-orange-500/60', text: 'text-orange-400', shadow: 'shadow-orange-500/50', glow: 'shadow-orange-500/30' },
      pink: { border: 'border-pink-500/60', text: 'text-pink-400', shadow: 'shadow-pink-500/50', glow: 'shadow-pink-500/30' }
    };
    return colors[color];
  };

  return (
    <div className="relative flex items-center justify-center min-h-[700px] my-20 overflow-hidden">
      {/* Holographic Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-96 h-96 rounded-full border-2 border-cyan-500/20 ${isVisible ? 'animate-spin' : ''}`} style={{ animationDuration: '60s' }}>
          <div className="absolute inset-8 rounded-full border border-blue-500/15 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-16 rounded-full border border-purple-500/10 animate-spin" style={{ animationDuration: '30s' }}></div>
        </div>
      </div>

      {/* Central AI Core */}
      <div className="absolute z-20 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-500/40 flex items-center justify-center backdrop-blur-lg shadow-2xl">
        <div className="relative">
          <div className="text-5xl animate-pulse">🧠</div>
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20"></div>
        </div>
      </div>

      {/* Floating Metric Cards */}
      {circularMetrics.map((metric, index) => {
        const angle = (index * 360) / circularMetrics.length;
        const radius = 280;
        const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
        const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
        const colors = getColorClasses(metric.color);

        return (
          <div
            key={index}
            className={`absolute transition-all duration-1000 delay-${index * 150} z-10 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onMouseEnter={() => setHoveredMetric(index)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className={`
              relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border-2
              ${colors.border} ${hoveredMetric === index ? colors.shadow : colors.glow}
              hover:scale-110 transition-all duration-500 cursor-pointer
              min-w-[160px] text-center group
            `}>
              {/* Holographic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-3xl mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  {metric.icon}
                </div>
                <div className={`text-3xl font-bold ${colors.text} mb-2 font-mono`}>
                  {metric.value}
                </div>
                <div className="text-white/90 text-sm font-semibold tracking-wide">
                  {metric.label}
                </div>
                {metric.trend && (
                  <div className="text-green-400 text-xs mt-2 flex items-center justify-center font-medium">
                    <span className="animate-pulse">↗</span>
                    <span className="ml-1">+{metric.trend}%</span>
                  </div>
                )}
              </div>

              {/* Pulsing Border Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border} animate-pulse opacity-50`}></div>
              
              {/* Corner Indicators */}
              <div className={`absolute top-2 right-2 w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
            </div>
          </div>
        );
      })}

      {/* Connecting Energy Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        {circularMetrics.map((_, index) => {
          const angle = (index * 360) / circularMetrics.length;
          const radius = 280;
          const centerX = 400;
          const centerY = 350;
          const x = centerX + Math.cos((angle - 90) * (Math.PI / 180)) * radius;
          const y = centerY + Math.sin((angle - 90) * (Math.PI / 180)) * radius;

          return (
            <g key={index}>
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="url(#energyGradient)"
                strokeWidth="1.5"
                opacity="0.4"
                className="animate-pulse"
              />
              {/* Energy Flow Particles */}
              <circle
                cx={centerX + Math.cos((angle - 90) * (Math.PI / 180)) * (radius * 0.7)}
                cy={centerY + Math.sin((angle - 90) * (Math.PI / 180)) * (radius * 0.7)}
                r="2"
                fill="#00f5ff"
                opacity="0.8"
                className="animate-ping"
                style={{ animationDelay: `${index * 0.3}s` }}
              />
            </g>
          );
        })}
        
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#0080ff" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Background Holographic Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-cyan-500/20 animate-pulse" 
              style={{ animationDelay: `${Math.random() * 5}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HolographicDashboard: React.FC = () => {
  const [showCircular, setShowCircular] = useState(true);
  
  const metrics = [
    { title: "Campaign Performance", value: "94%", subtitle: "Above industry average", color: "blue" as const, trend: "up" as const, trendValue: "12%", icon: "📈" },
    { title: "AI Optimization", value: "847K", subtitle: "Automated decisions/day", color: "green" as const, trend: "up" as const, trendValue: "8.3%", icon: "🤖" },
    { title: "ROI Generated", value: "312%", subtitle: "Average client ROI", color: "purple" as const, trend: "up" as const, trendValue: "23%", icon: "💰" },
    { title: "Active Campaigns", value: "1.2M", subtitle: "Managed globally", color: "orange" as const, trend: "up" as const, trendValue: "15%", icon: "🚀" }
  ];

  const chartData = [65, 78, 85, 92, 88, 96, 94];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowCircular(!showCircular)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/25"
        >
          {showCircular ? 'Show Traditional View' : 'Show Holographic View'}
        </button>
      </div>

      {showCircular ? (
        <CircularDashboard />
      ) : (
        <div>
          {/* Traditional Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Data Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataVisualization
              title="Weekly AI Performance"
              data={chartData}
              color="#00f5ff"
            />
            
            <div className="holo-card p-6">
              <h3 className="text-lg font-semibold mb-4 glow-text-purple">Neural Network Status</h3>
              <div className="space-y-4">
                {[
                  { name: "Deep Learning Models", status: "Active", progress: 94 },
                  { name: "Data Processing", status: "Optimized", progress: 87 },
                  { name: "Prediction Engine", status: "Learning", progress: 76 },
                  { name: "Automation Pipeline", status: "Running", progress: 98 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-green-400">{item.status}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="progress-glow h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${item.progress}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolographicDashboard;
