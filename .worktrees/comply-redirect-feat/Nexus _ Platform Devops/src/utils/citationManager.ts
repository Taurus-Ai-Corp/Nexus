/**
 * Citation Manager
 * 
 * This utility manages citations throughout the application,
 * allowing for registration, tracking, and bibliography generation
 */

// Citation data structure
export interface Citation {
  id: string;
  source: string;
  url?: string;
  authors?: string[];
  publishDate?: string;
  title?: string;
  publisher?: string;
  accessDate?: string;
}

// Citation formats
export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';

// Global citation store
let citations: Record<string, Citation> = {};

// Event listeners
type CitationEventType = 'add' | 'remove' | 'clear';
type CitationEventListener = (event: CitationEventType, citation?: Citation) => void;
const listeners: CitationEventListener[] = [];

/**
 * Register a citation
 * @param citation - The citation to register
 */
export const registerCitation = (citation: Citation): void => {
  citations[citation.id] = citation;
  notifyListeners('add', citation);
};

/**
 * Deregister a citation
 * @param id - The ID of the citation to deregister
 */
export const deregisterCitation = (id: string): void => {
  if (citations[id]) {
    const citation = citations[id];
    delete citations[id];
    notifyListeners('remove', citation);
  }
};

/**
 * Get all registered citations
 * @returns All registered citations
 */
export const getAllCitations = (): Record<string, Citation> => {
  return { ...citations };
};

/**
 * Get a citation by ID
 * @param id - The ID of the citation to get
 * @returns The citation, or undefined if not found
 */
export const getCitation = (id: string): Citation | undefined => {
  return citations[id];
};

/**
 * Clear all citations
 */
export const clearCitations = (): void => {
  citations = {};
  notifyListeners('clear');
};

/**
 * Add a citation event listener
 * @param listener - The listener to add
 */
export const addCitationListener = (listener: CitationEventListener): void => {
  listeners.push(listener);
};

/**
 * Remove a citation event listener
 * @param listener - The listener to remove
 */
export const removeCitationListener = (listener: CitationEventListener): void => {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

/**
 * Notify listeners of a citation event
 * @param event - The event type
 * @param citation - The citation involved (if any)
 */
const notifyListeners = (event: CitationEventType, citation?: Citation): void => {
  listeners.forEach(listener => listener(event, citation));
};

/**
 * Generate a bibliography from the registered citations
 * @param format - The citation format to use
 * @returns The bibliography as HTML
 */
export const generateBibliography = (format: CitationFormat = 'APA'): string => {
  const citationArray = Object.values(citations).sort((a, b) => {
    // Sort by ID (assuming numeric IDs)
    return parseInt(a.id) - parseInt(b.id);
  });
  
  if (citationArray.length === 0) {
    return '<p>No citations found.</p>';
  }
  
  const formatCitation = (citation: Citation): string => {
    switch (format) {
      case 'APA':
        return formatAPACitation(citation);
      case 'MLA':
        return formatMLACitation(citation);
      case 'Chicago':
        return formatChicagoCitation(citation);
      case 'Harvard':
        return formatHarvardCitation(citation);
      case 'IEEE':
        return formatIEEECitation(citation);
      default:
        return formatAPACitation(citation);
    }
  };
  
  const bibliography = citationArray.map(citation => {
    return `<div id="citation-${citation.id}" class="bibliography-entry">
      <span class="citation-number">[${citation.id}]</span>
      <span class="citation-text">${formatCitation(citation)}</span>
    </div>`;
  }).join('\n');
  
  return `<div class="bibliography">
    <h2>References</h2>
    ${bibliography}
  </div>`;
};

/**
 * Format a citation in APA style
 * @param citation - The citation to format
 * @returns The formatted citation
 */
const formatAPACitation = (citation: Citation): string => {
  let result = '';
  
  // Authors
  if (citation.authors && citation.authors.length > 0) {
    if (citation.authors.length === 1) {
      result += `${citation.authors[0]}. `;
    } else if (citation.authors.length === 2) {
      result += `${citation.authors[0]} & ${citation.authors[1]}. `;
    } else {
      result += `${citation.authors[0]} et al. `;
    }
  }
  
  // Publish date
  if (citation.publishDate) {
    const year = new Date(citation.publishDate).getFullYear();
    result += `(${year}). `;
  }
  
  // Title
  if (citation.title) {
    result += `<em>${citation.title}</em>. `;
  }
  
  // Publisher
  if (citation.publisher) {
    result += `${citation.publisher}. `;
  }
  
  // URL
  if (citation.url) {
    result += `Retrieved from <a href="${citation.url}" target="_blank" rel="noopener noreferrer">${citation.url}</a>`;
    
    // Access date
    if (citation.accessDate) {
      const date = new Date(citation.accessDate);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      result += ` (accessed ${formattedDate})`;
    }
  }
  
  return result;
};

/**
 * Format a citation in MLA style
 * @param citation - The citation to format
 * @returns The formatted citation
 */
const formatMLACitation = (citation: Citation): string => {
  let result = '';
  
  // Authors
  if (citation.authors && citation.authors.length > 0) {
    if (citation.authors.length === 1) {
      const nameParts = citation.authors[0].split(' ');
      const lastName = nameParts.pop();
      const firstName = nameParts.join(' ');
      result += `${lastName}, ${firstName}. `;
    } else if (citation.authors.length === 2) {
      const nameParts1 = citation.authors[0].split(' ');
      const lastName1 = nameParts1.pop();
      const firstName1 = nameParts1.join(' ');
      
      result += `${lastName1}, ${firstName1}, and ${citation.authors[1]}. `;
    } else {
      const nameParts = citation.authors[0].split(' ');
      const lastName = nameParts.pop();
      const firstName = nameParts.join(' ');
      
      result += `${lastName}, ${firstName}, et al. `;
    }
  }
  
  // Title
  if (citation.title) {
    result += `"${citation.title}." `;
  }
  
  // Publisher
  if (citation.publisher) {
    result += `<em>${citation.publisher}</em>, `;
  }
  
  // Publish date
  if (citation.publishDate) {
    const date = new Date(citation.publishDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    result += `${formattedDate}, `;
  }
  
  // URL
  if (citation.url) {
    result += `<a href="${citation.url}" target="_blank" rel="noopener noreferrer">${citation.url}</a>`;
    
    // Access date
    if (citation.accessDate) {
      const date = new Date(citation.accessDate);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      result += `. Accessed ${formattedDate}`;
    }
  }
  
  return result;
};

/**
 * Format a citation in Chicago style
 * @param citation - The citation to format
 * @returns The formatted citation
 */
const formatChicagoCitation = (citation: Citation): string => {
  // Simplified implementation
  return formatAPACitation(citation);
};

/**
 * Format a citation in Harvard style
 * @param citation - The citation to format
 * @returns The formatted citation
 */
const formatHarvardCitation = (citation: Citation): string => {
  // Simplified implementation
  return formatAPACitation(citation);
};

/**
 * Format a citation in IEEE style
 * @param citation - The citation to format
 * @returns The formatted citation
 */
const formatIEEECitation = (citation: Citation): string => {
  // Simplified implementation
  return formatAPACitation(citation);
};
