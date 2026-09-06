// ============================================================
// AayurFace — Camera Viewfinder Component
// Phase 06.7: Native Video Element, Framing Guide & Preview
// Luxury Editorial Ayurvedic Wellness Aesthetic
// ============================================================

import React from 'react';
import type { CameraState, CameraErrorDetails } from './types';
import { AlertCircle, ShieldAlert, RefreshCw, Upload } from 'lucide-react';

interface CameraViewfinderProps {
  state: CameraState;
  error: CameraErrorDetails | null;
  capturedImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onRetry: () => void;
  onUploadClick: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  state,
  error,
  capturedImage,
  videoRef,
  onRetry,
  onUploadClick
}) => {
  const isErrorState = state === 'permissionDenied' || state === 'cameraUnavailable';
  const isPreviewState = state === 'preview' && !!capturedImage;

  return (
    <div 
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full bg-[#151D19] rounded-2xl overflow-hidden border border-[#E6DFD5] shadow-sm flex items-center justify-center select-none"
      aria-label="Camera viewfinder"
    >
      {/* 1. Live Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        aria-hidden={isPreviewState || isErrorState}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isPreviewState || isErrorState ? 'opacity-0 pointer-events-none absolute' : 'opacity-95'
        }`}
      />

      {/* Subtle Vignette Overlay to soften edges */}
      {!isPreviewState && !isErrorState && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(21, 29, 25, 0.6) 100%)'
          }}
        />
      )}

      {/* 2. Captured Image Preview */}
      {isPreviewState && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#151D19]">
          <img
            src={capturedImage}
            alt="Captured facial wellness frame"
            className="w-full h-full object-cover"
          />
          {/* Subtle Review Badge */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            <span className="text-xs font-medium text-white/90 font-body">Captured Frame</span>
          </div>
        </div>
      )}

      {/* 3. Visual Framing Guide (When live & ready or requesting) */}
      {!isPreviewState && !isErrorState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 sm:p-6 z-10">
          <div 
            className={`w-[220px] sm:w-[260px] lg:w-[280px] xl:w-[320px] h-[290px] sm:h-[340px] lg:h-[380px] rounded-[140px] border-2 border-dashed transition-all duration-500 relative flex items-center justify-center ${
              state === 'ready' 
                ? 'border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.2)]' 
                : 'border-[#6B8E7D]/50 animate-pulse'
            }`}
          >
            {/* 4 Antique Gold Corner Alignment Brackets */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C5A059]" />
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C5A059]" />
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C5A059]" />
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C5A059]" />

            {/* Subtle Horizon / Alignment Center Point */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
          </div>

          {/* Floating Guidance Badge (Truthful framing guidance only) */}
          <div className="mt-4">
            <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80 font-body flex items-center gap-2">
              <span 
                className={`w-2 h-2 rounded-full ${
                  state === 'ready' ? 'bg-emerald-400' : 'bg-[#C5A059] animate-pulse'
                }`} 
              />
              {state === 'ready' ? 'Position your face inside the guide' : 'Connecting to camera…'}
            </span>
          </div>
        </div>
      )}

      {/* 4. Error State Displays */}
      {state === 'permissionDenied' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-[#151D19] text-white">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2">
            Camera Permission Required
          </h3>
          <p className="text-sm text-white/70 max-w-sm mb-6 leading-relaxed font-body">
            {error?.message || 'Camera access is blocked. Allow camera permission in your browser settings and try again.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#1E3A2F] text-white text-sm font-medium hover:bg-[#152B23] border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onUploadClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Photo Instead
            </button>
          </div>
        </div>
      )}

      {state === 'cameraUnavailable' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-[#151D19] text-white">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2">
            Camera Unavailable
          </h3>
          <p className="text-sm text-white/70 max-w-sm mb-6 leading-relaxed font-body">
            {error?.message || 'No usable camera was found or access was restricted.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#1E3A2F] text-white text-sm font-medium hover:bg-[#152B23] border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onUploadClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Photo Instead
            </button>
          </div>
        </div>
      )}

      {/* 5. Requesting State Overlay */}
      {state === 'requesting' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#151D19]/80 backdrop-blur-sm text-white p-6 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin mb-4" />
          <p className="text-sm font-medium font-body text-white/90">
            Requesting camera access…
          </p>
          <p className="text-xs text-white/60 font-body mt-1 max-w-xs">
            Please approve the browser prompt to start your facial observation.
          </p>
        </div>
      )}

      {/* 6. Capture Error Overlay */}
      {state === 'captureError' && (
        <div className="absolute bottom-4 inset-x-4 z-30 p-3 rounded-lg bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs font-body flex items-center justify-between">
          <span>{error?.message || 'Capture failed. Please try again.'}</span>
          <button
            onClick={onRetry}
            className="underline font-semibold ml-2 hover:text-white cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
