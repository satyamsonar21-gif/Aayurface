// ============================================================
// AayurFace — Cloud CV Provider Adapter (Architectural Boundary)
// Phase 10: Provider Abstraction & AWS Security Compliance
// Zero AWS Credentials in Client Code — Backend Boundary Only
// ============================================================

import type { CVProvider, RawFaceDetectionOutput } from './types';

/**
 * Cloud CV Provider Adapter.
 *
 * STRICT SECURITY GOVERNANCE:
 * 1. Under NO circumstances are AWS Secret Keys or Rekognition credentials
 *    embedded, imported, or exposed in client-side code.
 * 2. If cloud CV processing is enabled, all requests MUST pass through an
 *    authenticated backend / Edge Function boundary (e.g., Supabase Edge Function).
 * 3. In the default client-side architecture, isAvailable() returns false
 *    to guarantee complete local privacy.
 */
export class CloudCVProviderAdapter implements CVProvider {
  readonly id = 'cloud-rekognition-adapter';
  readonly name = 'Cloud CV Adapter (Secure Backend Boundary)';
  readonly version = '1.0.0';
  readonly modelVersion = 'aws-rekognition-proxy-v1';

  private endpointUrl: string | null = null;

  constructor(endpointUrl?: string) {
    this.endpointUrl = endpointUrl || null;
  }

  async isAvailable(): Promise<boolean> {
    // In strict client-only privacy mode, cloud provider is disabled by default
    return !!this.endpointUrl;
  }

  async detect(
    _input: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement
  ): Promise<RawFaceDetectionOutput> {
    if (!this.endpointUrl) {
      return {
        faces: [],
        imageWidth: 0,
        imageHeight: 0,
        executionMs: 0,
        providerMetadata: {
          id: this.id,
          name: this.name,
          version: this.version,
          modelVersion: this.modelVersion
        },
        error: 'Cloud CV Provider is not configured. Use client-local CV provider.'
      };
    }

    // If configured, the adapter would POST the standardized image to the secure backend proxy
    // (Never calling AWS Rekognition directly from browser)
    return {
      faces: [],
      imageWidth: 0,
      imageHeight: 0,
      executionMs: 0,
      providerMetadata: {
        id: this.id,
        name: this.name,
        version: this.version,
        modelVersion: this.modelVersion
      },
      error: 'Backend Cloud CV proxy not active in current environment.'
    };
  }
}
