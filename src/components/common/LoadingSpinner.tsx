import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message, className }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status" aria-label="Loading">
      <div
        className={cn(
          'rounded-full border-brand-primary/20 border-t-brand-primary animate-spin',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-text-secondary font-body text-body-md animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
