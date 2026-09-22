export default function PositioningStrip() {
  const anchors = [
    {
      title: 'STANDARDIZED OBSERVATION',
      desc: 'Controlled client-side capture ensuring reproducible lighting, orientation, and motion stability.'
    },
    {
      title: 'AYURVEDIC KNOWLEDGE',
      desc: 'Rooted in classical Charaka Samhita and Ashtanga Hridaya constitutional dosha principles.'
    },
    {
      title: 'PERSONAL CONTEXT',
      desc: 'Integrating circadian sleep rhythms, daily routines, climate variations, and diet.'
    },
    {
      title: 'EXPLAINABLE GUIDANCE',
      desc: 'Transparent reasoning preserving uncertainty, without black-box diagnostic claims.'
    }
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {anchors.map((item, idx) => (
            <div
              key={item.title}
              className={`space-y-2 ${
                idx !== 0 ? 'lg:pl-8' : ''
              } ${
                idx !== anchors.length - 1 ? 'lg:pr-8 lg:border-r border-[#E6DFD5]' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#1E3A2F] font-body">
                  {item.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
