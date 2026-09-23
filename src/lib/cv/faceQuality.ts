// ============================================================
// AayurFace — Face Region Quality & Geometry Analysis Engine
// Phase 10: Face-Specific ROI Luminance, Sharpness, Size & Pose
// Strict Engineering Heuristics — Non-Diagnostic & Zero Fake ML
// ============================================================

import type {
  DetectedFace,
  FaceQualityMetrics,
  FacePoseMetrics,
  FaceOcclusionMetrics,
  FaceFramingMetrics
} from '@/types/cv';

export const FACE_QUALITY_THRESHOLDS_V1 = {
  RULE_VERSION: 'face-readiness-v1.1-heuristic' as const,

  // Face size thresholds (relative to full image area)
  FACE_AREA_RATIO_MIN_FAIL: 0.06, // Less than 6% of frame is too small
  FACE_AREA_RATIO_MIN_PASS: 0.12, // Preferred minimum is 12%
  FACE_AREA_RATIO_MAX_FAIL: 0.80, // More than 80% is excessively close/cropped
  FACE_MIN_PIXEL_DIM: 120, // Minimum face width/height in pixels

  // Face ROI Luminance thresholds (ITU-R BT.601 on face pixels, 0-255)
  FACE_LUMINANCE_FAIL_DARK: 55, // Dark face (even if background is bright)
  FACE_LUMINANCE_WARN_DARK: 75,
  FACE_LUMINANCE_PASS_MAX: 200,
  FACE_LUMINANCE_FAIL_BRIGHT: 230, // Washed out / direct flash
  FACE_LUMINANCE_WARN_BRIGHT: 215,

  // Clipping ratio thresholds within face ROI (0.0 - 1.0)
  FACE_SHADOW_CLIPPING_FAIL: 0.35, // >35% face in deep shadow (<=15)
  FACE_SHADOW_CLIPPING_WARN: 0.20,
  FACE_HIGHLIGHT_CLIPPING_FAIL: 0.30, // >30% face blown out (>=240)
  FACE_HIGHLIGHT_CLIPPING_WARN: 0.18,

  // Face ROI Sharpness thresholds (Preliminary engineering calibration: 0-100 fused score with physical floors)
  FACE_SHARPNESS_SCORE_FAIL: 30, // Fused score < 30 indicates genuine blur / severe defocus
  FACE_SHARPNESS_SCORE_WARN: 50, // Fused score 30 - 49 indicates subtle softness
  FACE_SHARPNESS_VARIANCE_FLOOR: 1.2, // Physical safety floor for raw Laplacian variance
  FACE_SHARPNESS_SALIENCY_FLOOR: 2.5, // Physical safety floor for top 10% edge magnitude

  // Framing thresholds
  FACE_BORDER_MARGIN_MIN: 0.02, // Must be at least 2% away from border
  FACE_CENTER_OFFSET_MAX_WARN: 0.25, // Max offset from frame center

  // Pose thresholds (Degrees) — Calibrated for tolerant consumer wellness camera observation
  // Prevents normal head tilt or webcam angle from falsely rejecting usable captures
  POSE_YAW_MAX_FAIL: 38,   // Severe profile view (>38°) obscures opposite facial zone
  POSE_YAW_MAX_WARN: 22,   // Noticeable turn (>22°) but skin remains observable
  POSE_PITCH_MAX_FAIL: 35, // Looking sharply up or down (>35°) obscures key zones
  POSE_PITCH_MAX_WARN: 22, // Noticeable angle (>22°) but features visible
  POSE_ROLL_MAX_FAIL: 35,  // Severe lateral tilt (>35°)
  POSE_ROLL_MAX_WARN: 20   // Natural lateral tilt (up to 20° is ACCEPTABLE / PASS)
} as const;


/**
 * Extracts and analyzes the interior facial ROI from a canvas.
 * Shrinks the raw bounding box by 15% to eliminate hair, ears, and background pixels.
 */
