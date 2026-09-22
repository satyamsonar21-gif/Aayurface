import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative w-full min-h-[92vh] flex items-center bg-[#FAF8F5] pt-20 pb-16 lg:py-24 overflow-hidden">
      {/* Background Soft Linen & Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-[#F2EEE6]/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F3EFEA]/80 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* HERO LEFT: Editorial Headline & Narrative */}
        <div className="lg:col-span-6 flex flex-col items-start pt-6 lg:pt-0 z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-[1px] bg-[#C5A059]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6B8E7D] font-semibold">
              Ancient Wisdom × Modern Observation
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#1A1F1C] mb-8"
          >
            Your skin is part of <br />
            the story. <br />
            <span className="italic text-[#1E3A2F] font-normal">
              Ayurveda helps us look deeper.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#5C6660] max-w-xl font-body leading-relaxed mb-10"
          >
            A person’s visible skin is only one source of information. AayurFace unites standardized visual observation with personal constitutional context (Prakriti), daily lifestyle rhythms, and validated Ayurvedic knowledge—creating calm, explainable wellness insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to={
                isAuthenticated
                  ? user?.onboarding_completed
                    ? '/dashboard'
                    : '/onboarding'
                  : '/register'
              }
              className="px-8 py-4 bg-[#1E3A2F] text-white text-[13px] uppercase tracking-[0.12em] font-medium hover:bg-[#152B23] transition-all flex items-center justify-center gap-3 group shadow-xs"
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
              href="#beyond-selfie"
              className="px-6 py-4 border border-[#E6DFD5] hover:border-[#C5A059] text-[#1E3A2F] text-[13px] uppercase tracking-[0.12em] font-medium transition-colors text-center bg-white/70 backdrop-blur-xs flex items-center justify-center gap-2"
            >
              <Compass size={14} className="text-[#C5A059]" />
              <span>Explore The Approach</span>
            </a>
          </motion.div>

          {/* Calming Trust Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 flex items-center gap-6 text-[11px] font-mono text-[#8A948E]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7D]" />
              Non-Diagnostic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              Grounded in Classical Samhitas
            </span>
          </motion.div>
        </div>

        {/* HERO RIGHT: Art-Directed Composition (Face + Prakriti + Lifestyle + Knowledge) */}
        <div className="lg:col-span-6 relative w-full mt-4 lg:mt-0 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg lg:max-w-none aspect-[4/5] sm:h-[620px]"
          >
            {/* Visual Frame */}
            <div className="relative w-full h-full p-3 bg-white border border-[#E6DFD5] shadow-sm overflow-hidden">
              <img 
                src="/images/landing/hero-portrait.jpg" 
                alt="Natural human skin observation" 
                className="w-full h-full object-cover object-center image-scale-on-hover"
                loading="eager"
              />

              {/* Botanical Texture Whisper */}
              <div className="absolute -bottom-8 -right-8 w-44 h-44 opacity-25 pointer-events-none mix-blend-multiply overflow-hidden rounded-full border border-[#C5A059]/40">
                <img 
                  src="/images/landing/botanical-still-life.jpg" 
                  alt="" 
                  className="w-full h-full object-cover grayscale-[20%]" 
                />
              </div>

              {/* Classical Ayurvedic Knowledge Fragment (Sushruta Samhita 15.41 citation) */}
              <div className="absolute top-6 left-6 max-w-[210px] bg-[#FAF8F5]/92 backdrop-blur-md p-3.5 border border-[#E6DFD5] shadow-xs">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                  Sushruta Samhita 15.41
                </span>
                <p className="font-editorial italic text-xs leading-snug text-[#1E3A2F]">
                  "समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥"
                </p>
                <span className="text-[9px] font-body text-[#5C6660] block mt-1">
                  True health is equilibrium of doshas, vitality, and mind.
                </span>
              </div>

              {/* Central Convergence Nodes: 4 Signals converging toward the person */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-2 bg-[#FAF8F5]/95 backdrop-blur-md p-3 border border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase">
                    Visual Observation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7D]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase">
                    Constitutional Context
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase">
                    Daily Lifestyle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A6F61]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase">
                    Ayurvedic Knowledge
                  </span>
                </div>
              </div>

              {/* Minimalist Alignment Hairlines */}
              <div className="absolute top-4 right-4 w-3 h-[1px] bg-white/70" />
              <div className="absolute top-4 right-4 w-[1px] h-3 bg-white/70" />
            </div>

            {/* Anchoring Statement */}
            <div className="absolute -bottom-5 right-4 bg-[#1E3A2F] text-[#FAF8F5] px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase shadow-md hidden sm:block">
              The face is never viewed in isolation
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
