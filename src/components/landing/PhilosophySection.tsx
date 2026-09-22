import { motion } from 'framer-motion';

export default function PhilosophySection() {
  const tenets = [
    {
      title: 'Prakriti (Inherent Constitution)',
      desc: 'Your unique elemental blueprint at birth. Understanding whether you lean toward Vata, Pitta, or Kapha unlocks lasting self-compassion and customized skin care.'
    },
    {
      title: 'Vikriti (Current Imbalance)',
      desc: 'The dynamic state of your skin today. Stress, travel, climate, and diet cause fluctuations that can be gently pacified with the right opposing botanical qualities.'
    },
    {
      title: 'Dinacharya (Daily Rhythm)',
      desc: 'Aligning skin rituals with circadian solar cycles — cooling in the midday sun, hydrating in the morning, and detoxifying through evening herbal Lepas.'
    },
    {
      title: 'Dravyaguna (Plant Intelligence)',
      desc: 'Using pure whole-plant botanicals like Sandalwood, Neem, and Turmeric, where natural active compounds work synergistically with your skin barrier.'
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-20 pb-12 border-b border-[#E6DFD5]"
        >
          <div className="lg:col-span-7">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
              Foundational Tenets
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.1]">
              Living in rhythm <br/>
              <span className="italic text-[#6B8E7D]">with natural balance.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-md">
              Classical Ayurveda views human wellness not as a battlefield against aging, but as an artful, continuous dance of equilibrium between inner and outer nature.
            </p>
          </div>
        </motion.div>

        {/* Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left: Textured Ceramic & Stone Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-[500px] w-full group"
          >
            <div className="w-full h-full p-2 border border-[#E6DFD5] bg-white relative z-10 overflow-hidden">
              <img
                src="/images/landing/ayurvedic-textures.jpg"
                alt="Botanical herbs and stones"
                className="w-full h-full object-cover grayscale-[15%] sepia-[10%] group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-1000 ease-[0.16,1,0.3,1]"
                loading="lazy"
              />
            </div>
            
            {/* Background Offset */}
            <div className="absolute top-6 left-6 right-[-24px] bottom-[-24px] bg-[#E6DFD5]/30 z-0" />

            <div className="absolute -bottom-8 lg:-right-12 z-20 bg-[#1E3A2F] text-[#FAF8F5] p-6 sm:p-8 max-w-[280px] shadow-2xl">
              <p className="font-editorial italic text-xl mb-4 leading-snug">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 pt-8 lg:pt-0 pl-0 lg:pl-12">
              {tenets.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-editorial text-4xl text-[#E6DFD5] group-hover:text-[#C5A059] transition-colors duration-500">
                      0{idx + 1}
                    </span>
                    <h3 className="font-editorial text-2xl text-[#1A1F1C] leading-tight">
                      {item.title.split(' (')[0]} <br/>
                      <span className="italic text-[#6B8E7D] text-lg">({item.title.split(' (')[1]}</span>
                    </h3>
                  </div>
                  
                  <p className="text-sm text-[#5C6660] leading-relaxed">
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
