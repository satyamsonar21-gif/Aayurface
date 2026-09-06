import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Refined Ayurvedic Botanical Emblem */}
      <svg
        className={cn('text-brand-primary shrink-0 transition-transform duration-200 hover:scale-105', sizeClasses[size])}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
        <path
          d="M16 4C16 4 11 11 11 16.5C11 19.5 13.2 22 16 22C18.8 22 21 19.5 21 16.5C21 11 16 4 16 4Z"
          fill="currentColor"
          className="text-brand-primary"
        />
        <circle cx="16" cy="16.5" r="2" fill="#C5A059" />
        <path
          d="M8 20C10.5 23 13.5 24 16 24C18.5 24 21.5 23 24 20"
          stroke="#C5A059"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {variant === 'full' && (
        <span className={cn('font-display font-semibold tracking-tight text-brand-primary', textClasses[size])}>
          Aayurface
        </span>
      )}
    </div>
  );
};

export default Logo;
