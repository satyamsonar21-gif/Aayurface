import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-6 text-center font-body text-text-primary">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shadow-md mb-6">
          <Compass size={32} className="text-brand-accent" />
        </div>
        
        <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent mb-2">
          404 Navigation Error
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mb-3">
          Pathway Not Found
        </h1>
        
        <p className="text-body-md text-text-secondary mb-8 leading-relaxed font-normal">
          It appears you have wandered outside charted constitutional territory. The requested page is unavailable.
        </p>
        
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2 bg-brand-primary text-text-inverse px-7 py-3.5 rounded-md text-body-md font-body font-medium hover:bg-brand-primary-hover transition-all shadow-sm"
          >
            <Home size={16} />
            Return to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
