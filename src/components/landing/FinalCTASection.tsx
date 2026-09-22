import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FinalCTASection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="w-full bg-[#1E3A2F] text-white py-24 sm:py-32 px-6 sm:px-10 relative overflow-hidden">
      {/* Subtle Background Glow & Radial Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#12392F] blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#C5A059] text-xs font-mono uppercase tracking-[0.2em]">
          <Sparkles size={13} />
          <span>TIMELESS AYURVEDIC INTELLIGENCE</span>
        </div>

        {/* Headline — Includes "Begin Your Skin Journey" for test contract */}
        <div className="space-y-3">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.10] text-white tracking-tight">
            Begin Your Skin Journey.
          </h2>
          <p className="font-display text-2xl sm:text-3xl text-[#C5A059] italic font-normal">
            A more thoughtful way of observing your skin.
          </p>
        </div>

        {/* Narrative Description */}
        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto font-normal leading-relaxed">
          Start with a simple standardized observation and build a clearer understanding of your constitutional rhythm. Grounded in classical Ayurveda, private in your browser.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={
              isAuthenticated
                ? user?.onboarding_completed
                  ? '/dashboard'
                  : '/onboarding'
                : '/register'
            }
            className="w-full sm:w-auto bg-[#C5A059] text-[#1E3A2F] font-body font-semibold px-9 py-4 rounded-md hover:bg-[#C5A059]/90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>
              {isAuthenticated
                ? user?.onboarding_completed
                  ? 'Enter Dashboard'
                  : 'Continue Onboarding'
                : 'Begin Your Journey'}
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-md font-body font-medium transition-colors text-center"
          >
            Explore Methodology
          </a>
        </div>
      </div>
    </section>
  );
}
