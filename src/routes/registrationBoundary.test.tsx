// ============================================================
// AayurFace — Registration / Onboarding Boundary Test Suite
// Full Automated Regression Coverage for REG-01 through REG-25
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import * as AuthModule from '@/contexts/AuthContext';
import type { User, AuthContextType } from '@/types';
import { createAssessment } from '@/lib/assessmentStore';
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
  full_name: '',
  avatar_url: null,
  skin_type: null,
  dosha: null,
  onboarding_completed: false,
  created_at: '2026-02-01T00:00:00Z',
  updated_at: '2026-02-01T00:00:00Z',
};

describe('Registration / Onboarding Boundary Contract (REG-01 to REG-25)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // REG-01: Unauthenticated user visits /register -> register page renders
  it('REG-01: Unauthenticated user visits /register and page renders with account creation header', () => {
    mockAuth({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Create your AayurFace account/i })).toBeInTheDocument();
    expect(screen.getByText(/Your personalized wellness journey begins after account creation/i)).toBeInTheDocument();
  });

  // REG-02: Register page contains email/password/confirm password
  it('REG-02: Register page contains email, password, and confirm password fields', () => {
    mockAuth({ user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('#register-email')).toBeInTheDocument();
    expect(container.querySelector('#register-password')).toBeInTheDocument();
    expect(container.querySelector('#register-confirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  // REG-03: Register page does NOT contain Full Name
  it('REG-03: Register page does NOT contain a Full Name input field', () => {
    mockAuth({ user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('#register-fullName')).toBeNull();
    expect(screen.queryByLabelText(/Full Name/i)).toBeNull();
  });

  // REG-04: Register page does NOT contain onboarding questions
  it('REG-04: Register page does NOT contain any skin/lifestyle/consent onboarding questions', () => {
    mockAuth({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Skin Baseline/i)).toBeNull();
    expect(screen.queryByText(/Lifestyle/i)).toBeNull();
    expect(screen.queryByText(/Dosha/i)).toBeNull();
    expect(screen.queryByText(/Consent/i)).toBeNull();
    expect(screen.queryByText(/Camera Access/i)).toBeNull();
    expect(screen.queryByText(/Begin your journey/i)).toBeNull();
  });

  // REG-05: Password mismatch blocks submission
  it('REG-05: Password mismatch blocks submission with descriptive error', async () => {
    const mockSignUp = vi.fn();
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#register-email')!, { target: { value: 'user@example.com' } });
    fireEvent.change(container.querySelector('#register-password')!, { target: { value: 'SecretPassword123!' } });
    fireEvent.change(container.querySelector('#register-confirmPassword')!, { target: { value: 'DifferentPassword123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  // REG-06: Invalid email blocks submission
  it('REG-06: Invalid email blocks submission with validation message', async () => {
    const mockSignUp = vi.fn();
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInput = container.querySelector('#register-email')!;
    const passInput = container.querySelector('#register-password')!;
    const confirmInput = container.querySelector('#register-confirmPassword')!;

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.change(passInput, { target: { value: 'SecretPassword123!' } });
    fireEvent.change(confirmInput, { target: { value: 'SecretPassword123!' } });

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  // REG-07: Valid registration calls Supabase signUp
  it('REG-07: Valid registration calls signUp with email and password', async () => {
    const mockSignUp = vi.fn().mockResolvedValue(mockIncompleteUser);
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<div>Onboarding</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#register-email')!, { target: { value: 'valid@example.com' } });
    fireEvent.change(container.querySelector('#register-password')!, { target: { value: 'StrongPass123!' } });
    fireEvent.change(container.querySelector('#register-confirmPassword')!, { target: { value: 'StrongPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('valid@example.com', 'StrongPass123!');
    });
  });

  // REG-08: Successful new registration routes to /onboarding
  it('REG-08: Successful new registration routes deterministically to /onboarding', async () => {
    const mockSignUp = vi.fn().mockResolvedValue(mockIncompleteUser);
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<div>Six-Step Onboarding Destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#register-email')!, { target: { value: 'seeker@example.com' } });
    fireEvent.change(container.querySelector('#register-password')!, { target: { value: 'Sattva2026!' } });
    fireEvent.change(container.querySelector('#register-confirmPassword')!, { target: { value: 'Sattva2026!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText('Six-Step Onboarding Destination')).toBeInTheDocument();
  });

  // REG-09: Successful registration does NOT route to /dashboard
  it('REG-09: Successful registration does NOT route to /dashboard', async () => {
    const mockSignUp = vi.fn().mockResolvedValue(mockIncompleteUser);
    mockAuth({ signUp: mockSignUp, user: null, isAuthenticated: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<div>Expected Onboarding</div>} />
          <Route path="/dashboard" element={<div>Forbidden Direct Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('#register-email')!, { target: { value: 'seeker2@example.com' } });
    fireEvent.change(container.querySelector('#register-password')!, { target: { value: 'Sattva2026!' } });
    fireEvent.change(container.querySelector('#register-confirmPassword')!, { target: { value: 'Sattva2026!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText('Expected Onboarding')).toBeInTheDocument();
    expect(screen.queryByText('Forbidden Direct Dashboard')).toBeNull();
  });

  // REG-10: Google OAuth initiation is available
  it('REG-10: Google OAuth initiation button triggers signInWithGoogle', async () => {
    const mockGoogle = vi.fn().mockResolvedValue(undefined);
    mockAuth({ signInWithGoogle: mockGoogle, user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<div>Onboarding</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockGoogle).toHaveBeenCalled();
    });
  });

  // REG-11: Authenticated incomplete user cannot access /dashboard
  it('REG-11: Authenticated incomplete user attempting /dashboard is bounced to /onboarding', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/onboarding" element={<div>Onboarding Gating Active</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Gating Active')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard View')).toBeNull();
  });

  // REG-12: Authenticated incomplete user can access /onboarding
  it('REG-12: Authenticated incomplete user can access /onboarding', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding Screen Accessible</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Onboarding Screen Accessible')).toBeInTheDocument();
  });

  // REG-13: Authenticated complete user can access /dashboard
  it('REG-13: Authenticated complete user can access /dashboard', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Authenticated Dashboard Screen</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Authenticated Dashboard Screen')).toBeInTheDocument();
  });

  // REG-14: Authenticated complete user visiting /register is redirected to dashboard
  it('REG-14: Authenticated complete user visiting /register is redirected to /dashboard', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Home</div>} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Home')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Create your AayurFace account/i })).toBeNull();
  });

  // REG-15: Authenticated incomplete user visiting /register is redirected to /onboarding
  it('REG-15: Authenticated incomplete user visiting /register is redirected to /onboarding', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/onboarding" element={<div>Continue Onboarding Intake</div>} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Continue Onboarding Intake')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Create your AayurFace account/i })).toBeNull();
  });

  // REG-16: Unauthenticated user visiting /onboarding is redirected to /signin
  it('REG-16: Unauthenticated user visiting /onboarding is redirected to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Onboarding Content')).toBeNull();
  });

  // REG-17: Authenticated incomplete user visiting / remains on /
  it('REG-17: Authenticated incomplete user visiting / remains on /', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<div>Onboarding</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Ancient Wisdom/i)[0]).toBeInTheDocument();
    expect(screen.queryByText('Onboarding')).toBeNull();
  });

  // REG-18: Authenticated complete user visiting / remains on /
  it('REG-18: Authenticated complete user visiting / remains on /', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Ancient Wisdom/i)[0]).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });

  // REG-19: Landing CTA for incomplete user points to onboarding
  it('REG-19: Landing CTA for authenticated incomplete user says Continue Onboarding and links to /onboarding', () => {
    mockAuth({ user: mockIncompleteUser, isAuthenticated: true, isLoading: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    const links = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.textContent?.includes('Continue Onboarding')
    );
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toBe('/onboarding');
  });

  // REG-20: Landing CTA for complete user points to dashboard
  it('REG-20: Landing CTA for authenticated complete user says Enter Dashboard and links to /dashboard', () => {
    mockAuth({ user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    const links = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.textContent?.includes('Enter Dashboard')
    );
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toBe('/dashboard');
  });

  // REG-21: Logout remains functional
  it('REG-21: Sign Out clears auth session and triggers signOut method', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined);
    mockAuth({ signOut: mockSignOut, user: mockCompleteUser, isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  // REG-22: After logout, /dashboard requires authentication
  it('REG-22: After logout (unauthenticated), access to /dashboard is blocked and redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
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

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });

  // REG-23: After logout, /scan requires authentication
  it('REG-23: After logout (unauthenticated), access to /scan is blocked and redirects to /signin', () => {
    mockAuth({ user: null, isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/scan']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Screen</div>} />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <div>Scan Camera Interface</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    expect(screen.queryByText('Scan Camera Interface')).toBeNull();
  });

  // REG-24 & REG-25: Scan never creates authentication and blocks anonymous assessment creation
  it('REG-24 & REG-25: Assessment creation strictly throws on anonymous or missing user id', () => {
    expect(() => {
      createAssessment('', 'data:image/jpeg;base64,test');
    }).toThrow(/Cannot create assessment without a valid authenticated user ID/i);

    expect(() => {
      createAssessment('anonymous-user', 'data:image/jpeg;base64,test');
    }).toThrow(/Cannot create assessment without a valid authenticated user ID/i);
  });
});
