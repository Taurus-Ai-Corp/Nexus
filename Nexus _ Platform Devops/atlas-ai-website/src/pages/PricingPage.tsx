import React from 'react';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { Footer } from '../components/Footer';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Perfect for small businesses getting started with AI marketing automation',
      icon: Zap,
      features: [
        '5 AI automation templates',
        'Basic analytics dashboard',
        '1,000 monthly campaigns',
        'Email support',
        '3 platform integrations',
        'Basic team collaboration'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'per month', 
      description: 'Ideal for growing teams that need advanced AI features and integrations',
      icon: Crown,
      features: [
        '25+ AI automation templates',
        'Advanced analytics & insights',
        '10,000 monthly campaigns',
        'Priority support',
        '9 platform integrations',
        'Advanced team management',
        'A/B testing automation',
        'Custom AI training'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'Comprehensive solution for large organizations with custom requirements',
      icon: Building,
      features: [
        'Unlimited AI templates',
        'Custom analytics dashboard',
        'Unlimited campaigns',
        '24/7 dedicated support',
        'All platform integrations',
        'White-label solutions',
        'Custom AI development',
        'SOC 2 compliance',
        'Dedicated account manager'
      ],
      popular: false
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto mb-12">
            Choose the perfect plan for your business. Start with our free trial and scale as you grow.
          </p>
          
          <div className="inline-flex items-center gap-4 p-2 bg-gray-800 rounded-lg">
            <span className="px-4 py-2 bg-gradient-to-r from-[#00EEFF] to-[#AA00FF] text-white rounded-md font-medium">
              Monthly
            </span>
            <span className="px-4 py-2 text-[#E0E0E0]">
              Annual (Save 20%)
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div key={index} className={`glow-card p-8 space-y-8 relative ${plan.popular ? 'glow-card-green' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#00EEFF] to-[#00FF7F] text-white px-4 py-2 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <p className="text-[#E0E0E0] text-sm">{plan.description}</p>
                    </div>
                    <div>
                      <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-[#E0E0E0] ml-2">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                        <span className="text-[#E0E0E0] text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'glow-button'
                      : 'glow-button-outline'
                  }`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-[#E0E0E0]">Everything you need to know about Atlas AI pricing</p>
          </div>
          
          <div className="space-y-6">
            <div className="glow-card p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Can I change my plan at any time?</h4>
              <p className="text-[#E0E0E0]">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="glow-card p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Is there a free trial available?</h4>
              <p className="text-[#E0E0E0]">We offer a 14-day free trial for all plans. No credit card required to get started.</p>
            </div>
            <div className="glow-card p-6">
              <h4 className="text-lg font-semibold text-white mb-2">What integrations are included?</h4>
              <p className="text-[#E0E0E0]">All plans include core integrations. Professional and Enterprise plans include additional premium integrations.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
