import React from 'react';
import { useModal } from '../context/ModalContext';

const InsightsPage: React.FC = () => {
  const { showUpgradeModal } = useModal();
  
  const analyticsData = [
    { metric: 'Campaign Performance', value: '94.2%', change: '+12.5%', color: 'green', icon: '📈' },
    { metric: 'Lead Conversion Rate', value: '8.7%', change: '+3.2%', color: 'blue', icon: '🎯' },
    { metric: 'Customer Acquisition Cost', value: '$47', change: '-15.8%', color: 'orange', icon: '💰' },
    { metric: 'Return on Ad Spend', value: '4.8x', change: '+22.1%', color: 'purple', icon: '📊' },
  ];

  const recentInsights = [
    {
      title: 'Email Campaign Optimization',
      description: 'Identified optimal send times resulting in 23% higher open rates',
      impact: 'High Impact',
      date: '2 hours ago',
      type: 'Email Marketing',
      color: 'green'
    },
    {
      title: 'Audience Segmentation Analysis',
      description: 'New high-value customer segment discovered with 40% higher LTV',
      impact: 'Critical',
      date: '5 hours ago',
      type: 'Analytics',
      color: 'blue'
    },
    {
      title: 'Ad Spend Reallocation',
      description: 'Recommended budget shift to increase conversions by 18%',
      impact: 'Medium Impact',
      date: '1 day ago',
      type: 'Advertising',
      color: 'orange'
    },
    {
      title: 'Content Performance Trend',
      description: 'Video content showing 3x better engagement than static posts',
      impact: 'High Impact',
      date: '2 days ago',
      type: 'Content',
      color: 'purple'
    },
  ];

  const predictions = [
    {
      title: 'Q1 Lead Generation Forecast',
      prediction: '2,847 qualified leads',
      confidence: '94%',
      trend: 'up',
      color: 'blue'
    },
    {
      title: 'Campaign ROI Projection',
      prediction: '285% ROI increase',
      confidence: '87%',
      trend: 'up',
      color: 'green'
    },
    {
      title: 'Customer Churn Risk',
      prediction: '12 high-value customers',
      confidence: '91%',
      trend: 'down',
      color: 'orange'
    },
  ];

  const topPerformers = [
    { campaign: 'Holiday Email Series', performance: '156%', type: 'Email', color: 'green' },
    { campaign: 'Social Media Retargeting', performance: '142%', type: 'Social', color: 'blue' },
    { campaign: 'Content Marketing Hub', performance: '128%', type: 'Content', color: 'purple' },
    { campaign: 'PPC Search Campaign', performance: '119%', type: 'Paid Search', color: 'orange' },
  ];

  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dgsm-text-primary mb-4">
              Marketing Insights Dashboard
            </h1>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Real-time analytics, AI-powered predictions, and actionable insights to optimize your marketing performance
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map((data, index) => {
              const getColorClasses = (color: string) => {
                switch(color) {
                  case 'blue': return { bg: 'bg-blue-500/20', text: 'text-blue-500' };
                  case 'green': return { bg: 'bg-green-500/20', text: 'text-green-500' };
                  case 'orange': return { bg: 'bg-orange-500/20', text: 'text-orange-500' };
                  case 'purple': return { bg: 'bg-purple-500/20', text: 'text-purple-500' };
                  default: return { bg: 'bg-blue-500/20', text: 'text-blue-500' };
                }
              };
              const colors = getColorClasses(data.color);
              
              return (
                <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg border border-dgsm-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-2xl p-3 rounded-lg ${colors.bg}`}>
                      {data.icon}
                    </div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      data.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {data.change}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                    {data.value}
                  </div>
                  <p className="text-dgsm-text-secondary text-sm">{data.metric}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Insights & Predictions */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Insights */}
            <div>
              <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">Recent AI Insights</h2>
              <div className="space-y-4">
                {recentInsights.map((insight, index) => {
                  const getTypeBadgeColor = (color: string) => {
                    switch(color) {
                      case 'blue': return 'bg-blue-500/20 text-blue-400';
                      case 'green': return 'bg-green-500/20 text-green-400';
                      case 'orange': return 'bg-orange-500/20 text-orange-400';
                      case 'purple': return 'bg-purple-500/20 text-purple-400';
                      default: return 'bg-blue-500/20 text-blue-400';
                    }
                  };
                  
                  return (
                    <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-dgsm-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-dgsm-text-primary mb-2">{insight.title}</h3>
                          <p className="text-dgsm-text-secondary text-sm mb-3">{insight.description}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(insight.color)}`}>
                          {insight.type}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          insight.impact === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          insight.impact === 'High Impact' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {insight.impact}
                        </span>
                        <span className="text-dgsm-text-muted text-xs">{insight.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Predictions */}
            <div>
              <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">AI Predictions</h2>
              <div className="space-y-6">
                {predictions.map((prediction, index) => {
                  const getPredictionColor = (color: string) => {
                    switch(color) {
                      case 'blue': return 'text-blue-500';
                      case 'green': return 'text-green-500';
                      case 'orange': return 'text-orange-500';
                      case 'purple': return 'text-purple-500';
                      default: return 'text-blue-500';
                    }
                  };
                  
                  return (
                    <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg border border-dgsm-border">
                      <h3 className="font-bold text-dgsm-text-primary mb-3">{prediction.title}</h3>
                      <div className={`text-2xl font-bold ${getPredictionColor(prediction.color)} mb-2`}>
                        {prediction.prediction}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-dgsm-text-secondary text-sm mr-2">Confidence:</span>
                          <span className="text-green-500 font-semibold">{prediction.confidence}</span>
                        </div>
                        <div className={`flex items-center ${
                          prediction.trend === 'up' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          <span className="text-lg">{prediction.trend === 'up' ? '↗️' : '↘️'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Performing Campaigns */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">Top Performing Campaigns</h2>
          <div className="bg-dgsm-secondary rounded-lg p-6 shadow-lg border border-dgsm-border">
            <div className="space-y-4">
              {topPerformers.map((campaign, index) => {
                const getIndicatorColor = (color: string) => {
                  switch(color) {
                    case 'blue': return 'bg-blue-500';
                    case 'green': return 'bg-green-500';
                    case 'orange': return 'bg-orange-500';
                    case 'purple': return 'bg-purple-500';
                    default: return 'bg-blue-500';
                  }
                };
                
                const getTextColor = (color: string) => {
                  switch(color) {
                    case 'blue': return 'text-blue-500';
                    case 'green': return 'text-green-500';
                    case 'orange': return 'text-orange-500';
                    case 'purple': return 'text-purple-500';
                    default: return 'text-blue-500';
                  }
                };
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-navy-800 rounded-lg border border-dgsm-border">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getIndicatorColor(campaign.color)} mr-4`}></div>
                      <div>
                        <h4 className="font-semibold text-dgsm-text-primary">{campaign.campaign}</h4>
                        <p className="text-dgsm-text-muted text-sm">{campaign.type}</p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${getTextColor(campaign.color)}`}>
                      {campaign.performance}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-dgsm-accent-blue to-dgsm-accent-purple rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want More Detailed Analytics?
            </h2>
            <p className="text-blue-100 mb-6">
              Unlock advanced reporting, custom dashboards, and enterprise-grade analytics.
            </p>
            <button 
              onClick={showUpgradeModal}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightsPage;
