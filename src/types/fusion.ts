// ============================================================
// AayurFace — Multimodal Fusion Domain Models & Contracts
// Phase 12: Multimodal Fusion, Evidence Agreement, Uncertainty & Confidence Engine
// Strict Non-Diagnostic, Evidence-Grounded, Deterministic Architecture
// ============================================================

import type { ProvenanceType } from '@/lib/ayurveda/types';

// ------------------------------------------------------------
// 1. MODALITIES & CORE TAXONOMY
// ------------------------------------------------------------

export type Modality = 'VISUAL' | 'USER_CONTEXT' | 'AYURVEDIC_CONTEXT';

export type SupportedVisualObservationType =
  | 'REDNESS_LIKE_APPEARANCE'
  | 'DRYNESS_LIKE_APPEARANCE'
  | 'SHINE_LIKE_APPEARANCE'
  | 'TEXTURE_IRREGULARITY'
  | 'PIGMENTATION_LIKE_VARIATION'
  | 'VISUAL_UNIFORMITY'
  | 'FACE_GEOMETRY_METRICS'
  | 'OBSERVATION_UNCERTAIN';

export type SupportedContextType =
  | 'REPORTED_PRAKRITI'
  | 'USER_REPORTED_DOSHA_CONTEXT'
  | 'LIFESTYLE_CONTEXT'
  | 'ASSESSMENT_CONTEXT'
  | 'REPORTED_SKIN_TYPE';

export type FusionEvidenceState =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'CONFLICTING'
  | 'INSUFFICIENT_EVIDENCE'
  | 'UNCERTAIN'
  | 'NOT_ASSESSED'
  | 'UNAVAILABLE';

/**
 * Qualitative, calibrated evidence strength.
 * NOT a statistical probability or fake percentage.
 *
 * - NONE: Evidence is absent, unassessed, or rejected.
 * - LOW: Single weak, preliminary, or uncorroborated signal.
 * - MODERATE: Multiple coherent, relevant signals across modalities without material conflict.
 * - HIGH: Robust, independently verified congruence across multiple distinct modalities
 *         with zero unresolved conflict and high-quality upstream capture.
 */
export type EvidenceStrength = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';

export type ConflictState =
  | 'NO_CONFLICT'
  | 'MINOR_CONFLICT'
  | 'MATERIAL_CONFLICT'
  | 'UNRESOLVED_CONFLICT';

export type MissingEvidenceReason =
  | 'NOT_CAPTURED'
  | 'NOT_AVAILABLE'
  | 'NOT_ASSESSED'
  | 'INSUFFICIENT_QUALITY'
  | 'USER_DID_NOT_PROVIDE'
  | 'UPSTREAM_UNAVAILABLE';

export type EvidenceUsageStatus =
  | 'USED'
  | 'DISCOUNTED'
  | 'CONFLICTING'
  | 'INSUFFICIENT'
  | 'UNAVAILABLE'
  | 'NOT_ASSESSED'
  | 'NOT_APPLICABLE';

// ------------------------------------------------------------
// 2. PROVENANCE & VERSION METADATA
// ------------------------------------------------------------

export type EvidenceLineageSource =
  | 'PRIMARY_VISUAL'
  | 'PRIMARY_USER'
  | 'DERIVED_FROM_USER_CONTEXT'
  | 'STATIC_KNOWLEDGE';

export interface EvidenceProvenance {
  source: string;
  sourceType: ProvenanceType;
  sourceVersion: string;
  timestamp: string;
  origin: 'CLIENT' | 'GATEWAY' | 'KNOWLEDGE_BASE' | 'SYSTEM_DERIVED';
  inputReference?: string;
  derivationRule?: string;
  lineageSource?: EvidenceLineageSource;
}

export interface FusionVersionInfo {
  fusionVersion: string;
  schemaVersion: string;
  cvVersion?: string;
  knowledgeVersion?: string;
  ruleVersion?: string;
  configurationVersion?: string;
}

// ------------------------------------------------------------
// 3. NORMALIZED EVIDENCE CONTRACT
// ------------------------------------------------------------

export interface FusionEvidenceItem {
  id: string;
  modality: Modality;
  observationType?: SupportedVisualObservationType;
  contextType?: SupportedContextType;
  rawConceptId?: string;
  state: FusionEvidenceState;
  strength: EvidenceStrength;
  usageStatus: EvidenceUsageStatus;
  statusReason: string;
  provenance: EvidenceProvenance;
  payload: Record<string, unknown>;
}

export interface MissingEvidenceItem {
  modality: Modality;
  expectedItem: string;
  reason: MissingEvidenceReason;
  impactOnFusion: string;
}

export interface EvidenceConflictDetail {
  id: string;
  severity: ConflictState;
  evidenceIds: string[];
  description: string;
  competingInterpretations: string[];
  resolutionRuleApplied: string;
  downgradeApplied: boolean;
}

export interface EvidenceAgreementDetail {
  id: string;
  agreementType: 'DIRECT_OBSERVATION' | 'CONTEXTUAL_SUPPORT' | 'DERIVED_INTERPRETATION';
  supportingEvidenceIds: string[];
  targetInterpretation: string;
  semanticRationale: string;
  strengthContribution: EvidenceStrength;
}

// ------------------------------------------------------------
// 4. AUDIT TRACE
// ------------------------------------------------------------

export interface FusionAuditTrace {
  evaluationId: string;
  timestamp: string;
  totalInputsReceived: number;
  acceptedInputsCount: number;
  rejectedInputsCount: number;
  uncertainInputsCount: number;
  agreementRecords: EvidenceAgreementDetail[];
  conflictRecords: EvidenceConflictDetail[];
  missingRecords: MissingEvidenceItem[];
  rulesFired: string[];
  ceilingsApplied: string[];
  finalStateRationale: string;
  versions: FusionVersionInfo;
}

// ------------------------------------------------------------
// 5. MASTER FUSION RESULT
// ------------------------------------------------------------

export type OverallInterpretationState =
  | 'SUPPORTED_CONTEXTUAL_OBSERVATION'
  | 'PARTIALLY_SUPPORTED_OBSERVATION'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTING_EVIDENCE'
  | 'UNCERTAIN_OBSERVATION'
  | 'UNAVAILABLE';

export interface FusionSummaryInsight {
  headline: string;
  contextualMeaning: string;
  classicalContext: string;
  confidenceQualifier: string;
}

export interface FusionResult {
  id: string;
  assessmentId?: string;
  userId: string;
  timestamp: string;
  interpretationState: OverallInterpretationState;
  evidenceStrength: EvidenceStrength;
  conflictState: ConflictState;
  summaryInsight: FusionSummaryInsight;
  supportingEvidence: FusionEvidenceItem[];
  conflictingEvidence: FusionEvidenceItem[];
  discountedEvidence: FusionEvidenceItem[];
  missingEvidence: MissingEvidenceItem[];
  limitations: string[];
  safetyBoundaries: {
    isNonDiagnostic: true;
    preventsDoshaDiagnosisFromFace: true;
    preventsPrakritiInferenceFromFace: true;
    requiresHumanReviewForIrritation: boolean;
  };
  versions: FusionVersionInfo;
  auditTrace: FusionAuditTrace;
}
