import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Eye, ShieldCheck, Clock, BookOpen, User } from 'lucide-react';

export default function BeyondTheSelfieSection() {
  return (
    <section id="beyond-selfie" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            The Core Differentiator
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Beyond the selfie. <br/>
            <span className="italic text-[#6B8E7D] font-normal">A deeper architecture of understanding.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Most digital wellness tools reduce a person's skin to a quick camera snapshot. AayurFace is built around a multimodal idea: visual observation becomes truly meaningful only when combined with constitutional and lived context.
          </p>
        </motion.div>

        {/* Visual Architecture Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Conventional Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 bg-white/70 border border-[#E6DFD5] p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5]">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A948E]">
                  Conventional Model
                </span>
                <span className="text-[10px] font-mono text-[#8A948E]">Single-Signal</span>
              </div>

              <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-4">
                Surface Snapshot
              </h3>
              <p className="text-sm text-[#5C6660] leading-relaxed mb-8">
                A single image taken under uncontrolled lighting is treated as the entire story, attempting to jump directly from surface appearance to a generic conclusion.
              </p>

              {/* Simplified Step Flow */}
              <div className="space-y-4">
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center gap-3">
                  <Eye size={16} className="text-[#8A948E]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1F1C]">
                    Single Image Capture
                  </span>
                </div>
                <div className="flex justify-center text-[#8A948E]">
                  <ArrowRight size={16} className="rotate-90 lg:rotate-0" />
                </div>
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center gap-3">
                  <Sparkles size={16} className="text-[#8A948E]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8A948E]">
                    Simplified Result
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6DFD5] text-[11px] font-body text-[#8A948E] italic">
              Context, constitution, and uncertainty remain invisible.
            </div>
          </motion.div>

          {/* Card 2: AayurFace Multimodal Paradigm */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 bg-[#FAF8F5] border-2 border-[#1E3A2F]/20 p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between shadow-xs"
          >
            {/* Subtle Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-[#C5A059]/10 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1E3A2F] font-semibold">
                    The AayurFace Multimodal Paradigm
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-semibold">
                  Evidence-Grounded
                </span>
              </div>

              <h3 className="font-editorial text-3xl sm:text-4xl text-[#1E3A2F] mb-4">
                Multimodal Synthesis &amp; Longitudinal Context
              </h3>
              <p className="text-sm sm:text-base text-[#5C6660] leading-relaxed max-w-2xl mb-8">
                We bring together physical observation with your constitutional profile, daily habits, and classical Ayurvedic knowledge. Uncertainty is acknowledged, reasoning is explained, and progress is observed over time.
              </p>

              {/* Multimodal Integrated Progression */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 bg-white border border-[#E6DFD5] flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">Input 01</span>
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-[#1E3A2F]" />
                    <span className="text-xs font-mono uppercase text-[#1A1F1C]">Standardized Observation</span>
                  </div>
                  <span className="text-[11px] text-[#5C6660] leading-tight">Controlled daylight &amp; centering</span>
                </div>

                <div className="p-3.5 bg-white border border-[#E6DFD5] flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">Input 02</span>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#1E3A2F]" />
                    <span className="text-xs font-mono uppercase text-[#1A1F1C]">Prakriti Context</span>
                  </div>
                  <span className="text-[11px] text-[#5C6660] leading-tight">Constitutional baseline intake</span>
                </div>

                <div className="p-3.5 bg-white border border-[#E6DFD5] flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">Input 03</span>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#1E3A2F]" />
                    <span className="text-xs font-mono uppercase text-[#1A1F1C]">Daily Lifestyle</span>
                  </div>
                  <span className="text-[11px] text-[#5C6660] leading-tight">Sleep rhythm &amp; season</span>
                </div>

                <div className="p-3.5 bg-white border border-[#E6DFD5] flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">Input 04</span>
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#1E3A2F]" />
                    <span className="text-xs font-mono uppercase text-[#1A1F1C]">Classical Sources</span>
                  </div>
                  <span className="text-[11px] text-[#5C6660] leading-tight">Charaka &amp; Sushruta grounding</span>
                </div>
              </div>

              {/* Synthesis Bar */}
              <div className="p-4 bg-[#1E3A2F] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Layers size={18} className="text-[#C5A059]" />
                  <span className="text-xs font-mono tracking-widest uppercase font-semibold">
                    Multimodal Interpretation ──► Calibrated Confidence ──► Explainable Guidance
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#C8B89A]">
                  <ShieldCheck size={14} />
                  <span>Longitudinal Reflection</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-[11px] font-mono text-[#5C6660]">
              <span>Grounded in classical Ayurvedic thinking</span>
              <span>Modern observation as an enabler</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
