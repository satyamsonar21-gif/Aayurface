import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyNoticeProps {
  message: string;
  variant?: 'info' | 'warning';
  className?: string;
}

const SafetyNotice: React.FC<SafetyNoticeProps> = ({ message, variant = 'info', className }) => {
  const isWarning = variant === 'warning';
  const Icon = isWarning ? AlertCircle : ShieldCheck;

  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3.5 p-4 rounded-lg border transition-all',
        isWarning 
          ? 'bg-amber-50/70 border-amber-200/80 text-amber-950' 
          : 'bg-emerald-50/60 border-emerald-200/70 text-emerald-950',
        className
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', isWarning ? 'text-amber-700' : 'text-emerald-800')} />
      <div className="space-y-0.5">
        <p className="font-body text-body-md leading-relaxed font-normal">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SafetyNotice;
