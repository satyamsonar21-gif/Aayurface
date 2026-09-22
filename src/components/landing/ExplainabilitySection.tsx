import { motion } from 'framer-motion';
import { Eye, Layers, Gauge, BookOpen, ShieldAlert } from 'lucide-react';

export default function ExplainabilitySection() {
  const chain = [
    {
      stage: '01',
      label: 'OBSERVED',
      icon: Eye,
      title: 'Visual Surface Signal',
      details: 'Detected surface dryness lines across cheeks with localized specular sheen in T-zone.',
    },
    {
      stage: '02',
      label: 'INFLUENCE',
      icon: Layers,
      title: 'Contextual Covariates',
      details: 'Self-reported late sleep schedules (6.5 hrs) combined with seasonal dry autumn weather (Sharad Ritu).',
    },
    {
      stage: '03',
      label: 'CONFIDENCE',
      icon: Gauge,
      title: 'Signal Reliability',
      details: 'High capture quality (Laplacian variance > 60, diffuse daylight 5200K, zero motion blur).',
    },
    {
      stage: '04',
      label: 'MEANING',
      icon: BookOpen,
      title: 'Constitutional Interpretation',
      details: 'Suggests a temporary Pitta-Vata elevation (Vikriti): aggravated Pitta in sebaceous glands coupled with Vata dehydration.',
    },
    {
      stage: '05',
      label: 'LIMITS',
      icon: ShieldAlert,
      title: 'Safety Boundary',
      details: 'Constitutional skincare wellness observation only. Not a medical evaluation for dermatological disease.',
    }
  ];

  return (
    <section className="w-full bg-[#1A1F1C] border-y border-[#2A312D] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden text-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Transparent Reasoning
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] leading-[1.1] mb-6">
            Not just an answer. <br/>
            <span className="italic text-[#8A948E]">An explanation.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8A948E] font-body leading-relaxed max-w-xl mx-auto">
            We reject black-box scores. Every recommendation unfolds in a clear, evidentiary hierarchy so you always understand why a botanical or ritual is suggested.
          </p>
        </motion.div>

        {/* Interface Abstraction */}
        <div className="relative w-full max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-[#FAF8F5]/10 bg-[#121513] shadow-2xl overflow-hidden"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 bg-[#1A1F1C] px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#353C38]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#353C38]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#353C38]" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A948E]">
                Log: V1-EXPLAINABLE-AYUR
              </span>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-10">
                {chain.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div 
                      key={item.stage} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col relative"
                    >
                      {/* Connecting Line (Desktop) */}
                      {idx !== chain.length - 1 && (
                        <div className="hidden md:block absolute top-6 left-full w-10 h-[1px] bg-[#FAF8F5]/10 -translate-x-4" />
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                          {item.stage} / {item.label}
                        </span>
                      </div>
                      
                      <div className="w-10 h-10 rounded border border-[#FAF8F5]/10 bg-[#1A1F1C] flex items-center justify-center mb-6 text-[#8A948E]">
                        <Icon size={16} strokeWidth={1.5} />
                      </div>

                      <h3 className="font-editorial text-lg text-[#FAF8F5] mb-3">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-[#8A948E] leading-relaxed font-mono">
                        {item.details}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
