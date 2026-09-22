// ============================================================
// AayurFace — Computer Vision & Face Readiness Contracts
// Phase 10: Face-Aware CV Layer & Readiness Decision Engine
// Strict Non-Diagnostic & Engineering Heuristic Governance
// ============================================================

export type CVReadinessStatus = 'READY' | 'WARNING' | 'REJECTED';

export type CVReadinessReasonCode =
  | 'NO_FACE'
  | 'MULTIPLE_FACES'
  | 'FACE_TOO_SMALL'
  | 'FACE_TOO_LARGE'
  | 'FACE_OFF_CENTER'
  | 'FACE_BORDER_CUTOFF'
  | 'FACE_TOO_DARK'
  | 'FACE_TOO_BRIGHT'
  | 'FACE_TOO_BLURRY'
  | 'EXCESSIVE_POSE_YAW'
  | 'EXCESSIVE_POSE_PITCH'
  | 'EXCESSIVE_POSE_ROLL'
  | 'SIGNIFICANT_OCCLUSION'
  | 'LOW_DETECTION_CONFIDENCE'
  | 'CV_PROVIDER_FAILURE'
  | 'INVALID_CAPTURE_ARTIFACT'
  | 'STALE_CV_RESULT';

export interface CVReadinessReason {
  code: CVReadinessReasonCode;
  severity: 'REJECT' | 'WARN';
  message: string;
  actionableGuidance: string;
}

export interface BoundingBox {
  x: number; // Top-left pixel X
  y: number; // Top-left pixel Y
  width: number; // Width in pixels
  height: number; // Height in pixels
}

export interface NormalizedBoundingBox {
  x: number; // 0.0 - 1.0 (relative to image width)
  y: number; // 0.0 - 1.0 (relative to image height)
  width: number; // 0.0 - 1.0
  height: number; // 0.0 - 1.0
}

export interface Point2D {
  x: number;
  y: number;
}

export interface FaceLandmarkPoints {
  leftEye?: Point2D;
  rightEye?: Point2D;
  noseTip?: Point2D;
  mouthCenter?: Point2D;
  leftEarTragion?: Point2D;
  rightEarTragion?: Point2D;
}

export interface DetectedFace {
  id: string;
  boundingBox: BoundingBox;
  normalizedBoundingBox: NormalizedBoundingBox;
  areaRatio: number; // Bounding box area / Image area
  center: Point2D; // Normalized (0.0 - 1.0)
  confidence: number | null; // null if provider does not expose confidence
  landmarks?: FaceLandmarkPoints;
}

export interface FaceQualityMetrics {
  meanLuminance: number; // 0 - 255 (ITU-R BT.601)
  medianLuminance: number; // 0 - 255
  shadowClippingRatio: number; // 0.0 - 1.0 (ratio of pixels <= 15)
  highlightClippingRatio: number; // 0.0 - 1.0 (ratio of pixels >= 240)
  sharpnessVariance: number; // 2D Discrete Laplacian variance (raw metric)
  sharpnessScore: number; // Calibrated 0 - 100 face sharpness score
  localContrast: number; // Standard deviation of luminance in ROI
  status: 'PASS' | 'WARN' | 'FAIL';
  confidence: number | null;
}

export interface FacePoseMetrics {
  yaw: number | null; // Degrees: negative = turned left, positive = turned right
  pitch: number | null; // Degrees: negative = looking down, positive = looking up
  roll: number | null; // Degrees: head tilt
  status: 'ACCEPTABLE' | 'WARNING' | 'REJECTED' | 'UNKNOWN';
  confidence: number | null;
}

export interface FaceOcclusionMetrics {
  status: 'CLEAR' | 'PARTIAL' | 'OCCLUDED' | 'UNKNOWN';
  confidence: number | null;
  details?: string;
}

export interface FaceFramingMetrics {
  status: 'CENTERED' | 'OFF_CENTER' | 'TOO_CLOSE' | 'TOO_FAR' | 'BORDER_CUTOFF';
  areaRatio: number;
  centerOffsetDistance: number; // Euclidean distance from center (0.5, 0.5)
  confidence: number | null;
}

export interface CVReadinessDecision {
  status: CVReadinessStatus;
  reasons: CVReadinessReason[];
  warnings: string[];
  actionableGuidance: string[];
  ruleVersion: 'face-readiness-v1-heuristic' | 'face-readiness-v1.1-heuristic';
}

export interface CVResult {
  schemaVersion: 'cv-schema-v1';
  artifactId: string; // Bound directly to CaptureArtifact.id
  provider: string; // e.g., 'browser-mediapipe' | 'browser-deterministic-raster' | 'cloud-rekognition-adapter'
  providerVersion: string;
  modelVersion: string;
  analyzedAt: string; // ISO 8601 UTC

  faceDetection: {
    status: 'NO_FACE' | 'SINGLE_FACE' | 'MULTIPLE_FACES' | 'PROVIDER_ERROR';
    faceCount: number;
    confidence: number | null;
    allFaces: DetectedFace[];
  };

  primaryFace: DetectedFace | null;
  faceQuality: FaceQualityMetrics | null;
  pose: FacePoseMetrics | null;
  occlusion: FaceOcclusionMetrics | null;
  framing: FaceFramingMetrics | null;

  readiness: CVReadinessDecision;

  // Extension point for Phase 11 & downstream skin features (strictly empty / null in Phase 10)
  skinFeaturesExtension?: null;
}