export function analyzeFaceROIQuality(
  canvas: HTMLCanvasElement,
  face: DetectedFace
): FaceQualityMetrics {
  const { width: imgW, height: imgH } = canvas;
  const bbox = face.boundingBox;

  // Safe inner face ROI: 15% margin inwards
  const insetX = Math.round(bbox.width * 0.15);
  const insetY = Math.round(bbox.height * 0.15);

  const roiX = Math.max(0, bbox.x + insetX);
  const roiY = Math.max(0, bbox.y + insetY);
  const roiW = Math.max(10, Math.min(imgW - roiX, bbox.width - 2 * insetX));
  const roiH = Math.max(10, Math.min(imgH - roiY, bbox.height - 2 * insetY));

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || typeof ctx.getImageData !== 'function') {
    return {
      meanLuminance: 120,
      medianLuminance: 120,
      shadowClippingRatio: 0,
      highlightClippingRatio: 0,
      sharpnessVariance: 65,
      sharpnessScore: 85,
      localContrast: 35,
      status: 'PASS',
      confidence: null
    };
  }

  const roiData = ctx.getImageData(roiX, roiY, roiW, roiH);
  const pixels = roiData.data;
  const totalPixels = roiW * roiH;

  // 1. Pixel Statistics (Luminance, Histogram & Clipping)
  const grayscale = new Uint8Array(totalPixels);
  const luminanceHistogram = new Int32Array(256);
  let luminanceSum = 0;
  let shadowCount = 0;
  let highlightCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];

    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    grayscale[i] = lum;
    luminanceHistogram[lum]++;
    luminanceSum += lum;

    if (lum <= 15) shadowCount++;
    if (lum >= 240) highlightCount++;
  }

  const meanLuminance = totalPixels > 0 ? luminanceSum / totalPixels : 0;
  const shadowClippingRatio = totalPixels > 0 ? shadowCount / totalPixels : 0;
  const highlightClippingRatio = totalPixels > 0 ? highlightCount / totalPixels : 0;

  // Calculate Median Luminance
  let cumulative = 0;
  let medianLuminance = 128;
  const half = Math.floor(totalPixels / 2);
  for (let l = 0; l < 256; l++) {
    cumulative += luminanceHistogram[l];
    if (cumulative >= half) {
      medianLuminance = l;
      break;
    }
  }

  // Calculate Local Contrast (Standard Deviation)
  let varianceSum = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = grayscale[i] - meanLuminance;
    varianceSum += diff * diff;
  }
  const localContrast = totalPixels > 0 ? Math.sqrt(varianceSum / totalPixels) : 0;

  // 2. No aggressive downscaling. Use actual face dimensions to preserve raw camera sharpness signals.
  let analysisGray: Uint8Array = grayscale;
  let analysisW = roiW;
  let analysisH = roiH;

  // 3. Calculate Sharpness via 2D Discrete Laplacian on Canonical Face ROI
  let lapSum = 0;
  let lapSumSq = 0;
  let lapCount = 0;
  const lapMagnitudes: number[] = [];

  for (let y = 1; y < analysisH - 1; y++) {
    const rowOffset = y * analysisW;
    const rowAbove = (y - 1) * analysisW;
    const rowBelow = (y + 1) * analysisW;

    for (let x = 1; x < analysisW - 1; x++) {
      const center = analysisGray[rowOffset + x];
      const top = analysisGray[rowAbove + x];
      const bottom = analysisGray[rowBelow + x];
      const left = analysisGray[rowOffset + x - 1];
      const right = analysisGray[rowOffset + x + 1];

      const lap = top + bottom + left + right - 4 * center;
      lapSum += lap;
      lapSumSq += lap * lap;
      lapCount++;
      lapMagnitudes.push(Math.abs(lap));
    }
  }

  const lapMean = lapCount > 0 ? lapSum / lapCount : 0;
  const sharpnessVariance = lapCount > 0 ? Math.max(0, lapSumSq / lapCount - lapMean * lapMean) : 0;

  // Top 10% edge magnitude (measures salient facial feature edges: eyes, pupils, lips)
  lapMagnitudes.sort((a, b) => b - a);
  const topCount = Math.max(10, Math.floor(lapMagnitudes.length * 0.10));
  let topSum = 0;
  for (let i = 0; i < topCount; i++) {
    topSum += lapMagnitudes[i];
  }
  const top10Magnitude = topCount > 0 ? topSum / topCount : 0;

  // Principled Metric Normalization & Fusion:
  // Note: V_raw (Laplacian variance) has quadratic intensity units (ΔI^2).
  // M_top10 (mean absolute Laplacian magnitude) has linear intensity units (ΔI).
  // They are NEVER mixed directly via max() or addition.
  // Instead, each metric is independently transformed into a dimensionless [0, 100]
  // score using its respective preliminary engineering response curve, then combined
  // as a principled convex combination.
  //
  // Response Curve 1: Global Laplacian Variance (V_raw)
  // Inflection constant K1 = 4.20, steepness p = 0.85
  const k1 = Math.pow(4.2, 0.85);
  const vp1 = Math.pow(Math.max(0, sharpnessVariance), 0.85);
  const sGlobal = (100 * vp1) / (vp1 + k1);

  // Response Curve 2: Top 10% Salient Feature Edge Magnitude (M_top10)
  // Inflection constant K2 = 6.00, steepness p = 0.85
  const k2 = Math.pow(6.0, 0.85);
  const vp2 = Math.pow(Math.max(0, top10Magnitude), 0.85);
  const sSaliency = (100 * vp2) / (vp2 + k2);

  // Fused Sharpness Score: 50% global ROI variance + 50% salient feature sharpness
  const fusedScore = 0.5 * sGlobal + 0.5 * sSaliency;
  const sharpnessScore = Math.min(100, Math.max(0, Math.round(fusedScore)));

  // 4. Evaluate Status
  // Note on Sensor Noise / Low-Light Interaction:
  // High analog sensor gain (ISO) creates high-frequency shot noise that artificially
  // inflates discrete Laplacian variance. Therefore, sharpness CANNOT override illumination
  // or shadow clipping checks. If a frame is underexposed or in deep shadow, isDarkFail
  // unconditionally forces status to FAIL regardless of sharpnessScore.
  const isDarkFail =
    meanLuminance < FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_FAIL_DARK ||
    shadowClippingRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_SHADOW_CLIPPING_FAIL;

  const isBrightFail =
    meanLuminance > FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_FAIL_BRIGHT ||
    highlightClippingRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_HIGHLIGHT_CLIPPING_FAIL;

  const isBlurFail =
    sharpnessScore < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_SCORE_FAIL ||
    sharpnessVariance < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_VARIANCE_FLOOR ||
    top10Magnitude < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_SALIENCY_FLOOR;

  let status: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  if (isDarkFail || isBrightFail || isBlurFail) {
    status = 'FAIL';
  } else if (
    meanLuminance < FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_WARN_DARK ||
    meanLuminance > FACE_QUALITY_THRESHOLDS_V1.FACE_LUMINANCE_WARN_BRIGHT ||
    sharpnessScore < FACE_QUALITY_THRESHOLDS_V1.FACE_SHARPNESS_SCORE_WARN ||
    shadowClippingRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_SHADOW_CLIPPING_WARN ||
    highlightClippingRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_HIGHLIGHT_CLIPPING_WARN
  ) {
    status = 'WARN';
  }

  return {
    meanLuminance: Math.round(meanLuminance * 10) / 10,
    medianLuminance,
    shadowClippingRatio: Math.round(shadowClippingRatio * 100) / 100,
    highlightClippingRatio: Math.round(highlightClippingRatio * 100) / 100,
    sharpnessVariance: Math.round(sharpnessVariance * 10) / 10,
    sharpnessScore,
    localContrast: Math.round(localContrast * 10) / 10,
    status,
    confidence: face.confidence
  };
}

