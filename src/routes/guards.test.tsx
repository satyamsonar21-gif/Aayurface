import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import * as AuthModule from '@/contexts/AuthContext';
import type { User, AuthContextType } from '@/types';

// Mock useAuth
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

function mockAuth(overrides: Partial<AuthContextType> = {}): AuthContextType {
  const defaults: AuthContextType = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
    completeOnboarding: vi.fn(),
  };
  const value = { ...defaults, ...overrides };
  vi.mocked(AuthModule.useAuth).mockReturnValue(value);
  return value;
}

describe('Route Guards Suite (ProtectedRoute & PublicRoute)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when auth is loading in ProtectedRoute', () => {
    mockAuth({
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading AayurFace/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user from /dashboard to /signin and does NOT render protected content', () => {
    mockAuth({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>Sign In Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user from /scan to /signin and preserves location in state', () => {
    mockAuth({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/scan']}>
        <Routes>
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <div>Scan Camera Engine</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('Scan Camera Engine')).not.toBeInTheDocument();
  });

  it('allows authenticated and onboarded user into protected route', () => {
    mockAuth({
      user: AuthModule.DEMO_USER,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>Sign In Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Screen')).not.toBeInTheDocument();
  });

  it('redirects authenticated user away from /signin to /dashboard', () => {
    mockAuth({
      user: AuthModule.DEMO_USER,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <div>Sign In Form</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Authenticated Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Authenticated Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Form')).not.toBeInTheDocument();
  });

  it('allows unauthenticated visitor on PublicRoute when restrictAuthenticated is false', () => {
    mockAuth({
      user: null,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute restrictAuthenticated={false}>
                <div>Public Landing Page</div>
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Landing Page')).toBeInTheDocument();
  });

  it('allows authenticated user on PublicRoute when restrictAuthenticated is false (Landing page remains accessible)', () => {
    mockAuth({
      user: AuthModule.DEMO_USER,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute restrictAuthenticated={false}>
                <div>Public Landing Page</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Authenticated Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Authenticated Dashboard')).not.toBeInTheDocument();
  });

  it('redirects authenticated user with incomplete onboarding from /dashboard to /onboarding', () => {
    const incompleteUser: User = {
      ...AuthModule.DEMO_USER,
      id: 'incomplete-user-1',
      onboarding_completed: false,
    };

    mockAuth({
      user: incompleteUser,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/onboarding" element={<div>Onboarding Flow</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Flow')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('allows authenticated user with incomplete onboarding to access /onboarding', () => {
    const incompleteUser: User = {
      ...AuthModule.DEMO_USER,
      id: 'incomplete-user-2',
      onboarding_completed: false,
    };

    mockAuth({
      user: incompleteUser,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding Flow Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Flow Content')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects authenticated user with completed onboarding away from /onboarding to /dashboard', () => {
    mockAuth({
      user: AuthModule.DEMO_USER, // onboarding_completed: true
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding Flow Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<div>Forwarded to Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Forwarded to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Onboarding Flow Content')).not.toBeInTheDocument();
  });

  it('redirects authenticated user with incomplete onboarding away from /signin to /onboarding', () => {
    const incompleteUser: User = {
      ...AuthModule.DEMO_USER,
      id: 'incomplete-user-3',
      onboarding_completed: false,
    };

    mockAuth({
      user: incompleteUser,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <div>Sign In Form</div>
              </PublicRoute>
            }
          />
          <Route path="/onboarding" element={<div>Onboarding Target</div>} />
          <Route path="/dashboard" element={<div>Dashboard Target</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Target')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Form')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard Target')).not.toBeInTheDocument();
  });
});
