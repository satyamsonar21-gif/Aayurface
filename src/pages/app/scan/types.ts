// ============================================================
// AayurFace — Scan Skin Engine Types
// Phase 06.7: Camera State Machine & Guidance Types
// ============================================================

export type CameraState =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'capturing'
  | 'preview'
  | 'permissionDenied'
  | 'cameraUnavailable'
  | 'captureError';

export interface CameraErrorDetails {
  type: 'permissionDenied' | 'cameraUnavailable' | 'captureError';
  message: string;
  suggestedAction?: string;
  rawErrorName?: string;
}

export interface GuidanceItem {
  id: string;
  title: string;
  description: string;
}
