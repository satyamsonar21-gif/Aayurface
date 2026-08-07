import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronRight, Sparkles, Sprout, ShieldCheck } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { SKIN_TYPE_OPTIONS } from '@/types';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/home');
    }
  };

  const handleSkip = () => {
    if (step === 2) setStep(3);
    else navigate('/home');
  };

  const renderDots = () => {
    return (
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              step === i ? 'bg-herbal w-3 h-3' : 'bg-warmgray w-2 h-2'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 font-poppins text-charcoal overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sandalwood rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-leaf-soft rounded-full blur-3xl opacity-40 -ml-20 -mb-20"></div>

        <div className="w-full max-w-lg bg-white rounded-card shadow-card p-8 md:p-10 relative z-10 flex flex-col min-h-[550px]">
          {renderDots()}

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full items-center text-center"
                >
                  <div className="w-24 h-24 mb-6 text-herbal bg-leaf-soft rounded-full flex items-center justify-center">
                    <Sprout size={40} />
                  </div>
                  <h1 className="font-playfair text-title font-semibold mb-4 text-charcoal">Namaste, User 👋</h1>
                  <p className="text-body-md text-charcoal-light mb-8 max-w-sm">Welcome to your personalized Ayurvedic skin care journey.</p>
                  
                  <div className="space-y-4 text-left w-full max-w-sm mb-auto">
                    <div className="flex items-start gap-3">
                      <div className="text-herbal mt-0.5"><Sparkles size={20} /></div>
                      <div>
                        <h4 className="font-medium text-charcoal text-body-md">Discover Your Dosha</h4>
                        <p className="text-small text-charcoal-light">Learn what your skin naturally needs.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-herbal mt-0.5"><Camera size={20} /></div>
                      <div>
                        <h4 className="font-medium text-charcoal text-body-md">AI Skin Analysis</h4>
                        <p className="text-small text-charcoal-light">Scan your face for instant insights.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-herbal mt-0.5"><ShieldCheck size={20} /></div>
                      <div>
                        <h4 className="font-medium text-charcoal text-body-md">Natural Remedies</h4>
                        <p className="text-small text-charcoal-light">100% natural, holistic solutions.</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full bg-herbal text-white rounded-button py-3.5 font-medium text-body-md mt-8 flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
                  >
                    Next <ChevronRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <h2 className="font-playfair text-title font-semibold mb-2 text-center text-charcoal">Tell us about your skin</h2>
                  <p className="text-body-md text-charcoal-light mb-6 text-center">Select your primary skin type if you know it.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-auto overflow-y-auto pr-1 pb-4">
                    {SKIN_TYPE_OPTIONS && SKIN_TYPE_OPTIONS.length > 0 ? SKIN_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedSkinType(option.value)}
                        className={`p-4 rounded-card border-2 text-left transition-all ${
                          selectedSkinType === option.value 
                            ? 'border-herbal bg-leaf-soft shadow-sm' 
                            : 'border-warmgray bg-white hover:border-herbal/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.emoji}</span>
                        <span className={`block font-medium mb-1 ${selectedSkinType === option.value ? 'text-herbal' : 'text-charcoal'}`}>
                          {option.label}
                        </span>
                        <span className="text-xs text-charcoal-light line-clamp-2">{option.description}</span>
                      </button>
                    )) : (
                      ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedSkinType(type)}
                          className={`p-4 rounded-card border-2 text-left transition-all ${
                            selectedSkinType === type 
                              ? 'border-herbal bg-leaf-soft shadow-sm' 
                              : 'border-warmgray bg-white hover:border-herbal/50'
                          }`}
                        >
                          <span className={`block font-medium ${selectedSkinType === type ? 'text-herbal' : 'text-charcoal'}`}>
                            {type}
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="w-full bg-herbal text-white rounded-button py-3.5 font-medium text-body-md flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
                    >
                      Next <ChevronRight size={18} />
                    </motion.button>
                    <button 
                      onClick={handleSkip}
                      className="text-small text-charcoal-light hover:text-charcoal transition-colors font-medium py-2"
                    >
                      Skip this step
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full items-center text-center justify-center"
                >
                  <div className="w-24 h-24 mb-6 text-charcoal bg-warmgray/30 rounded-full flex items-center justify-center">
                    <Camera size={40} />
                  </div>
                  <h2 className="font-playfair text-title font-semibold mb-4 text-charcoal">Allow camera access</h2>
                  <p className="text-body-md text-charcoal-light mb-8 max-w-sm">
                    We use your camera to scan your skin for personalized Ayurvedic analysis. Your privacy is our priority, and images are never stored.
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="w-full bg-herbal text-white rounded-button py-3.5 font-medium text-body-md flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
                    >
                      Grant Camera Access
                    </motion.button>
                    <button 
                      onClick={handleSkip}
                      className="text-small text-charcoal-light hover:text-charcoal transition-colors font-medium py-2"
                    >
                      Skip for now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OnboardingPage;
