import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Background Ambience / Subtle Botanical Texture */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C5A059]/5 blur-3xl pointer-events-none -z-10" />

      {/* HERO LEFT: Editorial Messaging & Anchors */}
      <motion.div
        className="lg:col-span-7 flex flex-col items-start space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] shadow-xs">
          <Sparkles size={13} className="text-[#C5A059]" />
          <span className="text-[11px] sm:text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            Ayurvedic Skin Wellness × Computer Vision
          </span>
        </motion.div>

        {/* Large Editorial Headline */}
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[70px] leading-[1.06] font-semibold text-[#1A1F1C] tracking-tight"
        >
          Ancient Wisdom.<br />
          <span className="italic font-normal text-[#1E3A2F]">Modern Intelligence.</span>
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg lg:text-xl text-[#5C6660] max-w-2xl leading-relaxed font-normal"
        >
          See your skin with a deeper perspective. AayurFace combines standardized facial observation, classical Ayurvedic constitutional wisdom, and personal lifestyle context into calm, explainable wellness guidance.
        </motion.p>

        {/* Primary & Secondary Action CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
        >
          <Link
            to={
              isAuthenticated
                ? user?.onboarding_completed
                  ? '/dashboard'
                  : '/onboarding'
                : '/register'
            }
            className="bg-[#1E3A2F] text-white px-8 py-4 rounded-md text-sm sm:text-base font-medium hover:bg-[#152B23] transition-all shadow-sm text-center flex items-center justify-center gap-2.5 cursor-pointer group"
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
            className="px-8 py-4 rounded-md border border-[#1E3A2F]/30 bg-transparent text-[#1E3A2F] hover:bg-[#1E3A2F]/5 transition-colors text-sm sm:text-base font-medium text-center"
          >
            Explore Methodology
          </a>
        </motion.div>

        {/* Value Indicators: Clean horizontal row, thin hairlines */}
        <motion.div
          variants={fadeInUp}
          className="pt-8 border-t border-[#E6DFD5] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 w-full text-left"
        >
          <div className="sm:pr-4 sm:border-r border-[#E6DFD5] space-y-1">
            <p className="font-display text-2xl font-semibold text-[#1E3A2F]">3 Doshas</p>
            <p className="text-xs text-[#8A948E] font-medium tracking-wide">Vata · Pitta · Kapha</p>
          </div>
          <div className="sm:px-4 sm:border-r border-[#E6DFD5] space-y-1">
            <p className="font-display text-2xl font-semibold text-[#1E3A2F]">Evidence-Aware</p>
            <p className="text-xs text-[#8A948E] font-medium tracking-wide">Transparent AI Reasoning</p>
          </div>
          <div className="sm:pl-4 space-y-1">
            <p className="font-display text-2xl font-semibold text-[#1E3A2F]">Non-Clinical</p>
            <p className="text-xs text-[#8A948E] font-medium tracking-wide">Wellness, Not Diagnosis</p>
          </div>
        </motion.div>
      </motion.div>

      {/* HERO RIGHT: Art-Directed Editorial Portrait with Subtle Annotations */}
      <motion.div
        className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-5"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-md group">
          {/* Authentic South Asian Portrait */}
          <img
            src="/images/landing/hero-portrait.jpg"
            alt="Authentic South Asian woman with radiant, natural skin under soft warm daylight"
            className="w-full h-[460px] sm:h-[520px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
            loading="eager"
          />

          {/* Delicate Observation Overlays (Subtle, non-HUD) */}
          <div className="absolute top-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#E6DFD5] text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] shadow-xs">
            [ STANDARDIZED APERTURE · 1.0 ]
          </div>

          <div className="absolute bottom-4 left-4 bg-[#1E3A2F]/85 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#F2EEE6] shadow-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span>DAYLIGHT DIFFUSION · 5200K</span>
          </div>

          {/* Delicate Hairline Corner Marks */}
          <div className="absolute top-3 left-3 text-[#1E3A2F]/30 font-mono text-[10px] leading-none select-none">
            +
          </div>
          <div className="absolute bottom-3 right-3 text-[#1E3A2F]/30 font-mono text-[10px] leading-none select-none">
            +
          </div>
        </div>

        {/* Editorial Quote */}
        <div className="w-full max-w-md pt-2 px-1 text-left space-y-2">
          <blockquote className="font-display text-xl sm:text-2xl italic font-normal text-[#1E3A2F] leading-snug">
            &ldquo;When skin speaks, Ayurveda listens.&rdquo;
          </blockquote>
          <div className="w-14 h-[1px] bg-[#C5A059]" />
          <p className="text-[11px] font-body uppercase tracking-widest text-[#8A948E] font-medium">
            Classical Dinacharya Principle
          </p>
        </div>
      </motion.div>
    </section>
  );
}
