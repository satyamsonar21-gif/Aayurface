// ============================================================
// AayurFace — Phase 12 Adversarial & Hostile Security Test Suite
// Rigorous Edge Case, Tamper-Resistance & Safety Boundary Verification
// ============================================================

import { describe, it, expect } from 'vitest';
import { evaluateMultimodalFusion } from './fusionEngine';
import { evaluateEvidenceConflicts } from './conflictEngine';
import { evaluateEvidenceAgreement } from './agreementEngine';
import { evaluateUncertaintyAndCeilings } from './uncertaintyEngine';
import type { FusionEvidenceItem } from '@/types/fusion';
import type { CVResult } from '@/types/cv';

describe('Phase 12: Hostile Adversarial & Boundary Tests', () => {
  // ------------------------------------------------------------
  // ATTACK 1: CONFIDENCE INFLATION ATTACKS
  // ------------------------------------------------------------
  it('ADV-01: Cannot inflate confidence by duplicating the same observation multiple times', () => {
    // Adversary submits identical observation 10 times to inflate agreement count
    const duplicateEvidence: FusionEvidenceItem[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `ev-dup-${i}`,
      modality: 'VISUAL',
      observationType: 'FACE_GEOMETRY_METRICS',
      state: 'SUPPORTED',
      strength: 'LOW',
      usageStatus: 'USED',
      statusReason: 'Face ready',
      provenance: {
        source: 'cv',
        sourceType: 'SYSTEM_DERIVED',
        sourceVersion: 'v1',
        timestamp: 'now',
        origin: 'GATEWAY'
      },
      payload: {}
    }));

    const agreementRes = evaluateEvidenceAgreement(duplicateEvidence);
    const uncertaintyRes = evaluateUncertaintyAndCeilings({
      evidenceItems: duplicateEvidence,
      agreements: agreementRes.agreements,
      conflicts: [],
      conflictState: 'NO_CONFLICT'
    });

    // Ceiling A strictly enforces: Single modality alone cannot exceed LOW,
    // regardless of how many duplicate items were injected!
    expect(uncertaintyRes.finalStrength).toBe('LOW');
    expect(uncertaintyRes.ceilingsApplied).toContain('ceiling-single-modality-capped-at-low');
  });

  it('ADV-02: Cannot bypass ceiling with fabricated 0.999 probability in payload', () => {
    const maliciousCV: CVResult = {
      schemaVersion: 'cv-schema-v1',
      artifactId: 'art-malicious',
      provider: 'spoofed-ai-provider',
      providerVersion: '9.9.9',
      modelVersion: 'fake-deep-ai',
      analyzedAt: new Date().toISOString(),
      faceDetection: {
        status: 'SINGLE_FACE',
        faceCount: 1,
        confidence: 0.9999,
        allFaces: []
      },
      primaryFace: null,
      faceQuality: {
        meanLuminance: 120,
        medianLuminance: 120,
        shadowClippingRatio: 0,
        highlightClippingRatio: 0,
        sharpnessVariance: 100,
        sharpnessScore: 99,
        localContrast: 40,
        status: 'PASS',
        confidence: 0.9999
      },
      pose: { yaw: 0, pitch: 0, roll: 0, status: 'ACCEPTABLE', confidence: 0.9999 },
      occlusion: { status: 'CLEAR', confidence: 0.9999 },
      framing: { status: 'CENTERED', areaRatio: 0.2, centerOffsetDistance: 0, confidence: 0.9999 },
      readiness: {
        status: 'READY',
        reasons: [],
        warnings: [],
        actionableGuidance: [],
        ruleVersion: 'face-readiness-v1.1-heuristic'
      }
    };

    const result = evaluateMultimodalFusion({
      userId: 'attacker',
      cvResult: maliciousCV,
      ayurvedicSet: null,
      userContext: null
    });

    // Confidence remains strictly bounded to qualitative LOW
    expect(result.evidenceStrength).toBe('LOW');
    expect(result.interpretationState).toBe('PARTIALLY_SUPPORTED_OBSERVATION');
  });

  // ------------------------------------------------------------
  // ATTACK 2: EVIDENCE LAUNDERING & DIRECT DOSHA HIJACKING
  // ------------------------------------------------------------
  it('ADV-03: Visual redness observation cannot be laundered into clinical Pitta diagnosis', () => {
    const rednessItem: FusionEvidenceItem = {
      id: 'ev-red-1',
      modality: 'VISUAL',
      observationType: 'REDNESS_LIKE_APPEARANCE',
      state: 'SUPPORTED',
      strength: 'LOW',
      usageStatus: 'USED',
      statusReason: 'Redness detected',
      provenance: { source: 'cv', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'GATEWAY' },
      payload: { clinicalClaim: 'Pitta Dosha Imbalance 100%' } // Malicious payload
    };

    const agreements = evaluateEvidenceAgreement([rednessItem]);
    // With no Ayurvedic context, zero agreement is formed
    expect(agreements.agreements.length).toBe(0);

    const uncertainty = evaluateUncertaintyAndCeilings({
      evidenceItems: [rednessItem],
      agreements: [],
      conflicts: [],
      conflictState: 'NO_CONFLICT'
    });

    expect(uncertainty.finalStrength).toBe('LOW');
    expect(uncertainty.interpretationState).toBe('PARTIALLY_SUPPORTED_OBSERVATION');
  });

  // ------------------------------------------------------------
  // ATTACK 3: CONFLICT SUPPRESSION ATTEMPTS
  // ------------------------------------------------------------
  it('ADV-04: Cannot suppress conflict by omitting user context when contradictory visual evidence is present', () => {
    // If user reports oily skin, but visual dryness is detected, conflict MUST fire
    const drynessObs: FusionEvidenceItem = {
      id: 'ev-dryness',
      modality: 'VISUAL',
      observationType: 'DRYNESS_LIKE_APPEARANCE',
      state: 'SUPPORTED',
      strength: 'LOW',
      usageStatus: 'USED',
      statusReason: 'Flaking and dryness observed',
      provenance: { source: 'cv', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'GATEWAY' },
      payload: {}
    };

    const oilyContext: FusionEvidenceItem = {
      id: 'ev-ctx-oily',
      modality: 'USER_CONTEXT',
      contextType: 'REPORTED_SKIN_TYPE',
      state: 'SUPPORTED',
      strength: 'MODERATE',
      usageStatus: 'USED',
      statusReason: 'Reported oily skin',
      provenance: { source: 'user', sourceType: 'USER_REPORTED', sourceVersion: '1', timestamp: 'now', origin: 'CLIENT' },
      payload: { reportedSkinType: 'oily' }
    };

    const conflictRes = evaluateEvidenceConflicts([drynessObs, oilyContext]);
    expect(conflictRes.overallConflictState).toBe('MATERIAL_CONFLICT');
    expect(conflictRes.conflicts[0].downgradeApplied).toBe(true);

    const uncertainty = evaluateUncertaintyAndCeilings({
      evidenceItems: [drynessObs, oilyContext],
      agreements: [],
      conflicts: conflictRes.conflicts,
      conflictState: conflictRes.overallConflictState
    });

    expect(uncertainty.interpretationState).toBe('CONFLICTING_EVIDENCE');
    expect(uncertainty.finalStrength).toBe('LOW');
  });

  // ------------------------------------------------------------
  // ATTACK 4: PROVENANCE SPOOFING & UNKNOWN ENUMS
  // ------------------------------------------------------------
  it('ADV-05: Safely handles unexpected modalities, unknown enums, or malformed payloads', () => {
    const malformedInput: any = {
      userId: 'attacker',
      cvResult: {
        schemaVersion: 'invalid-schema-version',
        unknownProperty: true
      },
      ayurvedicSet: {
        interpretations: [{ evidence: 'UNKNOWN_EVIDENCE_STATUS' }]
      },
      userContext: {
        userId: 'attacker',
        dosha: 'UNKNOWN_ALIEN_DOSHA',
        skinType: 'UNKNOWN_SKIN_TYPE'
      }
    };

    expect(() => evaluateMultimodalFusion(malformedInput)).not.toThrow();
    const result = evaluateMultimodalFusion(malformedInput);
    expect(result.id).toBeDefined();
    expect(result.evidenceStrength).toBeDefined();
  });

  // ------------------------------------------------------------
  // ATTACK 5: PROVENANCE TRACEABILITY
  // ------------------------------------------------------------
  it('ADV-06: Every normalized item preserves exact non-forged origin and sourceVersion', () => {
    const result = evaluateMultimodalFusion({
      userId: 'u-audit',
      userContext: { userId: 'u-audit', dosha: 'kapha' }
    });

    const userItem = result.supportingEvidence.find((e) => e.modality === 'USER_CONTEXT');
    expect(userItem).toBeDefined();
    expect(userItem?.provenance.origin).toBe('CLIENT');
    expect(userItem?.provenance.sourceType).toBe('USER_REPORTED');
    expect(userItem?.provenance.derivationRule).toBe('self-reported-profile-mapping');
  });
});
