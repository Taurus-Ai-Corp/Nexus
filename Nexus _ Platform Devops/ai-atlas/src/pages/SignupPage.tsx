import React, { useState } from 'react';
import { ArrowLeft, Check, Shield, CreditCard, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import FuturisticEffects from '../components/FuturisticEffects';
import EnhancedForm from '../components/EnhancedForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLoadingState } from '../hooks/useLoadingState';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  discountCode: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  country: string;
  postalCode: string;
}

interface FormErrors {
  [key: string]: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    discountCode: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    country: 'United States',
    postalCode: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    starter: { 
      name: 'Starter', 
      monthly: 49, 
      yearly: 490, 
      features: ['10 AI Campaigns/month', 'Basic Templates', 'Email Support'] 
    },
    professional: { 
      name: 'Professional', 
      monthly: 149, 
      yearly: 1490, 
      features: ['Unlimited AI Campaigns', '60+ Premium Templates', 'Priority Support', 'Advanced Analytics'] 
    },
    enterprise: { 
      name: 'Enterprise', 
      monthly: 449, 
      yearly: 4490, 
      features: ['Everything in Professional', 'Custom Integrations', 'Dedicated Account Manager', 'White-label Options'] 
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const currentPrice = billingType === 'monthly' ? currentPlan.monthly : currentPlan.yearly / 12;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? 'This field is required' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'cardNumber':
        const cardRegex = /^\d{13,19}$/;
        return !cardRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid card number' : '';
      case 'expiryDate':
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return !expiryRegex.test(value) ? 'Please enter MM/YY format' : '';
      case 'securityCode':
        const cvcRegex = /^\d{3,4}$/;
        return !cvcRegex.test(value) ? 'Please enter a valid CVC' : '';
      case 'postalCode':
        return value.trim() === '' ? 'Postal code is required' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'discountCode') { // Discount code is optional
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // In real implementation, integrate with Stripe here
      alert('Payment processing would happen here with Stripe integration!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <ParticleBackground />
      <FuturisticEffects>
        <></>
      </FuturisticEffects>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to 🚀 Atlas AI
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start lg:items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Side - Signup Form */}
          <div className="lg:max-w-md mx-auto lg:mx-0">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.firstName ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.lastName ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Smith"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Code
                    </label>
                    <input
                      type="text"
                      name="discountCode"
                      value={formData.discountCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="1234 1234 1234 1234"
                      />
                      <div className="absolute right-3 top-3 flex space-x-1">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                    
                    <div className="flex items-center mt-2 text-sm text-green-400">
                      <Shield className="w-4 h-4 mr-2" />
                      Secure, 1-click checkout with Link
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Security Code *
                      </label>
                      <input
                        type="text"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleInputChange}
                        maxLength={4}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.securityCode ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="CVC"
                      />
                      {errors.securityCode && <p className="text-red-400 text-sm mt-1">{errors.securityCode}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="12345"
                      />
                      {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Start My Free Trial'
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By providing your card information, you allow Flux Inc. to charge your card for future payments in accordance with their terms.
                </p>
              </form>
            </div>
          </div>

          {/* Right Side - Promotional Content */}
          <div className="lg:pl-8">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Create AI-Powered Marketing Campaigns{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  10x Faster
                </span>{' '}
                And Grow Your Business With Advanced Automation!
              </h1>
            </div>

            {/* Free Trial Benefits */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 mb-8">
              <h2 className="text-2xl font-bold text-green-400 mb-6">100% NO-RISK FREE TRIAL</h2>
              <div className="space-y-3">
                {[
                  'Cancel anytime, hassle-free',
                  'Pay nothing for the first 14 days',
                  '30-day money back GUARANTEE after your trial ends',
                  'Access to 60+ automation templates',
                  'Full AI assistant capabilities'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Selection */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Your Plan</h3>
                
                {/* Billing Toggle */}
                <div className="flex items-center justify-center mb-6">
                  <span className={`mr-3 ${billingType === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
                  <button
                    onClick={() => setBillingType(billingType === 'monthly' ? 'yearly' : 'monthly')}
                    className="relative w-12 h-6 bg-slate-600 rounded-full transition-colors duration-300 focus:outline-none"
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-cyan-400 rounded-full transition-transform duration-300 ${
                      billingType === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className={`ml-3 ${billingType === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                    Yearly <span className="text-green-400 text-sm">(Save 17%)</span>
                  </span>
                </div>

                {/* Plan Options */}
                <div className="space-y-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPlan === key
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{plan.name} {billingType === 'monthly' ? 'Monthly' : 'Yearly'}</h4>
                          <p className="text-gray-400 text-sm">${billingType === 'monthly' ? plan.monthly : Math.round(plan.yearly / 12)}/mo</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPlan === key ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Plan Details */}
              <div className="border-t border-gray-600 pt-6">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-white">
                    ${currentPrice}/mo
                  </p>
                  <p className="text-green-400 font-semibold text-lg">$0 due today</p>
                  {billingType === 'yearly' && (
                    <p className="text-sm text-gray-400">
                      Billed annually (${billingType === 'yearly' ? currentPlan.yearly : currentPlan.monthly * 12}/year)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Holographic Brain Visual */}
            <div className="mt-8 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🧠</div>
                </div>
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
              <p className="text-gray-400 mt-4">AI-Powered Marketing Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;