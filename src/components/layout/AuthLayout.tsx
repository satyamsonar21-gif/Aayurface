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
    <div className="min-h-screen bg-cream grid lg:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 h-full w-full">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-10 lg:mb-12">
            <Logo size="lg" />
          </div>
          
          <div
            className={cn(
              'bg-white w-full p-6 sm:p-10 rounded-card shadow-card border border-warmgray/30',
              className
            )}
          >
            {(title || subtitle) && (
              <div className="mb-8 text-center">
                {title && <h1 className="text-2xl font-playfair font-bold text-charcoal mb-2">{title}</h1>}
                {subtitle && <p className="text-charcoal-light font-poppins text-sm">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block relative w-full h-full">
        <img 
          src="/images/auth-bg.jpg" 
          alt="Ayurvedic Spa" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        {/* Optional overlay for better integration */}
        <div className="absolute inset-0 bg-herbal/10 mix-blend-multiply pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
