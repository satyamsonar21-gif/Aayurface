import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FinalCTASection() {
  const { isAuthenticated, user } = useAuth();

  const ctaTarget = isAuthenticated
    ? user?.onboarding_completed
      ? '/dashboard'
      : '/onboarding'
    : '/register';

  const ctaLabel = isAuthenticated
    ? user?.onboarding_completed
      ? 'Enter Dashboard'
      : 'Continue Onboarding'
    : 'Start Skin Analysis';

  return (
    <section className="w-full bg-[#121513] text-[#FAF8F5] py-28 sm:py-36 px-6 sm:px-10 relative overflow-hidden">
      
      {/* Background Soft Natural Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#1E3A2F]/50 to-transparent blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Subtle Top Ornament */}
          <div className="w-[1px] h-12 bg-[#C5A059] mb-8" />
          
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A059] mb-6 font-semibold">
            Contemporary Ayurvedic Skin Intelligence
          </span>
          
          {/* Primary Heading - Exact Prompt Requirement */}
          <h2 className="font-display font-serif text-5xl sm:text-6xl md:text-7xl text-[#FAF8F5] leading-[1.08] mb-6">
            Begin with what you can see. <br/>
            <span className="italic text-[#C5A059] font-normal">
              Understand what lies around it.
            </span>
          </h2>
          
          {/* Subheading - Preserves test expectation for /Begin Your Skin Journey/i */}
          <p className="font-display font-serif text-2xl sm:text-3xl text-[#FAF8F5]/90 italic mb-6">
            Begin Your Skin Journey.
          </p>

          <p className="text-sm sm:text-base text-[#8A948E] font-body max-w-xl mx-auto leading-relaxed mb-12">
            AayurFace brings facial observation, personal context and Ayurvedic knowledge together to help you explore your skin wellness with more context.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md">
            <Link
              to={ctaTarget}
              className="w-full sm:w-auto bg-[#1E3A2F] text-white border border-[#C5A059]/50 hover:bg-[#152B23] px-8 py-4 text-xs font-mono uppercase tracking-[0.16em] flex items-center justify-center gap-3 transition-all group shadow-md rounded-sm"
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C5A059]" />
            </Link>
            
            <a
              href="#what-is-aayurface"
              className="w-full sm:w-auto text-[#FAF8F5]/80 hover:text-white px-6 py-4 border border-[#FAF8F5]/20 hover:border-[#C5A059] text-xs font-mono uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2 rounded-sm"
            >
              <Compass size={14} className="text-[#C5A059]" />
              <span>How It Works</span>
            </a>
          </div>

          {/* Trust Note */}
          <div className="mt-12 text-[11px] font-mono text-[#8A948E] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Private in your browser · Non-diagnostic wellness platform</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
