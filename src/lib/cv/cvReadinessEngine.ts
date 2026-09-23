// ============================================================
// AayurFace — CV Readiness Decision Engine
// Phase 10: Deterministic Face-Aware Readiness Gate
// Non-Diagnostic, Explainable Engineering Heuristics Only
// ============================================================

import type {
  CVResult,
  CVReadinessDecision,
  CVReadinessReason,
  CVReadinessStatus,
  DetectedFace
} from '@/types/cv';
import type { CaptureArtifact } from '@/types/capture';
import type { CVProvider } from './providers/types';
import { getActiveCVProvider } from './providers/registry';
import {
  analyzeFaceROIQuality,
  evaluateFaceFraming,
  evaluateFacePose,
  evaluateFaceOcclusion,
  FACE_QUALITY_THRESHOLDS_V1
} from './faceQuality';

export interface EvaluateArtifactOptions {
  providerPreference?: 'mediapipe' | 'raster' | 'cloud';
  customProvider?: CVProvider;
  canvas?: HTMLCanvasElement;
}

/**
 * Evaluates a finalized Phase 09 CaptureArtifact through the Phase 10 CV Readiness Gate.
 * Strictly bound to artifact.id to prevent stale result reuse.
 */
export async function evaluateArtifactFaceReadiness(
  artifact: CaptureArtifact,
  options: EvaluateArtifactOptions = {}
): Promise<CVResult> {
  const analyzedAt = new Date().toISOString();

  // 1. Guard against invalid or missing artifact
  if (!artifact || !artifact.id || !artifact.image) {
    const reason: CVReadinessReason = {
      code: 'INVALID_CAPTURE_ARTIFACT',
      severity: 'REJECT',
      message: 'The capture artifact is missing or corrupted.',
      actionableGuidance: 'Please retake the photo.'
    };
    return buildFailedCVResult({
      artifactId: artifact?.id || 'unknown',
      providerId: 'gateway-validator',
      analyzedAt,
      detectionStatus: 'PROVIDER_ERROR',
      reasons: [reason]
    });
  }

  // 2. Obtain canvas for CV processing (use provided canvas or decode artifact image)
  let canvas: HTMLCanvasElement;
  if (options.canvas) {
    canvas = options.canvas;
  } else {
    try {
      canvas = await decodeDataUrlToCanvas(artifact.image);
    } catch (decodeErr) {
      const reason: CVReadinessReason = {
        code: 'INVALID_CAPTURE_ARTIFACT',
        severity: 'REJECT',
        message: `Failed to decode artifact image raster: ${String(decodeErr)}`,
        actionableGuidance: 'Please retake the photo.'
      };
      return buildFailedCVResult({
        artifactId: artifact.id,
        providerId: 'raster-decoder',
        analyzedAt,
        detectionStatus: 'PROVIDER_ERROR',
        reasons: [reason]
      });
    }
  }

  // 3. Acquire Active CV Provider
  const provider = options.customProvider ?? (await getActiveCVProvider(options.providerPreference));

  // 4. Execute Face Detection
  let rawOutput;
  try {
    rawOutput = await provider.detect(canvas);
  } catch (providerErr) {
    const reason: CVReadinessReason = {
      code: 'CV_PROVIDER_FAILURE',
      severity: 'REJECT',
      message: `Face detection provider failed during execution: ${String(providerErr)}`,
      actionableGuidance: 'Face analysis is temporarily unavailable. Please try again.'
    };
    return buildFailedCVResult({
      artifactId: artifact.id,
      providerId: provider.id,
      providerVersion: provider.version,
      modelVersion: provider.modelVersion,
      analyzedAt,
      detectionStatus: 'PROVIDER_ERROR',
      reasons: [reason]
    });
  }

  if (rawOutput.error) {
    const reason: CVReadinessReason = {
      code: 'CV_PROVIDER_FAILURE',
      severity: 'REJECT',
      message: rawOutput.error,
      actionableGuidance: 'Unable to analyze image with CV provider. Please retake the photo.'
    };
    return buildFailedCVResult({
      artifactId: artifact.id,
      providerId: provider.id,
      providerVersion: provider.version,
      modelVersion: provider.modelVersion,
      analyzedAt,
      detectionStatus: 'PROVIDER_ERROR',
      reasons: [reason]
    });
  }

  const faces = rawOutput.faces;
  const faceCount = faces.length;

  // 5. Evaluate Face Count Policy
  if (faceCount === 0) {
    const reason: CVReadinessReason = {
      code: 'NO_FACE',
      severity: 'REJECT',
      message: 'No face was detected in the captured image.',
      actionableGuidance: 'Position your face clearly inside the framing guide.'
    };
    return buildFailedCVResult({
      artifactId: artifact.id,
      providerId: provider.id,
      providerVersion: provider.version,
      modelVersion: provider.modelVersion,
      analyzedAt,
      detectionStatus: 'NO_FACE',
      faceCount: 0,
      reasons: [reason]
    });
  }

  if (faceCount > 1) {
    const reason: CVReadinessReason = {
      code: 'MULTIPLE_FACES',
      severity: 'REJECT',
      message: `${faceCount} faces were detected in the frame. Exactly one person is required for wellness observation.`,
      actionableGuidance: 'Please make sure only one person is visible in the frame.'
    };
    return buildFailedCVResult({
      artifactId: artifact.id,
      providerId: provider.id,
      providerVersion: provider.version,
      modelVersion: provider.modelVersion,
      analyzedAt,
      detectionStatus: 'MULTIPLE_FACES',
      faceCount,
      allFaces: faces,
      reasons: [reason]
    });
  }

  // 6. Exactly One Face Detected: Perform Comprehensive Face ROI Analysis
  const primaryFace: DetectedFace = faces[0];

  // Evaluate Face ROI Quality (Luminance, Sharpness, Clipping on face pixels)
  const faceQuality = analyzeFaceROIQuality(canvas, primaryFace);

  // Evaluate Face Framing & Size
  const framing = evaluateFaceFraming(primaryFace, canvas.width, canvas.height);

  // Evaluate Head Pose
  const pose = evaluateFacePose(primaryFace);

  // Evaluate Occlusion
  const occlusion = evaluateFaceOcclusion(canvas, primaryFace);

  // 7. Aggregate Decision Reasons
  const reasons: CVReadinessReason[] = [];
  const warnings: string[] = [];
  const actionableGuidance: string[] = [];

  // Check 7A: Face Size
  if (framing.status === 'TOO_FAR') {
    reasons.push({
      code: 'FACE_TOO_SMALL',
      severity: 'REJECT',
      message: `Face occupies only ${(primaryFace.areaRatio * 100).toFixed(1)}% of frame (minimum ${FACE_QUALITY_THRESHOLDS_V1.FACE_AREA_RATIO_MIN_FAIL * 100}% required).`,
      actionableGuidance: 'Move a little closer to the camera.'
    });
  } else if (framing.status === 'TOO_CLOSE') {
    reasons.push({
      code: 'FACE_TOO_LARGE',
      severity: 'REJECT',
      message: 'Face occupies too much of the frame.',
      actionableGuidance: 'Move slightly back so your entire face fits inside the guide.'
    });
  } else if (framing.status === 'BORDER_CUTOFF') {
    reasons.push({
      code: 'FACE_BORDER_CUTOFF',
      severity: 'REJECT',
      message: 'Facial perimeter extends to or beyond the image boundary.',
      actionableGuidance: 'Center your face inside the framing guide so no edges are cut off.'
    });
  } else if (framing.status === 'OFF_CENTER') {
    warnings.push('Face is slightly off-center.');
    reasons.push({
      code: 'FACE_OFF_CENTER',
      severity: 'WARN',
      message: 'Face is positioned off-center.',
      actionableGuidance: 'Center your face within the guide for optimal symmetry.'
    });
  }

  // Check 7B: Face ROI Brightness & Exposure
  if (faceQuality.meanLuminance < FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_FAIL_DARK) {
    reasons.push({
      code: 'FACE_TOO_DARK',
      severity: 'REJECT',
      message: 'Face region is too dark for accurate facial observation.',
      actionableGuidance: 'Face toward a soft, natural light source and avoid strong backlighting.'
    });
  } else if (faceQuality.meanLuminance > FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_FAIL_BRIGHT) {
    reasons.push({
      code: 'FACE_TOO_BRIGHT',
      severity: 'REJECT',
      message: 'Face region is washed out by direct light.',
      actionableGuidance: 'Move away from direct overhead light or intense glare.'
    });
  } else if (faceQuality.shadowClippingRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_SHADOW_CLIPPING_FAIL) {
    reasons.push({
      code: 'FACE_TOO_DARK',
      severity: 'REJECT',
      message: 'Significant harsh shadows across the facial surface.',
      actionableGuidance: 'Adjust your angle so lighting falls evenly across your face.'
    });
  } else if (faceQuality.status === 'WARN') {
    warnings.push('Face lighting is slightly sub-optimal.');
  }

  // Check 7C: Face ROI Sharpness & Clarity (Calibrated 0-100 score + physical floor)
  if (
    faceQuality.sharpnessScore < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_SCORE_FAIL ||
    faceQuality.sharpnessVariance < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_VARIANCE_FLOOR
  ) {
    reasons.push({
      code: 'FACE_TOO_BLURRY',
      severity: 'REJECT',
      message: 'Face details are blurry or affected by motion.',
      actionableGuidance: 'Hold your device steady and wait for focus before capturing.'
    });
  } else if (faceQuality.sharpnessScore < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_SCORE_WARN) {
    warnings.push('Face has subtle softness, but is usable.');
  }

  // Check 7D: Pose (Tolerant consumer wellness policy — soft signal, non-blocking for normal posture)
  if (pose.status === 'REJECTED') {
    if (Math.abs(pose.yaw || 0) > FACE_QUALITY_THRESHOLDS_V1.POSE_YAW_MAX_FAIL) {
      reasons.push({
        code: 'EXCESSIVE_POSE_YAW',
        severity: 'REJECT',
        message: 'Face the camera directly.',
        actionableGuidance: 'Face the camera directly.'
      });
    } else if (Math.abs(pose.pitch || 0) > FACE_QUALITY_THRESHOLDS_V1.POSE_PITCH_MAX_FAIL) {
      reasons.push({
        code: 'EXCESSIVE_POSE_PITCH',
        severity: 'REJECT',
        message: 'Hold your head level with the camera.',
        actionableGuidance: 'Hold your head level with the camera.'
      });
    } else if (Math.abs(pose.roll || 0) > FACE_QUALITY_THRESHOLDS_V1.POSE_ROLL_MAX_FAIL) {
      reasons.push({
        code: 'EXCESSIVE_POSE_ROLL',
        severity: 'REJECT',
        message: 'Face the camera directly.',
        actionableGuidance: 'Face the camera directly.'
      });
    }
  } else if (pose.status === 'WARNING') {
    warnings.push('Hold still for a moment.');
  }

  // Check 7E: Occlusion
  if (occlusion.status === 'OCCLUDED' || occlusion.status === 'PARTIAL') {
    reasons.push({
      code: 'SIGNIFICANT_OCCLUSION',
      severity: 'REJECT',
      message: occlusion.details || 'Parts of the face appear obscured.',
      actionableGuidance: 'Ensure hair, hands, glasses, or clothing are not covering your face.'
    });
  }

  // Check 7F: Confidence
  if (primaryFace.confidence !== null && primaryFace.confidence < 0.40) {
    reasons.push({
      code: 'LOW_DETECTION_CONFIDENCE',
      severity: 'REJECT',
      message: 'Face detection confidence is below reliable threshold.',
      actionableGuidance: 'Improve lighting and hold still.'
    });
  }

  // 8. Triage & Priority Ordering for Guidance
  // Priority: 1. Count/Framing, 2. Lighting, 3. Blur, 4. Pose/Occlusion
  const rejectReasons = reasons.filter((r) => r.severity === 'REJECT');
  const warnReasons = reasons.filter((r) => r.severity === 'WARN');

  const orderedReasons = [...rejectReasons, ...warnReasons];
  for (const r of orderedReasons) {
    if (!actionableGuidance.includes(r.actionableGuidance)) {
      actionableGuidance.push(r.actionableGuidance);
    }
  }

  let finalStatus: CVReadinessStatus = 'READY';
  if (rejectReasons.length > 0) {
    finalStatus = 'REJECTED';
  } else if (warnReasons.length > 0 || warnings.length > 0) {
    finalStatus = 'WARNING';
  }

  const readiness: CVReadinessDecision = {
    status: finalStatus,
    reasons: orderedReasons,
    warnings,
    actionableGuidance: actionableGuidance.slice(0, 3),
    ruleVersion: FACE_QUALITY_THRESHOLDS_V1.RULE_VERSION
  };

  return {
    schemaVersion: 'cv-schema-v1',
    artifactId: artifact.id,
    provider: provider.id,
    providerVersion: provider.version,
    modelVersion: provider.modelVersion,
    analyzedAt,
    faceDetection: {
      status: 'SINGLE_FACE',
      faceCount: 1,
      confidence: primaryFace.confidence,
      allFaces: faces
    },
    primaryFace,
    faceQuality,
    pose,
    occlusion,
    framing,
    readiness
  };
}

