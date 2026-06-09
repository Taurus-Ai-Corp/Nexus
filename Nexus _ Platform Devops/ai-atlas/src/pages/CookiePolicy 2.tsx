import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const CookiePolicy: React.FC = () => {
  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dgsm-secondary via-dgsm-primary to-dgsm-secondary py-20">
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-dgsm-accent-blue hover:text-dgsm-accent-purple transition-colors mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to 🚀 Atlas AI
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dgsm-text-primary">
              Cookie Policy
            </h1>
            <p className="text-xl text-dgsm-text-secondary">
              Last updated: June 2, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-dgsm-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">1. What Are Cookies?</h2>
            <p className="text-dgsm-text-secondary mb-6">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, 
              and providing personalized content and advertising. This Cookie Policy explains how 🚀 Atlas AI uses cookies and 
              similar tracking technologies on our website and platform.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.1 Essential Cookies</h3>
            <p className="text-dgsm-text-secondary mb-4">
              These cookies are necessary for our website to function properly and cannot be disabled:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Authentication:</strong> Keep you logged in to your account</li>
              <li><strong>Security:</strong> Protect against fraudulent activity and security threats</li>
              <li><strong>Session Management:</strong> Maintain your session across page visits</li>
              <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
              <li><strong>CSRF Protection:</strong> Prevent cross-site request forgery attacks</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.2 Functional Cookies</h3>
            <p className="text-dgsm-text-secondary mb-4">
              These cookies enhance your experience by remembering your choices:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Preferences:</strong> Your language, theme, and display settings</li>
              <li><strong>Dashboard Layout:</strong> Your customized dashboard configuration</li>
              <li><strong>Form Data:</strong> Information you've entered in forms (temporarily)</li>
              <li><strong>Feature Toggles:</strong> Settings for optional features you've enabled</li>
              <li><strong>Timezone:</strong> Your local timezone for accurate timestamps</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.3 Analytics Cookies</h3>
            <p className="text-dgsm-text-secondary mb-4">
              These cookies help us understand how you use our website and platform:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Usage Analytics:</strong> Pages visited, time spent, and user flow</li>
              <li><strong>Performance Monitoring:</strong> Page load times and error tracking</li>
              <li><strong>Feature Usage:</strong> Which features are most popular and useful</li>
              <li><strong>A/B Testing:</strong> Compare different versions of our interface</li>
              <li><strong>Heat Mapping:</strong> Understand how users interact with our interface</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">2.4 Marketing Cookies</h3>
            <p className="text-dgsm-text-secondary mb-4">
              These cookies are used for advertising and marketing purposes:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Targeted Advertising:</strong> Show relevant ads based on your interests</li>
              <li><strong>Retargeting:</strong> Display our ads on other websites you visit</li>
              <li><strong>Campaign Tracking:</strong> Measure the effectiveness of our marketing campaigns</li>
              <li><strong>Conversion Tracking:</strong> Track actions taken after clicking our ads</li>
              <li><strong>Social Media:</strong> Enable sharing and social media integrations</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">3. Detailed Cookie Information</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-dgsm-text-primary mb-4">First-Party Cookies (Set by 🚀 Atlas AI)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-dgsm-text-secondary">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 pr-4 font-semibold">Name</th>
                      <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                      <th className="text-left py-2 pr-4 font-semibold">Duration</th>
                      <th className="text-left py-2 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-medium">aiatlas_session</td>
                      <td className="py-2 pr-4">User session management</td>
                      <td className="py-2 pr-4">Session</td>
                      <td className="py-2">Essential</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-medium">user_preferences</td>
                      <td className="py-2 pr-4">Store user settings and preferences</td>
                      <td className="py-2 pr-4">1 year</td>
                      <td className="py-2">Functional</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-medium">analytics_id</td>
                      <td className="py-2 pr-4">Anonymous usage analytics</td>
                      <td className="py-2 pr-4">2 years</td>
                      <td className="py-2">Analytics</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">marketing_consent</td>
                      <td className="py-2 pr-4">Track marketing cookie consent</td>
                      <td className="py-2 pr-4">1 year</td>
                      <td className="py-2">Marketing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-dgsm-text-primary mb-4">Third-Party Cookies</h3>
              <ul className="list-disc list-inside text-dgsm-text-secondary space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
                <li><strong>Google Ads:</strong> Advertising and conversion tracking</li>
                <li><strong>Facebook Pixel:</strong> Social media advertising and retargeting</li>
                <li><strong>LinkedIn Insight Tag:</strong> Professional network advertising</li>
                <li><strong>Hotjar:</strong> User experience analytics and heat mapping</li>
                <li><strong>Intercom:</strong> Customer support chat functionality</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">4. Cookie Duration</h2>
            <p className="text-dgsm-text-secondary mb-4">
              Cookies have different lifespans:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain until expiration date or manual deletion</li>
              <li><strong>Secure Cookies:</strong> Only transmitted over encrypted HTTPS connections</li>
              <li><strong>HttpOnly Cookies:</strong> Cannot be accessed by JavaScript (security feature)</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.1 Cookie Consent Banner</h3>
            <p className="text-dgsm-text-secondary mb-6">
              When you first visit our website, you'll see a cookie consent banner allowing you to accept or customize 
              your cookie preferences. You can change these preferences at any time using the cookie settings link 
              in our website footer.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.2 Browser Settings</h3>
            <p className="text-dgsm-text-secondary mb-4">
              You can also manage cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Chrome:</strong> Settings {'->'} Privacy and Security {'->'} Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings {'->'} Privacy & Security {'->'} Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences {'->'} Privacy {'->'} Manage Website Data</li>
              <li><strong>Edge:</strong> Settings {'->'} Site permissions {'->'} Cookies and stored data</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.3 Opt-Out Options</h3>
            <p className="text-dgsm-text-secondary mb-4">
              For specific tracking services, you can opt out directly:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
              <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com" className="text-blue-600 hover:underline">Google Ads Settings</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:underline">Facebook Ad Preferences</a></li>
              <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out" className="text-blue-600 hover:underline">LinkedIn Opt-out</a></li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">6. Impact of Disabling Cookies</h2>
            <p className="text-dgsm-text-secondary mb-4">
              Disabling certain types of cookies may affect your experience:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> May prevent core functionality from working</li>
              <li><strong>Functional Cookies:</strong> May reset your preferences on each visit</li>
              <li><strong>Analytics Cookies:</strong> Won't affect functionality but helps us improve our service</li>
              <li><strong>Marketing Cookies:</strong> You may see less relevant advertising</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">7. Updates to This Cookie Policy</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We may update this Cookie Policy to reflect changes in our practices or applicable laws. We will notify 
              you of significant changes through our website or email. The "Last updated" date at the top indicates 
              when this policy was last revised.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">8. Contact Us</h2>
            <p className="text-dgsm-text-secondary mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-dgsm-text-secondary">
              <p><strong>🚀 Atlas AI Privacy Team</strong></p>
              <p>Email: privacy@atlasai.com</p>
              <p>Cookie Questions: cookies@atlasai.com</p>
              <p>Address: [Company Address]</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
