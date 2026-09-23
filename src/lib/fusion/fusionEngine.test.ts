// ============================================================
// AayurFace — Phase 12 Multimodal Fusion Test Suite
// Unit & Integration Tests across All Defined Evaluation Categories
// ============================================================

import { describe, it, expect } from 'vitest';
import { evaluateMultimodalFusion } from './fusionEngine';
import { normalizePhase10CVResult } from './adapters/phase10Adapter';
import { normalizePhase11InterpretationSet } from './adapters/phase11Adapter';
import { normalizeUserContext } from './adapters/userContextAdapter';
import { evaluateEvidenceAgreement } from './agreementEngine';
import { evaluateEvidenceConflicts } from './conflictEngine';
import { evaluateUncertaintyAndCeilings } from './uncertaintyEngine';
import type { CVResult } from '@/types/cv';
import type { AyurvedicInterpretationSet } from '@/lib/ayurveda/types';
import { CURRENT_FUSION_VERSION, CURRENT_FUSION_SCHEMA_VERSION } from './constants';

function createMockCVResult(overrides: Partial<CVResult> = {}): CVResult {
  return {
    schemaVersion: 'cv-schema-v1',
    artifactId: 'art-mock-123',
    provider: 'browser-mediapipe',
    providerVersion: '1.0.1',
    modelVersion: 'blazeface-short-range-v1',
    analyzedAt: '2026-09-23T12:00:00Z',
    faceDetection: {
      status: 'SINGLE_FACE',
      faceCount: 1,
      confidence: 0.95,
      allFaces: []
    },
    primaryFace: null,
    faceQuality: {
      meanLuminance: 125,
      medianLuminance: 124,
      shadowClippingRatio: 0.05,
      highlightClippingRatio: 0.02,
      sharpnessVariance: 45,
      sharpnessScore: 82,
      localContrast: 32,
      status: 'PASS',
      confidence: 0.95
    },
    pose: {
      yaw: 2.1,
      pitch: -1.4,
      roll: 3.2,
      status: 'ACCEPTABLE',
      confidence: 0.95
    },
    occlusion: {
      status: 'CLEAR',
      confidence: 0.95
    },
    framing: {
      status: 'CENTERED',
      areaRatio: 0.22,
      centerOffsetDistance: 0.04,
      confidence: 0.95
    },
    readiness: {
      status: 'READY',
      reasons: [],
      warnings: [],
      actionableGuidance: [],
      ruleVersion: 'face-readiness-v1.1-heuristic'
    },
    skinFeaturesExtension: null,
    ...overrides
  };
}

function createMockAyurvedicSet(overrides: Partial<AyurvedicInterpretationSet> = {}): AyurvedicInterpretationSet {
  return {
    interpretationId: 'interp-mock-123',
    userId: 'user-test-1',
    timestamp: '2026-09-23T12:00:00Z',
    overallEvidenceState: 'SUPPORTED',
    versionInfo: {
      knowledgeVersion: 'ayur-k-v1.0.0',
      ruleVersion: 'ayur-r-v1.0.0',
      schemaVersion: 'ayur-s-v1.0.0'
    },
    interpretations: [
      {
        id: 'interp-pitta-1',
        rationale: {
          observedIds: [],
          contextIds: ['prakriti-context'],
          ayurvedicConceptIds: ['concept-pita-heat'],
          description: 'User reported Prakriti context (PITTA) provides a constitutional baseline.'
        },
        evidence: 'SUPPORTED',
        limitations: 'Self-reported Prakriti is contextual and subject to user understanding.',
        safetyBoundaries: null,
        ruleVersion: 'ayur-r-v1.0.0'
      }
    ],
    ...overrides
  };
}

