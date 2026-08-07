import React from 'react';
import { cn } from '@/lib/utils';

interface AyurCardProps {
  className?: string;
  accent?: 'herbal' | 'turmeric' | 'sandalwood' | 'warmgray' | 'none';
  children: React.ReactNode;
  onClick?: () => void;
}

const AyurCard: React.FC<AyurCardProps> = ({ className, accent = 'none', children, onClick }) => {
  const accentClasses = {
    herbal: 'border-l-4 border-herbal',
    turmeric: 'border-l-4 border-turmeric',
    sandalwood: 'border-l-4 border-sandalwood',
    warmgray: 'border-l-4 border-warmgray',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-cream-card rounded-card shadow-card p-4',
        onClick ? 'cursor-pointer hover:shadow-card-hover transition-shadow duration-300' : '',
        accentClasses[accent],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AyurCard;
