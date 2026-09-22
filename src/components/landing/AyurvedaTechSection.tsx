import { motion } from 'framer-motion';

export default function AyurvedaTechSection() {
  const steps = [
    "AYURVEDIC KNOWLEDGE",
    "STRUCTURED OBSERVATION",
    "PERSONAL CONTEXT",
    "WELLNESS GUIDANCE"
  ];

  return (
    <section id="ayurveda" className="w-full bg-[#1A1F1C] text-[#FAF8F5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Dramatic Botanical Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] w-full lg:order-1 order-2"
        >
          <img 
            src="/images/landing/botanical-still-life.jpg" 
            alt="Ayurvedic Botanical" 
            className="w-full h-full object-cover grayscale-[30%] opacity-80"
          />
          <div className="absolute inset-0 border border-[#FAF8F5]/10 m-4" />
          
          <div className="absolute top-8 left-8 text-[10px] font-mono tracking-[0.3em] uppercase text-[#FAF8F5]/50">
            Dravyaguna · Botanical Science
          </div>
        </motion.div>

        {/* Right: Modern Structured Concept */}
        <div className="flex flex-col justify-center lg:order-2 order-1">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-12"
          >
            Ancient principles. <br/>
            <span className="italic text-[#8A948E]">Observed through a <br/> modern lens.</span>
          </motion.h2>

          <div className="flex flex-col gap-8 relative">
            <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#C5A059] to-[#1E3A2F]/30" />
            
            {steps.map((step, idx) => (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-6 relative"
              >
                <div className="w-2 h-2 rounded-full bg-[#C5A059] z-10 shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-[#FAF8F5]">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-base text-[#8A948E] font-body leading-relaxed max-w-md mt-12"
          >
            We do not claim to replace clinical dermatology. Rather, we build a disciplined bridge between timeless Ayurvedic wellness principles and modern, privacy-preserving visual technology.
          </motion.p>
        </div>

      </div>
    </section>
  );
}
