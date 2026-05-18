import CinematicHero from "@/components/sections/CinematicHero";
import BrandStory from "@/components/sections/BrandStory";
import BestsellersSection from "@/components/sections/Bestsellers";
import MaterialsShowcase from "@/components/sections/MaterialsShowcase";
import HowItWorks from "@/components/sections/HowItWorks";
import ContactSection from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <div id="hero">
        <CinematicHero />
      </div>
      <div id="story">
        <BrandStory />
      </div>
      <div id="bestsellers">
        <BestsellersSection />
      </div>
      <div id="materials">
        <MaterialsShowcase />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </>
  );
}