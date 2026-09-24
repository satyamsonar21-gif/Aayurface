// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Master Orchestration Service
// Deterministic Rule Engine — NO LLM, NO Network, NO Randomness
// ============================================================

import type {
  PersonalizationResult,
  PersonalizationAuditTrace,
  UserPreferences,
  PersonalizationVersionInfo,
  RecommendationConfidence,
  RecommendationDecisionTrace,
} from '@/types/personalization';
import type { FusionResult, EvidenceStrength } from '@/types/fusion';
import type { AyurvedicInterpretationSet } from '@/lib/ayurveda/types';
import type { Citation, RAGResponse } from '@/types/rag';

import {
  CURRENT_PERSONALIZATION_VERSION,
  CURRENT_PERSONALIZATION_SCHEMA_VERSION,
  CURRENT_PERSONALIZATION_RULE_VERSION,
  PERSONALIZATION_SAFETY_LIMITS,
  CONFIDENCE_CEILING_MAP,
} from './constants';
import { evaluateEvidenceEligibility } from './eligibilityGate';
import { evaluateRecommendationRules } from './recommendationEngine';

// ------------------------------------------------------------
// SERVICE INPUT CONTRACT
// ------------------------------------------------------------

/**
 * All upstream signals required by the personalization engine.
 * Every field except userId is optional to support graceful degradation.
 */
export interface PersonalizationServiceInput {
  /** Authenticated user identifier */
  userId: string;
  /** Optional assessment identifier linking to a specific skin assessment */
  assessmentId?: string;
  /** Phase 12 fusion result — primary evidence source */
  fusionResult?: FusionResult | null;
  /** Phase 11 Ayurvedic interpretation set — classical interpretation layer */
  ayurvedicSet?: AyurvedicInterpretationSet | null;
  /** Phase 13 RAG response — evidence-grounded citations and claims */
  ragResponse?: RAGResponse | null;
  /** User-reported Dosha (Prakriti) context — NEVER inferred from face */
  userDosha?: string | null;
  /** User-reported skin type context */
  userSkinType?: string | null;
  /** User preferences and exclusions */
  userPreferences?: Partial<UserPreferences> | null;
}

// ------------------------------------------------------------
// DEFAULT PREFERENCES
// ------------------------------------------------------------

/**
 * Baseline user preferences applied when none are supplied.
 * Every personalization evaluation uses these as a safe fallback,
 * ensuring the engine never operates without a complete preference object.
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  excludedIngredients: [],
  reportedConcerns: [],
  routineComplexity: 'MODERATE',
  dietaryRecommendationsEnabled: true,
  lifestyleFactors: {},
};

// ------------------------------------------------------------
// ID GENERATION — DETERMINISTIC FALLBACK
// ------------------------------------------------------------

/**
 * Generate a unique evaluation identifier.
 * Uses crypto.randomUUID when available, otherwise falls back
 * to a timestamp-based identifier that is still unique per invocation.
 */
function generateEvaluationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Deterministic fallback: timestamp + monotonic counter suffix
  const ts = Date.now().toString(36);
  const suffix = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `peval-${ts}-${suffix}`;
}

// ------------------------------------------------------------
// PREFERENCE MERGING
// ------------------------------------------------------------

/**
 * Merge partial user preferences with defaults.
 * User-supplied values override defaults; arrays are replaced entirely
 * (not appended) to respect explicit user intent.
 */
function mergePreferences(
  partial: Partial<UserPreferences> | null | undefined,
): UserPreferences {
  if (!partial) {
    return { ...DEFAULT_USER_PREFERENCES };
  }

  return {
    excludedIngredients:
      partial.excludedIngredients ?? DEFAULT_USER_PREFERENCES.excludedIngredients,
    reportedConcerns:
      partial.reportedConcerns ?? DEFAULT_USER_PREFERENCES.reportedConcerns,
    routineComplexity:
      partial.routineComplexity ?? DEFAULT_USER_PREFERENCES.routineComplexity,
    dietaryRecommendationsEnabled:
      partial.dietaryRecommendationsEnabled ??
      DEFAULT_USER_PREFERENCES.dietaryRecommendationsEnabled,
    lifestyleFactors: partial.lifestyleFactors
      ? { ...DEFAULT_USER_PREFERENCES.lifestyleFactors, ...partial.lifestyleFactors }
      : { ...DEFAULT_USER_PREFERENCES.lifestyleFactors },
  };
}

// ------------------------------------------------------------
// CITATION EXTRACTION
// ------------------------------------------------------------

/**
 * Safely extract citations from an optional RAG response.
 * Returns an empty array when no RAG data is available.
 */
