// Vercel API Route - AI Optimization Endpoint
// Provides real-time optimization suggestions and A/B test configurations

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Return A/B test configurations
      const experiments = getActiveExperiments();
      res.status(200).json({ experiments });
      return;
    }

    if (req.method === 'POST') {
      // Process optimization request
      const { userProfile, currentMetrics, requestType } = req.body;

      let optimizations = {};

      switch (requestType) {
        case 'personalization':
          optimizations = await getPersonalizationOptimizations(userProfile);
          break;
        case 'conversion':
          optimizations = await getConversionOptimizations(userProfile, currentMetrics);
          break;
        case 'performance':
          optimizations = await getPerformanceOptimizations(currentMetrics);
          break;
        default:
          optimizations = await getAllOptimizations(userProfile, currentMetrics);
      }

      res.status(200).json({
        success: true,
        optimizations,
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Optimization API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

function getActiveExperiments() {
  return [
    {
      id: 'hero_cta_variant',
      name: 'Hero CTA Optimization',
      status: 'active',
      variants: [
        { 
          id: 'control', 
          weight: 0.4, 
          changes: {} 
        },
        { 
          id: 'urgent', 
          weight: 0.3, 
          changes: { 
            ctaText: 'Start Free Trial Today - Limited Time',
            ctaColor: 'gradient-accent',
            urgencyBanner: true
          }
        },
        { 
          id: 'social', 
          weight: 0.3, 
          changes: { 
            socialProofPosition: 'hero',
            testimonialCount: 3,
            trustBadgeVisible: true
          }
        }
      ]
    },
    {
      id: 'pricing_transparency',
      name: 'Pricing Display Test',
      status: 'active',
      variants: [
        { 
          id: 'control', 
          weight: 0.5, 
          changes: {} 
        },
        { 
          id: 'visible', 
          weight: 0.5, 
          changes: { 
            showPricing: true,
            pricingPosition: 'hero-section',
            priceHighlight: 'starter'
          }
        }
      ]
    }
  ];
}

async function getPersonalizationOptimizations(userProfile) {
  const { industry, companySize, location, device } = userProfile;

  const optimizations = {
    headlines: getPersonalizedHeadlines(industry),
    messaging: getPersonalizedMessaging(companySize),
    pricing: getPersonalizedPricing(location, companySize),
    testimonials: getRelevantTestimonials(industry),
    features: getPrioritizedFeatures(industry, companySize)
  };

  return optimizations;
}

function getPersonalizedHeadlines(industry) {
  const headlines = {
    'technology': {
      primary: 'Scale Your Tech Stack with AI Automation',
      secondary: 'Build faster, deploy smarter, scale infinitely',
      cta: 'Start Technical Preview'
    },
    'healthcare': {
      primary: 'HIPAA-Compliant Healthcare Automation',
      secondary: 'Streamline patient workflows securely and efficiently',
      cta: 'Request Healthcare Demo'
    },
    'finance': {
      primary: 'Bank-Grade Financial Process Automation',
      secondary: 'Reduce compliance risk while boosting efficiency',
      cta: 'See Security Features'
    },
    'retail': {
      primary: 'Automate Your Entire Retail Operation',
      secondary: 'From inventory to customer service, powered by AI',
      cta: 'Start Retail Trial'
    },
    'manufacturing': {
      primary: 'Smart Manufacturing Process Automation',
      secondary: 'Optimize production workflows with intelligent automation',
      cta: 'Request Manufacturing Demo'
    },
    'default': {
      primary: 'Transform Your Business with AI Automation',
      secondary: 'Save time, reduce costs, scale efficiently',
      cta: 'Start Free Trial'
    }
  };

  return headlines[industry] || headlines.default;
}

function getPersonalizedPricing(location, companySize) {
  const basePricing = {
    starter: 29,
    professional: 79,
    enterprise: 199
  };

  // Location-based adjustments (simplified)
  const locationMultipliers = {
    'US': 1.0,
    'CA': 0.95,
    'EU': 1.05,
    'UK': 1.02,
    'AU': 0.98,
    'IN': 0.7,
    'BR': 0.8,
    'default': 0.9
  };

  // Company size adjustments
  const sizeAdjustments = {
    'startup': 0.8,    // 20% discount
    'small': 0.9,      // 10% discount
    'medium': 1.0,     // No adjustment
    'large': 1.1,      // 10% premium
    'enterprise': 1.2  // 20% premium
  };

  const locationMultiplier = locationMultipliers[location] || locationMultipliers.default;
  const sizeMultiplier = sizeAdjustments[companySize] || 1.0;

  const adjustedPricing = {};
  Object.entries(basePricing).forEach(([tier, price]) => {
    adjustedPricing[tier] = Math.round(price * locationMultiplier * sizeMultiplier);
  });

  return {
    pricing: adjustedPricing,
    discount: sizeMultiplier < 1.0 ? Math.round((1 - sizeMultiplier) * 100) : 0,
    discountReason: companySize === 'startup' ? 'Startup Discount' : 
                   companySize === 'small' ? 'Small Business Discount' : null
  };
}

async function getConversionOptimizations(userProfile, metrics) {
  const { conversionProbability, timeOnSite, scrollDepth, formInteractions } = metrics;

  const optimizations = [];

  // High intent users
  if (conversionProbability > 0.7) {
    optimizations.push({
      type: 'urgency',
      action: 'show_limited_time_offer',
      priority: 'high',
      message: 'Limited time: 50% off first 3 months'
    });

    optimizations.push({
      type: 'social_proof',
      action: 'emphasize_recent_signups',
      priority: 'medium',
      message: '12 businesses signed up in the last hour'
    });
  }

  // Medium intent users
  else if (conversionProbability > 0.4) {
    optimizations.push({
      type: 'trust_building',
      action: 'show_security_badges',
      priority: 'high'
    });

    optimizations.push({
      type: 'risk_reduction',
      action: 'emphasize_free_trial',
      priority: 'medium',
      message: 'No credit card required • Cancel anytime'
    });
  }

  // Low intent users
  else {
    optimizations.push({
      type: 'education',
      action: 'show_roi_calculator',
      priority: 'high'
    });

    optimizations.push({
      type: 'lead_magnet',
      action: 'offer_automation_guide',
      priority: 'medium',
      message: 'Download: "Business Automation Playbook"'
    });
  }

  // Behavior-based optimizations
  if (scrollDepth < 30) {
    optimizations.push({
      type: 'engagement',
      action: 'show_quick_benefits',
      priority: 'high',
      message: 'See 3 key benefits in 30 seconds'
    });
  }

  if (formInteractions === 0 && timeOnSite > 60) {
    optimizations.push({
      type: 'interaction',
      action: 'highlight_form_fields',
      priority: 'medium'
    });
  }

  return optimizations;
}

async function getPerformanceOptimizations(metrics) {
  const { lcp, fid, cls, errorRate } = metrics;

  const optimizations = [];

  if (lcp > 2500) {
    optimizations.push({
      type: 'performance',
      action: 'preload_critical_resources',
      priority: 'critical',
      details: 'LCP is above threshold'
    });
  }

  if (fid > 100) {
    optimizations.push({
      type: 'performance',
      action: 'defer_non_critical_js',
      priority: 'high',
      details: 'FID is above threshold'
    });
  }

  if (cls > 0.1) {
    optimizations.push({
      type: 'performance',
      action: 'add_image_dimensions',
      priority: 'high',
      details: 'CLS is above threshold'
    });
  }

  if (errorRate > 0.01) {
    optimizations.push({
      type: 'reliability',
      action: 'implement_error_boundaries',
      priority: 'critical',
      details: 'Error rate is too high'
    });
  }

  return optimizations;
}

async function getAllOptimizations(userProfile, metrics) {
  const [personalization, conversion, performance] = await Promise.all([
    getPersonalizationOptimizations(userProfile),
    getConversionOptimizations(userProfile, metrics),
    getPerformanceOptimizations(metrics)
  ]);

  return {
    personalization,
    conversion,
    performance,
    timestamp: new Date().toISOString()
  };
}