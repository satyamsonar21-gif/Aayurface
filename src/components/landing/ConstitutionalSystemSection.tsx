import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Flame, Mountain, Info, Compass } from 'lucide-react';

export default function ConstitutionalSystemSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'vata' | 'pitta' | 'kapha'>('all');

  const doshaProfiles = [
    {
      id: 'vata',
      name: 'Vata',
      sanskrit: 'वात',
      elements: 'Air & Space (Vayu & Akasha)',
      icon: Wind,
      accentColor: '#5B7B88',
      qualities: 'Light, dry, mobile, subtle, cool',
      contextRole: 'Governs circulation, cellular movement, and sensory transmission across the body.',
      observationalConsiderations: 'May show susceptibility to dry winds, environmental moisture loss, and fluctuations in surface barrier feel under cold or erratic conditions.',
      ayurvedicGuidanceConcept: 'Supports warming nourishment, gentle daily grounding rituals, and shielding the barrier from dry seasonal air.'
    },
    {
      id: 'pitta',
      name: 'Pitta',
      sanskrit: 'पित्त',
      elements: 'Fire & Water (Tejas & Jala)',
      icon: Flame,
      accentColor: '#C86D51',
      qualities: 'Hot, sharp, light, slightly oily, intense',
      contextRole: 'Governs biochemical transformation, metabolic energy, skin warmth, and cellular assimilation.',
      observationalConsiderations: 'May exhibit heightened sensitivity to direct thermal exposure, sharp changes in diet, and temporary micro-vascular flush under intense sunlight or stress.',
      ayurvedicGuidanceConcept: 'Prioritizes thermal pacification, gentle cooling floral preparations, and shielding from solar intensity.'
    },
    {
      id: 'kapha',
      name: 'Kapha',
      sanskrit: 'कफ',
      elements: 'Earth & Water (Prithvi & Jala)',
      icon: Mountain,
      accentColor: '#5C7C5A',
      qualities: 'Heavy, slow, cool, oily, smooth, stable',
      contextRole: 'Governs structural integrity, lipid equilibrium, deep cutaneous hydration, and tissue cohesion.',
      observationalConsiderations: 'Naturally preserves sustained barrier moisture; may reflect sluggish microcirculation or heavier surface lipid sheen in humid environments.',
      ayurvedicGuidanceConcept: 'Focuses on gentle invigoration, clarifying botanical preparations, and maintaining natural lymphatic flow.'
    }
  ];

  const displayedDoshas = activeTab === 'all' 
    ? doshaProfiles 
    : doshaProfiles.filter(d => d.id === activeTab);

  return (
    <section id="prakriti" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Constitutional Individuality
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Prakriti: understanding <br/>
            <span className="italic text-[#6B8E7D] font-normal">the person before the skin.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            In classical Ayurveda, each individual possesses a distinct constitutional baseline known as <em>Prakriti</em>, formed by the equilibrium of three governing functional principles: Vata, Pitta, and Kapha.
          </p>
        </motion.div>

        {/* CRITICAL ETHICAL INVARIANT STATEMENT BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto mb-16 bg-[#FAF8F5] border border-[#E6DFD5] p-5 sm:p-6 flex items-start gap-4"
        >
          <Info size={20} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
            <strong className="text-[#1E3A2F] font-semibold block mb-1">
              AayurFace Architectural Principle:
            </strong>
            Facial appearance alone is not treated as a complete representation of constitutional individuality. Ayurvedic constitutional context is one component of a broader understanding, informed by structured personal context, observation, and daily lifestyle rhythms.
          </div>
        </motion.div>

        {/* Tab Filter */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
              activeTab === 'all'
                ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                : 'bg-white text-[#5C6660] border-[#E6DFD5] hover:border-[#C5A059]'
            }`}
          >
            All Three Principles
          </button>
          {doshaProfiles.map(dosha => (
            <button
              key={dosha.id}
              onClick={() => setActiveTab(dosha.id as any)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                activeTab === dosha.id
                  ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                  : 'bg-white text-[#5C6660] border-[#E6DFD5] hover:border-[#C5A059]'
              }`}
            >
              {dosha.name} ({dosha.sanskrit})
            </button>
          ))}
        </div>

        {/* Dosha Cards Grid */}
        <div className={`grid grid-cols-1 ${activeTab === 'all' ? 'lg:grid-cols-3' : 'max-w-2xl mx-auto'} gap-8`}>
          {displayedDoshas.map((dosha, idx) => {
            const Icon = dosha.icon;
            return (
              <motion.div
                key={dosha.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FAF8F5] border border-[#E6DFD5] p-8 sm:p-10 flex flex-col justify-between relative group hover:border-[#C5A059]/60 transition-colors"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6DFD5]">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: dosha.accentColor }}
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-editorial text-2xl text-[#1A1F1C]">
                          {dosha.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#8A948E] block">
                          {dosha.sanskrit}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                      Principle
                    </span>
                  </div>

                  {/* Primary Elements */}
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A948E] block mb-1">
                      Elemental Composition
                    </span>
                    <p className="text-xs font-mono text-[#1E3A2F] font-semibold">
                      {dosha.elements}
                    </p>
                  </div>

                  {/* Lived Role */}
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A948E] block mb-1">
                      Physiological &amp; Skin Role
                    </span>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {dosha.contextRole}
                    </p>
                  </div>

                  {/* Observational Considerations */}
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A948E] block mb-1">
                      Contextual Observation
                    </span>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {dosha.observationalConsiderations}
                    </p>
                  </div>

                  {/* Ayurvedic Guidance Concept */}
                  <div className="p-4 bg-white border border-[#E6DFD5]">
                    <div className="flex items-center gap-1.5 mb-1 text-[#1E3A2F]">
                      <Compass size={13} className="text-[#C5A059]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                        Wellness Direction
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {dosha.ayurvedicGuidanceConcept}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E6DFD5] text-[10px] font-mono text-[#8A948E]">
                  Constitutional archetype · Lived context
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
