import { Camera, Cpu, Leaf, BarChart3 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: Camera,
      title: 'Guided Capture',
      desc: 'Position your face in natural daylight. Our in-browser gateway verifies centering, illumination, and stability.'
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Multimodal Analysis',
      desc: 'Computer vision maps surface texture while comparing observations against classical Charaka dosha typologies.'
    },
    {
      step: '03',
      icon: Leaf,
      title: 'Bespoke Guidance',
      desc: 'Receive personalized botanical formulas, Dinacharya timings, and ingredient cautions with transparent reasoning.'
    },
    {
      step: '04',
      icon: BarChart3,
      title: 'Longitudinal Care',
      desc: 'Re-observe every 2 to 4 weeks to notice subtle skin cycles, seasonal transitions, and restored equilibrium.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            THE PROCESS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Simple steps to balanced skincare.
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            A clear, four-step journey designed for quiet clarity and self-awareness, directly inside your browser.
          </p>
        </div>

        {/* 4 Process Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs space-y-4 group hover:border-[#1E3A2F]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-[#C5A059]">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] group-hover:bg-[#1E3A2F] group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="w-8 h-[2px] bg-[#E6DFD5] group-hover:w-16 group-hover:bg-[#C5A059] transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
