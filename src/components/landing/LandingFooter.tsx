import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

export default function LandingFooter() {
  return (
    <footer id="contact" className="bg-[#FAF8F5] pt-24 sm:pt-32 pb-12 px-6 sm:px-10 border-t border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[400px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              <Logo size="lg" />
            </div>
            <p className="text-sm sm:text-base text-[#5C6660] max-w-sm leading-relaxed font-body">
              Evidence-aware multimodal skin and wellness intelligence bridging classical Ayurvedic philosophy with disciplined computer vision.
            </p>
            <div className="mt-auto pt-8">
              <span className="inline-block px-3 py-1.5 border border-[#C5A059]/30 text-[10px] uppercase tracking-widest text-[#C5A059] font-medium font-mono">
                Classical Sanskrit Botanical Citation
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 lg:pl-12">
            
            {/* Column 1: Explore */}
            <div className="space-y-6">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Explore</h4>
              <ul className="space-y-4 text-sm text-[#1A1F1C] font-medium">
                <li>
                  <a href="#about" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Philosophy
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <a href="#scan-experience" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Standardized Scan
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Methodology
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <a href="#ayurveda" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    The 3 Doshas
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <a href="#progress" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Progress Over Time
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-6">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Product</h4>
              <ul className="space-y-4 text-sm text-[#1A1F1C] font-medium">
                <li>
                  <Link to="/dashboard" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Wellness Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link to="/scan" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Facial Observation
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Ayurvedic Companion
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link to="/remedies" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Botanical Library
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Safety */}
            <div className="space-y-6">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Trust &amp; Safety</h4>
              <ul className="space-y-4 text-sm text-[#1A1F1C] font-medium">
                <li>
                  <a href="#safety" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Non-Diagnostic
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Privacy Principles
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </a>
                </li>
                <li>
                  <Link to="/signin" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Member Portal
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#6B8E7D] transition-colors inline-block relative group">
                    Register Account
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E7D] transition-all group-hover:w-full" />
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Big Bottom Typography */}
        <div className="border-t border-[#E6DFD5] pt-12 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h1 className="font-editorial text-7xl sm:text-8xl md:text-[10rem] leading-none tracking-tighter text-[#1A1F1C] opacity-10">
              aayur<span className="italic">face</span>
            </h1>
            
            <div className="flex flex-col items-start md:items-end gap-2 text-xs text-[#8A948E] font-mono uppercase tracking-widest pb-4">
              <p>© {new Date().getFullYear()} AayurFace Platform</p>
              <p>All rights reserved</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
