import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - Atlas AI',
  description: 'Get help with Atlas AI platform. Find answers to common questions and troubleshooting tips.',
};

export default function HelpPage() {
  // Sample FAQ items
  const faqItems = [
    {
      question: 'How do I get started with Atlas AI?',
      answer: 'Sign up for a free trial account, then follow our interactive onboarding guide to set up your first project.'
    },
    {
      question: 'What are AI agents and how do they work?',
      answer: 'AI agents are specialized artificial intelligence modules that perform specific marketing tasks. Each agent is trained for functions like content creation, audience analysis, or campaign optimization.'
    },
    {
      question: 'How secure is my data on Atlas AI?',
      answer: 'We implement enterprise-grade security with end-to-end encryption, regular security audits, and strict access controls. Your data is never used to train our AI models without explicit consent.'
    },
    {
      question: 'Can I integrate Atlas AI with my existing marketing tools?',
      answer: 'Yes! Atlas AI offers integrations with popular marketing platforms including HubSpot, Mailchimp, Google Analytics, Facebook Ads, and more.'
    },
    {
      question: 'What support options are available?',
      answer: 'All plans include access to our help center and community forums. Business and Enterprise plans also include dedicated email support and priority response times.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>
        
        <div className="bg-gray-800/50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">How can we help you?</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors duration-200">
                  <h3 className="text-xl font-medium mb-3 text-indigo-300">{item.question}</h3>
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-indigo-900/30 rounded-lg p-8 border border-indigo-800/50">
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="text-gray-300 mb-6">
              Our support team is ready to assist you with any questions or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-center transition-colors duration-200"
              >
                Contact Support
              </a>
              <a 
                href="/docs" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg text-center transition-colors duration-200"
              >
                Browse Documentation
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}