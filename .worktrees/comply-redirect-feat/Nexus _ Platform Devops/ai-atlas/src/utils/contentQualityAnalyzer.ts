/**
 * ContentQualityAnalyzer
 * Provides utilities for analyzing and improving content quality,
 * readability, SEO optimization, and tracking citations.
 */

// Content quality score thresholds
export enum QualityLevel {
  Poor = 'poor',
  Fair = 'fair',
  Good = 'good',
  Excellent = 'excellent'
}

// Readability metrics (based on popular formulas)
export enum ReadabilityFormula {
  FleschKincaid = 'flesch_kincaid',
  GunningFog = 'gunning_fog',
  SMOG = 'smog',
  ColemanLiau = 'coleman_liau',
  AutomatedReadability = 'automated_readability'
}

// Content types for analysis
export enum ContentType {
  BlogPost = 'blog_post',
  ProductDescription = 'product_description',
  LandingPage = 'landing_page',
  EmailCampaign = 'email_campaign',
  SocialMediaPost = 'social_media_post',
  PressRelease = 'press_release',
  WhitePaper = 'white_paper'
}

// Citation source types
export enum CitationSourceType {
  Website = 'website',
  Book = 'book',
  Journal = 'journal',
  Video = 'video',
  Podcast = 'podcast',
  SocialMedia = 'social_media',
  Other = 'other'
}

// Citation data structure
export interface Citation {
  id: string;
  url?: string;
  title: string;
  author?: string;
  date?: string;
  sourceType: CitationSourceType;
  publisherName?: string;
  description?: string;
  quotedText?: string;
  authorityScore?: number; // 0-100 scale based on domain authority and relevance
}

// Content quality analysis result
export interface ContentQualityAnalysis {
  overallScore: number; // 0-100
  qualityLevel: QualityLevel;
  readabilityScore: number; // 0-100
  readabilityLevel: string; // e.g., "Grade 8", "College", etc.
  keywordDensity: { [keyword: string]: number };
  topKeywords: string[];
  sentimentScore: number; // -1 to 1 (negative to positive)
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  paragraphCount: number;
  headingCount: number;
  subheadingCount: number;
  linkCount: number;
  imageCount: number;
  citations: Citation[];
  authorityScore: number; // Based on citations quality
  suggestions: ContentSuggestion[];
  contentType: ContentType;
  contentGaps: string[];
  competitorComparison?: CompetitorAnalysis[];
}

// Content improvement suggestion
export interface ContentSuggestion {
  type: 'readability' | 'seo' | 'engagement' | 'authority' | 'structure';
  priority: 'high' | 'medium' | 'low';
  description: string;
  improvement: string;
  examples?: string[];
}

// Competitor analysis data
export interface CompetitorAnalysis {
  url: string;
  title: string;
  wordCount: number;
  keywordDensity: { [keyword: string]: number };
  headingCount: number;
  linkCount: number;
  estimatedAuthorityScore: number;
  uniqueContent: string[];
}

/**
 * Calculate readability score using Flesch-Kincaid formula
 * Returns a score between 0-100, where higher means more readable
 */
export const calculateFleschKincaidScore = (text: string): number => {
  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Count sentences (simple approximation)
  const sentences = cleanText.split(/[.!?]+/).filter(Boolean);
  const sentenceCount = sentences.length;
  
  // Count words
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  // Count syllables (simplified approximation)
  let syllableCount = 0;
  words.forEach(word => {
    syllableCount += countSyllables(word);
  });
  
  // Avoid division by zero
  if (wordCount === 0 || sentenceCount === 0) {
    return 0;
  }
  
  // Flesch-Kincaid readability formula
  const score = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
  
  // Clamp score between 0 and 100
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Count syllables in a word (approximation)
 */
const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  // Handle special cases
  if (word.length <= 3) {
    return 1;
  }
  
  // Remove -es, -ed, -e endings
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  // Count vowel groups
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

/**
 * Get readability level description based on score
 */
export const getReadabilityLevel = (score: number): string => {
  if (score >= 90) return 'Very Easy (5th Grade)';
  if (score >= 80) return 'Easy (6th Grade)';
  if (score >= 70) return 'Fairly Easy (7th Grade)';
  if (score >= 60) return 'Standard (8-9th Grade)';
  if (score >= 50) return 'Fairly Difficult (10-12th Grade)';
  if (score >= 30) return 'Difficult (College Level)';
  return 'Very Difficult (College Graduate)';
};

/**
 * Calculate keyword density in content
 */
export const calculateKeywordDensity = (text: string, keywords: string[]): { [keyword: string]: number } => {
  const cleanText = text.replace(/<[^>]*>/g, '').toLowerCase();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  
  if (totalWords === 0) {
    return {};
  }
  
  const density: { [keyword: string]: number } = {};
  
  keywords.forEach(keyword => {
    // Handle multi-word keywords
    const keywordLower = keyword.toLowerCase();
    const keywordWords = keywordLower.split(/\s+/);
    
    if (keywordWords.length === 1) {
      // Single word keyword
      const count = words.filter(word => word === keywordLower).length;
      density[keyword] = (count / totalWords) * 100;
    } else {
      // Multi-word keyword
      const keywordRegex = new RegExp(keywordLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
      const matches = cleanText.match(keywordRegex) || [];
      density[keyword] = (matches.length / totalWords) * 100;
    }
  });
  
  return density;
};

/**
 * Extract top keywords from content
 */
export const extractTopKeywords = (text: string, count: number = 5): string[] => {
  const cleanText = text.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Remove common stop words
  const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'if', 'then', 'else', 'when', 'up', 'down', 'out', 'that', 'this', 'these', 'those', 'it', 'its'];
  
  // Split text into words and filter stop words
  const words = cleanText.split(/\s+/).filter(word => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    return cleanWord.length > 3 && !stopWords.includes(cleanWord);
  });
  
  // Count word frequency
  const wordFrequency: { [word: string]: number } = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    if (cleanWord) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top words
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(entry => entry[0]);
};

