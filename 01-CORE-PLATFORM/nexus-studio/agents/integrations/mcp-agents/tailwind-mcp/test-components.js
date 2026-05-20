#!/usr/bin/env node

/**
 * TAURUS AI Responsive Tailwind MCP Test Suite
 * Tests all components and responsive features
 */

const { TaurusResponsiveTailwindMCPServer } = require('./index.js');

class TaurusResponsiveTestSuite {
    constructor() {
        this.server = new TaurusResponsiveTailwindMCPServer();
        this.testResults = [];
    }

    async runAllTests() {
        console.log('🚀 Starting TAURUS Responsive Tailwind MCP Test Suite...\n');

        try {
            // Test component generation
            await this.testMetricCardGeneration();
            await this.testDashboardGridGeneration();
            await this.testCompetitorCardGeneration();
            await this.testResponsiveButtonGeneration();
            await this.testChartComponentGeneration();

            // Test layout generation
            await this.testCompetitiveIntelligenceLayout();
            await this.testMetricsOverviewLayout();
            await this.testDashboardGridLayout();

            // Test design tokens
            await this.testDesignTokenGeneration();

            // Test class optimization
            await this.testClassOptimization();

            // Performance tests
            await this.testResponsivePerformance();

            // Generate test report
            this.generateTestReport();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
            process.exit(1);
        }
    }

