import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  generateAllStructuredData,
  generateWebPageStructuredData,
  createProductSchema,
  createServiceSchema,
  createFaqSchema,
  injectStructuredData,
  ProductSchema,
  ServiceSchema,
  FaqSchema
} from '../utils/seo/structuredData';

// Atlas AI service data
const atlasAiServices: ServiceSchema[] = [
  {
    name: 'AI Marketing Automation',
    description: 'Automate your marketing campaigns with advanced AI technology. Increase conversions and save time with smart automation.',
    url: `${window.location.origin}/features`,
    serviceType: 'Marketing Automation',
    areaServed: 'Worldwide',
    offers: [
      {
        price: 0,
        priceCurrency: 'USD',
        description: 'Free plan with basic features'
      },
      {
        price: 49.99,
        priceCurrency: 'USD',
        description: 'Pro plan with advanced features'
      },
      {
        price: 99.99,
        priceCurrency: 'USD',
        description: 'Enterprise plan with all features and priority support'
      }
    ]
  },
  {
    name: 'AI Content Generation',
    description: 'Generate high-quality content for your marketing campaigns with AI. Save time and resources while maintaining quality.',
    url: `${window.location.origin}/features`,
    serviceType: 'Content Generation',
    areaServed: 'Worldwide',
    offers: [
      {
        price: 0,
        priceCurrency: 'USD',
        description: 'Free plan with limited generation'
      },
      {
        price: 29.99,
        priceCurrency: 'USD',
        description: 'Pro plan with advanced generation features'
      }
    ]
  }
];

// Atlas AI products data
const atlasAiProducts: ProductSchema[] = [
  {
    name: 'Atlas AI Marketing Suite',
    description: 'All-in-one marketing automation platform powered by AI. Includes campaign management, analytics, and content generation.',
    image: `${window.location.origin}/images/products/marketing-suite.jpg`,
    url: `${window.location.origin}/pricing`,
    brand: 'Atlas AI',
    offers: {
      price: 49.99,
      priceCurrency: 'USD',
      availability: 'InStock'
    },
    aggregateRating: {
      ratingValue: 4.8,
      reviewCount: 527
    }
  },
  {
    name: 'Atlas AI Analytics Dashboard',
    description: 'Comprehensive analytics dashboard for tracking marketing performance. Real-time data and AI-powered insights.',
    image: `${window.location.origin}/images/products/analytics-dashboard.jpg`,
    url: `${window.location.origin}/pricing`,
    brand: 'Atlas AI',
    offers: {
      price: 29.99,
      priceCurrency: 'USD',
      availability: 'InStock'
    },
    aggregateRating: {
      ratingValue: 4.6,
      reviewCount: 342
    }
  }
];

// FAQ data
const faqData: FaqSchema = {
  questions: [
    {
      question: 'What is Atlas AI?',
      answer: 'Atlas AI is an advanced marketing automation platform powered by artificial intelligence. It helps businesses automate their marketing campaigns, generate content, and analyze performance.'
    },
    {
      question: 'Is there a free plan available?',
      answer: 'Yes, Atlas AI offers a free plan with basic features. You can upgrade to Pro or Enterprise plans for additional features and capabilities.'
    },
    {
      question: 'How does the AI content generation work?',
      answer: 'Atlas AI uses advanced natural language processing models to generate high-quality content for your marketing campaigns. Simply provide a topic or brief, and the AI will create engaging content tailored to your brand voice.'
    },
    {
      question: 'Can I integrate Atlas AI with my existing tools?',
      answer: 'Yes, Atlas AI offers integrations with popular marketing, CRM, and analytics tools. Check our features page for a complete list of integrations.'
    },
    {
      question: 'How secure is my data with Atlas AI?',
      answer: 'Atlas AI takes data security seriously. We use industry-standard encryption and security practices to protect your data. For more information, please check our data protection page.'
    }
  ]
};

