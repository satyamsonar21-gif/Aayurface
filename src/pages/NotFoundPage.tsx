import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#DDEEDB" opacity="0.5" />
            <path d="M45 45C30 60 25 80 45 90C65 80 60 60 45 45Z" fill="#4CAF50" opacity="0.8" />
            <path d="M75 35C85 25 100 30 95 45C90 60 75 55 75 35Z" fill="#4CAF50" opacity="0.6" />
            <path d="M45 90C45 90 55 60 85 45" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        
        <h1 className="font-playfair text-title md:text-[40px] font-semibold text-charcoal mb-4">
          Page Not Found 🌿
        </h1>
        
        <p className="text-body-md text-charcoal-light mb-8 max-w-sm">
          It seems you've wandered off the path. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2 bg-herbal text-white px-8 py-3.5 rounded-button text-body-md font-medium hover:bg-opacity-90 transition-all shadow-md"
          >
            <Home size={18} />
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
