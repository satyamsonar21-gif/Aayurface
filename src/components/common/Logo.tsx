import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <img
        src="/favicon.png"
        alt="Aayurface Logo"
        className={cn('shrink-0 transition-transform duration-200 hover:scale-105 object-contain', sizeClasses[size])}
      />
      {variant === 'full' && (
        <span className={cn('font-display font-semibold tracking-tight text-brand-primary', textClasses[size])}>
          Aayurface
        </span>
      )}
    </div>
  );
};

export default Logo;
