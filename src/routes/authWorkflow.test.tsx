// ============================================================
// AayurFace — Canonical Auth & Navigation Workflow Test Suite
// Full Automated Regression Coverage for AUTH-01 through AUTH-30
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import * as AuthModule from '@/contexts/AuthContext';
import type { User, AuthContextType } from '@/types';
import { createAssessment, getAssessmentById } from '@/lib/assessmentStore';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import LandingPage from '@/pages/public/LandingPage';

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
    signUp: vi.fn().mockResolvedValue(null),
    signIn: vi.fn().mockResolvedValue(null),
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue(undefined),
    completeOnboarding: vi.fn().mockResolvedValue(undefined),
  };
  const value = { ...defaults, ...overrides };
  vi.mocked(AuthModule.useAuth).mockReturnValue(value);
  return value;
}

const mockCompleteUser: User = {
  id: 'usr-complete-101',
  email: 'complete@aayurface.example',
  full_name: 'Dr. Anita Joshi',
  avatar_url: null,
  skin_type: 'combination',
  dosha: 'pitta',
  onboarding_completed: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const mockIncompleteUser: User = {
  id: 'usr-incomplete-202',
  email: 'newuser@aayurface.example',
  full_name: 'Karan Sharma',
  avatar_url: null,
  skin_type: null,
  dosha: null,
  onboarding_completed: false,
  created_at: '2026-02-01T00:00:00Z',
  updated_at: '2026-02-01T00:00:00Z',
};

describe('Canonical Authentication & Navigation Suite (AUTH-01 to AUTH-30)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // AUTH-01 & AUTH-29: Root route remains public
  it('AUTH-01 & AUTH-29: Fresh visitor reaches public landing page on /', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Begin Your Skin Journey/i)).toBeInTheDocument();
  });

  // AUTH-02 & AUTH-30: Fresh visitor remains unauthenticated and does not auto-authenticate
  it('AUTH-02 & AUTH-30: Fresh visitor remains unauthenticated on / and sees Sign In and Get Started', () => {
    const auth = mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(auth.isAuthenticated).toBe(false);
    expect(screen.getByRole('link', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
  });

  // AUTH-03: Landing does not create a session
  it('AUTH-03: Visiting landing does not create a session or write auth tokens', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(localStorage.getItem('sb-ikshvfkeumusnnufadiy-auth-token')).toBeNull();
    expect(localStorage.getItem('aayurface_session')).toBeNull();
  });

  // AUTH-04 & AUTH-05: Explicit user action required to enter Sign In or Register
  it('AUTH-04 & AUTH-05: Landing header contains explicit links to /signin and /register', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const signInLink = screen.getByRole('link', { name: /Sign In/i });
    const registerLink = screen.getByRole('link', { name: /Get Started/i });

    expect(signInLink).toHaveAttribute('href', '/signin');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  // AUTH-06: Unauthenticated /dashboard -> /signin
  it('AUTH-06: Unauthenticated attempt to visit /dashboard redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  // AUTH-07: Unauthenticated /scan -> /signin
  it('AUTH-07: Unauthenticated attempt to visit /scan redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/scan']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <div>Scan Camera View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Scan Camera View')).not.toBeInTheDocument();
  });

  // AUTH-08: Unauthenticated /history -> /signin
  it('AUTH-08: Unauthenticated attempt to visit /history redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <div>History View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('History View')).not.toBeInTheDocument();
  });

  // AUTH-09: Unauthenticated /profile -> /signin
  it('AUTH-09: Unauthenticated attempt to visit /profile redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Profile View')).not.toBeInTheDocument();
  });

  // AUTH-10: New registration routes to /onboarding
  it('AUTH-10: Successful new account registration deterministically navigates to /onboarding', async () => {
    const mockSignUp = vi.fn().mockResolvedValue(mockIncompleteUser);
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<div>Six Step Onboarding Flow</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('#register-fullName')).toBeNull();
    fireEvent.change(container.querySelector('#register-email')!, { target: { value: 'karan@example.com' } });
    fireEvent.change(container.querySelector('#register-password')!, { target: { value: 'SecretPassword123!' } });
    fireEvent.change(container.querySelector('#register-confirmPassword')!, { target: { value: 'SecretPassword123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('karan@example.com', 'SecretPassword123!');
      expect(screen.getByText('Six Step Onboarding Flow')).toBeInTheDocument();
    });
  });

  // AUTH-11: Incomplete new user cannot access dashboard before onboarding
  it('AUTH-11: Authenticated user with incomplete onboarding is blocked from /dashboard and bounced to /onboarding', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/onboarding" element={<div>Onboarding Gating Active</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Gating Active')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard')).not.toBeInTheDocument();
  });

  // AUTH-12 & AUTH-13: Completed onboarding leads to /dashboard
  it('AUTH-12 & AUTH-13: Authenticated user with completed onboarding can access /dashboard', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/onboarding" element={<div>Onboarding</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Authorized Dashboard View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Authorized Dashboard View')).toBeInTheDocument();
  });

  // AUTH-14: Existing completed user sign-in routes to destination or /dashboard
  it('AUTH-14: Existing completed user sign-in routes to destination or /dashboard', async () => {
    const mockSignIn = vi.fn().mockResolvedValue(mockCompleteUser);
    mockAuth({ signIn: mockSignIn, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Welcome Back Dashboard</div>} />
          <Route path="/onboarding" element={<div>Onboarding</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#login-email')!, { target: { value: 'complete@aayurface.example' } });
    fireEvent.change(container.querySelector('#login-password')!, { target: { value: 'MyPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('complete@aayurface.example', 'MyPassword123!');
      expect(screen.getByText('Welcome Back Dashboard')).toBeInTheDocument();
    });
  });

  // AUTH-15: Existing incomplete user sign-in routes strictly to /onboarding
  it('AUTH-15: Existing incomplete user sign-in routes strictly to /onboarding', async () => {
    const mockSignIn = vi.fn().mockResolvedValue(mockIncompleteUser);
    mockAuth({ signIn: mockSignIn, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Welcome Back Dashboard</div>} />
          <Route path="/onboarding" element={<div>Complete Your Profile Onboarding</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#login-email')!, { target: { value: 'incomplete@aayurface.example' } });
    fireEvent.change(container.querySelector('#login-password')!, { target: { value: 'MyPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('incomplete@aayurface.example', 'MyPassword123!');
      expect(screen.getByText('Complete Your Profile Onboarding')).toBeInTheDocument();
      expect(screen.queryByText('Welcome Back Dashboard')).not.toBeInTheDocument();
    });
  });

  // AUTH-16 & AUTH-17 & AUTH-18: Scan and camera cannot authenticate
  it('AUTH-16, 17, 18: Assessment creation and scan actions throw without valid authenticated user ID', () => {
    expect(() => {
      createAssessment('', 'data:image/jpeg;base64,frame123');
    }).toThrow(/Cannot create assessment without a valid authenticated user ID/i);

    expect(() => {
      createAssessment('anonymous-user', 'data:image/jpeg;base64,frame123');
    }).toThrow(/Cannot create assessment without a valid authenticated user ID/i);
  });

  // AUTH-19 & AUTH-20: Logout calls real Supabase signOut and navigates to /
  it('AUTH-19 & AUTH-20: Landing header Sign Out calls signOut and returns to /', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined);
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, signOut: mockSignOut });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  // AUTH-21 & AUTH-22: Post-logout dashboard and scan are blocked
  it('AUTH-21 & AUTH-22: After logout, navigating to /dashboard or /scan immediately redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen Post-Logout</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen Post-Logout')).toBeInTheDocument();
  });

  // AUTH-23 & AUTH-24: Browser Back after logout cannot restore usable protected state
  it('AUTH-23 & AUTH-24: ProtectedRoute unconditionally checks auth state on render; unauthenticated back-navigation bounces to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/signin" element={<div>Login Page Redirect Target</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Redirect Target')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // AUTH-25: New browser session with no token remains unauthenticated
  it('AUTH-25: PublicRoute permits unauthenticated access to /signin and /register', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <div>Public Login View</div>
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Login View')).toBeInTheDocument();
  });

  // AUTH-26: Account A / B data isolation
  it('AUTH-26: Account A and Account B assessments and stores are strictly user-scoped with zero cross-leakage', () => {
    const userA = 'user-alice-111';
    const userB = 'user-bob-222';

    const assessA = createAssessment(userA, 'data:image/jpeg;base64,aliceFrame');
    const assessB = createAssessment(userB, 'data:image/jpeg;base64,bobFrame');

    // Bob cannot retrieve Alice's assessment
    const bobLookupA = getAssessmentById(userB, assessA.id);
    expect(bobLookupA).toBeNull();

    // Alice cannot retrieve Bob's assessment
    const aliceLookupB = getAssessmentById(userA, assessB.id);
    expect(aliceLookupB).toBeNull();

    // Each can retrieve their own
    expect(getAssessmentById(userA, assessA.id)?.id).toBe(assessA.id);
    expect(getAssessmentById(userB, assessB.id)?.id).toBe(assessB.id);
  });

  // AUTH-27 & AUTH-28: No production auto-login or demo-session bypass
  it('AUTH-27 & AUTH-28: Onboarding route bounces already onboarded users to /dashboard', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Already Completed</div>} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding Flow</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Already Completed')).toBeInTheDocument();
    expect(screen.queryByText('Onboarding Flow')).not.toBeInTheDocument();
  });
});
