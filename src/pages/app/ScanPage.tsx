// ============================================================
// AayurFace — Scan Skin Module
// Phase 06.7: Native Camera Engine + UI Repair
// Strict Isolated Frontend Execution
// ============================================================

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { useCamera } from './scan/useCamera';
import { CameraViewfinder } from './scan/CameraViewfinder';
import { ScanGuidancePanel } from './scan/ScanGuidancePanel';
import { useAuth } from '@/contexts/AuthContext';
import { createAssessment } from '@/lib/assessmentStore';

export default function ScanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    error,
    capturedImage,
    videoRef,
    capturePhoto,
    retakePhoto,
    uploadPhoto,
    retry
  } = useCamera({ autoStart: true });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadPhoto(file);
      } catch (err) {
        console.warn('[ScanPage] Upload file error:', err);
      }
    }
  };

  const handleContinue = () => {
    if (!capturedImage) return;
    const userId = user?.id || 'anonymous-user';
    const assessment = createAssessment(userId, capturedImage, {
      dosha: user?.dosha,
      skin_type: user?.skin_type,
    });
    navigate(`/results/${assessment.id}`);
  };

  const isReview = state === 'preview';

  return (
    <div className="relative w-full h-[100dvh] bg-background-primary text-text-primary overflow-hidden flex flex-col font-body select-none">
      {/* 1. Top Navigation Bar with 3-Step Progression */}
      <header className="h-16 px-4 sm:px-6 z-50 flex items-center justify-between border-b border-border-default bg-background-primary/95 backdrop-blur-md shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Return to Dashboard"
          className="p-2 rounded-full hover:bg-background-subtle text-text-primary transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center: Title + 3-Step Subtle Progress Indicator */}
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="font-display text-xs sm:text-sm font-semibold text-text-primary tracking-wide">
            Skin Wellness Observation
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-body tracking-wider uppercase font-semibold">
            <span className={isReview ? 'text-text-tertiary' : 'text-brand-primary border-b border-brand-primary pb-0.5'}>
              01 Capture
            </span>
            <span className="text-border-default">→</span>
            <span className={isReview ? 'text-brand-primary border-b border-brand-primary pb-0.5' : 'text-text-tertiary'}>
              02 Review
            </span>
            <span className="text-border-default">→</span>
            <span className="text-text-tertiary">
              03 Understand
            </span>
          </div>
          <span className="text-[10px] text-text-secondary hidden sm:flex items-center gap-1 font-body">
            <ShieldCheck size={11} className="text-brand-accent" />
            Client-Side Capture • Non-Diagnostic
          </span>
        </div>

        <button
          onClick={retry}
          aria-label="Restart camera"
          title="Restart camera stream"
          className="p-2 rounded-full hover:bg-background-subtle text-text-primary transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* 2. Main Body: Split View (Camera Viewfinder + Guidance Panel) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Zone 1: Camera Hero */}
        <main 
          className="w-full lg:flex-1 h-[44vh] sm:h-[48vh] lg:h-full shrink-0 lg:shrink p-3 sm:p-4 lg:p-6 bg-background-primary flex items-center justify-center min-h-0"
          aria-label="Camera Capture Area"
        >
          <div className="w-full h-full max-w-4xl max-h-[82vh] flex items-center justify-center">
            <CameraViewfinder
              state={state}
              error={error}
              capturedImage={capturedImage}
              videoRef={videoRef}
              onRetry={retry}
              onUploadClick={handleUploadClick}
            />
          </div>
        </main>

        {/* Zone 2: Guidance & Action Controls */}
        <ScanGuidancePanel
          state={state}
          onCapture={capturePhoto}
          onRetake={retakePhoto}
          onContinue={handleContinue}
          onUploadClick={handleUploadClick}
        />
      </div>

      {/* Hidden File Input for Device Photo Upload Fallback */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        aria-label="Upload photo from device input"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
