import { ArrowRight, Compass } from 'lucide-react';

export default function WhySection() {
  return (
    <section id="about" className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
              CONSTITUTIONAL PERSPECTIVE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C] leading-[1.12]">
              Your skin tells only<br />
              <span className="italic font-normal text-[#1E3A2F]">part of the story.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <p className="text-base text-[#5C6660] leading-relaxed">
              Conventional skincare often isolates surface symptoms with quick synthetic fixes. Ayurveda recognizes the face as a living canvas reflecting deeper systemic balance — where visible texture, natural sebum flow, and skin temperature are dynamic conversations between your constitution (<em className="text-[#1E3A2F] font-medium">Prakriti</em>), current imbalances (<em className="text-[#1E3A2F] font-medium">Vikriti</em>), and daily habits.
            </p>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A2F] hover:text-[#C5A059] transition-colors group"
            >
              <span>Explore the multi-layer methodology</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Asymmetric Layered Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-6">
          {/* Left: Deep Insight Editorial Points */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="border-l-2 border-[#1E3A2F] pl-6 space-y-2">
              <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                Beyond Surface Symptoms
              </h3>
              <p className="text-sm text-[#5C6660] leading-relaxed">
                A dry cheek patch is rarely just dryness. In Ayurveda, it represents elevated Vata aggravated by cold winds or irregular rest. A flare of warmth on the nose or forehead often points to inflamed Pitta. We look at the interplay, not just the isolated pixel.
              </p>
            </div>

            <div className="border-l-2 border-[#C5A059] pl-6 space-y-2">
              <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                Prakriti vs. Vikriti
              </h3>
              <p className="text-sm text-[#5C6660] leading-relaxed">
                Your birth constitution is permanent (<span className="text-[#1E3A2F] font-medium">Prakriti</span>), but your current skin state (<span className="text-[#1E3A2F] font-medium">Vikriti</span>) shifts with the weather, travel, stress, and sleep. Effective care pacifies the present imbalance without disrupting your core nature.
              </p>
            </div>

            <div className="border-l-2 border-[#6B8E7D] pl-6 space-y-2">
              <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                Gentle Botanical Synchrony
              </h3>
              <p className="text-sm text-[#5C6660] leading-relaxed">
                Rather than harsh stripping cleansers, classical herbs like Sandalwood, Manjistha, Neem, and Kumkumadi nurture the micro-biome and lipid barrier naturally through time-tested lipophilic infusion.
              </p>
            </div>
          </div>

          {/* Right: Layered Visual Composition */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-md">
              <img
                src="/images/auth-bg.jpg"
                alt="Ayurvedic pure botanical herbs, golden oil, and turmeric bowl in natural light"
                className="w-full h-[440px] sm:h-[480px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12392F]/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Information Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FAF8F5]/95 backdrop-blur-md p-5 rounded-xl border border-[#E6DFD5] shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B8E7D] font-semibold">
                    Classical Observation Matrix
                  </span>
                  <Compass size={16} className="text-[#C5A059]" />
                </div>
                <p className="font-display text-lg text-[#1A1F1C] italic">
                  &ldquo;Yatha pinde tatha brahmande&rdquo;
                </p>
                <p className="text-xs text-[#5C6660]">
                  As is the individual, so is the universal nature. Skin is a direct reflection of inner elemental harmony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