/**
 * Calculate simple sentiment score
 * Returns a score between -1 (negative) and 1 (positive)
 */
export const calculateSentiment = (text: string): number => {
  const cleanText = text.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Simple positive and negative word lists
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'wonderful', 'fantastic', 'terrific', 'outstanding', 'superb', 'best', 'better', 'improved', 'positive', 'perfect', 'superior', 'exceptional', 'delightful', 'pleasant', 'impressive', 'remarkable', 'satisfying', 'satisfactory', 'valuable', 'beneficial', 'effective', 'efficient', 'helpful', 'useful', 'successful', 'happy', 'glad', 'love', 'like', 'enjoy', 'recommend', 'innovative', 'creative', 'innovative', 'reliable', 'trusted', 'authentic'];
  
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'dreadful', 'unpleasant', 'disappointing', 'frustrating', 'annoying', 'irritating', 'worst', 'worse', 'negative', 'inferior', 'inadequate', 'mediocre', 'unsatisfactory', 'useless', 'unhelpful', 'ineffective', 'inefficient', 'unreliable', 'faulty', 'defective', 'broken', 'flawed', 'problematic', 'difficult', 'challenging', 'confusing', 'complicated', 'complex', 'hate', 'dislike', 'avoid', 'unfortunately', 'sadly', 'angry', 'upset', 'disappointed', 'fail', 'failure'];
  
  // Count positive and negative words
  const words = cleanText.split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (positiveWords.includes(cleanWord)) {
      positiveCount++;
    } else if (negativeWords.includes(cleanWord)) {
      negativeCount++;
    }
  });
  
  // Calculate sentiment score
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) {
    return 0; // Neutral
  }
  
  return (positiveCount - negativeCount) / totalSentimentWords;
};

/**
 * Count HTML elements in content
 */
export const countHtmlElements = (html: string): { headingCount: number, subheadingCount: number, linkCount: number, imageCount: number, paragraphCount: number } => {
  // Create a temporary DOM element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Count elements
  const headings = tempDiv.querySelectorAll('h1, h2');
  const subheadings = tempDiv.querySelectorAll('h3, h4, h5, h6');
  const links = tempDiv.querySelectorAll('a');
  const images = tempDiv.querySelectorAll('img');
  const paragraphs = tempDiv.querySelectorAll('p');
  
  return {
    headingCount: headings.length,
    subheadingCount: subheadings.length,
    linkCount: links.length,
    imageCount: images.length,
    paragraphCount: paragraphs.length
  };
};

/**
 * Extract citations from content
 */
