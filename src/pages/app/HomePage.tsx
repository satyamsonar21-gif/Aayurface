import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { getTodaysTip } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import SkinBadge from '@/components/common/SkinBadge';
import { getUserAssessments } from '@/lib/assessmentStore';

interface RitualItem {
  id: string;
  timePeriod: 'Morning' | 'Evening';
  time: string;
  title: string;
  benefit: string;
  completed: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date();
  const tip = getTodaysTip();

  const userName = user?.full_name?.split(' ')[0] || 'Seeker';
  const userAssessments = user?.id ? getUserAssessments(user.id) : [];
  const latestAssessment = userAssessments[0] || null;

  // Interactive Dinacharya ritual rows
  const [rituals, setRituals] = useState<RitualItem[]>([
    {
      id: 'r-1',
      timePeriod: 'Morning',
      time: '7:00 AM',
      title: 'Gentle Rosewater & Neem Splash',
      benefit: 'Clears overnight Kapha and calms Pitta heat',
      completed: true,
    },
    {
      id: 'r-2',
      timePeriod: 'Morning',
      time: '7:30 AM',
      title: 'Hydrating CCF Tea (Cumin, Coriander, Fennel)',
      benefit: 'Kindles gentle digestive Agni without overheating',
      completed: true,
    },
    {
      id: 'r-3',
      timePeriod: 'Evening',
      time: '9:30 PM',
      title: 'Kumkumadi Oil Facial Abhyanga',
      benefit: 'Nourishes Vata dryness and encourages restorative overnight balance',
      completed: false,
    },
    {
      id: 'r-4',
      timePeriod: 'Evening',
      time: '10:00 PM',
      title: 'Pada Abhyanga (Warm Foot Massage)',
      benefit: 'Draws excess mental heat downward for sound sleep',
      completed: false,
    },
  ]);

