import React from 'react';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'TechFlow Solutions',
      content: 'Atlas AI has revolutionized our marketing approach. We\'ve seen a 300% improvement in campaign efficiency and our ROI has never been better.',
      rating: 5,
      avatar: '/images/ai_robot_futuristic_dashboard_technology.jpg'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Growth Manager',
      company: 'StartupHub',
      content: 'The AI-powered analytics provide insights we never had before. Our conversion rates increased by 150% in just three months.',
      rating: 5,
      avatar: '/images/abstract_neural_network_ai_brain_technology.jpg'
    },
    {
      name: 'Emily Watson',
      role: 'Digital Marketing Lead',
      company: 'GlobalBrand Inc.',
      content: 'The automation templates are incredible. What used to take our team 40 hours per week now happens automatically. Game-changer!',
      rating: 5,
      avatar: '/images/ai-robot-dashboard-charts-graphs-futuristic-technology.jpg'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto">
            Join thousands of marketers who have transformed their businesses with Atlas AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glow-card p-8 space-y-6">
              <div className="flex items-center gap-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="w-8 h-8 text-[#AA00FF] opacity-50 absolute -top-2 -left-2" />
                <p className="text-[#E0E0E0] leading-relaxed pl-6">
                  {testimonial.content}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00EEFF] to-[#AA00FF] flex items-center justify-center overflow-hidden">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-white font-semibold">${testimonial.name.charAt(0)}</span>`;
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-[#E0E0E0]">{testimonial.role}</p>
                  <p className="text-sm text-neon-green">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
