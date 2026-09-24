// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Core Domain Models, Contracts & Type Definitions
// Strict Non-Diagnostic, Evidence-Grounded, Deterministic Architecture
// ============================================================

import type { EvidenceStrength, ConflictState, Modality } from '@/types/fusion';
import type { ProvenanceType } from '@/lib/ayurveda/types';
import type { Citation } from '@/types/rag';

// ------------------------------------------------------------
// 1. EVIDENCE ELIGIBILITY & GATING
// ------------------------------------------------------------

export type EvidenceEligibilityStatus =
  | 'ELIGIBLE'
  | 'INSUFFICIENT_STRENGTH'
  | 'CONFLICTING_EVIDENCE'
  | 'MISSING_UPSTREAM'
  | 'SAFETY_BLOCKED'
  | 'USER_EXCLUDED';

export interface EvidenceEligibilityGate {
  /** Minimum fusion evidence strength required to generate recommendations */
  minimumEvidenceStrength: EvidenceStrength;
  /** Maximum conflict state allowed */
  maximumAllowedConflictState: ConflictState;
  /** Whether upstream fusion result is present */
  fusionResultPresent: boolean;
  /** Whether user context (skin type / dosha) is present */
  userContextPresent: boolean;
  /** Final eligibility determination */
  eligibilityStatus: EvidenceEligibilityStatus;
  /** Human-readable reason */
  eligibilityReason: string;
}

// ------------------------------------------------------------
// 2. RECOMMENDATION TAXONOMY
// ------------------------------------------------------------

export type RecommendationCategory =
  | 'TOPICAL_BOTANICAL'
  | 'DIETARY_LIFESTYLE'
  | 'DINACHARYA_ROUTINE'
  | 'SEASONAL_ADJUSTMENT'
  | 'HYDRATION_GUIDANCE'
  | 'STRESS_MANAGEMENT'
  | 'SLEEP_HYGIENE';

export type RecommendationPriority = 'PRIMARY' | 'SECONDARY' | 'SUPPLEMENTARY';

export type RecommendationConfidence =
  | 'HIGH_CONFIDENCE'
  | 'MODERATE_CONFIDENCE'
  | 'LOW_CONFIDENCE'
  | 'BASELINE_ONLY';

export type IngredientSafetyLevel =
  | 'TOPICAL_SAFE'
  | 'CAUTION_REQUIRED'
  | 'PATCH_TEST_MANDATORY'
  | 'CONTRAINDICATED';

// ------------------------------------------------------------
// 3. INGREDIENT & FORMULATION MODELS
// ------------------------------------------------------------

export interface RecommendedIngredient {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'HERB' | 'OIL' | 'MINERAL' | 'FOOD' | 'PREPARATION';
  safetyLevel: IngredientSafetyLevel;
  knownAllergens: string[];
  contraindications: string[];
  patchTestRequired: boolean;
  provenanceType: ProvenanceType;
  sourceReference?: string;
}

export interface RecommendedFormulation {
  id: string;
  name: string;
  ingredients: RecommendedIngredient[];
  preparationSteps: string[];
  applicationSteps: string[];
  frequency: string;
  durationGuidance: string;
  safetyWarnings: string[];
  patchTestRequired: boolean;
}

// ------------------------------------------------------------
// 4. RECOMMENDATION ITEM CONTRACT
// ------------------------------------------------------------

export interface RecommendationRationale {
  /** IDs of fusion evidence items that justify this recommendation */
  supportingEvidenceIds: string[];
  /** IDs of RAG-grounded citations backing this recommendation */
  citationIds: string[];
  /** Upstream modalities that contributed */
  contributingModalities: Modality[];
  /** Human-readable explanation of why this was recommended */
  explanation: string;
  /** Classical Ayurvedic principle invoked */
  ayurvedicPrinciple?: string;
}

