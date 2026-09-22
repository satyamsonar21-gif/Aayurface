import PageTransition from '@/components/layout/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import WhatIsAayurFaceSection from '@/components/landing/WhatIsAayurFaceSection';
import PhilosophySection from '@/components/landing/PhilosophySection';
import BeyondTheSelfieSection from '@/components/landing/BeyondTheSelfieSection';
import JourneySection from '@/components/landing/JourneySection';
import ScanExperienceSection from '@/components/landing/ScanExperienceSection';
import KnowledgeEngineSection from '@/components/landing/KnowledgeEngineSection';
import ConstitutionalSystemSection from '@/components/landing/ConstitutionalSystemSection';
import MultimodalFusionSection from '@/components/landing/MultimodalFusionSection';
import ConfidenceAwareSection from '@/components/landing/ConfidenceAwareSection';
import ExplainabilitySection from '@/components/landing/ExplainabilitySection';
import ProductPreviewSection from '@/components/landing/ProductPreviewSection';
import PersonalizationSection from '@/components/landing/PersonalizationSection';
import ProgressSection from '@/components/landing/ProgressSection';
import ResearchValidationSection from '@/components/landing/ResearchValidationSection';
import ResponsibleDevelopmentSection from '@/components/landing/ResponsibleDevelopmentSection';
import PrivacyTrustSection from '@/components/landing/PrivacyTrustSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import LandingFooter from '@/components/landing/LandingFooter';

// Graceful safeguard for test and headless environments (e.g., jsdom)
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1F1C] font-body selection:bg-[#C5A059]/25 selection:text-[#1E3A2F] relative overflow-x-hidden">
        {/* 01. Navigation Bar */}
        <LandingNav />

        <main className="flex-1 flex flex-col relative z-10">
          {/* 02. Hero: "Your skin is visible. Your context is not." + Start Skin Analysis */}
          <HeroSection />

          {/* 03. What is AayurFace? Simple 6-step visual flow (<15 sec comprehension) */}
          <WhatIsAayurFaceSection />

          {/* 04. Philosophy: "A face can show you something. It cannot tell you everything." */}
          <PhilosophySection />

          {/* 05. Beyond the Selfie: 4 Signals (Visual, Prakriti, Lifestyle, Ayurvedic Knowledge) */}
          <BeyondTheSelfieSection />

          {/* 06. Your AayurFace Journey: 7-stage visual storytelling flow */}
          <JourneySection />

          {/* 07. Standardized Capture: "Better input. More meaningful observation." */}
          <ScanExperienceSection />

          {/* 08. Ayurvedic Intelligence: "Knowledge with roots." + Botanical Ingredients Still-Life */}
          <KnowledgeEngineSection />

          {/* 09. Prakriti / Tridosha: "Prakriti is personal." + Non-Deterministic Principle */}
          <ConstitutionalSystemSection />

          {/* 10. Multimodal Intelligence: "Intelligence that knows context matters." */}
          <MultimodalFusionSection />

          {/* 11. Confidence & Uncertainty: "Good intelligence knows when signals disagree." */}
          <ConfidenceAwareSection />

          {/* 12. Explainability: "Don't just give an answer. Show the reasoning." */}
          <ExplainabilitySection />

          {/* 13. Real Product Preview: "What your AayurFace experience looks like." */}
          <ProductPreviewSection />

          {/* 14. Personalized Wellness: Dinacharya circadian rhythms & patch-test protocol */}
          <PersonalizationSection />

          {/* 15. Longitudinal Journey: "Skin wellness is a journey, not a snapshot." (Day 01–90) */}
          <ProgressSection />

          {/* 16. Research & Trust: "Built with a research mindset." (Current vs Roadmap) */}
          <ResearchValidationSection />

          {/* 17. Indian-Skin Representation & Responsible Development */}
          <ResponsibleDevelopmentSection />

          {/* 18. Privacy & Data Ethics: "Your face is personal." */}
          <PrivacyTrustSection />

          {/* 19. Frequently Asked Questions */}
          <FAQSection />

          {/* 20. Final Call to Action: "Begin with what you can see." + Start Skin Analysis */}
          <FinalCTASection />
        </main>

        {/* 21. Multi-Column Editorial Footer */}
        <LandingFooter />
      </div>
    </PageTransition>
  );
}
