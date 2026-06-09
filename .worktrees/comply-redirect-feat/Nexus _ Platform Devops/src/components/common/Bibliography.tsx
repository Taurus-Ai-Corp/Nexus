import React, { useState, useEffect } from 'react';
import {
  getAllCitations,
  generateBibliography,
  addCitationListener,
  removeCitationListener,
  CitationFormat
} from '../../utils/citationManager';

interface BibliographyProps {
  format?: CitationFormat;
  title?: string;
  className?: string;
}

/**
 * A component for displaying a bibliography of all citations used in the application
 */
const Bibliography: React.FC<BibliographyProps> = ({
  format = 'APA',
  title = 'References',
  className = '',
}) => {
  const [html, setHtml] = useState<string>('');
  
  // Update bibliography when citations change
  useEffect(() => {
    const updateBibliography = () => {
      const bibliography = generateBibliography(format);
      setHtml(bibliography);
    };
    
    // Initial update
    updateBibliography();
    
    // Listen for citation changes
    addCitationListener(updateBibliography);
    
    // Clean up on unmount
    return () => {
      removeCitationListener(updateBibliography);
    };
  }, [format]);
  
  // Check if there are any citations
  const hasCitations = Object.keys(getAllCitations()).length > 0;
  
  if (!hasCitations) {
    return null;
  }
  
  return (
    <div className={`bibliography ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default Bibliography;