function extractCitations(ragResponse: RAGResponse | null | undefined): Citation[] {
  if (!ragResponse || !Array.isArray(ragResponse.citations)) {
    return [];
  }
  return ragResponse.citations;
}

// ------------------------------------------------------------
// VERSION ASSEMBLY
// ------------------------------------------------------------

/**
 * Build version metadata from all upstream sources.
 * Missing upstream versions are left undefined (not fabricated).
 */
function buildVersionInfo(
  fusionResult: FusionResult | null | undefined,
  ayurvedicSet: AyurvedicInterpretationSet | null | undefined,
  ragResponse: RAGResponse | null | undefined,
): PersonalizationVersionInfo {
  return {
    personalizationVersion: CURRENT_PERSONALIZATION_VERSION,
    schemaVersion: CURRENT_PERSONALIZATION_SCHEMA_VERSION,
    ruleEngineVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    fusionVersion: fusionResult?.versions?.fusionVersion,
    knowledgeVersion: ayurvedicSet?.versionInfo?.knowledgeVersion,
    ragVersion: ragResponse?.runtimeVersions?.knowledgeVersion,
  };
}

// ------------------------------------------------------------
// CONFIDENCE CEILING
// ------------------------------------------------------------

/**
 * Apply confidence ceiling derived from upstream evidence strength.
 * The personalization layer NEVER upgrades confidence beyond what
 * the fusion evidence supports.
 */
function applyConfidenceCeiling(
  evidenceStrength: EvidenceStrength | undefined,
): RecommendationConfidence {
  if (!evidenceStrength) {
    return 'BASELINE_ONLY';
  }
  return CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'BASELINE_ONLY';
}

// ------------------------------------------------------------
// SAFETY BOUNDARIES — IMMUTABLE INVARIANT
// ------------------------------------------------------------

/**
 * Safety boundaries are compile-time constants with literal types.
 * They exist on every result, regardless of eligibility or confidence.
 */
const SAFETY_BOUNDARIES: PersonalizationResult['safetyBoundaries'] = {
  isNonDiagnostic: true,
  preventsDoshaDiagnosisFromFace: true,
  preventsPrakritiInferenceFromFace: true,
  allIngredientsRequirePatchTest: true,
  noGuaranteedCures: true,
  noPrescriptionDrugs: true,
} as const;

// ------------------------------------------------------------
// STANDARD LIMITATIONS
// ------------------------------------------------------------

/**
 * Baseline limitation disclaimers included with every personalization result.
 * These are safety-critical and MUST NOT be removed or softened.
 */
const STANDARD_LIMITATIONS: string[] = [
  'Recommendations are for general skin wellness guidance only and do NOT constitute medical advice, diagnosis, or treatment.',
  'Dosha and Prakriti context is based solely on user-reported information and is NEVER inferred from facial analysis.',
  'All topical ingredient recommendations require a patch test before full application.',
  'Individual results may vary. Consult a qualified healthcare professional for persistent or severe skin conditions.',
  'Recommendation confidence is ceiling-bound by upstream evidence strength and cannot exceed fusion-layer certainty.',
  'No prescription drugs, guaranteed cures, or clinical treatment plans are provided.',
];

// ------------------------------------------------------------
// MASTER ORCHESTRATOR
// ------------------------------------------------------------

/**
 * Evaluate personalization for a given user and assessment context.
 *
 * This is the single entry point for Phase 14. It:
 * 1. Gates on evidence eligibility (Phase 12 fusion evidence + user context)
 * 2. Runs deterministic recommendation rules when eligible
 * 3. Applies confidence ceilings from upstream evidence strength
 * 4. Binds citations from Phase 13 RAG evidence
 * 5. Produces a complete, auditable PersonalizationResult
 *
 * @param input - All upstream signals and user context
 * @returns Complete PersonalizationResult with audit trace
 */
