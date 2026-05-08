import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | Mater Maria',
  description: 'Learn how Mater Maria uses cookies and similar technologies to enhance your browsing experience.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="text-[#B8860B] hover:underline mb-8 block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-8">
          Cookie Policy
        </h1>

        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit websites. 
              They help remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">2. How We Use Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant content and track campaign performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">3. Cookie Categories</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">Strictly Necessary</h3>
                <p className="text-sm">These cookies are essential for the website to function. They cannot be disabled.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">Performance & Analytics</h3>
                <p className="text-sm">Help us understand how visitors use our site so we can improve.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">Functional</h3>
                <p className="text-sm">Enable enhanced functionality and personalization.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">4. Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. 
              Please note that disabling essential cookies may affect website functionality.
            </p>
            <div className="mt-4">
              <p className="text-sm font-semibold">Browser-specific instructions:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-[#B8860B] hover:underline">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener" className="text-[#B8860B] hover:underline">Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener" className="text-[#B8860B] hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-[#B8860B] hover:underline">Edge</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">5. Third-Party Cookies</h2>
            <p>
              Some cookies are set by third-party services we use, such as analytics providers 
              and social media platforms. We recommend reviewing their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted 
              on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">7. Contact Us</h2>
            <p>
              If you have questions about our Cookie Policy, please contact us at{' '}
              <a href="mailto:info@mater-maria.com" className="text-[#B8860B] hover:underline">
                info@mater-maria.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}