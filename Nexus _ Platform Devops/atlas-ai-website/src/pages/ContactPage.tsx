import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Footer } from '../components/Footer';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Ready to transform your marketing with AI? Contact our team for a personalized demo 
            or to discuss your specific requirements.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glow-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#E0E0E0] text-sm mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E0E0E0] text-sm mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#E0E0E0] text-sm mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-[#E0E0E0] text-sm mb-2">Company</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none"
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-[#E0E0E0] text-sm mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00EEFF] focus:outline-none resize-none"
                    placeholder="Tell us about your marketing challenges and goals..."
                  />
                </div>
                
                <button type="submit" className="w-full glow-button py-3 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glow-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Email</h4>
                      <p className="text-[#E0E0E0]">hello@atlasai.com</p>
                      <p className="text-[#E0E0E0] text-sm">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Phone</h4>
                      <p className="text-[#E0E0E0]">+1 (555) 123-4567</p>
                      <p className="text-[#E0E0E0] text-sm">Mon-Fri 9AM-6PM PST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Office</h4>
                      <p className="text-[#E0E0E0]">123 Innovation Drive</p>
                      <p className="text-[#E0E0E0]">San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enterprise Contact */}
              <div className="glow-card-green p-8">
                <h3 className="text-xl font-bold text-white mb-4">Enterprise Sales</h3>
                <p className="text-[#E0E0E0] mb-6">
                  Looking for custom solutions, white-label options, or enterprise pricing? 
                  Our enterprise team is ready to help.
                </p>
                <button className="glow-button px-6 py-3">
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
