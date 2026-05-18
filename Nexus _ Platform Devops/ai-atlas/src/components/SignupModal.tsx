import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Company Info
    company: '',
    role: '',
    industry: '',
    teamSize: '',
    phone: '',
    
    // Step 3: Plan & Preferences
    plan: 'starter',
    interests: [] as string[],
    acceptTerms: false,
    newsletter: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = '1086002727074-aacl72grlcpe1m3ck0ooct99k9v6b7g7.apps.googleusercontent.com';

  const handleGoogleSignup = async () => {
    try {
      setErrors({});
      setIsLoading(true);

      // Check if Google library is loaded
      if (typeof window.google === 'undefined' || !window.google?.accounts?.id) {
        setErrors({ general: 'Google OAuth service is temporarily unavailable. Please try again later.' });
        setIsLoading(false);
        return;
      }

      // Initialize Google OAuth
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          try {
            // Decode the JWT token to get user info
            const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
            
            console.log('Google signup successful:', {
              email: responsePayload.email,
              name: responsePayload.name,
              picture: responsePayload.picture
            });

            // Handle successful signup
            setIsLoading(false);
            onClose();
            
            // In real implementation, you would:
            // 1. Send the credential to your backend
            // 2. Verify the token
            // 3. Create new user account
            // 4. Start trial period
            // 5. Redirect to onboarding/dashboard
            
          } catch (err) {
            console.error('Error processing Google signup:', err);
            setErrors({ general: 'Failed to process Google signup. Please try again.' });
            setIsLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false
      });

      // Prompt the user to select an account
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // User dismissed the popup or it didn't show
          setErrors({ general: 'Google signup was cancelled. Please try again.' });
          setIsLoading(false);
        }
      });

    } catch (error) {
      console.error('Google signup error:', error);
      setErrors({ general: 'Google signup failed. Please try again.' });
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      description: 'Perfect for small teams',
      features: ['5,000 contacts', 'Basic automation', '10 AI campaigns/month']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      description: 'For growing teams',
      features: ['25,000 contacts', 'Advanced automation', 'Unlimited AI campaigns'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$449',
      description: 'For large organizations',
      features: ['Unlimited contacts', 'Custom AI models', 'Dedicated support']
    }
  ];

  const interests = [
    'Email Marketing',
    'Social Media Automation',
    'Lead Generation',
    'Content Marketing',
    'Analytics & Reporting',
    'Customer Segmentation',
    'A/B Testing',
    'Marketing Attribution'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (!formData.teamSize) newErrors.teamSize = 'Team size is required';
    }

    if (step === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Trial signup successful:', formData);
      // In real implementation, handle trial creation here
      
      // Show success and close modal
      onClose();
      
      // Could show a success toast or redirect to dashboard
      alert('Welcome to 🚀 Atlas AI! Your free trial has started.');
      
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-dgsm-secondary rounded-xl shadow-2xl w-full max-w-2xl border border-dgsm-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dgsm-border">
          <div>
            <h2 className="text-2xl font-bold text-dgsm-text-primary">Start Your Free Trial</h2>
            <p className="text-sm text-dgsm-text-secondary mt-1">
              Step {currentStep} of 3 - {currentStep === 1 ? 'Personal Information' : currentStep === 2 ? 'Company Details' : 'Plan Selection'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-dgsm-text-muted hover:text-dgsm-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-dgsm-border text-dgsm-text-muted'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step < currentStep ? 'bg-blue-500' : 'bg-dgsm-border'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-dgsm-border'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-dgsm-border'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-dgsm-border'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-500' : 'border-dgsm-border'
                    }`}
                    placeholder="Create a password (min 8 characters)"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-dgsm-border'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.company ? 'border-red-500' : 'border-dgsm-border'
                    }`}
                    placeholder="Enter your company name"
                  />
                  {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      Your Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.role ? 'border-red-500' : 'border-dgsm-border'
                      }`}
                    >
                      <option value="">Select your role</option>
                      <option value="marketing-manager">Marketing Manager</option>
                      <option value="marketing-director">Marketing Director</option>
                      <option value="cmo">Chief Marketing Officer</option>
                      <option value="growth-manager">Growth Manager</option>
                      <option value="digital-marketer">Digital Marketer</option>
                      <option value="founder">Founder/CEO</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.industry ? 'border-red-500' : 'border-dgsm-border'
                      }`}
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-dgsm-primary border rounded-lg text-dgsm-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.teamSize ? 'border-red-500' : 'border-dgsm-border'
                      }`}
                    >
                      <option value="">Select team size</option>
                      <option value="1-5">1-5 people</option>
                      <option value="6-20">6-20 people</option>
                      <option value="21-50">21-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="200+">200+ people</option>
                    </select>
                    {errors.teamSize && <p className="text-red-400 text-xs mt-1">{errors.teamSize}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dgsm-primary border border-dgsm-border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-dgsm-text-primary mb-4">Choose Your Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.plan === plan.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-dgsm-border bg-dgsm-primary hover:border-blue-500/50'
                        } ${plan.popular ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <div className="text-center">
                          <h4 className="font-semibold text-dgsm-text-primary">{plan.name}</h4>
                          <p className="text-2xl font-bold text-blue-500 my-2">{plan.price}<span className="text-sm text-dgsm-text-muted">/month</span></p>
                          <p className="text-sm text-dgsm-text-secondary mb-3">{plan.description}</p>
                          <ul className="text-xs text-dgsm-text-secondary space-y-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx}>✓ {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-dgsm-text-primary mb-4">What are you most interested in?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <label key={interest} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="w-4 h-4 text-blue-500 bg-dgsm-primary border-dgsm-border rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-dgsm-text-secondary">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 bg-dgsm-primary border-dgsm-border rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                    />
                    <span className="ml-2 text-sm text-dgsm-text-secondary">
                      I agree to the <a href="#" className="text-blue-500 hover:text-blue-400">Terms of Service</a> and <a href="#" className="text-blue-500 hover:text-blue-400">Privacy Policy</a> *
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-400 text-xs">{errors.acceptTerms}</p>}

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 bg-dgsm-primary border-dgsm-border rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                    />
                    <span className="ml-2 text-sm text-dgsm-text-secondary">
                      I'd like to receive marketing emails with tips and product updates
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-dgsm-border">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-dgsm-border text-dgsm-text-primary rounded-lg hover:bg-dgsm-primary transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg font-semibold transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting Trial...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* General Error Display */}
          {errors.general && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Social Signup */}
          {currentStep === 1 && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dgsm-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dgsm-secondary text-dgsm-text-muted">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-dgsm-border rounded-lg bg-dgsm-primary hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2 text-dgsm-text-primary text-sm font-medium">
                      {isLoading ? 'Connecting...' : 'Sign up with Google'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-dgsm-text-secondary">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
