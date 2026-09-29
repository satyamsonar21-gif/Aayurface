// ============================================================
// AayurFace — Phase 13-R: Ayurvedic Consultation Intelligence Service
// Evidence-Grounded Conversational Bridge with Strict Safety Boundaries
// Zero-Hallucination, Multi-Tier Citations & Non-Diagnostic Wellness
// ============================================================

import type {
  Citation,
  QueryIntent,
  RAGAuditTrace,
  EvidenceItem
} from '@/types/rag';
import {
  executeRAGPipeline,
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
 */
function buildGroundedConsultationReply(
  evidence: EvidenceItem[],
  userContext?: ConsultationUserContext
): string {
  const sections: string[] = [];

  // 1. Classical Grounding Section
  const primaryEvidence = evidence[0];
  const secondaryEvidence = evidence[1];

  let intro = `According to classical Ayurvedic literature, specifically **${primaryEvidence.sourceTitle}** (${primaryEvidence.provenanceCitation}):\n\n> "${primaryEvidence.contentExcerpt}"`;

  if (secondaryEvidence && secondaryEvidence.chunkId !== primaryEvidence.chunkId) {
    intro += `\n\nThis is further supported by **${secondaryEvidence.sourceTitle}** (${secondaryEvidence.provenanceCitation}):\n\n> "${secondaryEvidence.contentExcerpt}"`;
  }
  sections.push(intro);

  // 2. Contextual Constitutional Personalization (Non-diagnostic)
  if (userContext?.reportedPrakriti || userContext?.skinType) {
    const prakriti = userContext.reportedPrakriti || 'balanced';
    const skinType = userContext.skinType || 'balanced';
    sections.push(
      `**Constitutional Context (${prakriti.toUpperCase()} / ${skinType.toUpperCase()}):**\n` +
      `In Ayurvedic Dravyaguna, individuals with ${prakriti} tendencies observe these qualities relative to their constitutional baseline. ` +
      `Equilibrium is cultivated through opposing dietary, environmental, and topical qualities (Samanya-Vishesha principle).`
    );
  }

  // 3. Classical Dinacharya / Topical Wellness Practice
  sections.push(
    `**Dinacharya Recommendation:**\n` +
    `• Align morning and evening cleansing rituals with cool or lukewarm water rather than harsh thermal extremes.\n` +
    `• Always conduct a **24-hour patch test** behind the ear before applying any herbal formulation or botanical oil.\n` +
    `• If topical irritation, burning, or persistence occurs, immediately discontinue use and consult a certified Ayurvedic Vaidya or licensed dermatologist.`
  );

  return sections.join('\n\n');
}

/**
 * Main Consultation Pipeline Entry Point:
 * Executes grounded retrieval, passes claim validation, validates safety output,
 * and formats verifiable citations.
 */
export async function getConsultationResponse(
  request: ConsultationRequest
): Promise<ConsultationResponse> {
  const { query, userContext, userId } = request;

  // Execute Grounded RAG Pipeline
  const { response: ragResponse, trace } = executeRAGPipeline({
    query,
    userId: userId || 'anonymous-user',
    userContext: userContext ? {
      skinType: userContext.skinType,
      reportedPrakriti: userContext.reportedPrakriti,
      lifestyleFactors: userContext.lifestyleFactors
    } : undefined
  });

  // Handle Pipeline Fallbacks (Prompt Injection or Gating Failure)
  if (ragResponse.fallbackTriggered || !ragResponse.isGrounded) {
    return {
      reply: ragResponse.answerText,
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

  return {
    reply: candidateReply,
    citations: ragResponse.citations,
    evidence: ragResponse.evidence,
    isGrounded: true,
    fallbackTriggered: false,
    intent: trace.intent,
    trace,
    disclaimer: CONSULTATION_WELLNESS_DISCLAIMER
  };
}
