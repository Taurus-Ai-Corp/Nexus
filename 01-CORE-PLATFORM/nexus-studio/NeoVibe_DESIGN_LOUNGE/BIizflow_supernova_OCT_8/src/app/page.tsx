'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIChatWidget from '@/components/AIChatWidget';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000);
  const [employeeCount, setEmployeeCount] = useState(50);
  const [automationGoals, setAutomationGoals] = useState('advanced');
  const [roiResults, setRoiResults] = useState<{
    monthlySavings: number;
    paybackPeriod: number;
    annualROI: number;
  } | null>(null);

  // Auto-advance demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const calculateROI = () => {
    const efficiencyMultiplier =
      automationGoals === 'enterprise' ? 0.9 :
      automationGoals === 'advanced' ? 0.7 : 0.5;

    const monthlySavings = Math.round(monthlyRevenue * efficiencyMultiplier * 0.15);
    const annualSavings = monthlySavings * 12;
    const implementationCost = Math.round(employeeCount * 1000 + 50000);
    const paybackPeriod = Math.round(implementationCost / monthlySavings);
    const annualROI = Math.round((annualSavings - implementationCost) / implementationCost * 100);

    setRoiResults({
      monthlySavings,
      paybackPeriod,
      annualROI,
    });
  };

  const demoSteps = [
    {
      title: 'Data Input',
      description: 'Connect your business data sources',
      icon: '📄',
      color: 'bg-primary-600',
    },
    {
      title: 'AI Analysis',
      description: 'Our AI processes and analyzes your data',
      icon: '🧠',
      color: 'bg-accent-500',
    },
    {
      title: 'Automation',
      description: 'Automated workflows execute seamlessly',
      icon: '🔄',
      color: 'bg-success-500',
    },
    {
      title: 'Results',
      description: 'View insights and performance metrics',
      icon: '📊',
      color: 'bg-warning-500',
    },
  ];

  const keyBenefits = [
    {
      icon: Zap,
      title: '90% Efficiency Gain',
      description: 'Reduce manual processes by 90%',
    },
    {
      icon: TrendingUp,
      title: '150-300% ROI',
      description: 'Average return on investment',
    },
    {
      icon: Clock,
      title: '6-8 Month Implementation',
      description: 'Typical deployment timeline',
    },
    {
      icon: Shield,
      title: '99.9% Uptime',
      description: 'Enterprise-grade reliability',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Supercharge Your Business with{' '}
              <span className="gradient-text">AI-Powered Intelligence</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Automate workflows, predict trends, and make smarter decisions with BizFlow&apos;s
              cutting-edge AI platform. Deploy 11 specialized AI agents for complete business automation.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="#demo" className="btn-primary text-lg px-8 py-4">
                Get Started for Free
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                View Features
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-32">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See BizFlow in Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch how our AI agents transform your business processes in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Demo Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-8xl">
                <div className="text-center">
                  <div className={`w-20 h-20 ${demoSteps[currentStep - 1].color} rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 transition-all duration-500`}>
                    {demoSteps[currentStep - 1].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary-600 mb-2">
                    {demoSteps[currentStep - 1].title}
                  </h3>
                  <p className="text-gray-600">
                    {demoSteps[currentStep - 1].description}
                  </p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentStep === step ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Demo Info */}
            <div>
              <h3 className="text-3xl font-bold mb-6">Interactive Demo</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Click through the steps to see how BizFlow transforms your business data into actionable insights.
                Each step represents a real automation workflow that our AI agents execute.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {demoSteps.map((step, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                      {step.icon}
                    </div>
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join 500+ companies already automating their business processes
            </p>
          </div>

          {/* Client Logos */}
          <div className="flex flex-wrap justify-center items-center gap-12 mb-16 opacity-70">
            {['🏢 Enterprise Corp', '🏥 HealthTech Inc', '🛒 E-commerce Plus', '🏭 Manufacturing Pro', '💼 Professional Services'].map((logo, index) => (
              <div key={index} className="text-2xl hover:opacity-100 transition-opacity">
                {logo}
              </div>
            ))}
          </div>

          {/* Case Studies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">300%</div>
              <div className="text-gray-600">ROI Achieved</div>
            </div>
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">8 months</div>
              <div className="text-gray-600">Payback Period</div>
            </div>
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">90%</div>
              <div className="text-gray-600">Efficiency Gain</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-32">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Calculate Your ROI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how much you can save with BizFlow automation based on your actual business metrics
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="card p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employees
                  </label>
                  <input
                    type="number"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Automation Goals
                  </label>
                  <select
                    value={automationGoals}
                    onChange={(e) => setAutomationGoals(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none"
                  >
                    <option value="basic">Basic workflow automation</option>
                    <option value="advanced">Advanced AI-powered processes</option>
                    <option value="enterprise">Full enterprise transformation</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateROI}
                className="btn-primary w-full"
              >
                Calculate ROI
              </button>
            </div>

            {roiResults && (
              <div className="card p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      ${roiResults.monthlySavings.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {roiResults.paybackPeriod} months
                    </div>
                    <div className="text-gray-600">Payback Period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {roiResults.annualROI}%
                    </div>
                    <div className="text-gray-600">Annual ROI</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-32 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose BizFlow?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses achieving remarkable results with our proven AI automation platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="card p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <benefit.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container-padding text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Automate Your Business?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start leveraging the power of AI today and unlock new levels of efficiency and growth.
          </p>
          <Link href="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
            Get Started for Free
          </Link>
        </div>
      </section>

      <Footer />
      <AIChatWidget />
    </div>
  );
}
