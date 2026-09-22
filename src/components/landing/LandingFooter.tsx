import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

export default function LandingFooter() {
  return (
    <footer id="contact" className="bg-[#FAF8F5] border-t border-[#E6DFD5] py-16 sm:py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-[#5C6660] max-w-sm leading-relaxed font-normal">
              Evidence-aware multimodal skin and wellness intelligence bridging classical Ayurvedic philosophy with disciplined computer vision.
            </p>
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest text-[#8A948E] font-medium font-mono">
                Classical Sanskrit Botanical Citation · Chikitsa Sthana
              </span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6660]">
              <li>
                <a href="#about" className="hover:text-[#1E3A2F] transition-colors">
                  Philosophy
                </a>
              </li>
              <li>
                <a href="#scan-experience" className="hover:text-[#1E3A2F] transition-colors">
                  Standardized Scan
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#1E3A2F] transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#ayurveda" className="hover:text-[#1E3A2F] transition-colors">
                  The 3 Doshas
                </a>
              </li>
              <li>
                <a href="#progress" className="hover:text-[#1E3A2F] transition-colors">
                  Progress Over Time
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Product</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6660]">
              <li>
                <Link to="/dashboard" className="hover:text-[#1E3A2F] transition-colors">
                  Wellness Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-[#1E3A2F] transition-colors">
                  Facial Observation
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-[#1E3A2F] transition-colors">
                  Ayurvedic Companion
                </Link>
              </li>
              <li>
                <Link to="/remedies" className="hover:text-[#1E3A2F] transition-colors">
                  Botanical Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Trust &amp; Safety</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6660]">
              <li>
                <a href="#safety" className="hover:text-[#1E3A2F] transition-colors">
                  Non-Diagnostic Boundary
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#1E3A2F] transition-colors">
                  Privacy Principles
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#1E3A2F] transition-colors">
                  Preserved Uncertainty
                </a>
              </li>
              <li>
                <Link to="/signin" className="hover:text-[#1E3A2F] transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#1E3A2F] transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A948E]">
          <p>© {new Date().getFullYear()} AayurFace Platform. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Classical wisdom referenced from Charaka Samhita &amp; Ashtanga Hridaya.
          </p>
        </div>
      </div>
    </footer>
  );
}
