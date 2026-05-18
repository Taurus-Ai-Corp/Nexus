/**
 * Real User Monitoring (RUM) System
 * Client-side performance tracking and error monitoring
 * For: https://vc1j5apvcf.space.minimax.io/features
 */

(function() {
    'use strict';
    
    // Configuration
    const RUM_CONFIG = {
        apiEndpoint: 'https://your-monitoring-api.com/rum/collect',
        sampleRate: 1.0, // Collect data from 100% of users (adjust as needed)
        enableConsoleErrors: true,
        enableNetworkErrors: true,
        enablePerformanceMetrics: true,
        enableUserInteraction: true,
        maxBatchSize: 10,
        batchTimeout: 5000, // 5 seconds
        cookieConsent: true // Ensure GDPR compliance
    };
    
    // Data collection storage
    let rumData = {
        session: generateSessionId(),
        pageLoad: {},
        userActions: [],
        errors: [],
        networkRequests: [],
        performanceMetrics: {},
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenSize: {
            width: screen.width,
            height: screen.height
        },
        viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    // Batch processing
    let dataBatch = [];
    let batchTimer = null;
    
    /**
     * Generate unique session ID
     */
    function generateSessionId() {
        return 'rum_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Check if user has consented to data collection (GDPR compliance)
     */
    function hasConsentForDataCollection() {
        if (!RUM_CONFIG.cookieConsent) return true;
        
        // Check for consent cookie or localStorage flag
        return localStorage.getItem('rum_consent') === 'true' || 
               document.cookie.includes('rum_consent=true');
    }
    
    /**
     * Collect page load performance metrics
     */
    function collectPageLoadMetrics() {
        if (!window.performance || !window.performance.timing) return;
        
        const timing = window.performance.timing;
        const navigation = window.performance.navigation;
        
        rumData.pageLoad = {
            navigationStart: timing.navigationStart,
            domainLookupStart: timing.domainLookupStart,
            domainLookupEnd: timing.domainLookupEnd,
            connectStart: timing.connectStart,
            connectEnd: timing.connectEnd,
            secureConnectionStart: timing.secureConnectionStart,
            requestStart: timing.requestStart,
            responseStart: timing.responseStart,
            responseEnd: timing.responseEnd,
            domLoading: timing.domLoading,
            domInteractive: timing.domInteractive,
            domContentLoadedEventStart: timing.domContentLoadedEventStart,
            domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
            domComplete: timing.domComplete,
            loadEventStart: timing.loadEventStart,
            loadEventEnd: timing.loadEventEnd,
            
            // Calculated metrics
            dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnect: timing.connectEnd - timing.connectStart,
            sslNegotiation: timing.secureConnectionStart > 0 ? 
                           timing.connectEnd - timing.secureConnectionStart : 0,
            timeToFirstByte: timing.responseStart - timing.requestStart,
            contentDownload: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domLoading,
            totalPageLoad: timing.loadEventEnd - timing.navigationStart,
            
            // Navigation type
            navigationType: navigation.type, // 0=navigate, 1=reload, 2=back_forward
            redirectCount: navigation.redirectCount
        };
        
        // Collect paint metrics if available
        if (window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    rumData.pageLoad.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    rumData.pageLoad.firstContentfulPaint = entry.startTime;
                }
            });
            
            // Collect Largest Contentful Paint if available
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        rumData.pageLoad.largestContentfulPaint = lastEntry.startTime;
                    });
                    observer.observe({entryTypes: ['largest-contentful-paint']});
                } catch (e) {
                    console.warn('LCP observer not supported');
                }
            }
        }
        
        addToBatch('pageLoad', rumData.pageLoad);
    }
    
    /**
     * Monitor network requests
     */
    function monitorNetworkRequests() {
        if (!window.performance || !window.performance.getEntriesByType) return;
        
        // Monitor resource loading
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.initiatorType) {
                    const resourceData = {
                        name: entry.name,
                        type: entry.initiatorType,
                        duration: entry.duration,
                        size: entry.transferSize || 0,
                        startTime: entry.startTime,
                        fetchStart: entry.fetchStart,
                        responseEnd: entry.responseEnd,
                        timestamp: Date.now()
                    };
                    
                    rumData.networkRequests.push(resourceData);
                    
                    // Check for slow resources
                    if (entry.duration > 3000) { // Slower than 3 seconds
                        addToBatch('slowResource', resourceData);
                    }
                }
            });
        });
        
        try {
            resourceObserver.observe({entryTypes: ['resource']});
        } catch (e) {
            console.warn('Resource observer not supported');
        }
        
        // Monitor XMLHttpRequest and Fetch
        monitorAjaxRequests();
    }
    
    /**
     * Monitor AJAX requests (XMLHttpRequest and Fetch)
     */
    function monitorAjaxRequests() {
        // Monitor XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            
            let requestData = {
                type: 'XMLHttpRequest',
                startTime: 0,
                endTime: 0,
                url: '',
                method: '',
                status: 0
            };
            
            xhr.open = function(method, url, async) {
                requestData.method = method;
                requestData.url = url;
                requestData.startTime = Date.now();
                return originalOpen.apply(this, arguments);
            };
            
            xhr.send = function() {
                const result = originalSend.apply(this, arguments);
                
                xhr.addEventListener('loadend', function() {
                    requestData.endTime = Date.now();
                    requestData.duration = requestData.endTime - requestData.startTime;
                    requestData.status = xhr.status;
                    
                    if (xhr.status >= 400 || requestData.duration > 5000) {
                        addToBatch('networkError', requestData);
                    }
                });
                
                return result;
            };
            
            return xhr;
        };
        
        // Monitor Fetch API
        if (window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = function() {
                const startTime = Date.now();
                const url = arguments[0];
                
                return originalFetch.apply(this, arguments)
                    .then(response => {
                        const endTime = Date.now();
                        const duration = endTime - startTime;
                        
                        const requestData = {
                            type: 'fetch',
                            url: url,
                            startTime: startTime,
                            endTime: endTime,
                            duration: duration,
                            status: response.status
                        };
                        
                        if (!response.ok || duration > 5000) {
                            addToBatch('networkError', requestData);
                        }
                        
                        return response;
                    })
                    .catch(error => {
                        const endTime = Date.now();
                        addToBatch('networkError', {
                            type: 'fetch',
                            url: url,
                            startTime: startTime,
                            endTime: endTime,
                            duration: endTime - startTime,
                            error: error.message
                        });
                        throw error;
                    });
            };
        }
    }
    
    /**
     * Monitor JavaScript errors
     */
    function monitorErrors() {
        // Global error handler
        window.addEventListener('error', function(event) {
            const errorData = {
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            rumData.errors.push(errorData);
            addToBatch('error', errorData);
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', function(event) {
            const errorData = {
                type: 'unhandledRejection',
                message: event.reason ? event.reason.message || event.reason : 'Unknown error',
                stack: event.reason ? event.reason.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            rumData.errors.push(errorData);
            addToBatch('error', errorData);
        });
        
        // Console error monitoring (optional)
        if (RUM_CONFIG.enableConsoleErrors) {
            const originalConsoleError = console.error;
            console.error = function() {
                const errorData = {
                    type: 'console',
                    message: Array.from(arguments).join(' '),
                    timestamp: Date.now(),
                    url: window.location.href
                };
                
                addToBatch('consoleError', errorData);
                return originalConsoleError.apply(this, arguments);
            };
        }
    }
    
    /**
     * Monitor user interactions
     */
    function monitorUserInteractions() {
        // Click tracking
        document.addEventListener('click', function(event) {
            const target = event.target;
            const interactionData = {
                type: 'click',
                element: target.tagName,
                id: target.id || null,
                className: target.className || null,
                text: target.textContent ? target.textContent.substring(0, 100) : null,
                timestamp: Date.now(),
                x: event.clientX,
                y: event.clientY
            };
            
            rumData.userActions.push(interactionData);
            
            // Track important interactions
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.type === 'submit') {
                addToBatch('userInteraction', interactionData);
            }
        });
        
        // Form submission tracking
        document.addEventListener('submit', function(event) {
            const form = event.target;
            const interactionData = {
                type: 'formSubmit',
                formId: form.id || null,
                formAction: form.action || null,
                timestamp: Date.now()
            };
            
            addToBatch('userInteraction', interactionData);
        });
        
        // Page visibility changes
        document.addEventListener('visibilitychange', function() {
            const visibilityData = {
                type: 'visibilityChange',
                hidden: document.hidden,
                timestamp: Date.now()
            };
            
            addToBatch('userInteraction', visibilityData);
        });
    }
    
    /**
     * Collect browser and device information
     */
    function collectBrowserInfo() {
        rumData.performanceMetrics = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency || null,
            deviceMemory: navigator.deviceMemory || null,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            supports: {
                webp: checkWebPSupport(),
                localStorage: checkLocalStorageSupport(),
                sessionStorage: checkSessionStorageSupport(),
                webWorkers: typeof Worker !== 'undefined',
                serviceWorkers: 'serviceWorker' in navigator
            }
        };
    }
    
    /**
     * Check WebP support
     */
    function checkWebPSupport() {
        try {
            return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check localStorage support
     */
    function checkLocalStorageSupport() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check sessionStorage support
     */
    function checkSessionStorageSupport() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Add data to batch for sending
     */
    function addToBatch(eventType, data) {
        if (!hasConsentForDataCollection()) return;
        
        // Sample data based on sample rate
        if (Math.random() > RUM_CONFIG.sampleRate) return;
        
        const batchItem = {
            eventType: eventType,
            data: data,
            session: rumData.session,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        dataBatch.push(batchItem);
        
        // Send batch if it's full
        if (dataBatch.length >= RUM_CONFIG.maxBatchSize) {
            sendBatch();
        } else {
            // Reset timer
            if (batchTimer) clearTimeout(batchTimer);
            batchTimer = setTimeout(sendBatch, RUM_CONFIG.batchTimeout);
        }
    }
    
    /**
     * Send data batch to server
     */
    function sendBatch() {
        if (dataBatch.length === 0) return;
        
        const batchToSend = [...dataBatch];
        dataBatch = [];
        
        if (batchTimer) {
            clearTimeout(batchTimer);
            batchTimer = null;
        }
        
        // Use sendBeacon if available (for page unload scenarios)
        if (navigator.sendBeacon) {
            const data = JSON.stringify({
                batch: batchToSend,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            });
            
            try {
                navigator.sendBeacon(RUM_CONFIG.apiEndpoint, data);
            } catch (e) {
                // Fallback to fetch
                sendViaFetch(batchToSend);
            }
        } else {
            sendViaFetch(batchToSend);
        }
    }
    
    /**
     * Send data via fetch API
     */
    function sendViaFetch(batch) {
        fetch(RUM_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                batch: batch,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            }),
            keepalive: true
        }).catch(error => {
            console.warn('RUM data sending failed:', error);
        });
    }
    
    /**
     * Initialize RUM monitoring
     */
    function initRUM() {
        if (!hasConsentForDataCollection()) {
            console.info('RUM monitoring disabled - no user consent');
            return;
        }
        
        console.info('Initializing RUM monitoring');
        
        // Collect initial data
        collectBrowserInfo();
        
        // Set up monitoring
        if (RUM_CONFIG.enablePerformanceMetrics) {
            // Wait for page load to collect metrics
            if (document.readyState === 'complete') {
                collectPageLoadMetrics();
            } else {
                window.addEventListener('load', collectPageLoadMetrics);
            }
            
            monitorNetworkRequests();
        }
        
        if (RUM_CONFIG.enableNetworkErrors) {
            monitorErrors();
        }
        
        if (RUM_CONFIG.enableUserInteraction) {
            monitorUserInteractions();
        }
        
        // Send batch before page unload
        window.addEventListener('beforeunload', function() {
            if (dataBatch.length > 0) {
                sendBatch();
            }
        });
        
        // Send initial page load data
        addToBatch('sessionStart', {
            referrer: document.referrer,
            timestamp: rumData.timestamp,
            performance: rumData.performanceMetrics
        });
    }
    
    /**
     * Public API for manual event tracking
     */
    window.RUM = {
        track: function(eventType, data) {
            addToBatch('custom', {
                eventType: eventType,
                data: data
            });
        },
        
        setConsent: function(consent) {
            if (consent) {
                localStorage.setItem('rum_consent', 'true');
                initRUM();
            } else {
                localStorage.removeItem('rum_consent');
            }
        },
        
        getSessionId: function() {
            return rumData.session;
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRUM);
    } else {
        initRUM();
    }
    
})();