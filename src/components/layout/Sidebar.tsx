import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, MessageCircle, BookOpen, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/scan', label: 'Scan', icon: Camera },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/library', label: 'Library', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(next));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-warmgray z-40 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-warmgray">
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Logo size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-warmgray transition-colors text-charcoal mx-auto"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center p-3 rounded-button transition-colors',
                isCollapsed ? 'justify-center' : 'gap-3 px-4',
                isActive
                  ? 'bg-leaf-soft text-herbal'
                  : 'text-charcoal hover:bg-warmgray'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive ? 'text-herbal' : 'text-charcoal-light')} />
              <AnimatePresence mode="popLayout">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-poppins font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-warmgray">
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
          <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-herbal" />
          </div>
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <span className="font-poppins font-medium text-charcoal text-sm truncate">My Profile</span>
                <span className="font-poppins text-xs text-charcoal-light truncate">View settings</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
