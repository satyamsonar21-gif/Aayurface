// ============================================================
// AayurFace — Multimodal Fusion Constants & Rules Metadata
// Phase 12: Multimodal Fusion, Evidence Agreement & Uncertainty Engine
// ============================================================

export const CURRENT_FUSION_VERSION = 'fusion-v1.0.0';
export const CURRENT_FUSION_SCHEMA_VERSION = 'fusion-schema-v1.0.0';
export const CURRENT_FUSION_CONFIG_VERSION = 'fusion-config-v1.0.0';

export const FUSION_SAFETY_LIMITS = {
  // Hard ceiling: An uncorroborated single observation cannot exceed this strength
  MAX_SINGLE_MODALITY_STRENGTH: 'LOW' as const,

  // Hard ceiling: An assessment with UNRESOLVED_CONFLICT or MATERIAL_CONFLICT cannot exceed this
  MAX_CONFLICT_STRENGTH: 'LOW' as const,

  // Hard ceiling: An assessment with UNCERTAIN input cannot exceed this
  MAX_UNCERTAIN_STRENGTH: 'LOW' as const,

  // Hard ceiling: Visual facial observation can NEVER directly diagnose Prakriti or Dosha
  FACE_DIAGNOSIS_FORBIDDEN: true,
  PRAKRITI_INFERENCE_FROM_FACE_FORBIDDEN: true,

  // Machine-readable safety disclaimer
  STANDARD_DISCLAIMER:
    'Facial observations and Ayurvedic correlations are non-diagnostic wellness recordings and do not constitute clinical or constitutional diagnosis.'
} as const;

export const FUSION_SECURITY_BOUNDARIES = {
  // Trust model clarification: Client-side execution is not a cryptographic or authoritative security boundary.
  // Authoritative tamper resistance requires server-side evaluation.
  CLIENT_EXECUTION_BOUNDARY: 'client-side provenance normalization and structural sanitization' as const,
  DETERMINISM_SPECIFICATION:
    'Identical inputs produce deterministic evaluation states, conflict states, and rule transitions; timestamps and evaluation IDs are generated per invocation.' as const
} as const;

