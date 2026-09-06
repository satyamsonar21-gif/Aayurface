import { motion } from 'framer-motion';
import { Sparkles, Calendar, Flame, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAssessments } from '@/lib/assessmentStore';

const reflections = [
  {
    week: 'Week 4 • Present Reflection',
    season: 'Shishira Ritu (Late Winter)',
    doshicFocus: 'Pitta Calm • Vata Hydration',
    variant: 'pitta' as const,
    observation: 'Skin feels noticeably calmer following regular evening abhyanga with Kumkumadi. Morning redness in the cheek zone has lessened.',
    ritualsPracticed: 'Daily Rosewater & Herbal Splash • Kumkumadi Massage (5 of 7 days)',
  },
  {
    week: 'Week 3 • Seasonal Transition',
    season: 'Shishira Ritu (Late Winter)',
    doshicFocus: 'Vata Nourishment',
    variant: 'vata' as const,
    observation: 'Cold, dry winds increased slight tightness around the mouth. Switched from cold to lukewarm rinses as advised in Dinacharya.',
    ritualsPracticed: 'Ushapan Hydration • Warm CCF Tea • Nightly Ghee application',
  },
  {
    week: 'Week 2 • Baseline Building',
    season: 'Hemanta Ritu (Early Winter)',
    doshicFocus: 'Balanced Agni & Cleansing',
    variant: 'kapha' as const,
    observation: 'Initial baseline setup. Began daily tongue scraping and regular botanical cleansing.',
    ritualsPracticed: 'Neem-Rosewater splash • Consistent sleep schedule',
  },
];

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userAssessments = user?.id ? getUserAssessments(user.id) : [];

  const dominantDosha = user?.dosha 
    ? `${user.dosha.charAt(0).toUpperCase() + user.dosha.slice(1)} Pacification`
    : 'Pitta Pacification';

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

          <div className="p-5 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-text-tertiary text-caption font-medium">
              <Compass className="w-4 h-4 text-emerald-700" />
              Dominant Focus
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">{dominantDosha}</p>
            <p className="text-caption text-text-secondary">Cooling botanicals & hydration</p>
          </div>
        </div>

        {/* Weekly Qualitative Log */}
        <div className="space-y-6 pt-2">
          <h2 className="font-display text-2xl font-semibold text-text-primary">
            Weekly Observational History
          </h2>

          <div className="space-y-4">
            {reflections.map((item, idx) => (
              <motion.div
                key={item.week}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-default/60">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {item.week}
                    </h3>
                    <p className="text-caption text-text-tertiary">
                      {item.season}
                    </p>
                  </div>
                  <SkinBadge label={item.doshicFocus} variant={item.variant} size="sm" />
                </div>

                <div className="space-y-2">
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    <strong className="text-text-primary font-medium">Reflection: </strong>
                    {item.observation}
                  </p>
                  <p className="text-caption text-text-tertiary">
                    <strong className="text-text-secondary font-medium">Rituals Practiced: </strong>
                    {item.ritualsPracticed}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
