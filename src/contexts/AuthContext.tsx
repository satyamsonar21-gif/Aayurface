// ============================================================
// Aayurface — Real Supabase Authentication Provider (Phase 07)
// Connected to Supabase Auth (GoTrue) & PostgreSQL RLS
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { User, AuthContextType, SkinType, Dosha, CompleteOnboardingData } from '@/types';
import { supabase } from '@/lib/supabase';
import { recordUserConsents } from '@/lib/onboardingService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Isolated test fixture for test suites (e.g. guards.test.tsx).
 * NEVER injected into localStorage or the live authentication workflow.
 */
export const TEST_FIXTURE_USER: User = {
  id: 'user-namrata-sen',
  email: 'namrata.sen@example.com',
  full_name: 'Namrata Sen',
  avatar_url: null,
  skin_type: 'combination',
  dosha: 'vata',
  onboarding_completed: true,
  created_at: '2026-01-15T00:00:00.000Z',
  updated_at: '2026-01-15T00:00:00.000Z',
};

// Preserved for test backward-compatibility
export const DEMO_USER = TEST_FIXTURE_USER;

/**
 * Resolves an authenticated Supabase user into the domain User entity.
 * Checks the database profiles table if available, falling back to auth user metadata.
 */
async function resolveUserProfile(sbUser: SupabaseAuthUser): Promise<User> {
  const fallbackUser: User = {
    id: sbUser.id,
    email: sbUser.email || '',
    full_name: (sbUser.user_metadata?.full_name as string) || (sbUser.user_metadata?.name as string) || '',
    avatar_url: (sbUser.user_metadata?.avatar_url as string) || null,
    skin_type: (sbUser.user_metadata?.skin_type as SkinType) || null,
    dosha: (sbUser.user_metadata?.dosha as Dosha) || null,
    onboarding_completed: Boolean(sbUser.user_metadata?.onboarding_completed),
    created_at: sbUser.created_at,
    updated_at: sbUser.updated_at || sbUser.created_at,
  };

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .maybeSingle();

    if (!error && profile) {
      return {
        id: profile.id,
        email: sbUser.email || '',
        full_name: profile.full_name || fallbackUser.full_name,
        avatar_url: profile.avatar_url || fallbackUser.avatar_url,
        skin_type: profile.skin_type || fallbackUser.skin_type,
        dosha: profile.dosha || fallbackUser.dosha,
        onboarding_completed: Boolean(profile.onboarding_completed),
        created_at: profile.created_at || fallbackUser.created_at,
        updated_at: profile.updated_at || fallbackUser.updated_at,
      };
    }
  } catch (err) {
    console.warn('[AuthContext] Could not fetch profile from table, using auth metadata:', err);
  }

  return fallbackUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // AUTH_INITIALIZING: true until Supabase verifies session
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Session Hydration from Supabase
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('[AuthContext] Error retrieving session:', error.message);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        const resolved = await resolveUserProfile(session.user);
        if (isMounted) {
          setUser(resolved);
          setIsLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('[AuthContext] Session hydration exception:', err);
        setUser(null);
        setIsLoading(false);
      }
    });

    // 2. Realtime Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const resolved = await resolveUserProfile(session.user);
        if (isMounted) {
          setUser(resolved);
          setIsLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.session?.user) {
      const resolved = await resolveUserProfile(data.session.user);
      setUser(resolved);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.session?.user) {
      const resolved = await resolveUserProfile(data.session.user);
      setUser(resolved);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    if (error) {
      console.error('[AuthContext] Error signing out:', error.message);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    if (error) {
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;

    // 1. Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data,
    });
    if (authError) {
      throw authError;
    }

    // 2. Update profiles table if available (omit email which is authoritative in auth.users)
    try {
      const { email: _email, id: _id, created_at: _created, ...profileUpdate } = data;
      if (Object.keys(profileUpdate).length > 0) {
        await supabase.from('profiles').update(profileUpdate).eq('id', user.id);
      }
    } catch (err) {
      console.warn('[AuthContext] Could not update profiles table:', err);
    }

    // 3. Update local state
    setUser((prev) => (prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null));
  }, [user]);

  const completeOnboarding = useCallback(async (data: CompleteOnboardingData) => {
    if (!user) {
      throw new Error('Cannot complete onboarding: No authenticated session found');
    }

    const { fullName, skinType, dosha = null, wellnessFactors, consents } = data;

    const profileData: Partial<User> = {
      full_name: fullName !== undefined ? fullName.trim() : user.full_name,
      skin_type: skinType,
      dosha: dosha,
      onboarding_completed: true,
    };

    // 1. Update Supabase Auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        ...profileData,
        wellness_factors: wellnessFactors || null,
      },
    });

    if (authError) {
      console.error('[AuthContext] Error updating auth metadata during onboarding:', authError);
      throw authError;
    }

    // 2. Persist to public.profiles table
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          skin_type: profileData.skin_type,
          dosha: profileData.dosha,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (dbError) {
        console.warn('[AuthContext] Could not update profiles table during onboarding:', dbError.message);
      }
    } catch (dbErr) {
      console.warn('[AuthContext] Exception updating profiles table during onboarding:', dbErr);
    }

    // 3. Persist server-authoritative consents to user_consents table
    if (consents && consents.length > 0) {
      await recordUserConsents(user.id, consents);
    }

    // 4. Update domain state immediately so route guards immediately recognize onboarding completion
    setUser((prev) => (prev ? { ...prev, ...profileData, updated_at: new Date().toISOString() } : null));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
