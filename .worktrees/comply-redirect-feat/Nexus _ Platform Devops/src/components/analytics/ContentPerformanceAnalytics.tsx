import React from 'react';

interface ContentData {
  topPerformingPages: {
    path: string;
    views: number;
    avgTimeOnPage: number;
    conversionRate: number;
  }[];
  contentQualityScores: {
    overall: number;
    readability: number;
    originality: number;
    engagement: number;
    comprehensiveness: number;
  };
  keywordPerformance: {
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
  }[];
}

interface ContentPerformanceAnalyticsProps {
  data: ContentData;
}

/**
 * Content Performance Analytics Component
 * 
 * Analyzes and displays content performance metrics, including top-performing pages,
 * content quality scores, and keyword performance data.
 */
const ContentPerformanceAnalytics: React.FC<ContentPerformanceAnalyticsProps> = ({ data }) => {
  // Helper function to format path for display
  const formatPath = (path: string): string => {
    // Remove leading slash and replace remaining slashes with ' › '
    return path.replace(/^\//, '').replace(/\//g, ' › ');
  };
  
  // Helper function to get color class based on quality score
  const getQualityScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 50) return 'bg-orange-400';
    return 'bg-red-400';
  };
  
  // Helper function to get color class based on SERP position
  const getPositionColor = (position: number): string => {
    if (position <= 3) return 'text-green-600';
    if (position <= 5) return 'text-indigo-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Calculate click-through rate (CTR) for each keyword
  const calculateCTR = (clicks: number, impressions: number): string => {
    if (impressions === 0) return '0.0%';
    return ((clicks / impressions) * 100).toFixed(1) + '%';
  };
  
  return (
    <div className="content-performance-analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Pages */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Top Performing Pages</h3>
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.topPerformingPages.map((page, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="font-medium text-indigo-600 truncate max-w-xs">{formatPath(page.path)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(page.avgTimeOnPage / 60)}:{(page.avgTimeOnPage % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{page.conversionRate.toFixed(1)}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Keyword Performance</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.keywordPerformance.map((keyword, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium truncate max-w-xs">{keyword.keyword}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getPositionColor(keyword.position)}`}>
                            #{keyword.position}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {keyword.clicks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {calculateCTR(keyword.clicks, keyword.impressions)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Quality Scores */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Content Quality</h3>
          <div className="bg-white border rounded-lg p-4">
            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    fill="currentColor"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    strokeWidth="0"
                  />
                  <path
                    className="text-indigo-600"
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeWidth="0"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    strokeDasharray={`${data.contentQualityScores.overall}, 100`}
                  />
                  <text
                    x="18"
                    y="18"
                    className="text-3xl font-semibold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#4F46E5"
                  >
                    {data.contentQualityScores.overall}
                  </text>
                  <text
                    x="18"
                    y="24"
                    className="text-xs"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6B7280"
                  >
                    /100
                  </text>
                </svg>
              </div>
              <div className="mt-2 text-lg font-semibold">Overall Content Quality</div>
            </div>
            
            {/* Individual Scores */}
            <div className="grid grid-cols-2 gap-4">
              {/* Readability */}
              <div className="quality-score p-3 border rounded-lg">
                <div className="text-sm font-medium">Readability</div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${getQualityScoreColor(data.contentQualityScores.readability)}`}
                      style={{ width: `${data.contentQualityScores.readability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.contentQualityScores.readability}</span>
                </div>
              </div>
              
              {/* Originality */}
              <div className="quality-score p-3 border rounded-lg">
                <div className="text-sm font-medium">Originality</div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${getQualityScoreColor(data.contentQualityScores.originality)}`}
                      style={{ width: `${data.contentQualityScores.originality}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.contentQualityScores.originality}</span>
                </div>
              </div>
              
              {/* Engagement */}
              <div className="quality-score p-3 border rounded-lg">
                <div className="text-sm font-medium">Engagement</div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${getQualityScoreColor(data.contentQualityScores.engagement)}`}
                      style={{ width: `${data.contentQualityScores.engagement}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.contentQualityScores.engagement}</span>
                </div>
              </div>
              
              {/* Comprehensiveness */}
              <div className="quality-score p-3 border rounded-lg">
                <div className="text-sm font-medium">Comprehensiveness</div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${getQualityScoreColor(data.contentQualityScores.comprehensiveness)}`}
                      style={{ width: `${data.contentQualityScores.comprehensiveness}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{data.contentQualityScores.comprehensiveness}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white border rounded-lg p-4">
            <h4 className="font-medium text-lg mb-3">Content Improvement Recommendations</h4>
            <div className="space-y-4">
              <div className="recommendation p-3 bg-indigo-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-indigo-800">Top Performing Content</h5>
                    <p className="mt-1 text-sm text-indigo-700">
                      "AI Implementation Guide" is your most successful content. Consider creating more comprehensive guides in this format.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="recommendation p-3 bg-yellow-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-yellow-800">Content Gap</h5>
                    <p className="mt-1 text-sm text-yellow-700">
                      You're ranking #5 for "machine learning implementation" but lack in-depth content focused specifically on this topic.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="recommendation p-3 bg-green-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-green-800">Optimization Opportunity</h5>
                    <p className="mt-1 text-sm text-green-700">
                      The product page has a lower quality score (71) but high conversion rate. Improving content quality could significantly boost performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPerformanceAnalytics;