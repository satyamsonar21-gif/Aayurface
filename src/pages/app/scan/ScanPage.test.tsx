// ============================================================
// AayurFace — Scan Skin Module Unit Tests
// Phase 06.7: Comprehensive Coverage for Camera Lifecycle,
// State Machine, Error Taxonomy, Capture Truth & Strict Mode
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import * as assessmentStore from '@/lib/assessmentStore';
import ScanPage from '../ScanPage';
import { useCamera } from './useCamera';

// Helper to create a realistic mock MediaStream with tracks
function createMockStream(): MediaStream {
  const mockTrack = {
    kind: 'video',
    id: 'mock-track-' + Math.random(),
    enabled: true,
    readyState: 'live',
    stop: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as MediaStreamTrack;

  return {
    id: 'mock-stream-' + Math.random(),
    active: true,
    getTracks: () => [mockTrack],
    getVideoTracks: () => [mockTrack],
    getAudioTracks: () => [],
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
  } as unknown as MediaStream;
}

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/cv/cvReadinessEngine', async () => {
  const actual = await vi.importActual<any>('@/lib/cv/cvReadinessEngine');
  return {
    ...actual,
    evaluateArtifactFaceReadiness: vi.fn().mockImplementation((artifact: any) => Promise.resolve({
      schemaVersion: 'cv-schema-v1',
      artifactId: artifact?.id || 'mock-artifact-id',
      provider: 'mock-deterministic',
      providerVersion: '1.0.0',
      modelVersion: '1.0.0',
      analyzedAt: new Date().toISOString(),
      faceDetection: {
        status: 'SINGLE_FACE',
        faceCount: 1,
        confidence: 0.98,
        allFaces: []
      },
      primaryFace: {
        confidence: 0.98,
        boundingBox: { x: 300, y: 150, width: 400, height: 500 },
        quality: {
          luminanceMean: 120,
          luminanceMedian: 120,
          clippingRatio: 0.01,
          sharpnessScore: 45
        },
        framing: {
          faceAreaRatio: 0.25,
          faceCentroid: { x: 0.5, y: 0.5 },
          touchesBoundary: false,
          horizontalOffsetRatio: 0.02,
          verticalOffsetRatio: 0.02
        },
        pose: { yaw: 2, pitch: 1, roll: 0 },
        occlusion: { mouthCovered: false, eyesCovered: false }
      },
      faceQuality: {
        luminanceMean: 120,
        luminanceMedian: 120,
        clippingRatio: 0.01,
        sharpnessScore: 45
      },
      pose: { yaw: 2, pitch: 1, roll: 0 },
      occlusion: { mouthCovered: false, eyesCovered: false },
      framing: {
        faceAreaRatio: 0.25,
        faceCentroid: { x: 0.5, y: 0.5 },
        touchesBoundary: false,
        horizontalOffsetRatio: 0.02,
        verticalOffsetRatio: 0.02
      },
      readiness: {
        status: 'READY',
        reasons: [],
        warnings: [],
        actionableGuidance: [],
        ruleVersion: 'v1-heuristic'
      }
    })),
    evaluateLiveVideoFaceReadiness: vi.fn().mockResolvedValue({
      faceCount: 1,
      isReady: true,
      guidanceText: 'Position your face inside the guide',
      status: 'READY'
    })
  };
});

