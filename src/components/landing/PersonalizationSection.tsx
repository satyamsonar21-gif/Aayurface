import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset } from 'lucide-react';

export default function PersonalizationSection() {
  const schedule = [
    {
      period: 'MORNING (PRATAHKAL)',
      icon: Sunrise,
      title: 'Awakening & Nourishment',
      ritual: 'Warm Kumkumadi Taila pressed gently along the jawline.',
      tag: 'Vata-Pitta Pacification'
    },
    {
      period: 'MIDDAY (MADHYANHA)',
      icon: Sun,
      title: 'Thermal Calming',
      ritual: 'Cooling Vetiver aromatic floral mist across the face.',
      tag: 'Pitta Heat Balance'
    },
    {
      period: 'EVENING (SANDHYAKAL)',
      icon: Sunset,
      title: 'Circadian Wind-down',
      ritual: 'Sandalwood & Licorice purifying herbal mask with pure aloe.',
      tag: 'Cellular Rejuvenation'
    }
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-[#E6DFD5] pb-12"
        >
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
              Bespoke Ayurvedic Care
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#1A1F1C] leading-[1.1]">
              A daily rhythm shaped <br/>
              <span className="italic text-[#6B8E7D]">for your constitution.</span>
            </h2>
          </div>
          <p className="text-base text-[#5C6660] font-body max-w-sm">
            Instead of rigid synthetic chemicals, we craft a disciplined natural rhythm that honors the time of day and your skin's natural state.
          </p>
        </motion.div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left: Lifestyle Imagery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative h-[600px] w-full"
          >
            <div className="w-full h-full p-3 border border-[#E6DFD5] bg-white">
              <img
                src="/images/landing/wellness-lifestyle.jpg"
                alt="Mindful botanical application"
                className="w-full h-full object-cover grayscale-[10%] sepia-[5%] image-scale-on-hover"
                loading="lazy"
              />
            </div>
            
            {/* Minimalist Floating Badge */}
            <div className="absolute top-12 -right-6 lg:-right-12 bg-[#1E3A2F] text-[#FAF8F5] p-6 shadow-xl w-48 hidden sm:block">
              <div className="w-4 h-[1px] bg-[#C5A059] mb-4" />
              <p className="font-editorial italic text-lg leading-tight mb-2">Dinacharya</p>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#8A948E]">
                Daily Sacred Rhythm
              </p>
            </div>
          </motion.div>

          {/* Right: The 3 Rhythms */}
          <div className="lg:col-span-5 relative">
            <div className="absolute left-[15px] top-8 bottom-8 w-[1px] bg-gradient-to-b from-[#E6DFD5] via-[#C5A059] to-[#E6DFD5]" />
            
            <div className="space-y-16">
              {schedule.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.period}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#C5A059] flex items-center justify-center -translate-x-1/2">
                      <Icon size={14} className="text-[#1E3A2F]" />
                    </div>

                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#C5A059] block mb-2">
                      {item.period}
                    </span>
                    <h3 className="font-editorial text-2xl text-[#1A1F1C] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5C6660] leading-relaxed mb-4">
                      {item.ritual}
                    </p>
                    <span className="inline-block text-[10px] font-mono text-[#1E3A2F] bg-white px-3 py-1 border border-[#E6DFD5]">
                      {item.tag}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
