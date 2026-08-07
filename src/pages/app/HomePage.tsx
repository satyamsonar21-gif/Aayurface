import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Leaf, ChevronRight } from 'lucide-react';
import AyurCard from '@/components/common/AyurCard';
import PageWrapper from '@/components/layout/PageWrapper';
import { getTodaysTip } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const today = new Date();
  const tip = getTodaysTip();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-24"
      >
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="font-playfair text-title text-charcoal">Namaste, User 👋</h1>
          <p className="text-charcoal-light">Let's take care of your skin naturally</p>
          <p className="text-xs text-charcoal-light/70">{formatDate(today.toISOString())}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/scan')}
            className="rounded-card bg-gradient-to-br from-herbal to-herbal-dark p-6 cursor-pointer shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between min-h-[140px]"
          >
            <Camera className="w-8 h-8 text-white mb-4" />
            <div>
              <h2 className="text-white font-playfair font-semibold text-lg">Scan Your Skin</h2>
              <p className="text-white/80 text-sm">Get an Ayurvedic analysis</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/chat')}
            className="rounded-card bg-sandalwood p-6 cursor-pointer shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between min-h-[140px]"
          >
            <Leaf className="w-8 h-8 text-charcoal mb-4" />
            <div>
              <h2 className="text-charcoal font-playfair font-semibold text-lg">Ask Ayurveda</h2>
              <p className="text-charcoal/80 text-sm">Chat with your guide</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AyurCard accent="turmeric" className="p-5">
            <div className="flex items-start gap-3">
              <div className="bg-turmeric/20 p-2 rounded-full">
                <Leaf className="w-5 h-5 text-turmeric" />
              </div>
              <div>
                <h3 className="font-playfair font-semibold text-charcoal mb-1">Today's Ayurvedic Tip</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </AyurCard>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-semibold text-charcoal text-lg">Recent Scan</h3>
          </div>
          <AyurCard accent="herbal" className="p-4" onClick={() => navigate('/results/demo-scan')}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-leaf-soft rounded-full flex-shrink-0 flex items-center justify-center">
                <Camera className="w-6 h-6 text-herbal" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-charcoal-light mb-1">Yesterday</p>
                <p className="text-sm font-medium text-charcoal line-clamp-1">Mild acne with underlying Pitta imbalance</p>
                <div className="flex items-center text-herbal text-sm mt-2 font-medium">
                  View Full Report <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </AyurCard>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
