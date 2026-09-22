import { motion } from 'framer-motion';
import { Camera, Cpu, Leaf, BarChart3 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: Camera,
      title: 'Guided Capture',
      desc: 'Position your face in natural daylight. Our in-browser gateway verifies centering, illumination, and stability.'
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Multimodal Analysis',
      desc: 'Computer vision maps surface texture while comparing observations against classical Charaka dosha typologies.'
    },
    {
      step: '03',
      icon: Leaf,
      title: 'Bespoke Guidance',
      desc: 'Receive personalized botanical formulas, Dinacharya timings, and ingredient cautions with transparent reasoning.'
    },
    {
      step: '04',
      icon: BarChart3,
      title: 'Longitudinal Care',
      desc: 'Re-observe every 2 to 4 weeks to notice subtle skin cycles, seasonal transitions, and restored equilibrium.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-t border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Sticky Header Area */}
        <div className="lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-32"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
              The Process
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#1A1F1C] leading-[1.1] mb-6">
              Simple steps to <br/>
              <span className="italic text-[#6B8E7D]">balanced skincare.</span>
            </h2>
            <p className="text-base text-[#5C6660] font-body leading-relaxed max-w-sm">
              A clear, four-step journey designed for quiet clarity and self-awareness, directly inside your browser.
            </p>
          </motion.div>
        </div>

        {/* Right: Staggered Steps */}
        <div className="lg:w-2/3 flex flex-col gap-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-8 items-start group"
              >
                <div className="flex-shrink-0">
                  <span className="font-editorial text-6xl text-[#E6DFD5] group-hover:text-[#C5A059] transition-colors duration-500 block leading-none">
                    {item.step}
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="w-10 h-10 rounded-full border border-[#E6DFD5] bg-white flex items-center justify-center text-[#1E3A2F] mb-6 group-hover:border-[#C5A059] transition-colors duration-500">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-editorial text-3xl text-[#1A1F1C] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-[#5C6660] leading-relaxed max-w-md">
                    {item.desc}
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
