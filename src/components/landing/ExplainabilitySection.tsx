import { motion } from 'framer-motion';
import { Eye, Layers, Gauge, BookOpen, ShieldAlert, Check } from 'lucide-react';

export default function ExplainabilitySection() {
  const chain = [
    {
      stage: '01',
      label: 'OBSERVED',
      icon: Eye,
      title: 'Visual Surface Signal',
      details: 'Standardized capture records localized surface tightness and warmth along cheeks.',
      role: 'Empirical Observation'
    },
    {
      stage: '02',
      label: 'INFLUENCE',
      icon: Layers,
      title: 'Contextual Covariates',
      details: 'Correlated with late sleep schedule (6 hrs) and dry seasonal wind (Sharad Ritu).',
      role: 'Lived Lifestyle Factors'
    },
    {
      stage: '03',
      label: 'CONFIDENCE',
      icon: Gauge,
      title: 'Signal Reliability',
      details: 'High capture illumination quality coupled with strong cross-modality agreement.',
      role: 'Calibrated Certainty'
    },
    {
      stage: '04',
      label: 'MEANING',
      icon: BookOpen,
      title: 'Ayurvedic Interpretation',
      details: 'Suggests transient Vata dryness with slight Pitta warmth (temporary Vikriti imbalance).',
      role: 'Constitutional Context'
    },
    {
      stage: '05',
      label: 'LIMITS',
      icon: ShieldAlert,
      title: 'Safety Boundary',
      details: 'Constitutional wellness guidance only. Explicitly non-diagnostic for medical conditions.',
      role: 'Ethical Covenant'
    }
  ];

  return (
    <section className="w-full bg-[#121513] text-[#FAF8F5] border-y border-[#2A312D] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Transparent Reasoning
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] leading-[1.12] mb-6">
            Don't just tell me what. <br/>
            <span className="italic text-[#8A948E] font-normal">Show me why.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8A948E] font-body leading-relaxed max-w-2xl mx-auto">
            AayurFace rejects opaque scores. Every recommendation traces its rationale across an explainable five-step evidentiary chain—connecting what was observed to why a ritual or botanical is considered.
          </p>
        </motion.div>

        {/* The 5-Step Transparency Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-[#FAF8F5]/15 bg-[#181C19] shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 bg-[#141715] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#FAF8F5]">
                Explainable Insight Ledger
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A948E] hidden sm:inline-block">
              5-Stage Evidentiary Traceability
            </span>
          </div>

          {/* 5-Stage Grid */}
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
              {chain.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.stage} className="flex flex-col relative group">
                    {/* Connecting Line between steps (Desktop) */}
                    {idx !== chain.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-full w-8 h-[1px] bg-[#FAF8F5]/10 -translate-x-4" />
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                        {item.stage} / {item.label}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded border border-[#FAF8F5]/15 bg-[#121513] flex items-center justify-center mb-5 text-[#C5A059]">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>

                    <h4 className="font-editorial text-lg text-[#FAF8F5] mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8E7D] mb-3 block">
                      {item.role}
                    </span>

                    <p className="text-xs text-[#8A948E] leading-relaxed font-body">
                      {item.details}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="border-t border-[#FAF8F5]/10 bg-[#141715] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#8A948E]">
            <div className="flex items-center gap-2">
              <Check size={13} className="text-[#C5A059]" />
              <span>Full rationale visible to the user at every checkpoint</span>
            </div>
            <span>No ungrounded generative assertions</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
