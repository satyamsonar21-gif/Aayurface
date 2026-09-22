import { motion } from 'framer-motion';
import { Lock, EyeOff, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function PrivacyTrustSection() {
  const privacyPillars = [
    {
      title: 'What We Capture',
      icon: Lock,
      desc: 'A standardized facial image captured under guided natural light, paired with your self-reported Prakriti and lifestyle questionnaire.',
    },
    {
      title: 'Why It Is Needed',
      icon: FileText,
      desc: 'To extract objective surface colorimetry (CIELAB) and relative hydration proxies, correlating them with classical Ayurvedic principles.',
    },
    {
      title: 'How Processing Works',
      icon: EyeOff,
      desc: 'Initial frame quality checks (lighting, framing, focus) run client-side directly in your browser. Encrypted transmission protects active sessions.',
    },
    {
      title: 'What We Do Not Claim',
      icon: AlertCircle,
      desc: 'AayurFace is NOT a medical diagnostic tool. We never claim to detect, diagnose, or treat dermatological diseases or clinical conditions.',
    },
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
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
            Data Ethics &amp; Transparency
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Your face is personal.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            We treat biometric and constitutional data with the utmost respect. Here is how your information is handled—truthfully and without misleading marketing guarantees.
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {privacyPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-8 bg-white border border-[#E6DFD5] rounded-sm hover:border-[#C5A059] transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-5">
                    <Icon size={18} className="text-[#C5A059]" />
                  </div>
                  <h3 className="font-display font-serif text-xl text-[#1A1F1C] mb-2 font-medium">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Responsible AI Invariant Banner */}
        <div className="p-6 sm:p-8 bg-[#1E3A2F] text-[#FAF8F5] rounded-sm border border-[#C5A059]/40 max-w-4xl mx-auto shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#C5A059] shrink-0 mt-1" />
            <div>
              <h4 className="font-display font-serif text-xl sm:text-2xl text-white font-medium mb-2">
                Responsible AI &amp; Non-Diagnostic Standard
              </h4>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-body leading-relaxed">
                AayurFace communicates uncertainty openly, avoids overclaiming, clearly distinguishes physical observation from holistic interpretation, and presents wellness guidance solely for educational self-care. Always consult a certified dermatologist or Ayurvedic Vaidya for medical skin concerns.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
