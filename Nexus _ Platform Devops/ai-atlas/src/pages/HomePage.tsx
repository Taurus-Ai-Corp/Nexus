import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      {/* Glowing Dots Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60 top-1/4 left-1/4"></div>
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40 top-1/3 right-1/4"></div>
        <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-30 bottom-1/4 left-1/3"></div>
        <div className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-50 top-1/2 right-1/3"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left space-y-8 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Create AI-Powered Marketing
              <br />
              Campaigns{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                10x Faster
              </span>
              <br />
              And Grow Your Business With 🚀 Atlas AI!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              The most advanced AI automation platform with 60+ templates, 9 platform integrations, and 25+ AI agents at your command.
            </p>
            
            {/* Location and Status Information */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left space-y-3">
                <p className="text-cyan-400 font-semibold">Welcome to Atlas AI - Advanced Marketing Automation</p>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Your location: Charlottesville, United States</p>
                  <p>Currency: USD</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">AI Systems: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400">Templates: Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-400">Agents: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400">STATUS: ACTIVE</span>
                  </div>
                </div>
                <p className="text-yellow-400 font-medium">AI: OPTIMIZING</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Watch Demo
              </button>
              <Link 
                to="/signup" 
                className="px-8 py-4 bg-slate-800 border border-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          
          {/* Right Column - Live AI Dashboard */}
          <div className="relative">
            <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">Live AI Dashboard</h3>
                  <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-white">2,847</div>
                      <div className="text-sm text-gray-400">Campaigns</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">94%</div>
                      <div className="text-sm text-gray-400">AI Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">312%</div>
                      <div className="text-sm text-gray-400">ROI</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">1.2M</div>
                      <div className="text-sm text-gray-400">Active Neural Network Activity</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold text-sm">ONLINE</span>
                    </div>
                    <div className="text-orange-400 font-semibold text-sm animate-pulse">PROCESSING...</div>
                    <div className="text-blue-400 font-semibold text-sm">AI LEARNING</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Real-Time AI Performance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-Time AI Performance</h2>
            <p className="text-xl text-gray-400">Live metrics from our global AI marketing platform</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors duration-200">
              <div className="text-2xl mb-2">🧠⚡</div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">60+</div>
              <div className="text-sm text-gray-300 mb-1">AI Templates</div>
              <div className="text-xs text-green-400">↗+12%</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-3xl font-bold text-blue-400 mb-2">9</div>
              <div className="text-sm text-gray-300 mb-1">Platforms</div>
              <div className="text-xs text-green-400">↗+8%</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-3xl font-bold text-purple-400 mb-2">25+</div>
              <div className="text-sm text-gray-300 mb-1">AI Agents</div>
              <div className="text-xs text-green-400">↗+15%</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-pink-400 transition-colors duration-200">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-3xl font-bold text-pink-400 mb-2">1000+</div>
              <div className="text-sm text-gray-300 mb-1">Automations</div>
              <div className="text-xs text-green-400">↗+25%</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-3xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-sm text-gray-300 mb-1">Active Users</div>
              <div className="text-xs text-green-400">↗+18%</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors duration-200">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">99.2%</div>
              <div className="text-sm text-gray-300 mb-1">Success Rate</div>
              <div className="text-xs text-green-400">↗+5%</div>
            </div>
          </div>
          
          {/* Dashboard Summary Stats */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">📊</div>
                <div className="text-3xl font-bold text-white mb-2">2,847</div>
                <div className="text-gray-400">Active Projects</div>
              </div>
              <div>
                <div className="text-2xl mb-2">✅</div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">15,439</div>
                <div className="text-gray-400">Completed Campaigns</div>
              </div>
              <div>
                <div className="text-2xl mb-2">👥</div>
                <div className="text-3xl font-bold text-purple-400 mb-2">8,924</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-2xl mb-2">💰</div>
                <div className="text-3xl font-bold text-green-400 mb-2">$2.4M</div>
                <div className="text-gray-400">Revenue Generated</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Powerful Features for Modern Marketing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Marketing</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Everything you need to automate, optimize, and scale your marketing efforts with AI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Campaign Management</h3>
              <p className="text-gray-400">Create and manage comprehensive marketing campaigns with AI-powered optimization.</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Analytics</h3>
              <p className="text-gray-400">Leverage predictive analytics and machine learning for marketing insights.</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Content Management</h3>
              <p className="text-gray-400">AI-powered content creation, optimization, and personalization.</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors duration-200 group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Automation Suite</h3>
              <p className="text-gray-400">Complete marketing automation with intelligent workflows.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/features" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Explore All Features
            </Link>
          </div>
        </div>
      </section>
      
      {/* What Our Clients Say Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied marketing professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                </div>
                <p className="text-gray-300">"🚀 Atlas AI transformed our marketing efficiency by 300%. The predictive analytics helped us identify high-value customers before our competitors."</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SC</span>
                </div>
                <div>
                  <div className="font-bold text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Marketing Director</div>
                  <div className="text-sm text-gray-500">TechFlow Inc.</div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                </div>
                <p className="text-gray-300">"The automation features saved us 40 hours per week. Our conversion rates improved by 150% within the first month."</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <div className="font-bold text-white">Michael Rodriguez</div>
                  <div className="text-sm text-gray-400">Growth Manager</div>
                  <div className="text-sm text-gray-500">StartupBoost</div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                </div>
                <p className="text-gray-300">"Integrating 🚀 Atlas AI with our existing tools was seamless. The ROI insights are incredibly accurate and actionable."</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">EW</span>
                </div>
                <div>
                  <div className="font-bold text-white">Emily Watson</div>
                  <div className="text-sm text-gray-400">CMO</div>
                  <div className="text-sm text-gray-500">Enterprise Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Automation Templates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Automation Templates</h2>
            <p className="text-xl text-gray-400">60+ Pre-built automation workflows to transform your business operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Template 1 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ultimate LinkedIn Automation</h3>
              <p className="text-sm text-gray-400 mb-3">Transform viral news into engaging LinkedIn posts with AI-generated images</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: LinkedIn, n8n, ChatGPT</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 2 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Lead Follow-Up System</h3>
              <p className="text-sm text-gray-400 mb-3">AI-powered personalized follow-up emails that convert prospects</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Gmail, OpenAI, Slack</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 3 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">📰</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Viral News Scraper</h3>
              <p className="text-sm text-gray-400 mb-3">Automatically finds trending topics for social media content</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: RSS, Airtable, AI</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 4 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Platform Publishing Bot</h3>
              <p className="text-sm text-gray-400 mb-3">Publish to 9 social platforms simultaneously with AI optimization</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Twitter, Facebook, Instagram, LinkedIn</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 5 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🎬</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Avatar Video Creator</h3>
              <p className="text-sm text-gray-400 mb-3">Create talking-head videos without filming using AI clones</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: HeyGen, Blotato, Make.com</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 6 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">E-commerce Chatbot</h3>
              <p className="text-sm text-gray-400 mb-3">WooCommerce integration with order tracking and customer support</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: WooCommerce, Telegram, AI</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 7 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">♻️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Content Repurposing Engine</h3>
              <p className="text-sm text-gray-400 mb-3">Transform long-form content into multiple social media formats</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Google Sheets, Perplexity, ChatGPT</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 8 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Job Search Automation</h3>
              <p className="text-sm text-gray-400 mb-3">AI-powered job matching with real-time listings and scoring</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Adzuna API, OpenAI, n8n</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 9 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">✈️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Travel Agency Chatbot</h3>
              <p className="text-sm text-gray-400 mb-3">AI chatbot for collecting and managing travel leads</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Voiceflow, Google Sheets</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 10 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automated Carousels Creator</h3>
              <p className="text-sm text-gray-400 mb-3">Generate beautiful social media carousels and slideshows</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: ChatGPT, Blotato, n8n</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 11 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">📹</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Faceless Video Automation</h3>
              <p className="text-sm text-gray-400 mb-3">Create and post faceless AI videos to social platforms</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: AI Agent, Blotato, Make</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
            
            {/* Template 12 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors duration-200 group">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-500 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl">🗣️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Siri AI Automation</h3>
              <p className="text-sm text-gray-400 mb-3">Voice-activated AI automations through Siri integration</p>
              <p className="text-xs text-gray-500 mb-4">Integrations: Siri, n8n, Apple Shortcuts</p>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Get Template</button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Browse All 60+ Templates
            </button>
          </div>
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Marketing?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers who are already leveraging 🚀 Atlas AI to achieve unprecedented growth and efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Sales
            </Link>
          </div>
          
          <p className="text-blue-100 mb-8">Transform your digital marketing with AI-powered automation. The intelligent platform that learns and adapts to optimize your marketing efforts.</p>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;