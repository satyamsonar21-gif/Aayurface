import { Moon, Droplets, Sun, Wind, Utensils } from 'lucide-react';

export default function ContextMattersSection() {
  const factors = [
    {
      icon: Moon,
      title: 'SLEEP RHYTHM',
      principle: 'Nidra',
      desc: 'Circadian rest patterns and nocturnal cellular rejuvenation directly influence morning dullness and under-eye Vata stagnation.'
    },
    {
      icon: Sun,
      title: 'DAILY DINACHARYA',
      principle: 'Dinacharya',
      desc: 'Consistency in morning cleansing, tongue scraping, and herbal water hydration grounds the doshic balance for the entire day.'
    },
    {
      icon: Droplets,
      title: 'HYDRATION & AGNI',
      principle: 'Jala & Agni',
      desc: 'Digestive vitality governs moisture absorption; internal hydration reflects on the skin far deeper than superficial toners.'
    },
    {
      icon: Wind,
      title: 'CLIMATE & RITU',
      principle: 'Ritucharya',
      desc: 'Dry winds exacerbate roughness, while humidity encourages congestion. Skincare must pivot harmoniously as the seasons turn.'
    },
    {
      icon: Utensils,
      title: 'FOOD HABITS',
      principle: 'Ahara',
      desc: 'The six Ayurvedic tastes (Shad Rasa) dictate systemic inflammation, cutaneous warmth, and natural sebaceous equilibrium.'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            HOLISTIC CONTEXT INTEGRATION
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Context matters: skin is never in isolation.
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            A single facial observation records only a momentary snapshot. True Ayurvedic intelligence weaves together your lived environment, daily rhythms, and digestive vitality.
          </p>
        </div>

        {/* Central Collage & Radiating Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (2 Factors) */}
          <div className="lg:col-span-4 space-y-6">
            {factors.slice(0, 2).map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.title}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs space-y-3 relative group hover:border-[#1E3A2F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                        <Icon size={16} />
                      </div>
                      <h3 className="text-xs font-semibold tracking-wider uppercase text-[#1E3A2F] font-body">
                        {factor.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#C5A059] font-medium">
                      {factor.principle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Column: Portrait Visual */}
          <div className="lg:col-span-4 relative flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-md w-full max-w-[340px]">
              <img
                src="/images/landing/hero-portrait.jpg"
                alt="Central wellness portrait representing human vitality"
                className="w-full h-[400px] sm:h-[450px] object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12392F]/60 via-transparent to-transparent pointer-events-none" />

              {/* Central Badge */}
              <div className="absolute bottom-5 left-4 right-4 text-center bg-[#FAF8F5]/95 backdrop-blur-md py-2.5 px-4 rounded-xl border border-[#E6DFD5] shadow-xs">
                <p className="font-display text-base font-semibold text-[#1E3A2F]">
                  Prakriti &amp; Vikriti Alignment
                </p>
                <p className="text-[11px] text-[#6B8E7D] font-mono uppercase tracking-wider">
                  Harmonizing 5 Vital Factors
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (3 Factors) */}
          <div className="lg:col-span-4 space-y-6">
            {factors.slice(2, 5).map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.title}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs space-y-2 relative group hover:border-[#1E3A2F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                        <Icon size={16} />
                      </div>
                      <h3 className="text-xs font-semibold tracking-wider uppercase text-[#1E3A2F] font-body">
                        {factor.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#C5A059] font-medium">
                      {factor.principle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
