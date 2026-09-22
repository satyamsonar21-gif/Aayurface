// ============================================================
// AayurFace — CV Provider Interface Contracts
// Phase 10: Provider Abstraction Layer
// ============================================================

import type { DetectedFace } from '@/types/cv';

export interface RawFaceDetectionOutput {
  faces: DetectedFace[];
  imageWidth: number;
  imageHeight: number;
  executionMs: number;
  providerMetadata: {
    id: string;
    name: string;
    version: string;
    modelVersion: string;
  };
  error?: string;
}

export interface CVProvider {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly modelVersion: string;

  /**
   * Checks whether the provider is currently supported and operational in this environment.
   */
  isAvailable(): Promise<boolean>;

  /**
   * Executes face detection on an active video, canvas, or image element.
   */
  detect(
    input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement
  ): Promise<RawFaceDetectionOutput>;
}
