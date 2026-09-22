export default function AyurvedaTechSection() {
  const pipeline = [
    {
      step: '01',
      title: 'Classical Ayurvedic Foundations',
      desc: 'Codified in the Charaka Samhita and Ashtanga Hridaya, analyzing how the three biological energies (Vata, Pitta, Kapha) govern cellular moisture, radiance, and tissue tone.'
    },
    {
      step: '02',
      title: 'Structured Knowledge System',
      desc: 'Translating classical Sanskrit Dravyaguna herbology into structured relationships between plant botanicals, elemental qualities, and skin barrier requirements.'
    },
    {
      step: '03',
      title: 'Objective Computer Vision',
      desc: 'Standardized client-side frame processing calculates texture uniformity, specular shine distribution, and surface hydration proxies with mathematical repeatability.'
    },
    {
      step: '04',
      title: 'Multimodal Personal Context',
      desc: 'Cross-correlates facial observations with circadian sleep rhythm, local seasonal transitions (Ritucharya), and self-reported wellness habits.'
    },
    {
      step: '05',
      title: 'Explainable Wellness Guidance',
      desc: 'Synthesizes transparent topical herbal recipes (Lepas), nourishing oils (Tailas), and daily Dinacharya rituals with full evidentiary rationale.'
    }
  ];

  return (
    <section id="ayurveda" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
              THE METHODOLOGICAL BRIDGE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C] leading-[1.12]">
              Ancient principles.<br />
              <span className="italic font-normal text-[#1E3A2F]">Modern observation.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-[#5C6660] leading-relaxed">
              We do not claim to replace clinical dermatology. Rather, we build a disciplined bridge between timeless Ayurvedic wellness principles and modern, privacy-preserving visual technology.
            </p>
          </div>
        </div>

        {/* Visual & Pipeline Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Botanical Still Life Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FAF8F5] shadow-md">
              <img
                src="/images/landing/botanical-still-life.jpg"
                alt="Ayurvedic stone mortar, kumkumadi oil, saffron, neem sprig, and raw turmeric on linen"
                className="w-full h-[520px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12392F]/40 to-transparent pointer-events-none" />

              {/* Tag in bottom corner */}
              <div className="absolute bottom-5 left-5 bg-[#FAF8F5]/90 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#E6DFD5] text-xs text-[#1E3A2F] font-medium shadow-xs">
                Authentic Classical Herbology (Dravyaguna)
              </div>
            </div>
          </div>

          {/* Right: The 5-Step Pipeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative pl-6 space-y-8 border-l border-[#E6DFD5]">
              {pipeline.map((item) => (
                <div key={item.step} className="relative group">
                  {/* Step Dot */}
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#FAF8F5] border-2 border-[#1E3A2F] group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-colors" />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#C5A059] font-semibold">{item.step}</span>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1F1C]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
