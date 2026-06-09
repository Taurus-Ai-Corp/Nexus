import React from 'react';
import { Calendar, User, TrendingUp, BarChart3 } from 'lucide-react';
import { Footer } from '../components/Footer';

export const InsightsPage: React.FC = () => {
  const articles = [
    {
      title: 'The Future of AI-Powered Marketing Automation in 2025',
      excerpt: 'Discover the latest trends and innovations shaping the future of marketing automation with artificial intelligence.',
      author: 'Sarah Chen',
      date: 'December 15, 2024',
      readTime: '8 min read',
      category: 'AI & Technology',
      image: '/images/abstract_neural_network_ai_brain_technology.jpg'
    },
    {
      title: 'How to Increase ROI by 300% with Smart Campaign Optimization',
      excerpt: 'Learn proven strategies and techniques to dramatically improve your marketing campaign performance and ROI.',
      author: 'Michael Rodriguez',
      date: 'December 12, 2024',
      readTime: '12 min read',
      category: 'Strategy & Growth',
      image: '/images/ai_robot_futuristic_dashboard_technology.jpg'
    },
    {
      title: 'Building Effective Marketing Automation Workflows',
      excerpt: 'A comprehensive guide to creating marketing automation workflows that convert and retain customers.',
      author: 'Emily Watson',
      date: 'December 10, 2024',
      readTime: '10 min read',
      category: 'Automation',
      image: '/images/marketing_automation_workflow_diagram_illustration.jpg'
    },
    {
      title: 'Data-Driven Marketing: Analytics That Actually Matter',
      excerpt: 'Cut through the noise and focus on the marketing metrics that truly drive business growth and success.',
      author: 'David Kim',
      date: 'December 8, 2024',
      readTime: '7 min read',
      category: 'Analytics',
      image: '/images/ai-robot-dashboard-charts-graphs-futuristic-technology.jpg'
    },
    {
      title: 'The Complete Guide to AI Content Generation',
      excerpt: 'Master the art of AI-powered content creation and learn how to maintain brand voice while scaling content production.',
      author: 'Lisa Park',
      date: 'December 5, 2024',
      readTime: '15 min read',
      category: 'Content Marketing',
      image: '/images/abstract-neural-network-ai-visualization-blue.jpg'
    },
    {
      title: 'Social Media Marketing Automation: Best Practices',
      excerpt: 'Streamline your social media presence with smart automation while maintaining authentic engagement.',
      author: 'Alex Johnson',
      date: 'December 3, 2024',
      readTime: '9 min read',
      category: 'Social Media',
      image: '/images/modern_social_media_marketing_icons_thought_bubble.png'
    }
  ];

  const categories = ['All', 'AI & Technology', 'Strategy & Growth', 'Automation', 'Analytics', 'Content Marketing', 'Social Media'];
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Marketing Insights & Resources
          </h1>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Stay ahead of the curve with expert insights, industry trends, and actionable strategies 
            for modern marketing success.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glow-card p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#00EEFF] to-[#AA00FF] text-white text-sm font-medium rounded-full">
                  FEATURED ARTICLE
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {articles[0].title}
                </h2>
                <p className="text-[#E0E0E0] text-lg leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-[#E0E0E0]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{articles[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{articles[0].date}</span>
                  </div>
                  <span>{articles[0].readTime}</span>
                </div>
                <button className="glow-button px-8 py-3">
                  Read Full Article
                </button>
              </div>
              <div className="relative">
                <img 
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/abstract_neural_network_ai_brain_technology.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-[#E0E0E0] hover:bg-gray-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => (
              <div key={index} className="glow-card p-6 space-y-4 group cursor-pointer hover:scale-105 transition-transform">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/abstract_neural_network_ai_brain_technology.jpg';
                  }}
                />
                
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-gray-800 text-neon-green text-xs rounded-full">
                    {article.category}
                  </span>
                  
                  <h3 className="text-lg font-semibold text-white group-hover:gradient-text transition-all">
                    {article.title}
                  </h3>
                  
                  <p className="text-[#E0E0E0] text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[#E0E0E0]">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-[#E0E0E0]">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="glow-button-outline px-8 py-3">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glow-card-green p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00EEFF] to-[#00FF7F] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white">
              Stay Updated with Marketing Insights
            </h2>
            
            <p className="text-[#E0E0E0] text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest marketing trends, AI insights, 
              and automation strategies delivered to your inbox weekly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none"
              />
              <button className="glow-button px-6 py-3 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
