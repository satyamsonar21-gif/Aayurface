// ============================================================
// AayurFace — Scan Guidance Panel Component
// Phase 09: Dynamic Quality Feedback, Gating Controls & Actionable Guidance
// Luxury Editorial Ayurvedic Wellness Aesthetic
// ============================================================

import React from 'react';
import type { CameraState, CaptureQualityResult } from './types';
import { 
  Camera, 
  RotateCcw, 
  ArrowRight, 
  Upload, 
  SunMedium, 
  Sparkles, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface ScanGuidancePanelProps {
  state: CameraState;
  quality?: CaptureQualityResult | null;
  onCapture: () => void;
  onRetake: () => void;
  onContinue: () => void;
  onUploadClick: () => void;
}

export const ScanGuidancePanel: React.FC<ScanGuidancePanelProps> = ({
  state,
  quality,
  onCapture,
  onRetake,
  onContinue,
  onUploadClick
}) => {
  const isRejected = state === 'qualityRejected' || quality?.status === 'FAIL';
  const isWarn = state === 'preview' && quality?.status === 'WARN';
  const isPass = state === 'preview' && quality?.status === 'PASS';
  const isPreview = state === 'preview' || isRejected;
  const isReady = state === 'ready';
  const isCapturing = state === 'capturing' || state === 'analyzingQuality';

  return (
    <aside 
      className="w-full lg:w-[360px] xl:w-[400px] bg-background-primary border-t lg:border-t-0 lg:border-l border-border-default flex flex-col justify-between p-4 sm:p-5 lg:p-6 shrink-0 select-none overflow-y-auto"
      aria-label="Capture guidance and actions"
    >
      <div className="space-y-4">
        {/* 1. Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-wider font-body">
            PREMIUM WELLNESS CAPTURE
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-text-primary">
            {isRejected
              ? 'Capture Needs Improvement'
              : isPreview 
                ? 'Review Your Capture' 
                : 'Facial Observation Guide'
            }
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed font-body">
            {isRejected
              ? 'One or more technical quality checks failed. Please review the guidance below and retake the photo.'
              : isWarn
                ? 'Lighting or focus is slightly below ideal parameters. You may proceed or retake for higher precision.'
                : isPass
                  ? 'Capture meets technical quality requirements. Inspect your photo before continuing.'
                  : 'Position your face inside the guide to capture a clear frame for assessment.'
            }
          </p>
        </div>

        {/* 2. Real-time Status Card */}
        <div className={`p-3.5 rounded-xl border shadow-xs space-y-2 ${
          isRejected 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200' 
            : isWarn 
              ? 'bg-amber-500/10 border-amber-500/30' 
              : 'bg-background-surface border-border-default'
        }`}>
          <div className="flex items-center gap-2">
            <span 
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isRejected
                  ? 'bg-rose-500'
                  : isWarn
                    ? 'bg-amber-400'
                    : isPass
                      ? 'bg-emerald-500'
                      : isReady 
                        ? 'bg-emerald-500' 
                        : isCapturing
                          ? 'bg-brand-accent animate-pulse'
                          : 'bg-amber-400'
              }`} 
            />
            <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
              {isRejected && 'Quality Check Rejected'}
              {isWarn && 'Quality Notice (Review Recommended)'}
              {isPass && 'Quality Verified (Pass)'}
              {isReady && !isPreview && 'Camera Ready'}
              {state === 'requesting' && 'Requesting Camera Access…'}
              {state === 'capturing' && 'Capturing Frame…'}
              {state === 'analyzingQuality' && 'Evaluating Image Quality…'}
              {state === 'preview' && !quality && 'Frame Ready for Review'}
              {state === 'permissionDenied' && 'Camera Permission Blocked'}
              {state === 'cameraUnavailable' && 'Camera Unavailable'}
              {state === 'captureError' && !isRejected && 'Capture Failed'}
              {state === 'idle' && 'Initializing…'}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-text-secondary leading-normal font-body">
            {isRejected && 'Technical quality is below the required baseline. Please retake following the prioritized steps below.'}
            {isWarn && 'Sub-optimal lighting or resolution detected, but the image is decodable. You may proceed.'}
            {isPass && 'Optimal exposure, resolution, and sharpness verified.'}
            {isReady && !isPreview && 'Live video is steady. Press Capture Photo when ready.'}
            {state === 'requesting' && 'Waiting for browser camera authorization.'}
            {state === 'capturing' && 'Reading optical surface data from live video feed…'}
            {state === 'analyzingQuality' && 'Measuring pixel luminance balance and edge sharpness…'}
            {state === 'preview' && !quality && 'Inspect your photo. You can retake if needed or proceed.'}
            {state === 'permissionDenied' && 'Camera permission is required to stream live video.'}
            {state === 'cameraUnavailable' && 'No live video feed available on this device.'}
            {state === 'captureError' && !isRejected && 'Unable to acquire video frame. Please try again.'}
            {state === 'idle' && 'Preparing media devices…'}
          </p>
        </div>

        {/* 3. Primary Controls (Gated by Quality Status) */}
        <div className="space-y-2.5 pt-1">
          {!isPreview ? (
            <>
              <button
                onClick={onCapture}
                disabled={!isReady || isCapturing}
                aria-label="Capture photo for skin wellness assessment"
                className={`w-full py-3.5 px-4 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer min-h-[44px] ${
                  isReady && !isCapturing
                    ? 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover border border-brand-accent/40 active:scale-[0.99]'
                    : 'bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed'
                }`}
              >
                <Camera className="w-4 h-4 text-brand-accent" />
                {state === 'capturing' ? 'Capturing…' : state === 'analyzingQuality' ? 'Analyzing…' : 'Capture Photo'}
              </button>

              <button
                onClick={onUploadClick}
                aria-label="Upload photo from device"
                className="w-full py-2.5 text-xs font-body font-medium text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
              >
                <Upload className="w-3.5 h-3.5" />
                Or upload photo from device
              </button>
            </>
          ) : isRejected ? (
            <div className="space-y-2">
              <button
                onClick={onRetake}
                aria-label="Retake photo"
                className="w-full py-3.5 px-4 rounded-lg font-body font-semibold text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover border border-brand-accent/40 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-[0.99] min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-brand-accent" />
                <span>Retake Photo</span>
              </button>

              <button
                disabled
                aria-disabled="true"
                aria-label="Continue to skin wellness assessment (disabled due to quality failure)"
                className="w-full py-3 px-4 rounded-lg font-body font-medium text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-2 cursor-not-allowed min-h-[44px]"
              >
                <span>Continue to Assessment (Quality Required)</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onContinue}
                aria-label="Continue to skin wellness assessment"
                className="w-full py-3.5 px-4 rounded-lg font-body font-semibold text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover border border-brand-accent/40 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-[0.99] min-h-[44px]"
              >
                <span>{isWarn ? 'Continue Anyway' : 'Continue to Assessment'}</span>
                <ArrowRight className="w-4 h-4 text-brand-accent" />
              </button>

              <button
                onClick={onRetake}
                aria-label="Retake photo"
                className="w-full py-2.5 px-4 rounded-lg font-body font-medium text-xs bg-background-surface text-text-primary hover:bg-background-subtle border border-border-default flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
                <span>Retake Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Guidance Protocol or Evaluated Quality Checklist */}
        {!isPreview ? (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
              Observation Protocol
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background-surface/80 border border-border-default/80">
                <Maximize2 size={14} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-text-primary">Center Facial Alignment</p>
                  <p className="text-[11px] text-text-secondary">Position eyes and chin naturally inside the guide.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background-surface/80 border border-border-default/80">
                <SunMedium size={14} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-text-primary">Soft, Diffused Lighting</p>
                  <p className="text-[11px] text-text-secondary">Face toward natural light. Avoid harsh backlights.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background-surface/80 border border-border-default/80">
                <Sparkles size={14} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-text-primary">Natural, Relaxed Expression</p>
                  <p className="text-[11px] text-text-secondary">Keep face uncovered and hold still.</p>
                </div>
              </div>
            </div>
          </div>
        ) : isRejected ? (
          <div className="space-y-3 pt-1">
            {/* Prioritized Guidance List */}
            {quality && quality.prioritizedGuidance.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200 font-body flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Prioritized Steps to Fix
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-text-secondary font-body">
                  {quality.prioritizedGuidance.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Individual Quality Checks */}
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
              Quality Checks Breakdown
            </h4>
            <div className="space-y-1.5">
              {quality?.checks.map((check) => (
                <div 
                  key={check.id}
                  className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                    check.status === 'FAIL'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                      : check.status === 'WARN'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
                        : 'bg-background-surface border-border-default text-text-primary'
                  }`}
                >
                  {check.status === 'FAIL' ? (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : check.status === 'WARN' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold">{check.name}: </span>
                    <span className="text-text-secondary">{check.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
              Evaluated Quality Breakdown
            </h4>

            <div className="space-y-1.5">
              {quality?.checks ? (
                quality.checks.map((check) => (
                  <div key={check.id} className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                    {check.status === 'WARN' ? (
                      <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-medium">{check.name}: </span>
                      <span className="text-text-secondary">{check.message}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Facial features framed and visible</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Captured frame stored in memory</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Ready for Ayurvedic assessment</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. Safety & Privacy Notice at bottom */}
      <div className="p-3 rounded-lg bg-background-subtle border border-border-default text-[11px] text-text-secondary leading-relaxed space-y-0.5 mt-4">
        <div className="flex items-center gap-1.5 font-semibold text-brand-primary">
          <ShieldCheck size={12} className="text-brand-accent" />
          <span>Wellness Guidance, Not Medical Diagnosis</span>
        </div>
        <p>
          Camera access is used solely for client-side capture during this assessment flow.
        </p>
      </div>
    </aside>
  );
};
