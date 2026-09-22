import PageTransition from '@/components/layout/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import PositioningStrip from '@/components/landing/PositioningStrip';
import WhySection from '@/components/landing/WhySection';
import JourneySection from '@/components/landing/JourneySection';
import ScanExperienceSection from '@/components/landing/ScanExperienceSection';
import AyurvedaTechSection from '@/components/landing/AyurvedaTechSection';
import ContextMattersSection from '@/components/landing/ContextMattersSection';
import ExplainabilitySection from '@/components/landing/ExplainabilitySection';
import PersonalizationSection from '@/components/landing/PersonalizationSection';
import ProgressSection from '@/components/landing/ProgressSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ResponsibleAISafetySection from '@/components/landing/ResponsibleAISafetySection';
import PhilosophySection from '@/components/landing/PhilosophySection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1F1C] font-body selection:bg-[#C5A059]/25 selection:text-[#1E3A2F] relative overflow-x-hidden">
        {/* 01. Refined Sticky / Floating Navigation */}
        <LandingNav />

        <main className="flex-1 flex flex-col relative z-10">
          {/* 02. Editorial Asymmetric Hero Section */}
          <HeroSection />

          {/* 03. Truthful Conceptual Positioning Strip */}
          <PositioningStrip />

          {/* 04. Why AayurFace: Beyond Surface Symptoms */}
          <WhySection />

          {/* 05. The Observation Journey: 4-Stage Timeline */}
          <JourneySection />

          {/* 06. Face Scan Experience Preview */}
          <ScanExperienceSection />

          {/* 07. Classical Principles & Modern Technology Bridge */}
          <AyurvedaTechSection />

          {/* 08. Context Matters: Radiating Lifestyle Pillars */}
          <ContextMattersSection />

          {/* 09. Explainable Wellness Intelligence (5-Stage Transparency) */}
          <ExplainabilitySection />

          {/* 10. Personalized Care: Your Wellness Rhythm */}
          <PersonalizationSection />

          {/* 11. Longitudinal Progress (90-Day Observation Milestones) */}
          <ProgressSection />

          {/* 12. How It Works: Concise 4-Step Walkthrough */}
          <HowItWorksSection />

          {/* 13. Responsible AI & Ethical Safety Boundaries */}
          <ResponsibleAISafetySection />

          {/* 14. Contemporary Ayurvedic Philosophy & Tenets */}
          <PhilosophySection />

          {/* 15. Final Closing CTA: Begin Your Skin Journey */}
          <FinalCTASection />
        </main>

        {/* 16. Multi-Column Minimal Editorial Footer */}
        <LandingFooter />
      </div>
    </PageTransition>
  );
}
