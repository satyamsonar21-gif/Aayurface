import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FinalCTASection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="w-full bg-[#121513] text-[#FAF8F5] py-32 sm:py-40 px-6 sm:px-10 relative overflow-hidden">
      
      {/* Immersive Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#121513] z-10 opacity-70" />
        <img 
          src="/images/landing/wellness-lifestyle.jpg" 
          className="w-full h-full object-cover grayscale-[30%] opacity-20"
          alt="Atmospheric background" 
          loading="lazy"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#1E3A2F]/40 to-transparent blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Minimalist Top Ornament */}
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#C5A059] mb-8" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] mb-6">
            Timeless Ayurvedic Intelligence
          </span>
          
          <h2 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF8F5] leading-[1.05] mb-6 tracking-tight">
            Begin Your Skin Journey.
          </h2>
          
          <p className="font-editorial text-2xl sm:text-3xl text-[#8A948E] italic mb-10">
            A more thoughtful way of observing your skin.
          </p>

          <p className="text-base sm:text-lg text-[#8A948E] font-body max-w-xl mx-auto leading-relaxed mb-12">
            Start with a simple standardized observation and build a clearer understanding of your constitutional rhythm. Grounded in classical Ayurveda, private in your browser.
          </p>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md">
            <Link
              to={
                isAuthenticated
                  ? user?.onboarding_completed
                    ? '/dashboard'
                    : '/onboarding'
                  : '/register'
              }
              className="group relative w-full sm:w-auto bg-[#C5A059] text-[#121513] font-mono text-xs uppercase tracking-widest font-bold px-8 py-5 flex items-center justify-center gap-4 overflow-hidden transition-all hover:bg-[#d4b475]"
            >
              <span className="relative z-10">
                {isAuthenticated
                  ? user?.onboarding_completed
                    ? 'Enter Dashboard'
                    : 'Continue Onboarding'
                  : 'Begin Your Journey'}
              </span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-[#FAF8F5] font-mono text-xs uppercase tracking-widest border-b border-transparent hover:border-[#FAF8F5] pb-1 transition-all"
            >
              Explore Methodology
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
