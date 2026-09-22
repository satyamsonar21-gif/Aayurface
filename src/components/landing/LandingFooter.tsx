import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

export default function LandingFooter() {
  return (
    <footer id="contact" className="bg-[#FAF8F5] pt-20 sm:pt-28 pb-12 px-6 sm:px-10 border-t border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[380px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <Logo size="lg" />
            </div>
            <p className="text-sm text-[#5C6660] max-w-sm leading-relaxed font-body">
              A contemporary Ayurveda-first intelligent skin-wellness platform uniting standardized visual observation with personal constitutional context, lifestyle rhythms, and classical Ayurvedic knowledge.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1.5 border border-[#C5A059]/40 text-[10px] uppercase tracking-widest text-[#1E3A2F] font-semibold font-mono bg-white">
                Classical Literature Grounding
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-10">
            
            {/* Column 1: Philosophy & System */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">Narrative</h4>
              <ul className="space-y-3 text-xs text-[#1A1F1C] font-medium">
                <li>
                  <a href="#philosophy" className="hover:text-[#1E3A2F] transition-colors">
                    Core Philosophy
                  </a>
                </li>
                <li>
                  <a href="#beyond-selfie" className="hover:text-[#1E3A2F] transition-colors">
                    Beyond the Selfie
                  </a>
                </li>
                <li>
                  <a href="#prakriti" className="hover:text-[#1E3A2F] transition-colors">
                    Prakriti &amp; Tridosha
                  </a>
                </li>
                <li>
                  <a href="#multimodal" className="hover:text-[#1E3A2F] transition-colors">
                    Multimodal Convergence
                  </a>
                </li>
                <li>
                  <a href="#confidence" className="hover:text-[#1E3A2F] transition-colors">
                    Confidence &amp; Uncertainty
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Experience & Progress */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">Journey</h4>
              <ul className="space-y-3 text-xs text-[#1A1F1C] font-medium">
                <li>
                  <a href="#scan-experience" className="hover:text-[#1E3A2F] transition-colors">
                    Standardized Capture
                  </a>
                </li>
                <li>
                  <a href="#progress" className="hover:text-[#1E3A2F] transition-colors">
                    Longitudinal Progress
                  </a>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#1E3A2F] transition-colors">
                    Begin Journey
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="hover:text-[#1E3A2F] transition-colors">
                    Member Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Research & Ethics */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">Research &amp; Safety</h4>
              <ul className="space-y-3 text-xs text-[#1A1F1C] font-medium">
                <li>
                  <a href="#research" className="hover:text-[#1E3A2F] transition-colors">
                    Indian-Skin Validation
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-[#1E3A2F] transition-colors">
                    Non-Diagnostic Standard
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-[#1E3A2F] transition-colors">
                    In-Browser Privacy
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Classical Literature Citation Strip & Ethical Advisory */}
        <div className="border-t border-[#E6DFD5] pt-8 pb-6">
          <div className="p-4 bg-white border border-[#E6DFD5] mb-8 text-xs text-[#5C6660] leading-relaxed">
            <strong className="text-[#1E3A2F] font-semibold block mb-1">
              Ethical &amp; Non-Clinical Advisory:
            </strong>
            AayurFace provides AI-assisted wellness guidance based on classical Ayurvedic literature (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, and Bhavaprakasha). It does not provide medical diagnoses or dermatological prescriptions. For clinical skin concerns or dermatological conditions, consult a licensed healthcare professional.
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8A948E] font-mono">
            <span>© {new Date().getFullYear()} AayurFace Platform. All rights reserved.</span>
            <span>Contemporary Ayurveda × Computational Observation</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
