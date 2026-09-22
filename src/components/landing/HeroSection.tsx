import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroSection() {
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
    <section className="relative w-full min-h-[92vh] flex items-center bg-[#FAF8F5] pt-20 pb-16 lg:py-24 overflow-hidden border-b border-[#E6DFD5]/60">
      {/* Background Soft Linen & Natural Lighting Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-[#F2EEE6]/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F3EFEA]/80 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* HERO LEFT: Editorial Headline & Narrative */}
        <div className="lg:col-span-6 flex flex-col items-start pt-6 lg:pt-0 z-20">
          
          {/* Eyebrow & Brand Category */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6 flex-wrap"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#C5A059] font-semibold">
              AayurFace
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6B8E7D] font-medium">
              Ancient Wisdom × Modern Observation
            </span>
          </motion.div>

          {/* PRIMARY HEADLINE - EXACT REQUIRED TEXT */}
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#1A1F1C] mb-7"
          >
            Your skin is visible. <br />
            <span className="italic text-[#1E3A2F] font-normal">
              Your context is not.
            </span>
          </motion.h1>

          {/* SUPPORTING PARAGRAPH - CLEAR, HUMAN, RESTRAINED */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#5C6660] max-w-xl font-body leading-relaxed mb-10"
          >
            AayurFace combines facial observation, Ayurvedic knowledge, your Prakriti and everyday lifestyle to help you understand your skin in a more personal way.
          </motion.p>

          {/* CTAS: PRIMARY VISUALLY DOMINATES SECONDARY */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            {/* PRIMARY CTA - DOMINANT */}
            <Link
              to={ctaTarget}
              className="px-8 py-4 bg-[#1E3A2F] text-white text-[13px] uppercase tracking-[0.14em] font-semibold hover:bg-[#152B23] transition-all flex items-center justify-center gap-3 group shadow-md hover:shadow-lg rounded-sm"
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-[#C5A059]" />
            </Link>
            
            {/* SECONDARY CTA */}
            <a 
              href="#how-it-works"
              className="px-6 py-4 border border-[#E6DFD5] hover:border-[#C5A059] text-[#1E3A2F] text-[13px] uppercase tracking-[0.12em] font-medium transition-colors text-center bg-white/70 backdrop-blur-xs flex items-center justify-center gap-2 rounded-sm"
            >
              <Compass size={14} className="text-[#C5A059]" />
              <span>How AayurFace Works</span>
            </a>
          </motion.div>

          {/* Calming Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 text-[11px] font-mono text-[#7A8580]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7D]" />
              Non-Diagnostic Wellness
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#C5A059]" />
              In-Browser Edge Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              Sushruta &amp; Charaka Roots
            </span>
          </motion.div>

        </div>

        {/* HERO RIGHT: Editorial Sculptural Composition (NO WOMEN / NO MODELS) */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg lg:max-w-none aspect-[4/5] sm:h-[600px]"
          >
            {/* Museum-Grade Visual Frame: Abstract Sculptural Facial Form */}
            <div className="relative w-full h-full p-3 bg-white border border-[#E6DFD5] shadow-sm overflow-hidden">
              <img 
                src="/images/landing/abstract-facial-geometry.jpg" 
                alt="Neutral non-gendered sculptural facial geometry representing human facial topography" 
                className="w-full h-full object-cover object-center image-scale-on-hover"
                loading="eager"
              />

              {/* Natural Skin Micro-Texture Overlay Badge */}
              <div className="absolute top-6 right-6 w-28 h-28 border border-[#E6DFD5] p-1 bg-white/90 backdrop-blur-md shadow-sm overflow-hidden hidden sm:block">
                <img 
                  src="/images/landing/healthy-skin-macro.jpg" 
                  alt="Micro-relief of healthy natural skin barrier" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-1 left-1 right-1 bg-[#1E3A2F]/90 text-[8px] font-mono text-white text-center py-0.5 uppercase tracking-wider">
                  Skin Macro
                </div>
              </div>

              {/* Classical Ayurvedic Knowledge Fragment (Sushruta Samhita 15.41 citation) */}
              <div className="absolute top-6 left-6 max-w-[220px] bg-[#FAF8F5]/95 backdrop-blur-md p-3.5 border border-[#E6DFD5] shadow-xs">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block mb-1 font-semibold">
                  Sushruta Samhita 15.41
                </span>
                <p className="font-display font-serif italic text-xs leading-snug text-[#1E3A2F]">
                  "समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥"
                </p>
                <span className="text-[9px] font-body text-[#5C6660] block mt-1">
                  True health is equilibrium of doshas, vitality, and mind.
                </span>
              </div>

              {/* Central Convergence Nodes: 4 Signals converging toward the person */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-2 bg-[#FAF8F5]/95 backdrop-blur-md p-3.5 border border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase font-medium">
                    Visual Observation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6B8E7D]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase font-medium">
                    Constitutional Prakriti
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase font-medium">
                    Everyday Lifestyle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#152B23]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#1A1F1C] uppercase font-medium">
                    Ayurvedic Knowledge
                  </span>
                </div>
              </div>

              {/* Minimalist Alignment Reticles */}
              <div className="absolute top-4 right-4 w-3 h-[1px] bg-white/70" />
              <div className="absolute top-4 right-4 w-[1px] h-3 bg-white/70" />
            </div>

            {/* Anchoring Statement */}
            <div className="absolute -bottom-5 right-4 bg-[#1E3A2F] text-[#FAF8F5] px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase shadow-md hidden sm:block">
              The face is one signal · Not the entire person
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
