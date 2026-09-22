import { motion } from 'framer-motion';
import { CheckCircle2, Search } from 'lucide-react';

export default function ResearchValidationSection() {
  const currentCapabilities = [
    {
      title: 'In-Browser Quality Gateway',
      desc: 'Standardized ambient light, centered oval framing, and focus checks evaluated locally in your browser before observation.',
    },
    {
      title: 'Objective Surface Feature Extraction',
      desc: 'Perceptual colorimetry (CIELAB) and relative surface reflection proxies decoupled from changing device exposure.',
    },
    {
      title: 'Classical Samhita Grounding',
      desc: 'Topical guidance cross-referenced against authentic treatises (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya).',
    },
    {
      title: 'Transparent 5-Stage Explainability',
      desc: 'Every wellness suggestion exposes its observed inputs, contributing factors, and explicit non-diagnostic limits.',
    },
  ];

  const researchRoadmap = [
    {
      title: 'Indian Skin Representation Dataset',
      desc: 'Ongoing protocol design to validate colorimetric variance across diverse Indian skin phenotypes and regional climates.',
    },
    {
      title: 'Vaidya Expert Consensus Studies',
      desc: 'Planned multi-practitioner concordance studies to evaluate inter-rater reliability between traditional Vaidyas and computational observation.',
    },
    {
      title: 'Longitudinal Seasonal Cohorts',
      desc: 'Investigating seasonal Ritucharya shifts over 12-month observational cycles across varying humidity and temperature zones.',
    },
    {
      title: 'Peer-Reviewed Scientific Publications',
      desc: 'Aiming to publish methodologies and validation findings openly in scientific and Ayurvedic informatics journals.',
    },
  ];

  return (
    <section id="research" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Trust &amp; Transparency
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Built with a research mindset.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Trust is earned through scientific honesty. We do not manufacture fake clinical trial claims or invent statistics. Here is the exact boundary between what works today and what we are investigating for tomorrow.
          </p>
        </motion.div>

        {/* Side-by-Side Architectural Split: Current vs Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Left: Current Operational Capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white border-2 border-emerald-900/20 p-8 sm:p-10 rounded-sm shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
                    Current Operational Platform
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
                  Live Today
                </span>
              </div>

              <h3 className="font-display font-serif text-2xl sm:text-3xl text-[#1A1F1C] font-medium mb-6">
                Operational Capabilities
              </h3>

              <div className="space-y-5">
                {currentCapabilities.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-serif text-lg text-[#1A1F1C] font-medium">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6DFD5] text-[11px] font-mono text-[#5C6660]">
              Verified in current production build · Privacy-first
            </div>
          </motion.div>

          {/* Right: Active Research Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white border-2 border-[#C5A059]/40 p-8 sm:p-10 rounded-sm shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
                    Active Research Roadmap
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-200">
                  In Development
                </span>
              </div>

              <h3 className="font-display font-serif text-2xl sm:text-3xl text-[#1A1F1C] font-medium mb-6">
                Future Investigation
              </h3>

              <div className="space-y-5">
                {researchRoadmap.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <Search size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-serif text-lg text-[#1A1F1C] font-medium">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6DFD5] text-[11px] font-mono text-[#5C6660]">
              Research direction · Not presented as completed clinical trials
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
