import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Menu, 
  X, 
  Leaf, 
  Droplets, 
  Flame, 
  Wind, 
  Scan, 
  Cpu 
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1F1C] font-body selection:bg-[#C5A059]/25 selection:text-[#1E3A2F] relative overflow-x-hidden">
        
        {/* =========================================================================
            HEADER / NAVIGATION BAR (§6)
            Warm ivory canvas, subtle bottom border, generous horizontal spacing
            ========================================================================= */}
        <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DFD5] transition-all">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
            
            {/* LEFT: AayurFace emblem + wordmark */}
            <div className="flex items-center">
              <Link to="/" className="cursor-pointer group flex items-center gap-2" aria-label="AayurFace Home">
                <Logo size="md" />
              </Link>
            </div>

            {/* CENTER: Editorial Navigation Links */}
            <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-[#5C6660]">
              <a href="#" className="hover:text-[#1E3A2F] transition-colors py-1">Home</a>
              <a href="#about" className="hover:text-[#1E3A2F] transition-colors py-1">About</a>
              <a href="#how-it-works" className="hover:text-[#1E3A2F] transition-colors py-1">How It Works</a>
              <a href="#ayurveda" className="hover:text-[#1E3A2F] transition-colors py-1">Ayurveda</a>
              <a href="#contact" className="hover:text-[#1E3A2F] transition-colors py-1">Contact</a>
            </nav>

            {/* RIGHT: Login & Get Started CTA */}
            <div className="hidden sm:flex items-center gap-6">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="bg-[#1E3A2F] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#152B23] transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
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

            {/* Mobile Menu Trigger Button */}
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#1E3A2F] hover:bg-[#F3EFEA] transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown (§21) */}
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
                  href="#" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
                >
                  Home
                </a>
                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
                >
                  About
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
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#1A1F1C] hover:text-[#1E3A2F] py-1"
                >
                  Contact
                </a>
                <div className="pt-4 border-t border-[#E6DFD5] flex flex-col gap-3">
                  {isAuthenticated ? (
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-[#1E3A2F] text-white text-center py-3 rounded-md text-sm font-medium hover:bg-[#152B23] transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Dashboard</span>
                      <ArrowRight size={14} />
                    </Link>
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

        <main className="flex-1 flex flex-col relative z-10">
          
          {/* =========================================================================
              HERO SECTION — PRIMARY VISUAL FOCUS (§7, §8, §9, §10)
              Editorial split layout: ~50% Left (Content), ~50% Right (Imagery & Quote)
              ========================================================================= */}
          <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-16 md:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* HERO LEFT: Editorial Messaging */}
            <motion.div 
              className="lg:col-span-7 flex flex-col items-start space-y-7"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Eyebrow (§7) */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                  EVIDENCE-AWARE MULTIMODAL AYURVEDIC SKIN &amp; WELLNESS INTELLIGENCE
                </span>
              </motion.div>

              {/* Headline (§7) */}
              <motion.h1 
                variants={fadeInUp} 
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.08] font-semibold text-[#1A1F1C] tracking-tight"
              >
                Ancient Wisdom.<br />
                <span className="italic font-normal text-[#1E3A2F]">Modern Intelligence.</span>
              </motion.h1>

              {/* Description (§7) */}
              <motion.p 
                variants={fadeInUp} 
                className="text-base sm:text-lg text-[#5C6660] max-w-xl leading-relaxed font-normal"
              >
                Understand your skin, balance your doshas, and discover personalized Ayurvedic guidance — powered by AI, rooted in tradition.
              </motion.p>

              {/* Hero Buttons (§7) */}
              <motion.div 
                variants={fadeInUp} 
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
              >
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/signin"} 
                  className="bg-[#1E3A2F] text-white px-7 py-3.5 rounded-md text-sm sm:text-base font-medium hover:bg-[#152B23] transition-all shadow-xs text-center flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>{isAuthenticated ? "Enter Dashboard" : "Start Your Journey"}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="px-7 py-3.5 rounded-md border border-[#1E3A2F]/30 bg-transparent text-[#1E3A2F] hover:bg-[#1E3A2F]/5 transition-colors text-sm sm:text-base font-medium text-center"
                >
                  Explore Methodology
                </a>
              </motion.div>

              {/* Hero Value Indicators (§10) — Restrained horizontal row, thin hairlines, NO cards */}
              <motion.div 
                variants={fadeInUp} 
                className="pt-8 border-t border-[#E6DFD5] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 w-full text-left"
              >
                <div className="sm:pr-4 sm:border-r border-[#E6DFD5] space-y-0.5">
                  <p className="font-display text-2xl font-semibold text-[#1E3A2F]">3 Doshas</p>
                  <p className="text-xs text-[#8A948E] font-medium tracking-wide">Vata · Pitta · Kapha</p>
                </div>
                <div className="sm:px-4 sm:border-r border-[#E6DFD5] space-y-0.5">
                  <p className="font-display text-2xl font-semibold text-[#1E3A2F]">Evidence-Aware</p>
                  <p className="text-xs text-[#8A948E] font-medium tracking-wide">Transparent AI Reasoning</p>
                </div>
                <div className="sm:pl-4 space-y-0.5">
                  <p className="font-display text-2xl font-semibold text-[#1E3A2F]">Non-Clinical</p>
                  <p className="text-xs text-[#8A948E] font-medium tracking-wide">Wellness, Not Diagnosis</p>
                </div>
              </motion.div>
            </motion.div>

            {/* HERO RIGHT: Large Immersive Wellness Visual & Editorial Quote (§8, §9) */}
            <motion.div 
              className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full relative rounded-lg overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-sm">
                <img 
                  src="/images/1.jpg" 
                  alt="Authentic Ayurvedic botanical ingredients, mortar, pestle, and natural oils" 
                  className="w-full h-[440px] sm:h-[480px] object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Hero Editorial Quote (§9) — Cormorant Garamond, italic, small hairline */}
              <div className="w-full max-w-md pt-2 px-2 text-left space-y-2">
                <blockquote className="font-display text-xl sm:text-2xl italic font-normal text-[#1E3A2F] leading-snug">
                  "When skin speaks,<br />Ayurveda listens."
                </blockquote>
                <div className="w-12 h-[1px] bg-[#C5A059]" />
                <p className="text-xs font-body uppercase tracking-widest text-[#8A948E]">
                  Classical Dinacharya Principle
                </p>
              </div>
            </motion.div>

          </section>

          {/* =========================================================================
              SECOND SECTION: ROOTED IN TRADITION (§11)
              Editorial title, narrative, Learn More link, and 4 process columns. NO cards.
              ========================================================================= */}
          <section id="about" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 px-6 sm:px-10 relative">
            <div className="max-w-7xl mx-auto space-y-16">
              
              {/* Section Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                    ROOTED IN TRADITION
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C] leading-[1.15]">
                    The Ayurvedic Approach<br />to Radiant Skin
                  </h2>
                </div>
                <div className="lg:col-span-5 space-y-4 text-left">
                  <p className="text-base text-[#5C6660] leading-relaxed">
                    AayurFace combines classical Ayurvedic wisdom with modern AI to give you personalized insights, natural remedies and daily routines for healthier, balanced skin.
                  </p>
                  <a 
                    href="#how-it-works" 
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A2F] hover:text-[#C5A059] transition-colors group"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Four Process Columns (§11) — Thin vertical hairlines, NO cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 pt-6 border-t border-[#E6DFD5]">
                
                {/* Column 1: SCAN */}
                <div className="lg:pr-8 lg:border-r border-[#E6DFD5] space-y-3">
                  <div className="w-10 h-10 rounded-md bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                    <Scan size={20} className="stroke-[1.75]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C] tracking-tight">
                    SCAN
                  </h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Capture your skin with advanced AI &amp; CV technology.
                  </p>
                </div>

                {/* Column 2: ANALYZE */}
                <div className="lg:px-8 lg:border-r border-[#E6DFD5] space-y-3">
                  <div className="w-10 h-10 rounded-md bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                    <Cpu size={20} className="stroke-[1.75]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C] tracking-tight">
                    ANALYZE
                  </h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Get multi-layered insights from Ayurveda and AI.
                  </p>
                </div>

                {/* Column 3: PERSONALIZE */}
                <div className="lg:px-8 lg:border-r border-[#E6DFD5] space-y-3">
                  <div className="w-10 h-10 rounded-md bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                    <Leaf size={20} className="stroke-[1.75]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C] tracking-tight">
                    PERSONALIZE
                  </h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Receive tailored remedies, routines and guidance.
                  </p>
                </div>

                {/* Column 4: BALANCE */}
                <div className="lg:pl-8 space-y-3">
                  <div className="w-10 h-10 rounded-md bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                    <Compass size={20} className="stroke-[1.75]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C] tracking-tight">
                    BALANCE
                  </h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Support your skin's natural harmony — over time.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              JOURNEY SECTION (§13)
              Editorial storytelling: progression understand → personalize → practice → balance
              ========================================================================= */}
          <section id="journey" className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left: Progression Milestones */}
              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-3">
                  <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                    ANCIENT WISDOM. MODERN CARE.
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
                    Your Journey to Balanced Skin
                  </h2>
                  <p className="text-base text-[#5C6660] leading-relaxed">
                    Ayurveda treats the skin as a dynamic reflection of inner doshic equilibrium. Our workflow mirrors classical constitutional observation:
                  </p>
                </div>

                {/* Step progression with thin lines */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <span className="font-display text-xl font-semibold text-[#C5A059] shrink-0 pt-0.5">01</span>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A1F1C]">Understand</h3>
                      <p className="text-sm text-[#5C6660]">Determine your inherent constitution (Prakriti) alongside current skin imbalances (Vikriti).</p>
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-[#E6DFD5]" />

                  <div className="flex items-start gap-4">
                    <span className="font-display text-xl font-semibold text-[#C5A059] shrink-0 pt-0.5">02</span>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A1F1C]">Personalize</h3>
                      <p className="text-sm text-[#5C6660]">Synthesize facial texture observations with classical Ayurvedic herbology and dietary insights.</p>
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-[#E6DFD5]" />

                  <div className="flex items-start gap-4">
                    <span className="font-display text-xl font-semibold text-[#C5A059] shrink-0 pt-0.5">03</span>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A1F1C]">Practice</h3>
                      <p className="text-sm text-[#5C6660]">Adopt grounded daily Dinacharya rituals, morning hydration methods, and evening Lepa recipes.</p>
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-[#E6DFD5]" />

                  <div className="flex items-start gap-4">
                    <span className="font-display text-xl font-semibold text-[#C5A059] shrink-0 pt-0.5">04</span>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A1F1C]">Balance</h3>
                      <p className="text-sm text-[#5C6660]">Observe cyclical changes with the seasons (*Ritucharya*) and nurture lifelong constitutional harmony.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Secondary Botanical Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-lg overflow-hidden border border-[#E6DFD5] bg-[#FFFFFF] shadow-xs">
                  <img 
                    src="/images/auth-bg.jpg" 
                    alt="Natural Ayurvedic botanical powder, infusion oil, and fresh neem leaves" 
                    className="w-full h-[480px] object-cover object-center transition-transform duration-700 hover:scale-[1.02]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/20 to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
              METHODOLOGY SECTION (§14)
              Conceptual product journey: Capture ↓ Visual Features ↓ Ayurvedic Context ↓ Lifestyle Context ↓ Multimodal Reasoning ↓ Personalized Guidance
              ========================================================================= */}
          <section id="how-it-works" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto space-y-16">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                  PRODUCT METHODOLOGY
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
                  How AayurFace Analyzes Your Skin
                </h2>
                <p className="text-base text-[#5C6660]">
                  A disciplined multi-stage intelligence pipeline translating client-side observations into grounded botanical guidance.
                </p>
              </div>

              {/* Conceptual Flow: 6 connected steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 pt-4 relative">
                
                {/* Step 1 */}
                <div className="flex flex-col space-y-3 p-4 border-b lg:border-b-0 lg:border-r border-[#E6DFD5]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">01 / Intake</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Capture</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Client-side guided facial alignment with optimal lighting verification.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col space-y-3 p-4 border-b lg:border-b-0 lg:border-r border-[#E6DFD5]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">02 / Signal</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Visual Features</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Surface hydration, texture uniformity, and sebum distribution mapping.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col space-y-3 p-4 border-b lg:border-b-0 lg:border-r border-[#E6DFD5]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">03 / Tradition</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Ayurvedic Context</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Classical correlation with Charaka &amp; Sushruta doshic indicators.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col space-y-3 p-4 border-b lg:border-b-0 lg:border-r border-[#E6DFD5]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">04 / Balance</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Lifestyle Context</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Sleep rhythm, climate zone, and seasonal transition (*Ritu*) factors.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col space-y-3 p-4 border-b lg:border-b-0 lg:border-r border-[#E6DFD5]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">05 / Synthesis</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Multimodal Reasoning</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Cross-verification between visual tendencies and intake parameters.
                  </p>
                </div>

                {/* Step 6 */}
                <div className="flex flex-col space-y-3 p-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">06 / Output</span>
                  <h4 className="font-display text-xl font-semibold text-[#1A1F1C]">Personal Guidance</h4>
                  <p className="text-xs text-[#5C6660] leading-relaxed">
                    Actionable herbal remedies, daily rituals, and ingredient precautions.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              AYURVEDA SECTION (§15)
              Tridosha presentation: Vata, Pitta, Kapha with typographic hierarchy. NO cards.
              ========================================================================= */}
          <section id="ayurveda" className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-20 sm:py-28">
            <div className="space-y-16">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                  THE CONSTITUTIONAL FOUNDATION
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
                  Understanding the Three Doshas
                </h2>
                <p className="text-base text-[#5C6660]">
                  Ayurveda identifies three fundamental biological energies (*Doshas*) governing skin health, hydration, and cellular longevity.
                </p>
              </div>

              {/* Three Dosha Columns separated by hairlines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 pt-4">
                
                {/* VATA */}
                <div className="md:pr-10 md:border-r border-[#E6DFD5] space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#5B7B88]">
                      <Wind size={18} />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-semibold text-[#1A1F1C]">Vata</h3>
                      <p className="text-xs font-medium text-[#8A948E] uppercase tracking-wider">Air &amp; Ether Elements</p>
                    </div>
                  </div>
                  <div className="w-10 h-[1px] bg-[#C5A059]" />
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Governs movement, dryness, and circulation. Vata skin is naturally delicate, cool to the touch, and prone to premature dehydration or tightness when out of balance.
                  </p>
                  <div className="pt-2 text-xs font-medium text-[#1E3A2F] space-y-1">
                    <p className="font-semibold uppercase tracking-wider text-[11px] text-[#6B8E7D]">Botanical Pacifiers:</p>
                    <p className="text-[#5C6660]">Kumkumadi Taila, Sesame Oil, Ashwagandha, Rose Water</p>
                  </div>
                </div>

                {/* PITTA */}
                <div className="md:px-10 md:border-r border-[#E6DFD5] space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#C86D51]">
                      <Flame size={18} />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-semibold text-[#1A1F1C]">Pitta</h3>
                      <p className="text-xs font-medium text-[#8A948E] uppercase tracking-wider">Fire &amp; Water Elements</p>
                    </div>
                  </div>
                  <div className="w-10 h-[1px] bg-[#C5A059]" />
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Governs metabolism, radiance, and cutaneous temperature. Pitta skin is warm and sensitive, reacting quickly to heat, sun exposure, and inflammatory flare-ups.
                  </p>
                  <div className="pt-2 text-xs font-medium text-[#1E3A2F] space-y-1">
                    <p className="font-semibold uppercase tracking-wider text-[11px] text-[#6B8E7D]">Botanical Pacifiers:</p>
                    <p className="text-[#5C6660]">Chandana (Sandalwood), Manjistha, Aloe Vera, Neem</p>
                  </div>
                </div>

                {/* KAPHA */}
                <div className="md:pl-10 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center text-[#5C7C5A]">
                      <Droplets size={18} />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-semibold text-[#1A1F1C]">Kapha</h3>
                      <p className="text-xs font-medium text-[#8A948E] uppercase tracking-wider">Earth &amp; Water Elements</p>
                    </div>
                  </div>
                  <div className="w-10 h-[1px] bg-[#C5A059]" />
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Governs structural density, lubrication, and pore resilience. Kapha skin is thick, supple, and naturally moisturized, but susceptible to sluggish congestion and excess sebum.
                  </p>
                  <div className="pt-2 text-xs font-medium text-[#1E3A2F] space-y-1">
                    <p className="font-semibold uppercase tracking-wider text-[11px] text-[#6B8E7D]">Botanical Pacifiers:</p>
                    <p className="text-[#5C6660]">Triphala, Besan (Gram Flour), Turmeric, Tulsi</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              INTELLIGENCE SECTION (§16)
              "Intelligence You Can Understand."
              Observed → Interpreted → Personalized
              ========================================================================= */}
          <section id="intelligence" className="w-full bg-[#F3EFEA] border-y border-[#E6DFD5] py-20 sm:py-28 px-6 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-14">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
                  EXPLAINABLE WELLNESS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
                  Intelligence You Can Understand.
                </h2>
                <p className="text-base text-[#5C6660]">
                  AayurFace combines observed visual signals, contextual information and Ayurvedic knowledge into understandable wellness guidance.
                </p>
              </div>

              {/* Three-stage visual connection: Observed → Interpreted → Personalized */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-center">
                
                {/* Stage 1 */}
                <div className="bg-[#FAF8F5] p-8 rounded-lg border border-[#E6DFD5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#6B8E7D] font-body">Stage 1</span>
                    <span className="w-2 h-2 rounded-full bg-[#6B8E7D]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">Observed</h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Client-side camera detects observable facial characteristics: T-zone shine balance, cheek hydration level, and texture tone clarity.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="bg-[#FAF8F5] p-8 rounded-lg border border-[#E6DFD5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] font-body">Stage 2</span>
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">Interpreted</h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Observations map to classical *Dravyaguna* logic, correlating visible patterns with internal Vata, Pitta, or Kapha tendencies.
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="bg-[#FAF8F5] p-8 rounded-lg border border-[#E6DFD5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#1E3A2F] font-body">Stage 3</span>
                    <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1F1C]">Personalized</h3>
                  <p className="text-sm text-[#5C6660] leading-relaxed">
                    Generates bespoke topical formulations (Lepas), morning routines, and seasonal Dinacharya rituals with complete rationale transparency.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SAFETY SECTION (§17)
              Subtle trust section: "Wellness Guidance, Not Medical Diagnosis."
              Understated, warm sand container, NOT a warning banner.
              ========================================================================= */}
          <section id="safety" className="max-w-4xl w-full mx-auto px-6 sm:px-10 py-16 sm:py-20">
            <div className="p-8 sm:p-10 rounded-lg bg-[#FAF8F5] border border-[#E6DFD5] text-center space-y-3">
              <div className="inline-flex items-center justify-center gap-2 text-[#1E3A2F]">
                <ShieldCheck size={20} className="text-[#6B8E7D]" />
                <h3 className="font-display text-2xl font-semibold">
                  Wellness Guidance, Not Medical Diagnosis.
                </h3>
              </div>
              <p className="text-sm text-[#5C6660] leading-relaxed max-w-2xl mx-auto font-normal">
                AayurFace is designed for wellness and skincare guidance. It does not replace professional medical advice, clinical dermatology consultations, or disease diagnosis.
              </p>
            </div>
          </section>

          {/* =========================================================================
              FINAL CLOSING CTA SECTION (§18)
              "Begin Your Skin Journey."
              Primary CTA: Enter AayurFace → | Secondary: Explore How It Works →
              ========================================================================= */}
          <section className="w-full bg-[#1E3A2F] text-white py-20 sm:py-28 px-6 sm:px-10 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              
              <span className="inline-block px-3 py-1 rounded-sm bg-[#C5A059]/20 text-[#C5A059] text-xs font-body uppercase tracking-[0.2em] font-semibold border border-[#C5A059]/30">
                TIMELESS AYURVEDIC INTELLIGENCE
              </span>

              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.12] text-white tracking-tight">
                Begin Your Skin Journey.
              </h2>

              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto font-normal leading-relaxed">
                Understand your skin.<br />
                Explore your Ayurvedic context.<br />
                Build a routine that fits you.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/signin"} 
                  className="w-full sm:w-auto bg-[#C5A059] text-[#1E3A2F] font-body font-semibold px-8 py-4 rounded-md hover:bg-[#C5A059]/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>{isAuthenticated ? "Enter Dashboard" : "Enter AayurFace"}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="w-full sm:w-auto border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-md font-body font-medium transition-colors text-center"
                >
                  Explore How It Works →
                </a>
              </div>

            </div>
          </section>

        </main>

        {/* =========================================================================
            FOOTER (§19)
            Spacious, premium footer: Explore, Product, Company, Trust
            ========================================================================= */}
        <footer id="contact" className="bg-[#FAF8F5] border-t border-[#E6DFD5] py-16 sm:py-20 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Brand Column */}
              <div className="col-span-2 space-y-4">
                <Logo size="md" />
                <p className="text-xs text-[#5C6660] max-w-xs leading-relaxed font-normal">
                  Evidence-aware multimodal skin &amp; wellness intelligence bridging classical Ayurvedic philosophy with disciplined computer vision.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#8A948E] font-medium">
                    Classical Sanskrit Botanical Citation
                  </span>
                </div>
              </div>

              {/* Column 1: Explore */}
              <div className="space-y-3">
                <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Explore</h4>
                <ul className="space-y-2 text-xs text-[#5C6660]">
                  <li><a href="#about" className="hover:text-[#1E3A2F] transition-colors">Philosophy</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#1E3A2F] transition-colors">Methodology</a></li>
                  <li><a href="#ayurveda" className="hover:text-[#1E3A2F] transition-colors">The 3 Doshas</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#1E3A2F] transition-colors">Dinacharya</a></li>
                </ul>
              </div>

              {/* Column 2: Product */}
              <div className="space-y-3">
                <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Product</h4>
                <ul className="space-y-2 text-xs text-[#5C6660]">
                  <li><Link to="/dashboard" className="hover:text-[#1E3A2F] transition-colors">Wellness Dashboard</Link></li>
                  <li><Link to="/scan" className="hover:text-[#1E3A2F] transition-colors">Facial Observation</Link></li>
                  <li><Link to="/chat" className="hover:text-[#1E3A2F] transition-colors">Ayurvedic Chat</Link></li>
                  <li><Link to="/remedies" className="hover:text-[#1E3A2F] transition-colors">Botanical Library</Link></li>
                </ul>
              </div>

              {/* Column 3: Trust & Company */}
              <div className="space-y-3">
                <h4 className="font-display text-base font-semibold text-[#1A1F1C]">Trust &amp; Safety</h4>
                <ul className="space-y-2 text-xs text-[#5C6660]">
                  <li><a href="#safety" className="hover:text-[#1E3A2F] transition-colors">Non-Diagnostic Boundary</a></li>
                  <li><Link to="/privacy" className="hover:text-[#1E3A2F] transition-colors">Privacy Principles</Link></li>
                  <li><Link to="/terms" className="hover:text-[#1E3A2F] transition-colors">Terms of Service</Link></li>
                  <li><a href="#contact" className="hover:text-[#1E3A2F] transition-colors">Inquiries</a></li>
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

      </div>
    </PageTransition>
  );
}
