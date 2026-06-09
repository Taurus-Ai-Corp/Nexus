import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Statistics } from '../components/Statistics';
import { Testimonials } from '../components/Testimonials';
import { AITemplates } from '../components/AITemplates';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export const Homepage: React.FC = () => {
  return (
    <main className="relative">
      <Hero />
      <Features />
      <Statistics />
      <Testimonials />
      <AITemplates />
      <FinalCTA />
      <Footer />
    </main>
  );
};
