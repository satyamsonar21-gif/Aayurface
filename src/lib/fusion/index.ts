// ============================================================
// AayurFace — Multimodal Fusion Module (Phase 12)
// Public API & Core Exports
// ============================================================

export * from '@/types/fusion';
export * from './constants';
export { evaluateMultimodalFusion, type FusionEngineInput } from './fusionEngine';
export { evaluateEvidenceAgreement } from './agreementEngine';
export { evaluateEvidenceConflicts } from './conflictEngine';
export { evaluateUncertaintyAndCeilings } from './uncertaintyEngine';
export { normalizePhase10CVResult } from './adapters/phase10Adapter';
export { normalizePhase11InterpretationSet } from './adapters/phase11Adapter';
export { normalizeUserContext } from './adapters/userContextAdapter';
