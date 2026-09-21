// ============================================================
// AayurFace — Real Authenticated Onboarding Experience (Phase 08)
// Multi-step intake: Identity -> Self-reported Skin Baseline ->
// Daily Wellness Rhythms -> Server-Side Consents -> Atomic Init.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Sprout, 
  ShieldCheck, 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Lock, 
  AlertCircle, 
  Loader2,
  FileText,
  User as UserIcon,
  Activity,
  HeartHandshake
} from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { SKIN_TYPE_OPTIONS, CURRENT_CONSENT_VERSIONS } from '@/lib/onboardingService';
import type { SkinType, ConsentItemInput, WellnessFactors } from '@/types';

const SKIN_CONCERN_OPTIONS = [
  'Dryness & Flaking',
  'Sensitivity & Redness',
  'Excess Sebum / Shine',
  'Acne & Blemishes',
  'Dullness & Uneven Tone',
  'Early Fine Lines',
];

const SLEEP_OPTIONS = [
  { value: '<6 hrs', label: 'Less than 6 hours (Vata aggravating)' },
  { value: '6-8 hrs', label: '6 to 8 hours (Balanced)' },
  { value: '>8 hrs', label: 'More than 8 hours (Kapha heavy)' },
];

const HYDRATION_OPTIONS = [
  { value: '<1.5 L', label: 'Under 1.5 Liters / day' },
  { value: '1.5-2.5 L', label: '1.5 to 2.5 Liters / day (Optimal)' },
  { value: '>2.5 L', label: 'Over 2.5 Liters / day' },
];

const STRESS_OPTIONS = [
  { value: 'Calm', label: 'Grounded & Serene' },
  { value: 'Moderate', label: 'Moderate / Variable' },
  { value: 'Elevated', label: 'Elevated / Pitta-Vata active' },
];

