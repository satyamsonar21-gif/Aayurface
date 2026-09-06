// ============================================================
// Aayurface — Route Definitions
// ============================================================

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
const HistoryPage = lazy(() => import('@/pages/app/HistoryPage'));
const RoutinePage = lazy(() => import('@/pages/app/RoutinePage'));
const ProgressPage = lazy(() => import('@/pages/app/ProgressPage'));
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <LoadingSpinner size="lg" message="Loading Ayurvedic Intelligence..." />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
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
          path="/signin"
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
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
          path="/voice"
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
          path="/library/:slug"
          element={
            <ProtectedRoute>
              <RemedyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/remedies"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/remedies/:slug"
          element={
            <ProtectedRoute>
              <RemedyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routine"
          element={
            <ProtectedRoute>
              <RoutinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
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
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