export const extractCitations = (html: string): Citation[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const citations: Citation[] = [];
  
  // Extract citations from cite elements
  const citeElements = tempDiv.querySelectorAll('cite');
  citeElements.forEach((cite, index) => {
    citations.push({
      id: `cite-${index}`,
      title: cite.textContent || 'Unnamed Source',
      sourceType: CitationSourceType.Other,
      url: cite.getAttribute('data-url') || undefined,
      author: cite.getAttribute('data-author') || undefined,
      date: cite.getAttribute('data-date') || undefined,
      publisherName: cite.getAttribute('data-publisher') || undefined,
      quotedText: cite.getAttribute('data-quote') || undefined,
    });
  });
  
  // Extract citations from links with citation classes
  const citationLinks = tempDiv.querySelectorAll('a.citation, a[data-citation="true"]');
  citationLinks.forEach((link, index) => {
    citations.push({
      id: `link-citation-${index}`,
      title: link.getAttribute('title') || link.textContent || 'Linked Source',
      sourceType: getCitationTypeFromUrl(link.getAttribute('href') || ''),
      url: link.getAttribute('href') || undefined,
      author: link.getAttribute('data-author') || undefined,
      date: link.getAttribute('data-date') || undefined,
      publisherName: link.getAttribute('data-publisher') || undefined,
      quotedText: link.getAttribute('data-quote') || undefined,
    });
  });
  
  // Extract citations from blockquotes
  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach((blockquote, index) => {
    const citeElement = blockquote.querySelector('cite');
    const footerElement = blockquote.querySelector('footer');
    
    citations.push({
      id: `blockquote-${index}`,
      title: citeElement?.textContent || footerElement?.textContent || 'Quoted Source',
      sourceType: CitationSourceType.Other,
      url: blockquote.getAttribute('cite') || undefined,
      author: blockquote.getAttribute('data-author') || undefined,
      date: blockquote.getAttribute('data-date') || undefined,
      publisherName: blockquote.getAttribute('data-publisher') || undefined,
      quotedText: blockquote.textContent || undefined,
    });
  });
  
  return citations;
};

/**
 * Get citation type from URL
 */
const getCitationTypeFromUrl = (url: string): CitationSourceType => {
  if (!url) return CitationSourceType.Other;
  
  // Check for common website types
  if (url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('wistia.com')) {
    return CitationSourceType.Video;
  }
  
  if (url.includes('twitter.com') || url.includes('facebook.com') || url.includes('instagram.com') || url.includes('linkedin.com')) {
    return CitationSourceType.SocialMedia;
  }
  
  if (url.includes('spotify.com/show') || url.includes('podcasts.apple.com') || url.includes('anchor.fm')) {
    return CitationSourceType.Podcast;
  }
  
  if (url.includes('doi.org') || url.includes('jstor.org') || url.includes('researchgate.net') || url.includes('academia.edu')) {
    return CitationSourceType.Journal;
  }
  
  if (url.includes('books.google.com') || url.includes('amazon.com') || url.includes('goodreads.com')) {
    return CitationSourceType.Book;
  }
  
  return CitationSourceType.Website;
};

/**
 * Calculate authority score based on citations
 */
export const calculateAuthorityScore = (citations: Citation[]): number => {
  if (citations.length === 0) {
    return 0;
  }
  
  // Domain authority weights by source type
  const authorityWeights: { [key in CitationSourceType]: number } = {
    [CitationSourceType.Journal]: 1.0,
    [CitationSourceType.Book]: 0.9,
    [CitationSourceType.Website]: 0.7,
    [CitationSourceType.Video]: 0.6,
    [CitationSourceType.Podcast]: 0.6,
    [CitationSourceType.SocialMedia]: 0.4,
    [CitationSourceType.Other]: 0.5
  };
  
  // Calculate total weighted authority
  let totalAuthority = 0;
  
  citations.forEach(citation => {
    const baseWeight = authorityWeights[citation.sourceType];
    const individualAuthorityScore = citation.authorityScore || 50; // Default to middle score if not provided
    
    // Apply weights and normalize to 0-100 scale
    totalAuthority += baseWeight * (individualAuthorityScore / 100);
  });
  
  // Normalize total authority score to 0-100 scale
  const normalizedScore = (totalAuthority / citations.length) * 100;
  
  // Apply a bonus for having more citations (up to a reasonable limit)
  const citationCountBonus = Math.min(citations.length / 10, 1) * 15;
  
  // Calculate final score with bonus (capped at 100)
  return Math.min(normalizedScore + citationCountBonus, 100);
};

/**
 * Generate content improvement suggestions
 */
