import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerCardProps {
  height?: string;
  width?: string;
  className?: string;
}

const ShimmerCard: React.FC<ShimmerCardProps> = ({ height = 'h-32', width = 'w-full', className }) => {
  return (
    <div
      className={cn(
        'bg-warmgray rounded-card animate-shimmer',
        height,
        width,
        className
      )}
    />
  );
};

export default ShimmerCard;
