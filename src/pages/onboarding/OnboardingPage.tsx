import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronRight, Sparkles, Sprout, ShieldCheck, Check } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { SKIN_TYPE_OPTIONS } from '@/types';
import type { SkinType } from '@/types';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('dry');
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const userName = user?.full_name || 'Seeker';

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await updateProfile({
        skin_type: selectedSkinType,
        onboarding_completed: true,
      });
      navigate('/home');
    }
  };

  const handleSkip = async () => {
    if (step === 2) {
      setStep(3);
    } else {
      await updateProfile({
        skin_type: selectedSkinType,
        onboarding_completed: true,
      });
      navigate('/home');
    }
  };

  const renderDots = () => {
    return (
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              step === i ? 'bg-brand-primary w-6 h-2' : 'bg-border-default w-2 h-2'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-6 font-body text-text-primary selection:bg-brand-secondary/20 selection:text-brand-primary">
        
        <div className="w-full max-w-lg bg-background-surface rounded-lg shadow-md border border-border-default p-8 sm:p-10 relative z-10 flex flex-col min-h-[520px]">
          {renderDots()}

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full items-center text-center"
                >
                  <div className="w-16 h-16 mb-5 text-text-inverse bg-brand-primary rounded-full flex items-center justify-center shadow-md">
                    <Sprout size={30} className="text-brand-accent" />
                  </div>
                  
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2 text-text-primary">
                    Namaste, {userName}
                  </h1>
                  <p className="text-body-md text-text-secondary mb-8 max-w-sm">
                    Welcome to your evidence-aware Ayurvedic wellness journey.
                  </p>
                  
                  <div className="space-y-4 text-left w-full max-w-sm mb-auto">
                    <div className="flex items-start gap-3.5 p-3 rounded-md bg-background-primary border border-border-default/60">
                      <div className="text-brand-accent mt-0.5"><Sparkles size={18} /></div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Understand Your Dosha</h4>
                        <p className="text-caption text-text-secondary">Discover Vata, Pitta, and Kapha constitutional balance.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 p-3 rounded-md bg-background-primary border border-border-default/60">
                      <div className="text-brand-primary mt-0.5"><Camera size={18} /></div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Standardized Facial Scan</h4>
                        <p className="text-caption text-text-secondary">Correlate skin observables with botanical remedies.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 p-3 rounded-md bg-background-primary border border-border-default/60">
                      <div className="text-emerald-800 mt-0.5"><ShieldCheck size={18} /></div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Classical Lepas & Rituals</h4>
                        <p className="text-caption text-text-secondary">Grounded Ayurvedic formulations cited from Samhitas.</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md mt-8 flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
                  >
                    Continue <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full"
                >
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-1 text-center text-text-primary">
                    Your Primary Skin Tendency
                  </h2>
                  <p className="text-body-md text-text-secondary mb-6 text-center">
                    Select the constitutional baseline closest to your skin.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-auto overflow-y-auto pr-1 pb-2">
                    {SKIN_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSkinType(option.value)}
                        className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedSkinType === option.value 
                            ? 'border-brand-primary bg-emerald-50/70 shadow-sm ring-1 ring-brand-primary' 
                            : 'border-border-default bg-background-surface hover:border-brand-secondary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xl">{option.emoji}</span>
                          {selectedSkinType === option.value && <Check size={14} className="text-brand-primary" />}
                        </div>
                        <span className={`block font-display font-semibold text-sm mb-0.5 ${selectedSkinType === option.value ? 'text-brand-primary' : 'text-text-primary'}`}>
                          {option.label}
                        </span>
                        <span className="text-[11px] text-text-secondary leading-snug line-clamp-2">{option.description}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 mt-6">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
                    >
                      Continue <ChevronRight size={16} />
                    </motion.button>
                    <button 
                      onClick={handleSkip}
                      className="text-caption font-body text-text-secondary hover:text-text-primary transition-colors font-medium py-1.5 cursor-pointer"
                    >
                      Skip this step
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full items-center text-center justify-center"
                >
                  <div className="w-16 h-16 mb-5 text-text-inverse bg-brand-primary rounded-full flex items-center justify-center shadow-md">
                    <Camera size={28} className="text-brand-accent" />
                  </div>
                  
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2 text-text-primary">
                    Camera & Privacy Consent
                  </h2>
                  <p className="text-body-md text-text-secondary mb-8 max-w-sm leading-relaxed">
                    AayurFace uses your device camera for non-diagnostic skin observable assessment. Biometric images are processed on-device and never shared without consent.
                  </p>
                  
                  <div className="flex flex-col gap-2 w-full mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
                    >
                      Grant & Complete Setup
                    </motion.button>
                    <button 
                      onClick={handleSkip}
                      className="text-caption font-body text-text-secondary hover:text-text-primary transition-colors font-medium py-1.5 cursor-pointer"
                    >
                      Complete Setup
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
