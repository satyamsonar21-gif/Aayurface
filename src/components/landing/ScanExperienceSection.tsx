import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ScanExperienceSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section id="scan-experience" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 relative overflow-hidden border-t border-[#E6DFD5]">
      
      {/* Decorative center line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-[#E6DFD5]" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mb-20 relative z-10 pt-16"
        >
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.1] mb-6">
            A moment of <br/>
            <span className="italic text-[#6B8E7D]">calm observation.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            We use computer vision not to diagnose, but to understand. Before observation begins, the platform ensures perfect lighting and stillness—creating a consistent foundation for personalized Ayurvedic guidance.
          </p>
        </motion.div>

        {/* Conceptual UI Experience */}
        <div className="w-full max-w-5xl relative">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl mx-auto h-[500px] sm:h-[700px]"
          >
            <div className="w-full h-full p-2 border border-[#E6DFD5] bg-white">
              <div className="relative w-full h-full overflow-hidden grayscale-[10%]">
                <img 
                  src="/images/landing/scan-portrait.jpg" 
                  alt="Standardized observation" 
                  className="w-full h-full object-cover object-center image-scale-on-hover"
                  loading="lazy"
                />
                
                {/* Thin Framing Brackets */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[70%] border border-[#FFFFFF]/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[65%] border border-[#FFFFFF]/10" />

                {/* Conceptual Scanning Line */}
                <motion.div 
                  initial={{ top: '15%' }}
                  animate={{ top: '85%' }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "linear" }}
                  className="absolute left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                />

                {/* Technical Anchors inside frame */}
                <div className="absolute top-[20%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/80" />
                <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-white/80" />
                <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/80" />
                <div className="absolute bottom-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-white/80" />
              </div>
            </div>

            {/* Connecting Hairlines and Labels (Desktop) */}
            <div className="hidden lg:block absolute top-[25%] -left-32 flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] mb-1">Lighting</span>
              <span className="text-xs font-editorial italic text-[#5C6660]">Diffused · Balanced</span>
              <div className="absolute top-2 -right-8 w-8 h-[1px] bg-[#E6DFD5]" />
            </div>

            <div className="hidden lg:block absolute top-[50%] -right-32 flex flex-col items-start">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] mb-1">Centering</span>
              <span className="text-xs font-editorial italic text-[#5C6660]">Symmetrical Alignment</span>
              <div className="absolute top-2 -left-8 w-8 h-[1px] bg-[#E6DFD5]" />
            </div>

            <div className="hidden lg:block absolute bottom-[25%] -left-40 flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] mb-1">Readiness</span>
              <span className="text-xs font-editorial italic text-[#5C6660]">Motion Stable</span>
              <div className="absolute top-2 -right-16 w-16 h-[1px] bg-[#E6DFD5]" />
            </div>

            {/* Mobile Labels */}
            <div className="flex justify-center gap-6 mt-6 lg:hidden">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F]">Lighting</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F]">Centering</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F]">Readiness</span>
            </div>

          </motion.div>

          {/* Action CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mt-16"
          >
            <Link
              to={isAuthenticated ? (user?.onboarding_completed ? '/scan' : '/onboarding') : '/register'}
              className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#1E3A2F] hover:text-[#C5A059] transition-colors pb-1 border-b border-[#1E3A2F]/30 hover:border-[#C5A059]"
            >
              {isAuthenticated ? 'Open Observation Tool' : 'Experience Observation'}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
