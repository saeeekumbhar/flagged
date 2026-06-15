import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { UserProfile, DailyLog } from '../types';
import { ShareProgressCard } from './ShareProgressCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  logs: Record<string, DailyLog>;
  aura?: { title: string; description: string };
}

export function ShareModal({ isOpen, onClose, profile, logs, aura }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(null);
      setIsGenerating(true);
      setError(null);
      
      // Slight delay to allow fonts and DOM to render fully
      const timer = setTimeout(() => {
        if (cardRef.current) {
          toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
              setPreviewUrl(dataUrl);
              setIsGenerating(false);
            })
            .catch((err) => {
              console.error('Error generating image', err);
              setError("Couldn't create card. Try again.");
              setIsGenerating(false);
            });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!previewUrl) return;
    
    try {
      // Convert base64 to blob
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const file = new File([blob], 'FLAGGED-green-journey.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My FLAGGED Journey 🌱',
          text: 'Turned my sustainability journey into a story on FLAGGED! Check out my vibe check.',
        });
      } else {
        // Fallback to download if Web Share API is unsupported
        handleDownload();
      }
    } catch (e) {
      console.error('Sharing failed', e);
      // Fallback
      handleDownload();
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = 'FLAGGED-green-journey.png';
    link.href = previewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Hidden Card for Rendering */}
          <div className="absolute left-[-9999px] top-[-9999px]">
             <ShareProgressCard ref={cardRef} profile={profile} logs={logs} aura={aura} />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-[#F4F1EC] rounded-[32px] p-5 relative z-10 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="font-display font-bold text-[#1A2315] text-xl">Your FLAGGED Journey</h3>
              <button aria-label="Close Modal" onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#1A2315] active:scale-95 transition-transform">
                ✕
              </button>
            </div>

            <div className="bg-[#EAE4DF] rounded-2xl aspect-[9/16] w-full relative overflow-hidden flex items-center justify-center mb-5 border border-[#CFBB99]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-[#889063] border-t-transparent animate-spin" />
                  <p className="text-sm font-bold text-[#354024] animate-pulse">Creating your Green Card...</p>
                </div>
              ) : error ? (
                <div className="text-sm font-bold text-[#A03030]">{error}</div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleShare}
                disabled={isGenerating || !!error}
                className="w-full bg-[#354024] text-white py-3.5 rounded-[16px] font-bold text-[15px] shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share
              </button>
              
              <button 
                onClick={handleDownload}
                disabled={isGenerating || !!error}
                className="w-full bg-white text-[#1A2315] border border-[#CFBB99] py-3.5 rounded-[16px] font-bold text-[15px] shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Image
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
