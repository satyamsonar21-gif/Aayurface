import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ScanExperienceSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section id="scan-experience" className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            STANDARDIZED CAPTURE PREVIEW
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Start with a clearer observation.
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            Reliable wellness guidance starts with reliable visual intake. AayurFace guides your capture directly inside your browser — verifying framing, daylight distribution, and motion stability before any observation is recorded.
          </p>
        </div>

        {/* The Viewfinder Product Simulation */}
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#E6DFD5] shadow-lg relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Viewfinder Display (Left 7 cols) */}
            <div className="md:col-span-7 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[460px] mx-auto border border-[#E6DFD5] bg-[#FAF8F5] shadow-inner">
                {/* Frontal Natural Skin Portrait */}
                <img
                  src="/images/landing/scan-portrait.jpg"
                  alt="Standardized face capture viewfinder preview with calm neutral framing"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />

                {/* Viewfinder Oval Aperture Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[74%] h-[82%] rounded-full border border-white/60 shadow-[0_0_0_9999px_rgba(18,57,47,0.3)] transition-all flex items-center justify-center">
                    {/* Center alignment crosshair */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]/80 animate-ping" />
                  </div>
                </div>

                {/* Viewfinder Corner Brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/80 pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/80 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/80 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/80 pointer-events-none" />

                {/* Live Quality Badge Pill */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#1E3A2F]/90 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[11px] font-mono tracking-wider flex items-center gap-2 border border-white/20 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>READINESS GATE: VERIFIED</span>
                </div>

                {/* Bottom Spec Footer */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-white/90 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded">
                  <span>FRAME: 1280 × 960 (4:3)</span>
                  <span>CLIENT-SIDE ONLY</span>
                </div>
              </div>
            </div>

            {/* Quality Checklist & Controls (Right 5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold">
                  Phase 10 CV Readiness
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">
                  Deterministic Quality Gates
                </h3>
                <p className="text-xs text-[#5C6660]">
                  Every capture is checked against three rigorous objective gates before proceeding:
                </p>
              </div>

              {/* Checks */}
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#1A1F1C]">Centering &amp; Coverage</p>
                    <p className="text-[11px] text-[#5C6660]">Single face centered within optimal guide ellipse.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#1A1F1C]">Balanced Natural Lighting</p>
                    <p className="text-[11px] text-[#5C6660]">Luminance verified to avoid harsh shadows and glare.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#1A1F1C]">Laplacian Sharpness</p>
                    <p className="text-[11px] text-[#5C6660]">Motion blur filtered out to ensure surface texture clarity.</p>
                  </div>
                </div>
              </div>

              {/* Non-Diagnostic Disclaimer */}
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6DFD5]/80 flex items-center gap-2.5 text-[11px] text-[#7A6F61]">
                <Shield size={14} className="text-[#6B8E7D] shrink-0" />
                <span>Non-clinical capture preview. No medical diagnoses performed.</span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={isAuthenticated ? (user?.onboarding_completed ? '/scan' : '/onboarding') : '/register'}
                  className="w-full bg-[#1E3A2F] text-white py-3.5 px-6 rounded-md text-sm font-medium hover:bg-[#152B23] transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles size={15} className="text-[#C5A059]" />
                  <span>{isAuthenticated ? 'Open Facial Observation' : 'Experience Face Observation'}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
