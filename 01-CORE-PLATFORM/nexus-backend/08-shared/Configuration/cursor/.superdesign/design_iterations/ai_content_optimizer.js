// BizFlow AI Content Optimizer & Performance Monitor
// Advanced AI-powered content optimization, A/B testing, and real-time performance monitoring

class BizFlowAIOptimizer {
    constructor() {
        this.config = {
            apiEndpoint: '/api/optimize',
            trackingId: 'BF_' + Math.random().toString(36).substr(2, 9),
            version: '2.0.0',
            features: {
                contentPersonalization: true,
                dynamicPricing: true,
                smartRecommendations: true,
                realTimeOptimization: true,
                predictiveAnalytics: true
            }
        };
        
        this.metrics = {
            pageLoad: 0,
            engagement: {},
            conversion: {},
            userBehavior: {},
            performance: {}
        };
        
        this.experiments = new Map();
        this.personalizations = new Map();
        
        this.init();
    }
    
    init() {
        this.setupPerformanceMonitoring();
        this.initializeABTesting();
        this.setupContentPersonalization();
        this.initializeRealTimeOptimization();
        this.setupPredictiveAnalytics();
        
        console.log('🤖 BizFlow AI Optimizer initialized');
    }
    
    // Advanced Performance Monitoring
    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        this.observeWebVitals();
        
        // User interaction tracking
        this.trackUserBehavior();
        
        // Resource performance monitoring
        this.monitorResourcePerformance();
        
