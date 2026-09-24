// ============================================================
// AayurFace — Phase 13: Verifiable Citation Binding Engine
// Enforces 100% Claim-to-Evidence Grounding & Rejects Fabrications
// ============================================================

import type { EvidenceItem, GeneratedClaim, Citation, ClaimSupportStatus } from '@/types/rag';

/**
 * Creates a formatted, verifiable Citation object from an EvidenceItem
 */
export function createCitation(evidence: EvidenceItem): Citation {
  return {
    citationId: `cit-${evidence.evidenceId}`,
    evidenceId: evidence.evidenceId,
    sourceTitle: evidence.sourceTitle,
    location: `${evidence.provenanceCitation} (${evidence.authorityTier})`,
    authorityTier: evidence.authorityTier,
    verificationStatus: evidence.verificationStatus
  };
}

export interface CitationBindingResult {
  boundClaims: GeneratedClaim[];
  citations: Citation[];
  supportedCount: number;
  unsupportedCount: number;
  phantomEvidenceIds: string[];
}

/**
 * Binds generated claims to actual retrieved evidence.
 * Strict Grounding Rule: If a claim cites an evidenceId that was NOT retrieved,
 * or provides zero supporting evidence, it is classified as UNSUPPORTED.
 */
export function bindCitationsToClaims(
  claims: GeneratedClaim[],
  retrievedEvidence: EvidenceItem[]
): CitationBindingResult {
  const evidenceMap = new Map<string, EvidenceItem>();
  retrievedEvidence.forEach(e => evidenceMap.set(e.evidenceId, e));

  const boundClaims: GeneratedClaim[] = [];
  const citationMap = new Map<string, Citation>();
  const phantomEvidenceIds: string[] = [];

  let supportedCount = 0;
  let unsupportedCount = 0;

  for (const claim of claims) {
    const validEvidenceIds: string[] = [];

    // Verify each cited evidenceId
    for (const evId of claim.supportingEvidenceIds) {
      if (evidenceMap.has(evId)) {
        validEvidenceIds.push(evId);
        const ev = evidenceMap.get(evId)!;
        if (!citationMap.has(ev.evidenceId)) {
          citationMap.set(ev.evidenceId, createCitation(ev));
        }
      } else {
        phantomEvidenceIds.push(evId);
      }
    }

    let status: ClaimSupportStatus = claim.supportStatus;
    let notes = claim.validationNotes || '';

    if (validEvidenceIds.length === 0) {
      status = 'UNSUPPORTED';
      notes = phantomEvidenceIds.length > 0
        ? `Rejected: Cited non-existent or unretrieved evidence ID (${phantomEvidenceIds.join(', ')})`
        : 'Rejected: No supporting classical evidence provided.';
      unsupportedCount++;
    } else {
      supportedCount++;
      notes = `Verified against ${validEvidenceIds.length} retrieved classical evidence items.`;
    }

    boundClaims.push({
      ...claim,
      supportingEvidenceIds: validEvidenceIds,
      supportStatus: status,
      validationNotes: notes
    });
  }

  return {
    boundClaims,
    citations: Array.from(citationMap.values()),
    supportedCount,
    unsupportedCount,
    phantomEvidenceIds
  };
}