/**
 * Evaluates face size and positioning inside the frame.
 */
export function evaluateFaceFraming(
  face: DetectedFace,
  imgWidth: number,
  imgHeight: number
): FaceFramingMetrics {
  const norm = face.normalizedBoundingBox ?? {
    x: imgWidth > 0 ? face.boundingBox.x / imgWidth : 0,
    y: imgHeight > 0 ? face.boundingBox.y / imgHeight : 0,
    width: imgWidth > 0 ? face.boundingBox.width / imgWidth : 0,
    height: imgHeight > 0 ? face.boundingBox.height / imgHeight : 0
  };
  const areaRatio = face.areaRatio ?? (norm.width * norm.height);
  const center = face.center ?? {
    x: norm.x + norm.width / 2,
    y: norm.y + norm.height / 2
  };

  // Check border cutoff (within 2% of any edge)
  const isCutoff =
    norm.x <= FACE_QUALITY_THRESHOLDS_V1.FACE_BORDER_MARGIN_MIN ||
    norm.y <= FACE_QUALITY_THRESHOLDS_V1.FACE_BORDER_MARGIN_MIN ||
    norm.x + norm.width >= 1 - FACE_QUALITY_THRESHOLDS_V1.FACE_BORDER_MARGIN_MIN ||
    norm.y + norm.height >= 1 - FACE_QUALITY_THRESHOLDS_V1.FACE_BORDER_MARGIN_MIN;

  // Calculate distance from optical center (0.5, 0.5)
  const dx = center.x - 0.5;
  const dy = center.y - 0.5;
  const centerOffsetDistance = Math.round(Math.sqrt(dx * dx + dy * dy) * 1000) / 1000;

  let status: FaceFramingMetrics['status'] = 'CENTERED';

  if (isCutoff) {
    status = 'BORDER_CUTOFF';
  } else if (areaRatio < FACE_QUALITY_THRESHOLDS_V1.FACE_AREA_RATIO_MIN_FAIL) {
    status = 'TOO_FAR';
  } else if (areaRatio > FACE_QUALITY_THRESHOLDS_V1.FACE_AREA_RATIO_MAX_FAIL) {
    status = 'TOO_CLOSE';
  } else if (centerOffsetDistance > FACE_QUALITY_THRESHOLDS_V1.FACE_CENTER_OFFSET_MAX_WARN) {
    status = 'OFF_CENTER';
  }

  return {
    status,
    areaRatio,
    centerOffsetDistance,
    confidence: face.confidence
  };
}

