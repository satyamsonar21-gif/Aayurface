import { motion } from 'framer-motion';
import { Eye, User, Sparkles, CheckCircle2, ShieldCheck, Clock, Sun, Moon, AlertCircle } from 'lucide-react';

export default function ProductPreviewSection() {
  return (
    <section id="product-preview" className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Honest Product Preview
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            What your AayurFace <br/>
            <span className="italic text-[#1E3A2F] font-normal">experience looks like.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            No vague scores or mysterious algorithms. Here is a realistic view of the comprehensive, grounded wellness report you receive after completing your assessment.
          </p>
        </motion.div>

        {/* Realistic Product Dashboard Window (Styled authentically to AayurFace design language) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm shadow-lg overflow-hidden"
        >
          
          {/* Top Window Bar */}
          <div className="bg-[#1E3A2F] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A059]/30">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FAF8F5]">
                AayurFace Assessment Report · Session #1048
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#C8B89A]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Capture Validated (5200K Natural Light)
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-sm text-white">
                Prakriti: Pitta-Vata
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Row 1: The Three Core Context Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1: Visual Observations */}
              <div className="bg-white p-6 border border-[#E6DFD5] rounded-sm shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-[#1E3A2F]">
                  <Eye size={16} className="text-[#C5A059]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Visual Observations
                  </span>
                </div>
                <div className="space-y-2 text-xs font-body text-[#5C6660]">
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Calibrated Tone:</span>
                    <strong className="text-[#1A1F1C]">Warm Golden Undertone</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Surface Hydration:</span>
                    <strong className="text-[#1A1F1C]">Normal Forehead / Dry Perioral</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Erythema Index:</span>
                    <strong className="text-amber-700">Mild Malar Flush (Pitta sign)</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Ayurvedic Context */}
              <div className="bg-white p-6 border border-[#E6DFD5] rounded-sm shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-[#1E3A2F]">
                  <User size={16} className="text-[#C5A059]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Ayurvedic Context
                  </span>
                </div>
                <div className="space-y-2 text-xs font-body text-[#5C6660]">
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Inherent Prakriti:</span>
                    <strong className="text-[#1A1F1C]">Pitta Primary, Vata Secondary</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Metabolic Agni:</span>
                    <strong className="text-[#1A1F1C]">Tikshnagni (Intense / Fast)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Seasonal Influence:</span>
                    <strong className="text-[#1E3A2F]">Grishma Ritu (Summer Heat)</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Personal Context */}
              <div className="bg-white p-6 border border-[#E6DFD5] rounded-sm shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-[#1E3A2F]">
                  <Clock size={16} className="text-[#C5A059]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Personal Context
                  </span>
                </div>
                <div className="space-y-2 text-xs font-body text-[#5C6660]">
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Sleep Rhythm:</span>
                    <strong className="text-[#1A1F1C]">6.2 hrs · Late bedtime (Vata shift)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E6DFD5]/60">
                    <span>Water Intake:</span>
                    <strong className="text-[#1A1F1C]">1.8 L / day</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Regional Humidity:</span>
                    <strong className="text-[#1A1F1C]">Dry Heat (42% RH)</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: Confidence & Signal Concordance Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-semibold">
                    Multi-Signal Agreement: High Concordance
                  </h4>
                  <p className="text-xs text-emerald-800 font-body">
                    Visual surface warmth correlates directly with your reported late sleep hours and current summer climate.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-white px-3 py-1 rounded-sm border border-emerald-300 shrink-0">
                Evidence Verified
              </span>
            </div>

            {/* Row 3: Personalized Dinacharya Guidance (Morning / Midday / Evening) */}
            <div className="bg-white p-6 sm:p-8 border border-[#E6DFD5] rounded-sm shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E6DFD5]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-semibold">
                    Tailored Daily Rituals
                  </span>
                  <h3 className="font-display font-serif text-2xl text-[#1A1F1C] font-medium">
                    Personalized Dinacharya Routine
                  </h3>
                </div>
                <Sparkles size={18} className="text-[#C5A059]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Morning */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                    <Sun size={15} />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      Pratahkal (Morning)
                    </span>
                  </div>
                  <h5 className="font-display font-serif text-base text-[#1A1F1C] font-medium mb-1">
                    Cooling Floral Mist &amp; Light Lepa
                  </h5>
                  <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                    Cleanse with lukewarm water. Spritz pure organic Vetiver (Ushira) and Rosewater to pacify morning surface heat.
                  </p>
                </div>

                {/* Midday */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                    <Sun size={15} />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      Madhyanha (Midday)
                    </span>
                  </div>
                  <h5 className="font-display font-serif text-base text-[#1A1F1C] font-medium mb-1">
                    Solar Protection &amp; Hydration
                  </h5>
                  <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                    Avoid direct solar exposure during peak Pitta hours (11:00 AM – 2:00 PM). Hydrate with coriander-infused cool water.
                  </p>
                </div>

                {/* Evening */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                    <Moon size={15} />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      Sandhyakal (Evening)
                    </span>
                  </div>
                  <h5 className="font-display font-serif text-base text-[#1A1F1C] font-medium mb-1">
                    Nourishing Kumkumadi Ritual
                  </h5>
                  <p className="text-xs text-[#5C6660] font-body leading-relaxed">
                    Gently press 2–3 drops of authentic Kumkumadi Taila into slightly damp skin to nourish the Vata dry barrier overnight.
                  </p>
                </div>

              </div>
            </div>

            {/* Row 4: Next Steps & Safety Protocol */}
            <div className="p-4 bg-[#FAF8F5] border border-[#C5A059]/50 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-[#C5A059] shrink-0" />
                <p className="text-xs text-[#1E3A2F] font-body">
                  <strong className="font-semibold">Mandatory 24-Hour Patch Test:</strong> Always test any botanical preparation on your inner forearm before full facial application.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#5C6660] shrink-0">
                Next Review: Day 30
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
