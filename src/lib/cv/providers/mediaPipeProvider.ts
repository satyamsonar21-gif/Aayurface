// ============================================================
// AayurFace — MediaPipe Face Detection Provider
// Phase 10: Real MediaPipe Vision Tasks Integration
// Bounded Client-Side Execution — Zero Secret Exposure
// ============================================================

import type { CVProvider, RawFaceDetectionOutput } from './types';
import type { DetectedFace, Point2D } from '@/types/cv';

export class BrowserMediaPipeFaceProvider implements CVProvider {
  readonly id = 'browser-mediapipe';
  readonly name = 'Google MediaPipe FaceDetector (BlazeFace)';
  readonly version = '1.0.1';
  readonly modelVersion = 'blazeface-short-range-v1';

  private detectorInstance: any = null;
  private isInitializing = false;
  private initFailed = false;

  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (this.initFailed) return false;
    if (this.detectorInstance) return true;
    // Guard against non-WebGL environments (Node/jsdom/Vitest)
    if (typeof window.WebGLRenderingContext === 'undefined') return false;

    try {
      const vision = await import('@mediapipe/tasks-vision');
      return !!vision.FaceDetector;
    } catch {
      return false;
    }
  }

  private async getDetector() {
    if (this.detectorInstance) return this.detectorInstance;
    if (this.initFailed) return null;
    if (this.isInitializing) {
      // Await initialization in progress
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 100));
        if (this.detectorInstance) return this.detectorInstance;
        if (this.initFailed) return null;
      }
      return null;
    }

    this.isInitializing = true;
    try {
      const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');
      const wasmFileset = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.detectorInstance = await FaceDetector.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
          delegate: 'GPU'
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.5
      });
      return this.detectorInstance;
    } catch (err) {
      console.warn('[MediaPipe Provider] Initialization fallback to CPU or secondary provider:', err);
      // Try fallback to CPU delegate
      try {
        const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const wasmFileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.detectorInstance = await FaceDetector.createFromOptions(wasmFileset, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
            delegate: 'CPU'
          },
          runningMode: 'IMAGE',
          minDetectionConfidence: 0.5
        });
        return this.detectorInstance;
      } catch (cpuErr) {
        console.warn('[MediaPipe Provider] CPU initialization failed, disabling provider:', cpuErr);
        this.initFailed = true;
        return null;
      }
    } finally {
      this.isInitializing = false;
    }
  }

  async detect(
    input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement
  ): Promise<RawFaceDetectionOutput> {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    let width = 0;
    let height = 0;

    if ('videoWidth' in input && typeof input.videoWidth === 'number') {
      width = input.videoWidth;
      height = input.videoHeight;
    } else if ('naturalWidth' in input && typeof input.naturalWidth === 'number') {
      width = input.naturalWidth;
      height = input.naturalHeight;
    } else if ('width' in input && 'height' in input) {
      width = input.width;
      height = input.height;
    }

    if (width <= 0 || height <= 0) {
      return {
        faces: [],
        imageWidth: width,
        imageHeight: height,
        executionMs: 0,
        providerMetadata: {
          id: this.id,
          name: this.name,
          version: this.version,
          modelVersion: this.modelVersion
        },
        error: 'Invalid input dimensions.'
      };
    }

    const detector = await this.getDetector();
    if (!detector) {
      return {
        faces: [],
        imageWidth: width,
        imageHeight: height,
        executionMs: 0,
        providerMetadata: {
          id: this.id,
          name: this.name,
          version: this.version,
          modelVersion: this.modelVersion
        },
        error: 'MediaPipe FaceDetector failed to initialize.'
      };
    }

    try {
      const detectionResult = detector.detect(input);
      const rawDetections = detectionResult.detections || [];
      const faces: DetectedFace[] = [];

      for (let i = 0; i < rawDetections.length; i++) {
        const d = rawDetections[i];
        const bbox = d.boundingBox;
        if (!bbox) continue;

        const origX = Math.max(0, Math.round(bbox.originX));
        const origY = Math.max(0, Math.round(bbox.originY));
        const origW = Math.min(width - origX, Math.round(bbox.width));
        const origH = Math.min(height - origY, Math.round(bbox.height));

        const normX = Math.max(0, Math.min(1, origX / width));
        const normY = Math.max(0, Math.min(1, origY / height));
        const normW = Math.max(0, Math.min(1, origW / width));
        const normH = Math.max(0, Math.min(1, origH / height));

        const areaRatio = normW * normH;
        const center: Point2D = {
          x: Math.round((normX + normW / 2) * 1000) / 1000,
          y: Math.round((normY + normH / 2) * 1000) / 1000
        };

        const confidence =
          d.categories && d.categories.length > 0 && typeof d.categories[0].score === 'number'
            ? Math.round(d.categories[0].score * 100) / 100
            : null;

        // MediaPipe BlazeFace keypoints:
        // kp[0]=subject anatomical right eye (image-left / smaller x)
        // kp[1]=subject anatomical left eye (image-right / larger x)
        // kp[2]=nose tip, kp[3]=mouth center, kp[4]=right ear, kp[5]=left ear
        // In image-space Cartesian coordinates, leftEye is on the viewer's left (kp[0]) and rightEye is on the viewer's right (kp[1])
        const kp = d.keypoints || [];
        const leftEye = kp[0] ? { x: Math.round(kp[0].x * width * 10) / 10, y: Math.round(kp[0].y * height * 10) / 10 } : undefined;
        const rightEye = kp[1] ? { x: Math.round(kp[1].x * width * 10) / 10, y: Math.round(kp[1].y * height * 10) / 10 } : undefined;
        const noseTip = kp[2] ? { x: Math.round(kp[2].x * width * 10) / 10, y: Math.round(kp[2].y * height * 10) / 10 } : undefined;
        const mouthCenter = kp[3] ? { x: Math.round(kp[3].x * width * 10) / 10, y: Math.round(kp[3].y * height * 10) / 10 } : undefined;

        faces.push({
          id: `face-mp-${i + 1}`,
          boundingBox: { x: origX, y: origY, width: origW, height: origH },
          normalizedBoundingBox: {
            x: Math.round(normX * 1000) / 1000,
            y: Math.round(normY * 1000) / 1000,
            width: Math.round(normW * 1000) / 1000,
            height: Math.round(normH * 1000) / 1000
          },
          areaRatio: Math.round(areaRatio * 1000) / 1000,
          center,
          confidence,
          landmarks: {
            leftEye,
            rightEye,
            noseTip,
            mouthCenter
          }
        });
      }

      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const executionMs = Math.round((endTime - startTime) * 10) / 10;

      return {
        faces,
        imageWidth: width,
        imageHeight: height,
        executionMs,
        providerMetadata: {
          id: this.id,
          name: this.name,
          version: this.version,
          modelVersion: this.modelVersion
        }
      };
    } catch (detectErr) {
      return {
        faces: [],
        imageWidth: width,
        imageHeight: height,
        executionMs: 0,
        providerMetadata: {
          id: this.id,
          name: this.name,
          version: this.version,
          modelVersion: this.modelVersion
        },
        error: String(detectErr)
      };
    }
  }
}
