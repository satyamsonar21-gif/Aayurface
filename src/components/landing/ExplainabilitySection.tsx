import { motion } from 'framer-motion';
import { Eye, Clock, ShieldCheck, HelpCircle, AlertOctagon, ArrowRight } from 'lucide-react';

export default function ExplainabilitySection() {
  const chainSteps = [
    {
      num: '01',
      stage: 'Observed',
      icon: Eye,
      heading: 'What was measured',
      content: 'Localized cheek redness and lower moisture specular reflection under daylight.',
      color: '#1E3A2F',
    },
    {
      num: '02',
      stage: 'What Influenced It',
      icon: Clock,
      heading: 'Contributing context',
      content: 'Late sleep hour reported, high ambient summer heat, and mild dietary heat.',
      color: '#5B7B88',
    },
    {
      num: '03',
      stage: 'Confidence',
      icon: ShieldCheck,
      heading: 'Certainty level',
      content: 'Moderate signal concordance due to high ambient room temperature.',
      color: '#C5A059',
    },
    {
      num: '04',
      stage: 'What It May Mean',
      icon: HelpCircle,
      heading: 'Ayurvedic view',
      content: 'Temporary Pitta thermal elevation pacifiable with cooling rosewater & sandalwood.',
      color: '#6B8E7D',
    },
    {
      num: '05',
      stage: 'What It Does Not Mean',
      icon: AlertOctagon,
      heading: 'Explicit limits',
      content: 'This is NOT a diagnosis of rosacea, dermatitis, or clinical skin disease.',
      color: '#A85A48',
    },
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Transparent Reasoning
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Don't just give an answer. <br/>
            <span className="italic text-[#1E3A2F] font-normal">Show the reasoning.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            AayurFace rejects opaque "black-box" outputs. Every recommendation reveals the complete chain of thought—from what was physically observed to its Ayurvedic context and its explicit medical boundaries.
          </p>
        </motion.div>

        {/* The 5-Stage Explainability Chain */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {chainSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#E6DFD5] p-6 rounded-sm flex flex-col justify-between hover:border-[#C5A059] transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-[#C5A059]">
                      {step.num}
                    </span>
                    <div 
                      className="p-2 rounded-full text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon size={14} />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A948E] block mb-1 font-semibold">
                    {step.stage}
                  </span>

                  <h3 className="font-display font-serif text-lg text-[#1A1F1C] mb-2 font-medium">
                    {step.heading}
                  </h3>

                  <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                    {step.content}
                  </p>
                </div>

                {idx < chainSteps.length - 1 && (
                  <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-[#8A948E] mt-4 pt-3 border-t border-[#E6DFD5]/60">
                    <span>Leads to</span>
                    <ArrowRight size={10} className="text-[#C5A059]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Explainability Pledge */}
        <div className="p-6 bg-white border border-[#E6DFD5] rounded-sm max-w-3xl mx-auto text-center shadow-xs">
          <p className="text-xs sm:text-sm text-[#1E3A2F] font-body leading-relaxed">
            <strong>The Transparency Invariant:</strong> If the reasoning cannot be clearly explained in plain English and grounded in classical Ayurvedic literature, the system will not output the recommendation.
          </p>
        </div>

      </div>
    </section>
  );
}
