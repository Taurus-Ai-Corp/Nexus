import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | TAURUS AI",
  description: "Privacy Policy for TAURUS AI Partnership",
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-4">Last updated: April 2025</p>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-muted-foreground">We collect minimal personal information. When you contact us or apply for partnership, we collect:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Email address</li>
            <li>Name</li>
            <li>Company information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">We use your information to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Provide and improve our services</li>
            <li>Communicate with you about partnerships</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Data Protection</h2>
          <p className="text-muted-foreground">Your data is stored securely and we implement appropriate technical measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
          <p className="text-muted-foreground">We do not sell your personal data. We may share data with service providers who assist us in operating our website and providing services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p className="text-muted-foreground">You have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
          <p className="text-muted-foreground">For questions about this Privacy Policy, contact: admin@taurusai.io</p>
        </section>
      </div>
    </main>
  )
}