        // Real-time error tracking
        this.setupErrorTracking();
    }
    
    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.performance.lcp = lastEntry.startTime;
                this.optimizeLCP(lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.performance.fid = entry.processingStart - entry.startTime;
                    this.optimizeFID(entry.processingStart - entry.startTime);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.metrics.performance.cls = clsValue;
                        this.optimizeCLS(clsValue);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    // AI-Powered Content Personalization
    setupContentPersonalization() {
        const userProfile = this.buildUserProfile();
        const personalizedContent = this.generatePersonalizedContent(userProfile);
        
        this.applyPersonalizations(personalizedContent);
    }
    
    buildUserProfile() {
        const profile = {
            location: this.getGeoLocation(),
            device: this.getDeviceInfo(),
            behavior: this.getStoredBehavior(),
            industry: this.detectIndustry(),
            companySize: this.estimateCompanySize(),
            intent: this.analyzeIntent(),
            timestamp: Date.now()
        };
        
        return profile;
    }
    
    generatePersonalizedContent(profile) {
        const personalizations = {
            headlines: this.personalizeHeadlines(profile),
            pricing: this.personalizePricing(profile),
            testimonials: this.selectRelevantTestimonials(profile),
            features: this.prioritizeFeatures(profile),
            urgency: this.createUrgencyMessages(profile)
        };
        
        return personalizations;
    }
    
    personalizeHeadlines(profile) {
        const headlineVariants = {
            'technology': {
                primary: 'Scale Your Tech Operations with AI Automation',
                secondary: 'Build faster, deploy smarter, scale infinitely',
                cta: 'Start Technical Preview'
            },
            'healthcare': {
                primary: 'Streamline Healthcare Workflows Securely',
                secondary: 'HIPAA-compliant automation that saves lives',
                cta: 'Request Healthcare Demo'
            },
            'finance': {
                primary: 'Automate Financial Operations Safely',
                secondary: 'Bank-grade security with enterprise automation',
                cta: 'See Compliance Features'
            },
            'retail': {
                primary: 'Boost Retail Efficiency with Smart Automation',
                secondary: 'From inventory to customer service, automate everything',
                cta: 'Start Retail Trial'
            },
            'default': {
                primary: 'Transform Your Business with AI Automation',
                secondary: 'Save time, reduce costs, scale efficiently',
                cta: 'Start Free Trial'
            }
        };
        
        return headlineVariants[profile.industry] || headlineVariants.default;
    }
    
    personalizePricing(profile) {
        const basePricing = {
            starter: 29,
            professional: 79,
            enterprise: 199
        };
        
        // Dynamic pricing based on company size and location
        const adjustments = {
            startup: 0.8,    // 20% discount for startups
            sme: 0.9,        // 10% discount for SMEs
            enterprise: 1.1   // 10% premium for enterprise
        };
        
        const locationMultiplier = this.getLocationPricingMultiplier(profile.location);
        const sizeAdjustment = adjustments[profile.companySize] || 1;
        
        return Object.entries(basePricing).reduce((acc, [tier, price]) => {
            acc[tier] = Math.round(price * locationMultiplier * sizeAdjustment);
            return acc;
        }, {});
    }
    
    // Advanced A/B Testing System
    initializeABTesting() {
        const experiments = [
            {
                id: 'hero_cta_variant',
                name: 'Hero CTA Text Variation',
                variants: [
                    { id: 'control', weight: 0.5, changes: {} },
                    { id: 'variant_a', weight: 0.25, changes: { 
                        ctaText: 'Get Started Free Today',
                        ctaColor: 'gradient-accent'
                    }},
                    { id: 'variant_b', weight: 0.25, changes: { 
                        ctaText: 'Transform Your Business Now',
                        ctaColor: 'bg-green-600'
                    }}
                ]
            },
            {
                id: 'social_proof_position',
                name: 'Social Proof Placement',
                variants: [
                    { id: 'control', weight: 0.5, changes: {} },
                    { id: 'variant_a', weight: 0.5, changes: { 
                        socialProofPosition: 'above-fold'
                    }}
                ]
            },
            {
                id: 'pricing_display',
                name: 'Pricing Transparency',
                variants: [
                    { id: 'control', weight: 0.5, changes: {} },
                    { id: 'variant_a', weight: 0.5, changes: { 
                        showPricing: true,
                        pricingPosition: 'hero-section'
                    }}
                ]
            }
        ];
        
        experiments.forEach(experiment => {
            this.assignExperimentVariant(experiment);
        });
    }
    
    assignExperimentVariant(experiment) {
        const userId = this.getUserId();
        const hash = this.hashUserId(userId + experiment.id);
        let cumWeight = 0;
        
        for (const variant of experiment.variants) {
            cumWeight += variant.weight;
            if (hash < cumWeight) {
                this.experiments.set(experiment.id, {
                    variant: variant.id,
                    changes: variant.changes
                });
                this.applyExperimentChanges(experiment.id, variant.changes);
                this.trackExperiment(experiment.id, variant.id);
                break;
            }
        }
    }
    
    applyExperimentChanges(experimentId, changes) {
        if (changes.ctaText) {
            document.querySelectorAll('[data-experiment="hero-cta"]').forEach(el => {
                el.textContent = changes.ctaText;
            });
        }
        
        if (changes.ctaColor) {
            document.querySelectorAll('[data-experiment="hero-cta"]').forEach(el => {
                el.className = el.className.replace(/bg-\w+-\d+|gradient-\w+/g, changes.ctaColor);
            });
        }
        
        if (changes.socialProofPosition === 'above-fold') {
            const socialProof = document.querySelector('[data-element="social-proof"]');
            const hero = document.querySelector('[data-element="hero"]');
            if (socialProof && hero) {
                hero.appendChild(socialProof);
            }
        }
        
        if (changes.showPricing) {
            this.injectPricingPreview();
        }
    }
    
    // Real-time Optimization Engine
    initializeRealTimeOptimization() {
        // Monitor user behavior and optimize in real-time
        this.monitorScrollBehavior();
        this.optimizeFormFields();
        this.dynamicContentLoading();
        this.intelligentPreloading();
    }
    
    monitorScrollBehavior() {
        let scrollTimeout;
        let maxScroll = 0;
        let scrollEvents = [];
        
        window.addEventListener('scroll', () => {
            const currentScroll = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, currentScroll);
            
            scrollEvents.push({
                timestamp: Date.now(),
                position: currentScroll,
                velocity: this.calculateScrollVelocity()
            });
            
            // Optimize based on scroll behavior
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.analyzeScrollPattern(scrollEvents);
                scrollEvents = [];
            }, 2000);
        });
    }
    
    analyzeScrollPattern(events) {
        const avgVelocity = events.reduce((sum, e) => sum + e.velocity, 0) / events.length;
        const stoppingPoints = this.findScrollStoppingPoints(events);
        
        // If user scrolls very fast, they might be looking for specific information
        if (avgVelocity > 50) {
            this.showQuickNavigation();
        }
        
        // If user stops at certain sections, prioritize similar content
        stoppingPoints.forEach(point => {
            this.optimizeContentAtPosition(point);
        });
    }
    
    // Smart Form Optimization
    optimizeFormFields() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.implementSmartAutocomplete(form);
            this.addRealTimeValidation(form);
            this.optimizeFieldOrder(form);
            this.implementProgressiveProfiling(form);
        });
    }
    
    implementSmartAutocomplete(form) {
        const emailFields = form.querySelectorAll('input[type="email"]');
        
        emailFields.forEach(field => {
            field.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.includes('@')) {
                    const suggestions = this.generateEmailSuggestions(value);
                    this.showEmailSuggestions(field, suggestions);
                }
            });
        });
    }
    
    generateEmailSuggestions(partialEmail) {
        const commonDomains = [
            'gmail.com', 'outlook.com', 'yahoo.com', 'company.com',
            'hotmail.com', 'icloud.com', 'protonmail.com'
        ];
        
        const [username, domain] = partialEmail.split('@');
        if (!domain) return [];
        
        return commonDomains
            .filter(d => d.startsWith(domain.toLowerCase()))
            .map(d => `${username}@${d}`)
            .slice(0, 3);
    }
    
    // Predictive Analytics & Machine Learning
    setupPredictiveAnalytics() {
        this.initializeConversionPrediction();
        this.setupChurnPrediction();
        this.implementBehaviorPrediction();
    }
    
    initializeConversionPrediction() {
        const features = this.extractConversionFeatures();
        const conversionProbability = this.predictConversion(features);
        
        if (conversionProbability > 0.7) {
            this.triggerHighIntentOptimizations();
        } else if (conversionProbability < 0.3) {
            this.triggerLowIntentOptimizations();
        }
    }
    
    extractConversionFeatures() {
        return {
            timeOnSite: this.getTimeOnSite(),
            pageViews: this.getPageViews(),
            scrollDepth: this.getMaxScrollDepth(),
            formInteractions: this.getFormInteractions(),
            deviceType: this.getDeviceType(),
            trafficSource: this.getTrafficSource(),
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay()
        };
    }
    
    predictConversion(features) {
        // Simplified ML model - in production, this would use a trained model
        const weights = {
            timeOnSite: 0.15,
            pageViews: 0.10,
            scrollDepth: 0.20,
            formInteractions: 0.25,
            deviceType: 0.10,
            trafficSource: 0.20
        };
        
        let score = 0;
        
        // Time on site (normalized to 0-1)
        score += weights.timeOnSite * Math.min(features.timeOnSite / 300, 1);
        
        // Page views
        score += weights.pageViews * Math.min(features.pageViews / 5, 1);
        
        // Scroll depth
        score += weights.scrollDepth * (features.scrollDepth / 100);
        
        // Form interactions
        score += weights.formInteractions * Math.min(features.formInteractions / 3, 1);
        
        // Device type bonus
        if (features.deviceType === 'desktop') score += weights.deviceType;
        
        // Traffic source
        if (['organic', 'direct', 'email'].includes(features.trafficSource)) {
            score += weights.trafficSource;
        }
        
        return Math.max(0, Math.min(1, score));
    }
    
    triggerHighIntentOptimizations() {
        // Show stronger CTAs
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.classList.add('pulse-glow');
            btn.innerHTML = btn.innerHTML.replace('Start Free Trial', 'Start Free Trial Now');
        });
        
        // Add urgency
        this.showUrgencyBanner();
        
        // Simplify the conversion path
        this.highlightPrimaryActions();
        
        // Show live chat
        this.activateLiveChat();
    }
    
    triggerLowIntentOptimizations() {
        // Show more social proof
        this.emphasizeSocialProof();
        
        // Offer lead magnets
        this.showLeadMagnet();
        
        // Reduce friction
        this.simplifyForms();
        
        // Provide more information
        this.showDetailedBenefits();
    }
    
    // Advanced Analytics & Reporting
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                sessionId: this.getSessionId(),
                userId: this.getUserId(),
                experiments: Object.fromEntries(this.experiments)
            }
        };
        
        // Store locally and batch send
        this.queueEvent(event);
        
        // Real-time optimization based on events
        this.optimizeBasedOnEvent(event);
    }
    
    queueEvent(event) {
        const queue = JSON.parse(localStorage.getItem('bf_event_queue') || '[]');
        queue.push(event);
        
        // Limit queue size
        if (queue.length > 100) {
            queue.shift();
        }
        
        localStorage.setItem('bf_event_queue', JSON.stringify(queue));
        
        // Send batch periodically
        if (queue.length >= 10) {
            this.sendEventBatch();
        }
    }
    
    async sendEventBatch() {
        const queue = JSON.parse(localStorage.getItem('bf_event_queue') || '[]');
        if (queue.length === 0) return;
        
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events: queue,
                    metadata: {
                        version: this.config.version,
                        trackingId: this.config.trackingId
                    }
                })
            });
            
            // Clear queue on success
            localStorage.setItem('bf_event_queue', '[]');
        } catch (error) {
            console.warn('Failed to send analytics batch:', error);
        }
    }
    
    // Utility Methods
    getUserId() {
        let userId = localStorage.getItem('bf_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('bf_user_id', userId);
        }
        return userId;
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('bf_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            sessionStorage.setItem('bf_session_id', sessionId);
        }
        return sessionId;
    }
    
    hashUserId(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 2147483648; // Normalize to 0-1
    }
    
    getTimeOnSite() {
        const startTime = parseInt(sessionStorage.getItem('bf_start_time') || Date.now());
        return (Date.now() - startTime) / 1000; // seconds
    }
    
    getDeviceInfo() {
        const width = window.screen.width;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    // Performance Optimizations
    optimizeLCP(lcp) {
        if (lcp > 2500) { // Poor LCP
            // Preload critical resources
            this.preloadCriticalResources();
            
            // Optimize images
            this.lazyLoadImages();
            
            // Inline critical CSS
            this.inlineCriticalCSS();
        }
    }
    
    optimizeFID(fid) {
        if (fid > 100) { // Poor FID
            // Break up long tasks
            this.deferNonCriticalJS();
            
            // Use web workers for heavy tasks
            this.moveToWebWorker();
        }
    }
    
    optimizeCLS(cls) {
        if (cls > 0.1) { // Poor CLS
            // Add size attributes to media
            this.addImageDimensions();
            
            // Reserve space for ads
            this.reserveAdSpace();
        }
    }
    
    // Initialize on DOM ready
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new BizFlowAIOptimizer();
            });
        } else {
            new BizFlowAIOptimizer();
        }
    }
}

// Auto-initialize
BizFlowAIOptimizer.init();

// Global access for manual triggering
window.BizFlowAI = BizFlowAIOptimizer;