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
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-md mx-auto p-6 md:p-8 bg-cream-card rounded-card shadow-card relative z-10 min-h-[400px]">
        <Link to="/login" className="inline-flex items-center text-charcoal-light hover:text-charcoal transition-colors mb-6 text-small font-medium w-fit">
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Link>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full"
            >
              <h1 className="font-playfair text-title text-charcoal font-semibold mb-2">Reset Your Password</h1>
              <p className="text-body-md text-charcoal-light mb-8">Enter your email and we'll send you a reset link</p>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light/60">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full rounded-button border border-warmgray bg-white pl-11 pr-4 py-3 font-poppins text-small focus:border-herbal focus:ring-1 focus:ring-herbal outline-none transition-all placeholder:text-charcoal-light/60 text-charcoal"
                    />
                  </div>
                  {error && <p className="text-turmeric text-caption pl-1">{error}</p>}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-herbal text-white rounded-button py-3 font-medium text-body-md mt-4 flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center w-full py-6"
            >
              <div className="w-16 h-16 bg-leaf-soft rounded-full flex items-center justify-center text-herbal mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-playfair text-title text-charcoal font-semibold mb-3">Check your inbox 📬</h2>
              <p className="text-body-md text-charcoal-light mb-8 px-4">
                We've sent a password reset link to <span className="font-medium text-charcoal">{email}</span>
              </p>
              
              <Link 
                to="/login"
                className="w-full bg-white border border-warmgray text-charcoal rounded-button py-3 font-medium text-body-md flex justify-center items-center hover:bg-cream transition-colors shadow-sm"
              >
                Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
