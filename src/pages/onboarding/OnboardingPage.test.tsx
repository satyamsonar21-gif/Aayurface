import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPage from './OnboardingPage';
import * as AuthModule from '@/contexts/AuthContext';
import type { User, AuthContextType } from '@/types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockIncompleteUser: User = {
  id: 'user-onboard-test',
  email: 'arjun.test@aayurface.local',
  full_name: 'Arjun Varma',
  avatar_url: null,
  skin_type: null,
  dosha: null,
  onboarding_completed: false,
  created_at: '2026-03-01T00:00:00.000Z',
  updated_at: '2026-03-01T00:00:00.000Z',
};

function setupAuth(overrides: Partial<AuthContextType> = {}) {
  const mockCompleteOnboarding = vi.fn().mockResolvedValue(undefined);
  const authState: AuthContextType = {
    user: mockIncompleteUser,
    isLoading: false,
    isAuthenticated: true,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
    completeOnboarding: mockCompleteOnboarding,
    ...overrides,
  };

  vi.mocked(AuthModule.useAuth).mockReturnValue(authState);
  return { mockCompleteOnboarding, authState };
}

describe('OnboardingPage Suite (Phase 08)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 (Welcome) with user greeting and intake overview', () => {
    setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Namaste, Arjun Varma/i)).toBeInTheDocument();
    expect(screen.getByText(/Self-Reported Baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Begin Intake/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
  });

  it('navigates from Step 1 through Step 2 (Identity) and reflects read-only verified email', async () => {
    setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Click Begin Intake
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));

    expect(await screen.findByText(/Personal Identity & Profile/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Arjun Varma')).toBeInTheDocument();
    expect(screen.getByDisplayValue('arjun.test@aayurface.local')).toBeDisabled();
    expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
  });

  it('allows editing full name and advances to Step 3 (Skin Baseline)', async () => {
    setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));

    const nameInput = await screen.findByDisplayValue('Arjun Varma');
    fireEvent.change(nameInput, { target: { value: 'Arjun Dev Varma' } });

    // Click Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3
    expect(await screen.findByText(/Skin Baseline & Observations/i)).toBeInTheDocument();
    expect(screen.getByText(/Truthful disclosure: This is your self-reported baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 3 of 6/i)).toBeInTheDocument();
  });

  it('allows selecting skin type and concerns and advances to Step 4 (Lifestyle)', async () => {
    setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Step 1 -> 2
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));
    // Step 2 -> 3
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    // In Step 3, select Sensitive skin
    const sensitiveBtn = await screen.findByRole('radio', { name: /Sensitive/i });
    fireEvent.click(sensitiveBtn);

    // Toggle a concern
    const concernBtn = screen.getByRole('button', { name: /Sensitivity & Redness/i });
    fireEvent.click(concernBtn);

    // Continue to Step 4
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4
    expect(await screen.findByText(/Daily Wellness & Lifestyle Factors/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Sleep Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 4 of 6/i)).toBeInTheDocument();
  });

  it('navigates through Step 4 to Step 5 (Privacy & Consent) and validates required checkboxes', async () => {
    setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Step 1 -> 2 -> 3 -> 4
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    // Step 4 -> 5
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    // Step 5: Privacy, Data Sovereignty & Consent
    expect(await screen.findByText(/Privacy, Data Sovereignty & Consent/i)).toBeInTheDocument();
    expect(screen.getByText(/Camera Processing & Facial Observables/i)).toBeInTheDocument();
    expect(screen.getByText(/Classical Educational Terms & Disclaimer/i)).toBeInTheDocument();
    expect(screen.getByText(/Anonymous Botanical Research Opt-In/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 5 of 6/i)).toBeInTheDocument();

    const reviewBtn = screen.getByRole('button', { name: /Review & Confirm/i });
    expect(reviewBtn).not.toBeDisabled();

    // If user unchecks camera consent, button becomes disabled
    const cameraCheckbox = screen.getByLabelText(/Camera Processing/i, { selector: 'input' });
    fireEvent.click(cameraCheckbox);
    expect(reviewBtn).toBeDisabled();

    // Re-check camera consent
    fireEvent.click(cameraCheckbox);
    expect(reviewBtn).not.toBeDisabled();
  });

  it('completes full flow through Step 6 (Review) and triggers atomic submission to /dashboard', async () => {
    const { mockCompleteOnboarding } = setupAuth();

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));

    // Step 2 -> Step 3
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    // Step 3: Select normal skin
    const normalOption = await screen.findByRole('radio', { name: /Normal/i });
    fireEvent.click(normalOption);
    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4 -> Step 5
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

    // Step 5 -> Step 6 (Review)
    fireEvent.click(await screen.findByRole('button', { name: /Review & Confirm/i }));

    // Step 6: Verify summary details
    expect(await screen.findByText(/Review & Complete Intake/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus not established/i)).toBeInTheDocument();
    expect(screen.getByText(/normal \(Self-Reported\)/i)).toBeInTheDocument();

    // Final Complete Setup button
    const submitBtn = screen.getByRole('button', { name: /Complete Setup & Enter/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);
    });

    expect(mockCompleteOnboarding).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Arjun Varma',
        skinType: 'normal',
        dosha: null, // Dosha is unestablished
        wellnessFactors: expect.objectContaining({
          sleepHours: '6-8 hrs',
          hydrationLevel: '1.5-2.5 L',
        }),
        consents: expect.arrayContaining([
          expect.objectContaining({ consent_type: 'camera_processing', granted: true }),
          expect.objectContaining({ consent_type: 'terms_and_privacy', granted: true }),
        ]),
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('displays clear error message when completeOnboarding fails', async () => {
    const mockCompleteOnboarding = vi.fn().mockRejectedValue(new Error('Network error writing profile'));
    setupAuth({ completeOnboarding: mockCompleteOnboarding });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Fast-forward to Step 6
    fireEvent.click(screen.getByRole('button', { name: /Begin Intake/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Review & Confirm/i }));

    // Submit
    const submitBtn = await screen.findByRole('button', { name: /Complete Setup & Enter/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Setup could not be saved: Network error writing profile/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard', expect.anything());
  });
});
