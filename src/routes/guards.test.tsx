import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import * as AuthModule from '@/contexts/AuthContext';

// Mock useAuth
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('Route Guards Suite (ProtectedRoute & PublicRoute)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when auth is loading in ProtectedRoute', () => {
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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

    expect(screen.getByText(/Loading Ayurvedic Intelligence/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user from /dashboard to /signin and does NOT render protected content', () => {
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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

    // Must be redirected to /signin
    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user from /scan to /signin and preserves location in state', () => {
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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

  it('allows authenticated user into protected route', () => {
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: AuthModule.DEMO_USER,
      isLoading: false,
      isAuthenticated: true,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: AuthModule.DEMO_USER,
      isLoading: false,
      isAuthenticated: true,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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
    vi.mocked(AuthModule.useAuth).mockReturnValue({
      user: AuthModule.DEMO_USER,
      isLoading: false,
      isAuthenticated: true,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
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

    // Landing page remains accessible to authenticated users
    expect(screen.getByText('Public Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Authenticated Dashboard')).not.toBeInTheDocument();
  });
});
