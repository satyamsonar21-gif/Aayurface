import { motion } from 'framer-motion';

export default function PositioningStrip() {
  return (
    <section id="philosophy" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative vertical hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-[#C5A059]" />
      
      <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
            The Foundational Principle
          </span>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1E3A2F] leading-[1.12] text-balance mx-auto">
            Skin is visible. <br />
            <span className="italic font-normal text-[#6B8E7D]">Context is not.</span>
          </h2>
          
          <div className="w-12 h-[1px] bg-[#C5A059]/60 mx-auto my-6" />
          
          <p className="text-base sm:text-lg text-[#5C6660] max-w-2xl mx-auto font-body leading-relaxed">
            Traditional Ayurvedic understanding has always considered the person as an integrated ecosystem. While digital skincare often looks only at the face, AayurFace explores how structured visual observation can be rooted in constitutional individuality, lived habits, and timeless botanical knowledge.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
