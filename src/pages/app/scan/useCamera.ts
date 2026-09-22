// ============================================================
// AayurFace — Custom Browser Camera Engine
// Phase 09: Standardized Camera Capture Gateway Hook
// Strict Isolated Execution with Full Lifecycle & Cleanup
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import type {
  CameraState,
  CameraErrorDetails,
  CaptureArtifact,
  CaptureQualityResult
} from '@/types/capture';
import { standardizeCanvas, createCaptureArtifact } from '@/lib/capture/standardization';
import { evaluateRasterQuality } from '@/lib/capture/qualityEngine';

export interface UseCameraOptions {
  autoStart?: boolean;
}

export interface UseCameraReturn {
  state: CameraState;
  error: CameraErrorDetails | null;
  capturedImage: string | null;
  artifact: CaptureArtifact | null;
  quality: CaptureQualityResult | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  retakePhoto: () => void;
  uploadPhoto: (file: File) => Promise<string>;
  retry: () => Promise<void>;
}

export function useCamera(options: UseCameraOptions = { autoStart: true }): UseCameraReturn {
  const [state, setState] = useState<CameraState>('idle');
  const [error, setError] = useState<CameraErrorDetails | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [artifact, setArtifact] = useState<CaptureArtifact | null>(null);
  const [quality, setQuality] = useState<CaptureQualityResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeRequestIdRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Helper to cleanly terminate any active stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore already stopped tracks
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Check whether video element is genuinely ready and playing
  const checkReadiness = useCallback((stream: MediaStream, requestId: number) => {
    if (!isMountedRef.current || activeRequestIdRef.current !== requestId) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Genuine Readiness: Stream attached + non-zero dimensions + readyState >= 2 + playing
    const isStreamAttached = video.srcObject === stream;
    const hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
    const hasData = video.readyState >= 2; // HTMLMediaElement.HAVE_CURRENT_DATA or higher
    const isPlaying = !video.paused && !video.ended;

    if (isStreamAttached && hasDimensions && hasData && isPlaying) {
      setState('ready');
      setError(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    const requestId = ++activeRequestIdRef.current;
    stopStream();
    setError(null);
    setCapturedImage(null);
    setArtifact(null);
    setQuality(null);

    // Check MediaDevices availability
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      if (isMountedRef.current && activeRequestIdRef.current === requestId) {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: "Camera access isn't available in this browser or environment.",
          suggestedAction: 'Please upload a photo instead or use a modern supported browser over HTTPS.',
          rawErrorName: 'MediaDevicesUnavailable'
        });
      }
      return;
    }

    if (isMountedRef.current && activeRequestIdRef.current === requestId) {
      setState('requesting');
    }

    let stream: MediaStream | null = null;

    try {
      // Primary constraint: 720p / 1280x720 ideal, front-facing user camera
      const primaryConstraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
      } catch (firstErr) {
        const errorName = firstErr instanceof Error ? firstErr.name : String(firstErr);
        // Fallback on OverconstrainedError (devices that do not support front-facing constraint or 1280x720)
        if (
          errorName === 'OverconstrainedError' ||
          errorName === 'ConstraintNotSatisfiedError'
        ) {
          console.warn(`[Camera Engine] Constraint failed (${errorName}), falling back to generic video constraint.`);
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw firstErr;
        }
      }

      // Strict Mode + Stale Stream Protection
      if (!isMountedRef.current || activeRequestIdRef.current !== requestId) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;

        // Listen for video metadata, canplay, and playing events
        const onLoaded = () => checkReadiness(stream!, requestId);
        const onCanPlay = () => {
          video.play()?.catch((playErr) => {
            console.warn('[Camera Engine] Autoplay interrupted:', playErr);
          });
          checkReadiness(stream!, requestId);
        };
        const onPlaying = () => checkReadiness(stream!, requestId);

        video.addEventListener('loadedmetadata', onLoaded, { once: true });
        video.addEventListener('canplay', onCanPlay, { once: true });
        video.addEventListener('playing', onPlaying);

        // Attempt play safely
        video.play()?.catch((playErr) => {
          console.warn('[Camera Engine] Play promise note:', playErr);
        });

        // Immediate check in case properties are already satisfied
        checkReadiness(stream!, requestId);

        // Backup timers in case events fired synchronously before listener attachment
        setTimeout(() => {
          checkReadiness(stream!, requestId);
        }, 150);
        setTimeout(() => {
          checkReadiness(stream!, requestId);
        }, 400);
      }
    } catch (err: unknown) {
      if (!isMountedRef.current || activeRequestIdRef.current !== requestId) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      const errorName = err instanceof Error ? err.name : String(err);
      console.warn('[Camera Engine] Access failure:', errorName, err);

      // Error Taxonomy Mapping
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        setState('permissionDenied');
        setError({
          type: 'permissionDenied',
          message: 'Camera access is blocked. Allow camera permission in your browser settings and try again.',
          suggestedAction: 'Click the camera icon in your browser address bar to allow access, then click Try Again.',
          rawErrorName: errorName
        });
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: 'No usable camera was found on this device.',
          suggestedAction: 'Please connect a camera or upload a clear skin photo from your files.',
          rawErrorName: errorName
        });
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: 'The camera is currently being used by another application.',
          suggestedAction: 'Close other applications or browser tabs that might be using your webcam, then try again.',
          rawErrorName: errorName
        });
      } else if (errorName === 'SecurityError') {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: 'Camera access is restricted due to browser security policies.',
          suggestedAction: 'Ensure this page is loaded securely (HTTPS or localhost).',
          rawErrorName: errorName
        });
      } else if (errorName === 'AbortError') {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: 'Camera initialization was interrupted. Please try again.',
          suggestedAction: 'Click Try Again to restart camera connection.',
          rawErrorName: errorName
        });
      } else {
        setState('cameraUnavailable');
        setError({
          type: 'cameraUnavailable',
          message: 'Unable to start live camera feed.',
          suggestedAction: 'Please refresh the page or upload a photo instead.',
          rawErrorName: errorName
        });
      }
    }
  }, [stopStream, checkReadiness]);

  // Capture frame from active video, execute standardization & quality gate
  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) {
      setState('captureError');
      setError({
        type: 'captureError',
        message: "We couldn't capture the image. Video element not found."
      });
      return null;
    }

    // Verify real video readiness before capture
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      setState('captureError');
      setError({
        type: 'captureError',
        message: "We couldn't capture the image. Camera video is not ready yet."
      });
      return null;
    }

    setState('capturing');

    try {
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = video.videoWidth;
      rawCanvas.height = video.videoHeight;
      const rawCtx = rawCanvas.getContext('2d');
      if (!rawCtx) {
        throw new Error('Could not obtain 2D canvas rendering context.');
      }

      rawCtx.drawImage(video, 0, 0, rawCanvas.width, rawCanvas.height);

      // 1. Run Pure Standardization Pipeline
      const standardized = standardizeCanvas(rawCanvas);

      // 2. Run Pure Image Quality Engine
      const { result: qualityResult } = evaluateRasterQuality(rawCanvas);

      // 3. Build Canonical Capture Artifact
      const newArtifact = createCaptureArtifact({
        source: 'camera',
        captureMode: 'manual',
        standardized,
        quality: qualityResult
      });

      setCapturedImage(newArtifact.image);
      setArtifact(newArtifact);
      setQuality(qualityResult);

      if (qualityResult.status === 'FAIL') {
        setState('qualityRejected');
        setError({
          type: 'captureError',
          message: qualityResult.checks.find((c) => c.status === 'FAIL')?.message || 'Captured image quality is below the required threshold.'
        });
      } else {
        setState('preview');
        setError(null);
      }

      return newArtifact.image;
    } catch (captureErr) {
      console.error('[Camera Engine] Frame capture failed:', captureErr);
      setState('captureError');
      setError({
        type: 'captureError',
        message: "We couldn't capture the image. Please try again."
      });
      return null;
    }
  }, []);

  // Retake photo: discard captured frame and restore ready camera
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setArtifact(null);
    setQuality(null);
    setError(null);

    const video = videoRef.current;
    const stream = streamRef.current;

    if (stream) {
      if (video) {
        if (video.srcObject !== stream) {
          video.srcObject = stream;
        }
        video.play()?.catch(() => {});
      }
      setState('ready');
    } else {
      startCamera();
    }
  }, [startCamera]);

  // File upload fallback with full validation & identical standardization/quality pipeline
  const uploadPhoto = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Security Check: Reject SVG explicitly
      if (
        file.type === 'image/svg+xml' ||
        file.name.toLowerCase().endsWith('.svg')
      ) {
        const msg = 'SVG files are prohibited for security reasons. Please select a JPEG, PNG, or WebP photo.';
        setState('captureError');
        setError({ type: 'captureError', message: msg });
        reject(new Error(msg));
        return;
      }

      // Security Check: Strict MIME whitelist
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.type)) {
        const msg = 'Please select a valid image file (JPEG, PNG, or WebP).';
        setState('captureError');
        setError({ type: 'captureError', message: msg });
        reject(new Error(msg));
        return;
      }

      // Security Check: Maximum 15 MB
      const maxSizeBytes = 15 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const msg = 'File size exceeds 15 MB limit. Please upload a smaller image file.';
        setState('captureError');
        setError({ type: 'captureError', message: msg });
        reject(new Error(msg));
        return;
      }

      setState('capturing');

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        if (!rawDataUrl) {
          const msg = 'Failed to read the selected image.';
          setState('captureError');
          setError({ type: 'captureError', message: msg });
          reject(new Error(msg));
          return;
        }

        // Decode raster in Image object to verify raster decodability
        const img = new Image();
        img.onload = () => {
          try {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;

            if (width <= 0 || height <= 0) {
              throw new Error('Image decoded with invalid dimensions.');
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Could not obtain canvas context for uploaded image.');
            }
            ctx.drawImage(img, 0, 0);

            // Run exact same standardization pipeline
            const standardized = standardizeCanvas(canvas);

            // Run exact same quality engine
            const { result: qualityResult } = evaluateRasterQuality(canvas);

            // Emit versioned CaptureArtifact
            const newArtifact = createCaptureArtifact({
              source: 'upload',
              captureMode: 'upload',
              standardized,
              quality: qualityResult
            });

            setCapturedImage(newArtifact.image);
            setArtifact(newArtifact);
            setQuality(qualityResult);

            if (qualityResult.status === 'FAIL') {
              setState('qualityRejected');
              setError({
                type: 'captureError',
                message: qualityResult.checks.find((c) => c.status === 'FAIL')?.message || 'Uploaded image quality is below the required threshold.'
              });
            } else {
              setState('preview');
              setError(null);
            }

            resolve(newArtifact.image);
          } catch (decodeErr) {
            const msg = decodeErr instanceof Error ? decodeErr.message : 'Error decoding uploaded image raster.';
            setState('captureError');
            setError({ type: 'captureError', message: msg });
            reject(new Error(msg));
          }
        };

        img.onerror = () => {
          const msg = 'Corrupt or unreadable image file. Please upload a valid photo.';
          setState('captureError');
          setError({ type: 'captureError', message: msg });
          reject(new Error(msg));
        };

        img.src = rawDataUrl;
      };

      reader.onerror = () => {
        const msg = 'Error reading the uploaded file.';
        setState('captureError');
        setError({ type: 'captureError', message: msg });
        reject(new Error(msg));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  // Lifecycle effect: autoStart on mount, cleanup on unmount
  useEffect(() => {
    const mountRef = isMountedRef;
    const reqRef = activeRequestIdRef;
    mountRef.current = true;

    if (options.autoStart) {
      startCamera();
    }

    return () => {
      mountRef.current = false;
      reqRef.current++; // Invalidate in-flight getUserMedia
      stopStream();
    };
  }, [options.autoStart, startCamera, stopStream]);

  return {
    state,
    error,
    capturedImage,
    artifact,
    quality,
    videoRef,
    startCamera,
    stopCamera: stopStream,
    capturePhoto,
    retakePhoto,
    uploadPhoto,
    retry: startCamera
  };
}
