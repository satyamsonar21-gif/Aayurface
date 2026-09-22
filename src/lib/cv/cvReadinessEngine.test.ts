// ============================================================
// AayurFace — Computer Vision Readiness Engine Unit Tests
// Phase 10: Face-Aware Computer Vision & CV Readiness Gate
// Strict Non-Diagnostic Quality Gated Flow
// ============================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { CaptureArtifact } from '@/types/capture';
import type { CVResult, DetectedFace } from '@/types/cv';
import type { CVProvider, RawFaceDetectionOutput } from './providers/types';
import {
  evaluateArtifactFaceReadiness,
  validateCVResultBinding,
  evaluateLiveVideoFaceReadiness
} from './cvReadinessEngine';
import { DeterministicRasterFaceProvider } from './providers/deterministicRasterProvider';

let activeMockData: Uint8ClampedArray | null = null;
let activeWidth = 0;
let activeHeight = 0;

function createMockArtifact(override: Partial<CaptureArtifact> = {}): CaptureArtifact {
  return {
    id: `artifact-${Math.random().toString(36).substring(2, 9)}`,
    source: 'camera',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    originalWidth: 1280,
    originalHeight: 720,
    standardizedWidth: 1280,
    standardizedHeight: 720,
    mimeType: 'image/jpeg',
    capturedAt: new Date().toISOString(),
    captureMode: 'manual',
    quality: {
      status: 'PASS',
      checks: [
        { id: 'resolution', name: 'Resolution Check', status: 'PASS', message: '1280x720 compliant' },
        { id: 'exposure', name: 'Global Lighting', status: 'PASS', message: 'Mean 120' }
      ],
      prioritizedGuidance: [],
      evaluatedAt: new Date().toISOString(),
      ruleVersion: 'v1-heuristic'
    },
    schemaVersion: 'capture-schema-v1',
    gatewayVersion: 'gateway-v1',
    ...override
  };
}

/**
 * Creates a synthetic canvas of width x height with a given pixel generator
 */
function createSyntheticCanvas(
  width: number,
  height: number,
  pixelFn: (x: number, y: number) => [number, number, number, number]
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const totalPixels = width * height;
  const rawData = new Uint8ClampedArray(totalPixels * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = pixelFn(x, y);
      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }

  activeMockData = rawData;
  activeWidth = width;
  activeHeight = height;

  return canvas;
}

/**
 * Mock CV provider returning controlled face detection outputs
 */
class MockCVProvider implements CVProvider {
  id = 'mock-provider';
  name = 'Mock Provider';
  version = '1.0.0';
  modelVersion = '1.0.0';
  private output: RawFaceDetectionOutput;

  constructor(output: { faces: DetectedFace[] } | RawFaceDetectionOutput) {
    this.output = {
      imageWidth: 1280,
      imageHeight: 720,
      executionMs: 10,
      providerMetadata: { id: 'mock', name: 'Mock', version: '1.0.0', modelVersion: '1.0.0' },
      ...output
    };
  }

  async isAvailable() {
    return true;
  }
  async detect(): Promise<RawFaceDetectionOutput> {
    return this.output;
  }
}

