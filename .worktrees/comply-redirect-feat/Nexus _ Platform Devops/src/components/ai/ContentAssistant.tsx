import React, { useState } from 'react';
import KeywordOptimizer from './KeywordOptimizer';
import HeadlineAnalyzer from './HeadlineAnalyzer';
import ContentGenerator from './ContentGenerator';
import SeoScoreCalculator from './SeoScoreCalculator';

type AssistantTab = 'keywords' | 'headlines' | 'generator' | 'seo';

interface ContentAssistantProps {
  className?: string;
  defaultTab?: AssistantTab;
}

/**
 * Content Assistant Component
 * 
 * A comprehensive AI-powered tool for content optimization, providing keyword suggestions,
 * headline analysis, content generation templates, and SEO scoring.
 */
const ContentAssistant: React.FC<ContentAssistantProps> = ({
  className = '',
  defaultTab = 'keywords'
}) => {
  const [activeTab, setActiveTab] = useState<AssistantTab>(defaultTab);
  const [content, setContent] = useState<string>('');
  
  // Tab button renderer
  const renderTabButton = (tab: AssistantTab, label: string, icon: React.ReactNode) => {
    const isActive = activeTab === tab;
    const baseClasses = 'flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200';
    const activeClasses = 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500';
    const inactiveClasses = 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50';
    
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </button>
    );
  };
  
  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'keywords':
        return <KeywordOptimizer content={content} onContentChange={setContent} />;
      case 'headlines':
        return <HeadlineAnalyzer />;
      case 'generator':
        return <ContentGenerator />;
      case 'seo':
        return <SeoScoreCalculator content={content} />;
      default:
        return <KeywordOptimizer content={content} onContentChange={setContent} />;
    }
  };
  
  return (
    <div className={`content-assistant ${className}`}>
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="flex border-b">
          {renderTabButton(
            'keywords',
            'Keyword Optimizer',
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          )}
          {renderTabButton(
            'headlines',
            'Headline Analyzer',
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
          )}
          {renderTabButton(
            'generator',
            'Content Generator',
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          )}
          {renderTabButton(
            'seo',
            'SEO Score',
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
          )}
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ContentAssistant;