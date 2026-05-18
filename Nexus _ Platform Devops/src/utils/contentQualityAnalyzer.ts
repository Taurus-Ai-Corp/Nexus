/**
 * Content Quality Analyzer
 * 
 * This utility provides functions to analyze and score content quality
 * based on various factors including readability, originality,
 * comprehensiveness, and engagement potential.
 */

export interface ContentAnalysisResult {
  overallScore: number;
  readabilityScore: number;
  originalityScore: number;
  comprehensivenessScore: number;
  engagementScore: number;
  improvementSuggestions: string[];
}

/**
 * Analyzes text content and returns quality metrics
 * @param content - The text content to analyze
 * @returns ContentAnalysisResult with scores and suggestions
 */
export const analyzeContentQuality = async (content: string): Promise<ContentAnalysisResult> => {
  // For a real implementation, this would connect to an AI service
  // or use more sophisticated algorithms to analyze the content
  
  // In this demo version, we'll use some simple heuristics
  const wordCount = countWords(content);
  const avgSentenceLength = calculateAvgSentenceLength(content);
  const uniqueWordRatio = calculateUniqueWordRatio(content);
  const keywordDensity = calculateKeywordDensity(content);
  
  // Calculate scores based on our simple metrics
  const readabilityScore = calculateReadabilityScore(content, avgSentenceLength);
  const originalityScore = Math.round(uniqueWordRatio * 100);
  const comprehensivenessScore = calculateComprehensivenessScore(wordCount, keywordDensity);
  const engagementScore = calculateEngagementScore(content);
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (readabilityScore * 0.3) +
    (originalityScore * 0.2) +
    (comprehensivenessScore * 0.3) +
    (engagementScore * 0.2)
  );
  
  // Generate improvement suggestions
  const suggestions = generateImprovementSuggestions(
    content,
    readabilityScore,
    originalityScore,
    comprehensivenessScore,
    engagementScore,
    wordCount,
    avgSentenceLength
  );
  
  // Return the complete analysis
  return {
    overallScore,
    readabilityScore,
    originalityScore,
    comprehensivenessScore,
    engagementScore,
    improvementSuggestions: suggestions,
  };
};

/**
 * Counts the number of words in a text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculates the average sentence length
 */
function calculateAvgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const totalWords = sentences.reduce((sum, sentence) => {
    return sum + sentence.split(/\s+/).filter(word => word.length > 0).length;
  }, 0);
  
  return totalWords / sentences.length;
}

/**
 * Calculates the ratio of unique words to total words
 */
function calculateUniqueWordRatio(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return 0;
  
  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
}

/**
 * Analyzes keyword density in the content
 */
function calculateKeywordDensity(text: string): Record<string, number> {
  // This is a simplified version - would be more sophisticated in production
  const words = text.toLowerCase().split(/\s+/).filter(word => {
    // Filter out common stop words and short words
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    return word.length > 3 && !stopWords.includes(word);
  });
  
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return wordCount;
}

/**
 * Calculates a readability score based on text complexity
 */
function calculateReadabilityScore(text: string, avgSentenceLength: number): number {
  // This is a simplified version of readability scoring
  // A real implementation would use established algorithms like Flesch-Kincaid
  
  // Penalize very long sentences
  let sentenceLengthScore = 100;
  if (avgSentenceLength > 25) {
    sentenceLengthScore -= (avgSentenceLength - 25) * 2;
  } else if (avgSentenceLength < 10) {
    sentenceLengthScore -= (10 - avgSentenceLength) * 3;
  }
  
  // Check for complex words
  const complexWordRatio = text.split(/\s+/).filter(word => word.length > 6).length / countWords(text);
  const complexityScore = 100 - (complexWordRatio * 100);
  
  // Check for passive voice (simplified)
  const passiveVoiceIndicators = [
    'is being', 'are being', 'was being', 'were being',
    'has been', 'have been', 'had been',
    'will be', 'will have been'
  ];
  
  let passiveVoiceCount = 0;
  passiveVoiceIndicators.forEach(indicator => {
    const regex = new RegExp(indicator, 'gi');
    const matches = text.match(regex);
    if (matches) {
      passiveVoiceCount += matches.length;
    }
  });
  
  const passiveVoiceScore = 100 - (passiveVoiceCount * 5);
  
  // Calculate the final readability score
  return Math.min(100, Math.max(0, Math.round(
    (sentenceLengthScore * 0.4) +
    (complexityScore * 0.4) +
    (passiveVoiceScore * 0.2)
  )));
}

/**
 * Calculates a comprehensiveness score based on word count and keyword coverage
 */
