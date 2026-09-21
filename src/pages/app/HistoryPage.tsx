import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, ArrowUpRight, Camera } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAssessments } from '@/lib/assessmentStore';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real assessments strictly scoped to authenticated user
  const userAssessments = useMemo(() => {
    if (!user?.id) return [];
    return getUserAssessments(user.id);
  }, [user?.id]);

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Header Section */}
        <div className="space-y-2 pb-5 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
              Observational Timeline
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Chronological Journey</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            My History
          </h1>
          <p className="text-body-md text-text-secondary max-w-2xl">
            A quiet record of your past facial wellness observations and seasonal skin reflections.
          </p>
        </div>

        {/* Real User Observations */}
        {userAssessments.length > 0 ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-text-primary">
                Recorded Observations ({userAssessments.length})
              </h2>
              <span className="text-caption text-text-tertiary">
                User: {user?.email}
              </span>
            </div>

            {userAssessments.map((assessment, idx) => {
              const formattedDate = new Date(assessment.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm hover:border-brand-secondary/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-default/60">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail of real capture */}
                      <div className="w-14 h-14 rounded-md overflow-hidden border border-border-default bg-background-subtle shrink-0">
                        <img
                          src={assessment.capturedImage}
                          alt="Observation thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-text-primary">
                          {assessment.summary}
                        </h3>
                        <p className="text-caption text-text-tertiary flex items-center gap-1.5 font-mono">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <SkinBadge 
                        label={assessment.doshaTendency.primary} 
                        variant={
                          assessment.doshaTendency?.primary?.toLowerCase().includes('vata')
                            ? 'vata'
                            : assessment.doshaTendency?.primary?.toLowerCase().includes('kapha')
                            ? 'kapha'
                            : assessment.doshaTendency?.primary?.toLowerCase().includes('pitta')
                            ? 'pitta'
                            : 'default'
                        } 
                        size="sm" 
                      />
                      <span className="text-caption text-text-tertiary font-mono">
                        #{assessment.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-body-md text-text-secondary leading-relaxed">
                      {assessment.doshaTendency.description}
                    </p>
                    <div className="p-3 rounded bg-background-primary/50 border border-border-default/50 text-caption text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong className="text-text-primary font-medium">Focus: </strong>{assessment.remedies[0]?.name || 'Botanical Care'}</span>
                      <span><strong className="text-text-primary font-medium">Frequency: </strong>{assessment.remedies[0]?.how_often || 'Daily'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => navigate(`/results/${assessment.id}`)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] text-caption font-semibold text-brand-primary hover:text-brand-primary-hover cursor-pointer group"
                    >
                      View Full Observation Record
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Luxury Editorial Empty State for user with no observations */
          <div className="p-8 sm:p-12 rounded-lg bg-background-surface border border-border-default text-center space-y-6 max-w-xl mx-auto my-6 shadow-sm">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-default mx-auto bg-background-subtle shadow-xs">
              <img 
                src="/images/1.jpg" 
                alt="Ayurvedic botanical herbs" 
                className="w-full h-full object-cover opacity-85"
              />
            </div>
            <div className="space-y-2">
              <span className="text-caption uppercase tracking-wider font-semibold text-brand-accent">
                BEGINNING YOUR JOURNAL
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                Your first scan creates the beginning of your skin journey.
              </h2>
              <p className="text-body-md text-text-secondary leading-relaxed max-w-md mx-auto">
                Ayurvedic observation tracks subtle shifts in hydration, thermal redness, and cellular vitality across changing seasonal rhythms.
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

        {/* Bottom Action (Shown only when user has recorded observations to avoid duplicate CTA on empty state) */}
        {userAssessments.length > 0 && (
          <div className="pt-4 text-center">
            <button
              onClick={() => navigate('/scan')}
              className="inline-flex items-center justify-center gap-2 bg-brand-primary text-text-inverse px-6 py-3 min-h-[44px] rounded-md font-body font-medium hover:bg-brand-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              Record Today's Observation
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
