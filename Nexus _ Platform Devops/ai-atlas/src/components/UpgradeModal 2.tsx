import React, { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan = 'starter' }) => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'Perfect for small teams',
      features: [
        'Up to 5,000 contacts',
        'Basic email automation', 
        '10 AI-generated campaigns per month',
        'Standard analytics dashboard',
        'Email support',
        '2 team members'
      ],
      limitations: [
        'Limited AI campaigns',
        'Basic analytics only',
        'No A/B testing',
        'No custom branding'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 149,
      annualPrice: 119,
      description: 'Advanced features for growing teams',
      popular: true,
      features: [
        'Up to 25,000 contacts',
        'Advanced automation workflows',
        'Unlimited AI campaigns',
        'Advanced analytics & reporting',
        'Priority support',
        '10 team members',
        'A/B testing suite',
        'Custom branding',
        'Lead scoring',
        'Social media automation'
      ],
      newFeatures: [
        'Unlimited AI campaigns',
        'Advanced analytics',
        'A/B testing suite',
        'Custom branding',
        'Lead scoring'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 449,
      annualPrice: 359,
      description: 'Custom solutions for large organizations',
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
      ],
      newFeatures: [
        'Custom AI model training',
        'Dedicated account manager',
        'White-label solutions',
        'Advanced security',
        'API access'
      ]
    }
  ];

  const getCurrentPlanIndex = () => {
    return plans.findIndex(plan => plan.id === currentPlan);
  };

  const getUpgradePrice = () => {
    const current = plans.find(plan => plan.id === currentPlan);
    const selected = plans.find(plan => plan.id === selectedPlan);
    
    if (!current || !selected) return 0;
    
    const currentPrice = isAnnual ? current.annualPrice : current.monthlyPrice;
    const selectedPrice = isAnnual ? selected.annualPrice : selected.monthlyPrice;
    
    return selectedPrice - currentPrice;
  };

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Upgrade successful:', {
        from: currentPlan,
        to: selectedPlan,
        billing: isAnnual ? 'annual' : 'monthly'
      });
      
      onClose();
      alert(`Successfully upgraded to ${plans.find(p => p.id === selectedPlan)?.name} plan!`);
      
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPlanIndex = getCurrentPlanIndex();
  const upgradePrice = getUpgradePrice();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-dgsm-secondary rounded-xl shadow-2xl w-full max-w-4xl border border-dgsm-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dgsm-border">
          <div>
            <h2 className="text-2xl font-bold text-dgsm-text-primary">Upgrade Your Plan</h2>
            <p className="text-sm text-dgsm-text-secondary mt-1">
              Unlock more features and grow your marketing automation
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

        {/* Content */}
        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? 'text-dgsm-text-primary' : 'text-dgsm-text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-green-500' : 'bg-gray-600'
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
              <span className="ml-2 bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-sm font-semibold">
                Save 20%
              </span>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => {
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = plan.id === selectedPlan;
              const canUpgrade = index > currentPlanIndex;
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-6 border-2 transition-all ${
                    isCurrentPlan 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : canUpgrade && isSelected
                      ? 'border-green-500 bg-green-500/10'
                      : canUpgrade
                      ? 'border-dgsm-border bg-dgsm-primary hover:border-green-500/50 cursor-pointer'
                      : 'border-dgsm-border bg-dgsm-primary opacity-50 cursor-not-allowed'
                  } ${plan.popular ? 'ring-2 ring-green-500 ring-opacity-30' : ''}`}
                  onClick={() => canUpgrade && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-dgsm-text-primary mb-2">{plan.name}</h3>
                    <p className="text-dgsm-text-secondary text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className={`text-4xl font-bold ${
                        isCurrentPlan ? 'text-blue-500' : canUpgrade ? 'text-green-500' : 'text-dgsm-text-muted'
                      }`}>
                        ${price}
                      </span>
                      <span className="text-dgsm-text-muted ml-2">/month</span>
                      {isAnnual && (
                        <div className="text-sm text-dgsm-text-muted mt-1">
                          Billed annually (${price * 12})
                        </div>
                      )}
                    </div>

                    {canUpgrade && isSelected && (
                      <div className="text-sm text-green-500 font-semibold">
                        +${upgradePrice}/month additional
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isCurrentPlan ? (
                      <div>
                        <h4 className="font-semibold text-dgsm-text-primary mb-3">Current Features:</h4>
                        <ul className="space-y-2">
                          {plan.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-dgsm-text-secondary">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.limitations && (
                          <div className="mt-4">
                            <h5 className="font-medium text-dgsm-text-muted mb-2">Limitations:</h5>
                            <ul className="space-y-1">
                              {plan.limitations.map((limitation, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <span className="text-orange-400 mr-2">⚠</span>
                                  <span className="text-dgsm-text-muted">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : canUpgrade ? (
                      <div>
                        <h4 className="font-semibold text-dgsm-text-primary mb-3">
                          {isSelected ? 'You\'ll get:' : 'Upgrade to get:'}
                        </h4>
                        <ul className="space-y-2">
                          {plan.newFeatures?.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-dgsm-text-secondary">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-dgsm-text-muted mb-3">Features included:</h4>
                        <ul className="space-y-2">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-dgsm-text-muted">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {canUpgrade && !isCurrentPlan && (
                    <div className={`mt-6 p-3 rounded-lg text-center text-sm ${
                      isSelected ? 'bg-green-500/20 text-green-400' : 'bg-dgsm-border/20 text-dgsm-text-muted'
                    }`}>
                      {isSelected ? 'Selected for upgrade' : 'Click to select'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upgrade Summary */}
          {selectedPlan !== currentPlan && (
            <div className="bg-dgsm-primary rounded-lg p-6 border border-dgsm-border mb-6">
              <h3 className="text-lg font-semibold text-dgsm-text-primary mb-4">Upgrade Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dgsm-text-secondary">Current Plan:</span>
                  <span className="text-dgsm-text-primary font-medium">
                    {plans.find(p => p.id === currentPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dgsm-text-secondary">Upgrading To:</span>
                  <span className="text-green-500 font-medium">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dgsm-text-secondary">Additional Cost:</span>
                  <span className="text-green-500 font-bold text-lg">
                    +${upgradePrice}/{isAnnual ? 'month' : 'month'}
                  </span>
                </div>
                <div className="border-t border-dgsm-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-dgsm-text-primary font-medium">New Monthly Total:</span>
                    <span className="text-green-500 font-bold text-xl">
                      ${isAnnual 
                        ? plans.find(p => p.id === selectedPlan)?.annualPrice 
                        : plans.find(p => p.id === selectedPlan)?.monthlyPrice}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-dgsm-border text-dgsm-text-primary rounded-lg hover:bg-dgsm-primary transition-colors"
            >
              Cancel
            </button>

            {selectedPlan !== currentPlan && (
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg font-semibold transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name}`
                )}
              </button>
            )}
          </div>

          {/* Features Comparison Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-400 font-medium mb-1">Upgrade Benefits</p>
                <p className="text-blue-300 text-sm">
                  Your upgrade will take effect immediately. You'll be prorated for the remainder of your current billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
