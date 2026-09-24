// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Evidence Eligibility Gate
// Deterministic Pre-Check — No Recommendation Without Structured Evidence
// ============================================================

import type { FusionResult, EvidenceStrength, ConflictState } from '@/types/fusion';
import type { UserPreferences, EvidenceEligibilityGate } from '@/types/personalization';
import { PERSONALIZATION_SAFETY_LIMITS } from './constants';

// ------------------------------------------------------------
// 1. INPUT CONTRACT
// ------------------------------------------------------------

export interface EligibilityGateInput {
  /** Upstream fusion result from Phase 12 (null/undefined = missing) */
  fusionResult?: FusionResult | null;
  /** User-reported dosha (from questionnaire, NOT inferred from face) */
  userDosha?: string | null;
  /** User-reported skin type */
  userSkinType?: string | null;
  /** User preferences & exclusions */
  userPreferences?: Partial<UserPreferences> | null;
}

// ------------------------------------------------------------
// 2. INTERNAL EVIDENCE STRENGTH ORDERING
// Ordinal ranking used for threshold comparisons.
// ------------------------------------------------------------

const EVIDENCE_STRENGTH_ORDER: Record<EvidenceStrength, number> = {
  NONE: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
} as const;

// ------------------------------------------------------------
// 3. INTERNAL CONFLICT SEVERITY ORDERING
// Higher numbers = more severe / blocking.
// ------------------------------------------------------------

const CONFLICT_STATE_ORDER: Record<ConflictState, number> = {
  NO_CONFLICT: 0,
  MINOR_CONFLICT: 1,
  MATERIAL_CONFLICT: 2,
  UNRESOLVED_CONFLICT: 3,
} as const;

// ------------------------------------------------------------
// 4. MAIN ELIGIBILITY EVALUATOR
// Pure function — overloaded to accept either an EligibilityGateInput object
// or individual arguments for flexible caller ergonomics.
// ------------------------------------------------------------

export function evaluateEvidenceEligibility(
  inputOrFusionResult: EligibilityGateInput | FusionResult | null | undefined,
  userDosha?: string | null,
  userSkinType?: string | null,
  userPreferences?: Partial<UserPreferences> | null,
): EvidenceEligibilityGate {
  let normalizedInput: EligibilityGateInput;

  if (
    inputOrFusionResult &&
    typeof inputOrFusionResult === 'object' &&
    ('fusionResult' in inputOrFusionResult ||
      'userDosha' in inputOrFusionResult ||
      'userSkinType' in inputOrFusionResult)
  ) {
    normalizedInput = inputOrFusionResult as EligibilityGateInput;
  } else {
    normalizedInput = {
      fusionResult: (inputOrFusionResult as FusionResult) ?? null,
      userDosha: userDosha ?? null,
      userSkinType: userSkinType ?? null,
      userPreferences: userPreferences ?? null,
    };
  }

  const { fusionResult, userDosha: dosha, userSkinType: skinType } = normalizedInput;

  // ---- Shared context flags ----
  const fusionResultPresent = fusionResult != null;
  const userContextPresent =
    (dosha != null && dosha.trim().length > 0) ||
    (skinType != null && skinType.trim().length > 0);

  const minimumEvidenceStrength =
    PERSONALIZATION_SAFETY_LIMITS.MINIMUM_EVIDENCE_STRENGTH_FOR_RECOMMENDATION;
  const maximumAllowedConflictState =
    PERSONALIZATION_SAFETY_LIMITS.MAXIMUM_ALLOWED_CONFLICT_STATE;

  // ---- Shared base for all return paths ----
  const base = {
    minimumEvidenceStrength,
    maximumAllowedConflictState,
    fusionResultPresent,
    userContextPresent,
  } as const;

  // ---- Gate 1: Missing upstream fusion result ----
  if (!fusionResultPresent) {
    return {
      ...base,
      eligibilityStatus: 'MISSING_UPSTREAM',
      eligibilityReason: 'No fusion result available',
    };
  }

  // At this point fusionResult is guaranteed non-null.
  const evidenceStrength: EvidenceStrength = fusionResult.evidenceStrength;
  const conflictState: ConflictState = fusionResult.conflictState;

  // ---- Gate 2: Evidence strength is NONE ----
  if (evidenceStrength === 'NONE') {
    return {
      ...base,
      eligibilityStatus: 'INSUFFICIENT_STRENGTH',
      eligibilityReason:
        'Upstream evidence strength is NONE — no evidence available to ground recommendations.',
    };
  }

  // ---- Gate 3: Conflict state exceeds allowed ceiling ----
  const conflictSeverity = CONFLICT_STATE_ORDER[conflictState];
  const maxAllowedSeverity = CONFLICT_STATE_ORDER[maximumAllowedConflictState];

  if (conflictSeverity > maxAllowedSeverity) {
    return {
      ...base,
      eligibilityStatus: 'CONFLICTING_EVIDENCE',
      eligibilityReason:
        `Upstream conflict state "${conflictState}" exceeds maximum allowed "${maximumAllowedConflictState}". ` +
        'Recommendations cannot be safely generated until conflicts are resolved.',
    };
  }

  // ---- Gate 4: Evidence strength below minimum threshold ----
  const actualStrength = EVIDENCE_STRENGTH_ORDER[evidenceStrength];
  const requiredStrength = EVIDENCE_STRENGTH_ORDER[minimumEvidenceStrength];

  if (actualStrength < requiredStrength) {
    return {
      ...base,
      eligibilityStatus: 'INSUFFICIENT_STRENGTH',
      eligibilityReason:
        `Upstream evidence strength "${evidenceStrength}" is below the minimum required "${minimumEvidenceStrength}".`,
    };
  }

  // ---- All gates passed ----
  return {
    ...base,
    eligibilityStatus: 'ELIGIBLE',
    eligibilityReason:
      `Evidence eligibility confirmed: strength="${evidenceStrength}", ` +
      `conflictState="${conflictState}", userContext=${userContextPresent ? 'present' : 'absent'}.`,
  };
}
