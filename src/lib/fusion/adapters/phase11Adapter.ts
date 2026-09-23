// ============================================================
// AayurFace — Phase 11 Ayurvedic Adapter for Multimodal Fusion
// Normalizes Phase 11 AyurvedicInterpretationSet into Canonical Fusion Evidence
// Strict Boundary: Preserves Provenance, Versions, and Safety Limitations
// ============================================================

import type { AyurvedicInterpretationSet, Interpretation } from '@/lib/ayurveda/types';
import type {
  FusionEvidenceItem,
  MissingEvidenceItem,
  EvidenceStrength,
  FusionEvidenceState
} from '@/types/fusion';

export interface Phase11AdapterOutput {
  evidenceItems: FusionEvidenceItem[];
  missingItems: MissingEvidenceItem[];
  knowledgeVersion: string;
  ruleVersion: string;
}

export function normalizePhase11InterpretationSet(
  ayurSet: AyurvedicInterpretationSet | null | undefined
): Phase11AdapterOutput {
  const missingItems: MissingEvidenceItem[] = [];
  const evidenceItems: FusionEvidenceItem[] = [];

  if (!ayurSet) {
    missingItems.push({
      modality: 'AYURVEDIC_CONTEXT',
      expectedItem: 'AYURVEDIC_INTERPRETATION_SET',
      reason: 'UPSTREAM_UNAVAILABLE',
      impactOnFusion: 'No Ayurvedic knowledge or Shastric interpretation set provided.'
    });

    return {
      evidenceItems: [],
      missingItems,
      knowledgeVersion: 'ayur-k-missing',
      ruleVersion: 'ayur-r-missing'
    };
  }

  const knowledgeVersion = ayurSet.versionInfo?.knowledgeVersion || 'ayur-k-unknown';
  const ruleVersion = ayurSet.versionInfo?.ruleVersion || 'ayur-r-unknown';
  const timestamp = ayurSet.timestamp || new Date().toISOString();

  // If set contains no interpretations
  if (!ayurSet.interpretations || ayurSet.interpretations.length === 0) {
    missingItems.push({
      modality: 'AYURVEDIC_CONTEXT',
      expectedItem: 'SHASTRIC_INTERPRETATIONS',
      reason: 'NOT_AVAILABLE',
      impactOnFusion: 'Ayurvedic engine returned an empty interpretation list.'
    });

    return {
      evidenceItems: [],
      missingItems,
      knowledgeVersion,
      ruleVersion
    };
  }

  for (let i = 0; i < ayurSet.interpretations.length; i++) {
    const interp: Interpretation = ayurSet.interpretations[i];
    
    // Map EvidenceStatus to FusionEvidenceState
    let state: FusionEvidenceState = 'PARTIALLY_SUPPORTED';
    let strength: EvidenceStrength = 'LOW';
    let usageStatus: FusionEvidenceItem['usageStatus'] = 'USED';

    switch (interp.evidence) {
      case 'SUPPORTED':
        state = 'SUPPORTED';
        // Contextual Ayurvedic baseline without direct visual confirmation is calibrated to MODERATE, not HIGH
        strength = 'MODERATE';
        usageStatus = 'USED';
        break;
      case 'PARTIALLY_SUPPORTED':
        state = 'PARTIALLY_SUPPORTED';
        strength = 'LOW';
        usageStatus = 'USED';
        break;
      case 'UNCERTAIN':
        state = 'UNCERTAIN';
        strength = 'LOW';
        usageStatus = 'USED';
        break;
      case 'INSUFFICIENT_EVIDENCE':
        state = 'INSUFFICIENT_EVIDENCE';
        strength = 'NONE';
        usageStatus = 'INSUFFICIENT';
        break;
      case 'NOT_APPLICABLE':
      default:
        state = 'NOT_ASSESSED';
        strength = 'NONE';
        usageStatus = 'NOT_APPLICABLE';
        break;
    }

    const conceptId = interp.rationale?.ayurvedicConceptIds?.[0] || 'concept-general';

    const hasVisualObsInput = !!(interp.rationale?.observedIds && interp.rationale.observedIds.length > 0);
    const hasContextInput = !!(interp.rationale?.contextIds && interp.rationale.contextIds.length > 0);

    const lineageSource: import('@/types/fusion').EvidenceLineageSource =
      !hasVisualObsInput && hasContextInput
        ? 'DERIVED_FROM_USER_CONTEXT'
        : hasVisualObsInput
        ? 'PRIMARY_VISUAL'
        : 'STATIC_KNOWLEDGE';

    evidenceItems.push({
      id: `ev-ayur-${interp.id || i + 1}`,
      modality: 'AYURVEDIC_CONTEXT',
      rawConceptId: conceptId,
      state,
      strength,
      usageStatus,
      statusReason: interp.rationale?.description || 'Ayurvedic contextual interpretation.',
      provenance: {
        source: 'phase-11-ayurvedic-engine',
        sourceType: 'SYSTEM_DERIVED',
        sourceVersion: `${knowledgeVersion}+${ruleVersion}`,
        timestamp,
        origin: 'KNOWLEDGE_BASE',
        inputReference: interp.id,
        derivationRule: interp.ruleVersion || ruleVersion,
        lineageSource
      },
      payload: {
        rationale: interp.rationale,
        limitations: interp.limitations,
        safetyBoundaries: interp.safetyBoundaries
      }
    });
  }

  return {
    evidenceItems,
    missingItems,
    knowledgeVersion,
    ruleVersion
  };
}
