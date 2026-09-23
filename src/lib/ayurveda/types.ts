/**
 * AayurFace - Phase 11: Ayurvedic Intelligence Foundation
 * Core Domain Models and Type Definitions
 *
 * STRICT SAFETY BOUNDARY:
 * - These models DO NOT represent clinical diagnoses.
 * - These models PREVENT direct observation-to-dosha collapse.
 * - All knowledge must carry explicit provenance.
 */

export type ProvenanceType =
  | 'CLASSICAL_SOURCE'
  | 'RESEARCH_SOURCE'
  | 'PROJECT_RESEARCH'
  | 'EXPERT_INPUT'
  | 'USER_REPORTED'
  | 'SYSTEM_DERIVED'
  | 'UNVERIFIED';

export type EvidenceStatus =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'UNCERTAIN'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_APPLICABLE';

export type ObservationState =
  | 'OBSERVED'
  | 'NOT_OBSERVED'
  | 'UNCERTAIN'
  | 'NOT_ASSESSED'
  | 'UNAVAILABLE';

export type AyurvedicConceptType =
  | 'DOSHA'
  | 'PRAKRITI'
  | 'GUNA'
  | 'RASA'
  | 'VIRYA'
  | 'VIPAKA'
  | 'DRAVYA'
  | 'PREPARATION'
  | 'LIFESTYLE_FACTOR'
  | 'ENVIRONMENTAL_CONTEXT';

export interface VersionInfo {
  knowledgeVersion: string;
  ruleVersion: string;
  schemaVersion: string;
}

export interface SourceReference {
  text: string;
  author?: string;
  chapter?: string;
  verse?: string;
  link?: string;
}

export interface KnowledgeItem {
  id: string;
  conceptType: AyurvedicConceptType;
  content: string;
  source: string;
  sourceReference?: SourceReference;
  provenanceType: ProvenanceType;
  evidenceStatus: EvidenceStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyMetadata {
  isTopicalSafe: boolean;
  isInternalSafe: boolean;
  patchTestRecommended: boolean;
  knownSensitivities: string[];
  contraindications: string[];
  pregnancyCaution: boolean | 'UNKNOWN';
  allergyCaution: boolean | 'UNKNOWN';
  escalationRequired: boolean;
  professionalConsultationRecommended: boolean;
}

// ---------------------------------------------------------
// OBSERVATION TAXONOMY
// ---------------------------------------------------------

export type VisualObservationType =
  | 'REDNESS_LIKE_APPEARANCE'
  | 'DRYNESS_LIKE_APPEARANCE'
  | 'SHINE_LIKE_APPEARANCE'
  | 'TEXTURE_IRREGULARITY'
  | 'PIGMENTATION_LIKE_VARIATION'
  | 'VISUAL_UNIFORMITY'
  | 'OBSERVATION_UNCERTAIN';

export interface VisualObservation {
  id: string;
  type: VisualObservationType;
  state: ObservationState;
  confidence: EvidenceStatus; // Confidence of the observation, NOT a probability %
  timestamp: string;
  source: ProvenanceType;
}

export interface VisualObservationSet {
  observations: VisualObservation[];
  captureId?: string; // Links back to Phase 10 CVResult
}

// ---------------------------------------------------------
// CONTEXT TAXONOMY
// ---------------------------------------------------------

export interface PrakritiContext {
  value: 'VATA' | 'PITTA' | 'KAPHA' | 'VATA_PITTA' | 'PITTA_KAPHA' | 'VATA_KAPHA' | 'TRIDOSHA' | 'UNKNOWN';
  source: ProvenanceType;
  status: 'REPORTED' | 'INFERRED' | 'UNAVAILABLE';
}

export interface LifestyleContext {
  factor: 'SLEEP_PATTERN' | 'HYDRATION' | 'STRESS' | 'ENVIRONMENT' | 'ROUTINE';
  value: string;
  source: ProvenanceType;
  timestamp: string;
}

export interface AyurvedicContext {
  userId: string;
  prakriti: PrakritiContext;
  lifestyle: LifestyleContext[];
}

// ---------------------------------------------------------
// INTERPRETATION TAXONOMY
// ---------------------------------------------------------

export interface Rationale {
  observedIds: string[];
  contextIds: string[];
  ayurvedicConceptIds: string[]; // Links to KnowledgeItems
  description: string;
}

export interface Interpretation {
  id: string;
  rationale: Rationale;
  evidence: EvidenceStatus;
  limitations: string;
  safetyBoundaries: SafetyMetadata | null;
  ruleVersion: string;
}

export interface AyurvedicInterpretationSet {
  interpretationId: string;
  userId: string;
  timestamp: string;
  interpretations: Interpretation[];
  overallEvidenceState: EvidenceStatus;
  versionInfo: VersionInfo;
}
