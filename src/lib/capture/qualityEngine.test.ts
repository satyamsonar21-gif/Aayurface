// ============================================================
// AayurFace — Image Quality Engine Unit Tests
// Phase 09: Pure Deterministic Raster Quality Evaluation Tests
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  QUALITY_THRESHOLDS_V1,
  computeLaplacianVariance,
  evaluateRasterQuality
} from './qualityEngine';

let activeMockData: Uint8ClampedArray | null = null;
let activeWidth = 0;
let activeHeight = 0;

/**
 * Helper to construct synthetic test canvases with precise pixel data
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

describe('Phase 09: Image Quality Engine Suite', () => {
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
        getImageData: vi.fn().mockImplementation((_sx: number, _sy: number, sw: number, sh: number) => {
          const scaledData = new Uint8ClampedArray(sw * sh * 4);
          if (activeMockData && activeWidth > 0 && activeHeight > 0) {
            for (let dy = 0; dy < sh; dy++) {
              for (let dx = 0; dx < sw; dx++) {
                const srcX = Math.floor((dx / sw) * activeWidth);
                const srcY = Math.floor((dy / sh) * activeHeight);
                const sIdx = (srcY * activeWidth + srcX) * 4;
                const dIdx = (dy * sw + dx) * 4;
                scaledData[dIdx] = activeMockData[sIdx];
                scaledData[dIdx + 1] = activeMockData[sIdx + 1];
                scaledData[dIdx + 2] = activeMockData[sIdx + 2];
                scaledData[dIdx + 3] = activeMockData[sIdx + 3];
              }
            }
          }
          return {
            data: scaledData,
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
  // 1. Dark Image Exposure Check (FAIL)
  // -------------------------------------------------------------
  it('detects underexposed / dark images and emits FAIL status', () => {
    // Mean luminance = 20 (below floor of 40)
    const canvas = createSyntheticCanvas(640, 480, () => [20, 20, 20, 255]);

    const { result, metrics } = evaluateRasterQuality(canvas);

    expect(metrics.meanLuminance).toBeLessThan(QUALITY_THRESHOLDS_V1.LUMINANCE_FAIL_DARK);
    expect(result.status).toBe('FAIL');

    const exposureCheck = result.checks.find((c) => c.id === 'exposure');
    expect(exposureCheck?.status).toBe('FAIL');
    expect(exposureCheck?.message).toContain('too dark');
    expect(result.prioritizedGuidance[0]).toContain('Face toward a soft, natural light source');
  });

  // -------------------------------------------------------------
  // 2. Overexposed Image Check (FAIL)
  // -------------------------------------------------------------
  it('detects overexposed / washed-out images and emits FAIL status', () => {
    // Mean luminance = 240 (above ceil of 220)
    const canvas = createSyntheticCanvas(640, 480, () => [240, 240, 240, 255]);

    const { result, metrics } = evaluateRasterQuality(canvas);

    expect(metrics.meanLuminance).toBeGreaterThan(QUALITY_THRESHOLDS_V1.LUMINANCE_WARN_BRIGHT);
    expect(result.status).toBe('FAIL');

    const exposureCheck = result.checks.find((c) => c.id === 'exposure');
    expect(exposureCheck?.status).toBe('FAIL');
    expect(exposureCheck?.message).toContain('overexposed');
    expect(result.prioritizedGuidance[0]).toContain('Avoid harsh direct flash');
  });

  // -------------------------------------------------------------
  // 3. Low Resolution Check (FAIL & WARN)
  // -------------------------------------------------------------
  it('fails images below minimum resolution floor (320px)', () => {
    // 240x240 image
    const canvas = createSyntheticCanvas(240, 240, () => [128, 128, 128, 255]);

    const { result } = evaluateRasterQuality(canvas);

    expect(result.status).toBe('FAIL');
    const resCheck = result.checks.find((c) => c.id === 'resolution');
    expect(resCheck?.status).toBe('FAIL');
    expect(resCheck?.message).toContain('below the minimum required floor');
  });

  it('warns images between minimum floor and preferred resolution (320px - 480px)', () => {
    // 400x400 image (sharp high-contrast alternating pixels, well lit)
    const canvas = createSyntheticCanvas(400, 400, (x, y) => {
      const val = (x + y) % 2 === 0 ? 80 : 180;
      return [val, val, val, 255];
    });

    const { result } = evaluateRasterQuality(canvas);

    const resCheck = result.checks.find((c) => c.id === 'resolution');
    expect(resCheck?.status).toBe('WARN');
    expect(resCheck?.message).toContain('slightly low');
  });

  // -------------------------------------------------------------
  // 4. Sharpness & Blur Verification (Laplacian Variance)
  // -------------------------------------------------------------
  it('computes 0 variance on flat uniform image and flags as blurry FAIL', () => {
    const flatGrayscale = new Uint8Array(100 * 100).fill(128);
    const variance = computeLaplacianVariance(flatGrayscale, 100, 100);
    expect(variance).toBe(0);

    const canvas = createSyntheticCanvas(640, 480, () => [128, 128, 128, 255]);
    const { result, metrics } = evaluateRasterQuality(canvas);

    expect(metrics.sharpnessVariance).toBeLessThan(QUALITY_THRESHOLDS_V1.SHARPNESS_FAIL);
    expect(result.status).toBe('FAIL');

    const sharpCheck = result.checks.find((c) => c.id === 'sharpness');
    expect(sharpCheck?.status).toBe('FAIL');
    expect(sharpCheck?.message).toContain('blurry');
  });

  it('computes high Laplacian variance on textured / high-contrast edges and PASSES', () => {
    // Checkerboard pattern creates strong discrete Laplacian edges
    const width = 100;
    const height = 100;
    const textured = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        textured[y * width + x] = (x + y) % 2 === 0 ? 40 : 200;
      }
    }

    const variance = computeLaplacianVariance(textured, width, height);
    expect(variance).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS_V1.SHARPNESS_WARN);
  });

  // -------------------------------------------------------------
  // 5. Sharp, Well-Lit, Full Resolution Frame (PASS)
  // -------------------------------------------------------------
  it('produces PASS status on a sharp, well-lit image satisfying all thresholds', () => {
    // 640x480 with high-frequency alternation to ensure Laplacian variance >= 60
    const canvas = createSyntheticCanvas(640, 480, (x, y) => {
      const edge = ((x + y) % 2 === 0 ? 1 : -1) * 45;
      const lum = Math.round(125 + edge);
      return [lum, lum, lum, 255];
    });

    const { result, metrics } = evaluateRasterQuality(canvas);

    expect(metrics.meanLuminance).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS_V1.LUMINANCE_WARN_DARK);
    expect(metrics.meanLuminance).toBeLessThanOrEqual(QUALITY_THRESHOLDS_V1.LUMINANCE_PASS_MAX);
    expect(metrics.sharpnessVariance).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS_V1.SHARPNESS_WARN);
    expect(result.status).toBe('PASS');
    expect(result.checks.every((c) => c.status === 'PASS')).toBe(true);
    expect(result.prioritizedGuidance).toHaveLength(0);
  });

  // -------------------------------------------------------------
  // 6. Corrupt / Empty Raster / Zero Dimensions (Integrity FAIL)
  // -------------------------------------------------------------
  it('rejects corrupt raster with zero dimensions', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;

    const { result } = evaluateRasterQuality(canvas);

    expect(result.status).toBe('FAIL');
    const integrityCheck = result.checks.find((c) => c.id === 'integrity');
    expect(integrityCheck?.status).toBe('FAIL');
    expect(integrityCheck?.message).toContain('empty or unreadable');
  });

  // -------------------------------------------------------------
  // 7. Clipping Ratios (Shadow & Highlight Clipping)
  // -------------------------------------------------------------
  it('detects excessive shadow clipping even when mean luminance is within range', () => {
    // Left half completely black (0), right half lit (140) -> Mean = 70, 50% shadow clipped!
    const canvas = createSyntheticCanvas(640, 480, (x) => {
      const val = x < 320 ? 0 : 140;
      return [val, val, val, 255];
    });

    const { result, metrics } = evaluateRasterQuality(canvas);

    expect(metrics.shadowClippingRatio).toBeGreaterThan(QUALITY_THRESHOLDS_V1.CLIPPING_RATIO_WARN);
    const exposureCheck = result.checks.find((c) => c.id === 'exposure');
    expect(exposureCheck?.status).toBe('WARN');
  });

  // -------------------------------------------------------------
  // 8. Warning Range (Dim Lighting)
  // -------------------------------------------------------------
  it('evaluates dim lighting between 40 and 70 as WARN', () => {
    // Mean luminance = 55 (warning range)
    const canvas = createSyntheticCanvas(640, 480, (x, y) => {
      const edge = (x + y) % 2 === 0 ? 5 : -5;
      const val = 55 + edge;
      return [val, val, val, 255];
    });

    const { result } = evaluateRasterQuality(canvas);

    const exposureCheck = result.checks.find((c) => c.id === 'exposure');
    expect(exposureCheck?.status).toBe('WARN');
    expect(exposureCheck?.message).toContain('somewhat dim');
  });

  // -------------------------------------------------------------
  // 9. Multiple Failures & Guidance Ordering
  // -------------------------------------------------------------
  it('prioritizes lighting first, then sharpness, then resolution when multiple checks fail', () => {
    // 200x200 (Resolution FAIL), pitch black (Exposure FAIL), flat (Sharpness FAIL)
    const canvas = createSyntheticCanvas(200, 200, () => [5, 5, 5, 255]);

    const { result } = evaluateRasterQuality(canvas);

    expect(result.status).toBe('FAIL');
    expect(result.prioritizedGuidance.length).toBeGreaterThanOrEqual(2);

    // Guidance Priority: 1. Lighting, 2. Sharpness, 3. Resolution
    expect(result.prioritizedGuidance[0]).toContain('Face toward a soft, natural light source');
    expect(result.prioritizedGuidance[1]).toContain('Hold your device steady');
  });

  // -------------------------------------------------------------
  // 10. Pure Determinism on Repeated Evaluation
  // -------------------------------------------------------------
  it('returns strictly identical metrics on repeated evaluation of same raster', () => {
    const canvas = createSyntheticCanvas(640, 480, (x, y) => [
      (x * 3) % 255,
      (y * 5) % 255,
      ((x + y) * 2) % 255,
      255
    ]);

    const eval1 = evaluateRasterQuality(canvas);
    const eval2 = evaluateRasterQuality(canvas);

    expect(eval1.metrics.meanLuminance).toBe(eval2.metrics.meanLuminance);
    expect(eval1.metrics.sharpnessVariance).toBe(eval2.metrics.sharpnessVariance);
    expect(eval1.metrics.shadowClippingRatio).toBe(eval2.metrics.shadowClippingRatio);
    expect(eval1.metrics.highlightClippingRatio).toBe(eval2.metrics.highlightClippingRatio);
    expect(eval1.result.status).toBe(eval2.result.status);
    expect(eval1.result.checks).toEqual(eval2.result.checks);
  });
});
