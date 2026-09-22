# AayurFace — Phase 09 Engineering Report
## Standardized Camera Capture Gateway

**Mode**: Elite Production Engineering  
**Status**: COMPLETE & VERIFIED  
**Phase**: Phase 09 (Pre-requisite Boundary for Phase 10 CV)  
**Date**: September 22, 2026  
**Hardware Status**: **PENDING — PHYSICAL HARDWARE NOT ACCESSIBLE IN RUNNER**  
**Synthetic Device Status**: **VERIFIED (Google Chrome with ANGLE/SwiftShader & Fake Media Streams)**  

---

## 1. Executive Summary & Architectural Mission

Phase 09 establishes the **Standardized Camera Capture Gateway** for AayurFace. Operating as a strict boundary layer between unpredictable browser inputs (real webcams, mobile device cameras, and local file uploads) and the downstream Ayurvedic Intelligence & Computer Vision pipeline (Phase 10), this gateway ensures that every image entering assessment is:
1. **Deterministically Standardized**: Aspect-preserved, bounded to a maximum 1280px dimension, encoded in high-integrity sRGB JPEG (0.92 quality), with zero beauty filters, skin smoothing, or artificial manipulation.
2. **Quality-Gated**: Evaluated locally via a pure, fast (<15ms) client-side raster quality engine inspecting decode integrity, resolution floor, lighting/luminance, shadow/highlight clipping, and focus/blur variance.
3. **Strictly Actionable**: Provides non-diagnostic, explainable, prioritized guidance (maximum 3 steps) and hard-blocks progression to assessment if technical quality is rejected (`FAIL`).
4. **Privacy-Preserving**: Enforces zero raw image uploads to external APIs or Supabase, zero base64 image strings logged to browser consoles, and user-scoped assessment persistence in client storage.

---

## 2. Canonical Contracts & Type Definitions