export interface RecommendationItem {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  confidence: RecommendationConfidence;
  title: string;
  description: string;
  /** Detailed guidance text */
  guidanceText: string;
  /** Sanskrit name if applicable */
  sanskritName?: string;
  /** Structured rationale with evidence chain */
  rationale: RecommendationRationale;
  /** Formulation details for topical botanicals */
  formulation?: RecommendedFormulation;
  /** Safety metadata */
  safety: {
    patchTestRequired: boolean;
    contraindications: string[];
    warnings: string[];
    pregnancyCaution: boolean;
    professionalConsultationRecommended: boolean;
  };
  /** Rule that generated this recommendation */
  ruleId: string;
  /** Rule version */
  ruleVersion: string;
}

// ------------------------------------------------------------
// 5. USER PREFERENCES & EXCLUSIONS
// ------------------------------------------------------------

export interface UserPreferences {
  /** Ingredients the user wants to exclude */
  excludedIngredients: string[];
  /** Skin concerns the user reported */
  reportedConcerns: string[];
  /** Routine complexity preference */
  routineComplexity: 'MINIMAL' | 'MODERATE' | 'COMPREHENSIVE';
  /** Whether user opted in to dietary recommendations */
  dietaryRecommendationsEnabled: boolean;
  /** User's reported lifestyle factors */
  lifestyleFactors: {
    sleepHours?: string;
    hydrationLevel?: string;
    stressLevel?: string;
    climate?: string;
  };
}

// ------------------------------------------------------------
// 6. DECISION TRACE & AUDIT
// ------------------------------------------------------------

export interface RecommendationDecisionTrace {
  ruleId: string;
  ruleName: string;
  inputSignals: string[];
  matchedConditions: string[];
  outputAction: string;
  confidenceAssignment: RecommendationConfidence;
  priorityAssignment: RecommendationPriority;
  ceilingApplied?: string;
  excluded?: boolean;
  exclusionReason?: string;
}

export interface PersonalizationAuditTrace {
  evaluationId: string;
  timestamp: string;
  userId: string;
  /** Evidence eligibility gate result */
  eligibilityGate: EvidenceEligibilityGate;
  /** Total rules evaluated */
  rulesEvaluated: number;
  /** Rules that fired (produced recommendations) */
  rulesFired: number;
  /** Rules skipped due to insufficient evidence */
  rulesSkipped: number;
  /** Rules blocked by user exclusions */
  rulesExcluded: number;
  /** Decision trace for each evaluated rule */
  decisionTraces: RecommendationDecisionTrace[];
  /** Confidence ceilings applied */
  ceilingsApplied: string[];
  /** Final state rationale */
  finalStateRationale: string;
  /** Versions */
  versions: PersonalizationVersionInfo;
}

// ------------------------------------------------------------
// 7. VERSION METADATA
// ------------------------------------------------------------

export interface PersonalizationVersionInfo {
  personalizationVersion: string;
  schemaVersion: string;
  ruleEngineVersion: string;
  knowledgeVersion?: string;
  fusionVersion?: string;
  ragVersion?: string;
}

// ------------------------------------------------------------
// 8. MASTER PERSONALIZATION RESULT
// ------------------------------------------------------------

export interface PersonalizationResult {
  id: string;
  assessmentId?: string;
  userId: string;
  timestamp: string;
  /** Evidence eligibility gate */
  eligibility: EvidenceEligibilityGate;
  /** Overall recommendation confidence */
  overallConfidence: RecommendationConfidence;
  /** Upstream evidence strength (passed through from fusion) */
  upstreamEvidenceStrength: EvidenceStrength;
  /** Recommendations organized by category */
  recommendations: RecommendationItem[];
  /** Total recommendation count */
  totalRecommendations: number;
  /** User preferences that were applied */
  appliedPreferences: UserPreferences;
  /** Safety boundaries */
  safetyBoundaries: {
    isNonDiagnostic: true;
    preventsDoshaDiagnosisFromFace: true;
    preventsPrakritiInferenceFromFace: true;
    allIngredientsRequirePatchTest: true;
    noGuaranteedCures: true;
    noPrescriptionDrugs: true;
  };
  /** Limitations */
  limitations: string[];
  /** Citations from Phase 13 RAG */
  citations: Citation[];
  /** Version info */
  versions: PersonalizationVersionInfo;
  /** Complete audit trace */
  auditTrace: PersonalizationAuditTrace;
}
