import Link from 'next/link';

const footerLinks = {
  Solutions: [
    { href: '/solutions', text: 'Financial Automation' },
    { href: '/solutions', text: 'Marketing Automation' },
    { href: '/solutions', text: 'Business Operations' },
    { href: '/solutions', text: 'Intelligence Platform' },
  ],
  Company: [
    { href: '/about', text: 'About Us' },
    { href: '/case-studies', text: 'Case Studies' },
    { href: '/blog', text: 'Blog' },
    { href: '/careers', text: 'Careers' },
  ],
  Support: [
    { href: '/contact', text: 'Contact Us' },
    { href: '/help', text: 'Help Center' },
    { href: '/privacy', text: 'Privacy Policy' },
    { href: '/terms', text: 'Terms of Service' },
  ],
  Connect: [
    { href: '/linkedin', text: 'LinkedIn' },
    { href: '/twitter', text: 'Twitter' },
    { href: '/blog', text: 'Blog' },
    { href: '/newsletter', text: 'Newsletter' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-padding">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4">BizFlow™</h3>
              <p className="text-gray-400 leading-relaxed">
                Supercharge your business with AI-powered intelligence and automation.
              </p>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 TaurusAI.io. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Powered by AI Innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

