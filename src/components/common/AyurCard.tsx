import React from 'react';
import { cn } from '@/lib/utils';

interface AyurCardProps {
  className?: string;
  accent?: 'herbal' | 'turmeric' | 'sandalwood' | 'warmgray' | 'sage' | 'gold' | 'none';
  children: React.ReactNode;
  onClick?: () => void;
}

const AyurCard: React.FC<AyurCardProps> = ({ className, accent = 'none', children, onClick }) => {
  const accentClasses = {
    herbal: 'border-l-4 border-l-brand-primary',
    turmeric: 'border-l-4 border-l-brand-accent',
    sandalwood: 'border-l-4 border-l-border-default',
    warmgray: 'border-l-4 border-l-text-tertiary',
    sage: 'border-l-4 border-l-brand-secondary',
    gold: 'border-l-4 border-l-brand-accent',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-background-surface rounded-lg border border-border-default shadow-sm p-5 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-brand-secondary/40 active:scale-[0.99]',
        accentClasses[accent],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AyurCard;
