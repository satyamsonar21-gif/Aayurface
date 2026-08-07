import React from 'react';
import { cn } from '@/lib/utils';

interface SkinBadgeProps {
  label: string;
  variant?: 'oily' | 'dry' | 'acne' | 'dark-spots' | 'default';
  className?: string;
}

const SkinBadge: React.FC<SkinBadgeProps> = ({ label, variant = 'default', className }) => {
  const variantClasses = {
    oily: 'bg-leaf-soft text-herbal',
    dry: 'bg-sandalwood text-sandalwood-dark',
    acne: 'bg-amber-soft text-turmeric-light',
    'dark-spots': 'bg-warmgray text-charcoal',
    default: 'bg-cream text-charcoal',
  };

  return (
    <span
      className={cn(
        'font-poppins text-xs font-medium px-2.5 py-0.5 rounded-pill',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
};

export default SkinBadge;
