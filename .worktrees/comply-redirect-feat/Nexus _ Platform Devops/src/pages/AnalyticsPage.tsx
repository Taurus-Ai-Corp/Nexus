import React, { useEffect } from 'react';
import { setPageMetadata } from '../utils/seoUtils';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  // Set page metadata on component mount
  useEffect(() => {
    setPageMetadata({
      title: 'Analytics Dashboard - Atlas AI',
      description: 'Comprehensive analytics and performance metrics for your AI solutions and content.',
      keywords: 'analytics, performance, metrics, SEO, geographic targeting, content quality',
    });
  }, []);

  return (
    <div className="analytics-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Comprehensive insights and metrics to optimize your AI solutions and content performance.
            </p>
          </div>
          
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;