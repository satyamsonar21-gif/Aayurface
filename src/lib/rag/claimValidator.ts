// ============================================================
// AayurFace — Phase 13: Post-Generation Claim Validator Gate
// Detects Hallucinations, Refuses Ungrounded Content & Enforces Truth
// ============================================================

import type { EvidenceItem, GeneratedClaim, ClaimValidationResult } from '@/types/rag';
import { bindCitationsToClaims } from './citationEngine';

/**
 * Post-generation claim validation gate:
 * Assesses generated claims against actual retrieved evidence.
 * If fabricated citation IDs or unsupported factual statements are detected,
 * flags the response and triggers fallback if necessary.
 */
export function validateClaims(
  claims: GeneratedClaim[],
  retrievedEvidence: EvidenceItem[]
): ClaimValidationResult {
  if (!claims || claims.length === 0) {
    return {
      allClaimsValid: false,
      validatedClaims: [],
      unsupportedClaims: [],
      rejectedCitationIds: [],
      hallucinationDetected: false,
      refusalRequired: true
    };
  }

  const { boundClaims, phantomEvidenceIds } = bindCitationsToClaims(claims, retrievedEvidence);

  const validatedClaims = boundClaims.filter(c => c.supportStatus === 'SUPPORTED' || c.supportStatus === 'PARTIALLY_SUPPORTED');
  const unsupportedClaims = boundClaims.filter(c => c.supportStatus === 'UNSUPPORTED' || c.supportStatus === 'INSUFFICIENT_EVIDENCE');

  const hallucinationDetected = phantomEvidenceIds.length > 0;
  const allClaimsValid = unsupportedClaims.length === 0 && !hallucinationDetected;

  // Refusal is required if NO claims are supported or if hallucinated citation IDs were attempted
  const refusalRequired = validatedClaims.length === 0 || hallucinationDetected;

  return {
    allClaimsValid,
    validatedClaims,
    unsupportedClaims,
    rejectedCitationIds: phantomEvidenceIds,
    hallucinationDetected,
    refusalRequired
  };
}
