import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Sparkles, MessageCircle } from 'lucide-react';
import Logo from '@/components/common/Logo';
import PageTransition from '@/components/layout/PageTransition';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-cream relative overflow-hidden font-poppins text-charcoal">
        {/* Floating Leaves Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.svg
              key={i}
              className={`absolute text-herbal opacity-15 animate-float`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 1.5}s`,
                width: `${Math.random() * 40 + 40}px`,
                height: `${Math.random() * 40 + 40}px`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </motion.svg>
          ))}
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-warmgray/50 px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-body-md font-medium text-charcoal hover:text-herbal transition-colors">
              Sign In
            </Link>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="bg-herbal text-white px-5 py-2.5 rounded-button text-body-md font-medium hover:bg-opacity-90 transition-all shadow-sm">
                Get Started
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 md:py-24">
            <motion.div 
              className="flex flex-col items-start space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={fadeInUp} className="text-turmeric font-medium text-small tracking-wider uppercase flex items-center gap-2">
                <Sparkles size={16} />
                100% Natural • Ayurvedic Wisdom
              </motion.span>
              <motion.h1 variants={fadeInUp} className="font-playfair text-hero md:text-[48px] leading-tight font-semibold text-charcoal">
                Your Natural Skin Care Companion
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-body-md text-charcoal-light max-w-md leading-relaxed">
                Discover Ayurvedic remedies personalized to your skin. Embrace a holistic journey to wellness and natural beauty.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link to="/register" className="block w-full sm:w-auto text-center bg-herbal text-white px-8 py-3.5 rounded-button text-body-md font-medium hover:shadow-lg transition-all shadow-md">
                    Get Started →
                  </Link>
                </motion.div>
                <Link to="/login" className="text-small text-charcoal-light hover:text-herbal font-medium transition-colors">
                  I already have an account → Sign In
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="hidden md:flex justify-center items-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="/images/1.jpg" 
                alt="Ayurvedic Skin Care" 
                className="w-full h-[500px] object-cover rounded-[2rem] shadow-2xl" 
              />
            </motion.div>
          </div>

          {/* Feature Strip */}
          <motion.div 
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 pb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeInUp} className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-leaf-soft flex items-center justify-center text-herbal">
                <Camera size={24} />
              </div>
              <h3 className="font-playfair text-subheading font-semibold text-charcoal">Skin Scan</h3>
              <p className="text-small text-charcoal-light">Analyze your skin instantly using your device's camera for personalized insights.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-soft flex items-center justify-center text-turmeric">
                <Sparkles size={24} />
              </div>
              <h3 className="font-playfair text-subheading font-semibold text-charcoal">Ayurvedic Remedies</h3>
              <p className="text-small text-charcoal-light">Get natural, time-tested Ayurvedic recommendations tailored to your unique skin dosha.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-leaf-soft flex items-center justify-center text-herbal">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-playfair text-subheading font-semibold text-charcoal">Personal Guide</h3>
              <p className="text-small text-charcoal-light">Chat with our AI wellness assistant anytime for guidance on your skin care routine.</p>
            </motion.div>
          </motion.div>

          {/* New CTA Section */}
          <motion.div 
            className="w-full max-w-6xl relative rounded-[2rem] overflow-hidden shadow-2xl mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0">
              <img 
                src="/images/2.jpg" 
                alt="Ayurvedic Journey" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"></div>
            </div>
            
            <div className="relative z-10 py-20 px-8 text-center flex flex-col items-center justify-center">
              <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl">
                Ready to Reveal Your Natural Glow?
              </h2>
              <p className="text-white/90 text-lg max-w-xl mb-10">
                Join thousands of others who have transformed their skin care routine with personalized Ayurvedic wisdom.
              </p>
              <Link to="/register" className="bg-white text-herbal px-10 py-4 rounded-button text-body-md font-bold hover:shadow-xl transition-all hover:-translate-y-1">
                Start Your Journey Today
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-cream border-t border-warmgray py-8 px-6 text-center z-10 relative">
          <p className="text-small text-charcoal-light mb-4 italic">For wellness guidance only, not medical advice.</p>
          <div className="flex items-center justify-center gap-4 text-caption text-charcoal-light/80">
            <Link to="#" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="#" className="hover:text-charcoal transition-colors">Terms of Service</Link>
          </div>
          <p className="text-caption text-charcoal-light/60 mt-4">© {new Date().getFullYear()} Aayurface. All rights reserved.</p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default LandingPage;
