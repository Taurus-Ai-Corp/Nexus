import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PlaceholderModal } from './Modal';

export const AITemplates: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBrowseModal, setShowBrowseModal] = useState(false);

  const categories = [
    'All',
    'Social Media',
    'Lead Generation',
    'Content Creation',
    'E-commerce',
    'HR & Recruitment',
    'Customer Service',
    'Voice Assistant'
  ];

  const templates = [
    {
      title: 'Ultimate LinkedIn Automation',
      category: 'Social Media',
      description: 'Automate your LinkedIn outreach and connection building with AI-powered messaging.',
      integrations: ['LinkedIn', 'n8n', 'ChatGPT'],
      featured: true
    },
    {
      title: 'Email Marketing Funnel',
      category: 'Lead Generation',
      description: 'Complete email marketing automation with lead scoring and personalization.',
      integrations: ['Mailchimp', 'HubSpot', 'Zapier'],
      featured: false
    },
    {
      title: 'Content Calendar Generator',
      category: 'Content Creation',
      description: 'AI-powered content planning and scheduling across all your marketing channels.',
      integrations: ['WordPress', 'Buffer', 'Canva'],
      featured: true
    },
    {
      title: 'Customer Support Bot',
      category: 'Customer Service',
      description: 'Intelligent chatbot that handles customer inquiries 24/7 with human handoff.',
      integrations: ['Slack', 'Zendesk', 'OpenAI'],
      featured: false
    },
    {
      title: 'E-commerce Sales Optimizer',
      category: 'E-commerce',
      description: 'Automated pricing, inventory management, and customer retention strategies.',
      integrations: ['Shopify', 'Google Analytics', 'Stripe'],
      featured: true
    },
    {
      title: 'Recruitment Pipeline',
      category: 'HR & Recruitment',
      description: 'Streamlined candidate screening and interview scheduling automation.',
      integrations: ['LinkedIn', 'Calendly', 'ATS'],
      featured: false
    }
  ];

  const filteredTemplates = activeFilter === 'All' 
    ? templates 
    : templates.filter(template => template.category === activeFilter);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI Automation Templates
          </h2>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto mb-8">
            60+ Pre-built automation workflows ready to deploy. Choose from our extensive library
            of proven templates designed for every industry and use case.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-[#00EEFF] to-[#AA00FF] text-white'
                    : 'bg-gray-800 text-[#E0E0E0] hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredTemplates.map((template, index) => (
            <div key={index} className="glow-card p-6 space-y-4 relative">
              {template.featured && (
                <div className="absolute -top-3 -right-3">
                  <span className="bg-gradient-to-r from-[#00EEFF] to-[#AA00FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                    FEATURED
                  </span>
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                <span className="inline-block px-3 py-1 bg-gray-800 text-[#E0E0E0] text-xs rounded-full">
                  {template.category}
                </span>
                <p className="text-[#E0E0E0] text-sm leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#E0E0E0] mb-2">INTEGRATIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {template.integrations.map((integration, i) => (
                      <span
                        key={i}
                        className="bg-gray-800 text-white text-xs px-2 py-1 rounded"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full glow-button py-2 text-sm"
                >
                  Get Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => setShowBrowseModal(true)}
            className="glow-button px-8 py-3 text-lg flex items-center gap-2 mx-auto"
          >
            Browse All 60+ Templates
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <PlaceholderModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        type="template"
      />
      
      <PlaceholderModal 
        isOpen={showBrowseModal}
        onClose={() => setShowBrowseModal(false)}
        type="template"
      />
    </section>
  );
};
