import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <AuthLayout
      title={isSuccess ? undefined : "Reset Password"}
      subtitle={isSuccess ? undefined : "Enter your email to receive a secure password recovery link"}
    >
      <div className="w-full">
        <Link 
          to="/login" 
          className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors mb-6 text-caption font-body font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Sign In
        </Link>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col w-full"
            >
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
                    Registered Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-md border border-border-default bg-background-surface pl-10 pr-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
                    />
                  </div>
                  {error && <p className="text-red-700 text-caption font-body pl-0.5">{error}</p>}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md mt-6 flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all disabled:opacity-60 shadow-sm cursor-pointer"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send Reset Link'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center text-center w-full py-4 space-y-4"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center border border-emerald-200">
                <CheckCircle2 size={28} />
              </div>
              
              <div className="space-y-1.5">
                <h2 className="font-display text-heading-2 font-semibold text-text-primary">
                  Check Your Inbox
                </h2>
                <p className="text-body-md text-text-secondary font-body max-w-xs mx-auto">
                  We have dispatched password recovery instructions to <span className="font-semibold text-text-primary">{email}</span>.
                </p>
              </div>
              
              <Link 
                to="/login"
                className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md flex justify-center items-center hover:bg-brand-primary-hover transition-colors shadow-sm mt-4"
              >
                Return to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
