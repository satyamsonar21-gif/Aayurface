import PageTransition from '@/components/layout/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import PositioningStrip from '@/components/landing/PositioningStrip';
import BeyondTheSelfieSection from '@/components/landing/BeyondTheSelfieSection';
import ConstitutionalSystemSection from '@/components/landing/ConstitutionalSystemSection';
import MultimodalSignalSection from '@/components/landing/MultimodalSignalSection';
import ScanExperienceSection from '@/components/landing/ScanExperienceSection';
import ComputerVisionSection from '@/components/landing/ComputerVisionSection';
import KnowledgeEngineSection from '@/components/landing/KnowledgeEngineSection';
import MultimodalFusionSection from '@/components/landing/MultimodalFusionSection';
import ConfidenceAwareSection from '@/components/landing/ConfidenceAwareSection';
import ExplainabilitySection from '@/components/landing/ExplainabilitySection';
import PersonalizationSection from '@/components/landing/PersonalizationSection';
import ProgressSection from '@/components/landing/ProgressSection';
import ResearchValidationSection from '@/components/landing/ResearchValidationSection';
import ResponsibleAISafetySection from '@/components/landing/ResponsibleAISafetySection';
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
        {/* Navigation Bar */}
        <LandingNav />

        <main className="flex-1 flex flex-col relative z-10">
          {/* 01. Hero: Editorial statement & 4 converging signals */}
          <HeroSection />

          {/* 02. Philosophy: "Skin is visible. Context is not." */}
          <PositioningStrip />

          {/* 03. Beyond the Selfie: Conventional snapshot vs AayurFace multimodal paradigm */}
          <BeyondTheSelfieSection />

          {/* 04. Prakriti & Tridosha: Whole-person Ayurvedic context (respectful & non-deterministic) */}
          <ConstitutionalSystemSection />

          {/* 05. The Face Is One Signal: Central portrait with radiating contextual pillars */}
          <MultimodalSignalSection />

          {/* 06. Standardized Capture: "Better input. More meaningful observation." */}
          <ScanExperienceSection />

          {/* 07. Seeing the Details: Structured visual observation & colorimetric decoupling */}
          <ComputerVisionSection />

          {/* 08. Knowledge Should Have Roots: Classical Ayurvedic Samhitas grounding */}
          <KnowledgeEngineSection />

          {/* 09. Multimodal Intelligence: Evidence convergence and reasoning synthesis */}
          <MultimodalFusionSection />

          {/* 10. Confidence: High agreement vs signal divergence and honest uncertainty */}
          <ConfidenceAwareSection />

          {/* 11. Explainable AI: 5-stage transparent reasoning chain */}
          <ExplainabilitySection />

          {/* 12. Personalized Care: Contextual Dinacharya daily rhythms & botanicals */}
          <PersonalizationSection />

          {/* 13. Longitudinal Journey: Baseline ──► Observe ──► Compare ──► Reflect */}
          <ProgressSection />

          {/* 14. Research Direction: Current Capabilities vs Active Research Roadmap */}
          <ResearchValidationSection />

          {/* 15. Responsible AI: "Technology should know its limits." */}
          <ResponsibleAISafetySection />

          {/* 16. Final Closing CTA: Begin Your AayurFace Journey */}
          <FinalCTASection />
        </main>

        {/* Multi-Column Editorial Footer */}
        <LandingFooter />
      </div>
    </PageTransition>
  );
}
