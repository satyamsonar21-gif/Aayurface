import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, MessageCircle, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/scan', label: 'Scan', icon: Camera },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/library', label: 'Library', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-warmgray flex items-center justify-around px-2 z-40 lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full gap-1 relative',
              isActive ? 'text-herbal' : 'text-warmgray-dark hover:text-charcoal-light'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-poppins font-medium">{item.label}</span>
            {isActive && (
              <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-herbal transform translate-x-1/2 -translate-y-1/2" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
