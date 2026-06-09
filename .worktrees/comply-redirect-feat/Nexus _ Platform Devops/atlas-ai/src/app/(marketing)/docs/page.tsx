import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - Atlas AI',
  description: 'Complete documentation for Atlas AI platform',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Welcome to Atlas AI! This documentation will help you get started with our platform.
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Create your account</li>
                <li>Set up your first project</li>
                <li>Connect your data sources</li>
                <li>Generate your first AI-powered insights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Integrate Atlas AI into your applications with our REST API.
              </p>
              <code className="bg-gray-900 text-green-400 p-2 rounded block">
                GET /api/v1/insights
              </code>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Templates</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300">
                Explore our pre-built templates to accelerate your AI projects.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}