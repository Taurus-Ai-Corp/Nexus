import React, { useState } from 'react';
import { Eye, EyeOff, Check, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  
  const benefits = [
    'Access to 60+ AI automation templates',
    '14-day free trial - no credit card required',
    'Advanced analytics and insights',
    'Multi-platform integrations',
    '24/7 customer support',
    'Cancel anytime - no commitments'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Professional success handling - in production this would handle actual signup
    setIsSubmitted(true);
    
    // Scroll to success message
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-16">
      {/* Success Message */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-[#00FF7F]/20 to-[#00EEFF]/20 border border-[#00FF7F] p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-[#00FF7F]" />
              <div>
                <h3 className="text-white font-semibold">Thank you for your interest!</h3>
                <p className="text-[#E0E0E0] text-sm">
                  This is a frontend demonstration. In production, your trial would be activated immediately.
                  <span className="text-[#00EEFF]"> No data has been saved or transmitted.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Signup Form */}
            <div className="glow-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-4">
                  Start Your Free Trial
                </h1>
                <p className="text-[#E0E0E0]">
                  Join thousands of marketers transforming their campaigns with AI
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors"
                    placeholder="Your Company"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors pr-12"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#E0E0E0] text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00EEFF] focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-[#00EEFF] bg-gray-800 border-gray-600 rounded focus:ring-[#00EEFF] focus:ring-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-[#E0E0E0] leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#00EEFF] hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-[#00EEFF] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full glow-button py-4 text-lg font-semibold"
                >
                  Start Free Trial - No Credit Card Required
                </button>

                <div className="text-center">
                  <p className="text-[#E0E0E0] text-sm">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => alert('Sign in functionality coming soon!')}
                      className="text-[#00EEFF] hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Benefits */}
            <div className="space-y-8">
              <div className="glow-card-green p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  What You Get With Your Free Trial
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-[#E0E0E0]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Indicators */}
              <div className="grid gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <Zap className="w-8 h-8 text-neon-green" />
                  <div>
                    <h4 className="font-semibold text-white">Instant Setup</h4>
                    <p className="text-[#E0E0E0] text-sm">Get started in less than 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <Shield className="w-8 h-8 text-neon-green" />
                  <div>
                    <h4 className="font-semibold text-white">Enterprise Security</h4>
                    <p className="text-[#E0E0E0] text-sm">SOC 2 compliant with 99.9% uptime</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <Users className="w-8 h-8 text-neon-green" />
                  <div>
                    <h4 className="font-semibold text-white">10K+ Happy Users</h4>
                    <p className="text-[#E0E0E0] text-sm">Join successful marketing teams worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Trusted by Marketing Teams Worldwide
            </h3>
            <div className="grid md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">10K+</div>
                <div className="text-[#E0E0E0] text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">312%</div>
                <div className="text-[#E0E0E0] text-sm">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">99.2%</div>
                <div className="text-[#E0E0E0] text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">24/7</div>
                <div className="text-[#E0E0E0] text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
