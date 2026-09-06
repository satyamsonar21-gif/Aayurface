// ============================================================
// Aayurface — Route Guards
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading Ayurvedic Intelligence..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Strict authentication requirement: redirect to /signin and preserve attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: ReactNode;
  restrictAuthenticated?: boolean;
}

export function PublicRoute({ children, restrictAuthenticated = true }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && restrictAuthenticated) {
    // If user is already authenticated, redirect to destination or default dashboard
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

