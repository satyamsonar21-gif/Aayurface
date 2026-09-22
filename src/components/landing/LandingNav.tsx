import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingNav() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.replace('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DFD5] shadow-xs py-2'
          : 'bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E6DFD5]/70 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center">
          <Link
            to="/"
            className="cursor-pointer group flex items-center gap-2"
            aria-label="AayurFace Home"
          >
            <Logo size="md" />
          </Link>
        </div>

        {/* Center: Editorial Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C6660]"
          aria-label="Main Navigation"
        >
          <a href="#about" className="hover:text-[#1E3A2F] transition-colors py-1">
            About
          </a>
          <a href="#scan-experience" className="hover:text-[#1E3A2F] transition-colors py-1">
            Observe
          </a>
          <a href="#how-it-works" className="hover:text-[#1E3A2F] transition-colors py-1">
            How It Works
          </a>
          <a href="#ayurveda" className="hover:text-[#1E3A2F] transition-colors py-1">
            Ayurveda
          </a>
          <a href="#progress" className="hover:text-[#1E3A2F] transition-colors py-1">
            Progress
          </a>
          <a href="#safety" className="hover:text-[#1E3A2F] transition-colors py-1">
            Trust &amp; Safety
          </a>
        </nav>

        {/* Right: Auth Controls */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.onboarding_completed ? '/dashboard' : '/onboarding'}
                className="bg-[#1E3A2F] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#152B23] transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
              >
                <span>
                  {user?.onboarding_completed ? 'Enter Dashboard' : 'Continue Onboarding'}
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-[#5C6660] hover:text-red-700 transition-colors px-2 py-1 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-sm font-medium text-[#5C6660] hover:text-[#1E3A2F] transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#1E3A2F] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#152B23] transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-[#1E3A2F] hover:bg-[#F3EFEA] transition-colors"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FAF8F5] border-b border-[#E6DFD5] px-6 py-6 flex flex-col gap-4 shadow-sm"
          >
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              About
            </a>
            <a
              href="#scan-experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              Observe
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              How It Works
            </a>
            <a
              href="#ayurveda"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              Ayurveda
            </a>
            <a
              href="#progress"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              Progress
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
            >
              Trust &amp; Safety
            </a>

            <div className="pt-4 border-t border-[#E6DFD5] flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.onboarding_completed ? '/dashboard' : '/onboarding'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#1E3A2F] text-white text-center py-3 rounded-md text-sm font-medium hover:bg-[#152B23] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>
                      {user?.onboarding_completed ? 'Enter Dashboard' : 'Continue Onboarding'}
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-center py-2 text-sm font-medium text-red-700 hover:text-red-800 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-sm font-medium text-[#5C6660] hover:text-[#1E3A2F]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#1E3A2F] text-white text-center py-3 rounded-md text-sm font-medium hover:bg-[#152B23] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
