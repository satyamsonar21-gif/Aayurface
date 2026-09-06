import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signUp(data.email, data.password, data.fullName);
      navigate('/dashboard', { replace: true });
    } catch {
      setErrorMsg('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch {
      setErrorMsg('Google sign in could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Begin your personalized Ayurvedic skin health journey"
    >
      <div className="w-full">
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 text-red-900 rounded-md text-body-md text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
              Full Name
            </label>
            <input
              {...register('fullName')}
              type="text"
              autoComplete="name"
              placeholder="e.g. Namrata Sen"
              className="w-full rounded-md border border-border-default bg-background-surface px-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
            />
            {errors.fullName && (
              <p className="text-red-700 text-caption font-body pl-0.5">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full rounded-md border border-border-default bg-background-surface px-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
            />
            {errors.email && (
              <p className="text-red-700 text-caption font-body pl-0.5">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
              Password (min 8 characters)
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-border-default bg-background-surface px-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-700 text-caption font-body pl-0.5">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-md border border-border-default bg-background-surface px-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-700 text-caption font-body pl-0.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-brand-primary text-text-inverse rounded-md py-3 font-body font-medium text-body-md mt-6 flex justify-center items-center gap-2 hover:bg-brand-primary-hover transition-all disabled:opacity-60 shadow-sm cursor-pointer"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </motion.button>
        </form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-caption font-body text-text-tertiary uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-background-surface border border-border-default text-text-primary rounded-md py-2.5 font-body font-medium text-body-md flex justify-center items-center gap-3 hover:bg-background-subtle transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.35H19.28C21.36 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.35L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
            <path d="M5.84 14.1C5.62 13.44 5.49 12.73 5.49 12C5.49 11.27 5.62 10.56 5.84 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.1Z" fill="#FBBC05"/>
            <path d="M12 5.38C13.62 5.38 15.06 5.93 16.21 7.02L19.35 3.88C17.45 2.1 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>

        <p className="mt-8 text-center text-body-md text-text-secondary font-body">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
