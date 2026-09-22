import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Palette, Ruler, CheckCircle2, ChevronDown, ChevronUp, Beaker } from 'lucide-react';

export default function ComputerVisionSection() {
  const [showResearchDrawer, setShowResearchDrawer] = useState(false);

  const observationCategories = [
    {
      title: 'Surface Texture & Smoothness',
      icon: Grid,
      summary: 'Observes micro-topography, uniformity, and surface lines across localized cheek and forehead regions.',
      role: 'Assists in identifying temporary environmental roughness vs balanced barrier feel.'
    },
    {
      title: 'Color & Tone Distribution',
      icon: Palette,
      summary: 'Measures color consistency, micro-vascular warmth, and shadow contrast under controlled lighting.',
      role: 'Helps track fluctuations in skin tone warmth across changing seasons.'
    },
    {
      title: 'Facial Geometry & Proportion',
      icon: Ruler,
      summary: 'Evaluates structural facial proportions and regional symmetry across standardized landmarks.',
      role: 'Informs baseline morphological characteristics in combination with the questionnaire.'
    },
    {
      title: 'Capture Consistency Quality',
      icon: CheckCircle2,
      summary: 'Confirms that ambient illumination and focal clarity meet observation standards.',
      role: 'Guarantees that downstream reflections are grounded in consistent visual data.'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Structured Feature Extraction
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Seeing the details. <br/>
            <span className="italic text-[#6B8E7D] font-normal">Transforming light into structured signals.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Computer vision in AayurFace does not diagnose medical conditions. Instead, it measures subtle visual features—extracting calm, repeatable observations to help you notice how your skin responds to lifestyle, seasons, and daily care.
          </p>
        </motion.div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {observationCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 bg-white border border-[#E6DFD5] flex flex-col justify-between hover:border-[#C5A059] transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-6">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-editorial text-xl text-[#1A1F1C] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C6660] leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6DFD5] text-[11px] text-[#8A948E] italic">
                  {item.role}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Level 3: Research & Methodology Drawer */}
        <div className="max-w-4xl mx-auto border border-[#E6DFD5] bg-white p-5">
          <button
            onClick={() => setShowResearchDrawer(!showResearchDrawer)}
            className="w-full flex items-center justify-between text-left text-xs font-mono text-[#1E3A2F] uppercase tracking-wider font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Beaker size={14} className="text-[#C5A059]" />
              <span>Level 3 Research: Feature Extraction Methodology (CIELAB &amp; Texture Analysis)</span>
            </div>
            {showResearchDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showResearchDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 mt-4 border-t border-[#E6DFD5] text-xs text-[#5C6660] space-y-3 font-mono leading-relaxed"
              >
                <p>
                  <strong>Colorimetric Decoupling:</strong> Candidate feature extraction transforms RGB frames into the perceptual CIELAB color space. The lightness/melanin channel (<em>L*</em>) is isolated from the micro-vascular red-green chromatic channel (<em>a*</em>). This mathematically prevents baseline melanin pigment from being conflated with vascular erythema.
                </p>
                <p>
                  <strong>Texture Characterization:</strong> Gray-Level Co-occurrence Matrix (GLCM) entropy and contrast metrics evaluate surface roughness proxies independently of illumination intensity.
                </p>
                <p className="text-[#8A948E]">
                  <em>Note: These techniques represent candidate signal-extraction approaches under active research calibration and do not constitute clinical diagnostic measurements.</em>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
