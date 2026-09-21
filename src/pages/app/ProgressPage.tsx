import { motion } from 'framer-motion';
import { Sparkles, Calendar, Flame, Compass, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAssessments } from '@/lib/assessmentStore';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userAssessments = user?.id ? getUserAssessments(user.id) : [];

  const hasVerifiedDosha = Boolean(user?.dosha);
  const dominantDosha = hasVerifiedDosha
    ? `${user!.dosha!.charAt(0).toUpperCase() + user!.dosha!.slice(1)} Pacification`
    : 'Constitutional focus not established';

  const dominantDoshaDesc = hasVerifiedDosha
    ? user?.dosha?.toLowerCase().includes('vata')
      ? 'Nourishing oils & barrier restoration'
      : user?.dosha?.toLowerCase().includes('kapha')
      ? 'Clarifying herbs & gentle circulation'
      : 'Cooling botanicals & hydration'
    : 'An assessment or profile setup is required to establish your focus.';

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Header Section */}
        <div className="space-y-2 pb-5 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
              Holistic Journal
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Qualitative Progression</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            Progress & Reflections
          </h1>
          <p className="text-body-md text-text-secondary max-w-2xl">
            A qualitative record of how your skin responds to seasonal transitions, dietary harmony, and daily Ayurvedic rituals.
          </p>
        </div>

        {/* Informative Presentation State Banner */}
        <div className="p-4 rounded-md bg-background-subtle border border-border-default flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div className="text-caption text-text-secondary space-y-0.5">
            <p className="font-semibold text-text-primary">Qualitative Wellness Journaling</p>
            <p>
              In classical Ayurveda, true progress is evaluated through observational harmony (Prakriti-Vikriti equilibrium) rather than synthetic numeric scores. Non-diagnostic wellness tracking.
            </p>
          </div>
        </div>

        {/* Milestone Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => navigate('/routine')}
            className="p-5 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-1 hover:border-brand-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-text-tertiary text-caption font-medium">
              <Flame className="w-4 h-4 text-brand-accent" />
              Ritual Streak
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">Daily Practice</p>
            <p className="text-caption text-text-secondary">Consistent morning & evening dinacharya</p>
          </div>

          <div 
            onClick={() => navigate('/history')}
            className="p-5 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-1 hover:border-brand-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-text-tertiary text-caption font-medium">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Observations Logged
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">
              {userAssessments.length} {userAssessments.length === 1 ? 'Observation' : 'Observations'}
            </p>
            <p className="text-caption text-text-secondary">
              {userAssessments.length > 0 ? 'Recorded in personal history' : 'Ready for initial observation'}
            </p>
          </div>

          <div 
            onClick={() => {
              if (!hasVerifiedDosha) {
                navigate('/profile');
              }
            }}
            className={`p-5 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-1 ${!hasVerifiedDosha ? 'hover:border-brand-primary/40 transition-colors cursor-pointer' : ''}`}
          >
            <div className="flex items-center gap-2 text-text-tertiary text-caption font-medium">
              <Compass className="w-4 h-4 text-emerald-700" />
              Dominant Focus
            </div>
            <p className="font-display text-xl sm:text-2xl font-semibold text-text-primary leading-snug">
              {dominantDosha}
            </p>
            <p className="text-caption text-text-secondary">
              {dominantDoshaDesc}
            </p>
          </div>
        </div>

        {/* Observational Reflections Section */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              Observational Progression
            </h2>
            {userAssessments.length > 0 && (
              <span className="text-caption text-text-tertiary">
                {userAssessments.length} journal {userAssessments.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>

          {userAssessments.length > 0 ? (
            <div className="space-y-4">
              {userAssessments.map((assessment, idx) => {
                const date = new Date(assessment.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                });
                const primary = (assessment.doshaTendency?.primary || '').toLowerCase();
                const variant = primary.includes('vata')
                  ? 'vata'
                  : primary.includes('kapha')
                  ? 'kapha'
                  : primary.includes('pitta')
                  ? 'pitta'
                  : 'default';

                return (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-3 hover:border-brand-secondary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-default/60">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-text-primary">
                          Observation • {date}
                        </h3>
                        <p className="text-caption text-text-tertiary font-mono">
                          Record #{assessment.id.slice(0, 8)}
                        </p>
                      </div>
                      <SkinBadge label={`${assessment.doshaTendency.primary} Balance`} variant={variant} size="sm" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-body-md text-text-secondary leading-relaxed">
                        <strong className="text-text-primary font-medium">Observation: </strong>
                        {assessment.summary}
                      </p>
                      {assessment.remedies && assessment.remedies.length > 0 && (
                        <p className="text-caption text-text-tertiary">
                          <strong className="text-text-secondary font-medium">Recommended Rituals: </strong>
                          {assessment.remedies.map(r => r.name).join(' • ')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Truthful Editorial Zero State */
            <div className="p-8 sm:p-12 rounded-lg bg-background-surface border border-border-default text-center space-y-6 max-w-xl mx-auto my-6 shadow-sm">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-default mx-auto bg-background-subtle shadow-xs">
                <img 
                  src="/images/2.jpg" 
                  alt="Ayurvedic oil ritual" 
                  className="w-full h-full object-cover opacity-85"
                />
              </div>
              <div className="space-y-2">
                <span className="text-caption uppercase tracking-wider font-semibold text-brand-accent">
                  LONGITUDINAL JOURNAL
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                  Beginning Your Longitudinal Journey
                </h2>
                <p className="text-body-md text-text-secondary leading-relaxed max-w-md mx-auto">
                  Longitudinal reflections develop organically over weeks and seasonal rhythms. Complete your first skin scan to begin building your personal observational log.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/scan')}
                  className="inline-flex items-center justify-center gap-2.5 bg-brand-primary text-text-inverse px-7 py-3 min-h-[44px] rounded-md font-body font-semibold text-body-md hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-brand-accent" />
                  Start Your First Observation
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
