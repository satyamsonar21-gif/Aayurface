import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ShimmerCard from '@/components/common/ShimmerCard';

type ScanStatus = 'idle' | 'camera' | 'processing' | 'error';

export default function ScanPage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ScanStatus>('camera');

  const handleCapture = useCallback(() => {
    setStatus('processing');
    setTimeout(() => {
      navigate('/results/demo-scan');
    }, 3000);
  }, [navigate]);

  const onUserMediaError = () => {
    setStatus('error');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleCapture();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status === 'camera' && (
          <motion.div 
            key="camera-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              onUserMediaError={onUserMediaError}
              className="w-full h-full object-cover"
            />
            
            {/* Guide Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-dashed border-herbal/80 shadow-[0_0_20px_rgba(76,175,80,0.3)] animate-breathe relative">
                <div className="absolute inset-0 rounded-full box-shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
              </div>
              <div className="mt-8 flex flex-col gap-2 items-center">
                <span className="bg-black/60 backdrop-blur-md text-white text-sm py-1.5 px-4 rounded-pill">
                  Position your face in the circle
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white text-sm py-1.5 px-4 rounded-pill">
                  Ensure good lighting
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-50">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleCapture}
                className="w-[72px] h-[72px] bg-herbal rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg"
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.button>
              
              <button 
                onClick={handleUploadClick}
                className="text-white/80 text-sm flex items-center gap-2 hover:text-white transition-colors py-2 px-4 bg-black/40 rounded-pill backdrop-blur-md"
              >
                <ImageIcon className="w-4 h-4" />
                Or upload a photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            key="error-view"
            className="flex-1 flex flex-col items-center justify-center bg-cream px-6 text-center"
          >
            <AlertCircle className="w-16 h-16 text-turmeric mb-4" />
            <h2 className="font-playfair text-xl text-charcoal mb-2">Camera access is needed</h2>
            <p className="text-charcoal-light mb-8">Please enable camera access in your browser settings to scan your skin.</p>
            <button 
              onClick={() => setStatus('camera')}
              className="bg-herbal text-white py-3 px-8 rounded-button mb-4 w-full max-w-xs"
            >
              Enable Camera
            </button>
            <button 
              onClick={handleUploadClick}
              className="border border-herbal text-herbal py-3 px-8 rounded-button w-full max-w-xs"
            >
              Upload instead
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div 
            key="processing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cream/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center px-6"
          >
            <LoadingSpinner size="lg" className="mb-6 text-herbal" />
            <h2 className="font-playfair text-xl text-charcoal mb-8 animate-pulse">Analyzing your skin naturally...</h2>
            <div className="w-full max-w-sm space-y-4">
              <ShimmerCard className="h-24 w-full" />
              <ShimmerCard className="h-24 w-full" />
              <ShimmerCard className="h-24 w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
