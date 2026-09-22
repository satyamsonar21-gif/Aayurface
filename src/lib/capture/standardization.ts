// ============================================================
// AayurFace — Standardized Image Raster Pipeline
// Phase 09: Pure Deterministic Raster Normalization
// Strict Non-Diagnostic & Zero-Beautification Guarantee
// ============================================================

import type { StandardizedImageResult } from '@/types/capture';

export interface StandardizationOptions {
  maxDimension?: number;
  jpegQuality?: number;
  safeCropTo43?: boolean;
}

export const STANDARDIZATION_CONFIG = {
  MAX_DIMENSION: 1280,
  JPEG_QUALITY: 0.92,
  MIME_TYPE: 'image/jpeg',
  ASPECT_4_3: 4 / 3,
  ASPECT_3_4: 3 / 4,
} as const;

/**
 * Standardizes raw raster input into a deterministic, high-integrity sRGB image artifact.
 *
 * Guarantees:
 * 1. Zero beauty filters or skin smoothing.
 * 2. Zero artificial sharpening or color manipulation.
 * 3. Never upscales low-resolution inputs.
 * 4. Downscales oversized inputs to MAX_DIMENSION (1280px).
 * 5. Preserves subject framing without destructive cropping.
 */
export function standardizeCanvas(
  source: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement,
  options: StandardizationOptions = {}
): StandardizedImageResult {
  const maxDim = options.maxDimension ?? STANDARDIZATION_CONFIG.MAX_DIMENSION;
  const quality = options.jpegQuality ?? STANDARDIZATION_CONFIG.JPEG_QUALITY;

  // 1. Determine natural/intrinsic dimensions
  let originalWidth = 0;
  let originalHeight = 0;

  if ('videoWidth' in source && typeof source.videoWidth === 'number') {
    originalWidth = source.videoWidth;
    originalHeight = source.videoHeight;
  } else if ('naturalWidth' in source && typeof source.naturalWidth === 'number' && source.naturalWidth > 0) {
    originalWidth = source.naturalWidth;
    originalHeight = source.naturalHeight;
  } else if ('width' in source && 'height' in source) {
    originalWidth = source.width;
    originalHeight = source.height;
  }

  if (originalWidth <= 0 || originalHeight <= 0) {
    throw new Error(`[Standardization] Invalid source dimensions: ${originalWidth}x${originalHeight}`);
  }

  // 2. Framing & Aspect Ratio Policy
  // Preserves subject framing. Never blindly crop if it could remove vital facial boundaries.
  let srcX = 0;
  let srcY = 0;
  let srcW = originalWidth;
  let srcH = originalHeight;
  let wasCropped = false;

  if (options.safeCropTo43) {
    const currentRatio = originalWidth / originalHeight;
    // Only apply safe center-crop if difference from 4:3 is moderate (<15% excess)
    if (currentRatio > STANDARDIZATION_CONFIG.ASPECT_4_3 && currentRatio < 1.6) {
      const targetW = Math.round(originalHeight * STANDARDIZATION_CONFIG.ASPECT_4_3);
      srcX = Math.round((originalWidth - targetW) / 2);
      srcW = targetW;
      wasCropped = true;
    }
  }

  // 3. Resolution Scaling Policy
  // Downscale if exceeds max dimension. NEVER upscale low resolution images.
  const largestDimension = Math.max(srcW, srcH);
  let targetWidth = srcW;
  let targetHeight = srcH;
  let wasResized = false;

  if (largestDimension > maxDim) {
    const scaleFactor = maxDim / largestDimension;
    targetWidth = Math.max(1, Math.round(srcW * scaleFactor));
    targetHeight = Math.max(1, Math.round(srcH * scaleFactor));
    wasResized = true;
  }

  // 4. Render to clean standard canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('[Standardization] Failed to acquire 2D canvas rendering context.');
  }

  // Set high-quality resampling without artificial filters
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Paint the bounded raster
  ctx.drawImage(source, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);

  // 5. Encode clean JPEG output
  const dataUrl = canvas.toDataURL(STANDARDIZATION_CONFIG.MIME_TYPE, quality);

  return {
    dataUrl,
    mimeType: STANDARDIZATION_CONFIG.MIME_TYPE,
    originalWidth,
    originalHeight,
    standardizedWidth: targetWidth,
    standardizedHeight: targetHeight,
    wasResized,
    wasCropped,
    aspectRatio: `${targetWidth}:${targetHeight}`
  };
}

/**
 * Creates a versioned CaptureArtifact conforming to the canonical Phase 09 capture contract.
 */
export function createCaptureArtifact(params: {
  source: import('@/types/capture').CaptureSource;
  captureMode?: import('@/types/capture').CaptureMode;
  standardized: StandardizedImageResult;
  quality: import('@/types/capture').CaptureQualityResult;
}): import('@/types/capture').CaptureArtifact {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `cap-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    source: params.source,
    image: params.standardized.dataUrl,
    originalWidth: params.standardized.originalWidth,
    originalHeight: params.standardized.originalHeight,
    standardizedWidth: params.standardized.standardizedWidth,
    standardizedHeight: params.standardized.standardizedHeight,
    mimeType: params.standardized.mimeType,
    capturedAt: new Date().toISOString(),
    captureMode: params.captureMode ?? (params.source === 'upload' ? 'upload' : 'manual'),
    quality: params.quality,
    schemaVersion: 'capture-schema-v1',
    gatewayVersion: 'gateway-v1',
  };
}

/**
 * Renders an HTMLImageElement to an HTMLCanvasElement for raster analysis.
 */
export function decodeImageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  if (width <= 0 || height <= 0) {
    throw new Error(`[Standardization] Decoded image has invalid dimensions: ${width}x${height}`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('[Standardization] Failed to acquire 2D canvas context for decoded image.');
  }
  ctx.drawImage(img, 0, 0);
  return canvas;
}

