import React, { useEffect, useState } from 'react';
import { analyzeContentQuality, ContentAnalysisResult } from '../../utils/contentQualityAnalyzer';

interface ContentQualityScoreProps {
  content: string;
  showDetails?: boolean;
  className?: string;
}

const ContentQualityScore: React.FC<ContentQualityScoreProps> = ({
  content,
  showDetails = false,
  className = '',
}) => {
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const analyzeContent = async () => {
      setIsLoading(true);
      try {
        const result = await analyzeContentQuality(content);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (content) {
      analyzeContent();
    }
  }, [content]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderScoreBadge = () => {
    if (!analysis) return null;
    
    const scoreColor = getScoreColor(analysis.overallScore);
    
    return (
      <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${scoreColor} bg-opacity-10 bg-current`}>
        <span className="mr-1">Quality Score:</span>
        <span className="font-bold">{analysis.overallScore}</span>
      </div>
    );
  };

  const renderDetails = () => {
    if (!analysis || !showDetails) return null;

    return (
      <div className="mt-3 text-sm">
        <h4 className="font-medium mb-2">Analysis Details</h4>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>Readability:</span>
            <span className={getScoreColor(analysis.readabilityScore)}>
              {analysis.readabilityScore}/100
            </span>
          </li>
          <li className="flex justify-between">
            <span>Originality:</span>
            <span className={getScoreColor(analysis.originalityScore)}>
              {analysis.originalityScore}/100
            </span>
          </li>
          <li className="flex justify-between">
            <span>Comprehensiveness:</span>
            <span className={getScoreColor(analysis.comprehensivenessScore)}>
              {analysis.comprehensivenessScore}/100
            </span>
          </li>
          <li className="flex justify-between">
            <span>Engagement:</span>
            <span className={getScoreColor(analysis.engagementScore)}>
              {analysis.engagementScore}/100
            </span>
          </li>
        </ul>
        
        {analysis.improvementSuggestions.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-1">Suggestions for Improvement</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.improvementSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className={`animate-pulse h-6 w-32 bg-gray-200 rounded ${className}`}></div>;
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className={`content-quality-score ${className}`}>
      {renderScoreBadge()}
      {renderDetails()}
    </div>
  );
};

export default ContentQualityScore;