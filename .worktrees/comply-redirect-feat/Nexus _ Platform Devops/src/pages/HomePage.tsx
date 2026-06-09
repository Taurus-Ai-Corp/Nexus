import React, { useEffect, useState } from 'react';
import { setPageMetadata } from '../utils/seoUtils';
import LocationBasedContent from '../components/common/LocationBasedContent';
import GeoAwarePrice from '../components/common/GeoAwarePrice';
import ContentQualityScore from '../components/common/ContentQualityScore';
import Citation from '../components/common/Citation';
import Bibliography from '../components/common/Bibliography';
import { registerCitation } from '../utils/citationManager';

const HomePage: React.FC = () => {
  // Set page metadata on component mount
  useEffect(() => {
    setPageMetadata({
      title: 'Atlas AI - Advanced AI Solutions for Modern Businesses',
      description: 'Discover how Atlas AI can transform your business with cutting-edge AI solutions tailored to your unique needs.',
      keywords: 'AI solutions, business intelligence, machine learning, data analytics',
    });
    
    // Register citations for the page
    registerCitation({
      id: '1',
      source: 'McKinsey & Company',
      title: 'The State of AI in 2023: Generative AI's breakout year',
      url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-2023-generative-ais-breakout-year',
      authors: ['Michael Chui', 'Alex Singla'],
      publishDate: '2023-11-29',
      publisher: 'McKinsey & Company',
    });
    
    registerCitation({
      id: '2',
      source: 'Harvard Business Review',
      title: 'How AI Is Changing Strategy',
      url: 'https://hbr.org/2024/01/how-ai-is-changing-strategy',
      authors: ['Ajay Agrawal', 'Joshua Gans', 'Avi Goldfarb'],
      publishDate: '2024-01-01',
      publisher: 'Harvard Business Review',
    });
    
    registerCitation({
      id: '3',
      source: 'MIT Sloan Management Review',
      title: 'Achieving Digital Maturity',
      url: 'https://sloanreview.mit.edu/article/achieving-digital-maturity/',
      authors: ['Gerald C. Kane', 'Doug Palmer', 'Anh Nguyen Phillips'],
      publishDate: '2024-02-15',
      publisher: 'MIT Sloan Management Review',
    });
  }, []);

  // Example blog content for content quality analysis
  const [blogContent, setBlogContent] = useState<string>(
    `# How AI is Transforming Business Operations in 2025

    Artificial intelligence continues to revolutionize how businesses operate across industries. With the latest advancements in machine learning algorithms and natural language processing, companies are finding new ways to streamline operations, enhance customer experiences, and drive innovation.
    
    ## Key Trends in AI Adoption
    
    The adoption of AI technologies has accelerated significantly in recent years. Organizations are increasingly implementing AI-powered solutions to:
    
    1. Automate repetitive tasks
    2. Generate actionable insights from vast amounts of data
    3. Personalize customer interactions at scale
    4. Optimize supply chains and resource allocation
    
    ## Real-World Applications
    
    Industries from healthcare to finance are seeing tangible benefits from AI implementation. For example, predictive maintenance systems in manufacturing have reduced downtime by up to 50% in some facilities.
    
    ## Challenges and Considerations
    
    Despite the benefits, organizations face challenges in AI adoption, including data quality issues, integration with legacy systems, and ethical considerations around algorithmic bias and transparency.
    
    ## Conclusion
    
    As AI technologies continue to evolve, businesses that strategically implement these solutions stand to gain significant competitive advantages in efficiency, innovation, and customer satisfaction.`
  );

  return (
    <div className="home-page">
      <section className="hero-section bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Advanced AI Solutions for Modern Businesses</h1>
            <p className="text-xl mb-8">
              <LocationBasedContent countries={['US', 'CA']}>
                Empowering North American businesses with cutting-edge AI technology
              </LocationBasedContent>
              <LocationBasedContent countries={['GB', 'DE', 'FR', 'ES', 'IT']}>
                Transforming European enterprises with powerful AI capabilities
              </LocationBasedContent>
              <LocationBasedContent countries={[]}>
                Revolutionizing businesses worldwide with next-generation AI solutions
              </LocationBasedContent>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg transition duration-300">
                Get Started
              </button>
              <button className="bg-transparent hover:bg-indigo-700 text-white border border-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Flexible Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-800">Basic</h3>
                <p className="text-gray-600 mt-2">For small businesses and startups</p>
                <div className="mt-4 text-3xl font-bold text-indigo-600">
                  <GeoAwarePrice amount={49} />
                  <span className="text-base font-normal text-gray-600">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">✓ <span className="ml-2">AI-powered data analysis</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Basic automation tools</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">5 user accounts</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Email support</span></li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300">
                  Choose Basic
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-indigo-600">
              <div className="p-6 border-b">
                <div className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-2">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Premium</h3>
                <p className="text-gray-600 mt-2">For growing businesses</p>
                <div className="mt-4 text-3xl font-bold text-indigo-600">
                  <GeoAwarePrice amount={99} />
                  <span className="text-base font-normal text-gray-600">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">✓ <span className="ml-2">Everything in Basic</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Advanced analytics dashboard</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Custom AI model training</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">20 user accounts</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Priority support</span></li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300">
                  Choose Premium
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-800">Enterprise</h3>
                <p className="text-gray-600 mt-2">For large organizations</p>
                <div className="mt-4 text-3xl font-bold text-indigo-600">
                  <GeoAwarePrice amount={249} />
                  <span className="text-base font-normal text-gray-600">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">✓ <span className="ml-2">Everything in Premium</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Enterprise-grade security</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Dedicated account manager</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">Unlimited user accounts</span></li>
                  <li className="flex items-center">✓ <span className="ml-2">24/7 premium support</span></li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300">
                  Choose Enterprise
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Latest Insights</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">How AI is Transforming Business Operations in 2025</h3>
                <ContentQualityScore content={blogContent} showDetails={true} />
              </div>
              
              <div className="prose max-w-none">
                {blogContent.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('#')) {
                    // Skip rendering the title since we already have it above
                    if (paragraph.startsWith('# ')) return null;
                    
                    // Handle subheadings
                    if (paragraph.startsWith('## ')) {
                      return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('## ', '')}</h4>;
                    }
                  }
                  
                  // Handle lists
                  if (paragraph.includes('1. ')) {
                    const listItems = paragraph.split('\n').filter(line => line.trim());
                    return (
                      <ol key={index} className="list-decimal pl-5 my-4">
                        {listItems.map((item, i) => {
                          const cleanItem = item.replace(/^\d+\.\s+/, '');
                          return <li key={i} className="mb-1">{cleanItem}</li>;
                        })}
                      </ol>
                    );
                  }
                  
                  // Regular paragraphs with citation additions
                  if (index === 1) {
                    // Add citation to the intro paragraph
                    const parts = paragraph.split('across industries.');
                    return (
                      <p key={index} className="mb-4">
                        {parts[0]}across industries.
                        <Citation 
                          id="1" 
                          source="McKinsey & Company"
                          title="The State of AI in 2023: Generative AI's breakout year"
                        >
                        </Citation>
                        {parts[1]}
                      </p>
                    );
                  } else if (index === 5) {
                    // Add citation to the real-world applications paragraph
                    const parts = paragraph.split('in some facilities.');
                    return (
                      <p key={index} className="mb-4">
                        {parts[0]}in some facilities.
                        <Citation 
                          id="2" 
                          source="Harvard Business Review"
                          title="How AI Is Changing Strategy"
                        >
                        </Citation>
                      </p>
                    );
                  } else if (index === 7) {
                    // Add citation to the conclusion
                    const parts = paragraph.split('customer satisfaction.');
                    return (
                      <p key={index} className="mb-4">
                        {parts[0]}customer satisfaction.
                        <Citation 
                          id="3" 
                          source="MIT Sloan Management Review"
                          title="Achieving Digital Maturity"
                        >
                        </Citation>
                      </p>
                    );
                  }
                  
                  // Default paragraph rendering
                  return <p key={index} className="mb-4">{paragraph}</p>;
                })}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-600">Published: August 15, 2025</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Read Full Article →</button>
              </div>
            </div>
            
            {/* Bibliography section */}
            <div className="mt-12">
              <Bibliography format="APA" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;