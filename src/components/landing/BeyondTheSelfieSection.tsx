import { motion } from 'framer-motion';
import { Eye, User, Clock, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BeyondTheSelfieSection() {
  const fourSignals = [
    {
      num: '01',
      title: 'Visual Observation',
      desc: 'What can be observed from the captured image under standardized light and framing.',
      icon: Eye,
    },
    {
      num: '02',
      title: 'Prakriti',
      desc: 'Personal constitutional context and elemental tendencies (Vata, Pitta, Kapha).',
      icon: User,
    },
    {
      num: '03',
      title: 'Lifestyle',
      desc: 'Everyday habits, sleep quality, diurnal rhythms, and seasonal environmental shifts.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Ayurvedic Knowledge',
      desc: 'Classical and structured knowledge from the Samhitas used to provide medical context.',
      icon: BookOpen,
    },
  ];

  return (
    <section id="beyond-selfie" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Narrative */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4 font-semibold">
            The Core Concept
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Beyond the selfie.
          </h2>
          <p className="text-xl sm:text-2xl text-[#1E3A2F] font-display font-serif italic mb-4">
            "A selfie captures a moment. AayurFace looks at the context around that moment."
          </p>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Conventional camera apps attempt to jump from a single uncalibrated snapshot directly to a cosmetic diagnosis. AayurFace brings four interconnected signals together to understand the whole picture.
          </p>
        </motion.div>

        {/* The 4 Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {fourSignals.map((signal, idx) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#E6DFD5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5A059] transition-all rounded-sm shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-sm font-semibold text-[#C5A059]">
                      {signal.num}
                    </span>
                    <div className="p-2.5 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] text-[#1E3A2F] group-hover:bg-[#1E3A2F] group-hover:text-white transition-all">
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 className="font-display font-serif text-2xl text-[#1A1F1C] mb-3 font-medium">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-[#5C6660] font-body leading-relaxed">
                    {signal.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6DFD5]/70 flex items-center gap-1.5 text-[11px] font-mono text-[#8A948E]">
                  <span>Connected Signal</span>
                  <ArrowRight size={11} className="text-[#C5A059]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Synthesis Banner: Together, these signals create a more meaningful picture */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 sm:p-8 bg-[#1E3A2F] text-[#FAF8F5] rounded-sm border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white/10 text-[#C5A059]">
              <Layers size={22} />
            </div>
            <div>
              <h4 className="font-display font-serif text-2xl sm:text-3xl text-white font-medium">
                Together, these signals create a more meaningful picture.
              </h4>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-body mt-1">
                AayurFace does not imply that facial appearance alone determines Prakriti or Dosha.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059] uppercase tracking-wider whitespace-nowrap bg-black/30 px-4 py-2 rounded-sm border border-[#C5A059]/30">
            <ShieldCheck size={14} />
            <span>Non-Deterministic</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
