// ============================================================
// AayurFace — Phase 13-R.1: Unified RAG & Grounded Generation Service
// Orchestrates Retrieval, Citation Binding, Safety & XAI Tracing
// Supports Synchronous & Asynchronous Authoritative Knowledge Retrievers
// ============================================================

import type {
  RAGResponse,
  RAGAuditTrace,
  EvidenceItem,
  GeneratedClaim,
  RetrievalFilter,
  XAIExplanationPayload,
  ConsultationStatus,
  RetrievalBackendType
} from '@/types/rag';
import type { FusionResult } from '@/types/fusion';
import { sanitizeUserQuery } from './promptDefense';
import {
  retrieveKnowledge,
  chunkMatchToEvidence,
  CANDIDATE_SIMILARITY_THRESHOLD,
  MIN_GROUNDING_CHUNK_COUNT,
  getAuthoritativeRetriever
} from './retrievalEngine';
import type { KnowledgeRetriever } from './retrievalEngine';
import { bindCitationsToClaims } from './citationEngine';
import { validateClaims } from './claimValidator';
import { validateSafety } from './safetyFilter';
import { buildXAIExplanation, CURRENT_RUNTIME_VERSIONS } from './xaiEngine';
import { defaultVectorStore, VectorStore } from './vectorStore';

export interface RAGServiceRequest {
  requestId?: string;
  userId?: string;
  query: string;
  filter?: RetrievalFilter;
  userContext?: {
    skinType?: string;
    reportedPrakriti?: string;
    lifestyleFactors?: string[];
  };
  fusionResult?: Partial<FusionResult>;
  store?: VectorStore;
  retriever?: KnowledgeRetriever;
}

export const SAFE_INSUFFICIENT_EVIDENCE_FALLBACK =
  'Insufficient verified source evidence was found in the classical Ayurvedic corpus to answer this question reliably. ' +
  'AayurFace only provides guidance grounded directly in verified Shastra literature and vetted topical research.';

export const SAFE_PROMPT_INJECTION_REFUSAL =
  'Your request contains disallowed instruction override patterns or attempts to alter core system safety rules. ' +
  'AayurFace operates strictly within educational, non-diagnostic wellness boundaries.';

export const SAFE_MEDICAL_DIAGNOSIS_REFUSAL =
  'AayurFace provides educational wellness insights grounded in classical Ayurveda. It is strictly non-diagnostic ' +
  'and cannot assess, diagnose, or treat dermatological conditions or diseases. Please consult a licensed dermatologist or certified Ayurvedic Vaidya.';

/**
 * Synchronous RAG Pipeline (Unit tests, in-memory evaluations)
 */
