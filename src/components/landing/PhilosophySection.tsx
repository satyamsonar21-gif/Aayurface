export default function PhilosophySection() {
  const tenets = [
    {
      title: 'Prakriti (Inherent Constitution)',
      desc: 'Your unique elemental blueprint at birth. Understanding whether you lean toward Vata, Pitta, or Kapha unlocks lasting self-compassion and customized skin care.'
    },
    {
      title: 'Vikriti (Current Imbalance)',
      desc: 'The dynamic state of your skin today. Stress, travel, climate, and diet cause fluctuations that can be gently pacified with the right opposing botanical qualities.'
    },
    {
      title: 'Dinacharya (Daily Rhythm)',
      desc: 'Aligning skin rituals with circadian solar cycles — cooling in the midday sun, hydrating in the morning, and detoxifying through evening herbal Lepas.'
    },
    {
      title: 'Dravyaguna (Plant Intelligence)',
      desc: 'Using pure whole-plant botanicals like Sandalwood, Neem, and Turmeric, where natural active compounds work synergistically with your skin barrier.'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
              FOUNDATIONAL TENETS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C] leading-[1.12]">
              Living in rhythm<br />
              <span className="italic font-normal text-[#1E3A2F]">with natural balance.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-[#5C6660] leading-relaxed">
              Classical Ayurveda views human wellness not as a battlefield against aging, but as an artful, continuous dance of equilibrium between inner and outer nature.
            </p>
          </div>
        </div>

        {/* Split: Organic Visual & Tenets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Textured Ceramic & Stone Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-md">
              <img
                src="/images/landing/ayurvedic-textures.jpg"
                alt="Handcrafted ceramic bowl with botanical herbs, dried roses, and smooth river stones in soft morning light"
                className="w-full h-[480px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12392F]/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 bg-[#FAF8F5]/90 backdrop-blur-md p-4 rounded-xl border border-[#E6DFD5]">
                <p className="font-display text-sm font-semibold text-[#1E3A2F]">
                  &ldquo;Swastha&rdquo; — Being established in one&apos;s true natural self
                </p>
                <p className="text-[11px] text-[#5C6660]">Sushruta Samhita, Sutrasthana 15.41</p>
              </div>
            </div>
          </div>

          {/* Right: Tenets List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tenets.map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs space-y-2 hover:border-[#1E3A2F]/40 transition-colors"
                >
                  <div className="w-6 h-[2px] bg-[#C5A059] mb-3" />
                  <h3 className="font-display text-xl font-semibold text-[#1A1F1C]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
