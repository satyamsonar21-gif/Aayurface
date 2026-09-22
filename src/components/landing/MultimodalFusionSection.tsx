import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, User, Clock, BookOpen, Layers, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function MultimodalFusionSection() {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const inputs = [
    { name: 'Face Observation', icon: Eye, desc: 'Objective surface colorimetry & micro-texture' },
    { name: 'Personal Prakriti', icon: User, desc: 'Inherent physical constitution & tendencies' },
    { name: 'Daily Lifestyle', icon: Clock, desc: 'Sleep duration, circadian rhythm & local climate' },
    { name: 'Classical Ayurveda', icon: BookOpen, desc: 'Grounded Samhita principles & botanical wisdom' },
  ];

  return (
    <section id="methodology" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
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
            Multimodal Intelligence
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Intelligence that knows context matters.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            AayurFace connects multiple streams of evidence before generating insights. When visual observations align with personal habits and classical guidelines, guidance becomes truly personalized.
          </p>
        </motion.div>

        {/* Visual Multimodal Flow Diagram */}
        <div className="max-w-5xl mx-auto mb-16">
          
          {/* Top: 4 Input Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {inputs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="p-5 bg-white border border-[#E6DFD5] rounded-sm text-center shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center mx-auto mb-3 text-[#1E3A2F]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#5C6660] font-body">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Convergence Funnel */}
          <div className="flex justify-center my-4 text-[#C5A059]">
            <span className="text-2xl font-bold font-mono">↓</span>
          </div>

          {/* Center Stage: Multimodal Interpretation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-[#1E3A2F] text-white rounded-sm border border-[#C5A059]/50 shadow-md text-center max-w-2xl mx-auto mb-6"
          >
            <div className="inline-flex p-3 rounded-full bg-white/10 text-[#C5A059] mb-4">
              <Layers size={24} />
            </div>
            <h3 className="font-display font-serif text-2xl sm:text-3xl font-medium mb-2">
              Multimodal Interpretation
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-body leading-relaxed max-w-lg mx-auto">
              Cross-references surface observations with internal circadian rhythms, constitutional baselines, and classical Ayurvedic knowledge.
            </p>
          </motion.div>

          {/* Output Stages: Confidence & Explainable Guidance */}
          <div className="flex justify-center my-4 text-[#C5A059]">
            <span className="text-2xl font-bold font-mono">↓</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-white border border-[#E6DFD5] rounded-sm text-center shadow-xs">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-50 text-emerald-700 mb-3 border border-emerald-200">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="font-display font-serif text-xl text-[#1A1F1C] font-medium mb-1">
                Calibrated Confidence
              </h4>
              <p className="text-xs text-[#5C6660] font-body">
                Evaluates signal agreement and honestly communicates when inputs diverge.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E6DFD5] rounded-sm text-center shadow-xs">
              <div className="inline-flex p-2.5 rounded-full bg-amber-50 text-amber-700 mb-3 border border-amber-200">
                <Sparkles size={20} />
              </div>
              <h4 className="font-display font-serif text-xl text-[#1A1F1C] font-medium mb-1">
                Explainable Guidance
              </h4>
              <p className="text-xs text-[#5C6660] font-body">
                Translates findings into daily Dinacharya rituals and transparent reasoning steps.
              </p>
            </div>
          </div>

        </div>

        {/* Level 3 Progressive Disclosure Drawer */}
        <div className="w-full max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-3.5 px-6 border border-[#E6DFD5] bg-white hover:bg-[#F3EFEA] text-[#1E3A2F] text-xs font-mono uppercase tracking-widest flex items-center justify-between transition-colors rounded-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#C5A059]" />
              <span>Level 3: Technical Fusion Methodology</span>
            </div>
            {showTechnicalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showTechnicalDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-white border-x border-b border-[#E6DFD5] p-6 text-xs text-[#5C6660] space-y-3"
              >
                <p>
                  <strong>Non-Deterministic Fusion:</strong> Rather than assigning a rigid single score, the system weights perceptual colorimetric parameters (CIELAB) alongside subjective self-reporting.
                </p>
                <p>
                  <strong>Epistemic Verification:</strong> Potential suggestions are filtered against classical contraindicated botanical lists before reaching the user.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
