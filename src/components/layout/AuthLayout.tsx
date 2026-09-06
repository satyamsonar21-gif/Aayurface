import React from 'react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background-primary grid lg:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 min-h-screen w-full relative z-10">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-8 lg:mb-10">
            <Logo size="lg" />
          </div>

          <div
            className={cn(
              'w-full bg-background-surface rounded-lg shadow-md border border-border-default p-6 sm:p-8 md:p-10',
              className
            )}
          >
            {(title || subtitle) && (
              <div className="mb-6 text-center">
                {title && (
                  <h1 className="font-display text-heading-2 font-semibold text-text-primary mb-1.5">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="font-body text-body-md text-text-secondary">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-caption text-text-tertiary">
              Evidence-Aware Multimodal Ayurvedic Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Right Editorial Image Section */}
      <div className="hidden lg:block relative w-full h-full overflow-hidden bg-brand-primary">
        <img 
          src="/images/auth-bg.jpg" 
          alt="Natural Ayurvedic Wellness Rituals" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 mix-blend-luminosity" 
        />
        {/* Serene botanical forest green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/60 to-transparent" />
        
        {/* Subtle Editorial Quote */}
        <div className="absolute bottom-12 left-12 right-12 text-text-inverse z-10 space-y-3">
          <span className="inline-block px-3 py-1 rounded-sm bg-brand-accent/20 text-brand-accent text-caption font-body uppercase tracking-wider font-semibold border border-brand-accent/30">
            Ayurvedic Wisdom
          </span>
          <p className="font-display text-2xl font-normal leading-relaxed text-text-inverse/95 italic">
            "The body is the temple of the soul. Understand its constitution, honor its rhythms, and restore natural harmony."
          </p>
          <p className="font-body text-caption text-text-inverse/70 tracking-wide">
            Rooted in Charaka Samhita & Classical Doshic Balance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
