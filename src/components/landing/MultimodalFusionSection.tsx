import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Eye, UserCheck, Clock, BookOpen, Compass, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export default function MultimodalFusionSection() {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Reasoning Architecture
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Multimodal intelligence: <br/>
            <span className="italic text-[#6B8E7D] font-normal">where evidence converges.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Rather than relying on a single modality, AayurFace brings visual observations, personal constitutional context, daily habits, and classical knowledge into a unified reasoning system.
          </p>
        </motion.div>

        {/* Signature Geometric Fusion Visual */}
        <div className="max-w-5xl mx-auto bg-white border border-[#E6DFD5] p-8 sm:p-12 mb-12 shadow-xs relative">
          
          {/* Subtle Accent Hairlines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-[#C5A059]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Modalities List */}
            <div className="lg:col-span-5 space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A948E] block mb-2">
                Input Evidence Streams
              </span>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye size={16} className="text-[#1E3A2F]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1F1C]">
                    Visual Observation
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6B8E7D]">Surface Signals</span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck size={16} className="text-[#1E3A2F]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1F1C]">
                    Constitutional Intake
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6B8E7D]">Prakriti Baseline</span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#1E3A2F]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1F1C]">
                    Daily Lifestyle &amp; Climate
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6B8E7D]">Rest &amp; Season</span>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-[#1E3A2F]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1F1C]">
                    Classical Knowledge Base
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6B8E7D]">Samhitas Grounding</span>
              </div>
            </div>

            {/* Central Fusion Node (Organic Geometry) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center shadow-md relative group">
                <Layers size={22} className="text-[#C5A059]" />
                <div className="absolute -inset-2 rounded-full border border-[#C5A059]/40 animate-pulse pointer-events-none" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold mt-3">
                Multimodal Synthesis
              </span>
            </div>

            {/* Output Interpretable Guidance */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 border border-[#E6DFD5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold">
                  Synthesized Outcome
                </span>
                <span className="text-[10px] font-mono text-[#8A948E]">Interpretable</span>
              </div>

              <h4 className="font-editorial text-2xl text-[#1A1F1C]">
                Contextual Wellness Balance
              </h4>
              
              <p className="text-xs text-[#5C6660] leading-relaxed">
                These signals are combined through a configurable, research-oriented fusion approach. Rather than outputting a black-box percentage, the system explains how individual modalities support or calibrate each observation.
              </p>

              <div className="p-3 bg-white border border-[#E6DFD5] text-[11px] font-mono text-[#1E3A2F] flex items-center gap-2">
                <Compass size={13} className="text-[#C5A059]" />
                <span>Calibrated against inter-modality agreement</span>
              </div>
            </div>

          </div>
        </div>

        {/* Level 3: Research Methodology Drawer */}
        <div className="max-w-4xl mx-auto border border-[#E6DFD5] bg-white p-5">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between text-left text-xs font-mono text-[#1E3A2F] uppercase tracking-wider font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[#C5A059]" />
              <span>Level 3 Research: Fusion Engine Strategy &amp; Weighting Architecture</span>
            </div>
            {showMethodology ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showMethodology && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 mt-4 border-t border-[#E6DFD5] text-xs text-[#5C6660] space-y-3 font-mono leading-relaxed"
              >
                <p>
                  <strong>Configurable Fusion Interface:</strong> The intelligence architecture encapsulates fusion behind an <code>IFusionStrategy</code> pattern, permitting substitution with Bayesian networks or consensus models during research iterations.
                </p>
                <p>
                  <strong>Provisional Engineering Hypothesis:</strong> In early development iterations, weighting parameters reflect a baseline working hypothesis (visual observations ~40%, constitutional questionnaire ~35%, lifestyle context ~25%). 
                </p>
                <p className="text-[#8A948E] italic">
                  Reconciliation Invariant: These initial weights represent a provisional engineering hypothesis pending empirical calibration against multi-practitioner consensus datasets in future clinical validation phases.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
