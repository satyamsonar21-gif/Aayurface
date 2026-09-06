import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useUI } from '@/contexts/UIContext';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  contentClassName?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className, 
  hideNav = false,
  contentClassName
}) => {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen bg-background-primary flex flex-col antialiased selection:bg-brand-secondary/20 selection:text-brand-primary">
      {!hideNav && <Sidebar />}
      
      <main
        className={cn(
          'flex-1 flex flex-col w-full min-h-screen transition-[padding] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
          !hideNav && (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'),
          !hideNav && 'pb-20 lg:pb-0',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto',
            contentClassName
          )}
        >
          {children}
        </motion.div>
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
};

export default PageWrapper;
