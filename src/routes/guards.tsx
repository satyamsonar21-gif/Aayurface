// ============================================================
// Aayurface — Route Guards (Phase 08)
// Enforces strict authentication, account verification, and
// deterministic onboarding routing based on server-side state.
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading AayurFace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Strict authentication requirement: redirect to /signin and preserve attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Phase 08 Onboarding Guard: Incomplete users must complete onboarding before accessing the app
  if (!user?.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Already onboarded users visiting /onboarding directly are forwarded to dashboard
  if (user?.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: ReactNode;
  restrictAuthenticated?: boolean;
}

export function PublicRoute({ children, restrictAuthenticated = true }: PublicRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading AayurFace..." />
      </div>
    );
  }

  if (isAuthenticated && restrictAuthenticated) {
    // Authenticated users who have not completed onboarding must be routed to /onboarding
    if (!user?.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }

    // Authenticated and onboarded users are forwarded to intended destination or default dashboard
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
