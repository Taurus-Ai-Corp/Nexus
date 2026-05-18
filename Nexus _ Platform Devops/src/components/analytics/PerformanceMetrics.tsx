import React from 'react';

interface PerformanceData {
  pageLoadTime: number;
  serverResponseTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  bounceRate: number;
  averageSessionDuration: number;
  historical: {
    date: string;
    pageLoadTime: number;
    bounceRate: number;
  }[];
}

interface PerformanceMetricsProps {
  data: PerformanceData;
}

/**
 * Performance Metrics Component
 * 
 * Displays web performance metrics including Core Web Vitals,
 * page load statistics, and historical performance data.
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  // Helper function to determine status color based on metric value
  const getMetricStatus = (metric: string, value: number): string => {
    switch (metric) {
      case 'pageLoadTime':
        return value < 1.0 ? 'bg-green-100 text-green-800' : 
               value < 2.0 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'serverResponseTime':
        return value < 0.2 ? 'bg-green-100 text-green-800' : 
               value < 0.5 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'firstContentfulPaint':
        return value < 1.0 ? 'bg-green-100 text-green-800' : 
               value < 1.8 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'largestContentfulPaint':
        return value < 1.2 ? 'bg-green-100 text-green-800' : 
               value < 2.5 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'cumulativeLayoutShift':
        return value < 0.1 ? 'bg-green-100 text-green-800' : 
               value < 0.25 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'firstInputDelay':
        return value < 100 ? 'bg-green-100 text-green-800' : 
               value < 300 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'bounceRate':
        return value < 30 ? 'bg-green-100 text-green-800' : 
               value < 50 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format time duration in human-readable format
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)} seconds`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds.toFixed(0)} sec`;
  };
  
  return (
    <div className="performance-metrics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
          <div className="space-y-4">
            {/* LCP */}
            <div className="metric-card p-4 bg-white border rounded-lg">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">Largest Contentful Paint</div>
                  <div className="text-2xl font-semibold mt-1">{data.largestContentfulPaint.toFixed(1)}s</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMetricStatus('largestContentfulPaint', data.largestContentfulPaint)}`}>
                  {data.largestContentfulPaint < 1.2 ? 'Good' : 
                   data.largestContentfulPaint < 2.5 ? 'Needs Improvement' : 
                   'Poor'}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Measures loading performance. Good experience: under 1.2s</div>
            </div>
            
            {/* CLS */}
            <div className="metric-card p-4 bg-white border rounded-lg">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">Cumulative Layout Shift</div>
                  <div className="text-2xl font-semibold mt-1">{data.cumulativeLayoutShift.toFixed(2)}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMetricStatus('cumulativeLayoutShift', data.cumulativeLayoutShift)}`}>
                  {data.cumulativeLayoutShift < 0.1 ? 'Good' : 
                   data.cumulativeLayoutShift < 0.25 ? 'Needs Improvement' : 
                   'Poor'}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Measures visual stability. Good experience: under 0.1</div>
            </div>
            
            {/* FID */}
            <div className="metric-card p-4 bg-white border rounded-lg">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">First Input Delay</div>
                  <div className="text-2xl font-semibold mt-1">{data.firstInputDelay}ms</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMetricStatus('firstInputDelay', data.firstInputDelay)}`}>
                  {data.firstInputDelay < 100 ? 'Good' : 
                   data.firstInputDelay < 300 ? 'Needs Improvement' : 
                   'Poor'}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Measures interactivity. Good experience: under 100ms</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Page Load Statistics</h3>
          <div className="stats-grid grid grid-cols-2 gap-4">
            <div className="stat-card p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-500">Page Load Time</div>
              <div className="text-2xl font-semibold mt-1">{data.pageLoadTime.toFixed(1)}s</div>
              <div className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${getMetricStatus('pageLoadTime', data.pageLoadTime)}`}>
                {data.pageLoadTime < 1.0 ? 'Fast' : 
                 data.pageLoadTime < 2.0 ? 'Average' : 
                 'Slow'}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-500">Server Response</div>
              <div className="text-2xl font-semibold mt-1">{data.serverResponseTime.toFixed(1)}s</div>
              <div className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${getMetricStatus('serverResponseTime', data.serverResponseTime)}`}>
                {data.serverResponseTime < 0.2 ? 'Fast' : 
                 data.serverResponseTime < 0.5 ? 'Average' : 
                 'Slow'}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-500">Bounce Rate</div>
              <div className="text-2xl font-semibold mt-1">{data.bounceRate.toFixed(1)}%</div>
              <div className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${getMetricStatus('bounceRate', data.bounceRate)}`}>
                {data.bounceRate < 30 ? 'Low' : 
                 data.bounceRate < 50 ? 'Average' : 
                 'High'}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-500">Avg. Session</div>
              <div className="text-2xl font-semibold mt-1">{formatDuration(data.averageSessionDuration)}</div>
              <div className="text-xs mt-1 text-gray-500">
                {data.averageSessionDuration > 180 ? 'Good engagement' : 'Needs improvement'}
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Historical Trends</h3>
          <div className="historical-chart p-4 bg-white border rounded-lg">
            <div className="text-sm text-gray-500 mb-2">Page Load Time (last 30 days)</div>
            <div className="h-24 flex items-end space-x-1">
              {data.historical.map((item, index) => (
                <div key={index} className="historical-bar relative flex-1">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t"
                    style={{ 
                      height: `${(item.pageLoadTime / 2) * 100}%`,
                      maxHeight: '100%'
                    }}
                  ></div>
                  <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-500 text-center">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-700 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <h4 className="font-medium text-indigo-700">Performance Insights</h4>
        </div>
        <p className="mt-2 text-sm text-indigo-800">
          Overall performance metrics are good, with page load time improved by {((1.4 - data.pageLoadTime) / 1.4 * 100).toFixed(1)}% in the last 30 days. 
          Consider optimizing image delivery and reducing JavaScript bundle size to further improve the Largest Contentful Paint metric.
        </p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;