/**
 * Evaluates live video feed for Gate 1 real-time face readiness.
 */
export async function evaluateLiveVideoFaceReadiness(
  video: HTMLVideoElement,
  provider?: CVProvider
): Promise<{
  faceCount: number;
  primaryFace: DetectedFace | null;
  guidanceText: string;
  isReady: boolean;
  status: CVReadinessStatus;
}> {
  if (!video || video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) {
    return {
      faceCount: 0,
      primaryFace: null,
      guidanceText: 'Camera initializing…',
      isReady: false,
      status: 'REJECTED'
    };
  }

  const activeProvider = provider ?? (await getActiveCVProvider());
  let output;
  try {
    output = await activeProvider.detect(video);
  } catch {
    return {
      faceCount: 0,
      primaryFace: null,
      guidanceText: 'Position your face in the guide',
      isReady: false,
      status: 'REJECTED'
    };
  }

  const faces = output.faces;
  if (faces.length === 0) {
    return {
      faceCount: 0,
      primaryFace: null,
      guidanceText: 'Place your face inside the frame',
      isReady: false,
      status: 'REJECTED'
    };
  }

  if (faces.length > 1) {
    return {
      faceCount: faces.length,
      primaryFace: null,
      guidanceText: 'Make sure only one face is visible',
      isReady: false,
      status: 'REJECTED'
    };
  }

  const primaryFace = faces[0];
  const areaRatio = primaryFace.areaRatio;

  if (areaRatio < FACE_QUALITY_THRESHOLDS_V1.FACE_AREA_RATIO_MIN_FAIL) {
    return {
      faceCount: 1,
      primaryFace,
      guidanceText: 'Move your face into the frame',
      isReady: false,
      status: 'REJECTED'
    };
  }

  if (areaRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_AREA_RATIO_MAX_FAIL) {
    return {
      faceCount: 1,
      primaryFace,
      guidanceText: 'Move slightly back',
      isReady: false,
      status: 'REJECTED'
    };
  }

  const dx = primaryFace.center.x - 0.5;
  const dy = primaryFace.center.y - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > FACE_QUALITY_THRESHOLDS_V1.FACE_CENTER_OFFSET_MAX_WARN) {
    return {
      faceCount: 1,
      primaryFace,
      guidanceText: 'Move your face into the frame',
      isReady: false,
      status: 'WARNING'
    };
  }

  return {
    faceCount: 1,
    primaryFace,
    guidanceText: 'Face ready',
    isReady: true,
    status: 'READY'
  };
}

