import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export default function KnowledgeEngineSection() {
  const [showClassicalDrawer, setShowClassicalDrawer] = useState(false);

  const botanicals = [
    {
      name: 'Neem',
      sanskrit: 'Nimba',
      guna: 'Tikta, Laghu',
      action: 'Clarifying & Cooling',
      desc: 'Revered in Charaka Samhita for pacifying Pitta and Kapha heat, supporting skin purification and balance.',
    },
    {
      name: 'Turmeric',
      sanskrit: 'Haridra',
      guna: 'Katu, Tikta, Ruksha',
      action: 'Radiance & Vitality',
      desc: 'Classical Varnya herb documented across Ayurvedic treatises for promoting natural skin tone and barrier resilience.',
    },
    {
      name: 'Sandalwood',
      sanskrit: 'Chandana',
      guna: 'Madhura, Sita',
      action: 'Calming & Pacifying',
      desc: 'Ground on traditional stone with pure water to soothe thermal sensitivity and environmental agitation.',
    },
    {
      name: 'Vetiver',
      sanskrit: 'Ushira',
      guna: 'Madhura, Tikta, Sita',
      action: 'Deep Hydration & Grounding',
      desc: 'Cooling root extract traditionally steeped in brass vessels to stabilize moisture balance during hot seasons.',
    },
    {
      name: 'Sesame',
      sanskrit: 'Tila',
      guna: 'Guru, Snigdha, Ushna',
      action: 'Nourishing & Protective',
      desc: 'The preeminent base oil in classical Ayurveda, penetrating deep Dhatus to pacify Vata dryness.',
    },
    {
      name: 'Aloe',
      sanskrit: 'Kumari',
      guna: 'Madhura, Tikta, Sita',
      action: 'Soothing Barrier Care',
      desc: 'Rich in regenerative mucilage that cools aggravated surface redness while sustaining barrier hydration.',
    },
  ];

  return (
    <section id="ayurvedic-intelligence" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Exact Required Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Ayurvedic Epistemology
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Knowledge with roots.
          </h2>
          <p className="text-lg sm:text-xl text-[#1E3A2F] font-display font-serif italic mb-4">
            "AayurFace connects personal context with Ayurvedic knowledge to make guidance more meaningful."
          </p>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Ayurveda is not a decorative aesthetic or a marketing theme—it is the epistemological foundation of our platform. Classical compendiums provide the verified principles through which modern observations are interpreted.
          </p>
        </motion.div>

        {/* Feature Split: Botanical Still-Life & Epistemic Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left: Authentic Museum-Grade Botanical Still Life (NO HUMANS) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="p-3 bg-white border border-[#E6DFD5] shadow-md rounded-sm overflow-hidden">
              <img
                src="/images/landing/ayurvedic-herbs-still-life.jpg"
                alt="Authentic Ayurvedic botanical ingredients: fresh neem leaves, turmeric roots, sandalwood paste on stone slab, vetiver roots in brass vessel"
                className="w-full aspect-[4/3] object-cover rounded-xs"
                loading="lazy"
              />
              <div className="p-4 bg-[#FAF8F5] border-t border-[#E6DFD5] flex items-center justify-between text-[11px] font-mono text-[#5C6660]">
                <span>Pure Botanical Ingredients</span>
                <span className="text-[#C5A059] font-medium">Neem · Turmeric · Sandalwood · Vetiver</span>
              </div>
            </div>
          </motion.div>

          {/* Right: The Knowledge Architecture Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-6 space-y-4"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A948E] block font-semibold">
              The Epistemic Pipeline
            </span>

            <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm flex items-start gap-4 shadow-xs">
              <span className="font-mono text-xs font-semibold text-[#C5A059] mt-0.5">01</span>
              <div>
                <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C]">
                  Classical Samhita Treatises
                </h3>
                <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-1">
                  Rooted in Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya. Foundational definitions of constitutional balance, Agni, and seasonal rhythms.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm flex items-start gap-4 shadow-xs">
              <span className="font-mono text-xs font-semibold text-[#C5A059] mt-0.5">02</span>
              <div>
                <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C]">
                  Structured Knowledge Modeling
                </h3>
                <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-1">
                  Qualitative relationships between Gunas (attributes), Rasas (tastes), and Doshic states structured into verifiable medical ontologies.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm flex items-start gap-4 shadow-xs">
              <span className="font-mono text-xs font-semibold text-[#C5A059] mt-0.5">03</span>
              <div>
                <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C]">
                  Contextual Interpretation
                </h3>
                <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-1">
                  Observations are cross-referenced with your individual Prakriti baseline, recent sleep patterns, and ambient season rather than evaluated in a vacuum.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E6DFD5] rounded-sm flex items-start gap-4 shadow-xs">
              <span className="font-mono text-xs font-semibold text-[#C5A059] mt-0.5">04</span>
              <div>
                <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C]">
                  Actionable Wellness Guidance
                </h3>
                <p className="text-xs text-[#5C6660] font-body leading-relaxed mt-1">
                  Generates understandable, calm Dinacharya recommendations and botanical suggestions accompanied by mandatory patch-test safety protocols.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Six Botanical Pillars Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E6DFD5]">
            <h3 className="font-display font-serif text-2xl text-[#1A1F1C] font-medium">
              Verified Ayurvedic Botanicals
            </h3>
            <span className="text-[11px] font-mono text-[#8A948E]">
              Dravyaguna Herbaceous Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {botanicals.map((herb) => (
              <div
                key={herb.name}
                className="p-5 bg-white border border-[#E6DFD5] rounded-sm hover:border-[#C5A059] transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-serif text-xl text-[#1A1F1C] font-medium">
                    {herb.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#C5A059] font-medium uppercase tracking-wider">
                    {herb.sanskrit}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#6B8E7D] uppercase tracking-wider mb-2">
                  {herb.action} · {herb.guna}
                </div>
                <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                  {herb.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3 Expandable Samhitas Reference Drawer */}
        <div className="w-full max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setShowClassicalDrawer(!showClassicalDrawer)}
            className="w-full py-3.5 px-6 border border-[#E6DFD5] bg-white hover:bg-[#F3EFEA] text-[#1E3A2F] text-xs font-mono uppercase tracking-widest flex items-center justify-between transition-colors rounded-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-[#C5A059]" />
              <span>Level 3: Classical Treatises &amp; Citation Integrity</span>
            </div>
            {showClassicalDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showClassicalDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-white border-x border-b border-[#E6DFD5] p-6 text-xs text-[#5C6660] space-y-3"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-[#6B8E7D] mt-0.5 shrink-0" />
                  <p>
                    <strong>Citation Discipline:</strong> AayurFace strictly adheres to verified classical sources (Sushruta Samhita, Charaka Samhita, Ashtanga Hridaya, Bhavaprakasha). We never synthesize or invent verse numbers or quote non-existent Sanskrit verses.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-[#6B8E7D] mt-0.5 shrink-0" />
                  <p>
                    <strong>Knowledge Retrieval:</strong> Relevant classical recommendations are matched using semantic embeddings over verified Ayurvedic texts, providing transparent provenance for every suggestion.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
