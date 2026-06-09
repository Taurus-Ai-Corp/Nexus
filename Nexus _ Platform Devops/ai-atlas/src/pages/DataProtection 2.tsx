import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const DataProtection: React.FC = () => {
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
              Data Protection
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
            
            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">1. Our Commitment to Data Protection</h2>
            <p className="text-dgsm-text-secondary mb-6">
              At 🚀 Atlas AI, data protection is fundamental to our business. We are committed to maintaining the highest 
              standards of data security, privacy, and compliance. This Data Protection policy outlines our comprehensive 
              approach to safeguarding your information and ensuring compliance with global data protection regulations 
              including GDPR, CCPA, PIPEDA, and other applicable laws.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">2. Data Protection Principles</h2>
            <p className="text-dgsm-text-secondary mb-4">
              We adhere to the following core data protection principles:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Lawfulness, Fairness, and Transparency:</strong> Process data legally, fairly, and transparently</li>
              <li><strong>Purpose Limitation:</strong> Collect data for specified, explicit, and legitimate purposes</li>
              <li><strong>Data Minimization:</strong> Ensure data is adequate, relevant, and not excessive</li>
              <li><strong>Accuracy:</strong> Keep personal data accurate and up to date</li>
              <li><strong>Storage Limitation:</strong> Retain data only as long as necessary</li>
              <li><strong>Integrity and Confidentiality:</strong> Ensure appropriate security of data</li>
              <li><strong>Accountability:</strong> Demonstrate compliance with data protection principles</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">3. Data Governance Framework</h2>
            
            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">3.1 Data Protection Officer (DPO)</h3>
            <p className="text-dgsm-text-secondary mb-6">
              We have appointed a qualified Data Protection Officer who oversees our data protection strategy, 
              monitors compliance, and serves as the point of contact for data protection authorities and individuals.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">3.2 Privacy by Design</h3>
            <p className="text-dgsm-text-secondary mb-4">
              We implement privacy by design principles throughout our development process:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Proactive privacy measures built into all systems</li>
              <li>Privacy as the default setting</li>
              <li>Privacy embedded into system design</li>
              <li>Full functionality with privacy protection</li>
              <li>End-to-end security throughout the data lifecycle</li>
              <li>Visibility and transparency in data processing</li>
              <li>Respect for user privacy preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">3.3 Data Protection Impact Assessments (DPIAs)</h3>
            <p className="text-dgsm-text-secondary mb-6">
              We conduct DPIAs for any processing activities that may result in high risks to individuals' rights and freedoms, 
              ensuring that privacy risks are identified and mitigated before implementation.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">4. Technical and Organizational Measures</h2>
            
            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">4.1 Encryption and Security</h3>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <ul className="list-disc list-inside text-dgsm-text-secondary space-y-2">
                <li><strong>Data at Rest:</strong> AES-256 encryption for all stored data</li>
                <li><strong>Data in Transit:</strong> TLS 1.3 encryption for all communications</li>
                <li><strong>Database Security:</strong> Encrypted databases with access controls</li>
                <li><strong>Backup Encryption:</strong> All backups encrypted and securely stored</li>
                <li><strong>Key Management:</strong> Hardware security modules (HSMs) for key protection</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">4.2 Access Controls</h3>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <ul className="list-disc list-inside text-dgsm-text-secondary space-y-2">
                <li><strong>Multi-Factor Authentication:</strong> Required for all administrative access</li>
                <li><strong>Role-Based Access Control:</strong> Minimum necessary access principles</li>
                <li><strong>Regular Access Reviews:</strong> Quarterly reviews and deprovisioning</li>
                <li><strong>Privileged Access Management:</strong> Special controls for elevated privileges</li>
                <li><strong>Zero Trust Architecture:</strong> Continuous verification of access requests</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">4.3 Monitoring and Logging</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <ul className="list-disc list-inside text-dgsm-text-secondary space-y-2">
                <li><strong>Security Information and Event Management (SIEM):</strong> 24/7 monitoring</li>
                <li><strong>Audit Logs:</strong> Comprehensive logging of all data access and processing</li>
                <li><strong>Anomaly Detection:</strong> AI-powered detection of unusual activities</li>
                <li><strong>Incident Response:</strong> Automated alerts and response procedures</li>
                <li><strong>Regular Security Assessments:</strong> Penetration testing and vulnerability scans</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">5. Data Subject Rights</h2>
            <p className="text-dgsm-text-secondary mb-4">
              We provide comprehensive support for all data subject rights:
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.1 Right to be Informed</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Clear and transparent information about how we collect, use, and share your personal data through our 
              Privacy Policy and this Data Protection policy.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.2 Right of Access</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Request a copy of your personal data and information about how it's being processed. 
              We provide this information within 30 days of your request.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.3 Right to Rectification</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Correct inaccurate or incomplete personal data. You can update most information directly 
              through your account settings.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.4 Right to Erasure (Right to be Forgotten)</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Request deletion of your personal data when certain conditions are met, such as when the 
              data is no longer necessary for the original purpose.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.5 Right to Restrict Processing</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Request that we limit how we process your personal data in certain circumstances, 
              such as when you contest the accuracy of the data.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.6 Right to Data Portability</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Receive your personal data in a structured, commonly used format and transmit it to another 
              controller where technically feasible.
            </p>

            <h3 className="text-xl font-semibold text-dgsm-text-primary mb-4">5.7 Right to Object</h3>
            <p className="text-dgsm-text-secondary mb-6">
              Object to certain types of processing, including direct marketing and processing based on legitimate interests.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">6. Cross-Border Data Transfers</h2>
            <p className="text-dgsm-text-secondary mb-4">
              When transferring personal data outside your country or region, we ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection laws</li>
              <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contractual safeguards</li>
              <li><strong>Binding Corporate Rules:</strong> Internal data protection standards</li>
              <li><strong>Certification Schemes:</strong> Industry-recognized data protection certifications</li>
              <li><strong>Additional Safeguards:</strong> Technical measures like encryption and access controls</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">7. Data Breach Response</h2>
            <p className="text-dgsm-text-secondary mb-4">
              Our comprehensive data breach response plan includes:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li><strong>Detection:</strong> 24/7 monitoring systems to identify potential breaches</li>
              <li><strong>Assessment:</strong> Rapid evaluation of breach scope and impact</li>
              <li><strong>Containment:</strong> Immediate measures to prevent further unauthorized access</li>
              <li><strong>Investigation:</strong> Thorough analysis to understand the cause and extent</li>
              <li><strong>Notification:</strong> Timely notification to authorities and affected individuals</li>
              <li><strong>Remediation:</strong> Steps to address vulnerabilities and prevent recurrence</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">8. Third-Party Data Processors</h2>
            <p className="text-dgsm-text-secondary mb-4">
              We carefully select and monitor our data processors to ensure they provide appropriate safeguards:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Due diligence assessments before engagement</li>
              <li>Binding data processing agreements (DPAs)</li>
              <li>Regular audits and compliance monitoring</li>
              <li>Requirements for sub-processor approval</li>
              <li>Incident reporting and breach notification procedures</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">9. Employee Training and Awareness</h2>
            <p className="text-dgsm-text-secondary mb-4">
              All 🚀 Atlas AI employees receive comprehensive data protection training:
            </p>
            <ul className="list-disc list-inside text-dgsm-text-secondary mb-6 space-y-2">
              <li>Mandatory data protection training for all new hires</li>
              <li>Regular refresher training and updates</li>
              <li>Role-specific training for employees handling personal data</li>
              <li>Ongoing awareness campaigns and communications</li>
              <li>Testing and certification requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">10. Compliance Monitoring</h2>
            <p className="text-dgsm-text-secondary mb-6">
              We maintain ongoing compliance through regular assessments, audits, and improvements to our 
              data protection practices. Our compliance program includes internal audits, third-party assessments, 
              and continuous monitoring of regulatory changes.
            </p>

            <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">11. Contact Our Data Protection Team</h2>
            <p className="text-dgsm-text-secondary mb-4">
              For questions about data protection or to exercise your rights, contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-dgsm-text-secondary">
              <p><strong>Data Protection Officer</strong></p>
              <p>Email: dpo@atlasai.com</p>
              <p>Data Subject Requests: privacy@atlasai.com</p>
              <p>Security Incidents: security@atlasai.com</p>
              <p>Address: [Company Address]</p>
              <p>Phone: [Phone Number]</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DataProtection;
