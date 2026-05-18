import React, { useState, useEffect } from 'react';

interface KeywordOptimizerProps {
  content: string;
  onContentChange: (content: string) => void;
}

interface KeywordSuggestion {
  keyword: string;
  relevance: number; // 0-100
  volume: number; // 0-100
  competition: number; // 0-100
  difficulty: number; // 0-100
}

interface KeywordDensity {
  keyword: string;
  count: number;
  density: number; // percentage
  status: 'low' | 'optimal' | 'high';
}

/**
 * Keyword Optimizer Component
 * 
 * Analyzes content for keyword usage and provides optimization suggestions
 * based on relevance, search volume, and competition metrics.
 */
const KeywordOptimizer: React.FC<KeywordOptimizerProps> = ({
  content,
  onContentChange
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [targetKeyword, setTargetKeyword] = useState<string>('');
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [keywordDensities, setKeywordDensities] = useState<KeywordDensity[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  // Analyze content when target keyword changes or on demand
  const analyzeContent = () => {
    if (!content) return;
    
    setIsAnalyzing(true);
    
    // In a real implementation, this would call an AI service or API
    // Here we'll simulate a delay and generate mock data
    setTimeout(() => {
      // Extract topic from content (simplified)
      const topic = targetKeyword || extractTopic(content);
      
      // Generate mock keyword suggestions based on topic
      const suggestions = generateKeywordSuggestions(topic);
      setKeywordSuggestions(suggestions);
      
      // Calculate keyword densities
      const densities = calculateKeywordDensities(content, [
        targetKeyword, 
        ...selectedKeywords, 
        ...suggestions.slice(0, 3).map(s => s.keyword)
      ].filter(Boolean));
      setKeywordDensities(densities);
      
      setIsAnalyzing(false);
    }, 1000);
  };
  
  // Effect to run analysis when component mounts or content changes significantly
  useEffect(() => {
    if (content.length > 50) {
      analyzeContent();
    }
  }, []);
  
  // Helper function to extract topic from content
  const extractTopic = (text: string): string => {
    // This is a simplified topic extraction algorithm
    // In a real implementation, this would use NLP or call an AI service
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    
    // Count word frequencies, skipping common words
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    words.forEach(word => {
      if (word.length > 3 && !stopWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Find the most frequent meaningful word
    let mostFrequent = '';
    let highestFreq = 0;
    
    Object.entries(wordFreq).forEach(([word, freq]) => {
      if (freq > highestFreq) {
        mostFrequent = word;
        highestFreq = freq;
      }
    });
    
    return mostFrequent;
  };
  
  // Helper function to generate mock keyword suggestions
  const generateKeywordSuggestions = (topic: string): KeywordSuggestion[] => {
    if (!topic) return [];
    
    // In a real implementation, these would come from a keyword research API
    const baseKeywords = [
      { keyword: `${topic} software`, base: 80 },
      { keyword: `${topic} solutions`, base: 75 },
      { keyword: `${topic} platform`, base: 70 },
      { keyword: `${topic} services`, base: 65 },
      { keyword: `${topic} technology`, base: 60 },
      { keyword: `best ${topic} tools`, base: 55 },
      { keyword: `${topic} for business`, base: 50 },
      { keyword: `enterprise ${topic}`, base: 45 },
      { keyword: `${topic} implementation`, base: 40 },
      { keyword: `${topic} benefits`, base: 35 },
    ];
    
    // Add some randomness to the metrics
    return baseKeywords.map(item => ({
      keyword: item.keyword,
      relevance: Math.min(100, Math.max(0, item.base + Math.floor(Math.random() * 20 - 10))),
      volume: Math.min(100, Math.max(0, item.base - 10 + Math.floor(Math.random() * 20))),
      competition: Math.min(100, Math.max(0, 100 - item.base + Math.floor(Math.random() * 20 - 10))),
      difficulty: Math.min(100, Math.max(0, 110 - item.base + Math.floor(Math.random() * 20 - 10)))
    }));
  };
  
  // Helper function to calculate keyword densities
  const calculateKeywordDensities = (text: string, keywords: string[]): KeywordDensity[] => {
    const cleanText = text.toLowerCase();
    const totalWords = cleanText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (totalWords === 0) return [];
    
    return keywords.filter(Boolean).map(keyword => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const matches = cleanText.match(regex);
      const count = matches ? matches.length : 0;
      const density = (count / totalWords) * 100;
      
      let status: 'low' | 'optimal' | 'high' = 'low';
      if (density > 2.5) {
        status = 'high';
      } else if (density >= 0.5) {
        status = 'optimal';
      }
      
      return {
        keyword,
        count,
        density,
        status
      };
    });
  };
  
  // Handler for toggling a keyword selection
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };
  
  // Get color for density status
  const getDensityStatusColor = (status: 'low' | 'optimal' | 'high'): string => {
    switch (status) {
      case 'low': return 'text-yellow-600';
      case 'optimal': return 'text-green-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="keyword-optimizer">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content to Analyze
        </label>
        <textarea
          id="content"
          className="w-full h-40 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Paste your content here to analyze keyword usage and get optimization suggestions..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-grow">
          <label htmlFor="target-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Target Keyword/Phrase
          </label>
          <div className="flex">
            <input
              id="target-keyword"
              type="text"
              className="flex-grow px-3 py-2 text-gray-700 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your primary keyword or topic"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={analyzeContent}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keyword Suggestions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Keyword Suggestions</h3>
          {isAnalyzing ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : keywordSuggestions.length > 0 ? (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Relevance
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywordSuggestions.map((suggestion, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedKeywords.includes(suggestion.keyword) ? 'bg-indigo-50' : ''}`}
                      onClick={() => toggleKeywordSelection(suggestion.keyword)}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedKeywords.includes(suggestion.keyword)}
                            onChange={() => {}}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900">{suggestion.keyword}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${suggestion.relevance}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${suggestion.volume}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-500 h-1.5 rounded-full" 
                            style={{ width: `${suggestion.difficulty}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Enter your content and target keyword to get suggestions
            </div>
          )}
        </div>
        
        {/* Keyword Density Analysis */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Keyword Density Analysis</h3>
          {isAnalyzing ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : keywordDensities.length > 0 ? (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Density
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywordDensities.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.keyword}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.count}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.density.toFixed(2)}%</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDensityStatusColor(item.status)} bg-opacity-10 bg-current`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Keyword density data will appear here
            </div>
          )}
          
          {keywordDensities.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">Optimization Tips</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Aim for a keyword density between 0.5% and 2.5% for your target keywords</li>
                <li>• Use your primary keyword in the title, first paragraph, and conclusion</li>
                <li>• Include semantically related keywords for more comprehensive coverage</li>
                <li>• Avoid keyword stuffing, which can negatively impact readability and rankings</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordOptimizer;