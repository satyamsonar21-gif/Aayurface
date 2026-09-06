// ============================================================
// AayurFace — Custom Browser Camera Engine
// Phase 06.7: useCamera Hook
// Strict Isolated Execution with Full Lifecycle & Cleanup
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CameraState, CameraErrorDetails } from './types';

export interface UseCameraOptions {
  autoStart?: boolean;
}

export interface UseCameraReturn {
  state: CameraState;
  error: CameraErrorDetails | null;
  capturedImage: string | null;
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

    // Mandatory Correction 6: Evidence that camera is ready
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

    // Mandatory Correction 2: Check MediaDevices availability
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
          // NotFoundError, NotAllowedError, etc. are passed directly to outer error taxonomy
          throw firstErr;
        }
      }

      // Mandatory Correction 1: Strict Mode + Stale Stream Protection
      if (!isMountedRef.current || activeRequestIdRef.current !== requestId) {
        // Component unmounted or another request was triggered while getUserMedia was resolving
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      streamRef.current = stream;

      stream.getVideoTracks().forEach(track => {
        track.onended = () => {
          console.log('[Camera Engine] Track onended fired! track.id:', track.id, 'readyState:', track.readyState);
        };
      });

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
      // Mandatory Correction 1: Stale check on error branch too
      if (!isMountedRef.current || activeRequestIdRef.current !== requestId) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      const errorName = err instanceof Error ? err.name : String(err);
      console.warn('[Camera Engine] Access failure:', errorName, err);

      // Mandatory Correction 9: Error Taxonomy
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

  // Capture frame from active video
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

    // Mandatory Correction 7: Verify real video readiness before capture
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
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not obtain 2D canvas rendering context.');
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setCapturedImage(dataUrl);
      setState('preview');
      setError(null);
      return dataUrl;
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

  // File upload fallback (Mandatory Correction 4)
  const uploadPhoto = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        const msg = 'Please select a valid image file (JPEG, PNG, WEBP).';
        setError({
          type: 'captureError',
          message: msg
        });
        reject(new Error(msg));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCapturedImage(result);
          setState('preview');
          setError(null);
          resolve(result);
        } else {
          const msg = 'Failed to read the selected image.';
          setError({ type: 'captureError', message: msg });
          reject(new Error(msg));
        }
      };
      reader.onerror = () => {
        const msg = 'Error reading the uploaded file.';
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
    videoRef,
    startCamera,
    stopCamera: stopStream,
    capturePhoto,
    retakePhoto,
    uploadPhoto,
    retry: startCamera
  };
}
