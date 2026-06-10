import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';

interface CheckInProps {
  onComplete: (scoreAdjustment: number, greenFlag: string, redFlag: string) => void;
  onCancel: () => void;
}

const questions = [
  { id: 'q1', text: "Ordered delivery this week?", flags: { yes: { score: -5, flag: "Ordering Out" }, no: { score: 5, flag: "Cooked/Mess" } } },
  { id: 'q2', text: "Skipped classes to sleep in with AC on?", flags: { yes: { score: -10, flag: "AC Goblin" }, no: { score: 5, flag: "Eco Student" } } },
  { id: 'q3', text: "Used public transport or walked?", flags: { yes: { score: 10, flag: "Public Transit" }, no: { score: -5, flag: "Solo Rider" } } },
];

export function CheckIn({ onComplete, onCancel }: CheckInProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scoreAdjustment, setScoreAdjustment] = useState(0);
  const [biggestGreen, setBiggestGreen] = useState<string>("None");
  const [biggestRed, setBiggestRed] = useState<string>("None");

  const handleAnswer = (answer: 'yes' | 'no') => {
    const q = questions[currentQ];
    const result = q.flags[answer];
    
    setScoreAdjustment(prev => prev + result.score);
    
    if (result.score > 0) setBiggestGreen(result.flag);
    if (result.score < 0) setBiggestRed(result.flag);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      onComplete(scoreAdjustment + result.score, biggestGreen !== "None" ? biggestGreen : result.flag, biggestRed !== "None" ? biggestRed : result.flag);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black/80 fixed inset-0 z-50 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <PixelCard className="py-10">
              <div className="flex justify-between items-center mb-6">
                 <span className="font-pixel text-sm text-[#52B788]">Q {currentQ + 1}/{questions.length}</span>
                 <button onClick={onCancel} className="text-white/50 hover:text-white font-pixel transition-colors">X</button>
              </div>
              <h2 className="font-sans font-black text-2xl mb-8 leading-relaxed text-center text-[#FEFAE0] underline decoration-[#52B788] decoration-4 underline-offset-8">{questions[currentQ].text}</h2>
              <div className="grid grid-cols-2 gap-4">
                <PixelButton variant="secondary" onClick={() => handleAnswer('no')}>No</PixelButton>
                <PixelButton variant="primary" onClick={() => handleAnswer('yes')}>Yeah</PixelButton>
              </div>
            </PixelCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
