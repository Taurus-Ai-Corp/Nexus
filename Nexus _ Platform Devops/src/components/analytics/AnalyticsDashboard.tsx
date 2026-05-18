import React, { useState, useEffect } from 'react';
import PerformanceMetrics from './PerformanceMetrics';
import CitationBacklinkMonitor from './CitationBacklinkMonitor';
import GeoTrafficVisualization from './GeoTrafficVisualization';
import ContentPerformanceAnalytics from './ContentPerformanceAnalytics';

// Define the tabs in the dashboard
type DashboardTab = 'performance' | 'citations' | 'geo' | 'content';

interface AnalyticsDashboardProps {
  className?: string;
  defaultTab?: DashboardTab;
}

/**
 * Analytics Dashboard Component
 * 
 * A comprehensive dashboard for monitoring website performance, content metrics,
 * citations, backlinks, and geographical user data.
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = '',
  defaultTab = 'performance'
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultTab);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        // For this demo, we'll use mock data after a short delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setDashboardData({
          performance: {
            pageLoadTime: 1.2, // seconds
            serverResponseTime: 0.3, // seconds
            firstContentfulPaint: 0.8, // seconds
            largestContentfulPaint: 1.5, // seconds
            cumulativeLayoutShift: 0.02,
            firstInputDelay: 35, // milliseconds
            bounceRate: 28.5, // percentage
            averageSessionDuration: 185, // seconds
            historical: [
              { date: '2025-07-19', pageLoadTime: 1.4, bounceRate: 30.2 },
              { date: '2025-07-26', pageLoadTime: 1.3, bounceRate: 29.8 },
              { date: '2025-08-02', pageLoadTime: 1.25, bounceRate: 29.1 },
              { date: '2025-08-09', pageLoadTime: 1.22, bounceRate: 28.7 },
              { date: '2025-08-16', pageLoadTime: 1.2, bounceRate: 28.5 }
            ]
          },
          citations: {
            totalBacklinks: 1427,
            newBacklinksThisMonth: 64,
            totalCitations: 85,
            domainAuthority: 45,
            pageAuthority: {
              home: 48,
              blog: 42,
              product: 39,
              about: 36
            },
            topReferrers: [
              { domain: 'industry-news.com', backlinks: 42, authority: 78 },
              { domain: 'tech-review.org', backlinks: 37, authority: 72 },
              { domain: 'business-insights.com', backlinks: 29, authority: 65 },
              { domain: 'data-science-daily.com', backlinks: 26, authority: 61 },
              { domain: 'future-of-ai.net', backlinks: 23, authority: 59 }
            ]
          },
          geo: {
            visitors: {
              US: 45.2,
              UK: 12.8,
              CA: 8.5,
              DE: 7.3,
              FR: 5.1,
              AU: 4.2,
              JP: 3.8,
              IN: 3.5,
              BR: 2.1,
              Other: 7.5
            },
            engagementByRegion: {
              'North America': 4.2, // avg. minutes per session
              'Europe': 3.8,
              'Asia Pacific': 3.5,
              'Latin America': 3.2,
              'Middle East & Africa': 2.9
            },
            conversionByCountry: {
              US: 3.2, // percentage
              UK: 2.8,
              CA: 2.9,
              DE: 2.5,
              FR: 2.4,
              AU: 2.7,
              JP: 2.3,
              IN: 1.9,
              BR: 1.8,
              Other: 1.6
            }
          },
          content: {
            topPerformingPages: [
              { path: '/blog/ai-implementation-guide', views: 12840, avgTimeOnPage: 245, conversionRate: 4.2 },
              { path: '/solutions/enterprise', views: 9675, avgTimeOnPage: 180, conversionRate: 3.8 },
              { path: '/blog/machine-learning-basics', views: 8450, avgTimeOnPage: 210, conversionRate: 2.9 },
              { path: '/case-studies/retail-ai', views: 7230, avgTimeOnPage: 195, conversionRate: 3.5 },
              { path: '/blog/future-of-ai-2025', views: 6890, avgTimeOnPage: 225, conversionRate: 3.2 }
            ],
            contentQualityScores: {
              overall: 82,
              readability: 86,
              originality: 79,
              engagement: 84,
              comprehensiveness: 80
            },
            keywordPerformance: [
              { keyword: 'AI solutions business', position: 3, clicks: 1240, impressions: 15800 },
              { keyword: 'machine learning implementation', position: 5, clicks: 980, impressions: 12600 },
              { keyword: 'AI business transformation', position: 4, clicks: 1050, impressions: 14200 },
              { keyword: 'data analytics solutions', position: 7, clicks: 860, impressions: 13500 },
              { keyword: 'enterprise AI platform', position: 6, clicks: 920, impressions: 11900 }
            ]
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Tab content renderer
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    
    if (!dashboardData) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load dashboard data. Please try again later.
        </div>
      );
    }
    
    switch (activeTab) {
      case 'performance':
        return <PerformanceMetrics data={dashboardData.performance} />;
      case 'citations':
        return <CitationBacklinkMonitor data={dashboardData.citations} />;
      case 'geo':
        return <GeoTrafficVisualization data={dashboardData.geo} />;
      case 'content':
        return <ContentPerformanceAnalytics data={dashboardData.content} />;
      default:
        return <PerformanceMetrics data={dashboardData.performance} />;
    }
  };
  
  // Tab button renderer
  const renderTabButton = (tab: DashboardTab, label: string) => {
    const isActive = activeTab === tab;
    const baseClasses = 'px-4 py-2 font-medium rounded-t-lg transition-colors duration-200';
    const activeClasses = 'bg-white text-indigo-700 border-t border-l border-r border-gray-200';
    const inactiveClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800';
    
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {label}
      </button>
    );
  };
  
  return (
    <div className={`analytics-dashboard ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      
      <div className="tabs-container mb-4">
        <div className="flex space-x-1 border-b border-gray-200">
          {renderTabButton('performance', 'Performance')}
          {renderTabButton('citations', 'Citations & Backlinks')}
          {renderTabButton('geo', 'Geographic Traffic')}
          {renderTabButton('content', 'Content Analytics')}
        </div>
      </div>
      
      <div className="tab-content bg-white p-6 rounded-lg shadow-md">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;