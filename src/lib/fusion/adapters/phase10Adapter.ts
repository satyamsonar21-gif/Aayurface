// ============================================================
// AayurFace — Phase 10 CV Adapter for Multimodal Fusion
// Normalizes Phase 10 CVResult into Canonical Fusion Evidence
// Strict Boundary: Preserves Uncertainty, Rejects Spoofed Probabilities
// ============================================================

import type { CVResult } from '@/types/cv';
import type {
  FusionEvidenceItem,
  MissingEvidenceItem,
  SupportedVisualObservationType
} from '@/types/fusion';

export interface Phase10AdapterOutput {
  evidenceItems: FusionEvidenceItem[];
  missingItems: MissingEvidenceItem[];
  cvVersion: string;
}

export function normalizePhase10CVResult(cvResult: CVResult | null | undefined): Phase10AdapterOutput {
  const missingItems: MissingEvidenceItem[] = [];
  const evidenceItems: FusionEvidenceItem[] = [];

  // 1. Missing or Null CV Result Guard
  if (!cvResult) {
    missingItems.push({
      modality: 'VISUAL',
      expectedItem: 'CV_READINESS_RESULT',
      reason: 'NOT_CAPTURED',
      impactOnFusion: 'No visual facial observation data available from Phase 10.'
    });
    missingItems.push({
      modality: 'VISUAL',
      expectedItem: 'SURFACE_SKIN_FEATURES',
      reason: 'NOT_AVAILABLE',
      impactOnFusion: 'Surface visual observations cannot be evaluated.'
    });

    return {
      evidenceItems: [],
      missingItems,
      cvVersion: 'cv-missing'
    };
  }

  const cvVersion = `${cvResult.provider || 'unknown'}-${cvResult.providerVersion || '0.0.0'}-${cvResult.schemaVersion || 'v1'}`;
  const timestamp = cvResult.analyzedAt || new Date().toISOString();

  // 2. Evaluate Readiness Status
  if (cvResult.readiness?.status === 'REJECTED') {
    // Rejected capture cannot produce trusted facial observations
    evidenceItems.push({
      id: `ev-cv-rejected-${cvResult.artifactId || 'art'}`,
      modality: 'VISUAL',
      observationType: 'FACE_GEOMETRY_METRICS',
      state: 'INSUFFICIENT_EVIDENCE',
      strength: 'NONE',
      usageStatus: 'DISCOUNTED',
      statusReason: `Capture rejected by Phase 10 readiness gate: ${cvResult.readiness.reasons?.[0]?.message || 'Quality failure'}`,
      provenance: {
        source: cvResult.provider || 'cv-gateway',
        sourceType: 'SYSTEM_DERIVED',
        sourceVersion: cvVersion,
        timestamp,
        origin: 'GATEWAY',
        inputReference: cvResult.artifactId,
        derivationRule: 'phase-10-rejection-discount'
      },
      payload: {
        readinessStatus: 'REJECTED',
        reasons: cvResult.readiness.reasons || []
      }
    });

    missingItems.push({
      modality: 'VISUAL',
      expectedItem: 'HIGH_QUALITY_FACE_OBSERVATION',
      reason: 'INSUFFICIENT_QUALITY',
      impactOnFusion: 'Poor framing, blur, or severe pose prevents reliable visual feature observation.'
    });

    return {
      evidenceItems,
      missingItems,
      cvVersion
    };
  }

  // 3. Accepted Face Observation (READY or WARNING)
  const isWarning = cvResult.readiness?.status === 'WARNING';
  evidenceItems.push({
    id: `ev-cv-readiness-${cvResult.artifactId || 'art'}`,
    modality: 'VISUAL',
    observationType: 'FACE_GEOMETRY_METRICS',
    state: isWarning ? 'PARTIALLY_SUPPORTED' : 'SUPPORTED',
    strength: isWarning ? 'LOW' : 'MODERATE',
    usageStatus: 'USED',
    statusReason: isWarning
      ? 'Facial geometry is usable with minor warnings (sub-optimal lighting or subtle tilt).'
      : 'Facial framing, illumination, and sharpness verified by Phase 10 gate.',
    provenance: {
      source: cvResult.provider || 'cv-gateway',
      sourceType: 'SYSTEM_DERIVED',
      sourceVersion: cvVersion,
      timestamp,
      origin: 'GATEWAY',
      inputReference: cvResult.artifactId,
      derivationRule: 'phase-10-readiness-normalization',
      lineageSource: 'PRIMARY_VISUAL'
    },
    payload: {
      readinessStatus: cvResult.readiness?.status,
      faceCount: cvResult.faceDetection?.faceCount || 1,
      sharpnessScore: cvResult.faceQuality?.sharpnessScore,
      meanLuminance: cvResult.faceQuality?.meanLuminance,
      framingStatus: cvResult.framing?.status,
      poseStatus: cvResult.pose?.status
    }
  });

  // 4. Trace Surface Skin Observations
  // Phase 10 establishes Face Observation readiness; granular skin segmentation (redness, dryness, shine)
  // is deliberately guarded as NOT_ASSESSED to prevent fake diagnostic claims until future dedicated phases.
  const requiredVisualObservations: SupportedVisualObservationType[] = [
    'REDNESS_LIKE_APPEARANCE',
    'DRYNESS_LIKE_APPEARANCE',
    'SHINE_LIKE_APPEARANCE'
  ];

  for (const obsType of requiredVisualObservations) {
    missingItems.push({
      modality: 'VISUAL',
      expectedItem: obsType,
      reason: 'NOT_ASSESSED',
      impactOnFusion: 'Granular skin chrominance segmentation is preserved as unassessed in this release.'
    });

    evidenceItems.push({
      id: `ev-cv-unassessed-${obsType.toLowerCase()}`,
      modality: 'VISUAL',
      observationType: obsType,
      state: 'NOT_ASSESSED',
      strength: 'NONE',
      usageStatus: 'NOT_ASSESSED',
      statusReason: 'Observation not assessed by client CV gateway in this phase.',
      provenance: {
        source: 'phase-10-cv-boundary',
        sourceType: 'SYSTEM_DERIVED',
        sourceVersion: cvVersion,
        timestamp,
        origin: 'GATEWAY',
        derivationRule: 'unassessed-boundary-enforcement',
        lineageSource: 'PRIMARY_VISUAL'
      },
      payload: { observationType: obsType }
    });
  }

  return {
    evidenceItems,
    missingItems,
    cvVersion
  };
}
