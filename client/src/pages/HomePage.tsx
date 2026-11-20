import { Seo } from '@/components/common/Seo';
import { heroContent } from '@/content/home';
import { CapabilitiesSection } from '@/sections/home/CapabilitiesSection';
import { ContactSection } from '@/sections/home/ContactSection';
import { DifferenceSection } from '@/sections/home/DifferenceSection';
import { HeroSection } from '@/sections/home/HeroSection';
import { IndustriesSection } from '@/sections/home/IndustriesSection';
import { InsightsSection } from '@/sections/home/InsightsSection';
import { PhilosophySection } from '@/sections/home/PhilosophySection';

export default function HomePage() {
  return (
    <>
      <Seo description={heroContent.description} />
      <HeroSection />
      <PhilosophySection />
      <CapabilitiesSection />
      <DifferenceSection />
      <IndustriesSection />
      <InsightsSection />
      <ContactSection />
    </>
  );
}
