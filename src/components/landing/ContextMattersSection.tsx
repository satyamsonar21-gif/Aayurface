import { motion } from 'framer-motion';
import { Moon, Droplets, Wind, Utensils } from 'lucide-react';

export default function ContextMattersSection() {
  const factors = [
    {
      icon: Moon,
      title: 'Sleep Rhythm',
      principle: 'Nidra',
      desc: 'Circadian rest patterns and nocturnal cellular rejuvenation directly influence morning dullness and under-eye Vata stagnation.'
    },
    {
      icon: Droplets,
      title: 'Hydration & Agni',
      principle: 'Jala & Agni',
      desc: 'Digestive vitality governs moisture absorption; internal hydration reflects on the skin far deeper than superficial toners.'
    },
    {
      icon: Wind,
      title: 'Climate & Ritu',
      principle: 'Ritucharya',
      desc: 'Dry winds exacerbate roughness, while humidity encourages congestion. Skincare must pivot harmoniously as the seasons turn.'
    },
    {
      icon: Utensils,
      title: 'Food Habits',
      principle: 'Ahara',
      desc: 'The six Ayurvedic tastes (Shad Rasa) dictate systemic inflammation, cutaneous warmth, and natural sebaceous equilibrium.'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Holistic Context Integration
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-[#1A1F1C] leading-[1.15] mb-6">
            Skin is never <br/>
            <span className="italic text-[#6B8E7D]">in isolation.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            A single facial observation records only a momentary snapshot. True Ayurvedic intelligence weaves together your lived environment, daily rhythms, and digestive vitality.
          </p>
        </motion.div>

        {/* Central Composition */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Main Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[60%] mx-auto relative z-10"
          >
            <div className="aspect-[4/5] w-full overflow-hidden border border-[#E6DFD5] bg-white p-2">
              <img 
                src="/images/landing/hero-portrait.jpg" 
                alt="Context matters" 
                className="w-full h-full object-cover grayscale-[15%] sepia-[5%] image-scale-on-hover"
                loading="lazy"
              />
            </div>
            
            {/* Elegant Floating Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#1E3A2F] text-[#FAF8F5] px-6 py-3 border border-[#E6DFD5] shadow-xl whitespace-nowrap">
              <span className="font-editorial italic text-lg mr-3">Prakriti & Vikriti</span>
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">Alignment</span>
            </div>
          </motion.div>

          {/* Surrounding Factors (Desktop Positioning) */}
          <div className="hidden lg:block">
            {factors.map((factor, idx) => {
              const Icon = factor.icon;
              // Precise absolute positioning around the central image
              const positions = [
                "top-[10%] -left-12 max-w-[280px] text-right items-end",
                "top-[20%] -right-12 max-w-[280px] text-left items-start",
                "bottom-[15%] -left-12 max-w-[280px] text-right items-end",
                "bottom-[25%] -right-12 max-w-[280px] text-left items-start"
              ];
              
              const isRightAligned = idx === 0 || idx === 2;

              return (
                <motion.div 
                  key={factor.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.3 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute flex flex-col gap-2 z-20 ${positions[idx]}`}
                >
                  <div className={`flex items-center gap-3 ${isRightAligned ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#1E3A2F] bg-[#FAF8F5]">
                      <Icon size={14} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-editorial text-xl text-[#1A1F1C]">{factor.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                    {factor.principle}
                  </span>
                  <p className="text-xs text-[#5C6660] leading-relaxed mt-2">
                    {factor.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Factors List */}
          <div className="lg:hidden mt-24 space-y-8">
            {factors.map((factor, idx) => {
              const Icon = factor.icon;
              return (
                <motion.div 
                  key={factor.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#1E3A2F] bg-white shadow-sm mb-2">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-editorial text-2xl text-[#1A1F1C]">{factor.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                    {factor.principle}
                  </span>
                  <p className="text-sm text-[#5C6660] leading-relaxed max-w-sm mt-2">
                    {factor.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
