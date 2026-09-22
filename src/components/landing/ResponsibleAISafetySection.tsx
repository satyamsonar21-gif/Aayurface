import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, FileText, Stethoscope } from 'lucide-react';

export default function ResponsibleAISafetySection() {
  const pillars = [
    {
      icon: Stethoscope,
      title: 'Non-Clinical Standard',
      desc: 'Designed exclusively for constitutional skin wellness guidance. Never replaces a certified medical dermatologist or clinical diagnostic consultation.'
    },
    {
      icon: EyeOff,
      title: 'Private & Client-Side',
      desc: 'Your camera stream and captured facial frames are processed directly within your browser. Raw images are never sold or used for public AI training.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncertainty Preserved',
      desc: 'When daylight illumination or facial angles are ambiguous, our models report reduced confidence rather than generating speculative answers.'
    },
    {
      icon: FileText,
      title: 'Classical Lineage',
      desc: 'All herbological citations are mapped strictly to recognized classical compendiums (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya).'
    }
  ];

  return (
    <section id="safety" className="w-full bg-[#1A1F1C] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden text-[#FAF8F5]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Section Header */}
        <div className="lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-32"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C5A059]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059]">
                Ethical Foundation
              </span>
            </div>
            
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#FAF8F5] leading-[1.1] mb-6">
              Wellness guidance. <br/>
              <span className="italic text-[#8A948E]">With clear boundaries.</span>
            </h2>
            
            <p className="text-base text-[#8A948E] font-body leading-relaxed max-w-sm">
              We believe technology should earn your trust through transparency, rigorous privacy boundaries, and deep respect for the limits of computer vision.
            </p>
          </motion.div>
        </div>

        {/* Right: Pillars */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="mb-6 inline-block">
                    <Icon size={24} className="text-[#C5A059]" strokeWidth={1} />
                  </div>
                  
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-[#8A948E] leading-relaxed">
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
