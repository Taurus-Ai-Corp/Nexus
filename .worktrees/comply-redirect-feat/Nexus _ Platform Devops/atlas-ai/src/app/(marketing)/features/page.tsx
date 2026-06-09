import Link from "next/link";

const aiMarketingTools = [
  {
    title: "Email Performance Analysis",
    description: "AI-powered email campaign analysis with predictive open rates, click-through optimization, and subject line testing",
    icon: "📧"
  },
  {
    title: "Content Recommendations",
    description: "Real-time content suggestions based on search data, trending topics, and audience preferences",
    icon: "📝"
  },
  {
    title: "Automated Bid Adjustments",
    description: "Dynamic bid management for ad campaigns using machine learning algorithms and real-time market analysis",
    icon: "⚡"
  },
  {
    title: "Social Media Insights",
    description: "Advanced social media analytics with sentiment analysis, influencer identification, and engagement optimization",
    icon: "📱"
  },
  {
    title: "Task Automation Workflows",
    description: "Intelligent workflow automation for repetitive marketing tasks with custom trigger conditions",
    icon: "🔄"
  },
  {
    title: "CRM Integration & Prediction",
    description: "Advanced CRM integration with predictive lead scoring, customer lifetime value calculation, and churn prediction",
    icon: "🎯"
  }
];

const integrations = [
  { name: "Google Analytics", type: "Analytics" },
  { name: "Facebook Ads", type: "Advertising" },
  { name: "Google Ads", type: "Advertising" },
  { name: "HubSpot", type: "CRM" },
  { name: "Salesforce", type: "CRM" },
  { name: "Mailchimp", type: "Email" },
  { name: "Slack", type: "Communication" },
  { name: "Zapier", type: "Automation" },
  { name: "WordPress", type: "CMS" },
  { name: "Shopify", type: "E-commerce" },
  { name: "LinkedIn Ads", type: "Advertising" },
  { name: "Twitter API", type: "Social Media" }
];

const mobileFeatures = [
  {
    title: "Native Mobile Apps",
    features: [
      "iOS and Android native applications",
      "Full campaign management capabilities",
      "Touch-optimized campaign builder",
      "Offline access to key analytics"
    ]
  },
  {
    title: "Real-time Notifications",
    features: [
      "Push notifications for important updates",
      "Campaign performance alerts",
      "Team collaboration notifications",
      "Budget and threshold warnings"
    ]
  },
  {
    title: "Advanced Mobile Features",
    features: [
      "Location-based targeting tools",
      "Mobile performance analytics",
      "Mobile-optimized dashboard",
      "Voice command integration"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="pt-20">
      {/* Core Features Header */}
      <section className="px-6 py-16 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-8">
          Core Features
        </h1>
        <p className="text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
          Comprehensive marketing automation tools powered by advanced AI technology
        </p>
      </section>

      {/* Advanced AI Marketing Tools */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Advanced AI Marketing Tools
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Comprehensive suite of AI tools designed specifically for marketing optimization and automation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {aiMarketingTools.map((tool, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {tool.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seamless Third-Party Integrations */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Seamless Third-Party Integrations
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Connect 🚀 Atlas AI with your existing marketing stack for a unified experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 text-center"
              >
                <h4 className="font-medium text-white mb-1 text-sm">{integration.name}</h4>
                <p className="text-xs text-gray-500">{integration.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Collaboration & Management */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Team Collaboration & Management
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Powerful multi-user workspace tools designed for marketing teams of all sizes
            </p>
          </div>
          
          {/* Multi-User Workspace */}
          <div className="mb-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Multi-User Workspace</h3>
              <p className="text-gray-400 mb-6">Centralized collaboration platform</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Role-based permissions (Admin, Editor, Viewer)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Real-time collaboration on campaigns and strategies
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Team activity tracking and instant notifications
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Shared asset libraries and template repositories
                </li>
              </ul>
            </div>
          </div>

          {/* Other Team Features */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3">Team Performance Dashboards</h4>
              <p className="text-gray-400 text-sm">
                Monitor individual and team performance metrics with detailed analytics and productivity insights.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3">Approval Workflows</h4>
              <p className="text-gray-400 text-sm">
                Streamlined comment and approval processes with automated workflows for campaign reviews and sign-offs.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3">Project Management</h4>
              <p className="text-gray-400 text-sm">
                Advanced project assignment, task management, and deadline tracking with integrated calendar views.
              </p>
            </div>
          </div>

          {/* Available in Plans */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Available in Plans:</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 text-sm">
                Professional (10 users)
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 text-sm">
                Enterprise (Unlimited)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Access & Management */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Mobile App Access & Management
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Full-featured mobile applications for iOS and Android with comprehensive campaign management on the go
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {mobileFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold mb-6">{feature.title}</h3>
                <ul className="space-y-3 text-gray-300 text-left">
                  {feature.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <h4 className="text-xl font-bold mb-4">
              Download 🚀 Atlas AI Mobile
            </h4>
            <p className="text-gray-400">
              Available for all paid plans. Sync seamlessly with your desktop experience.
            </p>
          </div>
        </div>
      </section>

      {/* White-label Solutions & Custom Branding */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              White-label Solutions & Custom Branding
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Enterprise-grade customization for agencies and partners who want to offer 🚀 Atlas AI under their own brand
            </p>
          </div>
          
          {/* Custom Branding */}
          <div className="mb-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Custom Branding</h3>
              <p className="text-gray-400 mb-6">Complete visual identity customization</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Custom logo integration and brand colors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Branded client portals and dashboards
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Custom domain configuration and SSL
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Branded email templates and reports
                </li>
              </ul>
            </div>
          </div>

          {/* Other White-label Features */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3">Branded Mobile Apps</h4>
              <p className="text-gray-400 text-sm">
                Custom iOS and Android apps with your branding for enterprise clients.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3">Custom Onboarding</h4>
              <p className="text-gray-400 text-sm">
                Personalized training programs and onboarding experiences under your brand.
              </p>
            </div>
          </div>

          {/* Partner & Reseller Program */}
          <div className="mb-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Partner & Reseller Program</h3>
              <p className="text-gray-400 mb-6">Revenue sharing and partnership opportunities</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Revenue sharing up to 40% commission
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Dedicated partner success manager
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Marketing materials and sales training
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Priority technical support and resources
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Benefits */}
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Enterprise Benefits</h4>
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4">
                Ready to Launch Your White-label Solution?
              </h5>
              <p className="text-gray-400 mb-6">
                Join leading agencies and enterprises who trust 🚀 Atlas AI to power their marketing automation offerings. 
                Get custom pricing and implementation support.
              </p>
            </div>
            <div className="mb-8">
              <span className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 text-sm">
                Enterprise Plan Required
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}