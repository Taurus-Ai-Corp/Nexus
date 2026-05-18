import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Atlas AI',
  description: 'Learn more about Atlas AI and our mission to transform marketing with AI',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">About Atlas AI</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                At Atlas AI, we&apos;re on a mission to democratize AI-powered marketing for businesses of all sizes. 
                We believe that with the right tools, any company can leverage artificial intelligence to create 
                compelling marketing campaigns that resonate with their audience.
              </p>
              <p className="text-gray-300">
                Our platform combines cutting-edge AI technology with intuitive design to make advanced 
                marketing automation accessible to everyone, regardless of technical expertise.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Founded in 2023, Atlas AI brings together experts in artificial intelligence, 
                marketing, and product design. Our diverse team is united by a shared passion for 
                using technology to solve real business problems.
              </p>
              <p className="text-gray-300">
                We&apos;re headquartered in San Francisco with team members distributed around the world, 
                bringing global perspectives to our product development.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <ul className="text-gray-300 space-y-4">
                <li>
                  <strong className="text-indigo-400">Innovation:</strong> We&apos;re constantly pushing the boundaries of what&apos;s possible with AI in marketing.
                </li>
                <li>
                  <strong className="text-indigo-400">Accessibility:</strong> We design our products to be powerful yet easy to use for marketers at all levels.
                </li>
                <li>
                  <strong className="text-indigo-400">Integrity:</strong> We&apos;re committed to ethical AI practices and transparent communication with our customers.
                </li>
                <li>
                  <strong className="text-indigo-400">Customer Success:</strong> We measure our success by the results we deliver for our customers.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}