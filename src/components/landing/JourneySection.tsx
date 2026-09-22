import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Camera, Activity, GitMerge, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function JourneySection() {
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

  const stages = [
    {
      step: '01',
      action: 'Start',
      title: 'Create your profile',
      desc: 'Set up your private account and establish your initial wellness baseline.',
      icon: UserPlus,
      tag: 'Initial Setup',
    },
    {
      step: '02',
      action: 'Scan',
      title: 'Capture your face under guided conditions',
      desc: 'In-browser viewfinder ensures diffused light, centered framing, and sharp focus.',
      icon: Camera,
      tag: 'Objective Input',
    },
    {
      step: '03',
      action: 'Understand',
      title: 'Tell us about your Prakriti and lifestyle',
      desc: 'Input sleep habits, current climate, hydration, and constitutional tendencies.',
      icon: Activity,
      tag: 'Personal Context',
    },
    {
      step: '04',
      action: 'Analyze',
      title: 'AayurFace brings visual observations and personal context together',
      desc: 'Connects surface colorimetry and micro-texture with internal rhythms.',
      icon: GitMerge,
      tag: 'Multimodal Fusion',
    },
    {
      step: '05',
      action: 'Interpret',
      title: 'Relevant Ayurvedic knowledge adds context',
      desc: 'Classical Samhita principles provide structured medical context to the findings.',
      icon: BookOpen,
      tag: 'Classical Roots',
    },
    {
      step: '06',
      action: 'Guidance',
      title: 'Receive understandable, personalized wellness guidance',
      desc: 'Get transparent Dinacharya routines, botanical recipes, and safety advisories.',
      icon: Sparkles,
      tag: 'Actionable Steps',
    },
    {
      step: '07',
      action: 'Track',
      title: 'Return over time and observe your journey',
      desc: 'Log recurring observations every 30, 60, and 90 days to see equilibrium evolve.',
      icon: TrendingUp,
      tag: 'Longitudinal',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Product Experience Flow
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Your journey with AayurFace
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            From initial setup to long-term observation, here is exactly how AayurFace turns physical observation and personal context into grounded wellness guidance.
          </p>
        </motion.div>

        {/* The 7-Stage Horizontal/Vertical Visual Storytelling Flow */}
        <div className="relative">
          
          {/* Subtle Decorative Flow Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6DFD5] to-transparent pointer-events-none -translate-y-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#FAF8F5] border border-[#E6DFD5] p-6 rounded-sm hover:border-[#C5A059] transition-all flex flex-col justify-between group shadow-xs relative"
                >
                  <div>
                    {/* Top Row: Stage Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-display font-serif text-3xl font-semibold text-[#1E3A2F]/80 group-hover:text-[#C5A059] transition-colors">
                        {stage.step}
                      </span>
                      <div className="p-2.5 rounded-full bg-white border border-[#E6DFD5] text-[#1E3A2F] group-hover:bg-[#1E3A2F] group-hover:text-white transition-all">
                        <Icon size={16} />
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-2 font-semibold">
                      {stage.action} · {stage.tag}
                    </span>

                    <h3 className="font-display font-serif text-xl text-[#1A1F1C] mb-3 leading-snug font-medium">
                      {stage.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  {idx < stages.length - 1 && (
                    <div className="mt-5 pt-3 border-t border-[#E6DFD5]/60 flex items-center gap-1.5 text-[10px] font-mono text-[#8A948E]">
                      <span>Next Stage</span>
                      <ArrowRight size={11} className="text-[#C5A059]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Intermediate Restrained CTA - Prompt Section 7 requirement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF8F5] p-8 rounded-sm"
        >
          <div>
            <h4 className="font-display font-serif text-2xl text-[#1A1F1C] font-medium">
              Ready to explore your personal skin context?
            </h4>
            <p className="text-xs sm:text-sm text-[#5C6660] font-body mt-1">
              Private in your browser. No camera images are ever shared or used without consent.
            </p>
          </div>

          <Link
            to={ctaTarget}
            className="px-8 py-3.5 bg-[#1E3A2F] text-white text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#152B23] transition-all flex items-center gap-2 rounded-sm shadow-sm whitespace-nowrap group"
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C5A059]" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