// Breadcrumbs for different pages
const getBreadcrumbs = (pathname: string) => {
  const baseUrl = window.location.origin;
  const breadcrumbs = [
    { name: 'Home', url: baseUrl }
  ];

  if (pathname === '/') {
    return breadcrumbs;
  }

  const pathSegments = pathname.split('/').filter(segment => segment);
  let currentPath = '';

  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const readableName = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name: readableName,
      url: `${baseUrl}${currentPath}`
    });
  });

  return breadcrumbs;
};

// Page-specific schema data
const pageSchemas = {
  '/': {
    title: 'Atlas AI - Advanced AI-Powered Marketing Automation Platform',
    description: 'Transform your marketing with Atlas AI\'s advanced automation platform. AI-powered campaigns, templates, analytics dashboard. Start your free trial today.'
  },
  '/features': {
    title: 'Features - Atlas AI Marketing Automation Platform',
    description: 'Explore the powerful features of Atlas AI: AI-driven campaign management, content generation, analytics, and more.'
  },
  '/pricing': {
    title: 'Pricing - Atlas AI Marketing Automation Platform',
    description: 'Choose the right Atlas AI plan for your business. Free, Pro, and Enterprise options available with flexible pricing.'
  },
  '/contact': {
    title: 'Contact Us - Atlas AI Marketing Automation Platform',
    description: 'Get in touch with Atlas AI support team. We\'re here to help you with any questions or issues.'
  },
  '/insights': {
    title: 'Insights - Atlas AI Marketing Automation Platform',
    description: 'Marketing insights, tips, and best practices from Atlas AI. Stay updated with the latest marketing trends.'
  },
  '/signup': {
    title: 'Sign Up - Atlas AI Marketing Automation Platform',
    description: 'Create your Atlas AI account and start optimizing your marketing with AI-powered automation.'
  }
};

interface SchemaMarkupProps {
  pageSpecificSchema?: any;
}

/**
 * SchemaMarkup component for adding structured data to pages
 */
const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ pageSpecificSchema }) => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // Generate base structured data for all pages
    generateAllStructuredData();

    // Get page-specific data or use default
    const pageData = pageSchemas[pathname as keyof typeof pageSchemas] || {
      title: 'Atlas AI - AI-Powered Marketing Automation',
      description: 'Advanced marketing automation platform powered by artificial intelligence.'
    };

    // Generate web page structured data with breadcrumbs
    generateWebPageStructuredData(
      pageData.title,
      pageData.description,
      `${window.location.origin}${pathname}`,
      getBreadcrumbs(pathname)
    );

    // Add page-specific schema
    if (pathname === '/features') {
      // Add service schemas for features page
      atlasAiServices.forEach((service, index) => {
        injectStructuredData(
          createServiceSchema(service),
          `atlas-ai-service-schema-${index}`
        );
      });

      // Add FAQ schema to features page
      injectStructuredData(
        createFaqSchema(faqData),
        'atlas-ai-faq-schema'
      );
    } else if (pathname === '/pricing') {
      // Add product schemas for pricing page
      atlasAiProducts.forEach((product, index) => {
        injectStructuredData(
          createProductSchema(product),
          `atlas-ai-product-schema-${index}`
        );
      });
    }

    // Add any custom schema passed as props
    if (pageSpecificSchema) {
      injectStructuredData(
        JSON.stringify(pageSpecificSchema),
        'atlas-ai-custom-schema'
      );
    }

    // Cleanup function to remove schemas when component unmounts
    return () => {
      // Remove page-specific schemas
      if (pathname === '/features') {
        atlasAiServices.forEach((_, index) => {
          const script = document.getElementById(`atlas-ai-service-schema-${index}`);
          if (script) script.remove();
        });
        
        const faqScript = document.getElementById('atlas-ai-faq-schema');
        if (faqScript) faqScript.remove();
      } else if (pathname === '/pricing') {
        atlasAiProducts.forEach((_, index) => {
          const script = document.getElementById(`atlas-ai-product-schema-${index}`);
          if (script) script.remove();
        });
      }

      // Remove custom schema
      const customScript = document.getElementById('atlas-ai-custom-schema');
      if (customScript) customScript.remove();
    };
  }, [pathname, pageSpecificSchema]);

  // This component doesn't render anything visible
  return null;
};

export default SchemaMarkup;