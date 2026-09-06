import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  MessageSquare, 
  Compass, 
  MoreHorizontal, 
  Clock, 
  BookOpen, 
  Sun, 
  User, 
  Settings, 
  X,
  Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCenter?: boolean;
}

const leftNavItems: NavItem[] = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
];

const rightNavItems: NavItem[] = [
  { path: '/progress', label: 'Progress', icon: Compass },
];

const drawerNavItems = [
  { path: '/history', label: 'My History', description: 'Past skin assessments & logs', icon: Clock },
  { path: '/remedies', label: 'Remedies', description: 'Ayurvedic formulations & herbs', icon: BookOpen },
  { path: '/routine', label: 'Daily Routine', description: 'Dinacharya morning & evening', icon: Sun },
  { path: '/profile', label: 'Profile', description: 'Dosha constitution & details', icon: User },
  { path: '/settings', label: 'Settings', description: 'Preferences & privacy controls', icon: Settings },
  { path: '/', label: 'Public Landing', description: 'Return to welcome & methodology', icon: Globe },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isDrawerActive = drawerNavItems.some((item) =>
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 h-16 bg-background-surface/95 backdrop-blur-md border-t border-border-default flex items-center justify-around px-2 z-40 lg:hidden shadow-lg select-none"
      >
        {/* Left Items: Home, Chat */}
        {leftNavItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/home' && (location.pathname === '/dashboard' || location.pathname === '/app')) ||
            (item.path !== '/home' && location.pathname.startsWith(`${item.path}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] h-full py-1 gap-1 transition-colors relative min-h-[48px]',
                isActive ? 'text-brand-primary font-semibold' : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform duration-150', isActive && 'scale-110 text-brand-primary')} />
              <span className="text-[11px] font-body">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-primary" />
              )}
            </Link>
          );
        })}

        {/* Center Elevated Scan Action */}
        <Link
          to="/scan"
          aria-label="Scan Skin"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div className={cn(
            'w-13 h-13 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 group-active:scale-95 border-2 border-background-surface',
            location.pathname === '/scan'
              ? 'bg-brand-primary text-text-inverse ring-2 ring-brand-accent' 
              : 'bg-brand-primary text-text-inverse'
          )}>
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-body font-semibold text-brand-primary mt-1">
            Scan
          </span>
        </Link>

        {/* Right Item: Progress */}
        {rightNavItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] h-full py-1 gap-1 transition-colors relative min-h-[48px]',
                isActive ? 'text-brand-primary font-semibold' : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform duration-150', isActive && 'scale-110 text-brand-primary')} />
              <span className="text-[11px] font-body">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-primary" />
              )}
            </Link>
          );
        })}

        {/* 5th Button: More Drawer Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open secondary navigation menu"
          aria-expanded={isDrawerOpen}
          className={cn(
            'flex flex-col items-center justify-center min-w-[56px] h-full py-1 gap-1 transition-colors relative min-h-[48px] cursor-pointer',
            isDrawerActive ? 'text-brand-primary font-semibold' : 'text-text-tertiary hover:text-text-secondary'
          )}
        >
          <MoreHorizontal className={cn('w-5 h-5 transition-transform duration-150', isDrawerActive && 'scale-110 text-brand-primary')} />
          <span className="text-[11px] font-body">More</span>
          {isDrawerActive && (
            <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-primary" />
          )}
        </button>
      </nav>

      {/* Slide-up "More" Drawer for Mobile */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background-surface rounded-t-2xl border-t border-border-default z-50 p-6 pb-10 shadow-2xl lg:hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Drawer Handle & Header */}
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-border-default/60">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-brand-accent tracking-wider font-body">
                    Complete Navigation
                  </span>
                  <h3 className="font-display text-xl font-semibold text-text-primary">
                    Wellness Explorations
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="p-1.5 rounded-full text-text-secondary hover:bg-background-subtle hover:text-text-primary cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Item Links */}
              <div className="space-y-2 py-2">
                {drawerNavItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === '/remedies' && (location.pathname === '/library' || location.pathname.startsWith('/library/'))) ||
                    (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        'flex items-center gap-3.5 p-3 rounded-lg transition-all',
                        isActive
                          ? 'bg-brand-primary/10 text-brand-primary font-semibold border-l-2 border-brand-primary'
                          : 'text-text-primary hover:bg-background-subtle border-l-2 border-transparent'
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-md flex items-center justify-center shrink-0',
                        isActive ? 'bg-brand-primary text-text-inverse' : 'bg-background-subtle text-brand-primary'
                      )}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-body-md font-medium">{item.label}</p>
                        <p className="text-caption text-text-tertiary truncate">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;
