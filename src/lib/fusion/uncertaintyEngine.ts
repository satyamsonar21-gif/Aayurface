// ============================================================
// AayurFace — Uncertainty Propagation & Confidence Ceiling Engine
// Phase 12: Multimodal Fusion, Evidence Agreement & Uncertainty Engine
// Strict Monotonic Safety Ceilings — Zero Fake Statistical Probabilities
// ============================================================

import type {
  FusionEvidenceItem,
  EvidenceStrength,
  ConflictState,
  OverallInterpretationState,
  EvidenceAgreementDetail,
  EvidenceConflictDetail
} from '@/types/fusion';
import { FUSION_SAFETY_LIMITS } from './constants';

export interface UncertaintyEvaluationInput {
  evidenceItems: FusionEvidenceItem[];
  agreements: EvidenceAgreementDetail[];
  conflicts: EvidenceConflictDetail[];
  conflictState: ConflictState;
}

export interface UncertaintyEvaluationResult {
  interpretationState: OverallInterpretationState;
  finalStrength: EvidenceStrength;
  ceilingsApplied: string[];
  rulesFired: string[];
}

/**
 * Propagates uncertainty through the multimodal pipeline and enforces strict safety ceilings.
 * Guarantees that weak, conflicting, or absent evidence cannot produce high certainty.
 */
export function evaluateUncertaintyAndCeilings(
  input: UncertaintyEvaluationInput
): UncertaintyEvaluationResult {
  const { evidenceItems, agreements, conflictState } = input;
  const ceilingsApplied: string[] = [];
  const rulesFired: string[] = [];

  const usedItems = evidenceItems.filter((i) => i.usageStatus === 'USED');
  const visualItems = usedItems.filter((i) => i.modality === 'VISUAL');
  const contextItems = usedItems.filter((i) => i.modality === 'USER_CONTEXT');

  // 1. Base State Determination
  if (usedItems.length === 0) {
    return {
      interpretationState: 'INSUFFICIENT_EVIDENCE',
      finalStrength: 'NONE',
      ceilingsApplied: ['ceiling-no-usable-evidence'],
      rulesFired: ['rule-insufficient-evidence-empty-inputs']
    };
  }

  // 2. Conflict Dominance Check
  if (conflictState === 'UNRESOLVED_CONFLICT' || conflictState === 'MATERIAL_CONFLICT') {
    ceilingsApplied.push('ceiling-conflict-downgrade-to-low');
    rulesFired.push('rule-conflict-overrides-certainty');
    return {
      interpretationState: 'CONFLICTING_EVIDENCE',
      finalStrength: 'LOW',
      ceilingsApplied,
      rulesFired
    };
  }

  // 3. Upstream Uncertainty Propagation
  const hasUncertainInput = usedItems.some((i) => i.state === 'UNCERTAIN');
  if (hasUncertainInput) {
    ceilingsApplied.push('ceiling-uncertainty-propagation-max-low');
    rulesFired.push('rule-uncertainty-survives-pipeline');
    return {
      interpretationState: 'UNCERTAIN_OBSERVATION',
      finalStrength: 'LOW',
      ceilingsApplied,
      rulesFired
    };
  }

  // 4. Multi-Modality Corroboration & Lineage Independence Evaluation
  const distinctModalities = new Set(usedItems.map((i) => i.modality));

  // Determine independent primary lineages:
  // USER_CONTEXT and AYURVEDIC_CONTEXT derived solely from user context share the same 'LINEAGE_USER_CONTEXT'.
  const independentLineages = new Set<string>();
  for (const item of usedItems) {
    const lineage = item.provenance.lineageSource;
    if (lineage === 'PRIMARY_VISUAL') {
      independentLineages.add('LINEAGE_VISUAL');
    } else if (lineage === 'PRIMARY_USER' || lineage === 'DERIVED_FROM_USER_CONTEXT') {
      independentLineages.add('LINEAGE_USER_CONTEXT');
    } else if (lineage === 'STATIC_KNOWLEDGE') {
      independentLineages.add('LINEAGE_KNOWLEDGE');
    } else {
      independentLineages.add(`LINEAGE_${item.modality}`);
    }
  }

  const hasIndependentLineages = independentLineages.size >= 2;
  const hasCrossModalityAgreement = agreements.some(
    (a) => a.agreementType === 'CONTEXTUAL_SUPPORT' && a.supportingEvidenceIds.length >= 2
  );

  let candidateStrength: EvidenceStrength = 'LOW';
  let interpretationState: OverallInterpretationState = 'PARTIALLY_SUPPORTED_OBSERVATION';

  if (hasIndependentLineages && hasCrossModalityAgreement) {
    candidateStrength = 'MODERATE';
    interpretationState = 'SUPPORTED_CONTEXTUAL_OBSERVATION';
    rulesFired.push('rule-multi-modal-cross-agreement-moderate');
  } else if (usedItems.some((i) => i.state === 'SUPPORTED')) {
    candidateStrength = 'LOW';
    interpretationState = 'PARTIALLY_SUPPORTED_OBSERVATION';
    rulesFired.push('rule-single-supported-modality-low');
  } else {
    candidateStrength = 'LOW';
    interpretationState = 'PARTIALLY_SUPPORTED_OBSERVATION';
    rulesFired.push('rule-preliminary-observation-low');
  }

  // 5. Enforce Hard Safety Ceilings
  let finalStrength: EvidenceStrength = candidateStrength;

  // Ceiling A: When independent lineages < 2, cannot exceed LOW (enforces no circular corroboration)
  if (!hasIndependentLineages || distinctModalities.size < 2) {
    finalStrength = FUSION_SAFETY_LIMITS.MAX_SINGLE_MODALITY_STRENGTH;
    if (distinctModalities.size >= 2 && !hasIndependentLineages) {
      ceilingsApplied.push('ceiling-circular-context-lineage-capped-at-low');
    } else {
      ceilingsApplied.push('ceiling-single-modality-capped-at-low');
    }
  }

  // Ceiling B: Facial visual observation alone CANNOT establish constitutional certainty
  if (visualItems.length > 0 && contextItems.length === 0 && (finalStrength as string) === 'HIGH') {
    finalStrength = 'MODERATE';
    ceilingsApplied.push('ceiling-face-alone-cannot-diagnose-high');
  }

  // Ceiling C: Minor conflict caps strength at MODERATE
  if (conflictState === 'MINOR_CONFLICT' && (finalStrength as string) === 'HIGH') {
    finalStrength = 'MODERATE';
    ceilingsApplied.push('ceiling-minor-conflict-capped-at-moderate');
  }

  // Ceiling D: Reserve HIGH strictly for robust, complete tri-modal agreement with explicit skin observation
  // Since Phase 10 currently holds skin feature segmentation as unassessed (Phase 10 readiness only),
  // maximum achievable strength in this release is truthfully bounded to MODERATE.
  if ((finalStrength as string) === 'HIGH') {
    finalStrength = 'MODERATE';
    ceilingsApplied.push('ceiling-calibrated-release-max-moderate');
  }

  return {
    interpretationState,
    finalStrength,
    ceilingsApplied,
    rulesFired
  };
}
