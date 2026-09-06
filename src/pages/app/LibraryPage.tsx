import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import { SKIN_CONCERNS } from '@/types';
import { filterRemedies, MOCK_REMEDIES } from '@/lib/mockData';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConcern, setActiveConcern] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  
  // Local state for saved bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aayurface_saved_remedies');
      return saved ? JSON.parse(saved) : ['r1', 'r3'];
    } catch {
      return ['r1', 'r3'];
    }
  });

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = savedIds.includes(id) ? savedIds.filter(item => item !== id) : [...savedIds, id];
    setSavedIds(next);
    try {
      localStorage.setItem('aayurface_saved_remedies', JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const filtered = useMemo(() => {
    let list = filterRemedies(MOCK_REMEDIES, {
      search: searchQuery,
      concern: activeConcern as any || undefined
    });

    if (activeTab === 'saved') {
      list = list.filter(r => savedIds.includes(r.id));
    }

    return list;
  }, [searchQuery, activeConcern, activeTab, savedIds]);

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-5xl mx-auto w-full pb-16 font-body">
        
        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
              Dravyaguna Knowledge Base
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            Classical Ayurvedic Remedies
          </h1>
          <p className="text-body-md text-text-secondary font-normal max-w-2xl">
            Time-tested botanical formulations, herbal Lepas, and restorative Tailams indexed by constitutional skin tendencies.
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search by herb (Neem, Sandalwood, Turmeric)..."
                className="block w-full pl-10 pr-4 py-2.5 border border-border-default rounded-md bg-background-surface font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* All vs Saved Tabs */}
            <div className="flex bg-background-subtle p-1 rounded-md border border-border-default w-full sm:w-auto">
              <button 
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-sm text-caption font-body font-semibold transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-background-surface text-brand-primary shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Formulations ({MOCK_REMEDIES.length})
              </button>
              <button 
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-sm text-caption font-body font-semibold transition-all cursor-pointer ${
                  activeTab === 'saved' 
                    ? 'bg-background-surface text-brand-primary shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('saved')}
              >
                Saved Rituals ({savedIds.length})
              </button>
            </div>
          </div>

          {/* Skin Concern Filter Chips */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveConcern(null)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-caption font-body font-medium transition-colors cursor-pointer ${
                activeConcern === null 
                  ? 'bg-brand-primary text-text-inverse shadow-sm' 
                  : 'bg-background-surface border border-border-default text-text-secondary hover:text-text-primary hover:bg-background-subtle'
              }`}
            >
              All Concerns
            </button>
            {SKIN_CONCERNS.map((concern) => (
              <button
                key={concern}
                onClick={() => setActiveConcern(concern === activeConcern ? null : concern)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-caption font-body font-medium transition-colors capitalize cursor-pointer ${
                  activeConcern === concern 
                    ? 'bg-brand-primary text-text-inverse shadow-sm' 
                    : 'bg-background-surface border border-border-default text-text-secondary hover:text-text-primary hover:bg-background-subtle'
                }`}
              >
                {concern.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Remedies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length > 0 ? (
            filtered.map((remedy) => {
              const isSaved = savedIds.includes(remedy.id);

              return (
                <motion.div
                  key={remedy.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate(`/library/${remedy.slug}`)}
                  className="bg-background-surface rounded-lg shadow-sm border border-border-default hover:border-brand-secondary/40 p-6 relative flex flex-col justify-between transition-all cursor-pointer group"
                >
                  <div>
                    {/* Top Row: Category and Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {remedy.skin_concerns.slice(0, 2).map((c, i) => (
                          <SkinBadge key={i} label={c} size="sm" />
                        ))}
                      </div>

                      <button 
                        onClick={(e) => toggleSave(remedy.id, e)}
                        title={isSaved ? "Remove from saved" : "Save formulation"}
                        aria-label={isSaved ? "Remove from saved" : "Save formulation"}
                        className="p-1.5 rounded-full text-text-tertiary hover:text-brand-primary hover:bg-background-subtle transition-colors shrink-0 cursor-pointer"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-accent text-brand-accent' : ''}`} />
                      </button>
                    </div>

                    {/* Remedy Title */}
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-2 group-hover:text-brand-primary transition-colors">
                      {remedy.name}
                    </h3>

                    {/* Description */}
                    <p className="text-body-md text-text-secondary font-normal line-clamp-2 mb-4 leading-relaxed">
                      {remedy.description}
                    </p>

                    {/* Key Ingredients Pill List */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {remedy.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[11px] font-body bg-background-subtle text-text-secondary px-2 py-0.5 rounded-sm">
                          {ing.name}
                        </span>
                      ))}
                      {remedy.ingredients.length > 3 && (
                        <span className="text-[11px] font-body text-text-tertiary px-1 py-0.5">
                          +{remedy.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-border-default flex items-center justify-between text-caption font-body font-semibold text-brand-primary group-hover:text-brand-primary-hover">
                    <span>Explore Formulation</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center space-y-3 bg-background-surface rounded-lg border border-border-default">
              <BookOpen className="w-10 h-10 text-text-tertiary mx-auto" />
              <p className="font-display text-xl font-semibold text-text-primary">No remedies found</p>
              <p className="text-body-md text-text-secondary">Try clearing your search query or selecting a different skin concern.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveConcern(null); setActiveTab('all'); }}
                className="mt-2 text-brand-primary font-semibold text-body-md hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