    async testMetricCardGeneration() {
        console.log('🧪 Testing Metric Card Generation...');
        
        const testCases = [
            { variant: 'primary', size: 'md', animation: 'glow' },
            { variant: 'glass', size: 'lg', animation: 'pulse' },
            { variant: 'neon', size: 'sm', animation: 'data-flow' },
            { variant: 'success', size: 'xl', animation: 'none' },
        ];

        for (const testCase of testCases) {
            try {
                const result = await this.server.generateResponsiveComponent({
                    component: 'metric-card',
                    ...testCase,
                    responsive: true,
                    darkMode: true
                });

                const isValid = this.validateComponentOutput(result, 'metric-card');
                this.logTest('Metric Card', `${testCase.variant}-${testCase.size}`, isValid);
                
                if (isValid) {
                    this.testResults.push({
                        test: 'Metric Card Generation',
                        case: testCase,
                        status: 'PASS',
                        output: result.content[0].text.length
                    });
                }
            } catch (error) {
                this.logTest('Metric Card', `${testCase.variant}-${testCase.size}`, false, error.message);
                this.testResults.push({
                    test: 'Metric Card Generation',
                    case: testCase,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    async testDashboardGridGeneration() {
        console.log('🧪 Testing Dashboard Grid Generation...');

        try {
            const result = await this.server.generateResponsiveComponent({
                component: 'dashboard-grid',
                variant: 'primary',
                size: 'md',
                responsive: true
            });

            const isValid = this.validateGridOutput(result);
            this.logTest('Dashboard Grid', 'responsive-grid', isValid);

            this.testResults.push({
                test: 'Dashboard Grid Generation',
                status: isValid ? 'PASS' : 'FAIL',
                output: result.content[0].text.length
            });
        } catch (error) {
            this.logTest('Dashboard Grid', 'responsive-grid', false, error.message);
            this.testResults.push({
                test: 'Dashboard Grid Generation', 
                status: 'FAIL',
                error: error.message
            });
        }
    }

    async testCompetitorCardGeneration() {
        console.log('🧪 Testing Competitor Card Generation...');

        const variants = ['monitoring', 'threat', 'opportunity', 'neutral'];

        for (const variant of variants) {
            try {
                const result = await this.server.generateResponsiveComponent({
                    component: 'competitor-card',
                    variant: variant,
                    size: 'md',
                    responsive: true,
                    darkMode: true
                });

                const isValid = this.validateCompetitorCardOutput(result, variant);
                this.logTest('Competitor Card', variant, isValid);

                this.testResults.push({
                    test: 'Competitor Card Generation',
                    variant: variant,
                    status: isValid ? 'PASS' : 'FAIL',
                    output: result.content[0].text.length
                });
            } catch (error) {
                this.logTest('Competitor Card', variant, false, error.message);
                this.testResults.push({
                    test: 'Competitor Card Generation',
                    variant: variant,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    async testResponsiveButtonGeneration() {
        console.log('🧪 Testing Responsive Button Generation...');

        const testCases = [
            { variant: 'primary', size: 'sm', animation: 'glow' },
            { variant: 'glass', size: 'md', animation: 'none' },
            { variant: 'neon', size: 'lg', animation: 'pulse' },
        ];

        for (const testCase of testCases) {
            try {
                const result = await this.server.generateResponsiveComponent({
                    component: 'responsive-button',
                    ...testCase,
                    responsive: true,
                    darkMode: true
                });

                const isValid = this.validateButtonOutput(result);
                this.logTest('Responsive Button', `${testCase.variant}-${testCase.size}`, isValid);

                this.testResults.push({
                    test: 'Responsive Button Generation',
                    case: testCase,
                    status: isValid ? 'PASS' : 'FAIL',
                    output: result.content[0].text.length
                });
            } catch (error) {
                this.logTest('Responsive Button', `${testCase.variant}-${testCase.size}`, false, error.message);
                this.testResults.push({
                    test: 'Responsive Button Generation',
                    case: testCase,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    async testChartComponentGeneration() {
        console.log('🧪 Testing Chart Component Generation...');

        try {
            const result = await this.server.generateResponsiveComponent({
                component: 'intelligence-chart',
                variant: 'primary',
                size: 'lg',
                responsive: true
            });

            const isValid = this.validateChartOutput(result);
            this.logTest('Intelligence Chart', 'responsive-chart', isValid);

            this.testResults.push({
                test: 'Chart Component Generation',
                status: isValid ? 'PASS' : 'FAIL',
                output: result.content[0].text.length
            });
        } catch (error) {
            this.logTest('Intelligence Chart', 'responsive-chart', false, error.message);
            this.testResults.push({
                test: 'Chart Component Generation',
                status: 'FAIL',
                error: error.message
            });
        }
    }

    async testCompetitiveIntelligenceLayout() {
        console.log('🧪 Testing Competitive Intelligence Layout...');

        try {
            const result = await this.server.generateResponsiveLayout({
                layoutType: 'competitive-intelligence',
                breakpoints: ['mobile', 'tablet', 'desktop', '4k'],
                components: ['metrics', 'charts', 'competitor-cards', 'ai-insights']
            });

            const isValid = this.validateLayoutOutput(result, 'competitive-intelligence');
            this.logTest('CI Layout', 'full-responsive', isValid);

            this.testResults.push({
                test: 'Competitive Intelligence Layout',
                status: isValid ? 'PASS' : 'FAIL',
                output: result.content[0].text.length
            });
        } catch (error) {
            this.logTest('CI Layout', 'full-responsive', false, error.message);
            this.testResults.push({
                test: 'Competitive Intelligence Layout',
                status: 'FAIL',
                error: error.message
            });
        }
    }

    async testMetricsOverviewLayout() {
        console.log('🧪 Testing Metrics Overview Layout...');

        try {
            const result = await this.server.generateResponsiveLayout({
                layoutType: 'metrics-overview',
                breakpoints: ['mobile', 'tablet', 'desktop'],
                components: ['revenue-metrics', 'user-growth', 'performance-kpis']
            });

            const isValid = this.validateLayoutOutput(result, 'metrics-overview');
            this.logTest('Metrics Layout', 'overview-responsive', isValid);

            this.testResults.push({
                test: 'Metrics Overview Layout',
                status: isValid ? 'PASS' : 'FAIL',
                output: result.content[0].text.length
            });
        } catch (error) {
            this.logTest('Metrics Layout', 'overview-responsive', false, error.message);
            this.testResults.push({
                test: 'Metrics Overview Layout',
                status: 'FAIL',
                error: error.message
            });
        }
    }

    async testDashboardGridLayout() {
        console.log('🧪 Testing Dashboard Grid Layout...');

        try {
            const result = await this.server.generateResponsiveLayout({
                layoutType: 'dashboard-grid',
                breakpoints: ['mobile', 'tablet', 'desktop', 'executive'],
                components: ['header', 'metrics', 'charts', 'sidebar']
            });

            const isValid = this.validateLayoutOutput(result, 'dashboard-grid');
            this.logTest('Dashboard Grid', 'grid-responsive', isValid);

            this.testResults.push({
                test: 'Dashboard Grid Layout',
                status: isValid ? 'PASS' : 'FAIL',
                output: result.content[0].text.length
            });
        } catch (error) {
            this.logTest('Dashboard Grid', 'grid-responsive', false, error.message);
            this.testResults.push({
                test: 'Dashboard Grid Layout',
                status: 'FAIL',
                error: error.message
            });
        }
    }

    async testDesignTokenGeneration() {
        console.log('🧪 Testing Design Token Generation...');

        const themes = ['intelligence', 'enterprise', 'cyberpunk', 'minimal'];

        for (const theme of themes) {
            try {
                const result = await this.server.generateDesignTokens({
                    theme: theme,
                    includeAnimations: true
                });

                const isValid = this.validateDesignTokens(result, theme);
                this.logTest('Design Tokens', theme, isValid);

                this.testResults.push({
                    test: 'Design Token Generation',
                    theme: theme,
                    status: isValid ? 'PASS' : 'FAIL',
                    output: result.content[0].text.length
                });
            } catch (error) {
                this.logTest('Design Tokens', theme, false, error.message);
                this.testResults.push({
                    test: 'Design Token Generation',
                    theme: theme,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    async testClassOptimization() {
        console.log('🧪 Testing Class Optimization...');

        const testCases = [
            {
                name: 'redundant-padding',
                classes: 'px-4 py-4 p-4 text-sm sm:text-base',
                expected: 'performance'
            },
            {
                name: 'conflicting-colors',
                classes: 'text-white text-gray-100 bg-blue-500 bg-blue-600',
                expected: 'consistency'
            },
            {
                name: 'responsive-optimization',
                classes: 'w-full sm:w-auto lg:w-full text-sm hover:scale-105 transition-all',
                expected: 'performance'
            }
        ];

        for (const testCase of testCases) {
            try {
                const result = await this.server.optimizeResponsiveClasses({
                    classes: testCase.classes,
                    target: testCase.expected
                });

                const isValid = this.validateOptimizationOutput(result);
                this.logTest('Class Optimization', testCase.name, isValid);

                this.testResults.push({
                    test: 'Class Optimization',
                    case: testCase.name,
                    status: isValid ? 'PASS' : 'FAIL',
                    output: result.content[0].text.length
                });
            } catch (error) {
                this.logTest('Class Optimization', testCase.name, false, error.message);
                this.testResults.push({
                    test: 'Class Optimization',
                    case: testCase.name,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    async testResponsivePerformance() {
        console.log('🧪 Testing Responsive Performance...');

        const performanceTests = [
            {
                name: 'component-generation-speed',
                test: async () => {
                    const start = Date.now();
                    await this.server.generateResponsiveComponent({
                        component: 'metric-card',
                        variant: 'primary',
                        responsive: true
                    });
                    return Date.now() - start;
                }
            },
            {
                name: 'layout-generation-speed',
                test: async () => {
                    const start = Date.now();
                    await this.server.generateResponsiveLayout({
                        layoutType: 'dashboard-grid',
                        breakpoints: ['mobile', 'tablet', 'desktop']
                    });
                    return Date.now() - start;
                }
            },
            {
                name: 'optimization-speed',
                test: async () => {
                    const start = Date.now();
                    await this.server.optimizeResponsiveClasses({
                        classes: 'px-4 py-4 text-sm sm:text-base lg:text-lg transition-all hover:scale-105'
                    });
                    return Date.now() - start;
                }
            }
        ];

        for (const perfTest of performanceTests) {
            try {
                const duration = await perfTest.test();
                const isPerformant = duration < 100; // Less than 100ms
                
                this.logTest('Performance', perfTest.name, isPerformant, `${duration}ms`);

                this.testResults.push({
                    test: 'Performance Test',
                    name: perfTest.name,
                    status: isPerformant ? 'PASS' : 'SLOW',
                    duration: duration
                });
            } catch (error) {
                this.logTest('Performance', perfTest.name, false, error.message);
                this.testResults.push({
                    test: 'Performance Test',
                    name: perfTest.name,
                    status: 'FAIL',
                    error: error.message
                });
            }
        }
    }

    // Validation methods
    validateComponentOutput(result, componentType) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        
        // Check for required elements
        const hasClasses = text.includes('Classes:');
        const hasHTML = text.includes('HTML:');
        const hasResponsiveClasses = text.includes('sm:') || text.includes('lg:') || text.includes('xl:');
        
        // Component-specific validations
        switch (componentType) {
            case 'metric-card':
                return hasClasses && hasHTML && hasResponsiveClasses && 
                       text.includes('taurus') && text.includes('metric');
            default:
                return hasClasses && hasHTML && hasResponsiveClasses;
        }
    }

    validateGridOutput(result) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('grid') && 
               text.includes('responsive') && 
               text.includes('sm:') && 
               text.includes('lg:');
    }

    validateCompetitorCardOutput(result, variant) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('competitor') && 
               text.includes(variant) && 
               text.includes('responsive') &&
               text.includes('sm:');
    }

    validateButtonOutput(result) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('button') && 
               text.includes('responsive') && 
               text.includes('sm:') &&
               text.includes('taurus');
    }

    validateChartOutput(result) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('chart') && 
               text.includes('intelligence') && 
               text.includes('responsive');
    }

    validateLayoutOutput(result, layoutType) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes(layoutType) && 
               text.includes('responsive') && 
               text.includes('breakpoints') &&
               text.includes('sm:') && 
               text.includes('lg:');
    }

    validateDesignTokens(result, theme) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('TAURUS') && 
               text.includes('design tokens') && 
               text.includes(theme) &&
               text.includes('CSS') && 
               text.includes('tailwindConfig');
    }

    validateOptimizationOutput(result) {
        if (!result || !result.content || !result.content[0]) return false;
        
        const text = result.content[0].text;
        return text.includes('optimization') && 
               text.includes('responsive') &&
               (text.includes('Optimizations:') || text.includes('Suggestions:') || text.includes('well-optimized'));
    }

    logTest(category, testName, passed, details = '') {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const detailsStr = details ? ` (${details})` : '';
        console.log(`  ${status} ${category}: ${testName}${detailsStr}`);
    }

    generateTestReport() {
        console.log('\n📊 TAURUS Responsive Tailwind MCP Test Report');
        console.log('=' .repeat(60));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const slowTests = this.testResults.filter(r => r.status === 'SLOW').length;

        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`🐌 Slow: ${slowTests}`);
        console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

        // Group results by test type
        const testGroups = {};
        this.testResults.forEach(result => {
            if (!testGroups[result.test]) testGroups[result.test] = [];
            testGroups[result.test].push(result);
        });

        console.log('\n📋 Detailed Results:');
        console.log('-' .repeat(40));

        Object.keys(testGroups).forEach(testType => {
            const results = testGroups[testType];
            const passed = results.filter(r => r.status === 'PASS').length;
            const total = results.length;
            
            console.log(`\n${testType}: ${passed}/${total} passed`);
            
            results.forEach(result => {
                const icon = result.status === 'PASS' ? '✅' : 
                           result.status === 'SLOW' ? '🐌' : '❌';
                const variant = result.variant || result.case?.variant || result.theme || result.name || '';
                const variantStr = variant ? ` (${variant})` : '';
                
                console.log(`  ${icon} ${result.status}${variantStr}`);
                
                if (result.error) {
                    console.log(`    Error: ${result.error}`);
                }
                
                if (result.duration) {
                    console.log(`    Duration: ${result.duration}ms`);
                }
            });
        });

        // Generate recommendations
        console.log('\n💡 Recommendations:');
        console.log('-' .repeat(40));

        if (failedTests > 0) {
            console.log('🔧 Fix failed tests before deployment');
        }

        if (slowTests > 0) {
            console.log('⚡ Optimize performance for slow operations');
        }

        const avgPerformance = this.testResults
            .filter(r => r.duration)
            .reduce((sum, r) => sum + r.duration, 0) / 
            this.testResults.filter(r => r.duration).length;

        if (avgPerformance > 50) {
            console.log(`🚀 Consider performance optimization (avg: ${Math.round(avgPerformance)}ms)`);
        }

        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Ready for production deployment.');
        }

        // Save test results to file
        const fs = require('fs');
        const testReport = {
            timestamp: new Date().toISOString(),
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                slow: slowTests,
                successRate: Math.round((passedTests / totalTests) * 100)
            },
            results: this.testResults
        };

        fs.writeFileSync('test-results.json', JSON.stringify(testReport, null, 2));
        console.log('\n📄 Test results saved to test-results.json');

        console.log('\n🚀 TAURUS Responsive Tailwind MCP Server is ready for deployment!');
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new TaurusResponsiveTestSuite();
    testSuite.runAllTests()
        .then(() => {
            console.log('\n✨ Test suite completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 Test suite failed:', error);
            process.exit(1);
        });
}

module.exports = TaurusResponsiveTestSuite;