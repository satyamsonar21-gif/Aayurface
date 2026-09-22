import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FinalCTASection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="w-full bg-[#121513] text-[#FAF8F5] py-28 sm:py-36 px-6 sm:px-10 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-[#1E3A2F]/40 to-transparent blur-3xl" />
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
          
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] mb-6">
            Contemporary Ayurvedic Skin Intelligence
          </span>
          
          <h2 className="font-editorial text-5xl sm:text-6xl md:text-7xl text-[#FAF8F5] leading-[1.08] mb-6">
            Begin Your Skin Journey.
          </h2>
          
          <p className="font-editorial text-2xl sm:text-3xl text-[#8A948E] italic mb-8">
            Start with your story, your context, and your skin.
          </p>

          <p className="text-sm sm:text-base text-[#8A948E] font-body max-w-xl mx-auto leading-relaxed mb-12">
            Bring standardized visual observation together with personal constitutional context and timeless Ayurvedic wisdom. Private in your browser, explainable at every step.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md">
            <Link
              to={
                isAuthenticated
                  ? user?.onboarding_completed
                    ? '/dashboard'
                    : '/onboarding'
                  : '/register'
              }
              className="w-full sm:w-auto bg-[#1E3A2F] text-white border border-[#C5A059]/40 hover:bg-[#152B23] px-8 py-4 text-xs font-mono uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-colors group shadow-md"
            >
              <span>
                {isAuthenticated
                  ? user?.onboarding_completed
                    ? 'Enter Dashboard'
                    : 'Continue Onboarding'
                  : 'Begin Your Wellness Journey'}
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <a
              href="#philosophy"
              className="w-full sm:w-auto text-[#FAF8F5]/80 hover:text-white px-6 py-4 border border-[#FAF8F5]/20 hover:border-[#C5A059] text-xs font-mono uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
            >
              <Compass size={14} className="text-[#C5A059]" />
              <span>Return to Philosophy</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
