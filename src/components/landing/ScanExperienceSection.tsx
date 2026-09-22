import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Scan, Focus, ShieldCheck, Eye, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ScanExperienceSection() {
  const [showMethodology, setShowMethodology] = useState(false);

  const captureInvariants = [
    {
      title: 'Face Position',
      icon: Eye,
      description: 'Neutral, forward-facing orientation with even elevation to avoid angle distortion.'
    },
    {
      title: 'Balanced Lighting',
      icon: Sun,
      description: 'Diffused, natural daylight without harsh directional shadows or heavy ambient glare.'
    },
    {
      title: 'Centered Framing',
      icon: Scan,
      description: 'Guided alignment oval ensures facial landmarks sit consistently within the frame.'
    },
    {
      title: 'Sharpness & Stillness',
      icon: Focus,
      description: 'In-browser clarity evaluation confirms absence of motion blur before observation.'
    },
    {
      title: 'Minimal Occlusion',
      icon: ShieldCheck,
      description: 'Forehead, cheeks, and jawline free from hair, glasses, or accessories for consistent observation.'
    }
  ];

  return (
    <section id="scan-experience" className="w-full bg-[#FFFFFF] border-b border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Standardized Input Gateway
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Better input. <br/>
            <span className="italic text-[#1E3A2F] font-normal">More meaningful observation.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Before interpretation, AayurFace helps create a more consistent input. Standardized conditions ensure that differences over time reflect real shifts rather than changing room lighting or awkward angles.
          </p>
        </motion.div>

        {/* Visual Simulated Guided Capture Viewfinder (NO WOMEN / NO MODELS) */}
        <div className="w-full max-w-4xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Interactive Simulated Capture Viewfinder */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/5] sm:h-[500px] w-full bg-white p-2.5 border border-[#E6DFD5] shadow-md overflow-hidden rounded-sm">
                <img 
                  src="/images/landing/abstract-facial-geometry.jpg" 
                  alt="Standardized observation preview featuring sculptural facial form" 
                  className="w-full h-full object-cover grayscale-[10%]"
                  loading="lazy"
                />

                {/* Subtle Reticle & Guide Oval */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[68%] h-[78%] border-2 border-emerald-400/70 rounded-[45%] flex items-center justify-center shadow-sm">
                    <div className="w-[96%] h-[96%] border border-white/40 rounded-[45%]" />
                  </div>
                </div>

                {/* Simulated Real-Time Status Indicators */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#1E3A2F]/90 backdrop-blur-xs text-white px-3 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Gateway Ready
                  </div>
                  <div className="bg-black/70 backdrop-blur-xs text-white/90 px-3 py-1 text-[10px] font-mono rounded-sm">
                    Natural Light · 5200K
                  </div>
                </div>

                {/* Four Calibration Corners */}
                <div className="absolute top-3 left-3 w-3 h-[1px] bg-white/80" />
                <div className="absolute top-3 left-3 w-[1px] h-3 bg-white/80" />
                <div className="absolute top-3 right-3 w-3 h-[1px] bg-white/80" />
                <div className="absolute top-3 right-3 w-[1px] h-3 bg-white/80" />
                <div className="absolute bottom-3 left-3 w-3 h-[1px] bg-white/80" />
                <div className="absolute bottom-3 left-3 w-[1px] h-3 bg-white/80" />
                <div className="absolute bottom-3 right-3 w-3 h-[1px] bg-white/80" />
                <div className="absolute bottom-3 right-3 w-[1px] h-3 bg-white/80" />

                {/* Bottom Center Validation Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E3A2F]/90 backdrop-blur-md text-white text-[10px] font-mono px-4 py-1.5 rounded-full border border-[#C5A059]/40 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  Framing &amp; Lighting Validated
                </div>
              </div>
            </div>

            {/* Right: The 5 Guided Invariants */}
            <div className="lg:col-span-5 space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A948E] block font-semibold">
                Five Guided Factors
              </span>

              {captureInvariants.map((factor) => {
                const Icon = factor.icon;
                return (
                  <div 
                    key={factor.title}
                    className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm hover:border-[#C5A059] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-1 text-[#1E3A2F]">
                      <div className="p-1 rounded-full bg-white border border-[#E6DFD5] text-[#C5A059]">
                        <Icon size={13} />
                      </div>
                      <h3 className="font-display font-serif text-lg font-medium text-[#1A1F1C]">
                        {factor.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5C6660] font-body leading-relaxed pl-7">
                      {factor.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Level 3 Expandable Methodology Drawer */}
        <div className="w-full max-w-3xl">
          <button
            type="button"
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full py-3.5 px-6 border border-[#E6DFD5] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#1E3A2F] text-xs font-mono uppercase tracking-widest flex items-center justify-between transition-colors rounded-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#C5A059]" />
              <span>Level 3: Technical Capture Details &amp; Validation Scope</span>
            </div>
            {showMethodology ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showMethodology && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-[#FAF8F5] border-x border-b border-[#E6DFD5] p-6 text-xs text-[#5C6660] space-y-3"
              >
                <p>
                  <strong>Client-Side Evaluation:</strong> All initial frame validation—evaluating framing consistency, ambient light distribution, and sharpness—happens locally in your web browser. No unverified images are transmitted.
                </p>
                <p>
                  <strong>Responsible Boundaries:</strong> The capture gateway does not claim 100% precision or medical-grade diagnostics. It is engineered specifically as a standardized baseline for holistic wellness observation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
