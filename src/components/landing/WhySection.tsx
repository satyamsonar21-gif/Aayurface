import { motion } from 'framer-motion';

export default function WhySection() {
  const elements = [
    { title: "Observe", text: "We capture high-fidelity physical data through controlled lens standards." },
    { title: "Context", text: "We layer in the invisible: your daily habits, sleep, and environment." },
    { title: "Guidance", text: "We interpret balance through the lens of classical Ayurvedic principles." },
    { title: "Progress", text: "We measure true wellness over longitudinal time, not just single instances." }
  ];

  return (
    <section id="about" className="w-full bg-[#FAF8F5] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Large Visual */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] w-full"
        >
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src="/images/landing/ayurvedic-textures.jpg" 
              alt="Ayurvedic pure botanical herbs" 
              className="w-full h-full object-cover grayscale-[20%] sepia-[10%] image-scale-on-hover"
              loading="lazy"
            />
          </div>
          
          {/* Subtle Offset Frame */}
          <div className="absolute -top-4 -left-4 w-full h-full border border-[#C5A059]/30 -z-10" />
          
          <div className="absolute bottom-8 right-8 bg-[#FAF8F5]/90 backdrop-blur px-6 py-4 border border-[#E6DFD5]">
            <p className="font-editorial text-2xl italic text-[#1E3A2F]">Beyond the surface</p>
          </div>
        </motion.div>

        {/* Right: Editorial Typography */}
        <div className="flex flex-col justify-center space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#1A1F1C] leading-[1.15] mb-6">
              A holistic perspective <br />
              <span className="text-[#6B8E7D] italic">on skin intelligence.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-lg">
              Conventional skincare often isolates surface symptoms with quick synthetic fixes. We recognize the face as a living canvas reflecting deeper systemic balance—where visible texture is a dynamic conversation between your constitution, current imbalances, and daily habits.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 pt-4 border-t border-[#E6DFD5]"
          >
            {elements.map((el, i) => (
              <div key={el.title} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#C5A059]">0{i + 1}</span>
                  <h3 className="font-editorial text-2xl text-[#1E3A2F]">{el.title}</h3>
                </div>
                <p className="text-sm text-[#5C6660] pl-7 max-w-sm">{el.text}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
