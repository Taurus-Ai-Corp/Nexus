import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import FuturisticEffects from '../components/FuturisticEffects';
import HolographicInterface, { NeuralNetworkBackground } from '../components/HolographicInterface';

const FeaturesPage: React.FC = () => {
  const { showSignupModal } = useModal();
  
  const coreFeatures = [
    {
      title: "Advanced Campaign Management",
      description: "Create, edit, and manage comprehensive marketing campaigns with AI-powered optimization and real-time adjustments.",
      features: [
        "Visual campaign builder with AI-suggested templates",
        "Multi-channel campaign orchestration with cross-platform sync",
        "Real-time performance monitoring with predictive alerts",
        "Advanced A/B testing with statistical significance testing",
        "Dynamic budget optimization using machine learning algorithms",
        "Automated bid management with conversion likelihood scoring",
        "Custom attribution modeling for accurate ROI tracking"
      ]
    },
    {
      title: "AI-Powered Analytics & Insights",
      description: "Leverage advanced predictive analytics, machine learning models, and automated insights to optimize your marketing strategies.",
      features: [
        "Predictive audience modeling with lookalike generation",
        "Conversion probability scoring using ensemble methods",
        "Automated performance recommendations with confidence levels",
        "Advanced trend analysis and seasonal forecasting",
        "Custom KPI dashboards with real-time visualizations",
        "Cross-channel attribution with data-driven models",
        "Churn prediction and customer lifetime value calculations"
      ]
    },
    {
      title: "Intelligent Content Management",
      description: "AI-powered content creation, optimization, and personalization with advanced CMS integration and performance tracking.",
      features: [
        "AI content generation with GPT-powered writing assistance",
        "Multi-platform content distribution with format optimization",
        "Brand voice consistency checks using NLP algorithms",
        "Content performance analytics with engagement predictions",
        "Dynamic personalization engine with real-time adaptation",
        "SEO optimization with keyword analysis and ranking predictions",
        "Content calendar automation with optimal timing suggestions"
      ]
    },
    {
      title: "Comprehensive Automation Suite",
      description: "Complete marketing automation with AI-driven email sequences, social media management, and intelligent chatbot interactions.",
      features: [
        "Intelligent email sequences with behavioral triggers",
        "Social media scheduling with optimal timing algorithms",
        "AI chatbot with advanced natural language understanding",
        "Lead scoring with machine learning-based probability models",
        "Cross-platform integration with 100+ marketing tools",
        "Customer journey mapping with predictive path optimization",
        "Automated nurturing campaigns with dynamic content adaptation"
      ]
    }
  ];

  const integrations = [
    { name: "Google Analytics", category: "Analytics" },
    { name: "Facebook Ads", category: "Advertising" },
    { name: "Google Ads", category: "Advertising" },
    { name: "HubSpot", category: "CRM" },
    { name: "Salesforce", category: "CRM" },
    { name: "Mailchimp", category: "Email" },
    { name: "Slack", category: "Communication" },
    { name: "Zapier", category: "Automation" },
    { name: "WordPress", category: "CMS" },
    { name: "Shopify", category: "E-commerce" },
    { name: "LinkedIn Ads", category: "Advertising" },
    { name: "Twitter API", category: "Social Media" }
  ];

  return (
    <FuturisticEffects>
      <NeuralNetworkBackground />
      
      <div className="bg-gradient-to-br from-cyber-dark via-cyber-secondary to-cyber-dark min-h-screen relative">
        {/* Hero Section with Holographic Interface */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-green-500/10 animate-pulse-slow"></div>
            <div className="holographic-grid opacity-20"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HolographicInterface variant="targeting" className="p-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 glow-text">
                  🚀 Atlas AI Features
                </h1>
                <p className="text-xl md:text-2xl text-cyan-400 mb-8 max-w-3xl mx-auto glow-text-purple">
                  Everything You Need for Smart Marketing
                </p>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto">
                  Discover the powerful features that make 🚀 Atlas AI the ultimate marketing automation platform for modern businesses.
                </p>
                
                {/* Floating Status Indicators */}
                <div className="flex justify-center space-x-8 mt-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                    <span className="text-green-400">Features: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-glow"></div>
                    <span className="text-cyan-400">AI: Active</span>
                  </div>
                </div>
              </div>
            </HolographicInterface>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-8 h-8 targeting-circle opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-6 h-6 targeting-circle opacity-40"></div>
        </section>

        {/* Core Features with Holographic Interface */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text-purple">
                Core Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive marketing automation tools powered by advanced AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => {
                const getGlowColor = (index: number) => {
                  const colors = ['cyan', 'green', 'orange', 'purple'];
                  return colors[index % colors.length];
                };
                
                return (
                  <HolographicInterface 
                    key={index} 
                    variant="dashboard" 
                    glowColor={getGlowColor(index) as any}
                    className="p-8 data-stream"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-3 h-3 rounded-full mr-3 pulse-glow ${index === 0 ? 'bg-cyan-400' : index === 1 ? 'bg-green-400' : index === 2 ? 'bg-orange-400' : 'bg-purple-400'}`}></div>
                      <h3 className="text-2xl font-bold text-white glow-text">{feature.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0 pulse-glow"></div>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Progress indicator */}
                    <div className="mt-6 w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="progress-glow h-2 rounded-full"
                        style={{ 
                          width: `${90 + Math.random() * 10}%`,
                          animationDelay: `${index * 0.3}s`
                        }}
                      />
                    </div>
                  </HolographicInterface>
                );
              })}
            </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dgsm-text-primary mb-4">
              Advanced AI Marketing Tools
            </h2>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Comprehensive suite of AI tools designed specifically for marketing optimization and automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Email Performance Analysis",
                description: "AI-powered email campaign analysis with predictive open rates, click-through optimization, and subject line testing",
                icon: "📧",
                color: "blue"
              },
              {
                name: "Content Recommendations",
                description: "Real-time content suggestions based on search data, trending topics, and audience preferences",
                icon: "💡",
                color: "green"
              },
              {
                name: "Automated Bid Adjustments",
                description: "Dynamic bid management for ad campaigns using machine learning algorithms and real-time market analysis",
                icon: "🎯",
                color: "orange"
              },
              {
                name: "Social Media Insights",
                description: "Advanced social media analytics with sentiment analysis, influencer identification, and engagement optimization",
                icon: "📱",
                color: "purple"
              },
              {
                name: "Task Automation Workflows",
                description: "Intelligent workflow automation for repetitive marketing tasks with custom trigger conditions",
                icon: "⚡",
                color: "blue"
              },
              {
                name: "CRM Integration & Prediction",
                description: "Advanced CRM integration with predictive lead scoring, customer lifetime value calculation, and churn prediction",
                icon: "🔮",
                color: "green"
              }
            ].map((tool, index) => {
              const getIconBg = (color: string) => {
                switch(color) {
                  case 'blue': return 'bg-blue-500/20';
                  case 'green': return 'bg-green-500/20';
                  case 'orange': return 'bg-orange-500/20';
                  case 'purple': return 'bg-purple-500/20';
                  default: return 'bg-blue-500/20';
                }
              };
              
              return (
                <div key={index} className="bg-dgsm-secondary rounded-xl p-6 hover:bg-navy-700 transition-colors shadow-lg border border-dgsm-border">
                  <div className={`text-3xl mb-4 p-3 rounded-lg ${getIconBg(tool.color)} w-fit`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-dgsm-text-primary mb-3">{tool.name}</h3>
                  <p className="text-dgsm-text-secondary">{tool.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dgsm-text-primary mb-4">
              Seamless Third-Party Integrations
            </h2>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Connect 🚀 Atlas AI with your existing marketing stack for a unified experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => {
              const getCategoryColors = (category: string) => {
                switch(category) {
                  case 'Analytics': return 'bg-blue-500/20 text-blue-500';
                  case 'Advertising': return 'bg-green-500/20 text-green-500';
                  case 'CRM': return 'bg-purple-500/20 text-purple-500';
                  case 'Email': return 'bg-orange-500/20 text-orange-500';
                  case 'Communication': return 'bg-yellow-500/20 text-yellow-500';
                  case 'Automation': return 'bg-red-500/20 text-red-500';
                  case 'CMS': return 'bg-indigo-500/20 text-indigo-500';
                  case 'E-commerce': return 'bg-pink-500/20 text-pink-500';
                  case 'Social Media': return 'bg-cyan-500/20 text-cyan-500';
                  default: return 'bg-blue-500/20 text-blue-500';
                }
              };
              
              return (
                <div key={index} className="bg-dgsm-secondary rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-dgsm-border hover:bg-navy-700">
                  <h3 className="font-semibold text-dgsm-text-primary mb-3">{integration.name}</h3>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColors(integration.category)}`}>
                    {integration.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Collaboration Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dgsm-text-primary mb-4">
              Team Collaboration & Management
            </h2>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Powerful multi-user workspace tools designed for marketing teams of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Main Feature Card */}
            <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border">
              <div className="flex items-center mb-6">
                <div className="text-4xl p-4 rounded-lg bg-blue-500/20 mr-6">
                  👥
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dgsm-text-primary">Multi-User Workspace</h3>
                  <p className="text-dgsm-text-secondary">Centralized collaboration platform</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Role-based permissions (Admin, Editor, Viewer)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Real-time collaboration on campaigns and strategies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Team activity tracking and instant notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Shared asset libraries and template repositories</span>
                </li>
              </ul>
            </div>

            {/* Secondary Feature Cards */}
            <div className="space-y-6">
              <div className="bg-dgsm-secondary rounded-xl p-6 shadow-lg border border-dgsm-border">
                <div className="flex items-center mb-4">
                  <div className="text-2xl p-3 rounded-lg bg-green-500/20 mr-4">
                    📊
                  </div>
                  <h4 className="text-xl font-bold text-dgsm-text-primary">Team Performance Dashboards</h4>
                </div>
                <p className="text-dgsm-text-secondary">Monitor individual and team performance metrics with detailed analytics and productivity insights.</p>
              </div>

              <div className="bg-dgsm-secondary rounded-xl p-6 shadow-lg border border-dgsm-border">
                <div className="flex items-center mb-4">
                  <div className="text-2xl p-3 rounded-lg bg-orange-500/20 mr-4">
                    ✅
                  </div>
                  <h4 className="text-xl font-bold text-dgsm-text-primary">Approval Workflows</h4>
                </div>
                <p className="text-dgsm-text-secondary">Streamlined comment and approval processes with automated workflows for campaign reviews and sign-offs.</p>
              </div>

              <div className="bg-dgsm-secondary rounded-xl p-6 shadow-lg border border-dgsm-border">
                <div className="flex items-center mb-4">
                  <div className="text-2xl p-3 rounded-lg bg-purple-500/20 mr-4">
                    📋
                  </div>
                  <h4 className="text-xl font-bold text-dgsm-text-primary">Project Management</h4>
                </div>
                <p className="text-dgsm-text-secondary">Advanced project assignment, task management, and deadline tracking with integrated calendar views.</p>
              </div>
            </div>
          </div>

          {/* Plan Availability */}
          <div className="bg-dgsm-primary rounded-lg p-6 border border-dgsm-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-lg font-semibold text-dgsm-text-primary mb-2">Available in Plans:</h4>
                <div className="flex gap-3">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Professional (10 users)</span>
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">Enterprise (Unlimited)</span>
                </div>
              </div>
              <Link 
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Access */}
      <section className="py-20 bg-dgsm-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dgsm-text-primary mb-4">
              Mobile App Access & Management
            </h2>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Full-featured mobile applications for iOS and Android with comprehensive campaign management on the go
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* iOS & Android Apps */}
            <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border">
              <div className="text-4xl mb-6 text-center">📱</div>
              <h3 className="text-2xl font-bold text-dgsm-text-primary mb-4 text-center">Native Mobile Apps</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">iOS and Android native applications</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Full campaign management capabilities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Touch-optimized campaign builder</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Offline access to key analytics</span>
                </li>
              </ul>
            </div>

            {/* Real-time Features */}
            <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border">
              <div className="text-4xl mb-6 text-center">🔔</div>
              <h3 className="text-2xl font-bold text-dgsm-text-primary mb-4 text-center">Real-time Notifications</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Push notifications for important updates</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Campaign performance alerts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Team collaboration notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Budget and threshold warnings</span>
                </li>
              </ul>
            </div>

            {/* Mobile Analytics */}
            <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border">
              <div className="text-4xl mb-6 text-center">📍</div>
              <h3 className="text-2xl font-bold text-dgsm-text-primary mb-4 text-center">Advanced Mobile Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Location-based targeting tools</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Mobile performance analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Mobile-optimized dashboard</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-dgsm-text-secondary">Voice command integration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile App Showcase */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-dgsm-border">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-dgsm-text-primary mb-4">Download 🚀 Atlas AI Mobile</h4>
              <p className="text-dgsm-text-secondary mb-6">Available for all paid plans. Sync seamlessly with your desktop experience.</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="bg-dgsm-secondary px-6 py-3 rounded-lg border border-dgsm-border">
                  <span className="text-dgsm-text-primary font-semibold">📱 iOS App Store</span>
                </div>
                <div className="bg-dgsm-secondary px-6 py-3 rounded-lg border border-dgsm-border">
                  <span className="text-dgsm-text-primary font-semibold">🤖 Google Play Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White-label Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dgsm-text-primary mb-4">
              White-label Solutions & Custom Branding
            </h2>
            <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
              Enterprise-grade customization for agencies and partners who want to offer 🚀 Atlas AI under their own brand
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Branding & Customization */}
            <div>
              <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border mb-8">
                <div className="flex items-center mb-6">
                  <div className="text-4xl p-4 rounded-lg bg-green-500/20 mr-6">
                    🎨
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-dgsm-text-primary">Custom Branding</h3>
                    <p className="text-dgsm-text-secondary">Complete visual identity customization</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Custom logo integration and brand colors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Branded client portals and dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Custom domain configuration and SSL</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Branded email templates and reports</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dgsm-secondary rounded-lg p-6 shadow-lg border border-dgsm-border">
                  <div className="text-2xl mb-4">🏷️</div>
                  <h4 className="text-lg font-bold text-dgsm-text-primary mb-2">Branded Mobile Apps</h4>
                  <p className="text-dgsm-text-secondary text-sm">Custom iOS and Android apps with your branding for enterprise clients.</p>
                </div>
                <div className="bg-dgsm-secondary rounded-lg p-6 shadow-lg border border-dgsm-border">
                  <div className="text-2xl mb-4">📧</div>
                  <h4 className="text-lg font-bold text-dgsm-text-primary mb-2">Custom Onboarding</h4>
                  <p className="text-dgsm-text-secondary text-sm">Personalized training programs and onboarding experiences under your brand.</p>
                </div>
              </div>
            </div>

            {/* Partner Program */}
            <div>
              <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border mb-8">
                <div className="flex items-center mb-6">
                  <div className="text-4xl p-4 rounded-lg bg-purple-500/20 mr-6">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-dgsm-text-primary">Partner & Reseller Program</h3>
                    <p className="text-dgsm-text-secondary">Revenue sharing and partnership opportunities</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Revenue sharing up to 40% commission</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Dedicated partner success manager</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Marketing materials and sales training</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-dgsm-text-secondary">Priority technical support and resources</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-dgsm-border">
                <h4 className="text-xl font-bold text-dgsm-text-primary mb-4">Enterprise Benefits</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">99.9%</div>
                    <div className="text-sm text-dgsm-text-secondary">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">24/7</div>
                    <div className="text-sm text-dgsm-text-secondary">Priority Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">SOC 2</div>
                    <div className="text-sm text-dgsm-text-secondary">Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">API</div>
                    <div className="text-sm text-dgsm-text-secondary">Full Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Contact */}
          <div className="bg-dgsm-primary rounded-xl p-8 border border-dgsm-border text-center">
            <h4 className="text-2xl font-bold text-dgsm-text-primary mb-4">Ready to Launch Your White-label Solution?</h4>
            <p className="text-dgsm-text-secondary mb-6 max-w-2xl mx-auto">
              Join leading agencies and enterprises who trust 🚀 Atlas AI to power their marketing automation offerings. 
              Get custom pricing and implementation support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('/contact', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Enterprise Sales
              </button>
              <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Download Partner Kit
              </button>
            </div>
            <div className="mt-4">
              <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                Enterprise Plan Required
              </span>
            </div>
          </div>
        </div>
      </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HolographicInterface variant="dashboard" className="p-12">
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 glow-text-purple">
                  Ready to Experience These Features?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of marketers who are already leveraging 🚀 Atlas AI to transform their digital marketing efforts
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link 
                    to="/signup"
                    className="holo-button px-8 py-4 rounded-lg font-semibold text-lg inline-block"
                  >
                    Start Free Trial
                  </Link>
                  <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50">
                    Schedule Demo
                  </button>
                </div>
                
                {/* Feature Status */}
                <div className="flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                    <span className="text-green-400">All Features Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-glow"></div>
                    <span className="text-cyan-400">AI Learning</span>
                  </div>
                </div>
              </div>
            </HolographicInterface>
          </div>
          
          {/* Final floating elements */}
          <div className="absolute top-1/2 left-10 w-4 h-4 targeting-circle opacity-20"></div>
          <div className="absolute top-1/2 right-10 w-4 h-4 targeting-circle opacity-20"></div>
        </section>
      </div>
    </FuturisticEffects>
  );
};

export default FeaturesPage;