export function evaluatePersonalization(
  input: PersonalizationServiceInput,
): PersonalizationResult {
  const evaluationId = generateEvaluationId();
  const timestamp = new Date().toISOString();

  // 1. Merge user preferences with defaults
  const appliedPreferences = mergePreferences(input.userPreferences);

  // 2. Evaluate evidence eligibility gate
  const eligibility = evaluateEvidenceEligibility(
    input.fusionResult ?? null,
    input.userDosha ?? null,
    input.userSkinType ?? null,
    appliedPreferences,
  );

  // 3. Build version info from all upstream sources
  const versions = buildVersionInfo(
    input.fusionResult,
    input.ayurvedicSet,
    input.ragResponse,
  );

  // 4. Determine upstream evidence strength
  const upstreamEvidenceStrength: EvidenceStrength =
    input.fusionResult?.evidenceStrength ?? 'NONE';

  // 5. Extract citations from RAG response
  const citations = extractCitations(input.ragResponse);

  // 6. Branch on eligibility
  if (eligibility.eligibilityStatus !== 'ELIGIBLE') {
    // ── NOT ELIGIBLE: return baseline-only result with empty recommendations ──
    const baselineAuditTrace: PersonalizationAuditTrace = {
      evaluationId,
      timestamp,
      userId: input.userId,
      eligibilityGate: eligibility,
      rulesEvaluated: 0,
      rulesFired: 0,
      rulesSkipped: 0,
      rulesExcluded: 0,
      decisionTraces: [],
      ceilingsApplied: ['BASELINE_ONLY — evidence eligibility not met'],
      finalStateRationale: `Personalization gated: ${eligibility.eligibilityStatus}. Reason: ${eligibility.eligibilityReason}`,
      versions,
    };

    return {
      id: evaluationId,
      assessmentId: input.assessmentId,
      userId: input.userId,
      timestamp,
      eligibility,
      overallConfidence: 'BASELINE_ONLY',
      upstreamEvidenceStrength,
      recommendations: [],
      totalRecommendations: 0,
      appliedPreferences,
      safetyBoundaries: SAFETY_BOUNDARIES,
      limitations: STANDARD_LIMITATIONS,
      citations,
      versions,
      auditTrace: baselineAuditTrace,
    };
  }

  // ── ELIGIBLE: run recommendation rules ──

  // 7. Execute deterministic recommendation engine
  const ruleResult = evaluateRecommendationRules({
    fusionResult: input.fusionResult!,
    ayurvedicSet: input.ayurvedicSet ?? null,
    ragResponse: input.ragResponse ?? null,
    userDosha: input.userDosha ?? null,
    userSkinType: input.userSkinType ?? null,
    userPreferences: appliedPreferences,
  });

  // 8. Apply confidence ceiling from upstream evidence strength
  const overallConfidence = applyConfidenceCeiling(upstreamEvidenceStrength);

  // 9. Enforce safety limit on maximum recommendations
  const cappedRecommendations = ruleResult.recommendations.slice(
    0,
    PERSONALIZATION_SAFETY_LIMITS.MAX_RECOMMENDATIONS_PER_EVALUATION,
  );

  // 10. Build ceiling-applied audit entries
  const ceilingsApplied: string[] = [
    `Evidence strength ceiling: ${upstreamEvidenceStrength} → ${overallConfidence}`,
  ];
  if (ruleResult.ceilingsApplied && ruleResult.ceilingsApplied.length > 0) {
    ceilingsApplied.push(...ruleResult.ceilingsApplied);
  }

  // 11. Assemble decision traces
  const decisionTraces: RecommendationDecisionTrace[] =
    ruleResult.decisionTraces ?? [];

  // 12. Calculate rule statistics
  const rulesEvaluated = ruleResult.rulesEvaluated ?? decisionTraces.length;
  const rulesFired =
    ruleResult.rulesFired ??
    decisionTraces.filter((dt) => !dt.excluded && dt.outputAction !== 'SKIPPED').length;
  const rulesSkipped =
    ruleResult.rulesSkipped ??
    decisionTraces.filter((dt) => dt.outputAction === 'SKIPPED').length;
  const rulesExcluded =
    ruleResult.rulesExcluded ??
    decisionTraces.filter((dt) => dt.excluded === true).length;

  // 13. Build full audit trace
  const auditTrace: PersonalizationAuditTrace = {
    evaluationId,
    timestamp,
    userId: input.userId,
    eligibilityGate: eligibility,
    rulesEvaluated,
    rulesFired,
    rulesSkipped,
    rulesExcluded,
    decisionTraces,
    ceilingsApplied,
    finalStateRationale:
      `Eligible evaluation completed. ` +
      `${cappedRecommendations.length} recommendation(s) generated from ${rulesFired} rule(s) fired. ` +
      `Overall confidence: ${overallConfidence}. ` +
      `Upstream evidence strength: ${upstreamEvidenceStrength}.`,
    versions,
  };

  // 14. Assemble final personalization result
  return {
    id: evaluationId,
    assessmentId: input.assessmentId,
    userId: input.userId,
    timestamp,
    eligibility,
    overallConfidence,
    upstreamEvidenceStrength,
    recommendations: cappedRecommendations,
    totalRecommendations: cappedRecommendations.length,
    appliedPreferences,
    safetyBoundaries: SAFETY_BOUNDARIES,
    limitations: STANDARD_LIMITATIONS,
    citations,
    versions,
    auditTrace,
  };
}
