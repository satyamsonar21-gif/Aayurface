// ============================================================
// AayurFace — User Context Adapter for Multimodal Fusion
// Normalizes User Profile, Onboarding & Self-Reported Baseline Context
// Strict Boundary: Preserves Self-Reported Provenance (Non-Inferred)
// ============================================================

import type { UserProfile, SkinType, Dosha, WellnessFactors } from '@/types';
import type {
  FusionEvidenceItem,
  MissingEvidenceItem
} from '@/types/fusion';

export interface UserContextInput {
  userId: string;
  dosha?: Dosha | string | null;
  skinType?: SkinType | string | null;
  wellnessFactors?: WellnessFactors;
  userProfile?: Partial<UserProfile> | null;
}

export interface UserContextAdapterOutput {
  evidenceItems: FusionEvidenceItem[];
  missingItems: MissingEvidenceItem[];
}

export function normalizeUserContext(input: UserContextInput | null | undefined): UserContextAdapterOutput {
  const missingItems: MissingEvidenceItem[] = [];
  const evidenceItems: FusionEvidenceItem[] = [];

  const timestamp = new Date().toISOString();

  if (!input || !input.userId) {
    missingItems.push({
      modality: 'USER_CONTEXT',
      expectedItem: 'USER_PROFILE_CONTEXT',
      reason: 'USER_DID_NOT_PROVIDE',
      impactOnFusion: 'No authenticated user profile or constitutional baseline available.'
    });

    return { evidenceItems: [], missingItems };
  }

  // 1. User-Reported Prakriti / Dosha
  const reportedDosha = input.dosha || input.userProfile?.dosha;
  if (reportedDosha && typeof reportedDosha === 'string' && reportedDosha.trim() !== '') {
    const cleanDosha = reportedDosha.trim().toLowerCase();
    evidenceItems.push({
      id: `ev-ctx-prakriti-${input.userId}`,
      modality: 'USER_CONTEXT',
      contextType: 'REPORTED_PRAKRITI',
      state: 'SUPPORTED',
      strength: 'MODERATE',
      usageStatus: 'USED',
      statusReason: `User self-reported constitutional baseline: ${cleanDosha}.`,
      provenance: {
        source: 'user-profile-onboarding',
        sourceType: 'USER_REPORTED',
        sourceVersion: 'profile-v1',
        timestamp,
        origin: 'CLIENT',
        inputReference: input.userId,
        derivationRule: 'self-reported-profile-mapping',
        lineageSource: 'PRIMARY_USER'
      },
      payload: {
        reportedPrakriti: cleanDosha
      }
    });
  } else {
    missingItems.push({
      modality: 'USER_CONTEXT',
      expectedItem: 'REPORTED_PRAKRITI',
      reason: 'USER_DID_NOT_PROVIDE',
      impactOnFusion: 'Baseline Prakriti is unrecorded; fusion will evaluate observations without constitutional bias.'
    });
  }

  // 2. User-Reported Skin Type
  const reportedSkinType = input.skinType || input.userProfile?.skin_type;
  if (reportedSkinType && typeof reportedSkinType === 'string' && reportedSkinType.trim() !== '') {
    const cleanSkinType = reportedSkinType.trim().toLowerCase();
    evidenceItems.push({
      id: `ev-ctx-skintype-${input.userId}`,
      modality: 'USER_CONTEXT',
      contextType: 'REPORTED_SKIN_TYPE',
      state: 'SUPPORTED',
      strength: 'MODERATE',
      usageStatus: 'USED',
      statusReason: `User self-reported baseline skin type: ${cleanSkinType}.`,
      provenance: {
        source: 'user-profile-onboarding',
        sourceType: 'USER_REPORTED',
        sourceVersion: 'profile-v1',
        timestamp,
        origin: 'CLIENT',
        inputReference: input.userId,
        derivationRule: 'self-reported-skintype-mapping',
        lineageSource: 'PRIMARY_USER'
      },
      payload: {
        reportedSkinType: cleanSkinType
      }
    });
  } else {
    missingItems.push({
      modality: 'USER_CONTEXT',
      expectedItem: 'REPORTED_SKIN_TYPE',
      reason: 'USER_DID_NOT_PROVIDE',
      impactOnFusion: 'Baseline skin type is unrecorded.'
    });
  }

  // 3. User-Reported Lifestyle & Environmental Context
  const wellness = input.wellnessFactors;
  if (wellness) {
    if (wellness.sleepHours || wellness.hydrationLevel || wellness.stressLevel || wellness.climate) {
      evidenceItems.push({
        id: `ev-ctx-lifestyle-${input.userId}`,
        modality: 'USER_CONTEXT',
        contextType: 'LIFESTYLE_CONTEXT',
        state: 'SUPPORTED',
        strength: 'LOW',
        usageStatus: 'USED',
        statusReason: 'User reported daily lifestyle and environmental context.',
        provenance: {
          source: 'user-onboarding-factors',
          sourceType: 'USER_REPORTED',
          sourceVersion: 'wellness-factors-v1',
          timestamp,
          origin: 'CLIENT',
          inputReference: input.userId,
          derivationRule: 'lifestyle-context-mapping',
          lineageSource: 'PRIMARY_USER'
        },
        payload: {
          sleep: wellness.sleepHours,
          hydration: wellness.hydrationLevel,
          stress: wellness.stressLevel,
          climate: wellness.climate
        }
      });
    }
  }

  return {
    evidenceItems,
    missingItems
  };
}
