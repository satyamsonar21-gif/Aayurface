import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Search, ArrowRight, MessageSquare, ChevronLeft, Sparkles, Calendar, Info } from 'lucide-react';
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

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
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

        {/* Results Header Card with Real Captured Image */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="p-6 sm:p-8 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-6">
            
            {/* Top Tagline */}
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1">
                <Sparkles size={12} />
                Facial Wellness Observation
              </span>
              <span className="text-border-default">•</span>
              <span className="text-caption font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Observation Recorded
              </span>
            </div>

            {/* Split Header: Captured Image + Metadata */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden border border-border-default bg-background-subtle shrink-0 shadow-xs">
                <img
                  src={assessment.capturedImage}
                  alt="Captured skin observation frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {isDemo ? 'Sample' : 'Live Frame'}
                </div>
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary leading-tight">
                  {assessment.summary}
                </h1>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  {assessment.skinTypes.map((concern, idx) => (
                    <SkinBadge key={idx} label={concern as any} size="sm" />
                  ))}
                  <SkinBadge label={assessment.doshaTendency.primary} variant="pitta" size="sm" />
                </div>

                <p className="text-caption text-text-tertiary flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar size={13} />
                  Recorded on {formattedDate}
                </p>
              </div>
            </div>

            {/* Observed Dosha Balance Card */}
            <div className="p-4 rounded-lg bg-background-primary/80 border border-border-default space-y-1">
              <span className="text-caption uppercase tracking-wider font-semibold text-brand-primary">
                Observed Dosha Tendency
              </span>
              <p className="font-display text-lg font-semibold text-text-primary">
                {assessment.doshaTendency.primary}
              </p>
              <p className="text-caption text-text-secondary">
                {assessment.doshaTendency.description}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Observable Root Causes */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
            <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-accent" />
              Observable Factors & Doshic Etiology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {assessment.causes.map((cause, i) => (
                <div key={i} className="p-4 rounded-md bg-background-primary/70 border border-border-default space-y-1.5">
                  <span className="text-2xl">{cause.icon}</span>
                  <p className="font-body text-body-md text-text-primary font-medium leading-snug">
                    {cause.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tailored Botanical Regimens */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="p-6 sm:p-8 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                Baseline Botanical Regimens
              </h2>
              <p className="text-body-md text-text-secondary">
                Grounded topical Lepas and cooling herbal applications
              </p>
            </div>

            <div className="space-y-4">
              {assessment.remedies.map((remedy, idx) => (
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
        </motion.div>

        {/* Prevent & Protect Guidelines */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
            <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              Lifestyle & Environmental Precautions
            </h2>
            <div className="space-y-3">
              {assessment.preventionTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-background-primary/50 border border-border-default/60">
                  <span className="text-xl shrink-0">{tip.icon}</span>
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

        {/* Bottom CTA to Chat */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <button 
            onClick={() => navigate('/chat')}
            className="w-full bg-brand-primary text-text-inverse rounded-md py-4 font-body font-medium text-body-md shadow-sm hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            Discuss This Analysis with Ayurvedic Guide
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
