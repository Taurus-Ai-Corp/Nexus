import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  BarChart3, 
  FileText, 
  Zap, 
  Mail, 
  Lightbulb, 
  Target, 
  Share2, 
  Bot, 
  Database,
  Users,
  Settings,
  CheckCircle,
  Workflow,
  Smartphone,
  Bell,
  Palette,
  Building,
  Shield,
  Clock,
  Phone,
  Globe
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const FeaturesPage: React.FC = () => {
  const coreFeatures = [
    {
      icon: BarChart3,
      title: 'Advanced Campaign Management',
      description: 'Streamline your marketing campaigns with intelligent automation, real-time optimization, and comprehensive performance tracking.',
      features: [
        'Multi-channel campaign orchestration',
        'Real-time performance monitoring',
        'Intelligent budget allocation',
        'A/B testing automation',
        'Campaign performance analytics'
      ],
      status: 'AI: Optimizing'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics & Insights',
      description: 'Deep insights powered by machine learning algorithms to maximize your marketing ROI and predict future trends.',
      features: [
        'Predictive analytics and forecasting',
        'Customer behavior analysis',
        'ROI optimization recommendations',
        'Automated reporting and insights',
        'Custom dashboard creation'
      ],
      status: 'AI: Learning'
    },
    {
      icon: FileText,
      title: 'Intelligent Content Management',
      description: 'Create, manage, and optimize content across all your marketing channels with AI-powered content suggestions.',
      features: [
        'AI content generation and optimization',
        'Multi-platform content distribution',
        'Content performance tracking',
        'Brand voice consistency checks',
        'Content calendar automation'
      ],
      status: 'AI: Optimizing'
    },
    {
      icon: Zap,
      title: 'Comprehensive Automation Suite',
      description: 'Powerful automation tools that work 24/7 to grow your business with minimal manual intervention.',
      features: [
        'Workflow automation builder',
        'Trigger-based actions',
        'Multi-step automation sequences',
        'Conditional logic and branching',
        'Integration with 60+ platforms'
      ],
      status: 'AI: Learning'
    }
  ];

  const aiTools = [
    {
      icon: Mail,
      title: 'Email Performance Analysis',
      description: 'Advanced email analytics with AI-powered insights to optimize your email marketing campaigns.'
    },
    {
      icon: Lightbulb,
      title: 'Content Recommendations',
      description: 'AI-driven content suggestions based on audience behavior, trends, and performance data.'
    },
    {
      icon: Target,
      title: 'Automated Bid Adjustments',
      description: 'Smart bidding algorithms that automatically optimize your ad spend for maximum ROI.'
    },
    {
      icon: Share2,
      title: 'Social Media Insights',
      description: 'Comprehensive social media analytics with sentiment analysis and engagement optimization.'
    },
    {
      icon: Bot,
      title: 'Task Automation Workflows',
      description: 'Intelligent task automation that learns from your patterns and optimizes processes over time.'
    },
    {
      icon: Database,
      title: 'CRM Integration & Prediction',
      description: 'Seamless CRM integration with predictive lead scoring and customer lifetime value analysis.'
    }
  ];

  const integrations = [
    { name: 'Google Analytics', category: 'Analytics' },
    { name: 'Facebook Ads', category: 'Advertising' },
    { name: 'Google Ads', category: 'Advertising' },
    { name: 'HubSpot', category: 'CRM' },
    { name: 'Salesforce', category: 'CRM' },
    { name: 'Mailchimp', category: 'Email' },
    { name: 'Slack', category: 'Communication' },
    { name: 'Zapier', category: 'Automation' },
    { name: 'WordPress', category: 'Content' },
    { name: 'Shopify', category: 'E-commerce' },
    { name: 'LinkedIn Ads', category: 'Advertising' },
    { name: 'Twitter API', category: 'Social Media' }
  ];

  const teamFeatures = [
    {
      icon: Users,
      title: 'Multi-User Workspace',
      description: 'Collaborative workspace with role-based access control and team management features.',
      features: [
        'Role-based permissions',
        'Team member management',
        'Shared campaign access',
        'Activity tracking'
      ]
    },
    {
      icon: BarChart3,
      title: 'Team Performance Dashboards',
      description: 'Real-time dashboards showing team performance metrics and individual contributions.',
      features: [
        'Individual performance tracking',
        'Team productivity metrics',
        'Goal tracking and progress',
        'Performance comparisons'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Approval Workflows',
      description: 'Streamlined approval processes for campaigns, content, and budget allocations.',
      features: [
        'Multi-level approval chains',
        'Campaign review processes',
        'Content approval workflows',
        'Budget approval controls'
      ]
    },
    {
      icon: Workflow,
      title: 'Project Management',
      description: 'Integrated project management tools for marketing campaigns and team coordination.',
      features: [
        'Task assignment and tracking',
        'Project timeline management',
        'Resource allocation',
        'Milestone tracking'
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Comprehensive Marketing Features
          </h1>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Discover the full power of Atlas AI with our comprehensive suite of marketing automation 
            tools designed to transform your business and accelerate growth.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Comprehensive marketing automation tools that form the foundation of your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glow-card p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                        <span className="text-sm text-neon-green font-medium">{feature.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[#E0E0E0] leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-neon-green" />
                        <span className="text-[#E0E0E0] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced AI Marketing Tools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Advanced AI Marketing Tools</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Cutting-edge AI tools that give you a competitive advantage in the digital marketplace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={index} className="glow-card-green p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#00FF7F] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                  <p className="text-[#E0E0E0] text-sm leading-relaxed">{tool.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seamless Third-Party Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Seamless Third-Party Integrations</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Connect with your favorite tools and platforms for a unified marketing ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="glow-card p-4 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-[#7B00FF] to-[#AA00FF] flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{integration.name}</h4>
                  <span className="text-xs text-neon-green">{integration.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Collaboration & Management */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Team Collaboration & Management</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Powerful collaboration tools designed for marketing teams of all sizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {teamFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glow-card-purple p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7B00FF] to-[#AA00FF] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-[#E0E0E0] leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-neon-green" />
                        <span className="text-[#E0E0E0] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile App Access & Management */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Mobile App Access & Management</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Manage your marketing campaigns on-the-go with our native mobile applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glow-card p-6 text-center space-y-4">
              <Smartphone className="w-12 h-12 mx-auto text-neon-green" />
              <h3 className="text-lg font-semibold text-white">Native Apps</h3>
              <p className="text-[#E0E0E0] text-sm">iOS and Android apps with full feature parity</p>
            </div>
            <div className="glow-card p-6 text-center space-y-4">
              <Bell className="w-12 h-12 mx-auto text-neon-green" />
              <h3 className="text-lg font-semibold text-white">Real-time Notifications</h3>
              <p className="text-[#E0E0E0] text-sm">Stay updated with instant campaign alerts and insights</p>
            </div>
            <div className="glow-card p-6 text-center space-y-4">
              <Settings className="w-12 h-12 mx-auto text-neon-green" />
              <h3 className="text-lg font-semibold text-white">Advanced Features</h3>
              <p className="text-[#E0E0E0] text-sm">Campaign management, analytics, and team collaboration</p>
            </div>
          </div>
        </div>
      </section>

      {/* White-label Solutions & Custom Branding */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">White-label Solutions & Custom Branding</h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Enterprise-grade customization options for agencies and large organizations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glow-card p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Palette className="w-12 h-12 text-neon-green" />
                <h3 className="text-xl font-semibold text-white">Custom Branding</h3>
              </div>
              <p className="text-[#E0E0E0] leading-relaxed">
                Complete white-label solution with custom logos, colors, and domain names for your agency.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="text-[#E0E0E0] text-sm">Custom logo and branding</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="text-[#E0E0E0] text-sm">Personalized domain names</span>
                </li>
              </ul>
            </div>
            
            <div className="glow-card p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Building className="w-12 h-12 text-neon-green" />
                <h3 className="text-xl font-semibold text-white">Enterprise Solutions</h3>
              </div>
              <p className="text-[#E0E0E0] leading-relaxed">
                Advanced enterprise features with dedicated support and custom integrations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="text-[#E0E0E0] text-sm">Custom integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="text-[#E0E0E0] text-sm">Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Enterprise Benefits */}
          <div className="glow-card p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Enterprise Benefits</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <Shield className="w-8 h-8 mx-auto text-neon-green" />
                <p className="text-white font-semibold">99.9% Uptime</p>
                <p className="text-[#E0E0E0] text-sm">Guaranteed reliability</p>
              </div>
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-neon-green" />
                <p className="text-white font-semibold">SOC 2 Compliance</p>
                <p className="text-[#E0E0E0] text-sm">Enterprise security</p>
              </div>
              <div className="text-center space-y-2">
                <Clock className="w-8 h-8 mx-auto text-neon-green" />
                <p className="text-white font-semibold">24/7 Priority Support</p>
                <p className="text-[#E0E0E0] text-sm">Dedicated assistance</p>
              </div>
              <div className="text-center space-y-2">
                <Phone className="w-8 h-8 mx-auto text-neon-green" />
                <p className="text-white font-semibold">API Full Access</p>
                <p className="text-[#E0E0E0] text-sm">Complete integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glow-card p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Ready to Experience the Full Power?
            </h2>
            
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
              Join thousands of marketers who have transformed their businesses with Atlas AI's 
              comprehensive feature set and AI-powered automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="glow-button px-8 py-4 text-lg">
                Start Free Trial
              </Link>
              <Link to="/contact" className="glow-button-outline px-8 py-4 text-lg">
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
