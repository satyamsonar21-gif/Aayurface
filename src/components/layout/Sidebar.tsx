import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  Sun, 
  Compass, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavGroup {
  group: 'PRIMARY' | 'JOURNEY' | 'ACCOUNT';
  items: {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const navigationGroups: NavGroup[] = [
  {
    group: 'PRIMARY',
    items: [
      { path: '/home', label: 'Home', icon: Home },
      { path: '/scan', label: 'Scan Skin', icon: Camera },
      { path: '/chat', label: 'Chat with Ayurveda', icon: MessageSquare },
    ],
  },
  {
    group: 'JOURNEY',
    items: [
      { path: '/history', label: 'My History', icon: Clock },
      { path: '/remedies', label: 'Remedies', icon: BookOpen },
      { path: '/routine', label: 'Daily Routine', icon: Sun },
      { path: '/progress', label: 'Progress', icon: Compass },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed: isCollapsed, toggleSidebar } = useUI();
  const { user } = useAuth();

  const userName = user?.full_name || 'My Profile';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-background-surface border-r border-border-default z-40 overflow-hidden shadow-sm select-none"
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-4 h-18 border-b border-border-default shrink-0">
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-hidden"
            >
              <Link to="/" title="Return to Public Landing" className="block cursor-pointer" aria-label="Return to Public Landing">
                <Logo size="md" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="mx-auto">
            <Link to="/" title="Return to Public Landing" className="block cursor-pointer" aria-label="Return to Public Landing">
              <Logo size="sm" variant="icon-only" />
            </Link>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-md hover:bg-background-subtle text-text-secondary hover:text-text-primary transition-colors ml-auto cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Grouped */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4 scrollbar-hide">
        {navigationGroups.map((navGroup) => (
          <div key={navGroup.group} className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-body font-semibold tracking-wider text-text-tertiary uppercase px-3 pt-1 pb-1">
                {navGroup.group}
              </p>
            )}

            <div className="flex flex-col gap-1">
              {navGroup.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/home' && (location.pathname === '/dashboard' || location.pathname === '/app')) ||
                  (item.path === '/remedies' && (location.pathname === '/library' || location.pathname.startsWith('/library/'))) ||
                  (item.path !== '/home' && location.pathname.startsWith(`${item.path}/`));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group flex items-center rounded-md transition-all duration-200 text-body-md relative',
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2',
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary font-semibold border-l-2 border-brand-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-subtle border-l-2 border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4.5 h-4.5 shrink-0 transition-colors',
                        isActive
                          ? 'text-brand-primary'
                          : 'text-text-secondary group-hover:text-brand-primary'
                      )}
                    />
                    
                    <AnimatePresence mode="popLayout">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden font-body text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Minimal active dot when collapsed */}
                    {isCollapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile Section */}
      <div className="p-3 border-t border-border-default shrink-0 bg-background-primary/50 space-y-1">
        <Link
          to="/profile"
          className={cn(
            'flex items-center rounded-md p-2 transition-colors hover:bg-background-subtle group',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <div className="w-9 h-9 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shrink-0 font-display font-semibold text-sm shadow-sm group-hover:ring-2 group-hover:ring-brand-accent transition-all">
            {userName.charAt(0).toUpperCase()}
          </div>
          
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col min-w-0 overflow-hidden text-left"
              >
                <span className="font-body font-semibold text-text-primary text-sm truncate">{userName}</span>
                <span className="font-body text-caption text-text-tertiary truncate">Ayurvedic Seeker</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Return to Public Landing */}
        <Link
          to="/"
          title={isCollapsed ? "Public Landing" : undefined}
          className={cn(
            'flex items-center rounded-md p-2 transition-colors text-text-tertiary hover:text-brand-primary hover:bg-background-subtle group text-xs font-medium',
            isCollapsed ? 'justify-center' : 'gap-2.5 px-3'
          )}
        >
          <Globe className="w-4 h-4 shrink-0 text-text-tertiary group-hover:text-brand-primary transition-colors" />
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate whitespace-nowrap"
              >
                Public Landing
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
