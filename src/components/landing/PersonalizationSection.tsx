import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset, AlertCircle, Sparkles } from 'lucide-react';

export default function PersonalizationSection() {
  const dailyRhythms = [
    {
      period: 'MORNING (PRATAHKAL)',
      icon: Sunrise,
      title: 'Awakening & Hydration',
      focus: 'Gentle Cleansing & Barrier Shielding',
      narrative: 'Aligning with sunrise to awaken cutaneous microcirculation, balance overnight moisture, and prepare skin for daily solar exposure.'
    },
    {
      period: 'MIDDAY (MADHYANHA)',
      icon: Sun,
      title: 'Thermal Equilibrium',
      focus: 'Solar Calming & Pitta Pacification',
      narrative: 'When solar warmth peaks, routines emphasize cooling hydration and gentle shade, avoiding aggravating internal and external heat.'
    },
    {
      period: 'EVENING (SANDHYAKAL)',
      icon: Sunset,
      title: 'Restoration & Repair',
      focus: 'Cellular Wind-Down & Lipid Replenishment',
      narrative: 'As dusk approaches, restorative botanicals and gentle facial pressure assist nocturnal recovery, grounding the nervous system before rest.'
    }
  ];

  const botanicalKnowledge = [
    {
      name: 'Kumkumadi Taila',
      role: 'Classical Saffron & Herb Infusion',
      context: 'Traditionally prepared to nourish skin vitality, impart natural radiance, and support tone uniformity.'
    },
    {
      name: 'Chandana (Sandalwood)',
      role: 'Thermal Pacifier',
      context: 'Recognized in Charaka Samhita for natural cooling qualities, calming reactive skin warmth.'
    },
    {
      name: 'Ushira (Vetiver)',
      role: 'Aromatic Balancer',
      context: 'Prized for deep, grounding hydration and soothing midday environmental stress.'
    },
    {
      name: 'Triphala',
      role: 'Three-Fruit Clarifier',
      context: 'Classic synergy of Amalaki, Bibhitaki, and Haritaki providing gentle clarification and antioxidant support.'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-[#E6DFD5] pb-12"
        >
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
              Contextual Care
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12]">
              Guidance is contextual. <br/>
              <span className="italic text-[#6B8E7D] font-normal">Never a one-size-fits-all formula.</span>
            </h2>
          </div>
          <p className="text-base text-[#5C6660] font-body max-w-sm leading-relaxed">
            Ayurveda does not believe in static labels. AayurFace suggests care rituals calibrated to your constitution, the current season, and the time of day—without commercial sales pitches.
          </p>
        </motion.div>

        {/* Dinacharya Daily Rhythm Cards */}
        <div className="mb-20">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A948E] block mb-6">
            Dinacharya — The Daily Circadian Rhythm
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dailyRhythms.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 bg-white border border-[#E6DFD5] flex flex-col justify-between hover:border-[#C5A059] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E6DFD5]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold">
                        {item.period}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                        <Icon size={15} />
                      </div>
                    </div>

                    <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-2">
                      {item.title}
                    </h3>
                    
                    <span className="text-xs font-mono text-[#6B8E7D] block mb-4">
                      {item.focus}
                    </span>

                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {item.narrative}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E6DFD5] text-[10px] font-mono text-[#8A948E]">
                    Dynamic Circadian Alignment
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Botanical Knowledge System (Dravyaguna) */}
        <div className="p-8 sm:p-10 bg-white border border-[#E6DFD5] mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-[#C5A059]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
              Botanical Intelligence (Dravyaguna) — Contextual Examples
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {botanicalKnowledge.map(botanical => (
              <div key={botanical.name} className="p-4 bg-[#FAF8F5] border border-[#E6DFD5]">
                <h4 className="font-editorial text-xl text-[#1E3A2F] mb-1">{botanical.name}</h4>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase block mb-2">{botanical.role}</span>
                <p className="text-xs text-[#5C6660] leading-relaxed">{botanical.context}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Safety Directive */}
        <div className="max-w-3xl mx-auto p-4 bg-[#FAF8F5] border border-[#C5A059]/40 flex items-center gap-3 text-xs text-[#5C6660]">
          <AlertCircle size={18} className="text-[#C5A059] flex-shrink-0" />
          <span>
            <strong>Mandatory Safety Directive:</strong> All topical herbal preparations should undergo a 24-hour patch test behind the ear prior to routine application.
          </span>
        </div>

      </div>
    </section>
  );
}
