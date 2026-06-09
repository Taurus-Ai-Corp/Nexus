import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | TAURUS AI",
  description: "Terms of Service for TAURUS AI Partnership",
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-4">Last updated: April 2025</p>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
          <p className="text-muted-foreground">TAURUS AI Corp provides AI-powered execution services for agencies. The service allows agencies to automate workflows using AI agents.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. User Obligations</h2>
          <p className="text-muted-foreground">You agree to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to any part of the system</li>
            <li>Not transmit any viruses or malicious code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
          <p className="text-muted-foreground">All content, features, and functionality are owned by TAURUS AI Corp and are protected by international copyright, trademark, and other intellectual property laws.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p className="text-muted-foreground">TAURUS AI Corp shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
          <p className="text-muted-foreground">These Terms shall be governed by the laws of Dubai, UAE (IFZA).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-muted-foreground">For questions about these Terms, contact: admin@taurusai.io</p>
        </section>
      </div>
    </main>
  )
}