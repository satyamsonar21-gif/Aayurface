import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Shield, Search, ArrowRight, MessageCircle } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import AyurCard from '@/components/common/AyurCard';
import SkinBadge from '@/components/common/SkinBadge';
import SafetyNotice from '@/components/common/SafetyNotice';
import { MOCK_SCAN_RESULT } from '@/lib/mockData';

export default function ResultsPage() {
  const navigate = useNavigate();
  const scan = MOCK_SCAN_RESULT;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar 
        title="Your Skin Report 🌿" 
        onBack={() => navigate('/home')} 
      />
      
      <PageWrapper className="pt-20 pb-24 space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-24 h-24 bg-leaf-soft rounded-full flex items-center justify-center shadow-inner mb-4 overflow-hidden border-2 border-white shadow-card">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Scan thumbnail" className="w-full h-full object-cover opacity-80" />
          </div>
          <p className="text-sm text-charcoal-light">Analyzed today</p>
        </div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <AyurCard accent="herbal" className="p-6">
            <h2 className="font-playfair text-lg text-charcoal font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🌿</span> Skin Summary
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <p className="font-playfair text-xl text-charcoal mb-4">{scan.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {scan.skin_types.map((concern, idx) => (
                    <SkinBadge key={idx} label={concern as any} />
                  ))}
                </div>
              </div>
              <div className="relative w-20 h-20 flex-shrink-0 mx-auto md:mx-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" className="stroke-warmgray" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" className="stroke-herbal" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * 0.3} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs font-medium text-charcoal">Mild</span>
                </div>
              </div>
            </div>
          </AyurCard>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <AyurCard accent="turmeric" className="p-6">
            <h2 className="font-playfair text-lg text-charcoal font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-turmeric" /> Possible Causes
            </h2>
            <ul className="space-y-3">
              {scan.causes.map((cause, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{cause.icon}</span>
                  <span className="text-charcoal/90 text-sm leading-relaxed">{cause.text}</span>
                </li>
              ))}
            </ul>
          </AyurCard>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <AyurCard accent="herbal" className="p-6">
            <h2 className="font-playfair text-lg text-charcoal font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🌿</span> Natural Remedies
            </h2>
            <div className="space-y-4">
              {scan.remedies.map((remedy, idx) => (
                <div key={idx} className="bg-leaf-soft rounded-card p-4 relative">
                  <button className="absolute top-4 right-4 p-1.5 bg-white/50 rounded-full hover:bg-white transition-colors">
                    <Bookmark className="w-4 h-4 text-herbal" />
                  </button>
                  <h3 className="font-playfair font-semibold text-charcoal mb-2 pr-8">{remedy.name}</h3>
                  <div className="space-y-2 text-sm text-charcoal/80">
                    <p><span className="font-medium">What:</span> {remedy.what_to_use}</p>
                    <p><span className="font-medium">How:</span> {remedy.how_to_apply}</p>
                    <div className="inline-block px-2 py-1 bg-white/60 rounded-md text-xs font-medium text-herbal mt-1">
                      {remedy.how_often}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AyurCard>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <AyurCard accent="warmgray" className="p-6">
            <h2 className="font-playfair text-lg text-charcoal font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-charcoal-light" /> Prevent & Protect
            </h2>
            <ul className="space-y-3">
              {scan.prevention_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <span className="text-charcoal/90 text-sm leading-relaxed">{tip.text}</span>
                </li>
              ))}
            </ul>
          </AyurCard>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SafetyNotice message="Always do a patch test 24 hours before full application." />
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <button 
            onClick={() => navigate('/chat')}
            className="w-full bg-herbal text-white rounded-button py-4 font-medium shadow-md hover:bg-herbal-dark transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Ask the Ayurvedic Guide
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
      </PageWrapper>
    </div>
  );
}
