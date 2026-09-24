// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Constants, Safety Limits & Confidence Ceiling Map
// Deterministic, Non-Diagnostic, Evidence-Grounded
// ============================================================

import type { EvidenceStrength } from '@/types/fusion';
import type { RecommendationConfidence } from '@/types/personalization';

// ------------------------------------------------------------
// 1. VERSION CONSTANTS
// ------------------------------------------------------------

/** Current version of the personalization engine */
export const CURRENT_PERSONALIZATION_VERSION = 'personalization-v1.0.0';

/** Current schema version for serialization compatibility */
export const CURRENT_PERSONALIZATION_SCHEMA_VERSION = 'personalization-schema-v1.0.0';

/** Current deterministic rule engine version */
export const CURRENT_PERSONALIZATION_RULE_VERSION = 'personalization-rule-v1.0.0';

// ------------------------------------------------------------
// 2. SAFETY LIMITS
// Enforced as hard boundaries — never bypassed at runtime.
// ------------------------------------------------------------

export const PERSONALIZATION_SAFETY_LIMITS = {
  /**
   * Maximum number of recommendation items a single evaluation
   * may produce. Beyond this cap, lower-priority items are dropped.
   */
  MAX_RECOMMENDATIONS_PER_EVALUATION: 8,

  /**
   * The weakest EvidenceStrength from Phase 12 fusion that is
   * still eligible for generating any recommendation.
   * If upstream evidence is below this threshold the gate
   * returns INSUFFICIENT_STRENGTH.
   */
  MINIMUM_EVIDENCE_STRENGTH_FOR_RECOMMENDATION: 'LOW' as const satisfies EvidenceStrength,

  /**
   * The highest ConflictState that still permits recommendation
   * generation. MATERIAL_CONFLICT and UNRESOLVED_CONFLICT are
   * blocked to prevent contradictory guidance.
   */
  MAXIMUM_ALLOWED_CONFLICT_STATE: 'MINOR_CONFLICT' as const,

  /** Every topical ingredient must carry a patch-test warning */
  PATCH_TEST_MANDATORY_FOR_ALL_TOPICALS: true,

  /** Prescription / Rx drugs are never recommended */
  NO_PRESCRIPTION_DRUGS: true,

  /** No outcome guarantee language is permitted */
  NO_GUARANTEED_CURES: true,

  /** Face imagery must never be used to infer dosha or prakriti */
  FACE_DIAGNOSIS_FORBIDDEN: true,

  /** Standard disclaimer attached to every personalization result */
  STANDARD_DISCLAIMER:
    'Personalized recommendations are educational wellness suggestions grounded in classical Ayurvedic texts. They do not constitute medical advice, clinical diagnosis, or prescription treatment.',
} as const;

// ------------------------------------------------------------
// 3. CONFIDENCE CEILING MAP
// Maps upstream EvidenceStrength (Phase 12) to the maximum
// RecommendationConfidence allowed in Phase 14.
// This guarantees that downstream confidence never exceeds
// what the evidence actually supports.
// ------------------------------------------------------------

export const CONFIDENCE_CEILING_MAP: Record<EvidenceStrength, RecommendationConfidence> = {
  NONE: 'BASELINE_ONLY',
  LOW: 'LOW_CONFIDENCE',
  MODERATE: 'MODERATE_CONFIDENCE',
  HIGH: 'HIGH_CONFIDENCE',
} as const;
