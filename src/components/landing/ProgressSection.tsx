import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Calendar, TrendingUp } from 'lucide-react';

export default function ProgressSection() {
  const milestones = [
    {
      day: 'DAY 01',
      title: 'Baseline Observation',
      icon: Sparkles,
      phase: 'Constitutional Mapping',
      desc: 'First standardized facial capture records initial surface shine, moisture proxy, and baseline dosha tendencies.'
    },
    {
      day: 'DAY 30',
      title: 'Routine Integration',
      icon: RefreshCw,
      phase: 'Epidermal Adaptation',
      desc: 'Skin adjusts to morning-evening Dinacharya. Initial reduction in superficial tightness and restored lipid calm.'
    },
    {
      day: 'DAY 60',
      title: 'Doshic Calibration',
      icon: Calendar,
      phase: 'Seasonal Transition',
      desc: 'Adjusting herbal Lepas as external temperatures and humidity shift, preventing seasonal Vikriti flare-ups.'
    },
    {
      day: 'DAY 90',
      title: 'Sustained Equilibrium',
      icon: TrendingUp,
      phase: 'Constitutional Harmony',
      desc: 'Consistent barrier strength and steady natural luminosity achieved through intuitive, daily self-awareness.'
    }
  ];

  return (
    <section id="progress" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Longitudinal Observation
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.1] mb-6">
            Observation over time. <br/>
            <span className="italic text-[#6B8E7D]">Not quick fixes.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            True skin vitality develops over natural cellular renewal cycles (28 to 40 days). We support continuous, thoughtful observation as your environment and seasons change.
          </p>
        </motion.div>

        {/* Elegant Continuous Timeline */}
        <div className="relative max-w-6xl mx-auto pt-10">
          
          {/* Continuous Line (Desktop) */}
          <div className="hidden lg:block absolute top-[110px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-40" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-4 relative z-10">
            {milestones.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.day}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] mb-4">
                    {item.day}
                  </span>
                  
                  {/* Circle Node */}
                  <div className="w-16 h-16 rounded-full border border-[#E6DFD5] bg-[#FAF8F5] flex items-center justify-center mb-8 relative group-hover:border-[#C5A059] transition-colors">
                    <Icon size={20} className="text-[#1E3A2F]" strokeWidth={1} />
                    <div className="absolute inset-0 rounded-full border border-[#C5A059] scale-110 opacity-0 group-hover:opacity-30 group-hover:animate-ping" />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8E7D] mb-2 block">
                    {item.phase}
                  </span>
                  <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-4 px-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed px-4 max-w-xs">
                    {item.desc}
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
