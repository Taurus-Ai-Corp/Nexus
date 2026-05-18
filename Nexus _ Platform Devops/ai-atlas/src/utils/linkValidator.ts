interface LinkValidationResult {
  url: string;
  status: 'valid' | 'invalid' | 'warning';
  message: string;
  statusCode?: number;
}

interface ValidationReport {
  totalLinks: number;
  validLinks: number;
  invalidLinks: number;
  warningLinks: number;
  results: LinkValidationResult[];
  timestamp: number;
}

export class LinkValidator {
  private results: LinkValidationResult[] = [];

  async validatePage(url?: string): Promise<ValidationReport> {
    this.results = [];
    
    // Get all links on the current page
    const links = this.extractLinks();
    
    console.log(`Found ${links.length} links to validate`);

    // Validate each link
    for (const link of links) {
      await this.validateLink(link);
    }

    return this.generateReport();
  }

  private extractLinks(): string[] {
    const links: string[] = [];
    
    // Get all anchor tags
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href) {
        links.push(href);
      }
    });

    // Get all links from footer
    const footerLinks = document.querySelectorAll('footer a[href]');
    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !links.includes(href)) {
        links.push(href);
      }
    });

    // Remove duplicates
    return [...new Set(links)];
  }

  private async validateLink(url: string): Promise<void> {
    try {
      // Skip certain types of links
      if (url.startsWith('#')) {
        // Fragment links - check if target exists
        const targetId = url.substring(1);
        const target = document.getElementById(targetId);
        
        this.results.push({
          url,
          status: target ? 'valid' : 'invalid',
          message: target ? 'Fragment target found' : 'Fragment target not found'
        });
        return;
      }

      if (url.startsWith('mailto:') || url.startsWith('tel:')) {
        // Email and phone links - basic validation
        const isValid = url.includes('@') || url.includes('+') || /\d/.test(url);
        this.results.push({
          url,
          status: isValid ? 'valid' : 'invalid',
          message: isValid ? 'Valid contact link' : 'Invalid contact link format'
        });
        return;
      }

      if (url.startsWith('javascript:')) {
        this.results.push({
          url,
          status: 'warning',
          message: 'JavaScript link detected'
        });
        return;
      }

      // Handle relative URLs
      let fullUrl = url;
      if (url.startsWith('/')) {
        fullUrl = window.location.origin + url;
      } else if (!url.startsWith('http')) {
        fullUrl = window.location.origin + '/' + url;
      }

      // For external links, we can't validate due to CORS
      if (!fullUrl.startsWith(window.location.origin)) {
        this.results.push({
          url,
          status: 'warning',
          message: 'External link - cannot validate due to CORS'
        });
        return;
      }

      // For internal links, we can check if they resolve
      try {
        const response = await fetch(fullUrl, { method: 'HEAD' });
        this.results.push({
          url,
          status: response.ok ? 'valid' : 'invalid',
          message: response.ok ? 'Link is accessible' : `HTTP ${response.status}`,
          statusCode: response.status
        });
      } catch (error) {
        // If HEAD fails, try GET for SPAs
        try {
          const response = await fetch(fullUrl);
          this.results.push({
            url,
            status: response.ok ? 'valid' : 'invalid',
            message: response.ok ? 'Link is accessible' : `HTTP ${response.status}`,
            statusCode: response.status
          });
        } catch (getError) {
          this.results.push({
            url,
            status: 'invalid',
            message: `Network error: ${getError instanceof Error ? getError.message : 'Unknown error'}`
          });
        }
      }
    } catch (error) {
      this.results.push({
        url,
        status: 'invalid',
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private generateReport(): ValidationReport {
    const validLinks = this.results.filter(r => r.status === 'valid').length;
    const invalidLinks = this.results.filter(r => r.status === 'invalid').length;
    const warningLinks = this.results.filter(r => r.status === 'warning').length;

    return {
      totalLinks: this.results.length,
      validLinks,
      invalidLinks,
      warningLinks,
      results: this.results,
      timestamp: Date.now()
    };
  }

  // Specific footer link validation
  async validateFooterLinks(): Promise<ValidationReport> {
    this.results = [];
    
    const footerLinks = document.querySelectorAll('footer a[href]');
    const links: string[] = [];
    
    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        links.push(href);
      }
    });

    for (const link of links) {
      await this.validateLink(link);
    }

    return this.generateReport();
  }

  // Navigation link validation
  async validateNavigationLinks(): Promise<ValidationReport> {
    this.results = [];
    
    const navLinks = document.querySelectorAll('nav a[href], header a[href]');
    const links: string[] = [];
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        links.push(href);
      }
    });

    for (const link of links) {
      await this.validateLink(link);
    }

    return this.generateReport();
  }
}

// Utility function to run validation and log results
export const runLinkValidation = async (type: 'all' | 'footer' | 'navigation' = 'all') => {
  const validator = new LinkValidator();
  let report: ValidationReport;

  switch (type) {
    case 'footer':
      report = await validator.validateFooterLinks();
      break;
    case 'navigation':
      report = await validator.validateNavigationLinks();
      break;
    default:
      report = await validator.validatePage();
  }

  console.group(`Link Validation Report - ${type}`);
  console.log(`Total Links: ${report.totalLinks}`);
  console.log(`Valid Links: ${report.validLinks}`);
  console.log(`Invalid Links: ${report.invalidLinks}`);
  console.log(`Warning Links: ${report.warningLinks}`);
  
  if (report.invalidLinks > 0) {
    console.group('Invalid Links:');
    report.results
      .filter(r => r.status === 'invalid')
      .forEach(result => {
        console.error(`❌ ${result.url}: ${result.message}`);
      });
    console.groupEnd();
  }

  if (report.warningLinks > 0) {
    console.group('Warning Links:');
    report.results
      .filter(r => r.status === 'warning')
      .forEach(result => {
        console.warn(`⚠️ ${result.url}: ${result.message}`);
      });
    console.groupEnd();
  }

  console.groupEnd();

  return report;
};

// Auto-validation for development
if (process.env.NODE_ENV === 'development') {
  // Add validation to window for manual testing
  (window as any).validateLinks = runLinkValidation;
  
  // Auto-validate on page load after a delay
  setTimeout(() => {
    runLinkValidation('footer').then(report => {
      if (report.invalidLinks > 0) {
        console.warn(`🔗 Found ${report.invalidLinks} broken footer links. Run window.validateLinks('footer') for details.`);
      }
    });
  }, 3000);
}
