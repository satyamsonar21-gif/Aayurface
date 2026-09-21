// ============================================================
// AayurFace — Server-Authoritative Consent & Onboarding Service
// Handles server-side consent persistence, version tracking, and
// onboarding profile initialization via Supabase PostgreSQL.
// ============================================================

import { supabase } from '@/lib/supabase';
import type { UserConsent, ConsentItemInput } from '@/types';
import { SKIN_TYPE_OPTIONS } from '@/types';

export { SKIN_TYPE_OPTIONS };

export const CURRENT_CONSENT_VERSIONS = {
  camera_processing: '2026.1',
  terms_and_privacy: '2026.1',
  wellness_research: '2026.1',
} as const;

/**
 * Persists user consents into the public.user_consents table.
 * Uses atomic upsert on (user_id, consent_type) unique constraint.
 */
export async function recordUserConsents(
  userId: string,
  consents: ConsentItemInput[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!userId || consents.length === 0) {
    return { success: true, count: 0 };
  }

  const now = new Date().toISOString();
  const rows = consents.map((c) => ({
    user_id: userId,
    consent_type: c.consent_type,
    consent_version: c.consent_version,
    granted: c.granted,
    granted_at: now,
    revoked_at: c.granted ? null : now,
    updated_at: now,
  }));

  try {
    const { error } = await supabase
      .from('user_consents')
      .upsert(rows, { onConflict: 'user_id,consent_type' });

    if (error) {
      console.warn('[OnboardingService] Could not persist to user_consents table:', error.message);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: rows.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[OnboardingService] Unexpected exception writing user_consents:', message);
    return { success: false, count: 0, error: message };
  }
}

/**
 * Retrieves the recorded consents for a given user from the database.
 */
export async function getUserConsents(userId: string): Promise<UserConsent[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn('[OnboardingService] Error fetching user_consents:', error.message);
      return [];
    }

    return (data as UserConsent[]) || [];
  } catch (err) {
    console.warn('[OnboardingService] Exception retrieving user_consents:', err);
    return [];
  }
}

/**
 * Updates a single consent grant or revocation.
 */
export async function updateSingleConsent(
  userId: string,
  consentType: string,
  granted: boolean,
  version: string = '2026.1'
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    const { error } = await supabase
      .from('user_consents')
      .upsert(
        {
          user_id: userId,
          consent_type: consentType,
          consent_version: version,
          granted,
          granted_at: granted ? now : undefined,
          revoked_at: granted ? null : now,
          updated_at: now,
        },
        { onConflict: 'user_id,consent_type' }
      );

    if (error) {
      console.warn('[OnboardingService] Failed to update consent:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[OnboardingService] Exception updating single consent:', err);
    return false;
  }
}
