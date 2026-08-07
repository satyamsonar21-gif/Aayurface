import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import SkinBadge from '@/components/common/SkinBadge';
import { SKIN_CONCERNS } from '@/types';
import { filterRemedies, MOCK_REMEDIES } from '@/lib/mockData';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConcern, setActiveConcern] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all'|'saved'>('all');

  const filtered = useMemo(() => {
    // In a real app, 'saved' would filter based on user data.
    // Here we just use the search/filter utility.
    return filterRemedies(MOCK_REMEDIES, {
      search: searchQuery,
      concern: activeConcern as any || undefined
    });
  }, [searchQuery, activeConcern, activeTab]);

  return (
    <PageWrapper className="pb-24">
      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-title text-charcoal mb-4">Remedy Library 📚</h1>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-charcoal-light/50" />
            </div>
            <input
              type="text"
              placeholder="Search remedies or ingredients..."
              className="block w-full pl-10 pr-3 py-3 border border-warmgray rounded-pill bg-white text-sm focus:outline-none focus:border-herbal focus:ring-1 focus:ring-herbal transition-colors text-charcoal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setActiveConcern(null)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
              activeConcern === null ? 'bg-herbal text-white' : 'bg-warmgray/20 text-charcoal hover:bg-warmgray/40'
            }`}
          >
            All Concerns
          </button>
          {SKIN_CONCERNS.map(concern => (
            <button
              key={concern}
              onClick={() => setActiveConcern(concern === activeConcern ? null : concern)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-sm font-medium transition-colors capitalize ${
                activeConcern === concern ? 'bg-herbal text-white' : 'bg-warmgray/20 text-charcoal hover:bg-warmgray/40'
              }`}
            >
              {concern.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex border-b border-warmgray">
          <button 
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-herbal text-herbal' : 'border-transparent text-charcoal-light'}`}
            onClick={() => setActiveTab('all')}
          >
            All Remedies
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'saved' ? 'border-herbal text-herbal' : 'border-transparent text-charcoal-light'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length > 0 ? (
            filtered.map((remedy) => (
              <motion.div
                key={remedy.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-card shadow-card border border-warmgray/30 p-5 relative flex flex-col"
              >
                <button className="absolute top-4 right-4 text-charcoal-light hover:text-herbal transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <h3 className="font-playfair text-lg font-semibold text-charcoal mb-2 pr-8">{remedy.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {remedy.skin_concerns.slice(0, 2).map((c, i) => (
                    <SkinBadge key={i} label={c} />
                  ))}
                  {remedy.skin_concerns.length > 2 && (
                    <span className="text-[10px] bg-warmgray/30 px-1.5 py-0.5 rounded-full text-charcoal-light">+{remedy.skin_concerns.length - 2}</span>
                  )}
                </div>
                <p className="text-sm text-charcoal-light line-clamp-2 mb-4 flex-1">
                  {remedy.description}
                </p>
                <button 
                  onClick={() => navigate(`/library/${remedy.slug}`)}
                  className="w-full py-2 border border-herbal text-herbal rounded-button text-sm font-medium hover:bg-leaf-soft transition-colors mt-auto"
                >
                  View Details
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-charcoal-light mb-2">No remedies found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveConcern(null); }}
                className="text-herbal font-medium text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
