import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What makes AayurFace different from generic AI skin scanners?',
      a: 'Most apps take an uncalibrated selfie and immediately attempt to sell cosmetic products. AayurFace treats your face as only ONE signal among four: combining objective visual observation with your Prakriti constitutional baseline, daily circadian lifestyle habits, and verified classical Ayurvedic knowledge.',
    },
    {
      q: 'Does my facial appearance alone determine my Prakriti (Dosha)?',
      a: 'No. This is a core architectural principle of AayurFace. In authentic Ayurveda, Prakriti is your inherent elemental constitution, determined through deep personal introspection and bodily tendencies. Facial observation provides dynamic clues about current balance (Vikriti), but never defines your constitution in isolation.',
    },
    {
      q: 'Is AayurFace a medical diagnostic tool?',
      a: 'No. AayurFace is an educational constitutional wellness platform. It is explicitly non-diagnostic and does not detect, diagnose, or treat dermatological diseases, acne pathology, or clinical skin conditions. Always consult a licensed medical dermatologist or Ayurvedic Vaidya for medical care.',
    },
    {
      q: 'How is my facial image processed, and is my data secure?',
      a: 'Initial frame quality checks (verifying lighting, framing, and sharpness) execute locally in your web browser. When you proceed with analysis, session data is transmitted over encrypted channels solely to generate your personal wellness report.',
    },
    {
      q: 'Why are standardized lighting and capture conditions required?',
      a: 'Uncontrolled selfies taken in yellow indoor lamps or harsh shadows skew digital colorimetry and exaggerate texture artificially. Standardized natural daylight (5200K) and centered framing ensure that observations reflect your true skin baseline rather than room lighting anomalies.',
    },
    {
      q: 'What will I receive after completing an assessment?',
      a: 'You receive a comprehensive, explainable wellness report detailing your visual observations, your constitutional tendencies, signal concordance, personalized Dinacharya (morning, midday, and evening) care rituals, botanical suggestions, and safety directives.',
    },
  ];

  return (
    <section id="faq" className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Frequently asked questions.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our multimodal approach, classical Ayurvedic grounding, and data ethics.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="border border-[#E6DFD5] bg-[#FAF8F5] rounded-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:text-[#1E3A2F] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-serif text-xl sm:text-2xl text-[#1A1F1C] font-medium">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-white border border-[#E6DFD5] text-[#1E3A2F] shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#5C6660] font-body leading-relaxed border-t border-[#E6DFD5]/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