Located in [`src/types/capture.ts`](file:///D:/Project%20Aayurface/src/types/capture.ts):

```typescript
export type CaptureSource = 'camera' | 'upload';
export type CaptureMode = 'manual' | 'auto_timer';
export type QualityStatus = 'PASS' | 'WARN' | 'FAIL';

export interface QualityCheck {
  id: 'integrity' | 'resolution' | 'exposure' | 'sharpness';
  name: string;
  status: QualityStatus;
  score?: number;
  message: string;
  actionableGuidance?: string;
}

export interface CaptureQualityResult {
  status: QualityStatus;
  checks: QualityCheck[];
  prioritizedGuidance: string[];
  evaluatedAt: string;
  ruleVersion: string;
}

export interface CaptureArtifact {
  id: string;
  source: CaptureSource;
  image: string; // Base64 sRGB JPEG data URI
  originalWidth: number;
  originalHeight: number;
  standardizedWidth: number;
  standardizedHeight: number;
  mimeType: 'image/jpeg';
  capturedAt: string;
  captureMode: CaptureMode;
  quality: CaptureQualityResult;
  schemaVersion: 'capture-schema-v1';
  gatewayVersion: 'gateway-v1';
}
```

---

## 3. Pure Standardization Pipeline

Located in [`src/lib/capture/standardization.ts`](file:///D:/Project%20Aayurface/src/lib/capture/standardization.ts):

* **Framing & Aspect Ratio**: Preserves natural subject framing. Safe center-crop to 4:3 is only applied when the original aspect ratio is close to standard portrait/landscape (<15% excess) to prevent truncating facial boundaries.
* **Resolution Scaling**: Downscales oversized inputs to 1280px on the longest edge while strictly preserving the aspect ratio. Low-resolution inputs are **never upscaled** to prevent synthetic interpolation artifacts.
* **Color & Encoding**: Encoded to sRGB JPEG format at 0.92 quality via canvas raster export.
* **Strict Non-Manipulation Guarantee**: Zero blur, contrast stretching, gamma warping, or skin smoothing filters applied.

---

## 4. Pure Client-Side Image Quality Engine

Located in [`src/lib/capture/qualityEngine.ts`](file:///D:/Project%20Aayurface/src/lib/capture/qualityEngine.ts):

* **Performance Optimization**: Downsamples high-resolution inputs to a bounded analysis buffer (max 480x480) for statistical evaluation. Analysis consistently executes in **sub-15ms**.
* **Integrity & Decodability**: Verifies non-zero raster dimensions and successful 2D canvas context acquisition.
* **Resolution Check**:
  - Hard failure (`FAIL`) if minimum dimension < 320px (`RESOLUTION_MIN_FAIL`).
  - Notice (`WARN`) if minimum dimension is between 320px and 480px (`RESOLUTION_MIN_PASS`).
  - Optimal (`PASS`) if minimum dimension >= 480px.
* **Luminance & Clipping Check**:
  - Standard ITU-R BT.601 formula ($0.299R + 0.587G + 0.114B$).
  - Too dark (`FAIL`): Mean luminance < 40.
  - Overexposed (`FAIL`): Mean luminance > 225.
  - Shadow clipping warning: > 25% pixels at or below luminance 10.
  - Highlight clipping warning: > 25% pixels at or above luminance 245.
* **Sharpness & Focus Check**:
  - Discrete 2D Laplacian convolution kernel ($\nabla^2 f = f(x+1, y) + f(x-1, y) + f(x, y+1) + f(x, y-1) - 4f(x, y)$) on grayscale raster buffer.
  - Blurry (`FAIL`): Variance < 15 (`SHARPNESS_FAIL_BLUR`).
  - Soft focus (`WARN`): Variance between 15 and 40 (`SHARPNESS_WARN_SOFT`).
  - Sharp (`PASS`): Variance >= 40.
* **Prioritized Guidance**: Orders failures with the highest triage impact first (Integrity $\to$ Exposure $\to$ Sharpness $\to$ Resolution), capping suggestions to the top 3 actionable steps.

---

## 5. Viewfinder UI & Quality State Machine

Located in [`src/pages/app/scan/useCamera.ts`](file:///D:/Project%20Aayurface/src/pages/app/scan/useCamera.ts), [`CameraViewfinder.tsx`](file:///D:/Project%20Aayurface/src/pages/app/scan/CameraViewfinder.tsx), and [`ScanGuidancePanel.tsx`](file:///D:/Project%20Aayurface/src/pages/app/scan/ScanGuidancePanel.tsx):

* **Lifecycle States**:
  - `idle`: Camera initialized, devices queried.
  - `requesting`: Awaiting browser permission.
  - `ready`: Genuine media stream verified (`videoWidth > 0`, `readyState >= 2`, `!video.paused`).
  - `capturing`: Instant frame grab from live video.
  - `analyzingQuality`: Standardization and quality heuristics running.
  - `preview`: Valid capture (`PASS` or `WARN`). "Continue to Assessment" button active (labeled "Continue Anyway" under `WARN`).
  - `qualityRejected`: Technical failure (`FAIL`). "Continue" button is hard-disabled (`aria-disabled="true"`, `disabled`), and prioritized remediation steps are displayed. "Retake Photo" is primary.
  - `permissionDenied` & `cameraUnavailable`: Trapped with clear explanatory copy and direct upload fallbacks.
* **Stream Cleanup**: Guaranteed teardown of `MediaStreamTrack`s on component unmount, navigation, and page changes.

---

## 6. Upload Fallback Equivalence

* **Limits & Rejections**: Accepts standard raster formats (`image/jpeg`, `image/png`, `image/webp`). Hard 15MB file size limit. Explicitly rejects vector SVGs (`image/svg+xml`) to prevent script execution vulnerabilities.
* **Pipeline Parity**: Uploaded files pass through the exact same standardization and quality evaluation pipeline, producing an identical `CaptureArtifact` contract with `source: 'upload'`.

---

## 7. Privacy, Security & Assessment Handoff

* **Zero External Leaks**: Pure in-browser client-side evaluation. Network interceptors verified that zero raw image payloads are transmitted over HTTP/HTTPS.
* **Zero Console Leaks**: No base64 image strings logged to the console.
* **Cross-Account Isolation**: Captured artifacts are saved in `aayurface_assessments_${userId}` in `localStorage`. Cross-account navigation tests confirmed that User B cannot view or retrieve User A's assessments or captured images.

---

## 8. Verification Results Matrix

### A. Vitest Unit & Integration Regression Suite (99 / 99 Tests Passing)
- `src/lib/capture/qualityEngine.test.ts`: 12/12 passing
- `src/pages/app/scan/ScanPage.test.tsx`: 17/17 passing
- `src/lib/assessmentStore.test.ts`: 6/6 passing
- `src/routes/authWorkflow.test.tsx`: 20/20 passing
- `src/routes/registrationBoundary.test.tsx`: 24/24 passing
- `src/pages/onboarding/OnboardingPage.test.tsx`: 7/7 passing
- `src/routes/guards.test.tsx`: 11/11 passing
- `src/components/common/Logo.test.tsx`: 2/2 passing

### B. Puppeteer Headless Google Chrome E2E Suite (19 / 19 Scenarios Passing)
| ID | Scenario Title | Status |
|---|---|---|
| E2E-01 | Authenticated user enters `/scan` | PASS |
| E2E-02 | Camera permission requesting state or quick transition | PASS |
| E2E-03 | Camera ready after genuine media readiness (1280x720 confirmed) | PASS |
| E2E-04 | Capture button captures frame and enters preview state | PASS |
| E2E-05 | Valid capture evaluates quality and enables Continue | PASS |
| E2E-06 | Retake photo discards preview and restores active ready camera | PASS |
| E2E-07 | Quality rejection on dark input strictly blocks Continue and shows prioritized guidance | PASS |
| E2E-08 | Quality rejection on blurry input flags sharpness check | PASS |
| E2E-09 | Quality rejection on low-resolution input (200x200) blocks Continue | PASS |
| E2E-10 | Upload fallback reaches quality engine, standardizes image, and permits Continue | PASS |
| E2E-11 | Leaving scan page cleanly stops MediaStream tracks and removes video element | PASS |
| E2E-12 | Public landing page has zero active camera streams | PASS |
| E2E-13 | Camera permission denial is trapped and displays clear guidance | PASS |
| E2E-14 | Hardware camera unavailability is handled with actionable upload fallback | PASS |
| E2E-15 | Assessment receives versioned `CaptureArtifact` with correct gateway and schema versions | PASS |
| E2E-16 | Mobile viewport (390x844) renders without horizontal scroll or truncated controls | PASS |
| E2E-17 | Cross-account capture artifact and assessment isolation strictly enforced | PASS |
| E2E-18 | Zero raw image payloads transmitted across network | PASS |
| E2E-19 | Zero base64 image strings logged to browser console | PASS |

### C. Visual State Audit Artifacts
All screenshots saved in [`docs/engineering/frontend/visual-audit/phase-09/`](file:///D:/Project%20Aayurface/docs/engineering/frontend/visual-audit/phase-09/):
1. `01_scan_initial.png` — Initial scan route state.
2. `02_camera_requesting.png` — Requesting camera state.
3. `03_camera_ready.png` — Live camera stream active with framing guide and corner brackets.
4. `04_capture_preview.png` — Capture photo preview state.
5. `05_quality_pass.png` — Quality verified (`PASS`) with green checkmarks and enabled "Continue to Assessment" button.
6. `06_quality_rejection.png` — Quality check rejected (`FAIL`) with disabled "Continue" button and prioritized fix steps.
7. `07_retake.png` — Active camera restored after retake.
8. `08_upload_fallback.png` — Upload fallback successfully processed and verified.
9. `09_permission_denied.png` — Clear permission denied messaging and retry/upload options.
10. `10_camera_unavailable.png` — Device camera unavailable fallback state.
11. `11_mobile_scan.png` — Mobile viewport (390x844) responsive layout.
12. `12_capture_error.png` — Corrupt image decode failure handled safely.

---

## 9. Conclusion

Phase 09 Standardized Camera Capture Gateway is **fully implemented, tested, and locked**. It enforces strict quality thresholds, non-diagnostic boundaries, zero cosmetic alterations, and client-side privacy isolation, establishing an unshakeable input contract for Phase 10 Computer Vision.
