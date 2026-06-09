import React from 'react';

interface CitationProps {
  id: string;
  source: string;
  url?: string;
  authors?: string[];
  publishDate?: string;
  title?: string;
  publisher?: string;
  accessDate?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A component for displaying and tracking citations in content
 * 
 * This component serves two purposes:
 * 1. It visually indicates a citation in the text with a superscript number
 * 2. It registers the citation with the global citation manager for use in bibliography generation
 */
const Citation: React.FC<CitationProps> = ({
  id,
  source,
  url,
  authors,
  publishDate,
  title,
  publisher,
  accessDate = new Date().toISOString().split('T')[0],
  className = '',
  children,
}) => {
  // Register citation with the citation manager
  React.useEffect(() => {
    // In a real implementation, this would call a method on a global citation manager
    // For now, we'll just log the citation for demonstration purposes
    console.log('Citation registered:', {
      id,
      source,
      url,
      authors,
      publishDate,
      title,
      publisher,
      accessDate,
    });
    
    // Clean up on unmount
    return () => {
      // In a real implementation, this would deregister the citation
      console.log('Citation deregistered:', id);
    };
  }, [id, source, url, authors, publishDate, title, publisher, accessDate]);
  
  return (
    <span className={`citation ${className}`}>
      {children}
      <sup className="citation-number text-xs text-indigo-600 ml-0.5 font-semibold">
        <a 
          href={url || `#citation-${id}`} 
          title={title || source}
          target={url ? '_blank' : undefined}
          rel={url ? 'noopener noreferrer' : undefined}
          className="hover:text-indigo-800 transition-colors"
        >
          [{id}]
        </a>
      </sup>
    </span>
  );
};

export default Citation;