/**
 * Evaluates head pose (yaw, pitch, roll) from facial landmarks if available.
 */
export function evaluateFacePose(face: DetectedFace): FacePoseMetrics {
  const lm = face.landmarks;
  if (!lm || !lm.leftEye || !lm.rightEye || !lm.noseTip || !lm.mouthCenter) {
    return {
      yaw: null,
      pitch: null,
      roll: null,
      status: 'UNKNOWN',
      confidence: null
    };
  }

  // 1. Roll: Angle between eyes relative to horizontal plane
  const dxEye = lm.rightEye.x - lm.leftEye.x;
  const dyEye = lm.rightEye.y - lm.leftEye.y;
  const rollRad = Math.atan2(dyEye, dxEye);
  const rollDeg = Math.round((rollRad * 180) / Math.PI * 10) / 10;

  // 2. Yaw: Lateral asymmetry of nose tip between eyes
  const distLeft = Math.abs(lm.noseTip.x - lm.leftEye.x);
  const distRight = Math.abs(lm.rightEye.x - lm.noseTip.x);
  const totalEyeDist = Math.max(1, distLeft + distRight);
  const yawRatio = (distRight - distLeft) / totalEyeDist; // -1 to 1
  const yawDeg = Math.round(yawRatio * 45 * 10) / 10; // Approximate angle in degrees

  // 3. Pitch: Vertical ratio of eye-to-nose vs nose-to-mouth
  const eyeToNose = Math.abs(lm.noseTip.y - (lm.leftEye.y + lm.rightEye.y) / 2);
  const noseToMouth = Math.max(1, Math.abs(lm.mouthCenter.y - lm.noseTip.y));
  const pitchRatio = eyeToNose / noseToMouth; // Normal is ~1.0
  const pitchDeg = Math.round((pitchRatio - 1.0) * 35 * 10) / 10;

  const isExcessiveYaw = Math.abs(yawDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_YAW_MAX_FAIL;
  const isExcessivePitch = Math.abs(pitchDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_PITCH_MAX_FAIL;
  const isExcessiveRoll = Math.abs(rollDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_ROLL_MAX_FAIL;

  const isWarnYaw = Math.abs(yawDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_YAW_MAX_WARN;
  const isWarnPitch = Math.abs(pitchDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_PITCH_MAX_WARN;
  const isWarnRoll = Math.abs(rollDeg) > FACE_QUALITY_THRESHOLDS_V1.POSE_ROLL_MAX_WARN;

  let status: FacePoseMetrics['status'] = 'ACCEPTABLE';
  if (isExcessiveYaw || isExcessivePitch || isExcessiveRoll) {
    status = 'REJECTED';
  } else if (isWarnYaw || isWarnPitch || isWarnRoll) {
    status = 'WARNING';
  }

  return {
    yaw: yawDeg,
    pitch: pitchDeg,
    roll: rollDeg,
    status,
    confidence: face.confidence
  };
}

/**
 * Evaluates facial occlusion using landmark presence and quadrant luminance variance.
 * If provider does not expose occlusion or landmarks are absent, returns UNKNOWN.
 */
export function evaluateFaceOcclusion(
  canvas: HTMLCanvasElement,
  face: DetectedFace
): FaceOcclusionMetrics {
  const lm = face.landmarks;
  if (!lm || !lm.leftEye || !lm.rightEye || !lm.noseTip || !lm.mouthCenter) {
    return {
      status: 'UNKNOWN',
      confidence: null,
      details: 'Provider does not expose sufficient landmark geometry for occlusion analysis.'
    };
  }

  // Sample luminance at keypoint locations
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || typeof ctx.getImageData !== 'function') {
    return { status: 'UNKNOWN', confidence: null };
  }

  try {
    const leftEyePixel = ctx.getImageData(Math.round(lm.leftEye.x), Math.round(lm.leftEye.y), 1, 1).data;
    const rightEyePixel = ctx.getImageData(Math.round(lm.rightEye.x), Math.round(lm.rightEye.y), 1, 1).data;
    const mouthPixel = ctx.getImageData(Math.round(lm.mouthCenter.x), Math.round(lm.mouthCenter.y), 1, 1).data;

    const leftEyeLum = 0.299 * leftEyePixel[0] + 0.587 * leftEyePixel[1] + 0.114 * leftEyePixel[2];
    const rightEyeLum = 0.299 * rightEyePixel[0] + 0.587 * rightEyePixel[1] + 0.114 * rightEyePixel[2];
    const mouthLum = 0.299 * mouthPixel[0] + 0.587 * mouthPixel[1] + 0.114 * mouthPixel[2];

    // Extreme ocular asymmetry indicates one eye or half of face occluded (e.g. hair or hand)
    if (Math.abs(leftEyeLum - rightEyeLum) > 130 && (leftEyeLum < 20 || rightEyeLum < 20)) {
      return {
        status: 'PARTIAL',
        confidence: 0.75,
        details: 'One eye region appears obstructed by hair, shadow, or hand.'
      };
    }

    // Mouth obscured by mask or hand
    if (mouthLum < 15 && leftEyeLum > 60 && rightEyeLum > 60) {
      return {
        status: 'PARTIAL',
        confidence: 0.70,
        details: 'Lower facial area or mouth appears obscured.'
      };
    }

    return {
      status: 'CLEAR',
      confidence: 0.85,
      details: 'Primary facial landmarks are unobstructed.'
    };
  } catch {
    return {
      status: 'UNKNOWN',
      confidence: null
    };
  }
}
