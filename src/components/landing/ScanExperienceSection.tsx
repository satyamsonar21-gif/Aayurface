import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Scan, Focus, ShieldCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ScanExperienceSection() {
  const { isAuthenticated, user } = useAuth();
  const [showMethodology, setShowMethodology] = useState(false);

  const captureInvariants = [
    {
      title: 'Balanced Lighting',
      icon: Sun,
      description: 'Diffused, natural daylight without harsh directional shadows or overexposed glare.'
    },
    {
      title: 'Centered Framing',
      icon: Scan,
      description: 'Guided oval positioning ensures your facial contours sit squarely within the focal plane.'
    },
    {
      title: 'Stillness & Sharpness',
      icon: Focus,
      description: 'Client-side clarity evaluation confirms the absence of camera shake or motion blur.'
    },
    {
      title: 'Clear Visibility',
      icon: ShieldCheck,
      description: 'Unobstructed view of forehead, cheeks, and jawline free from hair or accessory occlusion.'
    }
  ];

  return (
    <section id="scan-experience" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Client-Side Quality Gateway
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Better input. <br/>
            <span className="italic text-[#6B8E7D] font-normal">More meaningful observation.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Uncontrolled selfies produce unpredictable results. AayurFace introduces a standardized capture gateway that guides you into optimal conditions before observation begins—ensuring privacy and consistency directly in your browser.
          </p>
        </motion.div>

        {/* Visual Simulated Interface */}
        <div className="w-full max-w-4xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Interactive Simulated Capture Viewfinder */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/5] sm:h-[520px] w-full bg-white p-2.5 border border-[#E6DFD5] shadow-md overflow-hidden">
                <img 
                  src="/images/landing/scan-portrait.jpg" 
                  alt="Standardized observation preview" 
                  className="w-full h-full object-cover grayscale-[10%]"
                  loading="lazy"
                />

                {/* Subtle Reticle & Guide Oval */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[68%] h-[78%] border border-white/60 rounded-[45%] flex items-center justify-center">
                    <div className="w-[96%] h-[96%] border border-white/20 rounded-[45%]" />
                  </div>
                </div>

                {/* Simulated Real-Time Status Indicators */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#1E3A2F]/90 backdrop-blur-xs text-white px-3 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Gateway Ready
                  </div>
                  <div className="bg-black/60 backdrop-blur-xs text-white/90 px-3 py-1 text-[10px] font-mono">
                    Natural Light · 5200K
                  </div>
                </div>

                {/* Corner Hairlines */}
                <div className="absolute top-3 left-3 w-3 h-[1px] bg-white/70" />
                <div className="absolute top-3 left-3 w-[1px] h-3 bg-white/70" />
                <div className="absolute top-3 right-3 w-3 h-[1px] bg-white/70" />
                <div className="absolute top-3 right-3 w-[1px] h-3 bg-white/70" />
                <div className="absolute bottom-3 left-3 w-3 h-[1px] bg-white/70" />
                <div className="absolute bottom-3 left-3 w-[1px] h-3 bg-white/70" />
                <div className="absolute bottom-3 right-3 w-3 h-[1px] bg-white/70" />
                <div className="absolute bottom-3 right-3 w-[1px] h-3 bg-white/70" />
              </div>
            </div>

            {/* Right: The 4 Intuitive Quality Factors */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A948E] block">
                Standardized Factors
              </span>

              {captureInvariants.map((factor) => {
                const Icon = factor.icon;
                return (
                  <div 
                    key={factor.title}
                    className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] flex items-start gap-3.5 hover:border-[#C5A059] transition-colors"
                  >
                    <div className="p-2 rounded-full bg-white border border-[#E6DFD5] text-[#1E3A2F] flex-shrink-0 mt-0.5">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-editorial text-lg text-[#1A1F1C] mb-1">
                        {factor.title}
                      </h4>
                      <p className="text-xs text-[#5C6660] leading-relaxed">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? (user?.onboarding_completed ? '/scan' : '/onboarding') : '/register'}
                  className="w-full inline-block text-center py-3 px-6 bg-[#1E3A2F] text-white text-xs font-mono uppercase tracking-[0.15em] hover:bg-[#152B23] transition-colors"
                >
                  {isAuthenticated ? 'Open Observation Gateway' : 'Experience Observation'}
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* LEVEL 3: Optional Research & Methodology Expandable */}
        <div className="w-full max-w-4xl border border-[#E6DFD5] bg-[#FAF8F5] p-5">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between text-left text-xs font-mono text-[#1E3A2F] uppercase tracking-wider font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#C5A059]" />
              <span>Level 3 Research: Client-Side Capture Pipeline Details</span>
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
                className="pt-4 mt-4 border-t border-[#E6DFD5] text-xs text-[#5C6660] space-y-3 font-mono leading-relaxed"
              >
                <p>
                  <strong>Architecture Specification:</strong> The client gateway runs MediaPipe Face Mesh inside browser WebAssembly via WebGL. 468 landmark points are tracked locally in volatile memory.
                </p>
                <p>
                  <strong>Deterministic Quality Checks:</strong> Single-face invariant, inter-pupillary distance scale (90px–180px), ROI mean luminance checking (target 80–220), and motion stability assessment. Zero raw frames are transmitted or stored prior to explicit user approval.
                </p>
                <p className="text-[#8A948E] italic">
                  Non-clinical wellness observation standard. Designed to maximize signal reproducibility across varying household devices.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
