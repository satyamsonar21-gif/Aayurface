// ============================================================
// AayurFace — CV Provider Registry & Factory
// Phase 10: Provider Selection & Seamless Offline Fallback
// ============================================================

import type { CVProvider } from './types';
import { DeterministicRasterFaceProvider } from './deterministicRasterProvider';
import { BrowserMediaPipeFaceProvider } from './mediaPipeProvider';
import { CloudCVProviderAdapter } from './cloudProviderAdapter';

// Singleton instances
const deterministicProvider = new DeterministicRasterFaceProvider();
const mediaPipeProvider = new BrowserMediaPipeFaceProvider();
const cloudProvider = new CloudCVProviderAdapter();

/**
 * Returns the best available CV provider according to environment capability.
 * Defaults to DeterministicRasterFaceProvider for ultra-low latency (<15ms)
 * and guaranteed deterministic client-side execution across all platforms.
 */
export async function getActiveCVProvider(preference?: 'mediapipe' | 'raster' | 'cloud'): Promise<CVProvider> {
  if (preference === 'cloud') {
    if (await cloudProvider.isAvailable()) return cloudProvider;
  }

  if (preference === 'mediapipe') {
    if (await mediaPipeProvider.isAvailable()) return mediaPipeProvider;
  }

  // Check if MediaPipe is available in modern browser with WebGL/Wasm
  if (!preference) {
    const mpReady = await mediaPipeProvider.isAvailable();
    if (mpReady) {
      return mediaPipeProvider;
    }
  }

  // First-line deterministic local raster engine
  return deterministicProvider;
}

export function getAllCVProviders(): CVProvider[] {
  return [deterministicProvider, mediaPipeProvider, cloudProvider];
}
