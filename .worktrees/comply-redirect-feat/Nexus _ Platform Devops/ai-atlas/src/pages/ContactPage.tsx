import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EnhancedForm from '../components/EnhancedForm';
import { useLoadingState } from '../hooks/useLoadingState';

const ContactPage: React.FC = () => {
  const { executeAsync } = useLoadingState();

  const handleFormSubmit = async (formData: Record<string, string>) => {
    return executeAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log form data (in real app, send to API)
      console.log('Contact form submitted:', formData);
      
      // Show success message
      alert('Thank you for your message! We\'ll get back to you soon.');
    });
  };

  const contactFormFields = [
    {
      name: 'name',
      type: 'text' as const,
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      autoComplete: 'name'
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email Address',
      placeholder: 'your.email@company.com',
      required: true,
      autoComplete: 'email'
    },
    {
      name: 'company',
      type: 'text' as const,
      label: 'Company',
      placeholder: 'Your company name',
      autoComplete: 'organization'
    },
    {
      name: 'role',
      type: 'text' as const,
      label: 'Role',
      placeholder: 'Your job title',
      autoComplete: 'organization-title'
    },
    {
      name: 'interest',
      type: 'select' as const,
      label: 'I\'m interested in',
      required: true,
      options: [
        { value: 'general', label: 'General Information' },
        { value: 'demo', label: 'Product Demo' },
        { value: 'pricing', label: 'Pricing & Plans' },
        { value: 'enterprise', label: 'Enterprise Solutions' },
        { value: 'partnership', label: 'Partnership Opportunities' },
        { value: 'support', label: 'Technical Support' }
      ]
    },
    {
      name: 'subject',
      type: 'text' as const,
      label: 'Subject',
      placeholder: 'Brief description of your inquiry',
      required: true
    },
    {
      name: 'message',
      type: 'textarea' as const,
      label: 'Message',
      placeholder: 'Tell us more about your needs...',
      required: true,
      validation: (value: string) => {
        if (value.trim().length < 20) {
          return 'Please provide at least 20 characters in your message';
        }
        return null;
      }
    }
  ];

  const contactInfo = [
    {
      title: 'Sales Inquiries',
      description: 'Ready to transform your marketing?',
      contact: 'sales@atlasai.com',
      phone: '+1 (555) 123-4567',
      icon: '💼',
      color: 'blue'
    },
    {
      title: 'Technical Support',
      description: 'Need help with your account?',
      contact: 'support@atlasai.com',
      phone: '+1 (555) 123-4568',
      icon: '🛠️',
      color: 'green'
    },
    {
      title: 'Partnership Opportunities',
      description: 'Interested in partnering with us?',
      contact: 'partners@atlasai.com',
      phone: '+1 (555) 123-4569',
      icon: '🤝',
      color: 'purple'
    },
    {
      title: 'Media & Press',
      description: 'Press inquiries and media requests',
      contact: 'press@atlasai.com',
      phone: '+1 (555) 123-4570',
      icon: '📰',
      color: 'orange'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive, Suite 400',
      zipcode: 'San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      timezone: 'Pacific Time',
      isHeadquarters: true
    },
    {
      city: 'New York',
      address: '456 Business Plaza, Floor 15',
      zipcode: 'New York, NY 10001',
      phone: '+1 (555) 987-6543',
      timezone: 'Eastern Time',
      isHeadquarters: false
    },
    {
      city: 'London',
      address: '789 Tech Quarter, Level 8',
      zipcode: 'London, UK EC2A 4BX',
      phone: '+44 20 7123 4567',
      timezone: 'GMT',
      isHeadquarters: false
    }
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'You can start immediately with our 14-day free trial. Full onboarding typically takes 24-48 hours.'
    },
    {
      question: 'Do you offer implementation support?',
      answer: 'Yes, we provide comprehensive onboarding and implementation support for all paid plans.'
    },
    {
      question: 'What integrations do you support?',
      answer: 'We support 100+ integrations including CRM, email platforms, social media, and analytics tools.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security measures and are compliant with GDPR, CCPA, and SOC 2.'
    }
  ];

  return (
    <div className="bg-dgsm-primary min-h-screen">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dgsm-text-primary mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-dgsm-text-secondary max-w-3xl mx-auto">
            Have questions about 🚀 Atlas AI? We're here to help. Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const getContactColors = (color: string) => {
                switch(color) {
                  case 'blue': return { bg: 'bg-blue-500/20', text: 'text-blue-500' };
                  case 'green': return { bg: 'bg-green-500/20', text: 'text-green-500' };
                  case 'orange': return { bg: 'bg-orange-500/20', text: 'text-orange-500' };
                  case 'purple': return { bg: 'bg-purple-500/20', text: 'text-purple-500' };
                  default: return { bg: 'bg-blue-500/20', text: 'text-blue-500' };
                }
              };
              const colors = getContactColors(info.color);
              
              return (
                <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-dgsm-border">
                  <div className={`text-3xl mb-4 p-3 rounded-lg ${colors.bg} w-fit`}>
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-dgsm-text-primary mb-2">{info.title}</h3>
                  <p className="text-dgsm-text-secondary text-sm mb-4">{info.description}</p>
                  <div className="space-y-2">
                    <p className={`${colors.text} font-semibold text-sm`}>{info.contact}</p>
                    <p className="text-dgsm-text-muted text-sm">{info.phone}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-dgsm-secondary rounded-xl p-8 shadow-lg border border-dgsm-border">
              <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">Send us a Message</h2>
              <EnhancedForm
                fields={contactFormFields}
                onSubmit={handleFormSubmit}
                submitLabel="Send Message"
                autoSave={true}
                autoSaveDelay={3000}
              />
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl font-bold text-dgsm-text-primary mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-dgsm-text-primary">{office.city}</h3>
                      {office.isHeadquarters && (
                        <span className="bg-dgsm-accent-blue/20 text-dgsm-accent-blue px-2 py-1 rounded-full text-xs font-semibold">
                          Headquarters
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-dgsm-text-secondary">
                      <p>{office.address}</p>
                      <p>{office.zipcode}</p>
                      <p className="text-dgsm-accent-green font-semibold">{office.phone}</p>
                      <p className="text-dgsm-text-muted text-sm">{office.timezone}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 bg-dgsm-secondary rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-dgsm-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-navy-800 rounded-lg text-dgsm-text-primary hover:bg-navy-700 transition-colors">
                    📅 Schedule a Demo
                  </button>
                  <button className="w-full text-left p-3 bg-navy-800 rounded-lg text-dgsm-text-primary hover:bg-navy-700 transition-colors">
                    📞 Request a Call Back
                  </button>
                  <button className="w-full text-left p-3 bg-navy-800 rounded-lg text-dgsm-text-primary hover:bg-navy-700 transition-colors">
                    💬 Start Live Chat
                  </button>
                  <button className="w-full text-left p-3 bg-navy-800 rounded-lg text-dgsm-text-primary hover:bg-navy-700 transition-colors">
                    📊 Download Case Studies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dgsm-text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-dgsm-text-secondary">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dgsm-secondary rounded-lg p-6 shadow-lg">
                <h3 className="font-bold text-dgsm-text-primary mb-3">{faq.question}</h3>
                <p className="text-dgsm-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-dgsm-accent-purple to-dgsm-accent-blue rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to See 🚀 Atlas AI in Action?
            </h2>
            <p className="text-blue-100 mb-6">
              Don't just take our word for it. See how 🚀 Atlas AI can transform your marketing efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup"
                className="bg-white text-dgsm-accent-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Free Trial
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-dgsm-accent-purple transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
