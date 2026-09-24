// ============================================================
// AayurFace — Phase 13: Explainable AI (XAI) Contract Engine
// Answers the 7 Core Explainability Questions without Chain-of-Thought Leakage
// ============================================================

import type {
  XAIExplanationPayload,
  XAIObservedSignal,
  EvidenceItem,
  GeneratedClaim,
  Citation,
  KnowledgeRuntimeVersion
} from '@/types/rag';
import type { FusionResult } from '@/types/fusion';
import { createCitation } from './citationEngine';

export const CURRENT_RUNTIME_VERSIONS: KnowledgeRuntimeVersion = {
  knowledgeVersion: 'ayur-k-v1.0.0',
  sourceVersion: 'corpus-v1.0.0',
  chunkVersion: 'chunker-v1.0.0',
  embeddingModel: 'aayur-semantic-proj-v1',
  embeddingVersion: 'emb-v1.0.0',
  retrievalVersion: 'retrieval-v1.0.0',
  promptVersion: 'prompt-grounded-v1.0.0',
  modelVersion: 'gpt-4o-grounded-client',
  safetyPolicyVersion: 'aayur-safety-v1.0.0'
};

export interface XAIConstructionInput {
  analysisId: string;
  observedSignals: XAIObservedSignal[];
  userContext?: {
    skinType?: string;
    reportedPrakriti?: string;
    lifestyleFactors?: string[];
  };
  fusionResult?: Partial<FusionResult>;
  retrievedEvidence: EvidenceItem[];
  supportedClaims: GeneratedClaim[];
  sourceDisagreements?: string[];
  additionalLimitations?: string[];
}

/**
 * Builds the structured XAIExplanationPayload adhering to EXPLAINABILITY-CONTRACT.md.
 * Prohibits fake AI reasoning or hidden chain-of-thought exposure.
 */
export function buildXAIExplanation(input: XAIConstructionInput): XAIExplanationPayload {
  const {
    analysisId,
    observedSignals,
    userContext = {},
    fusionResult,
    retrievedEvidence,
    supportedClaims,
    sourceDisagreements = [],
    additionalLimitations = []
  } = input;

  const citations: Citation[] = retrievedEvidence.map(createCitation);

  // Standard scientific limitations
  const scientificLimitations = [
    'Consumer camera sensors introduce ambient lighting, color temperature, and resolution variance.',
    'Surface facial observations reflect transient epidermal conditions and cannot confirm internal biological states.',
    'Self-reported lifestyle and questionnaire responses are subject to personal perception and recall bias.',
    ...additionalLimitations
  ];

  // Mandatory negative medical boundaries
  const negativeMedicalBoundaries = [
    'This assessment is NOT a medical diagnosis and does not detect or classify dermatological diseases (such as acne vulgaris, rosacea, or dermatitis).',
    'Facial observations do NOT determine your birth constitution (Prakriti). Prakriti is constitutional and systemic, not derived from facial imagery.',
    'Visual qualities (e.g. redness-like hue or surface dryness) do NOT constitute a standalone Dosha diagnosis.',
    'Remedies and botanical guidance are gentle daily wellness suggestions and do NOT replace medical prescriptions or treatments.',
    'For persistent, painful, or worsening skin conditions, consult a board-certified dermatologist or qualified Ayurvedic Vaidya.'
  ];

  return {
    analysisId,
    timestamp: new Date().toISOString(),
    observedSignals,
    userContext,
    fusionSummary: {
      state: fusionResult?.interpretationState || 'SUPPORTED_CONTEXTUAL_OBSERVATION',
      evidenceStrength: fusionResult?.evidenceStrength || 'MODERATE',
      conflictState: fusionResult?.conflictState || 'NO_CONFLICT',
      harmonicAgreementQualifier: fusionResult?.conflictState === 'MATERIAL_CONFLICT'
        ? 'Signals across modalities exhibit material contradiction and have been discounted.'
        : 'Observational signals demonstrate contextual coherence without material conflict.'
    },
    retrievedEvidence,
    supportedClaims,
    sourceDisagreements,
    scientificLimitations,
    negativeMedicalBoundaries,
    citations,
    runtimeVersions: CURRENT_RUNTIME_VERSIONS
  };
}
