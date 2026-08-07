// ============================================================
// Aayurface — Route Definitions
// ============================================================

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'));
const HomePage = lazy(() => import('@/pages/app/HomePage'));
const ScanPage = lazy(() => import('@/pages/app/ScanPage'));
const ResultsPage = lazy(() => import('@/pages/app/ResultsPage'));
const ChatPage = lazy(() => import('@/pages/app/ChatPage'));
const LibraryPage = lazy(() => import('@/pages/app/LibraryPage'));
const RemedyDetailPage = lazy(() => import('@/pages/app/RemedyDetailPage'));
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));
const EditProfilePage = lazy(() => import('@/pages/app/EditProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-herbal border-t-transparent rounded-full animate-spin-slow mx-auto mb-4" />
        <p className="font-poppins text-charcoal-light text-small">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* Onboarding (requires auth) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected app routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:scanId"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library/:remedyId"
          element={
            <ProtectedRoute>
              <RemedyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
