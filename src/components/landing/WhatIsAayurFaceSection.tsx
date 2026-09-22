import { motion } from 'framer-motion';
import { Scan, Eye, User, BookOpen, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function WhatIsAayurFaceSection() {
  const steps = [
    {
      step: '01',
      action: 'You Scan',
      desc: 'Capture your face under guided, consistent ambient lighting.',
      icon: Scan,
    },
    {
      step: '02',
      action: 'AayurFace Observes',
      desc: 'Extracts objective surface color and micro-texture characteristics.',
      icon: Eye,
    },
    {
      step: '03',
      action: 'You Add Context',
      desc: 'Share your constitutional Prakriti, sleep rhythms, and local climate.',
      icon: User,
    },
    {
      step: '04',
      action: 'Ayurveda Grounds',
      desc: 'Classical Samhita principles provide structured medical context.',
      icon: BookOpen,
    },
    {
      step: '05',
      action: 'Signals Unify',
      desc: 'Multimodal intelligence connects observation with personal history.',
      icon: Layers,
    },
    {
      step: '06',
      action: 'Clear Guidance',
      desc: 'Receive transparent, personalized daily wellness and botanical routines.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="what-is-aayurface" className="w-full bg-[#FFFFFF] py-20 sm:py-28 px-6 sm:px-10 border-b border-[#E6DFD5]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Product Definition
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.15] mb-6">
            What is AayurFace?
          </h2>
          <p className="text-lg sm:text-xl text-[#1E3A2F] font-body font-medium leading-relaxed max-w-2xl mx-auto">
            AayurFace is an Ayurvedic skin-wellness platform that combines facial observation with your personal context, lifestyle and Ayurvedic knowledge.
          </p>
        </motion.div>

        {/* The 6-Step Visual Process: Understandable in 15 seconds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-[#C5A059]/60 transition-all rounded-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-[#C5A059]">
                      {item.step}
                    </span>
                    <div className="p-2 bg-white rounded-full border border-[#E6DFD5] text-[#1E3A2F] group-hover:text-[#C5A059] transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="font-display font-serif text-2xl text-[#1A1F1C] mb-2 font-medium">
                    {item.action}
                  </h3>
                  <p className="text-sm text-[#5C6660] font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-[#8A948E] mt-4 pt-3 border-t border-[#E6DFD5]/60">
                    <span>Next Signal</span>
                    <ArrowRight size={12} className="text-[#C5A059]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Central Synthesis Callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 p-6 sm:p-8 bg-[#FAF8F5] border border-[#C5A059]/40 rounded-sm text-center max-w-3xl mx-auto"
        >
          <p className="text-sm sm:text-base text-[#1E3A2F] font-body leading-relaxed">
            <strong className="font-semibold">The result:</strong> Rather than a generic product recommendation generated from a quick selfie, you receive calm, grounded, explainable wellness insights that respect your whole self.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
