import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyNoticeProps {
  message: string;
  variant?: 'info' | 'warning';
  className?: string;
}

const SafetyNotice: React.FC<SafetyNoticeProps> = ({ message, variant = 'info', className }) => {
  const isWarning = variant === 'warning';
  const Icon = isWarning ? AlertTriangle : Shield;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-card bg-amber-soft border-l-4',
        isWarning ? 'border-turmeric' : 'border-herbal',
        className
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5', isWarning ? 'text-turmeric' : 'text-herbal')} />
      <p className="font-poppins text-sm text-charcoal leading-relaxed">{message}</p>
    </div>
  );
};

export default SafetyNotice;
