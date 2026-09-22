export default function JourneySection() {
  const steps = [
    {
      num: '01',
      title: 'OBSERVE',
      subtitle: 'Standardized Capture',
      desc: 'Guided in-browser face capture verifies lighting, face centering, and motion clarity under balanced natural daylight.'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      subtitle: 'Constitutional Mapping',
      desc: 'Correlates observed skin surface characteristics with inherent constitution (Prakriti) and transient imbalances (Vikriti).'
    },
    {
      num: '03',
      title: 'PERSONALIZE',
      subtitle: 'Bespoke Dinacharya',
      desc: 'Generates tailored herbal recipes (Lepas), pacifying oils (Tailas), and daily morning-to-evening care rituals.'
    },
    {
      num: '04',
      title: 'TRACK',
      subtitle: 'Longitudinal Balance',
      desc: 'Follow natural 30-to-90 day epidermal renewal cycles and seasonal transitions (Ritucharya) with quiet confidence.'
    }
  ];

  return (
    <section id="journey" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            THE OBSERVATION JOURNEY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            A Thoughtful Path to Constitutional Balance
          </h2>
          <p className="text-base text-[#5C6660] max-w-xl mx-auto leading-relaxed">
            Ayurveda honors skin care as an ongoing meditative rhythm rather than an overnight aggressive transformation.
          </p>
        </div>

        {/* Horizontal Editorial Timeline (Desktop) & Vertical (Mobile) */}
        <div className="relative pt-8">
          {/* Subtle Horizontal Rule across steps (Desktop only) */}
          <div className="hidden lg:block absolute top-[68px] left-[5%] right-[5%] h-[1px] bg-[#E6DFD5] -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col space-y-4 group">
                {/* Number & Dot Anchor */}
                <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                  <span className="font-display text-4xl sm:text-5xl font-semibold text-[#C5A059] transition-transform duration-300 group-hover:-translate-y-1">
                    {step.num}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-[#FAF8F5] border-2 border-[#1E3A2F] group-hover:bg-[#1E3A2F] transition-colors" />
                </div>

                {/* Title and Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#6B8E7D] uppercase tracking-wider font-body">
                    {step.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5C6660] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
