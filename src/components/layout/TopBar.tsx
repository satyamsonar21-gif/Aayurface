import React from 'react';
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
        'h-14 flex items-center justify-between px-4 bg-white border-b border-warmgray sticky top-0 z-40',
        className
      )}
    >
      <div className="flex items-center min-w-[3rem]">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-warmgray transition-colors text-charcoal"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center items-center font-playfair font-semibold text-lg text-charcoal">
        {showLogo ? <Logo size="sm" /> : title}
      </div>

      <div className="flex items-center justify-end min-w-[3rem]">
        {rightAction}
      </div>
    </header>
  );
};

export default TopBar;