export const generateContentSuggestions = (analysis: Partial<ContentQualityAnalysis>): ContentSuggestion[] => {
  const suggestions: ContentSuggestion[] = [];
  
  // Readability suggestions
  if (analysis.readabilityScore && analysis.readabilityScore < 60) {
    suggestions.push({
      type: 'readability',
      priority: 'high',
      description: 'Content readability is challenging',
      improvement: 'Use shorter sentences and simpler language to improve readability',
      examples: [
        'Break long sentences into shorter ones',
        'Replace complex terms with simpler alternatives',
        'Use more familiar words when possible'
      ]
    });
  }
  
  // Heading structure suggestions
  if (analysis.headingCount === 0) {
    suggestions.push({
      type: 'structure',
      priority: 'high',
      description: 'No main headings found',
      improvement: 'Add clear headings (H1, H2) to structure your content',
      examples: [
        'Include a descriptive H1 title at the top',
        'Break content into logical sections with H2 headings'
      ]
    });
  } else if (analysis.subheadingCount === 0 && analysis.wordCount && analysis.wordCount > 300) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      description: 'Long content without subheadings',
      improvement: 'Add subheadings (H3, H4) to break up the content into more digestible sections',
      examples: [
        'Add H3 subheadings for each major point',
        'Use H4 headings for subsections within your main points'
      ]
    });
  }
  
  // Paragraph length suggestions
  if (analysis.wordCount && analysis.paragraphCount && (analysis.wordCount / analysis.paragraphCount > 100)) {
    suggestions.push({
      type: 'readability',
      priority: 'medium',
      description: 'Paragraphs are too long',
      improvement: 'Break up long paragraphs into smaller, more digestible chunks',
      examples: [
        'Aim for 2-4 sentences per paragraph',
        'Use line breaks between related thoughts',
        'Consider using bullet points for lists'
      ]
    });
  }
  
  // Authority suggestions
  if (!analysis.citations || analysis.citations.length === 0) {
    suggestions.push({
      type: 'authority',
      priority: 'medium',
      description: 'No citations or references found',
      improvement: 'Add credible citations to boost content authority',
      examples: [
        'Include links to authoritative sources',
        'Add quotes from industry experts',
        'Reference recent studies or statistics'
      ]
    });
  } else if (analysis.citations && analysis.citations.length < 3 && analysis.wordCount && analysis.wordCount > 800) {
    suggestions.push({
      type: 'authority',
      priority: 'low',
      description: 'Limited citations for in-depth content',
      improvement: 'Add more diverse sources to strengthen your claims',
      examples: [
        'Include sources from different perspectives',
        'Add statistical data to support key points',
        'Reference both recent and established sources'
      ]
    });
  }
  
  // Visual content suggestions
  if (analysis.imageCount === 0) {
    suggestions.push({
      type: 'engagement',
      priority: 'medium',
      description: 'No images or visual elements',
      improvement: 'Add relevant images, diagrams, or other visual elements to enhance engagement',
      examples: [
        'Include a featured image at the top',
        'Add diagrams to explain complex concepts',
        'Use charts to present data more effectively'
      ]
    });
  }
  
  // Link suggestions
  if (analysis.linkCount === 0 && analysis.wordCount && analysis.wordCount > 400) {
    suggestions.push({
      type: 'seo',
      priority: 'medium',
      description: 'No internal or external links',
      improvement: 'Add relevant internal and external links to improve SEO and provide additional value',
      examples: [
        'Link to related content on your site',
        'Reference authoritative external sources',
        'Add links to provide additional context'
      ]
    });
  }
  
  // Keyword optimization suggestions
  if (analysis.keywordDensity) {
    const topKeyword = Object.entries(analysis.keywordDensity).sort((a, b) => b[1] - a[1])[0];
    if (topKeyword && topKeyword[1] > 3) {
      suggestions.push({
        type: 'seo',
        priority: 'medium',
        description: `Keyword '${topKeyword[0]}' appears too frequently (${topKeyword[1].toFixed(1)}%)`,
        improvement: 'Reduce keyword density and use more variations to avoid keyword stuffing',
        examples: [
          'Use synonyms and related terms',
          'Rewrite sentences to avoid repetition',
          'Focus on natural language over keyword placement'
        ]
      });
    }
  }
  
  return suggestions;
};

/**
 * Analyze content quality
 */
