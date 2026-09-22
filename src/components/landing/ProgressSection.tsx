import { motion } from 'framer-motion';
import { Calendar, Compass, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProgressSection() {
  const milestones = [
    {
      day: 'DAY 01',
      title: 'Baseline',
      tag: 'Initial Mapping',
      desc: 'First standardized capture and comprehensive Prakriti context intake establish your personal reference point.',
      icon: Compass,
    },
    {
      day: 'DAY 30',
      title: 'Observe',
      tag: 'Habit Formation',
      desc: 'Track initial routine consistency, self-reported sensory experience, and morning barrier comfort.',
      icon: Calendar,
    },
    {
      day: 'DAY 60',
      title: 'Compare',
      tag: 'Longitudinal View',
      desc: 'Side-by-side standardized comparisons reveal subtle shifts in tone evenness and hydration proxy under matching daylight.',
      icon: RefreshCw,
    },
    {
      day: 'DAY 90',
      title: 'Reflect',
      tag: 'Seasonal Shift',
      desc: 'Evaluate how your skin responded across seasonal climatic transitions, refining your personalized Dinacharya for the next cycle.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Longitudinal Tracking
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Skin wellness is a journey, <br/>
            <span className="italic text-[#1E3A2F] font-normal">not a snapshot.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Skin is alive and responsive to seasonal, climatic, and circadian changes. AayurFace encourages calm, recurring observation over 90-day cycles rather than reactionary quick fixes.
          </p>
        </motion.div>

        {/* 4-Stage Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.day}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FAF8F5] border border-[#E6DFD5] p-6 sm:p-8 rounded-sm hover:border-[#C5A059] transition-all flex flex-col justify-between shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E6DFD5]">
                    <span className="font-mono text-xs font-semibold text-[#C5A059]">
                      {m.day}
                    </span>
                    <div className="p-2 rounded-full bg-white border border-[#E6DFD5] text-[#1E3A2F] group-hover:text-[#C5A059] transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A948E] block mb-1 font-semibold">
                    {m.tag}
                  </span>

                  <h3 className="font-display font-serif text-2xl text-[#1A1F1C] mb-3 font-medium">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6DFD5]/60 flex items-center gap-1.5 text-[11px] font-mono text-[#6B8E7D]">
                  <CheckCircle2 size={12} />
                  <span>Standardized Metric</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What AayurFace Tracks Banner - Claim Discipline */}
        <div className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-serif text-lg text-[#1E3A2F] font-semibold mb-1">
                What AayurFace Legitimately Tracks:
              </h4>
              <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                Objective colorimetric stability, daily routine consistency, self-reported hydration comfort, and seasonal adaptations. We do not make biological epidermal renewal promises or guarantee cosmetic transformations.
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#8A948E] uppercase tracking-wider whitespace-nowrap px-3 py-1 bg-white border border-[#E6DFD5] rounded-xs shrink-0">
              Ethical Claim Policy
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
