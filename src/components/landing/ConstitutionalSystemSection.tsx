import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Flame, Mountain, ShieldAlert } from 'lucide-react';

export default function ConstitutionalSystemSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'vata' | 'pitta' | 'kapha'>('all');

  const doshas = [
    {
      id: 'vata',
      name: 'Vata',
      sanskrit: 'वात',
      elements: 'Air + Space',
      essence: 'Movement, lightness, variability',
      icon: Wind,
      color: '#5B7B88',
      desc: 'Governs micro-circulation, sensory transmission, and moisture movement across tissues. When out of balance through erratic schedules or cold winds, skin may feel rough or depleted.',
      guidance: 'Nourishing, warming oils (such as sesame), consistent circadian sleep, and barrier protection against dry air.',
    },
    {
      id: 'pitta',
      name: 'Pitta',
      sanskrit: 'पित्त',
      elements: 'Fire + Water',
      essence: 'Heat, intensity, transformation',
      icon: Flame,
      color: '#C86D51',
      desc: 'Governs metabolic transformation, digestion (Agni), and cutaneous warmth. When agitated by spicy food, stress, or solar heat, skin may experience transient warmth or reactivity.',
      guidance: 'Cooling botanicals (sandalwood, vetiver, rose), shade during peak solar hours, and calming evening rituals.',
    },
    {
      id: 'kapha',
      name: 'Kapha',
      sanskrit: 'कफ',
      elements: 'Earth + Water',
      essence: 'Stability, structure, moisture',
      icon: Mountain,
      color: '#5C7C5A',
      desc: 'Governs deep tissue lubrication, cellular cohesion, and lipid equilibrium. When stagnant due to damp weather or inactivity, skin microcirculation may become sluggish.',
      guidance: 'Clarifying preparations (neem, triphala), gentle dry massage (Garshana), and light, invigoration-focused hydration.',
    },
  ];

  const displayedDoshas = activeTab === 'all' 
    ? doshas 
    : doshas.filter(d => d.id === activeTab);

  return (
    <section id="prakriti" className="w-full bg-[#FFFFFF] border-b border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Constitutional Foundations
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Prakriti is personal.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Ayurveda does not reduce people into rigid boxes. Your Prakriti is your inherent elemental blueprint, while your Vikriti reflects dynamic shifts in response to daily life, climate, and stress.
          </p>
        </motion.div>

        {/* Explicit Anti-Deterministic Architectural Principle Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-6 bg-[#FAF8F5] border border-[#C5A059]/50 rounded-sm mb-16 max-w-4xl mx-auto flex items-start gap-4 shadow-xs"
        >
          <div className="p-2 rounded-full bg-[#1E3A2F] text-[#C5A059] shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="font-display font-serif text-xl text-[#1E3A2F] font-semibold mb-1">
              Core Architectural Principle
            </h3>
            <p className="text-sm text-[#1A1F1C] font-body leading-relaxed">
              <strong>AayurFace does not define your constitution from your face alone.</strong> Prakriti is understood through broader personal context, questionnaire introspection, lifestyle habits, and metabolic tendencies. Facial observation is merely one dynamic signal in a larger constitutional conversation.
            </p>
          </div>
        </motion.div>

        {/* Dosha Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm">
            {(['all', 'vata', 'pitta', 'kapha'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#1E3A2F] text-white shadow-xs'
                    : 'text-[#5C6660] hover:text-[#1A1F1C]'
                }`}
              >
                {tab === 'all' ? 'All Archetypes' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Doshas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedDoshas.map((d, idx) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm hover:border-[#C5A059] transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6DFD5]">
                    <div>
                      <h3 className="font-display font-serif text-3xl text-[#1A1F1C] font-medium">
                        {d.name}
                      </h3>
                      <span className="text-xs font-mono text-[#C5A059]">
                        {d.sanskrit} · {d.elements}
                      </span>
                    </div>
                    <div 
                      className="p-3 rounded-full text-white"
                      style={{ backgroundColor: d.color }}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A948E] block mb-1 font-semibold">
                      Elemental Essence
                    </span>
                    <p className="text-sm font-medium text-[#1E3A2F] font-body">
                      {d.essence}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A948E] block mb-1 font-semibold">
                      Constitutional Expression
                    </span>
                    <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6DFD5] bg-white/60 p-3 rounded-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-1 font-semibold">
                    Harmonizing Care Concept
                  </span>
                  <p className="text-xs text-[#1E3A2F] font-body leading-relaxed">
                    {d.guidance}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