const CLIMATE_OPTIONS = [
  { value: 'Dry & Cool', label: 'Dry & Cool (Autumn / Winter)' },
  { value: 'Warm & Humid', label: 'Warm & Humid (Monsoon / Summer)' },
  { value: 'Temperate', label: 'Temperate / Moderate' },
];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const initialName = user?.full_name?.trim() || (user?.email ? user.email.split('@')[0] : '');
  const [fullName, setFullName] = useState(initialName);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>(user?.skin_type || 'dry');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['Dryness & Flaking']);

  // Lifestyle & Wellness Factors
  const [sleepHours, setSleepHours] = useState('6-8 hrs');
  const [hydration, setHydration] = useState('1.5-2.5 L');
  const [stress, setStress] = useState('Moderate');
  const [climate, setClimate] = useState('Temperate');

  // Consent toggles
  const [consentCamera, setConsentCamera] = useState(true);
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentResearch, setConsentResearch] = useState(false);

  // Async State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!consentCamera || !consentTerms) {
      setErrorMessage('Please grant the required educational camera and terms consents to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const consentPayload: ConsentItemInput[] = [
      {
        consent_type: 'camera_processing',
        consent_version: CURRENT_CONSENT_VERSIONS.camera_processing,
        granted: consentCamera,
      },
      {
        consent_type: 'terms_and_privacy',
        consent_version: CURRENT_CONSENT_VERSIONS.terms_and_privacy,
        granted: consentTerms,
      },
      {
        consent_type: 'wellness_research',
        consent_version: CURRENT_CONSENT_VERSIONS.wellness_research,
        granted: consentResearch,
      },
    ];

    const wellnessFactors: WellnessFactors = {
      sleepHours,
      hydrationLevel: hydration,
      stressLevel: stress,
      climate,
      skinConcerns: selectedConcerns,
    };

    try {
      await completeOnboarding({
        fullName: fullName.trim() || initialName || 'Seeker',
        skinType: selectedSkinType,
        dosha: null, // Truthful Ayurvedic stance: Dosha is unestablished until verified
        wellnessFactors,
        consents: consentPayload,
      });

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred initializing your profile.';
      console.error('[Onboarding] Error submitting onboarding:', err);
      setErrorMessage(`Setup could not be saved: ${message}. Please check your connection and try again.`);
      setIsSubmitting(false);
    }
  };

  const userEmail = user?.email || 'member@aayurface.local';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-body text-text-primary selection:bg-brand-secondary/20 selection:text-brand-primary">
        
        {/* Main Card Container */}
        <div className="w-full max-w-2xl bg-background-surface rounded-xl shadow-lg border border-border-default p-6 sm:p-8 md:p-10 relative z-10 flex flex-col min-h-[580px]">
          
          {/* Top Progress & Step Indicator */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-caption font-semibold">
              <span className="text-brand-accent uppercase tracking-wider flex items-center gap-1.5">
                <Sprout size={15} />
                Ayurvedic Intake Protocol
              </span>
              <span className="text-text-tertiary">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>

            {/* Visual Step Bar */}
            <div className="grid grid-cols-6 gap-1.5 h-1.5 w-full bg-background-subtle rounded-full overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className={`h-full transition-all duration-300 rounded-full ${
                    idx <= currentStep ? 'bg-brand-primary' : 'bg-border-default/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-caption flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Action Required</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Dynamic Step Content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {/* ------------------------------------------------------------ */}
              {/* STEP 1: Welcome & Overview                                    */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 1 && (
                <motion.div
                  key="step-welcome"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full items-center text-center my-auto"
                >
                  <div className="w-16 h-16 mb-4 text-text-inverse bg-brand-primary rounded-full flex items-center justify-center shadow-md ring-4 ring-background-subtle">
                    <Sparkles size={28} className="text-brand-accent" />
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2 text-text-primary">
                    Namaste, {fullName || 'Seeker'}
                  </h1>
                  <p className="text-body-md text-text-secondary mb-8 max-w-md">
                    Welcome to AayurFace. Before beginning, we invite you to complete a brief 2-minute personal wellness intake to tailor your botanical reflections.
                  </p>

                  <div className="space-y-3.5 text-left w-full max-w-md mb-8">
                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-background-primary/80 border border-border-default">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Activity size={16} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Self-Reported Baseline</h4>
                        <p className="text-caption text-text-secondary leading-snug">
                          Record your primary skin tendencies and daily rhythms without assumptions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-background-primary/80 border border-border-default">
                      <div className="w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Camera size={16} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Observable Skin Correlation</h4>
                        <p className="text-caption text-text-secondary leading-snug">
                          Learn how facial features reflect physiological balance through classical Samhita insights.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-background-primary/80 border border-border-default">
                      <div className="w-8 h-8 rounded-full bg-emerald-800/10 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary text-base">Client-Side Privacy</h4>
                        <p className="text-caption text-text-secondary leading-snug">
                          Your camera data remains securely managed within your authenticated browser session.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full max-w-md bg-brand-primary text-text-inverse rounded-lg py-3.5 px-6 font-body font-medium text-body-md flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer min-h-[44px]"
                  >
                    Begin Intake <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 2: Identity & Verified Account                           */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 2 && (
                <motion.div
                  key="step-identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-1 mb-6 text-center sm:text-left">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                      Personal Identity & Profile
                    </h2>
                    <p className="text-body-md text-text-secondary">
                      Confirm your full name for personal Ayurvedic address and routine tracking.
                    </p>
                  </div>

                  <div className="space-y-5 my-auto max-w-lg mx-auto w-full">
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-fullname"
                        className="block text-caption font-medium text-text-secondary uppercase tracking-wider"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <input
                          id="onboarding-fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Namrata Sen"
                          required
                          className="w-full rounded-lg border border-border-default bg-background-surface pl-10 pr-4 py-3 font-body text-body-md text-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all shadow-xs min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-email"
                        className="block text-caption font-medium text-text-secondary uppercase tracking-wider"
                      >
                        Verified Supabase Account Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="onboarding-email"
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full rounded-lg border border-border-default/60 bg-background-subtle/80 pl-10 pr-4 py-3 font-body text-body-md text-text-tertiary cursor-not-allowed min-h-[44px]"
                        />
                      </div>
                      <p className="text-[11px] text-text-tertiary">
                        Secured with PostgreSQL Row Level Security (RLS). Bound strictly to your user identifier.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-border-default">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer min-h-[44px]"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!fullName.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-text-inverse text-body-md font-medium hover:bg-brand-primary-hover transition-colors shadow-xs cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 3: Self-Reported Skin Tendency & Concerns                */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 3 && (
                <motion.div
                  key="step-skin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-1 mb-5 text-center sm:text-left">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                      Skin Baseline & Observations
                    </h2>
                    <p className="text-body-md text-text-secondary">
                      Select your primary self-reported skin tendency and active concerns.
                    </p>
                  </div>

                  <div className="space-y-5 overflow-y-auto pr-1 flex-1 max-h-[380px]">
                    {/* Primary Skin Type */}
                    <div className="space-y-2">
                      <label className="block text-caption font-semibold text-text-secondary uppercase tracking-wider">
                        Primary Skin Tendency (Self-Reported)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup">
                        {SKIN_TYPE_OPTIONS.map((opt) => {
                          const isSelected = selectedSkinType === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setSelectedSkinType(opt.value)}
                              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer min-h-[44px] ${
                                isSelected
                                  ? 'border-brand-primary bg-emerald-50/70 shadow-xs ring-1 ring-brand-primary'
                                  : 'border-border-default bg-background-surface hover:border-brand-secondary/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg">{opt.emoji}</span>
                                {isSelected && <Check size={14} className="text-brand-primary" />}
                              </div>
                              <span className={`block font-display font-semibold text-sm ${isSelected ? 'text-brand-primary' : 'text-text-primary'}`}>
                                {opt.label}
                              </span>
                              <span className="text-[11px] text-text-secondary leading-snug">
                                {opt.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skin Concerns Multi-select */}
                    <div className="space-y-2 pt-2 border-t border-border-default/60">
                      <label className="block text-caption font-semibold text-text-secondary uppercase tracking-wider">
                        Active Concerns (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_CONCERN_OPTIONS.map((concern) => {
                          const active = selectedConcerns.includes(concern);
                          return (
                            <button
                              key={concern}
                              type="button"
                              onClick={() => toggleConcern(concern)}
                              className={`px-3.5 py-1.5 rounded-full text-caption font-medium border transition-all cursor-pointer min-h-[36px] ${
                                active
                                  ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-xs'
                                  : 'bg-background-surface text-text-secondary border-border-default hover:border-brand-primary/40'
                              }`}
                            >
                              {concern}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[11px] text-text-tertiary italic bg-background-primary/50 p-2.5 rounded border border-border-default/50">
                      Truthful disclosure: This is your self-reported baseline. Constitutional Dosha balance (Vata, Pitta, Kapha) is not fabricated and requires observational scanning.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border-default">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer min-h-[44px]"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-text-inverse text-body-md font-medium hover:bg-brand-primary-hover transition-colors shadow-xs cursor-pointer min-h-[44px]"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 4: Lifestyle & Dinacharya Rhythms                        */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 4 && (
                <motion.div
                  key="step-lifestyle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-1 mb-5 text-center sm:text-left">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                      Daily Wellness & Lifestyle Factors
                    </h2>
                    <p className="text-body-md text-text-secondary">
                      Ayurveda views skin as a reflection of Nidra (sleep), Jala (hydration), and Agni (digestive balance).
                    </p>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[380px]">
                    {/* Sleep */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-sleep"
                        className="block text-caption font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        Average Sleep Duration (Nidra)
                      </label>
                      <select
                        id="onboarding-sleep"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        className="w-full rounded-lg border border-border-default bg-background-surface px-4 py-2.5 font-body text-body-md text-text-primary focus:border-brand-primary outline-none transition-all cursor-pointer min-h-[44px]"
                      >
                        {SLEEP_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Hydration */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-hydration"
                        className="block text-caption font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        Daily Water Intake (Jala)
                      </label>
                      <select
                        id="onboarding-hydration"
                        value={hydration}
                        onChange={(e) => setHydration(e.target.value)}
                        className="w-full rounded-lg border border-border-default bg-background-surface px-4 py-2.5 font-body text-body-md text-text-primary focus:border-brand-primary outline-none transition-all cursor-pointer min-h-[44px]"
                      >
                        {HYDRATION_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Stress */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-stress"
                        className="block text-caption font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        Mental Rhythm & Stress (Manas)
                      </label>
                      <select
                        id="onboarding-stress"
                        value={stress}
                        onChange={(e) => setStress(e.target.value)}
                        className="w-full rounded-lg border border-border-default bg-background-surface px-4 py-2.5 font-body text-body-md text-text-primary focus:border-brand-primary outline-none transition-all cursor-pointer min-h-[44px]"
                      >
                        {STRESS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Climate */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="onboarding-climate"
                        className="block text-caption font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        Surrounding Climate (Desha & Ritu)
                      </label>
                      <select
                        id="onboarding-climate"
                        value={climate}
                        onChange={(e) => setClimate(e.target.value)}
                        className="w-full rounded-lg border border-border-default bg-background-surface px-4 py-2.5 font-body text-body-md text-text-primary focus:border-brand-primary outline-none transition-all cursor-pointer min-h-[44px]"
                      >
                        {CLIMATE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border-default">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer min-h-[44px]"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-text-inverse text-body-md font-medium hover:bg-brand-primary-hover transition-colors shadow-xs cursor-pointer min-h-[44px]"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 5: Server-Side Consent & Governance                      */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 5 && (
                <motion.div
                  key="step-consent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-1 mb-5 text-center sm:text-left">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                      Privacy, Data Sovereignty & Consent
                    </h2>
                    <p className="text-body-md text-text-secondary">
                      AayurFace stores authoritative server-side consent. Please review each authorization.
                    </p>
                  </div>

                  <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 max-h-[380px]">
                    {/* Consent 1: Camera Processing (Required) */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default shadow-xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Camera className="w-5 h-5 text-brand-primary shrink-0" />
                          <div>
                            <label htmlFor="consent-camera" className="font-display font-semibold text-text-primary text-base cursor-pointer block">
                              Camera Processing & Facial Observables
                            </label>
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                              Required for Scans • v{CURRENT_CONSENT_VERSIONS.camera_processing}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="consent-camera"
                          aria-label="Camera Processing & Facial Observables"
                          checked={consentCamera}
                          onChange={(e) => setConsentCamera(e.target.checked)}
                          className="w-5 h-5 accent-brand-primary rounded cursor-pointer mt-1 min-h-[20px] min-w-[20px]"
                        />
                      </div>
                      <p className="text-caption text-text-secondary leading-relaxed pl-7">
                        I consent to the local capture and analysis of facial observables (tone, visible balance) to present educational Ayurvedic correlations. No biometric templates are sold or used for automated commercial tracking.
                      </p>
                    </div>

                    {/* Consent 2: Educational Disclaimer (Required) */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default shadow-xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-brand-primary shrink-0" />
                          <div>
                            <label htmlFor="consent-terms" className="font-display font-semibold text-text-primary text-base cursor-pointer block">
                              Classical Educational Terms & Disclaimer
                            </label>
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                              Required for Membership • v{CURRENT_CONSENT_VERSIONS.terms_and_privacy}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="consent-terms"
                          aria-label="Classical Educational Terms & Disclaimer"
                          checked={consentTerms}
                          onChange={(e) => setConsentTerms(e.target.checked)}
                          className="w-5 h-5 accent-brand-primary rounded cursor-pointer mt-1 min-h-[20px] min-w-[20px]"
                        />
                      </div>
                      <p className="text-caption text-text-secondary leading-relaxed pl-7">
                        I understand that AayurFace provides traditional educational wellness observations derived from classical Ayurvedic Samhitas (Charaka & Sushruta) and is not a clinical medical diagnosis or dermatology substitute.
                      </p>
                    </div>

                    {/* Consent 3: Research Opt-in (Optional) */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default shadow-xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <HeartHandshake className="w-5 h-5 text-emerald-800 shrink-0" />
                          <div>
                            <label htmlFor="consent-research" className="font-display font-semibold text-text-primary text-base cursor-pointer block">
                              Anonymous Botanical Research Opt-In
                            </label>
                            <span className="text-[11px] text-text-tertiary bg-background-subtle px-2 py-0.5 rounded font-medium">
                              Optional • v{CURRENT_CONSENT_VERSIONS.wellness_research}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="consent-research"
                          aria-label="Anonymous Botanical Research Opt-In"
                          checked={consentResearch}
                          onChange={(e) => setConsentResearch(e.target.checked)}
                          className="w-5 h-5 accent-brand-primary rounded cursor-pointer mt-1 min-h-[20px] min-w-[20px]"
                        />
                      </div>
                      <p className="text-caption text-text-secondary leading-relaxed pl-7">
                        Help refine classical botanical remedy efficacy by sharing de-identified, aggregate wellness reflections. Can be revoked at any time in Settings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border-default">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer min-h-[44px]"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!consentCamera || !consentTerms}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-text-inverse text-body-md font-medium hover:bg-brand-primary-hover transition-colors shadow-xs cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review & Confirm <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 6: Review & Final Confirmation                           */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 6 && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="space-y-1 mb-5 text-center sm:text-left">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                      Review & Complete Intake
                    </h2>
                    <p className="text-body-md text-text-secondary">
                      Review your profile details before persisting your Ayurvedic wellness baseline.
                    </p>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[380px]">
                    {/* Identity Summary */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default space-y-2">
                      <h4 className="text-caption font-semibold text-text-secondary uppercase tracking-wider">
                        Personal Profile
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-body-md">
                        <div>
                          <span className="text-caption text-text-tertiary block">Name</span>
                          <span className="font-medium text-text-primary">{fullName || initialName}</span>
                        </div>
                        <div>
                          <span className="text-caption text-text-tertiary block">Account Email</span>
                          <span className="font-medium text-text-primary truncate block">{userEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skin & Rhythms Summary */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default space-y-2">
                      <h4 className="text-caption font-semibold text-text-secondary uppercase tracking-wider">
                        Self-Reported Baseline & Habits
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-body-md">
                        <div>
                          <span className="text-caption text-text-tertiary block">Skin Tendency</span>
                          <span className="font-medium text-text-primary capitalize">{selectedSkinType} (Self-Reported)</span>
                        </div>
                        <div>
                          <span className="text-caption text-text-tertiary block">Constitutional Dosha</span>
                          <span className="text-caption font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                            Focus not established
                          </span>
                        </div>
                        <div>
                          <span className="text-caption text-text-tertiary block">Sleep Rhythm</span>
                          <span className="font-medium text-text-primary">{sleepHours}</span>
                        </div>
                        <div>
                          <span className="text-caption text-text-tertiary block">Hydration</span>
                          <span className="font-medium text-text-primary">{hydration}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border-default/60">
                        <span className="text-caption text-text-tertiary block mb-1">Active Concerns</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedConcerns.map((c) => (
                            <span key={c} className="text-[11px] bg-background-subtle border border-border-default px-2 py-0.5 rounded text-text-secondary">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Consents Summary */}
                    <div className="p-4 rounded-lg bg-background-surface border border-border-default space-y-2">
                      <h4 className="text-caption font-semibold text-text-secondary uppercase tracking-wider">
                        Authoritative Consents to Record
                      </h4>
                      <div className="space-y-1 text-caption text-text-secondary">
                        <div className="flex items-center justify-between">
                          <span>Camera Processing (v{CURRENT_CONSENT_VERSIONS.camera_processing})</span>
                          <span className="text-emerald-800 font-semibold flex items-center gap-1">
                            <Check size={12} /> Granted
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Ayurvedic Disclaimer (v{CURRENT_CONSENT_VERSIONS.terms_and_privacy})</span>
                          <span className="text-emerald-800 font-semibold flex items-center gap-1">
                            <Check size={12} /> Granted
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Anonymous Research (v{CURRENT_CONSENT_VERSIONS.wellness_research})</span>
                          <span className={consentResearch ? "text-emerald-800 font-semibold" : "text-text-tertiary"}>
                            {consentResearch ? 'Granted' : 'Opted Out'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border-default">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary text-body-md font-medium hover:bg-background-subtle transition-colors cursor-pointer min-h-[44px] disabled:opacity-50"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-brand-primary text-text-inverse text-body-md font-medium hover:bg-brand-primary-hover transition-all shadow-md cursor-pointer min-h-[44px] disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                          <span>Initializing Your Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Setup & Enter</span>
                          <ChevronRight size={18} />
                        </>
                      )}
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
}
