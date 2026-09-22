import { motion } from 'framer-motion';
import { ShieldCheck, Stethoscope, EyeOff, BookOpen } from 'lucide-react';

export default function ResponsibleAISafetySection() {
  const safetyPillars = [
    {
      icon: Stethoscope,
      title: 'Non-Clinical Standard',
      desc: 'Designed exclusively for constitutional skin-wellness guidance and personal reflection. Never diagnoses medical conditions or replaces consultation with a certified dermatologist.'
    },
    {
      icon: EyeOff,
      title: 'In-Browser Quality Evaluation',
      desc: 'Capture quality assessment is performed directly within your browser runtime before any downstream processing occurs, respecting personal boundaries.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncertainty Communicated',
      desc: 'When daylight illumination or facial orientation is ambiguous, our system communicates reduced confidence rather than generating speculative assertions.'
    },
    {
      icon: BookOpen,
      title: 'Classical Lineage',
      desc: 'All wellness references are mapped strictly to recognized classical compendiums (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya).'
    }
  ];

  return (
    <section id="safety" className="w-full bg-[#1A1F1C] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden text-[#FAF8F5]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Section Narrative */}
        <div className="lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C5A059]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059]">
                Ethical Boundaries
              </span>
            </div>
            
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#FAF8F5] leading-[1.12] mb-6">
              Technology should <br/>
              <span className="italic text-[#8A948E] font-normal">know its limits.</span>
            </h2>
            
            <p className="text-sm sm:text-base text-[#8A948E] font-body leading-relaxed max-w-sm mb-6">
              Where technology stops, human judgment begins. We believe intelligent tools earn trust not through extravagant claims, but through disciplined boundaries, humility, and rigorous respect for the person.
            </p>

            <div className="text-[11px] font-mono text-[#C5A059] border-l-2 border-[#C5A059] pl-3 py-1">
              Wellness Guidance · Non-Diagnostic
            </div>
          </motion.div>
        </div>

        {/* Right: Pillars Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-14">
            {safetyPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="mb-5 inline-block text-[#C5A059]">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#8A948E] leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="w-0 h-[1px] bg-[#C5A059] mt-6 group-hover:w-full transition-all duration-700 ease-in-out" />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
