import { motion } from 'framer-motion';

export default function PositioningStrip() {
  return (
    <div className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative vertical hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-[#E6DFD5]" />
      
      <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1E3A2F] leading-[1.1] text-balance mx-auto">
            Your skin is visible.<br />
            <span className="italic font-normal text-[#6B8E7D]">Your wellness context is not.</span>
          </h2>
          
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto" />
          
          <p className="text-base sm:text-lg text-[#5C6660] max-w-2xl mx-auto font-body leading-relaxed">
            AayurFace bridges the gap between what can be seen and what must be understood, uniting structured observation with profound Ayurvedic principles to offer guidance that is personal, transparent, and calm.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