describe('Phase 10: CV Readiness Engine & Double Gate Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    activeMockData = null;
    activeWidth = 0;
    activeHeight = 0;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
      if (this.width === 0 || this.height === 0) return null;
      return {
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        drawImage: vi.fn(),
        getImageData: vi.fn().mockImplementation((sx: number, sy: number, sw: number, sh: number) => {
          const resultData = new Uint8ClampedArray(sw * sh * 4);
          if (activeMockData && activeWidth > 0 && activeHeight > 0) {
            const isCropped = sx !== 0 || sy !== 0;
            for (let dy = 0; dy < sh; dy++) {
              for (let dx = 0; dx < sw; dx++) {
                const srcX = isCropped
                  ? Math.min(activeWidth - 1, Math.max(0, sx + dx))
                  : Math.floor((dx / sw) * activeWidth);
                const srcY = isCropped
                  ? Math.min(activeHeight - 1, Math.max(0, sy + dy))
                  : Math.floor((dy / sh) * activeHeight);
                const sIdx = (srcY * activeWidth + srcX) * 4;
                const dIdx = (dy * sw + dx) * 4;
                resultData[dIdx] = activeMockData[sIdx];
                resultData[dIdx + 1] = activeMockData[sIdx + 1];
                resultData[dIdx + 2] = activeMockData[sIdx + 2];
                resultData[dIdx + 3] = activeMockData[sIdx + 3];
              }
            }
          }
          return {
            data: resultData,
            width: sw,
            height: sh
          };
        })
      } as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------
  // Test 1: Ideal Single Face -> READY
  // -------------------------------------------------------------
  it('accepts a well-centered, properly lit, and sharp single face', async () => {
    const artifact = createMockArtifact();
    const mockFace: DetectedFace = {
      id: 'face-1',
      confidence: 0.98,
      boundingBox: { x: 440, y: 160, width: 400, height: 400 },
      normalizedBoundingBox: { x: 440 / 1280, y: 160 / 720, width: 400 / 1280, height: 400 / 720 },
      areaRatio: (400 * 400) / (1280 * 720),
      center: { x: 0.5, y: 0.5 },
      landmarks: {
        leftEye: { x: 540, y: 280 },
        rightEye: { x: 740, y: 280 },
        noseTip: { x: 640, y: 360 },
        mouthCenter: { x: 640, y: 440 },
        leftEarTragion: { x: 460, y: 300 },
        rightEarTragion: { x: 820, y: 300 }
      }
    };

    // Synthetic canvas with balanced skin luminance inside face ROI
    const canvas = createSyntheticCanvas(1280, 720, (x, y) => {
      const insideFace = x >= 440 && x <= 840 && y >= 160 && y <= 560;
      if (insideFace) {
        // High frequency pattern for sharpness (Laplacian variance) + balanced luminance (128)
        const grain = (x % 4 === 0 ? 30 : -30) + (y % 4 === 0 ? 30 : -30);
        const val = Math.max(40, Math.min(200, 128 + grain));
        return [val, val, val, 255];
      }
      return [30, 30, 30, 255];
    });

    const provider = new MockCVProvider({ faces: [mockFace] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.schemaVersion).toBe('cv-schema-v1');
    expect(result.artifactId).toBe(artifact.id);
    expect(result.faceDetection.status).toBe('SINGLE_FACE');
    expect(result.faceDetection.faceCount).toBe(1);
    expect(result.readiness.status).toBe('READY');
    expect(result.faceQuality?.meanLuminance).toBeGreaterThanOrEqual(40);
    expect(result.faceQuality?.meanLuminance).toBeLessThanOrEqual(220);
  });

  // -------------------------------------------------------------
  // Test 2: Zero Faces Detected -> REJECTED (NO_FACE)
  // -------------------------------------------------------------
  it('rejects capture when zero faces are detected', async () => {
    const artifact = createMockArtifact();
    const provider = new MockCVProvider({ faces: [] });
    const canvas = createSyntheticCanvas(1280, 720, () => [200, 200, 200, 255]);

    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.faceDetection.status).toBe('NO_FACE');
    expect(result.faceDetection.faceCount).toBe(0);
    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'NO_FACE')).toBe(true);
    expect(result.readiness.reasons[0].message).toContain('No face was detected');
  });

  // -------------------------------------------------------------
  // Test 3: Multiple Faces Detected -> REJECTED (MULTIPLE_FACES)
  // -------------------------------------------------------------
  it('strictly rejects capture when multiple faces are detected', async () => {
    const artifact = createMockArtifact();
    const face1: DetectedFace = {
      id: 'face-1',
      confidence: 0.95,
      boundingBox: { x: 200, y: 150, width: 300, height: 350 },
      normalizedBoundingBox: { x: 200 / 1280, y: 150 / 720, width: 300 / 1280, height: 350 / 720 },
      areaRatio: 0.11,
      center: { x: 0.27, y: 0.45 }
    };
    const face2: DetectedFace = {
      id: 'face-2',
      confidence: 0.92,
      boundingBox: { x: 700, y: 150, width: 300, height: 350 },
      normalizedBoundingBox: { x: 700 / 1280, y: 150 / 720, width: 300 / 1280, height: 350 / 720 },
      areaRatio: 0.11,
      center: { x: 0.66, y: 0.45 }
    };

    const provider = new MockCVProvider({ faces: [face1, face2] });
    const canvas = createSyntheticCanvas(1280, 720, () => [128, 128, 128, 255]);

    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.faceDetection.status).toBe('MULTIPLE_FACES');
    expect(result.faceDetection.faceCount).toBe(2);
    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'MULTIPLE_FACES')).toBe(true);
    expect(result.readiness.reasons[0].message).toContain('2 faces were detected');
  });

  // -------------------------------------------------------------
  // Test 4: Dark Face on Bright Background (Core Bug Scenario)
  // Phase 09 Global passes (mean > 70), but Phase 10 Face ROI FAILS
  // -------------------------------------------------------------
  it('fails face readiness when face is underexposed against a bright background', async () => {
    const artifact = createMockArtifact();
    const face: DetectedFace = {
      id: 'face-dark',
      confidence: 0.96,
      boundingBox: { x: 440, y: 160, width: 400, height: 400 },
      normalizedBoundingBox: { x: 440 / 1280, y: 160 / 720, width: 400 / 1280, height: 400 / 720 },
      areaRatio: (400 * 400) / (1280 * 720),
      center: { x: 0.5, y: 0.5 }
    };

    // Bright background (240), dark face (25)
    // Global mean is high, but Face ROI mean is 25 (< 40 threshold)
    const canvas = createSyntheticCanvas(1280, 720, (x, y) => {
      const insideFace = x >= 440 && x <= 840 && y >= 160 && y <= 560;
      if (insideFace) {
        return [25, 25, 25, 255]; // Dark face
      }
      return [240, 240, 240, 255]; // Bright background
    });

    const provider = new MockCVProvider({ faces: [face] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'FACE_TOO_DARK')).toBe(true);
    expect(result.faceQuality?.meanLuminance).toBeLessThan(40);
  });

  // -------------------------------------------------------------
  // Test 5: Overexposed Face -> REJECTED (FACE_TOO_BRIGHT)
  // -------------------------------------------------------------
  it('fails face readiness when face ROI is blown out / overexposed', async () => {
    const artifact = createMockArtifact();
    const face: DetectedFace = {
      id: 'face-bright',
      confidence: 0.95,
      boundingBox: { x: 440, y: 160, width: 400, height: 400 },
      normalizedBoundingBox: { x: 440 / 1280, y: 160 / 720, width: 400 / 1280, height: 400 / 720 },
      areaRatio: (400 * 400) / (1280 * 720),
      center: { x: 0.5, y: 0.5 }
    };

    // Completely blown out face ROI (245)
    const canvas = createSyntheticCanvas(1280, 720, (x, y) => {
      const insideFace = x >= 440 && x <= 840 && y >= 160 && y <= 560;
      if (insideFace) {
        return [245, 245, 245, 255];
      }
      return [100, 100, 100, 255];
    });

    const provider = new MockCVProvider({ faces: [face] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'FACE_TOO_BRIGHT')).toBe(true);
  });

  // -------------------------------------------------------------
  // Test 6: Blurry Face on Sharp Background -> REJECTED (FACE_TOO_BLURRY)
  // -------------------------------------------------------------
  it('fails face readiness when face ROI is completely smooth/blurred', async () => {
    const artifact = createMockArtifact();
    const face: DetectedFace = {
      id: 'face-blurry',
      confidence: 0.95,
      boundingBox: { x: 440, y: 160, width: 400, height: 400 },
      normalizedBoundingBox: { x: 440 / 1280, y: 160 / 720, width: 400 / 1280, height: 400 / 720 },
      areaRatio: (400 * 400) / (1280 * 720),
      center: { x: 0.5, y: 0.5 }
    };

    // Uniformly smooth face (sharpnessScore ~0 < 12 threshold)
    const canvas = createSyntheticCanvas(1280, 720, (x, y) => {
      const insideFace = x >= 440 && x <= 840 && y >= 160 && y <= 560;
      if (insideFace) {
        return [128, 128, 128, 255]; // Zero edge gradients
      }
      // High contrast background
      return [x % 2 === 0 ? 250 : 10, y % 2 === 0 ? 250 : 10, 100, 255];
    });

    const provider = new MockCVProvider({ faces: [face] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'FACE_TOO_BLURRY')).toBe(true);
    expect(result.faceQuality?.sharpnessVariance).toBeLessThan(12);
  });

  // -------------------------------------------------------------
  // Test 7: Face Too Small -> REJECTED (FACE_TOO_SMALL)
  // -------------------------------------------------------------
  it('rejects capture when face area ratio is below 8%', async () => {
    const artifact = createMockArtifact();
    // 120x120 on 1280x720 canvas = 14,400 / 921,600 = 1.5% (< 8%)
    const smallFace: DetectedFace = {
      id: 'face-small',
      confidence: 0.90,
      boundingBox: { x: 580, y: 300, width: 120, height: 120 },
      normalizedBoundingBox: { x: 580 / 1280, y: 300 / 720, width: 120 / 1280, height: 120 / 720 },
      areaRatio: (120 * 120) / (1280 * 720),
      center: { x: 0.5, y: 0.5 }
    };

    const canvas = createSyntheticCanvas(1280, 720, () => [128, 128, 128, 255]);
    const provider = new MockCVProvider({ faces: [smallFace] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'FACE_TOO_SMALL')).toBe(true);
    expect(result.framing?.areaRatio).toBeLessThan(0.08);
  });

  // -------------------------------------------------------------
  // Test 8: Face Cut Off at Frame Boundary -> REJECTED (FACE_BORDER_CUTOFF)
  // -------------------------------------------------------------
  it('rejects capture when face touches boundary of viewfinder', async () => {
    const artifact = createMockArtifact();
    // Face touching left border (x = 2 <= 5)
    const cutoffFace: DetectedFace = {
      id: 'face-cutoff',
      confidence: 0.92,
      boundingBox: { x: 2, y: 100, width: 350, height: 400 },
      normalizedBoundingBox: { x: 2 / 1280, y: 100 / 720, width: 350 / 1280, height: 400 / 720 },
      areaRatio: (350 * 400) / (1280 * 720),
      center: { x: 0.15, y: 0.4 }
    };

    const canvas = createSyntheticCanvas(1280, 720, () => [128, 128, 128, 255]);
    const provider = new MockCVProvider({ faces: [cutoffFace] });
    const result = await evaluateArtifactFaceReadiness(artifact, {
      customProvider: provider,
      canvas
    });

    expect(result.readiness.status).toBe('REJECTED');
    expect(result.readiness.reasons.some((r) => r.code === 'FACE_BORDER_CUTOFF')).toBe(true);
    expect(result.framing?.status).toBe('BORDER_CUTOFF');
  });

  // -------------------------------------------------------------
  // Test 9: Artifact ID Binding Validation
  // -------------------------------------------------------------
  it('validates CVResult binding strictly against target CaptureArtifact', () => {
    const artifact = createMockArtifact({ id: 'artifact-abc-123' });
    const matchingCVResult: CVResult = {
      schemaVersion: 'cv-schema-v1',
      artifactId: 'artifact-abc-123',
      provider: 'test',
      providerVersion: '1.0.0',
      modelVersion: '1.0.0',
      analyzedAt: new Date().toISOString(),
      faceDetection: { status: 'SINGLE_FACE', faceCount: 1, confidence: 0.9, allFaces: [] },
      primaryFace: null,
      faceQuality: null,
      pose: null,
      occlusion: null,
      framing: null,
      readiness: { status: 'READY', reasons: [], warnings: [], actionableGuidance: [], ruleVersion: 'face-readiness-v1-heuristic' }
    };

    const mismatchedCVResult: CVResult = {
      ...matchingCVResult,
      artifactId: 'artifact-xyz-999'
    };

    expect(validateCVResultBinding(matchingCVResult, artifact)).toBe(true);
    expect(validateCVResultBinding(mismatchedCVResult, artifact)).toBe(false);
    expect(validateCVResultBinding(null, artifact)).toBe(false);
    expect(validateCVResultBinding(matchingCVResult, null)).toBe(false);
  });

  // -------------------------------------------------------------
  // Test 10: DeterministicRasterFaceProvider Synthetic Raster
  // -------------------------------------------------------------
  it('deterministic raster provider detects skin cluster on synthetic canvas', async () => {
    const provider = new DeterministicRasterFaceProvider();

    // Synthetic face oval centered at (320, 240) with skin chrominance:
    // YCbCr skin bounds: Cb in [77, 130], Cr in [133, 175]
    // RGB corresponding to warm skin tone: R=205, G=150, B=120
    const canvas = createSyntheticCanvas(640, 480, (x, y) => {
      const dx = (x - 320) / 70;
      const dy = (y - 240) / 95;
      const insideOval = dx * dx + dy * dy <= 1.0;
      if (insideOval) {
        return [205, 150, 120, 255]; // Skin tone
      }
      return [30, 35, 40, 255]; // Dark background
    });

    const output = await provider.detect(canvas);
    expect(output.faces.length).toBe(1);
    expect(output.faces[0].confidence).toBeGreaterThan(0.5);
    expect(output.faces[0].boundingBox.width).toBeGreaterThan(50);
  });

  // -------------------------------------------------------------
  // Test 11: Live Video Face Readiness Precheck
  // -------------------------------------------------------------
  it('evaluates live video precheck status gracefully without throwing', async () => {
    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4 });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 640 });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 480 });

    const liveResult = await evaluateLiveVideoFaceReadiness(mockVideo);
    expect(typeof liveResult.faceCount).toBe('number');
    expect(typeof liveResult.isReady).toBe('boolean');
    expect(typeof liveResult.guidanceText).toBe('string');
  });
});
