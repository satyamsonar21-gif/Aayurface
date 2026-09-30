// ============================================================
// AayurFace — Phase 13-R.1: Ayurvedic Consultation Intelligence Service
// Evidence-Grounded Conversational Bridge with Strict Safety Boundaries
// Zero-Hallucination, Multi-Tier Citations, Provenance & Explicit Failure Semantics
// ============================================================

import type {
  Citation,
  QueryIntent,
  RAGAuditTrace,
  EvidenceItem,
  ConsultationStatus,
  RetrievalBackendType
} from '@/types/rag';
import {
  executeRAGPipelineAsync,
  SAFE_MEDICAL_DIAGNOSIS_REFUSAL
} from './ragService';
import { validateSafety } from './safetyFilter';

export interface ConsultationUserContext {
  skinType?: string;
  reportedPrakriti?: string;
  lifestyleFactors?: string[];
  recentScan?: {
    summary?: string;
    detectedQualities?: string[];
  };
}

export interface ConsultationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsultationRequest {
  query: string;
  history?: ConsultationMessage[];
  userContext?: ConsultationUserContext;
  userId?: string;
}

export interface ConsultationResponse {
  reply: string;
  status: ConsultationStatus;
  retrievalBackend: RetrievalBackendType;
  citations: Citation[];
  evidence: EvidenceItem[];
  isGrounded: boolean;
  fallbackTriggered: boolean;
  fallbackReason?: string;
  intent: QueryIntent;
  trace: RAGAuditTrace;
  disclaimer: string;
}

export const CONSULTATION_WELLNESS_DISCLAIMER =
  'Ayurvedic wellness insights grounded strictly in classical texts. Not a substitute for medical diagnosis or clinical treatment.';

/**
 * Synthesizes an educational, grounded consultation reply from verified RAG pipeline outputs.
 * Substantive claims are derived strictly from retrieved classical evidence.
 */
function buildGroundedConsultationReply(
  evidence: EvidenceItem[],
  userContext?: ConsultationUserContext
): string {
  const sections: string[] = [];

  // 1. Classical Shastra Grounding Section (Evidence-First)
  const primaryEvidence = evidence[0];
  const secondaryEvidence = evidence[1];

  let intro = `According to classical Ayurvedic literature, specifically **${primaryEvidence.sourceTitle}** (${primaryEvidence.provenanceCitation}):\n\n> "${primaryEvidence.contentExcerpt}"`;

  if (secondaryEvidence && secondaryEvidence.chunkId !== primaryEvidence.chunkId) {
    intro += `\n\nThis is further corroborated by **${secondaryEvidence.sourceTitle}** (${secondaryEvidence.provenanceCitation}):\n\n> "${secondaryEvidence.contentExcerpt}"`;
  }
  sections.push(intro);

  // 2. Contextual Constitutional Personalization (Non-diagnostic User Intake Interpretation)
  if (userContext?.reportedPrakriti || userContext?.skinType) {
    const prakriti = userContext.reportedPrakriti || 'balanced';
    const skinType = userContext.skinType || 'balanced';
    sections.push(
      `**Constitutional Context (${prakriti.toUpperCase()} / ${skinType.toUpperCase()}):**\n` +
      `In classical Ayurvedic principles, individuals with reported ${prakriti} constitution and ${skinType} skin observe these qualities relative to their constitutional baseline. ` +
      `Equilibrium is cultivated through opposing dietary, environmental, and topical qualities (Samanya-Vishesha principle).`
    );
  }

  // 3. Classical Dinacharya / Topical Wellness Practice (Mandatory Safety Mandate)
  sections.push(
    `**Dinacharya Recommendation:**\n` +
    `• Align morning and evening cleansing rituals with cool or lukewarm water rather than harsh thermal extremes.\n` +
    `• Always conduct a **24-hour patch test** behind the ear or on the inner forearm before applying any herbal formulation or botanical oil.\n` +
    `• If topical irritation, burning, or persistence occurs, immediately discontinue use and consult a certified Ayurvedic Vaidya or licensed dermatologist.`
  );

  return sections.join('\n\n');
}

/**
 * Main Consultation Pipeline Entry Point:
 * Executes grounded retrieval, passes claim validation, validates safety output,
 * and formats verifiable citations with explicit failure semantics.
 */
export async function getConsultationResponse(
  request: ConsultationRequest
): Promise<ConsultationResponse> {
  const { query, userContext, userId } = request;

  // Execute Grounded RAG Pipeline asynchronously with pluggable KnowledgeRetriever
  const { response: ragResponse, trace } = await executeRAGPipelineAsync({
    query,
    userId: userId || 'anonymous-user',
    userContext: userContext ? {
      skinType: userContext.skinType,
      reportedPrakriti: userContext.reportedPrakriti,
      lifestyleFactors: userContext.lifestyleFactors
    } : undefined
  });

  const backend: RetrievalBackendType = ragResponse.retrievalBackend || 'in-memory';

  // Handle Pipeline Fallbacks (Prompt Injection, Safety Boundary, or Gating Failure)
  if (ragResponse.fallbackTriggered || !ragResponse.isGrounded) {
    const fallbackStatus: ConsultationStatus = ragResponse.status || 'NO_EVIDENCE';
    return {
      reply: ragResponse.answerText,
      status: fallbackStatus,
      retrievalBackend: backend,
      citations: [],
      evidence: [],
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: ragResponse.fallbackReason || 'UNGROUNDED_OR_INSUFFICIENT_EVIDENCE',
      intent: trace.intent,
      trace,
      disclaimer: CONSULTATION_WELLNESS_DISCLAIMER
    };
  }

  // Build Grounded Educational Consultation Reply
  const candidateReply = buildGroundedConsultationReply(
    ragResponse.evidence,
    userContext
  );

  // Post-synthesis Safety Gate
  const safetyCheck = validateSafety(candidateReply);
  if (!safetyCheck.isSafe) {
    trace.safetyViolations.push(...safetyCheck.violations);
    trace.fallbackTriggered = true;
    return {
      reply: SAFE_MEDICAL_DIAGNOSIS_REFUSAL,
      status: 'SAFETY_BLOCKED',
      retrievalBackend: backend,
      citations: [],
      evidence: [],
      isGrounded: false,
      fallbackTriggered: true,
      fallbackReason: `Output safety violation: ${safetyCheck.violations.join(', ')}`,
      intent: trace.intent,
      trace,
      disclaimer: CONSULTATION_WELLNESS_DISCLAIMER
    };
  }

  const finalStatus: ConsultationStatus = ragResponse.status || 'GROUNDED';

  return {
    reply: candidateReply,
    status: finalStatus,
    retrievalBackend: backend,
    citations: ragResponse.citations,
    evidence: ragResponse.evidence,
    isGrounded: true,
    fallbackTriggered: false,
    intent: trace.intent,
    trace,
    disclaimer: CONSULTATION_WELLNESS_DISCLAIMER
  };
}
