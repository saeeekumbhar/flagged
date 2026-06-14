import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../hooks';
import { SoundService } from '../../services/SoundService';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const { settings } = useSettings();

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-[#F4F1EC] flex flex-col pointer-events-auto overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-[#F4F1EC]/90 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-[#CFBB99]">
        <button 
          onClick={() => { 
            if(settings.buttonSounds) SoundService.playBoop(); 
            onBack(); 
          }} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-[#CFBB99] text-[#4C3D19] active:scale-95 transition-transform"
        >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
           </svg>
        </button>
        <h1 className="text-xl font-bold text-[#1A2315] font-display">Privacy Policy</h1>
      </div>

      <div className="p-6 pb-24 text-[#4C3D19] font-sans text-sm leading-relaxed space-y-6">
        
        <section>
          <h2 className="text-lg font-display font-bold text-[#1A2315] mb-2">1. Information We Collect</h2>
          <p>
            When you use the FLAGGED app, we collect basic information to provide you with a personalized experience. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Authentication Data:</strong> Your name and email address via Google Sign-In.</li>
            <li><strong>Usage Logs:</strong> Your daily choices regarding transport, food, energy, and shopping to calculate your environmental impact.</li>
            <li><strong>Device Information:</strong> General device data to send push notifications (only if you explicitly enable them).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-[#1A2315] mb-2">2. How We Use Your Data</h2>
          <p>
            We use your data strictly to operate the app and provide its core gamification features. Specifically, we use it to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Calculate your daily carbon footprint and Flag Score.</li>
            <li>Generate personalized, AI-powered "Aura" and "Vibe" insights.</li>
            <li>Sync your progress across devices using Firebase.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-[#1A2315] mb-2">3. Data Sharing and AI</h2>
          <p>
            We do not sell your personal data to third parties. However, to generate personalized insights, an anonymized summary of your daily choices is securely sent to Google's Gemini AI. No personally identifiable information (PII) like your name or email is sent to the AI.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-[#1A2315] mb-2">4. Data Deletion</h2>
          <p>
            You have full control over your data. You can permanently delete your account and all associated logging data at any time using the "Delete Account" button in the Settings menu.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-[#1A2315] mb-2">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how your data is handled, please contact us at: <a href="mailto:saeeekumbhar@gmail.com" className="font-bold underline text-[#354024]">saeeekumbhar@gmail.com</a>
          </p>
        </section>
        
        <p className="text-xs opacity-70 italic pt-4 border-t border-[#CFBB99]">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
