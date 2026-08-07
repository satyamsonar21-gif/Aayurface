import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Leaf } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import AyurCard from '@/components/common/AyurCard';
import SkinBadge from '@/components/common/SkinBadge';
import SafetyNotice from '@/components/common/SafetyNotice';
import { MOCK_REMEDIES } from '@/lib/mockData';

export default function RemedyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const remedy = MOCK_REMEDIES.find(r => r.slug === slug) || MOCK_REMEDIES[0];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar 
        title="Remedy Detail" 
        onBack={() => navigate('/library')}
        rightAction={
          <button className="p-2 text-charcoal hover:text-herbal transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        }
      />
      
      <PageWrapper className="pt-20 pb-24 space-y-6">
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-24 h-24 bg-leaf-medium rounded-full flex items-center justify-center shadow-inner mb-6">
            <Leaf className="w-12 h-12 text-herbal" strokeWidth={1.5} />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-charcoal mb-3">{remedy.name}</h1>
          <p className="text-charcoal/80 text-sm mb-4 px-4">{remedy.description}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {remedy.skin_concerns.map(c => (
              <SkinBadge key={c} label={c} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="bg-turmeric/20 text-charcoal text-xs font-medium px-4 py-2 rounded-pill flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" /> Prep: {remedy.preparation_steps.length * 5} mins
          </div>
          <div className="bg-leaf-soft text-herbal-dark text-xs font-medium px-4 py-2 rounded-pill flex items-center gap-1.5 whitespace-nowrap">
            <Leaf className="w-3.5 h-3.5" /> Easy to make
          </div>
        </div>

        <AyurCard accent="herbal" className="p-5">
          <h3 className="font-playfair font-semibold text-lg text-charcoal mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {remedy.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-charcoal/90">
                <div className="w-1.5 h-1.5 rounded-full bg-herbal flex-shrink-0" />
                <span>{ing.amount} {ing.name}</span>
              </li>
            ))}
          </ul>
        </AyurCard>

        <AyurCard accent="sandalwood" className="p-5">
          <h3 className="font-playfair font-semibold text-lg text-charcoal mb-3">Preparation</h3>
          <div className="space-y-4">
            {remedy.preparation_steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-charcoal flex-shrink-0 border border-sandalwood shadow-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-charcoal/90 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </AyurCard>

        <AyurCard accent="turmeric" className="p-5">
          <h3 className="font-playfair font-semibold text-lg text-charcoal mb-3">Application</h3>
          <div className="space-y-4">
            {remedy.application_steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-charcoal flex-shrink-0 border border-turmeric/30 shadow-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-charcoal/90 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </AyurCard>

        <AyurCard className="p-5 bg-gradient-to-br from-white to-leaf-soft/50">
          <h3 className="font-playfair font-semibold text-lg text-charcoal mb-2">Ayurvedic Insight</h3>
          <p className="text-sm text-charcoal/80 italic leading-relaxed">
            "{remedy.ayurvedic_insight}"
          </p>
        </AyurCard>

        <SafetyNotice message="Always do a patch test 24 hours before full application." />

      </PageWrapper>
    </div>
  );
}
