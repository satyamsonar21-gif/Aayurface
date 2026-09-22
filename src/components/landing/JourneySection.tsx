import { motion } from 'framer-motion';

export default function JourneySection() {
  const steps = [
    {
      num: '01',
      title: 'Capture',
      subtitle: 'Physical Observation',
      desc: 'Guided in-browser face capture verifies lighting, centering, and motion clarity under balanced natural daylight.'
    },
    {
      num: '02',
      title: 'Understand',
      subtitle: 'Constitutional Mapping',
      desc: 'Correlates observed skin surface characteristics with inherent constitution (Prakriti) and transient imbalances (Vikriti).'
    },
    {
      num: '03',
      title: 'Personalize',
      subtitle: 'Bespoke Dinacharya',
      desc: 'Generates tailored herbal recipes, pacifying oils, and daily morning-to-evening care rituals.'
    },
    {
      num: '04',
      title: 'Track',
      subtitle: 'Longitudinal Balance',
      desc: 'Follow natural 30-to-90 day epidermal renewal cycles and seasonal transitions with quiet confidence.'
    }
  ];

  return (
    <section id="journey" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            The Observation Journey
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-[#1A1F1C] leading-[1.1]">
            A thoughtful path to <br/>
            <span className="italic text-[#6B8E7D]">constitutional balance.</span>
          </h2>
        </motion.div>

        {/* Journey Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative group"
            >
              {/* Top Hairline and Dot */}
              <div className="w-full h-[1px] bg-[#E6DFD5] mb-8 relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1E3A2F] scale-0 group-hover:scale-100 transition-transform duration-500" />
              </div>
              
              <div className="mb-6 overflow-hidden">
                <span className="font-editorial text-6xl text-[#FAF8F5] block font-semibold" style={{ WebkitTextStroke: '1px #C5A059' }}>
                  {step.num}
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-2">{step.title}</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B8E7D] mb-4 block">
                {step.subtitle}
              </span>
              <p className="text-sm text-[#5C6660] leading-relaxed pr-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
