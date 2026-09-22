import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConfidenceAwareSection() {
  const [agreementMode, setAgreementMode] = useState<'high' | 'low'>('high');
  const [showScoringDrawer, setShowScoringDrawer] = useState(false);

  return (
    <section id="confidence" className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Honest Epistemic Uncertainty
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Good intelligence knows <br/>
            <span className="italic text-[#1E3A2F] font-normal">when signals disagree.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Sometimes different signals support the same interpretation. Sometimes they do not. AayurFace communicates uncertainty rather than pretend to know more than the available evidence supports.
          </p>
        </motion.div>

        {/* State Toggle Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm gap-2">
            <button
              type="button"
              onClick={() => setAgreementMode('high')}
              className={`px-6 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 ${
                agreementMode === 'high'
                  ? 'bg-[#1E3A2F] text-white shadow-xs font-semibold'
                  : 'text-[#5C6660] hover:text-[#1A1F1C]'
              }`}
            >
              <CheckCircle2 size={14} className={agreementMode === 'high' ? 'text-emerald-400' : ''} />
              <span>Higher Agreement State</span>
            </button>
            <button
              type="button"
              onClick={() => setAgreementMode('low')}
              className={`px-6 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 ${
                agreementMode === 'low'
                  ? 'bg-[#1E3A2F] text-white shadow-xs font-semibold'
                  : 'text-[#5C6660] hover:text-[#1A1F1C]'
              }`}
            >
              <AlertCircle size={14} className={agreementMode === 'low' ? 'text-amber-400' : ''} />
              <span>Lower Agreement State</span>
            </button>
          </div>
        </div>

        {/* Interactive Comparison Card */}
        <div className="max-w-4xl mx-auto mb-14">
          <AnimatePresence mode="wait">
            {agreementMode === 'high' ? (
              <motion.div
                key="high"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="p-8 sm:p-10 bg-[#FAF8F5] border-2 border-emerald-900/20 rounded-sm shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E6DFD5]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 block mb-1 font-semibold">
                      Multi-Signal Concordance
                    </span>
                    <h3 className="font-display font-serif text-2xl sm:text-3xl text-[#1A1F1C] font-medium">
                      High Signal Agreement
                    </h3>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono rounded-full flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Concordant Multi-Source Inputs</span>
                  </div>
                </div>

                {/* 4 Signals Grid (Exact Requested Format) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Visual Signal</span>
                    <span className="text-xl text-emerald-600 font-bold block mb-1">✓</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Even Tone</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Personal Context</span>
                    <span className="text-xl text-emerald-600 font-bold block mb-1">✓</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Pitta Baseline</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Lifestyle</span>
                    <span className="text-xl text-emerald-600 font-bold block mb-1">✓</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Restful Sleep</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Knowledge</span>
                    <span className="text-xl text-emerald-600 font-bold block mb-1">✓</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Correlated</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm">
                  <h4 className="font-display font-serif text-lg text-[#1E3A2F] font-semibold mb-1">
                    System Behavior Under High Agreement:
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                    When visual observations align with your constitutional history and circadian patterns, the system offers targeted botanical recommendations and seasonal routine adjustments with high transparency.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="low"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="p-8 sm:p-10 bg-[#FAF8F5] border-2 border-amber-800/30 rounded-sm shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E6DFD5]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 block mb-1 font-semibold">
                      Divergent Multi-Source Inputs
                    </span>
                    <h3 className="font-display font-serif text-2xl sm:text-3xl text-[#1A1F1C] font-medium">
                      Lower Signal Agreement
                    </h3>
                  </div>
                  <div className="px-4 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono rounded-full flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>Signal Divergence Detected</span>
                  </div>
                </div>

                {/* 4 Signals Grid (Exact Requested Format) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Visual Signal</span>
                    <span className="text-xl text-emerald-600 font-bold block mb-1">✓</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Surface Flush</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Personal Context</span>
                    <span className="text-xl text-amber-600 font-bold block mb-1">?</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Vata Baseline</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Lifestyle</span>
                    <span className="text-xl text-red-500 font-bold block mb-1">!</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Severe Fatigue</span>
                  </div>
                  <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm text-center">
                    <span className="text-[10px] font-mono text-[#8A948E] uppercase block mb-1">Knowledge</span>
                    <span className="text-xl text-amber-600 font-bold block mb-1">?</span>
                    <span className="text-xs font-mono text-[#1A1F1C]">Mixed Evidence</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-amber-200 rounded-sm">
                  <h4 className="font-display font-serif text-lg text-[#1E3A2F] font-semibold mb-1">
                    System Behavior Under Signal Divergence:
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                    AayurFace transparently states that the observation is provisional. Instead of making an aggressive recommendation, it gently suggests simple grounding routines, highlights potential external factors (like sleep debt or seasonal shifts), and advises consulting an Ayurvedic Vaidya.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Level 3 Expandable Scoring Drawer */}
        <div className="w-full max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setShowScoringDrawer(!showScoringDrawer)}
            className="w-full py-3.5 px-6 border border-[#E6DFD5] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#1E3A2F] text-xs font-mono uppercase tracking-widest flex items-center justify-between transition-colors rounded-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#C5A059]" />
              <span>Level 3: Uncertainty Communication Methodology</span>
            </div>
            {showScoringDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showScoringDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-[#FAF8F5] border-x border-b border-[#E6DFD5] p-6 text-xs text-[#5C6660] space-y-3"
              >
                <p>
                  <strong>No Manufactured Certainty:</strong> We do not publish arbitrary or fabricated percentages. When signal discordance occurs, confidence drops and the user is explicitly informed about what factors caused the ambiguity.
                </p>
                <p>
                  <strong>Clinical Escalation:</strong> If signals point toward persistent acute irritation or dermatological pathology, AayurFace recuses itself from wellness suggestions and recommends certified medical or Ayurvedic consultation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