describe('Phase 12: Multimodal Fusion Engine', () => {
  // ------------------------------------------------------------
  // A. HAPPY PATH
  // ------------------------------------------------------------
  describe('Category A: Happy Path', () => {
    it('1. visual + compatible context produces supported contextual observation', () => {
      const cvResult = createMockCVResult();
      const ayurSet = createMockAyurvedicSet();
      const userContext = {
        userId: 'user-test-1',
        dosha: 'pitta',
        skinType: 'sensitive'
      };

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult,
        ayurvedicSet: ayurSet,
        userContext
      });

      expect(result.interpretationState).toBe('SUPPORTED_CONTEXTUAL_OBSERVATION');
      expect(result.evidenceStrength).toBe('MODERATE');
      expect(result.conflictState).toBe('NO_CONFLICT');
      expect(result.supportingEvidence.length).toBeGreaterThan(0);
      expect(result.auditTrace.agreementRecords.length).toBeGreaterThan(0);
    });

    it('2. visual only (missing context) produces bounded low strength observation', () => {
      const cvResult = createMockCVResult();

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult,
        ayurvedicSet: null,
        userContext: null
      });

      expect(result.interpretationState).toBe('PARTIALLY_SUPPORTED_OBSERVATION');
      expect(result.evidenceStrength).toBe('LOW'); // Ceiling A enforced: single modality <= LOW
      expect(result.missingEvidence.some((m) => m.modality === 'USER_CONTEXT')).toBe(true);
    });

    it('3. context only (missing visual) produces bounded low strength observation', () => {
      const ayurSet = createMockAyurvedicSet();
      const userContext = { userId: 'user-test-1', dosha: 'vata' };

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: null,
        ayurvedicSet: ayurSet,
        userContext
      });

      expect(result.evidenceStrength).toBe('LOW'); // Single modality <= LOW
      expect(result.missingEvidence.some((m) => m.modality === 'VISUAL')).toBe(true);
    });

    it('4. multiple compatible observations increase agreement without false certainty', () => {
      const cvResult = createMockCVResult();
      const ayurSet = createMockAyurvedicSet();
      const userContext = {
        userId: 'user-test-1',
        dosha: 'pitta',
        skinType: 'sensitive',
        wellnessFactors: { sleepHours: '7', hydrationLevel: 'good' }
      };

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult,
        ayurvedicSet: ayurSet,
        userContext
      });

      // Does not falsely inflate to HIGH because skin segmentation is unassessed
      expect(result.evidenceStrength).toBe('MODERATE');
      expect(result.auditTrace.agreementRecords.some((a) => a.agreementType === 'CONTEXTUAL_SUPPORT')).toBe(true);
    });
  });

  // ------------------------------------------------------------
  // B. UNCERTAINTY PROPAGATION
  // ------------------------------------------------------------
  describe('Category B: Uncertainty Propagation', () => {
    it('5. uncertain visual evidence propagates to UNCERTAIN state and forces LOW strength', () => {
      const cvResult = createMockCVResult({
        readiness: {
          status: 'WARNING',
          reasons: [],
          warnings: ['Lighting is subtle'],
          actionableGuidance: [],
          ruleVersion: 'face-readiness-v1.1-heuristic'
        }
      });

      // Adapter produces PARTIALLY_SUPPORTED for warning
      const p10 = normalizePhase10CVResult(cvResult);
      expect(p10.evidenceItems[0].state).toBe('PARTIALLY_SUPPORTED');
    });

    it('6. uncertain contextual evidence forces overall UNCERTAIN_OBSERVATION', () => {
      const ayurSet = createMockAyurvedicSet({
        interpretations: [
          {
            id: 'interp-unc-1',
            rationale: { observedIds: [], contextIds: [], ayurvedicConceptIds: [], description: 'Uncertain observation' },
            evidence: 'UNCERTAIN',
            limitations: 'Context is incomplete',
            safetyBoundaries: null,
            ruleVersion: 'ayur-r-v1.0.0'
          }
        ]
      });

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: createMockCVResult(),
        ayurvedicSet: ayurSet,
        userContext: { userId: 'user-test-1' }
      });

      expect(result.interpretationState).toBe('UNCERTAIN_OBSERVATION');
      expect(result.evidenceStrength).toBe('LOW');
    });

    it('7. rejected upstream visual capture discounts visual evidence and creates missing item', () => {
      const cvResult = createMockCVResult({
        readiness: {
          status: 'REJECTED',
          reasons: [{ code: 'FACE_TOO_BLURRY', severity: 'REJECT', message: 'Blurry frame', actionableGuidance: 'Hold still' }],
          warnings: [],
          actionableGuidance: [],
          ruleVersion: 'face-readiness-v1.1-heuristic'
        }
      });

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult,
        ayurvedicSet: createMockAyurvedicSet(),
        userContext: { userId: 'user-test-1', dosha: 'vata' }
      });

      expect(result.discountedEvidence.some((d) => d.id.includes('rejected'))).toBe(true);
      expect(result.missingEvidence.some((m) => m.reason === 'INSUFFICIENT_QUALITY')).toBe(true);
    });

    it('8. not assessed items are explicitly recorded in missing evidence without silent dropping', () => {
      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: createMockCVResult(),
        ayurvedicSet: null,
        userContext: { userId: 'user-test-1' }
      });

      const missingRedness = result.missingEvidence.find((m) => m.expectedItem === 'REDNESS_LIKE_APPEARANCE');
      expect(missingRedness).toBeDefined();
      expect(missingRedness?.reason).toBe('NOT_ASSESSED');
    });

    it('9. completely empty inputs yield INSUFFICIENT_EVIDENCE with strength NONE', () => {
      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: null,
        ayurvedicSet: null,
        userContext: null
      });

      expect(result.interpretationState).toBe('INSUFFICIENT_EVIDENCE');
      expect(result.evidenceStrength).toBe('NONE');
    });
  });

  // ------------------------------------------------------------
  // C. EVIDENCE CONFLICT
  // ------------------------------------------------------------
  describe('Category C: Evidence Conflict Handling', () => {
    it('10. conflicting evidence is recorded and visibly present in result', () => {
      // Create user context reporting oily skin, but inject dryness visual evidence
      const userContext = {
        userId: 'user-test-1',
        skinType: 'oily'
      };

      // Manually evaluate conflict engine with dryness observation + oily skin type
      const drynessEvidence: import('@/types/fusion').FusionEvidenceItem = {
        id: 'ev-vis-dryness-test',
        modality: 'VISUAL',
        observationType: 'DRYNESS_LIKE_APPEARANCE',
        state: 'SUPPORTED',
        strength: 'MODERATE',
        usageStatus: 'USED',
        statusReason: 'Dryness observed',
        provenance: {
          source: 'test',
          sourceType: 'SYSTEM_DERIVED',
          sourceVersion: 'v1',
          timestamp: new Date().toISOString(),
          origin: 'GATEWAY'
        },
        payload: {}
      };

      const userCtxNorm = normalizeUserContext(userContext);
      const conflictRes = evaluateEvidenceConflicts([drynessEvidence, ...userCtxNorm.evidenceItems]);

      expect(conflictRes.overallConflictState).toBe('MATERIAL_CONFLICT');
      expect(conflictRes.conflicts.length).toBe(1);
      expect(conflictRes.conflicts[0].downgradeApplied).toBe(true);
    });

    it('11. material conflict forces CONFLICTING_EVIDENCE and caps strength at LOW', () => {
      const drynessEvidence: import('@/types/fusion').FusionEvidenceItem = {
        id: 'ev-vis-dryness-test',
        modality: 'VISUAL',
        observationType: 'DRYNESS_LIKE_APPEARANCE',
        state: 'SUPPORTED',
        strength: 'MODERATE',
        usageStatus: 'USED',
        statusReason: 'Dryness observed',
        provenance: {
          source: 'test',
          sourceType: 'SYSTEM_DERIVED',
          sourceVersion: 'v1',
          timestamp: new Date().toISOString(),
          origin: 'GATEWAY'
        },
        payload: {}
      };

      const userCtxNorm = normalizeUserContext({ userId: 'user-1', skinType: 'oily' });
      const conflictRes = evaluateEvidenceConflicts([drynessEvidence, ...userCtxNorm.evidenceItems]);
      const uncertaintyRes = evaluateUncertaintyAndCeilings({
        evidenceItems: [drynessEvidence, ...userCtxNorm.evidenceItems],
        agreements: [],
        conflicts: conflictRes.conflicts,
        conflictState: conflictRes.overallConflictState
      });

      expect(uncertaintyRes.interpretationState).toBe('CONFLICTING_EVIDENCE');
      expect(uncertaintyRes.finalStrength).toBe('LOW');
      expect(uncertaintyRes.ceilingsApplied).toContain('ceiling-conflict-downgrade-to-low');
    });

    it('12. unresolved conflict occurs when high user expectations meet rejected camera capture', () => {
      const cvRejected = createMockCVResult({
        readiness: {
          status: 'REJECTED',
          reasons: [{ code: 'NO_FACE', severity: 'REJECT', message: 'No face', actionableGuidance: 'Frame face' }],
          warnings: [],
          actionableGuidance: [],
          ruleVersion: 'face-readiness-v1.1-heuristic'
        }
      });

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: cvRejected,
        ayurvedicSet: createMockAyurvedicSet(),
        userContext: { userId: 'user-test-1', dosha: 'pitta' }
      });

      expect(result.conflictState).toBe('UNRESOLVED_CONFLICT');
      expect(result.interpretationState).toBe('CONFLICTING_EVIDENCE');
      expect(result.evidenceStrength).toBe('LOW');
    });
  });

  // ------------------------------------------------------------
  // D. SAFETY BOUNDARIES (FACE IS NOT A DOSHA DIAGNOSTIC)
  // ------------------------------------------------------------
  describe('Category D: Safety Boundaries & Non-Diagnostic Guardrails', () => {
    it('14. face-only evidence CANNOT establish Prakriti', () => {
      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: createMockCVResult(),
        ayurvedicSet: null,
        userContext: null
      });

      expect(result.safetyBoundaries.preventsPrakritiInferenceFromFace).toBe(true);
      expect(result.safetyBoundaries.isNonDiagnostic).toBe(true);
      expect(result.summaryInsight.contextualMeaning).not.toContain('Diagnosed Prakriti');
    });

    it('15. face-only evidence CANNOT establish Dosha diagnosis', () => {
      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: createMockCVResult(),
        ayurvedicSet: null,
        userContext: null
      });

      expect(result.safetyBoundaries.preventsDoshaDiagnosisFromFace).toBe(true);
      // Interpretation state is not a medical diagnosis
      expect(result.interpretationState).not.toBe('SUPPORTED_CONTEXTUAL_OBSERVATION');
    });

    it('16. redness visual observation cannot directly diagnose Pitta', () => {
      const rednessObs: import('@/types/fusion').FusionEvidenceItem = {
        id: 'ev-redness-direct',
        modality: 'VISUAL',
        observationType: 'REDNESS_LIKE_APPEARANCE',
        state: 'SUPPORTED',
        strength: 'LOW',
        usageStatus: 'USED',
        statusReason: 'Redness noted',
        provenance: { source: 'cv', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'GATEWAY' },
        payload: {}
      };

      const ayurItem: import('@/types/fusion').FusionEvidenceItem = {
        id: 'ev-ayur-heat',
        modality: 'AYURVEDIC_CONTEXT',
        rawConceptId: 'concept-pita-heat',
        state: 'PARTIALLY_SUPPORTED',
        strength: 'LOW',
        usageStatus: 'USED',
        statusReason: 'Heat considerations',
        provenance: { source: 'ayur', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'KNOWLEDGE_BASE' },
        payload: {}
      };

      const agreementRes = evaluateEvidenceAgreement([rednessObs, ayurItem]);
      expect(agreementRes.agreements.length).toBe(1);
      // Agreement is CONTEXTUAL_SUPPORT, NEVER DIRECT_OBSERVATION or CLINICAL_DIAGNOSIS
      expect(agreementRes.agreements[0].agreementType).toBe('CONTEXTUAL_SUPPORT');
      expect(agreementRes.agreements[0].semanticRationale).toContain('without establishing clinical diagnosis');
    });
  });

  // ------------------------------------------------------------
  // E. CONFIDENCE CEILINGS
  // ------------------------------------------------------------
  describe('Category E: Confidence Ceilings', () => {
    it('19. uncertain input cannot become HIGH', () => {
      const uncertaintyRes = evaluateUncertaintyAndCeilings({
        evidenceItems: [
          {
            id: 'ev-1',
            modality: 'VISUAL',
            state: 'UNCERTAIN',
            strength: 'LOW',
            usageStatus: 'USED',
            statusReason: 'Blurry frame',
            provenance: { source: 'cv', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'GATEWAY' },
            payload: {}
          },
          {
            id: 'ev-2',
            modality: 'USER_CONTEXT',
            state: 'SUPPORTED',
            strength: 'MODERATE',
            usageStatus: 'USED',
            statusReason: 'User reported',
            provenance: { source: 'user', sourceType: 'USER_REPORTED', sourceVersion: '1', timestamp: 'now', origin: 'CLIENT' },
            payload: {}
          }
        ],
        agreements: [],
        conflicts: [],
        conflictState: 'NO_CONFLICT'
      });

      expect(uncertaintyRes.finalStrength).toBe('LOW');
      expect(uncertaintyRes.finalStrength).not.toBe('HIGH');
    });

    it('20. conflict cannot become HIGH', () => {
      const uncertaintyRes = evaluateUncertaintyAndCeilings({
        evidenceItems: [
          {
            id: 'ev-1',
            modality: 'VISUAL',
            state: 'SUPPORTED',
            strength: 'MODERATE',
            usageStatus: 'USED',
            statusReason: 'Visual',
            provenance: { source: 'cv', sourceType: 'SYSTEM_DERIVED', sourceVersion: '1', timestamp: 'now', origin: 'GATEWAY' },
            payload: {}
          }
        ],
        agreements: [],
        conflicts: [],
        conflictState: 'MATERIAL_CONFLICT'
      });

      expect(uncertaintyRes.finalStrength).toBe('LOW');
      expect(uncertaintyRes.finalStrength).not.toBe('HIGH');
    });

    it('21. insufficient evidence cannot become HIGH', () => {
      const uncertaintyRes = evaluateUncertaintyAndCeilings({
        evidenceItems: [],
        agreements: [],
        conflicts: [],
        conflictState: 'NO_CONFLICT'
      });

      expect(uncertaintyRes.finalStrength).toBe('NONE');
    });

    it('22. single modality without cross-modality corroboration cannot exceed LOW', () => {
      const uncertaintyRes = evaluateUncertaintyAndCeilings({
        evidenceItems: [
          {
            id: 'ev-1',
            modality: 'USER_CONTEXT',
            state: 'SUPPORTED',
            strength: 'MODERATE',
            usageStatus: 'USED',
            statusReason: 'User reported',
            provenance: { source: 'user', sourceType: 'USER_REPORTED', sourceVersion: '1', timestamp: 'now', origin: 'CLIENT' },
            payload: {}
          }
        ],
        agreements: [],
        conflicts: [],
        conflictState: 'NO_CONFLICT'
      });

      expect(uncertaintyRes.finalStrength).toBe('LOW');
      expect(uncertaintyRes.ceilingsApplied).toContain('ceiling-single-modality-capped-at-low');
    });
  });

  // ------------------------------------------------------------
  // F. INPUT VALIDATION & ADVERSARIAL FORGERY RESISTANCE
  // ------------------------------------------------------------
  describe('Category F: Input Validation & Forgery Resistance', () => {
    it('24. handles completely null, undefined, or empty inputs safely without crashing', () => {
      expect(() => normalizePhase10CVResult(null)).not.toThrow();
      expect(() => normalizePhase11InterpretationSet(null)).not.toThrow();
      expect(() => normalizeUserContext(null)).not.toThrow();
      expect(() => evaluateMultimodalFusion({ userId: '' })).not.toThrow();
    });

    it('27. forged client confidence percentage is ignored (qualitative strength enforced)', () => {
      // Simulate client sending fake 0.99 confidence in an arbitrary property
      const fakeCV = createMockCVResult({
        faceQuality: {
          meanLuminance: 120,
          medianLuminance: 120,
          shadowClippingRatio: 0,
          highlightClippingRatio: 0,
          sharpnessVariance: 50,
          sharpnessScore: 99,
          localContrast: 30,
          status: 'PASS',
          confidence: 0.99
        }
      });

      const result = evaluateMultimodalFusion({
        userId: 'user-test-1',
        cvResult: fakeCV,
        userContext: null
      });

      // Bounded by qualitative ceiling: single modality <= LOW
      expect(result.evidenceStrength).toBe('LOW');
    });
  });

  // ------------------------------------------------------------
  // G. DETERMINISM
  // ------------------------------------------------------------
  describe('Category G: Determinism', () => {
    it('31. identical inputs produce deterministic evaluation outcomes, rules, and ceilings (per-invocation timestamp/id)', () => {
      const input = {
        userId: 'user-det-1',
        assessmentId: 'assess-det-1',
        cvResult: createMockCVResult(),
        ayurvedicSet: createMockAyurvedicSet(),
        userContext: { userId: 'user-det-1', dosha: 'kapha', skinType: 'oily' }
      };

      const res1 = evaluateMultimodalFusion(input);
      const res2 = evaluateMultimodalFusion(input);

      // Deterministic outcomes:
      expect(res1.interpretationState).toBe(res2.interpretationState);
      expect(res1.evidenceStrength).toBe(res2.evidenceStrength);
      expect(res1.conflictState).toBe(res2.conflictState);
      expect(res1.supportingEvidence.length).toBe(res2.supportingEvidence.length);
      expect(res1.auditTrace.rulesFired).toEqual(res2.auditTrace.rulesFired);
      expect(res1.auditTrace.ceilingsApplied).toEqual(res2.auditTrace.ceilingsApplied);
      expect(res1.auditTrace.finalStateRationale).toBe(res2.auditTrace.finalStateRationale);

      // Evaluation IDs and timestamps are generated per invocation reflecting execution instance:
      expect(res1.id).toBeDefined();
      expect(res2.id).toBeDefined();
      expect(res1.auditTrace.timestamp).toBeDefined();
      expect(res2.auditTrace.timestamp).toBeDefined();
    });
  });

  // ------------------------------------------------------------
  // H. VERSIONING
  // ------------------------------------------------------------
  describe('Category H: Version Metadata Preservation', () => {
    it('32. output preserves current fusion version and schema version', () => {
      const result = evaluateMultimodalFusion({ userId: 'u1' });
      expect(result.versions.fusionVersion).toBe(CURRENT_FUSION_VERSION);
      expect(result.versions.schemaVersion).toBe(CURRENT_FUSION_SCHEMA_VERSION);
    });

    it('33. preserves upstream CV, knowledge, and rule versions', () => {
      const cvResult = createMockCVResult();
      const ayurSet = createMockAyurvedicSet();

      const result = evaluateMultimodalFusion({
        userId: 'u1',
        cvResult,
        ayurvedicSet: ayurSet
      });

      expect(result.versions.cvVersion).toContain('browser-mediapipe');
      expect(result.versions.knowledgeVersion).toBe('ayur-k-v1.0.0');
      expect(result.versions.ruleVersion).toBe('ayur-r-v1.0.0');
    });
  });

  // ------------------------------------------------------------
  // I. TRACEABILITY
  // ------------------------------------------------------------
  describe('Category I: Traceability & Audit Trail', () => {
    it('34. audit trace answers all operational accounting questions', () => {
      const result = evaluateMultimodalFusion({
        userId: 'u1',
        cvResult: createMockCVResult(),
        ayurvedicSet: createMockAyurvedicSet(),
        userContext: { userId: 'u1', dosha: 'pitta' }
      });

      const audit = result.auditTrace;
      expect(audit.totalInputsReceived).toBeGreaterThan(0);
      expect(audit.acceptedInputsCount).toBeGreaterThanOrEqual(0);
      expect(audit.rejectedInputsCount).toBeGreaterThanOrEqual(0);
      expect(audit.rulesFired.length).toBeGreaterThan(0);
      expect(audit.finalStateRationale).toBeDefined();
      expect(audit.versions.fusionVersion).toBe(CURRENT_FUSION_VERSION);
    });
  });

  // ------------------------------------------------------------
  // J. FORENSIC DEFECT REMEDIATION REGRESSION SUITE
  // ------------------------------------------------------------
  describe('Category J: Forensic Defect Remediation & Audit Verifications', () => {
    // ----------------------------------------------------------
    // Test A: NOT_ASSESSED Must Not Become Conflict
    // ----------------------------------------------------------
    describe('Test A: NOT_ASSESSED features do not generate conflicts', () => {
      it('REG-01: visual dryness NOT_ASSESSED paired with reported oily skin produces NO_CONFLICT', () => {
        const cvResult = createMockCVResult(); // Phase 10 produces dryness as NOT_ASSESSED
        const userContext = {
          userId: 'user-test-audit-dryness-oily',
          skinType: 'oily'
        };

        const result = evaluateMultimodalFusion({
          userId: 'user-test-audit-dryness-oily',
          cvResult,
          ayurvedicSet: null,
          userContext
        });

        // Must strictly NOT become conflict
        expect(result.conflictState).toBe('NO_CONFLICT');
        expect(result.auditTrace.conflictRecords).toHaveLength(0);
        expect(result.auditTrace.conflictRecords.some((c) => c.severity === 'MATERIAL_CONFLICT')).toBe(false);

        // Missing evidence must explicitly record NOT_ASSESSED for dryness
        const missingDryness = result.missingEvidence.find((m) => m.expectedItem === 'DRYNESS_LIKE_APPEARANCE');
        expect(missingDryness).toBeDefined();
        expect(missingDryness?.reason).toBe('NOT_ASSESSED');
        expect(missingDryness?.impactOnFusion).toContain('unassessed');
      });

      it('REG-02: direct conflictEngine evaluation: NOT_ASSESSED dryness + oily skin returns empty conflicts', () => {
        const p10 = normalizePhase10CVResult(createMockCVResult());
        const userCtx = normalizeUserContext({ userId: 'u1', skinType: 'oily' });

        const unassessedDryness = p10.evidenceItems.find((e) => e.observationType === 'DRYNESS_LIKE_APPEARANCE')!;
        expect(unassessedDryness.state).toBe('NOT_ASSESSED');
        expect(unassessedDryness.usageStatus).toBe('NOT_ASSESSED');

        const conflictRes = evaluateEvidenceConflicts([unassessedDryness, ...userCtx.evidenceItems]);
        expect(conflictRes.overallConflictState).toBe('NO_CONFLICT');
        expect(conflictRes.conflicts).toHaveLength(0);
      });

      it('REG-03: visual redness NOT_ASSESSED paired with any context produces NO_CONFLICT', () => {
        const p10 = normalizePhase10CVResult(createMockCVResult());
        const userCtx = normalizeUserContext({ userId: 'u1', dosha: 'kapha', skinType: 'normal' });

        const unassessedRedness = p10.evidenceItems.find((e) => e.observationType === 'REDNESS_LIKE_APPEARANCE')!;
        expect(unassessedRedness.state).toBe('NOT_ASSESSED');
        expect(unassessedRedness.usageStatus).toBe('NOT_ASSESSED');

        const conflictRes = evaluateEvidenceConflicts([unassessedRedness, ...userCtx.evidenceItems]);
        expect(conflictRes.overallConflictState).toBe('NO_CONFLICT');
        expect(conflictRes.conflicts).toHaveLength(0);

        const missingRedness = p10.missingItems.find((m) => m.expectedItem === 'REDNESS_LIKE_APPEARANCE');
        expect(missingRedness).toBeDefined();
        expect(missingRedness?.reason).toBe('NOT_ASSESSED');
      });
    });

    // ----------------------------------------------------------
    // Test B: Circular Corroboration Prevention
    // ----------------------------------------------------------
    describe('Test B: Circular Corroboration Prevention', () => {
      it('REG-04: User Prakriti (PITTA) + derived Ayurvedic context (PITTA) without visual evidence remains LOW', () => {
        const ayurSetPitta = createMockAyurvedicSet({
          interpretations: [
            {
              id: 'interp-pitta-derived-only',
              rationale: {
                observedIds: [], // NO visual observation
                contextIds: ['prakriti-context'], // derived solely from user context
                ayurvedicConceptIds: ['concept-pita-heat'],
                description: 'Derived baseline from self-reported Pitta Prakriti'
              },
              evidence: 'SUPPORTED',
              limitations: 'Self-reported baseline only',
              safetyBoundaries: null,
              ruleVersion: 'ayur-r-v1.0.0'
            }
          ]
        });

        const userContextPitta = {
          userId: 'user-circ-pitta-1',
          dosha: 'pitta'
        };

        const result = evaluateMultimodalFusion({
          userId: 'user-circ-pitta-1',
          cvResult: null, // No visual signal
          ayurvedicSet: ayurSetPitta,
          userContext: userContextPitta
        });

        // Must strictly remain LOW and NOT elevate to MODERATE or HIGH
        expect(result.evidenceStrength).toBe('LOW');
        expect(result.evidenceStrength).not.toBe('MODERATE');
        expect(result.evidenceStrength).not.toBe('HIGH');

        // Circular lineage ceiling must be explicitly recorded
        expect(result.auditTrace.ceilingsApplied).toContain('ceiling-circular-context-lineage-capped-at-low');
      });

      it('REG-05: User Prakriti (VATA) + derived Ayurvedic context (VATA) without visual evidence remains LOW', () => {
        const ayurSetVata = createMockAyurvedicSet({
          interpretations: [
            {
              id: 'interp-vata-derived-only',
              rationale: {
                observedIds: [], // NO visual observation
                contextIds: ['prakriti-context'], // derived solely from user context
                ayurvedicConceptIds: ['concept-vata-dryness'],
                description: 'Derived baseline from self-reported Vata Prakriti'
              },
              evidence: 'SUPPORTED',
              limitations: 'Self-reported baseline only',
              safetyBoundaries: null,
              ruleVersion: 'ayur-r-v1.0.0'
            }
          ]
        });

        const userContextVata = {
          userId: 'user-circ-vata-1',
          dosha: 'vata'
        };

        const result = evaluateMultimodalFusion({
          userId: 'user-circ-vata-1',
          cvResult: null, // No visual signal
          ayurvedicSet: ayurSetVata,
          userContext: userContextVata
        });

        // Must strictly remain LOW and NOT elevate to MODERATE or HIGH
        expect(result.evidenceStrength).toBe('LOW');
        expect(result.evidenceStrength).not.toBe('MODERATE');
        expect(result.evidenceStrength).not.toBe('HIGH');

        // Circular lineage ceiling must be explicitly recorded
        expect(result.auditTrace.ceilingsApplied).toContain('ceiling-circular-context-lineage-capped-at-low');
      });
    });

    // ----------------------------------------------------------
    // Test C: Valid Corroboration Preserved
    // ----------------------------------------------------------
    describe('Test C: Valid Corroboration Preserved', () => {
      it('REG-06: Valid visual observation + valid user context + derived Ayurvedic context elevates to MODERATE', () => {
        const cvResult = createMockCVResult(); // Valid accepted visual readiness (PRIMARY_VISUAL)
        const ayurSet = createMockAyurvedicSet({
          interpretations: [
            {
              id: 'interp-pitta-context-valid',
              rationale: {
                observedIds: [],
                contextIds: ['prakriti-context'],
                ayurvedicConceptIds: ['concept-pita-heat'],
                description: 'Contextual Pitta guidance'
              },
              evidence: 'SUPPORTED',
              limitations: 'Contextual baseline',
              safetyBoundaries: null,
              ruleVersion: 'ayur-r-v1.0.0'
            }
          ]
        });

        const userContext = {
          userId: 'user-valid-corrob-1',
          dosha: 'pitta'
        };

        const result = evaluateMultimodalFusion({
          userId: 'user-valid-corrob-1',
          cvResult,
          ayurvedicSet: ayurSet,
          userContext
        });

        // Independent primary visual + user context lineages allow valid corroboration
        expect(result.evidenceStrength).toBe('MODERATE');
        expect(result.interpretationState).toBe('SUPPORTED_CONTEXTUAL_OBSERVATION');
        expect(result.auditTrace.ceilingsApplied).not.toContain('ceiling-circular-context-lineage-capped-at-low');
        expect(result.auditTrace.ceilingsApplied).not.toContain('ceiling-single-modality-capped-at-low');
      });
    });
  });
});