function calculateComprehensivenessScore(wordCount: number, keywordDensity: Record<string, number>): number {
  // Base score on content length
  let lengthScore = 0;
  if (wordCount > 1500) {
    lengthScore = 100;
  } else if (wordCount > 1000) {
    lengthScore = 85;
  } else if (wordCount > 750) {
    lengthScore = 70;
  } else if (wordCount > 500) {
    lengthScore = 55;
  } else if (wordCount > 300) {
    lengthScore = 40;
  } else if (wordCount > 100) {
    lengthScore = 25;
  } else {
    lengthScore = 10;
  }
  
  // Keyword variety score
  const keywordCount = Object.keys(keywordDensity).length;
  const keywordVarietyScore = Math.min(100, keywordCount * 3);
  
  // Calculate keyword distribution
  const values = Object.values(keywordDensity);
  const keywordDistributionScore = values.length > 0 ?
    100 - (Math.max(...values) / wordCount * 1000) :
    0;
  
  return Math.min(100, Math.max(0, Math.round(
    (lengthScore * 0.5) +
    (keywordVarietyScore * 0.3) +
    (keywordDistributionScore * 0.2)
  )));
}

/**
 * Calculates an engagement score based on various factors
 */
function calculateEngagementScore(text: string): number {
  // Check for questions (audience engagement)
  const questions = (text.match(/\?/g) || []).length;
  const questionScore = Math.min(100, questions * 20);
  
  // Check for exclamations (enthusiasm)
  const exclamations = (text.match(/!/g) || []).length;
  const exclamationScore = Math.min(100, exclamations * 10);
  
  // Check for storytelling elements
  const storyIndicators = [
    'first', 'then', 'next', 'finally', 'last',
    'beginning', 'end',
    'challenge', 'solution',
    'problem', 'solved',
  ];
  
  let storyElementCount = 0;
  storyIndicators.forEach(indicator => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      storyElementCount += matches.length;
    }
  });
  
  const storyScore = Math.min(100, storyElementCount * 10);
  
  // Check for personal pronouns (relatability)
  const personalPronouns = ['I', 'we', 'you', 'your', 'our'];
  let pronounCount = 0;
  
  personalPronouns.forEach(pronoun => {
    const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      pronounCount += matches.length;
    }
  });
  
  const pronounScore = Math.min(100, (pronounCount / countWords(text)) * 500);
  
  // Calculate the final engagement score
  return Math.min(100, Math.max(0, Math.round(
    (questionScore * 0.25) +
    (exclamationScore * 0.15) +
    (storyScore * 0.3) +
    (pronounScore * 0.3)
  )));
}

/**
 * Generates improvement suggestions based on the scores
 */
function generateImprovementSuggestions(
  content: string,
  readabilityScore: number,
  originalityScore: number,
  comprehensivenessScore: number,
  engagementScore: number,
  wordCount: number,
  avgSentenceLength: number
): string[] {
  const suggestions: string[] = [];
  
  // Readability suggestions
  if (readabilityScore < 70) {
    if (avgSentenceLength > 25) {
      suggestions.push('Consider breaking long sentences into shorter ones to improve readability.');
    }
    
    const complexWords = content.split(/\s+/).filter(word => word.length > 6).length;
    if (complexWords / wordCount > 0.2) {
      suggestions.push('Using simpler language may make your content easier to understand.');
    }
    
    const passiveVoiceIndicators = [
      'is being', 'are being', 'was being', 'were being',
      'has been', 'have been', 'had been',
      'will be', 'will have been'
    ];
    
    let hasPassiveVoice = false;
    for (const indicator of passiveVoiceIndicators) {
      if (content.toLowerCase().includes(indicator)) {
        hasPassiveVoice = true;
        break;
      }
    }
    
    if (hasPassiveVoice) {
      suggestions.push('Consider using active voice instead of passive voice for clearer communication.');
    }
  }
  
  // Originality suggestions
  if (originalityScore < 70) {
    suggestions.push('Try using more varied vocabulary to make your content more distinctive.');
  }
  
  // Comprehensiveness suggestions
  if (comprehensivenessScore < 70) {
    if (wordCount < 500) {
      suggestions.push('Consider expanding your content with more details and examples.');
    }
    
    // Check for subheadings
    const headingMatches = content.match(/#{2,4}\s.+/g);
    if (!headingMatches || headingMatches.length < 2) {
      suggestions.push('Adding subheadings would help organize your content and improve its structure.');
    }
  }
  
  // Engagement suggestions
  if (engagementScore < 70) {
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount < 2) {
      suggestions.push('Including questions can increase reader engagement and encourage reflection.');
    }
    
    let hasPersonalPronouns = false;
    ['you', 'your', 'we', 'our'].forEach(pronoun => {
      if (content.toLowerCase().includes(` ${pronoun} `)) {
        hasPersonalPronouns = true;
      }
    });
    
    if (!hasPersonalPronouns) {
      suggestions.push('Using more personal pronouns (you, your, we, our) can create a stronger connection with readers.');
    }
    
    if (!content.includes('example') && !content.includes('instance') && !content.includes('such as')) {
      suggestions.push('Including specific examples would make your content more relatable and practical.');
    }
  }
  
  return suggestions;
}