describe('Phase 06.7: Scan Skin Engine & Camera Lifecycle Tests', () => {
  let originalMediaDevices: MediaDevices | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalMediaDevices = navigator.mediaDevices;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      writable: true,
      configurable: true,
    });
  });

  // -------------------------------------------------------------
  // 1. MediaDevices Availability
  // -------------------------------------------------------------
  it('handles environment where navigator.mediaDevices is undefined gracefully', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: true }));

    await act(async () => {
      // Let effects run
    });

    expect(result.current.state).toBe('cameraUnavailable');
    expect(result.current.error?.message).toContain("Camera access isn't available");
    expect(result.current.error?.rawErrorName).toBe('MediaDevicesUnavailable');
  });

  // -------------------------------------------------------------
  // 2. getUserMedia Success & Stream Binding
  // -------------------------------------------------------------
  it('successfully requests camera with ideal 1280x720 and binds stream', async () => {
    const mockStream = createMockStream();
    const getUserMediaMock = vi.fn().mockResolvedValue(mockStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    // Mock video element ref
    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);

    (result.current.videoRef as any).current = mockVideo;

    await act(async () => {
      await result.current.startCamera();
    });

    expect(getUserMediaMock).toHaveBeenCalledWith({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    expect(mockVideo.srcObject).toBe(mockStream);
    expect(result.current.state).toBe('ready');
  });

  // -------------------------------------------------------------
  // 3. Permission Denied (NotAllowedError)
  // -------------------------------------------------------------
  it('distinguishes NotAllowedError and transitions to permissionDenied state', async () => {
    const notAllowedError = new Error('Permission denied');
    notAllowedError.name = 'NotAllowedError';
    const getUserMediaMock = vi.fn().mockRejectedValue(notAllowedError);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.state).toBe('permissionDenied');
    expect(result.current.error?.type).toBe('permissionDenied');
    expect(result.current.error?.message).toContain('Camera access is blocked');
  });

  // -------------------------------------------------------------
  // 4. No Camera Found (NotFoundError)
  // -------------------------------------------------------------
  it('distinguishes NotFoundError and transitions to cameraUnavailable state', async () => {
    const notFoundError = new Error('No device found');
    notFoundError.name = 'NotFoundError';
    const getUserMediaMock = vi.fn().mockRejectedValue(notFoundError);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.state).toBe('cameraUnavailable');
    expect(result.current.error?.message).toContain('No usable camera was found');
  });

  // -------------------------------------------------------------
  // 5. Camera Busy (NotReadableError)
  // -------------------------------------------------------------
  it('distinguishes NotReadableError as camera in use by another application', async () => {
    const notReadableError = new Error('Device busy');
    notReadableError.name = 'NotReadableError';
    const getUserMediaMock = vi.fn().mockRejectedValue(notReadableError);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.state).toBe('cameraUnavailable');
    expect(result.current.error?.message).toContain('currently being used by another application');
  });

  // -------------------------------------------------------------
  // 6. Overconstrained Fallback
  // -------------------------------------------------------------
  it('falls back to generic video constraints if OverconstrainedError is thrown', async () => {
    const overconstrainedErr = new Error('Constraint not satisfied');
    overconstrainedErr.name = 'OverconstrainedError';

    const fallbackStream = createMockStream();
    const getUserMediaMock = vi.fn()
      .mockRejectedValueOnce(overconstrainedErr)
      .mockResolvedValueOnce(fallbackStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 640, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 480, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);
    (result.current.videoRef as any).current = mockVideo;

    await act(async () => {
      await result.current.startCamera();
    });

    expect(getUserMediaMock).toHaveBeenCalledTimes(2);
    expect(getUserMediaMock).toHaveBeenLastCalledWith({ video: true, audio: false });
    expect(result.current.state).toBe('ready');
  });

  // -------------------------------------------------------------
  // 7. Capture Validation & Canvas Draw Truth
  // -------------------------------------------------------------
  it('validates video readiness, captures frame to canvas, and transitions to preview', async () => {
    const mockStream = createMockStream();
    const getUserMediaMock = vi.fn().mockResolvedValue(mockStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);
    (result.current.videoRef as any).current = mockVideo;

    // Mock HTMLCanvasElement.getContext and toDataURL
    const mockDrawImage = vi.fn();
    const mockToDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,realCapturedFrameData');

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: mockDrawImage,
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(mockToDataURL);

    await act(async () => {
      await result.current.startCamera();
    });

    let dataUrl: string | null = null;
    await act(async () => {
      dataUrl = await result.current.capturePhoto();
    });

    expect(mockDrawImage).toHaveBeenCalledWith(mockVideo, 0, 0, 1280, 720);
    expect(dataUrl).toBe('data:image/jpeg;base64,realCapturedFrameData');
    expect(result.current.state).toBe('preview');
    expect(result.current.capturedImage).toBe(dataUrl);
  });

  // -------------------------------------------------------------
  // 8. Capture Rejection when Video Not Ready
  // -------------------------------------------------------------
  it('rejects capture and sets captureError when video is not ready', async () => {
    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 1, writable: true }); // HAVE_METADATA only
    Object.defineProperty(mockVideo, 'videoWidth', { value: 0, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 0, writable: true });
    (result.current.videoRef as any).current = mockVideo;

    let res: string | null = null;
    await act(async () => {
      res = await result.current.capturePhoto();
    });

    expect(res).toBeNull();
    expect(result.current.state).toBe('captureError');
    expect(result.current.error?.message).toContain('Camera video is not ready');
  });

  // -------------------------------------------------------------
  // 9. Retake Restores Ready State
  // -------------------------------------------------------------
  it('retake restores live camera stream and returns to ready state', async () => {
    const mockStream = createMockStream();
    const getUserMediaMock = vi.fn().mockResolvedValue(mockStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);
    (result.current.videoRef as any).current = mockVideo;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,frame');

    await act(async () => {
      await result.current.startCamera();
    });

    await act(async () => {
      await result.current.capturePhoto();
    });
    expect(result.current.state).toBe('preview');

    act(() => {
      result.current.retakePhoto();
    });

    expect(result.current.state).toBe('ready');
    expect(result.current.capturedImage).toBeNull();
  });

  // -------------------------------------------------------------
  // 10. Stream Cleanup on Unmount
  // -------------------------------------------------------------
  it('stops all tracks and clears srcObject on unmount', async () => {
    const mockStream = createMockStream();
    const getUserMediaMock = vi.fn().mockResolvedValue(mockStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result, unmount } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    (result.current.videoRef as any).current = mockVideo;

    await act(async () => {
      await result.current.startCamera();
    });

    const tracks = mockStream.getTracks();

    act(() => {
      unmount();
    });

    tracks.forEach((track) => {
      expect(track.stop).toHaveBeenCalled();
    });
    expect(mockVideo.srcObject).toBeNull();
  });

  // -------------------------------------------------------------
  // 11. Stale Stream After Unmount (Mandatory Correction 1)
  // -------------------------------------------------------------
  it('stops tracks immediately if getUserMedia resolves AFTER unmount and does not bind stream', async () => {
    let resolveGetUserMedia: (stream: MediaStream) => void;
    const pendingPromise = new Promise<MediaStream>((resolve) => {
      resolveGetUserMedia = resolve;
    });

    const getUserMediaMock = vi.fn().mockReturnValue(pendingPromise);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: getUserMediaMock },
      writable: true,
      configurable: true,
    });

    const { result, unmount } = renderHook(() => useCamera({ autoStart: true }));
    const mockVideo = document.createElement('video');
    (result.current.videoRef as any).current = mockVideo;

    // Unmount while getUserMedia is still pending!
    act(() => {
      unmount();
    });

    // Now getUserMedia resolves with a stale stream
    const staleStream = createMockStream();
    const staleTrack = staleStream.getTracks()[0];

    await act(async () => {
      resolveGetUserMedia!(staleStream);
    });

    // Mandatory Correction 1 checks:
    // Stale stream must have its tracks stopped immediately
    expect(staleTrack.stop).toHaveBeenCalled();
    // Must not be attached to the video element
    expect(mockVideo.srcObject).not.toBe(staleStream);
  });

  // -------------------------------------------------------------
  // 12. Full Component Integration & Navigation
  // -------------------------------------------------------------
  it('renders ScanPage with truthful framing guidance and navigates on continue', async () => {
    const mockStream = createMockStream();
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <ScanPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText('Skin Wellness Observation')).toBeInTheDocument();
    expect(screen.getByText('Facial Observation Guide')).toBeInTheDocument();
    expect(screen.getByLabelText('Capture photo for skin wellness assessment')).toBeInTheDocument();
    expect(screen.getByText(/Position your face inside the guide/i)).toBeInTheDocument();

    // Verify truth status: No fake face detection claims
    expect(screen.queryByText('Face detected')).not.toBeInTheDocument();
    expect(screen.queryByText('Aligned')).not.toBeInTheDocument();
    expect(screen.queryByText('Dosha detected')).not.toBeInTheDocument();
  });

  // -------------------------------------------------------------
  // 13. Phase 09: CaptureArtifact Emission & Standardization
  // -------------------------------------------------------------
  it('emits a valid versioned CaptureArtifact conforming to canonical contract', async () => {
    const mockStream = createMockStream();
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);
    (result.current.videoRef as any).current = mockVideo;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,standardizedImageData');

    await act(async () => {
      await result.current.startCamera();
    });

    let dataUrl: string | null = null;
    await act(async () => {
      dataUrl = await result.current.capturePhoto();
    });

    expect(dataUrl).toBe('data:image/jpeg;base64,standardizedImageData');
    expect(result.current.artifact).not.toBeNull();
    expect(result.current.artifact?.schemaVersion).toBe('capture-schema-v1');
    expect(result.current.artifact?.gatewayVersion).toBe('gateway-v1');
    expect(result.current.artifact?.source).toBe('camera');
    expect(result.current.artifact?.captureMode).toBe('manual');
    expect(result.current.artifact?.mimeType).toBe('image/jpeg');
    expect(result.current.artifact?.standardizedWidth).toBe(1280);
    expect(result.current.artifact?.standardizedHeight).toBe(720);
    expect(result.current.quality).not.toBeNull();
    expect(result.current.quality?.ruleVersion).toBe('v1-heuristic');
  });

  // -------------------------------------------------------------
  // 14. Phase 09: File Upload Fallback Security - Prohibit SVG
  // -------------------------------------------------------------
  it('strictly rejects malicious SVG upload for security protection', async () => {
    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const svgFile = new File(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'], 'exploit.svg', {
      type: 'image/svg+xml'
    });

    await act(async () => {
      try {
        await result.current.uploadPhoto(svgFile);
      } catch {
        // expected rejection
      }
    });

    expect(result.current.state).toBe('captureError');
    expect(result.current.error?.message).toContain('SVG files are prohibited');
  });

  // -------------------------------------------------------------
  // 15. Phase 09: File Upload Fallback Security - Reject > 15MB
  // -------------------------------------------------------------
  it('rejects oversized files exceeding 15 MB limit', async () => {
    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const hugeFile = new File([new Uint8Array(16 * 1024 * 1024)], 'giant.jpg', {
      type: 'image/jpeg'
    });

    await act(async () => {
      try {
        await result.current.uploadPhoto(hugeFile);
      } catch {
        // expected rejection
      }
    });

    expect(result.current.state).toBe('captureError');
    expect(result.current.error?.message).toContain('exceeds 15 MB limit');
  });

  // -------------------------------------------------------------
  // 16. Phase 09: File Upload Fallback Security - Prohibit Non-Images
  // -------------------------------------------------------------
  it('rejects non-image files such as executables or pdfs', async () => {
    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const pdfFile = new File(['%PDF-1.4'], 'document.pdf', {
      type: 'application/pdf'
    });

    await act(async () => {
      try {
        await result.current.uploadPhoto(pdfFile);
      } catch {
        // expected rejection
      }
    });

    expect(result.current.state).toBe('captureError');
  });

  // -------------------------------------------------------------
  // 17. Phase 09: Assessment Store Receives CaptureArtifact
  // -------------------------------------------------------------
  it('persists CaptureArtifact into assessment when continue is executed', () => {
    const mockArtifact: import('@/types/capture').CaptureArtifact = {
      id: 'test-artifact-123',
      source: 'camera',
      image: 'data:image/jpeg;base64,cleanImage',
      originalWidth: 1280,
      originalHeight: 720,
      standardizedWidth: 1280,
      standardizedHeight: 720,
      mimeType: 'image/jpeg',
      capturedAt: new Date().toISOString(),
      captureMode: 'manual',
      quality: {
        status: 'PASS',
        checks: [],
        prioritizedGuidance: [],
        evaluatedAt: new Date().toISOString(),
        ruleVersion: 'v1-heuristic'
      },
      schemaVersion: 'capture-schema-v1',
      gatewayVersion: 'gateway-v1'
    };

    const assessment = assessmentStore.createAssessment(
      'user-test-456',
      mockArtifact.image,
      { dosha: 'pitta', skin_type: 'combination' },
      mockArtifact
    );

    expect(assessment.captureArtifact).toBeDefined();
    expect(assessment.captureArtifact?.id).toBe('test-artifact-123');
    expect(assessment.captureArtifact?.gatewayVersion).toBe('gateway-v1');
    expect(assessment.captureArtifact?.quality.status).toBe('PASS');
  });

  // -------------------------------------------------------------
  // 18. Phase 10: Face Readiness REJECTED Transitions to qualityRejected
  // -------------------------------------------------------------
  it('transitions state to qualityRejected when face CV readiness fails', async () => {
    const cvEngine = await import('@/lib/cv/cvReadinessEngine');
    vi.mocked(cvEngine.evaluateArtifactFaceReadiness).mockResolvedValueOnce({
      schemaVersion: 'cv-schema-v1',
      artifactId: 'artifact-fail-face',
      provider: 'mock-deterministic',
      providerVersion: '1.0.0',
      modelVersion: '1.0.0',
      analyzedAt: new Date().toISOString(),
      faceDetection: {
        status: 'NO_FACE',
        faceCount: 0,
        confidence: null,
        allFaces: []
      },
      primaryFace: null,
      faceQuality: null,
      pose: null,
      occlusion: null,
      framing: null,
      readiness: {
        status: 'REJECTED',
        reasons: [
          {
            code: 'NO_FACE',
            severity: 'REJECT',
            message: 'No face detected in the captured image.',
            actionableGuidance: 'Position your face clearly inside the framing guide.'
          }
        ],
        warnings: [],
        actionableGuidance: ['Position your face clearly inside the framing guide.'],
        ruleVersion: 'face-readiness-v1-heuristic'
      }
    });

    const mockStream = createMockStream();
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCamera({ autoStart: false }));

    const mockVideo = document.createElement('video');
    Object.defineProperty(mockVideo, 'readyState', { value: 4, writable: true });
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280, writable: true });
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720, writable: true });
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    Object.defineProperty(mockVideo, 'ended', { value: false, writable: true });
    mockVideo.play = vi.fn().mockResolvedValue(undefined);
    (result.current.videoRef as any).current = mockVideo;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,frameWithoutFace');

    await act(async () => {
      await result.current.startCamera();
    });

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(result.current.state).toBe('qualityRejected');
    expect(result.current.cvResult).not.toBeNull();
    expect(result.current.cvResult?.readiness.status).toBe('REJECTED');
    expect(result.current.error?.message).toContain('No face detected');
  });

  // -------------------------------------------------------------
  // 19. Phase 10: Assessment Store Receives CVResult
  // -------------------------------------------------------------
  it('persists CVResult into assessment store alongside CaptureArtifact', () => {
    const mockArtifact: import('@/types/capture').CaptureArtifact = {
      id: 'test-artifact-cv',
      source: 'camera',
      image: 'data:image/jpeg;base64,cleanImage',
      originalWidth: 1280,
      originalHeight: 720,
      standardizedWidth: 1280,
      standardizedHeight: 720,
      mimeType: 'image/jpeg',
      capturedAt: new Date().toISOString(),
      captureMode: 'manual',
      quality: {
        status: 'PASS',
        checks: [],
        prioritizedGuidance: [],
        evaluatedAt: new Date().toISOString(),
        ruleVersion: 'v1-heuristic'
      },
      schemaVersion: 'capture-schema-v1',
      gatewayVersion: 'gateway-v1'
    };

    const mockCVResult: import('@/types/cv').CVResult = {
      schemaVersion: 'cv-schema-v1',
      artifactId: 'test-artifact-cv',
      provider: 'deterministic-raster',
      providerVersion: '1.0.0',
      modelVersion: '1.0.0',
      analyzedAt: new Date().toISOString(),
      faceDetection: {
        status: 'SINGLE_FACE',
        faceCount: 1,
        confidence: 0.96,
        allFaces: []
      },
      primaryFace: {
        id: 'mock-face-1',
        confidence: 0.96,
        boundingBox: { x: 320, y: 160, width: 380, height: 480 },
        normalizedBoundingBox: { x: 320 / 1280, y: 160 / 720, width: 380 / 1280, height: 480 / 720 },
        areaRatio: 0.22,
        center: { x: 0.5, y: 0.5 }
      },
      faceQuality: {
        meanLuminance: 115,
        medianLuminance: 115,
        shadowClippingRatio: 0.01,
        highlightClippingRatio: 0.01,
        sharpnessVariance: 38,
        localContrast: 25,
        status: 'PASS',
        confidence: 0.95
      },
      framing: {
        status: 'CENTERED',
        areaRatio: 0.22,
        centerOffsetDistance: 0.02,
        confidence: 0.95
      },
      pose: { yaw: 2, pitch: 0, roll: 0, status: 'ACCEPTABLE', confidence: 0.95 },
      occlusion: { status: 'CLEAR', confidence: 0.95 },
      readiness: {
        status: 'READY',
        reasons: [],
        warnings: [],
        actionableGuidance: [],
        ruleVersion: 'face-readiness-v1-heuristic'
      }
    };

    const assessment = assessmentStore.createAssessment(
      'user-cv-user',
      mockArtifact.image,
      { dosha: 'kapha', skin_type: 'oily' },
      mockArtifact,
      mockCVResult
    );

    expect(assessment.cvResult).toBeDefined();
    expect(assessment.cvResult?.artifactId).toBe('test-artifact-cv');
    expect(assessment.cvResult?.readiness.status).toBe('READY');
    expect(assessment.cvResult?.faceDetection.faceCount).toBe(1);
  });
});