export function executeRAGPipeline(request: RAGServiceRequest): { response: RAGResponse; trace: RAGAuditTrace } {
  const startTime = Date.now();
  const requestId = request.requestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rag-${Date.now()}`);
  const userId = request.userId || 'anonymous-user';
  const backend: RetrievalBackendType = 'in-memory';

  // 1. Sanitize user query against prompt injection
  const { isSafe: isPromptSafe, attackDetected } = sanitizeUserQuery(request.query);
  if (!isPromptSafe) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: 'SAFETY',
      retrievalBackend: backend,
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      retrievedChunkIds: [],
      selectedEvidenceIds: [],
      rejectedEvidenceIds: [],
      rejectionReasons: [`Prompt injection detected: ${attackDetected}`],
      claimsGenerated: 0,
      unsupportedClaimsCount: 0,
      gatingPassed: false,
      fallbackTriggered: true,
      safetyViolations: ['PROMPT_INJECTION_DETECTED'],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_PROMPT_INJECTION_REFUSAL,
      status: 'SAFETY_BLOCKED',
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `Prompt injection attempt intercepted: ${attackDetected}`,
      retrievalBackend: backend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 2. Perform Hybrid Retrieval
  const retrieval = retrieveKnowledge(request.query, request.filter, request.store || defaultVectorStore, backend);
  const evidenceList: EvidenceItem[] = retrieval.matches.map(chunkMatchToEvidence);

  // 3. Evaluate Grounding Gating
  if (retrieval.fallbackTriggered) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: retrieval.intent,
      retrievalBackend: backend,
      groundingStatus: retrieval.groundingStatus,
      retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
      selectedEvidenceIds: [],
      rejectedEvidenceIds: retrieval.matches.map(m => m.chunk.chunkId),
      rejectionReasons: [`Fewer than ${MIN_GROUNDING_CHUNK_COUNT} verified source chunks met cosine threshold (${CANDIDATE_SIMILARITY_THRESHOLD.toFixed(2)})`],
      claimsGenerated: 0,
      unsupportedClaimsCount: 0,
      gatingPassed: false,
      fallbackTriggered: true,
      safetyViolations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_INSUFFICIENT_EVIDENCE_FALLBACK,
      status: 'NO_EVIDENCE',
      groundingStatus: retrieval.groundingStatus,
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: 'INSUFFICIENT_VERIFIED_EVIDENCE',
      retrievalBackend: backend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 4. Formulate candidate claims grounded in retrieved evidence
  const candidateClaims: GeneratedClaim[] = evidenceList.map((ev, idx) => ({
    claimId: `claim-${requestId}-${idx + 1}`,
    text: `According to ${ev.sourceTitle} (${ev.provenanceCitation}), ${ev.contentExcerpt}`,
    supportingEvidenceIds: [ev.evidenceId],
    supportStatus: 'SUPPORTED',
    authorityTier: ev.authorityTier,
    verificationStatus: ev.verificationStatus,
    passageStatus: ev.passageStatus
  }));

  // 5. Validate Claims and Bind Citations
  const validation = validateClaims(candidateClaims, evidenceList);
  const { boundClaims, citations } = bindCitationsToClaims(candidateClaims, evidenceList);

  // 6. Assemble Synthesized Answer Text
  const synthesizedAnswer = boundClaims
    .filter(c => c.supportStatus === 'SUPPORTED')
    .map(c => c.text)
    .join('\n\n');

  // 7. Output Safety Gate
  const safety = validateSafety(synthesizedAnswer);
  if (!safety.isSafe) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: retrieval.intent,
      retrievalBackend: backend,
      groundingStatus: retrieval.groundingStatus,
      retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
      selectedEvidenceIds: evidenceList.map(e => e.evidenceId),
      rejectedEvidenceIds: [],
      rejectionReasons: safety.violationDetails,
      claimsGenerated: candidateClaims.length,
      unsupportedClaimsCount: validation.unsupportedClaims.length,
      gatingPassed: true,
      fallbackTriggered: true,
      safetyViolations: safety.violations,
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_MEDICAL_DIAGNOSIS_REFUSAL,
      status: 'SAFETY_BLOCKED',
      groundingStatus: retrieval.groundingStatus,
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `Output safety boundary triggered: ${safety.violations.join(', ')}`,
      retrievalBackend: backend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 8. Build XAI Explanation Payload if context/fusion is provided
  let xaiPayload: XAIExplanationPayload | undefined;
  if (request.fusionResult || request.userContext) {
    xaiPayload = buildXAIExplanation({
      analysisId: requestId,
      observedSignals: [
        {
          modality: 'VISUAL',
          signalName: 'Surface Hue & Texture Observable',
          signalValue: 'Standardized observation',
          interpretationSummary: 'Contextual signal; non-diagnostic surface feature.'
        }
      ],
      userContext: request.userContext,
      fusionResult: request.fusionResult,
      retrievedEvidence: evidenceList,
      supportedClaims: boundClaims.filter(c => c.supportStatus === 'SUPPORTED')
    });
  }

  const consultationStatus: ConsultationStatus =
    retrieval.groundingStatus === 'PARTIALLY_GROUNDED' ? 'PARTIALLY_GROUNDED' : 'GROUNDED';

  const response: RAGResponse = {
    responseId: requestId,
    answerText: synthesizedAnswer,
    status: consultationStatus,
    groundingStatus: retrieval.groundingStatus,
    isGrounded: true,
    fallbackTriggered: false,
    retrievalBackend: backend,
    evidence: evidenceList,
    claims: boundClaims,
    citations,
    xaiPayload,
    runtimeVersions: CURRENT_RUNTIME_VERSIONS
  };

  const trace: RAGAuditTrace = {
    requestId,
    userId,
    timestamp: new Date().toISOString(),
    query: request.query,
    intent: retrieval.intent,
    retrievalBackend: backend,
    groundingStatus: retrieval.groundingStatus,
    retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
    selectedEvidenceIds: evidenceList.map(e => e.evidenceId),
    rejectedEvidenceIds: [],
    rejectionReasons: [],
    claimsGenerated: candidateClaims.length,
    unsupportedClaimsCount: validation.unsupportedClaims.length,
    gatingPassed: true,
    fallbackTriggered: false,
    safetyViolations: [],
    runtimeVersions: CURRENT_RUNTIME_VERSIONS,
    totalLatencyMs: Date.now() - startTime
  };

  return { response, trace };
}

/**
 * Asynchronous Authoritative RAG Pipeline (Production runtime utilizing pluggable KnowledgeRetriever)
 */
export async function executeRAGPipelineAsync(
  request: RAGServiceRequest,
  customRetriever?: KnowledgeRetriever
): Promise<{ response: RAGResponse; trace: RAGAuditTrace }> {
  const startTime = Date.now();
  const requestId = request.requestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rag-${Date.now()}`);
  const userId = request.userId || 'anonymous-user';
  const retriever = customRetriever || request.retriever || getAuthoritativeRetriever();
  const backend: RetrievalBackendType = retriever.backendType;

  // 1. Sanitize user query against prompt injection
  const { isSafe: isPromptSafe, attackDetected } = sanitizeUserQuery(request.query);
  if (!isPromptSafe) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: 'SAFETY',
      retrievalBackend: backend,
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      retrievedChunkIds: [],
      selectedEvidenceIds: [],
      rejectedEvidenceIds: [],
      rejectionReasons: [`Prompt injection detected: ${attackDetected}`],
      claimsGenerated: 0,
      unsupportedClaimsCount: 0,
      gatingPassed: false,
      fallbackTriggered: true,
      safetyViolations: ['PROMPT_INJECTION_DETECTED'],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_PROMPT_INJECTION_REFUSAL,
      status: 'SAFETY_BLOCKED',
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `Prompt injection attempt intercepted: ${attackDetected}`,
      retrievalBackend: backend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 2. Perform Pluggable Retrieval
  let retrieval;
  try {
    retrieval = await retriever.retrieve(request.query, request.filter);
  } catch (err: any) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: 'GENERAL_CHAT',
      retrievalBackend: backend,
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      retrievedChunkIds: [],
      selectedEvidenceIds: [],
      rejectedEvidenceIds: [],
      rejectionReasons: [`Knowledge retriever dependency error: ${err?.message || 'Unknown error'}`],
      claimsGenerated: 0,
      unsupportedClaimsCount: 0,
      gatingPassed: false,
      fallbackTriggered: true,
      safetyViolations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: 'A temporary service dependency failure occurred while accessing classical knowledge. Please retry.',
      status: 'DEPENDENCY_FAILURE',
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `RETRIEVER_FAILURE: ${err?.message || 'Unknown'}`,
      retrievalBackend: backend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  const evidenceList: EvidenceItem[] = retrieval.matches.map(chunkMatchToEvidence);

  // 3. Evaluate Grounding Gating
  if (retrieval.fallbackTriggered) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: retrieval.intent,
      retrievalBackend: retrieval.retrievalBackend,
      groundingStatus: retrieval.groundingStatus,
      retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
      selectedEvidenceIds: [],
      rejectedEvidenceIds: retrieval.matches.map(m => m.chunk.chunkId),
      rejectionReasons: ['Retrieved chunks failed grounding gate.'],
      claimsGenerated: 0,
      unsupportedClaimsCount: 0,
      gatingPassed: false,
      fallbackTriggered: true,
      safetyViolations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_INSUFFICIENT_EVIDENCE_FALLBACK,
      status: 'NO_EVIDENCE',
      groundingStatus: retrieval.groundingStatus,
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: 'INSUFFICIENT_VERIFIED_EVIDENCE',
      retrievalBackend: retrieval.retrievalBackend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 4. Formulate candidate claims grounded in retrieved evidence
  const candidateClaims: GeneratedClaim[] = evidenceList.map((ev, idx) => ({
    claimId: `claim-${requestId}-${idx + 1}`,
    text: `According to ${ev.sourceTitle} (${ev.provenanceCitation}), ${ev.contentExcerpt}`,
    supportingEvidenceIds: [ev.evidenceId],
    supportStatus: 'SUPPORTED',
    authorityTier: ev.authorityTier,
    verificationStatus: ev.verificationStatus,
    passageStatus: ev.passageStatus
  }));

  // 5. Validate Claims and Bind Citations
  const validation = validateClaims(candidateClaims, evidenceList);
  const { boundClaims, citations } = bindCitationsToClaims(candidateClaims, evidenceList);

  // 6. Assemble Synthesized Answer Text
  const synthesizedAnswer = boundClaims
    .filter(c => c.supportStatus === 'SUPPORTED')
    .map(c => c.text)
    .join('\n\n');

  // 7. Output Safety Gate
  const safety = validateSafety(synthesizedAnswer);
  if (!safety.isSafe) {
    const trace: RAGAuditTrace = {
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      query: request.query,
      intent: retrieval.intent,
      retrievalBackend: retrieval.retrievalBackend,
      groundingStatus: retrieval.groundingStatus,
      retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
      selectedEvidenceIds: evidenceList.map(e => e.evidenceId),
      rejectedEvidenceIds: [],
      rejectionReasons: safety.violationDetails,
      claimsGenerated: candidateClaims.length,
      unsupportedClaimsCount: validation.unsupportedClaims.length,
      gatingPassed: true,
      fallbackTriggered: true,
      safetyViolations: safety.violations,
      runtimeVersions: CURRENT_RUNTIME_VERSIONS,
      totalLatencyMs: Date.now() - startTime
    };

    const response: RAGResponse = {
      responseId: requestId,
      answerText: SAFE_MEDICAL_DIAGNOSIS_REFUSAL,
      status: 'SAFETY_BLOCKED',
      groundingStatus: retrieval.groundingStatus,
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `Output safety boundary triggered: ${safety.violations.join(', ')}`,
      retrievalBackend: retrieval.retrievalBackend,
      evidence: [],
      claims: [],
      citations: [],
      runtimeVersions: CURRENT_RUNTIME_VERSIONS
    };

    return { response, trace };
  }

  // 8. Build XAI Explanation Payload if context/fusion is provided
  let xaiPayload: XAIExplanationPayload | undefined;
  if (request.fusionResult || request.userContext) {
    xaiPayload = buildXAIExplanation({
      analysisId: requestId,
      observedSignals: [
        {
          modality: 'VISUAL',
          signalName: 'Surface Hue & Texture Observable',
          signalValue: 'Standardized observation',
          interpretationSummary: 'Contextual signal; non-diagnostic surface feature.'
        }
      ],
      userContext: request.userContext,
      fusionResult: request.fusionResult,
      retrievedEvidence: evidenceList,
      supportedClaims: boundClaims.filter(c => c.supportStatus === 'SUPPORTED')
    });
  }

  const consultationStatus: ConsultationStatus =
    retrieval.groundingStatus === 'PARTIALLY_GROUNDED' ? 'PARTIALLY_GROUNDED' : 'GROUNDED';

  const response: RAGResponse = {
    responseId: requestId,
    answerText: synthesizedAnswer,
    status: consultationStatus,
    groundingStatus: retrieval.groundingStatus,
    isGrounded: true,
    fallbackTriggered: false,
    retrievalBackend: retrieval.retrievalBackend,
    evidence: evidenceList,
    claims: boundClaims,
    citations,
    xaiPayload,
    runtimeVersions: CURRENT_RUNTIME_VERSIONS
  };

  const trace: RAGAuditTrace = {
    requestId,
    userId,
    timestamp: new Date().toISOString(),
    query: request.query,
    intent: retrieval.intent,
    retrievalBackend: retrieval.retrievalBackend,
    groundingStatus: retrieval.groundingStatus,
    retrievedChunkIds: retrieval.matches.map(m => m.chunk.chunkId),
    selectedEvidenceIds: evidenceList.map(e => e.evidenceId),
    rejectedEvidenceIds: [],
    rejectionReasons: [],
    claimsGenerated: candidateClaims.length,
    unsupportedClaimsCount: validation.unsupportedClaims.length,
    gatingPassed: true,
    fallbackTriggered: false,
    safetyViolations: [],
    runtimeVersions: CURRENT_RUNTIME_VERSIONS,
    totalLatencyMs: Date.now() - startTime
  };

  return { response, trace };
}