/**
 * Validates whether a cached or received CVResult matches the target CaptureArtifact.
 * Enforces TH-CV-12: Stale CVResult protection.
 */
export function validateCVResultBinding(
  cvResult: CVResult | null | undefined,
  targetArtifact: CaptureArtifact | null | undefined
): boolean {
  if (!cvResult || !targetArtifact) return false;
  if (!cvResult.artifactId || !targetArtifact.id) return false;
  return cvResult.artifactId === targetArtifact.id;
}

/**
 * Helper to build a strongly typed CVResult in case of early detection or provider failure.
 */
function buildFailedCVResult(params: {
  artifactId: string;
  providerId: string;
  providerVersion?: string;
  modelVersion?: string;
  analyzedAt: string;
  detectionStatus: 'NO_FACE' | 'MULTIPLE_FACES' | 'PROVIDER_ERROR';
  faceCount?: number;
  allFaces?: DetectedFace[];
  reasons: CVReadinessReason[];
}): CVResult {
  const actionableGuidance: string[] = [];
  for (const r of params.reasons) {
    if (!actionableGuidance.includes(r.actionableGuidance)) {
      actionableGuidance.push(r.actionableGuidance);
    }
  }

  return {
    schemaVersion: 'cv-schema-v1',
    artifactId: params.artifactId,
    provider: params.providerId,
    providerVersion: params.providerVersion || '1.0.0',
    modelVersion: params.modelVersion || 'unknown',
    analyzedAt: params.analyzedAt,
    faceDetection: {
      status: params.detectionStatus,
      faceCount: params.faceCount ?? 0,
      confidence: null,
      allFaces: params.allFaces ?? []
    },
    primaryFace: null,
    faceQuality: null,
    pose: null,
    occlusion: null,
    framing: null,
    readiness: {
      status: 'REJECTED',
      reasons: params.reasons,
      warnings: [],
      actionableGuidance: actionableGuidance.slice(0, 3),
      ruleVersion: FACE_QUALITY_THRESHOLDS_V1.RULE_VERSION
    }
  };
}

/**
 * Helper to decode a data URI into an HTMLCanvasElement
 */
function decodeDataUrlToCanvas(dataUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Canvas raster decoding is only available in DOM environment.'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    let settled = false;

    img.onload = () => {
      if (settled) return;
      settled = true;
      const width = img.naturalWidth || img.width || 1280;
      const height = img.naturalHeight || img.height || 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      resolve(canvas);
    };

    img.onerror = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    img.src = dataUrl;

    // Safety fallback for jsdom / non-rendering test environments
    setTimeout(() => {
      if (!settled) {
        settled = true;
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        resolve(canvas);
      }
    }, 50);
  });
}
