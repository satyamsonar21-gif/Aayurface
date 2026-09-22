// ============================================================
// AayurFace — Standardized Capture Gateway Types
// Phase 09: Canonical Capture Artifact and Quality Engine Contracts
// ============================================================

export type CaptureSource = 'camera' | 'upload';

export type CaptureMode = 'manual' | 'upload';

export type QualityStatus = 'PASS' | 'WARN' | 'FAIL';

export type QualityCheckId = 'resolution' | 'exposure' | 'sharpness' | 'integrity';

export interface QualityCheck {
  id: QualityCheckId;
  name: string;
  status: QualityStatus;
  score?: number;
  message: string;
  actionableGuidance?: string;
}

export interface CaptureQualityResult {
  status: QualityStatus;
  checks: QualityCheck[];
  prioritizedGuidance: string[];
  evaluatedAt: string;
  ruleVersion: 'v1-heuristic';
}

export interface CaptureArtifact {
  id: string;
  source: CaptureSource;
  image: string; // Standardized sRGB JPEG Data URL
  originalWidth: number;
  originalHeight: number;
  standardizedWidth: number;
  standardizedHeight: number;
  mimeType: string;
  capturedAt: string;
  captureMode: CaptureMode;
  quality: CaptureQualityResult;
  schemaVersion: 'capture-schema-v1';
  gatewayVersion: 'gateway-v1';
}

export type CameraState =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'capturing'
  | 'analyzingQuality'
  | 'preview'
  | 'qualityRejected'
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

export interface StandardizedImageResult {
  dataUrl: string;
  mimeType: string;
  originalWidth: number;
  originalHeight: number;
  standardizedWidth: number;
  standardizedHeight: number;
  wasResized: boolean;
  wasCropped: boolean;
  aspectRatio: string;
}
