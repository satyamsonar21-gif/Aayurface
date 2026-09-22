import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-[#FAF8F5] pt-24 pb-16 overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#F3EFEA] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* HERO LEFT: Typography & Story */}
        <div className="lg:col-span-6 flex flex-col items-start pt-10 lg:pt-0 z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-8 h-[1px] bg-[#C5A059]" />
            <span className="text-[10px] font-body uppercase tracking-[0.25em] text-[#8A948E] font-semibold">
              Ayurvedic Wellness × Modern Observation
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#1A1F1C] mb-8"
          >
            See your skin <br/>
            <span className="italic text-[#1E3A2F]">with a deeper</span> <br/>
            perspective.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="text-lg text-[#5C6660] max-w-md font-body leading-relaxed mb-12"
          >
            AayurFace brings standardized visual observation together with personal context and classical Ayurvedic wellness principles.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              to={
                isAuthenticated
                  ? user?.onboarding_completed
                    ? '/dashboard'
                    : '/onboarding'
                  : '/register'
              }
              className="px-8 py-4 bg-[#1E3A2F] text-white text-[13px] uppercase tracking-[0.1em] font-semibold hover:bg-[#152B23] transition-colors w-full sm:w-auto text-center"
            >
              {isAuthenticated
                ? user?.onboarding_completed
                  ? 'Enter Dashboard'
                  : 'Continue Onboarding'
                : 'Begin Your Journey'}
            </Link>
            <a 
              href="#how-it-works"
              className="text-[13px] uppercase tracking-[0.1em] text-[#1E3A2F] font-semibold hover:text-[#C5A059] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-[#1E3A2F]/20 hover:after:bg-[#C5A059]"
            >
              Explore How It Works
            </a>
          </motion.div>
        </div>

        {/* HERO RIGHT: Art Directed Image */}
        <div className="lg:col-span-6 relative h-[600px] lg:h-[700px] w-full mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full overflow-hidden">
              <img 
                src="/images/landing/hero-portrait.jpg" 
                alt="Natural skin observation" 
                className="w-full h-full object-cover object-center image-scale-on-hover"
                loading="eager"
              />
              
              {/* Botanical Frame Element */}
              <div className="absolute top-0 right-0 w-[40%] h-[40%] opacity-20 pointer-events-none mix-blend-multiply">
                <img src="/images/landing/botanical-still-life.jpg" alt="" className="w-full h-full object-cover rounded-bl-full" />
              </div>

              {/* Technical Annotation */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 mix-blend-difference text-white/80">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase block">Diffused Daylight</span>
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase block">5200K · f/1.4</span>
              </div>

              {/* Minimal Frame Lines */}
              <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/50" />
              <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/50" />
              <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/50" />
              <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/50" />
            </div>
          </motion.div>

          {/* Overlapping Text Element for Depth */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/4 -left-12 lg:-left-24 rotate-[-90deg] origin-left hidden md:block z-30"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#1E3A2F]/60 whitespace-nowrap">
              Observation · Context · Guidance
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
