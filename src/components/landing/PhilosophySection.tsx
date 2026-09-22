import { motion } from 'framer-motion';

export default function PhilosophySection() {
  const tenets = [
    {
      title: 'Prakriti (Inherent Constitution)',
      desc: 'Your elemental baseline. Understanding whether you lean toward Vata, Pitta, or Kapha unlocks lasting self-compassion and customized skin care.'
    },
    {
      title: 'Vikriti (Current State)',
      desc: 'The dynamic expression of your skin today. Stress, travel, climate, and diet cause fluctuations that can be gently pacified with opposing botanical qualities.'
    },
    {
      title: 'Dinacharya (Daily Rhythm)',
      desc: 'Aligning skin rituals with circadian solar cycles—hydrating in the morning, cooling in the midday sun, and nourishing with evening herbal rituals.'
    },
    {
      title: 'Dravyaguna (Botanical Science)',
      desc: 'Working with pure whole-plant botanicals like Sandalwood, Neem, and Turmeric, where natural active compounds work synergistically with your skin barrier.'
    }
  ];

  return (
    <section id="philosophy" className="w-full bg-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-20 pb-12 border-b border-[#E6DFD5]"
        >
          <div className="lg:col-span-7">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4 font-semibold">
              Foundational Philosophy
            </span>
            <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.1]">
              A face can show you something. <br/>
              <span className="italic text-[#1E3A2F]">It cannot tell you everything.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-md">
              Classical Ayurveda views human wellness not as a quick fix or superficial surface correction, but as an artful, continuous dance of equilibrium between inner nature and outer environment.
            </p>
          </div>
        </motion.div>

        {/* Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left: Authentic Herbal & Ceramic Texture Image (NO HUMANS) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-[500px] w-full group"
          >
            <div className="w-full h-full p-2 border border-[#E6DFD5] bg-white relative z-10 overflow-hidden shadow-sm">
              <img
                src="/images/landing/ayurvedic-textures.jpg"
                alt="Botanical herbal powders in ceramic dish with smooth river stones on raw linen"
                className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-[0.16,1,0.3,1]"
                loading="lazy"
              />
            </div>
            
            {/* Background Accent Offset */}
            <div className="absolute top-6 left-6 right-[-24px] bottom-[-24px] bg-[#E6DFD5]/40 z-0" />

            <div className="absolute -bottom-8 lg:-right-12 z-20 bg-[#1E3A2F] text-[#FAF8F5] p-6 sm:p-8 max-w-[280px] shadow-2xl border border-[#C5A059]/40">
              <p className="font-display font-serif italic text-xl mb-4 leading-snug">
                "Swastha — Being established in one's true natural self"
              </p>
              <div className="w-6 h-[1px] bg-[#C5A059] mb-3" />
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#8A948E]">
                Sushruta Samhita 15.41
              </p>
            </div>
          </motion.div>

          {/* Right: Tenets List */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14 pt-8 lg:pt-0 pl-0 lg:pl-6">
              {tenets.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-display font-serif text-3xl text-[#C5A059] font-medium">
                      0{idx + 1}
                    </span>
                    <div className="h-[1px] flex-1 bg-[#E6DFD5]" />
                  </div>
                  <h3 className="font-display font-serif text-xl text-[#1A1F1C] mb-2 font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5C6660] font-body leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
