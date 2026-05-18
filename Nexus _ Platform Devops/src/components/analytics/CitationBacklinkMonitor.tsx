import React from 'react';

interface CitationData {
  totalBacklinks: number;
  newBacklinksThisMonth: number;
  totalCitations: number;
  domainAuthority: number;
  pageAuthority: {
    home: number;
    blog: number;
    product: number;
    about: number;
  };
  topReferrers: {
    domain: string;
    backlinks: number;
    authority: number;
  }[];
}

interface CitationBacklinkMonitorProps {
  data: CitationData;
}

/**
 * Citation & Backlink Monitor Component
 * 
 * Tracks and displays backlinks, citations, domain authority, and top referrers
 * to help monitor the website's visibility and authority.
 */
const CitationBacklinkMonitor: React.FC<CitationBacklinkMonitorProps> = ({ data }) => {
  // Get color class based on authority score
  const getAuthorityColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };
  
  return (
    <div className="citation-backlink-monitor">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-wrap -mx-2">
            {/* Total Backlinks */}
            <div className="w-1/2 px-2 mb-4">
              <div className="p-4 bg-white border rounded-lg h-full">
                <div className="text-sm text-gray-500">Total Backlinks</div>
                <div className="text-3xl font-bold mt-1">{data.totalBacklinks.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-1">
                  +{data.newBacklinksThisMonth} this month
                </div>
              </div>
            </div>
            
            {/* Total Citations */}
            <div className="w-1/2 px-2 mb-4">
              <div className="p-4 bg-white border rounded-lg h-full">
                <div className="text-sm text-gray-500">Total Citations</div>
                <div className="text-3xl font-bold mt-1">{data.totalCitations}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Academic & industry mentions
                </div>
              </div>
            </div>
            
            {/* Domain Authority */}
            <div className="w-full px-2 mb-4">
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Domain Authority</div>
                    <div className="text-3xl font-bold mt-1">{data.domainAuthority}/100</div>
                  </div>
                  <div className="relative h-16 w-16">
                    {/* Authority gauge visual */}
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <path
                        className="text-gray-200"
                        fill="currentColor"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeWidth="0"
                      />
                      <path
                        className={getAuthorityColor(data.domainAuthority)}
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeWidth="0"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDasharray={`${data.domainAuthority}, 100`}
                      />
                      <text
                        x="18"
                        y="21"
                        className="text-xs font-semibold"
                        textAnchor="middle"
                        fill="#666"
                      >
                        {data.domainAuthority}
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-medium">Page Authority</div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <div className="text-center">
                      <div className={`font-semibold ${getAuthorityColor(data.pageAuthority.home)}`}>
                        {data.pageAuthority.home}
                      </div>
                      <div className="text-xs text-gray-500">Home</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${getAuthorityColor(data.pageAuthority.blog)}`}>
                        {data.pageAuthority.blog}
                      </div>
                      <div className="text-xs text-gray-500">Blog</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${getAuthorityColor(data.pageAuthority.product)}`}>
                        {data.pageAuthority.product}
                      </div>
                      <div className="text-xs text-gray-500">Product</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${getAuthorityColor(data.pageAuthority.about)}`}>
                        {data.pageAuthority.about}
                      </div>
                      <div className="text-xs text-gray-500">About</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
              </svg>
              Citation Strategy Tips
            </h4>
            <ul className="mt-2 text-sm text-indigo-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Focus on building quality backlinks from <strong>industry-news.com</strong> and <strong>tech-review.org</strong> with guest articles.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Increase academic citations by publishing more case studies and research data on AI implementations.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The product page authority is lower than other pages. Consider improving its content and internal linking structure.
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Top Referring Domains</h3>
          <div className="overflow-hidden bg-white border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backlinks
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Authority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topReferrers.map((referrer, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{referrer.domain}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{referrer.backlinks}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getAuthorityColor(referrer.authority)}`}>
                        {referrer.authority}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Citations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium text-indigo-600">Journal of AI Research</div>
                  <div className="text-sm text-gray-500">Aug 12, 2025</div>
                </div>
                <p className="text-sm mt-1">"Atlas AI's implementation of federated learning demonstrates significant improvements in privacy preservation while maintaining model accuracy."</p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Cited in:</span> "Advances in Privacy-Preserving AI Techniques"
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium text-indigo-600">Enterprise Tech Today</div>
                  <div className="text-sm text-gray-500">Aug 5, 2025</div>
                </div>
                <p className="text-sm mt-1">"Atlas AI's platform helped FinCorp reduce data processing time by 78% while increasing prediction accuracy by 23%."</p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Cited in:</span> "Top Enterprise AI Solutions of 2025"
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium text-indigo-600">Data Science Quarterly</div>
                  <div className="text-sm text-gray-500">Jul 28, 2025</div>
                </div>
                <p className="text-sm mt-1">"The novel approach to multi-modal learning presented by Atlas AI researchers demonstrates promising applications in cross-domain knowledge transfer."</p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Cited in:</span> "Multi-Modal Learning: Challenges and Opportunities"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationBacklinkMonitor;