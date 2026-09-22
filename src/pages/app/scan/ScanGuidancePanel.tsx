// ============================================================
// AayurFace — Scan Guidance Panel Component
// Phase 09: Dynamic Quality Feedback, Gating Controls & Actionable Guidance
// Luxury Editorial Ayurvedic Wellness Aesthetic
// ============================================================

import React from 'react';
import type { CameraState, CaptureQualityResult, CVResult } from './types';
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
  cvResult?: CVResult | null;
  liveGuidance?: string | null;
  liveFaceCount?: number;
  isLiveFaceReady?: boolean;
  onCapture: () => void;
  onRetake: () => void;
  onContinue: () => void;
  onUploadClick: () => void;
}

export const ScanGuidancePanel: React.FC<ScanGuidancePanelProps> = ({
  state,
  quality,
  cvResult,
  liveGuidance,
  liveFaceCount = 0,
  isLiveFaceReady = false,
  onCapture,
  onRetake,
  onContinue,
  onUploadClick
}) => {
  const isFaceRejected = cvResult?.readiness.status === 'REJECTED';
  const isQualityRejected = state === 'qualityRejected' || quality?.status === 'FAIL';
  const isRejected = isQualityRejected || isFaceRejected;

  const isFaceWarn = cvResult?.readiness.status === 'WARNING';
  const isQualityWarn = quality?.status === 'WARN';
  const isWarn = !isRejected && (isFaceWarn || isQualityWarn);

  const isPass = (state === 'preview' || !!quality || !!cvResult) && !isRejected && !isWarn;
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
              ? isFaceRejected
                ? 'Face Readiness Needs Correction'
                : 'Capture Needs Improvement'
              : isPreview 
                ? 'Review Your Capture' 
                : 'Facial Observation Guide'
            }
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed font-body">
            {isRejected
              ? isFaceRejected
                ? cvResult?.readiness.reasons[0]?.message || 'Face positioning, illumination, or clarity needs attention before continuing.'
                : 'One or more technical quality checks failed. Please review the guidance below and retake the photo.'
              : isWarn
                ? 'Lighting or focus is slightly below ideal parameters. You may proceed or retake for higher precision.'
                : isPass
                  ? 'Capture meets both technical and face readiness requirements. Inspect your photo before continuing.'
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
                      : isReady && isLiveFaceReady
                        ? 'bg-emerald-500' 
                        : isReady && liveFaceCount > 1
                          ? 'bg-rose-500 animate-pulse'
                          : isReady
                            ? 'bg-[#C5A059]'
                            : isCapturing
                              ? 'bg-brand-accent animate-pulse'
                              : 'bg-amber-400'
              }`} 
            />
            <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
              {isRejected && (isFaceRejected ? `Face Check: ${cvResult?.readiness.reasons[0]?.message || 'Needs Improvement'}` : 'Quality Check Rejected')}
              {isWarn && (isFaceWarn ? `Face Notice: ${cvResult?.readiness.reasons[0]?.message || 'Below Target'}` : 'Quality Notice (Review Recommended)')}
              {isPass && 'Quality & Face Verified (Pass)'}
              {isReady && !isPreview && (
                liveFaceCount > 1
                  ? 'Multiple Faces Detected'
                  : isLiveFaceReady
                    ? 'Face Centered & Ready'
                    : 'Camera Ready'
              )}
              {state === 'requesting' && 'Requesting Camera Access…'}
              {state === 'capturing' && 'Capturing Frame…'}
              {state === 'analyzingQuality' && 'Evaluating Image & Face Quality…'}
              {state === 'preview' && !quality && !cvResult && 'Frame Ready for Review'}
              {state === 'permissionDenied' && 'Camera Permission Blocked'}
              {state === 'cameraUnavailable' && 'Camera Unavailable'}
              {state === 'captureError' && !isRejected && 'Capture Failed'}
              {state === 'idle' && 'Initializing…'}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-text-secondary leading-normal font-body">
            {isRejected && (isFaceRejected 
              ? 'Face-aware computer vision checks determined this frame is not suitable for assessment. Please retake.' 
              : 'Technical quality is below the required baseline. Please retake following the prioritized steps below.')}
            {isWarn && 'Sub-optimal lighting or resolution detected, but the face is identifiable. You may proceed.'}
            {isPass && 'Optimal exposure, resolution, sharpness, and facial alignment verified.'}
            {isReady && !isPreview && (liveGuidance || 'Live video is steady. Press Capture Photo when ready.')}
            {state === 'requesting' && 'Waiting for browser camera authorization.'}
            {state === 'capturing' && 'Reading optical surface data from live video feed…'}
            {state === 'analyzingQuality' && 'Measuring facial ROI luminance balance and edge sharpness…'}
            {state === 'preview' && !quality && !cvResult && 'Inspect your photo. You can retake if needed or proceed.'}
            {state === 'permissionDenied' && 'Camera permission is required to stream live video.'}
            {state === 'cameraUnavailable' && 'No live video feed available on this device.'}
            {state === 'captureError' && !isRejected && 'Unable to acquire video frame. Please try again.'}
            {state === 'idle' && 'Preparing media devices…'}
          </p>
        </div>

        {/* 3. Primary Controls (Gated by Quality & Face Readiness) */}
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
                aria-label="Continue to skin wellness assessment (disabled due to quality or face check failure)"
                className="w-full py-3 px-4 rounded-lg font-body font-medium text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-2 cursor-not-allowed min-h-[44px]"
              >
                <span>{isFaceRejected ? 'Continue to Assessment (Face Check Required)' : 'Continue to Assessment (Quality Required)'}</span>
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
            {/* Prioritized Steps to Fix */}
            {((cvResult?.readiness.actionableGuidance && cvResult.readiness.actionableGuidance.length > 0) || (quality?.prioritizedGuidance && quality.prioritizedGuidance.length > 0)) && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200 font-body flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Prioritized Steps to Fix
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-text-secondary font-body">
                  {(cvResult?.readiness.actionableGuidance && cvResult.readiness.actionableGuidance.length > 0
                    ? cvResult.readiness.actionableGuidance
                    : quality?.prioritizedGuidance || []
                  ).map((step: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Face-Aware Readiness Breakdown */}
            {cvResult && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
                  Face Readiness Checks
                </h4>
                <div className="space-y-1.5">
                  {/* Face Count */}
                  <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                    cvResult.faceDetection.faceCount === 1 
                      ? 'bg-background-surface border-border-default text-text-primary' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                  }`}>
                    {cvResult.faceDetection.faceCount === 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">Face Count: </span>
                      <span className="text-text-secondary">
                        {cvResult.faceDetection.faceCount === 1 
                          ? '1 face detected' 
                          : cvResult.faceDetection.faceCount === 0 
                            ? 'No face detected in guide' 
                            : `${cvResult.faceDetection.faceCount} faces detected (single subject required)`}
                      </span>
                    </div>
                  </div>

                  {/* Face Lighting (mean luminance) */}
                  {cvResult.faceQuality && (
                    <>
                      <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                        cvResult.faceQuality.meanLuminance >= 40 && cvResult.faceQuality.meanLuminance <= 220
                          ? 'bg-background-surface border-border-default text-text-primary'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                      }`}>
                        {cvResult.faceQuality.meanLuminance >= 40 && cvResult.faceQuality.meanLuminance <= 220 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold">Face Lighting: </span>
                          <span className="text-text-secondary">
                            {cvResult.faceQuality.meanLuminance < 40 
                              ? 'Face is too dark. Increase forward lighting.' 
                              : cvResult.faceQuality.meanLuminance > 220 
                                ? 'Face is overexposed. Reduce harsh light.' 
                                : 'Facial illumination is balanced.'}
                          </span>
                        </div>
                      </div>

                      {/* Face Sharpness */}
                      {(() => {
                        const score = cvResult.faceQuality.sharpnessScore ?? Math.round(cvResult.faceQuality.sharpnessVariance * 5);
                        const isSharpPass = score >= 50 && cvResult.faceQuality.sharpnessVariance >= 1.2;
                        const isSharpWarn = score >= 30 && score < 50;
                        return (
                          <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                            isSharpPass
                              ? 'bg-background-surface border-border-default text-text-primary'
                              : isSharpWarn
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                          }`}>
                            {isSharpPass ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : isSharpWarn ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-semibold">Face Sharpness: </span>
                              <span className="text-text-secondary">
                                {isSharpPass
                                  ? `Facial details are clear and focused (sharpness: ${score}/100).`
                                  : isSharpWarn
                                    ? `Face has subtle softness (sharpness: ${score}/100). Retake recommended for higher precision.`
                                    : `Face details are not clear enough (sharpness: ${score}/100). Hold steady and refocus.`}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* Face Framing */}
                  {cvResult.framing && (
                    <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                      cvResult.framing.status !== 'BORDER_CUTOFF' && cvResult.framing.areaRatio >= 0.08
                        ? 'bg-background-surface border-border-default text-text-primary'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                    }`}>
                      {cvResult.framing.status !== 'BORDER_CUTOFF' && cvResult.framing.areaRatio >= 0.08 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold">Facial Framing: </span>
                        <span className="text-text-secondary">
                          {cvResult.framing.status === 'BORDER_CUTOFF' 
                            ? 'Face is cut off at the edge of the frame.' 
                            : cvResult.framing.areaRatio < 0.08 
                              ? 'Face is too far away. Move closer to the camera.' 
                              : 'Face is centered and properly proportioned.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Global Image Quality Checks */}
            {quality && quality.checks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
                  Image Quality Checks
                </h4>
                <div className="space-y-1.5">
                  {quality.checks.map((check) => (
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
            )}
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary font-body">
              Evaluated Quality & Face Breakdown
            </h4>

            <div className="space-y-1.5">
              {cvResult && cvResult.faceDetection.faceCount === 1 && (
                <div className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-medium">Single Face Detected: </span>
                    <span className="text-text-secondary">Face centered and ready for assessment</span>
                  </div>
                </div>
              )}
              {cvResult?.primaryFace && (
                <div className="flex items-center gap-2 text-xs text-text-primary bg-background-surface p-2.5 rounded-lg border border-border-default">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-medium">Facial Lighting & Sharpness: </span>
                    <span className="text-text-secondary">Clear facial contours and balanced exposure</span>
                  </div>
                </div>
              )}
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
          <span>Wellness Guidance, Not Medical Advice</span>
        </div>
        <p>
          Camera access is used solely for client-side capture during this assessment flow.
        </p>
      </div>
    </aside>
  );
};
