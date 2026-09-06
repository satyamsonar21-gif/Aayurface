import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Clock, ChevronLeft, Sparkles } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import SafetyNotice from '@/components/common/SafetyNotice';
import { MOCK_REMEDIES } from '@/lib/mockData';

export default function RemedyDetailPage() {
  const { remedyId, slug } = useParams();
  const navigate = useNavigate();
  const param = slug || remedyId;
  
  const remedy = MOCK_REMEDIES.find(r => r.slug === param || r.id === param) || MOCK_REMEDIES[0];

  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem('aayurface_saved_remedies');
      const list = saved ? JSON.parse(saved) : [];
      return list.includes(remedy.id);
    } catch {
      return false;
    }
  });

  const toggleSave = () => {
    try {
      const saved = localStorage.getItem('aayurface_saved_remedies');
      const list: string[] = saved ? JSON.parse(saved) : [];
      const next = list.includes(remedy.id) ? list.filter(id => id !== remedy.id) : [...list, remedy.id];
      localStorage.setItem('aayurface_saved_remedies', JSON.stringify(next));
      setIsSaved(!isSaved);
    } catch {
      setIsSaved(!isSaved);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-3xl mx-auto w-full pb-16 font-body">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <button
            onClick={() => navigate('/library')}
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Library
          </button>

          <button
            onClick={toggleSave}
            className="inline-flex items-center gap-1.5 text-caption font-body font-semibold px-3 py-1.5 rounded-full border border-border-default bg-background-surface hover:bg-background-subtle transition-colors cursor-pointer shadow-sm text-text-primary"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-accent text-brand-accent' : 'text-text-tertiary'}`} />
            {isSaved ? 'Saved in Rituals' : 'Save Formulation'}
          </button>
        </div>

        {/* Hero Header */}
        <div className="p-6 sm:p-8 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
                  Botanical Formulation
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
                {remedy.name}
              </h1>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-caption font-medium text-brand-primary bg-background-primary px-3 py-1.5 rounded-full border border-border-default flex items-center gap-1.5">
                <Clock size={13} />
                Prep: {remedy.preparation_steps.length * 5} mins
              </span>
            </div>
          </div>

          <p className="text-body-md text-text-secondary leading-relaxed font-normal">
            {remedy.description}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            {remedy.skin_concerns.map(c => (
              <SkinBadge key={c} label={c} size="sm" />
            ))}
          </div>
        </div>

        {/* Ingredients Block */}
        <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Key Botanical Ingredients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {remedy.ingredients.map((ing, i) => (
              <div key={i} className="p-3.5 rounded-md bg-background-primary border border-border-default flex items-center justify-between gap-2">
                <span className="font-body text-body-md text-text-primary font-medium">{ing.name}</span>
                <span className="text-caption text-text-secondary font-body bg-background-surface px-2.5 py-0.5 rounded-sm border border-border-default">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Steps */}
        <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Preparation Method (Krama)
          </h2>
          <div className="space-y-3 pt-1">
            {remedy.preparation_steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3.5 p-3 rounded-md bg-background-primary/60 border border-border-default/60">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-body-md text-text-primary leading-relaxed font-normal">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Steps */}
        <div className="p-6 rounded-lg bg-background-surface border border-border-default shadow-sm space-y-4">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Application Ritual (Lepa Vidhi)
          </h2>
          <div className="space-y-3 pt-1">
            {remedy.application_steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3.5 p-3 rounded-md bg-background-primary/60 border border-border-default/60">
                <span className="w-6 h-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-body-md text-text-primary leading-relaxed font-normal">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Classical Ayurvedic Insight */}
        <div className="p-6 rounded-lg bg-background-subtle border border-border-default shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-accent">
            <Sparkles size={16} />
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Classical Shastric Principle
            </h3>
          </div>
          <blockquote className="font-display text-lg text-text-primary italic leading-relaxed pl-3 border-l-2 border-brand-accent">
            "{remedy.ayurvedic_insight}"
          </blockquote>
        </div>

        <SafetyNotice message="Always perform a 24-hour skin patch test on a small area behind the ear before full facial application." />

      </div>
    </PageWrapper>
  );
}
