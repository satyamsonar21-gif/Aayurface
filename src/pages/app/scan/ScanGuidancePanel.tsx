// ============================================================
// AayurFace — Scan Guidance Panel Component
// Phase 06.7: Guidance Steps, Real-Time Status, Controls
// Luxury Editorial Ayurvedic Wellness Aesthetic
// ============================================================

import React from 'react';
import type { CameraState } from './types';
import { 
  Camera, 
  RotateCcw, 
  ArrowRight, 
  Upload, 
  SunMedium, 
  Sparkles, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

interface ScanGuidancePanelProps {
  state: CameraState;
  onCapture: () => void;
  onRetake: () => void;
  onContinue: () => void;
  onUploadClick: () => void;
}

export const ScanGuidancePanel: React.FC<ScanGuidancePanelProps> = ({
  state,
  onCapture,
  onRetake,
  onContinue,
  onUploadClick
}) => {
  const isPreview = state === 'preview';
  const isReady = state === 'ready';
  const isCapturing = state === 'capturing';

  return (
    <aside 
      className="w-full lg:w-[360px] xl:w-[400px] bg-[#FAF8F5] border-t lg:border-t-0 lg:border-l border-[#E6DFD5] flex flex-col justify-between p-4 sm:p-5 lg:p-6 shrink-0 select-none overflow-y-auto"
      aria-label="Capture guidance and actions"
    >
      <div className="space-y-4">
        {/* 1. Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider font-body">
            PREMIUM WELLNESS CAPTURE
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1F1C]">
            {isPreview ? 'Review Your Capture' : 'Facial Observation Guide'}
          </h2>
          <p className="text-xs text-[#5C6660] leading-relaxed font-body">
            {isPreview 
              ? 'Ensure your face is clearly visible with even lighting before continuing.'
              : 'Position your face inside the guide to capture a clear frame for assessment.'
            }
          </p>
        </div>

        {/* 2. Real-time Status Card */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E6DFD5] shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span 
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isReady 
                  ? 'bg-emerald-500' 
                  : isPreview 
                    ? 'bg-[#C5A059]' 
                    : state === 'requesting' || isCapturing
                      ? 'bg-[#C5A059] animate-pulse'
                      : 'bg-amber-400'
              }`} 
            />
            <h3 className="font-display text-sm sm:text-base font-semibold text-[#1A1F1C]">
              {isReady && 'Camera Ready'}
              {state === 'requesting' && 'Requesting Camera Access…'}
              {isCapturing && 'Capturing Frame…'}
              {isPreview && 'Frame Ready for Review'}
              {state === 'permissionDenied' && 'Camera Permission Blocked'}
              {state === 'cameraUnavailable' && 'Camera Unavailable'}
              {state === 'captureError' && 'Capture Failed'}
              {state === 'idle' && 'Initializing…'}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-[#5C6660] leading-normal font-body">
            {isReady && 'Live video is steady. Press Capture Photo when ready.'}
            {state === 'requesting' && 'Waiting for browser camera authorization.'}
            {isCapturing && 'Reading optical surface data from live video feed…'}
            {isPreview && 'Inspect your photo. You can retake if needed or proceed.'}
            {state === 'permissionDenied' && 'Camera permission is required to stream live video.'}
            {state === 'cameraUnavailable' && 'No live video feed available on this device.'}
            {state === 'captureError' && 'Unable to acquire video frame. Please try again.'}
            {state === 'idle' && 'Preparing media devices…'}
          </p>
        </div>

        {/* 3. Primary Controls (Unified, responsive, ergonomic placement) */}
        <div className="space-y-2.5 pt-1">
          {!isPreview ? (
            <>
              <button
                onClick={onCapture}
                disabled={!isReady || isCapturing}
                aria-label="Capture photo for skin wellness assessment"
                className={`w-full py-3.5 px-4 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isReady && !isCapturing
                    ? 'bg-[#1E3A2F] text-white hover:bg-[#152B23] border border-[#C5A059]/40 active:scale-[0.99]'
                    : 'bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed'
                }`}
              >
                <Camera className="w-4 h-4 text-[#C5A059]" />
                {isCapturing ? 'Capturing…' : 'Capture Photo'}
              </button>

              <button
                onClick={onUploadClick}
                aria-label="Upload photo from device"
                className="w-full py-1.5 text-xs font-body font-medium text-[#5C6660] hover:text-[#1A1F1C] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Or upload photo from device
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onContinue}
                aria-label="Continue to skin wellness assessment"
                className="w-full py-3.5 px-4 rounded-lg font-body font-semibold text-sm bg-[#1E3A2F] text-white hover:bg-[#152B23] border border-[#C5A059]/40 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-[0.99]"
              >
                <span>Continue to Assessment</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={onRetake}
                aria-label="Retake photo"
                className="w-full py-2.5 px-4 rounded-lg font-body font-medium text-xs bg-white text-[#1A1F1C] hover:bg-[#F3EFEA] border border-[#E6DFD5] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5C6660]" />
                <span>Retake Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Guidance Protocol / Checklist */}
        {!isPreview ? (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#8A948E] font-body">
              Observation Protocol
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/70 border border-[#E6DFD5]/60">
                <Maximize2 size={14} className="text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#1A1F1C]">Center Facial Alignment</p>
                  <p className="text-[11px] text-[#5C6660]">Position eyes and chin naturally inside the guide.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/70 border border-[#E6DFD5]/60">
                <SunMedium size={14} className="text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#1A1F1C]">Soft, Diffused Lighting</p>
                  <p className="text-[11px] text-[#5C6660]">Face toward natural light. Avoid harsh backlights.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/70 border border-[#E6DFD5]/60">
                <Sparkles size={14} className="text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#1A1F1C]">Natural, Relaxed Expression</p>
                  <p className="text-[11px] text-[#5C6660]">Keep face uncovered and hold still.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#8A948E] font-body">
              Capture Quality Checklist
            </h4>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#1A1F1C] bg-white p-2 rounded-lg border border-[#E6DFD5]">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Facial features framed and visible</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1F1C] bg-white p-2 rounded-lg border border-[#E6DFD5]">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Captured frame stored in memory</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1F1C] bg-white p-2 rounded-lg border border-[#E6DFD5]">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Ready for Ayurvedic assessment</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Safety & Privacy Notice at bottom */}
      <div className="p-2.5 rounded-lg bg-[#F3EFEA] border border-[#E6DFD5] text-[11px] text-[#5C6660] leading-relaxed space-y-0.5 mt-4">
        <div className="flex items-center gap-1.5 font-semibold text-[#1E3A2F]">
          <ShieldCheck size={12} className="text-[#C5A059]" />
          <span>Wellness Guidance, Not Medical Diagnosis</span>
        </div>
        <p>
          Camera access is used solely for client-side capture during this assessment flow.
        </p>
      </div>
    </aside>
  );
};
