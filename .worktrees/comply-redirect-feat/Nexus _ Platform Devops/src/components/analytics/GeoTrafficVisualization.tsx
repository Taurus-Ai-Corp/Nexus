import React from 'react';

interface GeoData {
  visitors: Record<string, number>;
  engagementByRegion: Record<string, number>;
  conversionByCountry: Record<string, number>;
}

interface GeoTrafficVisualizationProps {
  data: GeoData;
}

/**
 * Geographic Traffic Visualization Component
 * 
 * Visualizes website traffic by geographical regions, including visitor
 * distribution, engagement metrics, and conversion rates.
 */
const GeoTrafficVisualization: React.FC<GeoTrafficVisualizationProps> = ({ data }) => {
  // Helper function to get color based on value (for visitor distribution)
  const getVisitorPercentageColor = (percentage: number): string => {
    if (percentage >= 30) return 'bg-indigo-600';
    if (percentage >= 20) return 'bg-indigo-500';
    if (percentage >= 10) return 'bg-indigo-400';
    if (percentage >= 5) return 'bg-indigo-300';
    return 'bg-indigo-200';
  };
  
  // Sort countries by visitor percentage (descending)
  const sortedVisitorData = Object.entries(data.visitors).sort((a, b) => b[1] - a[1]);
  
  // Prepare data for the map chart (in a real app, this would use a mapping library)
  const worldMapData = sortedVisitorData.reduce((acc, [country, percentage]) => {
    acc[country] = percentage;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="geo-traffic-visualization">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visitor Distribution */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Visitor Distribution</h3>
          
          {/* World Map Visualization (simplified for this demo) */}
          <div className="world-map bg-white border rounded-lg p-4 mb-6">
            <div className="text-center text-sm text-gray-500 mb-3">Visitor Distribution by Country</div>
            <div className="relative h-64 bg-gray-100 rounded overflow-hidden">
              {/* This is a placeholder for what would be an actual map in a real implementation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
                  </svg>
                  <p>Interactive world map with heat map visualization would be displayed here.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visitor Distribution Bar Chart */}
          <div className="visitor-chart bg-white border rounded-lg p-4">
            <div className="space-y-3">
              {sortedVisitorData.map(([country, percentage], index) => (
                <div key={index} className="visitor-bar">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="font-medium">{country}</div>
                    <div className="text-gray-500">{percentage}%</div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className={`h-full rounded-full ${getVisitorPercentageColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Engagement & Conversion Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
          
          {/* Regional Engagement */}
          <div className="engagement-metrics bg-white border rounded-lg p-4 mb-6">
            <div className="text-sm font-medium mb-3">Avg. Session Duration by Region</div>
            <div className="space-y-4">
              {Object.entries(data.engagementByRegion).map(([region, duration], index) => (
                <div key={index} className="engagement-item">
                  <div className="text-sm mb-1">{region}</div>
                  <div className="flex items-center">
                    <div className="flex-grow h-2 bg-gray-100 rounded-full mr-2">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(duration / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">{duration.toFixed(1)} min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Conversion Rates */}
          <div className="conversion-metrics bg-white border rounded-lg p-4">
            <div className="text-sm font-medium mb-3">Conversion Rate by Country</div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.conversionByCountry)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([country, rate], index) => (
                <div key={index} className="conversion-item p-2 border rounded">
                  <div className="text-xs text-gray-500">{country}</div>
                  <div className="text-lg font-semibold text-indigo-600">{rate.toFixed(1)}%</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                </svg>
                <span>Global avg. conversion: 2.4%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-center text-yellow-800 text-sm font-medium">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Opportunity Alert
            </div>
            <p className="mt-1 text-sm text-yellow-700">
              Low conversion rates in emerging markets (BR, IN). Consider localizing content and pricing for these regions to improve performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoTrafficVisualization;