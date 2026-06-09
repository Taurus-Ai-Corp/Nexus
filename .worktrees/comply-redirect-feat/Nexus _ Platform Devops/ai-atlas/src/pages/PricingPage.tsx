import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { showSignupModal } = useModal();

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started with AI marketing',
      monthlyPrice: 49,
      annualPrice: 39,
      color: 'blue',
      popular: false,
      features: [
        'Up to 5,000 contacts',
        'Basic email automation',
        '10 AI-generated campaigns per month',
        'Standard analytics dashboard',
        'Email support',
        '2 team members',
        'Basic integrations (10+)',
        'Mobile app access'
      ]
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing marketing teams',
      monthlyPrice: 149,
      annualPrice: 119,
      color: 'green',
      popular: true,
      features: [
        'Up to 25,000 contacts',
        'Advanced automation workflows',
        'Unlimited AI campaigns',
        'Advanced analytics & reporting',
        'Priority support',
        '10 team members',
        'Premium integrations (50+)',
        'A/B testing suite',
        'Custom branding',
        'Lead scoring',
        'Social media automation'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      monthlyPrice: 449,
      annualPrice: 359,
      color: 'purple',
      popular: false,
      features: [
        'Unlimited contacts',
        'Enterprise automation suite',
        'Custom AI model training',
        'Advanced predictive analytics',
        'Dedicated account manager',
        'Unlimited team members',
        'Custom integrations',
        'White-label solutions',
        'Advanced security & compliance',
        'Custom reporting',
        'API access',
        '24/7 phone support'
      ]
    }
  ];

  const addOns = [
    {
      name: 'Advanced AI Content Generator',
      description: 'Generate high-quality marketing content with GPT-4 integration',
      price: 29,
      icon: '🤖'
    },
    {
      name: 'Predictive Analytics Suite',
      description: 'Advanced forecasting and predictive modeling capabilities',
      price: 79,
      icon: '📈'
    },
    {
      name: 'Custom Integration Development',
      description: 'Build custom integrations with your existing tools',
      price: 199,
      icon: '🔧'
    },
    {
      name: 'Dedicated Customer Success Manager',
      description: 'Personal guidance and strategic planning support',
      price: 299,
      icon: '👥'
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Liu',
      company: 'TechStartup Co.',
      content: '🚀 Atlas AI Professional plan helped us scale our marketing efforts efficiently. ROI improved by 240% in 6 months.',
      plan: 'Professional'
    },
    {
      name: 'Marcus Johnson',
      company: 'Enterprise Corp',
      content: 'The Enterprise features and dedicated support transformed our marketing operations. Highly recommended.',
      plan: 'Enterprise'
    }
  ];

  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dgsm-text-primary mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-dgsm-text-secondary mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your marketing needs. All plans include our core AI features and 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!isAnnual ? 'text-dgsm-text-primary' : 'text-dgsm-text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-dgsm-accent-green' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-dgsm-text-primary' : 'text-dgsm-text-muted'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 bg-dgsm-accent-green/20 text-dgsm-accent-green px-2 py-1 rounded-full text-sm font-semibold">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const getPlanColors = (color: string) => {
                switch(color) {
                  case 'blue': return { 
                    price: 'text-blue-500', 
                    button: 'bg-blue-500', 
                    buttonBorder: 'border-blue-500 text-blue-500 hover:bg-blue-500',
                    indicator: 'bg-blue-500'
                  };
                  case 'green': return { 
                    price: 'text-green-500', 
                    button: 'bg-green-500', 
                    buttonBorder: 'border-green-500 text-green-500 hover:bg-green-500',
                    indicator: 'bg-green-500'
                  };
                  case 'purple': return { 
                    price: 'text-purple-500', 
                    button: 'bg-purple-500', 
                    buttonBorder: 'border-purple-500 text-purple-500 hover:bg-purple-500',
                    indicator: 'bg-purple-500'
                  };
                  default: return { 
                    price: 'text-blue-500', 
                    button: 'bg-blue-500', 
                    buttonBorder: 'border-blue-500 text-blue-500 hover:bg-blue-500',
                    indicator: 'bg-blue-500'
                  };
                }
              };
              
              const colors = getPlanColors(plan.color);
              
              return (
                <div key={index} className={`relative bg-dgsm-secondary rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-dgsm-border ${
                  plan.popular ? 'ring-2 ring-green-500' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-dgsm-text-primary mb-2">{plan.name}</h3>
                    <p className="text-dgsm-text-secondary mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${colors.price}`}>
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-dgsm-text-muted ml-2">/month</span>
                      {isAnnual && (
                        <div className="text-sm text-dgsm-text-muted mt-1">
                          Billed annually (${(isAnnual ? plan.annualPrice : plan.monthlyPrice) * 12})
                        </div>
                      )}
                    </div>
                    
                    {plan.name === 'Enterprise' ? (
                      <Link
                        to="/contact"
                        className={`w-full py-3 rounded-lg font-semibold transition-colors text-center block ${
                          plan.popular 
                            ? `${colors.button} text-white hover:opacity-90`
                            : `border-2 ${colors.buttonBorder} hover:text-white`
                        }`}
                      >
                        Contact Sales
                      </Link>
                    ) : (
                      <Link
                        to="/signup"
                        className={`w-full py-3 rounded-lg font-semibold transition-colors text-center block ${
                          plan.popular 
                            ? `${colors.button} text-white hover:opacity-90`
                            : `border-2 ${colors.buttonBorder} hover:text-white`
                        }`}
                      >
                        Start Free Trial
                      </Link>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-dgsm-text-primary mb-4">Everything in {plan.name}:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className={`w-2 h-2 ${colors.indicator} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                          <span className="text-dgsm-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dgsm-text-primary mb-4">Additional Options</h2>
            <p className="text-xl text-dgsm-text-secondary">
              Enhance your plan with powerful add-ons
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-dgsm-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{addon.icon}</div>
                    <div>
                      <h3 className="font-bold text-dgsm-text-primary">{addon.name}</h3>
                      <p className="text-dgsm-text-secondary text-sm">{addon.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-500">${addon.price}</div>
                    <div className="text-dgsm-text-muted text-sm">/month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dgsm-text-primary mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-dgsm-secondary rounded-lg p-8 shadow-lg border border-dgsm-border">
                <p className="text-dgsm-text-secondary leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-dgsm-text-primary">{testimonial.name}</h4>
                    <p className="text-dgsm-text-muted text-sm">{testimonial.company}</p>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                    {testimonial.plan} Plan
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dgsm-text-primary mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
              },
              {
                question: "Is there a free trial available?",
                answer: "All plans include a 14-day free trial with full access to features. No credit card required to start."
              },
              {
                question: "What happens if I exceed my contact limit?",
                answer: "We'll notify you when you approach your limit. You can upgrade your plan or purchase additional contact blocks."
              },
              {
                question: "Do you offer custom enterprise solutions?",
                answer: "Yes, we provide custom solutions for large organizations with specific requirements. Contact our sales team for details."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-dgsm-secondary rounded-lg p-6 border border-dgsm-border">
                <h3 className="font-bold text-dgsm-text-primary mb-3">{faq.question}</h3>
                <p className="text-dgsm-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-dgsm-accent-green to-dgsm-accent-blue rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mb-6">
              Join thousands of companies using 🚀 Atlas AI to optimize their marketing efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Free Trial
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
