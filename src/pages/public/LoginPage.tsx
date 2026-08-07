import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signIn(data.email, data.password);
      navigate('/home');
    } catch (err) {
      setErrorMsg('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (err) {
      setErrorMsg('Google sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 md:p-8 bg-cream-card rounded-card shadow-card relative z-10">
        <h1 className="font-playfair text-title text-charcoal font-semibold mb-2 text-center">Welcome Back 🌿</h1>
        <p className="text-body-md text-charcoal-light mb-8 text-center">Sign in to continue your skin care journey</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-turmeric/10 border border-turmeric/20 text-turmeric rounded-md text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-1">
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address"
              className="w-full rounded-button border border-warmgray bg-white px-4 py-3 font-poppins text-small focus:border-herbal focus:ring-1 focus:ring-herbal outline-none transition-all placeholder:text-charcoal-light/60 text-charcoal"
            />
            {errors.email && <p className="text-turmeric text-caption pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1 relative">
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full rounded-button border border-warmgray bg-white px-4 py-3 font-poppins text-small focus:border-herbal focus:ring-1 focus:ring-herbal outline-none transition-all placeholder:text-charcoal-light/60 text-charcoal pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-turmeric text-caption pl-1">{errors.password.message}</p>}
            
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-herbal text-small hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-herbal text-white rounded-button py-3 font-medium text-body-md mt-4 flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-70 shadow-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </motion.button>
        </form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-warmgray"></div>
          <span className="text-small text-charcoal-light">or</span>
          <div className="flex-1 h-px bg-warmgray"></div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-white border border-warmgray text-charcoal rounded-button py-3 font-medium text-small flex justify-center items-center gap-3 hover:bg-cream transition-colors shadow-sm disabled:opacity-70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.35H19.28C21.36 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.35L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
            <path d="M5.84 14.1C5.62 13.44 5.49 12.73 5.49 12C5.49 11.27 5.62 10.56 5.84 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.1Z" fill="#FBBC05"/>
            <path d="M12 5.38C13.62 5.38 15.06 5.93 16.21 7.02L19.35 3.88C17.45 2.1 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>

        <p className="mt-8 text-small text-charcoal-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-herbal font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
