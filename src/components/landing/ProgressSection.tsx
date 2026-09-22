import { motion } from 'framer-motion';
import { Sparkles, Eye, GitCompare, Compass } from 'lucide-react';

export default function ProgressSection() {
  const milestones = [
    {
      day: 'DAY 01',
      title: 'Baseline Checkpoint',
      icon: Sparkles,
      phase: 'BASELINE',
      desc: 'First standardized facial observation captures initial surface characteristics, paired with your constitutional intake.'
    },
    {
      day: 'DAY 30',
      title: 'Initial Observation',
      icon: Eye,
      phase: 'OBSERVE',
      desc: 'Reviewing daily routine consistency and noting subtle shifts in morning hydration feel and environmental comfort.'
    },
    {
      day: 'DAY 60',
      title: 'Comparative Review',
      icon: GitCompare,
      phase: 'COMPARE',
      desc: 'Comparing current observations against your Day 01 baseline as weather, sleep, and seasonal habits evolve.'
    },
    {
      day: 'DAY 90',
      title: 'Sustained Reflection',
      icon: Compass,
      phase: 'REFLECT',
      desc: 'Deepening personal intuition and long-term self-awareness through continuous, calm longitudinal observation.'
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
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Longitudinal Wellness
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            A continuous journey. <br/>
            <span className="italic text-[#6B8E7D] font-normal">Not a single snapshot.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            True wellness unfolds over time. AayurFace moves away from transactional single scans, supporting thoughtful observation, routine consistency, and reflection across weeks and seasons.
          </p>
        </motion.div>

        {/* Milestone Timeline */}
        <div className="relative max-w-6xl mx-auto pt-6">
          
          {/* Connecting Hairline (Desktop) */}
          <div className="hidden lg:block absolute top-[105px] left-[12%] right-[12%] h-[1px] bg-[#E6DFD5]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {milestones.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.day}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center p-6 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-[#C5A059] transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
                    {item.day}
                  </span>
                  
                  {/* Circle Node */}
                  <div className="w-14 h-14 rounded-full border border-[#E6DFD5] bg-white flex items-center justify-center mb-6 text-[#1E3A2F] shadow-xs">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8E7D] mb-1 block font-semibold">
                    {item.phase}
                  </span>
                  
                  <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* What We Track vs What We Do Not Claim Banner */}
          <div className="mt-16 p-6 bg-[#FAF8F5] border border-[#E6DFD5] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5C6660]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#1E3A2F] font-semibold block mb-2">
                What We Observe Over Time:
              </span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Consistency in completing daily morning and evening rituals.</li>
                <li>Self-reported comfort, rest, and environmental changes.</li>
                <li>Relative shifts in standardized visual surface characteristics.</li>
              </ul>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A948E] font-semibold block mb-2">
                What We Never Claim:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-[#8A948E]">
                <li>Never claims clinical cure of dermatological disease.</li>
                <li>No fabricated percentage "improvement" scores.</li>
                <li>Never replaces medical evaluation by a licensed physician.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
