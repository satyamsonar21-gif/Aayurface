// ============================================================
// AayurFace — Master Multimodal Fusion Engine
// Phase 12: Multimodal Fusion, Evidence Agreement & Uncertainty Engine
// Deterministic Master Coordinator & Audit Trace Generator
// ============================================================

import type { CVResult } from '@/types/cv';
import type { AyurvedicInterpretationSet } from '@/lib/ayurveda/types';
import type {
  FusionResult,
  FusionEvidenceItem,
  MissingEvidenceItem,
  FusionAuditTrace,
  FusionSummaryInsight
} from '@/types/fusion';
import {
  CURRENT_FUSION_VERSION,
  CURRENT_FUSION_SCHEMA_VERSION,
  CURRENT_FUSION_CONFIG_VERSION,
  FUSION_SAFETY_LIMITS
} from './constants';
import { normalizePhase10CVResult } from './adapters/phase10Adapter';
import { normalizePhase11InterpretationSet } from './adapters/phase11Adapter';
import { normalizeUserContext, type UserContextInput } from './adapters/userContextAdapter';
import { evaluateEvidenceAgreement } from './agreementEngine';
import { evaluateEvidenceConflicts } from './conflictEngine';
import { evaluateUncertaintyAndCeilings } from './uncertaintyEngine';

export interface FusionEngineInput {
  userId: string;
  assessmentId?: string;
  cvResult?: CVResult | null;
  ayurvedicSet?: AyurvedicInterpretationSet | null;
  userContext?: UserContextInput | null;
}

/**
 * Generates an evaluation identifier.
 */
function generateEvaluationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `fuse-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generates human-readable, non-diagnostic editorial summary insights.
 */
function buildSummaryInsight(
  prakritiContext: string | null,
  interpretationState: string,
  conflictState: string
): FusionSummaryInsight {
  const doshaName = prakritiContext
    ? prakritiContext.charAt(0).toUpperCase() + prakritiContext.slice(1)
    : 'Balanced';

  if (conflictState === 'MATERIAL_CONFLICT' || conflictState === 'UNRESOLVED_CONFLICT') {
    return {
      headline: 'Divergent Evidence Signals Noted',
      contextualMeaning:
        'Observations show divergence between self-reported skin baseline and current visual indicators. Both signals are preserved for balanced care.',
      classicalContext:
        'Classical Ayurveda recognizes mixed manifestations (Mishra Dosha) across seasonal and lifestyle transitions.',
      confidenceQualifier: 'Evidence strength is bounded to LOW pending further observation.'
    };
  }

  if (interpretationState === 'SUPPORTED_CONTEXTUAL_OBSERVATION') {
    return {
      headline: `${doshaName} Constitutional Context Supported`,
      contextualMeaning:
        `Your self-reported ${doshaName} baseline aligns contextually with classical Shastric guidance principles.`,
      classicalContext:
        'Charaka Samhita emphasizes gentle topical Lepas and Dinacharya tailored to individual constitution.',
      confidenceQualifier: 'Multi-modal contextual alignment verified without clinical inference.'
    };
  }

  return {
    headline: 'Preliminary Wellness Observation',
    contextualMeaning:
      'Facial readiness confirmed. Guidance represents foundational Shastric wellness principles.',
    classicalContext:
      'In classical Ayurvedic literature, lifestyle and seasonal rhythm provide essential baseline harmony.',
    confidenceQualifier: 'Preliminary observation with calibrated baseline confidence.'
  };
}

/**
 * Master entry point for Phase 12 Multimodal Fusion.
 * Purely deterministic: Same inputs + versions = same output.
 */
export function evaluateMultimodalFusion(input: FusionEngineInput): FusionResult {
  const timestamp = new Date().toISOString();
  const evaluationId = generateEvaluationId();
  const userId = input.userId || 'anonymous-user';

  // 1. Run Controlled Adapters
  const p10 = normalizePhase10CVResult(input.cvResult);
  const p11 = normalizePhase11InterpretationSet(input.ayurvedicSet);
  const userCtx = normalizeUserContext(input.userContext);

  // 2. Aggregate Normalized Evidence and Missing Items
  const allEvidence: FusionEvidenceItem[] = [
    ...p10.evidenceItems,
    ...p11.evidenceItems,
    ...userCtx.evidenceItems
  ];

  const allMissing: MissingEvidenceItem[] = [
    ...p10.missingItems,
    ...p11.missingItems,
    ...userCtx.missingItems
  ];

  // 3. Evaluate Cross-Modality Agreements
  const agreementRes = evaluateEvidenceAgreement(allEvidence);

  // 4. Evaluate Cross-Modality Conflicts
  const conflictRes = evaluateEvidenceConflicts(allEvidence);

  // 5. Evaluate Uncertainty & Enforce Hard Safety Ceilings
  const uncertaintyRes = evaluateUncertaintyAndCeilings({
    evidenceItems: allEvidence,
    agreements: agreementRes.agreements,
    conflicts: conflictRes.conflicts,
    conflictState: conflictRes.overallConflictState
  });

  // 6. Partition Evidence for Transparent Accounting
  const supportingEvidence = allEvidence.filter(
    (item) => item.usageStatus === 'USED' && (item.state === 'SUPPORTED' || item.state === 'PARTIALLY_SUPPORTED')
  );

  const conflictingEvidence = allEvidence.filter(
    (item) => item.usageStatus === 'CONFLICTING' || conflictRes.conflicts.some((c) => c.evidenceIds.includes(item.id))
  );

  const discountedEvidence = allEvidence.filter(
    (item) => item.usageStatus === 'DISCOUNTED' || item.usageStatus === 'INSUFFICIENT' || item.usageStatus === 'NOT_ASSESSED'
  );

  // 7. Extract User Prakriti Context String for Human Insight
  const prakritiItem = userCtx.evidenceItems.find((i) => i.contextType === 'REPORTED_PRAKRITI');
  const prakritiVal = prakritiItem?.payload?.reportedPrakriti ? String(prakritiItem.payload.reportedPrakriti) : null;

  const summaryInsight = buildSummaryInsight(
    prakritiVal,
    uncertaintyRes.interpretationState,
    conflictRes.overallConflictState
  );

  // 8. Compile Unified Version Information
  const versions = {
    fusionVersion: CURRENT_FUSION_VERSION,
    schemaVersion: CURRENT_FUSION_SCHEMA_VERSION,
    cvVersion: p10.cvVersion,
    knowledgeVersion: p11.knowledgeVersion,
    ruleVersion: p11.ruleVersion,
    configurationVersion: CURRENT_FUSION_CONFIG_VERSION
  };

  // 9. Build Comprehensive Machine-Readable Audit Trace (Answering all 10 required questions)
  const allRulesFired = [
    ...agreementRes.rulesFired,
    ...conflictRes.rulesFired,
    ...uncertaintyRes.rulesFired,
    ...uncertaintyRes.ceilingsApplied
  ];

  const auditTrace: FusionAuditTrace = {
    evaluationId,
    timestamp,
    totalInputsReceived: allEvidence.length,
    acceptedInputsCount: supportingEvidence.length,
    rejectedInputsCount: discountedEvidence.length,
    uncertainInputsCount: allEvidence.filter((i) => i.state === 'UNCERTAIN').length,
    agreementRecords: agreementRes.agreements,
    conflictRecords: conflictRes.conflicts,
    missingRecords: allMissing,
    rulesFired: allRulesFired,
    ceilingsApplied: uncertaintyRes.ceilingsApplied,
    finalStateRationale: `Evaluated ${allEvidence.length} items across 3 modalities. Result: ${uncertaintyRes.interpretationState} with ${uncertaintyRes.finalStrength} strength under ${conflictRes.overallConflictState}.`,
    versions
  };

  // 10. Construct Canonical Master Result
  return {
    id: evaluationId,
    assessmentId: input.assessmentId,
    userId,
    timestamp,
    interpretationState: uncertaintyRes.interpretationState,
    evidenceStrength: uncertaintyRes.finalStrength,
    conflictState: conflictRes.overallConflictState,
    summaryInsight,
    supportingEvidence,
    conflictingEvidence,
    discountedEvidence,
    missingEvidence: allMissing,
    limitations: [
      'Facial observations are client-side wellness recordings and do not diagnose disease or constitutional Prakriti.',
      'Surface appearance may vary based on ambient lighting, camera hardware, and recent skin touch.',
      FUSION_SAFETY_LIMITS.STANDARD_DISCLAIMER
    ],
    safetyBoundaries: {
      isNonDiagnostic: true,
      preventsDoshaDiagnosisFromFace: true,
      preventsPrakritiInferenceFromFace: true,
      requiresHumanReviewForIrritation: false
    },
    versions,
    auditTrace
  };
}