export const analyzeContentQuality = (html: string, contentType: ContentType, targetKeywords: string[] = []): ContentQualityAnalysis => {
  // Get plain text for text-based analysis
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || '';
  
  // Count basic elements
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const elementCounts = countHtmlElements(html);
  
  // Calculate metrics
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  // Calculate readability
  const readabilityScore = calculateFleschKincaidScore(text);
  const readabilityLevel = getReadabilityLevel(readabilityScore);
  
  // Analyze keywords
  const topKeywords = extractTopKeywords(text);
  const allKeywords = [...targetKeywords, ...topKeywords];
  const keywordDensity = calculateKeywordDensity(text, allKeywords);
  
  // Calculate sentiment
  const sentimentScore = calculateSentiment(text);
  
  // Extract and analyze citations
  const citations = extractCitations(html);
  const authorityScore = calculateAuthorityScore(citations);
  
  // Calculate overall score (weighted components)
  let overallScore = 0;
  overallScore += readabilityScore * 0.25; // 25% weight for readability
  overallScore += authorityScore * 0.2; // 20% weight for authority
  overallScore += Math.max(0, Math.min(50 + sentimentScore * 25, 100)) * 0.15; // 15% weight for sentiment (normalized to 0-100)
  
  // Structure score (based on headings, links, images, etc.)
  let structureScore = 0;
  structureScore += elementCounts.headingCount > 0 ? 20 : 0;
  structureScore += elementCounts.subheadingCount > 0 ? 20 : 0;
  structureScore += elementCounts.imageCount > 0 ? 20 : 0;
  structureScore += elementCounts.linkCount > 0 ? 20 : 0;
  structureScore += wordCount > 300 ? 20 : (wordCount / 300) * 20;
  
  overallScore += structureScore * 0.2; // 20% weight for structure
  
  // Keyword optimization score
  let keywordScore = 0;
  if (targetKeywords.length > 0) {
    // Check if target keywords are present with reasonable density (0.5% to 2.5% is good)
    targetKeywords.forEach(keyword => {
      const density = keywordDensity[keyword] || 0;
      if (density > 0.5 && density < 2.5) {
        keywordScore += 100 / targetKeywords.length;
      } else if (density > 0 && density <= 0.5) {
        keywordScore += 50 / targetKeywords.length;
      } else if (density >= 2.5) {
        keywordScore += 70 / targetKeywords.length;
      }
    });
  } else {
    // No target keywords specified, assume reasonable keyword distribution
    keywordScore = 80;
  }
  
  overallScore += keywordScore * 0.2; // 20% weight for keyword optimization
  
  // Determine quality level
  let qualityLevel: QualityLevel;
  if (overallScore >= 85) {
    qualityLevel = QualityLevel.Excellent;
  } else if (overallScore >= 70) {
    qualityLevel = QualityLevel.Good;
  } else if (overallScore >= 50) {
    qualityLevel = QualityLevel.Fair;
  } else {
    qualityLevel = QualityLevel.Poor;
  }
  
  // Generate improvement suggestions
  const partialAnalysis: Partial<ContentQualityAnalysis> = {
    readabilityScore,
    wordCount,
    paragraphCount: elementCounts.paragraphCount,
    headingCount: elementCounts.headingCount,
    subheadingCount: elementCounts.subheadingCount,
    linkCount: elementCounts.linkCount,
    imageCount: elementCounts.imageCount,
    citations,
    keywordDensity
  };
  
  const suggestions = generateContentSuggestions(partialAnalysis);
  
  // Content gaps based on content type
  const contentGaps: string[] = [];
  
  switch (contentType) {
    case ContentType.BlogPost:
      if (wordCount < 800) contentGaps.push('Content is shorter than recommended for blog posts (800+ words)');
      if (elementCounts.imageCount < 2) contentGaps.push('More images recommended for blog posts (2+ images)');
      if (citations.length < 2) contentGaps.push('More citations recommended for blog posts');
      break;
    case ContentType.ProductDescription:
      if (elementCounts.imageCount < 1) contentGaps.push('Product descriptions should include at least one image');
      if (!text.includes('benefit') && !text.includes('feature')) contentGaps.push('Add clear benefits and features');
      break;
    case ContentType.LandingPage:
      if (!text.toLowerCase().includes('call') && !text.toLowerCase().includes('sign up') && !text.toLowerCase().includes('buy')) {
        contentGaps.push('No clear call-to-action found');
      }
      break;
    case ContentType.WhitePaper:
      if (wordCount < 2000) contentGaps.push('Content is shorter than recommended for white papers (2000+ words)');
      if (citations.length < 5) contentGaps.push('More citations recommended for white papers (5+ citations)');
      break;
    default:
      break;
  }
  
  // Complete analysis
  return {
    overallScore,
    qualityLevel,
    readabilityScore,
    readabilityLevel,
    keywordDensity,
    topKeywords,
    sentimentScore,
    wordCount,
    sentenceCount,
    averageSentenceLength,
    paragraphCount: elementCounts.paragraphCount,
    headingCount: elementCounts.headingCount,
    subheadingCount: elementCounts.subheadingCount,
    linkCount: elementCounts.linkCount,
    imageCount: elementCounts.imageCount,
    citations,
    authorityScore,
    suggestions,
    contentType,
    contentGaps,
  };
};
