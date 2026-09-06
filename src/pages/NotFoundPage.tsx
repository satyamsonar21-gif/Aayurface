import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

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
        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-text-inverse px-6 py-3 rounded-md text-body-md font-body font-medium hover:bg-brand-primary-hover transition-all shadow-sm"
          >
            <Home size={16} />
            <span>{isAuthenticated ? "Return to Dashboard" : "Return to Home"}</span>
          </Link>
          {!isAuthenticated && (
            <Link 
              to="/signin" 
              className="inline-flex items-center justify-center gap-2 border border-border-default bg-background-surface hover:bg-background-subtle text-text-primary px-6 py-3 rounded-md text-body-md font-body font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
