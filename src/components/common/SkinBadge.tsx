import React from 'react';
import { cn } from '@/lib/utils';

export type SkinBadgeVariant = 
  | 'oily' 
  | 'dry' 
  | 'acne' 
  | 'dark-spots' 
  | 'aging' 
  | 'redness' 
  | 'dullness' 
  | 'sensitive'
  | 'vata' 
  | 'pitta' 
  | 'kapha' 
  | 'gold'
  | 'default';

interface SkinBadgeProps {
  label: string;
  variant?: SkinBadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const SkinBadge: React.FC<SkinBadgeProps> = ({ 
  label, 
  variant, 
  size = 'sm',
  className 
}) => {
  // Infer variant from label text if variant not explicitly provided
  const inferredVariant = (variant || (() => {
    const lower = label.toLowerCase();
    if (lower.includes('vata')) return 'vata';
    if (lower.includes('pitta')) return 'pitta';
    if (lower.includes('kapha')) return 'kapha';
    if (lower.includes('oil')) return 'oily';
    if (lower.includes('dry')) return 'dry';
    if (lower.includes('acne')) return 'acne';
    if (lower.includes('spot') || lower.includes('pigment')) return 'dark-spots';
    if (lower.includes('red') || lower.includes('sensit')) return 'redness';
    if (lower.includes('age') || lower.includes('line')) return 'aging';
    return 'default';
  })()) as SkinBadgeVariant;

  const variantClasses: Record<SkinBadgeVariant, string> = {
    // High-contrast, WCAG AA verified color pairings
    oily: 'bg-emerald-50 text-emerald-900 border border-emerald-200/60',
    dry: 'bg-amber-50 text-amber-950 border border-amber-200/60',
    acne: 'bg-orange-50 text-orange-950 border border-orange-200/60',
    'dark-spots': 'bg-stone-100 text-stone-900 border border-stone-300/60',
    aging: 'bg-purple-50 text-purple-950 border border-purple-200/60',
    redness: 'bg-rose-50 text-rose-950 border border-rose-200/60',
    dullness: 'bg-yellow-50 text-yellow-950 border border-yellow-200/60',
    sensitive: 'bg-teal-50 text-teal-950 border border-teal-200/60',
    // Dosha constitutional badges
    vata: 'bg-slate-100 text-slate-900 border border-slate-300 font-medium',
    pitta: 'bg-amber-100 text-amber-950 border border-amber-300 font-medium',
    kapha: 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-medium',
    gold: 'bg-amber-50/80 text-amber-900 border border-brand-accent/40 font-medium',
    default: 'bg-background-subtle text-text-primary border border-border-default',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-body rounded-full transition-colors whitespace-nowrap',
        sizeClasses[size],
        variantClasses[inferredVariant] || variantClasses.default,
        className
      )}
    >
      {label}
    </span>
  );
};

export default SkinBadge;
