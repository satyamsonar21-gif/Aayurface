import { Calendar, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

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
    <section id="progress" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            LONGITUDINAL OBSERVATION
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Observation over time, not quick fixes.
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            True skin vitality develops over natural cellular renewal cycles (28 to 40 days). AayurFace supports continuous, thoughtful observation as your environment and seasons change.
          </p>
        </div>

        {/* Milestone Progression Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {milestones.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.day}
                className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD5] shadow-xs space-y-4 relative group hover:border-[#1E3A2F]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                      {item.day}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                      <Icon size={16} />
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-[#E6DFD5]" />

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8E7D] block">
                      {item.phase}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-mono text-[#8A948E]">
                  Milestone Stage 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
