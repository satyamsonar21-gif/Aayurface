import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, hideNav = false }) => {
  return (
    <div className="min-h-screen bg-cream flex">
      {!hideNav && <Sidebar />}
      
      <main
        className={cn(
          'flex-1 flex flex-col w-full min-h-screen transition-all duration-300',
          !hideNav && 'lg:pl-[240px]',
          !hideNav && 'pb-16 lg:pb-0',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col w-full"
        >
          {children}
        </motion.div>
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
};

export default PageWrapper;
