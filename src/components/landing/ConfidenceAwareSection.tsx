import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Scale } from 'lucide-react';

export default function ConfidenceAwareSection() {
  const [activeScenario, setActiveScenario] = useState<'high' | 'low'>('high');
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <section id="confidence" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
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
            Intellectual Honesty
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            AI should know when the <br/>
            <span className="italic text-[#6B8E7D] font-normal">evidence disagrees.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Conventional algorithms are often tuned to present a confident conclusion even when input signals conflict. AayurFace makes disagreement visible—communicating uncertainty rather than pretending false precision.
          </p>
        </motion.div>

        {/* Interactive Scenario Selector */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveScenario('high')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
              activeScenario === 'high'
                ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                : 'bg-[#FAF8F5] text-[#5C6660] border-[#E6DFD5] hover:border-[#C5A059]'
            }`}
          >
            <CheckCircle2 size={14} className={activeScenario === 'high' ? 'text-emerald-300' : 'text-emerald-600'} />
            <span>Scenario A: High Agreement</span>
          </button>
          <button
            onClick={() => setActiveScenario('low')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
              activeScenario === 'low'
                ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                : 'bg-[#FAF8F5] text-[#5C6660] border-[#E6DFD5] hover:border-[#C5A059]'
            }`}
          >
            <AlertTriangle size={14} className={activeScenario === 'low' ? 'text-amber-300' : 'text-amber-600'} />
            <span>Scenario B: Signal Divergence</span>
          </button>
        </div>

        {/* Active Scenario Card Display */}
        <div className="max-w-4xl mx-auto bg-[#FAF8F5] border border-[#E6DFD5] p-8 sm:p-12 mb-12 relative overflow-hidden shadow-xs">
          {activeScenario === 'high' ? (
            <motion.div
              key="high"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
                    High Modality Alignment
                  </span>
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono uppercase tracking-wider">
                  Calibrated Confidence: High
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">VISUAL OBSERVATION</span>
                  <p className="text-[#1A1F1C]">Elevated cheek micro-warmth under balanced daylight.</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">CONSTITUTIONAL INTAKE</span>
                  <p className="text-[#1A1F1C]">Self-reported sensitivity to heat and seasonal sun exposure.</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">LIFESTYLE CONTEXT</span>
                  <p className="text-[#1A1F1C]">Midsummer climate with active outdoor daytime activity.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#E6DFD5]">
                <h4 className="font-editorial text-lg text-[#1E3A2F] mb-1">
                  System Interpretation: Harmonious Agreement
                </h4>
                <p className="text-xs text-[#5C6660] leading-relaxed">
                  The evidence sources consistently indicate temporary Pitta (thermal) sensitivity. Because camera signals corroborate constitutional answers, guidance can be suggested with high confidence.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="low"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-semibold">
                    Divergent Signals Detected
                  </span>
                </div>
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono uppercase tracking-wider">
                  Confidence Capped: Uncertainty Communicated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">VISUAL OBSERVATION</span>
                  <p className="text-[#1A1F1C]">Localized surface dryness and barrier roughness observed.</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">CONSTITUTIONAL INTAKE</span>
                  <p className="text-[#1A1F1C]">Self-reported baseline leaning toward oily Kapha tendencies.</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E6DFD5]">
                  <span className="text-[10px] text-[#8A948E] block mb-1">LIFESTYLE CONTEXT</span>
                  <p className="text-[#1A1F1C]">Recent flight travel in dry air conditioning and low sleep.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200">
                <h4 className="font-editorial text-lg text-amber-900 mb-1">
                  System Behavior: Honest Advisory Notice
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Instead of forcing an ambiguous Dosha conclusion, the system flags the conflict: temporary environmental dehydration (Vata elevation from travel) is masking baseline tendencies. Confidence is automatically capped, and gentle transitional hydration is advised rather than heavy treatments.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Level 3: Research Methodology Drawer */}
        <div className="max-w-4xl mx-auto border border-[#E6DFD5] bg-[#FAF8F5] p-5">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between text-left text-xs font-mono text-[#1E3A2F] uppercase tracking-wider font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-[#C5A059]" />
              <span>Level 3 Research: Agreement Index &amp; Calibrated Scoring Invariants</span>
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
                  <strong>Mathematical Confidence Formulation:</strong> The system computes a calibrated confidence metric governed by three terms: <em>Confidence = Q_cap × C_input × A</em>, where <em>Q_cap</em> represents capture illumination quality, <em>C_input</em> measures intake completeness, and <em>A</em> is the inter-modality harmonic agreement index.
                </p>
                <p>
                  <strong>Architectural Invariant:</strong> If inter-modality agreement falls below threshold, total stated confidence is mathematically capped below 60%. This guarantees that contradictory evidence can never produce an artificially high confidence rating.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
