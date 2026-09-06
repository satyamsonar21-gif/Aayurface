import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  showLogo = false,
  className,
}) => {
  return (
    <header
      className={cn(
        'h-16 flex items-center justify-between px-4 sm:px-6 bg-background-surface/90 backdrop-blur-md border-b border-border-default sticky top-0 z-30 transition-all',
        className
      )}
    >
      <div className="flex items-center min-w-[3rem]">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-background-subtle transition-colors text-text-secondary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back to previous screen"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center items-center font-display font-semibold text-lg sm:text-xl text-text-primary tracking-tight truncate px-2">
        {showLogo ? (
          <Link to="/" className="cursor-pointer" aria-label="AayurFace Home">
            <Logo size="sm" />
          </Link>
        ) : title}
      </div>

      <div className="flex items-center justify-end min-w-[3rem]">
        {rightAction}
      </div>
    </header>
  );
};

export default TopBar;
