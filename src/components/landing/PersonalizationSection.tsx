import { Sunrise, Sun, Sunset } from 'lucide-react';

export default function PersonalizationSection() {
  const schedule = [
    {
      period: 'MORNING (PRATAHKAL)',
      icon: Sunrise,
      title: 'Gentle Awakening & Barrier Nourishment',
      ritual: 'Rosewater or lukewarm raw milk rinse followed by 3 drops of warm Kumkumadi Taila, gently pressed with palms along the jawline and temples.',
      tag: 'Vata-Pitta Pacification'
    },
    {
      period: 'MIDDAY (MADHYANHA)',
      icon: Sun,
      title: 'Thermal Calming & Hydration',
      ritual: 'Cooling Vetiver (Khus) aromatic floral mist across the face. Hydration with room-temperature cumin-coriander-fennel infusion.',
      tag: 'Pitta Heat Balance'
    },
    {
      period: 'EVENING (SANDHYAKAL)',
      icon: Sunset,
      title: 'Restorative Lepa & Circadian Wind-down',
      ritual: 'Weekly Sandalwood (Chandana) & Licorice (Yashtimadhu) purifying herbal mask with pure aloe gel, followed by gentle massage and screen wind-down.',
      tag: 'Cellular Rejuvenation (Rasayana)'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            BESPOKE AYURVEDIC CARE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            A daily rhythm shaped for your constitution.
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            Instead of a rigid shelf of generic synthetic chemicals, AayurFace crafts a disciplined, natural Dinacharya rhythm that honors the time of day and your skin&apos;s natural state.
          </p>
        </div>

        {/* Editorial Split: Lifestyle Imagery vs. Wellness Rhythm */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Lifestyle Wellness Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-md">
              <img
                src="/images/landing/wellness-lifestyle.jpg"
                alt="South Asian woman mindfully applying botanical facial oil in sunlit morning room"
                className="w-full h-[480px] sm:h-[540px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12392F]/50 via-transparent to-transparent pointer-events-none" />

              {/* Tag */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FAF8F5]/95 backdrop-blur-md p-4 rounded-xl border border-[#E6DFD5] text-xs text-[#1E3A2F] flex items-center justify-between">
                <div>
                  <p className="font-display text-base font-semibold">Dinacharya: The Daily Sacred Rhythm</p>
                  <p className="text-[11px] text-[#5C6660]">Grounded rituals tailored to your unique Prakriti</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              </div>
            </div>
          </div>

          {/* Right: The 3 Rhythms */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              {schedule.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.period}
                    className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs space-y-3 relative group hover:border-[#1E3A2F]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                          <Icon size={16} />
                        </div>
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6B8E7D]">
                          {item.period}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#C5A059] bg-[#FAF8F5] px-2.5 py-0.5 rounded border border-[#E6DFD5]">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-[#1A1F1C]">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                      {item.ritual}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