  const toggleRitual = (id: string) => {
    setRituals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const completedCount = rituals.filter((r) => r.completed).length;

  return (
    <PageWrapper>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 max-w-5xl mx-auto w-full pb-20 font-body"
      >
        
        {/* ======================================================== */}
        {/* SECTION A: Minimal Top Greeting / Context                */}
        {/* ======================================================== */}
        <motion.section variants={itemVariants} className="space-y-3 pb-6 border-b border-border-default">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
                YOUR DAILY WELLNESS
              </span>
              <span className="text-border-default">•</span>
              <span className="text-caption text-text-tertiary">
                {formatDate(today.toISOString())}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <SkinBadge label="Vata-Pitta Profile" variant="vata" size="sm" />
              <div className="flex items-center gap-1.5 text-caption text-text-secondary bg-background-surface px-3 py-1 rounded-full border border-border-default shadow-xs">
                <Flame className="w-3.5 h-3.5 text-brand-accent" />
                <span className="font-semibold text-text-primary">5-Day</span> Rhythm
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-text-primary tracking-tight">
              Namaste, {userName}.
            </h1>
            <p className="text-body-md sm:text-lg text-text-secondary font-normal max-w-2xl leading-relaxed">
              Your skin has a rhythm. Let's understand what it is telling you today.
            </p>
          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* SECTION B: Primary Editorial Analysis Hero              */}
        {/* ======================================================== */}
        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 pb-6 border-b border-border-default"
        >
          {/* Left Column: Editorial Copy + Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-caption uppercase tracking-wider font-semibold text-brand-accent">
              <Sparkles size={14} />
              FACIAL WELLNESS OBSERVATION
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary leading-[1.15]">
              Listen to What Your Skin Reflects Today
            </h2>

            <p className="text-body-md sm:text-lg text-text-secondary leading-relaxed max-w-xl font-normal">
              Ayurveda views your skin as a clear mirror of internal harmony and daily rhythms. Take a peaceful moment to capture your natural radiance and receive gentle, plant-grounded care.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/scan')}
                className="inline-flex items-center gap-2.5 bg-brand-primary text-text-inverse px-6 py-3.5 rounded-md font-body font-semibold text-body-md hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
              >
                <Camera className="w-5 h-5 text-brand-accent" />
                Scan Your Skin
              </button>

              <button
                onClick={() => navigate('/results/demo-scan')}
                className="inline-flex items-center gap-1.5 text-body-md font-medium text-text-secondary hover:text-brand-primary transition-colors py-3 px-2 cursor-pointer group"
              >
                View Sample Insights
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Curated Botanical Composition */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-border-default bg-background-surface shadow-sm group">
              <div className="aspect-4/3 w-full overflow-hidden bg-background-subtle">
                <img
                  src="/images/1.jpg"
                  alt="Harmonious Ayurvedic botanical preparations and natural extracts"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 bg-background-surface border-t border-border-default">
                <p className="text-caption text-text-secondary leading-relaxed font-normal">
                  <strong className="text-text-primary font-medium">Classical Dravyaguna: </strong>
                  Natural botanicals harmonizing the skin's daily moisture and calmness.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* SECTION C: Today's Ayurvedic Guidance                    */}
        {/* ======================================================== */}
        <motion.section variants={itemVariants} className="space-y-6 pb-6 border-b border-border-default">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-caption font-semibold uppercase tracking-wider text-brand-accent">
                DAILY REFLECTIONS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                Today's Guidance
              </h2>
            </div>
            <span className="text-caption text-text-tertiary">
              Season: Shishira (Late Winter)
            </span>
          </div>

          {/* Typography + Hairline Dividers (Editorial layout, NOT 4 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
            
            {/* 1. Dosha Focus */}
            <div className="space-y-2 md:pr-4 pt-4 md:pt-0">
              <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider">
                Dosha Focus
              </span>
              <h3 className="font-display text-xl font-semibold text-text-primary">
                Pitta-Vata Harmony
              </h3>
              <p className="text-caption text-text-secondary leading-relaxed">
                Cooling localized heat in the T-zone while maintaining gentle moisture against dry winter breezes.
              </p>
            </div>

            {/* 2. Classical Insight */}
            <div className="space-y-2 md:px-4 pt-4 md:pt-0">
              <span className="text-[11px] font-semibold text-brand-accent uppercase tracking-wider">
                Classical Principle
              </span>
              <h3 className="font-display text-xl font-semibold text-text-primary italic">
                "{tip.content}"
              </h3>
              <p className="text-caption text-text-tertiary">
                From Caraka Samhita • Dravyaguna Vijnana
              </p>
            </div>

            {/* 3. Practical Recommendation */}
            <div className="space-y-2 md:px-4 pt-4 md:pt-0">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Daily Regimen
              </span>
              <h3 className="font-display text-xl font-semibold text-text-primary">
                Rosewater & Vetiver Spritz
              </h3>
              <p className="text-caption text-text-secondary leading-relaxed">
                Lightly mist face after gentle cleansing to restore balanced skin tone without stripping natural oils.
              </p>
            </div>

            {/* 4. Safety & Context Note */}
            <div className="space-y-2 md:pl-4 pt-4 md:pt-0">
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Wellness Context
              </span>
              <h3 className="font-display text-xl font-semibold text-text-primary">
                Gentle Self-Awareness
              </h3>
              <p className="text-caption text-text-secondary leading-relaxed">
                Ayurvedic reflections offer mindful, non-diagnostic guidance to cultivate long-term equilibrium.
              </p>
            </div>

          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* SECTION D: Daily Ritual (Dinacharya)                     */}
        {/* ======================================================== */}
        <motion.section variants={itemVariants} className="space-y-5 pb-6 border-b border-border-default">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-caption font-semibold uppercase tracking-wider text-brand-accent">
                DINACHARYA PRACTICES
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                Your Daily Ritual
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-caption text-text-secondary">
                <strong className="text-text-primary font-semibold">{completedCount}</strong> of {rituals.length} completed
              </span>
              <button
                onClick={() => navigate('/routine')}
                className="text-caption font-semibold text-brand-primary hover:text-brand-primary-hover inline-flex items-center gap-1 cursor-pointer"
              >
                View Full Routine
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Structured Rows for Morning and Evening */}
          <div className="space-y-2 pt-1">
            {rituals.map((ritual) => (
              <div
                key={ritual.id}
                onClick={() => toggleRitual(ritual.id)}
                className={`py-3.5 px-4 rounded-md border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  ritual.completed
                    ? 'bg-background-surface/60 border-border-default/50 opacity-85'
                    : 'bg-background-surface border-border-default hover:border-brand-secondary/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    aria-label={ritual.completed ? 'Mark incomplete' : 'Mark complete'}
                    className="text-brand-primary shrink-0 transition-transform active:scale-90"
                  >
                    {ritual.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-primary" />
                    )}
                  </button>

                  <div className="space-y-0.5 min-w-0">
                    <p className={`font-body text-body-md font-medium truncate ${
                      ritual.completed ? 'text-text-secondary line-through' : 'text-text-primary'
                    }`}>
                      {ritual.title}
                    </p>
                    <p className="text-caption text-text-tertiary truncate">
                      {ritual.benefit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-caption text-text-tertiary font-body">
                  <Clock size={12} />
                  <span>{ritual.time}</span>
                  <span className="text-border-default hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-text-secondary">{ritual.timePeriod}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* SECTION E: Your Journey                                  */}
        {/* ======================================================== */}
        <motion.section variants={itemVariants} className="space-y-5 pb-6 border-b border-border-default">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-caption font-semibold uppercase tracking-wider text-brand-accent">
                CHRONOLOGICAL RECORD
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                Your Journey
              </h2>
            </div>

            <button
              onClick={() => navigate('/history')}
              className="text-caption font-semibold text-brand-primary hover:text-brand-primary-hover inline-flex items-center gap-1 cursor-pointer"
            >
              All Assessments
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quiet timeline treatment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            
            {/* Latest Scan Reflection */}
            <div 
              onClick={() => latestAssessment ? navigate(`/results/${latestAssessment.id}`) : navigate('/scan')}
              className="p-5 rounded-lg bg-background-surface border border-border-default shadow-xs hover:border-brand-secondary/40 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-default/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <span className="text-caption font-semibold text-text-primary font-body">
                    Latest Observation
                  </span>
                </div>
                <span className="text-caption text-text-tertiary">
                  {latestAssessment 
                    ? new Date(latestAssessment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Not Recorded'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {latestAssessment ? latestAssessment.summary : 'No Observations Recorded Yet'}
                </h3>
                <p className="text-caption text-text-secondary leading-relaxed">
                  {latestAssessment 
                    ? latestAssessment.doshaTendency.description
                    : 'Capture your facial skin baseline to receive grounded Ayurvedic botanical wellness regimens.'}
                </p>
              </div>

              <div className="flex items-center justify-end text-caption font-medium text-brand-primary">
                <span>{latestAssessment ? 'View Observation Record' : 'Record Observation'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Next Check-in */}
            <div className="p-5 rounded-lg bg-background-surface border border-border-default shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border-default/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  <span className="text-caption font-semibold text-text-primary font-body">
                    Next Seasonal Check-in
                  </span>
                </div>
                <span className="text-caption text-brand-primary font-medium">In 23 days</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Seasonal Ritu Sandhi Transition
                </h3>
                <p className="text-caption text-text-secondary leading-relaxed">
                  Scheduled reflection as winter shifts toward spring (Vasanta Ritu), when Kapha naturally begins to liquefy.
                </p>
              </div>

              <div className="text-caption text-text-tertiary pt-1">
                Gentle reminders will be provided in your Dinacharya schedule.
              </div>
            </div>

          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* SECTION F: Final Calm CTA                                */}
        {/* ======================================================== */}
        <motion.section 
          variants={itemVariants}
          className="text-center py-8 px-6 rounded-lg bg-background-subtle border border-border-default space-y-4"
        >
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h2 className="font-display text-3xl font-semibold text-text-primary">
              Ready to understand your skin better?
            </h2>
            <p className="text-body-md text-text-secondary leading-relaxed">
              Begin a new facial observation to receive grounded botanical guidance and update your daily dinacharya rituals.
            </p>
          </div>

          <button
            onClick={() => navigate('/scan')}
            className="inline-flex items-center gap-2 bg-brand-primary text-text-inverse px-7 py-3.5 rounded-md font-body font-semibold text-body-md hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer"
          >
            Begin a New Scan
            <ChevronRight className="w-4 h-4 text-brand-accent" />
          </button>
        </motion.section>

      </motion.div>
    </PageWrapper>
  );
}
