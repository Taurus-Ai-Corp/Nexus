import React, { useState, useEffect } from 'react';

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  platforms: string[];
  color: 'cyan' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'red';
  featured?: boolean;
  price?: string;
}

const TemplateShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  const [animatedTemplates, setAnimatedTemplates] = useState<Template[]>([]);

  const templates: Template[] = [
    {
      id: 1,
      name: "Ultimate LinkedIn Automation",
      category: "Social Media",
      description: "Transform viral news into engaging LinkedIn posts with AI-generated images",
      icon: "💼",
      platforms: ["LinkedIn", "n8n", "ChatGPT"],
      color: "blue",
      featured: true
    },
    {
      id: 2,
      name: "Smart Lead Follow-Up System",
      category: "Lead Generation",
      description: "AI-powered personalized follow-up emails that convert prospects",
      icon: "🎯",
      platforms: ["Gmail", "OpenAI", "Slack"],
      color: "green",
      featured: true
    },
    {
      id: 3,
      name: "AI Viral News Scraper",
      category: "Content Creation",
      description: "Automatically finds trending topics for social media content",
      icon: "📰",
      platforms: ["RSS", "Airtable", "AI"],
      color: "purple"
    },
    {
      id: 4,
      name: "Multi-Platform Publishing Bot",
      category: "Social Media",
      description: "Publish to 9 social platforms simultaneously with AI optimization",
      icon: "🚀",
      platforms: ["Twitter", "Facebook", "Instagram", "LinkedIn"],
      color: "cyan",
      featured: true
    },
    {
      id: 5,
      name: "AI Avatar Video Creator",
      category: "Content Creation",
      description: "Create talking-head videos without filming using AI clones",
      icon: "🎬",
      platforms: ["HeyGen", "Blotato", "Make.com"],
      color: "orange"
    },
    {
      id: 6,
      name: "E-commerce Chatbot",
      category: "E-commerce",
      description: "WooCommerce integration with order tracking and customer support",
      icon: "🛒",
      platforms: ["WooCommerce", "Telegram", "AI"],
      color: "pink"
    },
    {
      id: 7,
      name: "Content Repurposing Engine",
      category: "Content Creation",
      description: "Transform long-form content into multiple social media formats",
      icon: "♻️",
      platforms: ["Google Sheets", "Perplexity", "ChatGPT"],
      color: "green"
    },
    {
      id: 8,
      name: "Job Search Automation",
      category: "HR & Recruitment",
      description: "AI-powered job matching with real-time listings and scoring",
      icon: "💼",
      platforms: ["Adzuna API", "OpenAI", "n8n"],
      color: "blue",
      price: "$1"
    },
    {
      id: 9,
      name: "Travel Agency Chatbot",
      category: "Customer Service",
      description: "AI chatbot for collecting and managing travel leads",
      icon: "✈️",
      platforms: ["Voiceflow", "Google Sheets"],
      color: "cyan"
    },
    {
      id: 10,
      name: "Automated Carousels Creator",
      category: "Social Media",
      description: "Generate beautiful social media carousels and slideshows",
      icon: "🎨",
      platforms: ["ChatGPT", "Blotato", "n8n"],
      color: "purple"
    },
    {
      id: 11,
      name: "Faceless Video Automation",
      category: "Content Creation",
      description: "Create and post faceless AI videos to social platforms",
      icon: "📹",
      platforms: ["AI Agent", "Blotato", "Make"],
      color: "red"
    },
    {
      id: 12,
      name: "Siri AI Automation",
      category: "Voice Assistant",
      description: "Voice-activated AI automations through Siri integration",
      icon: "🗣️",
      platforms: ["Siri", "n8n", "Apple Shortcuts"],
      color: "orange"
    }
  ];

  const categories = ['all', 'Social Media', 'Lead Generation', 'Content Creation', 'E-commerce', 'HR & Recruitment', 'Customer Service', 'Voice Assistant'];

  useEffect(() => {
    const filtered = selectedCategory === 'all' 
      ? templates 
      : templates.filter(t => t.category === selectedCategory);
    setAnimatedTemplates(filtered);
  }, [selectedCategory]);

  const getColorClasses = (color: Template['color']) => {
    const colors = {
      cyan: { border: 'border-cyan-500/60', bg: 'bg-cyan-500/10', text: 'text-cyan-400', shadow: 'shadow-cyan-500/30' },
      blue: { border: 'border-blue-500/60', bg: 'bg-blue-500/10', text: 'text-blue-400', shadow: 'shadow-blue-500/30' },
      purple: { border: 'border-purple-500/60', bg: 'bg-purple-500/10', text: 'text-purple-400', shadow: 'shadow-purple-500/30' },
      green: { border: 'border-green-500/60', bg: 'bg-green-500/10', text: 'text-green-400', shadow: 'shadow-green-500/30' },
      orange: { border: 'border-orange-500/60', bg: 'bg-orange-500/10', text: 'text-orange-400', shadow: 'shadow-orange-500/30' },
      pink: { border: 'border-pink-500/60', bg: 'bg-pink-500/10', text: 'text-pink-400', shadow: 'shadow-pink-500/30' },
      red: { border: 'border-red-500/60', bg: 'bg-red-500/10', text: 'text-red-400', shadow: 'shadow-red-500/30' }
    };
    return colors[color];
  };

  return (
    <div className="py-20 relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
          AI Automation Templates
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          60+ Pre-built automation workflows to transform your business operations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 capitalize
              ${selectedCategory === category 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 scale-105' 
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600/50'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-8xl mx-auto">
        {animatedTemplates.map((template, index) => {
          const colors = getColorClasses(template.color);
          
          return (
            <div
              key={template.id}
              className={`group relative transition-all duration-500 transform
                ${hoveredTemplate === template.id ? 'scale-105 z-10' : 'scale-100'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Featured Badge */}
              {template.featured && (
                <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  FEATURED
                </div>
              )}

              {/* Price Badge */}
              {template.price && (
                <div className="absolute -top-3 -left-3 z-20 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {template.price}
                </div>
              )}

              <div className={`
                relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 h-full
                ${colors.border} ${hoveredTemplate === template.id ? colors.shadow : 'shadow-slate-900/50'}
                hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden
              `}>
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`border ${colors.border} animate-pulse`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-4xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                    {template.icon}
                  </div>

                  {/* Template Name */}
                  <h3 className={`text-lg font-bold ${colors.text} mb-3 leading-tight`}>
                    {template.name}
                  </h3>

                  {/* Category */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${colors.bg} ${colors.text}`}>
                    {template.category}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Platforms */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Integrations
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.platforms.map((platform, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-800/50 text-gray-300 px-2 py-1 rounded-full border border-slate-600/50"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className={`
                    w-full mt-4 py-3 rounded-lg font-semibold transition-all duration-300
                    bg-gradient-to-r from-slate-700 to-slate-600 text-white
                    hover:from-${template.color}-500 hover:to-${template.color}-600
                    hover:shadow-lg hover:shadow-${template.color}-500/25
                    hover:scale-105 group-hover:animate-pulse
                  `}>
                    Get Template
                  </button>
                </div>

                {/* Pulsing Corner Indicators */}
                <div className={`absolute top-3 right-3 w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                <div className={`absolute bottom-3 left-3 w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl shadow-cyan-500/25 animate-pulse">
          Browse All 60+ Templates
        </button>
      </div>
    </div>
  );
};

export default TemplateShowcase;
