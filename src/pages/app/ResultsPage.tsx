import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Search, ArrowRight, MessageSquare, ChevronLeft, Calendar, Info, Sparkles } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import SafetyNotice from '@/components/common/SafetyNotice';
import { useAuth } from '@/contexts/AuthContext';
import { getAssessmentById } from '@/lib/assessmentStore';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { scanId } = useParams();
  const { user } = useAuth();

  const isDemo = scanId === 'demo-scan';

  // Load assessment strictly scoped to authenticated user (or isolated sample if demo-scan)
  const assessment = useMemo(() => {
    if (isDemo) {
      return getAssessmentById('sample-system', 'demo-scan');
    }
    if (!user?.id || !scanId) {
      return null;
    }
    return getAssessmentById(user.id, scanId);
  }, [user?.id, scanId, isDemo]);

  // Non-disclosing access-denied / not-found state
  if (!assessment) {
    return (
      <PageWrapper>
        <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6 font-body">
          <div className="w-16 h-16 rounded-full bg-background-subtle border border-border-default flex items-center justify-center mx-auto text-text-tertiary">
            <Shield size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
              Observation Record Not Found
            </h1>
            <p className="text-body-md text-text-secondary">
              The requested facial wellness observation does not exist or is not accessible from your current account.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-brand-primary text-text-inverse px-6 py-2.5 rounded-md font-medium text-body-md hover:bg-brand-primary-hover transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="w-full sm:w-auto bg-background-surface border border-border-default text-text-primary px-6 py-2.5 rounded-md font-medium text-body-md hover:bg-background-subtle transition-colors cursor-pointer"
            >
              Start New Observation
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const formattedDate = new Date(assessment.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const primaryDosha = (assessment?.doshaTendency?.primary || '').toLowerCase();

  const doshaBadgeVariant = primaryDosha.includes('vata')
    ? 'vata'
    : primaryDosha.includes('kapha')
    ? 'kapha'
    : primaryDosha.includes('pitta')
    ? 'pitta'
    : 'default';

  // Truthful Shastric Archetype (Prototype Baseline Guidance - Non-CV Inference)
  let interpretationText = '';
  if (primaryDosha.includes('pitta')) {
    interpretationText = 'In classical Ayurveda (Charaka Samhita), a Pitta-predominant constitution is governed by Agni (fire) and Jala (water). When balancing this constitution, classical Ayurvedic literature emphasizes cooling Lepas, pure Chandana (Sandalwood), distilled rosewater, and gentle barrier preservation to moderate thermal sensitivity. In this transitional release, this text provides a baseline Shastric archetype aligned with your profile, not computer-vision facial inference.';
  } else if (primaryDosha.includes('vata')) {
    interpretationText = 'In classical Ayurveda, a Vata-predominant constitution is governed by Vayu (air) and Akasha (space). When balancing this constitution, classical Ayurvedic literature highlights grounding lipid nourishment—such as warm Kumkumadi or sweet almond tailam—to reinforce epidermal suppleness and comfort. This represents baseline Shastric guidance aligned with your recorded profile, not computer-vision facial inference.';
  } else if (primaryDosha.includes('kapha')) {
    interpretationText = 'In classical Ayurveda, a Kapha-predominant constitution is governed by Prithvi (earth) and Jala (water). When balancing this constitution, classical Ayurvedic literature prioritizes clarifying botanicals—such as Triphala cleansing and gentle clay applications—to promote balanced circulation without pore occlusion. This represents baseline Shastric guidance aligned with your recorded profile, not computer-vision facial inference.';
  } else {
    interpretationText = 'In classical Ayurveda, a balanced or multi-doshic constitution maintains equilibrium across Vata, Pitta, and Kapha principles according to season and lifestyle. In this transitional release, guidance centers on gentle daily dinacharya rituals to support steady barrier vitality, hydration, and seasonal harmony. This represents baseline Shastric guidance aligned with your recorded profile, not computer-vision facial inference.';
  }

  const displayCauses = (assessment?.causes && assessment.causes.length > 0)
    ? assessment.causes
    : [
        { icon: '🌿', text: 'Natural cutaneous response to seasonal transition and environmental moisture.' },
        { icon: '💧', text: 'Daily hydration balance and cellular lipid layer equilibrium.' },
        { icon: '☀️', text: 'Ambient thermal exposure, indoor dry air, and natural circulation patterns.' },
        { icon: '🧘', text: 'Circadian rest patterns and nocturnal restorative vitality.' },
      ];

  const displayRemedies = (assessment?.remedies && assessment.remedies.length > 0)
    ? assessment.remedies
    : [
        {
          name: 'Gentle Rose Water & Botanical Refresh',
          ingredient: 'Rose Water & Aloe Vera',
          what_to_use: 'Pure distilled rose water mist followed by fresh soothing aloe vera gel',
          how_to_apply: 'Cleanse face gently with lukewarm water, mist rose water, and smooth aloe gel over clean skin.',
          how_often: 'Morning & evening daily',
        },
      ];

  const displayPreventionTips = (assessment?.preventionTips && assessment.preventionTips.length > 0)
    ? assessment.preventionTips
    : [
        { icon: '💧', text: 'Maintain consistent daily internal hydration with warm or room-temperature water.' },
        { icon: '🌙', text: 'Honor restful evening dinacharya rituals to support nightly cellular rejuvenation.' },
        { icon: '🥗', text: 'Incorporate fresh, seasonal whole foods to support calm internal digestive fire (Agni).' },
        { icon: '🛡️', text: 'Conduct a patch test behind the ear before applying any new topical formulation.' },
      ];

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-2.5 py-2 text-caption font-semibold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-tertiary font-mono">
              ID: {assessment.id.slice(0, 8)}...
            </span>
            {isDemo && (
              <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Sample Reference
              </span>
            )}
          </div>
        </div>

        {/* Demo Isolation Banner (Only visible on /results/demo-scan) */}
        {isDemo && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <strong className="font-semibold block">Sample Demonstration Insight</strong>
              <p className="text-amber-800">
                This is a static demonstration entry provided for illustrative design review. It does not reflect a live facial capture.
              </p>
            </div>
          </div>
        )}

        {/* Transitional Assessment Architecture — Clear Layer Separation */}
        <div className="p-4 sm:p-5 rounded-lg bg-background-surface border border-border-default shadow-xs space-y-3 font-body">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent shrink-0" />
            <h2 className="text-caption font-semibold uppercase tracking-wider text-text-primary">
              Transitional Assessment Architecture
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-caption text-text-secondary pt-0.5">
            <div className="p-3 rounded-md bg-background-subtle border border-border-default/60 space-y-1">
              <span className="font-semibold text-text-primary block">1. Stored Profile Context</span>
              <p>Constitutional focus ({assessment.doshaTendency.primary}) is aligned with your recorded user profile settings.</p>
            </div>
            <div className="p-3 rounded-md bg-background-subtle border border-border-default/60 space-y-1">
              <span className="font-semibold text-text-primary block">2. Prototype Guidance</span>
              <p>Botanical lepas and dinacharya reflect traditional Shastric archetypes rather than automated diagnosis.</p>
            </div>
            <div className="p-3 rounded-md bg-background-subtle border border-border-default/60 space-y-1">
              <span className="font-semibold text-text-primary block">3. Future CV / AI Inference</span>
              <p>Facial frame is archived. Automated biometric feature detection (erythema, sebum, pore texture) begins in Phase 08.</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TIER 1: OBSERVED — Visual Frame & Stored Profile Context */}
        {/* ======================================================== */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5 font-body">
              <span className="w-2 h-2 rounded-full bg-brand-accent" />
              01 CAPTURE RECORD
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Archived Frame &amp; Stored Profile Context</span>
          </div>

          <div className="p-6 sm:p-8 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden border border-border-default bg-background-subtle shrink-0 shadow-xs">
                <img
                  src={assessment.capturedImage}
                  alt="Captured skin observation frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-text-inverse text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {isDemo ? 'Sample Reference' : 'Archived Frame'}
                </div>
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-caption font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Observation Frame Archived
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary leading-tight">
                  {assessment.summary || `${assessment.doshaTendency?.primary || 'Skin'} Wellness Observation`}
                </h1>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  {(assessment.skinTypes?.length ? assessment.skinTypes : ['Constitutional Balance']).map((concern, idx) => (
                    <SkinBadge key={idx} label={concern as any} size="sm" />
                  ))}
                  <SkinBadge label={assessment.doshaTendency.primary} variant={doshaBadgeVariant} size="sm" />
                </div>

                <p className="text-caption text-text-tertiary flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar size={13} />
                  Recorded on {formattedDate}
                </p>

                <p className="text-caption text-text-secondary bg-background-subtle p-2.5 rounded border border-border-default/60">
                  <strong className="text-text-primary font-medium">Capture Status: </strong>
                  Facial frame archived securely in your personal session journal. Automated biometric/CV feature detection is scheduled for Phase 08.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* TIER 2: INTERPRETED — Ayurvedic Doshic Etiology          */}
        {/* ======================================================== */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold uppercase tracking-wider text-brand-primary flex items-center gap-1.5 font-body">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              02 PROTOTYPE GUIDANCE
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Classical Ayurvedic Constitutional Archetype</span>
          </div>

          <div className="space-y-4">
            {/* Primary Doshic Tendency */}
            <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-accent font-body">
                Constitutional Archetype (Non-CV Inference)
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-text-primary">
                {assessment.doshaTendency.primary} Focus
              </h2>
              <p className="text-body-md text-text-secondary leading-relaxed font-normal">
                {interpretationText}
              </p>
            </div>

            {assessment.ayurvedicInterpretation && (
              <div className="p-6 rounded-lg bg-amber-50/50 border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 font-body">
                    Ayurvedic Contextual Engine (Phase 11)
                  </span>
                </div>
                {assessment.ayurvedicInterpretation.interpretations.length > 0 ? (
                  assessment.ayurvedicInterpretation.interpretations.map((interp, idx) => (
                    <div key={idx} className="space-y-2 pb-3 border-b border-amber-100 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-amber-950">
                        {interp.rationale.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-amber-100/80 text-amber-900 px-2 py-1 rounded">
                          Evidence: {interp.evidence.replace(/_/g, ' ')}
                        </span>
                        {interp.limitations && (
                          <span className="bg-white/60 border border-amber-200 text-amber-800 px-2 py-1 rounded">
                            Note: {interp.limitations}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-amber-900">
                    Observation yielded {assessment.ayurvedicInterpretation.overallEvidenceState.replace(/_/g, ' ')}. 
                    No definitive contextual interpretation applied.
                  </p>
                )}
                <div className="pt-2 flex justify-between items-center border-t border-amber-200/50">
                  <span className="text-[10px] text-amber-700/80 font-mono">
                    Rule Engine v: {assessment.ayurvedicInterpretation.versionInfo.ruleVersion}
                  </span>
                  <span className="text-[10px] text-amber-700/80 font-mono">
                    Knowledge v: {assessment.ayurvedicInterpretation.versionInfo.knowledgeVersion}
                  </span>
                </div>
              </div>
            )}

            {/* Observable Factors */}
            <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
              <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-brand-accent" />
                Seasonal &amp; Environmental Factors (Classical Etiology)
              </h3>
              <p className="text-caption text-text-secondary -mt-2">
                General external factors identified in Ayurvedic texts that affect cutaneous harmony:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {displayCauses.map((cause, i) => (
                  <div key={i} className="p-4 rounded-md bg-background-primary/70 border border-border-default flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0 mt-2" />
                    <p className="font-body text-body-md text-text-primary font-normal leading-relaxed">
                      {cause.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* TIER 3: GUIDANCE — Targeted Botanical Regimens & Routine */}
        {/* ======================================================== */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 font-body">
              <span className="w-2 h-2 rounded-full bg-emerald-700" />
              03 BOTANICAL REGIMENS
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Grounded Care &amp; Safety Precautions</span>
          </div>

          <div className="p-6 sm:p-8 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                Targeted Botanical Regimens (Prototype Reference)
              </h2>
              <p className="text-body-md text-text-secondary">
                Grounded topical Lepas and daily dinacharya aligned with your constitutional focus
              </p>
            </div>

            <div className="space-y-4">
              {displayRemedies.map((remedy, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-background-primary border border-border-default space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-text-primary">
                      {remedy.name}
                    </h3>
                    <span className="text-caption font-semibold font-body text-brand-primary bg-background-surface px-2.5 py-1 rounded-md border border-border-default shrink-0">
                      {remedy.how_often}
                    </span>
                  </div>

                  <div className="space-y-2 text-body-md text-text-secondary leading-relaxed font-normal">
                    <p>
                      <strong className="text-text-primary font-medium">Ingredients: </strong>
                      {remedy.what_to_use}
                    </p>
                    <p>
                      <strong className="text-text-primary font-medium">Application Method: </strong>
                      {Array.isArray(remedy.how_to_apply) ? remedy.how_to_apply.join('. ') : remedy.how_to_apply}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle & Environmental Precautions */}
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
            <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-brand-primary" />
              Lifestyle &amp; Environmental Precautions
            </h3>
            <div className="space-y-3">
              {displayPreventionTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-background-primary/50 border border-border-default/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-2" />
                  <p className="font-body text-body-md text-text-primary leading-relaxed font-normal">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Safety Disclaimer Notice */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <SafetyNotice message="Always conduct a 24-hour skin patch test behind the ear before applying any herbal formulation. Discontinue use if irritation occurs. Observations are client-side wellness recordings and do not constitute medical diagnosis." />
        </motion.div>

        {/* Bottom CTA to Chat with Ayu */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <button 
            onClick={() => navigate('/chat')}
            className="w-full bg-brand-primary text-text-inverse rounded-md py-4 font-body font-medium text-body-md shadow-sm hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2.5 cursor-pointer min-h-[44px]"
          >
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            Discuss These Observations with Ayu
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
