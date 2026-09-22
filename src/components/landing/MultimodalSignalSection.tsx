import { motion } from 'framer-motion';
import { Eye, UserCheck, Moon, SunMedium, BookOpen, Sparkles } from 'lucide-react';

export default function MultimodalSignalSection() {
  const signalPillars = [
    {
      title: 'Visual Observation',
      sanskrit: 'Rupa',
      icon: Eye,
      position: 'top-left',
      summary: 'Controlled surface light, texture characteristics, and color distribution.',
      detail: 'Acts as the physical observation gateway, recording what is visible under standardized conditions.'
    },
    {
      title: 'Constitutional Context',
      sanskrit: 'Prakriti',
      icon: UserCheck,
      position: 'top-right',
      summary: 'Structured personal questionnaire responses regarding inherent physical tendencies.',
      detail: 'Provides the baseline lens through which physical observations are understood.'
    },
    {
      title: 'Circadian Rest Rhythm',
      sanskrit: 'Nidra',
      icon: Moon,
      position: 'mid-left',
      summary: 'Sleep duration, nocturnal recovery patterns, and restorative cycles.',
      detail: 'Rest quality directly modulates morning barrier moisture proxy and under-eye balance.'
    },
    {
      title: 'Seasonal Environment',
      sanskrit: 'Ritucharya',
      icon: SunMedium,
      position: 'mid-right',
      summary: 'External climate, ambient humidity, temperature shifts, and solar exposure.',
      detail: 'Environmental shifts influence whether Vata (dryness) or Pitta (heat) becomes elevated.'
    },
    {
      title: 'Classical Literature',
      sanskrit: 'Shastra',
      icon: BookOpen,
      position: 'bottom',
      summary: 'Validated wisdom from Charaka, Sushruta, and Ashtanga Hridaya compendiums.',
      detail: 'Guarantees that guidance is grounded in time-tested herbal philosophy rather than generative hallucination.'
    }
  ];

  return (
    <section id="multimodal" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Unified Evidence System
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            The face is one signal. <br/>
            <span className="italic text-[#6B8E7D] font-normal">Context illuminates the rest.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            AayurFace rejects the premise that a camera scan alone can capture the richness of human vitality. By connecting facial features with constitutional baseline, sleep, climate, and classical literature, we create a unified picture of wellness.
          </p>
        </motion.div>

        {/* Signature Central Composition */}
        <div className="relative max-w-5xl mx-auto pt-6 pb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column Pillars (Desktop) */}
            <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
              {signalPillars.slice(0, 2).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 bg-white border border-[#E6DFD5] shadow-xs text-left"
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#1E3A2F]">
                      <div className="p-1.5 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 text-[#C5A059]">
                        <Icon size={14} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                        {item.sanskrit}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl text-[#1A1F1C] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {item.summary}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Center Anchor: Human Portrait */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative flex flex-col items-center order-1 lg:order-2"
            >
              <div className="relative w-full max-w-md aspect-[4/5] bg-white p-2.5 border border-[#E6DFD5] shadow-md overflow-hidden">
                <img 
                  src="/images/landing/hero-portrait.jpg" 
                  alt="Human portrait representing whole-person wellness" 
                  className="w-full h-full object-cover grayscale-[10%]"
                />
                
                {/* Visual Interconnection Rings */}
                <div className="absolute inset-4 border border-white/40 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/20 pointer-events-none" />
                
                {/* Center Core Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1E3A2F]/95 backdrop-blur-md text-[#FAF8F5] px-5 py-2.5 border border-[#C5A059]/50 shadow-lg whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-[#C5A059]" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
                      Multimodal Convergence
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column Pillars (Desktop) */}
            <div className="lg:col-span-3 space-y-6 order-3">
              {signalPillars.slice(2, 4).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 bg-white border border-[#E6DFD5] shadow-xs text-left"
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#1E3A2F]">
                      <div className="p-1.5 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 text-[#C5A059]">
                        <Icon size={14} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                        {item.sanskrit}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl text-[#1A1F1C] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {item.summary}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Bottom Root Anchor: Classical Literature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto mt-10 p-5 bg-white border border-[#E6DFD5] shadow-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#1E3A2F]">
              <BookOpen size={16} />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                  Foundation · Shastra
                </span>
                <span className="text-xs font-editorial text-[#1E3A2F]">Classical Ayurvedic Literature</span>
              </div>
              <p className="text-xs text-[#5C6660] leading-relaxed">
                All computational reasoning refers back to classical treatises, ensuring that modern machine observations remain grounded in time-tested Ayurvedic principles.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
