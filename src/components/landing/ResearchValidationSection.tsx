import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ResearchValidationSection() {
  const currentCapabilities = [
    'In-browser standardized capture gateway with lighting checks',
    'Structured non-diagnostic visual feature extraction',
    'Constitutional intake and daily lifestyle context integration',
    'Confidence calibration reflecting inter-modality agreement',
    'Five-stage transparent reasoning and explainability ledger'
  ];

  const activeResearchDirections = [
    {
      title: 'Indian-Skin Representation & Validation',
      summary: 'Skin-analysis systems require thorough validation across diverse skin tones, regional lighting variations, devices, and populations. AayurFace’s research roadmap explicitly prioritizes Indian skin representation, evaluating colorimetric models to ensure pigmentation is never conflated with vascular warmth.'
    },
    {
      title: 'Multi-Practitioner Consensus Methodology',
      summary: 'Developing research protocols where independent Ayurvedic experts evaluate de-identified cases to establish objective, inter-rater benchmark datasets for algorithm calibration.'
    },
    {
      title: 'Longitudinal Wellness Dynamics',
      summary: 'Investigating how multi-week self-care consistency correlates with self-reported skin comfort across seasonal transitions (Ritucharya).'
    }
  ];

  return (
    <section id="research" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
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
            Scientific Responsibility
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            From digital wellness to <br/>
            <span className="italic text-[#6B8E7D] font-normal">research-grade intelligence.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Responsible innovation requires absolute transparency regarding what a platform accomplishes today and what it investigates for tomorrow. We explicitly separate our live platform capabilities from our ongoing research roadmap.
          </p>
        </motion.div>

        {/* Clear Division: Current Capabilities vs Research Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left: Current Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-[#E6DFD5] p-8 sm:p-10 shadow-xs"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6DFD5]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
                Current Live Platform
              </span>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono border border-emerald-200">
                Operational
              </span>
            </div>

            <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-4">
              Validated Wellness Experience
            </h3>

            <p className="text-xs text-[#5C6660] leading-relaxed mb-6">
              Our active release operates as a client-side, privacy-preserving wellness companion designed to bring classical Ayurvedic structure to everyday routines.
            </p>

            <ul className="space-y-3.5">
              {currentCapabilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-[#1A1F1C]">
                  <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Research Directions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#FAF8F5] border border-[#C5A059]/40 p-8 sm:p-10"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6DFD5]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold">
                Active Research Roadmap
              </span>
              <span className="inline-block px-2.5 py-0.5 bg-[#FAF8F5] text-[#C5A059] text-[10px] font-mono border border-[#C5A059]/40">
                In Development
              </span>
            </div>

            <h3 className="font-editorial text-2xl text-[#1E3A2F] mb-6">
              Scientific Exploration &amp; Calibration
            </h3>

            <div className="space-y-6">
              {activeResearchDirections.map((direction) => (
                <div key={direction.title} className="p-4 bg-white border border-[#E6DFD5]">
                  <h4 className="font-editorial text-lg text-[#1A1F1C] mb-2 font-semibold">
                    {direction.title}
                  </h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    {direction.summary}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6DFD5] text-[11px] font-mono text-[#8A948E] italic">
              Research directions represent active engineering and clinical inquiry protocols. AayurFace does not assert completed clinical certifications.
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
