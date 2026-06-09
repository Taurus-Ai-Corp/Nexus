import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer | Mater Maria',
  description: 'Important disclaimer regarding the use of Mater Maria website and services.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="text-[#B8860B] hover:underline mb-8 block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-8">
          Disclaimer
        </h1>

        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">1. General Information</h2>
            <p>
              The information provided on this website is for general informational purposes only. 
              Nothing on this site should be construed as legal, financial, or professional advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">2. No Warranties</h2>
            <p>
              This website is provided "as is" without any representations or warranties, 
              express or implied. We make no representations or warranties in relation to 
              this website or the information and materials provided on this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">3. Accuracy of Information</h2>
            <p>
              While we strive to keep the information on this website accurate and up-to-date, 
              we make no representations or warranties of any kind, express or implied, 
              about the completeness, accuracy, reliability, suitability, or availability 
              of the information contained on the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">4. Investment Disclaimer</h2>
            <p>
              Any information regarding property investment, rental yields, or returns is 
              illustrative only and does not constitute financial advice. Past performance 
              does not guarantee future results. Property investments carry risks, including 
              potential loss of capital.
            </p>
            <p className="mt-4">
              Prospective investors should seek independent financial and legal advice 
              before making any investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">5. Property Details</h2>
            <p>
              Property specifications, floor plans, images, and descriptions on this website 
              are for illustration purposes only and may be subject to change without notice. 
              Dimensions and specifications are approximate and should be verified with the 
              developer or sales team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">6. Third-Party Links</h2>
            <p>
              This website may contain links to third-party websites. We have no control 
              over the nature, content, and availability of those sites. The inclusion 
              of any links does not necessarily imply a recommendation or endorsement of 
              the views expressed within them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">7. Limitation of Liability</h2>
            <p>
              Mater Maria, its directors, employees, or agents will not be liable to you 
              in relation to the contents of, or use of, or otherwise in connection with, 
              this website for any direct, indirect, or consequential loss or damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">8. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, graphics, logos, and 
              designs, is the intellectual property of Mater Maria unless otherwise stated. 
              Reproduction or distribution without prior written consent is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">9. Governing Law</h2>
            <p>
              This disclaimer is governed by and construed in accordance with the laws of 
              the United Arab Emirates. Any disputes arising from this disclaimer shall 
              be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">10. Contact Us</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at{' '}
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